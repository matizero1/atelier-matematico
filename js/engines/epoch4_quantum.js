// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — ÉPOCA 4: RELATIVIDAD & CUÁNTICA
// Obras 060 a 079 · Simulación en Silicio Nativo 60 FPS
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

// ÉPOCA IV: RELATIVIDAD & CUÁNTICA (OBRAS 060 A 079)
// ═══════════════════════════════════════════════════════════════════

// ── 60 [061]: Cuantización de la Energía de Planck (E = h · ν) ────
let planckT = 0;
function init_60() { planckT = 0; }
function step_60() {
  trailFade(0.06);
  planckT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const levels = 6;
  const spacing = (H * 0.5) / levels;

  // Pozo de potencial armónico cuántico parabólico V(x) = ½ m ω² x²
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let px = -W * 0.35; px <= W * 0.35; px += 4) {
    const py = cy + H * 0.28 - (px * px) / (W * 0.4);
    if (px === -W * 0.35) ctx.moveTo(cx + px, py); else ctx.lineTo(cx + px, py);
  }
  ctx.stroke();

  // Niveles cuánticos discretos E_n = (n + ½) h ν
  for (let n = 0; n < levels; n++) {
    const yLvl = cy + H * 0.22 - n * spacing;
    ctx.strokeStyle = pal(n / levels); ctx.lineWidth = 2.0;
    const halfWidth = Math.sqrt((n + 0.8) * spacing * (W * 0.4));
    ctx.beginPath(); ctx.moveTo(cx - halfWidth, yLvl); ctx.lineTo(cx + halfWidth, yLvl); ctx.stroke();

    // Función de onda estacionaria Hermite-Gauss
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.0;
    ctx.beginPath();
    for (let x = -halfWidth; x <= halfWidth; x += 3) {
      const psi = Math.sin((n + 1) * (x / halfWidth) * Math.PI) * Math.exp(-Math.pow(x / (halfWidth*0.7), 2)) * 12;
      const py = yLvl - psi;
      if (x === -halfWidth) ctx.moveTo(cx + x, py); else ctx.lineTo(cx + x, py);
    }
    ctx.stroke();
  }

  // Fotón en transición radiativa cuántica
  const photonY = cy + H * 0.22 - (Math.floor(planckT) % (levels - 1)) * spacing;
  const waveX = cx + Math.sin(planckT * 10) * 15;
  ctx.fillStyle = '#fef08a';
  ctx.beginPath(); ctx.arc(waveX, photonY - spacing * 0.5, 4, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('E = h · ν = ℏ · ω  (Niveles Discretos de Energía)', cx, H * 0.94);
}

// ── 61 [062]: El Efecto Fotoeléctrico de Einstein (E_k = h ν - Φ) ──
let photoT = 0, photoElectrons = [];
function init_61() { photoT = 0; photoElectrons = []; }
function step_61() {
  trailFade(0.08);
  photoT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const plateY = cy + H * 0.15;

  // Placa metálica (cátodo fotosensible)
  ctx.fillStyle = '#16161c'; ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2;
  ctx.fillRect(W * 0.15, plateY, W * 0.7, 18);
  ctx.strokeRect(W * 0.15, plateY, W * 0.7, 18);

  // Fotones incidentes ultravioleta hν descendiendo
  if (Math.random() < 0.3) {
    const fx = W * 0.2 + Math.random() * W * 0.6;
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx - 15, plateY - 100); ctx.lineTo(fx, plateY);
    ctx.stroke();
    // Emisión inmediata de fotoelectrón si hν > Φ
    photoElectrons.push({ x: fx, y: plateY, vx: (Math.random() - 0.5) * 2, vy: - (2.5 + Math.random() * 3) });
  }

  // Fotoelectrones emitidos
  ctx.fillStyle = '#38bdf8';
  for (let i = photoElectrons.length - 1; i >= 0; i--) {
    const e = photoElectrons[i];
    e.x += e.vx; e.y += e.vy;
    ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.fill();
    if (e.y < cy - H * 0.3) photoElectrons.splice(i, 1);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('E_k = h·ν - Φ  (Cuanto de Luz & Emisión Electrónica)', cx, H * 0.94);
}

// ── 62 [063]: Equivalencia Masa-Energía (E = m · c²) ──────────────
let emcT = 0;
function init_62() { emcT = 0; }
function step_62() {
  trailFade(0.06);
  emcT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const cycle = emcT % 4.0;

  if (cycle < 2.0) {
    // Fase 1: Dos masas (electrón y positrón) colisionando
    const dist = (1.0 - cycle / 2.0) * (W * 0.3);
    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(cx - dist, cy, 10, 0, Math.PI * 2); ctx.fill(); // e-
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cx + dist, cy, 10, 0, Math.PI * 2); ctx.fill(); // e+
  } else {
    // Fase 2: Aniquilación y emisión de dos fotones gamma a velocidad c
    const rWave = (cycle - 2.0) * (W * 0.45);
    ctx.strokeStyle = pal(1.0 - (cycle - 2.0) / 2.0); ctx.lineWidth = 3.0;
    ctx.beginPath(); ctx.arc(cx, cy, rWave, 0, Math.PI * 2); ctx.stroke();

    // Rayos gamma divergentes
    ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - rWave * 1.2, cy - rWave * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + rWave * 1.2, cy + rWave * 0.6); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('E = m · c²  (Aniquilación Par & Conversión de Masa)', cx, H * 0.94);
}

// ── 63 [064]: El Intervalo Espaciotemporal de Minkowski (ds²) ─────
let minkT = 0;
function init_63() { minkT = 0; }
function step_63() {
  trailFade(0.06);
  minkT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.35;

  // Cono de luz completo (x, ct)
  ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - sc, cy + sc); ctx.lineTo(cx + sc, cy - sc); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - sc, cy - sc); ctx.lineTo(cx + sc, cy + sc); ctx.stroke();

  // Región de género tiempo (Futuro y Pasado)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - sc, cy - sc); ctx.lineTo(cx + sc, cy - sc); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - sc, cy + sc); ctx.lineTo(cx + sc, cy + sc); ctx.closePath(); ctx.fill();

  // Hipérbolas de calibración invariante ds² = -c²dt² + dx² = const
  ctx.strokeStyle = pal(0.8); ctx.lineWidth = 1.6;
  for (const sign of [-1, 1]) {
    ctx.beginPath();
    for (let x = -sc * 0.8; x <= sc * 0.8; x += 4) {
      const ct = Math.sqrt(x * x + sc * sc * 0.15);
      const scrX = cx + x, scrY = cy + sign * ct;
      if (x === -sc * 0.8) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ds² = -c² dt² + dx² + dy² + dz²  (Métrica de Minkowski)', cx, H * 0.94);
}

// ── 64 [065]: Ecuación de Campo de Einstein (G_μν = 8πG/c⁴ T_μν) ───
let einsteinT = 0;
function init_64() { einsteinT = 0; }
function step_64() {
  trailFade(0.06);
  einsteinT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.38;

  // Deformación de la malla del espacio-tiempo por masa gravitatoria
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 1.0;
  const lines = 18;
  for (let i = -lines; i <= lines; i++) {
    // Líneas paralelas en X deformadas por curvatura
    ctx.beginPath();
    for (let j = -lines; j <= lines; j++) {
      const u = (i / lines) * sc, v = (j / lines) * sc;
      const r2 = u * u + v * v + 2500;
      const warp = -38000 / r2; // Deformación gravitacional
      const px = cx + u;
      const py = cy + v * 0.6 + warp;
      if (j === -lines) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Masa estelar central
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(cx, cy + 12, 14, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('G_μν + Λ g_μν = (8πG / c⁴) · T_μν  (Curvatura Espaciotemporal)', cx, H * 0.94);
}

// ── 65 [066]: El Radio del Agujero Negro de Schwarzschild (r_s = 2GM/c²)
let schwT = 0;
function init_65() { schwT = 0; }
function step_65() {
  trailFade(0.06);
  schwT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const rs = Math.min(W, H) * 0.12;

  // Disco de acreción relativista ray-traced deformado por lente gravitacional
  ctx.strokeStyle = pal(0.7); ctx.lineWidth = 3;
  for (let a = rs * 1.5; a <= rs * 3.5; a += 8) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, a, a * 0.35, schwT * 0.1, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Esfera de fotones (1.5 r_s)
  ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.arc(cx, cy, rs * 1.5, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);

  // Horizonte de sucesos (r = r_s) — Negro absoluto
  ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(cx, cy, rs, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 2; ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('r_s = 2GM / c²  (Horizonte de Sucesos de Schwarzschild)', cx, H * 0.94);
}

// ── 66 [067]: Longitud de Onda Cuántica de De Broglie (λ = h / p) ──
let debrogT = 0;
function init_66() { debrogT = 0; }
function step_66() {
  trailFade(0.06);
  debrogT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cy = H * 0.5;
  const L = W * 0.8;

  // Onda piloto envolviendo a la partícula
  const pSpeed = 2.5;
  const lambda = 45.0; // Longitud de onda h/p
  const k = (2 * Math.PI) / lambda;
  const partX = (W * 0.15) + ((debrogT * pSpeed * 20) % L);

  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 3) {
    const x = W * 0.1 + px;
    const env = Math.exp(-Math.pow((x - partX) / 80.0, 2));
    const wave = env * (H * 0.12) * Math.sin(k * x - debrogT * 4);
    if (px === 0) ctx.moveTo(x, cy + wave); else ctx.lineTo(x, cy + wave);
  }
  ctx.stroke();

  // Partícula puntual central guiada por la onda piloto
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.arc(partX, cy, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('λ = h / p  (Dualidad Onda-Partícula de De Broglie)', W * 0.5, H * 0.94);
}

// ── 67 [068]: La Ecuación de Onda Cuántica de Schrödinger ──────────
let schrodT = 0;
function init_67() { schrodT = 0; }
function step_67() {
  trailFade(0.06);
  schrodT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cy = H * 0.5;
  const L = W * 0.8;

  // Barrera de potencial finita V(x) en el centro
  const barX = W * 0.5, barW = W * 0.08, barH = H * 0.18;
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(barX - barW * 0.5, cy - barH, barW, barH);
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 1.5;
  ctx.strokeRect(barX - barW * 0.5, cy - barH, barW, barH);

  // Paquete de onda incidente, reflejado y transmitido por efecto túnel
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 4) {
    const x = W * 0.1 + px;
    let psi = 0;
    if (x < barX - barW * 0.5) {
      // Onda incidente + reflejada
      psi = Math.sin(x * 0.08 - schrodT * 3) * (H * 0.12);
    } else if (x <= barX + barW * 0.5) {
      // Decaimiento exponencial en la barrera
      const u = (x - (barX - barW * 0.5)) / barW;
      psi = Math.exp(-u * 2.2) * Math.sin((barX - barW*0.5) * 0.08 - schrodT * 3) * (H * 0.12);
    } else {
      // Onda transmitida por túnel (menor amplitud)
      psi = 0.35 * Math.sin(x * 0.08 - schrodT * 3) * (H * 0.12);
    }
    const scrY = cy - psi;
    if (px === 0) ctx.moveTo(x, scrY); else ctx.lineTo(x, scrY);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('i ℏ · ∂ψ/∂t = Ĥ ψ  (Efecto Túnel Cuántico)', W * 0.5, H * 0.94);
}

// ── 68 [069]: Principio de Incertidumbre de Heisenberg (Δx · Δp ≥ ℏ/2)
let heisAngle = 0;
function init_68() { heisAngle = 0; }
function step_68() {
  trailFade(0.06);
  heisAngle += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Elipse de incertidumbre en el espacio de fase cuántico (x, p)
  // Estado comprimido (squeezed state) que conserva el área mínima DeltaX * DeltaP = hbar/2
  const squeeze = 1.0 + 0.6 * Math.sin(heisAngle);
  const aX = (Math.min(W, H) * 0.28) * squeeze;
  const aP = (Math.min(W, H) * 0.28) / squeeze;

  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, aX, aP, heisAngle * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Nube de probabilidad Wigner dentro de la elipse
  ctx.fillStyle = pal(0.2);
  for (let i = 0; i < 90; i++) {
    const r = Math.sqrt(Math.random()), th = Math.random() * Math.PI * 2;
    const px = cx + r * aX * Math.cos(th);
    const py = cy + r * aP * Math.sin(th);
    ctx.fillRect(px, py, 2, 2);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Δx · Δp ≥ ℏ / 2  (Área Mínima en el Espacio de Fases)', cx, H * 0.94);
}

// ── 69 [070]: La Ecuación Relativista de Dirac ((i γ^μ ∂_μ - m) ψ = 0)
let diracT = 0;
function init_69() { diracT = 0; }
function step_69() {
  trailFade(0.05);
  diracT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.25;

  // Zitterbewegung: oscilación ultra-rápida intrínseca del espinor relativista
  const zitFreq = 12.0;
  const zitR = R * 0.15;
  const mainX = R * Math.cos(diracT);
  const mainY = R * Math.sin(diracT) * 0.5;

  const zitX = zitR * Math.cos(zitFreq * diracT);
  const zitY = zitR * Math.sin(zitFreq * diracT);

  const totalX = cx + mainX + zitX;
  const totalY = cy + mainY + zitY;

  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.0;
  ctx.beginPath(); ctx.arc(totalX, totalY, 8, 0, Math.PI * 2); ctx.stroke();

  // Espinor de 4 componentes proyectado
  for (let c = 0; c < 4; c++) {
    const compA = diracT * 2 + (c * Math.PI * 0.5);
    ctx.strokeStyle = pal(c / 4); ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(totalX, totalY);
    ctx.lineTo(totalX + 22 * Math.cos(compA), totalY + 22 * Math.sin(compA));
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('(i γ^μ ∂_μ - m) ψ = 0  (Espinor Relativista & Zitterbewegung)', cx, H * 0.94);
}

// ── 70 [071]: La Fibración Topológica de Hopf (π: S³ → S²) ─────────
let hopfT = 0;
function init_70() { hopfT = 0; }
function step_70() {
  trailFade(0.05);
  hopfT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.32;

  // Fibras de Villarceau circulares anidadas en toros de Clifford
  const tori = 4;
  for (let t = 1; t <= tori; t++) {
    const R_torus = sc * (t / tori);
    const r_tube = sc * 0.12;
    const fibers = 12;
    for (let f = 0; f < fibers; f++) {
      const u = (f / fibers) * Math.PI * 2 + hopfT;
      ctx.strokeStyle = pal((t * fibers + f) / (tori * fibers));
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let v = 0; v <= Math.PI * 2; v += 0.2) {
        const x3d = (R_torus + r_tube * Math.cos(v)) * Math.cos(u + v);
        const y3d = (R_torus + r_tube * Math.cos(v)) * Math.sin(u + v);
        const z3d = r_tube * Math.sin(v);

        const projX = cx + x3d;
        const projY = cy + y3d * 0.5 + z3d * 0.8;
        if (v === 0) ctx.moveTo(projX, projY); else ctx.lineTo(projX, projY);
      }
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('π: S³ → S²  (Fibración de Hopf & Círculos de Villarceau)', cx, H * 0.94);
}

// ── 71 [072]: La Ley de Expansión Cósmica de Hubble (v = H₀ · d) ────
let hubbleScale = 1.0;
function init_71() { hubbleScale = 1.0; }
function step_71() {
  trailFade(0.06);
  hubbleScale += 0.005;
  if (hubbleScale > 2.2) hubbleScale = 1.0;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Malla cósmica expandiéndose métricamente
  const grid = 6;
  const baseSpacing = Math.min(W, H) * 0.07;
  for (let i = -grid; i <= grid; i++) {
    for (let j = -grid; j <= grid; j++) {
      const gx = cx + i * baseSpacing * hubbleScale;
      const gy = cy + j * baseSpacing * hubbleScale;
      const d = Math.hypot(gx - cx, gy - cy);
      if (d < Math.min(W, H) * 0.45) {
        // Corrimiento al rojo Doppler z = v/c
        const redshift = d / (Math.min(W, H) * 0.45);
        ctx.fillStyle = pal(redshift);
        ctx.beginPath(); ctx.arc(gx, gy, 3.5, 0, Math.PI * 2); ctx.fill();

        // Vector de velocidad de recesión v = H0 * d
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + (gx - cx) * 0.15, gy + (gy - cy) * 0.15); ctx.stroke();
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('v = H₀ · d  (Expansión Métrica del Espacio)', cx, H * 0.94);
}

// ── 72 [073]: Las Ecuaciones Cosmológicas de Friedmann ─────────────
let friedT = 0;
function init_72() { friedT = 0; }
function step_72() {
  trailFade(0.06);
  friedT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.68;
  const L = W * 0.75;

  // Ejes (t, a(t))
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W * 0.12, cy); ctx.lineTo(W * 0.88, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.15, cy); ctx.lineTo(W * 0.15, cy - H * 0.45); ctx.stroke();

  // 3 curvas cosmológicas: Cerrada (Big Crunch), Plana (Einstein-de Sitter), Acelerada (Lambda-CDM)
  // 1. Acelerada Lambda-CDM
  ctx.strokeStyle = pal(0.9); ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = 0; px <= L * 0.7; px += 3) {
    const t = (px / L) * 3;
    const a = Math.sinh(t * 0.8) * (H * 0.15);
    const scrX = W * 0.15 + px, scrY = cy - a;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  // 2. Cerrada k=+1 (Big Crunch)
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let px = 0; px <= L * 0.6; px += 3) {
    const t = (px / (L * 0.6)) * Math.PI;
    const a = Math.sin(t) * (H * 0.25);
    const scrX = W * 0.15 + px, scrY = cy - a;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('(ȧ/a)² = (8πG/3)ρ + Λ/3 - kc²/a²  (Dinámica Cósmica)', cx, H * 0.94);
}

// ── 73 [074]: El Teorema de Noether (Simetría ⟹ Conservación) ──────
let noethT = 0;
function init_73() { noethT = 0; }
function step_73() {
  trailFade(0.06);
  noethT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.35;

  // Simetría rotacional SO(2) que engendra la conservación del momento angular L
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  // Órbitas invariantes bajo rotación
  for (let a = 0; a < 6; a++) {
    const angle = noethT + (a * Math.PI) / 3;
    ctx.strokeStyle = pal(a / 6); ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.8, R * 0.35, angle, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Simetría Continua  ⟹  Corriente de Noether Conservada', cx, H * 0.94);
}

// ── 74 [075]: Principio de Exclusión de Pauli (ψ(1, 2) = -ψ(2, 1)) ──
let pauliT = 0;
function init_74() { pauliT = 0; }
function step_74() {
  trailFade(0.06);
  pauliT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const shells = [Math.min(W, H) * 0.15, Math.min(W, H) * 0.28, Math.min(W, H) * 0.40];

  // Capas atómicas 1s, 2s, 2p
  shells.forEach((rad, sIdx) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();

    // Electrones con espines opuestos (+1/2 up, -1/2 down)
    const count = (sIdx + 1) * 2;
    for (let i = 0; i < count; i++) {
      const ang = pauliT * (1.5 / (sIdx + 1)) + (i * Math.PI * 2) / count;
      const ex = cx + rad * Math.cos(ang), ey = cy + rad * Math.sin(ang);
      const spinUp = (i % 2 === 0);

      ctx.fillStyle = spinUp ? '#38bdf8' : '#ef4444';
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();

      // Flecha de espín
      ctx.strokeStyle = spinUp ? '#38bdf8' : '#ef4444'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, ey + (spinUp ? -12 : 12)); ctx.stroke();
    }
  });

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ψ(1, 2) = -ψ(2, 1)  (Antisimetría & Fermiones de Espín ½)', cx, H * 0.94);
}

// ── 75 [076]: El Condensado de Bose-Einstein ───────────────────────
let becT = 0, becParticles = [];
function init_75() {
  becT = 0; becParticles = [];
  for (let i = 0; i < 300; i++) {
    becParticles.push({ th: Math.random() * Math.PI * 2, r: Math.random() * 0.4 });
  }
}
function step_75() {
  trailFade(0.08);
  becT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.38;

  // Temperatura enfriándose por debajo de T_c: colapso colectivo al estado base
  const tempFrac = Math.max(0.05, 1.0 - (becT * 0.1 % 1.0));

  ctx.fillStyle = pal(1.0 - tempFrac);
  for (const p of becParticles) {
    p.th += 0.02;
    const curR = p.r * R * tempFrac;
    const px = cx + curR * Math.cos(p.th);
    const py = cy + curR * Math.sin(p.th);
    ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
  }

  // Pico gigante cuántico coherente en el centro
  if (tempFrac < 0.3) {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(cx, cy, (1.0 - tempFrac) * 22, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('T < T_c  (Condensación Cuántica en Estado Fundamental Único)', cx, H * 0.94);
}

// ── 76 [077]: Entropía de Bekenstein-Hawking (S = k_B A / (4 ℓ_P²)) ─
let bhPixelT = 0;
function init_76() { bhPixelT = 0; }
function step_76() {
  trailFade(0.06);
  bhPixelT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.28;

  // Horizonte de sucesos pixelado con celdas de Planck de 1 bit holográfico
  const bits = 48;
  for (let i = 0; i < bits; i++) {
    const th = (i * Math.PI * 2) / bits;
    const px = cx + R * Math.cos(th), py = cy + R * Math.sin(th);
    const bitVal = Math.sin(i * 3 + bhPixelT * 4) > 0 ? 1 : 0;
    ctx.fillStyle = bitVal ? pal(0.85) : '#101014';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  // Interior del agujero negro
  ctx.fillStyle = '#050308'; ctx.beginPath(); ctx.arc(cx, cy, R - 8, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('S_BH = k_B · A / (4 ℓ_P²)  (Holografía Cuántica de Bekenstein)', cx, H * 0.94);
}

// ── 77 [078]: La Radiación Térmica de Hawking (T_H = ℏ c³ / 8πGMk) ─
let hawkPairs = [], hawkT = 0;
function init_77() { hawkT = 0; hawkPairs = []; }
function step_77() {
  trailFade(0.08);
  hawkT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.25;

  // Horizonte
  ctx.fillStyle = '#050308'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 2; ctx.stroke();

  // Creación de pares virtuales en el horizonte
  if (Math.random() < 0.25) {
    const th = Math.random() * Math.PI * 2;
    hawkPairs.push({
      x: cx + R * Math.cos(th), y: cy + R * Math.sin(th),
      th: th, dist: 0, life: 0
    });
  }

  for (let i = hawkPairs.length - 1; i >= 0; i--) {
    const p = hawkPairs[i];
    p.dist += 1.5; p.life++;

    // Partícula negativa cae adentro (-E), partícula positiva escapa (+E)
    const inX = p.x - p.dist * Math.cos(p.th), inY = p.y - p.dist * Math.sin(p.th);
    const outX = p.x + p.dist * Math.cos(p.th), outY = p.y + p.dist * Math.sin(p.th);

    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(outX, outY, 3, 0, Math.PI * 2); ctx.fill(); // Escapa
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(inX, inY, 3, 0, Math.PI * 2); ctx.fill();   // Absorbida

    if (p.life > 60) hawkPairs.splice(i, 1);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('T_H = ℏ · c³ / (8π G M k_B)  (Evaporación Cuántica)', cx, H * 0.94);
}

// ── 78 [079]: Teoría de Calibre No Abeliana de Yang-Mills ───────────
let ymT = 0;
function init_78() { ymT = 0; }
function step_78() {
  trailFade(0.06);
  ymT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const dQuark = W * 0.22;

  // Tubo de flujo cromodinámico SU(3) entre par quark-antiquark (confinamiento)
  const q1x = cx - dQuark, q1y = cy;
  const q2x = cx + dQuark, q2y = cy;

  // Filamentos de gluones entrelazados en el tubo de flujo
  const strands = 7;
  for (let s = 0; s < strands; s++) {
    ctx.strokeStyle = pal(s / strands); ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(q1x, q1y);
    for (let u = 0; u <= 1.0; u += 0.05) {
      const px = q1x + (q2x - q1x) * u;
      const env = Math.sin(u * Math.PI);
      const py = cy + env * (H * 0.08) * Math.sin(ymT * 3 + u * 12 + s);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Quarks de color
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(q1x, q1y, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(q2x, q2y, 10, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ℒ = -¼ F^a_μν F^{a μν}  (Confinamiento de Color & Gap de Masa)', cx, H * 0.94);
}

// ── 79 [080]: El Mecanismo de Higgs y Masa Elemental ───────────────
let higgsT = 0;
function init_79() { higgsT = 0; }
function step_79() {
  trailFade(0.06);
  higgsT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.32;

  // Potencial del Sombrero Mexicano V(phi) = -mu^2 |phi|^2 + lambda |phi|^4
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 1.4;
  const rings = 14;
  for (let r = 1; r <= rings; r++) {
    const rho = (r / rings);
    const v = -2.0 * rho * rho + Math.pow(rho, 4); // Pozo en rho=1
    const isoR = rho * sc;
    const isoY = cy + v * (H * 0.15) + H * 0.08;
    ctx.beginPath();
    ctx.ellipse(cx, isoY, isoR, isoR * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Partícula rodando al fondo del valle del sombrero (ruptura espontánea de simetría)
  const rollAng = higgsT;
  const minRho = sc;
  const minV = -1.0;
  const ballX = cx + minRho * Math.cos(rollAng);
  const ballY = cy + minV * (H * 0.15) + H * 0.08 + minRho * Math.sin(rollAng) * 0.35;

  ctx.fillStyle = '#fef08a';
  ctx.beginPath(); ctx.arc(ballX, ballY, 8, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('V(ϕ) = -μ² |ϕ|² + λ |ϕ|⁴  (Ruptura Espontánea de Simetría)', cx, H * 0.94);
}

  function handlePointer(type, x, y, dx, dy, artIdx, meta) {}

  const inits = [
    init_60,
    init_61,
    init_62,
    init_63,
    init_64,
    init_65,
    init_66,
    init_67,
    init_68,
    init_69,
    init_70,
    init_71,
    init_72,
    init_73,
    init_74,
    init_75,
    init_76,
    init_77,
    init_78,
    init_79
  ];

  const steps = [
    step_60,
    step_61,
    step_62,
    step_63,
    step_64,
    step_65,
    step_66,
    step_67,
    step_68,
    step_69,
    step_70,
    step_71,
    step_72,
    step_73,
    step_74,
    step_75,
    step_76,
    step_77,
    step_78,
    step_79
  ];

  const initsMap = {};
  const stepsMap = {};
  for (let i = 0; i < 20; i++) {
    const globalId = 60 + i;
    initsMap[globalId] = inits[i];
    stepsMap[globalId] = steps[i];
  }

  const epochModule = {
    epoch: 4,
    name: "Relatividad & Cuántica",
    range: [60, 79],
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
    root.AtelierEpoch4 = epochModule;
    if (root.AtelierMathCore && typeof root.AtelierMathCore.registerEpoch === 'function') {
      root.AtelierMathCore.registerEpoch(epochModule);
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
