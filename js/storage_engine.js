// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — MOTOR DE PERSISTENCIA DETERMINISTA EN SILICIO
// Almacenamiento Estructurado Asíncrono: IndexedDB + Fallback Resiliente
// Gobernanza: Timonel F2 | Cero Volatilidad de Datos | NASA JPL Spec
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  'use strict';

  const DB_NAME = 'AtelierMatematicoDB';
  const DB_VERSION = 1;

  const STORES = {
    ASTRO: 'astrophotography',
    DISCOVERY: 'discovery_ledger',
    CLASSROOM: 'classroom_notes',
    ACQUISITIONS: 'acquisition_orders'
  };

  let dbPromise = null;
  let isIndexedDBAvailable = false;

  // Memoria volátil de respaldo para entornos sin IndexedDB (Node.js / WebView restrictivo)
  const memoryFallback = {
    [STORES.ASTRO]: [],
    [STORES.DISCOVERY]: [],
    [STORES.CLASSROOM]: [],
    [STORES.ACQUISITIONS]: []
  };

  function checkIDBAvailability() {
    try {
      return typeof indexedDB !== 'undefined' && indexedDB !== null;
    } catch(e) {
      return false;
    }
  }

  isIndexedDBAvailable = checkIDBAvailability();

  function getDB() {
    if (!isIndexedDBAvailable) return Promise.resolve(null);
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (event) => {
          const db = event.target.result;

          // 1. Carrete de Astrofotografía Criogénica
          if (!db.objectStoreNames.contains(STORES.ASTRO)) {
            const astroStore = db.createObjectStore(STORES.ASTRO, { keyPath: 'id', autoIncrement: true });
            astroStore.createIndex('timestamp', 'timestamp', { unique: false });
            astroStore.createIndex('artId', 'artId', { unique: false });
            astroStore.createIndex('badge', 'badge', { unique: false });
          }

          // 2. Bitácora de Telemetría y Candidatos Timonel F2
          if (!db.objectStoreNames.contains(STORES.DISCOVERY)) {
            const discStore = db.createObjectStore(STORES.DISCOVERY, { keyPath: 'id' });
            discStore.createIndex('timestamp', 'timestamp', { unique: false });
            discStore.createIndex('badge', 'badge', { unique: false });
            discStore.createIndex('evidenceLevel', 'evidenceLevel', { unique: false });
          }

          // 3. Cuaderno de Aula y Derivaciones Simbólicas
          if (!db.objectStoreNames.contains(STORES.CLASSROOM)) {
            const classStore = db.createObjectStore(STORES.CLASSROOM, { keyPath: 'id', autoIncrement: true });
            classStore.createIndex('timestamp', 'timestamp', { unique: false });
            classStore.createIndex('formulaId', 'formulaId', { unique: false });
          }

          // 4. Archivo de Adquisiciones y Certificados Fine Art (SHA-256)
          if (!db.objectStoreNames.contains(STORES.ACQUISITIONS)) {
            const acqStore = db.createObjectStore(STORES.ACQUISITIONS, { keyPath: 'id', autoIncrement: true });
            acqStore.createIndex('timestamp', 'timestamp', { unique: false });
            acqStore.createIndex('artId', 'artId', { unique: false });
            acqStore.createIndex('sha256CertificateHash', 'sha256CertificateHash', { unique: false });
          }
        };

        req.onsuccess = (event) => {
          resolve(event.target.result);
        };

        req.onerror = (event) => {
          console.warn('[AtelierStorage] Fallo al abrir IndexedDB, usando respaldo en memoria:', event.target.error);
          isIndexedDBAvailable = false;
          resolve(null);
        };
      } catch(e) {
        console.warn('[AtelierStorage] Excepción inicializando IndexedDB:', e);
        isIndexedDBAvailable = false;
        resolve(null);
      }
    });

    return dbPromise;
  }

  // ── OPERACIONES GENÉRICAS ──────────────────────────────────────────

  async function performStoreOp(storeName, mode, callback) {
    const db = await getDB();
    if (!db) {
      return callback(null, memoryFallback[storeName]);
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const req = callback(store, memoryFallback[storeName]);
        tx.oncomplete = () => resolve(req ? req.result : undefined);
        tx.onerror = () => reject(tx.error);
      } catch(err) {
        reject(err);
      }
    });
  }

  async function addItem(storeName, item) {
    const itemWithTime = {
      ...item,
      timestamp: item.timestamp || new Date().toISOString()
    };
    const db = await getDB();
    if (!db) {
      const copy = { ...itemWithTime };
      if (!copy.id) copy.id = Date.now() + Math.random();
      memoryFallback[storeName].unshift(copy);
      syncLocalStorage(storeName);
      return copy.id;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.add(itemWithTime);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function putItem(storeName, item) {
    const itemWithTime = {
      ...item,
      timestamp: item.timestamp || new Date().toISOString()
    };
    const db = await getDB();
    if (!db) {
      const copy = { ...itemWithTime };
      if (!copy.id) copy.id = Date.now() + Math.random();
      const idx = memoryFallback[storeName].findIndex(x => x.id === copy.id);
      if (idx >= 0) memoryFallback[storeName][idx] = copy;
      else memoryFallback[storeName].unshift(copy);
      syncLocalStorage(storeName);
      return copy.id;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(itemWithTime);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllItems(storeName) {
    const db = await getDB();
    if (!db) {
      loadLocalStorage(storeName);
      return [...memoryFallback[storeName]];
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => {
        const res = req.result || [];
        // Orden descendente por timestamp
        res.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(res);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteItem(storeName, id) {
    const db = await getDB();
    if (!db) {
      memoryFallback[storeName] = memoryFallback[storeName].filter(x => x.id !== id);
      syncLocalStorage(storeName);
      return true;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async function clearStore(storeName) {
    const db = await getDB();
    if (!db) {
      memoryFallback[storeName] = [];
      syncLocalStorage(storeName);
      return true;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  // Sincronización secundaria para cadenas livianas en localStorage (si está disponible)
  function syncLocalStorage(storeName) {
    if (typeof localStorage === 'undefined') return;
    try {
      // Solo respaldamos discovery_ledger y adquisiciones livianas, nunca BLOBs pesados de fotos
      if (storeName === STORES.DISCOVERY) {
        localStorage.setItem('NAI_DISCOVERY_LEDGER', JSON.stringify(memoryFallback[storeName].slice(0, 50)));
      }
    } catch(e) {}
  }

  function loadLocalStorage(storeName) {
    if (typeof localStorage === 'undefined') return;
    try {
      if (storeName === STORES.DISCOVERY && memoryFallback[storeName].length === 0) {
        const raw = localStorage.getItem('NAI_DISCOVERY_LEDGER');
        if (raw) memoryFallback[storeName] = JSON.parse(raw);
      }
    } catch(e) {}
  }

  // ── API SOBERANA ATELIER STORAGE ───────────────────────────────────

  const AtelierStorage = {
    STORES,
    isAvailable: () => isIndexedDBAvailable,

    // 1. Astrofotografía Criogénica (Observatorio 3D)
    saveAstrophoto: (entry) => addItem(STORES.ASTRO, entry),
    getAstrophotos: () => getAllItems(STORES.ASTRO),
    deleteAstrophoto: (id) => deleteItem(STORES.ASTRO, id),
    clearAstrophotos: () => clearStore(STORES.ASTRO),

    // 2. Bitácora de Descubrimientos & Telemetría Timonel F2
    saveDiscovery: (entry) => putItem(STORES.DISCOVERY, entry),
    getDiscoveries: () => getAllItems(STORES.DISCOVERY),
    deleteDiscovery: (id) => deleteItem(STORES.DISCOVERY, id),
    clearDiscoveries: () => clearStore(STORES.DISCOVERY),

    // 3. Cuaderno de Aula y Derivaciones
    saveClassroomNote: (entry) => addItem(STORES.CLASSROOM, entry),
    getClassroomNotes: () => getAllItems(STORES.CLASSROOM),
    deleteClassroomNote: (id) => deleteItem(STORES.CLASSROOM, id),
    clearClassroomNotes: () => clearStore(STORES.CLASSROOM),

    // 4. Adquisiciones y Certificados Fine Art
    saveAcquisition: (entry) => addItem(STORES.ACQUISITIONS, entry),
    getAcquisitions: () => getAllItems(STORES.ACQUISITIONS),
    deleteAcquisition: (id) => deleteItem(STORES.ACQUISITIONS, id),
    clearAcquisitions: () => clearStore(STORES.ACQUISITIONS),

    // Respaldo integral JSON
    exportFullBackup: async () => {
      const [astros, discoveries, notes, acquisitions] = await Promise.all([
        getAllItems(STORES.ASTRO),
        getAllItems(STORES.DISCOVERY),
        getAllItems(STORES.CLASSROOM),
        getAllItems(STORES.ACQUISITIONS)
      ]);
      return {
        schema: 'AtelierMatematico-Backup-v1',
        exportedAt: new Date().toISOString(),
        counts: {
          astrophotography: astros.length,
          discovery_ledger: discoveries.length,
          classroom_notes: notes.length,
          acquisition_orders: acquisitions.length
        },
        data: {
          astrophotography: astros,
          discovery_ledger: discoveries,
          classroom_notes: notes,
          acquisition_orders: acquisitions
        }
      };
    },

    importBackup: async (backupData) => {
      if (!backupData || !backupData.data) throw new Error('Formato de respaldo no válido');
      const d = backupData.data;
      if (Array.isArray(d.astrophotography)) {
        for (const item of d.astrophotography) await addItem(STORES.ASTRO, item);
      }
      if (Array.isArray(d.discovery_ledger)) {
        for (const item of d.discovery_ledger) await putItem(STORES.DISCOVERY, item);
      }
      if (Array.isArray(d.classroom_notes)) {
        for (const item of d.classroom_notes) await addItem(STORES.CLASSROOM, item);
      }
      if (Array.isArray(d.acquisition_orders)) {
        for (const item of d.acquisition_orders) await addItem(STORES.ACQUISITIONS, item);
      }
      return true;
    }
  };

  root.AtelierStorage = AtelierStorage;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AtelierStorage };
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
