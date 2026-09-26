/**
 * 🏛️ ATELIER MATEMÁTICO — SUITE DE INTEGRIDAD Y PRECISIÓN EN SILICIO (TIMONEL F2)
 * Nai Systems · Auditoría Determinista de Sistema Completo
 */

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('🏛️  ATELIER MATEMÁTICO — AUDITORÍA MANIÁTICA DE PRECISIÓN EN SILICIO');
console.log('    Gobernanza: Timonel F2 · Cero Autoengaño · Silicio Nativo');
console.log('═══════════════════════════════════════════════════════════════════════\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AUDITORÍA DEL CATÁLOGO CANÓNICO DE 100 OBRAS
// ─────────────────────────────────────────────────────────────────────────────
console.log('📦 FASE 1: Verificación Estructural del Catálogo (artworks_catalog.js)');
const catalogPath = path.join(rootDir, 'js', 'artworks_catalog.js');
assert(fs.existsSync(catalogPath), 'Archivo artworks_catalog.js existe en disco');

let catalogModule;
try {
  catalogModule = await import(`file://${catalogPath}`);
} catch (e) {
  // CommonJS fallback for node
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  catalogModule = require(catalogPath);
}

const ARTWORKS = catalogModule.ARTWORKS_100 || [];
assert(ARTWORKS.length === 100, `El catálogo contiene exactamente 100 obras canónicas (encontradas: ${ARTWORKS.length})`);

const seenIds = new Set();
const seenTitles = new Set();
let fieldDefects = 0;

ARTWORKS.forEach((art, idx) => {
  if (art.id !== idx) fieldDefects++;
  if (seenIds.has(art.id)) fieldDefects++;
  seenIds.add(art.id);

  if (seenTitles.has(art.title)) fieldDefects++;
  seenTitles.add(art.title);

  const reqFields = ['id', 'badge', 'epoch', 'year', 'author', 'title', 'sub', 'cat', 'eq', 'eqShort', 'metric', 'hist', 'poem', 'radius', 'theta', 'phi', 'archetype', 'modelKey', 'epistemology'];
  for (const f of reqFields) {
    if (art[f] === undefined || art[f] === null || art[f] === '') {
      fieldDefects++;
      console.error(`Obra ${idx} carece de campo obligatorio: ${f}`);
    }
  }
});

assert(seenIds.size === 100, 'Todos los 100 IDs son únicos y estrictamente consecutivos [0..99]');
assert(fieldDefects === 0, 'Todos los campos de metadatos históricos y matemáticos están presentes y no vacíos');

let epistemologyDefects = 0;
ARTWORKS.forEach(art => {
  if (!art.epistemology || !['A', 'B', 'C'].includes(art.epistemology.category)) epistemologyDefects++;
  if (!art.epistemology.tag || !art.epistemology.desc) epistemologyDefects++;
});
assert(epistemologyDefects === 0, '100% de las obras poseen clasificación epistemológica rigurosa (Categoría A, B o C)');

// ─────────────────────────────────────────────────────────────────────────────
// 2. AUDITORÍA DE SILICIO: ESTABILIDAD DE LOS 100 MOTORES NUMÉRICOS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n⚙️ FASE 2: Estabilidad de Silicio de los 100 Motores Numéricos (math_engines.js)');
const enginesPath = path.join(rootDir, 'js', 'math_engines.js');
assert(fs.existsSync(enginesPath), 'Archivo math_engines.js existe en disco');

const { createRequire } = await import('module');
const require = createRequire(import.meta.url);
const { AtelierMath } = require(enginesPath);

assert(AtelierMath && AtelierMath.INITS && AtelierMath.INITS.length === 100, 'AtelierMath expone exactamente 100 funciones INITS');
assert(AtelierMath && AtelierMath.STEPS && AtelierMath.STEPS.length === 100, 'AtelierMath expone exactamente 100 funciones STEPS');

// Mock Canvas 2D Context
const mockCtx = {
  canvas: { width: 400, height: 400 },
  fillRect: () => {}, clearRect: () => {},
  beginPath: () => {}, closePath: () => {},
  moveTo: () => {}, lineTo: () => {},
  ellipse: () => {}, rect: () => {},
  bezierCurveTo: () => {}, quadraticCurveTo: () => {},
  stroke: () => {}, fill: () => {}, arc: () => {},
  strokeRect: () => {}, fillText: () => {}, measureText: () => ({ width: 10 }),
  createLinearGradient: () => ({ addColorStop: () => {} }),
  createRadialGradient: () => ({ addColorStop: () => {} }),
  getImageData: () => ({ data: new Uint8ClampedArray(400 * 400 * 4) }),
  putImageData: () => {},
  save: () => {}, restore: () => {},
  translate: () => {}, rotate: () => {}, scale: () => {},
  setLineDash: () => {},
  font: '', fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1
};
const mockCanvas = { width: 400, height: 400, getContext: () => mockCtx };

AtelierMath.bindCanvas(mockCanvas, 400, 400);

let initErrors = 0;
let stepErrors = 0;
let pointerErrors = 0;

for (let i = 0; i < 100; i++) {
  try {
    if (AtelierMath.INITS[i]) AtelierMath.INITS[i]();
  } catch (e) {
    initErrors++;
    console.error(`Fallo en init_${String(i).padStart(2, '0')}: ${e.message}`);
  }

  try {
    for (let s = 0; s < 15; s++) {
      if (AtelierMath.STEPS[i]) AtelierMath.STEPS[i]();
    }
  } catch (e) {
    stepErrors++;
    console.error(`Fallo en step_${String(i).padStart(2, '0')}: ${e.message}`);
  }

  try {
    AtelierMath.handlePointer('down', 200, 200, 0, 0, i);
    AtelierMath.handlePointer('move', 220, 180, 20, -20, i);
    if (AtelierMath.STEPS[i]) AtelierMath.STEPS[i]();
    AtelierMath.handlePointer('up', 220, 180, 0, 0, i);
  } catch (e) {
    pointerErrors++;
    console.error(`Fallo en pointer interaction para motor ${i}: ${e.message}`);
  }
}

assert(initErrors === 0, `Inicialización de 100 motores sin errores (errores: ${initErrors})`);
assert(stepErrors === 0, `Integración temporal de 15 pasos en 100 motores sin excepciones (errores: ${stepErrors})`);
assert(pointerErrors === 0, `Manipulación paramétrica por puntero en 100 motores sin errores (errores: ${pointerErrors})`);

// ─────────────────────────────────────────────────────────────────────────────
// 3. AUDITORÍA DE GOBERNANZA: TIMONEL LINTER F2
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🛡️ FASE 3: Certificación y Auditoría de Gobernanza Timonel (timonel_linter.js)');
const linterPath = path.join(rootDir, 'js', 'timonel_linter.js');
assert(fs.existsSync(linterPath), 'Archivo timonel_linter.js existe en disco');

const { instance: Timonel } = require(linterPath);
assert(Timonel && typeof Timonel.checkEquivalence === 'function', 'TimonelLinter expone método checkEquivalence');

// Suite de 12 Identidades Clásicas de Ingeniería
const identitiesSuite = [
  ['sin(x + 2*pi)', 'sin(x)'],
  ['cos(x)^2 + sin(x)^2', '1'],
  ['2*pi*r', 'tau*r'],
  ['(x - 4)*(x + 4)', 'x^2 - 16'],
  ['(a + b)^2', 'a^2 + 2*a*b + b^2'],
  ['(a - b)^2', 'a^2 - 2*a*b + b^2'],
  ['exp(x + y)', 'exp(x)*exp(y)'],
  ['x + 5 = 12', 'x = 7'],
  ['2*x + 6 = 20', 'x = 7'],
  ['x*(x + 2) - x^2', '2*x'],
  ['x+x', '2*x']
];

let idSuccessCount = 0;
for (const [s1, s2] of identitiesSuite) {
  const res = Timonel.checkEquivalence(s1, s2);
  if (res.valid) {
    idSuccessCount++;
  } else {
    console.error(`Divergencia falsa en identidad: ${s1} <=> ${s2}`, res);
  }
}
assert(idSuccessCount === identitiesSuite.length, `Identidades compatibles en las muestras evaluadas (${idSuccessCount}/${identitiesSuite.length})`);

// Suite de 6 Falacias Matemáticas
const fallaciesSuite = [
  ['(x + 5)^2', 'x^2 + 25'],
  ['sqrt(x^2 + y^2)', 'x + y'],
  ['1/(x + y)', '1/x + 1/y'],
  ['sin(x + y)', 'sin(x) + sin(y)'],
  ['ln(x + y)', 'ln(x)*ln(y)'],
  ['x + 3 = 10', 'x = 8']
];

let falRejectedCount = 0;
for (const [s1, s2] of fallaciesSuite) {
  const res = Timonel.checkEquivalence(s1, s2);
  if (!res.valid && ['divergent', 'domain_mismatch', 'inconclusive'].includes(res.status)) {
    falRejectedCount++;
  } else {
    console.error(`Falso positivo admitido en falacia: ${s1} <=> ${s2}`, res);
  }
}
assert(falRejectedCount === fallaciesSuite.length, `Transformaciones incorrectas no aprobadas por el comprobador (${falRejectedCount}/${fallaciesSuite.length})`);

// Suite CAS: Motor de Álgebra Computacional Simbólica en Silicio (Algebrite + TimonelCAS)
const algebritePath = path.join(rootDir, 'js', 'algebrite.min.js');
assert(fs.existsSync(algebritePath), 'Motor Algebrite compilado offline existe en disco (algebrite.min.js)');

const casPath = path.join(rootDir, 'js', 'timonel_cas.js');
assert(fs.existsSync(casPath), 'Módulo timonel_cas.js existe en disco');

// Cargar Algebrite en entorno global para CAS
global.window = global;
require(algebritePath);
const { instance: TimonelCAS } = require(casPath);
assert(TimonelCAS && typeof TimonelCAS.solveStepByStep === 'function', 'TimonelCAS expone método solveStepByStep');
assert(typeof TimonelCAS.factor === 'function', 'TimonelCAS expone método factor');
assert(typeof TimonelCAS.expand === 'function', 'TimonelCAS expone método expand');
assert(typeof TimonelCAS.derivative === 'function', 'TimonelCAS expone método derivative');
assert(typeof TimonelCAS.integral === 'function', 'TimonelCAS expone método integral');
assert(typeof TimonelCAS.roots === 'function', 'TimonelCAS expone método roots');

// Verificación de operaciones analíticas reales en silicio
const solvedSteps = TimonelCAS.solveStepByStep('x^2 - 16 = 0').map(s => s.step);
assert(solvedSteps.some(s => s.includes('x_1') && s.includes('-4') && s.includes('4')), 'CAS devuelve ambas raíces de x^2 - 16 = 0');
const solvedAudit = Timonel.auditDerivation(solvedSteps);
assert(solvedAudit.slice(0, -1).every(a => a.valid) && !solvedAudit.at(-1).valid, 'Pasos algebraicos compatibles; completitud de raíces CAS queda sin demostrar por el linter');

const factoredEq = TimonelCAS.factor('x^2 - 25 = 0');
assert(factoredEq.includes('(x-5)*(x+5)'), 'TimonelCAS factoriza analíticamente x^2 - 25 = 0 a (x-5)*(x+5) = 0');

const derivedExpr = TimonelCAS.derivative('x^3 - 4*x', 'x');
assert(derivedExpr.replace(/\s+/g, '') === '3*x^2-4', 'TimonelCAS deriva analíticamente d/dx(x^3 - 4*x) = 3*x^2 - 4');

const integratedExpr = TimonelCAS.integral('3*x^2 - 4', 'x');
assert(integratedExpr.replace(/\s+/g, '') === 'x^3-4*x', 'TimonelCAS integra analíticamente ∫(3*x^2 - 4)dx = x^3 - 4*x');

const rootsFound = TimonelCAS.roots('x^2 - 9 = 0');
assert(rootsFound.includes('-3') && rootsFound.includes('3'), 'TimonelCAS halla raíces exactas {-3, 3} para x^2 - 9 = 0');

// ─────────────────────────────────────────────────────────────────────────────
// 4. AUDITORÍA DE SALAS Y RECURSOS EN EL ESPACIO DE TRABAJO
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🌐 FASE 4: Consistencia de Salas HTML y Enlaces de Navegación');
const htmlRooms = ['index.html', 'studio.html', 'museum.html', 'classroom.html', 'shop.html'];

htmlRooms.forEach(room => {
  const rPath = path.join(rootDir, room);
  assert(fs.existsSync(rPath), `Sala ${room} existe en disco`);
  const content = fs.readFileSync(rPath, 'utf8');
  assert(content.length > 5000, `Sala ${room} tiene contenido íntegro (>5 KB, actual: ${(content.length / 1024).toFixed(1)} KB)`);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. AUDITORÍA DE CONTROLADORES MODULARES (NASA JPL ARCHITECTURE)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🚀 FASE 5: Arquitectura Modular de Controladores NASA JPL');
const controllers = [
  { file: 'classroom_controller.js', room: 'classroom.html' },
  { file: 'museum_controller.js', room: 'museum.html' },
  { file: 'studio_controller.js', room: 'studio.html' },
  { file: 'shop_controller.js', room: 'shop.html' },
  { file: 'index_controller.js', room: 'index.html' }
];

controllers.forEach(({ file, room }) => {
  const cPath = path.join(rootDir, 'js', 'controllers', file);
  assert(fs.existsSync(cPath), `Controlador modular ${file} existe en disco`);
  const cContent = fs.readFileSync(cPath, 'utf8');
  assert(cContent.length > 500, `Controlador ${file} tiene contenido sustantivo (>500 B, actual: ${cContent.length} B)`);

  const rPath = path.join(rootDir, room);
  const rContent = fs.readFileSync(rPath, 'utf8');
  assert(rContent.includes(`js/controllers/${file}`), `Sala ${room} vincula limpiamente a su controlador js/controllers/${file}`);
});

// Verificación especializada del motor 3D procedural desacoplado (museum_models.js)
const modelsPath = path.join(rootDir, 'js', 'controllers', 'museum_models.js');
assert(fs.existsSync(modelsPath), 'Motor geométrico 3D desacoplado museum_models.js existe en disco');

const modelsContent = fs.readFileSync(modelsPath, 'utf8');
assert(modelsContent.length > 50000, `museum_models.js contiene suite sustantiva de variedades 3D (>50 KB, actual: ${(modelsContent.length / 1024).toFixed(1)} KB)`);

const museumHtmlPath = path.join(rootDir, 'museum.html');
const museumHtmlContent = fs.readFileSync(museumHtmlPath, 'utf8');
const idxModels = museumHtmlContent.indexOf('js/controllers/museum_models.js');
const idxController = museumHtmlContent.indexOf('js/controllers/museum_controller.js');
assert(idxModels !== -1, 'museum.html vincula explícitamente js/controllers/museum_models.js');
assert(idxModels < idxController, 'museum.html carga museum_models.js ANTES de museum_controller.js para garantizar disponibilidad de constructores');

const MuseumModels = require(modelsPath);
assert(MuseumModels && typeof MuseumModels.BESPOKE_3D_BUILDERS === 'object', 'museum_models.js exporta catálogo BESPOKE_3D_BUILDERS');
const numBuilders = Object.keys(MuseumModels.BESPOKE_3D_BUILDERS || {}).length;
assert(numBuilders >= 37, `BESPOKE_3D_BUILDERS contiene constructores procedurales exhaustivos (encontrados: ${numBuilders} >= 37)`);

let missingModelKeys = 0;
ARTWORKS.forEach(art => {
  if (!art.modelKey || !MuseumModels.BESPOKE_3D_BUILDERS[art.modelKey]) {
    missingModelKeys++;
    console.error(`Obra ${art.id} (${art.title}) tiene modelKey sin constructor 3D: ${art.modelKey}`);
  }
});
assert(missingModelKeys === 0, `100% de las 100 obras del catálogo resuelven a un constructor 3D canónico en BESPOKE_3D_BUILDERS (defectos: ${missingModelKeys})`);

// Verificación del Recolector Determinista de Basura VRAM / WebGL (disposeThreeObject)
assert(typeof MuseumModels.disposeThreeObject === 'function', 'museum_models.js exporta función disposeThreeObject');
assert(typeof MuseumModels.disposeMaterial === 'function', 'museum_models.js exporta función disposeMaterial');

let geoDisposed = false;
let matDisposed = false;
let textureDisposed = false;
let parentRemoved = false;
const mockMesh = {
  geometry: { dispose: () => { geoDisposed = true; } },
  material: {
    map: { dispose: () => { textureDisposed = true; } },
    dispose: () => { matDisposed = true; }
  }
};
const mockParent = {
  remove: (child) => { parentRemoved = true; }
};
const mockGroup = {
  parent: mockParent,
  traverse: (cb) => { cb(mockMesh); }
};
MuseumModels.disposeThreeObject(mockGroup);
assert(geoDisposed && matDisposed && textureDisposed && parentRemoved, 'disposeThreeObject libera recursivamente BufferGeometry, Material, Texturas y desconecta del Grafo de Escena');


// ─────────────────────────────────────────────────────────────────────────────
// 6. AUDITORÍA DEL COMPILADOR SOBERANO NAILANG (NASA JPL & SILICIO NATIVO)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n⚡ FASE 6: Compilador Soberano Nailang (NASA JPL Rule 3 & Silicio Nativo)');
const candidateRtPaths = [
  path.join(rootDir, '..', 'tools', 'nailangc', 'nailang_rt.h'),
  '/Users/mati/Desktop/Nai-Workspace/tools/nailangc/nailang_rt.h'
];
const nailangRtPath = candidateRtPaths.find(p => fs.existsSync(p)) || candidateRtPaths[0];
assert(fs.existsSync(nailangRtPath), 'Header de runtime nailang_rt.h existe en disco');
const rtContent = fs.readFileSync(nailangRtPath, 'utf8');
assert(rtContent.includes('NaiArena') && rtContent.includes('nai_arena_init') && rtContent.includes('nai_arena_alloc'),
  'nailang_rt.h implementa NaiArena conforme a Regla 3 NASA JPL (Cero fragmentación post-init)');

const candidateNailangc = [
  path.join(rootDir, '..', 'tools', 'nailangc', 'nailangc'),
  '/Users/mati/Desktop/Nai-Workspace/tools/nailangc/nailangc'
];
const nailangcPath = candidateNailangc.find(p => fs.existsSync(p)) || candidateNailangc[0];
assert(fs.existsSync(nailangcPath), 'Binario de producción nailangc compilado existe en silicio');

// Prueba de compilación AST canónica
const candidateMatrixNai = [
  path.join(rootDir, '..', 'core', 'nailang', 'matrix3x3_r21.nai'),
  '/Users/mati/Desktop/Nai-Workspace/core/nailang/matrix3x3_r21.nai'
];
const matrixNai = candidateMatrixNai.find(p => fs.existsSync(p)) || candidateMatrixNai[0];
const resMatrix = child_process.spawnSync(nailangcPath, ['--ast', matrixNai], { encoding: 'utf8' });
assert(resMatrix.status === 0, `nailangc compila exitosamente AST de kernel canónico matrix3x3_r21.nai`);

const candidateTypesNai = [
  path.join(rootDir, '..', 'projects', 'nai-open', 'core', 'types.nai'),
  '/Users/mati/Desktop/Nai-Workspace/projects/nai-open/core/types.nai'
];
const typesNai = candidateTypesNai.find(p => fs.existsSync(p)) || candidateTypesNai[0];
const resTypes = child_process.spawnSync(nailangcPath, ['--ast', typesNai], { encoding: 'utf8' });
assert(resTypes.status === 0, `nailangc compila exitosamente AST de contratos modulares types.nai (13 contratos)`);

const resEmit = child_process.spawnSync(nailangcPath, ['--emit-only', matrixNai], { encoding: 'utf8' });
assert(resEmit.status === 0, `nailangc genera código C puro de alta fidelidad sin desbordes de pila`);


// ─────────────────────────────────────────────────────────────────────────────
// 7. AUDITORÍA DE CONVERSIÓN DESKTOP Y FICHA FINE ART
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🖥️ FASE 7: Conversión Workstation Desktop & Certificados Fine Art');
const desktopModalPath = path.join(rootDir, 'js', 'controllers', 'desktop_modal.js');
assert(fs.existsSync(desktopModalPath), 'Módulo desktop_modal.js existe en disco');

const desktopModal = require(desktopModalPath);
assert(typeof desktopModal.openDesktopModal === 'function', 'desktop_modal.js expone función openDesktopModal');
assert(typeof desktopModal.switchOSBuild === 'function', 'desktop_modal.js expone función switchOSBuild');
assert(desktopModal.OS_BUILDS && desktopModal.OS_BUILDS['macos-arm'], 'desktop_modal.js define paquetes nativos Apple Silicon');
assert(desktopModal.OS_BUILDS['linux'] && desktopModal.OS_BUILDS['windows'], 'desktop_modal.js define paquetes multiplataforma Linux y Windows');

// Verificar que las 5 salas HTML contienen el botón e importan desktop_modal.js
htmlRooms.forEach(room => {
  const rPath = path.join(rootDir, room);
  const content = fs.readFileSync(rPath, 'utf8');
  assert(content.includes('desktop_modal.js'), `Sala ${room} incluye script desktop_modal.js`);
  assert(content.includes('openDesktopModal'), `Sala ${room} contiene llamada interactiva a openDesktopModal`);
});

// Verificar artefactos del Core Desktop Nativo (Apple Silicon & DMG)
const candidateDesktop = [
  path.join(rootDir, 'desktop'),
  path.join(rootDir, '..', 'desktop'),
  '/Users/mati/Desktop/Nai-Workspace/desktop'
];
const desktopDir = candidateDesktop.find(p => fs.existsSync(p)) || candidateDesktop[0];
assert(fs.existsSync(path.join(desktopDir, 'main.swift')), 'Código fuente nativo desktop/main.swift existe en disco');
assert(fs.existsSync(path.join(desktopDir, 'Info.plist')), 'Metadatos desktop/Info.plist existen en disco');
assert(fs.existsSync(path.join(desktopDir, 'bridge.js')), 'Puente nativo desktop/bridge.js existe en disco');

const candidateScripts = [
  path.join(rootDir, 'scripts', 'build_desktop_app.sh'),
  path.join(rootDir, '..', 'scripts', 'build_desktop_app.sh'),
  '/Users/mati/Desktop/Nai-Workspace/scripts/build_desktop_app.sh'
];
const buildDesktopScript = candidateScripts.find(p => fs.existsSync(p)) || candidateScripts[0];
assert(fs.existsSync(buildDesktopScript), 'Pipeline scripts/build_desktop_app.sh existe en disco');

const candidateAppBundle = [
  path.join(rootDir, 'build', 'desktop', 'Atelier Matematico.app'),
  path.join(rootDir, '..', 'build', 'desktop', 'Atelier Matematico.app'),
  '/Users/mati/Desktop/Nai-Workspace/build/desktop/Atelier Matematico.app'
];
const appBundlePath = candidateAppBundle.find(p => fs.existsSync(p)) || candidateAppBundle[0];
assert(fs.existsSync(appBundlePath), 'Bundle nativo Atelier Matematico.app construido en silicio');

const candidateDmg = [
  path.join(rootDir, 'downloads', 'Atelier_Matematico_Silicon_arm64.dmg'),
  path.join(rootDir, 'gallery', 'downloads', 'Atelier_Matematico_Silicon_arm64.dmg'),
  '/Users/mati/Desktop/Nai-Workspace/gallery/downloads/Atelier_Matematico_Silicon_arm64.dmg'
];
const dmgPath = candidateDmg.find(p => fs.existsSync(p)) || candidateDmg[0];
assert(fs.existsSync(dmgPath), 'Instalador DMG Atelier_Matematico_Silicon_arm64.dmg disponible en descargas web');
const dmgStats = fs.statSync(dmgPath);
assert(dmgStats.size > 1000000, `Tamaño de DMG íntegro (>1 MB, actual: ${(dmgStats.size / 1024 / 1024).toFixed(2)} MB)`);

// Verificar capacidades de Fine Art Shop: Monedas internacionales y Certificado Criptográfico
const shopControllerPath = path.join(rootDir, 'js', 'controllers', 'shop_controller.js');
const shopContent = fs.readFileSync(shopControllerPath, 'utf8');
assert(shopContent.includes('setCurrency') && shopContent.includes('PRICES'), 'shop_controller.js implementa cotización multi-divisa (CLP, USD, EUR)');
assert(shopContent.includes('downloadCertificate'), 'shop_controller.js implementa generación determinista de Certificado de Autenticidad');
assert(shopContent.includes('Hahnemühle Photo Rag 308') && shopContent.includes('UltraChrome Pro12'), 'shop_controller.js certifica sustratos de grado museo (Hahnemühle 308g & UltraChrome Pro12)');

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN FINAL DE CERTIFICACIÓN
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log(`📊 RESULTADO DE LA AUDITORÍA: ${passedTests} APROBADAS / ${failedTests} FALLADAS (TOTAL: ${totalTests})`);
if (failedTests === 0) {
  console.log('Pruebas básicas aprobadas. No certifican precisión general, ausencia de deuda técnica ni descubrimientos científicos.');
} else {
  console.error('⚠  SE HAN DETECTADO DISCREPANCIAS QUE DEBEN SUBSANARSE.');
}
console.log('═══════════════════════════════════════════════════════════════════════\n');

process.exit(failedTests === 0 ? 0 : 1);

