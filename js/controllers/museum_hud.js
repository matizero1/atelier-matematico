/**
 * 🛰️ ATELIER MATEMÁTICO — SUBSISTEMA HUD, BITÁCORA Y TELEMETRÍA DEL OBSERVATORIO
 * Bitácora de Candidatos Timonel F2, Carrete Persistente IndexedDB, Consola OLED y HUD
 * Gobernanza: Timonel F2 · Cero Dependencias · Silicio Nativo
 */

(function(root) {
  'use strict';

  // ── BITÁCORA DE CANDIDATOS & NAI CENTINELA (TIMONEL F2) ───────────
  let discoveryLedger = [];
  let isLODModalOpen = false;
  let isHudMinimized = false;
  let userCameraRoll = [];
  let swarmNodeId = "CL-" + Math.floor(1000 + Math.random() * 9000);

  // Consola OLED del pedestal
  let telescopeScreenCanvas = null;
  let telescopeScreenTexture = null;

  async function loadDiscoveryLedger() {
    if (typeof window !== 'undefined' && window.AtelierStorage) {
      try {
        const saved = await window.AtelierStorage.getDiscoveries();
        if (Array.isArray(saved) && saved.length > 0) {
          discoveryLedger = saved;
        }
      } catch(e) {}
    } else if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('NAI_DISCOVERY_LEDGER');
        if (saved) discoveryLedger = JSON.parse(saved);
      } catch(e) {}
    }
    updateDiscoveryUI();
  }

  async function saveDiscoveryLedger() {
    if (typeof window !== 'undefined' && window.AtelierStorage) {
      try {
        for (const item of discoveryLedger.slice(0, 50)) {
          await window.AtelierStorage.saveDiscovery(item);
        }
      } catch(e) {}
    } else if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('NAI_DISCOVERY_LEDGER', JSON.stringify(discoveryLedger));
      } catch(e) {}
    }
  }

  async function clearDiscoveryLedger() {
    if (typeof confirm !== 'undefined' && confirm('¿Vaciar la bitácora de candidatos?')) {
      discoveryLedger = [];
      if (typeof window !== 'undefined' && window.AtelierStorage) {
        try { await window.AtelierStorage.clearDiscoveries(); } catch(e) {}
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('NAI_DISCOVERY_LEDGER');
      }
      updateDiscoveryUI();
    }
  }

  function toggleDiscoveryDrawer() {
    if (typeof document === 'undefined') return;
    const drawer = document.getElementById('discovery-drawer');
    if (drawer) drawer.classList.toggle('translate-x-full');
  }

  function updateDiscoveryUI() {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('discovery-counter-badge');
    const countText = document.getElementById('discovery-count-text');
    const emptyState = document.getElementById('discovery-empty-state');
    const list = document.getElementById('discovery-list');

    if (badge) badge.textContent = discoveryLedger.length;
    if (countText) countText.textContent = `${discoveryLedger.length} candidatos archivados`;

    if (!list) return;

    if (discoveryLedger.length === 0) {
      list.innerHTML = '';
      if (emptyState) {
        emptyState.classList.remove('hidden');
        list.appendChild(emptyState);
      }
      return;
    }

    list.innerHTML = '';
    discoveryLedger.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass rounded-xl p-3.5 border border-cyan-500/25 space-y-2 relative overflow-hidden';
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[9px] mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">#${item.badge} · ${item.cat}</span>
            <h4 class="text-xs serif font-bold text-white mt-1">${item.title}</h4>
          </div>
          <span class="text-[10px] mono text-slate-400">${item.timeFormatted}</span>
        </div>
        <div class="bg-black/60 rounded p-2 text-[10px] mono text-purple-300">
          <div>Residuo Timonel: <strong class="text-cyan-300">${item.residual ?? "NO CALCULADO"}</strong></div>
          <div class="text-slate-400 mt-0.5">${item.reason}</div>
        </div>
        <div class="flex justify-between items-center text-[9px] mono text-slate-500">
          <span>Nodo: ${item.nodeId}</span>
          <span class="text-emerald-400 font-semibold">REGISTRO SIN VALIDAR</span>
        </div>
      `;
      list.appendChild(card);
    });
  }

  function showDiscoveryToast(entry) {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById('discovery-toast');
    const msg = document.getElementById('toast-message');
    if (!toast || !msg) return;

    msg.textContent = `${entry.title}: Residuo ${entry.residual ?? "NO CALCULADO"} — ${entry.reason}`;
    toast.classList.remove('opacity-0', '-translate-y-8');
    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-8');
    }, 6000);
  }

  function recordDiscoveryCandidate(astro, reason, details) {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      badge: astro && astro.data ? astro.data.badge : '000',
      title: astro && astro.data ? astro.data.title : 'Observación',
      cat: astro && astro.data ? astro.data.cat : 'Atlas',
      reason: reason,
      residual: null,
      evidenceLevel: 'DEMO',
      scientificDiscovery: false,
      details: details || "Convergencia local fuera del equilibrio",
      nodeId: swarmNodeId
    };

    discoveryLedger.unshift(entry);
    if (discoveryLedger.length > 50) discoveryLedger.pop();
    saveDiscoveryLedger();
    updateDiscoveryUI();
    showDiscoveryToast(entry);

    if (root.MuseumAudio && typeof root.MuseumAudio.speakNai === 'function' && astro && astro.data) {
      root.MuseumAudio.speakNai(`Atención Matías. Se ha registrado una demostración de interfaz sin validación matemática en ${astro.data.title}. Archivado en la bitácora.`);
    }
  }

  function exportDiscoveryLedger() {
    if (typeof document === 'undefined') return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(discoveryLedger, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `timonel_discovery_ledger_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function simulateDiscoveryCandidate() {
    const astros = root.astros24 || [];
    const astro = astros[21] || astros[0];
    recordDiscoveryCandidate(astro, "Prueba de interfaz. No corresponde a un cálculo ni a un descubrimiento.", "Prueba de Alerta Vocal NAI");
  }

  // ── OBTURADOR & CARRETE PERSISTENTE (INDEXEDDB ATELIER STORAGE) ───
  async function triggerShutter() {
    if (typeof document === 'undefined') return;
    const flash = document.getElementById('camera-flash');
    if (flash) {
      flash.classList.add('flashing');
      setTimeout(() => flash.classList.remove('flashing'), 100);
    }

    if (root.MuseumAudio && typeof root.MuseumAudio.playShutterSound === 'function') {
      root.MuseumAudio.playShutterSound();
    }

    const canvas = document.getElementById('webgl-canvas');
    const dataUrl = canvas ? canvas.toDataURL('image/jpeg', 0.90) : '';

    const astro = root.currentFocusedAstro ? root.currentFocusedAstro.data : null;
    const title = astro ? astro.title : 'Atlas Cósmico';
    const badge = astro ? astro.badge : '000';
    const artId = astro ? astro.id : null;

    const angles = root.currentTelescopeAngles || { ha: 0, dec: 0 };
    const photoEntry = {
      id: Date.now(),
      artId: artId,
      badge: badge,
      title: title,
      artTitle: title,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      img: dataUrl,
      ha: angles.ha,
      dec: angles.dec
    };

    userCameraRoll.unshift(photoEntry);
    if (typeof window !== 'undefined' && window.AtelierStorage) {
      try {
        await window.AtelierStorage.saveAstrophoto(photoEntry);
      } catch(e) {
        console.warn('Error guardando astrofotografía en IndexedDB:', e);
      }
    }
    updateRollUI();
    if (root.MuseumAudio && typeof root.MuseumAudio.speakNai === 'function') {
      root.MuseumAudio.speakNai(`Fotografía capturada y archivada en el carrete persistente: ${title}.`);
    }
  }

  async function loadCameraRoll() {
    if (typeof window !== 'undefined' && window.AtelierStorage) {
      try {
        const saved = await window.AtelierStorage.getAstrophotos();
        if (Array.isArray(saved) && saved.length > 0) {
          userCameraRoll = saved;
        }
      } catch(e) {
        console.warn('Error recuperando carrete fotográfico:', e);
      }
    }
    updateRollUI();
  }

  function updateRollUI() {
    if (typeof document === 'undefined') return;
    const grid = document.getElementById('roll-grid');
    const counterBadge = document.getElementById('roll-counter-badge');
    const capacityText = document.getElementById('roll-capacity-text');
    const emptyState = document.getElementById('roll-empty-state');

    if (counterBadge) counterBadge.textContent = `${userCameraRoll.length}/30`;
    if (capacityText) capacityText.textContent = `${userCameraRoll.length} / 30 fotos (Persistente)`;

    if (!grid) return;

    if (userCameraRoll.length === 0) {
      if (emptyState) {
        emptyState.classList.remove('hidden');
        grid.innerHTML = '';
        grid.appendChild(emptyState);
      }
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    grid.innerHTML = '';

    userCameraRoll.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'glass rounded-xl p-2 relative group overflow-hidden border border-white/10 hover:border-[#c5a059]/50 transition';
      card.innerHTML = `
        <img src="${item.img}" class="w-full h-28 object-cover rounded-lg mb-1.5 bg-black" />
        <div class="flex justify-between items-center text-[10px] mono text-slate-300">
          <span class="truncate font-medium text-white">${item.artTitle}</span>
          <span class="text-[#c5a059]">${item.date}</span>
        </div>
        <div class="flex items-center gap-1.5 mt-1.5">
          <button onclick="downloadAstroPlate(${item.id})" class="flex-1 bg-white/10 hover:bg-[#c5a059] hover:text-black text-white text-[9px] mono py-1 rounded transition text-center" title="Descargar Placa CCD">
            Descargar ⬇
          </button>
          <button onclick="deleteRollItem(${item.id})" class="bg-black/70 hover:bg-rose-600 text-white w-6 h-6 rounded-lg text-xs flex items-center justify-center transition" title="Eliminar foto">
            ✕
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function downloadAstroPlate(id) {
    if (typeof document === 'undefined') return;
    const item = userCameraRoll.find(x => x.id === id);
    if (!item || !item.img) return;
    const a = document.createElement('a');
    a.href = item.img;
    a.download = `Atelier_Astro_${item.badge || 'Plate'}_${item.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function deleteRollItem(id) {
    userCameraRoll = userCameraRoll.filter(item => item.id !== id);
    if (typeof window !== 'undefined' && window.AtelierStorage) {
      try {
        await window.AtelierStorage.deleteAstrophoto(id);
      } catch(e) {}
    }
    updateRollUI();
  }

  async function clearCameraRoll() {
    if (typeof confirm !== 'undefined' && confirm('¿Vaciar carrete de astrofotografía?')) {
      userCameraRoll = [];
      if (typeof window !== 'undefined' && window.AtelierStorage) {
        try {
          await window.AtelierStorage.clearAstrophotos();
        } catch(e) {}
      }
      updateRollUI();
    }
  }

  function toggleCameraRoll() {
    if (typeof document === 'undefined') return;
    const drawer = document.getElementById('roll-drawer');
    if (drawer) drawer.classList.toggle('translate-x-full');
  }

  // ── CONSOLA OLED DEL PEDESTAL DEL TELESCOPIO (TEXTURA PROCEDURAL) ──
  function createTelescopeScreenTexture(THREE_LIB) {
    if (typeof document === 'undefined') return null;
    const THREE = THREE_LIB || (typeof window !== 'undefined' ? window.THREE : null);
    if (!THREE) return null;

    telescopeScreenCanvas = document.createElement('canvas');
    telescopeScreenCanvas.width = 512;
    telescopeScreenCanvas.height = 256;
    telescopeScreenTexture = new THREE.CanvasTexture(telescopeScreenCanvas);
    telescopeScreenTexture.minFilter = THREE.LinearFilter;
    updateTelescopeScreenTexture(null);
    return telescopeScreenTexture;
  }

  function updateTelescopeScreenTexture(targetData) {
    if (!telescopeScreenCanvas) return;
    const ctx = telescopeScreenCanvas.getContext('2d');
    ctx.fillStyle = '#08090e';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = 'rgba(30, 48, 64, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(197, 160, 89, 0.15)';
    ctx.fillRect(0, 0, 512, 40);
    ctx.fillStyle = '#dfc285';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TIMONEL GOTO TERMINAL MK-IV · PARANAL', 16, 26);
    ctx.fillStyle = '#34d399';
    ctx.font = '12px monospace';
    ctx.fillText('ONLINE', 440, 26);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '13px monospace';
    ctx.fillText('LATITUD: -24.62° S   ELEVACIÓN: 2635m', 20, 68);

    const title = targetData ? `OBRA ${targetData.badge}: ${targetData.title.toUpperCase()}` : 'SEGUIMIENTO: CÓDICE CÓSMICO';
    const sub = targetData ? targetData.sub : 'Rotonda Tectónica de Basalto';
    
    ctx.fillStyle = '#f4f1ea';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(title.length > 36 ? title.substring(0, 36) + '...' : title, 20, 102);

    ctx.fillStyle = '#c5a059';
    ctx.font = '13px monospace';
    ctx.fillText(sub.length > 40 ? sub.substring(0, 40) + '...' : sub, 20, 126);

    ctx.save();
    ctx.translate(430, 130);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 36, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(44, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(0, 44); ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'rgba(197, 160, 89, 0.22)';
    ctx.fillRect(16, 175, 480, 60);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 175, 480, 60);

    ctx.fillStyle = '#f4f1ea';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▶ PULSA [T] O HAZ CLIC AQUÍ PARA CATÁLOGO GOTO ◀', 256, 211);
    ctx.textAlign = 'start';

    if (telescopeScreenTexture) telescopeScreenTexture.needsUpdate = true;
  }

  // ── SELECTOR DE SALTO RÁPIDO & HUD CARDS ──────────────────────────
  function populateNaiAstroSelector(artworks) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('nai-astro-selector');
    if (!container) return;
    container.innerHTML = '';
    const list = artworks || root.ARTWORKS_24 || [];
    list.forEach((astro, idx) => {
      const btn = document.createElement('button');
      btn.className = 'text-[9px] mono text-purple-300 hover:text-white glass px-2 py-0.5 rounded-full border-white/10 shrink-0 transition';
      btn.textContent = `${astro.badge} · ${astro.title.split(' ')[0]}`;
      btn.onclick = () => {
        if (typeof root.propelToAstro === 'function') {
          root.propelToAstro(idx);
        } else if (typeof root.warpToTargetAstro === 'function') {
          root.warpToTargetAstro(idx);
        }
      };
      container.appendChild(btn);
    });
  }

  function toggleHudCardMinimize() {
    if (typeof document === 'undefined') return;
    isHudMinimized = !isHudMinimized;
    const hudCard = document.getElementById('orbital-hud-card');
    const reopenBtn = document.getElementById('btn-reopen-hud');
    if (isHudMinimized) {
      if (hudCard) hudCard.classList.add('opacity-0', 'translate-x-8', 'pointer-events-none');
      if (reopenBtn) reopenBtn.classList.remove('hidden');
    } else {
      if (hudCard) hudCard.classList.remove('opacity-0', 'translate-x-8', 'pointer-events-none');
      if (reopenBtn) reopenBtn.classList.add('hidden');
    }
  }

  // ── GOBERNADOR ADAPTATIVO DE RENDIMIENTO & LOD (TIMONEL F2) ────────
  function toggleLODModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('lod-performance-modal');
    if (!modal) return;
    isLODModalOpen = !isLODModalOpen;
    if (isLODModalOpen) {
      modal.classList.remove('hidden');
      updateLODHUD(true);
    } else {
      modal.classList.add('hidden');
    }
  }

  function setLODTier(tierKey) {
    if (typeof root.AtelierLOD !== 'undefined') {
      root.AtelierLOD.setTier(tierKey);
      updateLODHUD(true);
    }
  }

  function setLODMode(modeKey) {
    if (typeof root.AtelierLOD !== 'undefined') {
      root.AtelierLOD.setMode(modeKey);
      updateLODHUD(true);
    }
  }

  function updateLODHUD(forceModalUpdate = false) {
    if (typeof root.AtelierLOD === 'undefined' || typeof document === 'undefined') return;
    const t = root.AtelierLOD.getTelemetry();

    const hudFps = document.getElementById('lod-hud-fps');
    const hudTier = document.getElementById('lod-hud-tier');
    const hudDot = document.getElementById('lod-hud-dot');
    const btnFpsShort = document.getElementById('btn-lod-fps-short');
    const btnDot = document.getElementById('btn-lod-dot');

    const fpsColor = t.fps >= 54 ? 'text-emerald-400' : (t.fps >= 35 ? 'text-amber-300' : 'text-rose-400');
    const dotColor = t.fps >= 54 ? 'bg-emerald-400' : (t.fps >= 35 ? 'bg-amber-400' : 'bg-rose-500');

    if (hudFps) {
      hudFps.textContent = `${t.fps} FPS`;
      hudFps.className = `${fpsColor} font-bold`;
    }
    if (btnFpsShort) {
      btnFpsShort.textContent = `${t.fps} FPS`;
      btnFpsShort.className = `${fpsColor} font-bold`;
    }
    if (hudTier) {
      hudTier.textContent = `${t.mode === 'AUTO' ? 'AUTO (' + t.tier.key + ')' : t.tier.key}`;
    }
    if (hudDot) hudDot.className = `w-1.5 h-1.5 rounded-full ${dotColor}`;
    if (btnDot) btnDot.className = `w-1.5 h-1.5 rounded-full ${dotColor}`;

    if (isLODModalOpen || forceModalUpdate) {
      const modalFps = document.getElementById('lod-modal-fps');
      const modalMs = document.getElementById('lod-modal-ms');
      const modalDpr = document.getElementById('lod-modal-dpr');
      const modalShadows = document.getElementById('lod-modal-shadows');
      const modalStars = document.getElementById('lod-modal-stars');
      const modalCalls = document.getElementById('lod-modal-calls');

      if (modalFps) {
        modalFps.textContent = `${t.fps} FPS`;
        modalFps.className = `text-xl font-bold mono ${fpsColor}`;
      }
      if (modalMs) modalMs.textContent = `${t.avgMs} ms`;
      if (modalDpr) modalDpr.textContent = `${t.dpr.toFixed(2)}x`;
      if (modalShadows) modalShadows.textContent = t.shadowsEnabled ? 'Activas' : 'Inactivas (0% cost)';
      if (modalStars) modalStars.textContent = `${t.maxStars.toLocaleString()} estrellas`;
      if (modalCalls) modalCalls.textContent = `${t.drawCalls}`;

      const btnAuto = document.getElementById('btn-lod-mode-auto');
      const btnManual = document.getElementById('btn-lod-mode-manual');
      if (btnAuto && btnManual) {
        if (t.mode === 'AUTO') {
          btnAuto.className = 'py-2 px-3 rounded-xl text-xs mono border transition flex items-center justify-center gap-1.5 cursor-pointer bg-[#c5a059]/20 border-[#c5a059] text-[#dfc285] font-semibold';
          btnManual.className = 'py-2 px-3 rounded-xl text-xs mono border transition flex items-center justify-center gap-1.5 cursor-pointer bg-white/5 border-white/10 text-[#a1a1aa] hover:text-white';
        } else {
          btnManual.className = 'py-2 px-3 rounded-xl text-xs mono border transition flex items-center justify-center gap-1.5 cursor-pointer bg-[#c5a059]/20 border-[#c5a059] text-[#dfc285] font-semibold';
          btnAuto.className = 'py-2 px-3 rounded-xl text-xs mono border transition flex items-center justify-center gap-1.5 cursor-pointer bg-white/5 border-white/10 text-[#a1a1aa] hover:text-white';
        }
      }

      ['ULTRA', 'HIGH', 'MEDIUM', 'ECO'].forEach(tierKey => {
        const btn = document.getElementById(`btn-lod-tier-${tierKey}`);
        if (btn) {
          if (t.tier.key === tierKey) {
            btn.className = 'p-2.5 rounded-xl text-left border transition cursor-pointer bg-[#c5a059]/20 border-[#c5a059] text-[#dfc285]';
          } else {
            btn.className = 'p-2.5 rounded-xl text-left border transition cursor-pointer bg-white/5 border-white/10 hover:border-white/20 text-[#a1a1aa]';
          }
        }
      });
    }
  }

  const MuseumHUD = {
    loadDiscoveryLedger,
    saveDiscoveryLedger,
    clearDiscoveryLedger,
    toggleDiscoveryDrawer,
    updateDiscoveryUI,
    showDiscoveryToast,
    recordDiscoveryCandidate,
    exportDiscoveryLedger,
    simulateDiscoveryCandidate,
    triggerShutter,
    loadCameraRoll,
    updateRollUI,
    downloadAstroPlate,
    deleteRollItem,
    clearCameraRoll,
    toggleCameraRoll,
    createTelescopeScreenTexture,
    updateTelescopeScreenTexture,
    populateNaiAstroSelector,
    toggleHudCardMinimize,
    toggleLODModal,
    setLODTier,
    setLODMode,
    updateLODHUD,
    get discoveryLedger() { return discoveryLedger; },
    get userCameraRoll() { return userCameraRoll; },
    get isHudMinimized() { return isHudMinimized; }
  };

  root.MuseumHUD = MuseumHUD;

  // Bindings globales HTML
  root.loadDiscoveryLedger = loadDiscoveryLedger;
  root.saveDiscoveryLedger = saveDiscoveryLedger;
  root.clearDiscoveryLedger = clearDiscoveryLedger;
  root.toggleDiscoveryDrawer = toggleDiscoveryDrawer;
  root.recordDiscoveryCandidate = recordDiscoveryCandidate;
  root.exportDiscoveryLedger = exportDiscoveryLedger;
  root.simulateDiscoveryCandidate = simulateDiscoveryCandidate;
  root.triggerShutter = triggerShutter;
  root.loadCameraRoll = loadCameraRoll;
  root.updateRollUI = updateRollUI;
  root.downloadAstroPlate = downloadAstroPlate;
  root.deleteRollItem = deleteRollItem;
  root.clearCameraRoll = clearCameraRoll;
  root.toggleCameraRoll = toggleCameraRoll;
  root.createTelescopeScreenTexture = createTelescopeScreenTexture;
  root.updateTelescopeScreenTexture = updateTelescopeScreenTexture;
  root.populateNaiAstroSelector = populateNaiAstroSelector;
  root.toggleHudCardMinimize = toggleHudCardMinimize;
  root.toggleLODModal = toggleLODModal;
  root.setLODTier = setLODTier;
  root.setLODMode = setLODMode;
  root.updateLODHUD = updateLODHUD;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MuseumHUD;
  }

})(typeof window !== 'undefined' ? window : global);
