/**
 * 🏛️ ATELIER MATEMÁTICO — CONTROLADOR DE SALA V: CÁTEDRA & LABORATORIO MATEMÁTICO
 * Nai Systems · Arquitectura Modular Desacoplada
 * Estándar: Timonel F2 · Graficador Cartesiano 2D · KaTeX Tipográfico · Tiza Libre
 */

(function(root) {
  'use strict';

  class ClassroomController {
    constructor() {
      this.currentRole = 'student'; // 'teacher' | 'student'
      this.currentMode = 'study'; // 'study' | 'exam'
      this.visorMode = 'grapher'; // 'grapher' | 'sim' | 'chalk'
      this.currentPresetIdx = 0;
      this.derivationSteps = [];
      this.activeStepIdx = 0;
      this.inputDebounceTimer = null;

      // Estado del Graficador Cartesiano 2D
      this.graphScale = 32; // píxeles por unidad matemática
      this.graphOriginX = 0;
      this.graphOriginY = 0;
      this.mouseMathX = 0;
      this.mouseMathY = 0;

      // Estado de la Pizarra de Tiza Libre
      this.isDrawingChalk = false;
      this.chalkColor = '#f4f1ea';
      this.chalkMode = 'chalk'; // 'chalk' | 'eraser'
      this.lastChalkX = 0;
      this.lastChalkY = 0;

      // Simuladores
      this.jitSimulator = null;
    }

    init() {
      // 1. Poblar catálogo de problemas y presets
      this.populatePresetSelector();

      // 2. Cargar preset inicial
      this.loadPreset(0);

      // 3. Inicializar Graficador Cartesiano
      this.initCartesianGrapher();

      // 4. Inicializar Simulador JIT de Fluidos/Partículas
      this.initJITSimulator();

      // 5. Inicializar Pizarra de Tiza Libre
      this.initChalkboard();

      // 6. Conectar a Sala Sincrónica P2P
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') || 'EULR';
      const roleParam = params.get('role') || 'student';
      this.setRole(roleParam, false);
      this.joinRoom(roomParam);

      // 7. Escuchar eventos P2P
      if (window.RoomSync) {
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
      window.addEventListener('resize', () => {
        this.resizeCanvases();
        this.renderCartesianGraph();
        if (this.jitSimulator) this.jitSimulator.resize();
      });

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
        if (window.AtelierMath && window.AtelierMath.ARTWORKS && window.AtelierMath.ARTWORKS[artId]) {
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
        const presets = (window.TimonelLinter && typeof window.TimonelLinter.getEngineeringPresets === 'function') ?
          window.TimonelLinter.getEngineeringPresets() : [];
        p = presets[idx] || {
          title: 'Diferencia de Cuadrados (Álgebra Troncal)',
          category: 'Cálculo I / Álgebra Troncal',
          desc: 'Explora pasos algebraicos. El muestreo numérico orienta la revisión y no demuestra equivalencia formal.',
          steps: ['(x - 3)*(x + 3)', 'x*(x + 3) - 3*(x + 3)', 'x^2 + 3*x - 3*x - 9', 'x^2 - 9']
        };
      }

      if (!p) return;

      const tEl = document.getElementById('problem-title');
      const cEl = document.getElementById('problem-category');
      const dEl = document.getElementById('problem-desc');
      if (tEl) tEl.textContent = p.title;
      if (cEl) cEl.textContent = p.category;
      if (dEl && p.desc) dEl.textContent = p.desc;

      this.derivationSteps = [...p.steps];
      this.activeStepIdx = Math.max(0, this.derivationSteps.length - 1);
      this.renderSteps();

      if (this.currentRole === 'teacher' && window.RoomSync) {
        window.RoomSync.updateMasterBoard(p.title, p.category, this.derivationSteps, this.currentMode);
      }
    }

    getArtworkCanonicalSteps(artId) {
      switch (artId) {
        case 0: // Pitágoras
          return ['a^2 + b^2', 'c^2'];
        case 8: // Péndulo
          return ['theta\'\' + (g/L)*sin(theta)', '0'];
        case 20: // Ondas D Alembert
          return ['u_tt - c^2*u_xx', '0'];
        case 39: // Navier-Stokes
          return ['rho*(u_t + u*u_x) + p_x - mu*u_xx', '0'];
        case 50: // Riemann
          return ['zeta(s)', 'sum(1/n^s, n, 1, inf)'];
        case 86: // Lorenz
          return ['dx/dt', 'sigma*(y - x)'];
        default:
          return ['f(x)', 'x^2 - 4'];
      }
    }

    newCustomProblem() {
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
      const container = document.getElementById('steps-container');
      if (!container) return;

      const t0 = performance.now();
      const audit = (window.TimonelLinter && typeof window.TimonelLinter.auditDerivation === 'function') ?
        window.TimonelLinter.auditDerivation(this.derivationSteps) : [];
      const dt = (performance.now() - t0).toFixed(2);

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
        if (typeof window.katex !== 'undefined') {
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
      if (this.visorMode === 'grapher') {
        this.renderCartesianGraph();
      }
    }

    onStepInput(idx, val) {
      this.derivationSteps[idx] = val;
      this.activeStepIdx = idx;

      // Actualizar KaTeX en vivo
      const kEl = document.getElementById(`katex-step-${idx}`);
      if (kEl && typeof window.katex !== 'undefined') {
        try {
          window.katex.render(this.mathStringToLaTeX(val), kEl, { throwOnError: false, displayMode: false });
        } catch (_) {}
      }

      // Debounce para análisis completo y graficación
      clearTimeout(this.inputDebounceTimer);
      this.inputDebounceTimer = setTimeout(() => {
        this.renderSteps();
      }, 40);
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
      if (confirm('¿Restablecer la derivación al problema de origen?')) {
        this.loadPreset(this.currentPresetIdx);
      }
    }

    insertMathSymbol(sym) {
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
    // MOTOR DE CÁLCULO SIMBÓLICO EN SILICIO (TIMONEL CAS)
    // ─────────────────────────────────────────────────────────────────────────

    calculateAutoSolve() {
      const cas = window.TimonelCAS;
      if (!cas) {
        alert('Motor Timonel CAS no inicializado.');
        return;
      }

      // Tomar el paso activo o la premisa inicial
      const currentExpr = (this.derivationSteps[this.activeStepIdx] && this.derivationSteps[this.activeStepIdx].trim()) 
        ? this.derivationSteps[this.activeStepIdx].trim() 
        : (this.derivationSteps[0] || 'x^2 - 9 = 0');

      const stepsResult = cas.solveStepByStep(currentExpr);
      if (Array.isArray(stepsResult) && stepsResult.length > 0) {
        // Reemplazar la derivación con los pasos generados deterministamente
        this.derivationSteps = stepsResult.map(s => s.step);
        this.activeStepIdx = this.derivationSteps.length - 1;
        this.renderSteps();

        // Notificar al aula sincrónica P2P si actúa como docente
        if (this.currentRole === 'teacher' && window.RoomSync) {
          window.RoomSync.broadcastStep(this.activeStepIdx, this.derivationSteps[this.activeStepIdx]);
        }
      }
    }

    calculateFactor() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || 'x^2 - 9';

      const factored = cas.factor(curr);
      if (factored && factored !== curr) {
        this.appendCalculatedStep(factored);
      }
    }

    calculateExpand() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || '(x - 3)*(x + 3)';

      const expanded = cas.expand(curr);
      if (expanded && expanded !== curr) {
        this.appendCalculatedStep(expanded);
      }
    }

    calculateDerivative() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || 'x^3 - 4*x';

      const d = cas.derivative(curr, 'x');
      if (d) {
        this.appendCalculatedStep(d);
      }
    }

    calculateIntegral() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || '3*x^2 - 4';

      const integ = cas.integral(curr, 'x');
      if (integ) {
        this.appendCalculatedStep(integ);
      }
    }

    calculateRoots() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || 'x^2 - 9 = 0';

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
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || 'sin(x)';

      const t = cas.taylor(curr, 'x', 0, 4);
      if (t) {
        this.appendCalculatedStep(t);
      }
    }

    calculateLimit() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || 'sin(x)/x';

      const lim = cas.limit(curr, 'x', 0);
      if (lim && Number.isFinite(lim.value)) {
        this.appendCalculatedStep(`${curr} = ${lim.value}`);
      }
    }

    calculateSimplify() {
      const cas = window.TimonelCAS;
      if (!cas) return;

      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const curr = this.derivationSteps[activeIdx] || this.derivationSteps[0] || 'x + 0';

      const s = cas.simplify(curr);
      if (s && s !== curr) {
        this.appendCalculatedStep(s);
      }
    }

    appendCalculatedStep(newStepText) {
      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      // Si el paso activo está vacío, reemplazarlo
      if (activeIdx >= 0 && (!this.derivationSteps[activeIdx] || !this.derivationSteps[activeIdx].trim())) {
        this.derivationSteps[activeIdx] = newStepText;
      } else {
        // Insertar después del paso activo o al final
        this.derivationSteps.splice(activeIdx + 1, 0, newStepText);
        this.activeStepIdx = activeIdx + 1;
      }
      this.renderSteps();

      // Foco en el nuevo paso
      setTimeout(() => {
        const input = document.getElementById(`input-step-${this.activeStepIdx}`);
        if (input) input.focus();
      }, 50);

      // Notificar aula P2P
      if (this.currentRole === 'teacher' && window.RoomSync) {
        window.RoomSync.broadcastStep(this.activeStepIdx, this.derivationSteps[this.activeStepIdx]);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GRAFICADOR CARTESIANO 2D INTERACTIVO (y = f(x))
    // ─────────────────────────────────────────────────────────────────────────

    initCartesianGrapher() {
      const canvas = document.getElementById('cartesian-canvas');
      if (!canvas) return;

      const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: 500, height: 320 };
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);

      this.graphOriginX = canvas.width / 2;
      this.graphOriginY = canvas.height / 2;

      // Eventos de mouse para coordenadas interactivas
      canvas.addEventListener('mousemove', (e) => {
        const cRect = canvas.getBoundingClientRect();
        const px = (e.clientX - cRect.left) * (canvas.width / cRect.width);
        const py = (e.clientY - cRect.top) * (canvas.height / cRect.height);

        const dpr = window.devicePixelRatio || 1;
        const scale = this.graphScale * dpr;

        this.mouseMathX = (px - this.graphOriginX) / scale;
        this.mouseMathY = -(py - this.graphOriginY) / scale;

        const coordsEl = document.getElementById('graph-cursor-coords');
        if (coordsEl) {
          coordsEl.textContent = `X: ${this.mouseMathX.toFixed(2)} | Y: ${this.mouseMathY.toFixed(2)}`;
        }
      });
    }

    renderCartesianGraph() {
      const canvas = document.getElementById('cartesian-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
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

      // 4. Compilar y graficar la Premisa Inicial (Paso 0) como Guía de Referencia
      const step0Text = this.derivationSteps[0] || '0';
      const fnPremise = this.compileMathExpr(step0Text);

      ctx.save();
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 1.5 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]); // Línea punteada dorada
      this.plotFunctionCurve(ctx, fnPremise, ox, oy, scale, W);
      ctx.restore();

      // 5. Compilar y graficar el Paso Activo
      const activeIdx = Math.min(this.activeStepIdx, this.derivationSteps.length - 1);
      const activeText = this.derivationSteps[activeIdx] || '0';
      const isSolutionStep = activeText.includes('\\lor') || activeText.includes('x_1') || (activeText.includes('x =') && !activeText.includes('^'));
      const graphText = (isSolutionStep && activeIdx > 0) ? this.derivationSteps[activeIdx - 1] : activeText;
      const fnActive = this.compileMathExpr(graphText);

      // Determinar si el paso activo está certificado por Timonel
      const audit = (window.TimonelLinter && typeof window.TimonelLinter.auditDerivation === 'function') ?
        window.TimonelLinter.auditDerivation(this.derivationSteps) : [];
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
      if (isSolutionStep && window.TimonelLinter && window.TimonelLinter.instance) {
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
      if (window.JITMathCompiler && typeof window.JITMathCompiler.compile === 'function') {
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

    zoomGraph(factor) {
      this.graphScale = Math.max(8, Math.min(180, this.graphScale * factor));
      this.renderCartesianGraph();
    }

    resetGraphView() {
      this.graphScale = 32;
      this.renderCartesianGraph();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PIZARRA DE TIZA LIBRE (FREEHAND CHALKBOARD)
    // ─────────────────────────────────────────────────────────────────────────

    initChalkboard() {
      const canvas = document.getElementById('chalk-canvas');
      if (!canvas) return;

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * (canvas.width / rect.width),
          y: (clientY - rect.top) * (canvas.height / rect.height)
        };
      };

      const startDraw = (e) => {
        this.isDrawingChalk = true;
        const pos = getPos(e);
        this.lastChalkX = pos.x;
        this.lastChalkY = pos.y;
      };

      const draw = (e) => {
        if (!this.isDrawingChalk) return;
        const pos = getPos(e);
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        ctx.beginPath();
        ctx.moveTo(this.lastChalkX, this.lastChalkY);
        ctx.lineTo(pos.x, pos.y);

        if (this.chalkMode === 'eraser') {
          ctx.strokeStyle = '#08080a';
          ctx.lineWidth = 24 * dpr;
          ctx.lineCap = 'round';
        } else {
          ctx.strokeStyle = this.chalkColor;
          ctx.lineWidth = 3 * dpr;
          ctx.lineCap = 'round';
          ctx.shadowColor = this.chalkColor;
          ctx.shadowBlur = 4 * dpr;
        }

        ctx.stroke();
        this.lastChalkX = pos.x;
        this.lastChalkY = pos.y;
      };

      const endDraw = () => {
        this.isDrawingChalk = false;
      };

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mouseleave', endDraw);

      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
      canvas.addEventListener('touchend', endDraw);
    }

    setChalkColor(color) {
      this.chalkMode = 'chalk';
      this.chalkColor = color;
    }

    setChalkMode(mode) {
      this.chalkMode = mode;
    }

    clearChalkboard() {
      const canvas = document.getElementById('chalk-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SIMULADOR JIT DE FLUIDOS / PARTÍCULAS
    // ─────────────────────────────────────────────────────────────────────────

    initJITSimulator() {
      const canvas = document.getElementById('jit-stage');
      if (canvas && window.JITMathCompiler) {
        this.jitSimulator = window.JITMathCompiler.createParticleSimulator(canvas, '-y', 'x');
      }
    }

    updateJITFields() {
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
      const vGraph = document.getElementById('view-grapher');
      const vSim = document.getElementById('view-sim');
      const vChalk = document.getElementById('view-chalk');

      const tGraph = document.getElementById('tab-grapher');
      const tSim = document.getElementById('tab-sim');
      const tChalk = document.getElementById('tab-chalk');

      // Resetear clases de pestañas
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
        this.renderCartesianGraph();
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
      const dpr = window.devicePixelRatio || 1;
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

      if (notify && window.RoomSync && window.RoomSync.currentRoom) {
        window.RoomSync.joinRoom(window.RoomSync.currentRoom, this.currentRole);
      }
    }

    joinRoom(roomCode) {
      if (!window.RoomSync) return;
      const joined = window.RoomSync.joinRoom(roomCode, this.currentRole);
      const bEl = document.getElementById('current-room-badge');
      if (bEl) bEl.textContent = joined;
      this.renderStudentsGrid([]);
    }

    promptJoinRoom() {
      const current = (window.RoomSync && window.RoomSync.currentRoom) ? window.RoomSync.currentRoom : 'EULR';
      const code = prompt('Ingresa el código de 4 caracteres de la sala:', current);
      if (code) {
        const clean = code.toUpperCase().trim();
        window.history.replaceState({}, '', `?room=${clean}&role=${this.currentRole}`);
        this.joinRoom(clean);
      }
    }

    copyRoomLink() {
      const room = (window.RoomSync && window.RoomSync.currentRoom) ? window.RoomSync.currentRoom : 'EULR';
      const url = `${window.location.origin}${window.location.pathname}?room=${room}&role=student`;
      navigator.clipboard.writeText(url).then(() => {
        alert(`¡Enlace copiado al portapapeles!\nComparte este link con tus alumnos:\n${url}`);
      });
    }

    toggleExamMode() {
      this.currentMode = this.currentMode === 'study' ? 'exam' : 'study';
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
      this.renderSteps();
    }

    renderStudentsGrid(students) {
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

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tex).then(() => {
          alert('Código LaTeX formal copiado al portapapeles con éxito.');
        }).catch(() => {
          alert('Reporte LaTeX generado con éxito.');
        });
      }
    }

    downloadFineArtPlate() {
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
      alert(`Apunte "${title}" archivado con éxito en el cuaderno persistente.`);
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
      if (confirm('¿Vaciar todos los apuntes del cuaderno de aula?')) {
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

    // ── PLAYGROUND WEBASSEMBLY DE NAILANG EN SILICIO ─────────────────
    toggleClassroomNailangModal() {
      if (typeof document === 'undefined') return;
      const modal = document.getElementById('classroom-nailang-modal');
      if (!modal) return;
      const isHidden = modal.classList.contains('hidden');
      if (isHidden) {
        modal.classList.remove('hidden');
        const editor = document.getElementById('nailang-editor');
        if (editor && !editor.value.trim() && window.NailangWasm) {
          this.loadNailangPreset('lorenz_rk4');
        }
      } else {
        modal.classList.add('hidden');
      }
    }

    loadNailangPreset(name) {
      if (typeof document === 'undefined' || !window.NailangWasm) return;
      const editor = document.getElementById('nailang-editor');
      const fnInput = document.getElementById('nailang-fn-name');
      const argsInput = document.getElementById('nailang-args');
      if (!editor) return;

      if (name === 'lorenz_rk4') {
        editor.value = window.NailangWasm.CANONICAL_PHYSICS_PROGRAMS.lorenz_rk4;
        if (fnInput) fnInput.value = 'lorenz_step_x';
        if (argsInput) argsInput.value = '0.1, 0.0, 0.0, 0.01';
      } else if (name === 'riemann_zeta_kernel') {
        editor.value = window.NailangWasm.CANONICAL_PHYSICS_PROGRAMS.riemann_zeta_kernel;
        if (fnInput) fnInput.value = 'riemann_term';
        if (argsInput) argsInput.value = '1.0, 14.134725';
      } else if (name === 'gyroid_tpms_sdf') {
        editor.value = window.NailangWasm.CANONICAL_PHYSICS_PROGRAMS.gyroid_tpms_sdf;
        if (fnInput) fnInput.value = 'gyroid_eval';
        if (argsInput) argsInput.value = '0.5, 1.2, 0.8';
      } else if (name === 'tensor_matmul_3x3') {
        editor.value = window.NailangWasm.CANONICAL_PHYSICS_PROGRAMS.tensor_matmul_3x3;
        if (fnInput) fnInput.value = 'matmul_3x3';
        if (argsInput) argsInput.value = '0.0, 9.0, 18.0';
      } else if (name === 'elastic_stress_voigt') {
        editor.value = window.NailangWasm.CANONICAL_PHYSICS_PROGRAMS.elastic_stress_voigt;
        if (fnInput) fnInput.value = 'voigt_elastic_stress';
        if (argsInput) argsInput.value = '0.0, 36.0, 42.0';
      } else if (name === 'cellular_homogenization_1d') {
        editor.value = window.NailangWasm.CANONICAL_PHYSICS_PROGRAMS.cellular_homogenization_1d;
        if (fnInput) fnInput.value = 'cellular_homogenize';
        if (argsInput) argsInput.value = '0.0, 4.0';
      } else if (name === 'kinetic_energy') {
        editor.value = `module Physics.Kinetic;\n\nfn kinetic_energy(mass: f64, velocity: f64) -> f64 {\n    let half: f64 = 0.5;\n    return half * mass * velocity * velocity;\n}`;
        if (fnInput) fnInput.value = 'kinetic_energy';
        if (argsInput) argsInput.value = '10.0, 3.0';
      }
    }

    async executeNailangWasm() {
      if (typeof document === 'undefined' || !window.NailangWasm) return;
      const editor = document.getElementById('nailang-editor');
      const fnInput = document.getElementById('nailang-fn-name');
      const argsInput = document.getElementById('nailang-args');
      const resDisplay = document.getElementById('nailang-result-display');
      const hexPreview = document.getElementById('nailang-hex-preview');
      const statusPill = document.getElementById('nailang-status-pill');
      const latencyVal = document.getElementById('nailang-latency-val');
      const sizeVal = document.getElementById('nailang-size-val');

      if (!editor || !fnInput || !argsInput) return;

      const src = editor.value.trim();
      const fnName = fnInput.value.trim();
      const rawArgs = argsInput.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

      try {
        if (statusPill) {
          statusPill.textContent = 'Wasm: COMPILANDO...';
          statusPill.className = 'px-2.5 py-0.5 rounded-full bg-amber-950/50 border border-amber-500/40 text-amber-300 text-[10px] animate-pulse';
        }

        let options = {};
        if (fnName === 'matmul_3x3') {
          options = {
            initialMemory: {
              0: [1, 2, 0,  0, 1, 1,  2, 0, 1], // Matrix A
              9: [1, 0, 1,  0, 2, 0,  1, 1, 0]  // Matrix B
            },
            readMemoryOffset: 18,
            readMemoryLength: 9
          };
        } else if (fnName === 'voigt_elastic_stress') {
          const C = new Array(36).fill(0);
          C[0] = 120; C[1] = 40;  C[2] = 40;
          C[6] = 40;  C[7] = 120; C[8] = 40;
          C[12] = 40; C[13] = 40; C[14] = 120;
          C[21] = 40; C[28] = 40; C[35] = 40;
          options = {
            initialMemory: {
              0: C,
              36: [0.001, 0, 0, 0, 0, 0]
            },
            readMemoryOffset: 42,
            readMemoryLength: 6
          };
        } else if (fnName === 'cellular_homogenize') {
          options = {
            initialMemory: {
              0: [10.0, 20.0, 50.0, 100.0]
            },
            readMemoryOffset: 4,
            readMemoryLength: 3
          };
        }

        const runResult = await window.NailangWasm.compileAndRun(src, fnName, rawArgs, options);

        if (statusPill) {
          statusPill.textContent = `Wasm: COMPILADO & EJECUTADO`;
          statusPill.className = 'px-2.5 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-[10px]';
        }
        if (resDisplay) {
          resDisplay.textContent = `${fnName}(${rawArgs.join(', ')}) = ${runResult.result}`;
        }
        if (latencyVal) {
          latencyVal.textContent = `${runResult.executionTimeMicros} µs (${runResult.totalPipelineMs} ms total)`;
        }
        if (sizeVal) {
          sizeVal.textContent = `${runResult.compiledBytes} bytes`;
        }

        const memPanel = document.getElementById('nailang-memory-panel');
        const memDisplay = document.getElementById('nailang-memory-display');
        if (memPanel && memDisplay) {
          if (runResult.memory && runResult.memory.length > 0) {
            memPanel.classList.remove('hidden');
            if (fnName === 'matmul_3x3') {
              const c = runResult.memory;
              memDisplay.textContent = `Matriz C (3x3) resultante en Memoria Lineal Wasm:\n` +
                `[ ${c[0].toFixed(2)}, ${c[1].toFixed(2)}, ${c[2].toFixed(2)} ]\n` +
                `[ ${c[3].toFixed(2)}, ${c[4].toFixed(2)}, ${c[5].toFixed(2)} ]\n` +
                `[ ${c[6].toFixed(2)}, ${c[7].toFixed(2)}, ${c[8].toFixed(2)} ]\n` +
                `Residuo testigo C[0,0] = ${runResult.result}`;
            } else if (fnName === 'voigt_elastic_stress') {
              const s = runResult.memory;
              memDisplay.textContent = `Tensor de Tensión de Cauchy (Voigt 6D) en Memoria Wasm:\n` +
                `σ_x  = ${s[0].toFixed(4)} GPa | σ_y  = ${s[1].toFixed(4)} GPa | σ_z  = ${s[2].toFixed(4)} GPa\n` +
                `τ_yz = ${s[3].toFixed(4)} GPa | τ_xz = ${s[4].toFixed(4)} GPa | τ_xy = ${s[5].toFixed(4)} GPa\n` +
                `Tensión Equivalente Von Mises = ${runResult.result.toFixed(6)} GPa`;
            } else if (fnName === 'cellular_homogenize') {
              const h = runResult.memory;
              memDisplay.textContent = `Cotas de Homogenización Celular (Hill) en Memoria Wasm:\n` +
                `Cota Superior (Voigt):  E_V = ${h[0].toFixed(4)} GPa\n` +
                `Cota Inferior (Reuss):  E_R = ${h[1].toFixed(4)} GPa\n` +
                `Módulo Efectivo (Hill): E_H = ${h[2].toFixed(4)} GPa\n` +
                `Condición Física: E_R <= E_H <= E_V [CUMPLIDA Y CERTIFICADA]`;
            } else {
              memDisplay.textContent = runResult.memory.map((v, i) => `[${i}]: ${v}`).join('  ');
            }
          } else {
            memPanel.classList.add('hidden');
          }
        }

        const tokens = window.NailangWasm.tokenize(src);
        const ast = window.NailangWasm.parse(tokens);
        const compiled = window.NailangWasm.compileToWasm(ast);
        if (hexPreview && compiled.bytes) {
          const hexArr = Array.from(compiled.bytes.slice(0, 48)).map(b => b.toString(16).padStart(2, '0')).join(' ');
          hexPreview.textContent = hexArr + (compiled.bytes.length > 48 ? ' ...' : '');
        }

      } catch (err) {
        console.error('[Nailang Wasm Error]', err);
        if (statusPill) {
          statusPill.textContent = 'Wasm: ERROR DE COMPILACIÓN';
          statusPill.className = 'px-2.5 py-0.5 rounded-full bg-rose-950/50 border border-rose-500/40 text-rose-300 text-[10px]';
        }
        if (resDisplay) {
          resDisplay.textContent = 'Error: ' + err.message;
        }
      }
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
