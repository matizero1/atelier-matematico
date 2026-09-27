// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — FACHADA DE MOTORES MATEMÁTICOS EN SILICIO
// Orquestador Unificado de 100 Leyes Físicas y Ecuaciones del Cosmos
// Gobernanza: Timonel F2 | Arquitectura Modular Desacoplada
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  'use strict';

  let Core = root.AtelierMathCore;
  let Ep1 = root.AtelierEpoch1;
  let Ep2 = root.AtelierEpoch2;
  let Ep3 = root.AtelierEpoch3;
  let Ep4 = root.AtelierEpoch4;
  let Ep5 = root.AtelierEpoch5;

  // Entorno CommonJS / Node.js
  if (typeof module !== 'undefined' && module.exports) {
    const coreMod = require('./engines/core_context.js');
    Core = coreMod.CoreContext;
    Ep1 = require('./engines/epoch1_ancient.js').epochModule;
    Ep2 = require('./engines/epoch2_classical.js').epochModule;
    Ep3 = require('./engines/epoch3_field.js').epochModule;
    Ep4 = require('./engines/epoch4_quantum.js').epochModule;
    Ep5 = require('./engines/epoch5_modern.js').epochModule;
  }

  if (Core) {
    if (Ep1) Core.registerEpoch(Ep1);
    if (Ep2) Core.registerEpoch(Ep2);
    if (Ep3) Core.registerEpoch(Ep3);
    if (Ep4) Core.registerEpoch(Ep4);
    if (Ep5) Core.registerEpoch(Ep5);
  }

  // Construir arrays canónicos indexados de 0 a 99
  const INITS = new Array(100);
  const STEPS = new Array(100);

  const epochs = [Ep1, Ep2, Ep3, Ep4, Ep5].filter(Boolean);
  epochs.forEach(ep => {
    if (ep.inits && Array.isArray(ep.inits)) {
      const [start] = ep.range;
      for (let i = 0; i < ep.inits.length; i++) {
        INITS[start + i] = ep.inits[i];
        STEPS[start + i] = ep.steps[i];
      }
    }
  });

  const MASTER_ARTWORKS = (typeof window !== 'undefined' && window.ARTWORKS_100)
    ? window.ARTWORKS_100
    : (root.ARTWORKS_100 || []);

  const AtelierMath = {
    ARTWORKS: MASTER_ARTWORKS,
    INITS: INITS,
    STEPS: STEPS,
    bindCanvas: function(c, width, height) {
      if (Core) Core.bindCanvas(c, width, height);
    },
    resize: function(width, height) {
      if (Core) Core.resize(width, height);
    },
    init: function(idx) {
      if (Core && Core.ctx && Core.W > 0 && Core.H > 0) {
        Core.ctx.fillStyle = '#08080a';
        Core.ctx.fillRect(0, 0, Core.W, Core.H);
      }
      if (idx >= 0 && idx < 100 && INITS[idx]) {
        INITS[idx]();
      }
    },
    step: function(idx) {
      if (idx >= 0 && idx < 100 && STEPS[idx]) {
        STEPS[idx]();
      }
    },
    setPalette: function(pal) {
      if (Core) Core.setPalette(pal);
    },
    getPalette: function() {
      return Core ? Core.getPalette() : 0;
    },
    setChladniModes: function(m, n) {
      if (Ep2 && typeof Ep2.setChladniModes === 'function') {
        Ep2.setChladniModes(m, n);
      }
    },
    getChladniModes: function() {
      if (Ep2 && typeof Ep2.getChladniModes === 'function') {
        return Ep2.getChladniModes();
      }
      return { m: 3, n: 5 };
    },
    handlePointer: function(type, x, y, dx, dy, artIdx) {
      if (Core) Core.handlePointer(type, x, y, dx, dy, artIdx);
    },
    getEpochModule: function(epochId) {
      return Core ? Core.getEpoch(epochId) : undefined;
    }
  };

  root.AtelierMath = AtelierMath;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AtelierMath };
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
