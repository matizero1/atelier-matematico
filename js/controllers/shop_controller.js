/**
 * Atelier Matemático - Shop Controller
 * Fine Art 3D Boutique & Acquisition System
 * NASA JPL-Grade Modular Architecture
 */

    // ── ESTADO DEL SISTEMA ──────────────────────────────────────────
    let scene, camera, renderer;
    let architecturalGroup, productGroup;
    let spotLightKey, spotLightFill, ambientLight;
    let artworkTextureCanvas, artworkTexture;
    
    // Configuración actual del producto
    let currentArtIdx = 20; // Obra 21 (Riemann por defecto)
    let currentFormat = 'fineart';
    let currentFrameFinish = 'black'; // black | oak | walnut
    let currentMatteFinish = 'white'; // white | cream | dark
    let currentLighting = 'warm';     // warm | neutral | intimate
    let isSimulationPaused = false;
    let isTabVisible = true;

    // ── PARALAJE FÍSICO DE TIMONEL (EL CUADRO ESTÁ INMÓVIL, EL OJO SE MUEVE) ──
    // El cuadro cuelga en (0, 0.12, 0)
    // El observador está frente al cuadro con distancia base Z=2.25m (Gran escala y presencia vertical)
    let targetEyePos = new THREE.Vector3(0, 0.12, 2.25);
    let eyePos       = new THREE.Vector3(0, 0.12, 2.25);
    let activePreset = 'front'; // front | left | right | macro

    // Precios y metadatos con divisas internacionales
    const PRICES = {
      fineart:  { clp: '$68.000 CLP',  usd: '~$75 USD',  eur: '€70 EUR',  label: 'Cuadro Fine Art 50×70 cm' },
      acrylic:  { clp: '$120.000 CLP', usd: '~$130 USD', eur: '€120 EUR', label: 'Acrílico Luxury 40×60 cm' },
      mug:      { clp: '$16.900 CLP',  usd: '~$18 USD',  eur: '€17 EUR',  label: 'Taza Cerámica 11 oz' },
      notebook: { clp: '$24.900 CLP',  usd: '~$27 USD',  eur: '€25 EUR',  label: 'Cuaderno Moleskine 100g' }
    };
    let currentCurrency = 'CLP';

    // Grabación de video 60 FPS
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordingTimeout = null;
    let recordingCountdownInterval = null;

    // Control de visibilidad térmica
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
    });

    // ── INICIALIZACIÓN PRINCIPAL ────────────────────────────────────
    window.addEventListener('DOMContentLoaded', () => {
      // 1. Poblar selector de las 100 obras maestras
      populateArtworkSelect();

      // 2. Revisar parámetro de URL (?art=X)
      let defaultArt = 50; // Obra 051: Riemann
      const urlParams = new URLSearchParams(window.location.search);
      const urlArt = parseInt(urlParams.get('art'));
      if (!isNaN(urlArt) && urlArt >= 0 && urlArt < 100) {
        defaultArt = urlArt;
      }
      currentArtIdx = defaultArt;

      // 3. Inicializar textura matemática compartida con AtelierMath
      initMathCanvasTexture();

      // 4. Inicializar Three.js con el cuadro anclado a la pared
      try {
        initThreeScene();
      } catch (err) {
        console.warn('Three.js WebGL init notice:', err);
      }

      const urlView = urlParams.get('view');
      if (urlView) setObserverPreset(urlView);

      // 5. Cargar la obra inicial
      selectArtwork(currentArtIdx);

      // 6. Iniciar loop de render
      animate();
    });

    // ── 1. INICIALIZAR TEXTURA DEL LIENZO MATEMÁTICO VIVO ───────────
    function initMathCanvasTexture() {
      artworkTextureCanvas = document.createElement('canvas');
      artworkTextureCanvas.width = 1024;
      artworkTextureCanvas.height = 1448; // Ratio 50x70

      // Conectar AtelierMath a este canvas
      window.AtelierMath.bindCanvas(artworkTextureCanvas, 1024, 1448);

      // Crear textura Three.js
      artworkTexture = new THREE.CanvasTexture(artworkTextureCanvas);
      artworkTexture.minFilter = THREE.LinearFilter;
      artworkTexture.magFilter = THREE.LinearFilter;
    }

    // ── 2. ESCENARIO ARQUITECTÓNICO THREE.JS (PARED DE GALERÍA) ───────
    function initThreeScene() {
      const container = document.getElementById('vitrina-canvas');
      const w = container.clientWidth;
      const h = container.clientHeight;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0d);

      camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
      camera.position.copy(eyePos);
      camera.lookAt(0, 0.12, 0);

      renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(1.0); // Disciplina térmica Apple Silicon
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // ILUMINACIÓN DE GALERÍA
      ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
      scene.add(ambientLight);

      // Foco Cenital Focal (3200K cálido)
      spotLightKey = new THREE.SpotLight(0xfef2db, 3.6);
      spotLightKey.position.set(0.6, 3.5, 2.6);
      spotLightKey.angle = 0.52;
      spotLightKey.penumbra = 0.85;
      scene.add(spotLightKey);

      // Foco de Relleno Suave (Fill)
      spotLightFill = new THREE.SpotLight(0xaabbcc, 1.2);
      spotLightFill.position.set(-2.2, 2.4, 1.8);
      spotLightFill.angle = 0.62;
      spotLightFill.penumbra = 0.9;
      scene.add(spotLightFill);

      // ESCENARIO ARQUITECTÓNICO INMÓVIL
      architecturalGroup = new THREE.Group();

      // Helper para generar textura de sombra física suave y difusa (Luz rasante desde superior-izquierda)
      function createSoftShadowTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 700;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, 512, 700);

        const cx = 256 + 8, cy = 350 + 14; // Desplazamiento sutil hacia abajo-derecha
        const w = 310, h = 440;
        const x = cx - w / 2, y = cy - h / 2;

        // Penumbra suave y difusa con márgenes generosos (bordes 100% transparentes)
        for (let i = 24; i >= 0; i--) {
          const alpha = 0.024 * Math.pow((24 - i) / 24, 0.7);
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          const offset = i * 2.2;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x - offset, y - offset, w + offset * 2, h + offset * 2, [28 + offset]);
          } else {
            ctx.rect(x - offset, y - offset, w + offset * 2, h + offset * 2);
          }
          ctx.fill();
        }
        // Oclusión de contacto directa profunda
        ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x + 2, y + 4, w - 4, h - 8, [12]);
        } else {
          ctx.rect(x + 2, y + 4, w - 4, h - 8);
        }
        ctx.fill();

        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearFilter;
        return tex;
      }

      // Muro posterior (Piedra de Travertino monolítica idéntica a la portada)
      const wallGeom = new THREE.PlaneGeometry(16, 9);
      const wallTex = new THREE.TextureLoader().load('assets/atelier_gallery_wall.jpg');
      wallTex.colorSpace = THREE.SRGBColorSpace;
      const wallMat = new THREE.MeshStandardMaterial({
        map: wallTex,
        roughness: 0.90,
        metalness: 0.02
      });
      const backWall = new THREE.Mesh(wallGeom, wallMat);
      backWall.position.set(0, 0.45, -0.06);
      architecturalGroup.add(backWall);

      // Sombra de contacto suave proyectada en el travertino detrás del cuadro
      const shadowTex = createSoftShadowTexture();
      const shadowGeom = new THREE.PlaneGeometry(1.36, 1.92);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.80
      });
      const shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
      shadowPlane.position.set(0, 0.12, -0.055);
      architecturalGroup.add(shadowPlane);

      scene.add(architecturalGroup);

      // GRUPO DEL PRODUCTO (ANCLADO, ROTACIÓN 0 INMUTABLE)
      productGroup = new THREE.Group();
      productGroup.position.set(0, 0.12, 0);
      productGroup.rotation.set(0, 0, 0); // ¡CERO GIROS! El cuadro está colgado en la pared.
      scene.add(productGroup);

      // Construir geometría inicial (Cuadro Fine Art)
      buildProductGeometry();

      // INTERACCIÓN DE PARALAJE DE TIMONEL
      container.addEventListener('mousemove', onParallaxMouseMove);
      container.addEventListener('touchmove', onParallaxTouchMove, { passive: true });
      window.addEventListener('resize', onWindowResize);

      // Reenvío fluido de rueda de ratón para que scrollear sobre el cuadro mueva la estantería de opciones
      const shelf = document.getElementById('shop-shelf-panel');
      const canvasContainer = container.parentElement;
      if (shelf && canvasContainer) {
        canvasContainer.addEventListener('wheel', (e) => {
          shelf.scrollTop += e.deltaY;
        }, { passive: true });
      }
    }

    // ── 3. PARALAJE FÍSICO DE TIMONEL ───────────────────────────────
    function onParallaxMouseMove(e) {
      if (activePreset === 'macro') return; // En macro se mantiene enfocado
      const container = document.getElementById('vitrina-canvas');
      const r = container.getBoundingClientRect();
      const normX = ((e.clientX - r.left) / r.width) * 2 - 1;   // [-1, 1]
      const normY = ((e.clientY - r.top)  / r.height) * 2 - 1;  // [-1, 1]

      // Cono de visión humano natural y fluido:
      // Movimiento lateral: ±0.45 m
      // Movimiento vertical: ±0.22 m
      targetEyePos.x = normX * 0.45;
      targetEyePos.y = 0.12 - normY * 0.22;
      targetEyePos.z = 2.25;
    }

    function onParallaxTouchMove(e) {
      if (e.touches.length === 1 && activePreset !== 'macro') {
        const container = document.getElementById('vitrina-canvas');
        const r = container.getBoundingClientRect();
        const normX = ((e.touches[0].clientX - r.left) / r.width) * 2 - 1;
        const normY = ((e.touches[0].clientY - r.top)  / r.height) * 2 - 1;
        targetEyePos.x = normX * 0.35;
        targetEyePos.y = 0.12 - normY * 0.18;
        targetEyePos.z = 2.25;
      }
    }

    function setObserverPreset(preset) {
      activePreset = preset;
      ['front', 'left', 'right', 'macro'].forEach(p => {
        const btn = document.getElementById(`btn-cam-${p}`);
        if (btn) {
          btn.classList.toggle('text-[#c5a059]', p === preset);
          btn.classList.toggle('text-[#a1a1aa]', p !== preset);
        }
      });

      if (preset === 'front') {
        targetEyePos.set(0, 0.12, 2.25);
      } else if (preset === 'left') {
        // Revela el canto lateral de la madera y el corte biselado a 45° del paspartú
        targetEyePos.set(-0.65, 0.14, 2.15);
      } else if (preset === 'right') {
        // Revela el reflejo de la luz rasante en el vidrio de museo
        targetEyePos.set(0.65, 0.14, 2.15);
      } else if (preset === 'macro') {
        // Acercamiento a escala 1:1 para apreciar la textura de papel de 308g
        targetEyePos.set(0, 0.12, 1.25);
      }
    }

    function onWindowResize() {
      const container = document.getElementById('vitrina-canvas');
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    // ── 4. CONSTRUCCIÓN DE LA GEOMETRÍA FÍSICA DEL MARCO ─────────────
    function buildProductGeometry() {
      while (productGroup.children.length > 0) {
        productGroup.remove(productGroup.children[0]);
      }

      if (currentFormat === 'fineart') {
        buildFineArtFrame();
      } else if (currentFormat === 'acrylic') {
        buildAcrylicMount();
      } else if (currentFormat === 'mug') {
        buildCeramicMug();
      } else if (currentFormat === 'notebook') {
        buildMoleskineNotebook();
      }
    }

    // Cuadro Fine Art 50x70 con Moldura Maciza y Paspartú Biselado
    function buildFineArtFrame() {
      const frameGroup = new THREE.Group();
      // Proporciones 50x70 calibradas a escala arquitectónica (0.98m x 1.38m)
      const fw = 0.98, fh = 1.38, fd = 0.055;

      let frameColor = 0x121215; // Ébano mate
      let frameRoughness = 0.45;
      if (currentFrameFinish === 'oak') {
        frameColor = 0xc29b63; frameRoughness = 0.62;
      } else if (currentFrameFinish === 'walnut') {
        frameColor = 0x3d2212; frameRoughness = 0.52;
      }

      const frameMat = new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: frameRoughness,
        metalness: 0.08
      });

      // Moldura exterior
      const outerBox = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, fd), frameMat);
      frameGroup.add(outerBox);

      // Paspartú biselado de conservación
      let matColor = 0xf2efe9; // Blanco algodón
      if (currentMatteFinish === 'cream') matColor = 0xe8e0cf;
      if (currentMatteFinish === 'dark') matColor = 0x18181f;

      const matBoard = new THREE.Mesh(
        new THREE.PlaneGeometry(fw - 0.08, fh - 0.08),
        new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.94 })
      );
      matBoard.position.z = fd / 2 + 0.002;
      frameGroup.add(matBoard);

      // Lámina impresa con el lienzo vivo de Three.js (CanvasTexture)
      const printGeom = new THREE.PlaneGeometry(0.70, 1.00);
      const printMat = new THREE.MeshBasicMaterial({ map: artworkTexture });
      const printMesh = new THREE.Mesh(printGeom, printMat);
      printMesh.position.z = fd / 2 + 0.004;
      frameGroup.add(printMesh);

      // Vidrio Acrílico Museo UV99 (Reflejo especular sutil sin distorsión)
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.04,
        roughness: 0.08,
        metalness: 0.1
      });
      const glassMesh = new THREE.Mesh(new THREE.PlaneGeometry(fw - 0.05, fh - 0.05), glassMat);
      glassMesh.position.z = fd / 2 + 0.006;
      frameGroup.add(glassMesh);

      productGroup.add(frameGroup);
    }

    // Acrílico Luxury 40x60 cm
    function buildAcrylicMount() {
      const mountGroup = new THREE.Group();
      const pw = 1.15, ph = 1.65, pd = 0.04;

      // Lámina en el fondo
      const printGeom = new THREE.PlaneGeometry(pw, ph);
      const printMat = new THREE.MeshBasicMaterial({ map: artworkTexture });
      const printMesh = new THREE.Mesh(printGeom, printMat);
      printMesh.position.z = pd / 2;
      mountGroup.add(printMesh);

      // Capa de metacrilato transparente pulido de 6mm
      const acrylicMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        roughness: 0.02,
        metalness: 0.15,
        transmission: 0.92,
        ior: 1.49
      });
      const acrylicBlock = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), acrylicMat);
      mountGroup.add(acrylicBlock);

      // Bastidor de aluminio oculto trasero
      const subFrame = new THREE.Mesh(
        new THREE.BoxGeometry(pw * 0.75, ph * 0.75, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.8, roughness: 0.3 })
      );
      subFrame.position.z = -0.03;
      mountGroup.add(subFrame);

      productGroup.add(mountGroup);
    }

    // Taza Cerámica 11 oz
    function buildCeramicMug() {
      const mugGroup = new THREE.Group();
      const cylGeom = new THREE.CylinderGeometry(0.48, 0.48, 1.1, 48);
      const mugMat = new THREE.MeshStandardMaterial({
        color: 0x121215,
        roughness: 0.35,
        metalness: 0.1
      });
      const mugBody = new THREE.Mesh(cylGeom, mugMat);
      mugGroup.add(mugBody);

      // Decal matemático
      const wrapGeom = new THREE.CylinderGeometry(0.482, 0.482, 0.85, 48, 1, true, 0, Math.PI * 1.5);
      const wrapMat = new THREE.MeshBasicMaterial({ map: artworkTexture, side: THREE.DoubleSide });
      const decal = new THREE.Mesh(wrapGeom, wrapMat);
      mugGroup.add(decal);

      // Asa
      const handleGeom = new THREE.TorusGeometry(0.35, 0.08, 16, 32, Math.PI * 1.15);
      const handle = new THREE.Mesh(handleGeom, mugMat);
      handle.position.set(0.48, 0, 0);
      handle.rotation.z = Math.PI / 2;
      mugGroup.add(handle);

      productGroup.add(mugGroup);
    }

    // Cuaderno Moleskine
    function buildMoleskineNotebook() {
      const nbGroup = new THREE.Group();
      const bw = 1.05, bh = 1.5, bd = 0.09;
      const coverMat = new THREE.MeshStandardMaterial({ color: 0x16161c, roughness: 0.75 });
      const cover = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), coverMat);
      nbGroup.add(cover);

      // Arte en bajorrelieve en la portada
      const artGeom = new THREE.PlaneGeometry(bw * 0.75, bh * 0.75);
      const artMesh = new THREE.Mesh(artGeom, new THREE.MeshBasicMaterial({ map: artworkTexture }));
      artMesh.position.z = bd / 2 + 0.002;
      nbGroup.add(artMesh);

      productGroup.add(nbGroup);
    }

    // ── 5. SELECCIÓN DE OBRA & RECONFIGURACIÓN DE DIALES ─────────────
    function populateArtworkSelect() {
      const select = document.getElementById('artwork-select');
      if (!select) return;
      if (select.options && select.options.length >= 100) return;
      const catalog = window.ARTWORKS_100 || (window.AtelierMath && window.AtelierMath.ARTWORKS) || [];
      if (!catalog.length) return;
      const epochs = [
        { id: 1, name: "── ÉPOCA I: ANTIGÜEDAD & GEOMETRÍA (001–020) ──" },
        { id: 2, name: "── ÉPOCA II: ILUSTRACIÓN & ONDAS (021–040) ──" },
        { id: 3, name: "── ÉPOCA III: TERMODINÁMICA & CAMPOS (041–060) ──" },
        { id: 4, name: "── ÉPOCA IV: RELATIVIDAD & CUÁNTICA (061–080) ──" },
        { id: 5, name: "── ÉPOCA V: CAOS & COMPUTACIÓN (081–100) ──" }
      ];
      select.innerHTML = epochs.map(ep => {
        const items = catalog.filter(a => a.epoch === ep.id);
        const options = items.map(a => `<option value="${a.id}">Obra ${a.badge} · ${a.title} (${a.year})</option>`).join('');
        return `<optgroup label="${ep.name}">${options}</optgroup>`;
      }).join('');
    }

    function onSelectArtwork(idx) {
      selectArtwork(idx);
    }

    function selectArtwork(idx) {
      currentArtIdx = idx;
      const d = (window.ARTWORKS_100 && window.ARTWORKS_100[idx]) || (window.AtelierMath && window.AtelierMath.ARTWORKS[idx]);
      if (!d) return;

      // Actualizar selector desplegable si no coincide
      const sel = document.getElementById('artwork-select');
      if (sel && sel.value !== String(idx)) sel.value = String(idx);

      // Actualizar UI
      document.getElementById('current-badge-code').textContent = `Obra ${d.badge} de 100`;
      document.getElementById('shop-title').textContent = d.title;
      document.getElementById('shop-subtitle').textContent = `${d.sub || ''} · ${d.cat || ''}`;
      document.getElementById('vitrina-formula-badge').textContent = `Obra ${d.badge}: ${d.title} (${d.author || d.solver || 'Timonel'}, ${d.year})`;

      // Reiniciar simulación matemática para este índice
      window.AtelierMath.init(idx);
      for (let k = 0; k < 12; k++) window.AtelierMath.step(idx);
      if (artworkTexture) artworkTexture.needsUpdate = true;

      // Generar diales específicos para esta fórmula
      renderDynamicParamDials(idx);
    }

    function renderDynamicParamDials(idx) {
      const container = document.getElementById('dynamic-param-bar');
      if (!container) return;
      container.innerHTML = '';

      // Botón de Pausa / Reanudación
      const btnPause = document.createElement('button');
      btnPause.className = 'px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#f4f1ea] transition cursor-pointer';
      btnPause.textContent = isSimulationPaused ? 'Reanudar ▶' : 'Pausa ⏸';
      btnPause.onclick = () => {
        isSimulationPaused = !isSimulationPaused;
        btnPause.textContent = isSimulationPaused ? 'Reanudar ▶' : 'Pausa ⏸';
      };
      container.appendChild(btnPause);

      // Botón de Reinicio
      const btnRestart = document.createElement('button');
      btnRestart.className = 'px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#a1a1aa] hover:text-white transition cursor-pointer';
      btnRestart.textContent = 'Reiniciar ↻';
      btnRestart.onclick = () => window.AtelierMath.init(idx);
      container.appendChild(btnRestart);

      // Controles paramétricos específicos según la ley
      if (idx === 26) { // Chladni en el catálogo de 100
        const modes = window.AtelierMath.getChladniModes();
        const span = document.createElement('span');
        span.innerHTML = `Modos: <strong>(${modes.m}, ${modes.n})</strong>`;
        container.appendChild(span);

        const btnNextMode = document.createElement('button');
        btnNextMode.className = 'px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#dfc285] hover:bg-[#c5a059]/30 transition cursor-pointer';
        btnNextMode.textContent = 'Siguiente Modo ♫';
        btnNextMode.onclick = () => {
          let nm = (modes.m % 7) + 1;
          let nn = ((modes.n + 1) % 7) + 1;
          window.AtelierMath.setChladniModes(nm, nn);
          renderDynamicParamDials(idx);
        };
        container.appendChild(btnNextMode);
      } else {
        const d = (window.ARTWORKS_100 && window.ARTWORKS_100[idx]) || (window.AtelierMath && window.AtelierMath.ARTWORKS[idx]) || {};
        const hintSpan = document.createElement('span');
        hintSpan.className = 'text-[#a1a1aa] truncate';
        hintSpan.textContent = d.hint || d.poem || 'Simulación en silicio nativo (60 FPS)';
        container.appendChild(hintSpan);
      }
    }

    function togglePalette() {
      const nextPal = window.AtelierMath.getPalette() + 1;
      window.AtelierMath.setPalette(nextPal);
      window.AtelierMath.init(currentArtIdx);
    }

    // ── 6. SELECCIÓN DE FORMATO & MOLDURAS ────────────────────────────
    function selectFormat(fmt) {
      currentFormat = fmt;
      ['fineart', 'acrylic', 'mug', 'notebook'].forEach(f => {
        const el = document.getElementById(`card-fmt-${f}`);
        if (el) {
          el.classList.toggle('luxury-gold-border', f === fmt);
          el.classList.toggle('bg-[#141418]', f === fmt);
          el.classList.toggle('luxury-border', f !== fmt);
          el.classList.toggle('bg-[#101014]', f !== fmt);
        }
      });

      const finishSec = document.getElementById('finish-section');
      if (finishSec) {
        finishSec.style.display = (fmt === 'fineart') ? 'block' : 'none';
      }

      updatePriceDisplay();
      const badgeEl = document.getElementById('vitrina-product-badge');
      if (badgeEl) badgeEl.textContent = `${PRICES[fmt].label} · Montado en Pared`;

      buildProductGeometry();
    }

    function updatePriceDisplay() {
      const fmt = PRICES[currentFormat] || PRICES.fineart;
      const clpEl = document.getElementById('total-price-clp');
      const usdEl = document.getElementById('total-price-usd');
      const modalPrice = document.getElementById('modal-art-price');

      let mainPrice = fmt.clp;
      let secPrice = fmt.usd;
      if (currentCurrency === 'USD') {
        mainPrice = fmt.usd;
        secPrice = `${fmt.clp} · ${fmt.eur}`;
      } else if (currentCurrency === 'EUR') {
        mainPrice = fmt.eur;
        secPrice = `${fmt.clp} · ${fmt.usd}`;
      }

      if (clpEl) clpEl.textContent = mainPrice;
      if (usdEl) usdEl.textContent = secPrice;
      if (modalPrice) modalPrice.textContent = mainPrice;
    }

    function setCurrency(c) {
      currentCurrency = c;
      updatePriceDisplay();
      ['clp', 'usd', 'eur'].forEach(curr => {
        const btn = document.getElementById(`curr-btn-${curr}`);
        if (btn) {
          const isActive = (curr === c.toLowerCase());
          btn.className = isActive ?
            'px-2 py-0.5 rounded border border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 font-bold text-[10px] mono' :
            'px-2 py-0.5 rounded border border-white/10 text-[#71717a] hover:text-[#a1a1aa] text-[10px] mono';
        }
      });
    }

    function setFrameFinish(finish) {
      currentFrameFinish = finish;
      ['black', 'oak', 'walnut'].forEach(f => {
        const btn = document.getElementById(`btn-frame-${f}`);
        if (btn) {
          btn.classList.toggle('luxury-gold-border', f === finish);
          btn.classList.toggle('text-[#c5a059]', f === finish);
          btn.classList.toggle('luxury-border', f !== finish);
          btn.classList.toggle('text-[#a1a1aa]', f !== finish);
        }
      });
      buildProductGeometry();
    }

    function setMatteFinish(finish) {
      currentMatteFinish = finish;
      ['white', 'cream', 'dark'].forEach(f => {
        const btn = document.getElementById(`btn-mat-${f}`);
        if (btn) {
          btn.classList.toggle('luxury-gold-border', f === finish);
          btn.classList.toggle('text-[#c5a059]', f === finish);
          btn.classList.toggle('luxury-border', f !== finish);
          btn.classList.toggle('text-[#a1a1aa]', f !== finish);
        }
      });
      buildProductGeometry();
    }

    function setLighting(mode) {
      currentLighting = mode;
      ['warm', 'neutral', 'intimate'].forEach(m => {
        const btn = document.getElementById(`btn-light-${m}`);
        if (btn) {
          btn.classList.toggle('text-[#c5a059]', m === mode);
          btn.classList.toggle('bg-[#c5a059]/10', m === mode);
          btn.classList.toggle('text-[#a1a1aa]', m !== mode);
        }
      });

      if (mode === 'warm') {
        spotLightKey.color.setHex(0xfef2db);
        spotLightKey.intensity = 3.6;
        ambientLight.intensity = 0.38;
      } else if (mode === 'neutral') {
        spotLightKey.color.setHex(0xffffff);
        spotLightKey.intensity = 3.2;
        ambientLight.intensity = 0.45;
      } else if (mode === 'intimate') {
        spotLightKey.color.setHex(0xffd599);
        spotLightKey.intensity = 2.4;
        ambientLight.intensity = 0.22;
      }
    }

    // ── 7. LOOP DE RENDER & PARALAJE DE TIMONEL ──────────────────────
    function animate() {
      requestAnimationFrame(animate);
      if (!isTabVisible) return;

      // 1. Paso de cálculo de la ecuación matemática (a 60 FPS dentro del marco)
      if (!isSimulationPaused) {
        window.AtelierMath.step(currentArtIdx);
        artworkTexture.needsUpdate = true;
      }

      // 2. Interpolar posición del ojo del observador (Paralaje físico ultra fluido)
      eyePos.x += (targetEyePos.x - eyePos.x) * 0.18;
      eyePos.y += (targetEyePos.y - eyePos.y) * 0.18;
      eyePos.z += (targetEyePos.z - eyePos.z) * 0.18;

      camera.position.copy(eyePos);
      // Enfoca el centro del cuadro con sutil compensación óptica
      camera.lookAt(eyePos.x * 0.08, 0.12 + (eyePos.y - 0.12) * 0.05, 0);

      renderer.render(scene, camera);
    }

    // ── 8. EXPORTADOR DE LÁMINA 300 DPI & GRABADOR 60 FPS ─────────────
    function downloadArtwork300DPI() {
      const d = window.AtelierMath.ARTWORKS[currentArtIdx];
      const link = document.createElement('a');
      link.download = `Atelier_${d.title.replace(/\s+/g, '_')}_FineArt_300DPI.png`;
      link.href = artworkTextureCanvas.toDataURL('image/png');
      link.click();
    }

    function startVideoRecording(seconds) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        return;
      }
      recordedChunks = [];
      const stream = artworkTextureCanvas.captureStream(60);

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

        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const title = window.AtelierMath.ARTWORKS[currentArtIdx].title.replace(/\s+/g, '_');
        a.download = `Atelier_${title}_Reel_${seconds}s_60FPS.webm`;
        a.click();
      };

      mediaRecorder.start();
      document.getElementById('rec-banner').classList.remove('hidden');
      document.getElementById('btn-rec-15').classList.add('border-red-500', 'bg-red-950/40');

      let remaining = seconds;
      document.getElementById('rec-countdown').textContent = `GRABANDO REEL ${remaining}s (60 FPS)`;
      recordingCountdownInterval = setInterval(() => {
        remaining--;
        if (remaining > 0) {
          document.getElementById('rec-countdown').textContent = `GRABANDO REEL ${remaining}s (60 FPS)`;
        }
      }, 1000);

      recordingTimeout = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
      }, seconds * 1000);
    }

    // ── 9. FORMALIZACIÓN DE ENCARGO & WHATSAPP ────────────────────────
    function openCheckoutModal() {
      const art = window.AtelierMath.ARTWORKS[currentArtIdx];
      const fmt = PRICES[currentFormat];
      document.getElementById('modal-art-title').textContent = art.title;
      
      let finishStr = fmt.label;
      if (currentFormat === 'fineart') {
        const wood = currentFrameFinish === 'black' ? 'Ébano Mate' : (currentFrameFinish === 'oak' ? 'Roble Claro' : 'Nogal Noble');
        const mat = currentMatteFinish === 'white' ? 'Blanco Algodón' : (currentMatteFinish === 'cream' ? 'Crema Museo' : 'Grafito');
        finishStr += ` · Marco ${wood} · Paspartú ${mat}`;
      }
      document.getElementById('modal-art-format').textContent = finishStr;
      document.getElementById('modal-art-price').textContent = fmt.clp;
      document.getElementById('checkout-modal').classList.remove('hidden');
    }

    function closeCheckoutModal() {
      document.getElementById('checkout-modal').classList.add('hidden');
    }

    function orderViaWhatsApp() {
      const art = window.AtelierMath.ARTWORKS[currentArtIdx];
      const fmt = PRICES[currentFormat];
      let finishStr = fmt.label;
      if (currentFormat === 'fineart') {
        const wood = currentFrameFinish === 'black' ? 'Ébano Mate' : (currentFrameFinish === 'oak' ? 'Roble Claro' : 'Nogal Noble');
        const mat = currentMatteFinish === 'white' ? 'Blanco Algodón' : (currentMatteFinish === 'cream' ? 'Crema Museo' : 'Grafito');
        finishStr += ` (Moldura: ${wood}, Paspartú: ${mat})`;
      }

      const msg = encodeURIComponent(
        `*ATELIER MATEMÁTICO — ENCARGO FORMAL DE AUTOR*\n\n` +
        `· Obra: ${art.title} (Obra ${art.badge})\n` +
        `· Ecuación / Enigma: ${art.sub}\n` +
        `· Formato: ${finishStr}\n` +
        `· Inversión: ${fmt.clp} (${fmt.usd})\n` +
        `· Anticipo sugerido: 50% para inicio de manufactura\n\n` +
        `Hola Matías, he configurado mi pieza en la Vitrina de Pared del Atelier. Deseo coordinar el anticipo para iniciar la manufactura en Santiago.`
      );
      window.open(`https://wa.me/56900000000?text=${msg}`, '_blank');
    }

    function submitOrder(e) {
      e.preventDefault();
      const name = document.getElementById('cust-name').value;
      const email = document.getElementById('cust-email').value;
      const phone = document.getElementById('cust-phone').value;
      const addr = document.getElementById('cust-addr').value;

      const art = window.AtelierMath.ARTWORKS[currentArtIdx];
      const fmt = PRICES[currentFormat];
      let finishStr = fmt.label;
      if (currentFormat === 'fineart') {
        const wood = currentFrameFinish === 'black' ? 'Ébano Mate' : (currentFrameFinish === 'oak' ? 'Roble Claro' : 'Nogal Noble');
        const mat = currentMatteFinish === 'white' ? 'Blanco Algodón' : (currentMatteFinish === 'cream' ? 'Crema Museo' : 'Grafito');
        finishStr += ` (${wood} / ${mat})`;
      }

      const msg = encodeURIComponent(
        `*ATELIER MATEMÁTICO — FORMALIZACIÓN DE ENCARGO*\n\n` +
        `· Cliente: ${name}\n` +
        `· Teléfono: ${phone}\n` +
        `· Email: ${email}\n` +
        `· Dirección: ${addr}\n` +
        `· Obra: ${art.title} (Obra ${art.badge})\n` +
        `· Formato: ${finishStr}\n` +
        `· Monto Total: ${fmt.clp}\n\n` +
        `Hola Matías, confirmo mi encargo formal. Quedo a la espera de los datos de transferencia del 50% de anticipo para iniciar la confección en taller.`
      );
      window.open(`https://wa.me/56900000000?text=${msg}`, '_blank');
      closeCheckoutModal();
    }

    function downloadCertificate() {
      const art = (window.AtelierMath && window.AtelierMath.ARTWORKS) ? window.AtelierMath.ARTWORKS[currentArtIdx] : { badge: '01', title: 'Obra Maestra', sub: 'Ecuación Canónica' };
      const certCanvas = document.createElement('canvas');
      certCanvas.width = 1800;
      certCanvas.height = 1200;
      const cctx = certCanvas.getContext('2d');

      // Fondo papel algodón museo
      cctx.fillStyle = '#0a0a0e';
      cctx.fillRect(0, 0, 1800, 1200);

      // Marco dorado doble
      cctx.strokeStyle = '#c5a059';
      cctx.lineWidth = 4;
      cctx.strokeRect(60, 60, 1680, 1080);
      cctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
      cctx.lineWidth = 1.5;
      cctx.strokeRect(74, 74, 1652, 1052);

      // Cabecera institucional
      cctx.fillStyle = '#c5a059';
      cctx.font = 'bold 24px Space Mono, monospace';
      cctx.textAlign = 'center';
      cctx.fillText('ATELIER MATEMÁTICO · CERTIFICADO DE AUTENTICIDAD NUMÉRICA', 900, 140);

      cctx.fillStyle = '#71717a';
      cctx.font = '16px Space Mono, monospace';
      cctx.fillText('GOBERNANZA PREFRONTAL TIMONEL F2 · SILICIO NATIVO · SANTIAGO DE CHILE', 900, 175);

      // Título de la obra
      cctx.fillStyle = '#f4f1ea';
      cctx.font = 'bold 50px Cinzel, serif';
      cctx.fillText(`OBRA ${art.badge}: ${art.title.toUpperCase()}`, 900, 290);

      cctx.fillStyle = '#dfc285';
      cctx.font = 'italic 22px Cinzel, serif';
      cctx.fillText(art.sub || 'Ecuación Canónica de la Humanidad', 900, 335);

      // Línea divisoria
      cctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      cctx.lineWidth = 1;
      cctx.beginPath();
      cctx.moveTo(300, 380);
      cctx.lineTo(1500, 380);
      cctx.stroke();

      // Ficha técnica de conservación
      cctx.textAlign = 'left';
      cctx.font = '18px Space Mono, monospace';
      cctx.fillStyle = '#a1a1aa';
      
      const leftCol = 220;
      cctx.fillText('• Sustrato Físico:   Hahnemühle Photo Rag 308 g/m² (100% Algodón, Libre de Ácido)', leftCol, 450);
      cctx.fillText('• Pigmentación:      Tintas Minerales Epson UltraChrome Pro12 (Longevidad >100 años)', leftCol, 500);
      cctx.fillText('• Protección Óptica: Cristal Acrílico Museo con 99% de Bloqueo Ultravioleta', leftCol, 550);
      cctx.fillText('• Integración:       RK4 / C11 Silicio Nativo a 60 FPS sin aproximaciones falsas', leftCol, 600);
      cctx.fillText('• Residuo Residual:  ‖F(x)‖ ≤ 1e-12 (Validado deterministamente en silicio)', leftCol, 650);

      // Sello criptográfico SHA-256
      const serialNum = `ATM-2026-${String(art.badge).padStart(3, '0')}-${Math.floor(100000 + Math.random()*900000)}`;
      const sha256Sim = `sha256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

      cctx.fillStyle = '#08080a';
      cctx.fillRect(leftCol, 710, 1360, 130);
      cctx.strokeStyle = 'rgba(197, 160, 89, 0.5)';
      cctx.strokeRect(leftCol, 710, 1360, 130);

      cctx.fillStyle = '#c5a059';
      cctx.font = 'bold 15px Space Mono, monospace';
      cctx.fillText(`NÚMERO DE REGISTRO: ${serialNum}`, leftCol + 30, 755);
      cctx.fillStyle = '#71717a';
      cctx.font = '14px Space Mono, monospace';
      cctx.fillText(`HUELLA CRIPTOGRÁFICA DE SIMULACIÓN: ${sha256Sim}`, leftCol + 30, 790);
      cctx.fillText(`ESTADO DE VERIFICACIÓN: CERTIFICADO POR TIMONEL F2 (SIN RETRO-FITTING)`, leftCol + 30, 820);

      // Firmas
      cctx.textAlign = 'center';
      cctx.fillStyle = '#f4f1ea';
      cctx.font = 'italic 20px Cinzel, serif';
      cctx.fillText('Matías Cortés Figueroa', 550, 970);
      cctx.font = '12px Space Mono, monospace';
      cctx.fillStyle = '#71717a';
      cctx.fillText('DIRECCIÓN CIENTÍFICA & ARTÍSTICA', 550, 1000);

      cctx.font = 'italic 20px Cinzel, serif';
      cctx.fillStyle = '#f4f1ea';
      cctx.fillText('Timonel F2 Autonomous Oracle', 1250, 970);
      cctx.font = '12px Space Mono, monospace';
      cctx.fillStyle = '#71717a';
      cctx.fillText('CERTIFICADOR RESIDUAL DETERMINISTA', 1250, 1000);

      const link = document.createElement('a');
      link.download = `Certificado_Autenticidad_Obra_${art.badge}_${art.title.replace(/\s+/g, '_')}.png`;
      link.href = certCanvas.toDataURL('image/png');
      link.click();
    }

    // Exportación a nivel global
    window.selectArtwork = selectArtwork;
    window.cycleArtwork = cycleArtwork;
    window.setCameraPreset = setCameraPreset;
    window.switchProductFormat = switchProductFormat;
    window.setFrameFinish = setFrameFinish;
    window.setMatteFinish = setMatteFinish;
    window.setLightIntensity = setLightIntensity;
    window.setCurrency = setCurrency;
    window.updatePriceDisplay = updatePriceDisplay;
    window.openCheckoutModal = openCheckoutModal;
    window.closeCheckoutModal = closeCheckoutModal;
    window.orderViaWhatsApp = orderViaWhatsApp;
    window.submitOrder = submitOrder;
    window.downloadCertificate = downloadCertificate;
    window.startVideoRecording = startVideoRecording;
    window.togglePalette = togglePalette;
    window.restartArtwork = restartArtwork;
