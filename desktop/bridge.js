/**
 * 🛰️ TIMONEL DESKTOP BRIDGE — PUENTE BIDIRECCIONAL SILICIO NATIVO
 * Atelier Matemático © 2026 Nai Systems
 * 
 * Expone capacidades del hardware local Apple Silicon sin limitaciones de sandbox:
 * 1. Acceso a especificaciones del silicio (Chip, Cores, Metal GPU, RAM).
 * 2. Guardado directo de archivos (PNG 300 DPI, LaTeX, Reportes) en disco local.
 * 3. Ejecución de kernels compilados de C/Nailang.
 */

(function(root) {
  'use strict';

  root.isAtelierDesktop = true;

  const callbacks = {};
  let nextCallbackId = 1;

  root.AtelierDesktop = {
    isNative: true,
    version: '2.4.0-silicon',

    /**
     * Solicita especificaciones de hardware al host macOS nativo
     */
    getSystemSpecs() {
      return new Promise((resolve) => {
        const id = nextCallbackId++;
        callbacks[id] = resolve;
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.timonelDesktop) {
          window.webkit.messageHandlers.timonelDesktop.postMessage({
            action: 'getSystemSpecs',
            callbackId: id
          });
        } else {
          resolve({
            chip: 'Apple Silicon (Emulado)',
            cores: navigator.hardwareConcurrency || 8,
            memory: 'Memoria Unificada Nativa',
            os: 'macOS Darwin'
          });
        }
      });
    },

    /**
     * Guarda un archivo directamente al disco del usuario (ej. ~/Downloads)
     */
    saveFile(filename, base64OrText, isBase64 = false) {
      return new Promise((resolve) => {
        const id = nextCallbackId++;
        callbacks[id] = resolve;
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.timonelDesktop) {
          window.webkit.messageHandlers.timonelDesktop.postMessage({
            action: 'saveFile',
            filename,
            data: base64OrText,
            isBase64,
            callbackId: id
          });
        } else {
          // Fallback navegador
          resolve({ success: false, reason: 'No host bridge' });
        }
      });
    },

    /**
     * Navega a una sala del Atelier mediante el host nativo
     */
    navigateToRoom(roomHtml) {
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.timonelDesktop) {
        window.webkit.messageHandlers.timonelDesktop.postMessage({
          action: 'navigate',
          target: roomHtml
        });
      } else {
        window.location.href = roomHtml;
      }
    },

    /**
     * Método interno invocado por el host Swift al completar una acción asíncrona
     */
    _dispatchCallback(id, result) {
      if (callbacks[id]) {
        callbacks[id](result);
        delete callbacks[id];
      }
    }
  };

  // Ajustes visuales automáticos para entorno de escritorio
  document.addEventListener('DOMContentLoaded', () => {
    // Añadir distintivo visual de modo escritorio en el header si existe
    const header = document.querySelector('header');
    if (header) {
      const badge = document.createElement('div');
      badge.className = 'hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] text-[10px] mono font-bold shadow-sm';
      badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span> <span>ESTACIÓN DESKTOP · SILICIO NATIVO</span>';
      header.appendChild(badge);
    }
  });

})(typeof window !== 'undefined' ? window : globalThis);
