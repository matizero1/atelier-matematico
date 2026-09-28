/**
 * 🏛️ ATELIER MATEMÁTICO — CONTROLADOR CAS & ÁLGEBRA SIMBÓLICA
 * Nai Systems · Arquitectura Modular Desacoplada
 * Estándar: Timonel CAS en Silicio · Resolución Paso a Paso · Derivada e Integral
 */

(function(root) {
  'use strict';

  class ClassroomCAS {
    constructor(controller) {
      this.controller = controller;
    }

    mathStringToLaTeX(str) {
      if (!str || !str.trim()) return '';
      let s = str.trim();
      s = s.replace(/\*/g, ' \\cdot ');
      s = s.replace(/pi/gi, '\\pi ');
      s = s.replace(/theta/gi, '\\theta ');
      s = s.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
      return s;
    }

    appendCalculatedStep(newStepText) {
      if (!this.controller) return;
      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      
      // Si el paso activo está vacío, reemplazarlo
      if (activeIdx >= 0 && (!c.derivationSteps[activeIdx] || !c.derivationSteps[activeIdx].trim())) {
        c.derivationSteps[activeIdx] = newStepText;
      } else {
        // Insertar después del paso activo o al final
        c.derivationSteps.splice(activeIdx + 1, 0, newStepText);
        c.activeStepIdx = activeIdx + 1;
      }
      c.renderSteps();

      // Foco en el nuevo paso
      setTimeout(() => {
        const input = document.getElementById(`input-step-${c.activeStepIdx}`);
        if (input) input.focus();
      }, 50);

      // Notificar aula P2P
      if (c.currentRole === 'teacher' && typeof window !== 'undefined' && window.RoomSync) {
        window.RoomSync.broadcastStep(c.activeStepIdx, c.derivationSteps[c.activeStepIdx]);
      }
    }

    calculateAutoSolve() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas) {
        if (typeof alert !== 'undefined') alert('Motor Timonel CAS no inicializado.');
        return;
      }

      const c = this.controller;
      if (!c) return;

      const currentExpr = (c.derivationSteps[c.activeStepIdx] && c.derivationSteps[c.activeStepIdx].trim()) 
        ? c.derivationSteps[c.activeStepIdx].trim() 
        : (c.derivationSteps[0] || 'x^2 - 9 = 0');

      const stepsResult = cas.solveStepByStep(currentExpr);
      if (Array.isArray(stepsResult) && stepsResult.length > 0) {
        c.derivationSteps = stepsResult.map(s => s.step);
        c.activeStepIdx = c.derivationSteps.length - 1;
        c.renderSteps();

        if (c.currentRole === 'teacher' && typeof window !== 'undefined' && window.RoomSync) {
          window.RoomSync.broadcastStep(c.activeStepIdx, c.derivationSteps[c.activeStepIdx]);
        }
      }
    }

    calculateFactor() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || 'x^2 - 9';

      const factored = cas.factor(curr);
      if (factored && factored !== curr) {
        this.appendCalculatedStep(factored);
      }
    }

    calculateExpand() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || '(x - 3)*(x + 3)';

      const expanded = cas.expand(curr);
      if (expanded && expanded !== curr) {
        this.appendCalculatedStep(expanded);
      }
    }

    calculateDerivative() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || 'x^3 - 4*x';

      const d = cas.derivative(curr, 'x');
      if (d) {
        this.appendCalculatedStep(d);
      }
    }

    calculateIntegral() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || '3*x^2 - 4';

      const integ = cas.integral(curr, 'x');
      if (integ) {
        this.appendCalculatedStep(integ);
      }
    }

    calculateRoots() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || 'x^2 - 9 = 0';

      const rootsList = cas.roots(curr);
      if (Array.isArray(rootsList) && rootsList.length > 0) {
        let solStr = '';
        if (rootsList.length === 1) {
          solStr = `x = ${rootsList[0]}`;
        } else {
          solStr = rootsList.map((r, i) => `x_${i + 1} = ${r}`).join('  \\lor  ');
        }
        this.appendCalculatedStep(solStr);
      }
    }

    calculateTaylor() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || 'sin(x)';

      const t = cas.taylor(curr, 'x', 0, 4);
      if (t) {
        this.appendCalculatedStep(t);
      }
    }

    calculateLimit() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || 'sin(x)/x';

      const lim = cas.limit(curr, 'x', 0);
      if (lim && Number.isFinite(lim.value)) {
        this.appendCalculatedStep(`${curr} = ${lim.value}`);
      }
    }

    calculateSimplify() {
      const cas = (typeof window !== 'undefined') ? window.TimonelCAS : null;
      if (!cas || !this.controller) return;

      const c = this.controller;
      const activeIdx = Math.min(c.activeStepIdx, c.derivationSteps.length - 1);
      const curr = c.derivationSteps[activeIdx] || c.derivationSteps[0] || 'x + 0';

      const s = cas.simplify(curr);
      if (s && s !== curr) {
        this.appendCalculatedStep(s);
      }
    }
  }

  root.ClassroomCAS = ClassroomCAS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassroomCAS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
