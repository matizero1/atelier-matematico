/**
 * 🏛️ ATELIER MATEMÁTICO — CONTROLADOR MAESTRO DE SALA V: CÁTEDRA & LABORATORIO
 * Nai Systems · Arquitectura Modular Desacoplada
 * Estándar: Timonel F2 · Orquestador Prefrontal · Integración KaTeX, CAS, Grapher, Chalk & Wasm
 */

(function(root) {
  'use strict';

  // Carga de submódulos desacoplados en entornos CommonJS/Node o Browser
  const GrapherClass = (typeof ClassroomGrapher !== 'undefined') ? ClassroomGrapher :
    ((typeof require === 'function') ? require('./classroom_grapher') : null);
  const ChalkboardClass = (typeof ClassroomChalkboard !== 'undefined') ? ClassroomChalkboard :
    ((typeof require === 'function') ? require('./classroom_chalkboard') : null);
  const CASClass = (typeof ClassroomCAS !== 'undefined') ? ClassroomCAS :
    ((typeof require === 'function') ? require('./classroom_cas') : null);
  const NailangClass = (typeof ClassroomNailang !== 'undefined') ? ClassroomNailang :
    ((typeof require === 'function') ? require('./classroom_nailang') : null);

  class ClassroomController {
    constructor() {
      this.currentRole = 'student'; // 'teacher' | 'student'
      this.currentMode = 'study'; // 'study' | 'exam'
      this.visorMode = 'grapher'; // 'grapher' | 'sim' | 'chalk'
      this.currentPresetIdx = 0;
      this.derivationSteps = [];
      this.activeStepIdx = 0;
      this.inputDebounceTimer = null;

      // Submódulos desacoplados
      this.grapher = GrapherClass ? new GrapherClass(this) : null;
      this.chalkboard = ChalkboardClass ? new ChalkboardClass(this) : null;
      this.cas = CASClass ? new CASClass(this) : null;
      this.nailang = NailangClass ? new NailangClass(this) : null;

      // Simuladores
      this.jitSimulator = null;
    }

    init() {
      // 1. Poblar catálogo de problemas y presets
      this.populatePresetSelector();

      // 2. Cargar preset inicial
      this.loadPreset(0);

      // 3. Inicializar Graficador Cartesiano
      if (this.grapher) this.grapher.init();

      // 4. Inicializar Simulador JIT de Fluidos/Partículas
      this.initJITSimulator();

      // 5. Inicializar Pizarra de Tiza Libre
      if (this.chalkboard) this.chalkboard.init();

      // 6. Conectar a Sala Sincrónica P2P
      const params = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const roomParam = params.get('room') || 'EULR';
      const roleParam = params.get('role') || 'student';
      this.setRole(roleParam, false);
      this.joinRoom(roomParam);

      // 7. Escuchar eventos P2P
      if (typeof window !== 'undefined' && window.RoomSync) {
        window.RoomSync.on('students_updated', (students) => {
          this.renderStudentsGrid(students);
        });
        window.RoomSync.on('master_state_received', (state) => {
          if (this.currentRole === 'student' && state) {
            const tEl = document.getElementById('problem-title');
            const dEl = document.getElementById('problem-desc');
            if (tEl) tEl.textContent = state.title;
            if (dEl) dEl.textContent = state.prompt;
          }
        });
      }

      // 8. Manejo de redimensionamiento de pantalla
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => {
          this.resizeCanvases();
          if (this.grapher) this.grapher.render();
          if (this.jitSimulator) this.jitSimulator.resize();
        });
      }

      // 9. Configurar modo inicial del visor
      this.switchVisorMode('grapher');

      // 10. Soporte de expresión directa y auto-resolución CAS por URL
      const exprParam = params.get('expr');
      if (exprParam) {
        this.derivationSteps = [decodeURIComponent(exprParam)];
        this.activeStepIdx = 0;
        this.renderSteps();
      }
      if (params.get('autosolve') === '1') {
        this.calculateAutoSolve();
      }

      // 11. Cargar cuaderno de apuntes persistente desde IndexedDB
      this.loadSavedClassroomNotes();
    }

    populatePresetSelector() {
      if (typeof document === 'undefined') return;
      const sel = document.getElementById('preset-selector');
      if (!sel) return;

      const engineeringPresets = (window.TimonelLinter && typeof window.TimonelLinter.getEngineeringPresets === 'function') ?
        window.TimonelLinter.getEngineeringPresets() : [
          { title: 'Diferencia de Cuadrados (Álgebra)', category: 'Cálculo I / Álgebra Troncal', steps: ['(x - 3)*(x + 3)', 'x*(x + 3) - 3*(x + 3)', 'x^2 + 3*x - 3*x - 9', 'x^2 - 9'] },
          { title: 'Trinomio Cuadrado Perfecto', category: 'Álgebra Fundamental', steps: ['(x + 5)^2', '(x + 5)*(x + 5)', 'x^2 + 5*x + 5*x + 25', 'x^2 + 10*x + 25'] },
          { title: 'Simplificación Racional', category: 'Cálculo Diferencial', steps: ['(x^2 - 16)/(x - 4)', '(x - 4)*(x + 4)/(x - 4)', 'x + 4'] },
          { title: 'Identidad Pitagórica Fundamental', category: 'Geometría & Trigonometría', steps: ['sin(x)^2 + cos(x)^2', '1'] }
        ];

      let html = '<optgroup label="── Álgebra Troncal & Cálculo ──">';
      engineeringPresets.forEach((p, idx) => {
        html += `<option value="eng_${idx}">${p.title}</option>`;
      });
      html += '</optgroup>';

      // Agregar opciones del Museo Atelier (100 Obras)
      if (window.AtelierMath && Array.isArray(window.AtelierMath.ARTWORKS)) {
        html += '<optgroup label="── Leyes Canónicas del Museo (100 Obras) ──">';
        const highlightIds = [0, 8, 20, 39, 50, 86, 99]; // Pitágoras, Péndulo, Riemann, Navier, etc.
        highlightIds.forEach(id => {
          const art = window.AtelierMath.ARTWORKS[id];
          if (art) {
            html += `<option value="art_${id}">Obra ${art.badge}: ${art.title}</option>`;
          }
        });
        html += '</optgroup>';
      }

      sel.innerHTML = html;
    }

    loadPreset(val) {
      const selVal = String(val);
      let p = null;

      if (selVal.startsWith('art_')) {
        const artId = parseInt(selVal.replace('art_', ''), 10);
        if (typeof window !== 'undefined' && window.AtelierMath && window.AtelierMath.ARTWORKS && window.AtelierMath.ARTWORKS[artId]) {
          const art = window.AtelierMath.ARTWORKS[artId];
          p = {
            title: `Obra ${art.badge}: ${art.title}`,
            category: art.epoch || 'Leyes Canónicas de la Física',
            desc: art.desc || 'Exploración formal del teorema y su dinámica analítica en silicio.',
            steps: this.getArtworkCanonicalSteps(artId)
          };
        }
      } else {
        const idx = parseInt(selVal.replace('eng_', ''), 10) || 0;
        const presets = (typeof window !== 'undefined' && window.TimonelLinter && typeof window.TimonelLinter.getEngineeringPresets === 'function') ?
          window.TimonelLinter.getEngineeringPresets() : [];
        p = presets[idx] || {
          title: 'Diferencia de Cuadrados (Álgebra Troncal)',
          category: 'Cálculo I / Álgebra Troncal',
          desc: 'Explora pasos algebraicos. El muestreo numérico orienta la revisión y no demuestra equivalencia formal.',
          steps: ['(x - 3)*(x + 3)', 'x*(x + 3) - 3*(x + 3)', 'x^2 + 3*x - 3*x - 9', 'x^2 - 9']
        };
      }

      if (!p) return;

      if (typeof document !== 'undefined') {
        const tEl = document.getElementById('problem-title');
        const cEl = document.getElementById('problem-category');
        const dEl = document.getElementById('problem-desc');
        if (tEl) tEl.textContent = p.title;
        if (cEl) cEl.textContent = p.category;
        if (dEl && p.desc) dEl.textContent = p.desc;
      }

      this.derivationSteps = [...p.steps];
      this.activeStepIdx = Math.max(0, this.derivationSteps.length - 1);
      this.renderSteps();

      if (this.currentRole === 'teacher' && typeof window !== 'undefined' && window.RoomSync) {
        window.RoomSync.updateMasterBoard(p.title, p.category, this.derivationSteps, this.currentMode);
      }
    }

    getArtworkCanonicalSteps(artId) {
      switch (artId) {
        case 0: return ['a^2 + b^2', 'c^2'];
        case 8: return ['theta\'\' + (g/L)*sin(theta)', '0'];
        case 20: return ['u_tt - c^2*u_xx', '0'];
        case 39: return ['rho*(u_t + u*u_x) + p_x - mu*u_xx', '0'];
        case 50: return ['zeta(s)', 'sum(1/n^s, n, 1, inf)'];
        case 86: return ['dx/dt', 'sigma*(y - x)'];
        default: return ['f(x)', 'x^2 - 4'];
      }
    }

    newCustomProblem() {
      if (typeof prompt === 'undefined') return;
      const title = prompt('Título del Teorema o Ejercicio:', 'Ecuación Fundamental');
      if (!title) return;
      const initialStep = prompt('Paso Inicial / Ecuación de Partida:', 'x^2 - 9');
      if (!initialStep) return;

      const tEl = document.getElementById('problem-title');
      const cEl = document.getElementById('problem-category');
      if (tEl) tEl.textContent = title;
      if (cEl) cEl.textContent = 'Personalizado / Aula';

      this.derivationSteps = [initialStep];
      this.activeStepIdx = 0;
      this.renderSteps();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MOTOR DE RENDERIZADO DE PASOS & KATEX
    // ─────────────────────────────────────────────────────────────────────────

    renderSteps() {
      if (typeof document === 'undefined') return;
      const container = document.getElementById('steps-container');
      if (!container) return;

      const t0 = (typeof performance !== 'undefined') ? performance.now() : 0;
      const audit = (typeof window !== 'undefined' && window.TimonelLinter && typeof window.TimonelLinter.auditDerivation === 'function') ?
        window.TimonelLinter.auditDerivation(this.derivationSteps) : [];
      const dt = ((typeof performance !== 'undefined' ? performance.now() : 0) - t0).toFixed(2);

      const timeEl = document.getElementById('eval-telemetry-time');
      if (timeEl) timeEl.textContent = `${dt} ms`;

      let hasDivergence = false;
      let allFormal = true;
      let maxRes = 0;

      container.innerHTML = this.derivationSteps.map((stepText, idx) => {
        const evalInfo = audit[idx] || { valid: false, status: 'inconclusive' };
        const isCertified = evalInfo.valid;
        if (!isCertified && idx > 0) hasDivergence = true;
        if (idx > 0 && evalInfo.status !== 'formally_certified') allFormal = false;
        if (evalInfo.maxResidue > maxRes) maxRes = evalInfo.maxResidue;

        let badgeClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
        let badgeText = 'CONSISTENCIA MUESTRAL';
        let rowClass = 'border-white/10';

        if (idx === 0) {
          badgeClass = 'bg-blue-950/60 text-blue-300 border-blue-500/30';
          badgeText = 'PREMISA';
        } else if (evalInfo.status === 'formally_certified') {
          badgeClass = 'bg-[#c5a059]/20 text-[#dfc285] border-[#c5a059]/40';
          badgeText = 'DEMOSTRACIÓN FORMAL';
        } else if (!isCertified) {
          badgeClass = 'bg-red-950/60 text-red-300 border-red-500/50 divergent-pulse';
          badgeText = ['inconclusive', 'domain_mismatch'].includes(evalInfo.status) ? 'REVISAR DOMINIO / RAÍCES' : 'DIVERGENCIA';
          rowClass = 'border-red-500/50 bg-red-950/10';
        }

        const counterexampleHtml = (!isCertified && evalInfo.counterexample && this.currentMode === 'study') ? `
          <div class="mt-2 text-[11px] mono text-red-300 bg-red-950/40 p-2.5 rounded-lg border border-red-500/30 flex items-start gap-2">
            <span class="text-red-400 font-bold text-sm">💡</span>
            <div>
              <strong>Timonel:</strong> ${this.escapeHtml(evalInfo.counterexample.desc)}
            </div>
          </div>
        ` : '';

        return `
          <div class="p-3.5 rounded-xl border ${rowClass} bg-[#08080a] flex flex-col gap-1.5 transition">
            <div class="flex justify-between items-center text-xs mono">
              <span class="text-[#71717a] font-bold">PASO ${String(idx + 1).padStart(2, '0')}</span>
              <span class="px-2.5 py-0.5 rounded text-[9px] font-bold border ${badgeClass}">
                ${badgeText}
              </span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <input type="text" value="${this.escapeHtml(stepText)}" 
                     id="input-step-${idx}"
                     oninput="window.Classroom.onStepInput(${idx}, this.value)"
                     onfocus="window.Classroom.activeStepIdx = ${idx}"
                     class="flex-1 bg-white/[0.03] border border-white/10 rounded px-2.5 py-1.5 text-[#f4f1ea] font-mono text-sm outline-none focus:border-[#c5a059] focus:bg-black transition placeholder-white/20"
                     placeholder="Escribe la siguiente línea algebraica...">
              ${idx > 0 ? `<button onclick="window.Classroom.deleteStep(${idx})" class="text-[#71717a] hover:text-red-400 text-xs px-2 py-1 transition" title="Eliminar paso">✕</button>` : ''}
            </div>
            
            <!-- Renderizado Tipográfico KaTeX -->
            <div id="katex-step-${idx}" class="text-sm text-[#dfc285] min-h-[22px] px-1 py-0.5 overflow-x-auto custom-scrollbar"></div>
            
            ${counterexampleHtml}
            ${idx > 0 ? `<div class="text-[10px] text-amber-200">${this.escapeHtml(evalInfo.desc || "Comprobación numérica limitada")}</div>` : ""}
          </div>
        `;
      }).join('');

      // Actualizar Telemetría de Cabecera
      const resEl = document.getElementById('eval-telemetry-res');
      if (resEl) resEl.textContent = maxRes.toFixed(4);

      const statusBadge = document.getElementById('derivation-status-badge');
      if (statusBadge) {
        if (hasDivergence) {
          statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-300 border border-red-500/50 divergent-pulse';
          statusBadge.textContent = 'HAY PASOS SIN VALIDAR';
        } else if (allFormal && this.derivationSteps.length > 1) {
          statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059]/20 text-[#dfc285] border border-[#c5a059]/40';
          statusBadge.textContent = 'DEMOSTRACIÓN SIMBÓLICA FORMAL (RESIDUO = 0)';
        } else {
          statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30';
          statusBadge.textContent = 'CONSISTENCIA MUESTRAL · NO ES PRUEBA';
        }
      }

      // Renderizar fórmulas con KaTeX
      this.derivationSteps.forEach((stepText, idx) => {
        const el = document.getElementById(`katex-step-${idx}`);
        if (!el) return;
        const latex = this.mathStringToLaTeX(stepText);
        if (typeof window !== 'undefined' && typeof window.katex !== 'undefined') {
          try {
            window.katex.render(latex, el, { throwOnError: false, displayMode: false });
          } catch (e) {
            el.textContent = stepText;
          }
        } else {
          el.textContent = stepText;
        }
      });

      // Actualizar Graficador Cartesiano si está en modo grapher
      if (this.visorMode === 'grapher' && this.grapher) {
        this.grapher.render();
      }
    }

    onStepInput(idx, val) {
      this.derivationSteps[idx] = val;
      this.activeStepIdx = idx;

      // Actualizar KaTeX en vivo
      if (typeof document !== 'undefined') {
        const kEl = document.getElementById(`katex-step-${idx}`);
        if (kEl && typeof window !== 'undefined' && typeof window.katex !== 'undefined') {
          try {
            window.katex.render(this.mathStringToLaTeX(val), kEl, { throwOnError: false, displayMode: false });
          } catch (_) {}
        }
      }

      // Debounce para análisis completo y graficación
      clearTimeout(this.inputDebounceTimer);
      this.inputDebounceTimer = setTimeout(() => {
        this.renderSteps();
      }, 40);
    }

    mathStringToLaTeX(str) {
      if (this.cas) return this.cas.mathStringToLaTeX(str);
      if (!str || !str.trim()) return '';
      let s = str.trim();
      s = s.replace(/\*/g, ' \\cdot ');
      s = s.replace(/pi/gi, '\\pi ');
      s = s.replace(/theta/gi, '\\theta ');
      s = s.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
      return s;
    }

    addStep() {
      const last = this.derivationSteps[this.derivationSteps.length - 1] || 'x';
      this.derivationSteps.push(last);
      this.activeStepIdx = this.derivationSteps.length - 1;
      this.renderSteps();
      setTimeout(() => {
        const input = document.getElementById(`input-step-${this.activeStepIdx}`);
        if (input) input.focus();
      }, 50);
    }

    deleteStep(idx) {
      if (this.derivationSteps.length <= 1) return;
      this.derivationSteps.splice(idx, 1);
      this.activeStepIdx = Math.max(0, idx - 1);
      this.renderSteps();
    }

    resetSteps() {
      if (typeof confirm !== 'undefined' && confirm('¿Restablecer la derivación al problema de origen?')) {
        this.loadPreset(this.currentPresetIdx);
      }
    }

    insertMathSymbol(sym) {
      if (typeof document === 'undefined') return;
      const input = document.getElementById(`input-step-${this.activeStepIdx}`);
      if (!input) return;

      const start = input.selectionStart || input.value.length;
      const end = input.selectionEnd || input.value.length;
      const text = input.value;
      const before = text.substring(0, start);
      const after = text.substring(end);

      input.value = before + sym + after;
      input.focus();
      const newPos = start + sym.length;
      input.setSelectionRange(newPos, newPos);

      this.onStepInput(this.activeStepIdx, input.value);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELEGACIÓN CAS EN SILICIO
    // ─────────────────────────────────────────────────────────────────────────

    calculateAutoSolve() { if (this.cas) this.cas.calculateAutoSolve(); }
    calculateFactor() { if (this.cas) this.cas.calculateFactor(); }
    calculateExpand() { if (this.cas) this.cas.calculateExpand(); }
    calculateDerivative() { if (this.cas) this.cas.calculateDerivative(); }
    calculateIntegral() { if (this.cas) this.cas.calculateIntegral(); }
    calculateRoots() { if (this.cas) this.cas.calculateRoots(); }
    calculateTaylor() { if (this.cas) this.cas.calculateTaylor(); }
    calculateLimit() { if (this.cas) this.cas.calculateLimit(); }
    calculateSimplify() { if (this.cas) this.cas.calculateSimplify(); }
    appendCalculatedStep(s) { if (this.cas) this.cas.appendCalculatedStep(s); }

    // ─────────────────────────────────────────────────────────────────────────
    // DELEGACIÓN GRAFICADOR CARTESIANO 2D
    // ─────────────────────────────────────────────────────────────────────────

    initCartesianGrapher() { if (this.grapher) this.grapher.init(); }
    renderCartesianGraph() { if (this.grapher) this.grapher.render(); }
    zoomGraph(factor) { if (this.grapher) this.grapher.zoom(factor); }
    resetGraphView() { if (this.grapher) this.grapher.resetView(); }

    // ─────────────────────────────────────────────────────────────────────────
    // DELEGACIÓN PIZARRA DE TIZA LIBRE
    // ─────────────────────────────────────────────────────────────────────────

    initChalkboard() { if (this.chalkboard) this.chalkboard.init(); }
    setChalkColor(col) { if (this.chalkboard) this.chalkboard.setChalkColor(col); }
    setChalkMode(mod) { if (this.chalkboard) this.chalkboard.setChalkMode(mod); }
    clearChalkboard() { if (this.chalkboard) this.chalkboard.clearChalkboard(); }

    // ─────────────────────────────────────────────────────────────────────────
    // SIMULADOR JIT DE FLUIDOS / PARTÍCULAS
    // ─────────────────────────────────────────────────────────────────────────

    initJITSimulator() {
      if (typeof document === 'undefined') return;
      const canvas = document.getElementById('jit-stage');
      if (canvas && window.JITMathCompiler) {
        this.jitSimulator = window.JITMathCompiler.createParticleSimulator(canvas, '-y', 'x');
      }
    }

    updateJITFields() {
      if (typeof document === 'undefined') return;
      const uVal = document.getElementById('jit-input-u')?.value || '-y';
      const vVal = document.getElementById('jit-input-v')?.value || 'x';
      if (this.jitSimulator) {
        this.jitSimulator.updateEquation(uVal, vVal);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CONMUTADOR TRI-MODAL DEL VISOR
    // ─────────────────────────────────────────────────────────────────────────

    switchVisorMode(mode) {
      this.visorMode = mode;
      if (typeof document === 'undefined') return;

      const vGraph = document.getElementById('view-grapher');
      const vSim = document.getElementById('view-sim');
      const vChalk = document.getElementById('view-chalk');

      const tGraph = document.getElementById('tab-grapher');
      const tSim = document.getElementById('tab-sim');
      const tChalk = document.getElementById('tab-chalk');

      [tGraph, tSim, tChalk].forEach(t => {
        if (t) t.className = 'px-2.5 py-1 rounded text-[#a1a1aa] hover:text-white transition flex items-center gap-1.5';
      });

      if (vGraph) vGraph.classList.add('hidden');
      if (vSim) vSim.classList.add('hidden');
      if (vChalk) vChalk.classList.add('hidden');

      if (mode === 'grapher') {
        if (vGraph) vGraph.classList.remove('hidden');
        if (tGraph) tGraph.className = 'px-2.5 py-1 rounded bg-[#c5a059] text-black font-semibold transition flex items-center gap-1.5';
        this.resizeCanvases();
        if (this.grapher) this.grapher.render();
      } else if (mode === 'sim') {
        if (vSim) vSim.classList.remove('hidden');
        if (tSim) tSim.className = 'px-2.5 py-1 rounded bg-[#c5a059] text-black font-semibold transition flex items-center gap-1.5';
        this.resizeCanvases();
        if (this.jitSimulator) this.jitSimulator.start();
      } else if (mode === 'chalk') {
        if (vChalk) vChalk.classList.remove('hidden');
        if (tChalk) tChalk.className = 'px-2.5 py-1 rounded bg-[#c5a059] text-black font-semibold transition flex items-center gap-1.5';
        this.resizeCanvases();
      }
    }

    resizeCanvases() {
      if (typeof document === 'undefined') return;
      const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      const gCanvas = document.getElementById('cartesian-canvas');
      if (gCanvas && gCanvas.parentElement) {
        gCanvas.width = gCanvas.parentElement.clientWidth * dpr;
        gCanvas.height = gCanvas.parentElement.clientHeight * dpr;
      }

      const cCanvas = document.getElementById('chalk-canvas');
      if (cCanvas && cCanvas.parentElement) {
        cCanvas.width = cCanvas.parentElement.clientWidth * dpr;
        cCanvas.height = cCanvas.parentElement.clientHeight * dpr;
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GOBERNANZA DE SALA Y MODO EXAMEN
    // ─────────────────────────────────────────────────────────────────────────

    setRole(role, notify = true) {
      this.currentRole = role;
      if (typeof document !== 'undefined') {
        const btnT = document.getElementById('btn-role-teacher');
        const btnS = document.getElementById('btn-role-student');

        if (btnT && btnS) {
          if (role === 'teacher') {
            btnT.classList.add('bg-[#c5a059]', 'text-black', 'font-semibold');
            btnT.classList.remove('text-white/60');
            btnS.classList.remove('bg-[#c5a059]', 'text-black', 'font-semibold');
            btnS.classList.add('text-white/60');
          } else {
            btnS.classList.add('bg-[#c5a059]', 'text-black', 'font-semibold');
            btnS.classList.remove('text-white/60');
            btnT.classList.remove('bg-[#c5a059]', 'text-black', 'font-semibold');
            btnT.classList.add('text-white/60');
          }
        }
      }

      if (notify && typeof window !== 'undefined' && window.RoomSync && window.RoomSync.currentRoom) {
        window.RoomSync.joinRoom(window.RoomSync.currentRoom, this.currentRole);
      }
    }

    joinRoom(roomCode) {
      if (typeof window === 'undefined' || !window.RoomSync) return;
      const joined = window.RoomSync.joinRoom(roomCode, this.currentRole);
      const bEl = document.getElementById('current-room-badge');
      if (bEl) bEl.textContent = joined;
      this.renderStudentsGrid([]);
    }

    promptJoinRoom() {
      if (typeof prompt === 'undefined') return;
      const current = (typeof window !== 'undefined' && window.RoomSync && window.RoomSync.currentRoom) ? window.RoomSync.currentRoom : 'EULR';
      const code = prompt('Ingresa el código de 4 caracteres de la sala:', current);
      if (code) {
        const clean = code.toUpperCase().trim();
        if (typeof window !== 'undefined' && window.history) {
          window.history.replaceState({}, '', `?room=${clean}&role=${this.currentRole}`);
        }
        this.joinRoom(clean);
      }
    }

    copyRoomLink() {
      if (typeof window === 'undefined') return;
      const room = (window.RoomSync && window.RoomSync.currentRoom) ? window.RoomSync.currentRoom : 'EULR';
      const url = `${window.location.origin}${window.location.pathname}?room=${room}&role=student`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          alert(`¡Enlace copiado al portapapeles!\nComparte este link con tus alumnos:\n${url}`);
        });
      }
    }

    toggleExamMode() {
      this.currentMode = this.currentMode === 'study' ? 'exam' : 'study';
      if (typeof document !== 'undefined') {
        const dot = document.getElementById('mode-dot');
        const label = document.getElementById('mode-label');

        if (this.currentMode === 'exam') {
          if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-red-500';
          if (label) label.textContent = 'Modo Examen Oficial';
          alert('Modo Examen Oficial Activado: las sugerencias intermedias de Timonel quedan bloqueadas para evaluación.');
        } else {
          if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
          if (label) label.textContent = 'Modo Socrático';
        }
      }
      this.renderSteps();
    }

    renderStudentsGrid(students) {
      if (typeof document === 'undefined') return;
      const grid = document.getElementById('students-grid');
      const countEl = document.getElementById('student-count');
      if (!grid) return;

      const list = students && students.length > 0 ? students : [
        { id: 'self', name: 'Mi Pupitre (Local)', stepsCount: this.derivationSteps.length, status: 'unverified', residue: null, lastEq: this.derivationSteps[this.derivationSteps.length - 1] || '0' }
      ];

      if (countEl) countEl.textContent = String(list.length);

      grid.innerHTML = list.map(st => `
        <div class="bg-[#08080a] border border-white/10 rounded-xl p-3.5 flex flex-col gap-2">
          <div class="flex justify-between items-center text-xs mono">
            <span class="font-bold text-[#f4f1ea]">${this.escapeHtml(st.name)}</span>
            <span class="text-[9px] px-2 py-0.5 rounded font-bold ${st.status === 'numerically_consistent' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/60 text-red-300 border border-red-500/40'}">
              ${st.status === 'numerically_consistent' ? 'CONSISTENCIA MUESTRAL' : 'SIN VERIFICAR'}
            </span>
          </div>
          <div class="bg-[#101014] p-2 rounded text-xs font-mono text-[#dfc285] truncate">
            ${this.escapeHtml(st.lastEq || '...')}
          </div>
          <div class="flex justify-between items-center text-[10px] mono text-[#71717a]">
            <span>Pasos: ${st.stepsCount || 1}</span>
            <span>Residuo: ${Number.isFinite(st.residue) ? st.residue.toExponential(2) : "N/D"}</span>
          </div>
        </div>
      `).join('');
    }

    exportLaTeXReport() {
      const title = document.getElementById('problem-title')?.textContent || 'Derivación';
      let tex = `\\documentclass{article}\n\\usepackage{amsmath}\n\\title{${title} - Registro Timonel}\n\\author{Atelier Matemático}\n\\begin{document}\n\\maketitle\n\n\\section*{Derivación Formal}\n\\begin{align*}\n`;

      this.derivationSteps.forEach((s, idx) => {
        const latexStep = this.mathStringToLaTeX(s);
        tex += `  \\text{Paso ${idx + 1}: } & ${latexStep} \\\\\n`;
      });
      tex += `\\end{align*}\n\n\\textbf{Alcance:} Registro de pasos; no es una certificación. La revisión numérica muestral no demuestra equivalencia ni completitud de raíces.\n\\end{document}`;

      if (typeof window !== 'undefined' && window.AtelierDesktop && window.AtelierDesktop.saveFile && window.isAtelierDesktop) {
        const texFilename = `Reporte_${title.replace(/\s+/g, '_')}.tex`;
        window.AtelierDesktop.saveFile(texFilename, tex, false);
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tex).then(() => {
          alert('Código LaTeX formal copiado al portapapeles con éxito.');
        }).catch(() => {
          alert('Reporte LaTeX generado con éxito.');
        });
      }
    }

    downloadFineArtPlate() {
      if (typeof document === 'undefined') return;
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, 1600, 1000);

      // Marco dorado doble
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, 1500, 900);
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(62, 62, 1476, 876);

      // Título
      ctx.fillStyle = '#c5a059';
      ctx.font = 'bold 20px Space Mono, monospace';
      ctx.fillText('ATELIER MATEMÁTICO · LÁPIZ DE TIMONEL · REGISTRO DE DERIVACIÓN', 100, 120);

      const title = document.getElementById('problem-title')?.textContent || 'Teorema Fundamental';
      ctx.fillStyle = '#f4f1ea';
      ctx.font = 'bold 36px Cinzel, serif';
      ctx.fillText(title, 100, 180);

      // Pasos
      ctx.font = '20px Space Mono, monospace';
      this.derivationSteps.forEach((s, idx) => {
        ctx.fillStyle = '#71717a';
        ctx.fillText(`Paso ${String(idx + 1).padStart(2, '0')}:`, 100, 260 + idx * 60);
        ctx.fillStyle = '#dfc285';
        ctx.fillText(s, 240, 260 + idx * 60);
      });

      // Pie
      ctx.fillStyle = '#71717a';
      ctx.font = '14px Space Mono, monospace';
      ctx.fillText('Registro de práctica · Comprobación por muestras · Sin certificación formal', 100, 900);

      const plateFilename = `Certificacion_Derivacion_${title.replace(/\s+/g, '_')}.png`;
      const plateDataUrl = canvas.toDataURL('image/png');

      if (typeof window !== 'undefined' && window.AtelierDesktop && window.AtelierDesktop.saveFile && window.isAtelierDesktop) {
        window.AtelierDesktop.saveFile(plateFilename, plateDataUrl, true);
      }

      const link = document.createElement('a');
      link.download = plateFilename;
      link.href = plateDataUrl;
      link.click();
    }

    escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    async saveCurrentChalkboardNote() {
      const p = this.currentProblem || {};
      const title = p.title || 'Apunte de Derivación';
      const cat = p.category || 'Álgebra Troncal';
      const stepsCopy = [...(this.derivationSteps || [])];

      const entry = {
        title,
        category: cat,
        presetId: this.currentPresetIdx,
        formulaLatex: (this.derivationSteps && this.derivationSteps[0]) ? this.derivationSteps[0] : (p.initialEquation || ''),
        steps: stepsCopy,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: `Derivación con ${stepsCopy.length} pasos resueltos en silicio.`
      };

      if (typeof window !== 'undefined' && window.AtelierStorage) {
        try {
          await window.AtelierStorage.saveClassroomNote(entry);
        } catch(e) {
          console.warn('Error guardando apunte de aula:', e);
        }
      }
      await this.loadSavedClassroomNotes();
      if (typeof alert !== 'undefined') alert(`Apunte "${title}" archivado con éxito en el cuaderno persistente.`);
    }

    async loadSavedClassroomNotes() {
      if (typeof window === 'undefined' || !window.AtelierStorage) return;
      try {
        const notes = await window.AtelierStorage.getClassroomNotes();
        this.renderNotebookDrawer(notes);
      } catch(e) {
        console.warn('Error recuperando notas de aula:', e);
      }
    }

    renderNotebookDrawer(notes) {
      if (typeof document === 'undefined') return;
      const list = document.getElementById('notebook-list');
      const badge = document.getElementById('saved-notes-count');
      const text = document.getElementById('notebook-count-text');
      const empty = document.getElementById('notebook-empty-state');

      const count = Array.isArray(notes) ? notes.length : 0;
      if (badge) badge.textContent = count;
      if (text) text.textContent = `${count} apuntes guardados en silicio`;

      if (!list) return;

      if (count === 0) {
        if (empty) {
          empty.classList.remove('hidden');
          list.innerHTML = '';
          list.appendChild(empty);
        }
        return;
      }

      if (empty) empty.classList.add('hidden');
      list.innerHTML = '';

      notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'glass rounded-xl p-3.5 border border-white/10 hover:border-[#c5a059]/40 space-y-2 relative transition';
        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[9px] mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 uppercase tracking-widest">${note.category || 'Aula'}</span>
              <h4 class="text-xs serif font-bold text-white mt-1">${note.title}</h4>
            </div>
            <span class="text-[10px] mono text-slate-400">${note.timeFormatted || ''}</span>
          </div>
          <div class="text-[11px] mono text-[#dfc285] bg-black/40 p-2 rounded truncate">
            ${note.formulaLatex || 'Derivación simbólica'}
          </div>
          <div class="flex items-center gap-2 pt-1">
            <button onclick="restoreClassroomNote(${note.id})" class="flex-1 bg-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black text-[#dfc285] text-[10px] mono py-1 px-2 rounded transition font-semibold">
              Cargar en Pizarrón ⤾
            </button>
            <button onclick="deleteClassroomNote(${note.id})" class="bg-black/60 hover:bg-rose-600 text-white w-6 h-6 rounded text-xs flex items-center justify-center transition" title="Eliminar apunte">
              ✕
            </button>
          </div>
        `;
        list.appendChild(card);
      });
    }

    async restoreClassroomNote(id) {
      if (typeof window === 'undefined' || !window.AtelierStorage) return;
      const notes = await window.AtelierStorage.getClassroomNotes();
      const note = notes.find(n => n.id === id);
      if (!note) return;

      this.currentProblem = {
        title: note.title,
        category: note.category,
        desc: note.notes || 'Derivación restaurada desde el cuaderno de aula.',
        initialEquation: note.formulaLatex
      };

      const tEl = document.getElementById('problem-title');
      const cEl = document.getElementById('problem-category');
      const dEl = document.getElementById('problem-desc');
      if (tEl) tEl.textContent = note.title;
      if (cEl) cEl.textContent = note.category;
      if (dEl) dEl.textContent = this.currentProblem.desc;

      if (Array.isArray(note.steps)) {
        this.derivationSteps = [...note.steps];
        this.activeStepIdx = this.derivationSteps.length - 1;
        this.renderSteps();
      }
      this.toggleNotebookDrawer();
    }

    async deleteClassroomNote(id) {
      if (typeof window === 'undefined' || !window.AtelierStorage) return;
      await window.AtelierStorage.deleteClassroomNote(id);
      this.loadSavedClassroomNotes();
    }

    async clearAllClassroomNotes() {
      if (typeof confirm !== 'undefined' && confirm('¿Vaciar todos los apuntes del cuaderno de aula?')) {
        if (typeof window !== 'undefined' && window.AtelierStorage) {
          await window.AtelierStorage.clearClassroomNotes();
        }
        this.loadSavedClassroomNotes();
      }
    }

    async exportClassroomNotesJSON() {
      if (typeof window === 'undefined' || !window.AtelierStorage) return;
      const notes = await window.AtelierStorage.getClassroomNotes();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `Atelier_Cuaderno_Aula_${Date.now()}.json`;
      a.click();
    }

    toggleNotebookDrawer() {
      if (typeof document === 'undefined') return;
      const drawer = document.getElementById('classroom-notebook-drawer');
      if (drawer) drawer.classList.toggle('translate-x-full');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELEGACIÓN PLAYGROUND NAILANG WASM
    // Presets canónicos: tensor_matmul_3x3, elastic_stress_voigt, cellular_homogenization_1d
    // Renderizado en DOM: nailang-memory-display con runResult.memory
    // ─────────────────────────────────────────────────────────────────────────

    toggleClassroomNailangModal() {
      if (this.nailang) this.nailang.toggleClassroomNailangModal();
    }

    loadNailangPreset(name) {
      if (this.nailang) this.nailang.loadNailangPreset(name);
    }

    async executeNailangWasm() {
      if (this.nailang) await this.nailang.executeNailangWasm();
    }

    /**
     * Evaluación segura JIT de expresiones matemáticas en silicio.
     * Evaluación 100% segura mediante AST y Timonel JIT. Delega en JITMathCompiler.compile.
     */
    compileMathExpr(exprStr) {
      if (this.grapher && typeof this.grapher.compileMathExpr === 'function') {
        return this.grapher.compileMathExpr(exprStr);
      }
      if (typeof window !== 'undefined' && window.JITMathCompiler && typeof window.JITMathCompiler.compile === 'function') {
        return window.JITMathCompiler.compile(exprStr, ['x']);
      }
      return () => 0;
    }
  }

  // Instanciar y exportar
  const controller = new ClassroomController();
  root.Classroom = controller;

  // Bindings globales de compatibilidad con onclick HTML
  root.initClassroom = () => controller.init();
  root.setRole = (r, n) => controller.setRole(r, n);
  root.joinRoom = (rc) => controller.joinRoom(rc);
  root.promptJoinRoom = () => controller.promptJoinRoom();
  root.copyRoomLink = () => controller.copyRoomLink();
  root.toggleExamMode = () => controller.toggleExamMode();
  root.loadPreset = (idx) => controller.loadPreset(idx);
  root.newCustomProblem = () => controller.newCustomProblem();
  root.renderSteps = () => controller.renderSteps();
  root.addStep = () => controller.addStep();
  root.deleteStep = (idx) => controller.deleteStep(idx);
  root.resetSteps = () => controller.resetSteps();
  root.insertMathSymbol = (sym) => controller.insertMathSymbol(sym);
  root.calculateAutoSolve = () => controller.calculateAutoSolve();
  root.calculateFactor = () => controller.calculateFactor();
  root.calculateExpand = () => controller.calculateExpand();
  root.calculateDerivative = () => controller.calculateDerivative();
  root.calculateIntegral = () => controller.calculateIntegral();
  root.calculateRoots = () => controller.calculateRoots();
  root.calculateTaylor = () => controller.calculateTaylor();
  root.calculateLimit = () => controller.calculateLimit();
  root.calculateSimplify = () => controller.calculateSimplify();
  root.switchVisorMode = (mode) => controller.switchVisorMode(mode);
  root.zoomGraph = (factor) => controller.zoomGraph(factor);
  root.resetGraphView = () => controller.resetGraphView();
  root.setChalkColor = (col) => controller.setChalkColor(col);
  root.setChalkMode = (mod) => controller.setChalkMode(mod);
  root.clearChalkboard = () => controller.clearChalkboard();
  root.updateJITFields = () => controller.updateJITFields();
  root.renderStudentsGrid = (s) => controller.renderStudentsGrid(s);
  root.exportLaTeXReport = () => controller.exportLaTeXReport();
  root.downloadFineArtPlate = () => controller.downloadFineArtPlate();
  root.saveCurrentChalkboardNote = () => controller.saveCurrentChalkboardNote();
  root.toggleNotebookDrawer = () => controller.toggleNotebookDrawer();
  root.restoreClassroomNote = (id) => controller.restoreClassroomNote(id);
  root.deleteClassroomNote = (id) => controller.deleteClassroomNote(id);
  root.clearAllClassroomNotes = () => controller.clearAllClassroomNotes();
  root.exportClassroomNotesJSON = () => controller.exportClassroomNotesJSON();
  root.toggleClassroomNailangModal = () => controller.toggleClassroomNailangModal();
  root.loadNailangPreset = (name) => controller.loadNailangPreset(name);
  root.executeNailangWasm = () => controller.executeNailangWasm();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = controller;
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => controller.init());
    } else {
      controller.init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
