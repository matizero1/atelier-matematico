/**
 * Atelier Matemático - Index Controller
 * Hero Canvas & Interactive Catalog
 * NASA JPL-Grade Modular Architecture
 */

    // 1. Estado y Control de Obras en el Muro de Travertino
    let currentHeroArt = 50; // Obra 051 (Riemann por defecto en catálogo de 100)
    const urlArtParam = new URLSearchParams(window.location.search).get('art');
    if (urlArtParam !== null) {
      const parsedArt = parseInt(urlArtParam, 10);
      if (!isNaN(parsedArt) && parsedArt >= 0 && parsedArt < 100) {
        currentHeroArt = parsedArt;
      }
    }
    const heroCanvas = document.getElementById('hero-math-canvas');
    let heroAnimActive = true;

    function initHeroMath() {
      if (!heroCanvas || !window.AtelierMath) return;
      setHeroArtwork(currentHeroArt);

      function heroStepLoop() {
        if (heroAnimActive && window.AtelierMath) {
          window.AtelierMath.step(currentHeroArt);
        }
        requestAnimationFrame(heroStepLoop);
      }
      requestAnimationFrame(heroStepLoop);
    }

    function setHeroArtwork(idx, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      currentHeroArt = ((idx % 100) + 100) % 100;
      if (window.AtelierMath) {
        window.AtelierMath.bindCanvas(heroCanvas, 720, 1008);
        window.AtelierMath.init(currentHeroArt);
        const art = (window.ARTWORKS_100 && window.ARTWORKS_100[currentHeroArt]) || (window.AtelierMath.ARTWORKS && window.AtelierMath.ARTWORKS[currentHeroArt]);
        if (art) {
          const sheetTitle = document.getElementById('hero-sheet-title');
          const plaqueCat = document.getElementById('hero-plaque-cat');
          const plaqueBadge = document.getElementById('hero-plaque-badge');
          const plaqueTitle = document.getElementById('hero-plaque-title');
          const plaqueEq = document.getElementById('hero-plaque-eq');
          const plaqueBtn = document.getElementById('hero-plaque-shop-btn');

          if (sheetTitle) sheetTitle.textContent = `ATELIER MATEMÁTICO · OBRA ${art.badge}`;
          if (plaqueCat) plaqueCat.textContent = art.cat;
          if (plaqueBadge) plaqueBadge.textContent = `OBRA ${art.badge} DE 100`;
          if (plaqueTitle) plaqueTitle.textContent = art.title;
          if (plaqueEq) plaqueEq.textContent = art.eqShort || (art.eq ? art.eq.split('\n')[0] : '');
          if (plaqueBtn) plaqueBtn.href = `shop.html?art=${currentHeroArt}`;
        }
      }

      // Actualizar estado activo en los botones de selección rápida
      document.querySelectorAll('.hero-selector-btn').forEach(btn => {
        const bIdx = parseInt(btn.dataset.idx, 10);
        const isActive = bIdx === currentHeroArt;
        btn.classList.toggle('border-[#c5a059]', isActive);
        btn.classList.toggle('text-[#c5a059]', isActive);
        btn.classList.toggle('bg-[#c5a059]/10', isActive);
        btn.classList.toggle('border-white/10', !isActive);
        btn.classList.toggle('text-[#a1a1aa]', !isActive);
        btn.classList.toggle('bg-transparent', !isActive);
      });
    }

    function cycleHeroArtwork(delta, event) {
      setHeroArtwork(currentHeroArt + delta, event);
    }

    function loadArtworkInHero(idx) {
      setHeroArtwork(idx);
      const stageElem = document.getElementById('pavilion-3d-stage');
      if (stageElem) {
        stageElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. Control y Renderizado del Catálogo de las 100 Obras
    // ─────────────────────────────────────────────────────────────────
    let currentEpochFilter = 'all';

    function setEpochFilter(epoch, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      currentEpochFilter = epoch;
      document.querySelectorAll('.epoch-filter-btn').forEach(btn => {
        const isAct = btn.dataset.epoch === epoch;
        btn.classList.toggle('border-[#c5a059]', isAct);
        btn.classList.toggle('text-[#c5a059]', isAct);
        btn.classList.toggle('bg-[#c5a059]/10', isAct);
        btn.classList.toggle('border-white/10', !isAct);
        btn.classList.toggle('text-[#a1a1aa]', !isAct);
      });
      handleCatalogFilter();
    }

    function handleCatalogFilter() {
      const searchInput = document.getElementById('catalog-search');
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      renderCatalogGrid(currentEpochFilter, query);
    }

    function renderCatalogGrid(epochFilter, query) {
      const grid = document.getElementById('catalog-grid');
      const counter = document.getElementById('catalog-counter');
      if (!grid) return;

      const catalog = window.ARTWORKS_100 || (window.AtelierMath && window.AtelierMath.ARTWORKS) || [];
      const filtered = catalog.filter(art => {
        // Filtro por época
        if (epochFilter !== 'all' && String(art.epoch) !== String(epochFilter)) {
          return false;
        }
        // Filtro por búsqueda de texto
        if (query) {
          const matchTitle = (art.title || '').toLowerCase().includes(query);
          const matchAuthor = (art.author || '').toLowerCase().includes(query);
          const matchEq = (art.eq || '').toLowerCase().includes(query) || (art.eqShort || '').toLowerCase().includes(query);
          const matchCat = (art.cat || '').toLowerCase().includes(query);
          const matchHist = (art.hist || '').toLowerCase().includes(query);
          const matchBadge = (art.badge || '').toLowerCase().includes(query);
          if (!matchTitle && !matchAuthor && !matchEq && !matchCat && !matchHist && !matchBadge) {
            return false;
          }
        }
        return true;
      });

      if (counter) {
        counter.textContent = `Mostrando ${filtered.length} de 100 obras`;
      }

      grid.innerHTML = filtered.map(art => `
        <div class="p-6 rounded-xl bg-[#101014] luxury-border flex flex-col justify-between space-y-4 hover:border-white/20 transition group">
          <div>
            <div class="flex justify-between items-center text-[10px] mono text-[#71717a] mb-2">
              <span class="text-[#c5a059] font-medium">OBRA ${art.badge}</span>
              <span>${art.cat}</span>
            </div>
            <h3 class="serif text-lg text-[#f4f1ea] group-hover:text-[#dfc285] transition">${art.title}</h3>
            <span class="text-[10px] mono text-[#a1a1aa] block mb-2">${art.author} (${art.year})</span>
            <div class="my-2 p-2 bg-[#08080a] border border-white/5 rounded text-[11px] mono text-[#c5a059] overflow-x-auto whitespace-nowrap">
              ${art.eqShort || (art.eq ? art.eq.split('\n')[0] : '')}
            </div>
            <p class="text-xs text-[#a1a1aa] font-light leading-relaxed line-clamp-3">
              ${art.hist}
            </p>
          </div>
          <div class="pt-4 border-t border-white/5 flex justify-between items-center text-xs mono">
            <button onclick="loadArtworkInHero(${art.id})" class="text-[#c5a059] hover:text-[#dfc285] hover:underline flex items-center gap-1 cursor-pointer">
              <span>Ver en muro</span> <span>↑</span>
            </button>
            <a href="shop.html?art=${art.id}" class="text-[#a1a1aa] hover:text-white transition flex items-center gap-1">
              <span>Vitrina 3D</span> <span>→</span>
            </a>
          </div>
        </div>
      `).join('');
    }

    // Navegación accesible por teclado
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') cycleHeroArtwork(-1);
      if (e.key === 'ArrowRight') cycleHeroArtwork(1);
    });

    // Iniciar el motor y catálogo en cuanto cargue el DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initHeroMath();
        renderCatalogGrid('all', '');
      });
    } else {
      initHeroMath();
      renderCatalogGrid('all', '');
    }



    // Iniciar el motor en cuanto cargue el DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initHeroMath);
    } else {
      initHeroMath();
    }

    // 2. Motor de Profundidad Espacial 3D: Cuadro en Pared con Paralaje Real (60 FPS)
    const stage = document.getElementById('pavilion-3d-stage');
    const bgImg = document.getElementById('pavilion-bg-img');
    const frameBody = document.getElementById('framed-artwork-3d');
    const frameBox = document.getElementById('artwork-frame-body');
    const glassSheen = document.getElementById('artwork-glass-sheen');

    if (stage && frameBody) {
      let targetNormX = 0, targetNormY = 0;
      let currentNormX = 0, currentNormY = 0;

      window.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetNormX = (e.clientX - centerX) / (window.innerWidth / 2);
        targetNormY = (e.clientY - centerY) / (window.innerHeight / 2);
        targetNormX = Math.max(-1, Math.min(1, targetNormX));
        targetNormY = Math.max(-1, Math.min(1, targetNormY));
      }, { passive: true });

      function renderSpatialParallax() {
        // Amortiguación armónica rápida y continua (lerp 0.12 para respuesta inmediata sin parones)
        currentNormX += (targetNormX - currentNormX) * 0.12;
        currentNormY += (targetNormY - currentNormY) * 0.12;

        // 1. Micro-inclinación física anclada al muro (Perspectiva sutil de cuadro colgado, sin flotar)
        const rotateY = currentNormX * 2.5;  // ±2.5° sutiles
        const rotateX = -currentNormY * 1.8; // ±1.8° sutiles
        frameBody.style.transform = `rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;

        // 2. Micro-paralaje de sala arquitectónica
        if (bgImg) {
          const bgX = -currentNormX * 6;
          const bgY = -currentNormY * 4;
          bgImg.style.transform = `translate3d(${bgX.toFixed(1)}px, ${bgY.toFixed(1)}px, 0) scale(1.04)`;
        }

        // 3. Sombra de contacto físico proyectada directamente sobre la piedra travertino
        if (frameBox) {
          const shadowX = 10 - currentNormX * 8;
          const shadowY = 24 - currentNormY * 6;
          frameBox.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 48px rgba(0,0,0,0.65), 0 10px 24px -2px rgba(0,0,0,0.45), 2px 4px 10px rgba(0,0,0,0.3)`;
        }

        // 4. Desplazamiento del brillo del vidrio
        if (glassSheen) {
          const sheenAngle = 135 + currentNormX * 20;
          const sheenAlpha = 0.20 + Math.abs(currentNormX) * 0.12;
          glassSheen.style.background = `linear-gradient(${sheenAngle}deg, transparent 25%, rgba(255,255,255,${sheenAlpha.toFixed(2)}) 50%, transparent 75%)`;
        }

        requestAnimationFrame(renderSpatialParallax);
      }
      requestAnimationFrame(renderSpatialParallax);
    }
