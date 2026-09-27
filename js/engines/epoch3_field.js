// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — ÉPOCA 3: TERMODINÁMICA, CAMPOS & ESPACIO-TIEMPO
// Obras 040 a 059 · Simulación en Silicio Nativo 60 FPS
// Gobernanza: Timonel F2 | Aislamiento Modular de Estado
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  'use strict';

  let ctx = null;
  let W = 1024, H = 1448;
  let currentPal = 0;
  let mouseX = -9999, mouseY = -9999, mouseDown = false;
  let isDrag = false, dragX = 0, dragY = 0;

  let PALS_CSS = [
    f => `hsla(${250-f*210},90%,${45+f*35}%,${.08+f*.7})`,
    f => `rgba(${f*40|0},${120+f*135|0},${Math.max(0,200-f*50)|0},${.08+f*.7})`,
    f => `rgba(${Math.min(255,60+f*220)|0},${Math.min(255,f>.6?(f-.6)*450:20)|0},${f<.3?180:20},${.08+f*.75})`,
    f => `rgba(${220+f*35|0},${180+f*70|0},${120+f*135|0},${.08+f*.65})`,
  ];
  let PALS_RGB = [];

  function trailFade(alpha = 0.06) {
    if (!ctx) return;
    ctx.fillStyle = `rgba(8, 8, 10, ${alpha})`;
    ctx.fillRect(0, 0, W, H);
  }

  function updateViewport(w, h, newCtx, pal, palsCss, palsRgb) {
    W = w;
    H = h;
    if (newCtx) ctx = newCtx;
    if (pal !== undefined) currentPal = pal;
    if (palsCss) PALS_CSS = palsCss;
    if (palsRgb) PALS_RGB = palsRgb;
  }

  function updatePointer(x, y, down, drag, dx, dy) {
    mouseX = x; mouseY = y; mouseDown = down; isDrag = drag;
    if (dx !== undefined) dragX = dx;
    if (dy !== undefined) dragY = dy;
  }

// ÉPOCA III: TERMODINÁMICA, CAMPOS & ESPACIO-TIEMPO (OBRAS 040 A 059)
// ═══════════════════════════════════════════════════════════════════

// ── 40 [041]: 1ª Maxwell: Gauss Eléctrica (∇ · E = ρ / ε₀) ────────
let max1T = 0;
function init_40() { max1T = 0; }
function step_40() {
  trailFade(0.06);
  max1T += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Campo de divergencia positiva neta saliendo de carga central
  const lines = 28;
  const pulse = Math.sin(max1T * 2) * 15;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < lines; i++) {
    const th = (i * Math.PI * 2) / lines;
    const r1 = 20 + pulse;
    const r2 = Math.min(W, H) * 0.38;
    ctx.strokeStyle = pal(i / lines);
    ctx.beginPath();
    ctx.moveTo(cx + r1 * Math.cos(th), cy + r1 * Math.sin(th));
    ctx.lineTo(cx + r2 * Math.cos(th), cy + r2 * Math.sin(th));
    ctx.stroke();

    // Flecha indicando divergencia hacia afuera ∇·E > 0
    const tipX = cx + (r2 - 10) * Math.cos(th), tipY = cy + (r2 - 10) * Math.sin(th);
    ctx.fillStyle = pal(i / lines);
    ctx.beginPath(); ctx.arc(tipX, tipY, 3, 0, Math.PI * 2); ctx.fill();
  }

  // Densidad de carga fuente en el centro
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∇ · E = ρ / ε₀  (Divergencia de Carga Eléctrica)', cx, H * 0.94);
}

// ── 41 [042]: 2ª Maxwell: Gauss Magnética (∇ · B = 0) ─────────────
let max2T = 0;
function init_41() { max2T = 0; }
function step_41() {
  trailFade(0.06);
  max2T += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.35;

  // Líneas de campo magnético siempre cerradas (cero monopolos)
  const rings = 12;
  ctx.lineWidth = 1.4;
  for (let i = 1; i <= rings; i++) {
    const rx = sc * (i / rings);
    const ry = sc * (i / rings) * 0.55;
    ctx.strokeStyle = pal(i / rings);
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + sign * ry * 0.6, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Dipolo magnético central
  ctx.fillStyle = '#ef4444'; ctx.fillRect(cx - 30, cy - 8, 30, 16); // Norte
  ctx.fillStyle = '#38bdf8'; ctx.fillRect(cx, cy - 8, 30, 16);      // Sur

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∇ · B = 0  (Inexistencia de Monopolos Magnéticos)', cx, H * 0.94);
}

// ── 42 [043]: 3ª Maxwell: Faraday-Maxwell (∇ × E = -∂B/∂t) ─────────
let max3T = 0;
function init_42() { max3T = 0; }
function step_42() {
  trailFade(0.06);
  max3T += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Flujo magnético B variable en el centro perpendicular a la pantalla
  const bFlux = Math.cos(max3T);
  const eCurl = -Math.sin(max3T);

  // Círculos concéntricos de campo eléctrico rotacional ∇ × E
  const rings = 9;
  for (let r = 1; r <= rings; r++) {
    const radius = r * (Math.min(W, H) * 0.04);
    ctx.strokeStyle = pal(Math.abs(eCurl)); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

    // Flechas tangenciales indicando rotacional
    const angle = max3T * 1.5 + (r * 0.4);
    const ax = cx + radius * Math.cos(angle), ay = cy + radius * Math.sin(angle);
    ctx.fillStyle = '#c5a059';
    ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill();
  }

  // Núcleo magnético oscilante
  ctx.fillStyle = bFlux > 0 ? '#38bdf8' : '#ef4444';
  ctx.beginPath(); ctx.arc(cx, cy, Math.abs(bFlux) * 16 + 4, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∇ × E = -∂B/∂t  (Rotacional Eléctrico por Inducción)', cx, H * 0.94);
}

// ── 43 [044]: 4ª Maxwell: Ampère-Maxwell (∇ × B = μ₀ J + μ₀ε₀ ∂E/∂t)
let max4T = 0;
function init_43() { max4T = 0; }
function step_43() {
  trailFade(0.06);
  max4T += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Corriente de desplazamiento entre placas de capacitor
  const capW = W * 0.25, capH = H * 0.35;
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx - capW, cy - capH * 0.5); ctx.lineTo(cx - capW, cy + capH * 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + capW, cy - capH * 0.5); ctx.lineTo(cx + capW, cy + capH * 0.5); ctx.stroke();

  // Líneas de campo de desplazamiento eléctrico dE/dt
  const pulse = Math.sin(max4T * 2);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; ctx.lineWidth = 1.5;
  for (let y = cy - capH * 0.4; y <= cy + capH * 0.4; y += 18) {
    ctx.beginPath(); ctx.moveTo(cx - capW, y); ctx.lineTo(cx + capW, y); ctx.stroke();
  }

  // Vórtices de campo magnético circular engendrados por la corriente de desplazamiento
  ctx.strokeStyle = pal(Math.abs(pulse)); ctx.lineWidth = 2.0;
  ctx.beginPath(); ctx.ellipse(cx, cy, capW * 0.6, capH * 0.45, 0, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∇ × B = μ₀·J + μ₀ε₀·(∂E/∂t)  (Corriente de Desplazamiento)', cx, H * 0.94);
}

// ── 44 [045]: La Velocidad de la Luz en el Vacío (c = 1 / √(ε₀ μ₀))
let emWaveT = 0;
function init_44() { emWaveT = 0; }
function step_44() {
  trailFade(0.06);
  emWaveT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const L = W * 0.8;

  // Eje de propagación z
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W * 0.1, cy); ctx.lineTo(W * 0.9, cy); ctx.stroke();

  // Onda Eléctrica E (vertical roja) y Onda Magnética B (horizontal azul ortogonal)
  const k = 0.03, w = 1.5;
  const ampE = H * 0.18, ampB = H * 0.12;

  // Campo E (vertical)
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 4) {
    const val = ampE * Math.sin(k * px - emWaveT * w);
    const scrX = W * 0.1 + px, scrY = cy - val;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  // Campo B (proyección oblicua en perspectiva)
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.0;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 4) {
    const val = ampB * Math.sin(k * px - emWaveT * w);
    const scrX = W * 0.1 + px + val * 0.5, scrY = cy + val * 0.3;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('c = 1 / √(ε₀ · μ₀) = 299,792,458 m/s', cx, H * 0.94);
}

// ── 45 [046]: La Fuerza Electromagnética de Lorentz (F = q(E + v × B))
let lorentzT = 0, lorentzPts = [];
function init_45() { lorentzT = 0; lorentzPts = []; }
function step_45() {
  trailFade(0.04);
  lorentzT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Movimiento helicoidal en 3D bajo campo E y B
  const R = Math.min(W, H) * 0.22;
  const omega = 2.0;
  const vz = (lorentzT * 40) % (H * 0.6) - H * 0.3;
  const rx = R * Math.cos(omega * lorentzT);
  const ry = R * Math.sin(omega * lorentzT) * 0.4 + vz;

  lorentzPts.push([cx + rx, cy + ry]);
  if (lorentzPts.length > 300) lorentzPts.shift();

  // Trazar hélice
  const n = lorentzPts.length;
  for (let i = 1; i < n; i++) {
    const f = i / n;
    ctx.strokeStyle = pal(f); ctx.lineWidth = 0.8 + f * 2.0;
    ctx.beginPath(); ctx.moveTo(lorentzPts[i-1][0], lorentzPts[i-1][1]); ctx.lineTo(lorentzPts[i][0], lorentzPts[i][1]); ctx.stroke();
  }

  // Partícula cargada
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.arc(cx + rx, cy + ry, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('F = q · (E + v × B)  (Giro-Órbita Ciclotrónica)', cx, H * 0.94);
}

// ── 46 [047]: Primera Ley de la Termodinámica (dU = δQ - δW) ───────
let thermo1T = 0;
function init_46() { thermo1T = 0; }
function step_46() {
  trailFade(0.08);
  thermo1T += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const boxW = W * 0.45, boxH = H * 0.35;

  // Cámara cilíndrica
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.5;
  ctx.strokeRect(cx - boxW * 0.5, cy - boxH * 0.5, boxW, boxH);

  // Émbolo oscilante extrayendo trabajo δW
  const pistonDy = Math.sin(thermo1T) * (boxH * 0.15);
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx - boxW * 0.5, cy - boxH * 0.5 + pistonDy); ctx.lineTo(cx + boxW * 0.5, cy - boxH * 0.5 + pistonDy); ctx.stroke();

  // Entrada de calor δQ desde abajo (llama/gradiente térmico)
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  for (let x = cx - boxW * 0.4; x <= cx + boxW * 0.4; x += 15) {
    ctx.beginPath();
    ctx.moveTo(x, cy + boxH * 0.5 + 25);
    ctx.lineTo(x, cy + boxH * 0.5);
    ctx.stroke();
  }

  // Nivel de energía interna dU (fondo de partículas)
  const uLevel = 0.5 + 0.3 * Math.cos(thermo1T);
  ctx.fillStyle = pal(uLevel);
  ctx.fillRect(cx - boxW * 0.45, cy - boxH * 0.45 + pistonDy, boxW * 0.9, (boxH * 0.9 - pistonDy));

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('dU = δQ - δW  (Conservación de la Energía Interna)', cx, H * 0.94);
}

// ── 47 [048]: Segunda Ley de la Termodinámica (ΔS ≥ 0) ─────────────
let gasMix = [], mixT = 0;
function init_47() {
  mixT = 0; gasMix = [];
  // 120 partículas rojas en la izquierda, 120 azules en la derecha
  for (let i = 0; i < 120; i++) {
    gasMix.push({ x: 0.1 + Math.random() * 0.35, y: 0.2 + Math.random() * 0.6, vx: (Math.random() - 0.5) * 0.008, vy: (Math.random() - 0.5) * 0.008, type: 'A' });
    gasMix.push({ x: 0.55 + Math.random() * 0.35, y: 0.2 + Math.random() * 0.6, vx: (Math.random() - 0.5) * 0.008, vy: (Math.random() - 0.5) * 0.008, type: 'B' });
  }
}
function step_47() {
  trailFade(0.08);
  mixT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const boxW = W * 0.8, boxH = H * 0.5;

  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2;
  ctx.strokeRect(cx - boxW * 0.5, cy - boxH * 0.5, boxW, boxH);

  // Remover barrera central con el tiempo para mezcla irreversible
  const barrierOpen = Math.min(1.0, mixT * 0.5);
  if (barrierOpen < 0.95) {
    ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - boxH * 0.5 + (boxH * 0.5 * barrierOpen));
    ctx.lineTo(cx, cy + boxH * 0.5 - (boxH * 0.5 * barrierOpen));
    ctx.stroke();
  }

  // Partículas difundiendo irreversiblemente (entropía creciente)
  for (const p of gasMix) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0.12) { p.x = 0.12; p.vx = -p.vx; }
    if (p.x > 0.88) { p.x = 0.88; p.vx = -p.vx; }
    if (p.y < 0.22) { p.y = 0.22; p.vy = -p.vy; }
    if (p.y > 0.78) { p.y = 0.78; p.vy = -p.vy; }

    const px = cx - boxW * 0.5 + (p.x - 0.1) * (boxW / 0.8);
    const py = cy - boxH * 0.5 + (p.y - 0.2) * (boxH / 0.6);

    ctx.fillStyle = p.type === 'A' ? '#ef4444' : '#38bdf8';
    ctx.fillRect(px, py, 2.8, 2.8);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ΔS ≥ 0  (Flecha del Tiempo & Mezcla Irreversible)', cx, H * 0.94);
}

// ── 48 [049]: La Entropía Estadística de Boltzmann (S = k_B · ln W) ─
let boltzGrid = [], boltzT = 0;
function init_48() {
  boltzT = 0; boltzGrid = new Array(64).fill(0);
  boltzGrid[0] = 300; // Todas concentradas en 1 microestado al inicio
}
function step_48() {
  trailFade(0.08);
  boltzT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.07;

  // Saltos aleatorios de partículas entre 64 microestados
  for (let step = 0; step < 25; step++) {
    const src = Math.floor(Math.random() * 64);
    if (boltzGrid[src] > 0) {
      boltzGrid[src]--;
      const dst = Math.floor(Math.random() * 64);
      boltzGrid[dst]++;
    }
  }

  // Renderizar la red 8x8 de microestados en el espacio de fase
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const idx = r * 8 + c;
      const count = boltzGrid[idx];
      const px = cx - 4 * sc + c * sc;
      const py = cy - 4 * sc + r * sc;
      const f = Math.min(1.0, count / 20.0);
      ctx.fillStyle = pal(f);
      ctx.fillRect(px + 1, py + 1, sc - 2, sc - 2);
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('S = k_B · ln W  (Multiplicidad de Microestados)', cx, H * 0.94);
}

// ── 49 [050]: Distribución de Maxwell-Boltzmann (f(v) ∝ v² e^{-mv²/2kT})
let mbT = 0;
function init_49() { mbT = 0; }
function step_49() {
  trailFade(0.06);
  mbT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.65;
  const L = W * 0.75;

  // Ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W * 0.12, cy); ctx.lineTo(W * 0.88, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.12, cy); ctx.lineTo(W * 0.12, cy - H * 0.35); ctx.stroke();

  // Curvas térmicas de Maxwell-Boltzmann para 3 temperaturas T
  const temps = [0.8, 1.4, 2.2];
  temps.forEach((T, idx) => {
    ctx.strokeStyle = pal(idx / 3); ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let px = 0; px <= L; px += 3) {
      const v = (px / L) * 4.5;
      const fv = (v * v) * Math.exp(- (v * v) / (2 * T)) / Math.pow(T, 1.5);
      const scrX = W * 0.12 + px;
      const scrY = cy - fv * (H * 0.45);
      if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
    }
    ctx.stroke();
  });

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('f(v) = 4π (m/2πkT)^{3/2} · v² · exp(-mv²/2kT)', cx, H * 0.94);
}

// ── 50 [051]: Los Ceros Críticos de Riemann (ζ(s) = 0, Re(s) = ½) ──
let rieT = 10.0, rieRot = 0.4;
function init_50() { rieT = 10.0; rieRot = 0.4; }
function step_50() {
  trailFade(0.04);
  rieT += 0.025;
  if (rieT > 35.0) rieT = 10.0;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.32;

  // Fórmula aproximada de Riemann-Siegel Z(t) = 2 ∑ (1/sqrt(n)) cos(theta(t) - t ln n)
  // Espiral en el plano complejo de la función zeta a lo largo de la línea crítica
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  let started = false;
  for (let t = rieT - 8.0; t <= rieT; t += 0.04) {
    const theta = (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8;
    let zRe = 0, zIm = 0;
    for (let n = 1; n <= 3; n++) {
      const ang = theta - t * Math.log(n);
      zRe += (2 / Math.sqrt(n)) * Math.cos(ang);
      zIm += (2 / Math.sqrt(n)) * Math.sin(ang);
    }
    const scrX = cx + zRe * (sc * 0.25);
    const scrY = cy - zIm * (sc * 0.25);
    if (!started) { ctx.moveTo(scrX, scrY); started = true; }
    else ctx.lineTo(scrX, scrY);
  }
  ctx.strokeStyle = pal(0.85); ctx.stroke();

  // Origen cero central (donde cruzan los ceros no triviales)
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`Línea Crítica Re(s)=½  |  t = ${rieT.toFixed(2)}  (γ₁=14.13, γ₂=21.02)`, cx, H * 0.94);
}

// ── 51 [052]: Métrica Riemanniana y Curvatura Tensorial (ds² = g_μν dx^μ dx^ν)
let riemGeodT = 0;
function init_51() { riemGeodT = 0; }
function step_51() {
  trailFade(0.06);
  riemGeodT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.32;

  // Esfera / Pseudósfera con malla de coordenadas (u, v) curvada
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
  for (let lat = -60; lat <= 60; lat += 20) {
    const y = cy + (lat / 90) * R;
    const rRing = R * Math.cos(lat * Math.PI / 180);
    ctx.beginPath(); ctx.ellipse(cx, y, rRing, rRing * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
  }

  // Transporte paralelo de un vector a lo largo de un triángulo geodésico
  const angle = riemGeodT % (Math.PI * 2);
  const vx = cx + R * 0.6 * Math.cos(angle);
  const vy = cy + R * 0.4 * Math.sin(angle);

  ctx.strokeStyle = pal(0.9); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx + 25 * Math.cos(angle * 1.5), vy + 25 * Math.sin(angle * 1.5)); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('R^ρ_σμν  (Holonomía y Transporte Paralelo Tensorial)', cx, H * 0.94);
}

// ── 52 [053]: Ley de Radiación de Stefan-Boltzmann (j* = σ · T⁴) ────
let stefanT = 0;
function init_52() { stefanT = 0; }
function step_52() {
  trailFade(0.06);
  stefanT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Temperatura cíclica oscilando de 1.0 a 2.5
  const T = 1.0 + 0.8 * (Math.sin(stefanT) * 0.5 + 0.5);
  const radiantFlux = Math.pow(T, 4); // Ley T^4

  // Esfera radiante creciendo y cambiando de colorimetría física
  const radius = Math.min(W, H) * (0.1 + 0.05 * radiantFlux);
  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius * 1.4);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.4, '#f97316');
  grad.addColorStop(0.8, pal(Math.min(1.0, radiantFlux * 0.2)));
  grad.addColorStop(1, 'transparent');

  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`j* = σ · T⁴  (Flujo Radiante = ${radiantFlux.toFixed(2)} j₀)`, cx, H * 0.94);
}

// ── 53 [054]: Ley de Desplazamiento de Wien (λ_max · T = b) ─────────
let wienT = 0;
function init_53() { wienT = 0; }
function step_53() {
  trailFade(0.06);
  wienT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.65;
  const L = W * 0.75;

  // Temperatura cambiando con el tiempo
  const T = 3000 + 4000 * (Math.sin(wienT) * 0.5 + 0.5);
  const lambdaMax = (2898 / T) * 1000; // nm

  // Espectro de Planck u(lambda, T)
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 3) {
    const lam = 200 + (px / L) * 1800;
    const x = 14387770 / (lam * T);
    const u = (Math.pow(1000 / lam, 5) / (Math.exp(Math.min(20, x)) - 1)) * (H * 0.15);
    const scrX = W * 0.125 + px, scrY = cy - u;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  // Línea vertical marcando el pico lambda_max
  const peakPx = ((lambdaMax - 200) / 1800) * L;
  if (peakPx >= 0 && peakPx <= L) {
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(W * 0.125 + peakPx, cy); ctx.lineTo(W * 0.125 + peakPx, cy - H * 0.35); ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`λ_max · T = 2.898×10⁻³ m·K  (T = ${T.toFixed(0)} K, λ_max = ${lambdaMax.toFixed(0)} nm)`, cx, H * 0.94);
}

// ── 54 [055]: Álgebra Dual y Diferenciación Automática (ε² = 0) ────
let dualT = 0;
function init_54() { dualT = 0; }
function step_54() {
  trailFade(0.06);
  dualT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.28;

  // Función f(x) y su derivada f'(x) evaluadas simultáneamente en números duales (x + eps)
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.0;
  ctx.beginPath();
  for (let px = -W * 0.4; px <= W * 0.4; px += 4) {
    const x = px / (sc * 0.5);
    const f = Math.sin(x + dualT) + 0.5 * Math.cos(2 * x);
    const scrY = cy - f * (sc * 0.5);
    if (px === -W * 0.4) ctx.moveTo(cx + px, scrY); else ctx.lineTo(cx + px, scrY);
  }
  ctx.stroke();

  // Curva de la derivada exacta (coeficiente dual de eps)
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.8; ctx.setLineDash([4, 2]);
  ctx.beginPath();
  for (let px = -W * 0.4; px <= W * 0.4; px += 4) {
    const x = px / (sc * 0.5);
    const df = Math.cos(x + dualT) - Math.sin(2 * x);
    const scrY = cy - df * (sc * 0.5);
    if (px === -W * 0.4) ctx.moveTo(cx + px, scrY); else ctx.lineTo(cx + px, scrY);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('f(x + ε) = f(x) + ε · f\'(x)  con ε² = 0 (Timonel Dual)', cx, H * 0.94);
}

// ── 55 [056]: Las Transformaciones de Lorentz (x' = γ(x - vt)) ─────
let lorentzTrT = 0;
function init_55() { lorentzTrT = 0; }
function step_55() {
  trailFade(0.06);
  lorentzTrT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.35;

  // Rapidez hiperbólica psi (velocidad relativista v/c = tanh(psi))
  const beta = 0.65 * Math.sin(lorentzTrT);
  const gamma = 1.0 / Math.sqrt(1 - beta * beta);

  // Cono de luz a 45 grados (invariante de la velocidad c)
  ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - sc, cy + sc); ctx.lineTo(cx + sc, cy - sc); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - sc, cy - sc); ctx.lineTo(cx + sc, cy + sc); ctx.stroke();

  // Ejes transformados (t', x') inclinados hiperbólicamente
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx - sc * beta, cy + sc); ctx.lineTo(cx + sc * beta, cy - sc); ctx.stroke(); // Eje ct'
  ctx.beginPath(); ctx.moveTo(cx - sc, cy - sc * beta); ctx.lineTo(cx + sc, cy + sc * beta); ctx.stroke(); // Eje x'

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`γ = 1/√(1 - v²/c²) = ${gamma.toFixed(2)}  (Invarianza del Cono de Luz)`, cx, H * 0.94);
}

// ── 56 [057]: Celdas Convectivas de Bénard (Hexágonos de Convección) ─
let benardT = 0;
function init_56() { benardT = 0; }
function step_56() {
  trailFade(0.08);
  benardT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const hexR = Math.min(W, H) * 0.09;

  // Patrón hexagonal de Rayleigh-Bénard: w(x,y) = cos(k*x) + 2*cos(k*x/2)*cos(sqrt(3)*k*y/2)
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const hx = cx + (col * 1.732 + (row % 2) * 0.866) * hexR;
      const hy = cy + row * 1.5 * hexR;
      const dist = Math.hypot(hx - cx, hy - cy);
      if (dist < Math.min(W, H) * 0.42) {
        const pulse = Math.sin(benardT * 2 + dist * 0.02);
        ctx.fillStyle = pal(pulse * 0.5 + 0.5);
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          const px = hx + hexR * 0.9 * Math.cos(ang);
          const py = hy + hexR * 0.9 * Math.sin(ang);
          if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(8,8,10,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Ra > Ra_c  (Inestabilidad y Celdas Hexagonales de Bénard)', cx, H * 0.94);
}

// ── 57 [058]: Empaquetamiento Fractal de Apolonio (2 ∑ k_i² = (∑ k_i)²)
let apolT = 0;
function init_57() { apolT = 0; }
function step_57() {
  trailFade(0.06);
  apolT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.38;

  // Círculo exterior envolvente
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  // Subdivisión de círculos mutuamente tangentes de Apolonio
  function drawApol(x, y, rad, depth) {
    if (depth > 4 || rad < 3) return;
    ctx.strokeStyle = pal(depth / 5); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke();

    const nextR = rad / (1 + Math.sqrt(2));
    const off = rad - nextR;
    drawApol(x + off * Math.cos(apolT), y + off * Math.sin(apolT), nextR, depth + 1);
    drawApol(x - off * Math.cos(apolT), y - off * Math.sin(apolT), nextR, depth + 1);
    drawApol(x + off * Math.sin(apolT), y - off * Math.cos(apolT), nextR, depth + 1);
  }

  drawApol(cx, cy, R * 0.5, 1);

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('2 ∑ k_i² = (∑ k_i)²  (Teorema de Círculos de Descartes)', cx, H * 0.94);
}

// ── 58 [059]: Teselación Espacial de Voronoi ───────────────────────
let voroSeeds = [], voroT = 0;
function init_58() {
  voroT = 0; voroSeeds = [];
  for (let i = 0; i < 28; i++) {
    voroSeeds.push({
      x: W * 0.2 + Math.random() * W * 0.6,
      y: H * 0.2 + Math.random() * H * 0.6,
      vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5
    });
  }
}
function step_58() {
  trailFade(0.06);
  voroT += 0.02;
  const pal = PALS_CSS[currentPal];

  // Actualizar semillas
  for (const s of voroSeeds) {
    s.x += s.vx; s.y += s.vy;
    if (s.x < W * 0.15 || s.x > W * 0.85) s.vx = -s.vx;
    if (s.y < H * 0.15 || s.y > H * 0.85) s.vy = -s.vy;
  }

  // Triangulación de Delaunay dual
  ctx.lineWidth = 1.0;
  for (let i = 0; i < voroSeeds.length; i++) {
    for (let j = i + 1; j < voroSeeds.length; j++) {
      const dist = Math.hypot(voroSeeds[i].x - voroSeeds[j].x, voroSeeds[i].y - voroSeeds[j].y);
      if (dist < Math.min(W, H) * 0.2) {
        ctx.strokeStyle = pal(dist / (Math.min(W, H) * 0.2));
        ctx.beginPath();
        ctx.moveTo(voroSeeds[i].x, voroSeeds[i].y);
        ctx.lineTo(voroSeeds[j].x, voroSeeds[j].y);
        ctx.stroke();
      }
    }
  }

  // Semillas
  ctx.fillStyle = '#f4f1ea';
  for (const s of voroSeeds) {
    ctx.beginPath(); ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('V(p_i) = { x : ‖x - p_i‖ ≤ ‖x - p_j‖ }  (Voronoi Dual)', W * 0.5, H * 0.94);
}

// ── 59 [060]: Criterio de Fluencia de Von Mises (σ_v = √(3 J₂) ≤ σ_y)
let vmPts=[],vmSpr=[]; const VMC=36,VMR=24;
function init_59() {
  vmPts=[]; vmSpr=[];
  const dx=W/(VMC-1), dy=H/(VMR-1);
  for(let r=0;r<VMR;r++)for(let c=0;c<VMC;c++)
    vmPts.push({x:c*dx,y:r*dy,ox:c*dx,oy:r*dy,vx:0,vy:0,s:0,fx:(r===0||r===VMR-1||c===0||c===VMC-1)});
  const add=(i,j)=>vmSpr.push({a:i,b:j,rest:Math.hypot(vmPts[i].ox-vmPts[j].ox,vmPts[i].oy-vmPts[j].oy)});
  for(let r=0;r<VMR;r++)for(let c=0;c<VMC;c++){
    const i=r*VMC+c;
    if(c<VMC-1)add(i,i+1); if(r<VMR-1)add(i,i+VMC); if(c<VMC-1&&r<VMR-1)add(i,i+VMC+1);
  }
}
function step_59() {
  trailFade(0.12);
  const pal = PALS_CSS[currentPal];
  for(const s of vmSpr){
    const pa=vmPts[s.a],pb=vmPts[s.b],dx=pb.x-pa.x,dy=pb.y-pa.y;
    const d=Math.hypot(dx,dy)||.001, f=.2*(d-s.rest)/d;
    if(!pa.fx){pa.vx+=f*dx;pa.vy+=f*dy;} if(!pb.fx){pb.vx-=f*dx;pb.vy-=f*dy;}
  }
  if(mouseDown)for(const p of vmPts){
    if(p.fx)continue; const dx=p.x-mouseX,dy=p.y-mouseY,d2=dx*dx+dy*dy;
    if(d2<120*120&&d2>1){const d=Math.sqrt(d2),f=.45*(120-d)/d; p.vx+=f*dx;p.vy+=f*dy;}
  }
  let ms=.01;
  for(let r=1;r<VMR-1;r++)for(let c=1;c<VMC-1;c++){
    const i=r*VMC+c,p=vmPts[i]; p.vx*=.88;p.vy*=.88;p.x+=p.vx;p.y+=p.vy;
    const exx=(vmPts[i+1].x-vmPts[i-1].x)*.1, eyy=(vmPts[i+VMC].y-vmPts[i-VMC].y)*.1;
    const exy=(vmPts[i+1].y-vmPts[i-1].y+vmPts[i+VMC].x-vmPts[i-VMC].x)*.05;
    p.s=Math.sqrt(Math.max(0,exx*exx-exx*eyy+eyy*eyy+3*exy*exy)); if(p.s>ms)ms=p.s;
  }
  for(const s of vmSpr){
    const pa=vmPts[s.a],pb=vmPts[s.b],st=(pa.s+pb.s)*.5,f=Math.min(1,st/ms);
    ctx.strokeStyle=pal(f); ctx.lineWidth=.6+f*1.6;
    ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('σ_v = √(3 J₂) ≤ σ_y  (Invariante Desviador de Von Mises)', W * 0.5, H * 0.94);
}

  function handlePointer(type, x, y, dx, dy, artIdx, meta) {
    if (meta && meta.isDrag && artIdx === 50) {
      rieRot += dx * 0.005;
    }
  }

  const inits = [
    init_40,
    init_41,
    init_42,
    init_43,
    init_44,
    init_45,
    init_46,
    init_47,
    init_48,
    init_49,
    init_50,
    init_51,
    init_52,
    init_53,
    init_54,
    init_55,
    init_56,
    init_57,
    init_58,
    init_59
  ];

  const steps = [
    step_40,
    step_41,
    step_42,
    step_43,
    step_44,
    step_45,
    step_46,
    step_47,
    step_48,
    step_49,
    step_50,
    step_51,
    step_52,
    step_53,
    step_54,
    step_55,
    step_56,
    step_57,
    step_58,
    step_59
  ];

  const initsMap = {};
  const stepsMap = {};
  for (let i = 0; i < 20; i++) {
    const globalId = 40 + i;
    initsMap[globalId] = inits[i];
    stepsMap[globalId] = steps[i];
  }

  const epochModule = {
    epoch: 3,
    name: "Termodinámica, Campos & Espacio-Tiempo",
    range: [40, 59],
    inits,
    steps,
    initsMap,
    stepsMap,
    updateViewport,
    updatePointer,
    handlePointer
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { epochModule, inits, steps, initsMap, stepsMap, updateViewport, updatePointer };
  }
  if (typeof root !== 'undefined') {
    root.AtelierEpoch3 = epochModule;
    if (root.AtelierMathCore && typeof root.AtelierMathCore.registerEpoch === 'function') {
      root.AtelierMathCore.registerEpoch(epochModule);
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
