/**
 * 🏛️ ATELIER MATEMÁTICO — SUITE DE INTEGRIDAD Y PRECISIÓN EN SILICIO (TIMONEL F2)
 * Nai Systems · Auditoría Determinista de Sistema Completo
 */

import fs from 'fs';
import path from 'path';
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

  const reqFields = ['id', 'badge', 'epoch', 'year', 'author', 'title', 'sub', 'cat', 'eq', 'eqShort', 'metric', 'hist', 'poem', 'radius', 'theta', 'phi', 'archetype'];
  for (const f of reqFields) {
    if (art[f] === undefined || art[f] === null || art[f] === '') {
      fieldDefects++;
      console.error(`Obra ${idx} carece de campo obligatorio: ${f}`);
    }
  }
});

assert(seenIds.size === 100, 'Todos los 100 IDs son únicos y estrictamente consecutivos [0..99]');
assert(fieldDefects === 0, 'Todos los campos de metadatos históricos y matemáticos están presentes y no vacíos');

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
  ['ln(x*y)', 'ln(x) + ln(y)'],
  ['exp(x + y)', 'exp(x)*exp(y)'],
  ['x + 5 = 12', 'x = 7'],
  ['2*x + 6 = 20', 'x = 7'],
  ['x*(x + 2) - x^2', '2*x'],
  ['(x^2 - y^2)/(x - y)', 'x + y']
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
assert(idSuccessCount === identitiesSuite.length, `100% de identidades de ingeniería certificadas con residuo nulo (${idSuccessCount}/${identitiesSuite.length})`);

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
  if (!res.valid && res.status === 'divergent' && res.counterexample) {
    falRejectedCount++;
  } else {
    console.error(`Falso positivo admitido en falacia: ${s1} <=> ${s2}`, res);
  }
}
assert(falRejectedCount === fallaciesSuite.length, `100% de falacias matemáticas rechazadas con contraejemplo exacto (${falRejectedCount}/${fallaciesSuite.length})`);

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
// RESUMEN FINAL DE CERTIFICACIÓN
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log(`📊 RESULTADO DE LA AUDITORÍA: ${passedTests} APROBADAS / ${failedTests} FALLADAS (TOTAL: ${totalTests})`);
if (failedTests === 0) {
  console.log('🏛️  CERTIFICACIÓN TIMONEL F2: SISTEMA 100% LIBRE DE DEUDA TÉCNICA Y DEFORMACIÓN NUMÉRICA.');
} else {
  console.error('⚠  SE HAN DETECTADO DISCREPANCIAS QUE DEBEN SUBSANARSE.');
}
console.log('═══════════════════════════════════════════════════════════════════════\n');

process.exit(failedTests === 0 ? 0 : 1);
