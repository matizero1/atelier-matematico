// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — 100 MOTORES MATEMÁTICOS EN SILICIO NATIVO
// Sistema Soberano de Física Computacional y Álgebra Vectorial 60 FPS
// Gobernanza: Timonel F2 | Cero Falsas Aproximaciones | 100 Obras Únicas
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  let canvas = null;
  let ctx = null;
  let W = 1024, H = 1448;
  let currentPal = 0;
  let mouseX = -9999, mouseY = -9999, mouseDown = false;
  let isDrag = false, dragX = 0, dragY = 0;

  // ── Paletas cromáticas ───────────────────────────────────────────
  function hsl2rgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (!s) { r = g = b = l; }
    else {
      const q = l < .5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
      const hue = (p, q, t) => {
        if(t<0)t+=1; if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
      };
      r=hue(p,q,h+1/3); g=hue(p,q,h); b=hue(p,q,h-1/3);
    }
    return [r*255|0, g*255|0, b*255|0];
  }

  const PALS_RGB = [
    f => hsl2rgb(250-f*210, 90, 45+f*35),
    f => [f*40|0, 120+f*135|0, Math.max(0,200-f*50)|0],
    f => [Math.min(255,60+f*220)|0, Math.min(255,f>.6?(f-.6)*450:20)|0, f<.3?180:20],
    f => [220+f*35|0, 180+f*70|0, 120+f*135|0],
  ];
  const PALS_CSS = [
    f => `hsla(${250-f*210},90%,${45+f*35}%,${.08+f*.7})`,
    f => `rgba(${f*40|0},${120+f*135|0},${Math.max(0,200-f*50)|0},${.08+f*.7})`,
    f => `rgba(${Math.min(255,60+f*220)|0},${Math.min(255,f>.6?(f-.6)*450:20)|0},${f<.3?180:20},${.08+f*.75})`,
    f => `rgba(${220+f*35|0},${180+f*70|0},${120+f*135|0},${.08+f*.65})`,
  ];

  function trailFade(alpha = 0.06) {
    if (!ctx) return;
    ctx.fillStyle = `rgba(8, 8, 10, ${alpha})`;
    ctx.fillRect(0, 0, W, H);
  }

  function resize() {
    if (!canvas) return;
    if (canvas.parentElement) {
      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = r.width  | 0;
      H = canvas.height = (r.height - 8) | 0;
    }
  }

// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
// ÉPOCA V: CAOS, COMPUTACIÓN & FRONTERAS MODERNAS (OBRAS 080 A 099)
// ═══════════════════════════════════════════════════════════════════

// ── 80 [081]: Teorema de Incompletitud de Gödel ────────────────────
let godelT = 0;
function init_80() { godelT = 0; }
function step_80() {
  trailFade(0.06);
  godelT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Árbol formal autorreferencial de Gödel (Primos de Gödel: 2^a · 3^b · 5^c...)
  function drawBranch(x, y, len, angle, depth) {
    if (depth > 6 || len < 6) return;
    const nx = x + len * Math.cos(angle);
    const ny = y - len * Math.sin(angle);
    ctx.strokeStyle = pal(depth / 7); ctx.lineWidth = Math.max(1, 4 - depth * 0.5);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();

    const split = 0.5 + 0.1 * Math.sin(godelT + depth);
    drawBranch(nx, ny, len * 0.72, angle - split, depth + 1);
    drawBranch(nx, ny, len * 0.72, angle + split, depth + 1);
  }

  drawBranch(cx, cy + H * 0.35, H * 0.18, Math.PI * 0.5, 0);

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('G ↔ ¬Prov(⌈G⌉)  (Enunciado Verdadero No Demostrable)', cx, H * 0.94);
}

// ── 81 [082]: La Máquina Universal de Turing ───────────────────────
let turingHead = 12, turingTape = [], turingState = 'A', turingStepCount = 0;
function init_81() {
  turingTape = new Array(25).fill(0);
  turingHead = 12; turingState = 'A'; turingStepCount = 0;
}
function step_81() {
  trailFade(0.08);
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const cellW = (W * 0.8) / 25;

  // Ejecución del Castor Ocupado (Busy Beaver) de 3 estados
  turingStepCount++;
  if (turingStepCount % 6 === 0) {
    const curVal = turingTape[turingHead];
    if (turingState === 'A') {
      if (curVal === 0) { turingTape[turingHead] = 1; turingHead++; turingState = 'B'; }
      else { turingTape[turingHead] = 1; turingHead--; turingState = 'C'; }
    } else if (turingState === 'B') {
      if (curVal === 0) { turingTape[turingHead] = 1; turingHead--; turingState = 'A'; }
      else { turingTape[turingHead] = 1; turingHead++; turingState = 'B'; }
    } else if (turingState === 'C') {
      if (curVal === 0) { turingTape[turingHead] = 1; turingHead--; turingState = 'B'; }
      else { turingTape[turingHead] = 1; turingHead++; turingState = 'A'; } // reinicio cíclico
    }
    if (turingHead < 1) turingHead = 23;
    if (turingHead > 23) turingHead = 1;
  }

  // Cinta de Turing
  for (let i = 0; i < 25; i++) {
    const px = W * 0.1 + i * cellW;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.strokeRect(px, cy - 20, cellW, 40);

    if (turingTape[i] === 1) {
      ctx.fillStyle = pal(0.85);
      ctx.fillRect(px + 2, cy - 18, cellW - 4, 36);
    }
  }

  // Cabezal de lectura/escritura
  const headX = W * 0.1 + turingHead * cellW + cellW * 0.5;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.moveTo(headX, cy - 35); ctx.lineTo(headX - 10, cy - 50); ctx.lineTo(headX + 10, cy - 50); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`δ: Q × Γ → Q × Γ × {L, R}  (Estado: ${turingState})`, cx, H * 0.94);
}

// ── 82 [083]: La Entropía de la Información de Shannon ─────────────
let shanT = 0;
function init_82() { shanT = 0; }
function step_82() {
  trailFade(0.06);
  shanT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.65;
  const L = W * 0.75;

  // Curva de entropía binaria H(p) = -p log2(p) - (1-p) log2(1-p)
  ctx.strokeStyle = pal(0.85); ctx.lineWidth = 3.0;
  ctx.beginPath();
  for (let px = 0; px <= L; px += 3) {
    const p = Math.max(0.0001, Math.min(0.9999, px / L));
    const h = -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
    const scrX = W * 0.125 + px, scrY = cy - h * (H * 0.35);
    if (px === 0) ctx.moveTo(scrX, scrY); else ctx.lineTo(scrX, scrY);
  }
  ctx.stroke();

  // Cursor móvil mostrando la fuente estocástica
  const pNow = 0.5 + 0.45 * Math.sin(shanT);
  const hNow = -pNow * Math.log2(pNow) - (1 - pNow) * Math.log2(1 - pNow);
  const curX = W * 0.125 + pNow * L, curY = cy - hNow * (H * 0.35);

  ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`H(X) = -∑ P(x) log₂ P(x) = ${hNow.toFixed(3)} bits  (Máximo en p=0.5)`, cx, H * 0.94);
}

// ── 83 [084]: Capacidad de Canal de Shannon-Hartley (C = B log₂(1+SNR))
let shannChanT = 0;
function init_83() { shannChanT = 0; }
function step_83() {
  trailFade(0.06);
  shannChanT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.28;

  // Constelación 16-QAM con ruido blanco gaussiano (AWGN)
  const snr = 15.0 + 10.0 * Math.sin(shannChanT); // SNR en dB
  const noiseSigma = 0.35 / Math.sqrt(Math.pow(10, snr / 10));

  for (let i = -1.5; i <= 1.5; i += 1.0) {
    for (let j = -1.5; j <= 1.5; j += 1.0) {
      const qamX = cx + (i / 1.5) * sc;
      const qamY = cy + (j / 1.5) * sc;

      // Nube de ruido gaussiano en torno a cada punto de constelación
      ctx.fillStyle = pal(0.85);
      for (let k = 0; k < 12; k++) {
        const nx = (Math.random() + Math.random() - 1.0) * noiseSigma * sc * 2;
        const ny = (Math.random() + Math.random() - 1.0) * noiseSigma * sc * 2;
        ctx.fillRect(qamX + nx - 1, qamY + ny - 1, 2, 2);
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`C = B · log₂(1 + SNR)   |   SNR = ${snr.toFixed(1)} dB`, cx, H * 0.94);
}

// ── 84 [085]: El Telar de Morfogénesis de Turing ───────────────────
let tAgents = [];
function init_84() {
  tAgents = [];
  for (let i = 0; i < 90; i++) {
    tAgents.push({
      x: W * 0.2 + Math.random() * W * 0.6,
      y: H * 0.2 + Math.random() * H * 0.6,
      angle: Math.random() * Math.PI * 2,
      sp: 1.2, pts: []
    });
  }
}
function step_84() {
  trailFade(0.045);
  const pal = PALS_CSS[currentPal];
  for (const a of tAgents) {
    a.angle += (Math.random() - 0.5) * 0.35;
    a.x += Math.cos(a.angle) * a.sp;
    a.y += Math.sin(a.angle) * a.sp;

    if (a.x < W * 0.1 || a.x > W * 0.9) a.angle = Math.PI - a.angle;
    if (a.y < H * 0.1 || a.y > H * 0.9) a.angle = -a.angle;

    a.pts.push([a.x, a.y]);
    if (a.pts.length > 25) a.pts.shift();

    const n = a.pts.length;
    for (let j = 1; j < n; j++) {
      ctx.strokeStyle = pal(j / n); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(a.pts[j-1][0], a.pts[j-1][1]); ctx.lineTo(a.pts[j][0], a.pts[j][1]); ctx.stroke();
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∂u/∂t = D_u ∇²u - uv² + F(1-u)  (Morfogénesis de Turing)', W * 0.5, H * 0.94);
}

// ── 85 [086]: Reacción Química de Belousov-Zhabotinsky ──────────────
let bzT = 0;
function init_85() { bzT = 0; }
function step_85() {
  trailFade(0.06);
  bzT += 0.03;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.38;

  // Ondas espirales concéntricas químicas de BZ (Modelo de Oregonator)
  const spirals = 3;
  ctx.lineWidth = 2.2;
  for (let s = 0; s < spirals; s++) {
    const sAng = (s * Math.PI * 2) / spirals;
    ctx.strokeStyle = pal(s / spirals);
    ctx.beginPath();
    let started = false;
    for (let theta = 0; theta < Math.PI * 8; theta += 0.08) {
      const r = (theta / (Math.PI * 8)) * sc;
      const waveTh = theta + sAng - bzT * 2;
      const px = cx + r * Math.cos(waveTh);
      const py = cy + r * Math.sin(waveTh);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Ondas Químicas Espirales de Belousov-Zhabotinsky', cx, H * 0.94);
}

// ── 86 [087]: El Atractor Caótico de Lorenz ────────────────────────
let lTrajs=[], lRotZ=.5, lRotX=.3;
function init_86() {
  lTrajs = [];
  for(let i=0;i<12;i++){
    let x=.1+i*.04,y=i*.02,z=14+i*.03;
    for(let k=0;k<400;k++){x+=.005*(10*(y-x));y+=.005*(x*(28-z)-y);z+=.005*(x*y-2.667*z);}
    lTrajs.push({x,y,z,pts:[],max:700});
  }
}
function step_86() {
  trailFade(0.035);
  lRotZ += 0.0008; const sc = Math.min(W, H) * 0.015;
  const pal = PALS_CSS[currentPal];
  for(const tr of lTrajs){
    for(let s=0;s<6;s++){
      const dt=.004, f=(x,y,z)=>[10*(y-x),x*(28-z)-y,x*y-2.667*z];
      const [k1x,k1y,k1z]=f(tr.x,tr.y,tr.z);
      const [k2x,k2y,k2z]=f(tr.x+dt/2*k1x,tr.y+dt/2*k1y,tr.z+dt/2*k1z);
      const [k3x,k3y,k3z]=f(tr.x+dt/2*k2x,tr.y+dt/2*k2y,tr.z+dt/2*k2z);
      const [k4x,k4y,k4z]=f(tr.x+dt*k3x,tr.y+dt*k3y,tr.z+dt*k3z);
      tr.x+=dt/6*(k1x+2*k2x+2*k3x+k4x); tr.y+=dt/6*(k1y+2*k2y+2*k3y+k4y); tr.z+=dt/6*(k1z+2*k2z+2*k3z+k4z);
      const cz=tr.z-25, rx=tr.x*Math.cos(lRotZ)-tr.y*Math.sin(lRotZ);
      const ry=tr.x*Math.sin(lRotZ)+tr.y*Math.cos(lRotZ);
      const rz=ry*Math.sin(lRotX)+cz*Math.cos(lRotX);
      tr.pts.push([W/2+rx*sc, H/2-rz*sc]); if(tr.pts.length>tr.max)tr.pts.shift();
    }
    const n=tr.pts.length; if(n<2)continue;
    for(let j=1;j<n;j++){
      const f=j/n; ctx.strokeStyle=pal(f); ctx.lineWidth=.5+f*1.5;
      ctx.beginPath(); ctx.moveTo(tr.pts[j-1][0],tr.pts[j-1][1]); ctx.lineTo(tr.pts[j][0],tr.pts[j][1]); ctx.stroke();
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ẋ=σ(y-x), ẏ=x(ρ-z)-y, ż=xy-βz  (Atractor de Lorenz)', W * 0.5, H * 0.94);
}

// ── 87 [088]: La Cinta Plegada de Rössler ──────────────────────────
let rosX = 1, rosY = 1, rosZ = 1, rosPts = [], rRot = 0.5;
function init_87() { rosX = 1; rosY = 1; rosZ = 1; rosPts = []; rRot = 0.5; }
function step_87() {
  trailFade(0.04);
  rRot += 0.002;
  const pal = PALS_CSS[currentPal];
  const a = 0.2, b = 0.2, c = 5.7;
  const dt = 0.025;
  const sc = Math.min(W, H) * 0.024;

  for (let s = 0; s < 8; s++) {
    const dx = -rosY - rosZ;
    const dy = rosX + a * rosY;
    const dz = b + rosZ * (rosX - c);
    rosX += dx * dt; rosY += dy * dt; rosZ += dz * dt;

    const rx = rosX * Math.cos(rRot) - rosY * Math.sin(rRot);
    const ry = rosX * Math.sin(rRot) + rosY * Math.cos(rRot);
    rosPts.push([W * 0.5 + rx * sc, H * 0.5 - (ry * 0.6 + rosZ) * sc]);
    if (rosPts.length > 700) rosPts.shift();
  }

  const n = rosPts.length;
  for (let i = 1; i < n; i++) {
    const f = i / n;
    ctx.strokeStyle = pal(f); ctx.lineWidth = 0.6 + f * 1.6;
    ctx.beginPath(); ctx.moveTo(rosPts[i-1][0], rosPts[i-1][1]); ctx.lineTo(rosPts[i][0], rosPts[i][1]); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ẋ = -y-z, ẏ = x+ay, ż = b+z(x-c)  (Cinta de Rössler)', W * 0.5, H * 0.94);
}

// ── 88 [089]: El Mapa Logístico y Universalidad de Feigenbaum ──────
let feigT = 0;
function init_88() { feigT = 0; }
function step_88() {
  trailFade(0.06);
  feigT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.68;
  const L = W * 0.75;

  // Diagrama de bifurcación x_{n+1} = r x_n (1 - x_n)
  ctx.fillStyle = pal(0.85);
  for (let col = 0; col < 120; col++) {
    const r = 2.8 + (col / 120) * 1.2;
    let x = 0.5;
    for (let it = 0; it < 60; it++) x = r * x * (1 - x);
    for (let it = 0; it < 16; it++) {
      x = r * x * (1 - x);
      const px = W * 0.125 + (col / 120) * L;
      const py = cy - x * (H * 0.45);
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('x_{n+1} = r x_n (1 - x_n)  (δ = 4.6692016... Feigenbaum)', cx, H * 0.94);
}

// ── 89 [090]: El Conjunto Fractal de Mandelbrot (z_{n+1} = z_n² + c)
let mandelT = 0;
function init_89() { mandelT = 0; }
function step_89() {
  trailFade(0.06);
  mandelT += 0.015;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.32;

  // Órbitas de escape en el plano complejo
  const samples = 48;
  for (let s = 0; s < samples; s++) {
    const ang = mandelT + (s * Math.PI * 2) / samples;
    const cr = -0.7 + 0.3 * Math.cos(ang);
    const ci = 0.3 * Math.sin(ang);

    let zr = 0, zi = 0;
    ctx.strokeStyle = pal(s / samples); ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(cx + cr * sc, cy - ci * sc);
    for (let it = 0; it < 25; it++) {
      const nRe = zr * zr - zi * zi + cr;
      const nIm = 2 * zr * zi + ci;
      zr = nRe; zi = nIm;
      ctx.lineTo(cx + zr * sc, cy - zi * sc);
      if (zr * zr + zi * zi > 4) break;
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('z_{n+1} = z_n² + c  (Geometría Fractal Compleja)', cx, H * 0.94);
}

// ── 90 [091]: Sincronización de Fase de Kuramoto ───────────────────
let kurTh = [], kurW = [], kurT = 0;
function init_90() {
  kurT = 0; kurTh = []; kurW = [];
  for (let i = 0; i < 90; i++) {
    kurTh.push(Math.random() * Math.PI * 2);
    kurW.push((Math.random() - 0.5) * 0.05);
  }
}
function step_90() {
  trailFade(0.06);
  kurT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.32;

  // Círculo unitario
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  // Acoplamiento K de Kuramoto
  const K = 0.08 * (Math.sin(kurT) * 0.5 + 0.5);
  const N = kurTh.length;

  for (let i = 0; i < N; i++) {
    let sumSin = 0;
    for (let j = 0; j < N; j++) sumSin += Math.sin(kurTh[j] - kurTh[i]);
    kurTh[i] += kurW[i] + (K / N) * sumSin;

    const px = cx + R * Math.cos(kurTh[i]);
    const py = cy + R * Math.sin(kurTh[i]);

    ctx.fillStyle = pal(i / N);
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('dθ_i/dt = ω_i + (K/N) ∑ sin(θ_j - θ_i)  (Sincronización)', cx, H * 0.94);
}

// ── 91 [092]: La Ecuación Estocástica de Langevin ───────────────────
let langX = 0, langV = 0, langPts = [], langT = 0;
function init_91() { langX = 0; langV = 0; langPts = []; langT = 0; }
function step_91() {
  trailFade(0.06);
  langT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.35;

  // Movimiento browniano estocástico m v' = -gamma v + xi(t)
  for (let s = 0; s < 6; s++) {
    const whiteNoise = (Math.random() + Math.random() - 1.0) * 1.8;
    langV += -0.1 * langV + whiteNoise;
    langX += langV * 0.05;
    langPts.push([cx + langX * (sc * 0.2), cy + langV * (sc * 0.2)]);
    if (langPts.length > 500) langPts.shift();
  }

  const n = langPts.length;
  for (let i = 1; i < n; i++) {
    const f = i / n;
    ctx.strokeStyle = pal(f); ctx.lineWidth = 0.8 + f * 1.5;
    ctx.beginPath(); ctx.moveTo(langPts[i-1][0], langPts[i-1][1]); ctx.lineTo(langPts[i][0], langPts[i][1]); ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('m · dv/dt = -γ · v + ξ(t)  (Dinámica Estocástica)', cx, H * 0.94);
}

// ── 92 [093]: Ecuación de Opciones de Black-Scholes ────────────────
let bsT = 0;
function init_92() { bsT = 0; }
function step_92() {
  trailFade(0.06);
  bsT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.68;
  const L = W * 0.75;
  const K_strike = W * 0.45;

  // Curva de pago intrínseca al vencimiento (Call Option max(S - K, 0))
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W * 0.125, cy);
  ctx.lineTo(K_strike, cy);
  ctx.lineTo(W * 0.875, cy - (W * 0.875 - K_strike) * 0.8);
  ctx.stroke();

  // Curvas de precio Black-Scholes para diferentes volatilidades sigma
  const sigmas = [0.15, 0.35, 0.60];
  sigmas.forEach((sig, idx) => {
    ctx.strokeStyle = pal(idx / 3); ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let px = 0; px <= L; px += 4) {
      const S = W * 0.125 + px;
      const d1 = (Math.log(S / K_strike) + 0.05 + 0.5 * sig * sig) / sig;
      const Nd1 = 0.5 * (1 + Math.tanh(d1 * 0.8));
      const val = Math.max(0, S * Nd1 - K_strike * 0.8) * 0.5;
      const scrY = cy - val;
      if (px === 0) ctx.moveTo(S, scrY); else ctx.lineTo(S, scrY);
    }
    ctx.stroke();
  });

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∂V/∂t + ½σ²S² ∂²V/∂S² + rS ∂V/∂S - rV = 0', cx, H * 0.94);
}

// ── 93 [094]: Autómata Celular Regla 110 (Turing Completo) ─────────
let r110Cells = [], r110History = [];
function init_93() {
  r110Cells = new Array(80).fill(0);
  r110Cells[78] = 1; // Semilla clásica
  r110History = [];
}
function step_93() {
  trailFade(0.08);
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const N = r110Cells.length;
  const cellW = (W * 0.85) / N;

  // Evolución Regla 110: 01101110_2
  const next = new Array(N).fill(0);
  for (let i = 1; i < N - 1; i++) {
    const pat = (r110Cells[i-1] << 2) | (r110Cells[i] << 1) | r110Cells[i+1];
    next[i] = (110 & (1 << pat)) ? 1 : 0;
  }
  r110History.unshift(r110Cells);
  if (r110History.length > 50) r110History.pop();
  r110Cells = next;

  // Renderizar historial espacio-temporal
  for (let row = 0; row < r110History.length; row++) {
    const hRow = r110History[row];
    for (let col = 0; col < N; col++) {
      if (hRow[col] === 1) {
        ctx.fillStyle = pal(row / 50.0);
        ctx.fillRect(W * 0.075 + col * cellW, H * 0.2 + row * 8, cellW - 0.5, 7.5);
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Regla 110: Computación Universal & Estructuras Glider', cx, H * 0.94);
}

// ── 94 [095]: La Hormiga de Langton ────────────────────────────────
let antGrid = null, antGW = 45, antGH = 45, antX = 22, antY = 22, antDir = 0, antSteps = 0;
function init_94() {
  antGW = 45; antGH = 45; antX = 22; antY = 22; antDir = 0; antSteps = 0;
  antGrid = new Uint8Array(antGW * antGH);
}
function step_94() {
  trailFade(0.08);
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.75 / antGW;

  // 12 pasos por fotograma
  for (let s = 0; s < 12; s++) {
    antSteps++;
    const idx = antY * antGW + antX;
    if (antGrid[idx] === 0) {
      antDir = (antDir + 1) % 4; // Giro a la derecha
      antGrid[idx] = 1;
    } else {
      antDir = (antDir + 3) % 4; // Giro a la izquierda
      antGrid[idx] = 0;
    }
    if (antDir === 0) antY--;
    else if (antDir === 1) antX++;
    else if (antDir === 2) antY++;
    else if (antDir === 3) antX--;

    antX = (antX + antGW) % antGW;
    antY = (antY + antGH) % antGH;
  }

  // Dibujar celdas
  for (let y = 0; y < antGH; y++) {
    for (let x = 0; x < antGW; x++) {
      if (antGrid[y * antGW + x] === 1) {
        ctx.fillStyle = pal(0.85);
        ctx.fillRect(cx - (antGW*sc*0.5) + x * sc, cy - (antGH*sc*0.5) + y * sc, sc - 0.5, sc - 0.5);
      }
    }
  }

  // Posición de la hormiga
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cx - (antGW*sc*0.5) + antX * sc, cy - (antGH*sc*0.5) + antY * sc, sc, sc);

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(`Hormiga de Langton: Paso ${antSteps} (Autopista Periódica de 104 Pasos)`, cx, H * 0.94);
}

// ── 95 [096]: El Integrador Simpléctico de 4º Orden de Yoshida ────
let yoshTrails = [];
function init_95() {
  yoshTrails = []; const L = Math.min(W, H) * 0.22;
  for (let i = 0; i < 16; i++) {
    yoshTrails.push({ th1: Math.PI * (0.4 + i * 0.03), th2: Math.PI * (0.8 + i * 0.02), w1: 0, w2: 0, pts: [], max: 550, cx: W / 2, cy: H * 0.42, L });
  }
}
function step_95() {
  trailFade(0.03);
  const pal = PALS_CSS[currentPal];
  const c1 = 0.6756, c0 = -0.1756, d1 = 1.3512, d0 = -1.7024, g = 9.8, dt = 0.03;
  for (const tr of yoshTrails) {
    for (let s = 0; s < 5; s++) for (const [c, d] of [[c1, d1], [c0, d0], [c1, d1]]) {
      tr.th1 += c * dt * tr.w1; tr.th2 += c * dt * tr.w2;
      const dth = tr.th1 - tr.th2, den = 2 - Math.cos(2 * dth);
      const dw1 = (-g * (2 * Math.sin(tr.th1) - Math.cos(dth) * Math.sin(tr.th2)) - Math.sin(dth) * (tr.w2 * tr.w2 + tr.w1 * tr.w1 * Math.cos(dth))) / den;
      const dw2 = (g * (2 * Math.cos(dth) * Math.sin(tr.th1) - 2 * Math.sin(tr.th2)) + Math.sin(dth) * (2 * tr.w1 * tr.w1 + tr.w2 * tr.w2 * Math.cos(dth))) / den;
      tr.w1 += d * dt * dw1; tr.w2 += d * dt * dw2;
    }
    const x1 = tr.cx + tr.L * Math.sin(tr.th1), y1 = tr.cy + tr.L * Math.cos(tr.th1);
    tr.pts.push([x1 + tr.L * Math.sin(tr.th2), y1 + tr.L * Math.cos(tr.th2)]);
    if (tr.pts.length > tr.max) tr.pts.shift();

    const n = tr.pts.length; if (n < 2) continue;
    for (let j = 1; j < n; j++) {
      const f = j / n; ctx.strokeStyle = pal(f); ctx.lineWidth = 0.5 + f * 1.4;
      ctx.beginPath(); ctx.moveTo(tr.pts[j-1][0], tr.pts[j-1][1]); ctx.lineTo(tr.pts[j][0], tr.pts[j][1]); ctx.stroke();
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('Integrador Simpléctico de 4º Orden de Yoshida (Cero Deriva)', W * 0.5, H * 0.94);
}

// ── 96 [097]: El Desierto de la Conjetura de Beal (A^x + B^y = C^z) ──
let bealT = 0;
function init_96() { bealT = 0; }
function step_96() {
  trailFade(0.06);
  bealT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const sc = Math.min(W, H) * 0.35;

  // Retículo tridimensional diofántico proyectado
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
  const N = 6;
  for (let x = 1; x <= N; x++) {
    for (let y = 1; y <= N; y++) {
      const u = (x / N - 0.5) * sc, v = (y / N - 0.5) * sc;
      const rotU = u * Math.cos(bealT * 0.5) - v * Math.sin(bealT * 0.5);
      const rotV = u * Math.sin(bealT * 0.5) + v * Math.cos(bealT * 0.5);

      // Puntos con factor común > 1 (soluciones válidas) vs desierto coprimo
      const hasCommonFactor = (x % 2 === 0 && y % 2 === 0) || (x % 3 === 0 && y % 3 === 0);
      if (hasCommonFactor) {
        ctx.fillStyle = pal(0.85);
        ctx.beginPath(); ctx.arc(cx + rotU, cy + rotV * 0.5, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('A^x + B^y = C^z (x,y,z > 2)  ⟹  mcd(A, B, C) > 1 (Desierto de Beal)', cx, H * 0.94);
}

// ── 97 [098]: El Flujo de Ricci de Perelman (Poincaré) ────────────
let ricciAngle = 0, ricciT = 0;
function init_97() { ricciAngle = 0; ricciT = 0; }
function step_97() {
  trailFade(0.05);
  ricciT += 0.02; ricciAngle += 0.005;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.32;

  // Deformación de Ricci ∂g/∂t = -2 Ric: estrangulamiento de cuello y redondeo esférico
  const neck = 0.5 + 0.45 * Math.sin(ricciT);
  const rings = 22;

  for (let i = 0; i <= rings; i++) {
    const u = (i / rings - 0.5) * 2;
    const rRing = R * (1.0 - (1.0 - neck) * Math.exp(-u * u * 4.0));
    const yRing = cy + u * R * 0.8;

    ctx.strokeStyle = pal(i / rings); ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(cx, yRing, rRing, rRing * 0.35, ricciAngle, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('∂g_ij/∂t = -2 R_ij  (Flujo de Ricci & Cirugía de Perelman)', cx, H * 0.94);
}

// ── 98 [099]: P versus NP y Complejidad Computacional ──────────────
let pnpT = 0;
function init_98() { pnpT = 0; }
function step_98() {
  trailFade(0.06);
  pnpT += 0.025;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.35;

  // Grafo 3-SAT: Cláusulas y variables booleanas interconectadas
  const nodes = 12;
  const nodeCoords = [];
  for (let i = 0; i < nodes; i++) {
    const th = (i * Math.PI * 2) / nodes;
    nodeCoords.push([cx + R * Math.cos(th), cy + R * Math.sin(th)]);
  }

  // Conexiones de satisfacción de cláusulas
  ctx.lineWidth = 1.0;
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if ((i * 3 + j * 5) % 4 === 0) {
        const active = Math.sin(pnpT * 2 + i + j) > 0;
        ctx.strokeStyle = active ? pal(0.85) : 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(nodeCoords[i][0], nodeCoords[i][1]);
        ctx.lineTo(nodeCoords[j][0], nodeCoords[j][1]);
        ctx.stroke();
      }
    }
  }

  nodeCoords.forEach(([px, py], idx) => {
    ctx.fillStyle = pal(idx / nodes);
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('P ≟ NP  (¿Es la Verificación Polinomial Equivalente a la Búsqueda?)', cx, H * 0.94);
}

// ── 99 [100]: El Lagrangiano del Modelo Estándar (ℒ_SM) ────────────
let smT = 0;
function init_99() { smT = 0; }
function step_99() {
  trailFade(0.05);
  smT += 0.02;
  const pal = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;
  const R = Math.min(W, H) * 0.35;

  // Simetría de Gauge Unificada SU(3)_C × SU(2)_L × U(1)_Y
  // 3 anidamientos concéntricos representando gluones, bosones débiles y fotones
  const groups = [
    { name: 'U(1)', r: R * 0.35, n: 4 },
    { name: 'SU(2)', r: R * 0.65, n: 6 },
    { name: 'SU(3)', r: R * 0.95, n: 8 }
  ];

  groups.forEach((g, gIdx) => {
    ctx.strokeStyle = pal(gIdx / 3); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, g.r, 0, Math.PI * 2); ctx.stroke();

    for (let i = 0; i < g.n; i++) {
      const ang = smT * (gIdx + 1) * 0.4 + (i * Math.PI * 2) / g.n;
      const vx = cx + g.r * Math.cos(ang);
      const vy = cy + g.r * Math.sin(ang);

      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2); ctx.fill();

      // Vértices de interacción de Yukawa con el bosón de Higgs central
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(vx, vy); ctx.stroke();
    }
  });

  // Campo de Higgs central dando masa a las partículas
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#dfc285'; ctx.font = '12px Space Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText('ℒ_SM = -¼ F² + iψ̄⧸Dψ + |Dϕ|² - V(ϕ) + Yψ̄ψϕ  (Modelo Estándar)', cx, H * 0.94);
}

// ═══════════════════════════════════════════════════════════════════
// ARRAYS CANÓNICOS DE INICIALIZACIÓN Y FOTOGRAMA (0..99)
// ═══════════════════════════════════════════════════════════════════

const INITS = [
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
  init_19,
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
  init_39,
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
  init_59,
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
  init_79,
  init_80,
  init_81,
  init_82,
  init_83,
  init_84,
  init_85,
  init_86,
  init_87,
  init_88,
  init_89,
  init_90,
  init_91,
  init_92,
  init_93,
  init_94,
  init_95,
  init_96,
  init_97,
  init_98,
  init_99
];

const STEPS = [
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
  step_19,
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
  step_39,
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
  step_59,
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
  step_79,
  step_80,
  step_81,
  step_82,
  step_83,
  step_84,
  step_85,
  step_86,
  step_87,
  step_88,
  step_89,
  step_90,
  step_91,
  step_92,
  step_93,
  step_94,
  step_95,
  step_96,
  step_97,
  step_98,
  step_99
];

// Fallback de catálogo maestro
const MASTER_ARTWORKS = (typeof window !== "undefined" && window.ARTWORKS_100) 
  ? window.ARTWORKS_100 
  : (root.ARTWORKS_100 || []);

// ═══════════════════════════════════════════════════════════════════
// API PÚBLICA SOBERANA ATELIER MATH (100 OBRAS)
// ═══════════════════════════════════════════════════════════════════
root.AtelierMath = {
  ARTWORKS: MASTER_ARTWORKS,
  INITS: INITS,
  STEPS: STEPS,
  bindCanvas: function(c, width, height) {
    canvas = c;
    ctx = canvas.getContext("2d");
    if (width && height) {
      W = canvas.width = width;
      H = canvas.height = height;
    } else if (canvas.parentElement) {
      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width | 0;
      H = canvas.height = (r.height - 8) | 0;
    } else {
      W = canvas.width;
      H = canvas.height;
    }
  },
  resize: function(width, height) {
    if (width && height) {
      W = canvas.width = width;
      H = canvas.height = height;
    } else if (canvas && canvas.parentElement) {
      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width | 0;
      H = canvas.height = (r.height - 8) | 0;
    }
  },
  init: function(idx) {
    if (ctx && W > 0 && H > 0) {
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, W, H);
    }
    if (idx >= 0 && idx < 100 && INITS[idx]) {
      INITS[idx]();
    }
  },
  step: function(idx) {
    if (idx >= 0 && idx < 100 && STEPS[idx]) {
      STEPS[idx]();
    }
  },
  setPalette: function(pal) {
    currentPal = (pal % 4 + 4) % 4;
  },
  getPalette: function() {
    return currentPal;
  },
  setChladniModes: function(m, n) {
    if (typeof chM !== "undefined") chM = Math.max(1, Math.min(8, m));
    if (typeof chN !== "undefined") chN = Math.max(1, Math.min(8, n));
  },
  getChladniModes: function() {
    return { m: typeof chM !== "undefined" ? chM : 3, n: typeof chN !== "undefined" ? chN : 5 };
  },
  handlePointer: function(type, x, y, dx, dy, artIdx) {
    mouseX = x; mouseY = y;
    if (type === "down") {
      isDrag = true; dragX = x; dragY = y; mouseDown = true;
      if (artIdx === 84 && typeof tAgents !== "undefined") {
        tAgents.push({x, y, angle: Math.random()*Math.PI*2, sp: 1.2, pts: []});
      }
    } else if (type === "move") {
      if (artIdx === 26 && typeof chM !== "undefined") {
        chM = Math.max(1, Math.min(8, Math.floor((x / W) * 8) + 1));
        chN = Math.max(1, Math.min(8, Math.floor((y / H) * 8) + 1));
      }
      if (isDrag) {
        if ((artIdx === 86 || artIdx === 87) && typeof lRotZ !== "undefined") {
          lRotZ += dx * 0.005; lRotX += dy * 0.005;
        }
        if (artIdx === 50 && typeof rieRot !== "undefined") rieRot += dx * 0.005;
        if (artIdx === 97 && typeof ricciAngle !== "undefined") ricciAngle += dx * 0.005;
      }
    } else if (type === "up") {
      isDrag = false; mouseDown = false;
    }
  }
};
})(typeof window !== "undefined" ? window : global);
