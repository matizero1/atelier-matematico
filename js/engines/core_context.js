// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — CONTEXTO CENTRAL DE SILICIO (CORE CONTEXT)
// Gestión de Canvas 2D, Paletas Cromáticas y Sincronización de Viewport
// Gobernanza: Timonel F2 | Cero Falsas Aproximaciones
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  'use strict';

  let canvas = null;
  let ctx = null;
  let W = 1024, H = 1448;
  let currentPal = 0;
  let mouseX = -9999, mouseY = -9999, mouseDown = false;
  let isDrag = false, dragX = 0, dragY = 0;

  const registeredEpochs = new Map();

  // ── Paletas cromáticas ───────────────────────────────────────────
  function hsl2rgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (!s) { r = g = b = l; }
    else {
      const q = l < .5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
      const hue = (p, q, t) => {
        if(t<0)t+=1; if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
      };
      r=hue(p,q,h+1/3); g=hue(p,q,h); b=hue(p,q,h-1/3);
    }
    return [r*255|0, g*255|0, b*255|0];
  }

  const PALS_RGB = [
    f => hsl2rgb(250-f*210, 90, 45+f*35),
    f => [f*40|0, 120+f*135|0, Math.max(0,200-f*50)|0],
    f => [Math.min(255,60+f*220)|0, Math.min(255,f>.6?(f-.6)*450:20)|0, f<.3?180:20],
    f => [220+f*35|0, 180+f*70|0, 120+f*135|0],
  ];

  const PALS_CSS = [
    f => `hsla(${250-f*210},90%,${45+f*35}%,${.08+f*.7})`,
    f => `rgba(${f*40|0},${120+f*135|0},${Math.max(0,200-f*50)|0},${.08+f*.7})`,
    f => `rgba(${Math.min(255,60+f*220)|0},${Math.min(255,f>.6?(f-.6)*450:20)|0},${f<.3?180:20},${.08+f*.75})`,
    f => `rgba(${220+f*35|0},${180+f*70|0},${120+f*135|0},${.08+f*.65})`,
  ];

  function trailFade(alpha = 0.06) {
    if (!ctx) return;
    ctx.fillStyle = `rgba(8, 8, 10, ${alpha})`;
    ctx.fillRect(0, 0, W, H);
  }

  function notifyViewport() {
    registeredEpochs.forEach(epochMod => {
      if (typeof epochMod.updateViewport === 'function') {
        epochMod.updateViewport(W, H, ctx, currentPal, PALS_CSS, PALS_RGB);
      }
      if (typeof epochMod.updatePointer === 'function') {
        epochMod.updatePointer(mouseX, mouseY, mouseDown, isDrag, dragX, dragY);
      }
    });
  }

  function bindCanvas(c, width, height) {
    canvas = c;
    if (canvas && typeof canvas.getContext === 'function') {
      ctx = canvas.getContext('2d');
    } else {
      ctx = null;
    }
    if (width && height) {
      if (canvas) { canvas.width = width; canvas.height = height; }
      W = width;
      H = height;
    } else if (canvas && canvas.parentElement) {
      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width | 0;
      H = canvas.height = (r.height - 8) | 0;
    } else if (canvas) {
      W = canvas.width;
      H = canvas.height;
    }
    notifyViewport();
  }

  function resize(width, height) {
    if (width && height) {
      if (canvas) { canvas.width = width; canvas.height = height; }
      W = width;
      H = height;
    } else if (canvas && canvas.parentElement) {
      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width | 0;
      H = canvas.height = (r.height - 8) | 0;
    }
    notifyViewport();
  }

  function setPalette(pal) {
    currentPal = (pal % 4 + 4) % 4;
    notifyViewport();
  }

  function getPalette() {
    return currentPal;
  }

  function registerEpoch(epochModule) {
    if (!epochModule || typeof epochModule.epoch !== 'number') return;
    registeredEpochs.set(epochModule.epoch, epochModule);
    if (typeof epochModule.updateViewport === 'function') {
      epochModule.updateViewport(W, H, ctx, currentPal, PALS_CSS, PALS_RGB);
    }
    if (typeof epochModule.updatePointer === 'function') {
      epochModule.updatePointer(mouseX, mouseY, mouseDown, isDrag, dragX, dragY);
    }
  }

  function getEpoch(epochId) {
    return registeredEpochs.get(epochId);
  }

  function handlePointer(type, x, y, dx, dy, artIdx) {
    mouseX = x; mouseY = y;
    if (type === 'down') {
      isDrag = true; dragX = x; dragY = y; mouseDown = true;
    } else if (type === 'up') {
      isDrag = false; mouseDown = false;
    }

    registeredEpochs.forEach(epochMod => {
      if (typeof epochMod.updatePointer === 'function') {
        epochMod.updatePointer(mouseX, mouseY, mouseDown, isDrag, dragX, dragY);
      }
    });

    // Delegar al módulo de época correspondiente según artIdx
    if (typeof artIdx === 'number') {
      const epochId = Math.floor(artIdx / 20) + 1;
      const mod = registeredEpochs.get(epochId);
      if (mod && typeof mod.handlePointer === 'function') {
        mod.handlePointer(type, x, y, dx, dy, artIdx, { isDrag, dragX, dragY, mouseDown, W, H });
      }
    }
  }

  const CoreContext = {
    get canvas() { return canvas; },
    get ctx() { return ctx; },
    get W() { return W; },
    get H() { return H; },
    get currentPal() { return currentPal; },
    get mouseX() { return mouseX; },
    get mouseY() { return mouseY; },
    get mouseDown() { return mouseDown; },
    get isDrag() { return isDrag; },
    get dragX() { return dragX; },
    get dragY() { return dragY; },
    PALS_RGB,
    PALS_CSS,
    hsl2rgb,
    trailFade,
    bindCanvas,
    resize,
    setPalette,
    getPalette,
    registerEpoch,
    getEpoch,
    notifyViewport,
    handlePointer
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CoreContext, PALS_RGB, PALS_CSS, hsl2rgb, trailFade };
  }
  if (typeof root !== 'undefined') {
    root.AtelierMathCore = CoreContext;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
