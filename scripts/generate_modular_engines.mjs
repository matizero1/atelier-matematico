import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const mathEnginesPath = path.join(rootDir, 'js', 'math_engines.js');
const enginesDir = path.join(rootDir, 'js', 'engines');

const src = fs.readFileSync(mathEnginesPath, 'utf8');
const lines = src.split('\n');

const epochs = [
  {
    epoch: 1,
    name: 'Antigüedad & Fundamentos Clásicos',
    fileName: 'epoch1_ancient.js',
    startLine: 62, // index in lines: line 63
    endLine: 922,  // index in lines: line 922 (inclusive)
    startIdx: 0,
    endIdx: 19,
    extraMethods: '',
    pointerHandler: `  function handlePointer(type, x, y, dx, dy, artIdx, meta) {}`
  },
  {
    epoch: 2,
    name: 'La Ilustración, Ondas & Análisis Clásico',
    fileName: 'epoch2_classical.js',
    startLine: 924,
    endLine: 1824,
    startIdx: 20,
    endIdx: 39,
    extraMethods: `
  function setChladniModes(m, n) {
    chM = Math.max(1, Math.min(8, m));
    chN = Math.max(1, Math.min(8, n));
  }
  function getChladniModes() {
    return { m: chM, n: chN };
  }`,
    pointerHandler: `  function handlePointer(type, x, y, dx, dy, artIdx, meta) {
    if (artIdx === 26 && type === 'move') {
      chM = Math.max(1, Math.min(8, Math.floor((x / W) * 8) + 1));
      chN = Math.max(1, Math.min(8, Math.floor((y / H) * 8) + 1));
    }
  }`
  },
  {
    epoch: 3,
    name: 'Termodinámica, Campos & Espacio-Tiempo',
    fileName: 'epoch3_field.js',
    startLine: 1826,
    endLine: 2558,
    startIdx: 40,
    endIdx: 59,
    extraMethods: '',
    pointerHandler: `  function handlePointer(type, x, y, dx, dy, artIdx, meta) {
    if (meta && meta.isDrag && artIdx === 50) {
      rieRot += dx * 0.005;
    }
  }`
  },
  {
    epoch: 4,
    name: 'Relatividad & Cuántica',
    fileName: 'epoch4_quantum.js',
    startLine: 2560,
    endLine: 3288,
    startIdx: 60,
    endIdx: 79,
    extraMethods: '',
    pointerHandler: `  function handlePointer(type, x, y, dx, dy, artIdx, meta) {}`
  },
  {
    epoch: 5,
    name: 'Caos, Computación & Fronteras Modernas',
    fileName: 'epoch5_modern.js',
    startLine: 3290,
    endLine: 4021,
    startIdx: 80,
    endIdx: 99,
    extraMethods: '',
    pointerHandler: `  function handlePointer(type, x, y, dx, dy, artIdx, meta) {
    if (type === 'down' && artIdx === 84) {
      tAgents.push({ x, y, angle: Math.random() * Math.PI * 2, sp: 1.2, pts: [] });
    }
    if (meta && meta.isDrag) {
      if (artIdx === 86 || artIdx === 87) {
        lRotZ += dx * 0.005;
        lRotX += dy * 0.005;
      }
      if (artIdx === 97) {
        ricciAngle += dx * 0.005;
      }
    }
  }`
  }
];

if (!fs.existsSync(enginesDir)) {
  fs.mkdirSync(enginesDir, { recursive: true });
}

epochs.forEach(ep => {
  const codeSlice = lines.slice(ep.startLine, ep.endLine).join('\n');
  const initsList = [];
  const stepsList = [];
  for (let i = ep.startIdx; i <= ep.endIdx; i++) {
    const pad = String(i).padStart(2, '0');
    initsList.push(`init_${pad}`);
    stepsList.push(`step_${pad}`);
  }

  const exportPrefix = `AtelierEpoch${ep.epoch}`;

  const fileContent = `// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — ÉPOCA ${ep.epoch}: ${ep.name.toUpperCase()}
// Obras ${String(ep.startIdx).padStart(3, '0')} a ${String(ep.endIdx).padStart(3, '0')} · Simulación en Silicio Nativo 60 FPS
// Gobernanza: Timonel F2 | Aislamiento Modular de Estado
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  'use strict';

  let ctx = null;
  let W = 1024, H = 1448;
  let currentPal = 0;
  let mouseX = -9999, mouseY = -9999, mouseDown = false;
  let isDrag = false, dragX = 0, dragY = 0;

  let PALS_CSS = [
    f => \`hsla(\${250-f*210},90%,\${45+f*35}%,\${.08+f*.7})\`,
    f => \`rgba(\${f*40|0},\${120+f*135|0},\${Math.max(0,200-f*50)|0},\${.08+f*.7})\`,
    f => \`rgba(\${Math.min(255,60+f*220)|0},\${Math.min(255,f>.6?(f-.6)*450:20)|0},\${f<.3?180:20},\${.08+f*.75})\`,
    f => \`rgba(\${220+f*35|0},\${180+f*70|0},\${120+f*135|0},\${.08+f*.65})\`,
  ];
  let PALS_RGB = [];

  function trailFade(alpha = 0.06) {
    if (!ctx) return;
    ctx.fillStyle = \`rgba(8, 8, 10, \${alpha})\`;
    ctx.fillRect(0, 0, W, H);
  }

  function updateViewport(w, h, newCtx, pal, palsCss, palsRgb) {
    W = w;
    H = h;
    if (newCtx) ctx = newCtx;
    if (pal !== undefined) currentPal = pal;
    if (palsCss) PALS_CSS = palsCss;
    if (palsRgb) PALS_RGB = palsRgb;
  }

  function updatePointer(x, y, down, drag, dx, dy) {
    mouseX = x; mouseY = y; mouseDown = down; isDrag = drag;
    if (dx !== undefined) dragX = dx;
    if (dy !== undefined) dragY = dy;
  }

${codeSlice}
${ep.extraMethods}
${ep.pointerHandler}

  const inits = [
    ${initsList.join(',\n    ')}
  ];

  const steps = [
    ${stepsList.join(',\n    ')}
  ];

  const initsMap = {};
  const stepsMap = {};
  for (let i = 0; i < 20; i++) {
    const globalId = ${ep.startIdx} + i;
    initsMap[globalId] = inits[i];
    stepsMap[globalId] = steps[i];
  }

  const epochModule = {
    epoch: ${ep.epoch},
    name: "${ep.name}",
    range: [${ep.startIdx}, ${ep.endIdx}],
    inits,
    steps,
    initsMap,
    stepsMap,
    updateViewport,
    updatePointer,
    handlePointer${ep.extraMethods ? ',\n    setChladniModes,\n    getChladniModes' : ''}
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { epochModule, inits, steps, initsMap, stepsMap, updateViewport, updatePointer };
  }
  if (typeof root !== 'undefined') {
    root.${exportPrefix} = epochModule;
    if (root.AtelierMathCore && typeof root.AtelierMathCore.registerEpoch === 'function') {
      root.AtelierMathCore.registerEpoch(epochModule);
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
`;

  const outPath = path.join(enginesDir, ep.fileName);
  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log(`✓ Generado ${ep.fileName} (${initsList.length} inits, ${stepsList.length} steps)`);
});

// Generar index.js (Punto de entrada ES6)
const indexContent = `// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — SISTEMA MODULAR DE MOTORES EN SILICIO
// Punto de entrada formal ES6 (import / export)
// Gobernanza: Timonel F2 | Cero Falsas Aproximaciones
// ═══════════════════════════════════════════════════════════════════

export { CoreContext, PALS_RGB, PALS_CSS, hsl2rgb, trailFade } from './core_context.js';
export { epochModule as Epoch1 } from './epoch1_ancient.js';
export { epochModule as Epoch2 } from './epoch2_classical.js';
export { epochModule as Epoch3 } from './epoch3_field.js';
export { epochModule as Epoch4 } from './epoch4_quantum.js';
export { epochModule as Epoch5 } from './epoch5_modern.js';

import { CoreContext } from './core_context.js';
import { epochModule as Epoch1 } from './epoch1_ancient.js';
import { epochModule as Epoch2 } from './epoch2_classical.js';
import { epochModule as Epoch3 } from './epoch3_field.js';
import { epochModule as Epoch4 } from './epoch4_quantum.js';
import { epochModule as Epoch5 } from './epoch5_modern.js';

// Registrar automáticamente las 5 épocas en el contexto central
CoreContext.registerEpoch(Epoch1);
CoreContext.registerEpoch(Epoch2);
CoreContext.registerEpoch(Epoch3);
CoreContext.registerEpoch(Epoch4);
CoreContext.registerEpoch(Epoch5);

export const INITS_100 = [
  ...Epoch1.inits,
  ...Epoch2.inits,
  ...Epoch3.inits,
  ...Epoch4.inits,
  ...Epoch5.inits
];

export const STEPS_100 = [
  ...Epoch1.steps,
  ...Epoch2.steps,
  ...Epoch3.steps,
  ...Epoch4.steps,
  ...Epoch5.steps
];
`;

fs.writeFileSync(path.join(enginesDir, 'index.js'), indexContent, 'utf8');
console.log('✓ Generado index.js (Punto de entrada ES6)');
