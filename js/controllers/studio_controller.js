/**
 * Atelier Matemático - Studio Controller
 * 2D Sovereign Workbench (100 Obras Canónicas)
 * NASA JPL-Grade Modular Architecture
 */

    // ═══════════════════════════════════════════════════════════════════
    // WORKBENCH 2D SOBERANO — ATELIER MATEMÁTICO (100 OBRAS)
    // ═══════════════════════════════════════════════════════════════════
    const canvas = document.getElementById('stage');
    let currentArt = 50; // Inicia por defecto en Obra 051 (Riemann)
    let currentPal = 0;
    let animId = null;
    let currentEpochFilter = 'all';

    // Grabador de Video
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordingTimeout = null;
    let recordingCountdownInterval = null;

    // Inicialización del Banco de Trabajo
    function initStudio() {
      // 1. Verificar parámetro de URL (?art=X)
      const params = new URLSearchParams(window.location.search);
      const artParam = params.get('art');
      if (artParam !== null) {
        const parsed = parseInt(artParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < 100) {
          currentArt = parsed;
        }
      }

      // 2. Asociar el Canvas con AtelierMath
      if (window.AtelierMath) {
        window.AtelierMath.bindCanvas(canvas);
        window.AtelierMath.resize();
        window.addEventListener('resize', () => {
          window.AtelierMath.resize();
        });
      }

      // 3. Poblar dropdown rápido de 100 obras
      populateQuickSelect();

      // 4. Renderizar grilla de tarjetas del catálogo
      renderStudioGrid('all', '');

      // 5. Cargar obra activa
      loadArtwork(currentArt);

      // 6. Listeners de Pointer para interactuar
      setupPointerEvents();

      // 7. Loop de renderizado continuo a 60 FPS
      startRenderLoop();
    }

    function populateQuickSelect() {
      const sel = document.getElementById('quick-select');
      if (!sel) return;
      const catalog = window.ARTWORKS_100 || [];
      
      const epochs = [
        { id: 1, name: 'Época I: Antigüedad & Geometría (001–020)' },
        { id: 2, name: 'Época II: Ilustración & Ondas (021–040)' },
        { id: 3, name: 'Época III: Termodinámica & Campos (041–060)' },
        { id: 4, name: 'Época IV: Relatividad & Cuántica (061–080)' },
        { id: 5, name: 'Época V: Caos & Computación (081–100)' }
      ];

      sel.innerHTML = epochs.map(ep => {
        const items = catalog.filter(a => a.epoch === ep.id);
        const options = items.map(a => `<option value="${a.id}">OBRA ${a.badge}: ${a.title}</option>`).join('');
        return `<optgroup label="${ep.name}">${options}</optgroup>`;
      }).join('');
    }

    function loadArtwork(idx) {
      if (idx < 0) idx = 99;
      if (idx > 99) idx = 0;
      currentArt = idx;

      const catalog = window.ARTWORKS_100 || [];
      const art = catalog[idx];
      if (!art) return;

      // Actualizar UI del Dossier
      document.getElementById('badge').textContent = `OBRA ${art.badge}`;
      document.getElementById('category').textContent = art.cat;
      document.getElementById('epoch-label').textContent = `Época ${['I','II','III','IV','V'][art.epoch - 1]}`;
      document.getElementById('art-title').textContent = art.title;
      document.getElementById('art-author-year').textContent = `${art.author} (${art.year})`;
      document.getElementById('art-eq').textContent = art.eq;
      document.getElementById('art-hist').textContent = art.hist;
      document.getElementById('art-poem').textContent = `"${art.poem}"`;
      document.getElementById('hint').textContent = art.hint || 'Arrastra para explorar la variedad matemática';

      const shopBtn = document.getElementById('btn-inspect-shop');
      if (shopBtn) shopBtn.href = `shop.html?art=${art.id}`;

      const sel = document.getElementById('quick-select');
      if (sel) sel.value = String(art.id);

      // Actualizar URL sin recargar
      const newUrl = `${window.location.pathname}?art=${art.id}`;
      window.history.replaceState({ art: art.id }, '', newUrl);

      // Inicializar el motor matemático en silicio
      if (window.AtelierMath && window.AtelierMath.init) {
        window.AtelierMath.init(art.id);
      }

      // Marcar tarjeta activa en la grilla
      highlightActiveCard(art.id);
    }

    function selectArtwork(idx) {
      loadArtwork(idx);
    }

    function cycleArtwork(delta) {
      loadArtwork(currentArt + delta);
    }

    function restartArtwork() {
      if (window.AtelierMath && window.AtelierMath.init) {
        window.AtelierMath.init(currentArt);
      }
    }

    function togglePalette() {
      currentPal = (currentPal + 1) % 4;
      if (window.AtelierMath && window.AtelierMath.setPalette) {
        window.AtelierMath.setPalette(currentPal);
      }
      const labels = ['Paleta I', 'Paleta II', 'Paleta III', 'Paleta IV'];
      const dotColors = ['#c5a059', '#38bdf8', '#f43f5e', '#a855f7'];
      document.getElementById('pal-label').textContent = labels[currentPal];
      document.getElementById('pal-dot').style.backgroundColor = dotColors[currentPal];
    }

    // ── Loop de Dibujo ──────────────────────────────────────────────
    function startRenderLoop() {
      function loop() {
        if (window.AtelierMath && window.AtelierMath.step) {
          window.AtelierMath.step(currentArt);
        }
        animId = requestAnimationFrame(loop);
      }
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(loop);
    }

    // ── Eventos de Puntero (Arrastrar e interactuar) ─────────────────
    function setupPointerEvents() {
      let isDragging = false;
      let lastX = 0, lastY = 0;

      canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        if (window.AtelierMath && window.AtelierMath.handlePointer) {
          window.AtelierMath.handlePointer('down', lastX, lastY, 0, 0, currentArt);
        }
      });

      window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = x - lastX;
        const dy = y - lastY;
        lastX = x;
        lastY = y;
        if (window.AtelierMath && window.AtelierMath.handlePointer) {
          window.AtelierMath.handlePointer(isDragging ? 'move' : 'hover', x, y, dx, dy, currentArt);
        }
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          if (window.AtelierMath && window.AtelierMath.handlePointer) {
            window.AtelierMath.handlePointer('up', lastX, lastY, 0, 0, currentArt);
          }
        }
      });

      // Soporte táctil móvil
      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          const rect = canvas.getBoundingClientRect();
          lastX = e.touches[0].clientX - rect.left;
          lastY = e.touches[0].clientY - rect.top;
          if (window.AtelierMath && window.AtelierMath.handlePointer) {
            window.AtelierMath.handlePointer('down', lastX, lastY, 0, 0, currentArt);
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const rect = canvas.getBoundingClientRect();
          const x = e.touches[0].clientX - rect.left;
          const y = e.touches[0].clientY - rect.top;
          const dx = x - lastX;
          const dy = y - lastY;
          lastX = x;
          lastY = y;
          if (window.AtelierMath && window.AtelierMath.handlePointer) {
            window.AtelierMath.handlePointer('move', x, y, dx, dy, currentArt);
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchend', () => {
        if (window.AtelierMath && window.AtelierMath.handlePointer) {
          window.AtelierMath.handlePointer('up', lastX, lastY, 0, 0, currentArt);
        }
      }, { passive: true });
    }

    // ── Catálogo y Filtros ──────────────────────────────────────────
    function setEpochFilter(epoch) {
      currentEpochFilter = epoch;
      const buttons = document.querySelectorAll('#epoch-filters button');
      buttons.forEach(btn => {
        const ep = btn.getAttribute('data-epoch');
        if (String(ep) === String(epoch)) {
          btn.className = 'epoch-btn px-3 py-1.5 rounded-md bg-[#c5a059] text-[#08080a] font-medium transition cursor-pointer';
        } else {
          btn.className = 'epoch-btn px-3 py-1.5 rounded-md bg-[#16161c] text-[#a1a1aa] hover:text-white transition cursor-pointer';
        }
      });
      handleStudioSearch();
    }

    function handleStudioSearch() {
      const q = (document.getElementById('studio-search').value || '').toLowerCase().trim();
      renderStudioGrid(currentEpochFilter, q);
    }

    function renderStudioGrid(epochFilter, query) {
      const grid = document.getElementById('studio-grid');
      const counter = document.getElementById('catalog-counter');
      if (!grid) return;

      const catalog = window.ARTWORKS_100 || [];
      const filtered = catalog.filter(art => {
        if (epochFilter !== 'all' && String(art.epoch) !== String(epochFilter)) return false;
        if (query) {
          const m1 = (art.title || '').toLowerCase().includes(query);
          const m2 = (art.author || '').toLowerCase().includes(query);
          const m3 = (art.eq || '').toLowerCase().includes(query) || (art.eqShort || '').toLowerCase().includes(query);
          const m4 = (art.cat || '').toLowerCase().includes(query);
          const m5 = (art.badge || '').toLowerCase().includes(query);
          if (!m1 && !m2 && !m3 && !m4 && !m5) return false;
        }
        return true;
      });

      if (counter) counter.textContent = `Mostrando ${filtered.length} de 100 obras`;

      grid.innerHTML = filtered.map(art => {
        const isActive = art.id === currentArt;
        const borderCls = isActive ? 'border-[#c5a059] bg-[#16161c]' : 'border-white/5 bg-[#101014] hover:border-white/20';
        return `
          <div onclick="loadArtwork(${art.id})" id="card-${art.id}" class="p-5 rounded-xl border ${borderCls} flex flex-col justify-between space-y-3 transition cursor-pointer group">
            <div>
              <div class="flex justify-between items-center text-[10px] mono text-[#71717a] mb-1.5">
                <span class="text-[#c5a059] font-medium">OBRA ${art.badge}</span>
                <span>${art.year}</span>
              </div>
              <h3 class="serif text-sm font-semibold text-[#f4f1ea] group-hover:text-[#dfc285] transition">${art.title}</h3>
              <span class="text-[10px] mono text-[#a1a1aa] block mb-2">${art.author}</span>
              <div class="p-2 bg-[#08080a] border border-white/5 rounded text-[11px] mono text-[#c5a059] overflow-x-auto whitespace-nowrap">
                ${art.eqShort || art.eq.split('\n')[0]}
              </div>
            </div>
            <div class="pt-2 border-t border-white/5 flex justify-between items-center text-[11px] mono">
              <span class="text-[#a1a1aa] text-[9px] uppercase tracking-wider">${art.cat}</span>
              <span class="text-[#c5a059] group-hover:translate-x-1 transition-transform">Cargar ↑</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function highlightActiveCard(idx) {
      document.querySelectorAll('#studio-grid > div').forEach(card => {
        card.classList.remove('border-[#c5a059]', 'bg-[#16161c]');
        card.classList.add('border-white/5', 'bg-[#101014]');
      });
      const active = document.getElementById(`card-${idx}`);
      if (active) {
        active.classList.add('border-[#c5a059]', 'bg-[#16161c]');
        active.classList.remove('border-white/5', 'bg-[#101014]');
      }
    }

    // ── Navegación por Teclado ──────────────────────────────────────
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') cycleArtwork(-1);
      if (e.key === 'ArrowRight') cycleArtwork(1);
      if (e.key.toLowerCase() === 'p') togglePalette();
      if (e.key.toLowerCase() === 'r') restartArtwork();
    });

    // ── Grabación de Reels 15s y 30s ────────────────────────────────
    function startVideoRecording(seconds) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        return;
      }
      recordedChunks = [];
      const stream = canvas.captureStream(60);
      
      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/mp4' };
        }
      }

      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        clearInterval(recordingCountdownInterval);
        clearTimeout(recordingTimeout);
        document.getElementById('rec-banner').classList.add('hidden');
        document.getElementById('btn-rec-15').classList.remove('border-red-500', 'bg-red-950/40');
        document.getElementById('btn-rec-30').classList.remove('border-red-500', 'bg-red-950/40');

        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const catalog = window.ARTWORKS_100 || [];
        const title = (catalog[currentArt] ? catalog[currentArt].title : 'Obra').replace(/\s+/g, '_');
        a.download = `Atelier_${title}_${seconds}s.webm`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 6000);
      };

      mediaRecorder.start();
      
      document.getElementById('rec-banner').classList.remove('hidden');
      const btn = seconds === 15 ? document.getElementById('btn-rec-15') : document.getElementById('btn-rec-30');
      btn.classList.add('border-red-500', 'bg-red-950/40');

      let remaining = seconds;
      document.getElementById('rec-countdown').textContent = `GRABANDO ${remaining}s...`;
      recordingCountdownInterval = setInterval(() => {
        remaining--;
        if (remaining > 0) {
          document.getElementById('rec-countdown').textContent = `GRABANDO ${remaining}s...`;
        }
      }, 1000);

      recordingTimeout = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
      }, seconds * 1000);
    }

    // ── Descarga de Lámina Fine Art en Alta Resolución (300 DPI) ─────
    function downloadArtworkHD() {
      const catalog = window.ARTWORKS_100 || [];
      const art = catalog[currentArt];
      if (!art) return;

      const printCanvas = document.createElement('canvas');
      const scale = 2; // Doble resolución
      printCanvas.width = canvas.width * scale;
      printCanvas.height = canvas.height * scale;
      const pctx = printCanvas.getContext('2d');

      // 1. Dibujar el fotograma actual
      pctx.drawImage(canvas, 0, 0, printCanvas.width, printCanvas.height);

      // 2. Componer cartela tipográfica editorial de museo en el pie
      const pad = 36 * scale;
      pctx.fillStyle = 'rgba(8, 8, 10, 0.85)';
      pctx.fillRect(pad, printCanvas.height - 100 * scale, printCanvas.width - pad * 2, 70 * scale);
      pctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
      pctx.lineWidth = 1 * scale;
      pctx.strokeRect(pad, printCanvas.height - 100 * scale, printCanvas.width - pad * 2, 70 * scale);

      pctx.fillStyle = '#c5a059';
      pctx.font = `${11 * scale}px Space Mono, monospace`;
      pctx.fillText(`ATELIER MATEMÁTICO · OBRA ${art.badge}`, pad + 20 * scale, printCanvas.height - 65 * scale);

      pctx.fillStyle = '#f4f1ea';
      pctx.font = `bold ${16 * scale}px Cinzel, serif`;
      pctx.fillText(art.title.toUpperCase(), pad + 20 * scale, printCanvas.height - 40 * scale);

      pctx.fillStyle = '#a1a1aa';
      pctx.font = `${11 * scale}px Space Mono, monospace`;
      pctx.textAlign = 'right';
      pctx.fillText(`${art.author} (${art.year})`, printCanvas.width - pad - 20 * scale, printCanvas.height - 50 * scale);

      // 3. Exportar PNG de alta fidelidad
      const link = document.createElement('a');
      link.download = `Atelier_Obra_${art.badge}_${art.title.replace(/\s+/g, '_')}_HD.png`;
      link.href = printCanvas.toDataURL('image/png');
      link.click();
    }

    // Inicializar al cargar el DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initStudio);
    } else {
      initStudio();
    }
