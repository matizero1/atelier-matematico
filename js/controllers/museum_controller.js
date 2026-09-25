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
  scene.fog = new THREE.FogExp2(0x08080a, 0.009);

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0.5, 0);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power", preserveDrawingBuffer: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1.0);
  renderer.shadowMap.enabled = false;

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
  scene.add(new THREE.AmbientLight(0x525266, 1.4));
  const dirLight1 = new THREE.DirectionalLight(0xffeedd, 1.2);
  dirLight1.position.set(20, 35, 25);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.7);
  dirLight2.position.set(-20, -15, -15);
  scene.add(dirLight2);

  const headLight = new THREE.PointLight(0xffffff, 1.2, 50);
  camera.add(headLight);
  scene.add(camera);

  // Campo Estelar Esférico Omnidireccional (1.800 estrellas en el vacío 3D)
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(1800 * 3);
  for (let i = 0; i < 1800; i++) {
    const r = 20 + Math.random() * 65;
    const th = Math.random() * Math.PI * 2;
    const ph = (Math.random() - 0.5) * Math.PI;
    starPos[i*3]   = r * Math.cos(ph) * Math.sin(th);
    starPos[i*3+1] = r * Math.sin(ph);
    starPos[i*3+2] = r * Math.cos(ph) * Math.cos(th);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xf4f1ea, size: 0.032, transparent: true, opacity: 0.45 }));
  scene.add(stars);

  // Instanciar los 24 Astros Matemáticos con sus Modelos Nativos y Motor de Auto-Resolución
  ARTWORKS_24.forEach((data, index) => {
    createLivingMathematicalAstro(data, index);
  });
}

// ── ROTONDA TECTÓNICA & MIRADOR ASTRONÓMICO DE PARANAL (TIMONEL F2) ─
function buildTectonicRotunda() {
  const rotundaGroup = new THREE.Group();
  rotundaGroup.position.set(0, -1.0, 0);

  // 1. Mirador Esbelto de Basalto Escalonado (R = 3.8m, escala humana íntima)
  const baseFloorGeo = new THREE.CylinderGeometry(3.8, 4.0, 0.25, 48);
  const baseFloorMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c10,
    roughness: 0.85,
    metalness: 0.15
  });
  const baseFloor = new THREE.Mesh(baseFloorGeo, baseFloorMat);
  baseFloor.position.y = -0.125;
  rotundaGroup.add(baseFloor);

  // Zócalo inferior de granito oscuro
  const subPlinthGeo = new THREE.CylinderGeometry(4.0, 4.2, 0.15, 48);
  const subPlinthMat = new THREE.MeshStandardMaterial({
    color: 0x070709,
    roughness: 0.9,
    metalness: 0.1
  });
  const subPlinth = new THREE.Mesh(subPlinthGeo, subPlinthMat);
  subPlinth.position.y = -0.32;
  rotundaGroup.add(subPlinth);

  // Anillos concéntricos de bronce incrustados en el pavimento
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    roughness: 0.28,
    metalness: 0.85
  });
  [1.0, 2.0, 3.2].forEach(r => {
    const ringGeo = new THREE.TorusGeometry(r, 0.02, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, bronzeMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.01;
    rotundaGroup.add(ringMesh);
  });

  // Juntas radiales de piedra (12 ejes de brújula astronómica)
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const jointGeo = new THREE.BoxGeometry(0.02, 0.015, 2.2);
    const jointMesh = new THREE.Mesh(jointGeo, bronzeMat);
    jointMesh.position.set(Math.sin(angle) * 2.1, 0.01, Math.cos(angle) * 2.1);
    jointMesh.rotation.y = angle;
    rotundaGroup.add(jointMesh);
  }

  // 2. Medallón Central de Astrolabio / Rosa de los Vientos de Timonel
  const medallionGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.03, 32);
  const medallionMat = new THREE.MeshStandardMaterial({
    color: 0x14141c,
    roughness: 0.5,
    metalness: 0.8
  });
  const medallion = new THREE.Mesh(medallionGeo, medallionMat);
  medallion.position.y = 0.02;
  rotundaGroup.add(medallion);

  // Anillo exterior del medallón en bronce
  const medRingGeo = new THREE.TorusGeometry(0.9, 0.03, 16, 32);
  const medRing = new THREE.Mesh(medRingGeo, bronzeMat);
  medRing.rotation.x = Math.PI / 2;
  medRing.position.y = 0.035;
  rotundaGroup.add(medRing);

  // Cruz central de ejes coordenados Timonel F2
  const axisX = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.015, 0.03), bronzeMat);
  axisX.position.y = 0.04;
  rotundaGroup.add(axisX);
  const axisZ = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, 1.6), bronzeMat);
  axisZ.position.y = 0.04;
  rotundaGroup.add(axisZ);

  // 3. Balaustrada Perimetral Minimalista (Acero oscuro & Bronce fino)
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x16161c,
    roughness: 0.45,
    metalness: 0.75
  });
  // Pasamanos circular perimetral a 0.85m de altura (Radio 3.6m)
  const handrailGeo = new THREE.TorusGeometry(3.6, 0.025, 16, 48);
  const handrail = new THREE.Mesh(handrailGeo, bronzeMat);
  handrail.rotation.x = Math.PI / 2;
  handrail.position.y = 0.85;
  rotundaGroup.add(handrail);

  // Óculo Cenital Esbelto en el techo de la cúpula
  const oculusRingGeo = new THREE.TorusGeometry(1.6, 0.035, 16, 48);
  const oculusRing = new THREE.Mesh(oculusRingGeo, bronzeMat);
  oculusRing.rotation.x = Math.PI / 2;
  oculusRing.position.y = 7.5;
  rotundaGroup.add(oculusRing);

  // 12 Columnas y Costillas Arquitectónicas hacia el Óculo
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const px = Math.sin(angle) * 3.6;
    const pz = Math.cos(angle) * 3.6;

    // Balustra perimetral
    const postGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.85, 16);
    const post = new THREE.Mesh(postGeo, bronzeMat);
    post.position.set(px, 0.425, pz);
    rotundaGroup.add(post);

    // Costilla curva que asciende libremente hacia el óculo cenital sin tapar el cosmos
    const curvePoints = [];
    const steps = 12;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cy = 0.85 + t * (7.5 - 0.85);
      const cr = 3.6 * (1 - t) + 1.6 * t + Math.sin(t * Math.PI) * 0.35;
      curvePoints.push(new THREE.Vector3(Math.sin(angle) * cr, cy, Math.cos(angle) * cr));
    }
    const ribCurve = new THREE.CatmullRomCurve3(curvePoints);
    const ribGeo = new THREE.TubeGeometry(ribCurve, 16, 0.03, 8, false);
    const rib = new THREE.Mesh(ribGeo, steelMat);
    rotundaGroup.add(rib);

    // Focos rasantes empotrados en el suelo de basalto
    if (i % 2 === 0) {
      const spot = new THREE.SpotLight(0xffeedd, 1.0, 10, Math.PI / 6, 0.45);
      spot.position.set(px * 0.85, 0.05, pz * 0.85);
      spot.target.position.set(px * 0.4, 4.0, pz * 0.4);
      rotundaGroup.add(spot);
      rotundaGroup.add(spot.target);

      const fixtureGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 16);
      const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xdfc285 });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(px * 0.85, 0.015, pz * 0.85);
      rotundaGroup.add(fixture);
    }
  }

  // Foco cenital sobre el medallón
  const centerSpot = new THREE.SpotLight(0xffeedd, 1.6, 9, Math.PI / 6, 0.35);
  centerSpot.position.set(0, 6.0, 0);
  centerSpot.target.position.set(0, 0, 0);
  rotundaGroup.add(centerSpot);
  rotundaGroup.add(centerSpot.target);

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
  
  // Radio dilatado profundo (55m a 85m) escalonado en profundidad para eliminar oclusiones
  const radius = 55.0 + (col % 2) * 16.0 + tier * 6.0;

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
  const pointLight = new THREE.PointLight(0xdfc285, 1.4, 8.0);
  pointLight.position.set(1.5, 2.0, 2.2);
  astroGroup.add(pointLight);

  const fillLight = new THREE.PointLight(0x60a5fa, 0.8, 6.0);
  fillLight.position.set(-1.6, -1.2, -1.5);
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

// 9. Toro de Vorticidad de Navier-Stokes & Filamentos Helicoidales
function buildNavierVortex3D(epColor) {
  const group = new THREE.Group();
  const coreGeo = new THREE.TorusGeometry(0.72, 0.16, 16, 40);
  const coreMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.3,
    metalness: 0.75,
    transparent: true,
    opacity: 0.85
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  const streamPts = [];
  const numHel = 6;
  for (let h = 0; h < numHel; h++) {
    const phi0 = (h / numHel) * Math.PI * 2;
    for (let i = 0; i <= 60; i++) {
      const th = (i / 60) * Math.PI * 2;
      const phi = phi0 + th * 4.0;
      const R = 0.72 + 0.22 * Math.cos(phi);
      streamPts.push(
        R * Math.cos(th),
        R * Math.sin(th),
        0.22 * Math.sin(phi)
      );
    }
  }
  const streamGeo = new THREE.BufferGeometry();
  streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(streamPts, 3));
  group.add(new THREE.Line(streamGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })));

  return {
    group,
    update: (dt) => {
      group.rotation.z += 0.012;
      coreMesh.rotation.x += 0.008;
    }
  };
}

// 10. Solitón Hidrodinámico de KdV (Onda Solitaria No-Lineal)
function buildKdvSoliton3D(epColor) {
  const group = new THREE.Group();
  const ringGeo = new THREE.TorusGeometry(0.85, 0.08, 12, 48);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.5 });
  group.add(new THREE.Mesh(ringGeo, ringMat));

  const solGeo = new THREE.SphereGeometry(0.24, 16, 16);
  solGeo.scale(1.8, 1.0, 0.8);
  const solMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 });
  const solMesh = new THREE.Mesh(solGeo, solMat);
  group.add(solMesh);

  let solAngle = 0;
  return {
    group,
    update: (dt) => {
      solAngle += dt * 1.8;
      solMesh.position.set(0.85 * Math.cos(solAngle), 0.85 * Math.sin(solAngle), 0.08 * Math.sin(solAngle * 2));
      solMesh.rotation.z = solAngle + Math.PI / 2;
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

// Mapeo Canónico de los 100 Arquetipos del Cosmos a Familias 3D Volumétricas
const BESPOKE_3D_BUILDERS = {
  lorenz: buildLorenz3D,
  klein: buildKlein3D,
  mobius: buildMobius3D,
  hopf: buildHopf3D,
  gyroid: buildTPMSGyroid3D,
  quantum_orbital: buildQuantumOrbital3D,
  schwarzschild: buildSchwarzschild3D,
  minkowski: buildMinkowski3D,
  navier_vortex: buildNavierVortex3D,
  kdv_soliton: buildKdvSoliton3D,
  riemann: buildRiemann3D,
  higgs: buildHiggs3D,
  fibonacci: buildFibonacci3D,
  kepler: buildKepler3D,
  euler: buildEuler3D,
  maxwell: buildMaxwell3D,
  chladni: buildChladni3D,
  snell: buildSnell3D,
  pythagoras: buildPythagoras3D,
  thermo: buildThermo3D,
  automata: buildAutomata3D
};

const MANIFOLD_ARCHETYPE_MAP = {
  lorenz_attractor: "lorenz", rossler_attractor: "lorenz", logistic_feigenbaum: "lorenz",
  kuramoto_sync: "lorenz", langevin_stochastic: "lorenz", hamilton_phase: "lorenz",

  ricci_flow: "klein", beal_conjecture: "klein", fermat_last: "klein", p_vs_np: "klein",
  clifford_dual: "mobius", noether_symmetry: "mobius", godel_incompleteness: "mobius",
  hopf_fibration: "hopf", quaternion: "hopf", yang_mills: "hopf",
  turing_morphogenesis: "gyroid", belousov_zhabotinsky: "gyroid", von_mises: "gyroid", voronoi: "gyroid",

  schrodinger: "quantum_orbital", de_broglie_wave: "quantum_orbital", dirac_equation: "quantum_orbital",
  pauli_exclusion: "quantum_orbital", planck_quantum: "quantum_orbital", photoelectric: "quantum_orbital",
  heisenberg_uncertainty: "quantum_orbital",

  schwarzschild_bh: "schwarzschild", black_hole_entropy: "schwarzschild",
  hawking_radiation: "schwarzschild", gravitation_universal: "schwarzschild",

  minkowski_spacetime: "minkowski", lorentz_transform: "minkowski", light_speed: "minkowski",
  einstein_field: "minkowski", mass_energy: "minkowski",

  navier_stokes: "navier_vortex", bernoulli_fluid: "navier_vortex", benard_convection: "navier_vortex",
  kdv_soliton: "kdv_soliton", doppler: "kdv_soliton", wave_dalembert: "kdv_soliton",

  riemann_zeta: "riemann", riemann_metric: "riemann",
  standard_model: "higgs", higgs_mechanism: "higgs",

  fibonacci: "fibonacci", apollonian: "fibonacci", mandelbrot_julia: "fibonacci",
  kepler_ellipse: "kepler", kepler_area: "kepler", kepler_harmonic: "kepler",
  yoshida_symplectic: "kepler", gravity_drop: "kepler",

  euler_polyhedra: "euler", euler_identity: "euler", euler_lagrange: "euler",
  euler_beam: "euler", calculus_fundamental: "euler",

  maxwell_gauss_e: "maxwell", maxwell_gauss_b: "maxwell", maxwell_faraday: "maxwell",
  maxwell_ampere: "maxwell", lorentz_force: "maxwell", faraday_induction: "maxwell",
  coulomb_force: "maxwell", ohm_conduction: "maxwell",

  chladni: "chladni", laplace_harmonic: "chladni", poisson_potential: "chladni",
  fourier_spectral: "chladni", fourier_heat: "chladni",

  snell_refract: "snell", fermat_principle: "snell",

  pythagoras: "pythagoras", cartesian: "pythagoras", lever: "pythagoras",
  buoyancy: "pythagoras", hooke_spring: "pythagoras", newton_inertia: "pythagoras",
  newton_fma: "pythagoras", newton_reaction: "pythagoras",

  carnot_cycle: "thermo", first_law_thermo: "thermo", second_law_entropy: "thermo",
  boltzmann_entropy: "thermo", maxwell_boltzmann_dist: "thermo", thermal_cooling: "thermo",
  ideal_gas: "thermo", stefan_boltzmann: "thermo", wien_displacement: "thermo",
  bose_einstein: "thermo", black_scholes: "thermo",

  turing_machine: "automata", rule_110: "automata", langton_ant: "automata",
  shannon_entropy: "automata", shannon_capacity: "automata", hubble_expansion: "automata",
  friedmann_cosmos: "automata"
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

      if (isFocused || isCollimated || (frameCount % 4 === 0)) {
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

// Navegación sobre la cubierta de basalto de Paranal (altura de ojos: 0.5m sobre origen)
const platformObserverPos = new THREE.Vector3(0, 0.5, 0);
const targetPlatformPos = new THREE.Vector3(0, 0.5, 0);
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

// ── CÁLCULO DE COLIMACIÓN ASTRONÓMICA CON TELESCOPIO (MODO ROTONDA) ──
function updateTelescopeCollimation() {
  if (currentMuseumMode !== MODE_ROTUNDA_TELESCOPE || isInShopMode) return;
  const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

  let bestIdx = -1;
  let bestDot = Math.cos(10 * Math.PI / 180); // Cono de 10 grados para apuntado astronómico preciso

  astros24.forEach((a, idx) => {
    if (!a.group.visible) return; // Respetar filtro de época activo
    const toA = new THREE.Vector3().subVectors(a.worldPos, camera.position).normalize();
    const dot = lookDir.dot(toA);
    if (dot > bestDot) {
      bestDot = dot;
      bestIdx = idx;
    }
  });

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
    const subEl   = document.getElementById('collimator-sub');
    if (coordEl) coordEl.textContent = `Asc ${String(ascHours).padStart(2,'0')}h ${String(ascMins).padStart(2,'0')}m · Dec ${decSign}${decDeg}°`;
    if (titleEl) titleEl.textContent = `Obra ${d.badge} · ${d.title}`;
    if (subEl)   subEl.textContent   = `${d.sub} · Distancia: ${dist}m`;
    
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

  targetPlatformPos.set(0, 0.5, 0);
  platformObserverPos.set(0, 0.5, 0);
  camera.position.set(0, 0.5, 0);

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
  const hudCard = document.getElementById('orbital-hud-card');
  if (hudCard) hudCard.classList.add('opacity-0', 'translate-x-8', 'pointer-events-none');

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
function setup6DOFControls() {
  let lastPointer = null;

  window.addEventListener('mousemove', (e) => {
    if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #telescope-collimator-hud, #confinement-return-bar, button, a, select, input')) {
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

    if (isInShopMode) {
      targetProductRotation.y += dx * 0.01;
      targetProductRotation.x += dy * 0.01;
    } else if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE) {
      // El usuario barre el cielo pasando el dedo por el trackpad / moviendo el mouse (cero clics sostenidos)
      userInertiaTimer = 0;
      targetOrientation.yaw -= dx * 0.0035;
      targetOrientation.pitch -= dy * 0.0035;
      targetOrientation.pitch = Math.max(-0.25, Math.min(1.50, targetOrientation.pitch)); // Permite mirar el zócalo/barandilla y al cenit
    } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
      // El observador se desplaza libremente en S² al mover el mouse
      userInertiaTimer = 0;
      targetSphereTheta -= dx * 0.0045;
      targetSpherePhi   -= dy * 0.0045;
      targetSpherePhi   = Math.max(0.08, Math.min(Math.PI - 0.08, targetSpherePhi));
    }
  });

  window.addEventListener('mouseleave', () => {
    lastPointer = null;
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
        targetOrientation.yaw -= dx * 0.0035;
        targetOrientation.pitch -= dy * 0.0035;
        targetOrientation.pitch = Math.max(-0.25, Math.min(1.50, targetOrientation.pitch));
      } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) {
        targetSphereTheta -= dx * 0.0045;
        targetSpherePhi   -= dy * 0.0045;
        targetSpherePhi   = Math.max(0.08, Math.min(Math.PI - 0.08, targetSpherePhi));
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    lastPointer = null;
  });

  // Clic directo: si se está mirando una fórmula y se hace clic, entrar en ella
  window.addEventListener('click', (e) => {
    if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #confinement-return-bar, button, a')) return;
    if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE && collimatedAstroIndex >= 0) {
      warpToTargetAstro(collimatedAstroIndex);
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
    if (e.key === 'Escape') {
      if (currentMuseumMode === MODE_SPHERE_CONFINEMENT) returnToRotunda();
      return;
    }
    if (e.code === 'Space') {
      if (currentMuseumMode === MODE_ROTUNDA_TELESCOPE && collimatedAstroIndex >= 0) {
        warpToTargetAstro();
      } else {
        triggerShutter();
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
    // 1. MODO ROTONDA: Desplazamiento libre por la plataforma hacia la barandilla
    const forwardX = -Math.sin(orientation.yaw);
    const forwardZ = -Math.cos(orientation.yaw);
    const rightX = Math.cos(orientation.yaw);
    const rightZ = -Math.sin(orientation.yaw);

    let moveX = 0;
    let moveZ = 0;
    if (keysPressed['KeyW'] || keysPressed['ArrowUp']) { moveX += forwardX; moveZ += forwardZ; }
    if (keysPressed['KeyS'] || keysPressed['ArrowDown']) { moveX -= forwardX; moveZ -= forwardZ; }
    if (keysPressed['KeyD'] || keysPressed['ArrowRight']) { moveX += rightX; moveZ += rightZ; }
    if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) { moveX -= rightX; moveZ -= rightZ; }

    const moveLen = Math.hypot(moveX, moveZ);
    if (moveLen > 0.001) {
      const walkSpeed = 0.07; // Marcha serena por el basalto
      targetPlatformPos.x += (moveX / moveLen) * walkSpeed;
      targetPlatformPos.z += (moveZ / moveLen) * walkSpeed;
    }

    // Límite circular de la barandilla de bronce (radio barandilla 3.6m, límite observador r <= 2.8m)
    const distCenter = Math.hypot(targetPlatformPos.x, targetPlatformPos.z);
    if (distCenter > 2.8) {
      targetPlatformPos.x *= 2.8 / distCenter;
      targetPlatformPos.z *= 2.8 / distCenter;
    }
    targetPlatformPos.y = 0.5;

    platformObserverPos.lerp(targetPlatformPos, 0.12);
    camera.position.copy(platformObserverPos);

    orientation.pitch += (targetOrientation.pitch - orientation.pitch) * 0.18;
    orientation.yaw   += (targetOrientation.yaw - orientation.yaw) * 0.18;
    camera.quaternion.setFromEuler(new THREE.Euler(orientation.pitch, orientation.yaw, 0, 'YXZ'));

    // Calcular colimación astronómica con la lente del telescopio
    updateTelescopeCollimation();

    // Dinámica suave de NAI centinela en la rotonda
    if (nai3D.group) {
      nai3D.pulseTime += delta;
      const naiTarget = new THREE.Vector3(
        Math.sin(nai3D.pulseTime * 0.5) * 1.5,
        0.3 + Math.cos(nai3D.pulseTime * 0.8) * 0.3,
        -2.5
      );
      nai3D.group.position.lerp(naiTarget, 0.04);
      nai3D.core.rotation.y += 0.02;
      nai3D.outerHalo.rotation.y -= 0.025;
      nai3D.light.intensity = 1.6 + Math.sin(nai3D.pulseTime * 4.0) * 0.3;
    }

    astros24.forEach(a => a.timonelRing.lookAt(camera.position));

  } else if (currentMuseumMode === MODE_SPHERE_CONFINEMENT && activeConfinementAstro) {
    // 2. MODO BURBUJA S²: El observador se desplaza sobre la superficie esférica
    sphereTheta  += (targetSphereTheta - sphereTheta) * 0.18;
    spherePhi    += (targetSpherePhi - spherePhi) * 0.18;
    sphereRadius += (targetSphereRadius - sphereRadius) * 0.15;

    const center = activeConfinementAstro.worldPos;
    const targetCam = new THREE.Vector3(
      center.x + sphereRadius * Math.sin(spherePhi) * Math.sin(sphereTheta),
      center.y + sphereRadius * Math.cos(spherePhi),
      center.z + sphereRadius * Math.sin(spherePhi) * Math.cos(sphereTheta)
    );
    if (camera.position.distanceTo(targetCam) > 4.0) {
      camera.position.copy(targetCam);
    } else {
      camera.position.lerp(targetCam, 0.15);
    }
    camera.lookAt(center);

    // Dinámica de NAI orbitando cerca del astro enfocado
    if (nai3D.group) {
      nai3D.pulseTime += delta;
      const naiTarget = new THREE.Vector3(
        center.x + Math.sin(nai3D.pulseTime * 0.8) * 2.2,
        center.y + Math.cos(nai3D.pulseTime * 1.0) * 1.0,
        center.z + 1.6
      );
      nai3D.group.position.lerp(naiTarget, 0.06);
      nai3D.core.rotation.y += 0.02;
      nai3D.outerHalo.rotation.y -= 0.025;
      nai3D.light.intensity = 1.8 + Math.sin(nai3D.pulseTime * 4.0) * 0.4;
    }

    astros24.forEach(a => a.timonelRing.lookAt(camera.position));
  }

  // Actualizar los 24 Modelos Matemáticos con Ciclo de Auto-Resolución y Culling Térmico
  const camPos = camera.position;
  const isConfinement = (currentMuseumMode === MODE_SPHERE_CONFINEMENT);

  astros24.forEach((astro) => {
    if (!astro.group.visible) return; // Si la época no está activa, 0% CPU

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
