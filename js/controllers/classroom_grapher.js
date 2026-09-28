/**
 * 🏛️ ATELIER MATEMÁTICO — CONTROLADOR DE GRAFICADOR CARTESIANO 2D
 * Nai Systems · Arquitectura Modular Desacoplada
 * Estándar: Timonel F2 · Coordenadas Cartesiano-Continuas · Inmunidad XSS
 */

(function(root) {
  'use strict';

  class ClassroomGrapher {
    constructor(controller) {
      this.controller = controller;
      this.graphScale = 32; // píxeles por unidad matemática
      this.graphOriginX = 0;
      this.graphOriginY = 0;
      this.mouseMathX = 0;
      this.mouseMathY = 0;
    }

    init() {
      const canvas = document.getElementById('cartesian-canvas');
      if (!canvas) return;

      const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: 500, height: 320 };
      const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      this.graphOriginX = canvas.width / 2;
      this.graphOriginY = canvas.height / 2;

      // Eventos de mouse para coordenadas interactivas
      canvas.addEventListener('mousemove', (e) => {
        const cRect = canvas.getBoundingClientRect();
        const px = (e.clientX - cRect.left) * (canvas.width / cRect.width);
        const py = (e.clientY - cRect.top) * (canvas.height / cRect.height);

        const currentDpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
        const scale = this.graphScale * currentDpr;

        this.mouseMathX = (px - this.graphOriginX) / scale;
        this.mouseMathY = -(py - this.graphOriginY) / scale;

        const coordsEl = document.getElementById('graph-cursor-coords');
        if (coordsEl) {
          coordsEl.textContent = `X: ${this.mouseMathX.toFixed(2)} | Y: ${this.mouseMathY.toFixed(2)}`;
        }
      });
    }

    render() {
      const canvas = document.getElementById('cartesian-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      const scale = this.graphScale * dpr;

      // 1. Fondo Obsidian de lujo
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, W, H);

      // Centrar ejes
      this.graphOriginX = W / 2;
      this.graphOriginY = H / 2;
      const ox = this.graphOriginX;
      const oy = this.graphOriginY;

      // 2. Rejilla Cartesiana Sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      const xMinMath = -ox / scale;
      const xMaxMath = (W - ox) / scale;
      const yMinMath = -(H - oy) / scale;
      const yMaxMath = oy / scale;

      // Líneas verticales de la rejilla
      const stepGrid = scale < 20 ? 5 : (scale < 40 ? 2 : 1);
      const startX = Math.floor(xMinMath / stepGrid) * stepGrid;
      for (let x = startX; x <= xMaxMath; x += stepGrid) {
        const px = ox + x * scale;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, H);
        ctx.stroke();

        // Etiquetas numéricas
        if (x !== 0 && Math.abs(x) < 50) {
          ctx.fillStyle = '#71717a';
          ctx.font = `${10 * dpr}px 'Space Mono', monospace`;
          ctx.fillText(String(x), px + 3, oy + 12 * dpr);
        }
      }

      // Líneas horizontales de la rejilla
      const startY = Math.floor(yMinMath / stepGrid) * stepGrid;
      for (let y = startY; y <= yMaxMath; y += stepGrid) {
        const py = oy - y * scale;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(W, py);
        ctx.stroke();

        if (y !== 0 && Math.abs(y) < 50) {
          ctx.fillStyle = '#71717a';
          ctx.font = `${10 * dpr}px 'Space Mono', monospace`;
          ctx.fillText(String(y), ox + 4, py - 3);
        }
      }

      // 3. Ejes Principales X e Y
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1.5 * dpr;

      // Eje X
      ctx.beginPath();
      ctx.moveTo(0, oy);
      ctx.lineTo(W, oy);
      ctx.stroke();

      // Eje Y
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, H);
      ctx.stroke();

      // Origen (0,0)
      ctx.fillStyle = '#a1a1aa';
      ctx.font = `${9 * dpr}px 'Space Mono', monospace`;
      ctx.fillText('0', ox - 10 * dpr, oy + 12 * dpr);

      const steps = this.controller ? this.controller.derivationSteps : [];

      // 4. Compilar y graficar la Premisa Inicial (Paso 0) como Guía de Referencia
      const step0Text = steps[0] || '0';
      const fnPremise = this.compileMathExpr(step0Text);

      ctx.save();
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 1.5 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]); // Línea punteada dorada
      this.plotFunctionCurve(ctx, fnPremise, ox, oy, scale, W);
      ctx.restore();

      // 5. Compilar y graficar el Paso Activo
      const activeIdx = Math.min(this.controller ? this.controller.activeStepIdx : 0, Math.max(0, steps.length - 1));
      const activeText = steps[activeIdx] || '0';
      const isSolutionStep = activeText.includes('\\lor') || activeText.includes('x_1') || (activeText.includes('x =') && !activeText.includes('^'));
      const graphText = (isSolutionStep && activeIdx > 0) ? steps[activeIdx - 1] : activeText;
      const fnActive = this.compileMathExpr(graphText);

      // Determinar si el paso activo está certificado por Timonel
      const audit = (typeof window !== 'undefined' && window.TimonelLinter && typeof window.TimonelLinter.auditDerivation === 'function') ?
        window.TimonelLinter.auditDerivation(steps) : [];
      const isCertified = (audit[activeIdx] && audit[activeIdx].valid);

      ctx.save();
      if (activeIdx === 0) {
        ctx.strokeStyle = '#38bdf8'; // Azul premisa
        ctx.lineWidth = 2.5 * dpr;
      } else if (isCertified) {
        ctx.strokeStyle = '#34d399'; // Esmeralda certificado
        ctx.lineWidth = 2.5 * dpr;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.4)';
        ctx.shadowBlur = 8 * dpr;
      } else {
        ctx.strokeStyle = '#f87171'; // Rojo divergente
        ctx.lineWidth = 2.8 * dpr;
        ctx.shadowColor = 'rgba(248, 113, 113, 0.6)';
        ctx.shadowBlur = 12 * dpr;
      }

      this.plotFunctionCurve(ctx, fnActive, ox, oy, scale, W);
      ctx.restore();

      // 6. Detectar y marcar raíces en el paso activo
      let explicitRoots = null;
      if (isSolutionStep && typeof window !== 'undefined' && window.TimonelLinter && window.TimonelLinter.instance) {
        explicitRoots = window.TimonelLinter.instance.extractCandidateRoots(activeText);
      }
      this.findAndMarkRoots(ctx, fnActive, ox, oy, scale, xMinMath, xMaxMath, dpr, explicitRoots);
    }

    compileMathExpr(exprStr) {
      if (!exprStr) return () => 0;
      let clean = exprStr.replace(/\s+/g, '');
      
      // Si contiene signo '=', tomar el lado izquierdo menos el derecho: f(x) = L - R = 0
      if (clean.includes('=')) {
        const parts = clean.split('=');
        clean = `(${parts[0]}) - (${parts[1] || '0'})`;
      }

      // Normalización de expresiones y comandos LaTeX estándar
      clean = clean.replace(/\\cdot/g, '*').replace(/\\times/g, '*');
      clean = clean.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '(($1)/($2))');
      clean = clean.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
      clean = clean.replace(/\\([a-zA-Z]+)/g, '$1');
      clean = clean.replace(/\{/g, '(').replace(/\}/g, ')');

      // Compilación determinista y segura mediante AST con Timonel JIT Compiler
      if (typeof window !== 'undefined' && window.JITMathCompiler && typeof window.JITMathCompiler.compile === 'function') {
        try {
          const compiledFn = window.JITMathCompiler.compile(clean, ['x']);
          return function(x) {
            try {
              const v = compiledFn(x);
              return (typeof v === 'number' && isFinite(v)) ? v : NaN;
            } catch (e) {
              return NaN;
            }
          };
        } catch (err) {
          return () => 0;
        }
      }

      return () => 0;
    }

    plotFunctionCurve(ctx, fn, ox, oy, scale, W) {
      ctx.beginPath();
      let started = false;

      for (let px = 0; px <= W; px += 2) {
        const xMath = (px - ox) / scale;
        const yMath = fn(xMath);

        if (isNaN(yMath) || !isFinite(yMath) || Math.abs(yMath) > 100) {
          started = false;
          continue;
        }

        const py = oy - yMath * scale;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    findAndMarkRoots(ctx, fn, ox, oy, scale, xMin, xMax, dpr, explicitRoots = null) {
      const roots = (Array.isArray(explicitRoots) && explicitRoots.length > 0) ? [...explicitRoots] : [];

      if (roots.length === 0) {
        const numSamples = 200;
        const dx = (xMax - xMin) / numSamples;
        let prevX = xMin;
        let prevY = fn(prevX);

        for (let i = 1; i <= numSamples; i++) {
          const currX = xMin + i * dx;
          const currY = fn(currX);

          if (isFinite(prevY) && isFinite(currY) && (prevY * currY <= 0) && Math.abs(currY - prevY) < 20) {
            let r = (prevX + currX) / 2;
            roots.push(r);
            if (roots.length >= 4) break;
          }
          prevX = currX;
          prevY = currY;
        }
      }

      // Dibujar puntos de raíces en el canvas
      roots.forEach(r => {
        const px = ox + r * scale;
        const py = oy;

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(px, py, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#08080a';
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();
      });

      // Actualizar información en el overlay
      const rootsEl = document.getElementById('graph-roots-info');
      if (rootsEl) {
        if (roots.length > 0) {
          rootsEl.textContent = `Raíces: ${roots.map(r => 'x = ' + (typeof r === 'number' ? r.toFixed(2) : r)).join(', ')}`;
        } else {
          rootsEl.textContent = 'Sin raíces reales visibles';
        }
      }
    }

    zoom(factor) {
      this.graphScale = Math.max(8, Math.min(180, this.graphScale * factor));
      this.render();
    }

    resetView() {
      this.graphScale = 32;
      this.render();
    }
  }

  root.ClassroomGrapher = ClassroomGrapher;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassroomGrapher;
  }
})(typeof window !== 'undefined' ? window : globalThis);
