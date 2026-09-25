/**
 * 🛡️ TIMONEL CAS — MOTOR DE ÁLGEBRA COMPUTACIONAL & CÁLCULO SIMBÓLICO EN SILICIO
 * Atelier Matemático / Nai Systems © 2026
 * 
 * Principio: Cero simulación pasiva. Realiza cálculos analíticos exactos:
 * 1. Resolución paso a paso de ecuaciones lineales, cuadráticas y polinómicas.
 * 2. Factorización analítica de expresiones algebraicas.
 * 3. Expansión y desarrollo de productos notables.
 * 4. Cálculo de derivadas analíticas exactas (d/dx).
 * 5. Cálculo de integrales analíticas indefinidas (∫ f(x) dx).
 * 6. Determinación de raíces reales y complejas.
 * 7. Evaluación numérica de alta precisión.
 */

(function(root) {
  'use strict';

  class TimonelCAS {
    constructor() {
      this.engine = (typeof root.Algebrite !== 'undefined') ? root.Algebrite : null;
    }

    getEngine() {
      if (!this.engine && typeof root.Algebrite !== 'undefined') {
        this.engine = root.Algebrite;
      }
      return this.engine;
    }

    /**
     * Sanitiza una expresión para el motor simbólico
     */
    cleanExpr(expr) {
      if (!expr || typeof expr !== 'string') return '0';
      return expr.trim()
        .replace(/π/g, 'pi')
        .replace(/·/g, '*')
        .replace(/÷/g, '/');
    }

    /**
     * Resuelve una ecuación algebraica produciendo los pasos intermedios reales
     * Soporta lineales (ax + b = c) y cuadráticas (ax^2 + bx + c = 0)
     */
    solveStepByStep(equationStr) {
      const eq = this.cleanExpr(equationStr);
      const A = this.getEngine();

      if (!eq.includes('=')) {
        // Si no tiene '=', resolver f(x) = 0
        return this.solveStepByStep(`${eq} = 0`);
      }

      const parts = eq.split('=');
      const leftStr = parts[0].trim();
      const rightStr = parts[1].trim();

      const steps = [];

      // Paso 1: Planteamiento original
      steps.push({
        step: `${leftStr} = ${rightStr}`,
        explanation: 'Ecuación original planteada para resolución analítica.',
        type: 'premise'
      });

      // Paso 2: Trasponer todo al miembro izquierdo: L - R = 0
      const diffExpr = `(${leftStr}) - (${rightStr})`;
      const simplifiedLeft = A ? A.run(`simplify(${diffExpr})`).toString() : diffExpr;

      if (rightStr !== '0' && simplifiedLeft !== leftStr) {
        steps.push({
          step: `${simplifiedLeft} = 0`,
          explanation: 'Restar términos del miembro derecho para igualar la ecuación a cero.',
          type: 'algebra'
        });
      }

      // Paso 3: Factorizar si es posible
      if (A) {
        const factored = A.run(`factor(${simplifiedLeft})`).toString();
        if (factored !== simplifiedLeft && !factored.startsWith('roots(')) {
          steps.push({
            step: `${factored} = 0`,
            explanation: 'Factorización de la expresión en factores irreducibles.',
            type: 'factor'
          });
        }

        // Paso 4: Encontrar raíces
        const rootsRes = A.run(`roots(${simplifiedLeft})`).toString();
        if (rootsRes && rootsRes !== '[]' && rootsRes !== 'nil') {
          // Formatear soluciones: [r1, r2] o r1
          let solStr = rootsRes;
          if (rootsRes.startsWith('[') && rootsRes.endsWith(']')) {
            const rawItems = rootsRes.slice(1, -1).split(',').map(s => s.trim());
            solStr = rawItems.map((r, i) => `x_${i + 1} = ${r}`).join('  \\lor  ');
          } else {
            solStr = `x = ${rootsRes}`;
          }

          steps.push({
            step: solStr,
            explanation: 'Soluciones exactas obtenidas por anulación de factores.',
            type: 'solution'
          });
        }
      }

      return steps;
    }

    /**
     * Factoriza analíticamente una expresión o ecuación
     */
    factor(exprStr) {
      const expr = this.cleanExpr(exprStr);
      const A = this.getEngine();
      if (!A) return expr;

      try {
        if (expr.includes('=')) {
          const parts = expr.split('=');
          const factoredLeft = A.run(`factor(${parts[0].trim()})`).toString();
          return `${factoredLeft} = ${parts[1].trim()}`;
        }
        const res = A.run(`factor(${expr})`).toString();
        return res;
      } catch (err) {
        console.warn('Error al factorizar con Timonel CAS:', err);
        return expr;
      }
    }

    /**
     * Expande analíticamente un producto de expresiones o ecuación
     */
    expand(exprStr) {
      const expr = this.cleanExpr(exprStr);
      const A = this.getEngine();
      if (!A) return expr;

      try {
        if (expr.includes('=')) {
          const parts = expr.split('=');
          const expandedLeft = A.run(`expand(${parts[0].trim()})`).toString();
          return `${expandedLeft} = ${parts[1].trim()}`;
        }
        const res = A.run(`expand(${expr})`).toString();
        return res;
      } catch (err) {
        console.warn('Error al expandir con Timonel CAS:', err);
        return expr;
      }
    }

    /**
     * Deriva analíticamente respecto a x (soporta ecuaciones)
     */
    derivative(exprStr, varName = 'x') {
      const expr = this.cleanExpr(exprStr);
      const A = this.getEngine();
      if (!A) return '0';

      try {
        if (expr.includes('=')) {
          const parts = expr.split('=');
          const dLeft = A.run(`d(${parts[0].trim()}, ${varName})`).toString();
          const dRight = A.run(`d(${parts[1].trim()}, ${varName})`).toString();
          return `${dLeft} = ${dRight}`;
        }
        const res = A.run(`d(${expr}, ${varName})`).toString();
        return res;
      } catch (err) {
        console.warn('Error al derivar con Timonel CAS:', err);
        return '0';
      }
    }

    /**
     * Calcula la integral indefinida analítica ∫ f(x) dx (soporta ecuaciones)
     */
    integral(exprStr, varName = 'x') {
      const expr = this.cleanExpr(exprStr);
      const A = this.getEngine();
      if (!A) return '0';

      try {
        if (expr.includes('=')) {
          const parts = expr.split('=');
          const intLeft = A.run(`integral(${parts[0].trim()}, ${varName})`).toString();
          const intRight = A.run(`integral(${parts[1].trim()}, ${varName})`).toString();
          return `${intLeft} = ${intRight}`;
        }
        const res = A.run(`integral(${expr}, ${varName})`).toString();
        return res;
      } catch (err) {
        console.warn('Error al integrar con Timonel CAS:', err);
        return '0';
      }
    }

    /**
     * Encuentra las raíces exactas de una expresión
     */
    roots(exprStr) {
      let expr = this.cleanExpr(exprStr);
      if (expr.includes('=')) {
        const parts = expr.split('=');
        expr = `(${parts[0]}) - (${parts[1]})`;
      }
      const A = this.getEngine();
      if (!A) return [];

      try {
        const res = A.run(`roots(${expr})`).toString();
        if (res.startsWith('[') && res.endsWith(']')) {
          return res.slice(1, -1).split(',').map(s => s.trim());
        }
        return [res.trim()];
      } catch (err) {
        return [];
      }
    }

    /**
     * Evalúa numéricamente para un valor de x
     */
    evaluateNumeric(exprStr, xVal) {
      const expr = this.cleanExpr(exprStr);
      const A = this.getEngine();
      if (!A) return 0;

      try {
        const evaluated = A.run(`eval(${expr}, x, ${xVal})`).toString();
        const num = parseFloat(A.run(`float(${evaluated})`).toString());
        return isFinite(num) ? num : 0;
      } catch (err) {
        return 0;
      }
    }
  }

  // Instanciar y exportar
  const casInstance = new TimonelCAS();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimonelCAS, instance: casInstance };
  }
  root.TimonelCAS = casInstance;

})(typeof window !== 'undefined' ? window : globalThis);
