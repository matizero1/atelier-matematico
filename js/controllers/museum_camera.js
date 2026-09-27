/**
 * 🛰️ ATELIER MATEMÁTICO — SUBSISTEMA DE CÁMARA, 6DOF & CINEMÁTICA GOTO
 * Navegación Inercial 6DOF, Cinemática Ecuatorial de Paranal y Burbuja Confinamiento S²
 * Gobernanza: Timonel F2 · Cero Dependencias · Silicio Nativo
 */

(function(root) {
  'use strict';

  // ── ESTADO COMPARTIDO DE CÁMARA & NAVEGACIÓN ──────────────────────
  const state = (root.AtelierCameraState = root.AtelierCameraState || {
    MODE_ROTUNDA_TELESCOPE: 0,
    MODE_SPHERE_CONFINEMENT: 1,
    mode: 0,
    velocity: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 0, 0) : { x: 0, y: 0, z: 0 },
    orientation: { pitch: 0, yaw: 0 },
    targetOrientation: { pitch: 0, yaw: 0 },
    targetTelescopeAngles: { ha: 0, dec: 0.35 },
    currentTelescopeAngles: { ha: 0, dec: 0.35 },
    isTelescopeSlewing: false,
    slewStartTime: 0,
    slewStartAngles: { ha: 0, dec: 0.35 },
    isTelescopeModalOpen: false,
    gotoEpochFilter: 0,
    gotoSearchQuery: '',
    keysPressed: {},
    platformObserverPos: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 1.65, 0) : { x: 0, y: 1.65, z: 0 },
    targetPlatformPos: (typeof THREE !== 'undefined') ? new THREE.Vector3(0, 1.65, 0) : { x: 0, y: 1.65, z: 0 },
    sphereRadius: 3.6,
    targetSphereRadius: 3.6,
    sphereTheta: 0.0,
    targetSphereTheta: 0.0,
    spherePhi: Math.PI / 2.2,
    targetSpherePhi: Math.PI / 2.2,
    userInertiaTimer: 0,
    activeConfinementAstro: null,
    currentFocusedAstro: null,
    collimatedAstroIndex: -1,
    currentActiveEpoch: 0,
    isPointerLocked: false,
    currentMouseScreenPos: { x: -1, y: -1 }
  });

  // Constantes astronómicas de Paranal
  const LAT_PARANAL = 24.6 * Math.PI / 180;
  const COS_LAT = Math.cos(LAT_PARANAL);
  const SIN_LAT = Math.sin(LAT_PARANAL);

  // Vectores estáticos para colimación sin pausas GC
  let _collimationLookDir = null;
  let _collimationToA = null;

  function slewTelescopeToTarget(targetIdx, andWarp = false) {
    const astros24 = root.astros24 || [];
    if (targetIdx < 0 || targetIdx >= astros24.length) return;
    const astro = astros24[targetIdx];
    state.collimatedAstroIndex = targetIdx;

    // Cinemática ecuatorial exacta
    const tx = astro.worldPos.x, ty = astro.worldPos.y, tz = astro.worldPos.z;
    let dx = tx - 0, dy = ty - 2.8, dz = tz - 5.0;
    const len = Math.hypot(dx, dy, dz) || 1.0;
    dx /= len; dy /= len; dz /= len;

    const px = dx;
    const py = COS_LAT * dy + SIN_LAT * dz;
    const pz = -SIN_LAT * dy + COS_LAT * dz;

    const ha = Math.atan2(px, pz);
    const dec = Math.atan2(Math.sin(ha)*px + Math.cos(ha)*pz, py);

    state.targetTelescopeAngles.ha = ha;
    state.targetTelescopeAngles.dec = dec;
    state.isTelescopeSlewing = true;
    state.slewStartTime = performance.now();
    state.slewStartAngles.ha = state.currentTelescopeAngles.ha;
    state.slewStartAngles.dec = state.currentTelescopeAngles.dec;

    // Alinear cámara del observador hacia la fórmula seleccionada
    if (root.camera && typeof THREE !== 'undefined') {
      const camDir = new THREE.Vector3().subVectors(astro.worldPos, root.camera.position).normalize();
      state.targetOrientation.yaw = Math.atan2(-camDir.x, -camDir.z);
      state.targetOrientation.pitch = Math.asin(Math.max(-0.45, Math.min(1.48, camDir.y)));
      state.userInertiaTimer = 0;
    }

    if (root.MuseumAudio && typeof root.MuseumAudio.playServoSound === 'function') {
      root.MuseumAudio.playServoSound();
    }

    if (root.MuseumHUD && typeof root.MuseumHUD.updateTelescopeScreenTexture === 'function') {
      root.MuseumHUD.updateTelescopeScreenTexture(astro.data);
    }

    closeTelescopeGotoTerminal();

    if (typeof document !== 'undefined') {
      const statusEl = document.getElementById('goto-current-status');
      if (statusEl) statusEl.textContent = `Alineando con Obra ${astro.data.badge}: ${astro.data.title}`;
    }

    if (andWarp) {
      setTimeout(() => {
        warpToTargetAstro(targetIdx);
      }, 1150);
    }
  }

  function openTelescopeGotoTerminal() {
    state.isTelescopeModalOpen = true;
    if (typeof document !== 'undefined') {
      const modal = document.getElementById('telescope-goto-modal');
      if (modal) {
        modal.classList.remove('hidden');
        renderGotoCatalog();
        const searchInput = document.getElementById('goto-search-input');
        if (searchInput) {
          searchInput.value = '';
          state.gotoSearchQuery = '';
          setTimeout(() => searchInput.focus(), 50);
        }
      }
      if (document.pointerLockElement && document.exitPointerLock) {
        document.exitPointerLock();
      }
    }
  }

  function closeTelescopeGotoTerminal() {
    state.isTelescopeModalOpen = false;
    if (typeof document !== 'undefined') {
      const modal = document.getElementById('telescope-goto-modal');
      if (modal) modal.classList.add('hidden');
    }
  }

  function toggleTelescopeGotoTerminal() {
    if (state.isTelescopeModalOpen) {
      closeTelescopeGotoTerminal();
    } else {
      openTelescopeGotoTerminal();
    }
  }

  function renderGotoCatalog() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('goto-catalog-container');
    if (!container) return;

    const astros24 = root.astros24 || [];
    const q = state.gotoSearchQuery.toLowerCase().trim();
    const filtered = astros24.filter(astro => {
      const d = astro.data;
      if (state.gotoEpochFilter > 0 && d.epoch !== state.gotoEpochFilter) return false;
      if (q) {
        const match = (
          d.title.toLowerCase().includes(q) ||
          d.sub.toLowerCase().includes(q) ||
          d.cat.toLowerCase().includes(q) ||
          (d.author && d.author.toLowerCase().includes(q)) ||
          d.eq.toLowerCase().includes(q) ||
          d.badge.includes(q)
        );
        if (!match) return false;
      }
      return true;
    });

    const countEl = document.getElementById('goto-visible-count');
    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-[#71717a] mono text-xs">
          No se encontraron fórmulas que coincidan con "${state.gotoSearchQuery}".<br>
          Intenta buscar por científico (ej: Navier, Hooke, Newton, Fermat) o selecciona "Todas".
        </div>
      `;
      return;
    }

    const epochLabels = {
      1: 'I. Clásica',
      2: 'II. Ilustración',
      3: 'III. Termodinámica',
      4: 'IV. Cuántica',
      5: 'V. Caos & Milenio'
    };

    container.innerHTML = filtered.map(astro => {
      const d = astro.data;
      const isTargeted = state.collimatedAstroIndex === astro.index;
      
      const ascHours = Math.floor(((d.theta + Math.PI) / (Math.PI * 2)) * 24);
      const ascMins = Math.floor(((((d.theta + Math.PI) / (Math.PI * 2)) * 24) % 1) * 60);
      const decDeg = Math.floor((d.phi / (Math.PI / 2)) * 90);
      const decSign = decDeg >= 0 ? '+' : '';
      const cam = root.camera;
      const dist = (cam && typeof cam.position !== 'undefined') ? cam.position.distanceTo(astro.worldPos).toFixed(1) : '100.0';

      return `
        <div class="bg-[#12131b] hover:bg-[#161724] border ${isTargeted ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.25)]' : 'border-white/[0.06]'} rounded-2xl p-4 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5 flex-1 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-black/40 border border-[#c5a059]/30 flex items-center justify-center shrink-0">
              <span class="mono text-xs font-bold text-[#c5a059]">${d.badge}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="serif text-sm font-semibold text-[#f4f1ea] truncate">${d.title}</h3>
                <span class="text-[9px] mono px-2 py-0.2 rounded-full bg-white/5 text-[#a1a1aa] border border-white/5">${epochLabels[d.epoch] || 'Época'}</span>
                ${isTargeted ? '<span class="text-[9px] mono px-2 py-0.2 rounded-full bg-[#c5a059]/20 text-[#dfc285] font-semibold animate-pulse">● EN MIRA</span>' : ''}
              </div>
              <div class="text-[11px] mono text-[#a1a1aa] truncate">${d.sub} · <span class="text-[#c5a059]">${d.cat}</span></div>
              <div class="text-[10px] mono text-[#71717a] mt-1 flex flex-wrap items-center gap-3">
                <span>Asc: <strong class="text-[#f4f1ea]">${String(ascHours).padStart(2,'0')}h ${String(ascMins).padStart(2,'0')}m</strong></span>
                <span>·</span>
                <span>Dec: <strong class="text-[#f4f1ea]">${decSign}${decDeg}°</strong></span>
                <span>·</span>
                <span>Dist: <strong class="text-[#f4f1ea]">${dist}m</strong></span>
                <span>·</span>
                <span class="text-[#dfc285] font-mono">${d.eqShort || d.eq}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button onclick="slewTelescopeToTarget(${astro.index}, false)" class="bg-[#181924] hover:bg-[#c5a059]/20 text-[#dfc285] hover:text-white border border-[#c5a059]/40 text-xs px-3.5 py-2 rounded-xl mono transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap">
              <span>🔭</span>
              <span>Apuntar GoTo</span>
            </button>
            <button onclick="slewTelescopeToTarget(${astro.index}, true)" class="bg-[#c5a059] hover:bg-[#dfc285] text-[#08080a] text-xs font-bold px-4 py-2 rounded-xl mono uppercase tracking-wider transition shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <span>🚀</span>
              <span>Entrar</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterGotoCatalog() {
    if (typeof document === 'undefined') return;
    const input = document.getElementById('goto-search-input');
    if (input) {
      state.gotoSearchQuery = input.value;
      renderGotoCatalog();
    }
  }

  function setGotoEpochFilter(epochId) {
    state.gotoEpochFilter = epochId;
    if (typeof document !== 'undefined') {
      for (let i = 0; i <= 5; i++) {
        const btn = document.getElementById(`btn-goto-epoch-${i}`);
        if (btn) {
          if (i === epochId) {
            btn.className = "px-3 py-1.5 rounded-lg text-xs mono transition bg-[#c5a059] text-[#08080a] font-semibold whitespace-nowrap cursor-pointer";
          } else {
            btn.className = "px-3 py-1.5 rounded-lg text-xs mono transition bg-[#14151f] hover:bg-white/10 text-[#a1a1aa] border border-white/5 whitespace-nowrap cursor-pointer";
          }
        }
      }
    }
    renderGotoCatalog();
  }

  function updateTelescopeCollimation() {
    if (state.mode !== state.MODE_ROTUNDA_TELESCOPE || root.isInShopMode) return;
    const cam = root.camera;
    const astros24 = root.astros24 || [];
    if (!cam || !astros24.length || typeof THREE === 'undefined') return;

    if (!_collimationLookDir) _collimationLookDir = new THREE.Vector3();
    if (!_collimationToA) _collimationToA = new THREE.Vector3();

    _collimationLookDir.set(0, 0, -1).applyQuaternion(cam.quaternion);

    let bestIdx = -1;
    let bestDot = Math.cos(15 * Math.PI / 180);

    for (let idx = 0; idx < astros24.length; idx++) {
      const a = astros24[idx];
      if (!a.group || !a.group.visible) continue;
      _collimationToA.subVectors(a.worldPos, cam.position).normalize();
      const dot = _collimationLookDir.dot(_collimationToA);
      if (dot > bestDot) {
        bestDot = dot;
        bestIdx = idx;
      }
    }

    state.collimatedAstroIndex = bestIdx;
    if (typeof document === 'undefined') return;
    const card = document.getElementById('telescope-target-card');
    const reticle = document.getElementById('capsule-reticle');

    if (bestIdx >= 0) {
      const astro = astros24[bestIdx];
      const d = astro.data;
      const dist = cam.position.distanceTo(astro.worldPos).toFixed(1);
      
      const ascHours = Math.floor(((d.theta + Math.PI) / (Math.PI * 2)) * 24);
      const ascMins = Math.floor(((((d.theta + Math.PI) / (Math.PI * 2)) * 24) % 1) * 60);
      const decDeg = Math.floor((d.phi / (Math.PI / 2)) * 90);
      const decSign = decDeg >= 0 ? '+' : '';

      const coordEl = document.getElementById('collimator-coord');
      const titleEl = document.getElementById('collimator-title');
      const subEl = document.getElementById('collimator-sub');
      const epInfo = d.epistemology;
      const epTag = epInfo ? ` · [${epInfo.category === 'A' ? 'FÍSICA ℝ³' : (epInfo.category === 'B' ? 'ESPACIO FASES' : 'PROY. CANÓNICA')}]` : '';

      if (coordEl) coordEl.textContent = `RA: ${String(ascHours).padStart(2,'0')}h ${String(ascMins).padStart(2,'0')}m | DEC: ${decSign}${decDeg}°`;
      if (titleEl) titleEl.textContent = `OBRA ${d.badge}: ${d.title}`;
      if (subEl)   subEl.textContent   = `${d.sub}${epTag} · Distancia: ${dist}m`;
      
      if (card) card.classList.remove('hidden');
      if (reticle) reticle.classList.add('locked');
    } else {
      if (card) card.classList.add('hidden');
      if (reticle) reticle.classList.remove('locked');
    }
  }

  function warpToTargetAstro(idx) {
    const astros24 = root.astros24 || [];
    let targetIdx;
    if (typeof idx === 'number') {
      if (idx >= 0 && idx < astros24.length && astros24[idx].data.id === idx) {
        targetIdx = idx;
      } else {
        const found = astros24.findIndex(a => a.data.id === idx);
        targetIdx = found !== -1 ? found : idx;
      }
    } else {
      targetIdx = state.collimatedAstroIndex;
    }
    if (targetIdx < 0 || targetIdx >= astros24.length) return;
    const astro = astros24[targetIdx];
    state.activeConfinementAstro = astro;
    state.currentFocusedAstro = astro;
    root.currentFocusedAstro = astro;
    state.mode = state.MODE_SPHERE_CONFINEMENT;
    if (root.MuseumHUD) root.MuseumHUD.isHudMinimized = false;

    if (typeof document !== 'undefined' && document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }

    const cam = root.camera;
    if (cam && typeof THREE !== 'undefined') {
      const rel = new THREE.Vector3().subVectors(cam.position, astro.worldPos);
      state.targetSphereRadius = 3.6;
      state.targetSphereTheta = Math.atan2(rel.x, rel.z);
      state.targetSpherePhi = Math.acos(Math.max(-0.95, Math.min(0.95, rel.y / (rel.length() || 3.6))));
      state.sphereTheta = state.targetSphereTheta;
      state.spherePhi = state.targetSpherePhi;
      state.sphereRadius = 3.6;

      const center = astro.worldPos;
      cam.position.set(
        center.x + state.sphereRadius * Math.sin(state.spherePhi) * Math.sin(state.sphereTheta),
        center.y + state.sphereRadius * Math.cos(state.spherePhi),
        center.z + state.sphereRadius * Math.sin(state.spherePhi) * Math.cos(state.sphereTheta)
      );
      cam.lookAt(center);
    }

    // Aislamiento lumínico en modo confinamiento
    astro.group.scale.set(1.0, 1.0, 1.0);
    astros24.forEach(a => {
      if (a === astro) {
        a.group.visible = true;
        if (a.timonelRing && a.timonelRing.material) a.timonelRing.material.opacity = 0.85;
        if (a.pointLight) a.pointLight.intensity = 2.0;
        if (a.fillLight) a.fillLight.intensity = 1.0;
        if (a.model && a.model.group) {
          a.model.group.traverse(child => {
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = 1.0;
            }
          });
        }
      } else {
        if (a.timonelRing && a.timonelRing.material) a.timonelRing.material.opacity = 0.02;
        if (a.pointLight) a.pointLight.intensity = 0.0;
        if (a.fillLight) a.fillLight.intensity = 0.0;
        if (a.model && a.model.group) {
          a.model.group.traverse(child => {
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = 0.04;
            }
          });
        }
      }
    });

    if (typeof document !== 'undefined') {
      const reticle = document.getElementById('capsule-reticle');
      if (reticle) reticle.style.display = 'none';

      const colHud = document.getElementById('telescope-collimator-hud');
      if (colHud) colHud.classList.add('hidden');

      const colCard = document.getElementById('telescope-target-card');
      if (colCard) colCard.classList.add('hidden');
      const returnBar = document.getElementById('confinement-return-bar');
      if (returnBar) returnBar.classList.remove('hidden');
      const swarmPill = document.getElementById('swarm-telemetry-pill');
      if (swarmPill) swarmPill.classList.add('hidden');
      const reopenBtn = document.getElementById('btn-reopen-hud');
      if (reopenBtn) reopenBtn.classList.add('hidden');
      const epochBar = document.getElementById('epoch-filter-bar');
      if (epochBar) epochBar.classList.add('hidden');

      const hudCard = document.getElementById('orbital-hud-card');
      if (hudCard) {
        const d = astro.data;
        const catEl = document.getElementById('hud-cat'); if (catEl) catEl.textContent = d.cat || '';
        const solverEl = document.getElementById('hud-solver'); if (solverEl) solverEl.textContent = d.metric || '';
        const titleEl = document.getElementById('hud-title'); if (titleEl) titleEl.textContent = d.title || '';
        const subEl = document.getElementById('hud-sub'); if (subEl) subEl.textContent = d.sub || '';
        const eqEl = document.getElementById('hud-eq'); if (eqEl) eqEl.innerHTML = (d.eq || '').replace(/\n/g, '<br>');
        const histEl = document.getElementById('hud-hist'); if (histEl) histEl.textContent = d.hist || '';

        const epInfo = d.epistemology;
        const epPill = document.getElementById('hud-epistemology-pill');
        if (epPill && epInfo) {
          epPill.classList.remove('hidden');
          if (epInfo.category === 'A') {
            epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
            epPill.innerHTML = `<div class="font-bold text-emerald-400 mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-emerald-200/80 font-sans">${epInfo.desc}</div>`;
          } else if (epInfo.category === 'B') {
            epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-amber-950/40 border-amber-500/40 text-amber-300';
            epPill.innerHTML = `<div class="font-bold text-[#dfc285] mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-amber-200/80 font-sans">${epInfo.desc}</div>`;
          } else {
            epPill.className = 'mb-3 px-2.5 py-1.5 rounded-lg border text-[9.5px] mono leading-tight bg-purple-950/50 border-purple-500/40 text-purple-300';
            epPill.innerHTML = `<div class="font-bold text-fuchsia-300 mb-0.5 tracking-wide">[${epInfo.tag}]</div><div class="text-purple-200/90 font-sans">${epInfo.desc}</div>`;
          }
        } else if (epPill) {
          epPill.classList.add('hidden');
        }

        hudCard.classList.remove('opacity-0', 'translate-x-8', 'pointer-events-none');
        hudCard.style.opacity = '1';
        hudCard.style.transform = 'none';
      }
    }

    if (root.nai3D && root.nai3D.group) root.nai3D.group.visible = false;

    if (root.MuseumAudio && typeof root.MuseumAudio.speakNai === 'function') {
      root.MuseumAudio.speakNai(`Telescopio colimado. Confinando órbita de ${astro.data.title}.`);
    }
  }

  function returnToRotunda() {
    state.mode = state.MODE_ROTUNDA_TELESCOPE;
    state.activeConfinementAstro = null;
    state.currentFocusedAstro = null;
    root.currentFocusedAstro = null;

    if (root.camera && typeof THREE !== 'undefined') {
      state.targetPlatformPos.set(0, 1.65, 0);
      state.platformObserverPos.set(0, 1.65, 0);
      root.camera.position.set(0, 1.65, 0);
    }

    applyEpochFilter(state.currentActiveEpoch);

    if (typeof document !== 'undefined') {
      const reticle = document.getElementById('capsule-reticle');
      if (reticle) reticle.style.display = 'block';

      const colHud = document.getElementById('telescope-collimator-hud');
      if (colHud) colHud.classList.remove('hidden');

      const returnBar = document.getElementById('confinement-return-bar');
      if (returnBar) returnBar.classList.add('hidden');
      const swarmPill = document.getElementById('swarm-telemetry-pill');
      if (swarmPill) swarmPill.classList.remove('hidden');
      const reopenBtn = document.getElementById('btn-reopen-hud');
      if (reopenBtn) reopenBtn.classList.add('hidden');
      const epochBar = document.getElementById('epoch-filter-bar');
      if (epochBar) epochBar.classList.remove('hidden');
      const hudCard = document.getElementById('orbital-hud-card');
      if (hudCard) hudCard.classList.add('opacity-0', 'translate-x-8', 'pointer-events-none');
    }

    if (root.nai3D && root.nai3D.group) root.nai3D.group.visible = true;

    if (root.MuseumAudio && typeof root.MuseumAudio.speakNai === 'function') {
      root.MuseumAudio.speakNai("Regresando a la plataforma de observación de la rotonda.");
    }
  }

  function filterEpoch(epochId) {
    state.currentActiveEpoch = epochId;
    applyEpochFilter(epochId);

    if (typeof document !== 'undefined') {
      for (let e = 0; e <= 5; e++) {
        const btn = document.getElementById(`epoch-btn-${e}`);
        if (btn) {
          if (e === epochId) {
            btn.className = "epoch-filter-pill active px-3 py-1 rounded-full text-[11px] mono transition bg-[#c5a059] text-[#08080a] font-semibold shadow-md";
          } else {
            btn.className = "epoch-filter-pill px-3 py-1 rounded-full text-[11px] mono transition text-[#a1a1aa] hover:text-[#f4f1ea]";
          }
        }
      }
    }

    if (state.mode === state.MODE_ROTUNDA_TELESCOPE && epochId >= 1) {
      const epochBaseTheta = (epochId - 1) * (Math.PI * 2 / 5) - Math.PI / 2;
      state.targetOrientation.yaw = -epochBaseTheta;
      state.targetOrientation.pitch = 0.28;
      state.orientation.yaw = -epochBaseTheta;
      state.orientation.pitch = 0.28;
    }
  }

  function applyEpochFilter(epochId) {
    const astros24 = root.astros24 || [];
    astros24.forEach(a => {
      const isVisible = (epochId === 0 || a.epoch === epochId);
      a.epochHidden = !isVisible;
      if (a.group) {
        a.group.visible = isVisible;
        a.group.scale.set(0.85, 0.85, 0.85);
      }
      if (a.timonelRing && a.timonelRing.material) {
        a.timonelRing.material.opacity = isVisible ? 0.35 : 0.0;
      }
      if (a.pointLight) a.pointLight.intensity = isVisible ? 1.4 : 0.0;
      if (a.fillLight) a.fillLight.intensity = isVisible ? 0.8 : 0.0;
      if (a.model && a.model.group) {
        a.model.group.traverse(child => {
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = isVisible ? 1.0 : 0.0;
          }
        });
      }
    });
  }

  function togglePointerLock() {
    if (typeof document === 'undefined') return;
    const canvas = document.getElementById('webgl-canvas');
    if (!document.pointerLockElement) {
      if (canvas && canvas.requestPointerLock) canvas.requestPointerLock();
    } else {
      if (document.exitPointerLock) document.exitPointerLock();
    }
  }

  function setup6DOFControls() {
    if (typeof window === 'undefined') return;
    let lastPointer = null;
    let isPointerDown = false;
    let dragStartPos = { x: 0, y: 0 };
    let hasDragged = false;

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #telescope-collimator-hud, #confinement-return-bar, #epoch-filter-bar, button, a, select, input, #pointer-lock-badge')) return;
      isPointerDown = true;
      hasDragged = false;
      dragStartPos = { x: e.clientX, y: e.clientY };
      lastPointer = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isPointerDown = false;
      lastPointer = null;
    });

    window.addEventListener('mousemove', (e) => {
      state.currentMouseScreenPos.x = e.clientX;
      state.currentMouseScreenPos.y = e.clientY;

      if (document.pointerLockElement === document.getElementById('webgl-canvas')) {
        const sens = 0.0022;
        state.userInertiaTimer = 0;
        state.targetOrientation.yaw -= (e.movementX || 0) * sens;
        state.targetOrientation.pitch -= (e.movementY || 0) * sens;
        state.targetOrientation.pitch = Math.max(-0.45, Math.min(1.52, state.targetOrientation.pitch));
        return;
      }

      if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #telescope-collimator-hud, #confinement-return-bar, #epoch-filter-bar, button, a, select, input, #pointer-lock-badge')) {
        lastPointer = null;
        return;
      }

      if (lastPointer === null) {
        lastPointer = { x: e.clientX, y: e.clientY };
        return;
      }

      const dx = e.clientX - lastPointer.x;
      const dy = e.clientY - lastPointer.y;
      lastPointer = { x: e.clientX, y: e.clientY };

      if (Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y) > 4) {
        hasDragged = true;
      }

      const sensitivity = isPointerDown ? 0.0055 : 0.0035;

      if (root.isInShopMode) {
        if (root.targetProductRotation) {
          root.targetProductRotation.y += dx * 0.01;
          root.targetProductRotation.x += dy * 0.01;
        }
      } else if (state.mode === state.MODE_ROTUNDA_TELESCOPE) {
        state.userInertiaTimer = 0;
        state.targetOrientation.yaw -= dx * sensitivity;
        state.targetOrientation.pitch -= dy * sensitivity;
        state.targetOrientation.pitch = Math.max(-0.45, Math.min(1.52, state.targetOrientation.pitch));
      } else if (state.mode === state.MODE_SPHERE_CONFINEMENT) {
        state.userInertiaTimer = 0;
        state.targetSphereTheta -= dx * (isPointerDown ? 0.0065 : 0.0045);
        state.targetSpherePhi   -= dy * (isPointerDown ? 0.0065 : 0.0045);
        state.targetSpherePhi   = Math.max(0.08, Math.min(Math.PI - 0.08, state.targetSpherePhi));
      }
    });

    window.addEventListener('mouseleave', () => {
      state.currentMouseScreenPos.x = -1;
      state.currentMouseScreenPos.y = -1;
      isPointerDown = false;
      lastPointer = null;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (lastPointer === null) {
          lastPointer = { x: touch.clientX, y: touch.clientY };
          return;
        }
        const dx = touch.clientX - lastPointer.x;
        const dy = touch.clientY - lastPointer.y;
        lastPointer = { x: touch.clientX, y: touch.clientY };

        if (state.mode === state.MODE_ROTUNDA_TELESCOPE) {
          state.targetOrientation.yaw -= dx * 0.0045;
          state.targetOrientation.pitch -= dy * 0.0045;
          state.targetOrientation.pitch = Math.max(-0.45, Math.min(1.52, state.targetOrientation.pitch));
        } else if (state.mode === state.MODE_SPHERE_CONFINEMENT) {
          state.targetSphereTheta -= dx * 0.0055;
          state.targetSpherePhi   -= dy * 0.0055;
          state.targetSpherePhi   = Math.max(0.08, Math.min(Math.PI - 0.08, state.targetSpherePhi));
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      lastPointer = null;
    });

    window.addEventListener('click', (e) => {
      if (e.target.closest('header, #foyer-screen, #orbital-hud-card, #btn-reopen-hud, #roll-drawer, #shop-bay-overlay, #confinement-return-bar, #epoch-filter-bar, #telescope-proximity-badge, #telescope-goto-modal, #btn-open-telescope-goto, button, a, #pointer-lock-badge')) return;
      
      if (state.mode === state.MODE_ROTUNDA_TELESCOPE) {
        if (document.pointerLockElement) {
          if (state.collimatedAstroIndex >= 0) {
            warpToTargetAstro(state.collimatedAstroIndex);
            return;
          }
          return;
        }

        if (!hasDragged) {
          if (state.collimatedAstroIndex >= 0) {
            warpToTargetAstro(state.collimatedAstroIndex);
            return;
          }

          if (root.camera && typeof THREE !== 'undefined') {
            const mouseRay = new THREE.Raycaster();
            const mouseNDC = new THREE.Vector2(
              (e.clientX / window.innerWidth) * 2 - 1,
              -(e.clientY / window.innerHeight) * 2 + 1
            );
            mouseRay.setFromCamera(mouseNDC, root.camera);

            const astros24 = root.astros24 || [];
            let hitAstro = null;
            let minRayDist = Infinity;
            for (let idx = 0; idx < astros24.length; idx++) {
              const a = astros24[idx];
              if (!a.group || !a.group.visible) continue;
              const sphere = new THREE.Sphere(a.worldPos, 2.4);
              const hit = mouseRay.ray.intersectSphere(sphere, new THREE.Vector3());
              if (hit) {
                const d = root.camera.position.distanceTo(hit);
                if (d < minRayDist) {
                  minRayDist = d;
                  hitAstro = a;
                }
              }
            }
            if (hitAstro) {
              warpToTargetAstro(hitAstro.index);
              return;
            }

            const distToScope = Math.hypot(root.camera.position.x, root.camera.position.z - 5.0);
            if (distToScope < 3.8) {
              openTelescopeGotoTerminal();
              return;
            }
          }

          togglePointerLock();
        }
      }
    });

    window.addEventListener('wheel', (e) => {
      if (root.isInShopMode) return;
      state.userInertiaTimer = 0;
      if (state.mode === state.MODE_SPHERE_CONFINEMENT) {
        state.targetSphereRadius += e.deltaY * 0.003;
        state.targetSphereRadius = Math.max(2.0, Math.min(6.5, state.targetSphereRadius));
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      state.keysPressed[e.code] = true;

      if (root.isInShopMode) {
        if (e.key === 'Escape' && typeof root.exitShopMode === 'function') root.exitShopMode();
        return;
      }
      if (e.code === 'KeyT') {
        if (e.target.closest('input, textarea, select')) return;
        e.preventDefault();
        toggleTelescopeGotoTerminal();
        return;
      }
      if (e.key === 'Escape') {
        if (state.isTelescopeModalOpen) {
          closeTelescopeGotoTerminal();
          return;
        }
        if (document.pointerLockElement) {
          document.exitPointerLock();
          return;
        }
        if (state.mode === state.MODE_SPHERE_CONFINEMENT) {
          returnToRotunda();
          return;
        }
        return;
      }
      if (e.code === 'Space') {
        if (e.target.closest('input, textarea, select')) return;
        e.preventDefault();
        if (state.mode === state.MODE_ROTUNDA_TELESCOPE) {
          togglePointerLock();
        } else if (state.mode === state.MODE_SPHERE_CONFINEMENT) {
          if (root.MuseumHUD && typeof root.MuseumHUD.triggerShutter === 'function') {
            root.MuseumHUD.triggerShutter();
          }
        }
        return;
      }
      if (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'Enter') {
        if (e.target.closest('input, textarea, select')) return;
        if (state.mode === state.MODE_ROTUNDA_TELESCOPE && state.collimatedAstroIndex >= 0) {
          e.preventDefault();
          warpToTargetAstro(state.collimatedAstroIndex);
          return;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      state.keysPressed[e.code] = false;
    });

    // Controles táctiles móviles
    const bindHoldButton = (el, code) => {
      if (!el) return;
      const start = (ev) => {
        ev.preventDefault();
        state.keysPressed[code] = true;
      };
      const stop = (ev) => {
        ev.preventDefault();
        state.keysPressed[code] = false;
      };
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', stop, { passive: false });
      el.addEventListener('touchcancel', stop, { passive: false });
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', stop);
      el.addEventListener('mouseleave', stop);
    };

    bindHoldButton(document.getElementById('btn-touch-up'), 'KeyW');
    bindHoldButton(document.getElementById('btn-touch-down'), 'KeyS');
    bindHoldButton(document.getElementById('btn-touch-left'), 'KeyA');
    bindHoldButton(document.getElementById('btn-touch-right'), 'KeyD');

    const btnTouchAction = document.getElementById('btn-touch-action');
    if (btnTouchAction) {
      btnTouchAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (state.mode === state.MODE_ROTUNDA_TELESCOPE) {
          if (state.collimatedAstroIndex >= 0) {
            warpToTargetAstro(state.collimatedAstroIndex);
          } else {
            toggleTelescopeGotoTerminal();
          }
        } else if (state.mode === state.MODE_SPHERE_CONFINEMENT) {
          returnToRotunda();
        }
      });
    }
  }

  const MuseumCamera = {
    state,
    slewTelescopeToTarget,
    openTelescopeGotoTerminal,
    closeTelescopeGotoTerminal,
    toggleTelescopeGotoTerminal,
    renderGotoCatalog,
    filterGotoCatalog,
    setGotoEpochFilter,
    updateTelescopeCollimation,
    warpToTargetAstro,
    returnToRotunda,
    filterEpoch,
    applyEpochFilter,
    togglePointerLock,
    setup6DOFControls
  };

  root.MuseumCamera = MuseumCamera;

  // Bindings globales HTML
  root.slewTelescopeToTarget = slewTelescopeToTarget;
  root.openTelescopeGotoTerminal = openTelescopeGotoTerminal;
  root.closeTelescopeGotoTerminal = closeTelescopeGotoTerminal;
  root.toggleTelescopeGotoTerminal = toggleTelescopeGotoTerminal;
  root.filterGotoCatalog = filterGotoCatalog;
  root.setGotoEpochFilter = setGotoEpochFilter;
  root.warpToTargetAstro = warpToTargetAstro;
  root.returnToRotunda = returnToRotunda;
  root.filterEpoch = filterEpoch;
  root.applyEpochFilter = applyEpochFilter;
  root.togglePointerLock = togglePointerLock;
  root.setup6DOFControls = setup6DOFControls;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MuseumCamera;
  }

})(typeof window !== 'undefined' ? window : global);
