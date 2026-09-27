// ═══════════════════════════════════════════════════════════════════
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
