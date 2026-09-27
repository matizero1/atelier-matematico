// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — ÉPOCA 5: CAOS, COMPUTACIÓN & FRONTERAS MODERNAS
// Obras 080 a 099 · Simulación en Silicio Nativo 60 FPS
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

  function handlePointer(type, x, y, dx, dy, artIdx, meta) {
    if (type === 'down' && artIdx === 84) {
      tAgents.push({ x, y, angle: Math.random() * Math.PI * 2, sp: 1.2, pts: [] });
    }
    if (meta && meta.isDrag) {
      if (artIdx === 86 || artIdx === 87) {
        lRotZ += dx * 0.005;
        lRotX += dy * 0.005;
      }
      if (artIdx === 97) {
        ricciAngle += dx * 0.005;
      }
    }
  }

  const inits = [
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

  const steps = [
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

  const initsMap = {};
  const stepsMap = {};
  for (let i = 0; i < 20; i++) {
    const globalId = 80 + i;
    initsMap[globalId] = inits[i];
    stepsMap[globalId] = steps[i];
  }

  const epochModule = {
    epoch: 5,
    name: "Caos, Computación & Fronteras Modernas",
    range: [80, 99],
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
    root.AtelierEpoch5 = epochModule;
    if (root.AtelierMathCore && typeof root.AtelierMathCore.registerEpoch === 'function') {
      root.AtelierMathCore.registerEpoch(epochModule);
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
