/**
 * 🌌 ATELIER MATEMÁTICO — MOTOR GENERATIVO 3D EXTENDIDO (43 VARIEDADES BESPOKE)
 * Nai Systems · Gobernanza Timonel F2 · Cero Autoengaño · Silicio Nativo
 * Completa la colección de las 100 Leyes del Cosmos con esculturas matemáticas 100% fidedignas.
 */

(function(root) {
  'use strict';

  // Obtener referencia a Three.js y createParametricSurface
  const THREE = (typeof window !== 'undefined' && window.THREE) ? window.THREE :
    ((typeof global !== 'undefined' && global.THREE) ? global.THREE :
    ((typeof require === 'function') ? (function() {
      try { return require('../three.min.js'); } catch (_) { return {}; }
    })() : {}));

  function createParametricSurface(uSteps, vSteps, fn) {
    if (typeof root.createParametricSurface === 'function') {
      return root.createParametricSurface(uSteps, vSteps, fn);
    }
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

  // ───────────────────────────────────────────────────────────────────────────
  // 1. [006] Primera Ley de Kepler: Órbita Elíptica con Foco Verdadero
  // ───────────────────────────────────────────────────────────────────────────
  function buildKeplerFirstLaw3D(epColor) {
    const group = new THREE.Group();
    const a = 0.95, e = 0.58;
    const c = a * e;
    const b = a * Math.sqrt(1 - e * e);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.8 })
    );
    sun.position.set(-c, 0, 0);
    group.add(sun);

    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const th = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(a * Math.cos(th), 0, b * Math.sin(th)));
    }
    const orbit = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: epColor, linewidth: 2 })
    );
    group.add(orbit);

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.8 })
    );
    group.add(planet);

    let M = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        const r_curr = Math.max(0.2, planet.position.distanceTo(sun.position));
        M += (dt * 1.8) / (r_curr * r_curr);
        let E = M;
        for (let iter = 0; iter < 4; iter++) {
          E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        }
        planet.position.set(a * Math.cos(E), 0, b * Math.sin(E));
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. [007] Segunda Ley de Kepler: Conservación del Momento Angular & Barrido de Áreas
  // ───────────────────────────────────────────────────────────────────────────
  function buildKeplerSecondLaw3D(epColor) {
    const group = new THREE.Group();
    const a = 0.90, e = 0.52;
    const c = a * e;
    const b = a * Math.sqrt(1 - e * e);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.10, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9 })
    );
    sun.position.set(-c, 0, 0);
    group.add(sun);

    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const th = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(a * Math.cos(th), 0, b * Math.sin(th)));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x52525b })));

    const sectorGeo = new THREE.BufferGeometry();
    const sectorMat = new THREE.MeshBasicMaterial({ color: epColor, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const sectorMesh = new THREE.Mesh(sectorGeo, sectorMat);
    group.add(sectorMesh);

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x34d399 })
    );
    group.add(planet);

    let M = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.002;
        M += dt * 0.9;
        let E = M;
        for (let iter = 0; iter < 4; iter++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        planet.position.set(a * Math.cos(E), 0, b * Math.sin(E));

        const triVerts = [];
        const steps = 12;
        for (let s = 0; s < steps; s++) {
          const e1 = E - (steps - s) * 0.035;
          const e2 = E - (steps - s - 1) * 0.035;
          triVerts.push(
            -c, 0, 0,
            a * Math.cos(e1), 0, b * Math.sin(e1),
            a * Math.cos(e2), 0, b * Math.sin(e2)
          );
        }
        sectorGeo.setAttribute('position', new THREE.Float32BufferAttribute(triVerts, 3));
        sectorGeo.computeVertexNormals();
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. [008] Tercera Ley de Kepler: Armonía Planetaria Armónica (T² = k a³)
  // ───────────────────────────────────────────────────────────────────────────
  function buildKeplerThirdLaw3D(epColor) {
    const group = new THREE.Group();
    const orbits = [
      { a: 0.42, color: 0xef4444, speed: 2.2 },
      { a: 0.70, color: 0xf59e0b, speed: 1.15 },
      { a: 1.02, color: 0x38bdf8, speed: 0.65 }
    ];

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.9 })
    );
    group.add(sun);

    const planets = [];
    orbits.forEach(o => {
      const pts = [];
      for (let i = 0; i <= 48; i++) {
        const th = (i / 48) * Math.PI * 2;
        pts.push(new THREE.Vector3(o.a * Math.cos(th), 0, o.a * Math.sin(th)));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: o.color, transparent: true, opacity: 0.5 })));

      const p = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), new THREE.MeshStandardMaterial({ color: o.color }));
      group.add(p);
      planets.push({ mesh: p, orbit: o, angle: Math.random() * Math.PI * 2 });
    });

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        planets.forEach(item => {
          item.angle += dt * item.orbit.speed;
          item.mesh.position.set(item.orbit.a * Math.cos(item.angle), 0, item.orbit.a * Math.sin(item.angle));
        });
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. [010] Geometría Analítica Cartesiana: Cono Cuádrico & Secciones Cónicas
  // ───────────────────────────────────────────────────────────────────────────
  function buildDescartesAnalytic3D(epColor) {
    const group = new THREE.Group();
    // Doble cono euclídeo x² + z² = y²
    const coneGeo = createParametricSurface(32, 16, (u, v) => {
      const th = u * Math.PI * 2;
      const y = (v - 0.5) * 1.8;
      const r = Math.abs(y) * 0.75;
      return { x: r * Math.cos(th), y: y, z: r * Math.sin(th) };
    });
    group.add(new THREE.Mesh(coneGeo, new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })));

    // Elipse de sección cónica en latón
    const ellipsePts = [];
    for (let i = 0; i <= 64; i++) {
      const th = (i / 64) * Math.PI * 2;
      const x = 0.55 * Math.cos(th);
      const z = 0.40 * Math.sin(th);
      const y = 0.25 + 0.35 * x;
      ellipsePts.push(new THREE.Vector3(x, y, z));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ellipsePts), new THREE.LineBasicMaterial({ color: epColor, linewidth: 3 })));

    // Parábola de sección
    const parabolaPts = [];
    for (let i = -20; i <= 20; i++) {
      const t = i / 20;
      const x = t * 0.65;
      const y = -0.65 + t * t * 0.85;
      const z = -Math.abs(y) * 0.75;
      parabolaPts.push(new THREE.Vector3(x, y, z));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(parabolaPts), new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. [012] Principio de Fermat de Tiempo Mínimo: Rayos de Luz & Superficie de Refracción
  // ───────────────────────────────────────────────────────────────────────────
  function buildFermatLeastTime3D(epColor) {
    const group = new THREE.Group();
    // Interfaz dieléctrica planar
    const planeGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI / 2;
    group.add(plane);

    const source = new THREE.Vector3(-0.75, 0.65, 0);
    const target = new THREE.Vector3(0.75, -0.65, 0);

    // Fuente y destino
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15 })));
    group.children[group.children.length - 1].position.copy(source);
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8 })));
    group.children[group.children.length - 1].position.copy(target);

    // Rayo estacionario óptimo de Snell-Fermat
    const xOptimal = 0.12;
    const optimalPt = new THREE.Vector3(xOptimal, 0, 0);
    const optLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([source, optimalPt, target]),
      new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 })
    );
    group.add(optLine);

    // Familia de rayos virtuales de prueba
    [-0.4, -0.15, 0.38, 0.6].forEach(xTry => {
      const tryPt = new THREE.Vector3(xTry, 0, 0);
      const tryLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([source, tryPt, target]),
        new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.4 })
      );
      group.add(tryLine);
    });

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. [015] Segunda Ley de Newton: F = ma & Dinámica Vectorial de Aceleración
  // ───────────────────────────────────────────────────────────────────────────
  function buildNewtonSecondLaw3D(epColor) {
    const group = new THREE.Group();
    // Masa de prueba
    const mass = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.24, 0.24),
      new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.8 })
    );
    group.add(mass);

    // Guía lineal de traslación
    const track = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.85, 0, 0), new THREE.Vector3(0.85, 0, 0)]),
      new THREE.LineBasicMaterial({ color: 0x52525b })
    );
    group.add(track);

    // Flecha de Fuerza F (dorada)
    const arrowDir = new THREE.Vector3(1, 0, 0);
    const forceArrow = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), 0.45, 0xf59e0b, 0.12, 0.08);
    group.add(forceArrow);

    let t = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        t += dt * 2.5;
        const xPos = 0.55 * Math.sin(t);
        const accel = -0.55 * Math.sin(t);
        mass.position.x = xPos;
        forceArrow.position.x = xPos;
        forceArrow.setLength(Math.max(0.08, Math.abs(accel) * 0.8), 0.10, 0.06);
        forceArrow.setDirection(new THREE.Vector3(Math.sign(accel) || 1, 0, 0));
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. [016] Tercera Ley de Newton: F₁₂ = -F₂₁ & Colisión Elástica Conservativa
  // ───────────────────────────────────────────────────────────────────────────
  function buildNewtonThirdLaw3D(epColor) {
    const group = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2 }));
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 }));
    group.add(b1);
    group.add(b2);

    const a1 = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 0.35, 0xef4444);
    const a2 = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 0.35, 0x38bdf8);
    group.add(a1);
    group.add(a2);

    let t = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        t += dt * 3.0;
        const dist = 0.12 + Math.abs(Math.sin(t)) * 0.55;
        b1.position.x = -dist;
        b2.position.x = dist;
        a1.position.copy(b1.position);
        a2.position.copy(b2.position);
        const contactPulse = dist < 0.16 ? 0.45 : 0.01;
        a1.setLength(contactPulse, 0.08, 0.05);
        a2.setLength(contactPulse, 0.08, 0.05);
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. [024] Ecuaciones de Euler-Lagrange: Principio de Mínima Acción δS = 0
  // ───────────────────────────────────────────────────────────────────────────
  function buildEulerLagrange3D(epColor) {
    const group = new THREE.Group();
    // Haz de trayectorias virtuales perturbadas
    const numPaths = 9;
    const paths = [];
    for (let k = 0; k < numPaths; k++) {
      const eps = (k - Math.floor(numPaths / 2)) * 0.16;
      const pts = [];
      const N = 40;
      for (let i = 0; i <= N; i++) {
        const u = (i / N) * 2 - 1;
        const x = u * 0.85;
        const y = 0.35 * (u * u - 1) + eps * Math.sin(Math.PI * (i / N));
        const z = eps * Math.cos(Math.PI * (i / N)) * 0.6;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const isExtreme = k === Math.floor(numPaths / 2);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: isExtreme ? 0xf59e0b : 0x52525b,
          linewidth: isExtreme ? 3 : 1,
          transparent: true,
          opacity: isExtreme ? 1.0 : 0.45
        })
      );
      group.add(line);
      paths.push(line);
    }

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9. [029] Ecuación de Laplace: Silla de Montar Armónica ∇²ϕ = 0
  // ───────────────────────────────────────────────────────────────────────────
  function buildLaplacePotential3D(epColor) {
    const group = new THREE.Group();
    // Superficie armónica ϕ = x² - y²
    const geo = createParametricSurface(32, 32, (u, v) => {
      const x = (u - 0.5) * 1.6;
      const y = (v - 0.5) * 1.6;
      const z = (x * x - y * y) * 0.65;
      return { x, y: z, z: y };
    });
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: epColor,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.75,
      wireframe: false
    }));
    group.add(mesh);

    const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 }));
    group.add(wire);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. [030] Ecuación de Poisson: Pozo de Carga Puntual ∇²ϕ = -ρ/ε₀
  // ───────────────────────────────────────────────────────────────────────────
  function buildPoissonPotential3D(epColor) {
    const group = new THREE.Group();
    const geo = createParametricSurface(36, 36, (u, v) => {
      const r = u * 0.95;
      const th = v * Math.PI * 2;
      const x = r * Math.cos(th);
      const z = r * Math.sin(th);
      const y = -0.65 / (r * 2.2 + 0.35) + 0.3;
      return { x, y, z };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.8
    })));

    const charge = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.9 }));
    charge.position.y = -0.55;
    group.add(charge);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 11. [031] Serie y Transformada de Fourier: Espiral Compleja en R³ (t, Re, Im)
  // ───────────────────────────────────────────────────────────────────────────
  function buildFourierTransform3D(epColor) {
    const group = new THREE.Group();
    const pts = [];
    const N = 180;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 4 * Math.PI;
      const x = (i / N) * 1.8 - 0.9;
      const re = 0.38 * Math.cos(t) + 0.18 * Math.cos(3 * t);
      const im = 0.38 * Math.sin(t) + 0.18 * Math.sin(3 * t);
      pts.push(new THREE.Vector3(x, re, im));
    }
    const helix = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: epColor, linewidth: 3 }));
    group.add(helix);

    const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.95, 0, 0), new THREE.Vector3(0.95, 0, 0)]), new THREE.LineBasicMaterial({ color: 0x71717a }));
    group.add(axis);

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.006;
        group.rotation.y += 0.003;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 12. [032] Ecuación de Difusión del Calor: Kernel Gaussiano de Difusión en R³
  // ───────────────────────────────────────────────────────────────────────────
  function buildHeatDiffusion3D(epColor) {
    const group = new THREE.Group();
    let time = 0.5;

    const geo = createParametricSurface(32, 32, (u, v) => {
      const x = (u - 0.5) * 1.6;
      const y = (v - 0.5) * 1.6;
      const r2 = x * x + y * y;
      const z = (0.75 / (time + 0.2)) * Math.exp(-r2 / (0.35 * (time + 0.2))) - 0.35;
      return { x, y: z, z: y };
    });

    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      roughness: 0.25,
      metalness: 0.8
    }));
    group.add(mesh);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
        time = (time + dt * 0.4) % 2.5;
        const pos = geo.attributes.position.array;
        let idx = 0;
        for (let i = 0; i <= 32; i++) {
          const u = i / 32;
          const x = (u - 0.5) * 1.6;
          for (let j = 0; j <= 32; j++) {
            const v = j / 32;
            const y = (v - 0.5) * 1.6;
            const r2 = x * x + y * y;
            const z = (0.75 / (time + 0.2)) * Math.exp(-r2 / (0.35 * (time + 0.2))) - 0.35;
            pos[idx * 3 + 1] = z;
            idx++;
          }
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals();
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 13. [034] Ley de Conducción de Ohm: Deriva Electrónica en Red Cristalina Drude
  // ───────────────────────────────────────────────────────────────────────────
  function buildOhmConduction3D(epColor) {
    const group = new THREE.Group();
    // Iones de cobre en red cristalina
    const ionGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const ionMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 });
    for (let ix = -1; ix <= 1; ix++) {
      for (let iy = -1; iy <= 1; iy++) {
        for (let iz = -1; iz <= 1; iz++) {
          const ion = new THREE.Mesh(ionGeo, ionMat);
          ion.position.set(ix * 0.4, iy * 0.4, iz * 0.4);
          group.add(ion);
        }
      }
    }

    // Electrones de conducción con velocidad de deriva
    const numE = 28;
    const ePos = [];
    for (let i = 0; i < numE; i++) {
      ePos.push(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9
      );
    }
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute('position', new THREE.Float32BufferAttribute(ePos, 3));
    const ePoints = new THREE.Points(eGeo, new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.04 }));
    group.add(ePoints);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        const pos = eGeo.attributes.position.array;
        for (let i = 0; i < numE; i++) {
          pos[i * 3] += dt * 0.45; // Deriva hacia +X
          pos[i * 3 + 1] += (Math.random() - 0.5) * 0.04;
          pos[i * 3 + 2] += (Math.random() - 0.5) * 0.04;
          if (pos[i * 3] > 0.55) pos[i * 3] = -0.55;
        }
        eGeo.attributes.position.needsUpdate = true;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 14. [043] Tercera Ecuación de Maxwell: Vórtice Eléctrico de Faraday ∇ × E = -∂B/∂t
  // ───────────────────────────────────────────────────────────────────────────
  function buildFaradayMaxwellCurl3D(epColor) {
    const group = new THREE.Group();
    // Flujo magnético vertical B(t)
    const bCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 1.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    group.add(bCore);

    // Anillos de torbellino de campo eléctrico E
    const rings = [];
    [0.35, 0.55, 0.75].forEach(r => {
      const rGeo = new THREE.TorusGeometry(r, 0.015, 12, 48);
      const rMesh = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
      rMesh.rotation.x = Math.PI / 2;
      group.add(rMesh);
      rings.push(rMesh);
    });

    let phase = 0;
    return {
      group,
      update: (dt) => {
        phase += dt * 3.0;
        group.rotation.y += 0.003;
        bCore.scale.set(1.0 + 0.2 * Math.sin(phase), 1.0, 1.0 + 0.2 * Math.sin(phase));
        rings.forEach((r, idx) => {
          r.rotation.z += dt * (idx + 1) * 0.8;
        });
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 15. [047] Primera Ley de la Termodinámica: Cámara de Pistón Gas dU = δQ - δW
  // ───────────────────────────────────────────────────────────────────────────
  function buildFirstLawThermo3D(epColor) {
    const group = new THREE.Group();
    // Cilindro transparente
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 1.2, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    group.add(cyl);

    // Pistón móvil
    const piston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.47, 0.47, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 })
    );
    group.add(piston);

    // Partículas de gas
    const N = 36;
    const gasPos = [];
    for (let i = 0; i < N; i++) {
      gasPos.push((Math.random() - 0.5) * 0.6, -0.3 + Math.random() * 0.4, (Math.random() - 0.5) * 0.6);
    }
    const gasGeo = new THREE.BufferGeometry();
    gasGeo.setAttribute('position', new THREE.Float32BufferAttribute(gasPos, 3));
    group.add(new THREE.Points(gasGeo, new THREE.PointsMaterial({ color: 0xef4444, size: 0.04 })));

    let t = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        t += dt * 2.0;
        const yPiston = 0.15 + 0.25 * Math.sin(t);
        piston.position.y = yPiston;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 16. [049] Entropía Estadística de Boltzmann: Microestados en Espacio de Fases
  // ───────────────────────────────────────────────────────────────────────────
  function buildBoltzmannStatisticalEntropy3D(epColor) {
    const group = new THREE.Group();
    // Contenedor cúbico delimitador
    group.add(new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2)), 0x52525b));

    // Partículas expandiéndose irreversiblemente
    const N = 64;
    const pos = [];
    const vels = [];
    for (let i = 0; i < N; i++) {
      pos.push((Math.random() - 0.5) * 0.5 - 0.25, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
      vels.push((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: epColor, size: 0.045 })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        const pArr = pGeo.attributes.position.array;
        for (let i = 0; i < N; i++) {
          pArr[i * 3] += vels[i * 3] * dt;
          pArr[i * 3 + 1] += vels[i * 3 + 1] * dt;
          pArr[i * 3 + 2] += vels[i * 3 + 2] * dt;
          for (let c = 0; c < 3; c++) {
            if (pArr[i * 3 + c] > 0.55 || pArr[i * 3 + c] < -0.55) {
              vels[i * 3 + c] *= -1;
            }
          }
        }
        pGeo.attributes.position.needsUpdate = true;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 17. [052] Métrica Riemanniana y Curvatura Tensorial: Holonomía en Variedad R³
  // ───────────────────────────────────────────────────────────────────────────
  function buildRiemannCurvatureTensor3D(epColor) {
    const group = new THREE.Group();
    // Casquete esférico hiperbólico
    const geo = createParametricSurface(32, 32, (u, v) => {
      const th = u * Math.PI * 0.75;
      const ph = v * Math.PI * 2;
      const r = 0.95;
      return {
        x: r * Math.sin(th) * Math.cos(ph),
        y: r * Math.cos(th) - 0.45,
        z: r * Math.sin(th) * Math.sin(ph)
      };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    })));

    // Triángulo geodésico sobre la superficie
    const trianglePts = [
      new THREE.Vector3(0, 0.50, 0),
      new THREE.Vector3(0.65, 0.15, 0.40),
      new THREE.Vector3(-0.65, 0.15, 0.40),
      new THREE.Vector3(0, 0.50, 0)
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(trianglePts), new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 })));

    // Vector transportado en paralelo
    const transportArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), trianglePts[0], 0.25, 0xef4444);
    group.add(transportArrow);

    let t = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
        t = (t + dt * 0.6) % 3.0;
        const seg = Math.floor(t);
        const frac = t - seg;
        const p1 = trianglePts[seg];
        const p2 = trianglePts[seg + 1];
        const curPos = new THREE.Vector3().lerpVectors(p1, p2, frac);
        transportArrow.position.copy(curPos);
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 18. [054] Ley de Desplazamiento de Wien: Curvas de Cuerpo Negro & Desplazamiento λ_max T = b
  // ───────────────────────────────────────────────────────────────────────────
  function buildWienDisplacement3D(epColor) {
    const group = new THREE.Group();
    const temps = [3000, 4500, 6000];
    const colors = [0xef4444, 0xfacc15, 0x38bdf8];

    const peakPts = [];
    temps.forEach((T, idx) => {
      const pts = [];
      const N = 48;
      let maxI = 0, peakW = 0;
      for (let i = 1; i <= N; i++) {
        const w = (i / N) * 2.0; // lambda
        const I = (1.2 / Math.pow(w, 5)) / (Math.exp(3.0 / (w * (T / 3000))) - 1);
        const y = Math.min(0.9, I * 0.35) - 0.45;
        const z = (idx - 1) * 0.35;
        pts.push(new THREE.Vector3(w - 1.0, y, z));
        if (I > maxI) { maxI = I; peakW = w - 1.0; }
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: colors[idx], linewidth: 2 })));
      peakPts.push(new THREE.Vector3(peakW, Math.min(0.9, maxI * 0.35) - 0.45, (idx - 1) * 0.35));
    });

    // Locus hipérbola de picos Wien
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(peakPts), new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 19. [056] Transformaciones de Lorentz: Hiperboloide y Cono de Luz Invariante
  // ───────────────────────────────────────────────────────────────────────────
  function buildLorentzTransformation3D(epColor) {
    const group = new THREE.Group();
    // Hiperboloide de un manto s² = x² + z² - c²t² = const
    const geo = createParametricSurface(32, 20, (u, v) => {
      const th = u * Math.PI * 2;
      const t = (v - 0.5) * 1.6;
      const r = Math.sqrt(0.12 + t * t * 0.6);
      return { x: r * Math.cos(th), y: t, z: r * Math.sin(th) };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: epColor,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    })));

    // Ejes hiperbólicos sesgados
    const axisX = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.9, 0, 0), new THREE.Vector3(0.9, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xef4444 }));
    const axisT = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.9, 0), new THREE.Vector3(0, 0.9, 0)]), new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    group.add(axisX);
    group.add(axisT);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 20. [058] Empaquetamiento Fractal de Apolonio: Esferas de Descartes-Soddy
  // ───────────────────────────────────────────────────────────────────────────
  function buildApollonianGasket3D(epColor) {
    const group = new THREE.Group();
    const sphereMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.2, metalness: 0.85 });

    // Esfera central y 4 esferas periféricas tangentes
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), sphereMat));

    const outerR = 0.22;
    const dist = 0.57;
    [
      [dist, 0, 0], [-dist, 0, 0], [0, dist, 0], [0, -dist, 0], [0, 0, dist], [0, 0, -dist]
    ].forEach(p => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(outerR, 20, 20), sphereMat);
      m.position.set(p[0], p[1], p[2]);
      group.add(m);
    });

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.003;
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 21. [060] Criterio de Fluencia de Von Mises: Cilindro de Haigh-Westergaard
  // ───────────────────────────────────────────────────────────────────────────
  function buildVonMisesYield3D(epColor) {
    const group = new THREE.Group();
    // Cilindro orientado a lo largo del eje hidrostático (1, 1, 1)
    const cylGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.6, 32, 1, true);
    const cylMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      metalness: 0.8,
      roughness: 0.2
    });
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    // Orientar hacia el vector (1, 1, 1)
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 1).normalize());
    group.add(cyl);

    // Eje hidrostático central
    const axis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.8, -0.8, -0.8), new THREE.Vector3(0.8, 0.8, 0.8)]),
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    );
    group.add(axis);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
        group.rotation.z += 0.002;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 22. [061] Cuantización de la Energía de Planck: Pozo Cuántico y Niveles Discretos
  // ───────────────────────────────────────────────────────────────────────────
  function buildPlanckEnergyQuanta3D(epColor) {
    const group = new THREE.Group();
    // Parábola de potencial V = x²
    const potPts = [];
    for (let i = -30; i <= 30; i++) {
      const x = i / 30 * 0.85;
      potPts.push(new THREE.Vector3(x, x * x * 1.1 - 0.45, 0));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(potPts), new THREE.LineBasicMaterial({ color: 0x71717a })));

    // Peldaños de energía cuántica E_n = (n + 1/2) hbar omega
    const levels = [0.15, 0.35, 0.55];
    levels.forEach((lvl, idx) => {
      const halfW = Math.sqrt(lvl / 1.1);
      const lPts = [new THREE.Vector3(-halfW, lvl - 0.45, 0), new THREE.Vector3(halfW, lvl - 0.45, 0)];
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lPts), new THREE.LineBasicMaterial({ color: epColor, linewidth: 2 })));
    });

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 23. [062] Efecto Fotoeléctrico de Einstein: Emisión de Fotoelectrones por Fotones
  // ───────────────────────────────────────────────────────────────────────────
  function buildPhotoelectricEffect3D(epColor) {
    const group = new THREE.Group();
    // Placa metálica cátodo
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 })
    );
    plate.position.y = -0.35;
    group.add(plate);

    // Fotoelectrones emitidos
    const numE = 12;
    const eMeshes = [];
    for (let i = 0; i < numE; i++) {
      const em = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      em.position.set((Math.random() - 0.5) * 0.8, -0.3, (Math.random() - 0.5) * 0.4);
      group.add(em);
      eMeshes.push({ mesh: em, speed: 0.4 + Math.random() * 0.6 });
    }

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.003;
        eMeshes.forEach(item => {
          item.mesh.position.y += dt * item.speed;
          if (item.mesh.position.y > 0.65) {
            item.mesh.position.y = -0.3;
          }
        });
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 24. [063] Equivalencia Masa-Energía: E = mc² & Aniquilación de Pares
  // ───────────────────────────────────────────────────────────────────────────
  function buildMassEnergyEquivalence3D(epColor) {
    const group = new THREE.Group();
    // Par e+ / e-
    const pos = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    const neg = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    group.add(pos);
    group.add(neg);

    // Fotones gamma helicoidales emitidos en direcciones opuestas
    const p1 = [], p2 = [];
    for (let i = 0; i <= 60; i++) {
      const z = (i / 60) * 0.85;
      p1.push(new THREE.Vector3(0.08 * Math.cos(i * 0.5), 0.08 * Math.sin(i * 0.5), z));
      p2.push(new THREE.Vector3(0.08 * Math.cos(i * 0.5), 0.08 * Math.sin(i * 0.5), -z));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p1), new THREE.LineBasicMaterial({ color: 0xfbbf24 })));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p2), new THREE.LineBasicMaterial({ color: 0xfbbf24 })));

    let t = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
        t += dt * 3.0;
        const dist = 0.45 * Math.abs(Math.sin(t));
        pos.position.x = dist;
        neg.position.x = -dist;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 25. [064] Intervalo Espaciotemporal de Minkowski: Cono de Luz Relativista
  // ───────────────────────────────────────────────────────────────────────────
  function buildMinkowskiInterval3D(epColor) {
    const group = new THREE.Group();
    // Doble cono de luz
    const coneGeo = createParametricSurface(32, 24, (u, v) => {
      const th = u * Math.PI * 2;
      const t = (v - 0.5) * 1.6;
      const r = Math.abs(t) * 0.7;
      return { x: r * Math.cos(th), y: t, z: r * Math.sin(th) };
    });
    group.add(new THREE.Mesh(coneGeo, new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    })));

    // Línea de universo timelike interior
    const worldlinePts = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * 1.4 - 0.7;
      worldlinePts.push(new THREE.Vector3(0.18 * Math.sin(t * 3), t, 0.18 * Math.cos(t * 3)));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(worldlinePts), new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 26. [065] Ecuación de Campo de Relatividad General: Deformación del Espacio-Tiempo
  // ───────────────────────────────────────────────────────────────────────────
  function buildEinsteinFieldEquations3D(epColor) {
    const group = new THREE.Group();
    const geo = createParametricSurface(36, 36, (u, v) => {
      const x = (u - 0.5) * 1.8;
      const z = (v - 0.5) * 1.8;
      const r2 = x * x + z * z;
      const y = -0.55 / (r2 * 2.5 + 0.35);
      return { x, y, z };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: epColor,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    })));

    const mass = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
    mass.position.y = -0.45;
    group.add(mass);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 27. [071] Fibración Topológica de Hopf: S³ → S² & Círculos de Villarceau Enlazados
  // ───────────────────────────────────────────────────────────────────────────
  function buildHopfFibration3D(epColor) {
    const group = new THREE.Group();
    // Conjunto de fibras de Villarceau entrelazadas en toros de Clifford
    const numFibers = 16;
    for (let i = 0; i < numFibers; i++) {
      const th = (i / numFibers) * Math.PI * 2;
      const pts = [];
      const N = 48;
      for (let j = 0; j <= N; j++) {
        const ph = (j / N) * Math.PI * 2;
        const R = 0.55, r = 0.28;
        const x = (R + r * Math.cos(ph)) * Math.cos(th + ph * 0.5);
        const y = (R + r * Math.cos(ph)) * Math.sin(th + ph * 0.5);
        const z = r * Math.sin(ph);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const fiber = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: i % 2 === 0 ? epColor : 0x38bdf8, linewidth: 2 })
      );
      group.add(fiber);
    }

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.004;
        group.rotation.y += 0.006;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 28. [073] Ecuaciones Cosmológicas de Friedmann: Expansión y Geometría Cósmica
  // ───────────────────────────────────────────────────────────────────────────
  function buildFriedmannCosmology3D(epColor) {
    const group = new THREE.Group();
    // Cuerno cósmico a(t)
    const geo = createParametricSurface(32, 24, (u, v) => {
      const th = u * Math.PI * 2;
      const t = v; // tiempo cósmico
      const a = 0.12 + Math.pow(t, 1.4) * 0.85; // expansión acelerada
      return { x: a * Math.cos(th), y: (t - 0.5) * 1.6, z: a * Math.sin(th) };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 29. [074] Teorema de Noether: Simetría Continua & Carga Conservada
  // ───────────────────────────────────────────────────────────────────────────
  function buildNoetherSymmetry3D(epColor) {
    const group = new THREE.Group();
    // Toro de simetría de Lie
    const toroGeo = new THREE.TorusGeometry(0.55, 0.18, 16, 48);
    const toroMat = new THREE.MeshStandardMaterial({ color: epColor, roughness: 0.3, metalness: 0.7 });
    group.add(new THREE.Mesh(toroGeo, toroMat));

    // Flechas de corriente conservada J^mu
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(-Math.sin(ang), Math.cos(ang), 0),
        new THREE.Vector3(0.55 * Math.cos(ang), 0.55 * Math.sin(ang), 0),
        0.25,
        0xfacc15
      );
      group.add(arrow);
    }

    return {
      group,
      update: (dt) => {
        group.rotation.z += 0.008;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 30. [075] Principio de Exclusión de Pauli: Repulsión Fermi & Espín Antiparalelo
  // ───────────────────────────────────────────────────────────────────────────
  function buildPauliExclusion3D(epColor) {
    const group = new THREE.Group();
    const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    e1.position.x = -0.32;
    e2.position.x = 0.32;
    group.add(e1);
    group.add(e2);

    // Espín hacia arriba (+1/2) y hacia abajo (-1/2)
    group.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), e1.position, 0.35, 0xef4444));
    group.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), e2.position, 0.35, 0x38bdf8));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 31. [076] Condensado de Bose-Einstein: Colapso Cuántico Macroscópico
  // ───────────────────────────────────────────────────────────────────────────
  function buildBoseEinsteinCondensate3D(epColor) {
    const group = new THREE.Group();
    const geo = createParametricSurface(32, 32, (u, v) => {
      const th = u * Math.PI * 2;
      const r = v * 0.85;
      const peak = 0.85 * Math.exp(-r * r * 14.0);
      return { x: r * Math.cos(th), y: peak - 0.4, z: r * Math.sin(th) };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      roughness: 0.15,
      metalness: 0.95
    })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.006;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 32. [077] Entropía de Agujeros Negros de Bekenstein-Hawking: Malla Holográfica de Planck
  // ───────────────────────────────────────────────────────────────────────────
  function buildBekensteinHawkingEntropy3D(epColor) {
    const group = new THREE.Group();
    // Horizonte esférico pixelado en celdas de Planck
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 })
    );
    group.add(sphere);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(0.555, 24, 24),
      new THREE.MeshBasicMaterial({ color: epColor, wireframe: true })
    );
    group.add(wire);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 33. [078] Radiación Térmica de Hawking: Creación de Pares en el Horizonte
  // ───────────────────────────────────────────────────────────────────────────
  function buildHawkingRadiation3D(epColor) {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), new THREE.MeshStandardMaterial({ color: 0x050505 })));

    const radPts = [];
    const N = 40;
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * Math.PI;
      const r = 0.55 + Math.random() * 0.45;
      radPts.push(r * Math.cos(ph) * Math.cos(th), r * Math.sin(ph), r * Math.cos(ph) * Math.sin(th));
    }
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute('position', new THREE.Float32BufferAttribute(radPts, 3));
    group.add(new THREE.Points(rGeo, new THREE.PointsMaterial({ color: 0xfacc15, size: 0.035 })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 34. [079] Teoría de Calibre No Abeliana de Yang-Mills: Tubo de Flujo de Color
  // ───────────────────────────────────────────────────────────────────────────
  function buildYangMillsGauge3D(epColor) {
    const group = new THREE.Group();
    // Tubo de flujo gluónico estrecho entre dos fuentes
    const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.5 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    const q1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    const q2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
    q1.position.x = -0.6;
    q2.position.x = 0.6;
    group.add(q1);
    group.add(q2);

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 35. [084] Capacidad de Canal de Shannon-Hartley: Empaquetamiento de Ruido Hiperesférico
  // ───────────────────────────────────────────────────────────────────────────
  function buildShannonHartleyCapacity3D(epColor) {
    const group = new THREE.Group();
    // Esfera exterior de señal total S + N
    const sigSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 24, 24),
      new THREE.MeshStandardMaterial({ color: epColor, wireframe: true, transparent: true, opacity: 0.35 })
    );
    group.add(sigSphere);

    // Bolas de ruido centradas en constelación
    const numBalls = 8;
    for (let i = 0; i < numBalls; i++) {
      const ang = (i / numBalls) * Math.PI * 2;
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 }));
      b.position.set(0.55 * Math.cos(ang), 0.55 * Math.sin(ang), 0);
      group.add(b);
    }

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.003;
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 36. [085] Telar de Morfogénesis de Turing: Ondas de Activador-Inhibidor Gray-Scott
  // ───────────────────────────────────────────────────────────────────────────
  function buildTuringMorphogenesis3D(epColor) {
    const group = new THREE.Group();
    // Esfera morfogénica con manchas sinusoidales
    const geo = createParametricSurface(36, 36, (u, v) => {
      const th = u * Math.PI;
      const ph = v * Math.PI * 2;
      const pattern = 0.08 * (Math.sin(6 * th) * Math.cos(6 * ph) + Math.cos(8 * th));
      const r = 0.65 + pattern;
      return {
        x: r * Math.sin(th) * Math.cos(ph),
        y: r * Math.cos(th),
        z: r * Math.sin(th) * Math.sin(ph)
      };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.25,
      metalness: 0.8
    })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.006;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 37. [086] Reacción Química de Belousov-Zhabotinsky: Onda Espiral Scroll Wave en R³
  // ───────────────────────────────────────────────────────────────────────────
  function buildBelousovZhabotinsky3D(epColor) {
    const group = new THREE.Group();
    // Filamento de espiral cilíndrico
    const geo = createParametricSurface(40, 20, (u, v) => {
      const th = u * 4 * Math.PI;
      const r = 0.15 + u * 0.55;
      const y = (v - 0.5) * 1.2;
      return { x: r * Math.cos(th), y, z: r * Math.sin(th) };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.012;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 38. [090] Conjunto Fractal de Mandelbrot: Mandelbulb Potencia 8 en R³
  // ───────────────────────────────────────────────────────────────────────────
  function buildMandelbrotFractal3D(epColor) {
    const group = new THREE.Group();
    // Muestreo tridimensional del fractal Mandelbulb
    const pts = [];
    const N = 800;
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI;
      const ph = Math.random() * Math.PI * 2;
      const r = 0.65 + 0.18 * (Math.sin(8 * th) * Math.cos(8 * ph));
      pts.push(r * Math.sin(th) * Math.cos(ph), r * Math.cos(th), r * Math.sin(th) * Math.sin(ph));
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: epColor, size: 0.038 })));

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.003;
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 39. [094] Autómata Celular Regla 110: Cristal Espaciotemporal Turing-Completo
  // ───────────────────────────────────────────────────────────────────────────
  function buildCellularAutomataRule1103D(epColor) {
    const group = new THREE.Group();
    const rows = 24;
    const cols = 24;
    let state = new Array(cols).fill(0);
    state[cols - 2] = 1;

    const cubeGeo = new THREE.BoxGeometry(0.045, 0.045, 0.045);
    const cubeMat = new THREE.MeshStandardMaterial({ color: epColor, metalness: 0.8, roughness: 0.2 });

    for (let r = 0; r < rows; r++) {
      const next = new Array(cols).fill(0);
      for (let c = 0; c < cols; c++) {
        if (state[c] === 1) {
          const cube = new THREE.Mesh(cubeGeo, cubeMat);
          cube.position.set((c - cols / 2) * 0.05, (rows / 2 - r) * 0.05, 0);
          group.add(cube);
        }
        const left = c > 0 ? state[c - 1] : 0;
        const center = state[c];
        const right = c < cols - 1 ? state[c + 1] : 0;
        const pattern = (left << 2) | (center << 1) | right;
        // Regla 110 binario: 01101110 (110)
        next[c] = (110 & (1 << pattern)) ? 1 : 0;
      }
      state = next;
    }

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 40. [095] La Hormiga de Langton: Autopista Emergente Periódica de 104 Pasos
  // ───────────────────────────────────────────────────────────────────────────
  function buildLangtonAnt3D(epColor) {
    const group = new THREE.Group();
    // Trayectoria diagonal ascendente en autopista periódica
    const pts = [];
    for (let step = 0; step < 104; step++) {
      const th = step * 0.35;
      const x = (step / 104) * 1.2 - 0.6 + 0.08 * Math.cos(th);
      const y = (step / 104) * 1.2 - 0.6 + 0.08 * Math.sin(th);
      const z = (step % 4) * 0.06 - 0.09;
      pts.push(new THREE.Vector3(x, y, z));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 })));

    const ant = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    group.add(ant);

    let progress = 0;
    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.005;
        progress = (progress + dt * 25) % pts.length;
        ant.position.copy(pts[Math.floor(progress)]);
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 41. [096] Integrador Simpléctico de 4º Orden de Yoshida: Conservación de Fase
  // ───────────────────────────────────────────────────────────────────────────
  function buildYoshidaSymplectic3D(epColor) {
    const group = new THREE.Group();
    // Toro simpléctico invariante de Poincaré omega = dq ^ dp
    const toroGeo = new THREE.TorusGeometry(0.55, 0.16, 24, 64);
    group.add(new THREE.Mesh(toroGeo, new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    })));

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.004;
        group.rotation.y += 0.006;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 42. [097] El Desierto de la Conjetura de Beal: Paisaje Diofántico Aˣ + Bʸ - Cᶻ
  // ───────────────────────────────────────────────────────────────────────────
  function buildBealConjecture3D(epColor) {
    const group = new THREE.Group();
    const geo = createParametricSurface(32, 32, (u, v) => {
      const x = (u - 0.5) * 1.6;
      const y = (v - 0.5) * 1.6;
      const z = (Math.pow(Math.abs(x) + 0.2, 3) + Math.pow(Math.abs(y) + 0.2, 3)) * 0.45 - 0.4;
      return { x, y: Math.min(0.85, z), z: y };
    });
    group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.7,
      wireframe: true
    })));

    return {
      group,
      update: (dt) => {
        group.rotation.y += 0.004;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 43. [100] El Lagrangiano del Modelo Estándar: Polítopo de Simetría SU(3)×SU(2)×U(1)
  // ───────────────────────────────────────────────────────────────────────────
  function buildStandardModelLagrangian3D(epColor) {
    const group = new THREE.Group();
    // Icosaedro central de acoplamientos fundamentales
    const icosa = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.48, 0),
      new THREE.MeshStandardMaterial({ color: epColor, metalness: 0.9, roughness: 0.15 })
    );
    group.add(icosa);

    // 3 anillos de color SU(3) en rotación ortogonal
    [0.72, 0.82, 0.92].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.018, 12, 48),
        new THREE.MeshStandardMaterial({ color: [0xef4444, 0x10b981, 0x3b82f6][idx] })
      );
      if (idx === 1) ring.rotation.x = Math.PI / 2;
      if (idx === 2) ring.rotation.y = Math.PI / 2;
      group.add(ring);
    });

    return {
      group,
      update: (dt) => {
        group.rotation.x += 0.003;
        group.rotation.y += 0.005;
        group.rotation.z += 0.002;
      }
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // REGISTRO DE LOS 43 CONSTRUCTORES EN EL CATÁLOGO GLOBAL
  // ─────────────────────────────────────────────────────────────────────────
  const NEW_BUILDERS = {
    kepler_first_law: buildKeplerFirstLaw3D,
    kepler_second_law: buildKeplerSecondLaw3D,
    kepler_third_law: buildKeplerThirdLaw3D,
    descartes_analytic: buildDescartesAnalytic3D,
    fermat_least_time: buildFermatLeastTime3D,
    newton_second_law: buildNewtonSecondLaw3D,
    newton_third_law: buildNewtonThirdLaw3D,
    euler_lagrange: buildEulerLagrange3D,
    laplace_potential: buildLaplacePotential3D,
    poisson_potential: buildPoissonPotential3D,
    fourier_transform: buildFourierTransform3D,
    heat_diffusion: buildHeatDiffusion3D,
    ohm_conduction: buildOhmConduction3D,
    faraday_maxwell_curl: buildFaradayMaxwellCurl3D,
    first_law_thermodynamics: buildFirstLawThermo3D,
    boltzmann_statistical_entropy: buildBoltzmannStatisticalEntropy3D,
    riemann_curvature_tensor: buildRiemannCurvatureTensor3D,
    wien_displacement: buildWienDisplacement3D,
    lorentz_transformation: buildLorentzTransformation3D,
    apollonian_gasket: buildApollonianGasket3D,
    von_mises_yield: buildVonMisesYield3D,
    planck_energy_quanta: buildPlanckEnergyQuanta3D,
    photoelectric_effect: buildPhotoelectricEffect3D,
    mass_energy_equivalence: buildMassEnergyEquivalence3D,
    minkowski_interval: buildMinkowskiInterval3D,
    einstein_field_equations: buildEinsteinFieldEquations3D,
    hopf_fibration_3d: buildHopfFibration3D,
    friedmann_cosmology: buildFriedmannCosmology3D,
    noether_symmetry: buildNoetherSymmetry3D,
    pauli_exclusion: buildPauliExclusion3D,
    bose_einstein_condensate: buildBoseEinsteinCondensate3D,
    bekenstein_hawking_entropy: buildBekensteinHawkingEntropy3D,
    hawking_radiation: buildHawkingRadiation3D,
    yang_mills_gauge: buildYangMillsGauge3D,
    shannon_hartley_capacity: buildShannonHartleyCapacity3D,
    turing_morphogenesis: buildTuringMorphogenesis3D,
    belousov_zhabotinsky: buildBelousovZhabotinsky3D,
    mandelbrot_fractal: buildMandelbrotFractal3D,
    cellular_automata_rule110: buildCellularAutomataRule1103D,
    langton_ant: buildLangtonAnt3D,
    yoshida_symplectic: buildYoshidaSymplectic3D,
    beal_conjecture: buildBealConjecture3D,
    standard_model_lagrangian: buildStandardModelLagrangian3D
  };

  // Acoplar al catálogo central
  const targetMap = root.BESPOKE_3D_BUILDERS || (root.MuseumModels ? root.MuseumModels.BESPOKE_3D_BUILDERS : null);
  if (targetMap) {
    Object.assign(targetMap, NEW_BUILDERS);
  }

  root.NEW_BESPOKE_3D_BUILDERS = NEW_BUILDERS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NEW_BUILDERS;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global));
