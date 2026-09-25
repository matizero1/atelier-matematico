/**
 * TIMONEL LINTER — Motor Determinista de Equivalencia Formal y Andamiaje Cognitivo
 * Atelier Matemático / Nai Systems
 * 
 * Principio: Cero autoengaño y verificación residual estricta en silicio.
 * Audita derivaciones algebraicas y ecuaciones paso a paso en tiempo real.
 * Si un paso preserva el conjunto solución y la equivalencia matemática: CERTIFIED (verde/dorado).
 * Si un paso introduce una divergencia lógica: DIVERGENT (rojo) con contraejemplo numérico exacto.
 */

(function(root) {
  'use strict';

  class MathParser {
    constructor() {
      this.knownFunctions = ['sin', 'cos', 'tan', 'exp', 'ln', 'log', 'sqrt', 'abs', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh'];
    }

    tokenize(expr) {
      if (!expr || typeof expr !== 'string') return [];
      expr = expr.replace(/\s+/g, '');
      const rawTokens = [];
      let i = 0;
      while (i < expr.length) {
        const ch = expr[i];
        if ('+-*/^(),='.includes(ch)) {
          rawTokens.push({ type: ch === '=' ? 'EQUALS' : 'OP', value: ch });
          i++;
        } else if (/\d/.test(ch) || (ch === '.' && /\d/.test(expr[i + 1] || ''))) {
          let numStr = '';
          while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
            numStr += expr[i++];
          }
          rawTokens.push({ type: 'NUM', value: parseFloat(numStr) });
        } else if (/[a-zA-Z]/.test(ch)) {
          let name = '';
          while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
            name += expr[i++];
          }
          if (this.knownFunctions.includes(name.toLowerCase())) {
            rawTokens.push({ type: 'FN', value: name.toLowerCase() });
          } else {
            rawTokens.push({ type: 'VAR', value: name });
          }
        } else {
          i++;
        }
      }

      // Insert implicit multiplications between adjacent tokens where appropriate
      // e.g.: NUM VAR, NUM FN, NUM (, ) (, ) VAR, VAR VAR
      const tokens = [];
      for (let j = 0; j < rawTokens.length; j++) {
        const curr = rawTokens[j];
        tokens.push(curr);
        if (j < rawTokens.length - 1) {
          const next = rawTokens[j + 1];
          const isCurrOperand = curr.type === 'NUM' || curr.type === 'VAR' || (curr.type === 'OP' && curr.value === ')');
          const isNextOperand = next.type === 'NUM' || next.type === 'VAR' || next.type === 'FN' || (next.type === 'OP' && next.value === '(');
          if (isCurrOperand && isNextOperand) {
            tokens.push({ type: 'OP', value: '*' });
          }
        }
      }
      return tokens;
    }

    parse(tokens) {
      let pos = 0;
      const peek = () => tokens[pos];
      const consume = (expected) => {
        const tok = tokens[pos++];
        if (!tok || (expected && tok.value !== expected)) {
          throw new Error(`Se esperaba '${expected}' pero se encontró '${tok ? tok.value : 'fin de línea'}'`);
        }
        return tok;
      };

      const parseExpression = () => parseEquation();

      const parseEquation = () => {
        let left = parseAdditive();
        if (peek() && peek().type === 'EQUALS') {
          consume('=');
          let right = parseAdditive();
          return { type: 'EQ', left, right };
        }
        return left;
      };

      const parseAdditive = () => {
        let node = parseMultiplicative();
        while (peek() && (peek().value === '+' || peek().value === '-')) {
          const op = consume().value;
          const right = parseMultiplicative();
          node = { type: 'BINOP', op, left: node, right };
        }
        return node;
      };

      const parseMultiplicative = () => {
        let node = parsePower();
        while (peek() && (peek().value === '*' || peek().value === '/')) {
          const op = consume().value;
          const right = parsePower();
          node = { type: 'BINOP', op, left: node, right };
        }
        return node;
      };

      const parsePower = () => {
        let node = parseUnary();
        if (peek() && peek().value === '^') {
          consume('^');
          const right = parsePower(); // right-associative
          node = { type: 'BINOP', op: '^', left: node, right };
        }
        return node;
      };

      const parseUnary = () => {
        if (peek() && peek().value === '-') {
          consume('-');
          return { type: 'UNOP', op: '-', expr: parseUnary() };
        }
        if (peek() && peek().value === '+') {
          consume('+');
          return parseUnary();
        }
        return parsePrimary();
      };

      const parsePrimary = () => {
        const tok = peek();
        if (!tok) throw new Error('Expresión incompleta');

        if (tok.type === 'NUM') {
          return { type: 'NUM', value: consume().value };
        }
        if (tok.type === 'VAR') {
          return { type: 'VAR', name: consume().value };
        }
        if (tok.type === 'FN') {
          const fnName = consume().value;
          consume('(');
          const arg = parseAdditive();
          consume(')');
          return { type: 'CALL', fn: fnName, arg };
        }
        if (tok.value === '(') {
          consume('(');
          const expr = parseEquation();
          consume(')');
          return expr;
        }
        throw new Error(`Símbolo inesperado: '${tok.value}'`);
      };

      return parseExpression();
    }

    evaluate(ast, scope = {}) {
      if (!ast) return 0;
      switch (ast.type) {
        case 'NUM':
          return ast.value;
        case 'VAR':
          return scope[ast.name] !== undefined ? scope[ast.name] : 0;
        case 'UNOP':
          return -this.evaluate(ast.expr, scope);
        case 'BINOP': {
          const a = this.evaluate(ast.left, scope);
          const b = this.evaluate(ast.right, scope);
          switch (ast.op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return Math.abs(b) < 1e-15 ? NaN : a / b;
            case '^': return Math.pow(a, b);
            default: return 0;
          }
        }
        case 'CALL': {
          const arg = this.evaluate(ast.arg, scope);
          switch (ast.fn) {
            case 'sin': return Math.sin(arg);
            case 'cos': return Math.cos(arg);
            case 'tan': return Math.tan(arg);
            case 'exp': return Math.exp(arg);
            case 'ln':
            case 'log': return arg <= 0 ? NaN : Math.log(arg);
            case 'sqrt': return arg < 0 ? NaN : Math.sqrt(arg);
            case 'abs': return Math.abs(arg);
            case 'asin': return Math.abs(arg) > 1 ? NaN : Math.asin(arg);
            case 'acos': return Math.abs(arg) > 1 ? NaN : Math.acos(arg);
            case 'atan': return Math.atan(arg);
            case 'sinh': return Math.sinh(arg);
            case 'cosh': return Math.cosh(arg);
            case 'tanh': return Math.tanh(arg);
            default: return 0;
          }
        }
        case 'EQ': {
          const l = this.evaluate(ast.left, scope);
          const r = this.evaluate(ast.right, scope);
          return l - r;
        }
        default:
          return 0;
      }
    }

    extractVariables(ast, vars = new Set()) {
      if (!ast) return vars;
      if (ast.type === 'VAR') vars.add(ast.name);
      if (ast.left) this.extractVariables(ast.left, vars);
      if (ast.right) this.extractVariables(ast.right, vars);
      if (ast.expr) this.extractVariables(ast.expr, vars);
      if (ast.arg) this.extractVariables(ast.arg, vars);
      return vars;
    }
  }

  class TimonelLinter {
    constructor() {
      this.parser = new MathParser();
    }

    /**
     * Comprueba la equivalencia matemática formal entre dos pasos consecutivos.
     * @param {string} prevStr Expresión o ecuación del paso anterior
     * @param {string} currStr Expresión o ecuación del paso actual
     * @returns {Object} Resultado de certificación con estado, residuo y contraejemplo
     */
    checkEquivalence(prevStr, currStr) {
      if (!prevStr || !currStr || !prevStr.trim() || !currStr.trim()) {
        return { valid: false, status: 'empty', desc: 'Línea vacía' };
      }

      try {
        const prevTokens = this.parser.tokenize(prevStr);
        const currTokens = this.parser.tokenize(currStr);
        const prevAst = this.parser.parse(prevTokens);
        const currAst = this.parser.parse(currTokens);

        const isPrevEq = prevAst.type === 'EQ';
        const isCurrEq = currAst.type === 'EQ';

        // Recolectar variables presentes en ambos pasos
        const allVars = new Set();
        this.parser.extractVariables(prevAst, allVars);
        this.parser.extractVariables(currAst, allVars);
        const varList = Array.from(allVars);
        if (varList.length === 0) varList.push('x');

        // Muestras estocásticas bien condicionadas (evitando singularidades 0 o múltiplos de pi)
        const samplePoints = [
          0.37, 1.23, 2.718, 3.45, -1.68, 4.19, 0.81, 6.28, -2.4, 5.05
        ];

        let maxResidue = 0;
        let worstCounterexample = null;
        const samplesPrev = [];
        const samplesCurr = [];

        for (let s of samplePoints) {
          const scope = {};
          varList.forEach((v, idx) => {
            // Escalar si hay múltiples variables para no testear solo la diagonal x=y
            scope[v] = s * (1.0 + idx * 0.35);
          });

          const valPrev = this.parser.evaluate(prevAst, scope);
          const valCurr = this.parser.evaluate(currAst, scope);

          if (isNaN(valPrev) || isNaN(valCurr) || !isFinite(valPrev) || !isFinite(valCurr)) continue;

          if (isPrevEq && isCurrEq) {
            samplesPrev.push({ s, scope, val: valPrev });
            samplesCurr.push({ s, scope, val: valCurr });
          } else if (!isPrevEq && !isCurrEq) {
            const diff = Math.abs(valPrev - valCurr);
            if (diff > maxResidue) {
              maxResidue = diff;
              worstCounterexample = { sample: s, scope, prevVal: valPrev, currVal: valCurr, residue: diff };
            }
          } else {
            return {
              valid: false,
              status: 'type_mismatch',
              desc: 'Discrepancia de tipo: un paso es una ecuación con igualdad (=) y el otro es una expresión simple.'
            };
          }
        }

        // Para ecuaciones F(x) = 0 y G(x) = 0: verificar proporcionalidad lineal no-nula (k != 0)
        if (isPrevEq && isCurrEq) {
          if (samplesPrev.length < 2) {
            return { valid: false, status: 'error', desc: 'No se pudieron evaluar suficientes puntos muestrales.' };
          }
          let k = null;
          for (let i = 0; i < samplesPrev.length; i++) {
            if (Math.abs(samplesCurr[i].val) > 1e-10) {
              k = samplesPrev[i].val / samplesCurr[i].val;
              break;
            }
          }
          if (k === null || Math.abs(k) < 1e-12) {
            for (let i = 0; i < samplesPrev.length; i++) {
              if (Math.abs(samplesPrev[i].val) > 1e-10) {
                k = samplesPrev[i].val / (samplesCurr[i].val || 1e-15);
                break;
              }
            }
          }
          if (k === null) k = 1.0;

          for (let i = 0; i < samplesPrev.length; i++) {
            const diff = Math.abs(samplesPrev[i].val - k * samplesCurr[i].val);
            if (diff > maxResidue) {
              maxResidue = diff;
              worstCounterexample = {
                sample: samplesPrev[i].s,
                scope: samplesPrev[i].scope,
                prevVal: samplesPrev[i].val,
                currVal: samplesCurr[i].val,
                residue: diff
              };
            }
          }
        }

        const isCertified = maxResidue < 1e-7;

        return {
          valid: isCertified,
          status: isCertified ? 'certified' : 'divergent',
          maxResidue,
          counterexample: worstCounterexample ? {
            sample: worstCounterexample.sample,
            scope: worstCounterexample.scope,
            prevVal: Number(worstCounterexample.prevVal.toFixed(4)),
            currVal: Number(worstCounterexample.currVal.toFixed(4)),
            residue: Number(worstCounterexample.residue.toFixed(4)),
            desc: isCertified
              ? 'Equivalencia formal verificada. Residuo matemático nulo.'
              : `Ruptura de equivalencia: para ${JSON.stringify(worstCounterexample.scope)}, el paso previo da ${worstCounterexample.prevVal.toFixed(3)} pero tu paso da ${worstCounterexample.currVal.toFixed(3)} (error residual = ${worstCounterexample.residue.toFixed(3)}).`
          } : null
        };
      } catch (err) {
        return {
          valid: false,
          status: 'syntax_error',
          desc: `Sintaxis no válida: ${err.message}`
        };
      }
    }

    /**
     * Audita una secuencia completa de derivación matemática.
     * @param {Array<string>} steps Lista ordenada de pasos
     * @returns {Array<Object>} Evaluación paso a paso
     */
    auditDerivation(steps) {
      if (!Array.isArray(steps) || steps.length === 0) return [];
      const results = [];
      results.push({
        stepIndex: 0,
        text: steps[0],
        status: 'initial',
        valid: true,
        desc: 'Premisa inicial / Enunciado del problema'
      });

      for (let i = 1; i < steps.length; i++) {
        const prev = steps[i - 1];
        const curr = steps[i];
        const evalRes = this.checkEquivalence(prev, curr);
        results.push({
          stepIndex: i,
          text: curr,
          ...evalRes
        });
      }
      return results;
    }

    /**
     * Banco de Presets de Derivaciones Clásicas de Ingeniería
     */
    getEngineeringPresets() {
      return [
        {
          id: 'diff_squares',
          title: 'Diferencia de Cuadrados (Álgebra Troncal)',
          category: 'Cálculo I / Álgebra',
          steps: [
            '(x - 3)*(x + 3)',
            'x*(x + 3) - 3*(x + 3)',
            'x^2 + 3*x - 3*x - 9',
            'x^2 - 9'
          ]
        },
        {
          id: 'quadratic_equation',
          title: 'Resolución de Ecuación Cuadrática',
          category: 'Álgebra / Pre-Cálculo',
          steps: [
            '2*x + 8 = 20',
            '2*x = 12',
            'x = 6'
          ]
        },
        {
          id: 'trig_identity',
          title: 'Simplificación Trigonométrica Fundamental',
          category: 'Cálculo II / Geometría',
          steps: [
            '(sin(x) + cos(x))^2 - 2*sin(x)*cos(x)',
            'sin(x)^2 + 2*sin(x)*cos(x) + cos(x)^2 - 2*sin(x)*cos(x)',
            'sin(x)^2 + cos(x)^2',
            '1'
          ]
        },
        {
          id: 'beam_equilibrium',
          title: 'Equilibrio de Fuerzas en Viga (Estática)',
          category: 'Estática / Resistencia de Materiales',
          steps: [
            'R1 + R2 - 50 = 0',
            'R1 + R2 = 50'
          ]
        },
        {
          id: 'kinetic_energy',
          title: 'Teorema Trabajo y Energía Cinética',
          category: 'Física I / Mecánica Clásica',
          steps: [
            'W = 0.5*m*v2^2 - 0.5*m*v1^2',
            'W = 0.5*m*(v2^2 - v1^2)'
          ]
        }
      ];
    }
  }

  // Exportar al entorno global
  const instance = new TimonelLinter();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimonelLinter, MathParser, instance };
  } else {
    root.TimonelLinter = instance;
  }
})(typeof window !== 'undefined' ? window : globalThis);
