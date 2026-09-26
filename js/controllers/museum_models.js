// ============================================================================
// 🌌 ATELIER MATEMÁTICO — MOTOR GENERATIVO DE VARIEDADES GEOMÉTRICAS 3D
// 37+ Esculturas Fidedignas de Física Computacional, Espacios de Fases y Lógica
// Gobernanza: Timonel F2 · Cero Autoengaño · Gestión Estricta de Memoria VRAM
// ============================================================================

(function(root) {
  'use strict';

  // ── UTILIDADES DE GEOMETRÍA PARAMÉTRICA EN R³ ───────────────────────
  function createParametricSurface(uSteps, vSteps, fn) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const indices = [];

  for (let i = 0; i <= uSteps; i++) {
    const u = i / uSteps;
    for (let j = 0; j <= vSteps; j++) {
      const v = j / vSteps;
      const p = fn(u, v);
      positions.push(p.x, p.y, p.z);
    }
  }

  for (let i = 0; i < uSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const a = i * (vSteps + 1) + j;
      const b = (i + 1) * (vSteps + 1) + j;
      const c = (i + 1) * (vSteps + 1) + (j + 1);
      const d = i * (vSteps + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// 1. Atractor de Lorenz & Sistemas Caóticos (RK4 en Tiempo Real)
function buildLorenz3D(epColor) {
  const group = new THREE.Group();
  let x = 0.1, y = 0.0, z = 0.0;
  const sigma = 10.0, rho = 28.0, beta = 8.0 / 3.0;
  const dt = 0.009;
  for (let i = 0; i < 150; i++) {
    const dx1 = sigma * (y - x), dy1 = x * (rho - z) - y, dz1 = x * y - beta * z;
    x += dx1 * dt; y += dy1 * dt; z += dz1 * dt;
  }
  const pts = [];
  for (let i = 0; i < 800; i++) {
    pts.push(new THREE.Vector3(x * 0.038, (z - 24) * 0.038, y * 0.038));
    const k1x = sigma * (y - x), k1y = x * (rho - z) - y, k1z = x * y - beta * z;
    const x2 = x + 0.5*dt*k1x, y2 = y + 0.5*dt*k1y, z2 = z + 0.5*dt*k1z;
    const k2x = sigma * (y2 - x2), k2y = x2 * (rho - z2) - y2, k2z = x2 * y2 - beta * z2;
    const x3 = x + 0.5*dt*k2x, y3 = y + 0.5*dt*k2y, z3 = z + 0.5*dt*k2z;
    const k3x = sigma * (y3 - x3), k3y = x3 * (rho - z3) - y3, k3z = x3 * y3 - beta * z3;
    const x4 = x + dt*k3x, y4 = y + dt*k3y, z4 = z + dt*k3z;
    const k4x = sigma * (y4 - x4), k4y = x4 * (rho - z4) - y4, k4z = x4 * y4 - beta * z4;
    x += (dt/6.0)*(k1x + 2*k2x + 2*k3x + k4x);
    y += (dt/6.0)*(k1y + 2*k2y + 2*k3y + k4y);
    z += (dt/6.0)*(k1z + 2*k2z + 2*k3z + k4z);
  }
  const positions = [];
  const colors = [];
  const indices = [];
  const rw = 0.032;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const nextP = pts[Math.min(i + 1, pts.length - 1)];
    const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
    if (tangent.lengthSq() < 0.0001) tangent.set(0, 1, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
    if (binormal.lengthSq() < 0.0001) binormal.set(1, 0, 0);
    const offset = binormal.multiplyScalar(rw);
    positions.push(p.x + offset.x, p.y + offset.y, p.z + offset.z);
    positions.push(p.x - offset.x, p.y - offset.y, p.z - offset.z);
    const t = i / pts.length;
    colors.push(0.3 + 0.6 * t, 0.4 * (1 - t) + 0.5, 0.95, 0.3 + 0.6 * t, 0.4 * (1 - t) + 0.5, 0.95);
    if (i < pts.length - 1) {
      indices.push(i*2, i*2+1, (i+1)*2);
      indices.push(i*2+1, (i+1)*2+1, (i+1)*2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.25, metalness: 0.8 }));
  group.add(mesh);

  const numP = 16;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(numP * 3);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.06, color: 0x38bdf8, transparent: true, opacity: 0.9 }));
  group.add(pMesh);

  let particleHead = 0;
  return {
    group,
    update: (dt, cycleT, phase, relaxFactor) => {
      group.rotation.y += 0.008;
      group.rotation.x += 0.003;
      // Optimización de bus PCIe/WebGL: solo mutar y subir buffer de vértices si está enfocado o colimado
      const isFocused = (typeof activeConfinementAstro !== 'undefined' && activeConfinementAstro && activeConfinementAstro.data.id === 1);
      const isCollimated = (typeof collimatedAstroIndex !== 'undefined' && collimatedAstroIndex >= 0 && astros24[collimatedAstroIndex] && astros24[collimatedAstroIndex].data.id === 1);
      if (!isFocused && !isCollimated) return;

      particleHead = (particleHead + dt * 180) % pts.length;
      for (let k = 0; k < numP; k++) {
        const idx = Math.floor((particleHead + k * (pts.length / numP)) % pts.length);
        const pt = pts[idx];
        pPos[k * 3]     = pt.x;
        pPos[k * 3 + 1] = pt.y;
        pPos[k * 3 + 2] = pt.z;
      }
      pGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 1B. Atractor Caótico de Rössler (Cinta Plegada Unilateral de Banda Única)
// ẋ = -y - z, ẏ = x + a·y, ż = b + z·(x - c) con a=0.2, b=0.2, c=5.7
function buildRossler3D(epColor) {
  const group = new THREE.Group();

  let rx = 0.5, ry = 0.5, rz = 0.5;
  const a = 0.2, b = 0.2, c = 5.7;
  const dt = 0.024;

  for (let i = 0; i < 200; i++) {
    const k1x = -ry - rz, k1y = rx + a * ry, k1z = b + rz * (rx - c);
    rx += k1x * dt; ry += k1y * dt; rz += k1z * dt;
  }

  const pts = [];
  const zVals = [];
  for (let i = 0; i < 700; i++) {
    pts.push(new THREE.Vector3(rx * 0.11, (rz - 4.0) * 0.11, ry * 0.11));
    zVals.push(rz);

    const k1x = -ry - rz, k1y = rx + a * ry, k1z = b + rz * (rx - c);
    const x2 = rx + 0.5*dt*k1x, y2 = ry + 0.5*dt*k1y, z2 = rz + 0.5*dt*k1z;
    const k2x = -y2 - z2, k2y = x2 + a*y2, k2z = b + z2*(x2 - c);
    const x3 = rx + 0.5*dt*k2x, y3 = ry + 0.5*dt*k2y, z3 = rz + 0.5*dt*k2z;
    const k3x = -y3 - z3, k3y = x3 + a*y3, k3z = b + z3*(x3 - c);
    const x4 = rx + dt*k3x, y4 = ry + dt*k3y, z4 = rz + dt*k3z;
    const k4x = -y4 - z4, k4y = x4 + a*y4, k4z = b + z4*(x4 - c);

    rx += (dt / 6.0) * (k1x + 2*k2x + 2*k3x + k4x);
    ry += (dt / 6.0) * (k1y + 2*k2y + 2*k3y + k4y);
    rz += (dt / 6.0) * (k1z + 2*k2z + 2*k3z + k4z);
  }

  const positions = [];
  const colors = [];
  const indices = [];
  const rw = 0.07;

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const nextP = pts[Math.min(i + 1, pts.length - 1)];
    const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
    if (tangent.lengthSq() < 0.0001) tangent.set(0, 1, 0);

    const normal = new THREE.Vector3(0, 1, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    if (binormal.lengthSq() < 0.0001) binormal.set(1, 0, 0);

    const off = binormal.multiplyScalar(rw);
    positions.push(p.x + off.x, p.y + off.y, p.z + off.z);
    positions.push(p.x - off.x, p.y - off.y, p.z - off.z);

    const zNorm = Math.min(1.0, zVals[i] / 12.0);
    const cR = 0.15 + 0.85 * zNorm;
    const cG = 0.70 + 0.25 * zNorm;
    const cB = 0.95 * (1.0 - zNorm);
    colors.push(cR, cG, cB, cR, cG, cB);
  }

  for (let i = 0; i < pts.length - 1; i++) {
    const a0 = i * 2, a1 = a0 + 1;
    const b0 = (i + 1) * 2, b1 = b0 + 1;
    indices.push(a0, b0, a1);
    indices.push(a1, b0, b1);
  }

  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  ribbonGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  ribbonGeo.setIndex(indices);
  ribbonGeo.computeVertexNormals();

  const ribbonMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.22,
    metalness: 0.80,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  group.add(ribbonMesh);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.55;
    }
  };
}

// 1C. Sincronización Colectiva de Kuramoto (θ̇ᵢ = ωᵢ + (K/N) ∑ sin(θⱼ - θᵢ))
function buildKuramoto3D(epColor) {
  const group = new THREE.Group();

  const ringGeo = new THREE.RingGeometry(0.70 - 0.015, 0.70 + 0.015, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const N = 32;
  const phases = new Float32Array(N);
  const natFreqs = new Float32Array(N);
  const oscMeshes = [];

  for (let i = 0; i < N; i++) {
    phases[i] = (i / N) * Math.PI * 2;
    natFreqs[i] = (Math.random() - 0.5) * 1.5;
    const osc = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
    );
    group.add(osc);
    oscMeshes.push(osc);
  }

  const orderArrowGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0)
  ]);
  const orderArrow = new THREE.Line(orderArrowGeo, new THREE.LineBasicMaterial({
    color: 0xf59e0b,
    linewidth: 3
  }));
  group.add(orderArrow);

  let kuramotoTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      kuramotoTime += dt;

      const K = 1.2 + 1.0 * Math.sin(kuramotoTime * 0.4);

      let sumCos = 0, sumSin = 0;
      for (let i = 0; i < N; i++) {
        sumCos += Math.cos(phases[i]);
        sumSin += Math.sin(phases[i]);
      }
      const rOrder = Math.hypot(sumCos, sumSin) / N;
      const psi = Math.atan2(sumSin, sumCos);

      for (let i = 0; i < N; i++) {
        const dTheta = natFreqs[i] + K * rOrder * Math.sin(psi - phases[i]);
        phases[i] += dTheta * dt * 2.5;

        const x = 0.70 * Math.cos(phases[i]);
        const z = 0.70 * Math.sin(phases[i]);
        oscMeshes[i].position.set(x, 0, z);

        const phaseDist = Math.abs(phases[i] - psi) % (Math.PI * 2);
        oscMeshes[i].material.color.setHex(phaseDist < 0.4 ? 0xf59e0b : 0x38bdf8);
      }

      const arrPos = orderArrowGeo.attributes.position.array;
      arrPos[3] = (0.70 * rOrder) * Math.cos(psi);
      arrPos[4] = 0;
      arrPos[5] = (0.70 * rOrder) * Math.sin(psi);
      orderArrowGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 1D. Ecuación Estocástica de Langevin & Movimiento Browniano (m ẍ = -γ ẋ + ξ(t))
function buildLangevin3D(epColor) {
  const group = new THREE.Group();

  const N = 240;
  const pts = [new THREE.Vector3(0, 0, 0)];
  let cur = new THREE.Vector3(0, 0, 0);
  const step = 0.055;
  for (let i = 1; i <= N; i++) {
    cur.x += (Math.random() - 0.5) * step;
    cur.y += (Math.random() - 0.5) * step;
    cur.z += (Math.random() - 0.5) * step;
    pts.push(cur.clone());
  }
  const pathGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const pathLine = new THREE.Line(pathGeo, new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85
  }));
  group.add(pathLine);

  const partMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 })
  );
  partMesh.position.copy(cur);
  group.add(partMesh);

  const diffGeo = new THREE.SphereGeometry(0.55, 20, 16);
  const diffMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.15,
    wireframe: true
  });
  const diffSphere = new THREE.Mesh(diffGeo, diffMat);
  group.add(diffSphere);

  let brownianT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      brownianT += dt * 3.0;
      partMesh.position.x = cur.x + (Math.random() - 0.5) * 0.02;
      partMesh.position.y = cur.y + (Math.random() - 0.5) * 0.02;
      partMesh.position.z = cur.z + (Math.random() - 0.5) * 0.02;

      const s = 1.0 + 0.15 * Math.sin(brownianT * 0.5);
      diffSphere.scale.set(s, s, s);
    }
  };
}

// 2. Botella de Klein (Inmersión 3D Figura 8 con Auto-Intersección)
function buildKlein3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(28, 28, (uNorm, vNorm) => {
    const u = uNorm * Math.PI * 2;
    const v = vNorm * Math.PI * 2;
    const r = 0.82;
    const x = (r + 0.32 * Math.cos(u/2) * Math.sin(v) - 0.32 * Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u);
    const y = (r + 0.32 * Math.cos(u/2) * Math.sin(v) - 0.32 * Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u);
    const z = 0.32 * Math.sin(u/2) * Math.sin(v) + 0.32 * Math.cos(u/2) * Math.sin(2*v);
    return { x: x * 0.92, y: y * 0.92, z: z * 0.92 };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.22,
    metalness: 0.78,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.82
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.z += 0.004;
    }
  };
}

// 3. Cinta de Möbius Tridimensional No-Orientable
function buildMobius3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(36, 8, (uNorm, vNorm) => {
    const u = uNorm * Math.PI * 2;
    const v = (vNorm - 0.5) * 0.52;
    const R = 0.85;
    const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
    const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
    const z = v * Math.sin(u / 2);
    return { x, y, z };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.28,
    metalness: 0.75,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));

  const borderPts = [];
  for (let i = 0; i <= 64; i++) {
    const u = (i / 64) * Math.PI * 4;
    const v = 0.26;
    const R = 0.85;
    borderPts.push(new THREE.Vector3(
      (R + v * Math.cos(u / 2)) * Math.cos(u),
      (R + v * Math.cos(u / 2)) * Math.sin(u),
      v * Math.sin(u / 2)
    ));
  }
  const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
  group.add(new THREE.Line(borderGeo, new THREE.LineBasicMaterial({ color: 0xffeedd, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.009;
      group.rotation.x += 0.005;
    }
  };
}

// 4. Fibración Topológica de Hopf & Cuaterniones (Círculos de Villarceau)
function buildHopf3D(epColor) {
  const group = new THREE.Group();
  const numRings = 10;
  const rings = [];
  for (let k = 0; k < numRings; k++) {
    const theta = (k / numRings) * Math.PI;
    const ringGeo = new THREE.TorusGeometry(0.85, 0.024, 8, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: epColor,
      roughness: 0.2,
      metalness: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 4 + theta * 0.5;
    ringMesh.rotation.y = theta;
    group.add(ringMesh);
    rings.push(ringMesh);
  }
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      rings.forEach((r, idx) => {
        r.rotation.z += 0.006 * (idx % 2 === 0 ? 1 : -1);
      });
    }
  };
}

// 5. Superficie Mínima Triplemente Periódica (TPMS Gyroid)
function buildTPMSGyroid3D(epColor) {
  const group = new THREE.Group();
  const cellGeo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const u = (uNorm - 0.5) * Math.PI * 2;
    const v = (vNorm - 0.5) * Math.PI * 2;
    const z = 0.45 * Math.sin(u) * Math.cos(v);
    const r = 0.85 * (1 + 0.15 * Math.cos(u * 2));
    return {
      x: r * Math.sin(uNorm * Math.PI) * Math.cos(v),
      y: r * Math.cos(uNorm * Math.PI),
      z: z
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(cellGeo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(cellGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x += 0.004;
    }
  };
}

// 6. Orbital Cuántico & Armónicos Esféricos Y_l^m (Schrödinger / Dirac)
function buildQuantumOrbital3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(32, 32, (uNorm, vNorm) => {
    const theta = uNorm * Math.PI;
    const phi = vNorm * Math.PI * 2;
    const cosT = Math.cos(theta);
    const Y20 = 0.5 * Math.abs(3 * cosT * cosT - 1);
    const r = 0.22 + 0.82 * Y20;
    return {
      x: r * Math.sin(theta) * Math.cos(phi),
      y: r * Math.cos(theta),
      z: r * Math.sin(theta) * Math.sin(phi)
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.2,
    metalness: 0.85,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  const ringGeo = new THREE.TorusGeometry(0.55, 0.03, 12, 40);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  let waveT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.01;
      waveT += dt * 3.0;
      const s = 1.0 + 0.05 * Math.sin(waveT);
      mesh.scale.set(s, 1.0 + 0.08 * Math.sin(waveT), s);
    }
  };
}

// 7. Embudo Gravitacional de Schwarzschild (Paraboloide de Flamm)
function buildSchwarzschild3D(epColor) {
  const group = new THREE.Group();
  const funnelGeo = createParametricSurface(24, 36, (uNorm, vNorm) => {
    const r_norm = 0.35 + uNorm * 0.82;
    const phi = vNorm * Math.PI * 2;
    const z = -0.92 * Math.sqrt(Math.max(0, (r_norm - 0.35) / 0.82));
    return {
      x: r_norm * Math.cos(phi),
      y: z + 0.35,
      z: r_norm * Math.sin(phi)
    };
  });
  const funnelMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.35,
    metalness: 0.7,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(funnelGeo, funnelMat));

  const bhGeo = new THREE.SphereGeometry(0.34, 24, 24);
  const bhMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
  const bhMesh = new THREE.Mesh(bhGeo, bhMat);
  bhMesh.position.y = -0.55;
  group.add(bhMesh);

  const accGeo = new THREE.TorusGeometry(0.58, 0.025, 8, 48);
  const accMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const accRing = new THREE.Mesh(accGeo, accMat);
  accRing.rotation.x = Math.PI / 2;
  accRing.position.y = -0.22;
  group.add(accRing);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.012;
      accRing.rotation.z += 0.025;
    }
  };
}

// 8. Doble Cono de Luz de Minkowski & Intervalo Espaciotemporal
function buildMinkowski3D(epColor) {
  const group = new THREE.Group();
  const coneGeo1 = new THREE.ConeGeometry(0.85, 0.95, 32, 1, true);
  const coneMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  const futureCone = new THREE.Mesh(coneGeo1, coneMat);
  futureCone.position.y = 0.475;
  group.add(futureCone);

  const pastCone = new THREE.Mesh(coneGeo1, coneMat);
  pastCone.rotation.x = Math.PI;
  pastCone.position.y = -0.475;
  group.add(pastCone);

  const linePts = [new THREE.Vector3(0, -0.95, 0), new THREE.Vector3(0, 0.95, 0)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
    }
  };
}

// 9. Vórtice Turbulento de Navier-Stokes & Filamentos en Cascada (Vórtice de Burgers Real)
// Solución analítica exacta de Navier-Stokes axisimétrico bajo estiramiento de vorticidad (ω·∇)u = ν∇²ω:
// Inflow radial:       u_r = -a * r
// Estiramiento axial:  u_y = 2 * a * y
// Vorticidad azimutal: u_theta = (Gamma / (2*pi*r)) * (1 - exp(-r² / r₀²))
// Núcleo de vorticidad: ω_y = (Gamma / (pi*r₀²)) * exp(-r² / r₀²)
function buildNavierStokesVortex3D(epColor) {
  const group = new THREE.Group();

  const aStrain = 0.45;
  const r0Core = 0.25;
  const gammaCirc = 3.8;
  const r0Sq = r0Core * r0Core;

  // Función analítica del campo de velocidades tridimensional de Burgers
  function burgersVelocity(x, y, z) {
    const r = Math.sqrt(x * x + z * z) + 1e-6;
    const ur = -aStrain * r;
    const utheta = (gammaCirc / (2.0 * Math.PI * r)) * (1.0 - Math.exp(-(r * r) / r0Sq));
    const uy = 2.0 * aStrain * y;

    const cosT = x / r;
    const sinT = z / r;
    const vx = ur * cosT - utheta * sinT;
    const vz = ur * sinT + utheta * cosT;
    return { vx, vy: uy, vz };
  }

  // A. Vaina Isóbara de Depresión Central (Criterio Q > 0 / Isosuperficie de Presión Barométrica)
  // Superficie hiperbólica continua con Shader Fresnel y disipación exponencial en los bordes
  const funnelGeo = createParametricSurface(36, 48, (uNorm, vNorm) => {
    const y = (uNorm - 0.5) * 1.9;
    const r = r0Core * Math.sqrt(1.0 + 2.6 * y * y);
    const th = vNorm * Math.PI * 2;
    return {
      x: r * Math.cos(th),
      y: y,
      z: r * Math.sin(th)
    };
  });

  const funnelShaderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color(0x0284c7) },
      uColorShear: { value: new THREE.Color(0x38bdf8) },
      uColorGlow: { value: new THREE.Color(0xa5f3fc) }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = position;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorCore;
      uniform vec3 uColorShear;
      uniform vec3 uColorGlow;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.2);

        // Desvanecimiento orgánico en los extremos axiales para eliminar corte artificial de CAD
        float yNorm = abs(vWorldPosition.y) / 0.95;
        float edgeFade = smoothstep(1.0, 0.45, yNorm);

        // Rizo de corte azimutal continuo
        float angle = atan(vWorldPosition.z, vWorldPosition.x);
        float swirl = sin(angle * 6.0 - vWorldPosition.y * 7.5 - uTime * 3.2);

        vec3 baseColor = mix(uColorCore, uColorShear, clamp(swirl * 0.4 + 0.6, 0.0, 1.0));
        vec3 finalColor = mix(baseColor, uColorGlow, fresnel * 0.8);
        float alpha = (0.22 + 0.60 * fresnel) * edgeFade;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const funnelMesh = new THREE.Mesh(funnelGeo, funnelShaderMat);
  group.add(funnelMesh);

  // B. Filamento de Vorticidad Extrema en el Núcleo (ω_z máximo en r ≤ 0.06)
  // Cordón axial luminoso en torsión helicoidal de alta energía
  const corePts = [];
  const numCorePts = 100;
  for (let i = 0; i <= numCorePts; i++) {
    const t = i / numCorePts;
    const y = (t - 0.5) * 1.85;
    const coreR = 0.038 * (1.0 + 0.25 * Math.sin(y * 10.0));
    const coreTh = y * 14.0;
    corePts.push(new THREE.Vector3(coreR * Math.cos(coreTh), y, coreR * Math.sin(coreTh)));
  }
  const coreCurve = new THREE.CatmullRomCurve3(corePts);
  const coreGeo = new THREE.TubeGeometry(coreCurve, 80, 0.018, 8, false);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // C. Haz de 8 Líneas de Corriente Integradas por Runge-Kutta 4 (RK4)
  // Trazadas rigurosamente paso a paso sobre el campo u(x, y, z) sin saltos poligonales
  const streamlinesGroup = new THREE.Group();
  const numHel = 8;
  const lineSteps = 56;
  const dtRK = 0.036;

  for (let h = 0; h < numHel; h++) {
    const phi0 = (h / numHel) * Math.PI * 2;
    const isTop = (h % 2 === 0);
    let curX = 0.65 * Math.cos(phi0);
    let curY = isTop ? 0.88 : -0.88;
    let curZ = 0.65 * Math.sin(phi0);
    const dir = isTop ? -1.0 : 1.0;

    const pts = [new THREE.Vector3(curX, curY, curZ)];

    for (let s = 0; s < lineSteps; s++) {
      const k1 = burgersVelocity(curX, curY, curZ);
      const k2 = burgersVelocity(
        curX + 0.5 * dtRK * dir * k1.vx,
        curY + 0.5 * dtRK * dir * k1.vy,
        curZ + 0.5 * dtRK * dir * k1.vz
      );
      const k3 = burgersVelocity(
        curX + 0.5 * dtRK * dir * k2.vx,
        curY + 0.5 * dtRK * dir * k2.vy,
        curZ + 0.5 * dtRK * dir * k2.vz
      );
      const k4 = burgersVelocity(
        curX + dtRK * dir * k3.vx,
        curY + dtRK * dir * k3.vy,
        curZ + dtRK * dir * k3.vz
      );

      curX += (dtRK * dir / 6.0) * (k1.vx + 2.0 * k2.vx + 2.0 * k3.vx + k4.vx);
      curY += (dtRK * dir / 6.0) * (k1.vy + 2.0 * k2.vy + 2.0 * k3.vy + k4.vy);
      curZ += (dtRK * dir / 6.0) * (k1.vz + 2.0 * k2.vz + 2.0 * k3.vz + k4.vz);

      pts.push(new THREE.Vector3(curX, curY, curZ));
      if (Math.abs(curY) > 0.95 || Math.sqrt(curX * curX + curZ * curZ) < 0.03) break;
    }

    const sGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const sMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending
    });
    const sLine = new THREE.Line(sGeo, sMat);
    streamlinesGroup.add(sLine);
  }
  group.add(streamlinesGroup);

  // D. Anillos de Diagnóstico Isóbaro (PIV Láser de Laboratorio a y = -0.42, 0.0, +0.42)
  const ringsGroup = new THREE.Group();
  const ringYs = [-0.42, 0.0, 0.42];
  ringYs.forEach(ry => {
    const rIso = r0Core * Math.sqrt(1.0 + 2.6 * ry * ry);
    const rGeo = new THREE.RingGeometry(rIso - 0.007, rIso + 0.007, 48);
    const rMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const rMesh = new THREE.Mesh(rGeo, rMat);
    rMesh.position.y = ry;
    rMesh.rotation.x = Math.PI / 2;
    ringsGroup.add(rMesh);
  });
  group.add(ringsGroup);

  // E. Trazadores Lagrangianos en Advección Viva Continua (72 partículas transportadas por u(x))
  const numP = 72;
  const pPositions = new Float32Array(numP * 3);
  const pColors = new Float32Array(numP * 3);

  function resetParticle(k) {
    const isTop = Math.random() > 0.5;
    const y = (isTop ? 1 : -1) * (0.65 + Math.random() * 0.25);
    const r = 0.50 + Math.random() * 0.25;
    const th = Math.random() * Math.PI * 2;
    pPositions[k * 3]     = r * Math.cos(th);
    pPositions[k * 3 + 1] = y;
    pPositions[k * 3 + 2] = r * Math.sin(th);
  }

  for (let k = 0; k < numP; k++) {
    resetParticle(k);
    pColors[k * 3]     = 0.22;
    pColors[k * 3 + 1] = 0.74;
    pColors[k * 3 + 2] = 0.97;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.046,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const pMesh = new THREE.Points(pGeo, pMat);
  group.add(pMesh);

  let totalSimTime = 0;

  return {
    group,
    update: (dt) => {
      totalSimTime += dt;
      funnelShaderMat.uniforms.uTime.value = totalSimTime;
      
      // Rotación global sutil de coherencia angular
      streamlinesGroup.rotation.y += 0.015;
      coreMesh.rotation.y += 0.035;

      // Advección Lagrangiana exacta en tiempo real
      const advectDt = Math.min(dt, 0.05) * 1.35;
      for (let k = 0; k < numP; k++) {
        const px = pPositions[k * 3];
        const py = pPositions[k * 3 + 1];
        const pz = pPositions[k * 3 + 2];

        const v = burgersVelocity(px, py, pz);

        pPositions[k * 3]     += v.vx * advectDt;
        pPositions[k * 3 + 1] += v.vy * advectDt;
        pPositions[k * 3 + 2] += v.vz * advectDt;

        const rCurr = Math.sqrt(pPositions[k * 3] * pPositions[k * 3] + pPositions[k * 3 + 2] * pPositions[k * 3 + 2]);
        const yCurr = pPositions[k * 3 + 1];

        // Mapeo termocromático de vorticidad: blanco incandescente en el cuello, cerúleo en periferia
        const coreFactor = Math.min(1.0, 0.18 / (rCurr + 0.05));
        pColors[k * 3]     = 0.22 + 0.78 * coreFactor;
        pColors[k * 3 + 1] = 0.74 + 0.26 * coreFactor;
        pColors[k * 3 + 2] = 1.0;

        // Reciclado suave si la partícula sale del volumen de confinamiento
        if (Math.abs(yCurr) > 0.94 || rCurr < 0.032 || rCurr > 0.88) {
          resetParticle(k);
        }
      }
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.color.needsUpdate = true;
    }
  };
}

// 9B. Tubo de Venturi de Bernoulli (Caída de Presión por Aceleración de Flujo)
function buildBernoulliTube3D(epColor) {
  const group = new THREE.Group();
  
  const venturiGeo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.8;
    const r = 0.52 - 0.26 * Math.exp(-x * x / 0.14);
    const th = vNorm * Math.PI * 2;
    return { x, y: r * Math.cos(th), z: r * Math.sin(th) };
  });
  const venturiMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.15,
    metalness: 0.3,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(venturiGeo, venturiMat));

  const m1Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12);
  const m1Mat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.8 });
  const m1 = new THREE.Mesh(m1Geo, m1Mat);
  m1.position.set(-0.65, 0.65, 0);
  group.add(m1);

  const m2Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12);
  const m2 = new THREE.Mesh(m2Geo, m1Mat);
  m2.position.set(0, 0.38, 0);
  group.add(m2);

  const streamPts = [];
  [-0.15, 0, 0.15].forEach(yOff => {
    for (let i = 0; i <= 30; i++) {
      const x = (i / 30 - 0.5) * 1.7;
      const r = (0.52 - 0.26 * Math.exp(-x * x / 0.14)) * 0.6;
      streamPts.push(x, yOff * (r / 0.32), 0);
    }
  });
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.Float32BufferAttribute(streamPts, 3));
  group.add(new THREE.Line(sGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x = 0.25;
    }
  };
}

// 9C. Celdas de Convección Térmica de Bénard (Hexágonos de Rayleigh-Bénard)
function buildBenardConvection3D(epColor) {
  const group = new THREE.Group();
  const hexR = 0.42;
  const centers = [
    [0, 0],
    [hexR * Math.sqrt(3), 0],
    [-hexR * Math.sqrt(3), 0],
    [hexR * Math.sqrt(3)/2, hexR * 1.5],
    [-hexR * Math.sqrt(3)/2, hexR * 1.5],
    [hexR * Math.sqrt(3)/2, -hexR * 1.5],
    [-hexR * Math.sqrt(3)/2, -hexR * 1.5]
  ];

  centers.forEach(([cx, cy], idx) => {
    const hexGeo = new THREE.CylinderGeometry(hexR * 0.95, hexR * 0.95, 0.35, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: idx === 0 ? epColor : 0x3b82f6,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.65
    });
    const cell = new THREE.Mesh(hexGeo, hexMat);
    cell.position.set(cx, 0, cy);
    group.add(cell);

    const torGeo = new THREE.TorusGeometry(hexR * 0.45, 0.025, 8, 24);
    const torMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const tor = new THREE.Mesh(torGeo, torMat);
    tor.rotation.x = Math.PI / 2;
    tor.position.set(cx, 0.18, cy);
    group.add(tor);
  });

  group.scale.set(0.68, 0.68, 0.68);
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.45;
    }
  };
}

// 10A. Resorte Helicoidal Elástico de Hooke (F = -kx)
function buildHookeSpring3D(epColor) {
  const group = new THREE.Group();
  
  const turns = 7;
  const pts = [];
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const angle = t * Math.PI * 2 * turns;
    const r = 0.28;
    const y = 0.65 - t * 1.1;
    pts.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const springGeo = new THREE.TubeGeometry(curve, 80, 0.028, 8, false);
  const springMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 });
  const springMesh = new THREE.Mesh(springGeo, springMat);
  group.add(springMesh);

  const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
  const topCap = new THREE.Mesh(capGeo, capMat);
  topCap.position.y = 0.68;
  group.add(topCap);

  const bobGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.32, 24);
  const bobMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 });
  const bob = new THREE.Mesh(bobGeo, bobMat);
  bob.position.y = -0.58;
  group.add(bob);

  const arrowGeo = new THREE.ConeGeometry(0.08, 0.22, 16);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  arrow.position.set(0, -0.22, 0.32);
  group.add(arrow);

  let oscT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      oscT += dt * 4.5;
      const disp = Math.sin(oscT) * 0.16;
      springMesh.scale.set(1.0, 1.0 + disp * 0.5, 1.0);
      bob.position.y = -0.58 + disp;
      arrow.position.y = -0.22 + disp;
      arrow.rotation.x = disp > 0 ? Math.PI : 0;
    }
  };
}

// 10B. Ley de la Palanca de Arquímedes (Equilibrio de Momentos F₁d₁ = F₂d₂)
function buildLeverArchimedes3D(epColor) {
  const group = new THREE.Group();
  
  const fulcrumGeo = new THREE.ConeGeometry(0.25, 0.45, 4);
  const fulcrumMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.4, metalness: 0.7 });
  const fulcrum = new THREE.Mesh(fulcrumGeo, fulcrumMat);
  fulcrum.rotation.y = Math.PI / 4;
  fulcrum.position.y = -0.22;
  group.add(fulcrum);

  const barGroup = new THREE.Group();
  const barGeo = new THREE.BoxGeometry(1.9, 0.06, 0.14);
  const barMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.25, metalness: 0.85 });
  barGroup.add(new THREE.Mesh(barGeo, barMat));

  const m1Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16);
  const m1Mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.9 });
  const m1 = new THREE.Mesh(m1Geo, m1Mat);
  m1.position.set(-0.35, 0.17, 0);
  barGroup.add(m1);

  const m2Geo = new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16);
  const m2 = new THREE.Mesh(m2Geo, m1Mat);
  m2.position.set(0.85, 0.11, 0);
  barGroup.add(m2);

  group.add(barGroup);

  let rockT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      rockT += dt * 2.0;
      barGroup.rotation.z = Math.sin(rockT) * 0.06;
    }
  };
}

// 10C. Principio de Flotabilidad de Arquímedes (E = ρ g V)
function buildBuoyancy3D(epColor) {
  const group = new THREE.Group();

  const fluidGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.95, 24);
  const fluidMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.35
  });
  group.add(new THREE.Mesh(fluidGeo, fluidMat));

  const surfGeo = new THREE.RingGeometry(0.02, 0.74, 24);
  const surfMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const surf = new THREE.Mesh(surfGeo, surfMat);
  surf.rotation.x = Math.PI / 2;
  surf.position.y = 0.46;
  group.add(surf);

  const bodyGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
  const bodyMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.8 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.32;
  group.add(body);

  const empujeGeo = new THREE.ConeGeometry(0.07, 0.25, 12);
  const empujeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const empuje = new THREE.Mesh(empujeGeo, empujeMat);
  empuje.position.set(0, 0.75, 0);
  group.add(empuje);

  const empujeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.32, 0), new THREE.Vector3(0, 0.75, 0)]),
    new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 })
  );
  group.add(empujeLine);

  let floatT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      floatT += dt * 3.0;
      const bobY = Math.sin(floatT) * 0.035;
      body.position.y = 0.32 + bobY;
      empuje.position.y = 0.75 + bobY;
    }
  };
}

// 10D. Leyes del Movimiento de Newton (Inercia, F = ma, Acción y Reacción)
function buildNewtonMechanics3D(epColor) {
  const group = new THREE.Group();

  const railGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 16);
  const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.8 });
  const rail = new THREE.Mesh(railGeo, railMat);
  rail.rotation.z = Math.PI / 2;
  group.add(rail);

  const massGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
  const massMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 });
  const massMesh = new THREE.Mesh(massGeo, massMat);
  group.add(massMesh);

  const fGeo = new THREE.ConeGeometry(0.06, 0.22, 12);
  const fMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const fCone = new THREE.Mesh(fGeo, fMat);
  fCone.rotation.z = -Math.PI / 2;
  fCone.position.set(0.42, 0, 0);
  massMesh.add(fCone);

  const rMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const rCone = new THREE.Mesh(fGeo, rMat);
  rCone.rotation.z = Math.PI / 2;
  rCone.position.set(-0.42, 0, 0);
  massMesh.add(rCone);

  let newtonT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      newtonT += dt * 3.0;
      massMesh.position.x = Math.sin(newtonT) * 0.45;
    }
  };
}

// 10E. Frentes de Onda del Efecto Doppler (Compresión y Dilatación Espectral)
function buildDoppler3D(epColor) {
  const group = new THREE.Group();
  
  const sourceGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const sourceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const source = new THREE.Mesh(sourceGeo, sourceMat);
  source.position.set(0.42, 0, 0);
  group.add(source);

  const rings = [];
  const numRings = 6;
  for (let k = 0; k < numRings; k++) {
    const frac = (k + 1) / numRings;
    const r = frac * 0.95;
    const xCenter = (1.0 - frac) * 0.42;
    const ringGeo = new THREE.TorusGeometry(r, 0.016, 8, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: k % 2 === 0 ? 0x38bdf8 : epColor,
      transparent: true,
      opacity: 0.85 - frac * 0.4
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(xCenter, 0, 0);
    group.add(ring);
    rings.push({ mesh: ring, baseR: r, baseCenter: xCenter });
  }

  let dopT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      group.rotation.x = 0.35;
      dopT += dt * 2.0;
      rings.forEach((r, idx) => {
        const pulse = 1.0 + 0.08 * Math.sin(dopT + idx * 0.8);
        r.mesh.scale.set(pulse, pulse, 1.0);
      });
    }
  };
}

// 10F. Onda de D'Alembert & Modos Armónicos de Cuerda Tensada (1747)
// Solución analítica exacta: ∂²u/∂t² = c² ∂²u/∂x² con u(x, t) = f(x - ct) + g(x + ct)
// Superposición de modos estacionarios y descomposición en ondas viajeras contrarias
function buildWaveString3D(epColor) {
  const group = new THREE.Group();

  // A. Puentes de Resonancia y Tensión en Latón Torneado (Cejuelas de Melde)
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    metalness: 0.85,
    roughness: 0.25
  });
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.6,
    roughness: 0.5
  });

  // Base de resonancia de grafito/madera acústica
  const baseGeo = new THREE.BoxGeometry(2.1, 0.08, 0.35);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.38;
  group.add(baseMesh);

  // Cejuelas de soporte en x = -0.92 y x = +0.92
  const bridgeGeo = new THREE.BoxGeometry(0.08, 0.42, 0.22);
  const post1 = new THREE.Mesh(bridgeGeo, bridgeMat);
  post1.position.set(-0.92, -0.17, 0);
  group.add(post1);

  const post2 = new THREE.Mesh(bridgeGeo, bridgeMat);
  post2.position.set(0.92, -0.17, 0);
  group.add(post2);

  // Clavijas micrométricas de tensión en los extremos
  const pegGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 12);
  const peg1 = new THREE.Mesh(pegGeo, bridgeMat);
  peg1.rotation.z = Math.PI / 2;
  peg1.position.set(-0.98, 0.02, 0);
  group.add(peg1);

  const peg2 = new THREE.Mesh(pegGeo, bridgeMat);
  peg2.rotation.z = Math.PI / 2;
  peg2.position.set(0.98, 0.02, 0);
  group.add(peg2);

  // B. Cuerda Principal Tensada de Alta Energía (Modos Armónicos Vibrantes)
  const N = 80;
  const L = 1.84; // Distancia libre entre cejuelas
  const xStart = -0.92;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = xStart + (i / N) * L;
    pts.push(new THREE.Vector3(x, 0.04, 0));
  }
  const waveGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const waveLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({
    color: 0x67e8f9,
    linewidth: 3,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  }));
  group.add(waveLine);

  // Segunda pasada para dar halo de resonancia luminosa a la cuerda
  const haloLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({
    color: 0x0284c7,
    linewidth: 5,
    transparent: true,
    opacity: 0.60,
    blending: THREE.AdditiveBlending
  }));
  group.add(haloLine);

  // C. Lámina Planar de Envolvente Resonante (Planar Wave Envelope - Cero volumen hinchado)
  // Muestra el rango de oscilación transversal u_max(x) en el plano vertical XY con degradado suave
  const envGeo = createParametricSurface(40, 6, (uNorm, vNorm) => {
    const x = xStart + uNorm * L;
    const maxAmp = 0.30 * Math.sin(uNorm * Math.PI);
    const y = 0.04 + (vNorm * 2.0 - 1.0) * maxAmp;
    const z = (vNorm - 0.5) * 0.012; // Espesor planar mínimo
    return { x, y, z };
  });
  const envMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const envMesh = new THREE.Mesh(envGeo, envMat);
  group.add(envMesh);

  // Líneas de cresta de envolvente superior e inferior
  const envUpperPts = [];
  const envLowerPts = [];
  for (let i = 0; i <= N; i++) {
    const x = xStart + (i / N) * L;
    const maxAmp = 0.30 * Math.sin((i / N) * Math.PI);
    envUpperPts.push(new THREE.Vector3(x, 0.04 + maxAmp, 0));
    envLowerPts.push(new THREE.Vector3(x, 0.04 - maxAmp, 0));
  }
  const envUpperGeo = new THREE.BufferGeometry().setFromPoints(envUpperPts);
  const envLowerGeo = new THREE.BufferGeometry().setFromPoints(envLowerPts);
  const envLineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.50,
    blending: THREE.AdditiveBlending
  });
  group.add(new THREE.Line(envUpperGeo, envLineMat));
  group.add(new THREE.Line(envLowerGeo, envLineMat));

  // D. Nodos Estáticos de Resonancia Harmónica (Nodal Rings en x = 0 y x = ±L/3)
  const nodeMarkers = [];
  const nodeXs = [0.0, -L / 3, L / 3];
  nodeXs.forEach(nx => {
    const ringGeo = new THREE.RingGeometry(0.035, 0.05, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdfc285,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(nx, 0.04, 0);
    group.add(ring);
    nodeMarkers.push(ring);
  });

  // E. Ondas Viajeras de D'Alembert f(x - ct) [Cian] y g(x + ct) [Oro]
  // Dos pulsos solitarios que viajan en direcciones opuestas en planos desplazados z = ±0.06
  const pulseN = 50;
  const fPts = [];
  const gPts = [];
  for (let i = 0; i <= pulseN; i++) {
    const x = xStart + (i / pulseN) * L;
    fPts.push(new THREE.Vector3(x, -0.22, 0.06));
    gPts.push(new THREE.Vector3(x, -0.22, -0.06));
  }
  const fGeo = new THREE.BufferGeometry().setFromPoints(fPts);
  const gGeo = new THREE.BufferGeometry().setFromPoints(gPts);
  const fLine = new THREE.Line(fGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
  const gLine = new THREE.Line(gGeo, new THREE.LineBasicMaterial({ color: 0xdfc285, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
  group.add(fLine);
  group.add(gLine);

  let waveTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      waveTime += dt * 4.8;

      // 1. Vibración de la cuerda principal: Superposición exacta de modos normales
      const positions = waveGeo.attributes.position.array;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const yMode1 = 0.24 * Math.sin(u * Math.PI) * Math.sin(waveTime);
        const yMode2 = 0.09 * Math.sin(u * 2.0 * Math.PI) * Math.cos(waveTime * 2.0);
        const yMode3 = 0.04 * Math.sin(u * 3.0 * Math.PI) * Math.sin(waveTime * 3.0);
        positions[i * 3 + 1] = 0.04 + yMode1 + yMode2 + yMode3;
      }
      waveGeo.attributes.position.needsUpdate = true;

      // 2. Pulsos de D'Alembert f(x - ct) hacia la derecha y g(x + ct) hacia la izquierda
      const fPos = fGeo.attributes.position.array;
      const gPos = gGeo.attributes.position.array;
      const c = 0.85;
      const centerF = xStart + ((waveTime * c) % L);
      const centerG = (xStart + L) - ((waveTime * c) % L);
      for (let i = 0; i <= pulseN; i++) {
        const x = xStart + (i / pulseN) * L;
        const dF = x - centerF;
        const pulseF = 0.13 * Math.exp(-(dF * dF) / 0.025);
        fPos[i * 3 + 1] = -0.22 + pulseF;

        const dG = x - centerG;
        const pulseG = 0.13 * Math.exp(-(dG * dG) / 0.025);
        gPos[i * 3 + 1] = -0.22 + pulseG;
      }
      fGeo.attributes.position.needsUpdate = true;
      gGeo.attributes.position.needsUpdate = true;

      // 3. Pulsación armónica de los anillos nodales
      nodeMarkers.forEach((ring, idx) => {
        const scale = 1.0 + 0.14 * Math.sin(waveTime * 2.0 + idx * 1.2);
        ring.scale.set(scale, scale, 1.0);
      });
    }
  };
}

// 10. Solitón Hidrodinámico de Russell & KdV (Onda Solitaria No-Lineal en Canal)
function buildKdvSoliton3D(epColor) {
  const group = new THREE.Group();

  // Canal de agua horizontal
  const flumeGeo = new THREE.BoxGeometry(1.9, 0.08, 0.55);
  const flumeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
  const flume = new THREE.Mesh(flumeGeo, flumeMat);
  flume.position.y = -0.35;
  group.add(flume);

  // Perfil de solitón sech²(x - ct)
  const N = 48;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N - 0.5) * 1.8;
    const sech = 1.0 / Math.cosh(x * 3.5);
    const y = sech * sech * 0.55 - 0.32;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const solGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const solLine = new THREE.Line(solGeo, new THREE.LineBasicMaterial({ color: epColor, linewidth: 3 }));
  group.add(solLine);

  // Superficie fluida del solitón en el canal
  const solMeshGeo = createParametricSurface(24, 16, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.8;
    const z = (vNorm - 0.5) * 0.5;
    const sech = 1.0 / Math.cosh(x * 3.5);
    const y = sech * sech * 0.52 - 0.32;
    return { x, y, z };
  });
  const solMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.15,
    metalness: 0.6,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(solMeshGeo, solMat));

  let solShift = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      solShift += dt * 0.6;
      if (solShift > 1.8) solShift = 0;
    }
  };
}

// 10G. Superficie de Curva Elíptica de Weierstrass (Fermat, Beal y Aritmética Modular)
function buildEllipticCurveSurface3D(epColor) {
  const group = new THREE.Group();
  
  const geo = createParametricSurface(28, 28, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.6;
    const th = vNorm * Math.PI * 2;
    const rhs = Math.max(0.04, x * x * x - 0.7 * x + 0.35);
    const r = Math.sqrt(rhs) * 0.65;
    return {
      x: x * 0.95,
      y: r * Math.sin(th),
      z: r * Math.cos(th)
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.78
  });
  group.add(new THREE.Mesh(geo, mat));

  const pts = [
    [-0.5, 0.45, 0], [-0.5, -0.45, 0],
    [0.1, 0.38, 0.2], [0.1, -0.38, -0.2],
    [0.65, 0.65, 0], [0.65, -0.65, 0]
  ];
  pts.forEach(([px, py, pz]) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    dot.position.set(px, py, pz);
    group.add(dot);
  });

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.z += 0.004;
    }
  };
}

// 10H. Proyección Tridimensional del Hipercubo Booleano 4D (Tesseract · P vs NP)
function buildComplexityHypercube3D(epColor) {
  const group = new THREE.Group();

  const verts4D = [];
  for (let i = 0; i < 16; i++) {
    verts4D.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1
    ]);
  }

  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let b = 0; b < 4; b++) {
      const j = i ^ (1 << b);
      if (i < j) edges.push([i, j]);
    }
  }

  const vMeshes = [];
  verts4D.forEach(() => {
    const vMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    group.add(vMesh);
    vMeshes.push(vMesh);
  });

  const linePts = [];
  edges.forEach(() => {
    linePts.push(new THREE.Vector3(), new THREE.Vector3());
  });
  const edgeGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const edgeLine = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: epColor, transparent: true, opacity: 0.8 }));
  group.add(edgeLine);

  let rot4D = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      rot4D += dt * 1.2;
      const cosT = Math.cos(rot4D);
      const sinT = Math.sin(rot4D);

      const proj3D = verts4D.map(([x, y, z, w]) => {
        const xRot = x * cosT - w * sinT;
        const wRot = x * sinT + w * cosT;
        const dist = 2.4;
        const fov = 1.0 / (dist - wRot * 0.45);
        return new THREE.Vector3(xRot * fov * 0.85, y * fov * 0.85, z * fov * 0.85);
      });

      proj3D.forEach((p, idx) => vMeshes[idx].position.copy(p));

      const posAttr = edgeGeo.attributes.position.array;
      edges.forEach(([i, j], eIdx) => {
        const p1 = proj3D[i];
        const p2 = proj3D[j];
        posAttr[eIdx * 6]     = p1.x;
        posAttr[eIdx * 6 + 1] = p1.y;
        posAttr[eIdx * 6 + 2] = p1.z;
        posAttr[eIdx * 6 + 3] = p2.x;
        posAttr[eIdx * 6 + 4] = p2.y;
        posAttr[eIdx * 6 + 5] = p2.z;
      });
      edgeGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 10I. Flujo de Ricci & Regularización Topológica (Perelman · Poincaré)
function buildRicciFlow3D(epColor) {
  const group = new THREE.Group();

  let flowT = 0;
  const geo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const z = (uNorm - 0.5) * 1.8;
    const neck = 0.28 + 0.35 * (1.0 - Math.exp(-z * z / 0.15));
    const th = vNorm * Math.PI * 2;
    return { x: neck * Math.cos(th), y: z, z: neck * Math.sin(th) };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x += 0.004;
      flowT += dt * 1.5;
      const s = 1.0 + 0.08 * Math.sin(flowT);
      mesh.scale.set(s, 1.0 - 0.05 * Math.sin(flowT), s);
    }
  };
}

// 10J. Curvatura Espaciotemporal de Einstein (Ecuación de Campo G_μν = 8πG T_μν)
function buildEinsteinCurvature3D(epColor) {
  const group = new THREE.Group();

  const gridGeo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 2.0;
    const y = (vNorm - 0.5) * 2.0;
    const r = Math.hypot(x, y);
    const z = -0.75 / (1.0 + r * r * 3.5);
    return { x, y: z, z: y };
  });
  const gridMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.3,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(gridGeo, gridMat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(gridGeo), new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 })));

  const massGeo = new THREE.SphereGeometry(0.25, 20, 20);
  const massMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.15, metalness: 0.9, emissive: epColor, emissiveIntensity: 0.4 });
  const mass = new THREE.Mesh(massGeo, massMat);
  mass.position.y = -0.52;
  group.add(mass);

  const rayPts = [];
  for (let i = 0; i <= 30; i++) {
    const t = (i / 30 - 0.5) * 2.0;
    const def = -0.32 / (1.0 + t * t * 4.0);
    rayPts.push(new THREE.Vector3(t, def - 0.1, 0.45 + def * 0.3));
  }
  const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPts);
  group.add(new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      mass.rotation.y += 0.015;
    }
  };
}

// 10K. Expansión Cósmica de Hubble & Friedmann (v = H₀ d · Redshift Relativista)
function buildHubbleExpansion3D(epColor) {
  const group = new THREE.Group();

  const numG = 36;
  const galaxies = [];
  const gGeo = new THREE.BufferGeometry();
  const gPos = new Float32Array(numG * 3);
  const gColors = new Float32Array(numG * 3);

  for (let i = 0; i < numG; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = (Math.random() - 0.5) * Math.PI;
    const r0 = 0.25 + Math.random() * 0.65;
    galaxies.push({ r0, th, ph });

    const color = new THREE.Color().setHSL(0.55 - r0 * 0.55, 0.9, 0.55);
    gColors[i * 3]     = color.r;
    gColors[i * 3 + 1] = color.g;
    gColors[i * 3 + 2] = color.b;
  }
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  gGeo.setAttribute('color', new THREE.BufferAttribute(gColors, 3));

  const gPoints = new THREE.Points(gGeo, new THREE.PointsMaterial({ size: 0.065, vertexColors: true }));
  group.add(gPoints);

  const sphereWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(0.95, 12, 12)),
    new THREE.LineBasicMaterial({ color: epColor, transparent: true, opacity: 0.25 })
  );
  group.add(sphereWire);

  let hubbleT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      hubbleT += dt * 1.8;
      const scaleA = 1.0 + 0.35 * Math.sin(hubbleT);
      const positions = gGeo.attributes.position.array;
      for (let i = 0; i < numG; i++) {
        const g = galaxies[i];
        const r = g.r0 * scaleA;
        positions[i * 3]     = r * Math.cos(g.ph) * Math.sin(g.th);
        positions[i * 3 + 1] = r * Math.sin(g.ph);
        positions[i * 3 + 2] = r * Math.cos(g.ph) * Math.cos(g.th);
      }
      gGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 10L. Superficie de Volatilidad de Black-Scholes (Sonrisa de Volatilidad & EDP de Difusión)
function buildBlackScholesSurface3D(epColor) {
  const group = new THREE.Group();

  const geo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const s = (uNorm - 0.5) * 1.8;
    const tau = vNorm * 1.6;
    const d1 = s / (0.35 * Math.sqrt(Math.max(0.08, tau)));
    const v = Math.max(0, s) * 0.45 + 0.28 * Math.exp(-d1 * d1 * 0.5) * Math.sqrt(tau);
    return {
      x: s * 0.95,
      y: (v - 0.4) * 0.85,
      z: (tau - 0.8) * 0.95
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  const pathPts = [];
  let curS = -0.8;
  for (let i = 0; i <= 30; i++) {
    const tau = (i / 30) * 1.6;
    curS += (Math.random() - 0.48) * 0.12;
    pathPts.push(new THREE.Vector3(curS, 0.15 + curS * 0.3, tau - 0.8));
  }
  const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPts);
  group.add(new THREE.Line(pathGeo, new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x = 0.35;
    }
  };
}

// 10M. Viga Elástica de Euler-Bernoulli (Deformación por Flexión EI w'''' = q)
function buildEulerBeam3D(epColor) {
  const group = new THREE.Group();

  const wallGeo = new THREE.BoxGeometry(0.12, 0.85, 0.45);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8 });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(-0.85, 0, 0);
  group.add(wall);

  const pts = [];
  const N = 32;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = -0.8 + t * 1.6;
    const deflection = -0.38 * (3 * t * t - t * t * t) / 2.0;
    pts.push(new THREE.Vector3(x, deflection, 0));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const beamGeo = new THREE.TubeGeometry(curve, 32, 0.065, 8, false);
  const beamMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.25, metalness: 0.85 });
  group.add(new THREE.Mesh(beamGeo, beamMat));

  const loadCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.08, 0.24, 16),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  loadCone.position.set(0.8, -0.22, 0);
  group.add(loadCone);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
    }
  };
}

// 10N. Teorema Fundamental del Cálculo & Sumas Integrales de Riemann
function buildCalculusRiemannSum3D(epColor) {
  const group = new THREE.Group();

  const pts = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const x = (i / N - 0.5) * 1.6;
    const y = 0.35 + 0.32 * Math.cos(x * 2.5);
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
  group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 })));

  const numBars = 8;
  const barW = 1.6 / numBars;
  for (let b = 0; b < numBars; b++) {
    const x = -0.8 + (b + 0.5) * barW;
    const h = 0.35 + 0.32 * Math.cos(x * 2.5);
    const barGeo = new THREE.BoxGeometry(barW * 0.92, h, 0.22);
    const barMat = new THREE.MeshStandardMaterial({
      color: epColor,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.72
    });
    const barMesh = new THREE.Mesh(barGeo, barMat);
    barMesh.position.set(x, h / 2, 0);
    group.add(barMesh);
  }

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.95, 0, 0), new THREE.Vector3(0.95, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  group.add(axis);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.2;
    }
  };
}

// 10O. Ley de Coulomb & Líneas de Campo del Dipolo Eléctrico
function buildCoulombField3D(epColor) {
  const group = new THREE.Group();

  const qPosMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.8 }));
  qPosMesh.position.set(-0.55, 0, 0);
  group.add(qPosMesh);

  const qNegMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.8 }));
  qNegMesh.position.set(0.55, 0, 0);
  group.add(qNegMesh);

  const numLines = 8;
  for (let k = 0; k < numLines; k++) {
    const angle = (k / numLines) * Math.PI * 2;
    const curvePts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = -0.55 + t * 1.1;
      const y = Math.sin(t * Math.PI) * 0.45 * Math.cos(angle);
      const z = Math.sin(t * Math.PI) * 0.45 * Math.sin(angle);
      curvePts.push(new THREE.Vector3(x, y, z));
    }
    const cGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
    group.add(new THREE.Line(cGeo, new THREE.LineBasicMaterial({ color: epColor, transparent: true, opacity: 0.65 })));
  }

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.z += 0.004;
    }
  };
}

// 11. Paisaje Modular de la Función Zeta de Riemann |ζ(s)|
function buildRiemann3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(28, 28, (uNorm, vNorm) => {
    const sigma = (uNorm - 0.5) * 1.6;
    const t = vNorm * 3.0;
    const d1 = Math.hypot(sigma, t - 0.7);
    const d2 = Math.hypot(sigma, t - 1.8);
    const d3 = Math.hypot(sigma, t - 2.6);
    const z = Math.min(0.9, 0.2 + 0.7 * Math.tanh(d1 * d2 * d3 * 2.5) + 0.15 * Math.abs(sigma));
    return {
      x: sigma * 1.1,
      y: (t - 1.5) * 0.65,
      z: (z - 0.45) * 0.9
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));

  const critPts = [];
  for (let i = 0; i <= 30; i++) {
    const tNorm = i / 30;
    const t = tNorm * 3.0;
    const d1 = Math.hypot(0, t - 0.7);
    const d2 = Math.hypot(0, t - 1.8);
    const d3 = Math.hypot(0, t - 2.6);
    const z = Math.min(0.9, 0.2 + 0.7 * Math.tanh(d1 * d2 * d3 * 2.5));
    critPts.push(new THREE.Vector3(0, (t - 1.5) * 0.65, (z - 0.45) * 0.9 + 0.02));
  }
  const critGeo = new THREE.BufferGeometry().setFromPoints(critPts);
  group.add(new THREE.Line(critGeo, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 3 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
    }
  };
}

// 12. Sombrero Mexicano de Higgs & Ruptura Espontánea de Simetría
function buildHiggs3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(24, 36, (uNorm, vNorm) => {
    const r = uNorm * 1.05;
    const phi = vNorm * Math.PI * 2;
    const z = 0.75 * (-2 * r * r + r * r * r * r) + 0.35;
    return {
      x: r * Math.cos(phi),
      y: z,
      z: r * Math.sin(phi)
    };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));

  const beadGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const beadMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.95 });
  const bead = new THREE.Mesh(beadGeo, beadMat);
  group.add(bead);

  let beadAngle = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      beadAngle += dt * 2.2;
      bead.position.set(Math.cos(beadAngle), -0.4, Math.sin(beadAngle));
    }
  };
}

// 13. Filotaxis Esférica Áurea de Fibonacci en S²
function buildFibonacci3D(epColor) {
  const group = new THREE.Group();
  const N = 240;
  const pos = new Float32Array(N * 3);
  const phiAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y)) * 0.92;
    const theta = phiAngle * i;
    pos[i * 3]     = radius * Math.cos(theta);
    pos[i * 3 + 1] = y * 0.92;
    pos[i * 3 + 2] = radius * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.045, color: epColor })));

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.35 })));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x += 0.003;
    }
  };
}

// 14. Sistema Orbital Kepleriano 3D (Elipse y Foco Solar)
function buildKepler3D(epColor) {
  const group = new THREE.Group();
  const a = 0.95;
  const e = 0.62;
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e;

  const sunGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(-c, 0, 0);
  group.add(sun);

  const pts = [];
  for (let i = 0; i <= 64; i++) {
    const th = (i / 64) * Math.PI * 2;
    pts.push(new THREE.Vector3(a * Math.cos(th), b * Math.sin(th), 0));
  }
  const elGeo = new THREE.BufferGeometry().setFromPoints(pts);
  group.add(new THREE.Line(elGeo, new THREE.LineBasicMaterial({ color: epColor, linewidth: 2 })));

  const planetGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const planetMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  group.add(planet);

  let meanAnomaly = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.x = 0.35;
      group.rotation.z += 0.004;
      meanAnomaly += dt * 1.5;
      let E = meanAnomaly;
      for (let k = 0; k < 3; k++) E = E - (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
      const px = a * Math.cos(E);
      const py = b * Math.sin(E);
      planet.position.set(px, py, 0);
    }
  };
}

// 15. Poliedros Duales de Euler (Icosaedro & Dodecaedro V - E + F = 2)
function buildEuler3D(epColor) {
  const group = new THREE.Group();
  const icoGeo = new THREE.IcosahedronGeometry(0.85, 0);
  const icoMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  group.add(icoMesh);
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(icoGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })));

  const dodGeo = new THREE.DodecahedronGeometry(0.55, 0);
  const dodMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
  });
  const dodMesh = new THREE.Mesh(dodGeo, dodMat);
  group.add(dodMesh);

  return {
    group,
    update: (dt) => {
      icoMesh.rotation.y += 0.008;
      dodMesh.rotation.y -= 0.012;
      dodMesh.rotation.x += 0.006;
    }
  };
}

// 16. Onda Electromagnética Transversal de Maxwell 3D (E ⟂ B ⟂ k)
function buildMaxwell3D(epColor) {
  const group = new THREE.Group();
  const N = 60;
  const ePts = [];
  const bPts = [];
  for (let i = 0; i <= N; i++) {
    const z = (i / N - 0.5) * 1.8;
    const k = Math.PI * 4;
    const ex = 0.45 * Math.cos(k * z);
    const by = 0.45 * Math.sin(k * z);
    ePts.push(new THREE.Vector3(ex, 0, z));
    bPts.push(new THREE.Vector3(0, by, z));
  }
  const eLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ePts), new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 }));
  const bLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(bPts), new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 }));
  group.add(eLine);
  group.add(bLine);

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -0.95), new THREE.Vector3(0, 0, 0.95)]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  group.add(axis);

  return {
    group,
    update: (dt) => {
      group.rotation.z += 0.01;
      group.rotation.y += 0.005;
    }
  };
}

// 16A. Primera Ecuación de Maxwell: Ley de Gauss Eléctrica (∇·E = ρ/ε₀)
// Divergencia neta de campo electrostático saliente a través de una superficie gaussiana cerrada
function buildGaussElectric3D(epColor) {
  const group = new THREE.Group();

  // 1. Carga puntual central positiva (Monopolo Eléctrico +Q)
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.95 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), coreMat);
  group.add(core);

  const coronaMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
  const corona = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), coronaMat);
  group.add(corona);

  // 2. Superficie Gaussiana Esférica Cerrada S (Radio R = 0.72)
  const sphereGeo = new THREE.SphereGeometry(0.72, 24, 18);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.18,
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const gaussSphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(gaussSphere);

  const sphereWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(sphereGeo),
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 })
  );
  group.add(sphereWire);

  // 3. Haces de Líneas de Campo Eléctrico Radiales Divergentes (E ∝ r̂ / r²)
  const numRays = 18;
  const rayLines = new THREE.Group();
  const rayVectors = [];
  for (let i = 0; i < numRays; i++) {
    const phi = Math.acos(-1 + (2 * i) / numRays);
    const theta = Math.sqrt(numRays * Math.PI) * phi;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    ).normalize();
    rayVectors.push(dir);

    const pts = [
      dir.clone().multiplyScalar(0.14),
      dir.clone().multiplyScalar(1.05)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    }));
    rayLines.add(line);

    // Pequeño vector normal dA en el cruce de la superficie gaussiana
    const daPos = dir.clone().multiplyScalar(0.72);
    const daTip = dir.clone().multiplyScalar(0.85);
    const daGeo = new THREE.BufferGeometry().setFromPoints([daPos, daTip]);
    const daLine = new THREE.Line(daGeo, new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.95
    }));
    rayLines.add(daLine);
  }
  group.add(rayLines);

  // 4. Trazadores de Flujo Eléctrico Radiales Continuos (Partículas de Campo E)
  const numP = 36;
  const pPositions = new Float32Array(numP * 3);
  const pRads = new Float32Array(numP);
  const pRayIdx = new Int32Array(numP);
  for (let k = 0; k < numP; k++) {
    pRayIdx[k] = k % numRays;
    pRads[k] = 0.15 + Math.random() * 0.9;
    const d = rayVectors[pRayIdx[k]];
    pPositions[k * 3]     = d.x * pRads[k];
    pPositions[k * 3 + 1] = d.y * pRads[k];
    pPositions[k * 3 + 2] = d.z * pRads[k];
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.045,
    color: 0xfde047,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  }));
  group.add(pMesh);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      corona.scale.setScalar(1.0 + 0.08 * Math.sin(performance.now() * 0.005));

      const speed = dt * 0.65;
      for (let k = 0; k < numP; k++) {
        pRads[k] += speed;
        if (pRads[k] > 1.05) pRads[k] = 0.15;
        const d = rayVectors[pRayIdx[k]];
        pPositions[k * 3]     = d.x * pRads[k];
        pPositions[k * 3 + 1] = d.y * pRads[k];
        pPositions[k * 3 + 2] = d.z * pRads[k];
      }
      pGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 16B. Segunda Ecuación de Maxwell: Ley de Gauss Magnética (∇·B = 0)
// Inexistencia de monopolos magnéticos: líneas de campo cerradas continuas sin fuente ni sumidero
function buildGaussMagnetic3D(epColor) {
  const group = new THREE.Group();

  // 1. Dipolo Magnético Físico Central (Imán Bipolar N/S)
  const poleGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.28, 16);
  const northMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.25 });
  const north = new THREE.Mesh(poleGeo, northMat);
  north.position.y = 0.14;
  group.add(north);

  const southMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.25 });
  const south = new THREE.Mesh(poleGeo, southMat);
  south.position.y = -0.14;
  group.add(south);

  const bandGeo = new THREE.CylinderGeometry(0.072, 0.072, 0.04, 16);
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.2 });
  group.add(new THREE.Mesh(bandGeo, bandMat));

  // 2. Lazos Cerrados de Campo Magnético Dipolar B
  const numLoops = 12;
  const loopGroup = new THREE.Group();
  for (let l = 0; l < numLoops; l++) {
    const azim = (l / numLoops) * Math.PI * 2;
    [0.45, 0.72, 1.05].forEach(rMax => {
      const pts = [];
      const N = 48;
      for (let i = 0; i <= N; i++) {
        const th = (i / N) * Math.PI;
        const r = rMax * Math.sin(th) * Math.sin(th) + 0.05;
        const y = r * Math.cos(th) * 1.25;
        const distHoriz = r * Math.sin(th);
        const x = distHoriz * Math.cos(azim);
        const z = distHoriz * Math.sin(azim);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const loopGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const loopLine = new THREE.Line(loopGeo, new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      }));
      loopGroup.add(loopLine);
    });
  }
  group.add(loopGroup);

  // 3. Superficie Gaussiana de Prueba (Mostrando Flujo Neto Nulo ∯ B·dA = 0)
  const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 18, 14),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.12, wireframe: true })
  );
  group.add(testSphere);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      loopGroup.rotation.y += 0.003;
    }
  };
}

// 16C. Tercera Ecuación de Maxwell: Ley de Inducción de Faraday (∇×E = -∂B/∂t)
// Un campo magnético variable en el tiempo induce vórtices cerrados de campo eléctrico rotacional
function buildFaradayMaxwell3D(epColor) {
  const group = new THREE.Group();

  // 1. Núcleo cilíndrico de Flujo Magnético Variable B_z(t)
  const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 20);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.75,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.8
  });
  const magCore = new THREE.Mesh(coreGeo, coreMat);
  group.add(magCore);

  const bLinesGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const bx = 0.07 * Math.cos(ang);
    const bz = 0.07 * Math.sin(ang);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(bx, -0.7, bz),
      new THREE.Vector3(bx, 0.7, bz)
    ]);
    bLinesGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })));
  }
  group.add(bLinesGroup);

  // 2. Anillos Concéntricos de Campo Eléctrico Rotacional E_θ (Vórtices de Faraday)
  const ringRadii = [0.32, 0.55, 0.80];
  const eRingsGroup = new THREE.Group();
  ringRadii.forEach(rad => {
    const ringGeo = new THREE.RingGeometry(rad - 0.012, rad + 0.012, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.70,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    eRingsGroup.add(ringMesh);
  });
  group.add(eRingsGroup);

  // 3. Trazadores de Circulación Rotacional ∇×E
  const numP = 36;
  const pPos = new Float32Array(numP * 3);
  const pAngles = new Float32Array(numP);
  const pRadChoice = new Float32Array(numP);
  for (let k = 0; k < numP; k++) {
    pAngles[k] = Math.random() * Math.PI * 2;
    pRadChoice[k] = ringRadii[k % ringRadii.length];
    pPos[k * 3]     = pRadChoice[k] * Math.cos(pAngles[k]);
    pPos[k * 3 + 1] = 0;
    pPos[k * 3 + 2] = pRadChoice[k] * Math.sin(pAngles[k]);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.05,
    color: 0xfde047,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  }));
  group.add(pMesh);

  let faradayTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      faradayTime += dt * 3.5;

      const dBdt = -Math.sin(faradayTime);
      magCore.material.emissiveIntensity = 0.5 + 0.5 * Math.abs(Math.cos(faradayTime));

      const rotSpeed = dBdt * dt * 2.2;
      for (let k = 0; k < numP; k++) {
        pAngles[k] += rotSpeed * (0.6 / pRadChoice[k]);
        pPos[k * 3]     = pRadChoice[k] * Math.cos(pAngles[k]);
        pPos[k * 3 + 1] = 0;
        pPos[k * 3 + 2] = pRadChoice[k] * Math.sin(pAngles[k]);
      }
      pGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 16D. Cuarta Ecuación de Maxwell: Ley de Ampère-Maxwell (∇×B = μ₀J + μ₀ε₀ ∂E/∂t)
// La corriente de desplazamiento en el condensador genera campo magnético en el vacío
function buildAmpereMaxwell3D(epColor) {
  const group = new THREE.Group();

  // 1. Placas circulares de condensador en z = -0.32 y z = +0.32
  const plateGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.2 });
  const p1 = new THREE.Mesh(plateGeo, plateMat);
  p1.rotation.x = Math.PI / 2;
  p1.position.z = -0.32;
  group.add(p1);

  const p2 = new THREE.Mesh(plateGeo, plateMat);
  p2.rotation.x = Math.PI / 2;
  p2.position.z = 0.32;
  group.add(p2);

  const wireGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12);
  const wireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.3 });
  const w1 = new THREE.Mesh(wireGeo, wireMat);
  w1.rotation.x = Math.PI / 2;
  w1.position.z = -0.65;
  group.add(w1);
  const w2 = new THREE.Mesh(wireGeo, wireMat);
  w2.rotation.x = Math.PI / 2;
  w2.position.z = 0.65;
  group.add(w2);

  // 2. Líneas de Campo Eléctrico Variable E(t) en la brecha
  const eFieldLines = new THREE.Group();
  for (let r = 0.15; r <= 0.42; r += 0.12) {
    for (let i = 0; i < 6; i++) {
      const th = (i / 6) * Math.PI * 2;
      const ex = r * Math.cos(th);
      const ey = r * Math.sin(th);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ex, ey, -0.30),
        new THREE.Vector3(ex, ey, 0.30)
      ]);
      eFieldLines.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75
      })));
    }
  }
  group.add(eFieldLines);

  // 3. Anillos de Campo Magnético Inducido B alrededor de la brecha
  const bRings = new THREE.Group();
  [0.25, 0.45, 0.68].forEach(rad => {
    const ringGeo = new THREE.RingGeometry(rad - 0.01, rad + 0.01, 36);
    const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.80,
      blending: THREE.AdditiveBlending
    }));
    bRings.add(ringMesh);
  });
  group.add(bRings);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      bRings.rotation.z += 0.025;
    }
  };
}

// 16E. Fuerza Electromagnética de Lorentz (F = q(E + v × B))
// Espiral helicoidal de Larmor y precesión de ciclotrón bajo campo magnético
function buildLorentzForce3D(epColor) {
  const group = new THREE.Group();

  const bField = new THREE.Group();
  for (let ix = -0.6; ix <= 0.6; ix += 0.4) {
    for (let iz = -0.6; iz <= 0.6; iz += 0.4) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ix, -0.85, iz),
        new THREE.Vector3(ix, 0.85, iz)
      ]);
      bField.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.35
      })));
    }
  }
  group.add(bField);

  const helixPts = [];
  const N = 120;
  const rLarmor = 0.38;
  const turns = 4.0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const th = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * 1.5;
    helixPts.push(new THREE.Vector3(rLarmor * Math.cos(th), y, rLarmor * Math.sin(th)));
  }
  const helixGeo = new THREE.BufferGeometry().setFromPoints(helixPts);
  const helixLine = new THREE.Line(helixGeo, new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    linewidth: 3,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  }));
  group.add(helixLine);

  const ionMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const ionMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), ionMat);
  group.add(ionMesh);

  const fVectorGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
  const fVectorLine = new THREE.Line(fVectorGeo, new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 }));
  group.add(fVectorLine);

  let tLarmor = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      tLarmor += dt * 3.2;
      const th = tLarmor;
      const y = (Math.sin(tLarmor * 0.25) * 0.6);
      const px = rLarmor * Math.cos(th);
      const pz = rLarmor * Math.sin(th);
      ionMesh.position.set(px, y, pz);

      const fPos = fVectorGeo.attributes.position.array;
      fPos[0] = px; fPos[1] = y; fPos[2] = pz;
      fPos[3] = px - 0.22 * Math.cos(th);
      fPos[4] = y;
      fPos[5] = pz - 0.22 * Math.sin(th);
      fVectorGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 17. Membrana Vibrante de Chladni & Curvas Nodales
function buildChladni3D(epColor) {
  const group = new THREE.Group();
  const geo = createParametricSurface(24, 24, (uNorm, vNorm) => {
    const x = (uNorm - 0.5) * 1.8;
    const y = (vNorm - 0.5) * 1.8;
    const z = 0.28 * (Math.cos(Math.PI * 2 * x) * Math.cos(Math.PI * 4 * y) - Math.cos(Math.PI * 4 * x) * Math.cos(Math.PI * 2 * y));
    return { x, y, z };
  });
  const mat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.8,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.x = 0.45;
      group.rotation.z += 0.008;
    }
  };
}

// 18. Prisma Óptico de Snell & Dispersión Cromática
function buildSnell3D(epColor) {
  const group = new THREE.Group();
  const prismGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.55, 3);
  const prismMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(prismGeo, prismMat));

  const rayPts = [new THREE.Vector3(-1.1, 0, 0), new THREE.Vector3(-0.35, 0, 0)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rayPts), new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })));

  const colors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6, 0x8b5cf6];
  colors.forEach((col, idx) => {
    const angle = 0.15 + (idx - 2) * 0.08;
    const refPts = [
      new THREE.Vector3(-0.35, 0, 0),
      new THREE.Vector3(0.25, 0, (idx - 2) * 0.04),
      new THREE.Vector3(1.1, 0, Math.tan(angle) * 0.85)
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(refPts), new THREE.LineBasicMaterial({ color: col, linewidth: 2 })));
  });

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.x = 0.35;
    }
  };
}

// 19. Teorema de Pitágoras & Bloques Métricos Espaciales (a² + b² = c²)
function buildPythagoras3D(epColor) {
  const group = new THREE.Group();
  const a = 0.6, b = 0.8, c = 1.0;
  const boxA = new THREE.Mesh(new THREE.BoxGeometry(a, a, 0.18), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.7 }));
  boxA.position.set(-a/2, a/2, 0);
  group.add(boxA);

  const boxB = new THREE.Mesh(new THREE.BoxGeometry(b, b, 0.18), new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.7 }));
  boxB.position.set(b/2, -b/2, 0);
  group.add(boxB);

  const boxC = new THREE.Mesh(new THREE.BoxGeometry(c, c, 0.18), new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.75 }));
  boxC.position.set(0.1, 0.3, 0);
  boxC.rotation.z = Math.atan2(a, b);
  group.add(boxC);

  group.scale.set(0.65, 0.65, 0.65);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.009;
      group.rotation.x += 0.004;
    }
  };
}

// 20. Cristal Termodinámico de Boltzmann & Gas Ideal (Microestados)
function buildThermo3D(epColor) {
  const group = new THREE.Group();
  const atoms = [];
  const d = 0.45;
  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = -1; iy <= 1; iy++) {
      for (let iz = -1; iz <= 1; iz++) {
        const atomMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 12, 12),
          new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 })
        );
        atomMesh.position.set(ix * d, iy * d, iz * d);
        group.add(atomMesh);
        atoms.push({ mesh: atomMesh, base: new THREE.Vector3(ix * d, iy * d, iz * d), seed: Math.random() * 10 });
      }
    }
  }

  const boxWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(d * 2, d * 2, d * 2)),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
  );
  group.add(boxWire);

  let thermoT = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x += 0.004;
      thermoT += dt * 8.0;
      atoms.forEach(a => {
        const vib = 0.025 * Math.sin(thermoT + a.seed);
        a.mesh.position.set(
          a.base.x + vib,
          a.base.y + Math.cos(thermoT + a.seed) * 0.025,
          a.base.z + vib * 0.7
        );
      });
    }
  };
}

// 21. Autómata Universal de Turing & Red Computacional 3D
function buildAutomata3D(epColor) {
  const group = new THREE.Group();
  const size = 3;
  const step = 0.28;
  for (let x = -size; x <= size; x++) {
    for (let y = -size; y <= size; y++) {
      for (let z = -size; z <= size; z++) {
        if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 0) {
          const vMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.18, 0.18),
            new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.8 })
          );
          vMesh.position.set(x * step, y * step, z * step);
          group.add(vMesh);
        }
      }
    }
  }

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      group.rotation.z += 0.005;
    }
  };
}

// 22. Superficie Termodinámica P-V-T del Gas Ideal (PV = nRT)
function buildIdealGas3D(epColor) {
  const group = new THREE.Group();
  const nu = 24, nv = 24;
  const gasGeo = createParametricSurface(nu, nv, (u, v) => {
    const V = 0.5 + u * 1.5;
    const T = 0.6 + v * 1.4;
    const P = (0.55 * T) / V;
    return {
      x: (u - 0.5) * 1.5,
      y: (P - 0.9) * 0.9,
      z: (v - 0.5) * 1.4
    };
  });
  const gasMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.75,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  group.add(new THREE.Mesh(gasGeo, gasMat));

  const isoCurves = [0.2, 0.5, 0.8];
  isoCurves.forEach(vFix => {
    const pts = [];
    for (let u = 0; u <= 1.0; u += 0.05) {
      const V = 0.5 + u * 1.5;
      const T = 0.6 + vFix * 1.4;
      const P = (0.55 * T) / V;
      pts.push(new THREE.Vector3((u - 0.5) * 1.5, (P - 0.9) * 0.9 + 0.01, (vFix - 0.5) * 1.4));
    }
    const isoGeo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(isoGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));
  });

  const stateMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.8 })
  );
  group.add(stateMarker);

  let gasTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      gasTime += dt * 1.8;
      const u = 0.5 + 0.45 * Math.sin(gasTime);
      const vFix = 0.5;
      const V = 0.5 + u * 1.5;
      const T = 0.6 + vFix * 1.4;
      const P = (0.55 * T) / V;
      stateMarker.position.set((u - 0.5) * 1.5, (P - 0.9) * 0.9 + 0.02, (vFix - 0.5) * 1.4);
    }
  };
}

// 23. Ciclo Termodinámico Cerrado de Carnot (Isotermas y Adiabáticas en Espacio P-V-T)
function buildCarnotCycle3D(epColor) {
  const group = new THREE.Group();
  const pA = new THREE.Vector3(-0.6,  0.7,  0.5);
  const pB = new THREE.Vector3( 0.1,  0.25, 0.5);
  const pC = new THREE.Vector3( 0.7, -0.5, -0.5);
  const pD = new THREE.Vector3( 0.0, -0.2, -0.5);

  const curve = new THREE.CatmullRomCurve3([pA, pB, pC, pD], true, 'centripetal');
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.045, 12, true);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.8
  });
  group.add(new THREE.Mesh(tubeGeo, tubeMat));

  const patchPts = curve.getPoints(32);
  const patchGeo = new THREE.BufferGeometry();
  const patchVerts = [];
  const center = new THREE.Vector3(0.05, 0.06, 0.0);
  for (let i = 0; i < patchPts.length; i++) {
    const next = patchPts[(i + 1) % patchPts.length];
    patchVerts.push(center.x, center.y, center.z);
    patchVerts.push(patchPts[i].x, patchPts[i].y, patchPts[i].z);
    patchVerts.push(next.x, next.y, next.z);
  }
  patchGeo.setAttribute('position', new THREE.Float32BufferAttribute(patchVerts, 3));
  patchGeo.computeVertexNormals();
  group.add(new THREE.Mesh(patchGeo, new THREE.MeshBasicMaterial({
    color: 0xd97706,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35
  })));

  const arrowH = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(-0.25, 0.9, 0.5), 0.35, 0xef4444, 0.1, 0.06);
  const arrowC = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3( 0.35, -0.35, -0.5), 0.35, 0x3b82f6, 0.1, 0.06);
  group.add(arrowH);
  group.add(arrowC);

  const pulseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 })
  );
  group.add(pulseMesh);

  let carnotProg = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      carnotProg = (carnotProg + dt * 0.25) % 1.0;
      const pt = curve.getPoint(carnotProg);
      pulseMesh.position.copy(pt);
      if (pt.z > 0) {
        pulseMesh.material.color.setHex(0xf97316);
        pulseMesh.material.emissive.setHex(0xf97316);
      } else {
        pulseMesh.material.color.setHex(0x38bdf8);
        pulseMesh.material.emissive.setHex(0x38bdf8);
      }
    }
  };
}

// 24. Distribución de Velocidades de Maxwell-Boltzmann en R³
function buildMaxwellBoltzmannDist3D(epColor) {
  const group = new THREE.Group();
  const vpRadius = 0.62;
  const shellGeo = new THREE.SphereGeometry(vpRadius, 32, 24);
  const shellMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.32,
    wireframe: true
  });
  group.add(new THREE.Mesh(shellGeo, shellMat));

  const bellPts = [];
  const numSteps = 48;
  for (let i = 0; i <= numSteps; i++) {
    const r = (i / numSteps) * 1.35;
    const y = 2.4 * r * r * Math.exp(-(r * r) / 0.38);
    bellPts.push(new THREE.Vector3(r, y - 0.6, 0));
  }
  const bellGeo = new THREE.BufferGeometry().setFromPoints(bellPts);
  group.add(new THREE.Line(bellGeo, new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 })));

  const bellPtsNeg = bellPts.map(p => new THREE.Vector3(-p.x, p.y, p.z));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bellPtsNeg), new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 })));

  const numV = 64;
  const vPos = new Float32Array(numV * 3);
  const vSpeeds = new Float32Array(numV);
  const vDirs = [];
  for (let k = 0; k < numV; k++) {
    const gx = (Math.random() + Math.random() + Math.random() - 1.5);
    const gy = (Math.random() + Math.random() + Math.random() - 1.5);
    const gz = (Math.random() + Math.random() + Math.random() - 1.5);
    const dir = new THREE.Vector3(gx, gy, gz).normalize();
    const speed = Math.sqrt(gx*gx + gy*gy + gz*gz) * 0.75;
    vDirs.push(dir);
    vSpeeds[k] = speed;
    vPos[k*3]   = dir.x * speed;
    vPos[k*3+1] = dir.y * speed;
    vPos[k*3+2] = dir.z * speed;
  }
  const vGeo = new THREE.BufferGeometry();
  vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
  group.add(new THREE.Points(vGeo, new THREE.PointsMaterial({
    size: 0.045,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85
  })));

  let mbTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.006;
      mbTime += dt * 2.0;
      for (let k = 0; k < numV; k++) {
        const pulse = 1.0 + 0.12 * Math.sin(mbTime + k);
        const r = vSpeeds[k] * pulse;
        vPos[k*3]   = vDirs[k].x * r;
        vPos[k*3+1] = vDirs[k].y * r;
        vPos[k*3+2] = vDirs[k].z * r;
      }
      vGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 25. Partición del Espacio de Fases de Boltzmann (S = kB ln Ω)
function buildBoltzmannEntropy3D(epColor) {
  const group = new THREE.Group();
  const cellsGroup = new THREE.Group();
  const d = 0.38;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const box = new THREE.BoxGeometry(d * 0.88, d * 0.88, d * 0.88);
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(box),
          new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.4 })
        );
        edges.position.set(x * d, y * d, z * d);
        cellsGroup.add(edges);
      }
    }
  }
  group.add(cellsGroup);

  const omegaGeo = new THREE.SphereGeometry(0.72, 24, 24);
  const omegaMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.35
  });
  const omegaMesh = new THREE.Mesh(omegaGeo, omegaMat);
  group.add(omegaMesh);

  const numM = 36;
  const mGeo = new THREE.BufferGeometry();
  const mPos = new Float32Array(numM * 3);
  for (let i = 0; i < numM; i++) {
    mPos[i*3]   = (Math.random() - 0.5) * 1.1;
    mPos[i*3+1] = (Math.random() - 0.5) * 1.1;
    mPos[i*3+2] = (Math.random() - 0.5) * 1.1;
  }
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
  group.add(new THREE.Points(mGeo, new THREE.PointsMaterial({
    size: 0.055,
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.9
  })));

  let bTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      group.rotation.x += 0.003;
      bTime += dt * 3.0;
      const scaleS = 1.0 + 0.08 * Math.sin(bTime);
      omegaMesh.scale.set(scaleS, 1.0 + 0.05 * Math.cos(bTime * 0.7), scaleS);
      for (let i = 0; i < numM; i++) {
        mPos[i*3+1] += Math.sin(bTime + i * 2.0) * 0.004;
      }
      mGeo.attributes.position.needsUpdate = true;
    }
  };
}

// 26. Ley de Enfriamiento de Newton (dT/dt = -k(T - T_env)) en R³
function buildThermalCooling3D(epColor) {
  const group = new THREE.Group();
  const coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7
    })
  );
  group.add(coreMesh);

  const shells = [
    { r: 0.52, color: 0xf97316, op: 0.45 },
    { r: 0.78, color: 0xfacc15, op: 0.30 },
    { r: 1.05, color: 0x38bdf8, op: 0.18 }
  ];
  shells.forEach(s => {
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(s.r, 24, 18),
      new THREE.MeshStandardMaterial({
        color: s.color,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: s.op,
        wireframe: true
      })
    ));
  });

  const streamGroup = new THREE.Group();
  for (let a = 0; a < 6; a++) {
    const ang = (a / 6) * Math.PI * 2;
    const pts = [];
    for (let h = -0.7; h <= 0.9; h += 0.1) {
      const rad = 0.32 + Math.abs(h) * 0.35 + 0.05 * Math.sin(h * 6);
      pts.push(new THREE.Vector3(Math.cos(ang) * rad, h, Math.sin(ang) * rad));
    }
    const cCurve = new THREE.CatmullRomCurve3(pts);
    streamGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(cCurve, 20, 0.015, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.6 })
    ));
  }
  group.add(streamGroup);

  let coolTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      coolTime += dt * 2.5;
      coreMesh.material.emissiveIntensity = 0.6 + 0.35 * Math.sin(coolTime);
      streamGroup.rotation.y += dt * 0.4;
    }
  };
}

// 27. Paquete de Onda Cuántica de De Broglie (λ = h/p, ψ = A e^{i(kx - ωt)})
function buildDeBroglieWave3D(epColor) {
  const group = new THREE.Group();
  const numSteps = 120;
  const helixPts = [];
  const k = 14.0;
  for (let i = 0; i <= numSteps; i++) {
    const x = -1.1 + (i / numSteps) * 2.2;
    const envelope = 0.48 * Math.exp(-(x * x) / 0.35);
    helixPts.push(new THREE.Vector3(x, envelope * Math.cos(k * x), envelope * Math.sin(k * x)));
  }
  const helixCurve = new THREE.CatmullRomCurve3(helixPts);
  const helixTube = new THREE.Mesh(
    new THREE.TubeGeometry(helixCurve, 120, 0.024, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.85 })
  );
  group.add(helixTube);

  const envGeo = createParametricSurface(24, 24, (u, v) => {
    const x = -1.1 + u * 2.2;
    const r = 0.52 * Math.exp(-(x * x) / 0.35);
    const th = v * Math.PI * 2;
    return { x: x, y: r * Math.cos(th), z: r * Math.sin(th) };
  });
  group.add(new THREE.Mesh(
    envGeo,
    new THREE.MeshStandardMaterial({ color: epColor, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
  ));

  const corpuscle = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.9 })
  );
  group.add(corpuscle);

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.25, 0, 0), new THREE.Vector3(1.25, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5 })
  );
  group.add(axis);

  let wavePhase = 0;
  return {
    group,
    update: (dt) => {
      helixTube.rotation.x += dt * 5.0;
      wavePhase += dt * 1.5;
      corpuscle.position.x = 0.45 * Math.sin(wavePhase);
    }
  };
}

// 28. Elipsoide Simpléctico de Incertidumbre de Heisenberg (Δx · Δp ≥ ℏ/2)
function buildHeisenbergUncertainty3D(epColor) {
  const group = new THREE.Group();
  const ellGeo = new THREE.SphereGeometry(0.65, 32, 24);
  const ellMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.7
  });
  const ellMesh = new THREE.Mesh(ellGeo, ellMat);
  group.add(ellMesh);

  const cage = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 1.6, 1.6)),
    new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.35 })
  );
  group.add(cage);

  const gridHelper = new THREE.GridHelper(1.5, 10, 0xdfc285, 0x334155);
  gridHelper.rotation.x = Math.PI / 2;
  group.add(gridHelper);

  let uncTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      uncTime += dt * 2.2;
      const s = 0.55 + 0.35 * Math.sin(uncTime);
      const invS = 1.0 / s;
      ellMesh.scale.set(s, invS * 0.4, 0.7);
    }
  };
}

// 29. Dispersión Relativista y Salto de Masa de Dirac (E² = p²c² + m²c⁴)
function buildDiracEquation3D(epColor) {
  const group = new THREE.Group();
  const gap = 0.32;
  const sheetGeoPos = createParametricSurface(24, 24, (u, v) => {
    const p = u * 0.85;
    const th = v * Math.PI * 2;
    const E = Math.sqrt(p * p + gap * gap);
    return { x: p * Math.cos(th), y: E, z: p * Math.sin(th) };
  });
  group.add(new THREE.Mesh(sheetGeoPos, new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide
  })));

  const sheetGeoNeg = createParametricSurface(24, 24, (u, v) => {
    const p = u * 0.85;
    const th = v * Math.PI * 2;
    const E = -Math.sqrt(p * p + gap * gap);
    return { x: p * Math.cos(th), y: E, z: p * Math.sin(th) };
  });
  group.add(new THREE.Mesh(sheetGeoNeg, new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide
  })));

  const gapGeo = new THREE.CylinderGeometry(0.35, 0.35, gap * 2, 24, 1, true);
  group.add(new THREE.Mesh(gapGeo, new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  })));

  const spinor = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.55, 0xfacc15, 0.12, 0.08);
  group.add(spinor);

  let diracTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.008;
      diracTime += dt * 3.5;
      const sx = 0.35 * Math.sin(diracTime);
      const sz = 0.35 * Math.cos(diracTime);
      spinor.setDirection(new THREE.Vector3(sx, 0.8, sz).normalize());
    }
  };
}

// 30. Cuantización de Cavidad de Planck (E = hν) y Fotones Discretos
function buildPlanckQuantum3D(epColor) {
  const group = new THREE.Group();
  const m1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.04, 32),
    new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.1, metalness: 0.95 })
  );
  m1.rotation.z = Math.PI / 2;
  m1.position.x = -0.85;
  group.add(m1);

  const m2 = m1.clone();
  m2.position.x = 0.85;
  group.add(m2);

  const modes = [
    { n: 1, color: 0xef4444, amp: 0.22, yOff: 0.28 },
    { n: 2, color: 0x38bdf8, amp: 0.18, yOff: 0.0 },
    { n: 3, color: 0x10b981, amp: 0.14, yOff: -0.28 }
  ];
  const modeLines = [];
  modes.forEach(m => {
    const pts = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const x = -0.85 + u * 1.7;
      const y = m.yOff + m.amp * Math.sin(m.n * Math.PI * u);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: m.color, linewidth: 2 }));
    group.add(line);
    modeLines.push({ line, geo: lineGeo, mode: m, pts });
  });

  const photon = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 })
  );
  group.add(photon);

  let pTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.005;
      pTime += dt * 4.0;
      modeLines.forEach(item => {
        const m = item.mode;
        const pos = item.geo.attributes.position.array;
        const N = 48;
        for (let i = 0; i <= N; i++) {
          const u = i / N;
          const vib = Math.cos(pTime * m.n) * m.amp * Math.sin(m.n * Math.PI * u);
          pos[i * 3 + 1] = m.yOff + vib;
        }
        item.geo.attributes.position.needsUpdate = true;
      });

      const activeMode = modes[Math.floor((pTime * 0.4) % 3)];
      photon.position.set(0.4 * Math.sin(pTime * 2.0), activeMode.yOff, 0);
    }
  };
}

// 31. Árbol Tridimensional de Bifurcación de Feigenbaum (x_{n+1} = r x_n (1 - x_n))
function buildLogisticFeigenbaum3D(epColor) {
  const group = new THREE.Group();
  const numR = 90;
  const treePts = [];
  for (let ir = 0; ir < numR; ir++) {
    const r = 2.8 + (ir / numR) * 1.2;
    let x = 0.5;
    for (let t = 0; t < 120; t++) {
      x = r * x * (1.0 - x);
    }
    for (let s = 0; s < 32; s++) {
      x = r * x * (1.0 - x);
      const px = ((r - 2.8) / 1.2 - 0.5) * 1.8;
      const py = (x - 0.5) * 1.35;
      const pz = (Math.sin(s * 0.4) * 0.08);
      treePts.push(px, py, pz);
    }
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(treePts, 3));
  group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.035,
    color: epColor,
    transparent: true,
    opacity: 0.85
  })));

  const r1X = ((3.0 - 2.8) / 1.2 - 0.5) * 1.8;
  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(r1X, -0.7, 0), new THREE.Vector3(r1X, 0.7, 0)]),
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
  ));

  const r2X = ((3.449 - 2.8) / 1.2 - 0.5) * 1.8;
  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(r2X, -0.7, 0), new THREE.Vector3(r2X, 0.7, 0)]),
    new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.5 })
  ));

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
    }
  };
}

// 32. Mecánica Hamiltoniana: Toroide Simpléctico de Liouville-Arnol'd en Espacio de Fases
function buildHamiltonPhase3D(epColor) {
  const group = new THREE.Group();
  const torusGeo = new THREE.TorusGeometry(0.72, 0.28, 24, 48);
  const torusMat = new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.75,
    transparent: true,
    opacity: 0.65
  });
  group.add(new THREE.Mesh(torusGeo, torusMat));

  const orbitPts = [];
  const N = 240;
  const R = 0.72, r = 0.28;
  const phiStep = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i <= N; i++) {
    const theta = (i / N) * Math.PI * 16;
    const phi = theta * phiStep;
    orbitPts.push(new THREE.Vector3(
      (R + r * Math.cos(phi)) * Math.cos(theta),
      (R + r * Math.cos(phi)) * Math.sin(theta),
      r * Math.sin(phi)
    ));
  }
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
  group.add(new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 2 })));

  return {
    group,
    update: (dt) => {
      group.rotation.x += 0.006;
      group.rotation.y += 0.008;
    }
  };
}

// 33. Identidad Suprema de Euler (e^{iπ} + 1 = 0) en el Plano Complejo de Argand
function buildEulerIdentity3D(epColor) {
  const group = new THREE.Group();
  const axRe = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1.2, 0, 0), 2.4, 0x94a3b8, 0.08, 0.05);
  const axIm = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1.2, 0), 2.4, 0x94a3b8, 0.08, 0.05);
  group.add(axRe);
  group.add(axIm);

  const circleGeo = new THREE.RingGeometry(0.81, 0.85, 64);
  group.add(new THREE.Mesh(circleGeo, new THREE.MeshBasicMaterial({ color: 0xc5a059, side: THREE.DoubleSide })));

  const phasor = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 0.83, 0x38bdf8, 0.12, 0.08);
  group.add(phasor);

  const returnVector = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.83, 0, 0), 0.83, 0x10b981, 0.12, 0.08);
  group.add(returnVector);

  const zeroSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.9 })
  );
  group.add(zeroSphere);

  let eulerAngle = 0;
  return {
    group,
    update: (dt) => {
      eulerAngle += dt * 1.5;
      const th = Math.PI + Math.sin(eulerAngle) * (Math.PI * 0.95);
      phasor.setDirection(new THREE.Vector3(Math.cos(th), Math.sin(th), 0).normalize());
    }
  };
}

// 34. Incompletitud Lógica de Gödel (G ↔ ¬Prov(⌈G⌉)) & Grafo Axiomático
function buildGodelIncompleteness3D(epColor) {
  const group = new THREE.Group();
  const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.7 });
  const nodes = [
    new THREE.Vector3(-0.6, -0.6, -0.2),
    new THREE.Vector3( 0.0, -0.6,  0.3),
    new THREE.Vector3( 0.6, -0.6, -0.2),
    new THREE.Vector3(-0.3, -0.1,  0.0),
    new THREE.Vector3( 0.3, -0.1,  0.0),
    new THREE.Vector3( 0.0,  0.35, 0.1)
  ];
  nodes.forEach(p => {
    const nm = new THREE.Mesh(nodeGeo, nodeMat);
    nm.position.copy(p);
    group.add(nm);
  });

  const edges = [
    [0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]
  ];
  edges.forEach(([i, j]) => {
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]),
      new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 })
    ));
  });

  const boundary = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.85, 0.5, 0), new THREE.Vector3(0.85, 0.5, 0)]),
    new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 0.06, gapSize: 0.04 })
  );
  boundary.computeLineDistances();
  group.add(boundary);

  const godelPos = new THREE.Vector3(0, 0.75, 0);
  const godelNode = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.85 })
  );
  godelNode.position.copy(godelPos);
  group.add(godelNode);

  const mobLoop = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.02, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e })
  );
  mobLoop.position.copy(godelPos);
  mobLoop.rotation.x = Math.PI / 3;
  group.add(mobLoop);

  let gTime = 0;
  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      gTime += dt * 3.0;
      mobLoop.rotation.z += dt * 2.0;
      godelNode.position.y = 0.75 + 0.04 * Math.sin(gTime);
    }
  };
}

// 35. Problema del Milenio: Complejidad P versus NP & Hipercubo Booleano
function buildPVsNP3D(epColor) {
  const group = new THREE.Group();
  const d1 = 0.65, d2 = 0.32;
  const vertices = [];
  for (let i = 0; i < 8; i++) {
    vertices.push(new THREE.Vector3((i & 1 ? 1 : -1) * d1, (i & 2 ? 1 : -1) * d1, (i & 4 ? 1 : -1) * d1));
  }
  for (let i = 0; i < 8; i++) {
    vertices.push(new THREE.Vector3((i & 1 ? 1 : -1) * d2, (i & 2 ? 1 : -1) * d2, (i & 4 ? 1 : -1) * d2));
  }

  const cubeMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.4 });
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(d1*2, d1*2, d1*2)), cubeMat));
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(d2*2, d2*2, d2*2)), cubeMat));

  for (let i = 0; i < 8; i++) {
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([vertices[i], vertices[i + 8]]), cubeMat));
  }

  const pPathPts = [vertices[0], vertices[1], vertices[3], vertices[7]];
  const pCurve = new THREE.CatmullRomCurve3(pPathPts);
  group.add(new THREE.Mesh(
    new THREE.TubeGeometry(pCurve, 32, 0.035, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.6 })
  ));

  const npGroup = new THREE.Group();
  for (let i = 0; i < 8; i += 2) {
    npGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), vertices[i]]),
      new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.7 })
    ));
  }
  group.add(npGroup);

  const questionCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.12, 0),
    new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.9 })
  );
  group.add(questionCore);

  return {
    group,
    update: (dt) => {
      group.rotation.y += 0.007;
      group.rotation.x += 0.004;
      questionCore.rotation.z += dt * 1.5;
    }
  };
}

// 36. Símplex de Probabilidad & Cúpula de Entropía de Shannon (H = -∑ p log₂ p)
function buildShannonEntropy3D(epColor) {
  const group = new THREE.Group();
  const v1 = new THREE.Vector3( 0.0,  0.75, -0.35);
  const v2 = new THREE.Vector3(-0.65, -0.38, -0.35);
  const v3 = new THREE.Vector3( 0.65, -0.38, -0.35);

  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([v1, v2, v3, v1]),
    new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 })
  ));

  const domeGeo = createParametricSurface(24, 24, (u, v) => {
    const sqrtU = Math.sqrt(u);
    const b1 = 1 - sqrtU;
    const b2 = sqrtU * (1 - v);
    const b3 = sqrtU * v;
    const x = b1 * v1.x + b2 * v2.x + b3 * v3.x;
    const y = b1 * v1.y + b2 * v2.y + b3 * v3.y;
    const eps = 1e-6;
    const h1 = b1 > eps ? -b1 * Math.log2(b1) : 0;
    const h2 = b2 > eps ? -b2 * Math.log2(b2) : 0;
    const h3 = b3 > eps ? -b3 * Math.log2(b3) : 0;
    const H = (h1 + h2 + h3) / Math.log2(3);
    const z = -0.35 + H * 0.85;
    return { x, y, z };
  });

  group.add(new THREE.Mesh(domeGeo, new THREE.MeshStandardMaterial({
    color: epColor,
    roughness: 0.25,
    metalness: 0.75,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  })));

  const peakMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.95 })
  );
  peakMarker.position.set(0, 0, 0.50);
  group.add(peakMarker);

  return {
    group,
    update: (dt) => {
      group.rotation.z += 0.005;
      group.rotation.y += 0.004;
    }
  };
}

// Mapeo Canónico de los 100 Arquetipos del Cosmos a Familias 3D Volumétricas Auténticas
const BESPOKE_3D_BUILDERS = {
  lorenz: buildLorenz3D,
  klein: buildKlein3D,
  mobius: buildMobius3D,
  hopf: buildHopf3D,
  gyroid: buildTPMSGyroid3D,
  quantum_orbital: buildQuantumOrbital3D,
  schwarzschild: buildSchwarzschild3D,
  minkowski: buildMinkowski3D,
  navier_vortex: buildNavierStokesVortex3D,
  bernoulli_tube: buildBernoulliTube3D,
  benard_convection: buildBenardConvection3D,
  hooke_spring: buildHookeSpring3D,
  lever_archimedes: buildLeverArchimedes3D,
  buoyancy: buildBuoyancy3D,
  newton_mechanics: buildNewtonMechanics3D,
  doppler: buildDoppler3D,
  wave_string: buildWaveString3D,
  kdv_soliton: buildKdvSoliton3D,
  elliptic_curve: buildEllipticCurveSurface3D,
  complexity_hypercube: buildComplexityHypercube3D,
  ricci_flow: buildRicciFlow3D,
  einstein_curvature: buildEinsteinCurvature3D,
  hubble_expansion: buildHubbleExpansion3D,
  black_scholes: buildBlackScholesSurface3D,
  euler_beam: buildEulerBeam3D,
  calculus_riemann: buildCalculusRiemannSum3D,
  coulomb_field: buildCoulombField3D,
  riemann: buildRiemann3D,
  higgs: buildHiggs3D,
  fibonacci: buildFibonacci3D,
  kepler: buildKepler3D,
  euler: buildEuler3D,
  maxwell: buildMaxwell3D,
  gauss_electric: buildGaussElectric3D,
  gauss_magnetic: buildGaussMagnetic3D,
  faraday_maxwell: buildFaradayMaxwell3D,
  ampere_maxwell: buildAmpereMaxwell3D,
  lorentz_force: buildLorentzForce3D,
  rossler: buildRossler3D,
  kuramoto: buildKuramoto3D,
  langevin: buildLangevin3D,
  chladni: buildChladni3D,
  snell: buildSnell3D,
  pythagoras: buildPythagoras3D,
  thermo: buildThermo3D,
  automata: buildAutomata3D,
  // Modelos Fidedignos Adicionales (Cero Clones)
  ideal_gas: buildIdealGas3D,
  carnot_cycle: buildCarnotCycle3D,
  maxwell_boltzmann: buildMaxwellBoltzmannDist3D,
  boltzmann_entropy: buildBoltzmannEntropy3D,
  thermal_cooling: buildThermalCooling3D,
  de_broglie: buildDeBroglieWave3D,
  heisenberg: buildHeisenbergUncertainty3D,
  dirac: buildDiracEquation3D,
  planck_quantum: buildPlanckQuantum3D,
  feigenbaum: buildLogisticFeigenbaum3D,
  hamilton_phase: buildHamiltonPhase3D,
  euler_identity: buildEulerIdentity3D,
  godel: buildGodelIncompleteness3D,
  p_vs_np: buildPVsNP3D,
  shannon_entropy: buildShannonEntropy3D
};

  // ── RECOLECTOR DETERMINISTA DE RECURSOS WEBGL & VRAM (TIMONEL F2) ───
  function disposeMaterial(mat) {
    if (!mat) return;
    const textureKeys = [
      'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap',
      'envMap', 'alphaMap', 'aoMap', 'displacementMap', 'emissiveMap',
      'gradientMap', 'metalnessMap', 'roughnessMap'
    ];
    textureKeys.forEach(key => {
      if (mat[key] && typeof mat[key].dispose === 'function') {
        mat[key].dispose();
      }
    });
    if (typeof mat.dispose === 'function') {
      mat.dispose();
    }
  }

  function disposeThreeObject(obj) {
    if (!obj) return;
    if (typeof obj.traverse === 'function') {
      obj.traverse(child => {
        if (child.geometry && typeof child.geometry.dispose === 'function') {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => disposeMaterial(m));
          } else {
            disposeMaterial(child.material);
          }
        }
      });
    }
    if (obj.parent && typeof obj.parent.remove === 'function') {
      obj.parent.remove(obj);
    }
  }

  // ── EXPORTACIÓN MODULAR ─────────────────────────────────────────────
  const MuseumModels = {
    createParametricSurface,
    BESPOKE_3D_BUILDERS,
    disposeThreeObject,
    disposeMaterial
  };

  root.MuseumModels = MuseumModels;
  root.BESPOKE_3D_BUILDERS = BESPOKE_3D_BUILDERS;
  root.createParametricSurface = createParametricSurface;
  root.disposeThreeObject = disposeThreeObject;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MuseumModels;
  }

})(typeof window !== 'undefined' ? window : global);
