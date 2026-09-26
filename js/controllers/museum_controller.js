/**
 * Atelier Matemático - Museum Controller
 * 3D Celestial Observatory (Atlas Cósmico de 100 Leyes)
 * NASA JPL-Grade Modular Architecture
 */

// CATÁLOGO COMPLETO DE LAS 100 LEYES DE LA HUMANIDAD (BÓVEDA CELESTE VISIBLE · TIMONEL F2)
const ARTWORKS_24 = (typeof window !== 'undefined' && window.ARTWORKS_100 && window.ARTWORKS_100.length) ? window.ARTWORKS_100 : [];

// Variables Three.js & Silicio
let scene, camera, renderer;
let astros24 = [];
let knotFilamentUpdaters = [];

// Entidad 3D de NAI
let nai3D = {
  group: null, core: null, outerHalo: null, light: null,
  targetPos: new THREE.Vector3(0, 0, -8), currentIndex: 0, pulseTime: 0
};

// Navegación Inercial 6DOF de la Cápsula
let velocity = new THREE.Vector3(0, 0, 0);
let orientation = { pitch: 0, yaw: 0 };
let targetOrientation = { pitch: 0, yaw: 0 };
let isDragging = false, dragPrev = { x: 0, y: 0 };
let userInertiaTimer = 0;
let currentFocusedAstro = null;

// Telemetría Enjambre
let totalEvaluations = 480000;
let swarmNodeId = "CL-" + Math.floor(1000 + Math.random() * 9000);

// Audio & Carrete
let voiceGuideEnabled = true, isSpeaking = false, currentUtterance = null;
let userCameraRoll = [];

// Boutique Orbital 3D
let isInShopMode = false;
let savedCameraState = { pos: new THREE.Vector3(), quat: new THREE.Quaternion() };
let shopBayGroup = null;
let shopProducts = { frameWood: null, frameAcrylic: null, mug: null, notebook: null, certificate: null };
let currentProductType = 'frame_wood';
let activeProductTexture = null;
let productRotation = { x: 0, y: 0 }, targetProductRotation = { x: 0, y: 0 };

// ── VARIABLES DEL TELESCOPIO HIPERREALISTA PBR & SISTEMA GOTO ─────
let telescopeForkGroup = null;
let telescopeOtaGroup = null;
let telescopeConsoleScreenMesh = null;
let telescopeScreenCanvas = null;
let telescopeScreenTexture = null;
let targetTelescopeAngles = { ha: 0, dec: 0.35 };
let currentTelescopeAngles = { ha: 0, dec: 0.35 };
let isTelescopeSlewing = false;
let slewStartTime = 0;
let slewStartAngles = { ha: 0, dec: 0.35 };
let isTelescopeModalOpen = false;
let gotoEpochFilter = 0;
let gotoSearchQuery = '';
const LAT_PARANAL = 24.6 * Math.PI / 180;
const COS_LAT = Math.cos(LAT_PARANAL);
const SIN_LAT = Math.sin(LAT_PARANAL);
let telescopeAudioCtx = null;

// ── INICIALIZACIÓN PRINCIPAL ──────────────────────────────────────

// ── BITÁCORA DE CANDIDATOS & NAI CENTINELA (TIMONEL F2) ───────────
let discoveryLedger = [];
let lastDiscoveryAlertTime = 0;

function loadDiscoveryLedger() {
  try {
    const saved = localStorage.getItem('NAI_DISCOVERY_LEDGER');
    if (saved) discoveryLedger = JSON.parse(saved);
  } catch(e) {}
  updateDiscoveryUI();
}

function saveDiscoveryLedger() {
  try {
    localStorage.setItem('NAI_DISCOVERY_LEDGER', JSON.stringify(discoveryLedger));
  } catch(e) {}
}

function toggleDiscoveryDrawer() {
  document.getElementById('discovery-drawer').classList.toggle('translate-x-full');
}

function updateDiscoveryUI() {
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
    badge: astro.data.badge,
    title: astro.data.title,
    cat: astro.data.cat,
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

  // Pulso especial en el núcleo 3D de NAI
  if (nai3D && nai3D.core) {
    nai3D.core.material.color.setHex(0x10b981);
    setTimeout(() => { if (nai3D.core) nai3D.core.material.color.setHex(0xa855f7); }, 2500);
  }

  // Alerta vocal de NAI
  speakNai(`Atención Matías. Se ha registrado una demostración de interfaz sin validación matemática en ${astro.data.title}. Archivado en la bitácora.`);
}

function exportDiscoveryLedger() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(discoveryLedger, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `timonel_discovery_ledger_${Date.now()}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function clearDiscoveryLedger() {
  if (confirm('¿Vaciar la bitácora de candidatos?')) {
    discoveryLedger = [];
    saveDiscoveryLedger();
    updateDiscoveryUI();
  }
}

function simulateDiscoveryCandidate() {
  const astro = astros24[21] || astros24[0]; // Beal
  recordDiscoveryCandidate(astro, "Prueba de interfaz. No corresponde a un cálculo ni a un descubrimiento.", "Prueba de Alerta Vocal NAI");
}

function navigateToActiveShop() {
  const artId = currentFocusedAstro ? currentFocusedAstro.data.id : 20;
  window.location.href = `shop.html?art=${artId}`;
}

function initAtlasCosmico() {
  const canvas = document.getElementById('webgl-canvas');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08080a);
  scene.fog = new THREE.FogExp2(0x08080a, 0.0022);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 350);
  camera.position.set(0, 1.65, 0);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power", preserveDrawingBuffer: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1.0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.getElementById('swarm-node-id').textContent = "#" + swarmNodeId;
  loadDiscoveryLedger();

  buildCosmicVoid();
  buildTectonicRotunda();
  buildNaiSovereignEntity();
  buildShopBay3D();
  setup6DOFControls();
  populateNaiAstroSelector();
  window.addEventListener('resize', onWindowResize);
  animate();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('direct') === '1' || urlParams.get('astro') !== null || urlParams.get('warp') !== null) {
    const foyer = document.getElementById('foyer-screen');
    if (foyer) {
      foyer.style.setProperty('display', 'none', 'important');
      foyer.classList.add('hidden');
    }
    enterCapsule(false);
    const rawTarget = urlParams.get('warp') !== null ? urlParams.get('warp') : urlParams.get('astro');
    if (rawTarget !== null) {
      const targetId = parseInt(rawTarget, 10);
      console.log(`[ATELIER-3D] rawTarget: ${rawTarget}, targetId: ${targetId}, astros24: ${astros24.length}`);
      if (!isNaN(targetId) && targetId >= 0 && targetId < astros24.length) {
        warpToTargetAstro(targetId);
      }
    }
  }
}

// ── VACÍO CÓSMICO & CONFINAMIENTO DE LOS 24 HILOS DE TIMONEL ──────
function buildCosmicVoid() {
  scene.add(new THREE.AmbientLight(0x4a4d5a, 1.2));
  const dirLight1 = new THREE.DirectionalLight(0xffeedd, 1.35);
  dirLight1.position.set(16, 32, 22);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.width = 1024;
  dirLight1.shadow.mapSize.height = 1024;
  dirLight1.shadow.camera.near = 1.0;
  dirLight1.shadow.camera.far = 70;
  dirLight1.shadow.camera.left = -16;
  dirLight1.shadow.camera.right = 16;
  dirLight1.shadow.camera.top = 16;
  dirLight1.shadow.camera.bottom = -16;
  dirLight1.shadow.bias = -0.0006;
  dirLight1.shadow.normalBias = 0.02;
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.65);
  dirLight2.position.set(-20, -15, -15);
  scene.add(dirLight2);

  const headLight = new THREE.PointLight(0xffffff, 1.0, 50);
  camera.add(headLight);
  scene.add(camera);

  // Campo Estelar Esférico Omnidireccional (3.500 estrellas en el vacío 3D profundo)
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(3500 * 3);
  for (let i = 0; i < 3500; i++) {
    const r = 40 + Math.random() * 200;
    const th = Math.random() * Math.PI * 2;
    const ph = (Math.random() - 0.5) * Math.PI;
    starPos[i*3]   = r * Math.cos(ph) * Math.sin(th);
    starPos[i*3+1] = r * Math.sin(ph);
    starPos[i*3+2] = r * Math.cos(ph) * Math.cos(th);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xf4f1ea, size: 0.038, transparent: true, opacity: 0.55 }));
  scene.add(stars);

  // Instanciar los 24 Astros Matemáticos con sus Modelos Nativos y Motor de Auto-Resolución
  ARTWORKS_24.forEach((data, index) => {
    createLivingMathematicalAstro(data, index);
  });
}

// ── ROTONDA TECTÓNICA & MIRADOR ASTRONÓMICO DE PARANAL (TIMONEL F2) ─
// ── CONSOLA OLED DEL PEDESTAL DEL TELESCOPIO (TEXTURA PROCEDURAL) ──
function createTelescopeScreenTexture() {
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

  // Cuadrícula sutil
  ctx.strokeStyle = 'rgba(30, 48, 64, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  // Barra de título superior
  ctx.fillStyle = 'rgba(197, 160, 89, 0.15)';
  ctx.fillRect(0, 0, 512, 40);
  ctx.fillStyle = '#dfc285';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('TIMONEL GOTO TERMINAL MK-IV · PARANAL', 16, 26);
  ctx.fillStyle = '#34d399';
  ctx.font = '12px monospace';
  ctx.fillText('ONLINE', 440, 26);

  // Telemetría
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

  // Retícula gráfica
  ctx.save();
  ctx.translate(430, 130);
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 36, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(44, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(0, 44); ctx.stroke();
  ctx.restore();

  // Banner inferior con llamado a la acción
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

// ── ROTONDA TECTÓNICA & MIRADOR ASTRONÓMICO DE PARANAL (TIMONEL F2) ─
function buildTectonicRotunda() {
  const rotundaGroup = new THREE.Group();
  rotundaGroup.position.set(0, 0, 0);

  // Materiales de Grado Observatorio Astronómico
  const bedrockMat = new THREE.MeshStandardMaterial({
    color: 0x07070a,
    roughness: 0.95,
    metalness: 0.1
  });
  const basaltMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c12,
    roughness: 0.85,
    metalness: 0.2
  });
  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    roughness: 0.65,
    metalness: 0.3
  });
  const graniteMat = new THREE.MeshStandardMaterial({
    color: 0x161622,
    roughness: 0.45,
    metalness: 0.4
  });
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    roughness: 0.28,
    metalness: 0.85
  });
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x1e2029,
    roughness: 0.4,
    metalness: 0.8
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88bbdd,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide
  });

  // Materiales PBR Hiperrealistas del Telescopio (VLT / Zeiss)
  const castIronMat = new THREE.MeshStandardMaterial({
    color: 0x12141a,
    roughness: 0.62,
    metalness: 0.72
  });
  const darkAlumMat = new THREE.MeshStandardMaterial({
    color: 0x1a1c24,
    roughness: 0.32,
    metalness: 0.88
  });
  const chromeSteelMat = new THREE.MeshStandardMaterial({
    color: 0xd2d6e0,
    roughness: 0.16,
    metalness: 0.94
  });
  const fineBrassMat = new THREE.MeshStandardMaterial({
    color: 0xc89f53,
    roughness: 0.22,
    metalness: 0.88
  });
  const carbonTubeMat = new THREE.MeshStandardMaterial({
    color: 0x101116,
    roughness: 0.38,
    metalness: 0.70
  });
  const opticalLensMat = new THREE.MeshStandardMaterial({
    color: 0x0a1622,
    roughness: 0.05,
    metalness: 0.15,
    transparent: true,
    opacity: 0.75
  });

  // 1. FUNDACIÓN ROCOSA & TERRAZA DE BASALTO ESCALONADA (R = 14.5m)
  // Sub-zócalo de roca madre
  const subPlinthGeo = new THREE.CylinderGeometry(15.2, 16.5, 0.8, 64);
  const subPlinth = new THREE.Mesh(subPlinthGeo, bedrockMat);
  subPlinth.position.y = -0.4;
  subPlinth.receiveShadow = true;
  rotundaGroup.add(subPlinth);

  // Cubierta Principal de Observación (Radio 14.5m, espesor 0.28m)
  const terraceGeo = new THREE.CylinderGeometry(14.5, 14.8, 0.28, 64);
  const terrace = new THREE.Mesh(terraceGeo, basaltMat);
  terrace.position.y = -0.14;
  terrace.receiveShadow = true;
  rotundaGroup.add(terrace);

  // Anillo Intermedio de Paseo Astronómico (Radio 9.8m, realzado +0.08m)
  const midPromenadeGeo = new THREE.CylinderGeometry(9.8, 10.0, 0.12, 64);
  const midPromenade = new THREE.Mesh(midPromenadeGeo, obsidianMat);
  midPromenade.position.y = 0.06;
  midPromenade.receiveShadow = true;
  rotundaGroup.add(midPromenade);

  // Estrado Central Ecuatorial (Radio 4.8m, realzado +0.16m)
  const centralDaisGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.16, 48);
  const centralDais = new THREE.Mesh(centralDaisGeo, graniteMat);
  centralDais.position.y = 0.20;
  centralDais.receiveShadow = true;
  rotundaGroup.add(centralDais);

  // 2. INCRUSTACIONES ASTRONÓMICAS DE BRONCE (GRADUACIONES & MERIDIANOS)
  const concentricRadii = [1.8, 3.2, 4.8, 7.2, 9.8, 12.2, 14.2];
  concentricRadii.forEach(r => {
    const ringGeo = new THREE.TorusGeometry(r, 0.016, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, bronzeMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = r < 4.8 ? 0.285 : (r < 9.8 ? 0.125 : 0.01);
    rotundaGroup.add(ringMesh);
  });

  // 24 Ejes de Azimut y Declinación (Meridianos del Cielo)
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12;
    const len = 9.0;
    const jointGeo = new THREE.BoxGeometry(0.02, 0.015, len);
    const jointMesh = new THREE.Mesh(jointGeo, bronzeMat);
    jointMesh.position.set(Math.sin(angle) * 9.5, 0.01, Math.cos(angle) * 9.5);
    jointMesh.rotation.y = angle;
    rotundaGroup.add(jointMesh);
  }

  // Medallón Central de Timonel en el Estrado
  const medallionGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.03, 32);
  const medallion = new THREE.Mesh(medallionGeo, titaniumMat);
  medallion.position.y = 0.29;
  medallion.receiveShadow = true;
  rotundaGroup.add(medallion);

  const medRingGeo = new THREE.TorusGeometry(1.2, 0.025, 16, 32);
  const medRing = new THREE.Mesh(medRingGeo, bronzeMat);
  medRing.rotation.x = Math.PI / 2;
  medRing.position.y = 0.305;
  rotundaGroup.add(medRing);

  // 3. PIEDESTAL MONUMENTAL DEL TELESCOPIO ECUATORIAL (ALA SUR)
  const telescopePierGroup = new THREE.Group();
  telescopePierGroup.position.set(0, 0, 5.0);

  // A. Brida de anclaje de fundición de hierro y pernos de fijación geodésica
  const pierBaseFlangeGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.22, 16);
  const pierBaseFlange = new THREE.Mesh(pierBaseFlangeGeo, castIronMat);
  pierBaseFlange.position.y = 0.31;
  pierBaseFlange.castShadow = true;
  pierBaseFlange.receiveShadow = true;
  telescopePierGroup.add(pierBaseFlange);

  // 16 Pernos hexagonales de anclaje geodésico
  const boltGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.08, 6);
  for (let b = 0; b < 16; b++) {
    const bAngle = (b * Math.PI) / 8;
    const bolt = new THREE.Mesh(boltGeo, chromeSteelMat);
    bolt.position.set(Math.sin(bAngle) * 1.55, 0.43, Math.cos(bAngle) * 1.55);
    bolt.castShadow = true;
    telescopePierGroup.add(bolt);
  }

  // Pilar de fijación geodésica octogonal ahusado
  const pierGeo = new THREE.CylinderGeometry(1.3, 1.55, 1.15, 8);
  const pier = new THREE.Mesh(pierGeo, castIronMat);
  pier.position.y = 0.95;
  pier.castShadow = true;
  pier.receiveShadow = true;
  telescopePierGroup.add(pier);

  // Anillo collar superior en latón mecanizado
  const collarGeo = new THREE.TorusGeometry(1.32, 0.038, 16, 32);
  const collar = new THREE.Mesh(collarGeo, fineBrassMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.48;
  collar.castShadow = true;
  telescopePierGroup.add(collar);

  // Placa de inspección / compuerta con grabado oficial
  const hatchGeo = new THREE.BoxGeometry(0.42, 0.52, 0.04);
  const hatch = new THREE.Mesh(hatchGeo, darkAlumMat);
  hatch.position.set(0, 0.88, 1.34);
  hatch.castShadow = true;
  telescopePierGroup.add(hatch);

  const latchGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12);
  const latch = new THREE.Mesh(latchGeo, fineBrassMat);
  latch.rotation.z = Math.PI / 2;
  latch.position.set(0.14, 0.88, 1.37);
  telescopePierGroup.add(latch);

  // B. Consola Ergonómica de Control GoTo en el Pedestal (Frente al Observador)
  const armGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.75, 12);
  const consoleArm = new THREE.Mesh(armGeo, darkAlumMat);
  consoleArm.position.set(0, 1.15, -0.65);
  consoleArm.rotation.x = 0.42;
  consoleArm.castShadow = true;
  telescopePierGroup.add(consoleArm);

  const consoleBoxGeo = new THREE.BoxGeometry(0.58, 0.38, 0.09);
  const consoleBox = new THREE.Mesh(consoleBoxGeo, darkAlumMat);
  consoleBox.position.set(0, 1.35, -0.92);
  consoleBox.rotation.x = -0.45;
  consoleBox.castShadow = true;
  telescopePierGroup.add(consoleBox);

  // Pantalla OLED de alta resolución con textura procedural interactiva
  const screenGeo = new THREE.PlaneGeometry(0.52, 0.32);
  const screenTex = createTelescopeScreenTexture();
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  telescopeConsoleScreenMesh = new THREE.Mesh(screenGeo, screenMat);
  telescopeConsoleScreenMesh.position.set(0, 1.355, -0.87);
  telescopeConsoleScreenMesh.rotation.x = -0.45;
  telescopeConsoleScreenMesh.userData = { isTelescopeConsole: true };
  telescopePierGroup.add(telescopeConsoleScreenMesh);

  rotundaGroup.add(telescopePierGroup);

  // C. Cuña Polar Ecuatorial (Latitud Paranal -24.6°)
  const polarWedgeGroup = new THREE.Group();
  polarWedgeGroup.position.set(0, 1.52, 5.0);
  polarWedgeGroup.rotation.x = LAT_PARANAL;

  const wedgeGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.32, 24);
  const wedge = new THREE.Mesh(wedgeGeo, castIronMat);
  wedge.castShadow = true;
  wedge.receiveShadow = true;
  polarWedgeGroup.add(wedge);

  // Círculo graduado de Ascensión Recta (Setting Circle de 24 horas en bronce satinado)
  const raDialGeo = new THREE.TorusGeometry(1.18, 0.042, 16, 48);
  const raDial = new THREE.Mesh(raDialGeo, fineBrassMat);
  raDial.rotation.x = Math.PI / 2;
  raDial.castShadow = true;
  polarWedgeGroup.add(raDial);

  // D. Horquilla Ecuatorial Rotatoria (Eje Polar / Eje de Ascensión Recta)
  telescopeForkGroup = new THREE.Group();
  telescopeForkGroup.rotation.y = currentTelescopeAngles.ha;
  polarWedgeGroup.add(telescopeForkGroup);

  const forkHubGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.30, 24);
  const forkHub = new THREE.Mesh(forkHubGeo, darkAlumMat);
  forkHub.castShadow = true;
  forkHub.receiveShadow = true;
  telescopeForkGroup.add(forkHub);

  // Brazos gemelos reforzados de la horquilla con nervaduras estructurales
  [-0.96, 0.96].forEach(xOff => {
    const armBodyGeo = new THREE.BoxGeometry(0.26, 1.62, 0.44);
    const armBody = new THREE.Mesh(armBodyGeo, darkAlumMat);
    armBody.position.set(xOff, 0.85, 0);
    armBody.castShadow = true;
    armBody.receiveShadow = true;
    telescopeForkGroup.add(armBody);

    const ribGeo = new THREE.BoxGeometry(0.28, 1.38, 0.28);
    const rib = new THREE.Mesh(ribGeo, castIronMat);
    rib.position.set(xOff, 0.85, 0);
    rib.castShadow = true;
    telescopeForkGroup.add(rib);

    // Carcasa de cojinetes del eje de declinación
    const bearingGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.32, 24);
    const bearing = new THREE.Mesh(bearingGeo, fineBrassMat);
    bearing.rotation.z = Math.PI / 2;
    bearing.position.set(xOff, 1.52, 0);
    bearing.castShadow = true;
    telescopeForkGroup.add(bearing);
  });

  // E. Eje de Declinación & Tubo Óptico Principal (OTA)
  telescopeOtaGroup = new THREE.Group();
  telescopeOtaGroup.position.set(0, 1.52, 0);
  telescopeOtaGroup.rotation.x = currentTelescopeAngles.dec;
  telescopeForkGroup.add(telescopeOtaGroup);

  // Eje transversal de declinación en acero templado
  const decShaftGeo = new THREE.CylinderGeometry(0.11, 0.11, 1.96, 24);
  const decShaft = new THREE.Mesh(decShaftGeo, chromeSteelMat);
  decShaft.rotation.z = Math.PI / 2;
  decShaft.castShadow = true;
  telescopeOtaGroup.add(decShaft);

  // Círculo graduado de Declinación (360° en bronce con nonio Vernier)
  const decCircleGeo = new THREE.TorusGeometry(0.68, 0.026, 16, 32);
  const decCircle = new THREE.Mesh(decCircleGeo, fineBrassMat);
  decCircle.rotation.y = Math.PI / 2;
  decCircle.position.set(-0.82, 0, 0);
  decCircle.castShadow = true;
  telescopeOtaGroup.add(decCircle);

  // Bloque central de mecanizado CNC y anclaje dovetail
  const saddleGeo = new THREE.BoxGeometry(0.94, 0.68, 0.46);
  const saddle = new THREE.Mesh(saddleGeo, darkAlumMat);
  saddle.castShadow = true;
  saddle.receiveShadow = true;
  telescopeOtaGroup.add(saddle);

  // Riel Losmandy en cola de milano longitudinal
  const dovetailGeo = new THREE.BoxGeometry(0.14, 3.4, 0.06);
  const dovetail = new THREE.Mesh(dovetailGeo, darkAlumMat);
  dovetail.position.set(0, 0, -0.49);
  dovetail.castShadow = true;
  telescopeOtaGroup.add(dovetail);

  // Abrazaderas gemelas de sujeción CNC con pernos moleteados
  [-0.95, 0.95].forEach(yOff => {
    const clampGeo = new THREE.TorusGeometry(0.48, 0.046, 16, 32);
    const clamp = new THREE.Mesh(clampGeo, darkAlumMat);
    clamp.rotation.x = Math.PI / 2;
    clamp.position.set(0, yOff, 0);
    clamp.castShadow = true;
    telescopeOtaGroup.add(clamp);

    const screwGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.16, 12);
    const screw = new THREE.Mesh(screwGeo, fineBrassMat);
    screw.rotation.z = Math.PI / 2;
    screw.position.set(0.54, yOff, 0);
    screw.castShadow = true;
    telescopeOtaGroup.add(screw);
  });

  // Tubo óptico principal (OTA) en acabado fibra de carbono / aluminio aeronáutico
  const otaGeo = new THREE.CylinderGeometry(0.44, 0.46, 4.4, 32);
  const ota = new THREE.Mesh(otaGeo, carbonTubeMat);
  ota.castShadow = true;
  ota.receiveShadow = true;
  telescopeOtaGroup.add(ota);

  // Parasol frontal biselado (Dew Shield)
  const dewGeo = new THREE.CylinderGeometry(0.49, 0.48, 1.15, 32);
  const dew = new THREE.Mesh(dewGeo, darkAlumMat);
  dew.position.set(0, 2.15, 0);
  dew.castShadow = true;
  dew.receiveShadow = true;
  telescopeOtaGroup.add(dew);

  // Aro biselado frontal en latón pulido
  const rimGeo = new THREE.TorusGeometry(0.49, 0.032, 16, 32);
  const rim = new THREE.Mesh(rimGeo, fineBrassMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 2.72, 0);
  rim.castShadow = true;
  telescopeOtaGroup.add(rim);

  // Celda de lente objetivo acromático con tratamiento multicapa antireflectante
  const lensGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.06, 32);
  const lens = new THREE.Mesh(lensGeo, opticalLensMat);
  lens.position.set(0, 2.05, 0);
  telescopeOtaGroup.add(lens);

  // Diafragmas antirreflejo cónicos internos (Knife-edge baffles)
  [0.6, 1.1, 1.6].forEach(by => {
    const baffleGeo = new THREE.TorusGeometry(0.43, 0.022, 8, 32);
    const baffle = new THREE.Mesh(baffleGeo, castIronMat);
    baffle.rotation.x = Math.PI / 2;
    baffle.position.set(0, by, 0);
    telescopeOtaGroup.add(baffle);
  });

  // Celda trasera y mecanismo enfocador Crayford de doble velocidad 1:10
  const rearCellGeo = new THREE.CylinderGeometry(0.45, 0.30, 0.42, 24);
  const rearCell = new THREE.Mesh(rearCellGeo, darkAlumMat);
  rearCell.position.set(0, -2.40, 0);
  rearCell.castShadow = true;
  telescopeOtaGroup.add(rearCell);

  const drawtubeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.60, 24);
  const drawtube = new THREE.Mesh(drawtubeGeo, chromeSteelMat);
  drawtube.position.set(0, -2.70, 0);
  drawtube.castShadow = true;
  telescopeOtaGroup.add(drawtube);

  // Mandos micrométricos de enfoque en latón moleteado
  [-0.18, 0.18].forEach(fx => {
    const knobGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.055, 16);
    const knob = new THREE.Mesh(knobGeo, fineBrassMat);
    knob.rotation.z = Math.PI / 2;
    knob.position.set(fx, -2.70, 0);
    knob.castShadow = true;
    telescopeOtaGroup.add(knob);
  });

  // Prisma diagonal cenital de 90°
  const diagGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const diag = new THREE.Mesh(diagGeo, darkAlumMat);
  diag.position.set(0, -3.02, 0);
  diag.castShadow = true;
  telescopeOtaGroup.add(diag);

  // Ocular gran angular de 2 pulgadas
  const eyepieceGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.26, 24);
  const eyepiece = new THREE.Mesh(eyepieceGeo, chromeSteelMat);
  eyepiece.position.set(0, -3.02, 0.22);
  eyepiece.rotation.x = Math.PI / 2;
  eyepiece.castShadow = true;
  telescopeOtaGroup.add(eyepiece);

  const eyecupGeo = new THREE.TorusGeometry(0.08, 0.022, 12, 24);
  const eyecup = new THREE.Mesh(eyecupGeo, castIronMat);
  eyecup.position.set(0, -3.02, 0.35);
  telescopeOtaGroup.add(eyecup);

  // F. Tubo Buscador Paralelo de Alta Precisión (Finder Scope)
  const finderGeo = new THREE.CylinderGeometry(0.13, 0.13, 2.6, 24);
  const finder = new THREE.Mesh(finderGeo, darkAlumMat);
  finder.position.set(0.66, 0.15, 0.26);
  finder.castShadow = true;
  telescopeOtaGroup.add(finder);

  // Soportes de anillas de colimación del buscador
  [-0.65, 0.65].forEach(fyOff => {
    const fRingGeo = new THREE.TorusGeometry(0.21, 0.022, 12, 24);
    const fRing = new THREE.Mesh(fRingGeo, fineBrassMat);
    fRing.rotation.x = Math.PI / 2;
    fRing.position.set(0.66, fyOff, 0.26);
    fRing.castShadow = true;
    telescopeOtaGroup.add(fRing);

    const fPostGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.25, 8);
    const fPost = new THREE.Mesh(fPostGeo, darkAlumMat);
    fPost.position.set(0.54, fyOff, 0.13);
    fPost.castShadow = true;
    telescopeOtaGroup.add(fPost);
  });

  const finderRimGeo = new THREE.TorusGeometry(0.13, 0.018, 12, 24);
  const finderRim = new THREE.Mesh(finderRimGeo, fineBrassMat);
  finderRim.rotation.x = Math.PI / 2;
  finderRim.position.set(0.66, 1.45, 0.26);
  finderRim.castShadow = true;
  telescopeOtaGroup.add(finderRim);

  const finderLensGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16);
  const finderLens = new THREE.Mesh(finderLensGeo, opticalLensMat);
  finderLens.position.set(0.66, 1.40, 0.26);
  telescopeOtaGroup.add(finderLens);

  // G. Sistema de Contrapesos en Acero Inoxidable y Latón
  const counterShaftGeo = new THREE.CylinderGeometry(0.055, 0.055, 2.85, 16);
  const counterShaft = new THREE.Mesh(counterShaftGeo, chromeSteelMat);
  counterShaft.rotation.z = Math.PI / 2;
  counterShaft.position.set(0, 0.28, -0.68);
  counterShaft.castShadow = true;
  telescopeForkGroup.add(counterShaft);

  [-1.22, 1.22].forEach(cx => {
    const cweightGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.32, 24);
    const cweight = new THREE.Mesh(cweightGeo, castIronMat);
    cweight.rotation.z = Math.PI / 2;
    cweight.position.set(cx, 0.28, -0.68);
    cweight.castShadow = true;
    telescopeForkGroup.add(cweight);

    const collarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const cCollar = new THREE.Mesh(collarGeo, fineBrassMat);
    cCollar.rotation.z = Math.PI / 2;
    cCollar.position.set(cx > 0 ? cx + 0.20 : cx - 0.20, 0.28, -0.68);
    cCollar.castShadow = true;
    telescopeForkGroup.add(cCollar);
  });

  rotundaGroup.add(polarWedgeGroup);

  // Luz suave de cabina del telescopio
  const scopeLight = new THREE.PointLight(0xdfc285, 1.4, 7.5);
  scopeLight.position.set(0, 2.2, 4.4);
  rotundaGroup.add(scopeLight);

  // 4. BALAUSTRADA PERIMETRAL DE CRISTAL ESTRUCTURAL & BRONCE (R = 13.8m)
  // Cero obstrucciones: despeja 100% la línea de visión del observador (altura ojo 1.65m > barandilla 1.05m)
  const handrailGeo = new THREE.TorusGeometry(13.8, 0.024, 16, 64);
  const handrail = new THREE.Mesh(handrailGeo, bronzeMat);
  handrail.rotation.x = Math.PI / 2;
  handrail.position.y = 1.05;
  rotundaGroup.add(handrail);

  const curbRailGeo = new THREE.TorusGeometry(13.8, 0.018, 16, 64);
  const curbRail = new THREE.Mesh(curbRailGeo, bronzeMat);
  curbRail.rotation.x = Math.PI / 2;
  curbRail.position.y = 0.06;
  rotundaGroup.add(curbRail);

  // Paneles de cristal laminado transparente
  const glassGeo = new THREE.CylinderGeometry(13.78, 13.78, 0.95, 64, 1, true);
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.y = 0.55;
  rotundaGroup.add(glassMesh);

  // 32 Postes verticales estilizados en el perímetro lejano
  for (let i = 0; i < 32; i++) {
    const angle = (i * Math.PI) / 16;
    const px = Math.sin(angle) * 13.8;
    const pz = Math.cos(angle) * 13.8;

    const postGeo = new THREE.CylinderGeometry(0.02, 0.025, 1.05, 16);
    const post = new THREE.Mesh(postGeo, bronzeMat);
    post.position.set(px, 0.525, pz);
    rotundaGroup.add(post);

    // Iluminación rasante empotrada en el perímetro exterior (4 focos LED cardinales + 16 luminarias emisivas)
    if (i % 8 === 0) {
      const spot = new THREE.PointLight(0xdfc285, 0.9, 7.0);
      spot.position.set(px * 0.96, 0.08, pz * 0.96);
      rotundaGroup.add(spot);
    }

    const fixtureGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.015, 16);
    const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xdfc285 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.position.set(px * 0.96, 0.015, pz * 0.96);
    rotundaGroup.add(fixture);
  }

  // 5. ARCOS MONUMENTALES DE LA RANURA DE CÚPULA (R = 26.0m, Y = 22.0m)
  // Dos arcos colosales que enmarcan la apertura cenital al universo infinito
  [-7.5, 7.5].forEach(archX => {
    const archPoints = [];
    const steps = 24;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const angle = (t - 0.5) * Math.PI * 0.88;
      const az = Math.sin(angle) * 26.0;
      const ay = Math.cos(angle) * 22.0;
      archPoints.push(new THREE.Vector3(archX, Math.max(0, ay), az));
    }
    const archCurve = new THREE.CatmullRomCurve3(archPoints);
    const archGeo = new THREE.TubeGeometry(archCurve, 32, 0.12, 8, false);
    const archMesh = new THREE.Mesh(archGeo, titaniumMat);
    rotundaGroup.add(archMesh);

    // Balizas de señalización astronómica en la cima de los arcos
    const beacon = new THREE.PointLight(0xf43f5e, 1.2, 12.0);
    beacon.position.set(archX, 22.0, 0);
    rotundaGroup.add(beacon);

    const beaconSphere = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
    beaconSphere.position.set(archX, 22.0, 0);
    rotundaGroup.add(beaconSphere);
  });

  scene.add(rotundaGroup);
}

// ── CREACIÓN DE ASTRO CON ANILLO DE TIMONEL & MODELO MATEMÁTICO REAL ─
function createLivingMathematicalAstro(data, index) {
  const astroGroup = new THREE.Group();
  
  // ── DILATACIÓN MÉTRICA Y ARQUITECTURA CELESTIAL POR PABELLONES ──
  // Distribución armónica en 5 sectores celestes (20 obras por época)
  const epoch = data.epoch || (Math.floor(index / 20) + 1);
  const j = index % 20;
  const col = j % 5;
  const tier = Math.floor(j / 5);
  
  // Azimut base del sector de la época con separación de 30° entre pabellones
  const epochBaseTheta = (epoch - 1) * (Math.PI * 2 / 5) - Math.PI / 2;
  const theta = epochBaseTheta + (col - 2) * 0.115 * Math.PI;
  
  // Elevación escalonada sobre la rotonda de basalto (25° a 70°)
  const phi = 0.14 * Math.PI + tier * 0.08 * Math.PI;
  
  // Radio dilatado profundo (62m a 101m) escalonado en profundidad para eliminar oclusiones
  const radius = 62.0 + (col % 2) * 18.0 + tier * 7.0;

  const x = radius * Math.cos(phi) * Math.sin(theta);
  const y = radius * Math.sin(phi);
  const z = -radius * Math.cos(phi) * Math.cos(theta);
  astroGroup.position.set(x, y, z);

  // Escala basal del grupo en reposo (R = 1.0m, reduciendo ruido visual un 40% a la distancia)
  astroGroup.scale.set(0.85, 0.85, 0.85);

  // 1. Anillo de Confinamiento Métrico de Timonel (esbelto y translúcido en reposo)
  const ringGeo = new THREE.RingGeometry(1.58, 1.62, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xc5a059, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const timonelRing = new THREE.Mesh(ringGeo, ringMat);
  astroGroup.add(timonelRing);

  // 2. Luz de Resonancia Cálida Orbital (Key & Fill exterior)
  // Lazy dynamic lights: se inicializan ocultas para 0 sobrecosto en shaders forward de WebGL
  const pointLight = new THREE.PointLight(0xdfc285, 1.4, 8.0);
  pointLight.position.set(1.5, 2.0, 2.2);
  pointLight.visible = false;
  astroGroup.add(pointLight);

  const fillLight = new THREE.PointLight(0x60a5fa, 0.8, 6.0);
  fillLight.position.set(-1.6, -1.2, -1.5);
  fillLight.visible = false;
  astroGroup.add(fillLight);

  // 3. Sistema Matemático Físico Real de la Ley
  const mathModel = buildBespokeAstroModel(data.id, data);
  astroGroup.add(mathModel.group);

  scene.add(astroGroup);

  // Desfasar el temporizador inicial para que el cosmos respire de forma asíncrona
  const initialCycleT = (index * 0.72) % 13.0;

  astros24.push({
    data,
    index,
    epoch,
    theta,
    phi,
    radius,
    group: astroGroup,
    worldPos: new THREE.Vector3(x, y, z),
    timonelRing,
    pointLight,
    fillLight,
    model: mathModel,
    cycleT: initialCycleT,
    phase: 'RELAXATION',
    relaxFactor: 0.5,
    residual: null,
    evidenceLevel: 'ILLUSTRATIVE'
  });
}

// ── MODELOS MATEMÁTICOS REALES DE LAS 24 LEYES CON AUTO-RESOLUCIÓN ───
// ── FRONTERAS MONÓTONAS DE EXPLORACIÓN (SIN REPETICIÓN DE CASOS) ───
const UNRESOLVED_FRONTIERS = {
  // Riemann: Búsqueda por bisección entre crestas positivas Z(t) > 0 y valles negativos Z(t) < 0
  riemann: {
    currentT: 14.0,
    lastZVal: 0.1,
    maxPositiveDeviation: 0.0,
    maxNegativeDeviation: 0.0,
    zerosCatalog: [
      14.1347, 21.0220, 25.0108, 30.4248, 32.9350, 37.5861, 40.9187, 43.3270,
      48.0051, 49.7738, 52.9703, 56.4462, 59.3470, 60.8317, 65.1125, 67.0798,
      69.5464, 72.0671, 75.7046, 77.1448, 79.3374, 82.9103, 84.7354, 87.4252
    ],
    verifiedZeroIndex: 0,
    anomaliesFound: 0
  },
  // Beal: Bisección diofántica entre extremos positivos (Aˣ+Bʸ > Cᶻ) y negativos (Aˣ+Bʸ < Cᶻ)
  beal: {
    testedCount: 0,
    currentBase: 3,
    maxPositiveDiff: 0,
    minNegativeDiff: 0,
    solutionFound: false
  },
  // Navier-Stokes: Monitoreo de singularidad de enstrofía extrema
  navier: {
    reynolds: 1200,
    cycleCount: 0,
    maxEnstrophyRatio: 1.0,
    singularityFound: false
  }
};

// ═════════════════════════════════════════════════════════════════════
// 🌌 DELEGACIÓN MODULAR: MOTOR GENERATIVO 3D (museum_models.js)
// Los 37+ constructores procedurales residen en MuseumModels
// ═════════════════════════════════════════════════════════════════════

// ── CONSTRUCTOR PRINCIPAL DEL MODELO DE ASTRO 3D EN R³ ─────────────
function buildBespokeAstroModel(id, data) {
  const group = new THREE.Group();

  const epColor = (data && data.epoch === 1) ? 0xc5a059 :
                 ((data && data.epoch === 2) ? 0x60a5fa :
                 ((data && data.epoch === 3) ? 0x34d399 :
                 ((data && data.epoch === 4) ? 0xa78bfa : 0xf43f5e)));

  // 1. Sintetizar la Variedad Geométrica 3D Volumétrica Auténtica (SSOT)
  const modelKey = (data && data.modelKey) ? data.modelKey : ((data && data.archetype) ? data.archetype : 'lorenz');
  const builders = (typeof MuseumModels !== 'undefined' && MuseumModels.BESPOKE_3D_BUILDERS) ? MuseumModels.BESPOKE_3D_BUILDERS : ((typeof BESPOKE_3D_BUILDERS !== 'undefined') ? BESPOKE_3D_BUILDERS : {});
  const builder = builders[modelKey] || builders.lorenz || (typeof buildLorenz3D === 'function' ? buildLorenz3D : () => ({ group: new THREE.Group(), update: () => {} }));
  const manifold3D = builder(epColor);
  group.add(manifold3D.group);

  // 2. Halo de Confinamiento Exterior Timonel F2
  const haloGeo = new THREE.RingGeometry(1.18, 1.24, 48);
  const haloMat = new THREE.MeshBasicMaterial({ color: epColor, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  group.add(haloMesh);

  // 3. Nube de micro-partículas orbitales esféricas (en R³ completo, no disco plano)
  const N = 48;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = (Math.random() - 0.5) * Math.PI;
    const r = 1.15 + Math.random() * 0.35;
    pPos[i * 3]     = r * Math.cos(ph) * Math.sin(th);
    pPos[i * 3 + 1] = r * Math.sin(ph);
    pPos[i * 3 + 2] = r * Math.cos(ph) * Math.cos(th);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.032, color: epColor, transparent: true, opacity: 0.8 });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  let frameCount = 0;

  const updater = (dt, cycleT, phase, relaxFactor) => {
    // Rotación orbital tridimensional propia (Cero billboarding, 100% perspectiva 3D)
    particles.rotation.y += 0.005;
    particles.rotation.z += 0.003;
    haloMesh.rotation.z += 0.004;

    // Actualización de dinámica interna de la variedad matemática
    if (manifold3D && typeof manifold3D.update === 'function') {
      manifold3D.update(dt, cycleT, phase, relaxFactor);
    }

    // Modulación física por fase de relajación Timonel F2
    if (phase === 'DISPERSION') {
      const entropyShake = Math.sin(cycleT * 18.0) * 0.035;
      manifold3D.group.scale.set(1.0 + entropyShake, 1.0 + entropyShake, 1.0 + entropyShake);
    } else if (phase === 'RELAXATION') {
      const s = 0.95 + 0.05 * relaxFactor;
      manifold3D.group.scale.set(s, s, s);
    } else {
      const pulse = 1.0 + Math.sin(cycleT * 2.8) * 0.015;
      manifold3D.group.scale.set(pulse, pulse, pulse);
    }

    // Integración numérica viva del motor analítico de silicio (AtelierMath)
    if (window.AtelierMath) {
      frameCount++;
      const isFocused = (typeof activeConfinementAstro !== 'undefined' && activeConfinementAstro && activeConfinementAstro.data.id === id);
      const isCollimated = (typeof collimatedAstroIndex !== 'undefined' && collimatedAstroIndex >= 0 && astros24[collimatedAstroIndex] && astros24[collimatedAstroIndex].data.id === id);

      // Cero sobrecosto de CPU: solo integrar el motor 2D en silicio si el astro está enfocado en Confinamiento o colimado en telescopio
      if (isFocused || isCollimated) {
        try {
          window.AtelierMath.step(id);
        } catch (e) {
          // Si el lienzo 2D auxiliar no está enlazado, se omite silenciosamente preservando los 60 FPS
        }
      }
    }
  };

  return { group, update: updater };
}

// ── CONTROL DE PERTURBACIÓN & AUTO-RESOLUCIÓN BAJO DEMANDA ─────────
function perturbCurrentAstro() {
  if (currentFocusedAstro) {
    perturbAstro(currentFocusedAstro);
  } else {
    const curAstro = astros24[nai3D.currentIndex] || astros24[0];
    if (curAstro) perturbAstro(curAstro);
  }
}

function perturbAstro(astro) {
  astro.cycleT = 0; // Desatar choque de entropía inmediato
  astro.timonelRing.scale.set(1.22, 1.22, 1.22);
  setTimeout(() => astro.timonelRing.scale.set(1, 1, 1), 350);
  speakNai("Forma liberada hacia el caos. Observa cómo la ley matemática combate el desorden y vuelve a cristalizar.");
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    if (!isInShopMode) perturbCurrentAstro();
  }
});

// ── NAI SOBERANA EN SILICIO 3D ─────────────────────────────────────
function buildNaiSovereignEntity() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.25, 1),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.85 })
  );
  group.add(core);

  const halo = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.4, 0),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.45 })
  );
  group.add(halo);

  const light = new THREE.PointLight(0xa855f7, 2.0, 9.0);
  group.add(light);

  group.position.set(0, 0, 0);
  scene.add(group);

  nai3D.group = group;
  nai3D.core = core;
  nai3D.outerHalo = halo;
  nai3D.light = light;
}

// ── BAHÍA 3D DE MANUFACTURA ORBITAL ───────────────────────────────
function buildShopBay3D() {
  shopBayGroup = new THREE.Group();
  shopBayGroup.position.set(0, 0, 42.0);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: 0x07060f, roughness: 0.3, metalness: 0.8 })
  );
  pedestal.position.y = -1.6;
  shopBayGroup.add(pedestal);

  const keyLight = new THREE.SpotLight(0xffffff, 2.5, 14, Math.PI / 4, 0.4);
  keyLight.position.set(2, 3, 3);
  shopBayGroup.add(keyLight);

  const fillLight = new THREE.PointLight(0x8b5cf6, 1.8, 8);
  fillLight.position.set(-2.5, 0.5, 2);
  shopBayGroup.add(fillLight);

  createDefaultMasterTexture();

  // 1. Cuadro Fine Art 50x70
  const frameGroup = new THREE.Group();
  const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.1, 0.08), new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.5 }));
  frameGroup.add(outerFrame);

  const matMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 1.98), new THREE.MeshStandardMaterial({ color: 0xf4f1eb, roughness: 0.9 }));
  matMesh.position.z = 0.042;
  frameGroup.add(matMesh);

  const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.6), new THREE.MeshStandardMaterial({ map: activeProductTexture, roughness: 0.4 }));
  canvasMesh.position.z = 0.044;
  canvasMesh.name = "dynamic_canvas_target";
  frameGroup.add(canvasMesh);
  shopProducts.frameWood = frameGroup;
  shopBayGroup.add(frameGroup);

  // 2. Taza Cerámica
  const mugGroup = new THREE.Group();
  const mugCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 48), new THREE.MeshStandardMaterial({ map: activeProductTexture, roughness: 0.25 }));
  mugCyl.name = "dynamic_mug_target";
  mugGroup.add(mugCyl);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 16, 32, Math.PI), new THREE.MeshStandardMaterial({ color: 0x111118 }));
  handle.rotation.z = -Math.PI / 2; handle.position.set(0.55, 0, 0);
  mugGroup.add(handle);
  mugGroup.visible = false;
  shopProducts.mug = mugGroup;
  shopBayGroup.add(mugGroup);

  // 3. Cuaderno
  const bookGroup = new THREE.Group();
  const bookCover = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.7, 0.12), new THREE.MeshStandardMaterial({ map: activeProductTexture, roughness: 0.4 }));
  bookCover.name = "dynamic_book_target";
  bookGroup.add(bookCover);
  bookGroup.visible = false;
  shopProducts.notebook = bookGroup;
  shopBayGroup.add(bookGroup);

  shopBayGroup.visible = false;
  scene.add(shopBayGroup);
}

function createDefaultMasterTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const cx = c.getContext('2d');
  cx.fillStyle = '#06030d'; cx.fillRect(0, 0, 1024, 1024);
  cx.strokeStyle = '#c084fc'; cx.lineWidth = 2;
  cx.strokeRect(30, 30, 964, 964);
  cx.fillStyle = '#e8d2a6'; cx.font = 'bold 38px Cinzel'; cx.textAlign = 'center';
  cx.fillText("ATELIER MATEMÁTICO", 512, 480);
  cx.fillStyle = '#38bdf8'; cx.font = '22px Space Mono';
  cx.fillText("ATLAS DE 100 LEYES · TIMONEL F2", 512, 530);
  activeProductTexture = new THREE.CanvasTexture(c);
}

// ── BOUTIQUE ORBITAL 3D: ENTRAR & SALIR ───────────────────────────
function enterShopMode() {
  if (isInShopMode) return;
  isInShopMode = true;
  savedCameraState.pos.copy(camera.position);
  savedCameraState.quat.copy(camera.quaternion);

  document.getElementById('flight-hud-header').style.opacity = '0';
  document.getElementById('orbital-hud-card').classList.add('opacity-0');
  document.getElementById('capsule-reticle').style.opacity = '0';
  document.getElementById('foyer-screen').classList.add('hidden');

  shopBayGroup.visible = true;
  const overlay = document.getElementById('shop-bay-overlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.style.opacity = '1', 50);

  populateTextureTray();
  speakNai("Entrando a la Bahía de Manufactura 3D. Elige un producto e inspecciónalo en 360 grados.");
}

function exitShopMode() {
  if (!isInShopMode) return;
  isInShopMode = false;
  const overlay = document.getElementById('shop-bay-overlay');
  overlay.style.opacity = '0';
  setTimeout(() => { overlay.classList.add('hidden'); shopBayGroup.visible = false; }, 700);

  document.getElementById('flight-hud-header').style.opacity = '1';
  document.getElementById('capsule-reticle').style.opacity = '1';

  velocity.set(0, 0, 0);
  camera.position.copy(savedCameraState.pos);
  camera.quaternion.copy(savedCameraState.quat);
}

function switch3DProduct(type) {
  currentProductType = type;
  shopProducts.frameWood.visible = (type === 'frame_wood' || type === 'frame_acrylic');
  shopProducts.mug.visible = (type === 'mug');
  shopProducts.notebook.visible = (type === 'notebook');

  ['frame-wood', 'frame-acrylic', 'mug', 'notebook'].forEach(id => {
    const btn = document.getElementById(`btn-prod-${id}`);
    if (btn) { btn.classList.remove('bg-purple-600', 'text-white'); btn.classList.add('text-slate-400'); }
  });
  const activeBtn = document.getElementById(`btn-prod-${type.replace('_', '-')}`);
  if (activeBtn) { activeBtn.classList.remove('text-slate-400'); activeBtn.classList.add('bg-purple-600', 'text-white'); }

  const title = document.getElementById('shop-prod-title');
  const price = document.getElementById('shop-prod-price');
  const cat = document.getElementById('shop-prod-category');

  if (type === 'frame_wood') {
    cat.textContent = "EDICIÓN DE GALERÍA FIRMADA"; title.textContent = "Cuadro Fine Art 50×70 cm"; price.textContent = "$68.000 CLP";
  } else if (type === 'frame_acrylic') {
    cat.textContent = "EDICIÓN LUXURY EN ACRÍLICO"; title.textContent = "Cuadro Acrílico 40×60 cm"; price.textContent = "$120.000 CLP";
  } else if (type === 'mug') {
    cat.textContent = "MERCHANDISING OFICIAL"; title.textContent = "Taza Cerámica Negra Mate"; price.textContent = "$16.900 CLP";
  } else if (type === 'notebook') {
    cat.textContent = "CUADERNO DE FÓRMULAS"; title.textContent = "Cuaderno Moleskine de Campo"; price.textContent = "$22.000 CLP";
  }
}

function populateTextureTray() {
  const tray = document.getElementById('texture-tray-carousel');
  tray.innerHTML = '';

  // Fotos del Carrete
  userCameraRoll.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-purple-500/40 hover:border-cyan-400 transition relative';
    btn.innerHTML = `<img src="${item.img}" class="w-full h-full object-cover" /><span class="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] mono text-purple-200 text-center truncate">Tu Foto</span>`;
    btn.onclick = () => projectTextureOntoProduct(item.img);
    tray.appendChild(btn);
  });

  // 24 Leyes Maestras
  ARTWORKS_24.forEach((astro) => {
    const btn = document.createElement('button');
    btn.className = 'w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 hover:border-purple-400 transition bg-black/60 p-1 flex flex-col justify-center items-center text-center';
    btn.innerHTML = `<span class="text-xs font-bold text-cyan-300 mono">${astro.badge}</span><span class="text-[7.5px] mono text-slate-300 leading-tight truncate w-full">${astro.title}</span>`;
    btn.onclick = () => projectMasterArtOntoProduct(astro);
    tray.appendChild(btn);
  });
}

function projectTextureOntoProduct(imgSrc) {
  const img = new Image();
  img.onload = () => {
    const tex = new THREE.Texture(img);
    tex.needsUpdate = true;
    updateProductMaterials(tex);
    speakNai("Proyectando captura sobre el objeto 3D.");
  };
  img.src = imgSrc;
}

function projectMasterArtOntoProduct(astro) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const cx = c.getContext('2d');
  cx.fillStyle = '#06030d'; cx.fillRect(0, 0, 1024, 1024);
  cx.strokeStyle = '#c5a059'; cx.lineWidth = 4; cx.strokeRect(40, 40, 944, 944);
  cx.fillStyle = '#e8d2a6'; cx.font = 'bold 36px Cinzel'; cx.textAlign = 'center';
  cx.fillText(astro.title.toUpperCase(), 512, 450);
  cx.fillStyle = '#38bdf8'; cx.font = '22px Space Mono';
  cx.fillText(astro.cat, 512, 500);
  cx.fillStyle = '#94a3b8'; cx.font = '16px Space Mono';
  cx.fillText(astro.metric, 512, 550);
  const tex = new THREE.CanvasTexture(c);
  updateProductMaterials(tex);
  speakNai(`Proyectando ${astro.title} en el objeto.`);
}

function updateProductMaterials(tex) {
  shopBayGroup.traverse((child) => {
    if (child.name && child.name.startsWith("dynamic_")) {
      child.material.map = tex;
      child.material.needsUpdate = true;
    }
  });
  targetProductRotation.y += Math.PI * 0.5;
}

function processDirectCheckout() {
  const name = document.getElementById('order-name').value.trim();
  const address = document.getElementById('order-address').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  if (!name || !address || !phone) {
    alert('Por favor completa tu Nombre, Dirección de despacho y WhatsApp.');
    return;
  }
  const prodName = document.getElementById('shop-prod-title').textContent;
  const price = document.getElementById('shop-prod-price').textContent;
  const msg = encodeURIComponent(
    `*ATELIER MATEMÁTICO — ENCARGO DE AUTOR*\n\n` +
    `· Cliente: ${name}\n` +
    `· Despacho: ${address}\n` +
    `· WhatsApp: ${phone}\n` +
    `· Obra: ${prodName}\n` +
    `· Inversión: ${price}\n` +
    `· Nodo Timonel: #${swarmNodeId}\n` +
    `· Plazo estimado: Confección a pedido (10-15 días hábiles)\n\n` +
    `Hola Matías, he configurado mi encargo desde la Rotonda del Atelier Matemático. Deseo coordinar el anticipo para iniciar la manufactura.`
  );
  window.open(`https://wa.me/56900000000?text=${msg}`, '_blank');
}

// ── SELECTOR DE SALTO RÁPIDO A LOS 24 ASTROS ──────────────────────
function populateNaiAstroSelector() {
  const container = document.getElementById('nai-astro-selector');
  if (!container) return;
  container.innerHTML = '';
  ARTWORKS_24.forEach((astro, idx) => {
    const btn = document.createElement('button');
    btn.className = 'text-[9px] mono text-purple-300 hover:text-white glass px-2 py-0.5 rounded-full border-white/10 shrink-0 transition';
    btn.textContent = `${astro.badge} · ${astro.title.split(' ')[0]}`;
    btn.onclick = () => propelToAstro(idx);
    container.appendChild(btn);
  });
}

// ── MINIMIZAR / EXPANDIR FICHA DE LA OBRA ──────────────────────────
let isHudMinimized = false;
function toggleHudCardMinimize() {
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

// ── MODOS DE OPERACIÓN DEL OBSERVATORIO ASTRONÓMICO ───────────────
const MODE_ROTUNDA_TELESCOPE = 0;
const MODE_SPHERE_CONFINEMENT = 1;
let currentMuseumMode = MODE_ROTUNDA_TELESCOPE;

// Navegación sobre la cubierta monumental de basalto de Paranal (altura de ojos: 1.65m sobre origen)
const platformObserverPos = new THREE.Vector3(0, 1.65, 0);
const targetPlatformPos = new THREE.Vector3(0, 1.65, 0);
let isPointerLocked = false;
const keysPressed = {};
let collimatedAstroIndex = -1;

// Coordenadas esféricas S² de la cámara en la burbuja de confinamiento
let activeConfinementAstro = null;
let sphereRadius = 3.6;
let sphereTheta = 0.0;
let spherePhi = Math.PI / 2.2;
let targetSphereTheta = 0.0;
let targetSpherePhi = Math.PI / 2.2;
let targetSphereRadius = 3.6;

function propelToAstro(idx) {
  warpToTargetAstro(idx);
}

// Static reusable vectors to avoid GC pauses
const _collimationLookDir = new THREE.Vector3();
const _collimationToA = new THREE.Vector3();
// ── SISTEMA DE SERVOMOTORES Y APUNTADO GOTO DEL TELESCOPIO (TIMONEL F2) ─
function playServoSound() {
  try {
    if (!telescopeAudioCtx) {
      telescopeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (telescopeAudioCtx.state === 'suspended') {
      telescopeAudioCtx.resume();
    }
    const now = telescopeAudioCtx.currentTime;
    const osc = telescopeAudioCtx.createOscillator();
    const gain = telescopeAudioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(245, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.95);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
    osc.connect(gain);
    gain.connect(telescopeAudioCtx.destination);
    osc.start();
    osc.stop(now + 1.15);
  } catch (e) {}
}

function slewTelescopeToTarget(targetIdx, andWarp = false) {
  if (targetIdx < 0 || targetIdx >= astros24.length) return;
  const astro = astros24[targetIdx];
  collimatedAstroIndex = targetIdx;

  // 1. Cinemática ecuatorial exacta: rotación polar por -latitud en X
  const tx = astro.worldPos.x, ty = astro.worldPos.y, tz = astro.worldPos.z;
  let dx = tx - 0, dy = ty - 2.8, dz = tz - 5.0;
  const len = Math.hypot(dx, dy, dz) || 1.0;
  dx /= len; dy /= len; dz /= len;

  const px = dx;
  const py = COS_LAT * dy + SIN_LAT * dz;
  const pz = -SIN_LAT * dy + COS_LAT * dz;

  const ha = Math.atan2(px, pz);
  const dec = Math.atan2(Math.sin(ha)*px + Math.cos(ha)*pz, py);

  targetTelescopeAngles.ha = ha;
  targetTelescopeAngles.dec = dec;
  isTelescopeSlewing = true;
  slewStartTime = performance.now();
  slewStartAngles.ha = currentTelescopeAngles.ha;
  slewStartAngles.dec = currentTelescopeAngles.dec;

  // 2. Alinear cámara del observador hacia la fórmula seleccionada
  const camDir = new THREE.Vector3().subVectors(astro.worldPos, camera.position).normalize();
  targetOrientation.yaw = Math.atan2(-camDir.x, -camDir.z);
  targetOrientation.pitch = Math.asin(Math.max(-0.45, Math.min(1.48, camDir.y)));
  userInertiaTimer = 0;

  // 3. Audio de servomotores industriales de precisión
  playServoSound();

  // 4. Actualizar pantalla táctil del pedestal
  updateTelescopeScreenTexture(astro.data);

  // 5. Cerrar consola GoTo si estaba abierta
  closeTelescopeGotoTerminal();

  // 6. Actualizar status en interfaz
  const statusEl = document.getElementById('goto-current-status');
  if (statusEl) statusEl.textContent = `Alineando con Obra ${astro.data.badge}: ${astro.data.title}`;

  if (andWarp) {
    setTimeout(() => {
      warpToTargetAstro(targetIdx);
    }, 1150);
  }
}

function openTelescopeGotoTerminal() {
  isTelescopeModalOpen = true;
  const modal = document.getElementById('telescope-goto-modal');
  if (modal) {
    modal.classList.remove('hidden');
    renderGotoCatalog();
    const searchInput = document.getElementById('goto-search-input');
    if (searchInput) {
      searchInput.value = '';
      gotoSearchQuery = '';
      setTimeout(() => searchInput.focus(), 50);
    }
  }
  if (document.pointerLockElement && document.exitPointerLock) {
    document.exitPointerLock();
  }
}

function closeTelescopeGotoTerminal() {
  isTelescopeModalOpen = false;
  const modal = document.getElementById('telescope-goto-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function toggleTelescopeGotoTerminal() {
  if (isTelescopeModalOpen) {
    closeTelescopeGotoTerminal();
  } else {
    openTelescopeGotoTerminal();
  }
}

function renderGotoCatalog() {
  const container = document.getElementById('goto-catalog-container');
  if (!container) return;

  const q = gotoSearchQuery.toLowerCase().trim();
  const filtered = astros24.filter(astro => {
    const d = astro.data;
    if (gotoEpochFilter > 0 && d.epoch !== gotoEpochFilter) return false;
    if (q) {
      const match = (
        d.title.toLowerCase().includes(q) ||
        d.sub.toLowerCase().includes(q) ||
        d.cat.toLowerCase().includes(q) ||
        (d.author && d.author.toLowerCase().includes(q)) ||
        d.eq.toLowerCase().includes(q) ||
        d.badge.includes(q)
      );
      if (!match) return false;
    }
    return true;
  });

  const countEl = document.getElementById('goto-visible-count');
  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-[#71717a] mono text-xs">
        No se encontraron fórmulas que coincidan con "${gotoSearchQuery}".<br>
        Intenta buscar por científico (ej: Navier, Hooke, Newton, Fermat) o selecciona "Todas".
      </div>
    `;
    return;
  }

  const epochLabels = {
    1: 'I. Clásica',
    2: 'II. Ilustración',
    3: 'III. Termodinámica',
    4: 'IV. Cuántica',
    5: 'V. Caos & Milenio'
  };

  container.innerHTML = filtered.map(astro => {
    const d = astro.data;
    const isTargeted = collimatedAstroIndex === astro.index;
    
    const ascHours = Math.floor(((d.theta + Math.PI) / (Math.PI * 2)) * 24);
    const ascMins = Math.floor(((((d.theta + Math.PI) / (Math.PI * 2)) * 24) % 1) * 60);
    const decDeg = Math.floor((d.phi / (Math.PI / 2)) * 90);
    const decSign = decDeg >= 0 ? '+' : '';
    const dist = camera.position.distanceTo(astro.worldPos).toFixed(1);

    return `
      <div class="bg-[#12131b] hover:bg-[#161724] border ${isTargeted ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.25)]' : 'border-white/[0.06]'} rounded-2xl p-4 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5 flex-1 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-black/40 border border-[#c5a059]/30 flex items-center justify-center shrink-0">
            <span class="mono text-xs font-bold text-[#c5a059]">${d.badge}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h3 class="serif text-sm font-semibold text-[#f4f1ea] truncate">${d.title}</h3>
              <span class="text-[9px] mono px-2 py-0.2 rounded-full bg-white/5 text-[#a1a1aa] border border-white/5">${epochLabels[d.epoch] || 'Época'}</span>
              ${isTargeted ? '<span class="text-[9px] mono px-2 py-0.2 rounded-full bg-[#c5a059]/20 text-[#dfc285] font-semibold animate-pulse">● EN MIRA</span>' : ''}
            </div>
            <div class="text-[11px] mono text-[#a1a1aa] truncate">${d.sub} · <span class="text-[#c5a059]">${d.cat}</span></div>
            <div class="text-[10px] mono text-[#71717a] mt-1 flex flex-wrap items-center gap-3">
              <span>Asc: <strong class="text-[#f4f1ea]">${String(ascHours).padStart(2,'0')}h ${String(ascMins).padStart(2,'0')}m</strong></span>
              <span>·</span>
              <span>Dec: <strong class="text-[#f4f1ea]">${decSign}${decDeg}°</strong></span>
              <span>·</span>
              <span>Dist: <strong class="text-[#f4f1ea]">${dist}m</strong></span>
              <span>·</span>
              <span class="text-[#dfc285] font-mono">${d.eqShort || d.eq}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button onclick="slewTelescopeToTarget(${astro.index}, false)" class="bg-[#181924] hover:bg-[#c5a059]/20 text-[#dfc285] hover:text-white border border-[#c5a059]/40 text-xs px-3.5 py-2 rounded-xl mono transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap">
            <span>🔭</span>
            <span>Apuntar GoTo</span>
          </button>
          <button onclick="slewTelescopeToTarget(${astro.index}, true)" class="bg-[#c5a059] hover:bg-[#dfc285] text-[#08080a] text-xs font-bold px-4 py-2 rounded-xl mono uppercase tracking-wider transition shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <span>🚀</span>
            <span>Entrar</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterGotoCatalog() {
  const input = document.getElementById('goto-search-input');
  if (input) {
    gotoSearchQuery = input.value;
    renderGotoCatalog();
  }
}

function setGotoEpochFilter(epochId) {
  gotoEpochFilter = epochId;
  for (let i = 0; i <= 5; i++) {
    const btn = document.getElementById(`btn-goto-epoch-${i}`);
    if (btn) {
      if (i === epochId) {
        btn.className = "px-3 py-1.5 rounded-lg text-xs mono transition bg-[#c5a059] text-[#08080a] font-semibold whitespace-nowrap cursor-pointer";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg text-xs mono transition bg-[#14151f] hover:bg-white/10 text-[#a1a1aa] border border-white/5 whitespace-nowrap cursor-pointer";
      }
    }
  }
  renderGotoCatalog();
}

// ── CÁLCULO DE COLIMACIÓN ASTRONÓMICA CON TELESCOPIO (MODO ROTONDA) ──
function updateTelescopeCollimation() {
  if (currentMuseumMode !== MODE_ROTUNDA_TELESCOPE || isInShopMode) return;
  _collimationLookDir.set(0, 0, -1).applyQuaternion(camera.quaternion);

  let bestIdx = -1;
  let bestDot = Math.cos(15 * Math.PI / 180); // Cono de 15 grados para apuntado astronómico ágil y fluido

  for (let idx = 0; idx < astros24.length; idx++) {
    const a = astros24[idx];
    if (!a.group.visible) continue; // Respetar filtro de época activo
    _collimationToA.subVectors(a.worldPos, camera.position).normalize();
    const dot = _collimationLookDir.dot(_collimationToA);
    if (dot > bestDot) {
      bestDot = dot;
      bestIdx = idx;
    }
  }

  collimatedAstroIndex = bestIdx;
  const card = document.getElementById('telescope-target-card');
  const reticle = document.getElementById('capsule-reticle');

  if (bestIdx >= 0) {
    const astro = astros24[bestIdx];
    const d = astro.data;
    const dist = camera.position.distanceTo(astro.worldPos).toFixed(1);
    
    // Coordenadas celestes de ascensión recta y declinación
    const ascHours = Math.floor(((d.theta + Math.PI) / (Math.PI * 2)) * 24);
    const ascMins = Math.floor(((((d.theta + Math.PI) / (Math.PI * 2)) * 24) % 1) * 60);
    const decDeg = Math.floor((d.phi / (Math.PI / 2)) * 90);
    const decSign = decDeg >= 0 ? '+' : '';

    const coordEl = document.getElementById('collimator-coord');
    const titleEl = document.getElementById('collimator-title');
    const epInfo = d.epistemology;
    const epTag = epInfo ? ` · [${epInfo.category === 'A' ? 'FÍSICA ℝ³' : (epInfo.category === 'B' ? 'ESPACIO FASES' : 'PROY. CANÓNICA')}]` : '';
    if (subEl)   subEl.textContent   = `${d.sub}${epTag} · Distancia: ${dist}m`;
    
    if (card) card.classList.remove('hidden');
    if (reticle) reticle.classList.add('locked');
  } else {
    if (card) card.classList.add('hidden');
    if (reticle) reticle.classList.remove('locked');
  }
}

// ── VIAJE TELESCÓPICO HACIA LA BURBUJA S² DE LA LEY ────────────────
function warpToTargetAstro(idx) {
  let targetIdx;
  if (typeof idx === 'number') {
    if (idx >= 0 && idx < astros24.length && astros24[idx].data.id === idx) {
      targetIdx = idx;
    } else {
      const found = astros24.findIndex(a => a.data.id === idx);
      targetIdx = found !== -1 ? found : idx;
    }
  } else {
    targetIdx = collimatedAstroIndex;
  }
  if (targetIdx < 0 || targetIdx >= astros24.length) return;
  const astro = astros24[targetIdx];
  activeConfinementAstro = astro;
  currentFocusedAstro = astro;
  currentMuseumMode = MODE_SPHERE_CONFINEMENT;
  isHudMinimized = false;
  if (document.pointerLockElement && document.exitPointerLock) {
    document.exitPointerLock();
  }

  // Orientación esférica inicial desde el vector actual para entrada suave
  const rel = new THREE.Vector3().subVectors(camera.position, astro.worldPos);
  targetSphereRadius = 3.6;
  targetSphereTheta = Math.atan2(rel.x, rel.z);
  targetSpherePhi = Math.acos(Math.max(-0.95, Math.min(0.95, rel.y / (rel.length() || 3.6))));
  sphereTheta = targetSphereTheta;
  spherePhi = targetSpherePhi;
  sphereRadius = 3.6;

  const center = astro.worldPos;
  camera.position.set(
    center.x + sphereRadius * Math.sin(spherePhi) * Math.sin(sphereTheta),
    center.y + sphereRadius * Math.cos(spherePhi),
    center.z + sphereRadius * Math.sin(spherePhi) * Math.cos(sphereTheta)
  );
  camera.lookAt(center);

  // ── AISLAMIENTO LUMÍNICO EN MODO CONFINAMIENTO (FOCUS MODE) ──
  // La ley activa adquiere protagonismo total a escala 1.0.
  // El resto del cosmos se atenúa al 4% de opacidad y apaga luces para eliminar ruido visual.
  astro.group.scale.set(1.0, 1.0, 1.0);
  astros24.forEach(a => {
    if (a === astro) {
      a.group.visible = true;
      a.timonelRing.material.opacity = 0.85;
      if (a.pointLight) a.pointLight.intensity = 2.0;
      if (a.fillLight) a.fillLight.intensity = 1.0;
      if (a.model && a.model.group) {
        a.model.group.traverse(child => {
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 1.0;
          }
        });
      }
    } else {
      a.timonelRing.material.opacity = 0.02;
      if (a.pointLight) a.pointLight.intensity = 0.0;
      if (a.fillLight) a.fillLight.intensity = 0.0;
      if (a.model && a.model.group) {
        a.model.group.traverse(child => {
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 0.04;
          }
        });
      }
    }
  });

  // Actualizar visibilidad de HUDs y ocultar retícula para despejar la fórmula
  const reticle = document.getElementById('capsule-reticle');
  if (reticle) reticle.style.display = 'none';

  const colHud = document.getElementById('telescope-collimator-hud');
  if (colHud) colHud.classList.add('hidden');

  const colCard = document.getElementById('telescope-target-card');
  if (colCard) colCard.classList.add('hidden');
  const returnBar = document.getElementById('confinement-return-bar');
  if (returnBar) returnBar.classList.remove('hidden');
  const swarmPill = document.getElementById('swarm-telemetry-pill');
  if (swarmPill) swarmPill.classList.add('hidden');
  const reopenBtn = document.getElementById('btn-reopen-hud');
  if (reopenBtn) reopenBtn.classList.add('hidden');
  const epochBar = document.getElementById('epoch-filter-bar');
  if (epochBar) epochBar.classList.add('hidden');

  // Silenciar presencia visual de NAI centinela en confinamiento para dar 100% protagonismo a la escultura
  if (nai3D.group) nai3D.group.visible = false;

  // Mostrar tarjeta de telemetría de la ley
  const hudCard = document.getElementById('orbital-hud-card');
  if (hudCard) {
    const d = astro.data;
    const catEl = document.getElementById('hud-cat'); if (catEl) catEl.textContent = d.cat || '';
    const solverEl = document.getElementById('hud-solver'); if (solverEl) solverEl.textContent = d.metric || '';
    const titleEl = document.getElementById('hud-title'); if (titleEl) titleEl.textContent = d.title || '';
    const subEl = document.getElementById('hud-sub'); if (subEl) subEl.textContent = d.sub || '';
    const eqEl = document.getElementById('hud-eq'); if (eqEl) eqEl.innerHTML = (d.eq || '').replace(/\n/g, '<br>');
    const histEl = document.getElementById('hud-hist'); if (histEl) histEl.textContent = d.hist || '';

    // Gobernanza Epistemológica Fidedigna (SSOT desde artworks_catalog.js)
    const epInfo = d.epistemology;
    const epPill = document.getElementById('hud-epistemology-pill');
    if (epPill && epInfo) {
      epPill.classList.remove('hidden');
      if (epInfo.category === 'A') {
        epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
        epPill.innerHTML = `<div class="font-bold text-emerald-400 mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-emerald-200/80 font-sans">${epInfo.desc}</div>`;
      } else if (epInfo.category === 'B') {
        epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-amber-950/40 border-amber-500/40 text-amber-300';
        epPill.innerHTML = `<div class="font-bold text-[#dfc285] mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-amber-200/80 font-sans">${epInfo.desc}</div>`;
      } else {
        epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-purple-950/50 border-purple-500/40 text-purple-300';
        epPill.innerHTML = `<div class="font-bold text-fuchsia-300 mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-purple-200/90 font-sans">${epInfo.desc}</div>`;
      }
    } else if (epPill) {
      epPill.classList.add('hidden');
    }

    hudCard.classList.remove('opacity-0', 'translate-x-8', 'pointer-events-none');
    hudCard.style.opacity = '1';
    hudCard.style.transform = 'none';
  }

  speakNai(`Telescopio colimado. Confinando órbita de ${astro.data.title}.`);
}

// ── REGRESO A LA ROTONDA DE BASALTO (PLATAFORMA DEL TELESCOPIO) ────
function returnToRotunda() {
  currentMuseumMode = MODE_ROTUNDA_TELESCOPE;
  activeConfinementAstro = null;
  currentFocusedAstro = null;

  targetPlatformPos.set(0, 1.65, 0);
  platformObserverPos.set(0, 1.65, 0);
  camera.position.set(0, 1.65, 0);

  // Restaurar luminosidad y opacidad según el filtro de época activo
  applyEpochFilter(currentActiveEpoch);

  // Restaurar retícula central de apuntado astronómico y barra de navegación
  const reticle = document.getElementById('capsule-reticle');
  if (reticle) reticle.style.display = 'block';

  const colHud = document.getElementById('telescope-collimator-hud');
  if (colHud) colHud.classList.remove('hidden');

  const returnBar = document.getElementById('confinement-return-bar');
  if (returnBar) returnBar.classList.add('hidden');
  const swarmPill = document.getElementById('swarm-telemetry-pill');
  if (swarmPill) swarmPill.classList.remove('hidden');
  const reopenBtn = document.getElementById('btn-reopen-hud');
  if (reopenBtn) reopenBtn.classList.add('hidden');
  const epochBar = document.getElementById('epoch-filter-bar');
  if (epochBar) epochBar.classList.remove('hidden');
  const hudCard = document.getElementById('orbital-hud-card');
  if (hudCard) hudCard.classList.add('opacity-0', 'translate-x-8', 'pointer-events-none');

  // Reactivar centinela NAI en la rotonda
  if (nai3D.group) nai3D.group.visible = true;

  speakNai("Regresando a la plataforma de observación de la rotonda.");
}

// ── FILTRO ACTIVO DE ÉPOCAS / CONSTELACIONES CELESTES ──────────────
let currentActiveEpoch = 0; // 0: Todas (100), 1..5: Épocas I..V

function filterEpoch(epochId) {
  currentActiveEpoch = epochId;
  applyEpochFilter(epochId);

  // Actualizar estilos de los botones de filtro
  for (let e = 0; e <= 5; e++) {
    const btn = document.getElementById(`epoch-btn-${e}`);
    if (btn) {
      if (e === epochId) {
        btn.className = "epoch-filter-pill active px-3 py-1 rounded-full text-[11px] mono transition bg-[#c5a059] text-[#08080a] font-semibold shadow-md";
      } else {
        btn.className = "epoch-filter-pill px-3 py-1 rounded-full text-[11px] mono transition text-[#a1a1aa] hover:text-[#f4f1ea]";
      }
    }
  }

  // Si el usuario está en la rotonda y selecciona una época, rotar la vista suavemente hacia ese sector
  if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE && epochId >= 1) {
    const epochBaseTheta = (epochId - 1) * (Math.PI * 2 / 5) - Math.PI / 2;
    if (typeof targetOrientation !== 'undefined' && typeof orientation !== 'undefined') {
      targetOrientation.yaw = -epochBaseTheta;
      targetOrientation.pitch = 0.28;
      orientation.yaw = -epochBaseTheta;
      orientation.pitch = 0.28;
    }
  }
}

function applyEpochFilter(epochId) {
  astros24.forEach(a => {
    const isVisible = (epochId === 0 || a.epoch === epochId);
    a.group.visible = isVisible;
    a.group.scale.set(0.85, 0.85, 0.85);
    a.timonelRing.material.opacity = isVisible ? 0.35 : 0.0;
    if (a.pointLight) a.pointLight.intensity = isVisible ? 1.4 : 0.0;
    if (a.fillLight) a.fillLight.intensity = isVisible ? 0.8 : 0.0;
    if (a.model && a.model.group) {
      a.model.group.traverse(child => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = isVisible ? 1.0 : 0.0;
        }
      });
    }
  });
}

if (typeof window !== 'undefined') {
  window.filterEpoch = filterEpoch;
  window.applyEpochFilter = applyEpochFilter;
}

// ── CONTROLES INERCIALES DE TELESCOPIO & BURBUJA ESFÉRICA S² ──────
let currentMouseScreenPos = { x: -1, y: -1 };

function togglePointerLock() {
  const canvas = document.getElementById('webgl-canvas');
  if (!document.pointerLockElement) {
    if (canvas && canvas.requestPointerLock) {
      canvas.requestPointerLock();
    }
  } else {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }
}

if (typeof window !== 'undefined') {
  window.togglePointerLock = togglePointerLock;
}

if (typeof document !== 'undefined') {
  document.addEventListener('pointerlockchange', () => {
    const canvas = document.getElementById('webgl-canvas');
    isPointerLocked = (document.pointerLockElement === canvas);
    const badge = document.getElementById('pointer-lock-badge');
    const reticle = document.getElementById('capsule-reticle');
    if (badge) {
      if (isPointerLocked) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
    if (reticle) {
      if (isPointerLocked) {
        reticle.classList.add('locked');
      } else {
        reticle.classList.remove('locked');
      }
    }
  });
}

if (typeof window !== 'undefined') {
  window.openTelescopeGotoTerminal = openTelescopeGotoTerminal;
  window.closeTelescopeGotoTerminal = closeTelescopeGotoTerminal;
  window.toggleTelescopeGotoTerminal = toggleTelescopeGotoTerminal;
  window.setGotoEpochFilter = setGotoEpochFilter;
  window.filterGotoCatalog = filterGotoCatalog;
  window.slewTelescopeToTarget = slewTelescopeToTarget;
}

function setup6DOFControls() {
  let lastPointer = null;
  let isPointerDown = false;
  let dragStartPos = { x: 0, y: 0 };
  let hasDragged = false;

  window.addEventListener('mousedown', (e) => {
    if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #telescope-collimator-hud, #confinement-return-bar, #epoch-filter-bar, button, a, select, input, #pointer-lock-badge')) return;
    isPointerDown = true;
    hasDragged = false;
    dragStartPos = { x: e.clientX, y: e.clientY };
    lastPointer = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isPointerDown = false;
    lastPointer = null;
  });

  window.addEventListener('mousemove', (e) => {
    currentMouseScreenPos.x = e.clientX;
    currentMouseScreenPos.y = e.clientY;

    // 1. MODO POINTER LOCK ACTIVO (100% CONTROL DIRECTO DE MIRA TELESCÓPICA)
    if (document.pointerLockElement === document.getElementById('webgl-canvas')) {
      const sens = 0.0022;
      userInertiaTimer = 0;
      targetOrientation.yaw -= (e.movementX || 0) * sens;
      targetOrientation.pitch -= (e.movementY || 0) * sens;
      targetOrientation.pitch = Math.max(-0.45, Math.min(1.52, targetOrientation.pitch));
      return;
    }

    if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #telescope-collimator-hud, #confinement-return-bar, #epoch-filter-bar, button, a, select, input, #pointer-lock-badge')) {
      lastPointer = null;
      return;
    }

    if (lastPointer === null) {
      lastPointer = { x: e.clientX, y: e.clientY };
      return;
    }

    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    lastPointer = { x: e.clientX, y: e.clientY };

    if (Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y) > 4) {
      hasDragged = true;
    }

    // Permite rotación tanto arrastrando (click-drag) como mediante barrido fluido
    const sensitivity = isPointerDown ? 0.0055 : 0.0035;

    if (isInShopMode) {
      targetProductRotation.y += dx * 0.01;
      targetProductRotation.x += dy * 0.01;
    } else if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
      userInertiaTimer = 0;
      targetOrientation.yaw -= dx * sensitivity;
      targetOrientation.pitch -= dy * sensitivity;
      targetOrientation.pitch = Math.max(-0.45, Math.min(1.52, targetOrientation.pitch));
    } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
      userInertiaTimer = 0;
      targetSphereTheta -= dx * (isPointerDown ? 0.0065 : 0.0045);
      targetSpherePhi   -= dy * (isPointerDown ? 0.0065 : 0.0045);
      targetSpherePhi   = Math.max(0.08, Math.min(Math.PI - 0.08, targetSpherePhi));
    }
  });

  window.addEventListener('mouseleave', () => {
    isPointerDown = false;
    lastPointer = null;
    currentMouseScreenPos.x = -1;
    currentMouseScreenPos.y = -1;
  });

  // Soporte táctil fluido en trackpads y móviles
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (lastPointer === null) {
        lastPointer = { x: touch.clientX, y: touch.clientY };
        return;
      }
      const dx = touch.clientX - lastPointer.x;
      const dy = touch.clientY - lastPointer.y;
      lastPointer = { x: touch.clientX, y: touch.clientY };

      if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
        targetOrientation.yaw -= dx * 0.0045;
        targetOrientation.pitch -= dy * 0.0045;
        targetOrientation.pitch = Math.max(-0.45, Math.min(1.52, targetOrientation.pitch));
      } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
        targetSphereTheta -= dx * 0.0055;
        targetSpherePhi   -= dy * 0.0055;
        targetSpherePhi   = Math.max(0.08, Math.min(Math.PI - 0.08, targetSpherePhi));
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    lastPointer = null;
  });

  // Clic directo: si se está mirando una fórmula y se hace clic, o clic con raycaster en el cielo, entrar directo
  window.addEventListener('click', (e) => {
    if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #confinement-return-bar, #epoch-filter-bar, #telescope-proximity-badge, #telescope-goto-modal, #btn-open-telescope-goto, button, a, #pointer-lock-badge')) return;
    
    if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
      // 1. Si el puntero está bloqueado (mira activa), cualquier clic con fórmula colimada viaja inmediatamente
      if (document.pointerLockElement) {
        if (collimatedAstroIndex >= 0) {
          warpToTargetAstro(collimatedAstroIndex);
          return;
        }
        return;
      }

      // 2. Si no hubo arrastre prolongado:
      if (!hasDragged) {
        // A. Si hay fórmula colimada en el centro
        if (collimatedAstroIndex >= 0) {
          warpToTargetAstro(collimatedAstroIndex);
          return;
        }

        // B. Raycaster 3D directo desde la posición del cursor en pantalla
        const mouseRay = new THREE.Raycaster();
        const mouseNDC = new THREE.Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
        mouseRay.setFromCamera(mouseNDC, camera);

        let hitAstro = null;
        let minRayDist = Infinity;
        for (let idx = 0; idx < astros24.length; idx++) {
          const a = astros24[idx];
          if (!a.group.visible) continue;
          const sphere = new THREE.Sphere(a.worldPos, 2.4);
          const hit = mouseRay.ray.intersectSphere(sphere, new THREE.Vector3());
          if (hit) {
            const d = camera.position.distanceTo(hit);
            if (d < minRayDist) {
              minRayDist = d;
              hitAstro = a;
            }
          }
        }
        if (hitAstro) {
          warpToTargetAstro(hitAstro.index);
          return;
        }

        const distToScope = Math.hypot(camera.position.x, camera.position.z - 5.0);
        if (distToScope < 3.8) {
          openTelescopeGotoTerminal();
          return;
        }

        // Si hizo clic en espacio vacío, activar mira 100%
        togglePointerLock();
      }
    }
  });

  window.addEventListener('wheel', (e) => {
    if (isInShopMode) return;
    userInertiaTimer = 0;
    if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
      targetSphereRadius += e.deltaY * 0.003;
      targetSphereRadius = Math.max(2.0, Math.min(6.5, targetSphereRadius));
    }
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;

    if (isInShopMode) {
      if (e.key === 'Escape') exitShopMode();
      return;
    }
    if (e.code === 'KeyT') {
      if (e.target.closest('input, textarea, select')) return;
      e.preventDefault();
      toggleTelescopeGotoTerminal();
      return;
    }
    if (e.key === 'Escape') {
      if (isTelescopeModalOpen) {
        closeTelescopeGotoTerminal();
        return;
      }
      if (document.pointerLockElement) {
        document.exitPointerLock();
        return;
      }
      if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
        returnToRotunda();
        return;
      }
      return;
    }
    if (e.code === 'Space') {
      if (e.target.closest('input, textarea, select')) return;
      e.preventDefault();
      if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
        togglePointerLock();
      } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
        triggerShutter();
      }
      return;
    }
    // [E], [F] o [Enter]: Viajar directo a la fórmula colimada en la distancia sin pasar por el telescopio
    if (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'Enter') {
      if (e.target.closest('input, textarea, select')) return;
      if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE && collimatedAstroIndex >= 0) {
        e.preventDefault();
        warpToTargetAstro(collimatedAstroIndex);
        return;
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
  });
}

// ── BUCLE PRINCIPAL DE ANIMACIÓN Y SILICIO ─────────────────────────
let prevTime = performance.now();
let isTabVisible = true;
let frameCounter = 0;

const isAutomationOrDirect = (typeof navigator !== 'undefined' && (navigator.webdriver || !navigator.onLine)) ||
  (typeof window !== 'undefined' && (window.location.search.includes('direct') || window.location.search.includes('warp') || window.location.search.includes('astro')));

// ── DISCIPLINA TÉRMICA APPLE SILICON: SUSPENSIÓN CUANDO LA PESTAÑA NO ESTÁ VISIBLE ──
document.addEventListener('visibilitychange', () => {
  if (isAutomationOrDirect) {
    isTabVisible = true;
  } else {
    isTabVisible = !document.hidden;
  }
  if (isTabVisible) {
    prevTime = performance.now();
    requestAnimationFrame(animate);
  }
});

// Static reusable transform objects to avoid GC spikes in 60 FPS animation loop
const _camEuler = new THREE.Euler(0, 0, 0, 'YXZ');
const _naiTarget = new THREE.Vector3();
const _targetCam = new THREE.Vector3();

function animate() {
  if (!isTabVisible && !isAutomationOrDirect) return; // 0% CPU/GPU en segundo plano
  frameCounter++;
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;
  prevTime = time;

  // Rendering does not measure solver throughput or network participation.
  const localThroughputEl = document.getElementById('swarm-local-throughput');
  if (localThroughputEl) localThroughputEl.textContent = 'No medido';

  if (isInShopMode) {
    camera.position.lerp(new THREE.Vector3(0, 0, 46.5), 0.08);
    const targetLook = new THREE.Vector3(0, 0, 42.0);
    const m = new THREE.Matrix4().lookAt(camera.position, targetLook, new THREE.Vector3(0, 1, 0));
    const q = new THREE.Quaternion().setFromRotationMatrix(m);
    camera.quaternion.slerp(q, 0.08);

    productRotation.x += (targetProductRotation.x - productRotation.x) * 0.1;
    productRotation.y += (targetProductRotation.y - productRotation.y) * 0.1;

    ['frameWood', 'mug', 'notebook'].forEach(key => {
      const obj = shopProducts[key];
      if (obj && obj.visible) {
        obj.rotation.x = productRotation.x;
        obj.rotation.y = productRotation.y + Math.sin(time * 0.001) * 0.05;
      }
    });

  } else if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
    // 1. ROTACIÓN PANORÁMICA 360° POR TECLADO (Flechas Izq/Der o Q/E):
    if (keysPressed['ArrowLeft'] || keysPressed['KeyQ']) {
      targetOrientation.yaw += 0.032;
      userInertiaTimer = 0;
    }
    if (keysPressed['ArrowRight'] || keysPressed['KeyE']) {
      targetOrientation.yaw -= 0.032;
      userInertiaTimer = 0;
    }
    if (keysPressed['ArrowUp'] || keysPressed['KeyR']) {
      targetOrientation.pitch = Math.min(1.50, targetOrientation.pitch + 0.022);
      userInertiaTimer = 0;
    }
    if (keysPressed['ArrowDown'] || keysPressed['KeyF']) {
      targetOrientation.pitch = Math.max(-0.45, targetOrientation.pitch - 0.022);
      userInertiaTimer = 0;
    }

    // 2. DESPLAZAMIENTO POR LA PLATAFORMA CON TECLAS WASD:
    const forwardX = -Math.sin(orientation.yaw);
    const forwardZ = -Math.cos(orientation.yaw);
    const rightX = Math.cos(orientation.yaw);
    const rightZ = -Math.sin(orientation.yaw);

    let moveX = 0;
    let moveZ = 0;
    if (keysPressed['KeyW']) { moveX += forwardX; moveZ += forwardZ; }
    if (keysPressed['KeyS']) { moveX -= forwardX; moveZ -= forwardZ; }
    if (keysPressed['KeyD']) { moveX += rightX; moveZ += rightZ; }
    if (keysPressed['KeyA']) { moveX -= rightX; moveZ -= rightZ; }

    const moveLen = Math.hypot(moveX, moveZ);
    if (moveLen > 0.001) {
      const walkSpeed = 0.11; // Marcha ágil por la monumental cubierta de basalto
      targetPlatformPos.x += (moveX / moveLen) * walkSpeed;
      targetPlatformPos.z += (moveZ / moveLen) * walkSpeed;
    }

    // Límite circular de la barandilla perimetral de bronce (radio barandilla 13.8m, límite observador r <= 12.5m)
    const distCenter = Math.hypot(targetPlatformPos.x, targetPlatformPos.z);
    if (distCenter > 12.5) {
      targetPlatformPos.x *= 12.5 / distCenter;
      targetPlatformPos.z *= 12.5 / distCenter;
    }
    targetPlatformPos.y = 1.65; // Altura natural del observador de pie

    platformObserverPos.lerp(targetPlatformPos, 0.12);
    camera.position.copy(platformObserverPos);

    // 3. BARRIDO AUTOMÁTICO EN BORDES DE PANTALLA (EDGE PANNING):
    if (currentMouseScreenPos.x >= 0 && typeof window !== 'undefined') {
      const edgeMargin = Math.min(65, window.innerWidth * 0.06);
      if (currentMouseScreenPos.x < edgeMargin) {
        targetOrientation.yaw += 0.020 * (1.0 - currentMouseScreenPos.x / edgeMargin);
        userInertiaTimer = 0;
      } else if (currentMouseScreenPos.x > window.innerWidth - edgeMargin) {
        targetOrientation.yaw -= 0.020 * (1.0 - (window.innerWidth - currentMouseScreenPos.x) / edgeMargin);
        userInertiaTimer = 0;
      }
    }

    const lerpFactor = isPointerLocked ? 0.55 : 0.35;
    orientation.pitch += (targetOrientation.pitch - orientation.pitch) * lerpFactor;
    orientation.yaw   += (targetOrientation.yaw - orientation.yaw) * lerpFactor;
    _camEuler.set(orientation.pitch, orientation.yaw, 0);
    camera.quaternion.setFromEuler(_camEuler);

    // Calcular colimación astronómica con la lente del telescopio cada 2 frames
    if (frameCounter % 2 === 0) {
      updateTelescopeCollimation();
    }

    // 4. ANIMACIÓN SUAVE DE SERVOMOTORES DEL TELESCOPIO (GOTO SLEW)
    if (telescopeForkGroup && telescopeOtaGroup) {
      if (isTelescopeSlewing) {
        const elapsed = performance.now() - slewStartTime;
        const progress = Math.min(1.0, elapsed / 1150);
        const ease = 1 - Math.pow(1 - progress, 3);
        currentTelescopeAngles.ha = slewStartAngles.ha + (targetTelescopeAngles.ha - slewStartAngles.ha) * ease;
        currentTelescopeAngles.dec = slewStartAngles.dec + (targetTelescopeAngles.dec - slewStartAngles.dec) * ease;
        telescopeForkGroup.rotation.y = currentTelescopeAngles.ha;
        telescopeOtaGroup.rotation.x = currentTelescopeAngles.dec;
        if (progress >= 1.0) {
          isTelescopeSlewing = false;
          updateTelescopeCollimation();
        }
      }
    }

    // 5. COMPROBACIÓN DE PROXIMIDAD AL TELESCOPIO MONUMENTAL
    const distToScope = Math.hypot(camera.position.x, camera.position.z - 5.0);
    const proxBadge = document.getElementById('telescope-proximity-badge');
    if (proxBadge) {
      if (distToScope < 3.8 && !isTelescopeModalOpen && currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
        proxBadge.classList.remove('hidden');
      } else {
        proxBadge.classList.add('hidden');
      }
    }

    // Dinámica suave de NAI centinela en la rotonda
    if (nai3D.group) {
      nai3D.pulseTime += delta;
      _naiTarget.set(
        2.6 + Math.sin(nai3D.pulseTime * 0.5) * 0.6,
        1.65 + Math.cos(nai3D.pulseTime * 0.8) * 0.25,
        -1.8
      );
      nai3D.group.position.lerp(_naiTarget, 0.04);
      nai3D.core.rotation.y += 0.02;
      nai3D.outerHalo.rotation.y -= 0.025;
      nai3D.light.intensity = 1.6 + Math.sin(nai3D.pulseTime * 4.0) * 0.3;
    }

    // Solo reorientar anillos hacia la cámara cuando el observador se desplaza o a baja frecuencia
    if (moveLen > 0.001 || (frameCounter % 15 === 0)) {
      astros24.forEach(a => a.timonelRing.lookAt(camera.position));
    }

  } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT && activeConfinementAstro) {
    // 2. MODO BURBUJA S²: Órbita libre con Mouse o Teclas (Flechas / WASD / QE):
    if (keysPressed['ArrowLeft'] || keysPressed['KeyA'] || keysPressed['KeyQ']) {
      targetSphereTheta += 0.035;
      userInertiaTimer = 0;
    }
    if (keysPressed['ArrowRight'] || keysPressed['KeyD'] || keysPressed['KeyE']) {
      targetSphereTheta -= 0.035;
      userInertiaTimer = 0;
    }
    if (keysPressed['ArrowUp'] || keysPressed['KeyW'] || keysPressed['KeyR']) {
      targetSpherePhi = Math.max(0.08, targetSpherePhi - 0.025);
      userInertiaTimer = 0;
    }
    if (keysPressed['ArrowDown'] || keysPressed['KeyS'] || keysPressed['KeyF']) {
      targetSpherePhi = Math.min(Math.PI - 0.08, targetSpherePhi + 0.025);
      userInertiaTimer = 0;
    }

    // Barrido en bordes en modo confinamiento:
    if (currentMouseScreenPos.x >= 0 && typeof window !== 'undefined') {
      const edgeMargin = Math.min(65, window.innerWidth * 0.06);
      if (currentMouseScreenPos.x < edgeMargin) {
        targetSphereTheta += 0.022 * (1.0 - currentMouseScreenPos.x / edgeMargin);
        userInertiaTimer = 0;
      } else if (currentMouseScreenPos.x > window.innerWidth - edgeMargin) {
        targetSphereTheta -= 0.022 * (1.0 - (window.innerWidth - currentMouseScreenPos.x) / edgeMargin);
        userInertiaTimer = 0;
      }
    }

    const confLerp = isPointerLocked ? 0.45 : 0.25;
    sphereTheta  += (targetSphereTheta - sphereTheta) * confLerp;
    spherePhi    += (targetSpherePhi - spherePhi) * confLerp;
    sphereRadius += (targetSphereRadius - sphereRadius) * 0.20;

    const center = activeConfinementAstro.worldPos;
    _targetCam.set(
      center.x + sphereRadius * Math.sin(spherePhi) * Math.sin(sphereTheta),
      center.y + sphereRadius * Math.cos(spherePhi),
      center.z + sphereRadius * Math.sin(spherePhi) * Math.cos(sphereTheta)
    );
    if (camera.position.distanceTo(_targetCam) > 4.0) {
      camera.position.copy(_targetCam);
    } else {
      camera.position.lerp(_targetCam, 0.22);
    }
    camera.lookAt(center);

    // Dinámica de NAI orbitando cerca del astro enfocado
    if (nai3D.group) {
      nai3D.pulseTime += delta;
      _naiTarget.set(
        center.x + Math.sin(nai3D.pulseTime * 0.8) * 2.2,
        center.y + Math.cos(nai3D.pulseTime * 1.0) * 1.0,
        center.z + 1.6
      );
      nai3D.group.position.lerp(_naiTarget, 0.06);
      nai3D.core.rotation.y += 0.02;
      nai3D.outerHalo.rotation.y -= 0.025;
      nai3D.light.intensity = 1.8 + Math.sin(nai3D.pulseTime * 4.0) * 0.4;
    }

    if (activeConfinementAstro) {
      activeConfinementAstro.timonelRing.lookAt(camera.position);
    }
  }

  // Actualizar los 24 Modelos Matemáticos con Ciclo de Auto-Resolución y Culling Térmico
  const camPos = camera.position;
  const isConfinement = (currentMuseumMode === MODE_SPHERE_CONFINEMENT);

  astros24.forEach((astro) => {
    if (!astro.group.visible) return; // Si la época no está activa, 0% CPU

    // Lazy Lights: Solo el astro activo/colimado activa luces dinámicas (evita saturar WebGL con 200 luces)
    const shouldLight = isConfinement ? (astro === activeConfinementAstro) : (astro.index === collimatedAstroIndex);
    if (astro.pointLight && astro.pointLight.visible !== shouldLight) {
      astro.pointLight.visible = shouldLight;
      astro.fillLight.visible = shouldLight;
    }

    const distToCam = astro.worldPos.distanceTo(camPos);

    // CULLING TÉRMICO CON DILATACIÓN CÓSMICA (55m - 90m):
    // Si el usuario está en confinamiento y este no es el astro activo, no procesar física de fondo
    if (isConfinement && astro !== activeConfinementAstro) return;

    // Si está a más de 130m, no calcular
    if (distToCam > 130.0) return;
    // Si está entre 50m y 130m, entrelazar actualización (30 FPS)
    if (distToCam > 50.0 && ((frameCounter + astro.index) % 2 !== 0)) return;

    astro.cycleT += delta;

    let phase, relaxFactor, ringColor;
    if (astro.cycleT < 2.5) {
      // 1. Fase de Entropía Alta / Dispersión
      phase = 'DISPERSION';
      relaxFactor = 0.0;
      ringColor = 0xf43f5e; // Rojo advertencia
    } else if (astro.cycleT < 7.5) {
      // 2. Fase de Relajación por Operador Diferencial
      phase = 'RELAXATION';
      const progress = (astro.cycleT - 2.5) / 5.0;
      relaxFactor = progress;
      ringColor = progress > 0.65 ? 0x38bdf8 : (progress > 0.3 ? 0xa855f7 : 0xf43f5e);
    } else if (astro.cycleT < 13.0) {
      // 3. Fase Cristalizada: Forma ilustrativa de la animación (sin certificación)
      phase = 'CRYSTALLIZED';
      relaxFactor = 1.0;
      ringColor = 0x38bdf8;
    } else {
      astro.cycleT = 0;
      phase = 'DISPERSION';
      relaxFactor = 0.0;
      ringColor = 0xf43f5e;
    }

    astro.phase = phase;
    astro.relaxFactor = relaxFactor;
    astro.residual = null; // No equation residual has been computed by this animation.
    astro.timonelRing.material.color.setHex(ringColor);

    if (!isConfinement) {
      const isCollimated = (astro.index === collimatedAstroIndex);
      astro.timonelRing.material.opacity = isCollimated ? 0.8 : 0.32;
      astro.group.scale.set(isCollimated ? 1.15 : 0.85, isCollimated ? 1.15 : 0.85, isCollimated ? 1.15 : 0.85);
    }


    // Discovery alerts require a reproducible numerical result and an independent verifier.
    // Animation phases and dormant frontier flags provide neither; no scientific alert is emitted.

    if (astro.model && astro.model.update) {
      astro.model.update(delta, astro.cycleT, phase, relaxFactor);
    }
  });

  // Actualizar telemetría de auto-resolución en la tarjeta HUD si hay astro enfocado
  if (currentFocusedAstro) {
    const stateEl = document.getElementById('hud-relax-state');
    const progEl = document.getElementById('hud-relax-progress');
    const resEl = document.getElementById('hud-residual-val');
    const slackEl = document.getElementById('hud-slack-val');

    if (stateEl && progEl && resEl && slackEl) {
      if (currentFocusedAstro.phase === 'DISPERSION') {
        stateEl.textContent = 'ENTROPÍA ALTA · DISPERSANDO';
        stateEl.className = 'text-rose-400 font-bold';
        progEl.style.width = '18%';
        progEl.className = 'bg-rose-500 h-full transition-all duration-300';
      } else if (currentFocusedAstro.phase === 'RELAXATION') {
        stateEl.textContent = 'TRANSICIÓN VISUAL';
        stateEl.className = 'text-purple-300 font-bold';
        const pct = Math.floor(currentFocusedAstro.relaxFactor * 100);
        progEl.style.width = pct + '%';
        progEl.className = 'bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300';
      } else {
        stateEl.textContent = 'FORMA ILUSTRATIVA · SIN VALIDAR';
        stateEl.className = 'text-cyan-300 font-bold';
        progEl.style.width = '100%';
        progEl.className = 'bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300';
      }

      resEl.textContent = 'NO CALCULADO';
      slackEl.textContent = 'NO EVALUADA';
    }
  }
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ── SÍNTESIS DE VOZ Y AUDIO ───────────────────────────────────────
function enterCapsule(enableVoice) {
  voiceGuideEnabled = enableVoice;
  updateVoiceStatusUI();
  const foyer = document.getElementById('foyer-screen');
  if (foyer) {
    foyer.style.opacity = '0';
    setTimeout(() => {
      foyer.style.setProperty('display', 'none', 'important');
      foyer.classList.add('hidden');
    }, 800);
  }
  speakNai("Bienvenido a la Rotonda de Timonel. 100 leyes del cosmos se están desenredando en silicio.");
}

function toggleVoiceGuide() {
  voiceGuideEnabled = !voiceGuideEnabled;
  if (!voiceGuideEnabled) stopNaiSpeech();
  updateVoiceStatusUI();
}

function updateVoiceStatusUI() {
  const icon = document.getElementById('voice-status-icon');
  if (icon) icon.textContent = voiceGuideEnabled ? 'Audio On' : 'Audio Off';
  const txt = document.getElementById('voice-status-text');
  if (txt) txt.textContent = voiceGuideEnabled ? 'Voz Activa' : 'En Silencio';
}

function speakNai(text) {
  if (!voiceGuideEnabled || !('speechSynthesis' in window)) return;
  stopNaiSpeech();
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'es-ES';
  currentUtterance.rate = 0.94; currentUtterance.pitch = 0.96;
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es'));
  if (esVoice) currentUtterance.voice = esVoice;
  currentUtterance.onstart = () => { isSpeaking = true; document.getElementById('nai-voice-waves').classList.remove('hidden'); };
  currentUtterance.onend = () => { isSpeaking = false; document.getElementById('nai-voice-waves').classList.add('hidden'); };
  window.speechSynthesis.speak(currentUtterance);
}

function stopNaiSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  isSpeaking = false;
  document.getElementById('nai-voice-waves').classList.add('hidden');
}

function toggleAudioGuide() {
  if (currentFocusedAstro) {
    speakNai(`Obra ${currentFocusedAstro.data.badge}. ${currentFocusedAstro.data.title}. ${currentFocusedAstro.data.hist} ${currentFocusedAstro.data.poem}`);
  }
}

// ── OBTURADOR & CARRETE ───────────────────────────────────────────
function triggerShutter() {
  const flash = document.getElementById('camera-flash');
  flash.classList.add('flashing');
  setTimeout(() => flash.classList.remove('flashing'), 100);

  const canvas = document.getElementById('webgl-canvas');
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

  const title = currentFocusedAstro ? currentFocusedAstro.data.title : 'Atlas Cósmico';
  userCameraRoll.unshift({
    id: Date.now(),
    artTitle: title,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    img: dataUrl
  });
  updateRollUI();
}

function updateRollUI() {
  const grid = document.getElementById('roll-grid');
  const counterBadge = document.getElementById('roll-counter-badge');
  const capacityText = document.getElementById('roll-capacity-text');
  const emptyState = document.getElementById('roll-empty-state');

  counterBadge.textContent = `${userCameraRoll.length}/30`;
  capacityText.textContent = `${userCameraRoll.length} / 30 fotos`;

  if (userCameraRoll.length === 0) {
    emptyState.classList.remove('hidden');
    grid.innerHTML = '';
    grid.appendChild(emptyState);
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = '';

  userCameraRoll.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'glass rounded-xl p-2 relative group overflow-hidden border-white/10';
    card.innerHTML = `
      <img src="${item.img}" class="w-full h-28 object-cover rounded-lg mb-1.5 bg-black" />
      <div class="flex justify-between items-center text-[10px] mono text-slate-300">
        <span class="truncate">${item.artTitle}</span>
        <span class="text-purple-400">${item.date}</span>
      </div>
      <button onclick="deleteRollItem(${item.id})" class="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
    `;
    grid.appendChild(card);
  });
}

function deleteRollItem(id) { userCameraRoll = userCameraRoll.filter(item => item.id !== id); updateRollUI(); }
function clearCameraRoll() { if (confirm('¿Vaciar carrete?')) { userCameraRoll = []; updateRollUI(); } }
function toggleCameraRoll() { document.getElementById('roll-drawer').classList.toggle('translate-x-full'); }

function bootAtlas() {
  initAtlasCosmico();
  if (window.location.href.includes('skip_foyer') || window.location.href.includes('enter') || window.location.hash.includes('enter') || window.location.href.includes('direct') || window.location.href.includes('warp=')) {
    const foyer = document.getElementById('foyer-screen');
    if (foyer) {
      foyer.style.setProperty('display', 'none', 'important');
      foyer.classList.add('hidden');
      foyer.remove();
    }
    voiceGuideEnabled = false;
  }
  if (window.location.href.includes('warp=')) {
    const match = window.location.href.match(/warp=(\d+)/);
    if (match) {
      const targetIdx = parseInt(match[1]);
      warpToTargetAstro(targetIdx);
    }
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootAtlas);
} else {
  bootAtlas();
}
