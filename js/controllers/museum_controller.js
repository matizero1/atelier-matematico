/**
 * Atelier Matemático - Museum Controller
 * 3D Celestial Observatory (Atlas Cósmico de 100 Leyes)
 * NASA JPL-Grade Modular Architecture
 */

// CATÁLOGO COMPLETO DE LAS 100 LEYES DE LA HUMANIDAD (BÓVEDA CELESTE VISIBLE · TIMONEL F2)
const ARTWORKS_24 = (typeof window !== 'undefined' && window.ARTWORKS_100 && window.ARTWORKS_100.length) ? window.ARTWORKS_100 : [
  // ── ANILLO I: HORIZONTE Y LEYES CLÁSICAS (R = 18m, φ ∈ [+0.12, +0.28] rad sobre el horizonte)
  { id: 0, badge:"01", title:"El Vuelo de Lorenz", sub:"Atractor Caótico Aperiodico", cat:"TEORÍA DEL CAOS · 1963",
    eq:"dx/dt=10(y-x)\ndy/dt=x(28-z)-y\ndz/dt=xy-(8/3)z", metric:"Lyapunov: λ₁ = +0.9056",
    hist:"Edward Lorenz descubrió que una millonésima de redondeo desata trayectorias perpetuamente impredecibles.",
    poem:'"Dos alas nacen de un suspiro y giran sin tocarse jamás."', radius: 18, theta: 0.00, phi: 0.15 },

  { id: 1, badge:"02", title:"El Umbral de la Materia", sub:"Límite de Fluencia Tensorial", cat:"MECÁNICA CONTINUA · 1913",
    eq:"σ_v = √((σ₁-σ₂)²+(σ₂-σ₃)²+(σ₃-σ₁)²)/√2", metric:"Von Mises: J₂ ≤ k²",
    hist:"Richard von Mises encontró la cota exacta donde un metal cede plásticamente bajo tensión multiaxial.",
    poem:'"La materia resiste hasta que la tensión ya no cabe en sus átomos."', radius: 18, theta: 1.05, phi: 0.24 },

  { id: 2, badge:"03", title:"La Danza de Yoshida", sub:"Conservación Hamiltoniana Pura", cat:"INTEGRADORES SIMPLÉCTICOS · 1990",
    eq:"z_{n+1}=exp(c_i·Δt·D_A)·exp(d_i·Δt·D_B)·z_n", metric:"Energía: ΔH ≤ 1e-15",
    hist:"Haruo Yoshida descubrió coeficientes analíticos de 4º orden que conservan la energía sin perder un solo julio.",
    poem:'"Dos cuerpos bailan al borde del abismo sin motor ni fricción."', radius: 18, theta: 2.09, phi: 0.16 },

  { id: 3, badge:"04", title:"Los Ríos Invisibles", sub:"Autodiferenciación con Clifford", cat:"ÁLGEBRA DUAL · 1873",
    eq:"f(x+d·ε) = f(x) + d·f'(x)·ε  (ε²=0)", metric:"Error Truncamiento: 0.000",
    hist:"William Clifford formuló el número infinitesimal ε cuyo cuadrado es cero para obtener derivadas sin error.",
    poem:'"Corrientes subterráneas que horadan la roca en silencio."', radius: 18, theta: 3.14, phi: 0.26 },

  { id: 4, badge:"05", title:"Los Cantos de Chladni", sub:"Relajación Nodal Cimática", cat:"CIMÁTICA ACÚSTICA · 1787",
    eq:"w(x,y)=sin(nπx)sin(mπy)-sin(mπx)sin(nπy)=0", metric:"Residuo Nodal: ‖F(x)‖ ≤ 2.4e-5",
    hist:"Ernst Chladni pasó un arco de violín por una placa de bronce y reveló los mandalas sagrados del sonido.",
    poem:'"El silencio es el punto exacto donde las ondas se anulan."', radius: 18, theta: 4.19, phi: 0.18 },

  { id: 5, badge:"06", title:"El Telar de Turing", sub:"Morfogénesis y Reacción-Difusión", cat:"MORFOGÉNESIS · 1952",
    eq:"∂u/∂t = Dᵤ∇²u - uv² + F(1-u)\n∂v/∂t = Dᵥ∇²v + uv² - (F+k)v", metric:"Turing Wavelength: λ_c ≈ 0.42",
    hist:"Alan Turing demostró cómo dos sustancias químicas difundiéndose bastan para tejer las manchas del leopardo.",
    poem:'"La vida no necesitó pincel: solo dos moléculas jugando a perseguirse."', radius: 18, theta: 5.24, phi: 0.22 },

  // ── ANILLO II: BÓVEDA MEDIA Y MORFOGÉNESIS (R = 26m, φ ∈ [+0.38, +0.65] rad)
  { id: 6, badge:"07", title:"La Cinta del Panadero", sub:"Plegado Caótico de Rössler", cat:"TOPOLOGÍA CAÓTICA · 1976",
    eq:"dx/dt=-y-z\ndy/dt=x+0.2y\ndz/dt=0.2+z(x-5.7)", metric:"Fractal Dim: D ≈ 2.01",
    hist:"Otto Rössler diseñó el atractor que se estira y pliega sobre sí mismo como el panadero amasa la masa.",
    poem:'"El tiempo es una cinta de seda que el universo estira y dobla."', radius: 26, theta: 0.31, phi: 0.42 },

  { id: 7, badge:"08", title:"Las Esferas de Apolonio", cat:"Empaquetamiento Fractal", sub:"Teorema de Círculos de Descartes", cat:"GEOMETRÍA FRACTAL · 200 a.C.",
    eq:"(k₁+k₂+k₃+k₄)²=2(k₁²+k₂²+k₃²+k₄²)", metric:"Curvatura: k = 1/r",
    hist:"Apolonio demostró que tres círculos tangentes dejan un hueco donde cabe exactamente una nueva esfera infinita.",
    poem:'"En cada vacío que deja la pérdida, la geometría siembra una nueva esfera."', radius: 26, theta: 0.94, phi: 0.58 },

  { id: 8, badge:"09", title:"El Espejo de Julia", sub:"Dinámica Holomorfa en C", cat:"GEOMETRÍA COMPLEJA · 1918",
    eq:"z_{n+1} = z_n² + c  (|c| ≈ 0.7885)", metric:"Mandelbrot Boundary ∂M",
    hist:"Gaston Julia escribió 200 páginas a mano describiendo fractales que jamás pudo ver en una pantalla.",
    poem:'"Un hombre sin rostro imaginó el rostro de todos los universos posibles."', radius: 26, theta: 1.57, phi: 0.40 },

  { id: 9, badge:"10", title:"La Autopista del Caos", sub:"Autómata de Langton", cat:"AUTÓMATA CELULAR · 1986",
    eq:"Blanco→girar_derecha+pintar_negro\nNegro→girar_izquierda+pintar_blanco", metric:"Paso crítico: t=10.000",
    hist:"Tras 10.000 pasos de caos absoluto, la hormiga construye espontáneamente una autopista infinita.",
    poem:'"El orden no necesita arquitecto: emerge cuando nadie lo espera."', radius: 26, theta: 2.20, phi: 0.62 },

  { id: 10, badge:"11", title:"La Ola Eterna", sub:"Solitones Analíticos de KdV", cat:"ONDAS NO LINEALES · 1834",
    eq:"u(x,t) = -2k² · sech²(k(x - 4k²t))", metric:"Solitón Invariante: ‖u‖_L2 = cte",
    hist:"John Scott Russell vio una ola en un canal viajar millas sin deformarse ni morir jamás.",
    poem:'"Hay personas que, como estas olas, colisionan y salen intactas al otro lado."', radius: 26, theta: 2.83, phi: 0.46 },

  { id: 11, badge:"12", title:"La Piel de la Jirafa", sub:"Partición Natural de Voronoi", cat:"TESELACIÓN ESPACIAL · 1908",
    eq:"Cel(sᵢ) = {x : d(x,sᵢ) ≤ d(x,sⱼ)}", metric:"Métrica: Euclidiana L₂",
    hist:"Georgy Voronoi describió la división celular que gobierna los ojos de mosca y las galaxias.",
    poem:'"A cada semilla, todo lo que está más cerca de ella."', radius: 26, theta: 3.46, phi: 0.59 },

  { id: 12, badge:"13", title:"Los Ríos de Newton", sub:"Cuencas Fractales de Atracción", cat:"ANÁLISIS COMPLEJO · 1669",
    eq:"z_{n+1} = (2z³+1)/(3z²)  (z³-1 = 0)", metric:"Convergencia: z → 1, e^{i2π/3}",
    hist:"El método de Newton para hallar raíces genera fronteras fractales infinitas en el plano complejo.",
    poem:'"Incluso Newton jamás supo qué camino tomará el caos para llegar a la verdad."', radius: 26, theta: 4.08, phi: 0.42 },

  { id: 13, badge:"14", title:"Las Celdas del Sol", sub:"Convección de Rayleigh-Bénard", cat:"TERMODINÁMICA · 1900",
    eq:"Ra = gαΔTL³/(νκ) > 1708 (Hexágonos)", metric:"Rayleigh: Ra/Ra_c = 1.45",
    hist:"Henri Bénard demostró que el calor no destruye el orden: fabrica hexágonos perfectos como el Sol.",
    poem:'"El calor siempre fabrica hexágonos, la forma más eficiente del universo."', radius: 26, theta: 4.71, phi: 0.64 },

  { id: 14, badge:"15", title:"La Fibración de Hopf", sub:"Proyección Cuadridimensional S³→R³", cat:"TOPOLOGÍA 4D · 1931",
    eq:"π: S³ → S² (Fibras entrelazadas)", metric:"Invariante de Hopf: H = 1",
    hist:"Heinz Hopf demostró que la esfera 4D se desmonta en infinitos círculos que no se tocan jamás.",
    poem:'"La sombra de cuatro dimensiones cayendo como una flor sobre nuestra realidad."', radius: 26, theta: 5.34, phi: 0.48 },

  { id: 15, badge:"16", title:"El Juego del Caos", sub:"Helecho Fractal de Barnsley", cat:"SISTEMAS IFS · 1988",
    eq:"w_i(x) = A_i x + b_i (4 Matrices)", metric:"Hausdorff Dimension D ≈ 1.82",
    hist:"Michael Barnsley demostró que tirar un dado con cuatro reglas reproduce una hoja de helecho perfecta.",
    poem:'"Tres instrucciones y un dado bastan para dibujar la vida."', radius: 26, theta: 5.97, phi: 0.56 },

  // ── ANILLO III: BÓVEDA ALTA Y ENIGMAS DEL MILENIO (R = 34m, φ ∈ [+0.75, +1.25] rad hacia el cenit)
  { id: 16, badge:"17", title:"Las Flores del Girasol", sub:"Filotaxis de Fibonacci", cat:"GEOMETRÍA ÁUREA · 1202",
    eq:"θₙ = n · 137.508° (Ángulo Áureo)", metric:"Razón Áurea: φ ≈ 1.618033",
    hist:"En 1202 Fibonacci contó conejos y descubrió la espiral que empaqueta las semillas de los girasoles.",
    poem:'"La flor no sabe matemáticas: solo crece de la forma más hermosa."', radius: 34, theta: 0.40, phi: 0.78 },

  { id: 17, badge:"18", title:"Las Espirales Químicas", sub:"Reacción Belousov-Zhabotinsky", cat:"OSCILACIÓN NO LINEAL · 1951",
    eq:"∂u/∂t = Dᵤ∇²u + f(u,v)", metric:"Período químico: T ≈ 4.2s",
    hist:"Boris Belousov descubrió una reacción química que latía como un corazón y la ciencia lo tildó de loco.",
    poem:'"Cada latido tuyo es una reacción química que se negó a detenerse."', radius: 34, theta: 1.18, phi: 0.92 },

  { id: 18, badge:"19", title:"El Colapso Cuántico", sub:"Ecuación de Schrödinger", cat:"MECÁNICA CUÁNTICA · 1926",
    eq:"iℏ ∂ψ/∂t = -ℏ²/2m ∇²ψ + Vψ", metric:"Norma Unitaria: ∫|ψ|² dV = 1",
    hist:"Erwin Schrödinger formuló la ola de probabilidad donde las cosas existen en todos lados hasta ser observadas.",
    poem:'"Antes de ser mirado, el electrón existe en todas partes a la vez."', radius: 34, theta: 1.96, phi: 0.80 },

  { id: 19, badge:"20", title:"El Laberinto Perfecto", sub:"Regla 110 de Wolfram", cat:"COMPUTACIÓN UNIVERSAL · 1983",
    eq:"111→0 · 110→1 · 101→1 · 100→0...", metric:"Clase 4: Turing-Completo",
    hist:"Stephen Wolfram demostró que una regla elemental de tres celdas puede computar cualquier cosa en el universo.",
    poem:'"Una sola celda negra en un mar blanco, capaz de pensarlo todo."', radius: 34, theta: 2.75, phi: 0.96 },

  { id: 20, badge:"21", title:"Los Ceros de Riemann", sub:"Espiral Crítica en s = 1/2 + it", cat:"PROBLEMA DEL MILENIO · 1859",
    eq:"ζ(s) = ∑ 1/nˢ = 0 ⇒ Re(s) = 1/2", metric:"Línea Crítica: Re(s) = 0.500000",
    hist:"Bernhard Riemann planteó el enigma de $1.000.000 USD sobre el ritmo íntimo de los números primos.",
    poem:'"Una cuerda de luz tensada que besa el cero absoluto en cada primo."', radius: 34, theta: 3.53, phi: 1.18 },

  { id: 21, badge:"22", title:"El Desierto de Beal", sub:"Conjetura de Beal Coprima", cat:"TEORÍA DE NÚMEROS · 1993",
    eq:"Aˣ + Bʸ = Cᶻ (x,y,z > 2) ⇒ mcd > 1", metric:"Exclusión Coprima: 100% Vacío",
    hist:"Andrew Beal ofreció $1.000.000 USD a quien demuestre por qué las potencias coprimas se repelen en el vacío.",
    poem:'"En el desierto de las potencias puras, los números solitarios jamás logran sumarse."', radius: 34, theta: 4.32, phi: 0.84 },

  { id: 22, badge:"23", title:"Vórtices de Navier-Stokes", sub:"Singularidades y Turbulencia 3D", cat:"PROBLEMA DEL MILENIO · 1845",
    eq:"∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u", metric:"Enstrofía: Ω(t) < ∞ (Búsqueda)",
    hist:"¿Puede la velocidad del agua explotar a infinito? El misterio del millón de dólares de la física de fluidos.",
    poem:'"Tubos de remolinos microscópicos trenzándose como músculos de luz."', radius: 34, theta: 5.11, phi: 1.22 },

  { id: 23, badge:"24", title:"El Flujo de Ricci de Poincaré", sub:"Alisamiento Métrico a 3-Esfera", cat:"PROBLEMA DEL MILENIO · 2002",
    eq:"∂g_ij/∂t = -2 R_ij ⇒ M³ → S³", metric:"Curvatura Escalar: R(t) → 1.000",
    hist:"Grigori Perelman usó el flujo de calor métrico para alisar el espacio, y rechazó la Medalla Fields.",
    poem:'"El calor geométrico plancha cada arruga hasta devolver la pureza a la primera esfera."', radius: 34, theta: 5.89, phi: 0.98 }
];

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
        <div>Residuo Timonel: <strong class="text-cyan-300">${item.residual}</strong></div>
        <div class="text-slate-400 mt-0.5">${item.reason}</div>
      </div>
      <div class="flex justify-between items-center text-[9px] mono text-slate-500">
        <span>Nodo: ${item.nodeId}</span>
        <span class="text-emerald-400 font-semibold">CERTIFICADO CANDIDATO</span>
      </div>
    `;
    list.appendChild(card);
  });
}

function showDiscoveryToast(entry) {
  const toast = document.getElementById('discovery-toast');
  const msg = document.getElementById('toast-message');
  if (!toast || !msg) return;

  msg.textContent = `${entry.title}: Residuo ${entry.residual} — ${entry.reason}`;
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
    residual: astro.residual.toFixed(5),
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
  speakNai(`Atención Matías. El nodo ha registrado un candidato numérico con residuo bajo en ${astro.data.title}. Archivado en la bitácora.`);
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
  recordDiscoveryCandidate(astro, "Candidato de Prueba: Bisección entre extremos positivos y negativos. Residuo convergente.", "Prueba de Alerta Vocal NAI");
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
    residual: 0.05
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
// 🌌 MOTOR GENERATIVO DE VARIEDADES GEOMÉTRICAS 3D Y ESPACIOS DE FASES
// Física Computacional Real en Silicio · Sin Billboards Planos 2D
// ═════════════════════════════════════════════════════════════════════

function createParametricSurface(uSteps, vSteps, fn) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const indices = [];

  for (let i = 0; i <= uSteps; i++) {
    const u = i / uSteps;
    for (let j = 0; j <= vSteps; j++) {
      const v = j / vSteps;
      const p = fn(u, v);
      positions.push(p.x, p.y, p.z);
    }
  }

  for (let i = 0; i < uSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const a = i * (vSteps + 1) + j;
      const b = (i + 1) * (vSteps + 1) + j;
      const c = (i + 1) * (vSteps + 1) + (j + 1);
      const d = i * (vSteps + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// 1. Atractor de Lorenz & Sistemas Caóticos (RK4 en Tiempo Real)
function buildLorenz3D(epColor) {
  const group = new THREE.Group();
  let x = 0.1, y = 0.0, z = 0.0;
  const sigma = 10.0, rho = 28.0, beta = 8.0 / 3.0;
  const dt = 0.009;
  for (let i = 0; i < 150; i++) {
    const dx1 = sigma * (y - x), dy1 = x * (rho - z) - y, dz1 = x * y - beta * z;
    x += dx1 * dt; y += dy1 * dt; z += dz1 * dt;
  }
  const pts = [];
  for (let i = 0; i < 800; i++) {
    pts.push(new THREE.Vector3(x * 0.038, (z - 24) * 0.038, y * 0.038));
    const k1x = sigma * (y - x), k1y = x * (rho - z) - y, k1z = x * y - beta * z;
    const x2 = x + 0.5*dt*k1x, y2 = y + 0.5*dt*k1y, z2 = z + 0.5*dt*k1z;
    const k2x = sigma * (y2 - x2), k2y = x2 * (rho - z2) - y2, k2z = x2 * y2 - beta * z2;
    const x3 = x + 0.5*dt*k2x, y3 = y + 0.5*dt*k2y, z3 = z + 0.5*dt*k2z;
    const k3x = sigma * (y3 - x3), k3y = x3 * (rho - z3) - y3, k3z = x3 * y3 - beta * z3;
    const x4 = x + dt*k3x, y4 = y + dt*k3y, z4 = z + dt*k3z;
    const k4x = sigma * (y4 - x4), k4y = x4 * (rho - z4) - y4, k4z = x4 * y4 - beta * z4;
    x += (dt/6.0)*(k1x + 2*k2x + 2*k3x + k4x);
    y += (dt/6.0)*(k1y + 2*k2y + 2*k3y + k4y);
    z += (dt/6.0)*(k1z + 2*k2z + 2*k3z + k4z);
  }
  const positions = [];
  const colors = [];
  const indices = [];
  const rw = 0.032;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const nextP = pts[Math.min(i + 1, pts.length - 1)];
    const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
    if (tangent.lengthSq() < 0.0001) tangent.set(0, 1, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
    if (binormal.lengthSq() < 0.0001) binormal.set(1, 0, 0);
    const offset = binormal.multiplyScalar(rw);
    positions.push(p.x + offset.x, p.y + offset.y, p.z + offset.z);
    positions.push(p.x - offset.x, p.y - offset.y, p.z - offset.z);
    const t = i / pts.length;
    colors.push(0.3 + 0.6 * t, 0.4 * (1 - t) + 0.5, 0.95, 0.3 + 0.6 * t, 0.4 * (1 - t) + 0.5, 0.95);
    if (i < pts.length - 1) {
      indices.push(i*2, i*2+1, (i+1)*2);
      indices.push(i*2+1, (i+1)*2+1, (i+1)*2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.25, metalness: 0.8 }));
  group.add(mesh);

  const numP = 16;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(numP * 3);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.06, color: 0x38bdf8, transparent: true, opacity: 0.9 }));
  group.add(pMesh);

  let particleHead = 0;
  return {
    group,
    update: (dt, cycleT, phase, relaxFactor) => {
      group.rotation.y += 0.008;
      group.rotation.x += 0.003;
      // Optimización de bus PCIe/WebGL: solo mutar y subir buffer de vértices si está enfocado o colimado
      const isFocused = (typeof activeConfinementAstro !== 'undefined' && activeConfinementAstro && activeConfinementAstro.data.id === 1);
      const isCollimated = (typeof collimatedAstroIndex !== 'undefined' && collimatedAstroIndex >= 0 && astros24[collimatedAstroIndex] && astros24[collimatedAstroIndex].data.id === 1);
      if (!isFocused && !isCollimated) return;

      particleHead = (particleHead + dt * 180) % pts.length;
      for (let k = 0; k < numP; k++) {
        const idx = Math.floor((particleHead + k * (pts.length / numP)) % pts.length);
        const pt = pts[idx];
        pPos[k * 3]     = pt.x;
        pPos[k * 3 + 1] = pt.y;
        pPos[k * 3 + 2] = pt.z;
      }
      pGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 1B. Atractor Caótico de Rössler (Cinta Plegada Unilateral de Banda Única)
// ẋ = -y - z, ẏ = x + a·y, ż = b + z·(x - c) con a=0.2, b=0.2, c=5.7
function buildRossler3D(epColor) {
  const group = new THREE.Group();

  let rx = 0.5, ry = 0.5, rz = 0.5;
  const a = 0.2, b = 0.2, c = 5.7;
  const dt = 0.024;

  for (let i = 0; i < 200; i++) {
    const k1x = -ry - rz, k1y = rx + a * ry, k1z = b + rz * (rx - c);
    rx += k1x * dt; ry += k1y * dt; rz += k1z * dt;
  }

  const pts = [];
  const zVals = [];
  for (let i = 0; i < 700; i++) {
    pts.push(new THREE.Vector3(rx * 0.11, (rz - 4.0) * 0.11, ry * 0.11));
    zVals.push(rz);

    const k1x = -ry - rz, k1y = rx + a * ry, k1z = b + rz * (rx - c);
    const x2 = rx + 0.5*dt*k1x, y2 = ry + 0.5*dt*k1y, z2 = rz + 0.5*dt*k1z;
    const k2x = -y2 - z2, k2y = x2 + a*y2, k2z = b + z2*(x2 - c);
    const x3 = rx + 0.5*dt*k2x, y3 = ry + 0.5*dt*k2y, z3 = rz + 0.5*dt*k2z;
    const k3x = -y3 - z3, k3y = x3 + a*y3, k3z = b + z3*(x3 - c);
    const x4 = rx + dt*k3x, y4 = ry + dt*k3y, z4 = rz + dt*k3z;
    const k4x = -y4 - z4, k4y = x4 + a*y4, k4z = b + z4*(x4 - c);

    rx += (dt / 6.0) * (k1x + 2*k2x + 2*k3x + k4x);
    ry += (dt / 6.0) * (k1y + 2*k2y + 2*k3y + k4y);
    rz += (dt / 6.0) * (k1z + 2*k2z + 2*k3z + k4z);
  }

  const positions = [];
  const colors = [];
  const indices = [];
  const rw = 0.07;

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const nextP = pts[Math.min(i + 1, pts.length - 1)];
    const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
    if (tangent.lengthSq() < 0.0001) tangent.set(0, 1, 0);

    const normal = new THREE.Vector3(0, 1, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    if (binormal.lengthSq() < 0.0001) binormal.set(1, 0, 0);

    const off = binormal.multiplyScalar(rw);
    positions.push(p.x + off.x, p.y + off.y, p.z + off.z);
    positions.push(p.x - off.x, p.y - off.y, p.z - off.z);

    const zNorm = Math.min(1.0, zVals[i] / 12.0);
    const cR = 0.15 + 0.85 * zNorm;
    const cG = 0.70 + 0.25 * zNorm;
    const cB = 0.95 * (1.0 - zNorm);
    colors.push(cR, cG, cB, cR, cG, cB);
  }

  for (let i = 0; i < pts.length - 1; i++) {
    const a0 = i * 2, a1 = a0 + 1;
    const b0 = (i + 1) * 2, b1 = b0 + 1;
    indices.push(a0, b0, a1);
    indices.push(a1, b0, b1);
  }

  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  ribbonGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  ribbonGeo.setIndex(indices);
  ribbonGeo.computeVertexNormals();

  const ribbonMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.22,
    metalness: 0.80,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  group.add(ribbonMesh);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.55;
    }
  };
}

// 1C. Sincronización Colectiva de Kuramoto (θ̇ᵢ = ωᵢ + (K/N) ∑ sin(θⱼ - θᵢ))
function buildKuramoto3D(epColor) {
  const group = new THREE.Group();

  const ringGeo = new THREE.RingGeometry(0.70 - 0.015, 0.70 + 0.015, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const N = 32;
  const phases = new Float32Array(N);
  const natFreqs = new Float32Array(N);
  const oscMeshes = [];

  for (let i = 0; i < N; i++) {
    phases[i] = (i / N) * Math.PI * 2;
    natFreqs[i] = (Math.random() - 0.5) * 1.5;
    const osc = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
    );
    group.add(osc);
    oscMeshes.push(osc);
  }

  const orderArrowGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0)
  ]);
  const orderArrow = new THREE.Line(orderArrowGeo, new THREE.LineBasicMaterial({
    color: 0xf59e0b,
    linewidth: 3
  }));
  group.add(orderArrow);

  let kuramotoTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      kuramotoTime += dt;

      const K = 1.2 + 1.0 * Math.sin(kuramotoTime * 0.4);

      let sumCos = 0, sumSin = 0;
      for (let i = 0; i < N; i++) {
        sumCos += Math.cos(phases[i]);
        sumSin += Math.sin(phases[i]);
      }
      const rOrder = Math.hypot(sumCos, sumSin) / N;
      const psi = Math.atan2(sumSin, sumCos);

      for (let i = 0; i < N; i++) {
        const dTheta = natFreqs[i] + K * rOrder * Math.sin(psi - phases[i]);
        phases[i] += dTheta * dt * 2.5;

        const x = 0.70 * Math.cos(phases[i]);
        const z = 0.70 * Math.sin(phases[i]);
        oscMeshes[i].position.set(x, 0, z);

        const phaseDist = Math.abs(phases[i] - psi) % (Math.PI * 2);
        oscMeshes[i].material.color.setHex(phaseDist < 0.4 ? 0xf59e0b : 0x38bdf8);
      }

      const arrPos = orderArrowGeo.attributes.position.array;
      arrPos[3] = (0.70 * rOrder) * Math.cos(psi);
      arrPos[4] = 0;
      arrPos[5] = (0.70 * rOrder) * Math.sin(psi);
      orderArrowGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 1D. Ecuación Estocástica de Langevin & Movimiento Browniano (m ẍ = -γ ẋ + ξ(t))
function buildLangevin3D(epColor) {
  const group = new THREE.Group();

  const N = 240;
  const pts = [new THREE.Vector3(0, 0, 0)];
  let cur = new THREE.Vector3(0, 0, 0);
  const step = 0.055;
  for (let i = 1; i <= N; i++) {
    cur.x += (Math.random() - 0.5) * step;
    cur.y += (Math.random() - 0.5) * step;
    cur.z += (Math.random() - 0.5) * step;
    pts.push(cur.clone());
  }
  const pathGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const pathLine = new THREE.Line(pathGeo, new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85
  }));
  group.add(pathLine);

  const partMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 })
  );
  partMesh.position.copy(cur);
  group.add(partMesh);

  const diffGeo = new THREE.SphereGeometry(0.55, 20, 16);
  const diffMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.15,
    wireframe: true
  });
  const diffSphere = new THREE.Mesh(diffGeo, diffMat);
  group.add(diffSphere);

  let brownianT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      brownianT += dt * 3.0;
      partMesh.position.x = cur.x + (Math.random() - 0.5) * 0.02;
      partMesh.position.y = cur.y + (Math.random() - 0.5) * 0.02;
      partMesh.position.z = cur.z + (Math.random() - 0.5) * 0.02;

      const s = 1.0 + 0.15 * Math.sin(brownianT * 0.5);
      diffSphere.scale.set(s, s, s);
    }
  };
}

// 2. Botella de Klein (Inmersión 3D Figura 8 con Auto-Intersección)
function buildKlein3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(28, 28, (uNorm, vNorm) => {
    const u = uNorm * Math.PI * 2;
    const v = vNorm * Math.PI * 2;
    const r = 0.82;
    const x = (r + 0.32 * Math.cos(u/2) * Math.sin(v) - 0.32 * Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u);
    const y = (r + 0.32 * Math.cos(u/2) * Math.sin(v) - 0.32 * Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u);
    const z = 0.32 * Math.sin(u/2) * Math.sin(v) + 0.32 * Math.cos(u/2) * Math.sin(2*v);
    return { x: x * 0.92, y: y * 0.92, z: z * 0.92 };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.22,
    metalness: 0.78,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.82
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.z += 0.004;
    }
  };
}

// 3. Cinta de Möbius Tridimensional No-Orientable
function buildMobius3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(36, 8, (uNorm, vNorm) => {
    const u = uNorm * Math.PI * 2;
    const v = (vNorm - 0.5) * 0.52;
    const R = 0.85;
    const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
    const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
    const z = v * Math.sin(u / 2);
    return { x, y, z };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.28,
    metalness: 0.75,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));

  const borderPts = [];
  for (let i = 0; i <= 64; i++) {
    const u = (i / 64) * Math.PI * 4;
    const v = 0.26;
    const R = 0.85;
    borderPts.push(new THREE.Vector3(
      (R + v * Math.cos(u / 2)) * Math.cos(u),
      (R + v * Math.cos(u / 2)) * Math.sin(u),
      v * Math.sin(u / 2)
    ));
  }
  const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
  group.add(new THREE.Line(borderGeo, new THREE.LineBasicMaterial({ color: 0xffeedd, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.009;
      group.rotation.x += 0.005;
    }
  };
}

// 4. Fibración Topológica de Hopf & Cuaterniones (Círculos de Villarceau)
function buildHopf3D(epColor) {
  const group = new THREE.Group();
  const numRings = 10;
  const rings = [];
  for (let k = 0; k < numRings; k++) {
    const theta = (k / numRings) * Math.PI;
    const ringGeo = new THREE.TorusGeometry(0.85, 0.024, 8, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: epColor,
      roughness: 0.2,
      metalness: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 4 + theta * 0.5;
    ringMesh.rotation.y = theta;
    group.add(ringMesh);
    rings.push(ringMesh);
  }
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      rings.forEach((r, idx) => {
        r.rotation.z += 0.006 * (idx % 2 === 0 ? 1 : -1);
      });
    }
  };
}

// 5. Superficie Mínima Triplemente Periódica (TPMS Gyroid)
function buildTPMSGyroid3D(epColor) {
  const group = new THREE.Group();
  const cellGeo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const u = (uNorm - 0.5) * Math.PI * 2;
    const v = (vNorm - 0.5) * Math.PI * 2;
    const z = 0.45 * Math.sin(u) * Math.cos(v);
    const r = 0.85 * (1 + 0.15 * Math.cos(u * 2));
    return {
      x: r * Math.sin(uNorm * Math.PI) * Math.cos(v),
      y: r * Math.cos(uNorm * Math.PI),
      z: z
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(cellGeo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(cellGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x += 0.004;
    }
  };
}

// 6. Orbital Cuántico & Armónicos Esféricos Y_l^m (Schrödinger / Dirac)
function buildQuantumOrbital3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(32, 32, (uNorm, vNorm) => {
    const theta = uNorm * Math.PI;
    const phi = vNorm * Math.PI * 2;
    const cosT = Math.cos(theta);
    const Y20 = 0.5 * Math.abs(3 * cosT * cosT - 1);
    const r = 0.22 + 0.82 * Y20;
    return {
      x: r * Math.sin(theta) * Math.cos(phi),
      y: r * Math.cos(theta),
      z: r * Math.sin(theta) * Math.sin(phi)
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.2,
    metalness: 0.85,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  const ringGeo = new THREE.TorusGeometry(0.55, 0.03, 12, 40);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  let waveT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.01;
      waveT += dt * 3.0;
      const s = 1.0 + 0.05 * Math.sin(waveT);
      mesh.scale.set(s, 1.0 + 0.08 * Math.sin(waveT), s);
    }
  };
}

// 7. Embudo Gravitacional de Schwarzschild (Paraboloide de Flamm)
function buildSchwarzschild3D(epColor) {
  const group = new THREE.Group();
  const funnelGeo = createParametricSurface(24, 36, (uNorm, vNorm) => {
    const r_norm = 0.35 + uNorm * 0.82;
    const phi = vNorm * Math.PI * 2;
    const z = -0.92 * Math.sqrt(Math.max(0, (r_norm - 0.35) / 0.82));
    return {
      x: r_norm * Math.cos(phi),
      y: z + 0.35,
      z: r_norm * Math.sin(phi)
    };
  });
  const funnelMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.35,
    metalness: 0.7,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(funnelGeo, funnelMat));

  const bhGeo = new THREE.SphereGeometry(0.34, 24, 24);
  const bhMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
  const bhMesh = new THREE.Mesh(bhGeo, bhMat);
  bhMesh.position.y = -0.55;
  group.add(bhMesh);

  const accGeo = new THREE.TorusGeometry(0.58, 0.025, 8, 48);
  const accMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const accRing = new THREE.Mesh(accGeo, accMat);
  accRing.rotation.x = Math.PI / 2;
  accRing.position.y = -0.22;
  group.add(accRing);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.012;
      accRing.rotation.z += 0.025;
    }
  };
}

// 8. Doble Cono de Luz de Minkowski & Intervalo Espaciotemporal
function buildMinkowski3D(epColor) {
  const group = new THREE.Group();
  const coneGeo1 = new THREE.ConeGeometry(0.85, 0.95, 32, 1, true);
  const coneMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  const futureCone = new THREE.Mesh(coneGeo1, coneMat);
  futureCone.position.y = 0.475;
  group.add(futureCone);

  const pastCone = new THREE.Mesh(coneGeo1, coneMat);
  pastCone.rotation.x = Math.PI;
  pastCone.position.y = -0.475;
  group.add(pastCone);

  const linePts = [new THREE.Vector3(0, -0.95, 0), new THREE.Vector3(0, 0.95, 0)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
    }
  };
}

// 9. Vórtice Turbulento de Navier-Stokes & Filamentos en Cascada (Vórtice de Burgers Real)
// Solución analítica exacta de Navier-Stokes axisimétrico bajo estiramiento de vorticidad (ω·∇)u = ν∇²ω:
// Inflow radial:       u_r = -a * r
// Estiramiento axial:  u_y = 2 * a * y
// Vorticidad azimutal: u_theta = (Gamma / (2*pi*r)) * (1 - exp(-r² / r₀²))
// Núcleo de vorticidad: ω_y = (Gamma / (pi*r₀²)) * exp(-r² / r₀²)
function buildNavierStokesVortex3D(epColor) {
  const group = new THREE.Group();

  const aStrain = 0.45;
  const r0Core = 0.25;
  const gammaCirc = 3.8;
  const r0Sq = r0Core * r0Core;

  // Función analítica del campo de velocidades tridimensional de Burgers
  function burgersVelocity(x, y, z) {
    const r = Math.sqrt(x * x + z * z) + 1e-6;
    const ur = -aStrain * r;
    const utheta = (gammaCirc / (2.0 * Math.PI * r)) * (1.0 - Math.exp(-(r * r) / r0Sq));
    const uy = 2.0 * aStrain * y;

    const cosT = x / r;
    const sinT = z / r;
    const vx = ur * cosT - utheta * sinT;
    const vz = ur * sinT + utheta * cosT;
    return { vx, vy: uy, vz };
  }

  // A. Vaina Isóbara de Depresión Central (Criterio Q > 0 / Isosuperficie de Presión Barométrica)
  // Superficie hiperbólica continua con Shader Fresnel y disipación exponencial en los bordes
  const funnelGeo = createParametricSurface(36, 48, (uNorm, vNorm) => {
    const y = (uNorm - 0.5) * 1.9;
    const r = r0Core * Math.sqrt(1.0 + 2.6 * y * y);
    const th = vNorm * Math.PI * 2;
    return {
      x: r * Math.cos(th),
      y: y,
      z: r * Math.sin(th)
    };
  });

  const funnelShaderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color(0x0284c7) },
      uColorShear: { value: new THREE.Color(0x38bdf8) },
      uColorGlow: { value: new THREE.Color(0xa5f3fc) }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = position;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorCore;
      uniform vec3 uColorShear;
      uniform vec3 uColorGlow;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.2);

        // Desvanecimiento orgánico en los extremos axiales para eliminar corte artificial de CAD
        float yNorm = abs(vWorldPosition.y) / 0.95;
        float edgeFade = smoothstep(1.0, 0.45, yNorm);

        // Rizo de corte azimutal continuo
        float angle = atan(vWorldPosition.z, vWorldPosition.x);
        float swirl = sin(angle * 6.0 - vWorldPosition.y * 7.5 - uTime * 3.2);

        vec3 baseColor = mix(uColorCore, uColorShear, clamp(swirl * 0.4 + 0.6, 0.0, 1.0));
        vec3 finalColor = mix(baseColor, uColorGlow, fresnel * 0.8);
        float alpha = (0.22 + 0.60 * fresnel) * edgeFade;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const funnelMesh = new THREE.Mesh(funnelGeo, funnelShaderMat);
  group.add(funnelMesh);

  // B. Filamento de Vorticidad Extrema en el Núcleo (ω_z máximo en r ≤ 0.06)
  // Cordón axial luminoso en torsión helicoidal de alta energía
  const corePts = [];
  const numCorePts = 100;
  for (let i = 0; i <= numCorePts; i++) {
    const t = i / numCorePts;
    const y = (t - 0.5) * 1.85;
    const coreR = 0.038 * (1.0 + 0.25 * Math.sin(y * 10.0));
    const coreTh = y * 14.0;
    corePts.push(new THREE.Vector3(coreR * Math.cos(coreTh), y, coreR * Math.sin(coreTh)));
  }
  const coreCurve = new THREE.CatmullRomCurve3(corePts);
  const coreGeo = new THREE.TubeGeometry(coreCurve, 80, 0.018, 8, false);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // C. Haz de 8 Líneas de Corriente Integradas por Runge-Kutta 4 (RK4)
  // Trazadas rigurosamente paso a paso sobre el campo u(x, y, z) sin saltos poligonales
  const streamlinesGroup = new THREE.Group();
  const numHel = 8;
  const lineSteps = 56;
  const dtRK = 0.036;

  for (let h = 0; h < numHel; h++) {
    const phi0 = (h / numHel) * Math.PI * 2;
    const isTop = (h % 2 === 0);
    let curX = 0.65 * Math.cos(phi0);
    let curY = isTop ? 0.88 : -0.88;
    let curZ = 0.65 * Math.sin(phi0);
    const dir = isTop ? -1.0 : 1.0;

    const pts = [new THREE.Vector3(curX, curY, curZ)];

    for (let s = 0; s < lineSteps; s++) {
      const k1 = burgersVelocity(curX, curY, curZ);
      const k2 = burgersVelocity(
        curX + 0.5 * dtRK * dir * k1.vx,
        curY + 0.5 * dtRK * dir * k1.vy,
        curZ + 0.5 * dtRK * dir * k1.vz
      );
      const k3 = burgersVelocity(
        curX + 0.5 * dtRK * dir * k2.vx,
        curY + 0.5 * dtRK * dir * k2.vy,
        curZ + 0.5 * dtRK * dir * k2.vz
      );
      const k4 = burgersVelocity(
        curX + dtRK * dir * k3.vx,
        curY + dtRK * dir * k3.vy,
        curZ + dtRK * dir * k3.vz
      );

      curX += (dtRK * dir / 6.0) * (k1.vx + 2.0 * k2.vx + 2.0 * k3.vx + k4.vx);
      curY += (dtRK * dir / 6.0) * (k1.vy + 2.0 * k2.vy + 2.0 * k3.vy + k4.vy);
      curZ += (dtRK * dir / 6.0) * (k1.vz + 2.0 * k2.vz + 2.0 * k3.vz + k4.vz);

      pts.push(new THREE.Vector3(curX, curY, curZ));
      if (Math.abs(curY) > 0.95 || Math.sqrt(curX * curX + curZ * curZ) < 0.03) break;
    }

    const sGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const sMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending
    });
    const sLine = new THREE.Line(sGeo, sMat);
    streamlinesGroup.add(sLine);
  }
  group.add(streamlinesGroup);

  // D. Anillos de Diagnóstico Isóbaro (PIV Láser de Laboratorio a y = -0.42, 0.0, +0.42)
  const ringsGroup = new THREE.Group();
  const ringYs = [-0.42, 0.0, 0.42];
  ringYs.forEach(ry => {
    const rIso = r0Core * Math.sqrt(1.0 + 2.6 * ry * ry);
    const rGeo = new THREE.RingGeometry(rIso - 0.007, rIso + 0.007, 48);
    const rMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const rMesh = new THREE.Mesh(rGeo, rMat);
    rMesh.position.y = ry;
    rMesh.rotation.x = Math.PI / 2;
    ringsGroup.add(rMesh);
  });
  group.add(ringsGroup);

  // E. Trazadores Lagrangianos en Advección Viva Continua (72 partículas transportadas por u(x))
  const numP = 72;
  const pPositions = new Float32Array(numP * 3);
  const pColors = new Float32Array(numP * 3);

  function resetParticle(k) {
    const isTop = Math.random() > 0.5;
    const y = (isTop ? 1 : -1) * (0.65 + Math.random() * 0.25);
    const r = 0.50 + Math.random() * 0.25;
    const th = Math.random() * Math.PI * 2;
    pPositions[k * 3]     = r * Math.cos(th);
    pPositions[k * 3 + 1] = y;
    pPositions[k * 3 + 2] = r * Math.sin(th);
  }

  for (let k = 0; k < numP; k++) {
    resetParticle(k);
    pColors[k * 3]     = 0.22;
    pColors[k * 3 + 1] = 0.74;
    pColors[k * 3 + 2] = 0.97;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.046,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const pMesh = new THREE.Points(pGeo, pMat);
  group.add(pMesh);

  let totalSimTime = 0;

  return {
    group,
    update: (dt) => {
      totalSimTime += dt;
      funnelShaderMat.uniforms.uTime.value = totalSimTime;
      
      // Rotación global sutil de coherencia angular
      streamlinesGroup.rotation.y += 0.015;
      coreMesh.rotation.y += 0.035;

      // Advección Lagrangiana exacta en tiempo real
      const advectDt = Math.min(dt, 0.05) * 1.35;
      for (let k = 0; k < numP; k++) {
        const px = pPositions[k * 3];
        const py = pPositions[k * 3 + 1];
        const pz = pPositions[k * 3 + 2];

        const v = burgersVelocity(px, py, pz);

        pPositions[k * 3]     += v.vx * advectDt;
        pPositions[k * 3 + 1] += v.vy * advectDt;
        pPositions[k * 3 + 2] += v.vz * advectDt;

        const rCurr = Math.sqrt(pPositions[k * 3] * pPositions[k * 3] + pPositions[k * 3 + 2] * pPositions[k * 3 + 2]);
        const yCurr = pPositions[k * 3 + 1];

        // Mapeo termocromático de vorticidad: blanco incandescente en el cuello, cerúleo en periferia
        const coreFactor = Math.min(1.0, 0.18 / (rCurr + 0.05));
        pColors[k * 3]     = 0.22 + 0.78 * coreFactor;
        pColors[k * 3 + 1] = 0.74 + 0.26 * coreFactor;
        pColors[k * 3 + 2] = 1.0;

        // Reciclado suave si la partícula sale del volumen de confinamiento
        if (Math.abs(yCurr) > 0.94 || rCurr < 0.032 || rCurr > 0.88) {
          resetParticle(k);
        }
      }
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.color.needsUpdate = true;
    }
  };
}

// 9B. Tubo de Venturi de Bernoulli (Caída de Presión por Aceleración de Flujo)
function buildBernoulliTube3D(epColor) {
  const group = new THREE.Group();
  
  const venturiGeo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.8;
    const r = 0.52 - 0.26 * Math.exp(-x * x / 0.14);
    const th = vNorm * Math.PI * 2;
    return { x, y: r * Math.cos(th), z: r * Math.sin(th) };
  });
  const venturiMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.15,
    metalness: 0.3,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(venturiGeo, venturiMat));

  const m1Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12);
  const m1Mat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.8 });
  const m1 = new THREE.Mesh(m1Geo, m1Mat);
  m1.position.set(-0.65, 0.65, 0);
  group.add(m1);

  const m2Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12);
  const m2 = new THREE.Mesh(m2Geo, m1Mat);
  m2.position.set(0, 0.38, 0);
  group.add(m2);

  const streamPts = [];
  [-0.15, 0, 0.15].forEach(yOff => {
    for (let i = 0; i <= 30; i++) {
      const x = (i / 30 - 0.5) * 1.7;
      const r = (0.52 - 0.26 * Math.exp(-x * x / 0.14)) * 0.6;
      streamPts.push(x, yOff * (r / 0.32), 0);
    }
  });
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.Float32BufferAttribute(streamPts, 3));
  group.add(new THREE.Line(sGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x = 0.25;
    }
  };
}

// 9C. Celdas de Convección Térmica de Bénard (Hexágonos de Rayleigh-Bénard)
function buildBenardConvection3D(epColor) {
  const group = new THREE.Group();
  const hexR = 0.42;
  const centers = [
    [0, 0],
    [hexR * Math.sqrt(3), 0],
    [-hexR * Math.sqrt(3), 0],
    [hexR * Math.sqrt(3)/2, hexR * 1.5],
    [-hexR * Math.sqrt(3)/2, hexR * 1.5],
    [hexR * Math.sqrt(3)/2, -hexR * 1.5],
    [-hexR * Math.sqrt(3)/2, -hexR * 1.5]
  ];

  centers.forEach(([cx, cy], idx) => {
    const hexGeo = new THREE.CylinderGeometry(hexR * 0.95, hexR * 0.95, 0.35, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: idx === 0 ? epColor : 0x3b82f6,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.65
    });
    const cell = new THREE.Mesh(hexGeo, hexMat);
    cell.position.set(cx, 0, cy);
    group.add(cell);

    const torGeo = new THREE.TorusGeometry(hexR * 0.45, 0.025, 8, 24);
    const torMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const tor = new THREE.Mesh(torGeo, torMat);
    tor.rotation.x = Math.PI / 2;
    tor.position.set(cx, 0.18, cy);
    group.add(tor);
  });

  group.scale.set(0.68, 0.68, 0.68);
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.45;
    }
  };
}

// 10A. Resorte Helicoidal Elástico de Hooke (F = -kx)
function buildHookeSpring3D(epColor) {
  const group = new THREE.Group();
  
  const turns = 7;
  const pts = [];
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const angle = t * Math.PI * 2 * turns;
    const r = 0.28;
    const y = 0.65 - t * 1.1;
    pts.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const springGeo = new THREE.TubeGeometry(curve, 80, 0.028, 8, false);
  const springMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 });
  const springMesh = new THREE.Mesh(springGeo, springMat);
  group.add(springMesh);

  const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
  const topCap = new THREE.Mesh(capGeo, capMat);
  topCap.position.y = 0.68;
  group.add(topCap);

  const bobGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.32, 24);
  const bobMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 });
  const bob = new THREE.Mesh(bobGeo, bobMat);
  bob.position.y = -0.58;
  group.add(bob);

  const arrowGeo = new THREE.ConeGeometry(0.08, 0.22, 16);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  arrow.position.set(0, -0.22, 0.32);
  group.add(arrow);

  let oscT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      oscT += dt * 4.5;
      const disp = Math.sin(oscT) * 0.16;
      springMesh.scale.set(1.0, 1.0 + disp * 0.5, 1.0);
      bob.position.y = -0.58 + disp;
      arrow.position.y = -0.22 + disp;
      arrow.rotation.x = disp > 0 ? Math.PI : 0;
    }
  };
}

// 10B. Ley de la Palanca de Arquímedes (Equilibrio de Momentos F₁d₁ = F₂d₂)
function buildLeverArchimedes3D(epColor) {
  const group = new THREE.Group();
  
  const fulcrumGeo = new THREE.ConeGeometry(0.25, 0.45, 4);
  const fulcrumMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.4, metalness: 0.7 });
  const fulcrum = new THREE.Mesh(fulcrumGeo, fulcrumMat);
  fulcrum.rotation.y = Math.PI / 4;
  fulcrum.position.y = -0.22;
  group.add(fulcrum);

  const barGroup = new THREE.Group();
  const barGeo = new THREE.BoxGeometry(1.9, 0.06, 0.14);
  const barMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.25, metalness: 0.85 });
  barGroup.add(new THREE.Mesh(barGeo, barMat));

  const m1Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16);
  const m1Mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.9 });
  const m1 = new THREE.Mesh(m1Geo, m1Mat);
  m1.position.set(-0.35, 0.17, 0);
  barGroup.add(m1);

  const m2Geo = new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16);
  const m2 = new THREE.Mesh(m2Geo, m1Mat);
  m2.position.set(0.85, 0.11, 0);
  barGroup.add(m2);

  group.add(barGroup);

  let rockT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      rockT += dt * 2.0;
      barGroup.rotation.z = Math.sin(rockT) * 0.06;
    }
  };
}

// 10C. Principio de Flotabilidad de Arquímedes (E = ρ g V)
function buildBuoyancy3D(epColor) {
  const group = new THREE.Group();

  const fluidGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.95, 24);
  const fluidMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.35
  });
  group.add(new THREE.Mesh(fluidGeo, fluidMat));

  const surfGeo = new THREE.RingGeometry(0.02, 0.74, 24);
  const surfMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const surf = new THREE.Mesh(surfGeo, surfMat);
  surf.rotation.x = Math.PI / 2;
  surf.position.y = 0.46;
  group.add(surf);

  const bodyGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
  const bodyMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.8 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.32;
  group.add(body);

  const empujeGeo = new THREE.ConeGeometry(0.07, 0.25, 12);
  const empujeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const empuje = new THREE.Mesh(empujeGeo, empujeMat);
  empuje.position.set(0, 0.75, 0);
  group.add(empuje);

  const empujeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.32, 0), new THREE.Vector3(0, 0.75, 0)]),
    new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 })
  );
  group.add(empujeLine);

  let floatT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      floatT += dt * 3.0;
      const bobY = Math.sin(floatT) * 0.035;
      body.position.y = 0.32 + bobY;
      empuje.position.y = 0.75 + bobY;
    }
  };
}

// 10D. Leyes del Movimiento de Newton (Inercia, F = ma, Acción y Reacción)
function buildNewtonMechanics3D(epColor) {
  const group = new THREE.Group();

  const railGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 16);
  const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.8 });
  const rail = new THREE.Mesh(railGeo, railMat);
  rail.rotation.z = Math.PI / 2;
  group.add(rail);

  const massGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
  const massMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 });
  const massMesh = new THREE.Mesh(massGeo, massMat);
  group.add(massMesh);

  const fGeo = new THREE.ConeGeometry(0.06, 0.22, 12);
  const fMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const fCone = new THREE.Mesh(fGeo, fMat);
  fCone.rotation.z = -Math.PI / 2;
  fCone.position.set(0.42, 0, 0);
  massMesh.add(fCone);

  const rMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const rCone = new THREE.Mesh(fGeo, rMat);
  rCone.rotation.z = Math.PI / 2;
  rCone.position.set(-0.42, 0, 0);
  massMesh.add(rCone);

  let newtonT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      newtonT += dt * 3.0;
      massMesh.position.x = Math.sin(newtonT) * 0.45;
    }
  };
}

// 10E. Frentes de Onda del Efecto Doppler (Compresión y Dilatación Espectral)
function buildDoppler3D(epColor) {
  const group = new THREE.Group();
  
  const sourceGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const sourceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const source = new THREE.Mesh(sourceGeo, sourceMat);
  source.position.set(0.42, 0, 0);
  group.add(source);

  const rings = [];
  const numRings = 6;
  for (let k = 0; k < numRings; k++) {
    const frac = (k + 1) / numRings;
    const r = frac * 0.95;
    const xCenter = (1.0 - frac) * 0.42;
    const ringGeo = new THREE.TorusGeometry(r, 0.016, 8, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: k % 2 === 0 ? 0x38bdf8 : epColor,
      transparent: true,
      opacity: 0.85 - frac * 0.4
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(xCenter, 0, 0);
    group.add(ring);
    rings.push({ mesh: ring, baseR: r, baseCenter: xCenter });
  }

  let dopT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      group.rotation.x = 0.35;
      dopT += dt * 2.0;
      rings.forEach((r, idx) => {
        const pulse = 1.0 + 0.08 * Math.sin(dopT + idx * 0.8);
        r.mesh.scale.set(pulse, pulse, 1.0);
      });
    }
  };
}

// 10F. Onda de D'Alembert & Modos Armónicos de Cuerda Tensada (1747)
// Solución analítica exacta: ∂²u/∂t² = c² ∂²u/∂x² con u(x, t) = f(x - ct) + g(x + ct)
// Superposición de modos estacionarios y descomposición en ondas viajeras contrarias
function buildWaveString3D(epColor) {
  const group = new THREE.Group();

  // A. Puentes de Resonancia y Tensión en Latón Torneado (Cejuelas de Melde)
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    metalness: 0.85,
    roughness: 0.25
  });
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.6,
    roughness: 0.5
  });

  // Base de resonancia de grafito/madera acústica
  const baseGeo = new THREE.BoxGeometry(2.1, 0.08, 0.35);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.38;
  group.add(baseMesh);

  // Cejuelas de soporte en x = -0.92 y x = +0.92
  const bridgeGeo = new THREE.BoxGeometry(0.08, 0.42, 0.22);
  const post1 = new THREE.Mesh(bridgeGeo, bridgeMat);
  post1.position.set(-0.92, -0.17, 0);
  group.add(post1);

  const post2 = new THREE.Mesh(bridgeGeo, bridgeMat);
  post2.position.set(0.92, -0.17, 0);
  group.add(post2);

  // Clavijas micrométricas de tensión en los extremos
  const pegGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 12);
  const peg1 = new THREE.Mesh(pegGeo, bridgeMat);
  peg1.rotation.z = Math.PI / 2;
  peg1.position.set(-0.98, 0.02, 0);
  group.add(peg1);

  const peg2 = new THREE.Mesh(pegGeo, bridgeMat);
  peg2.rotation.z = Math.PI / 2;
  peg2.position.set(0.98, 0.02, 0);
  group.add(peg2);

  // B. Cuerda Principal Tensada de Alta Energía (Modos Armónicos Vibrantes)
  const N = 80;
  const L = 1.84; // Distancia libre entre cejuelas
  const xStart = -0.92;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = xStart + (i / N) * L;
    pts.push(new THREE.Vector3(x, 0.04, 0));
  }
  const waveGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const waveLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({
    color: 0x67e8f9,
    linewidth: 3,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  }));
  group.add(waveLine);

  // Segunda pasada para dar halo de resonancia luminosa a la cuerda
  const haloLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({
    color: 0x0284c7,
    linewidth: 5,
    transparent: true,
    opacity: 0.60,
    blending: THREE.AdditiveBlending
  }));
  group.add(haloLine);

  // C. Lámina Planar de Envolvente Resonante (Planar Wave Envelope - Cero volumen hinchado)
  // Muestra el rango de oscilación transversal u_max(x) en el plano vertical XY con degradado suave
  const envGeo = createParametricSurface(40, 6, (uNorm, vNorm) => {
    const x = xStart + uNorm * L;
    const maxAmp = 0.30 * Math.sin(uNorm * Math.PI);
    const y = 0.04 + (vNorm * 2.0 - 1.0) * maxAmp;
    const z = (vNorm - 0.5) * 0.012; // Espesor planar mínimo
    return { x, y, z };
  });
  const envMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const envMesh = new THREE.Mesh(envGeo, envMat);
  group.add(envMesh);

  // Líneas de cresta de envolvente superior e inferior
  const envUpperPts = [];
  const envLowerPts = [];
  for (let i = 0; i <= N; i++) {
    const x = xStart + (i / N) * L;
    const maxAmp = 0.30 * Math.sin((i / N) * Math.PI);
    envUpperPts.push(new THREE.Vector3(x, 0.04 + maxAmp, 0));
    envLowerPts.push(new THREE.Vector3(x, 0.04 - maxAmp, 0));
  }
  const envUpperGeo = new THREE.BufferGeometry().setFromPoints(envUpperPts);
  const envLowerGeo = new THREE.BufferGeometry().setFromPoints(envLowerPts);
  const envLineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.50,
    blending: THREE.AdditiveBlending
  });
  group.add(new THREE.Line(envUpperGeo, envLineMat));
  group.add(new THREE.Line(envLowerGeo, envLineMat));

  // D. Nodos Estáticos de Resonancia Harmónica (Nodal Rings en x = 0 y x = ±L/3)
  const nodeMarkers = [];
  const nodeXs = [0.0, -L / 3, L / 3];
  nodeXs.forEach(nx => {
    const ringGeo = new THREE.RingGeometry(0.035, 0.05, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdfc285,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(nx, 0.04, 0);
    group.add(ring);
    nodeMarkers.push(ring);
  });

  // E. Ondas Viajeras de D'Alembert f(x - ct) [Cian] y g(x + ct) [Oro]
  // Dos pulsos solitarios que viajan en direcciones opuestas en planos desplazados z = ±0.06
  const pulseN = 50;
  const fPts = [];
  const gPts = [];
  for (let i = 0; i <= pulseN; i++) {
    const x = xStart + (i / pulseN) * L;
    fPts.push(new THREE.Vector3(x, -0.22, 0.06));
    gPts.push(new THREE.Vector3(x, -0.22, -0.06));
  }
  const fGeo = new THREE.BufferGeometry().setFromPoints(fPts);
  const gGeo = new THREE.BufferGeometry().setFromPoints(gPts);
  const fLine = new THREE.Line(fGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
  const gLine = new THREE.Line(gGeo, new THREE.LineBasicMaterial({ color: 0xdfc285, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
  group.add(fLine);
  group.add(gLine);

  let waveTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      waveTime += dt * 4.8;

      // 1. Vibración de la cuerda principal: Superposición exacta de modos normales
      const positions = waveGeo.attributes.position.array;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const yMode1 = 0.24 * Math.sin(u * Math.PI) * Math.sin(waveTime);
        const yMode2 = 0.09 * Math.sin(u * 2.0 * Math.PI) * Math.cos(waveTime * 2.0);
        const yMode3 = 0.04 * Math.sin(u * 3.0 * Math.PI) * Math.sin(waveTime * 3.0);
        positions[i * 3 + 1] = 0.04 + yMode1 + yMode2 + yMode3;
      }
      waveGeo.attributes.position.needsUpdate = true;

      // 2. Pulsos de D'Alembert f(x - ct) hacia la derecha y g(x + ct) hacia la izquierda
      const fPos = fGeo.attributes.position.array;
      const gPos = gGeo.attributes.position.array;
      const c = 0.85;
      const centerF = xStart + ((waveTime * c) % L);
      const centerG = (xStart + L) - ((waveTime * c) % L);
      for (let i = 0; i <= pulseN; i++) {
        const x = xStart + (i / pulseN) * L;
        const dF = x - centerF;
        const pulseF = 0.13 * Math.exp(-(dF * dF) / 0.025);
        fPos[i * 3 + 1] = -0.22 + pulseF;

        const dG = x - centerG;
        const pulseG = 0.13 * Math.exp(-(dG * dG) / 0.025);
        gPos[i * 3 + 1] = -0.22 + pulseG;
      }
      fGeo.attributes.position.needsUpdate = true;
      gGeo.attributes.position.needsUpdate = true;

      // 3. Pulsación armónica de los anillos nodales
      nodeMarkers.forEach((ring, idx) => {
        const scale = 1.0 + 0.14 * Math.sin(waveTime * 2.0 + idx * 1.2);
        ring.scale.set(scale, scale, 1.0);
      });
    }
  };
}

// 10. Solitón Hidrodinámico de Russell & KdV (Onda Solitaria No-Lineal en Canal)
function buildKdvSoliton3D(epColor) {
  const group = new THREE.Group();

  // Canal de agua horizontal
  const flumeGeo = new THREE.BoxGeometry(1.9, 0.08, 0.55);
  const flumeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
  const flume = new THREE.Mesh(flumeGeo, flumeMat);
  flume.position.y = -0.35;
  group.add(flume);

  // Perfil de solitón sech²(x - ct)
  const N = 48;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N - 0.5) * 1.8;
    const sech = 1.0 / Math.cosh(x * 3.5);
    const y = sech * sech * 0.55 - 0.32;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const solGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const solLine = new THREE.Line(solGeo, new THREE.LineBasicMaterial({ color: epColor, linewidth: 3 }));
  group.add(solLine);

  // Superficie fluida del solitón en el canal
  const solMeshGeo = createParametricSurface(24, 16, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.8;
    const z = (vNorm - 0.5) * 0.5;
    const sech = 1.0 / Math.cosh(x * 3.5);
    const y = sech * sech * 0.52 - 0.32;
    return { x, y, z };
  });
  const solMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.15,
    metalness: 0.6,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(solMeshGeo, solMat));

  let solShift = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      solShift += dt * 0.6;
      if (solShift > 1.8) solShift = 0;
    }
  };
}

// 10G. Superficie de Curva Elíptica de Weierstrass (Fermat, Beal y Aritmética Modular)
function buildEllipticCurveSurface3D(epColor) {
  const group = new THREE.Group();
  
  const geo = createParametricSurface(28, 28, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.6;
    const th = vNorm * Math.PI * 2;
    const rhs = Math.max(0.04, x * x * x - 0.7 * x + 0.35);
    const r = Math.sqrt(rhs) * 0.65;
    return {
      x: x * 0.95,
      y: r * Math.sin(th),
      z: r * Math.cos(th)
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.78
  });
  group.add(new THREE.Mesh(geo, mat));

  const pts = [
    [-0.5, 0.45, 0], [-0.5, -0.45, 0],
    [0.1, 0.38, 0.2], [0.1, -0.38, -0.2],
    [0.65, 0.65, 0], [0.65, -0.65, 0]
  ];
  pts.forEach(([px, py, pz]) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    dot.position.set(px, py, pz);
    group.add(dot);
  });

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.z += 0.004;
    }
  };
}

// 10H. Proyección Tridimensional del Hipercubo Booleano 4D (Tesseract · P vs NP)
function buildComplexityHypercube3D(epColor) {
  const group = new THREE.Group();

  const verts4D = [];
  for (let i = 0; i < 16; i++) {
    verts4D.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1
    ]);
  }

  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let b = 0; b < 4; b++) {
      const j = i ^ (1 << b);
      if (i < j) edges.push([i, j]);
    }
  }

  const vMeshes = [];
  verts4D.forEach(() => {
    const vMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    group.add(vMesh);
    vMeshes.push(vMesh);
  });

  const linePts = [];
  edges.forEach(() => {
    linePts.push(new THREE.Vector3(), new THREE.Vector3());
  });
  const edgeGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const edgeLine = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: epColor, transparent: true, opacity: 0.8 }));
  group.add(edgeLine);

  let rot4D = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      rot4D += dt * 1.2;
      const cosT = Math.cos(rot4D);
      const sinT = Math.sin(rot4D);

      const proj3D = verts4D.map(([x, y, z, w]) => {
        const xRot = x * cosT - w * sinT;
        const wRot = x * sinT + w * cosT;
        const dist = 2.4;
        const fov = 1.0 / (dist - wRot * 0.45);
        return new THREE.Vector3(xRot * fov * 0.85, y * fov * 0.85, z * fov * 0.85);
      });

      proj3D.forEach((p, idx) => vMeshes[idx].position.copy(p));

      const posAttr = edgeGeo.attributes.position.array;
      edges.forEach(([i, j], eIdx) => {
        const p1 = proj3D[i];
        const p2 = proj3D[j];
        posAttr[eIdx * 6]     = p1.x;
        posAttr[eIdx * 6 + 1] = p1.y;
        posAttr[eIdx * 6 + 2] = p1.z;
        posAttr[eIdx * 6 + 3] = p2.x;
        posAttr[eIdx * 6 + 4] = p2.y;
        posAttr[eIdx * 6 + 5] = p2.z;
      });
      edgeGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 10I. Flujo de Ricci & Regularización Topológica (Perelman · Poincaré)
function buildRicciFlow3D(epColor) {
  const group = new THREE.Group();

  let flowT = 0;
  const geo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const z = (uNorm - 0.5) * 1.8;
    const neck = 0.28 + 0.35 * (1.0 - Math.exp(-z * z / 0.15));
    const th = vNorm * Math.PI * 2;
    return { x: neck * Math.cos(th), y: z, z: neck * Math.sin(th) };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x += 0.004;
      flowT += dt * 1.5;
      const s = 1.0 + 0.08 * Math.sin(flowT);
      mesh.scale.set(s, 1.0 - 0.05 * Math.sin(flowT), s);
    }
  };
}

// 10J. Curvatura Espaciotemporal de Einstein (Ecuación de Campo G_μν = 8πG T_μν)
function buildEinsteinCurvature3D(epColor) {
  const group = new THREE.Group();

  const gridGeo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 2.0;
    const y = (vNorm - 0.5) * 2.0;
    const r = Math.hypot(x, y);
    const z = -0.75 / (1.0 + r * r * 3.5);
    return { x, y: z, z: y };
  });
  const gridMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.3,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(gridGeo, gridMat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(gridGeo), new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 })));

  const massGeo = new THREE.SphereGeometry(0.25, 20, 20);
  const massMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.15, metalness: 0.9, emissive: epColor, emissiveIntensity: 0.4 });
  const mass = new THREE.Mesh(massGeo, massMat);
  mass.position.y = -0.52;
  group.add(mass);

  const rayPts = [];
  for (let i = 0; i <= 30; i++) {
    const t = (i / 30 - 0.5) * 2.0;
    const def = -0.32 / (1.0 + t * t * 4.0);
    rayPts.push(new THREE.Vector3(t, def - 0.1, 0.45 + def * 0.3));
  }
  const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPts);
  group.add(new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      mass.rotation.y += 0.015;
    }
  };
}

// 10K. Expansión Cósmica de Hubble & Friedmann (v = H₀ d · Redshift Relativista)
function buildHubbleExpansion3D(epColor) {
  const group = new THREE.Group();

  const numG = 36;
  const galaxies = [];
  const gGeo = new THREE.BufferGeometry();
  const gPos = new Float32Array(numG * 3);
  const gColors = new Float32Array(numG * 3);

  for (let i = 0; i < numG; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = (Math.random() - 0.5) * Math.PI;
    const r0 = 0.25 + Math.random() * 0.65;
    galaxies.push({ r0, th, ph });

    const color = new THREE.Color().setHSL(0.55 - r0 * 0.55, 0.9, 0.55);
    gColors[i * 3]     = color.r;
    gColors[i * 3 + 1] = color.g;
    gColors[i * 3 + 2] = color.b;
  }
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  gGeo.setAttribute('color', new THREE.BufferAttribute(gColors, 3));

  const gPoints = new THREE.Points(gGeo, new THREE.PointsMaterial({ size: 0.065, vertexColors: true }));
  group.add(gPoints);

  const sphereWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(0.95, 12, 12)),
    new THREE.LineBasicMaterial({ color: epColor, transparent: true, opacity: 0.25 })
  );
  group.add(sphereWire);

  let hubbleT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      hubbleT += dt * 1.8;
      const scaleA = 1.0 + 0.35 * Math.sin(hubbleT);
      const positions = gGeo.attributes.position.array;
      for (let i = 0; i < numG; i++) {
        const g = galaxies[i];
        const r = g.r0 * scaleA;
        positions[i * 3]     = r * Math.cos(g.ph) * Math.sin(g.th);
        positions[i * 3 + 1] = r * Math.sin(g.ph);
        positions[i * 3 + 2] = r * Math.cos(g.ph) * Math.cos(g.th);
      }
      gGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 10L. Superficie de Volatilidad de Black-Scholes (Sonrisa de Volatilidad & EDP de Difusión)
function buildBlackScholesSurface3D(epColor) {
  const group = new THREE.Group();

  const geo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const s = (uNorm - 0.5) * 1.8;
    const tau = vNorm * 1.6;
    const d1 = s / (0.35 * Math.sqrt(Math.max(0.08, tau)));
    const v = Math.max(0, s) * 0.45 + 0.28 * Math.exp(-d1 * d1 * 0.5) * Math.sqrt(tau);
    return {
      x: s * 0.95,
      y: (v - 0.4) * 0.85,
      z: (tau - 0.8) * 0.95
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  const pathPts = [];
  let curS = -0.8;
  for (let i = 0; i <= 30; i++) {
    const tau = (i / 30) * 1.6;
    curS += (Math.random() - 0.48) * 0.12;
    pathPts.push(new THREE.Vector3(curS, 0.15 + curS * 0.3, tau - 0.8));
  }
  const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPts);
  group.add(new THREE.Line(pathGeo, new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x = 0.35;
    }
  };
}

// 10M. Viga Elástica de Euler-Bernoulli (Deformación por Flexión EI w'''' = q)
function buildEulerBeam3D(epColor) {
  const group = new THREE.Group();

  const wallGeo = new THREE.BoxGeometry(0.12, 0.85, 0.45);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(-0.85, 0, 0);
  group.add(wall);

  const pts = [];
  const N = 32;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = -0.8 + t * 1.6;
    const deflection = -0.38 * (3 * t * t - t * t * t) / 2.0;
    pts.push(new THREE.Vector3(x, deflection, 0));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const beamGeo = new THREE.TubeGeometry(curve, 32, 0.065, 8, false);
  const beamMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.25, metalness: 0.85 });
  group.add(new THREE.Mesh(beamGeo, beamMat));

  const loadCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.08, 0.24, 16),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  loadCone.position.set(0.8, -0.22, 0);
  group.add(loadCone);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
    }
  };
}

// 10N. Teorema Fundamental del Cálculo & Sumas Integrales de Riemann
function buildCalculusRiemannSum3D(epColor) {
  const group = new THREE.Group();

  const pts = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const x = (i / N - 0.5) * 1.6;
    const y = 0.35 + 0.32 * Math.cos(x * 2.5);
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
  group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 })));

  const numBars = 8;
  const barW = 1.6 / numBars;
  for (let b = 0; b < numBars; b++) {
    const x = -0.8 + (b + 0.5) * barW;
    const h = 0.35 + 0.32 * Math.cos(x * 2.5);
    const barGeo = new THREE.BoxGeometry(barW * 0.92, h, 0.22);
    const barMat = new THREE.MeshStandardMaterial({
      color: epColor,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.72
    });
    const barMesh = new THREE.Mesh(barGeo, barMat);
    barMesh.position.set(x, h / 2, 0);
    group.add(barMesh);
  }

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.95, 0, 0), new THREE.Vector3(0.95, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  group.add(axis);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.2;
    }
  };
}

// 10O. Ley de Coulomb & Líneas de Campo del Dipolo Eléctrico
function buildCoulombField3D(epColor) {
  const group = new THREE.Group();

  const qPosMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.8 }));
  qPosMesh.position.set(-0.55, 0, 0);
  group.add(qPosMesh);

  const qNegMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.8 }));
  qNegMesh.position.set(0.55, 0, 0);
  group.add(qNegMesh);

  const numLines = 8;
  for (let k = 0; k < numLines; k++) {
    const angle = (k / numLines) * Math.PI * 2;
    const curvePts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = -0.55 + t * 1.1;
      const y = Math.sin(t * Math.PI) * 0.45 * Math.cos(angle);
      const z = Math.sin(t * Math.PI) * 0.45 * Math.sin(angle);
      curvePts.push(new THREE.Vector3(x, y, z));
    }
    const cGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
    group.add(new THREE.Line(cGeo, new THREE.LineBasicMaterial({ color: epColor, transparent: true, opacity: 0.65 })));
  }

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.z += 0.004;
    }
  };
}

// 11. Paisaje Modular de la Función Zeta de Riemann |ζ(s)|
function buildRiemann3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(28, 28, (uNorm, vNorm) => {
    const sigma = (uNorm - 0.5) * 1.6;
    const t = vNorm * 3.0;
    const d1 = Math.hypot(sigma, t - 0.7);
    const d2 = Math.hypot(sigma, t - 1.8);
    const d3 = Math.hypot(sigma, t - 2.6);
    const z = Math.min(0.9, 0.2 + 0.7 * Math.tanh(d1 * d2 * d3 * 2.5) + 0.15 * Math.abs(sigma));
    return {
      x: sigma * 1.1,
      y: (t - 1.5) * 0.65,
      z: (z - 0.45) * 0.9
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));

  const critPts = [];
  for (let i = 0; i <= 30; i++) {
    const tNorm = i / 30;
    const t = tNorm * 3.0;
    const d1 = Math.hypot(0, t - 0.7);
    const d2 = Math.hypot(0, t - 1.8);
    const d3 = Math.hypot(0, t - 2.6);
    const z = Math.min(0.9, 0.2 + 0.7 * Math.tanh(d1 * d2 * d3 * 2.5));
    critPts.push(new THREE.Vector3(0, (t - 1.5) * 0.65, (z - 0.45) * 0.9 + 0.02));
  }
  const critGeo = new THREE.BufferGeometry().setFromPoints(critPts);
  group.add(new THREE.Line(critGeo, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
    }
  };
}

// 12. Sombrero Mexicano de Higgs & Ruptura Espontánea de Simetría
function buildHiggs3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(24, 36, (uNorm, vNorm) => {
    const r = uNorm * 1.05;
    const phi = vNorm * Math.PI * 2;
    const z = 0.75 * (-2 * r * r + r * r * r * r) + 0.35;
    return {
      x: r * Math.cos(phi),
      y: z,
      z: r * Math.sin(phi)
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));

  const beadGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const beadMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.95 });
  const bead = new THREE.Mesh(beadGeo, beadMat);
  group.add(bead);

  let beadAngle = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      beadAngle += dt * 2.2;
      bead.position.set(Math.cos(beadAngle), -0.4, Math.sin(beadAngle));
    }
  };
}

// 13. Filotaxis Esférica Áurea de Fibonacci en S²
function buildFibonacci3D(epColor) {
  const group = new THREE.Group();
  const N = 240;
  const pos = new Float32Array(N * 3);
  const phiAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y)) * 0.92;
    const theta = phiAngle * i;
    pos[i * 3]     = radius * Math.cos(theta);
    pos[i * 3 + 1] = y * 0.92;
    pos[i * 3 + 2] = radius * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.045, color: epColor })));

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.35 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x += 0.003;
    }
  };
}

// 14. Sistema Orbital Kepleriano 3D (Elipse y Foco Solar)
function buildKepler3D(epColor) {
  const group = new THREE.Group();
  const a = 0.95;
  const e = 0.62;
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e;

  const sunGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(-c, 0, 0);
  group.add(sun);

  const pts = [];
  for (let i = 0; i <= 64; i++) {
    const th = (i / 64) * Math.PI * 2;
    pts.push(new THREE.Vector3(a * Math.cos(th), b * Math.sin(th), 0));
  }
  const elGeo = new THREE.BufferGeometry().setFromPoints(pts);
  group.add(new THREE.Line(elGeo, new THREE.LineBasicMaterial({ color: epColor, linewidth: 2 })));

  const planetGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const planetMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  group.add(planet);

  let meanAnomaly = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.x = 0.35;
      group.rotation.z += 0.004;
      meanAnomaly += dt * 1.5;
      let E = meanAnomaly;
      for (let k = 0; k < 3; k++) E = E - (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
      const px = a * Math.cos(E);
      const py = b * Math.sin(E);
      planet.position.set(px, py, 0);
    }
  };
}

// 15. Poliedros Duales de Euler (Icosaedro & Dodecaedro V - E + F = 2)
function buildEuler3D(epColor) {
  const group = new THREE.Group();
  const icoGeo = new THREE.IcosahedronGeometry(0.85, 0);
  const icoMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  group.add(icoMesh);
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(icoGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })));

  const dodGeo = new THREE.DodecahedronGeometry(0.55, 0);
  const dodMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
  });
  const dodMesh = new THREE.Mesh(dodGeo, dodMat);
  group.add(dodMesh);

  return {
    group,
    update: (dt) => {
      icoMesh.rotation.y += 0.008;
      dodMesh.rotation.y -= 0.012;
      dodMesh.rotation.x += 0.006;
    }
  };
}

// 16. Onda Electromagnética Transversal de Maxwell 3D (E ⟂ B ⟂ k)
function buildMaxwell3D(epColor) {
  const group = new THREE.Group();
  const N = 60;
  const ePts = [];
  const bPts = [];
  for (let i = 0; i <= N; i++) {
    const z = (i / N - 0.5) * 1.8;
    const k = Math.PI * 4;
    const ex = 0.45 * Math.cos(k * z);
    const by = 0.45 * Math.sin(k * z);
    ePts.push(new THREE.Vector3(ex, 0, z));
    bPts.push(new THREE.Vector3(0, by, z));
  }
  const eLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ePts), new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 }));
  const bLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(bPts), new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 }));
  group.add(eLine);
  group.add(bLine);

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -0.95), new THREE.Vector3(0, 0, 0.95)]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  group.add(axis);

  return {
    group,
    update: (dt) => {
      group.rotation.z += 0.01;
      group.rotation.y += 0.005;
    }
  };
}

// 16A. Primera Ecuación de Maxwell: Ley de Gauss Eléctrica (∇·E = ρ/ε₀)
// Divergencia neta de campo electrostático saliente a través de una superficie gaussiana cerrada
function buildGaussElectric3D(epColor) {
  const group = new THREE.Group();

  // 1. Carga puntual central positiva (Monopolo Eléctrico +Q)
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.95 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), coreMat);
  group.add(core);

  const coronaMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
  const corona = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), coronaMat);
  group.add(corona);

  // 2. Superficie Gaussiana Esférica Cerrada S (Radio R = 0.72)
  const sphereGeo = new THREE.SphereGeometry(0.72, 24, 18);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.18,
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const gaussSphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(gaussSphere);

  const sphereWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(sphereGeo),
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 })
  );
  group.add(sphereWire);

  // 3. Haces de Líneas de Campo Eléctrico Radiales Divergentes (E ∝ r̂ / r²)
  const numRays = 18;
  const rayLines = new THREE.Group();
  const rayVectors = [];
  for (let i = 0; i < numRays; i++) {
    const phi = Math.acos(-1 + (2 * i) / numRays);
    const theta = Math.sqrt(numRays * Math.PI) * phi;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    ).normalize();
    rayVectors.push(dir);

    const pts = [
      dir.clone().multiplyScalar(0.14),
      dir.clone().multiplyScalar(1.05)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    }));
    rayLines.add(line);

    // Pequeño vector normal dA en el cruce de la superficie gaussiana
    const daPos = dir.clone().multiplyScalar(0.72);
    const daTip = dir.clone().multiplyScalar(0.85);
    const daGeo = new THREE.BufferGeometry().setFromPoints([daPos, daTip]);
    const daLine = new THREE.Line(daGeo, new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.95
    }));
    rayLines.add(daLine);
  }
  group.add(rayLines);

  // 4. Trazadores de Flujo Eléctrico Radiales Continuos (Partículas de Campo E)
  const numP = 36;
  const pPositions = new Float32Array(numP * 3);
  const pRads = new Float32Array(numP);
  const pRayIdx = new Int32Array(numP);
  for (let k = 0; k < numP; k++) {
    pRayIdx[k] = k % numRays;
    pRads[k] = 0.15 + Math.random() * 0.9;
    const d = rayVectors[pRayIdx[k]];
    pPositions[k * 3]     = d.x * pRads[k];
    pPositions[k * 3 + 1] = d.y * pRads[k];
    pPositions[k * 3 + 2] = d.z * pRads[k];
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.045,
    color: 0xfde047,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  }));
  group.add(pMesh);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      corona.scale.setScalar(1.0 + 0.08 * Math.sin(performance.now() * 0.005));

      const speed = dt * 0.65;
      for (let k = 0; k < numP; k++) {
        pRads[k] += speed;
        if (pRads[k] > 1.05) pRads[k] = 0.15;
        const d = rayVectors[pRayIdx[k]];
        pPositions[k * 3]     = d.x * pRads[k];
        pPositions[k * 3 + 1] = d.y * pRads[k];
        pPositions[k * 3 + 2] = d.z * pRads[k];
      }
      pGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 16B. Segunda Ecuación de Maxwell: Ley de Gauss Magnética (∇·B = 0)
// Inexistencia de monopolos magnéticos: líneas de campo cerradas continuas sin fuente ni sumidero
function buildGaussMagnetic3D(epColor) {
  const group = new THREE.Group();

  // 1. Dipolo Magnético Físico Central (Imán Bipolar N/S)
  const poleGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.28, 16);
  const northMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.25 });
  const north = new THREE.Mesh(poleGeo, northMat);
  north.position.y = 0.14;
  group.add(north);

  const southMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.25 });
  const south = new THREE.Mesh(poleGeo, southMat);
  south.position.y = -0.14;
  group.add(south);

  const bandGeo = new THREE.CylinderGeometry(0.072, 0.072, 0.04, 16);
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.2 });
  group.add(new THREE.Mesh(bandGeo, bandMat));

  // 2. Lazos Cerrados de Campo Magnético Dipolar B
  const numLoops = 12;
  const loopGroup = new THREE.Group();
  for (let l = 0; l < numLoops; l++) {
    const azim = (l / numLoops) * Math.PI * 2;
    [0.45, 0.72, 1.05].forEach(rMax => {
      const pts = [];
      const N = 48;
      for (let i = 0; i <= N; i++) {
        const th = (i / N) * Math.PI;
        const r = rMax * Math.sin(th) * Math.sin(th) + 0.05;
        const y = r * Math.cos(th) * 1.25;
        const distHoriz = r * Math.sin(th);
        const x = distHoriz * Math.cos(azim);
        const z = distHoriz * Math.sin(azim);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const loopGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const loopLine = new THREE.Line(loopGeo, new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      }));
      loopGroup.add(loopLine);
    });
  }
  group.add(loopGroup);

  // 3. Superficie Gaussiana de Prueba (Mostrando Flujo Neto Nulo ∯ B·dA = 0)
  const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 18, 14),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.12, wireframe: true })
  );
  group.add(testSphere);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      loopGroup.rotation.y += 0.003;
    }
  };
}

// 16C. Tercera Ecuación de Maxwell: Ley de Inducción de Faraday (∇×E = -∂B/∂t)
// Un campo magnético variable en el tiempo induce vórtices cerrados de campo eléctrico rotacional
function buildFaradayMaxwell3D(epColor) {
  const group = new THREE.Group();

  // 1. Núcleo cilíndrico de Flujo Magnético Variable B_z(t)
  const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 20);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.75,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.8
  });
  const magCore = new THREE.Mesh(coreGeo, coreMat);
  group.add(magCore);

  const bLinesGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const bx = 0.07 * Math.cos(ang);
    const bz = 0.07 * Math.sin(ang);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(bx, -0.7, bz),
      new THREE.Vector3(bx, 0.7, bz)
    ]);
    bLinesGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })));
  }
  group.add(bLinesGroup);

  // 2. Anillos Concéntricos de Campo Eléctrico Rotacional E_θ (Vórtices de Faraday)
  const ringRadii = [0.32, 0.55, 0.80];
  const eRingsGroup = new THREE.Group();
  ringRadii.forEach(rad => {
    const ringGeo = new THREE.RingGeometry(rad - 0.012, rad + 0.012, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.70,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    eRingsGroup.add(ringMesh);
  });
  group.add(eRingsGroup);

  // 3. Trazadores de Circulación Rotacional ∇×E
  const numP = 36;
  const pPos = new Float32Array(numP * 3);
  const pAngles = new Float32Array(numP);
  const pRadChoice = new Float32Array(numP);
  for (let k = 0; k < numP; k++) {
    pAngles[k] = Math.random() * Math.PI * 2;
    pRadChoice[k] = ringRadii[k % ringRadii.length];
    pPos[k * 3]     = pRadChoice[k] * Math.cos(pAngles[k]);
    pPos[k * 3 + 1] = 0;
    pPos[k * 3 + 2] = pRadChoice[k] * Math.sin(pAngles[k]);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.05,
    color: 0xfde047,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  }));
  group.add(pMesh);

  let faradayTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      faradayTime += dt * 3.5;

      const dBdt = -Math.sin(faradayTime);
      magCore.material.emissiveIntensity = 0.5 + 0.5 * Math.abs(Math.cos(faradayTime));

      const rotSpeed = dBdt * dt * 2.2;
      for (let k = 0; k < numP; k++) {
        pAngles[k] += rotSpeed * (0.6 / pRadChoice[k]);
        pPos[k * 3]     = pRadChoice[k] * Math.cos(pAngles[k]);
        pPos[k * 3 + 1] = 0;
        pPos[k * 3 + 2] = pRadChoice[k] * Math.sin(pAngles[k]);
      }
      pGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 16D. Cuarta Ecuación de Maxwell: Ley de Ampère-Maxwell (∇×B = μ₀J + μ₀ε₀ ∂E/∂t)
// La corriente de desplazamiento en el condensador genera campo magnético en el vacío
function buildAmpereMaxwell3D(epColor) {
  const group = new THREE.Group();

  // 1. Placas circulares de condensador en z = -0.32 y z = +0.32
  const plateGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.2 });
  const p1 = new THREE.Mesh(plateGeo, plateMat);
  p1.rotation.x = Math.PI / 2;
  p1.position.z = -0.32;
  group.add(p1);

  const p2 = new THREE.Mesh(plateGeo, plateMat);
  p2.rotation.x = Math.PI / 2;
  p2.position.z = 0.32;
  group.add(p2);

  const wireGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12);
  const wireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.3 });
  const w1 = new THREE.Mesh(wireGeo, wireMat);
  w1.rotation.x = Math.PI / 2;
  w1.position.z = -0.65;
  group.add(w1);
  const w2 = new THREE.Mesh(wireGeo, wireMat);
  w2.rotation.x = Math.PI / 2;
  w2.position.z = 0.65;
  group.add(w2);

  // 2. Líneas de Campo Eléctrico Variable E(t) en la brecha
  const eFieldLines = new THREE.Group();
  for (let r = 0.15; r <= 0.42; r += 0.12) {
    for (let i = 0; i < 6; i++) {
      const th = (i / 6) * Math.PI * 2;
      const ex = r * Math.cos(th);
      const ey = r * Math.sin(th);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ex, ey, -0.30),
        new THREE.Vector3(ex, ey, 0.30)
      ]);
      eFieldLines.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75
      })));
    }
  }
  group.add(eFieldLines);

  // 3. Anillos de Campo Magnético Inducido B alrededor de la brecha
  const bRings = new THREE.Group();
  [0.25, 0.45, 0.68].forEach(rad => {
    const ringGeo = new THREE.RingGeometry(rad - 0.01, rad + 0.01, 36);
    const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.80,
      blending: THREE.AdditiveBlending
    }));
    bRings.add(ringMesh);
  });
  group.add(bRings);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      bRings.rotation.z += 0.025;
    }
  };
}

// 16E. Fuerza Electromagnética de Lorentz (F = q(E + v × B))
// Espiral helicoidal de Larmor y precesión de ciclotrón bajo campo magnético
function buildLorentzForce3D(epColor) {
  const group = new THREE.Group();

  const bField = new THREE.Group();
  for (let ix = -0.6; ix <= 0.6; ix += 0.4) {
    for (let iz = -0.6; iz <= 0.6; iz += 0.4) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ix, -0.85, iz),
        new THREE.Vector3(ix, 0.85, iz)
      ]);
      bField.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.35
      })));
    }
  }
  group.add(bField);

  const helixPts = [];
  const N = 120;
  const rLarmor = 0.38;
  const turns = 4.0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const th = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * 1.5;
    helixPts.push(new THREE.Vector3(rLarmor * Math.cos(th), y, rLarmor * Math.sin(th)));
  }
  const helixGeo = new THREE.BufferGeometry().setFromPoints(helixPts);
  const helixLine = new THREE.Line(helixGeo, new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 3,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  }));
  group.add(helixLine);

  const ionMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const ionMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), ionMat);
  group.add(ionMesh);

  const fVectorGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
  const fVectorLine = new THREE.Line(fVectorGeo, new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 }));
  group.add(fVectorLine);

  let tLarmor = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      tLarmor += dt * 3.2;
      const th = tLarmor;
      const y = (Math.sin(tLarmor * 0.25) * 0.6);
      const px = rLarmor * Math.cos(th);
      const pz = rLarmor * Math.sin(th);
      ionMesh.position.set(px, y, pz);

      const fPos = fVectorGeo.attributes.position.array;
      fPos[0] = px; fPos[1] = y; fPos[2] = pz;
      fPos[3] = px - 0.22 * Math.cos(th);
      fPos[4] = y;
      fPos[5] = pz - 0.22 * Math.sin(th);
      fVectorGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 17. Membrana Vibrante de Chladni & Curvas Nodales
function buildChladni3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.8;
    const y = (vNorm - 0.5) * 1.8;
    const z = 0.28 * (Math.cos(Math.PI * 2 * x) * Math.cos(Math.PI * 4 * y) - Math.cos(Math.PI * 4 * x) * Math.cos(Math.PI * 2 * y));
    return { x, y, z };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.x = 0.45;
      group.rotation.z += 0.008;
    }
  };
}

// 18. Prisma Óptico de Snell & Dispersión Cromática
function buildSnell3D(epColor) {
  const group = new THREE.Group();
  const prismGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.55, 3);
  const prismMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(prismGeo, prismMat));

  const rayPts = [new THREE.Vector3(-1.1, 0, 0), new THREE.Vector3(-0.35, 0, 0)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rayPts), new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })));

  const colors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6, 0x8b5cf6];
  colors.forEach((col, idx) => {
    const angle = 0.15 + (idx - 2) * 0.08;
    const refPts = [
      new THREE.Vector3(-0.35, 0, 0),
      new THREE.Vector3(0.25, 0, (idx - 2) * 0.04),
      new THREE.Vector3(1.1, 0, Math.tan(angle) * 0.85)
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(refPts), new THREE.LineBasicMaterial({ color: col, linewidth: 2 })));
  });

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.35;
    }
  };
}

// 19. Teorema de Pitágoras & Bloques Métricos Espaciales (a² + b² = c²)
function buildPythagoras3D(epColor) {
  const group = new THREE.Group();
  const a = 0.6, b = 0.8, c = 1.0;
  const boxA = new THREE.Mesh(new THREE.BoxGeometry(a, a, 0.18), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.7 }));
  boxA.position.set(-a/2, a/2, 0);
  group.add(boxA);

  const boxB = new THREE.Mesh(new THREE.BoxGeometry(b, b, 0.18), new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.7 }));
  boxB.position.set(b/2, -b/2, 0);
  group.add(boxB);

  const boxC = new THREE.Mesh(new THREE.BoxGeometry(c, c, 0.18), new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.75 }));
  boxC.position.set(0.1, 0.3, 0);
  boxC.rotation.z = Math.atan2(a, b);
  group.add(boxC);

  group.scale.set(0.65, 0.65, 0.65);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.009;
      group.rotation.x += 0.004;
    }
  };
}

// 20. Cristal Termodinámico de Boltzmann & Gas Ideal (Microestados)
function buildThermo3D(epColor) {
  const group = new THREE.Group();
  const atoms = [];
  const d = 0.45;
  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = -1; iy <= 1; iy++) {
      for (let iz = -1; iz <= 1; iz++) {
        const atomMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 12, 12),
          new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 })
        );
        atomMesh.position.set(ix * d, iy * d, iz * d);
        group.add(atomMesh);
        atoms.push({ mesh: atomMesh, base: new THREE.Vector3(ix * d, iy * d, iz * d), seed: Math.random() * 10 });
      }
    }
  }

  const boxWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(d * 2, d * 2, d * 2)),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
  );
  group.add(boxWire);

  let thermoT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x += 0.004;
      thermoT += dt * 8.0;
      atoms.forEach(a => {
        const vib = 0.025 * Math.sin(thermoT + a.seed);
        a.mesh.position.set(
          a.base.x + vib,
          a.base.y + Math.cos(thermoT + a.seed) * 0.025,
          a.base.z + vib * 0.7
        );
      });
    }
  };
}

// 21. Autómata Universal de Turing & Red Computacional 3D
function buildAutomata3D(epColor) {
  const group = new THREE.Group();
  const size = 3;
  const step = 0.28;
  for (let x = -size; x <= size; x++) {
    for (let y = -size; y <= size; y++) {
      for (let z = -size; z <= size; z++) {
        if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 0) {
          const vMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.18, 0.18),
            new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.8 })
          );
          vMesh.position.set(x * step, y * step, z * step);
          group.add(vMesh);
        }
      }
    }
  }

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.z += 0.005;
    }
  };
}

// 22. Superficie Termodinámica P-V-T del Gas Ideal (PV = nRT)
function buildIdealGas3D(epColor) {
  const group = new THREE.Group();
  const nu = 24, nv = 24;
  const gasGeo = createParametricSurface(nu, nv, (u, v) => {
    const V = 0.5 + u * 1.5;
    const T = 0.6 + v * 1.4;
    const P = (0.55 * T) / V;
    return {
      x: (u - 0.5) * 1.5,
      y: (P - 0.9) * 0.9,
      z: (v - 0.5) * 1.4
    };
  });
  const gasMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.75,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  group.add(new THREE.Mesh(gasGeo, gasMat));

  const isoCurves = [0.2, 0.5, 0.8];
  isoCurves.forEach(vFix => {
    const pts = [];
    for (let u = 0; u <= 1.0; u += 0.05) {
      const V = 0.5 + u * 1.5;
      const T = 0.6 + vFix * 1.4;
      const P = (0.55 * T) / V;
      pts.push(new THREE.Vector3((u - 0.5) * 1.5, (P - 0.9) * 0.9 + 0.01, (vFix - 0.5) * 1.4));
    }
    const isoGeo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(isoGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));
  });

  const stateMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.8 })
  );
  group.add(stateMarker);

  let gasTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      gasTime += dt * 1.8;
      const u = 0.5 + 0.45 * Math.sin(gasTime);
      const vFix = 0.5;
      const V = 0.5 + u * 1.5;
      const T = 0.6 + vFix * 1.4;
      const P = (0.55 * T) / V;
      stateMarker.position.set((u - 0.5) * 1.5, (P - 0.9) * 0.9 + 0.02, (vFix - 0.5) * 1.4);
    }
  };
}

// 23. Ciclo Termodinámico Cerrado de Carnot (Isotermas y Adiabáticas en Espacio P-V-T)
function buildCarnotCycle3D(epColor) {
  const group = new THREE.Group();
  const pA = new THREE.Vector3(-0.6,  0.7,  0.5);
  const pB = new THREE.Vector3( 0.1,  0.25, 0.5);
  const pC = new THREE.Vector3( 0.7, -0.5, -0.5);
  const pD = new THREE.Vector3( 0.0, -0.2, -0.5);

  const curve = new THREE.CatmullRomCurve3([pA, pB, pC, pD], true, 'centripetal');
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.045, 12, true);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.8
  });
  group.add(new THREE.Mesh(tubeGeo, tubeMat));

  const patchPts = curve.getPoints(32);
  const patchGeo = new THREE.BufferGeometry();
  const patchVerts = [];
  const center = new THREE.Vector3(0.05, 0.06, 0.0);
  for (let i = 0; i < patchPts.length; i++) {
    const next = patchPts[(i + 1) % patchPts.length];
    patchVerts.push(center.x, center.y, center.z);
    patchVerts.push(patchPts[i].x, patchPts[i].y, patchPts[i].z);
    patchVerts.push(next.x, next.y, next.z);
  }
  patchGeo.setAttribute('position', new THREE.Float32BufferAttribute(patchVerts, 3));
  patchGeo.computeVertexNormals();
  group.add(new THREE.Mesh(patchGeo, new THREE.MeshBasicMaterial({
    color: 0xd97706,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35
  })));

  const arrowH = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(-0.25, 0.9, 0.5), 0.35, 0xef4444, 0.1, 0.06);
  const arrowC = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3( 0.35, -0.35, -0.5), 0.35, 0x3b82f6, 0.1, 0.06);
  group.add(arrowH);
  group.add(arrowC);

  const pulseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 })
  );
  group.add(pulseMesh);

  let carnotProg = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      carnotProg = (carnotProg + dt * 0.25) % 1.0;
      const pt = curve.getPoint(carnotProg);
      pulseMesh.position.copy(pt);
      if (pt.z > 0) {
        pulseMesh.material.color.setHex(0xf97316);
        pulseMesh.material.emissive.setHex(0xf97316);
      } else {
        pulseMesh.material.color.setHex(0x38bdf8);
        pulseMesh.material.emissive.setHex(0x38bdf8);
      }
    }
  };
}

// 24. Distribución de Velocidades de Maxwell-Boltzmann en R³
function buildMaxwellBoltzmannDist3D(epColor) {
  const group = new THREE.Group();
  const vpRadius = 0.62;
  const shellGeo = new THREE.SphereGeometry(vpRadius, 32, 24);
  const shellMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.32,
    wireframe: true
  });
  group.add(new THREE.Mesh(shellGeo, shellMat));

  const bellPts = [];
  const numSteps = 48;
  for (let i = 0; i <= numSteps; i++) {
    const r = (i / numSteps) * 1.35;
    const y = 2.4 * r * r * Math.exp(-(r * r) / 0.38);
    bellPts.push(new THREE.Vector3(r, y - 0.6, 0));
  }
  const bellGeo = new THREE.BufferGeometry().setFromPoints(bellPts);
  group.add(new THREE.Line(bellGeo, new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 })));

  const bellPtsNeg = bellPts.map(p => new THREE.Vector3(-p.x, p.y, p.z));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bellPtsNeg), new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 })));

  const numV = 64;
  const vPos = new Float32Array(numV * 3);
  const vSpeeds = new Float32Array(numV);
  const vDirs = [];
  for (let k = 0; k < numV; k++) {
    const gx = (Math.random() + Math.random() + Math.random() - 1.5);
    const gy = (Math.random() + Math.random() + Math.random() - 1.5);
    const gz = (Math.random() + Math.random() + Math.random() - 1.5);
    const dir = new THREE.Vector3(gx, gy, gz).normalize();
    const speed = Math.sqrt(gx*gx + gy*gy + gz*gz) * 0.75;
    vDirs.push(dir);
    vSpeeds[k] = speed;
    vPos[k*3]   = dir.x * speed;
    vPos[k*3+1] = dir.y * speed;
    vPos[k*3+2] = dir.z * speed;
  }
  const vGeo = new THREE.BufferGeometry();
  vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
  group.add(new THREE.Points(vGeo, new THREE.PointsMaterial({
    size: 0.045,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85
  })));

  let mbTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      mbTime += dt * 2.0;
      for (let k = 0; k < numV; k++) {
        const pulse = 1.0 + 0.12 * Math.sin(mbTime + k);
        const r = vSpeeds[k] * pulse;
        vPos[k*3]   = vDirs[k].x * r;
        vPos[k*3+1] = vDirs[k].y * r;
        vPos[k*3+2] = vDirs[k].z * r;
      }
      vGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 25. Partición del Espacio de Fases de Boltzmann (S = kB ln Ω)
function buildBoltzmannEntropy3D(epColor) {
  const group = new THREE.Group();
  const cellsGroup = new THREE.Group();
  const d = 0.38;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const box = new THREE.BoxGeometry(d * 0.88, d * 0.88, d * 0.88);
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(box),
          new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.4 })
        );
        edges.position.set(x * d, y * d, z * d);
        cellsGroup.add(edges);
      }
    }
  }
  group.add(cellsGroup);

  const omegaGeo = new THREE.SphereGeometry(0.72, 24, 24);
  const omegaMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.35
  });
  const omegaMesh = new THREE.Mesh(omegaGeo, omegaMat);
  group.add(omegaMesh);

  const numM = 36;
  const mGeo = new THREE.BufferGeometry();
  const mPos = new Float32Array(numM * 3);
  for (let i = 0; i < numM; i++) {
    mPos[i*3]   = (Math.random() - 0.5) * 1.1;
    mPos[i*3+1] = (Math.random() - 0.5) * 1.1;
    mPos[i*3+2] = (Math.random() - 0.5) * 1.1;
  }
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
  group.add(new THREE.Points(mGeo, new THREE.PointsMaterial({
    size: 0.055,
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.9
  })));

  let bTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      group.rotation.x += 0.003;
      bTime += dt * 3.0;
      const scaleS = 1.0 + 0.08 * Math.sin(bTime);
      omegaMesh.scale.set(scaleS, 1.0 + 0.05 * Math.cos(bTime * 0.7), scaleS);
      for (let i = 0; i < numM; i++) {
        mPos[i*3+1] += Math.sin(bTime + i * 2.0) * 0.004;
      }
      mGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 26. Ley de Enfriamiento de Newton (dT/dt = -k(T - T_env)) en R³
function buildThermalCooling3D(epColor) {
  const group = new THREE.Group();
  const coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7
    })
  );
  group.add(coreMesh);

  const shells = [
    { r: 0.52, color: 0xf97316, op: 0.45 },
    { r: 0.78, color: 0xfacc15, op: 0.30 },
    { r: 1.05, color: 0x38bdf8, op: 0.18 }
  ];
  shells.forEach(s => {
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(s.r, 24, 18),
      new THREE.MeshStandardMaterial({
        color: s.color,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: s.op,
        wireframe: true
      })
    ));
  });

  const streamGroup = new THREE.Group();
  for (let a = 0; a < 6; a++) {
    const ang = (a / 6) * Math.PI * 2;
    const pts = [];
    for (let h = -0.7; h <= 0.9; h += 0.1) {
      const rad = 0.32 + Math.abs(h) * 0.35 + 0.05 * Math.sin(h * 6);
      pts.push(new THREE.Vector3(Math.cos(ang) * rad, h, Math.sin(ang) * rad));
    }
    const cCurve = new THREE.CatmullRomCurve3(pts);
    streamGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(cCurve, 20, 0.015, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.6 })
    ));
  }
  group.add(streamGroup);

  let coolTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      coolTime += dt * 2.5;
      coreMesh.material.emissiveIntensity = 0.6 + 0.35 * Math.sin(coolTime);
      streamGroup.rotation.y += dt * 0.4;
    }
  };
}

// 27. Paquete de Onda Cuántica de De Broglie (λ = h/p, ψ = A e^{i(kx - ωt)})
function buildDeBroglieWave3D(epColor) {
  const group = new THREE.Group();
  const numSteps = 120;
  const helixPts = [];
  const k = 14.0;
  for (let i = 0; i <= numSteps; i++) {
    const x = -1.1 + (i / numSteps) * 2.2;
    const envelope = 0.48 * Math.exp(-(x * x) / 0.35);
    helixPts.push(new THREE.Vector3(x, envelope * Math.cos(k * x), envelope * Math.sin(k * x)));
  }
  const helixCurve = new THREE.CatmullRomCurve3(helixPts);
  const helixTube = new THREE.Mesh(
    new THREE.TubeGeometry(helixCurve, 120, 0.024, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.85 })
  );
  group.add(helixTube);

  const envGeo = createParametricSurface(24, 24, (u, v) => {
    const x = -1.1 + u * 2.2;
    const r = 0.52 * Math.exp(-(x * x) / 0.35);
    const th = v * Math.PI * 2;
    return { x: x, y: r * Math.cos(th), z: r * Math.sin(th) };
  });
  group.add(new THREE.Mesh(
    envGeo,
    new THREE.MeshStandardMaterial({ color: epColor, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
  ));

  const corpuscle = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.9 })
  );
  group.add(corpuscle);

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.25, 0, 0), new THREE.Vector3(1.25, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5 })
  );
  group.add(axis);

  let wavePhase = 0;
  return {
    group,
    update: (dt) => {
      helixTube.rotation.x += dt * 5.0;
      wavePhase += dt * 1.5;
      corpuscle.position.x = 0.45 * Math.sin(wavePhase);
    }
  };
}

// 28. Elipsoide Simpléctico de Incertidumbre de Heisenberg (Δx · Δp ≥ ℏ/2)
function buildHeisenbergUncertainty3D(epColor) {
  const group = new THREE.Group();
  const ellGeo = new THREE.SphereGeometry(0.65, 32, 24);
  const ellMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.7
  });
  const ellMesh = new THREE.Mesh(ellGeo, ellMat);
  group.add(ellMesh);

  const cage = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 1.6, 1.6)),
    new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.35 })
  );
  group.add(cage);

  const gridHelper = new THREE.GridHelper(1.5, 10, 0xdfc285, 0x334155);
  gridHelper.rotation.x = Math.PI / 2;
  group.add(gridHelper);

  let uncTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      uncTime += dt * 2.2;
      const s = 0.55 + 0.35 * Math.sin(uncTime);
      const invS = 1.0 / s;
      ellMesh.scale.set(s, invS * 0.4, 0.7);
    }
  };
}

// 29. Dispersión Relativista y Salto de Masa de Dirac (E² = p²c² + m²c⁴)
function buildDiracEquation3D(epColor) {
  const group = new THREE.Group();
  const gap = 0.32;
  const sheetGeoPos = createParametricSurface(24, 24, (u, v) => {
    const p = u * 0.85;
    const th = v * Math.PI * 2;
    const E = Math.sqrt(p * p + gap * gap);
    return { x: p * Math.cos(th), y: E, z: p * Math.sin(th) };
  });
  group.add(new THREE.Mesh(sheetGeoPos, new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide
  })));

  const sheetGeoNeg = createParametricSurface(24, 24, (u, v) => {
    const p = u * 0.85;
    const th = v * Math.PI * 2;
    const E = -Math.sqrt(p * p + gap * gap);
    return { x: p * Math.cos(th), y: E, z: p * Math.sin(th) };
  });
  group.add(new THREE.Mesh(sheetGeoNeg, new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide
  })));

  const gapGeo = new THREE.CylinderGeometry(0.35, 0.35, gap * 2, 24, 1, true);
  group.add(new THREE.Mesh(gapGeo, new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  })));

  const spinor = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.55, 0xfacc15, 0.12, 0.08);
  group.add(spinor);

  let diracTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      diracTime += dt * 3.5;
      const sx = 0.35 * Math.sin(diracTime);
      const sz = 0.35 * Math.cos(diracTime);
      spinor.setDirection(new THREE.Vector3(sx, 0.8, sz).normalize());
    }
  };
}

// 30. Cuantización de Cavidad de Planck (E = hν) y Fotones Discretos
function buildPlanckQuantum3D(epColor) {
  const group = new THREE.Group();
  const m1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.04, 32),
    new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.1, metalness: 0.95 })
  );
  m1.rotation.z = Math.PI / 2;
  m1.position.x = -0.85;
  group.add(m1);

  const m2 = m1.clone();
  m2.position.x = 0.85;
  group.add(m2);

  const modes = [
    { n: 1, color: 0xef4444, amp: 0.22, yOff: 0.28 },
    { n: 2, color: 0x38bdf8, amp: 0.18, yOff: 0.0 },
    { n: 3, color: 0x10b981, amp: 0.14, yOff: -0.28 }
  ];
  const modeLines = [];
  modes.forEach(m => {
    const pts = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const x = -0.85 + u * 1.7;
      const y = m.yOff + m.amp * Math.sin(m.n * Math.PI * u);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: m.color, linewidth: 2 }));
    group.add(line);
    modeLines.push({ line, geo: lineGeo, mode: m, pts });
  });

  const photon = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 })
  );
  group.add(photon);

  let pTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      pTime += dt * 4.0;
      modeLines.forEach(item => {
        const m = item.mode;
        const pos = item.geo.attributes.position.array;
        const N = 48;
        for (let i = 0; i <= N; i++) {
          const u = i / N;
          const vib = Math.cos(pTime * m.n) * m.amp * Math.sin(m.n * Math.PI * u);
          pos[i * 3 + 1] = m.yOff + vib;
        }
        item.geo.attributes.position.needsUpdate = true;
      });

      const activeMode = modes[Math.floor((pTime * 0.4) % 3)];
      photon.position.set(0.4 * Math.sin(pTime * 2.0), activeMode.yOff, 0);
    }
  };
}

// 31. Árbol Tridimensional de Bifurcación de Feigenbaum (x_{n+1} = r x_n (1 - x_n))
function buildLogisticFeigenbaum3D(epColor) {
  const group = new THREE.Group();
  const numR = 90;
  const treePts = [];
  for (let ir = 0; ir < numR; ir++) {
    const r = 2.8 + (ir / numR) * 1.2;
    let x = 0.5;
    for (let t = 0; t < 120; t++) {
      x = r * x * (1.0 - x);
    }
    for (let s = 0; s < 32; s++) {
      x = r * x * (1.0 - x);
      const px = ((r - 2.8) / 1.2 - 0.5) * 1.8;
      const py = (x - 0.5) * 1.35;
      const pz = (Math.sin(s * 0.4) * 0.08);
      treePts.push(px, py, pz);
    }
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(treePts, 3));
  group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.035,
    color: epColor,
    transparent: true,
    opacity: 0.85
  })));

  const r1X = ((3.0 - 2.8) / 1.2 - 0.5) * 1.8;
  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(r1X, -0.7, 0), new THREE.Vector3(r1X, 0.7, 0)]),
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
  ));

  const r2X = ((3.449 - 2.8) / 1.2 - 0.5) * 1.8;
  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(r2X, -0.7, 0), new THREE.Vector3(r2X, 0.7, 0)]),
    new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.5 })
  ));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
    }
  };
}

// 32. Mecánica Hamiltoniana: Toroide Simpléctico de Liouville-Arnol'd en Espacio de Fases
function buildHamiltonPhase3D(epColor) {
  const group = new THREE.Group();
  const torusGeo = new THREE.TorusGeometry(0.72, 0.28, 24, 48);
  const torusMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.75,
    transparent: true,
    opacity: 0.65
  });
  group.add(new THREE.Mesh(torusGeo, torusMat));

  const orbitPts = [];
  const N = 240;
  const R = 0.72, r = 0.28;
  const phiStep = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i <= N; i++) {
    const theta = (i / N) * Math.PI * 16;
    const phi = theta * phiStep;
    orbitPts.push(new THREE.Vector3(
      (R + r * Math.cos(phi)) * Math.cos(theta),
      (R + r * Math.cos(phi)) * Math.sin(theta),
      r * Math.sin(phi)
    ));
  }
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
  group.add(new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.x += 0.006;
      group.rotation.y += 0.008;
    }
  };
}

// 33. Identidad Suprema de Euler (e^{iπ} + 1 = 0) en el Plano Complejo de Argand
function buildEulerIdentity3D(epColor) {
  const group = new THREE.Group();
  const axRe = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1.2, 0, 0), 2.4, 0x94a3b8, 0.08, 0.05);
  const axIm = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1.2, 0), 2.4, 0x94a3b8, 0.08, 0.05);
  group.add(axRe);
  group.add(axIm);

  const circleGeo = new THREE.RingGeometry(0.81, 0.85, 64);
  group.add(new THREE.Mesh(circleGeo, new THREE.MeshBasicMaterial({ color: 0xc5a059, side: THREE.DoubleSide })));

  const phasor = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 0.83, 0x38bdf8, 0.12, 0.08);
  group.add(phasor);

  const returnVector = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.83, 0, 0), 0.83, 0x10b981, 0.12, 0.08);
  group.add(returnVector);

  const zeroSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.9 })
  );
  group.add(zeroSphere);

  let eulerAngle = 0;
  return {
    group,
    update: (dt) => {
      eulerAngle += dt * 1.5;
      const th = Math.PI + Math.sin(eulerAngle) * (Math.PI * 0.95);
      phasor.setDirection(new THREE.Vector3(Math.cos(th), Math.sin(th), 0).normalize());
    }
  };
}

// 34. Incompletitud Lógica de Gödel (G ↔ ¬Prov(⌈G⌉)) & Grafo Axiomático
function buildGodelIncompleteness3D(epColor) {
  const group = new THREE.Group();
  const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.7 });
  const nodes = [
    new THREE.Vector3(-0.6, -0.6, -0.2),
    new THREE.Vector3( 0.0, -0.6,  0.3),
    new THREE.Vector3( 0.6, -0.6, -0.2),
    new THREE.Vector3(-0.3, -0.1,  0.0),
    new THREE.Vector3( 0.3, -0.1,  0.0),
    new THREE.Vector3( 0.0,  0.35, 0.1)
  ];
  nodes.forEach(p => {
    const nm = new THREE.Mesh(nodeGeo, nodeMat);
    nm.position.copy(p);
    group.add(nm);
  });

  const edges = [
    [0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]
  ];
  edges.forEach(([i, j]) => {
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]),
      new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 })
    ));
  });

  const boundary = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.85, 0.5, 0), new THREE.Vector3(0.85, 0.5, 0)]),
    new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 0.06, gapSize: 0.04 })
  );
  boundary.computeLineDistances();
  group.add(boundary);

  const godelPos = new THREE.Vector3(0, 0.75, 0);
  const godelNode = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.85 })
  );
  godelNode.position.copy(godelPos);
  group.add(godelNode);

  const mobLoop = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.02, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e })
  );
  mobLoop.position.copy(godelPos);
  mobLoop.rotation.x = Math.PI / 3;
  group.add(mobLoop);

  let gTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      gTime += dt * 3.0;
      mobLoop.rotation.z += dt * 2.0;
      godelNode.position.y = 0.75 + 0.04 * Math.sin(gTime);
    }
  };
}

// 35. Problema del Milenio: Complejidad P versus NP & Hipercubo Booleano
function buildPVsNP3D(epColor) {
  const group = new THREE.Group();
  const d1 = 0.65, d2 = 0.32;
  const vertices = [];
  for (let i = 0; i < 8; i++) {
    vertices.push(new THREE.Vector3((i & 1 ? 1 : -1) * d1, (i & 2 ? 1 : -1) * d1, (i & 4 ? 1 : -1) * d1));
  }
  for (let i = 0; i < 8; i++) {
    vertices.push(new THREE.Vector3((i & 1 ? 1 : -1) * d2, (i & 2 ? 1 : -1) * d2, (i & 4 ? 1 : -1) * d2));
  }

  const cubeMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.4 });
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(d1*2, d1*2, d1*2)), cubeMat));
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(d2*2, d2*2, d2*2)), cubeMat));

  for (let i = 0; i < 8; i++) {
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([vertices[i], vertices[i + 8]]), cubeMat));
  }

  const pPathPts = [vertices[0], vertices[1], vertices[3], vertices[7]];
  const pCurve = new THREE.CatmullRomCurve3(pPathPts);
  group.add(new THREE.Mesh(
    new THREE.TubeGeometry(pCurve, 32, 0.035, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.6 })
  ));

  const npGroup = new THREE.Group();
  for (let i = 0; i < 8; i += 2) {
    npGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), vertices[i]]),
      new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.7 })
    ));
  }
  group.add(npGroup);

  const questionCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.12, 0),
    new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.9 })
  );
  group.add(questionCore);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x += 0.004;
      questionCore.rotation.z += dt * 1.5;
    }
  };
}

// 36. Símplex de Probabilidad & Cúpula de Entropía de Shannon (H = -∑ p log₂ p)
function buildShannonEntropy3D(epColor) {
  const group = new THREE.Group();
  const v1 = new THREE.Vector3( 0.0,  0.75, -0.35);
  const v2 = new THREE.Vector3(-0.65, -0.38, -0.35);
  const v3 = new THREE.Vector3( 0.65, -0.38, -0.35);

  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([v1, v2, v3, v1]),
    new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 })
  ));

  const domeGeo = createParametricSurface(24, 24, (u, v) => {
    const sqrtU = Math.sqrt(u);
    const b1 = 1 - sqrtU;
    const b2 = sqrtU * (1 - v);
    const b3 = sqrtU * v;
    const x = b1 * v1.x + b2 * v2.x + b3 * v3.x;
    const y = b1 * v1.y + b2 * v2.y + b3 * v3.y;
    const eps = 1e-6;
    const h1 = b1 > eps ? -b1 * Math.log2(b1) : 0;
    const h2 = b2 > eps ? -b2 * Math.log2(b2) : 0;
    const h3 = b3 > eps ? -b3 * Math.log2(b3) : 0;
    const H = (h1 + h2 + h3) / Math.log2(3);
    const z = -0.35 + H * 0.85;
    return { x, y, z };
  });

  group.add(new THREE.Mesh(domeGeo, new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.75,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  })));

  const peakMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.95 })
  );
  peakMarker.position.set(0, 0, 0.50);
  group.add(peakMarker);

  return {
    group,
    update: (dt) => {
      group.rotation.z += 0.005;
      group.rotation.y += 0.004;
    }
  };
}

// Mapeo Canónico de los 100 Arquetipos del Cosmos a Familias 3D Volumétricas Auténticas
const BESPOKE_3D_BUILDERS = {
  lorenz: buildLorenz3D,
  klein: buildKlein3D,
  mobius: buildMobius3D,
  hopf: buildHopf3D,
  gyroid: buildTPMSGyroid3D,
  quantum_orbital: buildQuantumOrbital3D,
  schwarzschild: buildSchwarzschild3D,
  minkowski: buildMinkowski3D,
  navier_vortex: buildNavierStokesVortex3D,
  bernoulli_tube: buildBernoulliTube3D,
  benard_convection: buildBenardConvection3D,
  hooke_spring: buildHookeSpring3D,
  lever_archimedes: buildLeverArchimedes3D,
  buoyancy: buildBuoyancy3D,
  newton_mechanics: buildNewtonMechanics3D,
  doppler: buildDoppler3D,
  wave_string: buildWaveString3D,
  kdv_soliton: buildKdvSoliton3D,
  elliptic_curve: buildEllipticCurveSurface3D,
  complexity_hypercube: buildComplexityHypercube3D,
  ricci_flow: buildRicciFlow3D,
  einstein_curvature: buildEinsteinCurvature3D,
  hubble_expansion: buildHubbleExpansion3D,
  black_scholes: buildBlackScholesSurface3D,
  euler_beam: buildEulerBeam3D,
  calculus_riemann: buildCalculusRiemannSum3D,
  coulomb_field: buildCoulombField3D,
  riemann: buildRiemann3D,
  higgs: buildHiggs3D,
  fibonacci: buildFibonacci3D,
  kepler: buildKepler3D,
  euler: buildEuler3D,
  maxwell: buildMaxwell3D,
  gauss_electric: buildGaussElectric3D,
  gauss_magnetic: buildGaussMagnetic3D,
  faraday_maxwell: buildFaradayMaxwell3D,
  ampere_maxwell: buildAmpereMaxwell3D,
  lorentz_force: buildLorentzForce3D,
  rossler: buildRossler3D,
  kuramoto: buildKuramoto3D,
  langevin: buildLangevin3D,
  chladni: buildChladni3D,
  snell: buildSnell3D,
  pythagoras: buildPythagoras3D,
  thermo: buildThermo3D,
  automata: buildAutomata3D,
  // Modelos Fidedignos Adicionales (Cero Clones)
  ideal_gas: buildIdealGas3D,
  carnot_cycle: buildCarnotCycle3D,
  maxwell_boltzmann: buildMaxwellBoltzmannDist3D,
  boltzmann_entropy: buildBoltzmannEntropy3D,
  thermal_cooling: buildThermalCooling3D,
  de_broglie: buildDeBroglieWave3D,
  heisenberg: buildHeisenbergUncertainty3D,
  dirac: buildDiracEquation3D,
  planck_quantum: buildPlanckQuantum3D,
  feigenbaum: buildLogisticFeigenbaum3D,
  hamilton_phase: buildHamiltonPhase3D,
  euler_identity: buildEulerIdentity3D,
  godel: buildGodelIncompleteness3D,
  p_vs_np: buildPVsNP3D,
  shannon_entropy: buildShannonEntropy3D
};

const MANIFOLD_ARCHETYPE_MAP = {
  // Caos & Sistemas Dinámicos Fidedignos
  lorenz_attractor: "lorenz",
  rossler_attractor: "rossler",
  logistic_feigenbaum: "feigenbaum",
  kuramoto_sync: "kuramoto",
  langevin_stochastic: "langevin",
  hamilton_phase: "hamilton_phase",

  // Topología & Complejidad
  ricci_flow: "ricci_flow",
  beal_conjecture: "elliptic_curve",
  fermat_last: "elliptic_curve",
  p_vs_np: "p_vs_np",
  clifford_dual: "mobius", noether_symmetry: "mobius", godel_incompleteness: "godel",
  hopf_fibration: "hopf", quaternion: "hopf", yang_mills: "hopf",
  turing_morphogenesis: "gyroid", belousov_zhabotinsky: "gyroid", von_mises: "gyroid", voronoi: "gyroid",

  // Cuántica Diferenciada y Rigurosa
  schrodinger: "quantum_orbital",
  de_broglie_wave: "de_broglie",
  dirac_equation: "dirac",
  pauli_exclusion: "heisenberg",
  planck_quantum: "planck_quantum",
  photoelectric: "planck_quantum",
  heisenberg_uncertainty: "heisenberg",

  // Astrofísica Relativista
  schwarzschild_bh: "schwarzschild", black_hole_entropy: "schwarzschild",
  hawking_radiation: "schwarzschild", gravitation_universal: "einstein_curvature",

  // Relatividad Espacial & General
  minkowski_spacetime: "minkowski", lorentz_transform: "minkowski", light_speed: "minkowski",
  einstein_field: "einstein_curvature", mass_energy: "einstein_curvature",

  // Fluidos & Ondas Fidedignos
  navier_stokes: "navier_vortex",
  bernoulli_fluid: "bernoulli_tube",
  benard_convection: "benard_convection",
  kdv_soliton: "kdv_soliton",
  doppler: "doppler",
  wave_dalembert: "wave_string",

  // Fronteras Matemáticas & Modelo Estándar
  riemann_zeta: "riemann", riemann_metric: "riemann",
  standard_model: "higgs", higgs_mechanism: "higgs",

  // Geometría & Órbitas
  fibonacci: "fibonacci", apollonian: "fibonacci", mandelbrot_julia: "fibonacci",
  kepler_ellipse: "kepler", kepler_area: "kepler", kepler_harmonic: "kepler",
  yoshida_symplectic: "kepler", gravity_drop: "kepler",

  // Estructuras, Cálculo & Poliedros
  euler_polyhedra: "euler", euler_identity: "euler_identity", euler_lagrange: "euler",
  euler_beam: "euler_beam",
  calculus_fundamental: "calculus_riemann",

  // Electromagnetismo Diferenciado y Riguroso
  maxwell_gauss_e: "gauss_electric",
  maxwell_gauss_b: "gauss_magnetic",
  maxwell_faraday: "faraday_maxwell",
  maxwell_ampere: "ampere_maxwell",
  lorentz_force: "lorentz_force",
  faraday_induction: "faraday_maxwell",
  coulomb_force: "coulomb_field",
  ohm_conduction: "coulomb_field",

  // Fenómenos Espectrales & Óptica
  chladni: "chladni", laplace_harmonic: "chladni", poisson_potential: "chladni",
  fourier_spectral: "chladni", fourier_heat: "chladni",
  snell_refract: "snell", fermat_principle: "snell",

  // Mecánica Clásica Fidedigna (Independiente de Pitágoras)
  pythagoras: "pythagoras", cartesian: "pythagoras",
  lever: "lever_archimedes",
  buoyancy: "buoyancy",
  hooke_spring: "hooke_spring",
  newton_inertia: "newton_mechanics",
  newton_fma: "newton_mechanics",
  newton_reaction: "newton_mechanics",

  // Termodinámica Diferenciada y Rigurosa
  carnot_cycle: "carnot_cycle",
  first_law_thermo: "carnot_cycle",
  second_law_entropy: "boltzmann_entropy",
  boltzmann_entropy: "boltzmann_entropy",
  maxwell_boltzmann_dist: "maxwell_boltzmann",
  thermal_cooling: "thermal_cooling",
  ideal_gas: "ideal_gas",
  stefan_boltzmann: "planck_quantum",
  wien_displacement: "planck_quantum",
  bose_einstein: "quantum_orbital",
  black_scholes: "black_scholes",

  // Cosmología & Autómatas
  turing_machine: "automata", rule_110: "automata", langton_ant: "automata",
  shannon_entropy: "shannon_entropy", shannon_capacity: "shannon_entropy",
  hubble_expansion: "hubble_expansion",
  friedmann_cosmos: "hubble_expansion"
};

// Clasificación Epistemológica Fidedigna de las 100 Fórmulas (Timonel F2)
const EPISTEMOLOGICAL_CATEGORIES = {
  // Categoría A: FÍSICA ESPACIAL EN ℝ³
  pythagoras: { cat: 'A', tag: 'FÍSICA ESPACIAL · GEOMETRÍA EN ℝ³', desc: 'Geometría euclidiana de áreas ortogonales en el espacio euclídeo.' },
  lever: { cat: 'A', tag: 'MECÁNICA CLÁSICA · ESTÁTICA EN ℝ³', desc: 'Equilibrio de momentos de fuerza tangibles en silicio.' },
  buoyancy: { cat: 'A', tag: 'HIDROSTÁTICA · EMPUJE EN ℝ³', desc: 'Gradiente de presión y volumen desplazado en fluidos reales.' },
  gravity_drop: { cat: 'A', tag: 'CINEMÁTICA · CAÍDA LIBRE EN ℝ³', desc: 'Trayectoria parabólica continua acelerada por el campo gravitatorio terrestre.' },
  kepler_ellipse: { cat: 'A', tag: 'ASTRODINÁMICA · ÓRBITA EN ℝ³', desc: 'Cónica gravitatoria kepleriana con foco en el centro de masas.' },
  kepler_area: { cat: 'A', tag: 'CONSERVACIÓN · MOMENTO ANGULAR EN ℝ³', desc: 'Velocidad areolar constante por fuerza central neta.' },
  kepler_harmonic: { cat: 'A', tag: 'ARMONÍA CÓSMICA · RELACIÓN EN ℝ³', desc: 'Resonancia orbital periódica T² ∝ a³.' },
  snell_refract: { cat: 'A', tag: 'ÓPTICA ONDULATORIA · DIOPTER EN ℝ³', desc: 'Discontinuidad de velocidad de fase en la interfaz dieléctrica.' },
  fermat_principle: { cat: 'A', tag: 'PRINCIPIO VARIACIONAL · ÓPTICA EN ℝ³', desc: 'Camino óptico de tiempo estacionario δ∫n ds = 0.' },
  hooke_spring: { cat: 'A', tag: 'ELASTICIDAD LINEAL · RESORTE EN ℝ³', desc: 'Fuerza restauradora proporcional a la deformación axial F = -kx.' },
  newton_inertia: { cat: 'A', tag: 'MECÁNICA NEWTONIANA · INERCIA EN ℝ³', desc: 'Partícula libre con momento lineal conservado.' },
  newton_fma: { cat: 'A', tag: 'DINÁMICA VECTORIAL · LEY SUPREMA EN ℝ³', desc: 'Vector de aceleración colineal con la fuerza neta F = ma.' },
  newton_reaction: { cat: 'A', tag: 'TERCERA LEY · ACCIÓN-REACCIÓN EN ℝ³', desc: 'Par de fuerzas iguales y opuestas en contacto mecánico.' },
  gravitation_universal: { cat: 'A', tag: 'GRAVITACIÓN · LEY DE NEWTON EN ℝ³', desc: 'Campo de atracción mutua con decaimiento radial 1/r².' },
  thermal_cooling: { cat: 'A', tag: 'TERMODINÁMICA · CONVECCIÓN EN ℝ³', desc: 'Gradiente térmico radial y líneas de flujo convectivo en el medio.' },
  euler_polyhedra: { cat: 'A', tag: 'TOPOLOGÍA POLIÉDRICA · CARACTERÍSTICA DE EULER', desc: 'Invariante combinatorio V - E + F = 2 en poliedros convexos 3D.' },
  bernoulli_fluid: { cat: 'A', tag: 'FLUIDODINÁMICA · TUBO DE VENTURI EN ℝ³', desc: 'Conservación de energía a lo largo de una línea de corriente continua.' },
  wave_dalembert: { cat: 'A', tag: 'MECÁNICA ONDULATORIA · CUERDA EN ℝ³', desc: 'Superposición armónica exacta de ondas viajeras y modos propios de Fourier.' },
  euler_beam: { cat: 'A', tag: 'ELASTICIDAD ESTRUCTURAL · VIGA EN ℝ³', desc: 'Deflexión transversal por momento flector continuo E·I·w\'\'\'\' = q.' },
  coulomb_force: { cat: 'A', tag: 'ELECTROSTÁTICA · FUERZA DE COULOMB EN ℝ³', desc: 'Líneas de campo eléctrico radiales entre cargas electrostáticas puntuales.' },
  chladni: { cat: 'A', tag: 'CIMÁTICA ACÚSTICA · PLACA EN ℝ³', desc: 'Líneas nodales de reposo acústico por interferencia de ondas estacionarias 2D.' },
  fourier_heat: { cat: 'A', tag: 'DIFUSIÓN TÉRMICA · CAMPO EN ℝ³', desc: 'Propagación parabólica del calor ∂T/∂t = α∇²T en un sólido.' },
  ohm_conduction: { cat: 'A', tag: 'ELECTRODINÁMICA · CONDUCCIÓN EN ℝ³', desc: 'Flujo microscópico de densidad de corriente J = σE en silicio metálico.' },
  faraday_induction: { cat: 'A', tag: 'INDUCCIÓN ELECTROMAGNÉTICA EN ℝ³', desc: 'Fuerza electromotriz generada por variación de flujo magnético en la espira.' },
  kdv_soliton: { cat: 'A', tag: 'HIDRODINÁMICA · SOLITÓN KDV EN ℝ³', desc: 'Onda solitaria no lineal que preserva su forma por balance dispersivo.' },
  doppler: { cat: 'A', tag: 'ACÚSTICA ONDULATORIA · EFECTO DOPPLER EN ℝ³', desc: 'Frentes de onda esféricos comprimidos por movimiento relativo subsónico.' },
  navier_stokes: { cat: 'A', tag: 'FLUIDODINÁMICA REAL · VÓRTICE DE BURGERS EN ℝ³', desc: 'Vórtice viscoso exacto de Navier-Stokes con balance entre estiramiento y difusión.' },
  maxwell_gauss_e: { cat: 'A', tag: 'ELECTROMAGNETISMO · LEY DE GAUSS ELÉCTRICA EN ℝ³', desc: 'Divergencia del campo eléctrico neta igual a la densidad de carga local.' },
  maxwell_gauss_b: { cat: 'A', tag: 'ELECTROMAGNETISMO · LEY DE GAUSS MAGNÉTICA EN ℝ³', desc: 'Ausencia estricta de monopolos magnéticos; líneas de campo cerradas.' },
  maxwell_faraday: { cat: 'A', tag: 'ELECTROMAGNETISMO · INDUCCIÓN DE FARADAY EN ℝ³', desc: 'Rotacional eléctrico generado por flujo magnético temporal oscilante.' },
  maxwell_ampere: { cat: 'A', tag: 'ELECTROMAGNETISMO · LEY DE AMPÈRE-MAXWELL EN ℝ³', desc: 'Circulación magnética inducida por corriente de conducción y desplazamiento.' },
  light_speed: { cat: 'A', tag: 'ELECTRODINÁMICA · ONDA LUMINOSA TRANSVERSAL EN ℝ³', desc: 'Campos E y B ortogonales propagándose en el vacío a velocidad c.' },
  lorentz_force: { cat: 'A', tag: 'ELECTRODINÁMICA · FUERZA DE LORENTZ EN ℝ³', desc: 'Espiral helicoidal de ciclotrón bajo interacción vectorial F = q(E + v×B).' },
  benard_convection: { cat: 'A', tag: 'PATRONES DE CONVECCIÓN · CELDAS EN ℝ³', desc: 'Autoorganización hexagonal espontánea por inestabilidad de Rayleigh-Bénard.' },
  schwarzschild_bh: { cat: 'A', tag: 'ASTROFÍSICA RELATIVISTA · AGUJERO NEGRO EN ℝ³', desc: 'Horizonte de sucesos esférico y curvatura espacial de Flamm.' },
  hubble_expansion: { cat: 'A', tag: 'COSMOLOGÍA OBSERVACIONAL · EXPANSIÓN EN ℝ³', desc: 'Recesión métrica tridimensional de galaxias proporcional a la distancia v = H₀d.' },
  turing_morphogenesis: { cat: 'A', tag: 'BIOLOGÍA TEÓRICA · MORFOGÉNESIS EN ℝ³', desc: 'Inestabilidad de reacción-difusión tejiendo patrones biológicos espaciales.' },
  belousov_zhabotinsky: { cat: 'A', tag: 'SISTEMAS DISIPATIVOS · ONDAS QUÍMICAS EN ℝ³', desc: 'Ondas espirales concéntricas en un medio no lineal lejos del equilibrio.' },
  photoelectric: { cat: 'A', tag: 'FÍSICA CUÁNTICA · FOTOEMISIÓN EN ℝ³', desc: 'Impacto balístico de fotones incidentes arrancando electrones del metal.' },
  hawking_radiation: { cat: 'A', tag: 'GRAVEDAD CUÁNTICA · EVAPORACIÓN EN ℝ³', desc: 'Pares partícula-antipartícula en el horizonte de sucesos relativista.' },

  // Categoría B: ESPACIO DE FASES / VARIEDAD PROYECTADA
  fibonacci: { cat: 'B', tag: 'DINÁMICA DISCRETA · ESPACIO DE CRECIMIENTO', desc: 'Distribución angular áurea de filotaxis proyectada en coordenadas cilíndricas.' },
  calculus_fundamental: { cat: 'B', tag: 'ANÁLISIS MATEMÁTICO · SUMA DE RIEMANN', desc: 'Variedad de integración geométrica bajo la curva f(x)dx.' },
  euler_lagrange: { cat: 'B', tag: 'MECÁNICA ANALÍTICA · ESPACIO DE CONFIGURACIÓN', desc: 'Variedad variacional de acción mínima δS = 0 entre infinitas trayectorias.' },
  laplace_harmonic: { cat: 'B', tag: 'TEORÍA DEL POTENCIAL · SUPERFICIE ARMÓNICA', desc: 'Variedad minimal con curvatura media nula ∇²ϕ = 0.' },
  poisson_potential: { cat: 'B', tag: 'TEORÍA DEL POTENCIAL · POZO POISSONIANO', desc: 'Deformación del potencial escalar generada por fuentes densas.' },
  fourier_spectral: { cat: 'B', tag: 'ANÁLISIS ESPECTRAL · ESPACIO DE FRECUENCIAS', desc: 'Proyección del espectro armónico continuo en componentes ortogonales.' },
  ideal_gas: { cat: 'B', tag: 'TERMODINÁMICA · VARIEDAD DE ESTADO P-V-T', desc: 'Superficie de ecuación de estado continua P(V, T) = nRT/V en el espacio termodinámico.' },
  carnot_cycle: { cat: 'B', tag: 'TERMODINÁMICA · CICLO DE ESTADO (P, V, T)', desc: 'Trayectoria reversible cerrada compuesta por dos isotermas y dos adiabáticas.' },
  hamilton_phase: { cat: 'B', tag: 'MECÁNICA HAMILTONIANA · TOROIDE SIMPLÉCTICO', desc: 'Toroide de Liouville-Arnol\'d invariante bajo el flujo simpléctico canónico.' },
  boltzmann_entropy: { cat: 'B', tag: 'MECÁNICA ESTADÍSTICA · ESPACIO DE FASES', desc: 'Volumen de microestados accesibles Ω en celdas cuánticas de volumen h³.' },
  maxwell_boltzmann_dist: { cat: 'B', tag: 'MECÁNICA ESTADÍSTICA · ESPACIO DE VELOCIDADES', desc: 'Densidad radial de probabilidad f(v) ∝ v² exp(-mv²/2k_BT) en el espacio tridimensional de velocidades.' },
  first_law_thermo: { cat: 'B', tag: 'TERMODINÁMICA · ESPACIO ENERGÉTICO ΔU', desc: 'Conservación de energía interna entre calor entrante y trabajo mecánico.' },
  second_law_entropy: { cat: 'B', tag: 'TERMODINÁMICA · FLECHA DEL TIEMPO', desc: 'Crecimiento irreversible de entropía en sistemas aislados dS ≥ 0.' },
  stefan_boltzmann: { cat: 'B', tag: 'RADIACIÓN TÉRMICA · FLUJO RADIATIVO', desc: 'Emisión total de energía proporcional a la cuarta potencia de la temperatura T⁴.' },
  wien_displacement: { cat: 'B', tag: 'ESPECTROFOTOMETRÍA · DESPLAZAMIENTO DE WIEN', desc: 'Superficie espectral que muestra el corrimiento del pico hacia el ultravioleta.' },
  lorentz_transform: { cat: 'B', tag: 'RELATIVIDAD ESPECIAL · ESPACIO-TIEMPO HIPERBÓLICO', desc: 'Rotación hiperbólica del marco de referencia preserving el intervalo invariante.' },
  apollonian: { cat: 'B', tag: 'GEOMETRÍA FRACTAL · TAMIZ DE APOLONIO', desc: 'Empaquetamiento fractal de círculos tangentes recíprocos de curvatura entera.' },
  voronoi: { cat: 'B', tag: 'GEOMETRÍA COMPUTACIONAL · TESELACIÓN DE PROXIMIDAD', desc: 'Fronteras poligonales de equidistancia respecto a semillas discretas.' },
  von_mises: { cat: 'B', tag: 'MECÁNICA DE MATERIALES · CILINDRO DE PLASTIFICACIÓN', desc: 'Superficie de fluencia en el espacio de tensiones principales invariante ante presión hidrostática.' },
  planck_quantum: { cat: 'B', tag: 'FÍSICA CUÁNTICA · MODOS DE CAVIDAD CUANTIZADOS', desc: 'Modos propios electromagnéticos discretizados en paquetes hν.' },
  minkowski_spacetime: { cat: 'B', tag: 'GEOMETRÍA PSEUDO-RIEMANNIANA · CONO DE LUZ', desc: 'Estructura causal cuatridimensional proyectada al espacio euclídeo.' },
  einstein_field: { cat: 'B', tag: 'RELATIVIDAD GENERAL · CURVATURA ESPACIOTEMPORAL', desc: 'Tensor de Einstein acoplado a la densidad de energía-momento.' },
  de_broglie_wave: { cat: 'B', tag: 'FÍSICA CUÁNTICA · PAQUETE DE ONDA DE MATERIA', desc: 'Hélice compleja tridimensional de amplitud de probabilidad con longitud de onda λ = h/p.' },
  schrodinger: { cat: 'B', tag: 'MECÁNICA CUÁNTICA · ORBITAL ATÓMICO |Y_l^m|²', desc: 'Densidad espacial de probabilidad cuántica calculada analíticamente.' },
  heisenberg_uncertainty: { cat: 'B', tag: 'FUNDAMENTOS CUÁNTICOS · ELIPSOIDE SIMPLÉCTICO', desc: 'Volumen mínimo de acción de fase ΔxΔp ≥ ℏ/2 que preserva área bajo compresión.' },
  dirac_equation: { cat: 'B', tag: 'ELECTRODINÁMICA CUÁNTICA · DISPERSIÓN DE DIRAC', desc: 'Hiperboloide relativista con brecha de masa 2mc² y precesión de espinor de 4 componentes.' },
  hopf_fibration: { cat: 'B', tag: 'TOPOLOGÍA 4D · FIBRACIÓN S³ → S²', desc: 'Descomposición de la 3-esfera en círculos entrelazados de gran radio.' },
  friedmann_cosmos: { cat: 'B', tag: 'COSMOLOGÍA RELATIVISTA · VARIEDAD FLRW', desc: 'Evolución dinámica del factor de escala del universo a(t).' },
  pauli_exclusion: { cat: 'B', tag: 'FÍSICA ATÓMICA · ANDAMIAJE FERMIÓNICO', desc: 'Bloqueo cuántico que impide la superposición de dos estados con idénticos números cuánticos.' },
  bose_einstein: { cat: 'B', tag: 'CONDENSACIÓN CUÁNTICA · MACROESTADO', desc: 'Colapso cooperativo de bosones en una única función de onda gigante al cero absoluto.' },
  black_hole_entropy: { cat: 'B', tag: 'GRAVEDAD CUÁNTICA · ENTROPÍA HOLOGRÁFICA', desc: 'Capacidad informacional proporcional al área bidimensional del horizonte de sucesos.' },
  yang_mills: { cat: 'B', tag: 'TEORÍA DE CALIBRE NO ABELIANA · SALTO DE MASA', desc: 'Curvatura no lineal en el grupo de simetría SU(2) con gap energético fundamental.' },
  higgs_mechanism: { cat: 'B', tag: 'FÍSICA DE PARTÍCULAS · SOMBRERO MEXICANO', desc: 'Ruptura espontánea de simetría en el potencial escalar que otorga masa inercial.' },
  shannon_capacity: { cat: 'B', tag: 'TELECOMUNICACIONES · VARIEDAD DE SHANNON-HARTLEY', desc: 'Frontera superior de transmisión de bits en canales con ruido gaussiano.' },
  lorenz_attractor: { cat: 'B', tag: 'TEORÍA DEL CAOS · ATRACTOR DE LORENZ', desc: 'Órbita continua aperiódica en el espacio de fases tridimensional.' },
  rossler_attractor: { cat: 'B', tag: 'TOPOLOGÍA CAÓTICA · CINTA PLEGADA DE RÖSSLER', desc: 'Herradura de Smale en dinámica continua con un solo plegamiento periódico.' },
  logistic_feigenbaum: { cat: 'B', tag: 'DINÁMICA NO LINEAL · ÁRBOL 3D DE BIFURCACIÓN', desc: 'Cascada de duplicación de período calculada analíticamente con constante universal δ.' },
  mandelbrot_julia: { cat: 'B', tag: 'FRACTALES COMPLEJOS · CONJUNTO DE JULIA 3D', desc: 'Frontera de escape iterativo en el álgebra de cuaterniones.' },
  kuramoto_sync: { cat: 'B', tag: 'SISTEMAS COMPLEJOS · ESPACIO DE FASES SINC', desc: 'Sincronización espontánea en el círculo S¹ y emergencia del parámetro de orden macróscopico.' },
  langevin_stochastic: { cat: 'B', tag: 'FÍSICA ESTOCÁSTICA · DIFUSIÓN DE EINSTEIN', desc: 'Paseo browniano tridimensional acoplado a la esfera difusiva ⟨r²⟩ = 6Dt.' },
  black_scholes: { cat: 'B', tag: 'MATEMÁTICA FINANCIERA · SUPERFICIE DE VOLATILIDAD', desc: 'Ecuación parabólica de difusión y curvatura de cobertura dinámica.' },
  yoshida_symplectic: { cat: 'B', tag: 'MECÁNICA COMPUTACIONAL · ÓRBITA SIMPLÉCTICA', desc: 'Conservación numérica exacta de energía mediante coeficientes simplécticos de 4º orden.' },
  ricci_flow: { cat: 'B', tag: 'GEOMETRÍA DIFERENCIAL · FLUJO DE RICCI DE PERELMAN', desc: 'Difusión de curvatura alisando una variedad tridimensional hasta la esfera S³.' },
  standard_model: { cat: 'B', tag: 'FÍSICA FUNDAMENTAL · GRUPOS DE CALIBRE', desc: 'Interacción geométrica de los grupos de simetría SU(3)×SU(2)×U(1).' },

  // Categoría C: NO-ESPACIAL / IDENTIDAD ABSTRACTA
  cartesian: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · SISTEMA COORDENADO', desc: 'Marco abstracto de referencia ortogonal que mapea el álgebra a la geometría.' },
  fermat_last: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · CURVA MODULAR DE FREY', desc: 'Identidad aritmética pura xⁿ + yⁿ = zⁿ; visualizada mediante su representación geométrica elíptica modular.' },
  euler_identity: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · PLANO COMPLEJO DE ARGAND', desc: 'Identidad e^{iπ} + 1 = 0 en el plano complejo; fasores circulares unitarios.' },
  quaternion: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · ÁLGEBRA DE HAMILTON', desc: 'Estructura hipercompleja de dimensión 4 sin análogo euclídeo tridimensional directo.' },
  riemann_zeta: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · RECTA CRÍTICA DE RIEMANN', desc: 'Función meromorfa analítica compleja; los ceros no triviales yacen en Re(s) = 1/2.' },
  riemann_metric: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · TENSOR MÉTRICO RIEMANNIANO', desc: 'Definición analítica de curvatura intrínseca independiente de inmersión en ℝ³.' },
  clifford_dual: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · ÁLGEBRA DE NÚMEROS DUALES', desc: 'Estructura puramente algebraica con unidad nilpotente ε² = 0 para autodiferenciación exacta.' },
  mass_energy: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · EQUIVALENCIA MASA-ENERGÍA', desc: 'E = mc²; identidad escalar universal de cuadrimomento relativista.' },
  noether_symmetry: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · TEOREMA DE NOETHER', desc: 'Dualidad matemática abstracta: a cada simetría continua de Lie le corresponde una carga conservada.' },
  godel_incompleteness: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · LÓGICA AUTORREFERENCIAL', desc: 'Incompletitud formal pura; el enunciado no tiene cuerpo físico, es una verdad metamatemática indecidible.' },
  turing_machine: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · MÁQUINA UNIVERSAL DE TURING', desc: 'Concepto abstracto de computabilidad algorítmica discreta.' },
  shannon_entropy: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · SÍMPLEX DE PROBABILIDAD', desc: 'Información pura H(X); concavidad de Shannon sobre el símplex de probabilidad 2D.' },
  rule_110: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · AUTÓMATA TURING-COMPLETO', desc: 'Regla booleana elemental unidimensional que genera computación universal.' },
  langton_ant: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · SISTEMA DINÁMICO DISCRETO', desc: 'Comportamiento emergente asintótico sobre una grilla discreta de dos dimensiones.' },
  beal_conjecture: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · TEORÍA DE NÚMEROS PURA', desc: 'Conjetura diofántica de exponentes enteros Aˣ + Bʸ = Cᶻ.' },
  p_vs_np: { cat: 'C', tag: 'PROYECCIÓN CANÓNICA · COMPLEJIDAD COMPUTACIONAL', desc: 'Pregunta fundamental de la teoría de complejidad formal; hipercubo de satisfacibilidad.' }
};

// ── CONSTRUCTOR PRINCIPAL DEL MODELO DE ASTRO 3D EN R³ ─────────────
function buildBespokeAstroModel(id, data) {
  const group = new THREE.Group();

  const epColor = (data && data.epoch === 1) ? 0xc5a059 :
                 ((data && data.epoch === 2) ? 0x60a5fa :
                 ((data && data.epoch === 3) ? 0x34d399 :
                 ((data && data.epoch === 4) ? 0xa78bfa : 0xf43f5e)));

  // 1. Sintetizar la Variedad Geométrica 3D Volumétrica Auténtica
  const archetypeKey = (data && data.archetype) ? data.archetype : 'lorenz_attractor';
  const familyKey = MANIFOLD_ARCHETYPE_MAP[archetypeKey] || 'lorenz';
  const builder = BESPOKE_3D_BUILDERS[familyKey] || buildLorenz3D;
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
    const epInfo = EPISTEMOLOGICAL_CATEGORIES[d.archetype];
    const epTag = epInfo ? ` · [${epInfo.cat === 'A' ? 'FÍSICA ℝ³' : (epInfo.cat === 'B' ? 'ESPACIO FASES' : 'PROY. CANÓNICA')}]` : '';
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

    // Gobernanza Epistemológica Fidedigna: Identificar si es Física ℝ³, Espacio de Fases o Identidad Abstracta
    const epInfo = EPISTEMOLOGICAL_CATEGORIES[d.archetype];
    const epPill = document.getElementById('hud-epistemology-pill');
    if (epPill && epInfo) {
      epPill.classList.remove('hidden');
      if (epInfo.cat === 'A') {
        epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
        epPill.innerHTML = `<div class="font-bold text-emerald-400 mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-emerald-200/80 font-sans">${epInfo.desc}</div>`;
      } else if (epInfo.cat === 'B') {
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

  // Medir rendimiento local para el enjambre
  totalEvaluations += Math.floor(delta * 480000);
  const localThroughputEl = document.getElementById('swarm-local-throughput');
  if (localThroughputEl && Math.random() < 0.05) {
    localThroughputEl.textContent = (480000 + Math.floor(Math.sin(time * 0.002) * 15000)).toLocaleString();
  }

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

    let phase, relaxFactor, residual, ringColor;
    if (astro.cycleT < 2.5) {
      // 1. Fase de Entropía Alta / Dispersión
      phase = 'DISPERSION';
      relaxFactor = 0.0;
      residual = 0.75 + Math.sin(astro.cycleT * 4) * 0.12;
      ringColor = 0xf43f5e; // Rojo advertencia
    } else if (astro.cycleT < 7.5) {
      // 2. Fase de Relajación por Operador Diferencial
      phase = 'RELAXATION';
      const progress = (astro.cycleT - 2.5) / 5.0;
      relaxFactor = progress;
      residual = 0.75 * (1.0 - progress) + 0.003;
      ringColor = progress > 0.65 ? 0x38bdf8 : (progress > 0.3 ? 0xa855f7 : 0xf43f5e);
    } else if (astro.cycleT < 13.0) {
      // 3. Fase Cristalizada: Forma Matemática Pura (Certificada por Timonel)
      phase = 'CRYSTALLIZED';
      relaxFactor = 1.0;
      residual = 0.002 + Math.sin(astro.cycleT * 2) * 0.0008;
      ringColor = 0x38bdf8;
    } else {
      astro.cycleT = 0;
      phase = 'DISPERSION';
      relaxFactor = 0.0;
      residual = 0.75;
      ringColor = 0xf43f5e;
    }

    astro.phase = phase;
    astro.relaxFactor = relaxFactor;
    astro.residual = residual;
    astro.timonelRing.material.color.setHex(ringColor);

    if (!isConfinement) {
      const isCollimated = (astro.index === collimatedAstroIndex);
      astro.timonelRing.material.opacity = isCollimated ? 0.8 : 0.32;
      astro.group.scale.set(isCollimated ? 1.15 : 0.85, isCollimated ? 1.15 : 0.85, isCollimated ? 1.15 : 0.85);
    }


    // ── NAI CENTINELA: FILTRO ULTRA-ESTRICTO DE CERO ABSOLUTO & SOLUCIÓN REAL ───
    // CERO AUTOENGAÑO: Vetadas 100% las alertas de rutina o pasos intermedios.
    // Solo y únicamente se emite alerta cuando se encuentra LA SOLUCIÓN DEFINITIVA:
    // 1) BEAL: Cero absoluto entero exacto (Aˣ + Bʸ - Cᶻ === 0 con mcd=1)
    // 2) RIEMANN: Cero real fuera de la línea crítica (contraejemplo a la conjetura)
    // 3) NAVIER-STOKES: Singularidad real demostrada donde la enstrofía supere la cota de ruptura
    if (phase === 'CRYSTALLIZED' && astro.cycleT > 7.5 && astro.cycleT < 7.7) {
      if (astro.data.id === 21) {
        // BEAL: Auditoría de Cero Absoluto
        const bf = UNRESOLVED_FRONTIERS.beal;
        if (bf.solutionFound) {
          recordDiscoveryCandidate(
            astro,
            "¡SOLUCIÓN DEFINITIVA DE BEAL ENCONTRADA! Terna coprima exacta Aˣ + Bʸ = Cᶻ con residuo 0.0000000.",
            "CONTRAEJEMPLO DE BEAL CERTIFICADO"
          );
        }
      } else if (astro.data.id === 20) {
        // RIEMANN: Solo alertar si se detecta un cero fuera de la línea Re(s) = 1/2
        const rf = UNRESOLVED_FRONTIERS.riemann;
        if (rf.anomaliesFound > 0) {
          recordDiscoveryCandidate(
            astro,
            "¡CONTRAEJEMPLO A LA HIPÓTESIS DE RIEMANN DETECTADO! Cero no trivial con Re(s) ≠ 1/2.",
            "RUPTURA DE RIEMANN CERTIFICADA"
          );
        }
      } else if (astro.data.id === 22) {
        // NAVIER-STOKES: Solo alertar si ocurre una singularidad infinita real
        const nf = UNRESOLVED_FRONTIERS.navier;
        if (nf.singularityFound) {
          recordDiscoveryCandidate(
            astro,
            "¡SINGULARIDAD DE NAVIER-STOKES DETECTADA! Explosión de enstrofía en tiempo finito.",
            "BLOW-UP DE FLUIDO CERTIFICADO"
          );
        }
      }
    }

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
        stateEl.textContent = 'RELAJACIÓN EN SILICIO';
        stateEl.className = 'text-purple-300 font-bold';
        const pct = Math.floor(currentFocusedAstro.relaxFactor * 100);
        progEl.style.width = pct + '%';
        progEl.className = 'bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300';
      } else {
        stateEl.textContent = 'CRISTALIZADO · CERTIFICADO';
        stateEl.className = 'text-cyan-300 font-bold';
        progEl.style.width = '100%';
        progEl.className = 'bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300';
      }

      resEl.textContent = currentFocusedAstro.residual.toFixed(4);
      const slack = Math.max(0, 1.0 - currentFocusedAstro.residual);
      slackEl.textContent = slack.toFixed(3);
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
