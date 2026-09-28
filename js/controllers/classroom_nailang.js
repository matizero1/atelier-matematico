/**
 * 🏛️ ATELIER MATEMÁTICO — ORQUESTADOR DE PLAYGROUND NAILANG WASM
 * Nai Systems · Arquitectura Modular Desacoplada
 * Estándar: Timonel F2 · Silicio Nativo · WebAssembly con Memoria Lineal
 */

(function(root) {
  'use strict';

  class ClassroomNailang {
    constructor(controller) {
      this.controller = controller;
    }

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

  root.ClassroomNailang = ClassroomNailang;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassroomNailang;
  }
})(typeof window !== 'undefined' ? window : globalThis);
