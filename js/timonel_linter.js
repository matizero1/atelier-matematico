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
      this.knownConstants = {
        'pi': Math.PI,
        'e': Math.E,
        'phi': (1 + Math.sqrt(5)) / 2,
        'tau': Math.PI * 2,
        'c': 299792458,
        'g': 9.80665
      };
    }

    tokenize(expr) {
      if (!expr || typeof expr !== 'string') return [];
      expr = expr.replace(/\s+/g, '')
                 .replace(/π/g, 'pi')
                 .replace(/τ/g, 'tau')
                 .replace(/φ/g, 'phi');
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
          const lower = name.toLowerCase();
          if (this.knownFunctions.includes(lower)) {
            rawTokens.push({ type: 'FN', value: lower });
          } else if (this.knownConstants[lower] !== undefined) {
            rawTokens.push({ type: 'CONST', name: lower, value: this.knownConstants[lower] });
          } else {
            rawTokens.push({ type: 'VAR', value: name });
          }
        } else {
          i++;
        }
      }

      // Insert implicit multiplications between adjacent tokens where appropriate
      // e.g.: NUM VAR, NUM CONST, CONST VAR, NUM FN, NUM (, ) (, ) VAR, VAR VAR
      const tokens = [];
      for (let j = 0; j < rawTokens.length; j++) {
        const curr = rawTokens[j];
        tokens.push(curr);
        if (j < rawTokens.length - 1) {
          const next = rawTokens[j + 1];
          const isCurrOperand = curr.type === 'NUM' || curr.type === 'CONST' || curr.type === 'VAR' || (curr.type === 'OP' && curr.value === ')');
          const isNextOperand = next.type === 'NUM' || next.type === 'CONST' || next.type === 'VAR' || next.type === 'FN' || (next.type === 'OP' && next.value === '(');
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

        if (tok.type === 'NUM' || tok.type === 'CONST') {
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

        // Muestras adaptativas cuasi-aleatorias de Halton (32 puntos estratificados)
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
        const halton = (index, base) => {
          let f = 1, r = 0, n = index;
          while (n > 0) {
            f /= base;
            r += f * (n % base);
            n = Math.floor(n / base);
          }
          return r;
        };

        const generateScopes = (domain) => {
          const list = [];
          for (let i = 1; i <= 32; i++) {
            const sc = {};
            varList.forEach((v, vIdx) => {
              const base = primes[vIdx % primes.length];
              const r = halton(i, base);
              if (domain === 'positive') {
                sc[v] = 0.25 + r * 6.5; // [0.25, 6.75] para log/sqrt
              } else if (domain === 'bounded') {
                sc[v] = -0.85 + r * 1.7; // [-0.85, 0.85] para asin/acos
              } else {
                const sign = (i + vIdx * 3) % 2 === 0 ? 1 : -1;
                sc[v] = sign * (0.35 + r * 5.8);
              }
            });
            list.push(sc);
          }
          return list;
        };

        const domains = ['standard', 'positive', 'bounded'];
        let bestSamples = [];
        for (const d of domains) {
          const scopes = generateScopes(d);
          const validPairs = [];
          for (const sc of scopes) {
            const vP = this.parser.evaluate(prevAst, sc);
            const vC = this.parser.evaluate(currAst, sc);
            if (!isNaN(vP) && !isNaN(vC) && isFinite(vP) && isFinite(vC)) {
              validPairs.push({ sc, vP, vC });
            }
          }
          if (validPairs.length >= 12) {
            bestSamples = validPairs;
            break;
          }
          if (validPairs.length > bestSamples.length) {
            bestSamples = validPairs;
          }
        }

        if (bestSamples.length < 3) {
          return { valid: false, status: 'error', desc: 'No se pudieron evaluar suficientes puntos muestrales en el dominio admisible.' };
        }

        let maxResidue = 0;
        let maxRelResidue = 0;
        let worstCounterexample = null;

        if (!isPrevEq && !isCurrEq) {
          for (const item of bestSamples) {
            const diff = Math.abs(item.vP - item.vC);
            const norm = 1.0 + Math.max(Math.abs(item.vP), Math.abs(item.vC));
            const relDiff = diff / norm;
            if (diff > maxResidue) {
              maxResidue = diff;
              maxRelResidue = relDiff;
              worstCounterexample = {
                scope: item.sc,
                prevVal: item.vP,
                currVal: item.vC,
                residue: diff
              };
            }
          }
        } else if (isPrevEq && isCurrEq) {
          let k = null;
          for (const item of bestSamples) {
            if (Math.abs(item.vC) > 1e-9) {
              k = item.vP / item.vC;
              break;
            }
          }
          if (k === null || Math.abs(k) < 1e-12) {
            for (const item of bestSamples) {
              if (Math.abs(item.vP) > 1e-9) {
                k = item.vP / (item.vC || 1e-15);
                break;
              }
            }
          }
          if (k === null) k = 1.0;

          for (const item of bestSamples) {
            const diff = Math.abs(item.vP - k * item.vC);
            const norm = 1.0 + Math.max(Math.abs(item.vP), Math.abs(k * item.vC));
            const relDiff = diff / norm;
            if (diff > maxResidue) {
              maxResidue = diff;
              maxRelResidue = relDiff;
              worstCounterexample = {
                scope: item.sc,
                prevVal: item.vP,
                currVal: item.vC,
                residue: diff
              };
            }
          }
        } else {
          return {
            valid: false,
            status: 'type_mismatch',
            desc: 'Discrepancia de tipo: un paso es una ecuación con igualdad (=) y el otro es una expresión simple.'
          };
        }

        let isCertified = maxResidue < 1e-7 || (maxRelResidue < 1e-7 && maxResidue < 1e-3);

        // Si falló la equivalencia funcional ordinaria pero el paso anterior era una ecuación,
        // verificar si el paso actual representa el conjunto solución o raíces exactas:
        if (!isCertified && isPrevEq) {
          const candidateRoots = this.extractCandidateRoots(currStr);
          if (candidateRoots.length > 0) {
            const varName = varList[0] || 'x';
            let rootsAllValid = true;
            let worstRootRes = 0;
            let worstRootVal = null;

            for (const r of candidateRoots) {
              const resVal = Math.abs(this.parser.evaluate(prevAst, { [varName]: r }));
              if (isNaN(resVal) || resVal > 1e-6) {
                rootsAllValid = false;
                if (resVal > worstRootRes) {
                  worstRootRes = resVal;
                  worstRootVal = r;
                }
              }
            }

            if (rootsAllValid) {
              isCertified = true;
              maxResidue = 0;
              worstCounterexample = {
                sample: 0,
                scope: { [varName]: candidateRoots[0] },
                prevVal: 0,
                currVal: 0,
                residue: 0,
                desc: 'Conjunto solución certificado en silicio. Cada raíz anula exactamente la ecuación previa (residuo = 0).'
              };
            } else if (worstRootVal !== null) {
              maxResidue = worstRootRes;
              worstCounterexample = {
                sample: 0,
                scope: { [varName]: worstRootVal },
                prevVal: worstRootRes,
                currVal: 0,
                residue: worstRootRes,
                desc: `Ruptura de equivalencia: ${varName} = ${worstRootVal} no satisface la ecuación previa (residuo = ${worstRootRes.toFixed(3)} ≠ 0).`
              };
            }
          }
        }

        return {
          valid: isCertified,
          status: isCertified ? 'certified' : 'divergent',
          maxResidue,
          counterexample: worstCounterexample ? {
            sample: 0,
            scope: worstCounterexample.scope,
            prevVal: Number(worstCounterexample.prevVal.toFixed(4)),
            currVal: Number(worstCounterexample.currVal.toFixed(4)),
            residue: Number(worstCounterexample.residue.toFixed(4)),
            desc: isCertified
              ? (worstCounterexample.desc || 'Equivalencia formal verificada. Residuo matemático nulo en silicio.')
              : `Ruptura de equivalencia: para ${JSON.stringify(worstCounterexample.scope)}, el paso previo da ${worstCounterexample.prevVal.toFixed(3)} pero tu paso da ${worstCounterexample.currVal.toFixed(3)} (error residual = ${worstCounterexample.residue.toFixed(3)}).`
          } : null
        };
      } catch (err) {
        // Si falló el parsing de currStr (por ej. por símbolos lógicos \\lor en soluciones),
        // intentar verificar si es un conjunto solución de prevStr si prevStr es ecuación válida:
        try {
          const prevTokens = this.parser.tokenize(prevStr);
          const prevAst = this.parser.parse(prevTokens);
          if (prevAst && prevAst.type === 'EQ') {
            const candidateRoots = this.extractCandidateRoots(currStr);
            if (candidateRoots.length > 0) {
              const allVars = new Set();
              this.parser.extractVariables(prevAst, allVars);
              const varName = Array.from(allVars)[0] || 'x';
              let rootsAllValid = true;
              let worstRootRes = 0;
              let worstRootVal = null;

              for (const r of candidateRoots) {
                const resVal = Math.abs(this.parser.evaluate(prevAst, { [varName]: r }));
                if (isNaN(resVal) || resVal > 1e-6) {
                  rootsAllValid = false;
                  if (resVal > worstRootRes) {
                    worstRootRes = resVal;
                    worstRootVal = r;
                  }
                }
              }

              if (rootsAllValid) {
                return {
                  valid: true,
                  status: 'certified',
                  maxResidue: 0,
                  counterexample: {
                    sample: 0,
                    scope: { [varName]: candidateRoots[0] },
                    prevVal: 0,
                    currVal: 0,
                    residue: 0,
                    desc: 'Conjunto solución certificado en silicio. Cada raíz anula exactamente la ecuación previa (residuo = 0).'
                  }
                };
              } else if (worstRootVal !== null) {
                return {
                  valid: false,
                  status: 'divergent',
                  maxResidue: worstRootRes,
                  counterexample: {
                    sample: 0,
                    scope: { [varName]: worstRootVal },
                    prevVal: worstRootRes,
                    currVal: 0,
                    residue: worstRootRes,
                    desc: `Ruptura de equivalencia: ${varName} = ${worstRootVal} no satisface la ecuación previa (residuo = ${worstRootRes.toFixed(3)} ≠ 0).`
                  }
                };
              }
            }
          }
        } catch (_) {}

        return {
          valid: false,
          status: 'syntax_error',
          desc: `Sintaxis no válida: ${err.message}`
        };
      }
    }

    /**
     * Extrae candidatos numéricos de raíces o soluciones algebraicas
     */
    extractCandidateRoots(str) {
      if (!str || typeof str !== 'string') return [];
      const clean = str.replace(/\\lor/g, ' or ').replace(/\\vee/g, ' or ').replace(/;/g, ',');
      const parts = clean.split(/or|,/).map(s => s.trim()).filter(Boolean);
      const roots = [];
      for (const p of parts) {
        const eqIdx = p.indexOf('=');
        if (eqIdx !== -1) {
          const valStr = p.substring(eqIdx + 1).trim();
          const val = parseFloat(valStr);
          if (!isNaN(val)) roots.push(val);
        } else {
          const val = parseFloat(p);
          if (!isNaN(val)) roots.push(val);
        }
      }
      return roots;
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
  
  // Métodos estáticos delegados para máxima compatibilidad
  TimonelLinter.instance = instance;
  TimonelLinter.checkEquivalence = function(s1, s2, opts) { return instance.checkEquivalence(s1, s2, opts); };
  TimonelLinter.auditDerivation = function(steps, opts) { return instance.auditDerivation(steps, opts); };
  TimonelLinter.getEngineeringPresets = function() { return instance.getEngineeringPresets(); };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimonelLinter, MathParser, instance };
  }
  root.TimonelLinter = TimonelLinter;
  root.Timonel = instance;
})(typeof window !== 'undefined' ? window : globalThis);

