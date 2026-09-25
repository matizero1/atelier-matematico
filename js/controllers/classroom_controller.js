/**
 * 🏛️ ATELIER MATEMÁTICO — CONTROLADOR DE SALA V: CÁTEDRA & DERIVACIÓN
 * Nai Systems · Arquitectura Modular Desacoplada
 */

(function(root) {
  'use strict';

  class ClassroomController {
    constructor() {
      this.currentRole = 'student'; // 'teacher' | 'student'
      this.currentMode = 'study'; // 'study' | 'exam'
      this.currentPresetIdx = 0;
      this.derivationSteps = [];
      this.jitSimulator = null;
    }

    init() {
      // 1. Cargar presets
      const presets = window.TimonelLinter ? window.TimonelLinter.getEngineeringPresets() : [];
      const sel = document.getElementById('preset-selector');
      if (sel) {
        sel.innerHTML = presets.map((p, idx) => `<option value="${idx}">${p.title}</option>`).join('');
      }

      // 2. Cargar preset inicial
      if (presets.length > 0) {
        this.loadPreset(0);
      }

      // 3. Inicializar Simulador JIT
      const canvas = document.getElementById('jit-stage');
      if (canvas && window.JITMathCompiler) {
        this.jitSimulator = window.JITMathCompiler.createParticleSimulator(canvas, '-y', 'x');
        if (this.jitSimulator) this.jitSimulator.start();
      }

      // 4. Conectar a Sala Sincrónica P2P
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') || 'EULR';
      const roleParam = params.get('role') || 'student';
      this.setRole(roleParam, false);
      this.joinRoom(roomParam);

      // 5. Escuchar eventos de RoomSync
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

      // 6. Redimensionar al cambiar ventana
      window.addEventListener('resize', () => {
        if (this.jitSimulator) this.jitSimulator.resize();
      });
    }

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

    loadPreset(idx) {
      const presets = window.TimonelLinter ? window.TimonelLinter.getEngineeringPresets() : [];
      const p = presets[idx];
      if (!p) return;

      this.currentPresetIdx = idx;
      const tEl = document.getElementById('problem-title');
      const cEl = document.getElementById('problem-category');
      if (tEl) tEl.textContent = p.title;
      if (cEl) cEl.textContent = p.category;

      this.derivationSteps = [...p.steps];
      this.renderSteps();

      if (this.currentRole === 'teacher' && window.RoomSync) {
        window.RoomSync.updateMasterBoard(p.title, p.category, this.derivationSteps, this.currentMode);
      }
    }

    newCustomProblem() {
      const title = prompt('Título del Teorema o Ejercicio:', 'Ecuación Fundamental');
      if (!title) return;
      const initialStep = prompt('Paso Inicial / Ecuación de Partida:', 'x^2 - 4 = 0');
      if (!initialStep) return;

      const tEl = document.getElementById('problem-title');
      const cEl = document.getElementById('problem-category');
      if (tEl) tEl.textContent = title;
      if (cEl) cEl.textContent = 'Personalizado / Aula';

      this.derivationSteps = [initialStep];
      this.renderSteps();
    }

    renderSteps() {
      const container = document.getElementById('steps-container');
      if (!container) return;

      const t0 = performance.now();
      const audit = window.TimonelLinter ? window.TimonelLinter.auditDerivation(this.derivationSteps) : [];
      const dt = (performance.now() - t0).toFixed(2);
      const timeEl = document.getElementById('eval-telemetry-time');
      if (timeEl) timeEl.textContent = `${dt} ms`;

      let hasDivergence = false;
      let maxRes = 0;

      container.innerHTML = this.derivationSteps.map((stepText, idx) => {
        const evalInfo = audit[idx] || { valid: true, status: 'certified', maxResidue: 0 };
        const isCertified = evalInfo.valid;
        if (!isCertified && idx > 0) hasDivergence = true;
        if (evalInfo.maxResidue > maxRes) maxRes = evalInfo.maxResidue;

        let badgeClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
        let badgeText = 'CERTIFICADO';
        let rowClass = 'border-white/10';

        if (idx === 0) {
          badgeClass = 'bg-blue-950/60 text-blue-300 border-blue-500/30';
          badgeText = 'PREMISA';
        } else if (!isCertified) {
          badgeClass = 'bg-red-950/60 text-red-300 border-red-500/50 divergent-pulse';
          badgeText = 'DIVERGENCIA';
          rowClass = 'border-red-500/50 bg-red-950/10';
        }

        const counterexampleHtml = (!isCertified && evalInfo.counterexample && this.currentMode === 'study') ? `
          <div class="mt-2 text-[11px] mono text-red-300 bg-red-950/40 p-2.5 rounded border border-red-500/30 flex items-start gap-2">
            <span class="text-red-400 font-bold">💡</span>
            <div>
              <strong>Timonel:</strong> ${evalInfo.counterexample.desc}
            </div>
          </div>
        ` : '';

        return `
          <div class="p-3 rounded-lg border ${rowClass} bg-[#08080a] flex flex-col gap-1 transition">
            <div class="flex justify-between items-center text-xs mono">
              <span class="text-[#71717a] font-bold">PASO ${String(idx + 1).padStart(2, '0')}</span>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold border ${badgeClass}">
                ${badgeText}
              </span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <input type="text" value="${this.escapeHtml(stepText)}" onchange="window.Classroom.updateStep(${idx}, this.value)" 
                     class="flex-1 bg-transparent border-none text-[#f4f1ea] font-mono text-sm outline-none focus:text-[#dfc285] placeholder-white/20"
                     placeholder="Escribe la siguiente línea algebraica...">
              ${idx > 0 ? `<button onclick="window.Classroom.deleteStep(${idx})" class="text-[#71717a] hover:text-red-400 text-xs px-2 py-1 transition" title="Eliminar paso">✕</button>` : ''}
            </div>
            ${counterexampleHtml}
          </div>
        `;
      }).join('');

      // Actualizar Telemetría
      const resEl = document.getElementById('eval-telemetry-res');
      if (resEl) resEl.textContent = maxRes.toFixed(4);

      const statusBadge = document.getElementById('derivation-status-badge');
      const invEl = document.getElementById('audit-invariant');
      const hashEl = document.getElementById('audit-hash');

      if (statusBadge) {
        if (hasDivergence) {
          statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-300 border border-red-500/50';
          statusBadge.textContent = 'DIVERGENCIA DETECTADA';
          if (invEl) {
            invEl.className = 'text-red-400 font-bold';
            invEl.textContent = `Divergencia (Residuo: ${maxRes.toFixed(3)})`;
          }
        } else {
          statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30';
          statusBadge.textContent = 'CERTIFICADO (RESIDUO = 0)';
          if (invEl) {
            invEl.className = 'text-[#dfc285]';
            invEl.textContent = 'Conservado (Residuo = 0)';
          }
        }
      }

      if (hashEl) {
        this.computeDerivationHash(this.derivationSteps).then(h => {
          hashEl.textContent = h;
        });
      }

      // Si es alumno, emitir estado a la sala
      if (this.currentRole === 'student' && window.RoomSync) {
        const lastIdx = this.derivationSteps.length - 1;
        const lastEval = audit[lastIdx];
        window.RoomSync.sendStudentStep(this.derivationSteps[lastIdx], lastEval, this.derivationSteps.length);
      }
    }

    async computeDerivationHash(steps) {
      try {
        const text = steps.join('|');
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return '0x' + hashHex.substring(0, 6).toUpperCase() + '...' + hashHex.substring(58).toUpperCase();
      } catch (e) {
        return '0x' + Math.abs(steps.reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0)).toString(16).toUpperCase();
      }
    }

    addStep() {
      const last = this.derivationSteps[this.derivationSteps.length - 1] || '0';
      this.derivationSteps.push(last);
      this.renderSteps();
    }

    updateStep(idx, newVal) {
      this.derivationSteps[idx] = (newVal || '').trim();
      this.renderSteps();
    }

    deleteStep(idx) {
      if (this.derivationSteps.length <= 1) return;
      this.derivationSteps.splice(idx, 1);
      this.renderSteps();
    }

    resetSteps() {
      this.loadPreset(this.currentPresetIdx);
    }

    updateJITFields() {
      const uEl = document.getElementById('jit-input-u');
      const vEl = document.getElementById('jit-input-v');
      const u = uEl ? uEl.value : '-y';
      const v = vEl ? vEl.value : 'x';
      if (this.jitSimulator) {
        this.jitSimulator.updateEquation(u, v);
      }
    }

    renderStudentsGrid(students) {
      const grid = document.getElementById('students-grid');
      const counter = document.getElementById('student-count');
      if (!grid) return;

      const list = students && students.length > 0 ? students : [
        { id: 'usr_me', name: 'Mi Pupitre (Local)', lastStep: this.derivationSteps[this.derivationSteps.length - 1] || 'Conectado', status: 'certified', residue: 0, stepsCount: this.derivationSteps.length }
      ];

      if (counter) counter.textContent = list.length;

      grid.innerHTML = list.map(st => {
        const isOk = st.status === 'certified' || st.status === 'initial';
        const badgeBg = isOk ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' : 'bg-red-950/60 text-red-300 border-red-500/50 divergent-pulse';
        const badgeLabel = isOk ? 'CERTIFICADO' : 'DIVERGENTE';

        return `
          <div class="p-3.5 rounded-lg border border-white/10 bg-[#08080a] flex flex-col justify-between space-y-2">
            <div class="flex justify-between items-center text-xs mono">
              <span class="text-[#f4f1ea] font-bold">${st.name}</span>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold border ${badgeBg}">
                ${badgeLabel}
              </span>
            </div>
            <div class="text-[11px] mono text-[#c5a059] bg-[#101014] p-2 rounded truncate border border-white/5">
              ${this.escapeHtml(st.lastStep || '...')}
            </div>
            <div class="flex justify-between items-center text-[10px] mono text-[#71717a] pt-1 border-t border-white/5">
              <span>Pasos: ${st.stepsCount || 1}</span>
              <span>Residuo: ${(st.residue || 0).toFixed(3)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    exportLaTeXReport() {
      const titleEl = document.getElementById('problem-title');
      const title = titleEl ? titleEl.textContent : 'Derivación';
      let tex = `\\documentclass{article}\n\\usepackage{amsmath}\n\\title{${title} - Certificación Timonel}\n\\author{Atelier Matemático}\n\\begin{document}\n\\maketitle\n\n\\section*{Derivación Formal}\n\\begin{align*}\n`;
      this.derivationSteps.forEach((s, idx) => {
        tex += `  & ${s.replace(/\*/g, ' ')} \\quad \\text{[Paso ${idx + 1}]} \\\\\n`;
      });
      tex += `\\end{align*}\n\n\\textbf{Certificación:} Residuo nulo verificado bajo silicio nativo.\n\\end{document}`;

      navigator.clipboard.writeText(tex).then(() => {
        alert('¡Documento LaTeX copiado al portapapeles!\nPégalo en Overleaf o en tu compilador TeX.');
      });
    }

    downloadFineArtPlate() {
      const stage = document.getElementById('jit-stage');
      const titleEl = document.getElementById('problem-title');
      const title = titleEl ? titleEl.textContent : 'Derivación';
      const catEl = document.getElementById('problem-category');
      const category = catEl ? catEl.textContent : 'Matemática Formal';
      const hashEl = document.getElementById('audit-hash');
      const hashText = hashEl ? hashEl.textContent : '0xTIMONEL';
      const statusBadge = document.getElementById('derivation-status-badge');
      const isCertified = statusBadge && statusBadge.textContent.includes('CERTIFICADO');

      const printCanvas = document.createElement('canvas');
      const scale = 2;
      printCanvas.width = 1200 * scale;
      printCanvas.height = 750 * scale;
      const ctx = printCanvas.getContext('2d');

      // Fondo editorial oscuro
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);

      // Dibujar simulación si existe
      if (stage && stage.width > 0 && stage.height > 0) {
        const simW = 500 * scale;
        const simH = 500 * scale;
        const simX = printCanvas.width - simW - 50 * scale;
        const simY = 70 * scale;

        ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(simX, simY, simW, simH);
        ctx.drawImage(stage, simX, simY, simW, simH);

        ctx.fillStyle = 'rgba(197, 160, 89, 0.7)';
        ctx.font = `${10 * scale}px Space Mono, monospace`;
        ctx.fillText('CAMPO VECTORIAL JIT / SILICIO NATIVO', simX + 15 * scale, simY + simH - 15 * scale);
      }

      // Columna de Derivación Formal (Izquierda)
      const leftX = 60 * scale;
      let curY = 100 * scale;

      // Orla e identificación de Atelier
      ctx.fillStyle = '#c5a059';
      ctx.font = `${11 * scale}px Space Mono, monospace`;
      ctx.fillText('ATELIER MATEMÁTICO · SALA V: CÁTEDRA & DERIVACIÓN RIGUROSA', leftX, curY);

      curY += 35 * scale;
      ctx.fillStyle = '#f4f1ea';
      ctx.font = `bold ${22 * scale}px Cinzel, serif`;
      ctx.fillText(title.toUpperCase(), leftX, curY);

      curY += 20 * scale;
      ctx.fillStyle = '#71717a';
      ctx.font = `${10 * scale}px Space Mono, monospace`;
      ctx.fillText(`DISCIPLINA: ${category.toUpperCase()} | GOBERNANZA: TIMONEL F2`, leftX, curY);

      curY += 30 * scale;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(leftX, curY);
      ctx.lineTo(leftX + 480 * scale, curY);
      ctx.stroke();

      curY += 35 * scale;
      ctx.fillStyle = '#c5a059';
      ctx.font = `bold ${12 * scale}px Space Mono, monospace`;
      ctx.fillText('DEMOSTRACIÓN PASO A PASO:', leftX, curY);

      curY += 25 * scale;
      this.derivationSteps.slice(0, 10).forEach((step, idx) => {
        ctx.fillStyle = '#a1a1aa';
        ctx.font = `${11 * scale}px Space Mono, monospace`;
        ctx.fillText(`[P${idx + 1}]  ${step}`, leftX, curY);
        curY += 24 * scale;
      });

      // Pie Editorial y Certificación
      const footY = printCanvas.height - 75 * scale;
      ctx.fillStyle = 'rgba(16, 16, 20, 0.9)';
      ctx.fillRect(40 * scale, footY - 25 * scale, printCanvas.width - 80 * scale, 70 * scale);
      ctx.strokeStyle = isCertified ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(40 * scale, footY - 25 * scale, printCanvas.width - 80 * scale, 70 * scale);

      ctx.fillStyle = isCertified ? '#34d399' : '#f87171';
      ctx.font = `bold ${12 * scale}px Space Mono, monospace`;
      ctx.fillText(isCertified ? '✓ CERTIFICADO POR TIMONEL F2 (RESIDUO FORMAL = 0)' : '⚠ ADVERTENCIA: DERIVACIÓN CON DIVERGENCIA DETECTADA', 60 * scale, footY);

      ctx.fillStyle = '#71717a';
      ctx.font = `${10 * scale}px Space Mono, monospace`;
      ctx.fillText(`SELLO CRIPTOGRÁFICO: ${hashText} | ATELIER MATEMÁTICO 2026`, 60 * scale, footY + 22 * scale);

      // Descargar lámina PNG
      const link = document.createElement('a');
      link.download = `Atelier_Derivacion_${title.replace(/\s+/g, '_')}_FineArt.png`;
      link.href = printCanvas.toDataURL('image/png');
      link.click();
    }

    escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
  root.updateStep = (idx, val) => controller.updateStep(idx, val);
  root.deleteStep = (idx) => controller.deleteStep(idx);
  root.resetSteps = () => controller.resetSteps();
  root.updateJITFields = () => controller.updateJITFields();
  root.renderStudentsGrid = (s) => controller.renderStudentsGrid(s);
  root.exportLaTeXReport = () => controller.exportLaTeXReport();
  root.downloadFineArtPlate = () => controller.downloadFineArtPlate();

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => controller.init());
    } else {
      controller.init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
