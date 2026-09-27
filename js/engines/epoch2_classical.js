// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — ÉPOCA 2: LA ILUSTRACIÓN, ONDAS & ANÁLISIS CLÁSICO
// Obras 020 a 039 · Simulación en Silicio Nativo 60 FPS
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

// ÉPOCA II: LA ILUSTRACIÓN, ONDAS & ANÁLISIS CLÁSICO (OBRAS 020 A 039)
// ═══════════════════════════════════════════════════════════════════

// ── 20 [021]: La Identidad Sagrada de Euler (e^{iπ} + 1 = 0) ──────
let eulerAngle = 0;
function init_20() { eulerAngle = 0; }
function step_20() {
  trailFade(0.06);
  eulerAngle += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.32;

  // Plano Complejo (Eje Real e Imaginario)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx - R * 1.3, cy); ctx.lineTo(cx + R * 1.3, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - R * 1.3); ctx.lineTo(cx, cy + R * 1.3); ctx.stroke();

  // Circunferencia unitaria
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  // Fasor e^{i theta} viajando de 0 a pi
  const th = (eulerAngle % (Math.PI * 2));
  const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);

  // Vector fasor
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

  // Proyecciones ortogonales cos(theta) y sin(theta)
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
  ctx.strokeStyle = '#38bdf8';
  ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
  ctx.setLineDash([]);

  // Puntos sagrados: +1, i, -1, 0
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.arc(cx + R, cy, 5, 0, Math.PI * 2); ctx.fill(); // +1
  ctx.beginPath(); ctx.arc(cx - R, cy, 5, 0, Math.PI * 2); ctx.fill(); // -1
  ctx.beginPath(); ctx.arc(cx, cy - R, 5, 0, Math.PI * 2); ctx.fill(); // i

  // Destello en e^{i*pi} = -1
  if (Math.abs(th - Math.PI) < 0.1) {
    ctx.strokeStyle = pal(0.95); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx - R, cy, 14, 0, Math.PI * 2); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '13px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('e^{iπ} + 1 = 0   |   e^{iθ} = cos θ + i sin θ', cx, H * 0.94);
}

// ── 21 [022]: La Ecuación de Bernoulli (p + ½ ρ v² = cte) ─────────
let bernT = 0, bernParts = [];
function init_21() {
  bernT = 0; bernParts = [];
  for (let i = 0; i < 240; i++) {
    bernParts.push({ x: Math.random() * W, yOff: (Math.random() - 0.5) * 0.8 });
  }
}
function step_21() {
  trailFade(0.08);
  bernT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cy = H * 0.5;

  // Perfil del tubo de Venturi: constricción en el centro
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.5;
  for (const sign of [-1, 1]) {
    ctx.beginPath();
    for (let x = W * 0.1; x <= W * 0.9; x += 10) {
      const u = (x - W * 0.5) / (W * 0.3);
      const halfH = (H * 0.18) * (1.0 - 0.5 * Math.exp(-u * u));
      const y = cy + sign * halfH;
      if (x === W * 0.1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Columnas manométricas verticales indicando la caída de presión en la garganta
  const xMan = [W * 0.25, W * 0.5, W * 0.75];
  const pVals = [H * 0.28, H * 0.12, H * 0.26]; // Caída drástica en el centro
  xMan.forEach((xm, idx) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(xm - 10, cy - H * 0.35); ctx.lineTo(xm - 10, cy - H * 0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xm + 10, cy - H * 0.35); ctx.lineTo(xm + 10, cy - H * 0.12); ctx.stroke();

    // Nivel del líquido en manómetro
    const pY = cy - pVals[idx];
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(xm - 9, pY, 18, (cy - H * 0.12) - pY);
  });

  // Partículas advectadas acelerando en la garganta
  for (const p of bernParts) {
    const u = (p.x - W * 0.5) / (W * 0.3);
    const speed = 2.0 + 6.0 * Math.exp(-u * u); // Más rápida en la garganta
    p.x += speed;
    if (p.x > W * 0.9) p.x = W * 0.1;

    const halfH = (H * 0.16) * (1.0 - 0.5 * Math.exp(-u * u));
    const py = cy + p.yOff * halfH;

    ctx.fillStyle = pal(Math.min(1.0, speed / 7.0));
    ctx.fillRect(p.x, py, 2.5, 2.5);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('P₁ + ½ρv₁² = P₂ + ½ρv₂²  (Mayor velocidad ⟹ Menor presión)', W * 0.5, H * 0.94);
}

// ── 22 [023]: Ecuación de Onda Unidimensional (∂²u/∂t² = c² ∂²u/∂x²)
let wave1DT = 0;
function init_22() { wave1DT = 0; }
function step_22() {
  trailFade(0.06);
  wave1DT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const L = W * 0.8;

  // Superposición armónica de 4 modos normales de la cuerda vibrante
  const modes = [
    { n: 1, amp: H * 0.14, w: 1.0 },
    { n: 2, amp: H * 0.08, w: 2.0 },
    { n: 3, amp: H * 0.05, w: 3.0 },
    { n: 4, amp: H * 0.03, w: 4.0 }
  ];

  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.8;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 4) {
    const x = (px / L) * Math.PI;
    let u = 0;
    for (const m of modes) {
      u += m.amp * Math.sin(m.n * x) * Math.cos(m.w * wave1DT);
    }
    const scrX = W * 0.1 + px, scrY = cy - u;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  // Nodos fijos
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.arc(W * 0.1, cy, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W * 0.9, cy, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∂²u/∂t² = c² · ∂²u/∂x²  (Modos Propios Estacionarios)', cx, H * 0.94);
}

// ── 23 [024]: Ecuaciones de Euler-Lagrange (Péndulo Doble Caótico) ──
let lagTh1 = Math.PI * 0.6, lagTh2 = Math.PI * 0.6, lagW1 = 0, lagW2 = 0, lagTrail = [];
function init_23() {
  lagTh1 = Math.PI * 0.6; lagTh2 = Math.PI * 0.8; lagW1 = 0; lagW2 = 0; lagTrail = [];
}
function step_23() {
  trailFade(0.04);
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.38;
  const L = Math.min(W, H) * 0.22;
  const g = 9.8, dt = 0.04;

  // Integrador RK4 para las ecuaciones exactas de Euler-Lagrange del péndulo doble
  for (let s = 0; s < 4; s++) {
    const dth = lagTh1 - lagTh2;
    const num1 = -g * (2 * Math.sin(lagTh1) - Math.cos(dth) * Math.sin(lagTh2)) - Math.sin(dth) * (lagW2 * lagW2 + lagW1 * lagW1 * Math.cos(dth));
    const den1 = 2 - Math.cos(2 * dth);
    const alpha1 = num1 / den1;

    const num2 = 2 * Math.sin(dth) * (lagW1 * lagW1 * 2 + g * Math.cos(lagTh1) * 2 + lagW2 * lagW2 * Math.cos(dth));
    const alpha2 = num2 / den1;

    lagW1 += alpha1 * dt; lagW2 += alpha2 * dt;
    lagW1 *= 0.999; lagW2 *= 0.999; // ligera disipación para evitar divergencia
    lagTh1 += lagW1 * dt; lagTh2 += lagW2 * dt;
  }

  const x1 = cx + L * Math.sin(lagTh1), y1 = cy + L * Math.cos(lagTh1);
  const x2 = x1 + L * Math.sin(lagTh2), y2 = y1 + L * Math.cos(lagTh2);

  lagTrail.push([x2, y2]);
  if (lagTrail.length > 550) lagTrail.shift();

  // Estela de la segunda masa (atractor caótico)
  const n = lagTrail.length;
  for (let i = 1; i < n; i++) {
    const f = i / n;
    ctx.strokeStyle = pal(f); ctx.lineWidth = 0.5 + f * 1.5;
    ctx.beginPath(); ctx.moveTo(lagTrail[i-1][0], lagTrail[i-1][1]); ctx.lineTo(lagTrail[i][0], lagTrail[i][1]); ctx.stroke();
  }

  // Brazos del péndulo
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.fillStyle = '#c5a059'; ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(x2, y2, 7, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('d/dt(∂L/∂q̇) - ∂L/∂q = 0  (Caos Determinista)', cx, H * 0.94);
}

// ── 24 [025]: Ecuación de Vigas de Euler-Bernoulli (EI d⁴w/dx⁴ = q) ──
let beamT = 0;
function init_24() { beamT = 0; }
function step_24() {
  trailFade(0.08);
  beamT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const L = W * 0.75;

  // Carga móvil armónica q(x, t)
  const loadPos = (W * 0.125) + (L * 0.5) * (1.0 + 0.6 * Math.sin(beamT));
  const loadP = H * 0.08;

  // Curva elástica w(x) analítica viga biapoyada
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 3.5;
  ctx.beginPath();
  const x0 = W * 0.125;
  for (let px = 0; px <= L; px += 4) {
    const x = px;
    const a = loadPos - x0;
    const b = L - a;
    let w = 0;
    if (x <= a) {
      w = (loadP * b * x / (6 * L)) * (L * L - b * b - x * x) * 0.00015;
    } else {
      w = (loadP * a * (L - x) / (6 * L)) * (2 * L * x - x * x - a * a) * 0.00015;
    }
    const scrX = x0 + px, scrY = cy + w;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  // Apoyos fijos
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 - 12, cy + 20); ctx.lineTo(x0 + 12, cy + 20); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x0 + L, cy); ctx.lineTo(x0 + L - 12, cy + 20); ctx.lineTo(x0 + L + 12, cy + 20); ctx.closePath(); ctx.fill();

  // Vector de carga vertical
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(loadPos, cy - 40); ctx.lineTo(loadPos, cy); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('EI · d⁴w/dx⁴ = q(x)  (Línea Elástica Continua)', cx, H * 0.94);
}

// ── 25 [026]: Ley Electrostática de Coulomb (F = k_e q₁ q₂ / r²) ───
let coulT = 0;
function init_25() { coulT = 0; }
function step_25() {
  trailFade(0.06);
  coulT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const d = W * 0.18;

  // Cargas dipolares oscilantes
  const q1x = cx - d * Math.cos(coulT * 0.5), q1y = cy - d * Math.sin(coulT * 0.5);
  const q2x = cx + d * Math.cos(coulT * 0.5), q2y = cy + d * Math.sin(coulT * 0.5);

  // Líneas de campo de Coulomb trazadas con alta densidad
  const lines = 24;
  ctx.lineWidth = 1.0;
  for (let i = 0; i < lines; i++) {
    const angle = (i * Math.PI * 2) / lines;
    let rx = q1x + 12 * Math.cos(angle), ry = q1y + 12 * Math.sin(angle);
    ctx.strokeStyle = pal(i / lines);
    ctx.beginPath(); ctx.moveTo(rx, ry);
    for (let step = 0; step < 70; step++) {
      const d1x = rx - q1x, d1y = ry - q1y, r1sq = d1x*d1x + d1y*d1y + 10;
      const d2x = rx - q2x, d2y = ry - q2y, r2sq = d2x*d2x + d2y*d2y + 10;
      const ex = (d1x / Math.pow(r1sq, 1.5)) - (d2x / Math.pow(r2sq, 1.5));
      const ey = (d1y / Math.pow(r1sq, 1.5)) - (d2y / Math.pow(r2sq, 1.5));
      const emag = Math.hypot(ex, ey) || 0.001;
      rx += (ex / emag) * 7; ry += (ey / emag) * 7;
      ctx.lineTo(rx, ry);
      if (Math.hypot(rx - q2x, ry - q2y) < 14) break;
    }
    ctx.stroke();
  }

  // Cargas (+ roja, - azul)
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(q1x, q1y, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(q2x, q2y, 10, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('F = k_e · (q₁ · q₂) / r²  (Dipolo Electrostático)', cx, H * 0.94);
}

// ── 26 [027]: Los Cantos de Chladni (Cimática Acústica) ────────────
let chladniSand = [], chM = 3, chN = 5, chladniT = 0;
function init_26() {
  chladniSand = []; chladniT = 0;
  for (let i = 0; i < 2200; i++) {
    chladniSand.push({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 });
  }
}
function step_26() {
  trailFade(0.08);
  chladniT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.38;

  // Placa cuadrada límite
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - sc, cy - sc, sc * 2, sc * 2);

  // Dinámica física de las partículas de arena migrando a nodos w(x,y)=0
  ctx.fillStyle = pal(0.85);
  for (const p of chladniSand) {
    const x = p.x * Math.PI, y = p.y * Math.PI;
    const w = Math.cos(chN * x) * Math.cos(chM * y) - Math.cos(chM * x) * Math.cos(chN * y);
    // Gradiente de aceleración nodal
    const dwdx = -chN * Math.sin(chN * x) * Math.cos(chM * y) + chM * Math.sin(chM * x) * Math.cos(chN * y);
    const dwdy = -chM * Math.cos(chN * x) * Math.sin(chM * y) + chN * Math.cos(chM * x) * Math.sin(chN * y);

    const grad = Math.abs(w);
    p.x -= dwdx * w * 0.015 + (Math.random() - 0.5) * 0.005 * grad;
    p.y -= dwdy * w * 0.015 + (Math.random() - 0.5) * 0.005 * grad;

    p.x = Math.max(-0.95, Math.min(0.95, p.x));
    p.y = Math.max(-0.95, Math.min(0.95, p.y));

    ctx.fillRect(cx + p.x * sc, cy + p.y * sc, 1.8, 1.8);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`Líneas Nodales de Chladni (m=${chM}, n=${chN})`, cx, H * 0.94);
}

// ── 27 [028]: Ley de los Gases Ideales (P · V = n · R · T) ─────────
let gasParts = [], gasT = 0;
function init_27() {
  gasParts = []; gasT = 0;
  for (let i = 0; i < 180; i++) {
    gasParts.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.02, vy: (Math.random() - 0.5) * 0.02
    });
  }
}
function step_27() {
  trailFade(0.08);
  gasT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.48;
  const boxW = W * 0.6, boxH = H * 0.4;
  const pistonX = (boxW * 0.5) * (1.0 - 0.3 * Math.sin(gasT)); // Volumen variable

  // Cámara con émbolo móvil
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - boxW * 0.5, cy - boxH * 0.5);
  ctx.lineTo(cx - boxW * 0.5, cy + boxH * 0.5);
  ctx.lineTo(cx + boxW * 0.5, cy + boxH * 0.5);
  ctx.lineTo(cx + boxW * 0.5, cy - boxH * 0.5);
  ctx.stroke();

  // Émbolo
  const pX = cx - boxW * 0.5 + pistonX;
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(pX, cy - boxH * 0.5); ctx.lineTo(pX, cy + boxH * 0.5); ctx.stroke();

  // Partículas colisionando
  ctx.fillStyle = pal(0.85);
  const minX = cx - boxW * 0.5, maxX = pX;
  const minY = cy - boxH * 0.5, maxY = cy + boxH * 0.5;

  for (const p of gasParts) {
    p.x += p.vx * (1.0 + 0.5 * Math.sin(gasT));
    p.y += p.vy * (1.0 + 0.5 * Math.sin(gasT));

    const curX = minX + p.x * (maxX - minX);
    const curY = minY + p.y * (maxY - minY);

    if (p.x < 0) { p.x = 0; p.vx = -p.vx; }
    if (p.x > 1) { p.x = 1; p.vx = -p.vx; }
    if (p.y < 0) { p.y = 0; p.vy = -p.vy; }
    if (p.y > 1) { p.y = 1; p.vy = -p.vy; }

    ctx.fillRect(curX - 1.5, curY - 1.5, 3, 3);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('P · V = n · R · T  (Compresión Adiabática)', cx, H * 0.94);
}

// ── 28 [029]: La Ecuación de Laplace (∇²ϕ = 0) ────────────────────
let lapGrid = null, lapW = 40, lapH = 40, lapT = 0;
function init_28() {
  lapT = 0;
  lapGrid = new Float32Array(lapW * lapH);
  // Condiciones de frontera Dirichlet
  for (let x = 0; x < lapW; x++) lapGrid[x] = 1.0; // Borde superior caliente
}
function step_28() {
  trailFade(0.08);
  lapT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.7 / lapW;

  // Relajación de Jacobi / SOR para ∇²ϕ = 0
  for (let it = 0; it < 3; it++) {
    for (let y = 1; y < lapH - 1; y++) {
      for (let x = 1; x < lapW - 1; x++) {
        lapGrid[y * lapW + x] = 0.25 * (
          lapGrid[(y - 1) * lapW + x] + lapGrid[(y + 1) * lapW + x] +
          lapGrid[y * lapW + (x - 1)] + lapGrid[y * lapW + (x + 1)]
        );
      }
    }
  }

  // Renderizar curvas de nivel armónicas equipotenciales
  for (let y = 0; y < lapH; y += 2) {
    for (let x = 0; x < lapW; x += 2) {
      const val = lapGrid[y * lapW + x];
      const px = cx - (lapW * sc * 0.5) + x * sc;
      const py = cy - (lapH * sc * 0.5) + y * sc;
      ctx.fillStyle = pal(val);
      ctx.fillRect(px, py, sc * 1.8, sc * 1.8);
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∇²ϕ = 0  (Potencial Armónico de Laplace)', cx, H * 0.94);
}

// ── 29 [030]: La Ecuación de Poisson (∇²ϕ = -ρ / ε₀) ───────────────
let poisT = 0;
function init_29() { poisT = 0; }
function step_29() {
  trailFade(0.06);
  poisT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.38;

  // Superficie potencial 3D isométrica para fuente gaussiana puntual
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 1.2;
  const lines = 24;
  for (let i = 0; i <= lines; i++) {
    const u = (i / lines - 0.5) * 2;
    ctx.beginPath();
    for (let j = 0; j <= lines; j++) {
      const v = (j / lines - 0.5) * 2;
      const r2 = u * u + v * v + 0.1;
      const phi = -1.0 / Math.sqrt(r2); // Potencial de Poisson
      const isoX = cx + (u - v) * (sc * 0.6);
      const isoY = cy + (u + v) * (sc * 0.3) - phi * 35;
      if (j === 0) ctx.moveTo(isoX, isoY); else ctx.lineTo(isoX, isoY);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∇²ϕ = -ρ / ε₀  (Pozo de Potencial Gravitatorio/Eléctrico)', cx, H * 0.94);
}

// ── 30 [031]: La Serie y Transformada de Fourier ───────────────────
let fourierT = 0, fourierTrail = [];
function init_30() { fourierT = 0; fourierTrail = []; }
function step_30() {
  trailFade(0.04);
  fourierT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.35, cy = H * 0.5;
  const baseR = Math.min(W, H) * 0.18;

  // Epiciclos rotatorios (armónicos impares para onda cuadrada)
  let curX = cx, curY = cy;
  for (let k = 1; k <= 7; k += 2) {
    const r = baseR * (4 / (k * Math.PI));
    const angle = k * fourierT;
    const nextX = curX + r * Math.cos(angle);
    const nextY = curY + r * Math.sin(angle);

    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(curX, curY, r, 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = pal(k / 7); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(curX, curY); ctx.lineTo(nextX, nextY); ctx.stroke();

    curX = nextX; curY = nextY;
  }

  // Trazado de la onda resultante a la derecha
  fourierTrail.unshift(curY);
  if (fourierTrail.length > 400) fourierTrail.pop();

  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(curX, curY); ctx.lineTo(W * 0.65, curY); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < fourierTrail.length; i++) {
    const px = W * 0.65 + i * 0.8;
    if (i === 0) ctx.moveTo(px, fourierTrail[i]); else ctx.lineTo(px, fourierTrail[i]);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('f(x) = ∑ [ 4/(kπ) · sin(kωt) ]  (Síntesis Armónica)', W * 0.5, H * 0.94);
}

// ── 31 [032]: La Ecuación de Difusión del Calor (∂u/∂t = α ∇²u) ─────
let heatGrid = null, heatW = 36, heatH = 36, heatT = 0;
function init_31() {
  heatT = 0; heatGrid = new Float32Array(heatW * heatH);
  // Focos iniciales concentrados
  heatGrid[(heatH/2|0) * heatW + (heatW/2|0)] = 20.0;
}
function step_31() {
  trailFade(0.08);
  heatT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.7 / heatW;

  // Difusión térmica en 2D: u^{n+1} = u^n + alpha * dt * ∇²u
  const alpha = 0.18;
  const nextGrid = new Float32Array(heatGrid);
  for (let y = 1; y < heatH - 1; y++) {
    for (let x = 1; x < heatW - 1; x++) {
      const idx = y * heatW + x;
      const lap = heatGrid[idx - 1] + heatGrid[idx + 1] + heatGrid[idx - heatW] + heatGrid[idx + heatW] - 4 * heatGrid[idx];
      nextGrid[idx] = heatGrid[idx] + alpha * lap;
    }
  }
  heatGrid = nextGrid;

  // Pulsar periódicamente un nuevo foco térmico
  if (Math.sin(heatT) > 0.98) {
    heatGrid[(heatH/2|0) * heatW + (heatW/2|0)] = 15.0;
  }

  for (let y = 0; y < heatH; y++) {
    for (let x = 0; x < heatW; x++) {
      const val = Math.min(1.0, heatGrid[y * heatW + x] * 0.5);
      if (val > 0.02) {
        ctx.fillStyle = pal(val);
        ctx.fillRect(cx - (heatW * sc * 0.5) + x * sc, cy - (heatH * sc * 0.5) + y * sc, sc, sc);
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∂u/∂t = α ∇²u  (Conducción & Disipación Gaussiana)', cx, H * 0.94);
}

// ── 32 [033]: El Teorema de Carnot (η_max = 1 - T_C / T_H) ─────────
let carnotT = 0;
function init_32() { carnotT = 0; }
function step_32() {
  trailFade(0.06);
  carnotT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.28;

  // Diagrama T-S (Temperatura - Entropía)
  const TH = cy - sc * 0.5, TC = cy + sc * 0.5;
  const S1 = cx - sc * 0.6, S2 = cx + sc * 0.6;

  // Ciclo rectangular cerrado en el espacio T-S
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 3;
  ctx.strokeRect(S1, TH, S2 - S1, TC - TH);

  // Flechas del ciclo horario
  ctx.fillStyle = '#ef4444'; ctx.font = '11px Space Mono';
  ctx.fillText('Q_H (Entrada a T_H)', cx, TH - 12);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Q_C (Descarga a T_C)', cx, TC + 22);

  // Punto operativo recorriendo el ciclo de Carnot
  const per = carnotT % 4;
  let opX = S1, opY = TH;
  if (per < 1) { opX = S1 + per * (S2 - S1); opY = TH; }
  else if (per < 2) { opX = S2; opY = TH + (per - 1) * (TC - TH); }
  else if (per < 3) { opX = S2 - (per - 2) * (S2 - S1); opY = TC; }
  else { opX = S1; opY = TC - (per - 3) * (TC - TH); }

  ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.arc(opX, opY, 7, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('η_Carnot = 1 - T_C / T_H = W_net / Q_H', cx, H * 0.94);
}

// ── 33 [034]: La Ley de Conducción de Ohm (V = I · R, J = σ E) ─────
let ohmElectrons = [], ohmT = 0;
function init_33() {
  ohmT = 0; ohmElectrons = [];
  for (let i = 0; i < 220; i++) {
    ohmElectrons.push({
      x: Math.random() * W * 0.7 + W * 0.15,
      y: Math.random() * H * 0.35 + H * 0.32,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5
    });
  }
}
function step_33() {
  trailFade(0.08);
  ohmT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const wireW = W * 0.7, wireH = H * 0.35;

  // Conductor metálico
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
  ctx.strokeRect(cx - wireW * 0.5, cy - wireH * 0.5, wireW, wireH);

  // Red cristalina de átomos fijos (dispersores)
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 9; col++) {
      const ax = cx - wireW * 0.45 + col * (wireW * 0.11);
      const ay = cy - wireH * 0.4 + row * (wireH * 0.2);
      ctx.beginPath(); ctx.arc(ax, ay, 4, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Campo eléctrico constante E empujando electrones a la derecha
  const E_field = 0.8;
  ctx.fillStyle = '#38bdf8';
  for (const e of ohmElectrons) {
    e.vx += E_field * 0.1; // Aceleración eléctrica
    e.x += e.vx; e.y += e.vy;

    // Dispersión estocástica Drude con la red
    if (Math.random() < 0.05) {
      e.vx = (Math.random() - 0.5) * 2.0;
      e.vy = (Math.random() - 0.5) * 2.0;
    }

    if (e.x > cx + wireW * 0.5) e.x = cx - wireW * 0.5;
    if (e.y < cy - wireH * 0.5) e.y = cy + wireH * 0.5;
    if (e.y > cy + wireH * 0.5) e.y = cy - wireH * 0.5;

    ctx.fillRect(e.x - 1.5, e.y - 1.5, 3, 3);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('J = σ · E   |   v_drift = e·E·τ / m', cx, H * 0.94);
}

// ── 34 [035]: Ley de Inducción de Faraday (ℰ = -dΦ_B / dt) ─────────
let faradT = 0;
function init_34() { faradT = 0; }
function step_34() {
  trailFade(0.06);
  faradT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const magnetX = cx + Math.sin(faradT) * (W * 0.25);

  // Bobina conductora fija en el centro
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 4;
  for (let loop = -2; loop <= 2; loop++) {
    ctx.beginPath();
    ctx.ellipse(cx + loop * 12, cy, 18, H * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Imán oscilante (Norte rojo, Sur azul)
  ctx.fillStyle = '#ef4444'; ctx.fillRect(magnetX - 45, cy - 18, 45, 36);
  ctx.fillStyle = '#38bdf8'; ctx.fillRect(magnetX, cy - 18, 45, 36);

  // Líneas de campo magnético que cortan la bobina
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)'; ctx.lineWidth = 1.2;
  for (let a = -0.6; a <= 0.6; a += 0.3) {
    ctx.beginPath();
    ctx.ellipse(magnetX, cy, 75, 45 + Math.abs(a) * 40, a, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Corriente inducida en la bobina proporcional a dFlux/dt
  const emf = -Math.cos(faradT) * 1.5;
  ctx.strokeStyle = pal(Math.abs(emf)); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy + H * 0.25, Math.abs(emf) * 20, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ℰ = -dΦ_B / dt  (Fuerza Electromotriz Inducida)', cx, H * 0.94);
}

// ── 35 [036]: El Solitón Hidrodinámico de Russell (KdV) ───────────
let kdvT = 0;
function init_35() { kdvT = 0; }
function step_35() {
  trailFade(0.06);
  kdvT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const L = W * 0.8;

  // Dos solitones de KdV colisionando elásticamente sin deformación
  // u(x,t) = 2*k1^2 * sech^2(k1*(x - 4*k1^2*t)) + 2*k2^2 * sech^2(...)
  const k1 = 0.7, k2 = 0.4;
  const c1 = 4 * k1 * k1, c2 = 4 * k2 * k2;
  const x1 = ((kdvT * c1 * 25) % (L * 1.4)) - L * 0.2;
  const x2 = ((kdvT * c2 * 25 + L * 0.4) % (L * 1.4)) - L * 0.2;

  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 3.2;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 4) {
    const x = px;
    const s1 = 1.0 / Math.cosh(k1 * 0.05 * (x - x1));
    const s2 = 1.0 / Math.cosh(k2 * 0.05 * (x - x2));
    const u = (2 * k1 * k1 * s1 * s1 + 2 * k2 * k2 * s2 * s2) * (H * 0.22);

    const scrX = W * 0.1 + px, scrY = cy + H * 0.15 - u;
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∂u/∂t + 6u ∂u/∂x + ∂³u/∂x³ = 0  (Solitón No Lineal)', cx, H * 0.94);
}

// ── 36 [037]: Mecánica Canónica de Hamilton (Espacio Simpléctico) ──
let hamPts = [], hamT = 0;
function init_36() {
  hamT = 0; hamPts = [];
  for (let i = 0; i < 16; i++) {
    hamPts.push({ q: -1.2 + i * 0.16, p: 0.1, trail: [] });
  }
}
function step_36() {
  trailFade(0.05);
  hamT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const scQ = W * 0.22, scP = H * 0.22;

  // Ejes (q, p)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx - scQ * 1.8, cy); ctx.lineTo(cx + scQ * 1.8, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - scP * 1.5); ctx.lineTo(cx, cy + scP * 1.5); ctx.stroke();

  // Hamiltoniano de Doble Pozo: H = ½ p² - ½ q² + ¼ q⁴
  const dt = 0.02;
  hamPts.forEach((pt, idx) => {
    // q̇ = ∂H/∂p = p,  ṗ = -∂H/∂q = q - q³
    const dq = pt.p;
    const dp = pt.q - Math.pow(pt.q, 3);
    pt.q += dq * dt;
    pt.p += dp * dt;

    pt.trail.push([cx + pt.q * scQ, cy - pt.p * scP]);
    if (pt.trail.length > 250) pt.trail.shift();

    ctx.strokeStyle = pal(idx / hamPts.length); ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let j = 0; j < pt.trail.length; j++) {
      if (j === 0) ctx.moveTo(pt.trail[j][0], pt.trail[j][1]);
      else ctx.lineTo(pt.trail[j][0], pt.trail[j][1]);
    }
    ctx.stroke();
  });

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('q̇ = ∂H/∂p   |   ṗ = -∂H/∂q  (Invariante Simpléctico)', cx, H * 0.94);
}

// ── 37 [038]: Álgebra de Cuaterniones de Hamilton (i²=j²=k²=ijk=-1) ─
let quatAngle = 0;
function init_37() { quatAngle = 0; }
function step_37() {
  trailFade(0.06);
  quatAngle += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.28;

  // Hipercubo 4D (Teseracto) rotado por cuaternión q = cos(a) + (i+j+k)/sqrt(3)*sin(a)
  const a = quatAngle;
  const qx = Math.sin(a) * 0.577, qy = Math.sin(a) * 0.577, qz = Math.sin(a) * 0.577, qw = Math.cos(a);

  const tesseractVerts = [];
  for (let i = 0; i < 16; i++) {
    const x = (i & 1 ? 1 : -1) * 0.6;
    const y = (i & 2 ? 1 : -1) * 0.6;
    const z = (i & 4 ? 1 : -1) * 0.6;
    const w = (i & 8 ? 1 : -1) * 0.6;
    // Rotación 4D
    const rz = z * Math.cos(a) - w * Math.sin(a);
    const rw = z * Math.sin(a) + w * Math.cos(a);
    const projW = 2.0 / (2.8 - rw);
    tesseractVerts.push([cx + x * sc * projW, cy + y * sc * projW]);
  }

  // Conectar vértices del teseracto
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 1.2;
  for (let i = 0; i < 16; i++) {
    for (let bit = 1; bit <= 8; bit <<= 1) {
      if ((i & bit) === 0) {
        const j = i | bit;
        ctx.beginPath();
        ctx.moveTo(tesseractVerts[i][0], tesseractVerts[i][1]);
        ctx.lineTo(tesseractVerts[j][0], tesseractVerts[j][1]);
        ctx.stroke();
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('i² = j² = k² = ijk = -1  (Rotación Isoclínica en S³)', cx, H * 0.94);
}

// ── 38 [039]: El Efecto Doppler (f = f₀ (v ± v_r) / (v ∓ v_s)) ─────
let dopplerRings = [], dopplerT = 0;
function init_38() { dopplerRings = []; dopplerT = 0; }
function step_38() {
  trailFade(0.06);
  dopplerT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cy = H * 0.5;
  const sourceV = 2.2; // Velocidad subsónica hacia la derecha
  const sourceX = (W * 0.15) + ((dopplerT * 60) % (W * 0.7));

  // Emitir nuevo frente de onda periódicamente
  if (Math.floor(dopplerT * 10) !== Math.floor((dopplerT - 0.025) * 10)) {
    dopplerRings.push({ x: sourceX, y: cy, r: 2 });
  }

  // Ondas expandiéndose a velocidad de onda c_wave = 3.5
  ctx.lineWidth = 1.5;
  for (let i = dopplerRings.length - 1; i >= 0; i--) {
    const ring = dopplerRings[i];
    ring.r += 3.2;
    const f = Math.max(0, 1.0 - ring.r / (W * 0.6));
    ctx.strokeStyle = pal(f);
    ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2); ctx.stroke();
    if (ring.r > W * 0.6) dopplerRings.splice(i, 1);
  }

  // Fuente en movimiento
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.arc(sourceX, cy, 7, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('f_observada = f₀ / (1 - v_fuente / c)  (Compresión Frontal)', W * 0.5, H * 0.94);
}

// ── 39 [040]: Vórtices de Navier-Stokes (Dipolo de Lamb-Oseen) ──────
let nsParts = [], nsT = 0;
function init_39() {
  nsT = 0; nsParts = [];
  for (let i = 0; i < 1400; i++) {
    const rad = Math.sqrt(Math.random()) * Math.min(W, H) * 0.38;
    const th = Math.random() * Math.PI * 2;
    nsParts.push({ x: W*0.5 + rad*Math.cos(th), y: H*0.5 + rad*Math.sin(th), life: Math.random() * 200 });
  }
}
function step_39() {
  trailFade(0.045);
  nsT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const dSep = Math.min(W, H) * 0.12;

  // Vórtices dipolares contrarrotatorios de Lamb-Oseen
  const v1x = cx - dSep, v1y = cy;
  const v2x = cx + dSep, v2y = cy;
  const gamma = 1200.0, rc = 25.0; // Radio del núcleo viscoso regularizado

  ctx.fillStyle = pal(0.85);
  for (const p of nsParts) {
    p.life++;
    // Biot-Savart de Vórtice 1 (+gamma)
    const dx1 = p.x - v1x, dy1 = p.y - v1y, r1sq = dx1*dx1 + dy1*dy1 + rc*rc;
    const u1 = -gamma * dy1 / r1sq, v1 = gamma * dx1 / r1sq;

    // Biot-Savart de Vórtice 2 (-gamma)
    const dx2 = p.x - v2x, dy2 = p.y - v2y, r2sq = dx2*dx2 + dy2*dy2 + rc*rc;
    const u2 = gamma * dy2 / r2sq, v2 = -gamma * dx2 / r2sq;

    p.x += (u1 + u2) * 0.08;
    p.y += (v1 + v2) * 0.08;

    if (p.life > 200 || Math.hypot(p.x - cx, p.y - cy) > Math.min(W, H) * 0.45) {
      const r = Math.sqrt(Math.random()) * Math.min(W, H) * 0.35;
      const th = Math.random() * Math.PI * 2;
      p.x = cx + r * Math.cos(th); p.y = cy + r * Math.sin(th); p.life = 0;
    }

    const sp = Math.hypot(u1 + u2, v1 + v2);
    ctx.fillStyle = pal(Math.min(1.0, sp * 0.08));
    ctx.fillRect(p.x, p.y, 1.8, 1.8);
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u  (Dipolo de Lamb-Oseen)', cx, H * 0.94);
}

  function setChladniModes(m, n) {
    chM = Math.max(1, Math.min(8, m));
    chN = Math.max(1, Math.min(8, n));
  }
  function getChladniModes() {
    return { m: chM, n: chN };
  }
  function handlePointer(type, x, y, dx, dy, artIdx, meta) {
    if (artIdx === 26 && type === 'move') {
      chM = Math.max(1, Math.min(8, Math.floor((x / W) * 8) + 1));
      chN = Math.max(1, Math.min(8, Math.floor((y / H) * 8) + 1));
    }
  }

  const inits = [
    init_20,
    init_21,
    init_22,
    init_23,
    init_24,
    init_25,
    init_26,
    init_27,
    init_28,
    init_29,
    init_30,
    init_31,
    init_32,
    init_33,
    init_34,
    init_35,
    init_36,
    init_37,
    init_38,
    init_39
  ];

  const steps = [
    step_20,
    step_21,
    step_22,
    step_23,
    step_24,
    step_25,
    step_26,
    step_27,
    step_28,
    step_29,
    step_30,
    step_31,
    step_32,
    step_33,
    step_34,
    step_35,
    step_36,
    step_37,
    step_38,
    step_39
  ];

  const initsMap = {};
  const stepsMap = {};
  for (let i = 0; i < 20; i++) {
    const globalId = 20 + i;
    initsMap[globalId] = inits[i];
    stepsMap[globalId] = steps[i];
  }

  const epochModule = {
    epoch: 2,
    name: "La Ilustración, Ondas & Análisis Clásico",
    range: [20, 39],
    inits,
    steps,
    initsMap,
    stepsMap,
    updateViewport,
    updatePointer,
    handlePointer,
    setChladniModes,
    getChladniModes
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { epochModule, inits, steps, initsMap, stepsMap, updateViewport, updatePointer };
  }
  if (typeof root !== 'undefined') {
    root.AtelierEpoch2 = epochModule;
    if (root.AtelierMathCore && typeof root.AtelierMathCore.registerEpoch === 'function') {
      root.AtelierMathCore.registerEpoch(epochModule);
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
