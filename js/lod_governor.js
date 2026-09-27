// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — GOBERNADOR ADAPTATIVO DE RENDIMIENTO & LOD
// Sistema Soberano de Nivel de Detalle y Frame Budgeting WebGL
// Gobernanza: Timonel F2 | Cero Caídas de Fotogramas | Silicio Eficiente
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  'use strict';

  // ── Perfiles Estándar de Rendimiento (TIERS) ──────────────────────
  const TIERS = {
    ULTRA: {
      key: 'ULTRA',
      name: 'Ultra (Fidelidad Máxima)',
      dprMultiplier: 1.0,
      maxDPR: 1.5,
      shadows: true,
      shadowMapSize: 1024,
      maxStars: 3500,
      maxViewDist: 250.0,
      nearDist: 50.0,
      midDist: 100.0,
      updateRates: { near: 1, mid: 1, far: 2 } // 1 = 60 FPS, 2 = 30 FPS, 4 = 15 FPS
    },
    HIGH: {
      key: 'HIGH',
      name: 'Alto (Equilibrado)',
      dprMultiplier: 1.0,
      maxDPR: 1.0,
      shadows: true,
      shadowMapSize: 512,
      maxStars: 2200,
      maxViewDist: 180.0,
      nearDist: 40.0,
      midDist: 85.0,
      updateRates: { near: 1, mid: 2, far: 3 }
    },
    MEDIUM: {
      key: 'MEDIUM',
      name: 'Medio (Hardware Integrado)',
      dprMultiplier: 0.85,
      maxDPR: 0.85,
      shadows: false,
      shadowMapSize: 256,
      maxStars: 1200,
      maxViewDist: 120.0,
      nearDist: 30.0,
      midDist: 65.0,
      updateRates: { near: 1, mid: 3, far: 4 }
    },
    ECO: {
      key: 'ECO',
      name: 'Eco / Batería (Móvil Ligero)',
      dprMultiplier: 0.75,
      maxDPR: 0.75,
      shadows: false,
      shadowMapSize: 0,
      maxStars: 600,
      maxViewDist: 85.0,
      nearDist: 25.0,
      midDist: 50.0,
      updateRates: { near: 1, mid: 4, far: 6 }
    }
  };

  const TIER_ORDER = ['ECO', 'MEDIUM', 'HIGH', 'ULTRA'];

  const MODES = {
    AUTO: 'AUTO',
    MANUAL: 'MANUAL'
  };

  // ── Estado Interno del Gobernador ─────────────────────────────────
  let currentTier = TIERS.HIGH;
  let currentMode = MODES.AUTO;

  let rendererRef = null;
  let sceneRef = null;
  let cameraRef = null;
  let starsMeshRef = null;
  let dirLightRef = null;
  let astrosListRef = [];

  // Muestreo de Frame Budgeting (Ventana móvil de 60 fotogramas)
  const FRAME_SAMPLE_SIZE = 60;
  const frameDeltas = new Float32Array(FRAME_SAMPLE_SIZE);
  let frameIndex = 0;
  let totalSampleFrames = 0;
  let rollingAvgDelta = 0.0166;
  let smoothedFps = 60;
  let lastFpsUpdateTime = 0;

  // Lógica Adaptativa
  let framesUnderThreshold = 0;
  let framesOverThreshold = 0;
  const DOWNGRADE_MS = 28.5; // < 35 FPS sostenido -> Descenso
  const UPGRADE_MS = 17.5;   // > 57 FPS sostenido -> Ascenso
  const UPGRADE_GRACE_FRAMES = 90; // Estabilidad requerida antes de ascender (1.5s a 60 FPS)

  // Reusable Frustum Objects
  let _frustum = null;
  let _projScreenMatrix = null;
  let _tmpSphere = null;

  // ── Inicialización ────────────────────────────────────────────────
  function init(config) {
    config = config || {};
    rendererRef = config.renderer || null;
    sceneRef = config.scene || null;
    cameraRef = config.camera || null;
    starsMeshRef = config.starsMesh || null;
    dirLightRef = config.dirLight || null;
    astrosListRef = config.astrosList || [];

    // Detección heurística inicial según capacidades de hardware
    const initialTierKey = detectHardwareCapability();
    currentTier = TIERS[initialTierKey] || TIERS.HIGH;
    currentMode = config.mode || MODES.AUTO;

    // Crear objetos de frustum si THREE está disponible
    if (typeof THREE !== 'undefined') {
      _frustum = new THREE.Frustum();
      _projScreenMatrix = new THREE.Matrix4();
      _tmpSphere = new THREE.Sphere(new THREE.Vector3(), 3.5);
    }

    applyTierSettings(currentTier);
  }

  function detectHardwareCapability() {
    if (typeof window === 'undefined') return 'HIGH';
    
    // Si es móvil o tableta táctil, comenzar en MEDIUM para preservar fluidez y batería
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     (window.innerWidth < 768);
    if (isMobile) return 'MEDIUM';

    // Hardware Concurrency bajo (<= 4 hilos lógicos en CPU integrada)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      return 'MEDIUM';
    }

    return 'HIGH';
  }

  // ── Aplicación en Silicio de los Parámetros del Tier ───────────────
  function applyTierSettings(tier) {
    if (!tier) return;
    currentTier = tier;

    if (rendererRef && typeof window !== 'undefined') {
      const nativeDPR = window.devicePixelRatio || 1.0;
      const targetDPR = Math.min(nativeDPR * tier.dprMultiplier, tier.maxDPR);
      rendererRef.setPixelRatio(targetDPR);

      // Gestión de Sombras Dinámicas
      if (rendererRef.shadowMap) {
        const prevShadow = rendererRef.shadowMap.enabled;
        rendererRef.shadowMap.enabled = tier.shadows;
        if (dirLightRef && dirLightRef.castShadow !== undefined) {
          dirLightRef.castShadow = tier.shadows;
          if (tier.shadows && tier.shadowMapSize > 0) {
            dirLightRef.shadow.mapSize.width = tier.shadowMapSize;
            dirLightRef.shadow.mapSize.height = tier.shadowMapSize;
          }
        }
        // Si cambió el estado de sombras, recompilar shaders del grafo de escena
        if (prevShadow !== tier.shadows && sceneRef) {
          sceneRef.traverse(obj => {
            if (obj.material) {
              if (Array.isArray(obj.material)) obj.material.forEach(m => m.needsUpdate = true);
              else obj.material.needsUpdate = true;
            }
          });
        }
      }
    }

    // Campo Estelar (setDrawRange de BufferGeometry para 0 costo de asignación)
    if (starsMeshRef && starsMeshRef.geometry) {
      const geo = starsMeshRef.geometry;
      const starCount = Math.min(tier.maxStars, 3500);
      geo.setDrawRange(0, starCount);
    }
  }

  // ── Actualización en Cada Fotograma ───────────────────────────────
  function update(delta) {
    // 1. Registro de tiempo de cuadro
    if (delta > 0 && delta < 0.5) {
      frameDeltas[frameIndex] = delta;
      frameIndex = (frameIndex + 1) % FRAME_SAMPLE_SIZE;
      if (totalSampleFrames < FRAME_SAMPLE_SIZE) totalSampleFrames++;

      let sum = 0;
      for (let i = 0; i < totalSampleFrames; i++) sum += frameDeltas[i];
      rollingAvgDelta = sum / totalSampleFrames;
      smoothedFps = Math.round(1.0 / rollingAvgDelta);
    }

    // 2. Control Adaptativo en Modo AUTO
    if (currentMode === MODES.AUTO && totalSampleFrames >= 30) {
      const avgMs = rollingAvgDelta * 1000;

      if (avgMs > DOWNGRADE_MS) {
        framesUnderThreshold++;
        framesOverThreshold = 0;
        // Si durante 40 frames consecutivos no alcanzamos el presupuesto -> Degradar 1 nivel
        if (framesUnderThreshold > 40) {
          downgradeTier();
          framesUnderThreshold = 0;
        }
      } else if (avgMs < UPGRADE_MS) {
        framesOverThreshold++;
        framesUnderThreshold = 0;
        // Si durante UPGRADE_GRACE_FRAMES frames estamos en > 57 FPS estables -> Ascender 1 nivel
        if (framesOverThreshold > UPGRADE_GRACE_FRAMES) {
          upgradeTier();
          framesOverThreshold = 0;
        }
      } else {
        framesUnderThreshold = Math.max(0, framesUnderThreshold - 1);
        framesOverThreshold = Math.max(0, framesOverThreshold - 1);
      }
    }

    // 3. Actualizar planos de corte de Frustum de la cámara
    if (cameraRef && _frustum && _projScreenMatrix) {
      cameraRef.updateMatrixWorld();
      _projScreenMatrix.multiplyMatrices(cameraRef.projectionMatrix, cameraRef.matrixWorldInverse);
      _frustum.setFromProjectionMatrix(_projScreenMatrix);
    }
  }

  // ── Transiciones Adaptativas ──────────────────────────────────────
  function downgradeTier() {
    const curIdx = TIER_ORDER.indexOf(currentTier.key);
    if (curIdx > 0) {
      const nextTierKey = TIER_ORDER[curIdx - 1];
      applyTierSettings(TIERS[nextTierKey]);
      framesUnderThreshold = 0;
      framesOverThreshold = 0;
      notifyTierChanged('DOWNGRADE');
    }
  }

  function upgradeTier() {
    const curIdx = TIER_ORDER.indexOf(currentTier.key);
    if (curIdx < TIER_ORDER.length - 1) {
      const nextTierKey = TIER_ORDER[curIdx + 1];
      applyTierSettings(TIERS[nextTierKey]);
      framesUnderThreshold = 0;
      framesOverThreshold = 0;
      notifyTierChanged('UPGRADE');
    }
  }

  function notifyTierChanged(direction) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const ev = new CustomEvent('atelier-lod-changed', {
        detail: { tier: currentTier, direction: direction }
      });
      window.dispatchEvent(ev);
    }
  }

  // ── Pruebas de Culling & Throttling de Astros ──────────────────────
  function isAstroInFrustum(worldPos, radius) {
    if (!_frustum || !worldPos) return true;
    _tmpSphere.center.copy(worldPos);
    _tmpSphere.radius = radius || 3.8;
    return _frustum.intersectsSphere(_tmpSphere);
  }

  function shouldUpdateAstro(astro, distToCam, frameCounter) {
    if (!astro) return false;

    // Distancia máxima de visibilidad según el Tier
    if (distToCam > currentTier.maxViewDist) {
      return false;
    }

    // Tasa de actualización entrelazada según la distancia
    const rates = currentTier.updateRates;
    let rate = rates.near;
    if (distToCam > currentTier.midDist) {
      rate = rates.far;
    } else if (distToCam > currentTier.nearDist) {
      rate = rates.mid;
    }

    if (rate <= 1) return true;
    return ((frameCounter + (astro.index || 0)) % rate) === 0;
  }

  // ── API Pública ───────────────────────────────────────────────────
  function setTier(tierKey) {
    if (TIERS[tierKey]) {
      applyTierSettings(TIERS[tierKey]);
      framesUnderThreshold = 0;
      framesOverThreshold = 0;
      notifyTierChanged('MANUAL');
    }
  }

  function setMode(modeKey) {
    if (MODES[modeKey]) {
      currentMode = MODES[modeKey];
    }
  }

  function getTelemetry() {
    let drawCalls = 0;
    let triangles = 0;
    if (rendererRef && rendererRef.info) {
      drawCalls = rendererRef.info.render.calls || 0;
      triangles = rendererRef.info.render.triangles || 0;
    }

    return {
      fps: smoothedFps,
      avgMs: +(rollingAvgDelta * 1000).toFixed(1),
      tier: currentTier,
      mode: currentMode,
      dpr: rendererRef ? rendererRef.getPixelRatio() : 1.0,
      drawCalls,
      triangles,
      shadowsEnabled: currentTier.shadows,
      maxStars: currentTier.maxStars
    };
  }

  const AtelierLOD = {
    TIERS,
    MODES,
    init,
    update,
    setTier,
    setMode,
    getTier: () => currentTier,
    getMode: () => currentMode,
    getTelemetry,
    isAstroInFrustum,
    shouldUpdateAstro,
    applyTierSettings
  };

  root.AtelierLOD = AtelierLOD;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AtelierLOD, TIERS, MODES };
  }

})(typeof window !== 'undefined' ? window : global);
