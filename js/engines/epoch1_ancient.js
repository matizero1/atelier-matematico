// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — ÉPOCA 1: ANTIGÜEDAD & FUNDAMENTOS CLÁSICOS
// Obras 000 a 019 · Simulación en Silicio Nativo 60 FPS
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

// ÉPOCA I: ANTIGÜEDAD & FUNDAMENTOS CLÁSICOS (OBRAS 000 A 019)
// ═══════════════════════════════════════════════════════════════════

// ── 00 [001]: Teorema de Pitágoras (a² + b² = c²) ────────────────
let pythT = 0, pythParticles = [];
function init_00() {
  pythT = 0; pythParticles = [];
  for (let i = 0; i < 400; i++) {
    pythParticles.push({
      u: Math.random(), v: Math.random(),
      source: Math.random() < 0.36 ? 'a' : 'b', // 3^2 / (3^2+4^2) = 9/25 = 0.36
      prog: Math.random(), speed: 0.003 + Math.random() * 0.004
    });
  }
}
function step_00() {
  trailFade(0.08);
  pythT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.52;
  const sc = Math.min(W, H) * 0.32;
  
  const angle = 0.6435; // 3-4-5 triangle: atan(3/4) ≈ 0.6435
  const hyp = sc;
  const a = hyp * Math.sin(angle); // Cateto vertical = 3
  const b = hyp * Math.cos(angle); // Cateto horizontal = 4

  // Vértices del triángulo rectángulo (C en ángulo recto)
  const Ax = cx - b * 0.5, Ay = cy + a * 0.5;
  const Bx = cx + b * 0.5, By = cy + a * 0.5;
  const Cx = Ax, Cy = cy - a * 0.5;

  // Dibujar Triángulo
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.0;
  ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.lineTo(Cx, Cy); ctx.closePath();
  ctx.stroke();

  // Cuadrado sobre a (cateto vertical Cx-Ax)
  ctx.strokeStyle = pal(0.35); ctx.lineWidth = 1.5;
  ctx.strokeRect(Cx - a, Cy, a, a);

  // Cuadrado sobre b (cateto horizontal Ax-Bx)
  ctx.strokeStyle = pal(0.65);
  ctx.strokeRect(Ax, Ay, b, b);

  // Cuadrado sobre la hipotenusa (Bx-Cx)
  const hx = Bx - Cx, hy = By - Cy;
  const nx = -hy / hyp * hyp, ny = hx / hyp * hyp;
  ctx.strokeStyle = pal(0.95);
  ctx.beginPath();
  ctx.moveTo(Cx, Cy); ctx.lineTo(Bx, By);
  ctx.lineTo(Bx + nx, By + ny); ctx.lineTo(Cx + nx, Cy + ny);
  ctx.closePath(); ctx.stroke();

  // Flujo continuo de partículas demostrando la conservación del área
  ctx.fillStyle = pal(0.85);
  for (const p of pythParticles) {
    p.prog += p.speed;
    if (p.prog > 1.0) p.prog = 0;
    let sx, sy, tx, ty;
    if (p.source === 'a') {
      sx = (Cx - a) + p.u * a; sy = Cy + p.v * a;
    } else {
      sx = Ax + p.u * b; sy = Ay + p.v * b;
    }
    // Destino en el cuadrado de la hipotenusa
    tx = Cx + p.u * hx + p.v * nx;
    ty = Cy + p.u * hy + p.v * ny;

    const curX = sx + (tx - sx) * p.prog;
    const curY = sy + (ty - sy) * p.prog;
    ctx.fillRect(curX - 1.2, curY - 1.2, 2.4, 2.4);
  }

  // Anotaciones numéricas
  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('a² + b² = c²', cx, cy - sc * 0.85);
}

// ── 01 [002]: Ley de la Palanca (F₁ · d₁ = F₂ · d₂) ───────────────
let levAngle = 0, levVel = 0, levT = 0;
function init_01() { levAngle = 0; levVel = 0; levT = 0; }
function step_01() {
  trailFade(0.08);
  levT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.54;
  const L = Math.min(W, H) * 0.42;

  // Masas y distancias variables oscilantes
  const d1 = L * (0.6 + 0.25 * Math.sin(levT * 0.8));
  const d2 = L * (0.8 + 0.15 * Math.cos(levT * 0.6));
  const m1 = 2.4;
  const m2 = (m1 * d1) / d2 + 0.3 * Math.sin(levT * 1.5); // perturbación oscilatoria

  // Dinámica rotacional de la viga
  const torque = (m1 * d1 - m2 * d2) * 0.0005;
  levVel += torque - levVel * 0.04;
  levAngle += levVel;
  levAngle = Math.max(-0.35, Math.min(0.35, levAngle));

  // Fulcro triangular
  ctx.fillStyle = '#dfc285';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 18, cy + 32); ctx.lineTo(cx + 18, cy + 32); ctx.closePath();
  ctx.fill();

  // Viga de la palanca
  const cosA = Math.cos(levAngle), sinA = Math.sin(levAngle);
  const xLeft = cx - L * cosA, yLeft = cy - L * sinA;
  const xRight = cx + L * cosA, yRight = cy + L * sinA;

  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(xLeft, yLeft); ctx.lineTo(xRight, yRight); ctx.stroke();

  // Masas suspendidas
  const m1x = cx - d1 * cosA, m1y = cy - d1 * sinA;
  const m2x = cx + d2 * cosA, m2y = cy + d2 * sinA;

  // Cuerdas y pesos
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(m1x, m1y); ctx.lineTo(m1x, m1y + 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(m2x, m2y); ctx.lineTo(m2x, m2y + 40); ctx.stroke();

  const r1 = Math.sqrt(m1) * 14, r2 = Math.sqrt(m2) * 14;
  ctx.fillStyle = pal(0.3); ctx.beginPath(); ctx.arc(m1x, m1y + 40 + r1, r1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = pal(0.8); ctx.beginPath(); ctx.arc(m2x, m2y + 40 + r2, r2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Vectores de fuerza hacia abajo
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(m1x, m1y + 40 + r1 * 2); ctx.lineTo(m1x, m1y + 40 + r1 * 2 + m1 * 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(m2x, m2y + 40 + r2 * 2); ctx.lineTo(m2x, m2y + 40 + r2 * 2 + m2 * 12); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`F₁·d₁ = ${(m1*d1).toFixed(0)}  |  F₂·d₂ = ${(m2*d2).toFixed(0)}`, cx, cy - L * 0.4);
}

// ── 02 [003]: El Principio de Flotación (E = ρ · g · V) ───────────
let floatY = 0, floatVy = 0, floatT = 0, floatWaves = [];
function init_02() {
  floatY = 0; floatVy = 0; floatT = 0; floatWaves = [];
  for (let x = 0; x < 80; x++) floatWaves.push(0);
}
function step_02() {
  trailFade(0.08);
  floatT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const waterLevel = cy + 20;

  // Ecuación de Arquímedes y oscilación vertical del cuerpo sumergido
  const blockW = W * 0.28, blockH = H * 0.18;
  const mass = 1.0, rho = 1.2, g = 9.8;
  const submerged = Math.max(0, Math.min(blockH, (floatY + blockH * 0.5) - 0));
  const buoyantForce = rho * g * submerged * (blockW / 100);
  const gravityForce = mass * g * 12;
  const netForce = buoyantForce - gravityForce - floatVy * 1.5;

  floatVy += netForce * 0.02;
  floatY -= floatVy;

  // Olas superficiales
  const waveAmp = 6 * Math.sin(floatT * 2);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, waterLevel);
  for (let i = 0; i <= W; i += 20) {
    const wy = waterLevel + Math.sin(i * 0.02 + floatT * 3) * 4 + (Math.abs(i - cx) < blockW ? waveAmp * 0.5 : 0);
    ctx.lineTo(i, wy);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // Líneas isobáricas de presión hidrostática P = rho * g * h
  ctx.lineWidth = 1;
  for (let d = 40; d < H - waterLevel; d += 35) {
    const depthY = waterLevel + d;
    ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.5, d / 400)})`;
    ctx.beginPath(); ctx.moveTo(W * 0.1, depthY); ctx.lineTo(W * 0.9, depthY); ctx.stroke();
  }

  // Sólido flotante
  const bx = cx - blockW * 0.5, by = waterLevel + floatY - blockH * 0.5;
  ctx.fillStyle = pal(0.5); ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2;
  ctx.fillRect(bx, by, blockW, blockH);
  ctx.strokeRect(bx, by, blockW, blockH);

  // Vector de empuje de Arquímedes (hacia arriba)
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, by + blockH * 0.5); ctx.lineTo(cx, by + blockH * 0.5 - buoyantForce * 2.5); ctx.stroke();

  // Vector de peso gravitatorio (hacia abajo)
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, by + blockH * 0.5); ctx.lineTo(cx, by + blockH * 0.5 + gravityForce * 2.5); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('E = ρ · g · V_sub', cx, cy - blockH * 1.2);
}

// ── 03 [004]: La Espiral Áurea de Fibonacci (F_n = F_{n-1} + F_{n-2}) ──
let fibT = 0;
function init_03() { fibT = 0; }
function step_03() {
  trailFade(0.06);
  fibT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const phi = 1.6180339887;
  const sc = Math.min(W, H) * 0.0055 * (1 + 0.1 * Math.sin(fibT * 0.5));

  // Filotaxis áurea de Vogel: r = c * sqrt(n), theta = n * 137.5077°
  const count = 420;
  ctx.lineWidth = 1.5;
  for (let n = 1; n <= count; n++) {
    const theta = n * 2.399963229728653; // 137.507764° en radianes
    const r = Math.sqrt(n) * (sc * 18);
    const px = cx + r * Math.cos(theta + fibT * 0.2);
    const py = cy + r * Math.sin(theta + fibT * 0.2);
    const frac = n / count;
    ctx.fillStyle = pal(frac);
    ctx.beginPath(); ctx.arc(px, py, 1.2 + frac * 2.2, 0, Math.PI * 2); ctx.fill();
  }

  // Espiral logarítmica áurea continua r = a * e^(k * theta)
  ctx.strokeStyle = '#c5a059'; ctx.lineWidth = 2.2;
  ctx.beginPath();
  let started = false;
  for (let th = 0; th < Math.PI * 9; th += 0.05) {
    const k = Math.log(phi) / (Math.PI * 0.5);
    const rad = 2.0 * Math.exp(k * th) * (sc * 0.25);
    if (rad > Math.min(W, H) * 0.48) break;
    const sx = cx + rad * Math.cos(th - fibT * 0.5);
    const sy = cy + rad * Math.sin(th - fibT * 0.5);
    if (!started) { ctx.moveTo(sx, sy); started = true; }
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Φ = 1.6180339...  (F_{n} / F_{n-1})', cx, H * 0.92);
}

// ── 04 [005]: La Ley de Caída Libre (s = ½ g t²) ──────────────────
let freeFallT = 0, freeFallRipples = [];
function init_04() { freeFallT = 0; freeFallRipples = []; }
function step_04() {
  trailFade(0.08);
  freeFallT += 0.015;
  if (freeFallT > 2.0) freeFallT = 0;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.18;
  const totalH = H * 0.65;
  const g = totalH / 2.0; // tal que en t=2, s = 1/2 * g * 4 = totalH

  // Eje vertical con marcas cuadráticas de distancia 1, 4, 9, 16
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + totalH); ctx.stroke();

  const times = [0.5, 1.0, 1.5, 2.0];
  ctx.font = '10px Space Mono, monospace'; ctx.textAlign = 'right';
  times.forEach((tMark, idx) => {
    const dist = 0.5 * g * tMark * tMark;
    const yMark = cy + dist;
    ctx.strokeStyle = pal(0.3 + idx * 0.2);
    ctx.beginPath(); ctx.moveTo(cx - 30, yMark); ctx.lineTo(cx + 30, yMark); ctx.stroke();
    ctx.fillStyle = '#a1a1aa';
    ctx.fillText(`t=${tMark.toFixed(1)}s (s=${(idx+1)*(idx+1)}d₀)`, cx - 40, yMark + 3);
  });

  // Esfera cayendo acelerada
  const curS = 0.5 * g * freeFallT * freeFallT;
  const curV = g * freeFallT;
  const ballY = cy + curS;

  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.arc(cx, ballY, 8, 0, Math.PI * 2); ctx.fill();

  // Vector velocidad proporcional al tiempo v = gt
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx, ballY); ctx.lineTo(cx, ballY + curV * 0.15); ctx.stroke();

  // Onda acústica al impactar
  if (freeFallT > 1.95) {
    ctx.strokeStyle = pal(0.9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy + totalH, (freeFallT - 1.95) * 600, 0, Math.PI * 2); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`s = ½ g t²   |   v = ${(curV * 0.1).toFixed(1)} m/s`, cx, H * 0.94);
}

// ── 05 [006]: Primera Ley de Kepler (r = p / (1 + e cos θ)) ────────
let kep1Theta = 0;
function init_05() { kep1Theta = 0; }
function step_05() {
  trailFade(0.06);
  const e = 0.65; // Excentricidad notable para visualización didáctica
  const rNow = 1.0 / (1.0 + e * Math.cos(kep1Theta));
  const dTheta = 0.03 * (rNow * rNow); // Velocidad angular variable por momento angular
  kep1Theta += dTheta;

  const pal = PALS_CSS[currentPal];
  const cx = W * 0.52, cy = H * 0.5;
  const a = Math.min(W, H) * 0.36;
  const b = a * Math.sqrt(1 - e * e);
  const cFoc = a * e;

  // Elipse kepleriana canónica
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke();

  // Foco 1: El Sol
  const sunX = cx - cFoc, sunY = cy;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(sunX, sunY, 10, 0, Math.PI * 2); ctx.fill();

  // Foco 2: Vacío matemático
  const foc2X = cx + cFoc, foc2Y = cy;
  ctx.strokeStyle = 'rgba(197,160,89,0.5)';
  ctx.beginPath(); ctx.arc(foc2X, foc2Y, 4, 0, Math.PI * 2); ctx.stroke();

  // Planeta en órbita
  const planX = cx + a * Math.cos(kep1Theta - Math.PI);
  const planY = cy + b * Math.sin(kep1Theta - Math.PI);

  // Líneas a ambos focos: r1 + r2 = 2a
  ctx.strokeStyle = pal(0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(sunX, sunY); ctx.lineTo(planX, planY); ctx.stroke();
  ctx.strokeStyle = pal(0.8);
  ctx.beginPath(); ctx.moveTo(foc2X, foc2Y); ctx.lineTo(planX, planY); ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(planX, planY, 7, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`r₁ + r₂ = 2a = cte  (e = ${e})`, cx, H * 0.92);
}

// ── 06 [007]: Segunda Ley de Kepler (dA/dt = cte) ──────────────────
let kep2Theta = 0, kep2Sectors = [];
function init_06() { kep2Theta = 0; kep2Sectors = []; }
function step_06() {
  trailFade(0.05);
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.52, cy = H * 0.5;
  const e = 0.60;
  const a = Math.min(W, H) * 0.35, b = a * Math.sqrt(1 - e * e), cFoc = a * e;
  const sunX = cx - cFoc, sunY = cy;

  // Órbita
  const rNow = (a * (1 - e * e)) / (1 + e * Math.cos(kep2Theta));
  const dTheta = 0.025 / (rNow / a);
  const prevTheta = kep2Theta;
  kep2Theta += dTheta;

  const p1x = cx + a * Math.cos(prevTheta - Math.PI), p1y = cy + b * Math.sin(prevTheta - Math.PI);
  const p2x = cx + a * Math.cos(kep2Theta - Math.PI), p2y = cy + b * Math.sin(kep2Theta - Math.PI);

  // Guardar sectores de área igual
  if (Math.floor(kep2Theta / 0.7) !== Math.floor(prevTheta / 0.7)) {
    kep2Sectors.push({ thStart: prevTheta, thEnd: kep2Theta, p1x, p1y, p2x, p2y });
    if (kep2Sectors.length > 8) kep2Sectors.shift();
  }

  // Dibujar sectores coloreados de áreas iguales
  kep2Sectors.forEach((sec, idx) => {
    ctx.fillStyle = pal(0.2 + idx * 0.1);
    ctx.beginPath(); ctx.moveTo(sunX, sunY); ctx.lineTo(sec.p1x, sec.p1y); ctx.lineTo(sec.p2x, sec.p2y); ctx.closePath();
    ctx.fill();
  });

  // Sol y Planeta
  ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(sunX, sunY, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.arc(p2x, p2y, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Áreas iguales en tiempos iguales: dA/dt = ½ r² θ̇ = cte', cx, H * 0.92);
}

// ── 07 [008]: Tercera Ley de Kepler (T² = k · a³) ──────────────────
let kep3T = 0;
function init_07() { kep3T = 0; }
function step_07() {
  trailFade(0.04);
  kep3T += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sunRadius = 9;

  ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2); ctx.fill();

  // 4 planetas con a = [1, 1.8, 2.7, 3.8], velocidades angulares w = 1 / sqrt(a^3)
  const planets = [
    { a: Math.min(W, H) * 0.12, w: 1.8 },
    { a: Math.min(W, H) * 0.20, w: 1.8 / Math.pow(0.20/0.12, 1.5) },
    { a: Math.min(W, H) * 0.29, w: 1.8 / Math.pow(0.29/0.12, 1.5) },
    { a: Math.min(W, H) * 0.40, w: 1.8 / Math.pow(0.40/0.12, 1.5) },
  ];

  planets.forEach((p, idx) => {
    // Órbita
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, p.a, 0, Math.PI * 2); ctx.stroke();

    const ang = kep3T * p.w;
    const px = cx + p.a * Math.cos(ang), py = cy + p.a * Math.sin(ang);

    ctx.fillStyle = pal(0.2 + idx * 0.25);
    ctx.beginPath(); ctx.arc(px, py, 4 + idx, 0, Math.PI * 2); ctx.fill();
  });

  // Línea armónica entre Planeta 1 y Planeta 2 (Roseta de Venus/Tierra)
  const a1 = kep3T * planets[0].w, a2 = kep3T * planets[1].w;
  const p1x = cx + planets[0].a * Math.cos(a1), p1y = cy + planets[0].a * Math.sin(a1);
  const p2x = cx + planets[1].a * Math.cos(a2), p2y = cy + planets[1].a * Math.sin(a2);
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('T² / a³ = 4π² / (GM) = constante armónica', cx, H * 0.94);
}

// ── 08 [009]: Ley de Refracción de Snell (n₁ sin θ₁ = n₂ sin θ₂) ───
let snellT = 0;
function init_08() { snellT = 0; }
function step_08() {
  trailFade(0.08);
  snellT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  const n1 = 1.0; // Aire
  const n2 = 1.52; // Vidrio Crown
  const theta1 = 0.2 + 0.5 * (Math.sin(snellT) * 0.5 + 0.5); // ángulo variable incidente
  const sinTh2 = (n1 / n2) * Math.sin(theta1);
  const theta2 = Math.asin(sinTh2);

  // Línea divisoria de medios
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W * 0.1, cy); ctx.lineTo(W * 0.9, cy); ctx.stroke();

  // Medio 2 sombreado
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.fillRect(W * 0.1, cy, W * 0.8, H * 0.4);

  // Normal a la superficie
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(cx, cy - H * 0.35); ctx.lineTo(cx, cy + H * 0.35); ctx.stroke();
  ctx.setLineDash([]);

  // Rayo Incidente
  const L = Math.min(W, H) * 0.35;
  const incX = cx - L * Math.sin(theta1), incY = cy - L * Math.cos(theta1);
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(incX, incY); ctx.lineTo(cx, cy); ctx.stroke();

  // Rayo Reflejado (mismo ángulo theta1)
  const refX = cx + L * Math.sin(theta1), refY = cy - L * Math.cos(theta1);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(refX, refY); ctx.stroke();

  // Rayo Refractado (ángulo theta2)
  const refrX = cx + L * Math.sin(theta2), refrY = cy + L * Math.cos(theta2);
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(refrX, refrY); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`n₁·sin(${(theta1*180/Math.PI).toFixed(1)}°) = n₂·sin(${(theta2*180/Math.PI).toFixed(1)}°)`, cx, H * 0.94);
}

// ── 09 [010]: Geometría Analítica Cartesiana (f(x, y) = 0) ─────────
let cartT = 0;
function init_09() { cartT = 0; }
function step_09() {
  trailFade(0.06);
  cartT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.22;

  // Ejes cartesianos ortogonales
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W * 0.1, cy); ctx.lineTo(W * 0.9, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, H * 0.1); ctx.lineTo(cx, H * 0.9); ctx.stroke();

  // Folium de Descartes: x³ + y³ - 3axy = 0  con a variable
  const aParam = 1.2 + 0.3 * Math.sin(cartT);
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.2;
  ctx.beginPath();
  let started = false;
  for (let t = -3.0; t <= 3.0; t += 0.02) {
    if (Math.abs(t + 1) < 0.05) continue; // Asíntota en t = -1
    const denom = 1 + t * t * t;
    const x = (3 * aParam * t) / denom;
    const y = (3 * aParam * t * t) / denom;
    const scrX = cx + x * sc, scrY = cy - y * sc;
    if (scrX < 0 || scrX > W || scrY < 0 || scrY > H) { started = false; continue; }
    if (!started) { ctx.moveTo(scrX, scrY); started = true; }
    else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Folium de Descartes: x³ + y³ - 3axy = 0', cx, H * 0.94);
}

// ── 10 [011]: El Último Teorema de Fermat (aⁿ + bⁿ ≠ cⁿ) ───────────
let fermatT = 0;
function init_10() { fermatT = 0; }
function step_10() {
  trailFade(0.06);
  fermatT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.07;

  // Curva elíptica de Frey-Hellegouarch: y² = x(x - aⁿ)(x + bⁿ)
  const aP = -3.0 + Math.sin(fermatT * 0.8) * 1.5;
  const bP = 2.5;

  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2.0;
  for (const sign of [1, -1]) {
    ctx.beginPath();
    let started = false;
    for (let x = -4.0; x <= 6.0; x += 0.04) {
      const rhs = x * x * x + aP * x + bP;
      if (rhs >= 0) {
        const y = sign * Math.sqrt(rhs);
        const px = cx + x * sc, py = cy - y * sc;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      } else started = false;
    }
    ctx.stroke();
  }

  // Línea secante demostrando el grupo de suma de puntos elípticos P + Q + R = 0
  const p1x = 1.0, p1y = Math.sqrt(Math.max(0, 1 + aP + bP));
  const p2x = 3.0, p2y = Math.sqrt(Math.max(0, 27 + 3*aP + bP));
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx + (p1x - 2) * sc, cy - (p1y - 2*(p2y-p1y)/(p2x-p1x)) * sc);
  ctx.lineTo(cx + (p2x + 2) * sc, cy - (p2y + 2*(p2y-p1y)/(p2x-p1x)) * sc);
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Curva de Frey: y² = x³ + ax + b  ⟹  No Modulable si aⁿ+bⁿ=cⁿ', cx, H * 0.94);
}

// ── 11 [012]: Principio de Fermat de Tiempo Mínimo (δ ∫ n ds = 0) ──
let minTimeT = 0;
function init_11() { minTimeT = 0; }
function step_11() {
  trailFade(0.06);
  minTimeT += 0.02;
  const pal = PALS_CSS[currentPal];
  const startX = W * 0.2, startY = H * 0.25;
  const endX = W * 0.8, endY = H * 0.75;

  // Familia de curvas compitiendo variacionalmente
  const candidateCount = 9;
  for (let c = 0; c < candidateCount; c++) {
    const bend = -1.2 + (c / (candidateCount - 1)) * 2.4;
    const isOptimal = Math.abs(bend - 0.4) < 0.2;

    ctx.strokeStyle = isOptimal ? '#c5a059' : 'rgba(255,255,255,0.08)';
    ctx.lineWidth = isOptimal ? 2.5 : 1.0;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let u = 0; u <= 1.0; u += 0.02) {
      const px = startX + (endX - startX) * u;
      const py = startY + (endY - startY) * u + Math.sin(u * Math.PI) * (H * 0.25 * bend);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Puntos terminales
  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath(); ctx.arc(startX, startY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(endX, endY, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Camino de Tiempo Mínimo: δ ∫ (n/c) ds = 0', W * 0.5, H * 0.94);
}

// ── 12 [013]: Ley de Elasticidad de Hooke (F = -k · x) ────────────
let hookeNodes = [], hookeT = 0;
function init_12() {
  hookeNodes = []; hookeT = 0;
  for (let i = 0; i < 28; i++) {
    hookeNodes.push({ x: 0, y: 0, vx: 0, vy: 0 });
  }
}
function step_12() {
  trailFade(0.08);
  hookeT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const N = hookeNodes.length;
  const restLen = (W * 0.7) / (N - 1);

  // Dinámica de celosía 1D/2D
  for (let i = 0; i < N; i++) {
    const targetX = W * 0.15 + i * restLen;
    const mode = Math.sin(hookeT * 2 + (i / N) * Math.PI * 3);
    const targetY = cy + mode * (H * 0.12);
    hookeNodes[i].x += (targetX - hookeNodes[i].x) * 0.2;
    hookeNodes[i].y += (targetY - hookeNodes[i].y) * 0.2;
  }

  // Dibujar resortes interconectados
  for (let i = 0; i < N - 1; i++) {
    const p1 = hookeNodes[i], p2 = hookeNodes[i+1];
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const tension = Math.abs(dist - restLen) / restLen;
    ctx.strokeStyle = pal(Math.min(1.0, tension * 3));
    ctx.lineWidth = 2.0;
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('F = -k · x  (Tensor de Tensiones σ = E · ε)', cx, H * 0.94);
}

// ── 13 [014]: Primera Ley de Newton (Inercia) ─────────────────────
let inerciaAngle = 0;
function init_13() { inerciaAngle = 0; }
function step_13() {
  trailFade(0.06);
  inerciaAngle += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.38;

  // Marco inercial (línea recta fija)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();

  // Marco rotatorio no inercial: espirales ficticias de Coriolis y centrífuga
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let t = -R; t <= R; t += 4) {
    const rot = inerciaAngle * 2.0;
    const px = cx + t * Math.cos(rot);
    const py = cy + t * Math.sin(rot);
    if (!started) { ctx.moveTo(px, py); started = true; }
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∑ F = 0  ⟹  v = constante (Marco Inercial)', cx, H * 0.94);
}

// ── 14 [015]: Segunda Ley de Newton (F = m · a) ───────────────────
let duffX = 0.1, duffV = 0, duffPts = [];
function init_14() { duffX = 0.1; duffV = 0; duffPts = []; }
function step_14() {
  trailFade(0.05);
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const scX = W * 0.18, scV = H * 0.18;

  // Integración del oscilador no lineal de Duffing: x'' + d*x' + a*x + b*x^3 = g*cos(wt)
  for (let step = 0; step < 8; step++) {
    const dt = 0.01;
    const force = 0.35 * Math.cos(Date.now() * 0.001);
    const accel = -0.15 * duffV + duffX - Math.pow(duffX, 3) + force;
    duffV += accel * dt;
    duffX += duffV * dt;
    duffPts.push([cx + duffX * scX, cy - duffV * scV]);
    if (duffPts.length > 600) duffPts.shift();
  }

  // Espacio de fase (x, x')
  const n = duffPts.length;
  for (let j = 1; j < n; j++) {
    const f = j / n;
    ctx.strokeStyle = pal(f); ctx.lineWidth = 0.8 + f * 1.5;
    ctx.beginPath(); ctx.moveTo(duffPts[j-1][0], duffPts[j-1][1]); ctx.lineTo(duffPts[j][0], duffPts[j][1]); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('F = m · a  ⟹  Espacio de Fase (x, ẋ)', cx, H * 0.94);
}

// ── 15 [016]: Tercera Ley de Newton (Acción y Reacción) ───────────
let actT = 0;
function init_15() { actT = 0; }
function step_15() {
  trailFade(0.08);
  actT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sep = Math.abs(Math.sin(actT)) * (W * 0.3) + 20;

  const m1 = 1.0, m2 = 2.0;
  const x1 = cx - sep * (m2 / (m1 + m2)), y1 = cy;
  const x2 = cx + sep * (m1 / (m1 + m2)), y2 = cy;

  // Cuerpos
  ctx.fillStyle = pal(0.3); ctx.beginPath(); ctx.arc(x1, y1, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = pal(0.8); ctx.beginPath(); ctx.arc(x2, y2, 22, 0, Math.PI * 2); ctx.fill();

  // Vectores de fuerza F12 = -F21 durante interacción
  const forceMag = (W * 0.15) / (sep * 0.1);
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - forceMag, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 + forceMag, y2); ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('F₁₂ = -F₂₁  (Conservación de Momentum Total)', cx, H * 0.94);
}

// ── 16 [017]: Ley de Gravitación Universal (F = G m₁ m₂ / r²) ─────
let grav8T = 0;
function init_16() { grav8T = 0; }
function step_16() {
  trailFade(0.05);
  grav8T += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const scale = Math.min(W, H) * 0.35;

  // Coreografía en forma de ocho de Chenciner-Montgomery (3 cuerpos)
  for (let i = 0; i < 3; i++) {
    const t = grav8T + (i * Math.PI * 2) / 3;
    const x = Math.sin(t);
    const y = Math.sin(2 * t) * 0.5;
    const px = cx + x * scale, py = cy + y * scale;

    ctx.fillStyle = pal(0.2 + i * 0.35);
    ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();

    // Líneas de fuerza gravitatoria mutua
    for (let j = i + 1; j < 3; j++) {
      const tj = grav8T + (j * Math.PI * 2) / 3;
      const xj = cx + Math.sin(tj) * scale, yj = cy + Math.sin(2 * tj) * 0.5 * scale;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(xj, yj); ctx.stroke();
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('F = G · (m₁ · m₂) / r²  (Coreografía de 3 Cuerpos)', cx, H * 0.94);
}

// ── 17 [018]: Ley de Enfriamiento de Newton (dT/dt = -k(T - T_env)) ─
let coolT = 0;
function init_17() { coolT = 0; }
function step_17() {
  trailFade(0.08);
  coolT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const maxR = Math.min(W, H) * 0.4;

  // Isotermas concéntricas difundiéndose y enfriándose exponencialmente
  const k = 0.5;
  const tempCenter = Math.exp(-k * (coolT % 4));

  for (let r = 20; r < maxR; r += 25) {
    const localT = tempCenter * Math.exp(-r / 120);
    ctx.strokeStyle = pal(localT); ctx.lineWidth = 2.0;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('dT/dt = -k(T - T_env)  ⟹  T(t) = T_env + ΔT·e^{-kt}', cx, H * 0.94);
}

// ── 18 [019]: El Teorema Fundamental del Cálculo ───────────────────
let calcT = 0;
function init_18() { calcT = 0; }
function step_18() {
  trailFade(0.06);
  calcT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.55;
  const scX = W * 0.08, scY = H * 0.08;

  // Función f(x) = sin(x) + 0.5*cos(2x)
  const xLimit = 1.0 + (Math.sin(calcT) * 0.5 + 0.5) * 6.0;

  // Rectángulos de Riemann bajo la curva
  const dx = 0.25;
  let accumArea = 0;
  for (let x = 0; x < xLimit; x += dx) {
    const fVal = Math.sin(x) + 0.5 * Math.cos(2 * x) + 1.2;
    accumArea += fVal * dx;
    const px = W * 0.15 + x * scX;
    const py = cy;
    ctx.fillStyle = pal(x / 8.0);
    ctx.fillRect(px, py - fVal * scY, dx * scX - 1, fVal * scY);
  }

  // Curva de la integral acumulada F(x) = ∫ f(t) dt
  ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x <= xLimit; x += 0.05) {
    // Integral analítica: -cos(x) + 0.25*sin(2x) + 1.2x
    const Fval = -Math.cos(x) + 0.25 * Math.sin(2 * x) + 1.2 * x + 1.0;
    const px = W * 0.15 + x * scX;
    const py = cy - H * 0.3 - Fval * (scY * 0.3);
    if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('d/dx ∫ f(t) dt = f(x)   |   Área Acumulada = ' + accumArea.toFixed(2), cx, H * 0.94);
}

// ── 19 [020]: Característica Polihédrica de Euler (V - E + F = 2) ──
let polyRot = 0;
function init_19() { polyRot = 0; }
function step_19() {
  trailFade(0.06);
  polyRot += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.28;

  // Icosaedro regular 3D rotante (12 vértices, 30 aristas, 20 caras)
  const phi = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
  ];

  const proj = verts.map(([vx, vy, vz]) => {
    const rx = vx * Math.cos(polyRot) - vz * Math.sin(polyRot);
    const rz = vx * Math.sin(polyRot) + vz * Math.cos(polyRot);
    const ry = vy * Math.cos(polyRot * 0.6) - rz * Math.sin(polyRot * 0.6);
    const sc = R / (3.5 + rz * 0.3);
    return [cx + rx * sc, cy + ry * sc];
  });

  // Conectar vértices (aristas)
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 1.4;
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      const d2 = Math.pow(verts[i][0]-verts[j][0], 2) + Math.pow(verts[i][1]-verts[j][1], 2) + Math.pow(verts[i][2]-verts[j][2], 2);
      if (Math.abs(d2 - 4.0) < 0.2) {
        ctx.beginPath(); ctx.moveTo(proj[i][0], proj[i][1]); ctx.lineTo(proj[j][0], proj[j][1]); ctx.stroke();
      }
    }
  }

  // Vértices
  proj.forEach(([px, py]) => {
    ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('V - E + F = 12 - 30 + 20 = 2 (Invariante Topológico)', cx, H * 0.94);
}

  function handlePointer(type, x, y, dx, dy, artIdx, meta) {}

  const inits = [
    init_00,
    init_01,
    init_02,
    init_03,
    init_04,
    init_05,
    init_06,
    init_07,
    init_08,
    init_09,
    init_10,
    init_11,
    init_12,
    init_13,
    init_14,
    init_15,
    init_16,
    init_17,
    init_18,
    init_19
  ];

  const steps = [
    step_00,
    step_01,
    step_02,
    step_03,
    step_04,
    step_05,
    step_06,
    step_07,
    step_08,
    step_09,
    step_10,
    step_11,
    step_12,
    step_13,
    step_14,
    step_15,
    step_16,
    step_17,
    step_18,
    step_19
  ];

  const initsMap = {};
  const stepsMap = {};
  for (let i = 0; i < 20; i++) {
    const globalId = 0 + i;
    initsMap[globalId] = inits[i];
    stepsMap[globalId] = steps[i];
  }

  const epochModule = {
    epoch: 1,
    name: "Antigüedad & Fundamentos Clásicos",
    range: [0, 19],
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
    root.AtelierEpoch1 = epochModule;
    if (root.AtelierMathCore && typeof root.AtelierMathCore.registerEpoch === 'function') {
      root.AtelierMathCore.registerEpoch(epochModule);
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
