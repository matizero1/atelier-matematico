/**
 * JIT MATH COMPILER — Compilador Determinista y Seguro de Ecuaciones en Silicio
 * Atelier Matemático / Nai Systems © 2026
 * 
 * Gobernanza: Timonel F2 · Cero Autoengaño · Cero Inyección de Código Arbitrario
 * 
 * Compila cualquier expresión matemática a una estructura de clausuras puras
 * mediante tokenización estricta y análisis de árbol de sintaxis abstracta (AST).
 * Arquitectura de silicio seguro sin constructores dinámicos de JavaScript.
 */

(function(root) {
  'use strict';

  class JITMathCompiler {
    constructor() {
      this.cache = new Map();
      this.knownFns = {
        'sin': Math.sin, 'cos': Math.cos, 'tan': Math.tan,
        'asin': Math.asin, 'acos': Math.acos, 'atan': Math.atan, 'atan2': Math.atan2,
        'sinh': Math.sinh, 'cosh': Math.cosh, 'tanh': Math.tanh,
        'exp': Math.exp, 'log': Math.log, 'ln': Math.log,
        'sqrt': Math.sqrt, 'abs': Math.abs, 'min': Math.min, 'max': Math.max,
        'floor': Math.floor, 'ceil': Math.ceil, 'pow': Math.pow
      };
      this.knownConstants = {
        'pi': Math.PI,
        'e': Math.E,
        'phi': (1 + Math.sqrt(5)) / 2,
        'tau': Math.PI * 2
      };
    }

    /**
     * Tokenizador estricto con lista blanca inmutable de caracteres e identificadores.
     */
    tokenize(expr, argNames) {
      if (!expr || typeof expr !== 'string') return [];
      
      // Filtro de lista blanca: Sólo se admiten caracteres algebraicos canónicos
      if (/[^0-9a-zA-Z+\-*/^()., \t\r\nπτε]/.test(expr)) {
        throw new Error('Caracteres no admitidos en la expresión algebraica');
      }

      let clean = expr.trim()
        .replace(/π/g, 'pi')
        .replace(/τ/g, 'tau')
        .replace(/ε/g, 'e');

      const raw = [];
      let i = 0;
      while (i < clean.length) {
        const ch = clean[i];
        if (' \t\r\n'.includes(ch)) { i++; continue; }
        if ('+-*/^(),'.includes(ch)) {
          raw.push({ type: 'OP', value: ch });
          i++;
        } else if (/\d/.test(ch) || (ch === '.' && /\d/.test(clean[i + 1] || ''))) {
          let numStr = '';
          while (i < clean.length && (/\d/.test(clean[i]) || clean[i] === '.')) {
            numStr += clean[i++];
          }
          raw.push({ type: 'NUM', value: Number(numStr) });
        } else if (/[a-zA-Z]/.test(ch)) {
          let id = '';
          while (i < clean.length && /[a-zA-Z0-9_]/.test(clean[i])) {
            id += clean[i++];
          }
          const lower = id.toLowerCase();
          if (this.knownFns[lower]) {
            raw.push({ type: 'FN', value: lower });
          } else if (this.knownConstants[lower] !== undefined) {
            raw.push({ type: 'CONST', value: this.knownConstants[lower] });
          } else if (argNames.includes(id) || argNames.includes(lower)) {
            raw.push({ type: 'VAR', name: argNames.includes(id) ? id : lower });
          } else {
            throw new Error(`Identificador '${id}' no admitido en el modelo`);
          }
        } else {
          throw new Error(`Símbolo no reconocido: '${ch}'`);
        }
      }

      // Inserción segura de multiplicación implícita: 2x -> 2*x, 3( -> 3*(, )( -> )*(
      const tokens = [];
      for (let j = 0; j < raw.length; j++) {
        const curr = raw[j];
        tokens.push(curr);
        if (j < raw.length - 1) {
          const next = raw[j + 1];
          const isLeft = curr.type === 'NUM' || curr.type === 'CONST' || curr.type === 'VAR' || (curr.type === 'OP' && curr.value === ')');
          const isRight = next.type === 'NUM' || next.type === 'CONST' || next.type === 'VAR' || next.type === 'FN' || (next.type === 'OP' && next.value === '(');
          if (isLeft && isRight) {
            tokens.push({ type: 'OP', value: '*' });
          }
        }
      }
      return tokens;
    }

    /**
     * Parser de descenso recursivo para álgebra cerrada.
     */
    parse(tokens) {
      let pos = 0;
      const peek = () => tokens[pos];
      const consume = (expected) => {
        const t = tokens[pos++];
        if (!t || (expected && t.value !== expected)) {
          throw new Error(`Se esperaba '${expected}' pero se encontró '${t ? t.value : 'fin de expresión'}'`);
        }
        return t;
      };

      const parseExpr = () => parseAdditive();

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
        let node = parseUnary();
        while (peek() && (peek().value === '*' || peek().value === '/')) {
          const op = consume().value;
          const right = parseUnary();
          node = { type: 'BINOP', op, left: node, right };
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
        return parsePower();
      };

      const parsePower = () => {
        let node = parsePrimary();
        if (peek() && peek().value === '^') {
          consume('^');
          const right = parseUnary(); // Permite potencias anidadas y exponentes negativos
          node = { type: 'BINOP', op: '^', left: node, right };
        }
        return node;
      };

      const parsePrimary = () => {
        const t = peek();
        if (!t) throw new Error('Expresión algebraica incompleta');
        if (t.type === 'NUM' || t.type === 'CONST') return { type: 'NUM', value: consume().value };
        if (t.type === 'VAR') return { type: 'VAR', name: consume().name };
        if (t.type === 'FN') {
          const fnName = consume().value;
          consume('(');
          const args = [];
          if (peek() && peek().value !== ')') {
            args.push(parseExpr());
            while (peek() && peek().value === ',') {
              consume(',');
              args.push(parseExpr());
            }
          }
          consume(')');
          return { type: 'CALL', fn: fnName, args };
        }
        if (t.value === '(') {
          consume('(');
          const e = parseExpr();
          consume(')');
          return e;
        }
        throw new Error(`Símbolo no esperado: '${t.value}'`);
      };

      const ast = parseExpr();
      if (pos !== tokens.length) throw new Error('Existen símbolos sin procesar');
      return ast;
    }

    /**
     * Compila el AST directamente a un árbol de clausuras matemáticas (sin eval/Function).
     */
    compileClosure(ast) {
      if (!ast) return () => 0;
      if (ast.type === 'NUM') {
        const v = ast.value;
        return () => v;
      }
      if (ast.type === 'VAR') {
        const n = ast.name;
        return (s) => (s[n] !== undefined ? s[n] : 0);
      }
      if (ast.type === 'UNOP' && ast.op === '-') {
        const inner = this.compileClosure(ast.expr);
        return (s) => -inner(s);
      }
      if (ast.type === 'BINOP') {
        const l = this.compileClosure(ast.left);
        const r = this.compileClosure(ast.right);
        if (ast.op === '+') return (s) => l(s) + r(s);
        if (ast.op === '-') return (s) => l(s) - r(s);
        if (ast.op === '*') return (s) => l(s) * r(s);
        if (ast.op === '/') return (s) => {
          const denom = r(s);
          return (Math.abs(denom) < 1e-15 || isNaN(denom)) ? 0 : l(s) / denom;
        };
        if (ast.op === '^') return (s) => Math.pow(l(s), r(s));
      }
      if (ast.type === 'CALL') {
        const fn = this.knownFns[ast.fn] || Math.sin;
        const compiledArgs = (ast.args || []).map(a => this.compileClosure(a));
        if (compiledArgs.length === 1) {
          const a0 = compiledArgs[0];
          return (s) => fn(a0(s));
        }
        return (s) => fn(...compiledArgs.map(a => a(s)));
      }
      return () => 0;
    }

    /**
     * Compila de forma determinista y segura una función fn(...args).
     * Devuelve una función de silicio de ultra-alta velocidad (cero garbage collection por llamada).
     */
    compile(exprStr, argNames = ['x', 'y', 't']) {
      const clean = (exprStr || '0').trim();
      const cacheKey = clean + '|' + argNames.join(',');
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      try {
        const tokens = this.tokenize(clean, argNames);
        const ast = this.parse(tokens);
        const closure = this.compileClosure(ast);

        // Ámbito preasignado reutilizable para evitar recolección de basura a 60 FPS
        const scope = {};
        argNames.forEach(name => { scope[name] = 0; });

        const compiledFn = (...args) => {
          for (let i = 0; i < argNames.length; i++) {
            scope[argNames[i]] = args[i] || 0;
          }
          const val = closure(scope);
          if (isNaN(val) || !isFinite(val)) return 0;
          return Math.max(-50, Math.min(50, val));
        };

        this.cache.set(cacheKey, compiledFn);
        return compiledFn;
      } catch (err) {
        console.warn('Compilación JIT rechazada de forma segura por Timonel:', clean, err.message);
        const fallback = () => 0;
        this.cache.set(cacheKey, fallback);
        return fallback;
      }
    }

    /**
     * Crea un simulador 2D de flujo de partículas lagrangianas gobernado por campos seguros.
     */
    createParticleSimulator(canvas, exprX = '-y', exprY = 'x') {
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      let W = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
      let H = canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 400;

      let fnU = this.compile(exprX, ['x', 'y', 't']);
      let fnV = this.compile(exprY, ['x', 'y', 't']);

      const N = 700;
      const particles = [];
      const resetParticle = (p) => {
        p.x = (Math.random() - 0.5) * 6;
        p.y = (Math.random() - 0.5) * 6;
        p.life = Math.random() * 120 + 60;
        p.maxLife = p.life;
      };

      for (let i = 0; i < N; i++) {
        const p = {};
        resetParticle(p);
        p.life = Math.random() * p.maxLife; // desfase temporal inicial
        particles.push(p);
      }

      let time = 0;
      let animId = null;

      const step = () => {
        time += 0.015;
        ctx.fillStyle = 'rgba(8, 8, 10, 0.2)';
        ctx.fillRect(0, 0, W, H);

        const cx = W / 2;
        const cy = H / 2;
        const scale = Math.min(W, H) / 6.5;

        ctx.lineWidth = 1.2;

        for (let i = 0; i < N; i++) {
          const p = particles[i];
          const u = fnU(p.x, p.y, time);
          const v = fnV(p.x, p.y, time);

          const px0 = cx + p.x * scale;
          const py0 = cy - p.y * scale;

          p.x += u * 0.035;
          p.y += v * 0.035;
          p.life--;

          const px1 = cx + p.x * scale;
          const py1 = cy - p.y * scale;

          const speed = Math.sqrt(u * u + v * v);
          const alpha = Math.min(1, p.life / 30);
          
          const hue = Math.min(180, 42 + speed * 35);
          ctx.strokeStyle = `hsla(${hue}, 70%, 65%, ${alpha * 0.8})`;

          ctx.beginPath();
          ctx.moveTo(px0, py0);
          ctx.lineTo(px1, py1);
          ctx.stroke();

          if (p.life <= 0 || Math.abs(p.x) > 4.5 || Math.abs(p.y) > 4.5) {
            resetParticle(p);
          }
        }

        animId = requestAnimationFrame(step);
      };

      const start = () => {
        if (!animId) animId = requestAnimationFrame(step);
      };

      const stop = () => {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      };

      const resize = () => {
        if (canvas.parentElement) {
          W = canvas.width = canvas.parentElement.clientWidth;
          H = canvas.height = canvas.parentElement.clientHeight;
        }
      };

      const updateEquation = (newExprX, newExprY) => {
        fnU = this.compile(newExprX, ['x', 'y', 't']);
        fnV = this.compile(newExprY, ['x', 'y', 't']);
        particles.forEach(resetParticle);
      };

      return { start, stop, resize, updateEquation };
    }

    /**
     * Presets temáticos de ingeniería física e hidrodinámica
     */
    getEngineeringCurriculumModels() {
      return [
        {
          subject: 'Cálculo Vectorial',
          title: 'Vórtice Incompresible (Rotacional Puro)',
          exprX: '-y',
          exprY: 'x',
          eq: '\\nabla \\times \\mathbf{F} = 2\\mathbf{k}',
          desc: 'Campo de rotación de cuerpo rígido con divergencia nula y vorticidad constante.'
        },
        {
          subject: 'Cálculo Multivariable',
          title: 'Punto de Silla / Gradiente Hiperbólico',
          exprX: 'x',
          exprY: '-y',
          eq: '\\phi(x,y) = \\frac{1}{2}(x^2 - y^2)',
          desc: 'Superficie de ensilladura con líneas de corriente hiperbólicas ortogonales.'
        },
        {
          subject: 'Mecánica de Fluidos',
          title: 'Dipolo de Flujo Potencial / Fuente y Sumidero',
          exprX: '(x^2 - y^2) / (x^2 + y^2 + 0.2)^2',
          exprY: '(2*x*y) / (x^2 + y^2 + 0.2)^2',
          eq: 'w(z) = \\frac{\\mu}{2\\pi z}',
          desc: 'Flujo potencial aerodinámico alrededor de un doblete hidrodinámico.'
        },
        {
          subject: 'Dinámica & Vibraciones',
          title: 'Oscilador Forzado No Lineal (Duffing)',
          exprX: 'y',
          exprY: '-0.15*y - x - x^3 + 0.35*cos(t)',
          eq: '\\ddot{x} + \\delta \\dot{x} + \\alpha x + \\beta x^3 = \\gamma \\cos(\\omega t)',
          desc: 'Retrato de fase en el espacio de estados mostrando bifurcación y ciclos límite.'
        },
        {
          subject: 'Transferencia de Calor',
          title: 'Difusión de Conducción Térmica Transitoria',
          exprX: '-x / (x^2 + y^2 + 0.4)',
          exprY: '-y / (x^2 + y^2 + 0.4)',
          eq: '\\mathbf{q} = -k \\nabla T',
          desc: 'Ley de Fourier: flujo de calor en dirección opuesta al gradiente térmico.'
        }
      ];
    }
  }

  const jitInstance = new JITMathCompiler();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JITMathCompiler, instance: jitInstance };
  } else {
    root.JITMathCompiler = jitInstance;
  }
})(typeof window !== 'undefined' ? window : globalThis);
