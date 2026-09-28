/**
 * 🏛️ ATELIER MATEMÁTICO — CONTROLADOR DE PIZARRA DE TIZA LIBRE
 * Nai Systems · Arquitectura Modular Desacoplada
 * Estándar: Timonel F2 · Trazo Orgánico Vectorial · Soporte Táctil y Puntero
 */

(function(root) {
  'use strict';

  class ClassroomChalkboard {
    constructor(controller) {
      this.controller = controller;
      this.isDrawingChalk = false;
      this.chalkColor = '#f4f1ea';
      this.chalkMode = 'chalk'; // 'chalk' | 'eraser'
      this.lastChalkX = 0;
      this.lastChalkY = 0;
    }

    init() {
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
        const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

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
  }

  root.ClassroomChalkboard = ClassroomChalkboard;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassroomChalkboard;
  }
})(typeof window !== 'undefined' ? window : globalThis);
