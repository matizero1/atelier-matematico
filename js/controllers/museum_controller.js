/**
 * Atelier Matemático - Museum Controller
 * 3D Celestial Observatory (Atlas Cósmico de 100 Leyes)
 * NASA JPL-Grade Modular Architecture
 * Orquestador Three.js: Bóveda Celeste, 100 Leyes, Boutique Orbital & Ciclo de Renderizado
 * Silicio Nativo · Timonel F2 · Rendimiento Térmico Gobernado
 */

// CATÁLOGO COMPLETO DE LAS 100 LEYES DE LA HUMANIDAD (BÓVEDA CELESTE VISIBLE · TIMONEL F2)
const ARTWORKS_24 = (typeof window !== 'undefined' && window.ARTWORKS_100 && window.ARTWORKS_100.length) ? window.ARTWORKS_100 : [];

// Variables Three.js & Silicio
let scene, camera, renderer;
let cosmicDirLight = null;
let cosmicStarsMesh = null;
let astros24 = [];
let knotFilamentUpdaters = [];

// Entidad 3D de NAI
let nai3D = {
  group: null, core: null, outerHalo: null, light: null,
  targetPos: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 0, -8) : { x: 0, y: 0, z: -8 },
  currentIndex: 0, pulseTime: 0
};

// Sincronización con el Estado Compartido de Navegación 6DOF y Telescopio (MuseumCamera)
const cameraState = (typeof window !== 'undefined' && window.AtelierCameraState) ? window.AtelierCameraState : {
  MODE_ROTUNDA_TELESCOPE: 0,
  MODE_SPHERE_CONFINEMENT: 1,
  mode: 0,
  velocity: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 0, 0) : { x: 0, y: 0, z: 0 },
  orientation: { pitch: 0, yaw: 0 },
  targetOrientation: { pitch: 0, yaw: 0 },
  targetTelescopeAngles: { ha: 0, dec: 0.35 },
  currentTelescopeAngles: { ha: 0, dec: 0.35 },
  isTelescopeSlewing: false,
  slewStartTime: 0,
  slewStartAngles: { ha: 0, dec: 0.35 },
  isTelescopeModalOpen: false,
  gotoEpochFilter: 0,
  gotoSearchQuery: '',
  keysPressed: {},
  platformObserverPos: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 1.65, 0) : { x: 0, y: 1.65, z: 0 },
  targetPlatformPos: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 1.65, 0) : { x: 0, y: 1.65, z: 0 },
  sphereRadius: 3.6,
  targetSphereRadius: 3.6,
  sphereTheta: 0.0,
  targetSphereTheta: 0.0,
  spherePhi: Math.PI / 2.2,
  targetSpherePhi: Math.PI / 2.2,
  userInertiaTimer: 0,
  activeConfinementAstro: null,
  currentFocusedAstro: null,
  collimatedAstroIndex: -1,
  currentActiveEpoch: 0,
  isPointerLocked: false,
  currentMouseScreenPos: { x: -1, y: -1 }
};

const MODE_ROTUNDA_TELESCOPE = cameraState.MODE_ROTUNDA_TELESCOPE;
const MODE_SPHERE_CONFINEMENT = cameraState.MODE_SPHERE_CONFINEMENT;

// Telescopio Hiperrealista PBR (Grupos Three.js)
let telescopeForkGroup = null;
let telescopeOtaGroup = null;
let telescopeConsoleScreenMesh = null;

// Telemetría de Enjambre
let swarmNodeId = "CL-" + Math.floor(1000 + Math.random() * 9000);

// Boutique Orbital 3D
let isInShopMode = false;
let savedCameraState = {
  pos: (typeof THREE !== 'undefined') ? new THREE.Vector3() : { x: 0, y: 0, z: 0 },
  quat: (typeof THREE !== 'undefined') ? new THREE.Quaternion() : {}
};
let shopBayGroup = null;
let shopProducts = { frameWood: null, frameAcrylic: null, mug: null, notebook: null, certificate: null };
let currentProductType = 'frame_wood';
let activeProductTexture = null;
let productRotation = { x: 0, y: 0 }, targetProductRotation = { x: 0, y: 0 };

function navigateToActiveShop() {
  const focused = cameraState.currentFocusedAstro || (typeof window !== 'undefined' ? window.currentFocusedAstro : null);
  const artId = focused ? focused.data.id : 20;
  window.location.href = `shop.html?art=${artId}`;
}


// ── INICIALIZACIÓN PRINCIPAL ──────────────────────────────────────
function initAtlasCosmico() {
  const canvas = document.getElementById('webgl-canvas');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08080a);
  scene.fog = new THREE.FogExp2(0x08080a, 0.0022);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 350);
  camera.position.set(0, 1.65, 0);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: "high-performance",
    alpha: false,
    preserveDrawingBuffer: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  if (typeof window !== 'undefined') {
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;
    window.nai3D = nai3D;
    window.isInShopMode = isInShopMode;
    window.targetProductRotation = targetProductRotation;
  }

  // Inicializar Gobernador de Rendimiento LOD
  if (typeof window !== 'undefined' && typeof window.AtelierLOD !== 'undefined') {
    window.AtelierLOD.init(renderer, camera, scene);
  }

  // Iluminación Cósmica PBR
  const ambLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambLight);

  cosmicDirLight = new THREE.DirectionalLight(0xe2e8f0, 1.35);
  cosmicDirLight.position.set(20, 45, 30);
  scene.add(cosmicDirLight);

  const fillDirLight = new THREE.DirectionalLight(0xa855f7, 0.35);
  fillDirLight.position.set(-25, -15, -20);
  scene.add(fillDirLight);

  astros24 = [];
  buildCosmicVoid();
  buildTectonicRotunda();

  if (typeof window !== 'undefined') {
    window.astros24 = astros24;
    window.ARTWORKS_24 = ARTWORKS_24;
  }

  buildNaiSovereignEntity();
  buildShopBay3D();

  // Inicializar subsistemas modulares (HUD, Audio, Cámara 6DOF)
  if (typeof window !== 'undefined') {
    if (window.MuseumHUD) {
      window.MuseumHUD.loadDiscoveryLedger();
      window.MuseumHUD.loadCameraRoll();
      window.MuseumHUD.populateNaiAstroSelector();
      window.MuseumHUD.updateDiscoveryUI();
    }
    if (window.MuseumCamera) {
      window.MuseumCamera.setup6DOFControls();
      window.MuseumCamera.renderGotoCatalog();
    }
  }

  window.addEventListener('resize', onWindowResize);
  requestAnimationFrame(animate);

  const loadingEl = document.getElementById('loading-screen');
  if (loadingEl) {
    loadingEl.style.opacity = '0';
    setTimeout(() => {
      loadingEl.style.setProperty('display', 'none', 'important');
      loadingEl.classList.add('hidden');
    }, 600);
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
  cosmicDirLight = dirLight1;

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
  cosmicStarsMesh = stars;

  // Instanciar los 24 Astros Matemáticos con sus Modelos Nativos y Motor de Auto-Resolución
  ARTWORKS_24.forEach((data, index) => {
    createLivingMathematicalAstro(data, index);
  });
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
      const isFocused = (cameraState.activeConfinementAstro && cameraState.activeConfinementAstro.data.id === id);
      const isCollimated = (cameraState.collimatedAstroIndex >= 0 && astros24[cameraState.collimatedAstroIndex] && astros24[cameraState.collimatedAstroIndex].data.id === id);

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
  const focused = cameraState.currentFocusedAstro || (typeof window !== 'undefined' ? window.currentFocusedAstro : null);
  if (focused) {
    perturbAstro(focused);
  } else {
    const curAstro = astros24[nai3D.currentIndex] || astros24[0];
    if (curAstro) perturbAstro(curAstro);
  }
}

function perturbAstro(astro) {
  astro.cycleT = 0; // Desatar choque de entropía inmediato
  astro.timonelRing.scale.set(1.22, 1.22, 1.22);
  setTimeout(() => astro.timonelRing.scale.set(1, 1, 1), 350);
  (window.MuseumAudio ? window.MuseumAudio.speakNai : (typeof speakNai === 'function' ? speakNai : () => {}))("Forma liberada hacia el caos. Observa cómo la ley matemática combate el desorden y vuelve a cristalizar.");
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

  // Actualizar Gobernador de Rendimiento & Presupuesto de Cuadro (Timonel F2)
  if (typeof AtelierLOD !== 'undefined') {
    AtelierLOD.update(delta);
    if (frameCounter % 15 === 0) {
      updateLODHUD();
    }
  }

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

  } else if (cameraState.mode === MODE_ROTUNDA_TELESCOPE) {
    // 1. ROTACIÓN PANORÁMICA 360° POR TECLADO (Flechas Izq/Der o Q/E):
    if (cameraState.keysPressed['ArrowLeft'] || cameraState.keysPressed['KeyQ']) {
      cameraState.targetOrientation.yaw += 0.032;
      cameraState.userInertiaTimer = 0;
    }
    if (cameraState.keysPressed['ArrowRight'] || cameraState.keysPressed['KeyE']) {
      cameraState.targetOrientation.yaw -= 0.032;
      cameraState.userInertiaTimer = 0;
    }
    if (cameraState.keysPressed['ArrowUp'] || cameraState.keysPressed['KeyR']) {
      cameraState.targetOrientation.pitch = Math.min(1.50, cameraState.targetOrientation.pitch + 0.022);
      cameraState.userInertiaTimer = 0;
    }
    if (cameraState.keysPressed['ArrowDown'] || cameraState.keysPressed['KeyF']) {
      cameraState.targetOrientation.pitch = Math.max(-0.45, cameraState.targetOrientation.pitch - 0.022);
      cameraState.userInertiaTimer = 0;
    }

    // 2. DESPLAZAMIENTO POR LA PLATAFORMA CON TECLAS WASD:
    const forwardX = -Math.sin(cameraState.orientation.yaw);
    const forwardZ = -Math.cos(cameraState.orientation.yaw);
    const rightX = Math.cos(cameraState.orientation.yaw);
    const rightZ = -Math.sin(cameraState.orientation.yaw);

    let moveX = 0;
    let moveZ = 0;
    if (cameraState.keysPressed['KeyW']) { moveX += forwardX; moveZ += forwardZ; }
    if (cameraState.keysPressed['KeyS']) { moveX -= forwardX; moveZ -= forwardZ; }
    if (cameraState.keysPressed['KeyD']) { moveX += rightX; moveZ += rightZ; }
    if (cameraState.keysPressed['KeyA']) { moveX -= rightX; moveZ -= rightZ; }

    const moveLen = Math.hypot(moveX, moveZ);
    if (moveLen > 0.001) {
      const walkSpeed = 0.11; // Marcha ágil por la monumental cubierta de basalto
      cameraState.targetPlatformPos.x += (moveX / moveLen) * walkSpeed;
      cameraState.targetPlatformPos.z += (moveZ / moveLen) * walkSpeed;
    }

    // Límite circular de la barandilla perimetral de bronce (radio barandilla 13.8m, límite observador r <= 12.5m)
    const distCenter = Math.hypot(cameraState.targetPlatformPos.x, cameraState.targetPlatformPos.z);
    if (distCenter > 12.5) {
      cameraState.targetPlatformPos.x *= 12.5 / distCenter;
      cameraState.targetPlatformPos.z *= 12.5 / distCenter;
    }
    cameraState.targetPlatformPos.y = 1.65; // Altura natural del observador de pie

    cameraState.platformObserverPos.lerp(cameraState.targetPlatformPos, 0.12);
    camera.position.copy(cameraState.platformObserverPos);

    // 3. BARRIDO AUTOMÁTICO EN BORDES DE PANTALLA (EDGE PANNING):
    if (cameraState.currentMouseScreenPos.x >= 0 && typeof window !== 'undefined') {
      const edgeMargin = Math.min(65, window.innerWidth * 0.06);
      if (cameraState.currentMouseScreenPos.x < edgeMargin) {
        cameraState.targetOrientation.yaw += 0.020 * (1.0 - cameraState.currentMouseScreenPos.x / edgeMargin);
        cameraState.userInertiaTimer = 0;
      } else if (cameraState.currentMouseScreenPos.x > window.innerWidth - edgeMargin) {
        cameraState.targetOrientation.yaw -= 0.020 * (1.0 - (window.innerWidth - cameraState.currentMouseScreenPos.x) / edgeMargin);
        cameraState.userInertiaTimer = 0;
      }
    }

    const lerpFactor = cameraState.isPointerLocked ? 0.55 : 0.35;
    cameraState.orientation.pitch += (cameraState.targetOrientation.pitch - cameraState.orientation.pitch) * lerpFactor;
    cameraState.orientation.yaw   += (cameraState.targetOrientation.yaw - cameraState.orientation.yaw) * lerpFactor;
    _camEuler.set(cameraState.orientation.pitch, cameraState.orientation.yaw, 0);
    camera.quaternion.setFromEuler(_camEuler);

    // Calcular colimación astronómica con la lente del telescopio cada 2 frames
    if (frameCounter % 2 === 0) {
      updateTelescopeCollimation();
    }

    // 4. ANIMACIÓN SUAVE DE SERVOMOTORES DEL TELESCOPIO (GOTO SLEW)
    if (telescopeForkGroup && telescopeOtaGroup) {
      if (cameraState.isTelescopeSlewing) {
        const elapsed = performance.now() - cameraState.slewStartTime;
        const progress = Math.min(1.0, elapsed / 1150);
        const ease = 1 - Math.pow(1 - progress, 3);
        cameraState.currentTelescopeAngles.ha = cameraState.slewStartAngles.ha + (cameraState.targetTelescopeAngles.ha - cameraState.slewStartAngles.ha) * ease;
        cameraState.currentTelescopeAngles.dec = cameraState.slewStartAngles.dec + (cameraState.targetTelescopeAngles.dec - cameraState.slewStartAngles.dec) * ease;
        telescopeForkGroup.rotation.y = cameraState.currentTelescopeAngles.ha;
        telescopeOtaGroup.rotation.x = cameraState.currentTelescopeAngles.dec;
        if (progress >= 1.0) {
          cameraState.isTelescopeSlewing = false;
          updateTelescopeCollimation();
        }
      }
    }

    // 5. COMPROBACIÓN DE PROXIMIDAD AL TELESCOPIO MONUMENTAL
    const distToScope = Math.hypot(camera.position.x, camera.position.z - 5.0);
    const proxBadge = document.getElementById('telescope-proximity-badge');
    if (proxBadge) {
      if (distToScope < 3.8 && !cameraState.isTelescopeModalOpen && cameraState.mode === MODE_ROTUNDA_TELESCOPE) {
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

  } else if (cameraState.mode === MODE_SPHERE_CONFINEMENT && cameraState.activeConfinementAstro) {
    // 2. MODO BURBUJA S²: Órbita libre con Mouse o Teclas (Flechas / WASD / QE):
    if (cameraState.keysPressed['ArrowLeft'] || cameraState.keysPressed['KeyA'] || cameraState.keysPressed['KeyQ']) {
      cameraState.targetSphereTheta += 0.035;
      cameraState.userInertiaTimer = 0;
    }
    if (cameraState.keysPressed['ArrowRight'] || cameraState.keysPressed['KeyD'] || cameraState.keysPressed['KeyE']) {
      cameraState.targetSphereTheta -= 0.035;
      cameraState.userInertiaTimer = 0;
    }
    if (cameraState.keysPressed['ArrowUp'] || cameraState.keysPressed['KeyW'] || cameraState.keysPressed['KeyR']) {
      cameraState.targetSpherePhi = Math.max(0.08, cameraState.targetSpherePhi - 0.025);
      cameraState.userInertiaTimer = 0;
    }
    if (cameraState.keysPressed['ArrowDown'] || cameraState.keysPressed['KeyS'] || cameraState.keysPressed['KeyF']) {
      cameraState.targetSpherePhi = Math.min(Math.PI - 0.08, cameraState.targetSpherePhi + 0.025);
      cameraState.userInertiaTimer = 0;
    }

    // Barrido en bordes en modo confinamiento:
    if (cameraState.currentMouseScreenPos.x >= 0 && typeof window !== 'undefined') {
      const edgeMargin = Math.min(65, window.innerWidth * 0.06);
      if (cameraState.currentMouseScreenPos.x < edgeMargin) {
        cameraState.targetSphereTheta += 0.022 * (1.0 - cameraState.currentMouseScreenPos.x / edgeMargin);
        cameraState.userInertiaTimer = 0;
      } else if (cameraState.currentMouseScreenPos.x > window.innerWidth - edgeMargin) {
        cameraState.targetSphereTheta -= 0.022 * (1.0 - (window.innerWidth - cameraState.currentMouseScreenPos.x) / edgeMargin);
        cameraState.userInertiaTimer = 0;
      }
    }

    const confLerp = cameraState.isPointerLocked ? 0.45 : 0.25;
    cameraState.sphereTheta  += (cameraState.targetSphereTheta - cameraState.sphereTheta) * confLerp;
    cameraState.spherePhi    += (cameraState.targetSpherePhi - cameraState.spherePhi) * confLerp;
    cameraState.sphereRadius += (cameraState.targetSphereRadius - cameraState.sphereRadius) * 0.20;

    const center = cameraState.activeConfinementAstro.worldPos;
    _targetCam.set(
      center.x + cameraState.sphereRadius * Math.sin(cameraState.spherePhi) * Math.sin(cameraState.sphereTheta),
      center.y + cameraState.sphereRadius * Math.cos(cameraState.spherePhi),
      center.z + cameraState.sphereRadius * Math.sin(cameraState.spherePhi) * Math.cos(cameraState.sphereTheta)
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

    if (cameraState.activeConfinementAstro) {
      cameraState.activeConfinementAstro.timonelRing.lookAt(camera.position);
    }
  }

  // Actualizar los 24 Modelos Matemáticos con Ciclo de Auto-Resolución y Culling Térmico
  const camPos = camera.position;
  const isConfinement = (cameraState.mode === MODE_SPHERE_CONFINEMENT);

  astros24.forEach((astro) => {
    // Si la época está filtrada por el selector de constelaciones, 0% CPU
    if (astro.epochHidden) {
      astro.group.visible = false;
      return;
    }

    const isCollimated = (!isConfinement && astro.index === cameraState.collimatedAstroIndex);
    const isActive = (isConfinement && astro === cameraState.activeConfinementAstro);

    // Culling por Frustum con AtelierLOD: si está fuera del cono visual y no está en foco, ocultar
    if (!isCollimated && !isActive && typeof AtelierLOD !== 'undefined') {
      const inFrustum = AtelierLOD.isAstroInFrustum(astro.worldPos, 4.0);
      if (!inFrustum) {
        astro.group.visible = false;
        return; // Omitir recorrido en el renderizador Three.js y cálculo de física
      } else {
        astro.group.visible = true;
      }
    } else {
      astro.group.visible = true;
    }

    // Lazy Lights: Solo el astro activo/colimado activa luces dinámicas (evita saturar WebGL con 200 luces)
    const shouldLight = isConfinement ? (astro === cameraState.activeConfinementAstro) : (astro.index === cameraState.collimatedAstroIndex);
    if (astro.pointLight && astro.pointLight.visible !== shouldLight) {
      astro.pointLight.visible = shouldLight;
      astro.fillLight.visible = shouldLight;
    }

    const distToCam = astro.worldPos.distanceTo(camPos);

    // CULLING TÉRMICO CON DILATACIÓN CÓSMICA (55m - 90m):
    // Si el usuario está en confinamiento y este no es el astro activo, no procesar física de fondo
    if (isConfinement && astro !== cameraState.activeConfinementAstro) return;

    // Delegar decisión de actualización numérica en AtelierLOD
    let shouldUpdate = true;
    if (typeof AtelierLOD !== 'undefined') {
      shouldUpdate = AtelierLOD.shouldUpdateAstro(astro, distToCam, frameCounter);
    } else {
      if (distToCam > 130.0) shouldUpdate = false;
      else if (distToCam > 50.0 && ((frameCounter + astro.index) % 2 !== 0)) shouldUpdate = false;
    }
    if (!shouldUpdate) return;

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
      const isCollimated = (astro.index === cameraState.collimatedAstroIndex);
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
  if ((cameraState.currentFocusedAstro || (typeof window !== "undefined" ? window.currentFocusedAstro : null))) {
    const stateEl = document.getElementById('hud-relax-state');
    const progEl = document.getElementById('hud-relax-progress');
    const resEl = document.getElementById('hud-residual-val');
    const slackEl = document.getElementById('hud-slack-val');

    if (stateEl && progEl && resEl && slackEl) {
      if ((cameraState.currentFocusedAstro || (typeof window !== "undefined" ? window.currentFocusedAstro : null)).phase === 'DISPERSION') {
        stateEl.textContent = 'ENTROPÍA ALTA · DISPERSANDO';
        stateEl.className = 'text-rose-400 font-bold';
        progEl.style.width = '18%';
        progEl.className = 'bg-rose-500 h-full transition-all duration-300';
      } else if ((cameraState.currentFocusedAstro || (typeof window !== "undefined" ? window.currentFocusedAstro : null)).phase === 'RELAXATION') {
        stateEl.textContent = 'TRANSICIÓN VISUAL';
        stateEl.className = 'text-purple-300 font-bold';
        const pct = Math.floor((cameraState.currentFocusedAstro || (typeof window !== "undefined" ? window.currentFocusedAstro : null)).relaxFactor * 100);
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


// ── EXPORTACIÓN DE MALLAS 3D EN SILICIO (DFAM TIMONEL F2) ────────────
function exportActiveAstroSTL() {
  let targetAstro = cameraState.activeConfinementAstro || (cameraState.currentFocusedAstro || (typeof window !== "undefined" ? window.currentFocusedAstro : null));
  if (!targetAstro && typeof cameraState.collimatedAstroIndex !== 'undefined' && collimatedAstroIndex >= 0) {
    targetAstro = astros24[collimatedAstroIndex];
  }
  if (!targetAstro) {
    targetAstro = astros24[nai3D.currentIndex] || astros24[0];
  }

  if (!targetAstro) {
    speakNai("No hay ningún astro colimado para exportar.");
    return;
  }

  const d = targetAstro.data || {};
  const badge = d.badge || String(targetAstro.index + 1).padStart(3, '0');
  const title = (d.title || 'Obra').replace(/[^a-zA-Z0-9_\u00C0-\u017F]/g, '_');
  const filename = `Atelier_3D_OBRA_${badge}_${title}.stl`;

  try {
    if (!window.Atelier3DExporter) {
      throw new Error("Módulo Atelier3DExporter no disponible.");
    }

    const meshGroup = (targetAstro.model && targetAstro.model.group) ? targetAstro.model.group : targetAstro.group;
    
    speakNai(`Generando geometría STL de alta fidelidad para Obra ${badge}. Preparando para fabricación aditiva.`);
    
    const result = window.Atelier3DExporter.downloadSTL(meshGroup, filename, {
      title: `Atelier Matematico Obra ${badge} ${title}`,
      targetDimensionMm: 100.0 // 100 mm de envergadura por defecto para impresión DFAM
    });

    console.log(`[Timonel DFAM] STL generado exitosamente: ${result.triangleCount} triángulos, ${(result.byteLength / 1024).toFixed(1)} KB`);
    
    const btn = document.getElementById('btn-export-stl');
    if (btn) {
      const origHtml = btn.innerHTML;
      btn.innerHTML = `<span>✓ STL Descargado (${result.triangleCount} Δ)</span>`;
      btn.classList.add('bg-emerald-950/60', 'border-emerald-500/60', 'text-emerald-300');
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.classList.remove('bg-emerald-950/60', 'border-emerald-500/60', 'text-emerald-300');
      }, 3500);
    }
  } catch (err) {
    console.error('[Timonel DFAM] Error exportando STL:', err);
    speakNai("Error al exportar la geometría 3D.");
    alert("Error exportando STL: " + err.message);
  }
}


function bootAtlas() {
  initAtlasCosmico();
  if (window.location.href.includes('skip_foyer') || window.location.href.includes('enter') || window.location.hash.includes('enter') || window.location.href.includes('direct') || window.location.href.includes('warp=')) {
    const foyer = document.getElementById('foyer-screen');
    if (foyer) {
      foyer.style.setProperty('display', 'none', 'important');
      foyer.classList.add('hidden');
      foyer.remove();
    }
  }
  if (window.location.href.includes('warp=')) {
    const match = window.location.href.match(/warp=(\d+)/);
    if (match) {
      const targetIdx = parseInt(match[1]);
      if (window.MuseumCamera) {
        window.MuseumCamera.warpToTargetAstro(targetIdx);
      }
    }
  }
}

// ── EXPORTACIÓN EXPLÍCITA Y RETROCOMPATIBILIDAD TOTAL (TIMONEL F2) ──
window.exportActiveAstroSTL = exportActiveAstroSTL;
window.perturbCurrentAstro = perturbCurrentAstro;
window.navigateToActiveShop = navigateToActiveShop;
window.enterShopMode = enterShopMode;
window.exitShopMode = exitShopMode;
window.switch3DProduct = switch3DProduct;
window.processDirectCheckout = processDirectCheckout;
window.initAtlasCosmico = initAtlasCosmico;
window.bootAtlas = bootAtlas;

// Enlazar métodos de subsistemas desacoplados a window para compatibilidad HTML
if (window.MuseumAudio) {
  window.enterCapsule = window.MuseumAudio.enterCapsule;
  window.toggleVoiceGuide = window.MuseumAudio.toggleVoiceGuide;
  window.updateVoiceStatusUI = window.MuseumAudio.updateVoiceStatusUI;
  window.playServoSound = window.MuseumAudio.playServoSound;
  window.playShutterSound = window.MuseumAudio.playShutterSound;
  window.speakNai = window.MuseumAudio.speakNai;
  window.stopNaiSpeech = window.MuseumAudio.stopNaiSpeech;
  window.toggleAudioGuide = window.MuseumAudio.toggleAudioGuide;
}
if (window.MuseumCamera) {
  window.slewTelescopeToTarget = window.MuseumCamera.slewTelescopeToTarget;
  window.openTelescopeGotoTerminal = window.MuseumCamera.openTelescopeGotoTerminal;
  window.closeTelescopeGotoTerminal = window.MuseumCamera.closeTelescopeGotoTerminal;
  window.toggleTelescopeGotoTerminal = window.MuseumCamera.toggleTelescopeGotoTerminal;
  window.filterGotoCatalog = window.MuseumCamera.filterGotoCatalog;
  window.setGotoEpochFilter = window.MuseumCamera.setGotoEpochFilter;
  window.warpToTargetAstro = window.MuseumCamera.warpToTargetAstro;
  window.returnToRotunda = window.MuseumCamera.returnToRotunda;
  window.filterEpoch = window.MuseumCamera.filterEpoch;
  window.applyEpochFilter = window.MuseumCamera.applyEpochFilter;
  window.togglePointerLock = window.MuseumCamera.togglePointerLock;
}
if (window.MuseumHUD) {
  window.toggleDiscoveryDrawer = window.MuseumHUD.toggleDiscoveryDrawer;
  window.toggleCameraRoll = window.MuseumHUD.toggleCameraRoll;
  window.toggleHudCardMinimize = window.MuseumHUD.toggleHudCardMinimize;
  window.triggerShutter = window.MuseumHUD.triggerShutter;
  window.clearCameraRoll = window.MuseumHUD.clearCameraRoll;
  window.deleteRollItem = window.MuseumHUD.deleteRollItem;
  window.downloadAstroPlate = window.MuseumHUD.downloadAstroPlate;
  window.exportDiscoveryLedger = window.MuseumHUD.exportDiscoveryLedger;
  window.clearDiscoveryLedger = window.MuseumHUD.clearDiscoveryLedger;
  window.simulateDiscoveryCandidate = window.MuseumHUD.simulateDiscoveryCandidate;
  window.toggleLODModal = window.MuseumHUD.toggleLODModal;
  window.setLODTier = window.MuseumHUD.setLODTier;
  window.setLODMode = window.MuseumHUD.setLODMode;
  window.updateLODHUD = window.MuseumHUD.updateLODHUD;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootAtlas);
  } else {
    bootAtlas();
  }
}
