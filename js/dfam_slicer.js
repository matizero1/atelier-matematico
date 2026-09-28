/**
 * 🛰️ ATELIER MATEMÁTICO — MOTOR DE REBANADO PLANAR & COMPILADOR G-CODE (DFAM)
 * Slicing Planar, Relleno Celular, Estimación Física y Generación G-code Marlin/RepRap
 * Gobernanza: Timonel F2 · Estándar ISO/ASTM 52915 · Silicio Nativo Cero Dependencias
 */

(function(root) {
  'use strict';

  // Constantes Físicas de Manufactura Aditiva (PLA Estándar)
  const DENSITY_PLA = 0.00124; // g / mm³ (1.24 g/cm³)
  const FILAMENT_DIAMETER = 1.75; // mm
  const FILAMENT_AREA = Math.PI * Math.pow(FILAMENT_DIAMETER / 2, 2); // 2.4053 mm²
  const DEFAULT_BED_SIZE = { x: 220, y: 220 }; // mm

  /**
   * Corta un conjunto de triángulos orientados en el plano z = zCut.
   * Retorna una lista de segmentos de línea en 2D: [ { x1, y1, x2, y2 } ].
   */
  function intersectTrianglesWithPlane(triangles, zCut) {
    const segments = [];
    const eps = 1e-6;

    for (let i = 0; i < triangles.length; i++) {
      const t = triangles[i];
      const v0 = t.v0, v1 = t.v1, v2 = t.v2;

      // Verificar si el plano corta el rango Z del triángulo
      const minZ = Math.min(v0.z, v1.z, v2.z);
      const maxZ = Math.max(v0.z, v1.z, v2.z);
      if (zCut < minZ - eps || zCut > maxZ + eps) continue;

      const pts = [];

      // Intersectar cada una de las 3 aristas
      const edges = [[v0, v1], [v1, v2], [v2, v0]];
      for (let j = 0; j < 3; j++) {
        const pA = edges[j][0];
        const pB = edges[j][1];
        const dz = pB.z - pA.z;

        if (Math.abs(dz) < eps) {
          // Arista horizontal contenida exactamente en el plano
          if (Math.abs(pA.z - zCut) < eps) {
            pts.push({ x: pA.x, y: pA.y });
            pts.push({ x: pB.x, y: pB.y });
          }
          continue;
        }

        const tParam = (zCut - pA.z) / dz;
        if (tParam >= -eps && tParam <= 1.0 + eps) {
          const clampedT = Math.max(0.0, Math.min(1.0, tParam));
          const ix = pA.x + clampedT * (pB.x - pA.x);
          const iy = pA.y + clampedT * (pB.y - pA.y);

          // Evitar puntos duplicados en vértices compartidos
          const isDuplicate = pts.some(p => Math.hypot(p.x - ix, p.y - iy) < 1e-4);
          if (!isDuplicate) {
            pts.push({ x: ix, y: iy });
          }
        }
      }

      if (pts.length >= 2) {
        segments.push({
          x1: pts[0].x,
          y1: pts[0].y,
          x2: pts[1].x,
          y2: pts[1].y
        });
      }
    }

    return segments;
  }

  /**
   * Conecta segmentos desordenados en cadenas poligonales / lazos cerrados (Loops).
   */
  function assemblePolygons(segments) {
    if (!segments || segments.length === 0) return [];

    const remaining = segments.map(s => ({ ...s, used: false }));
    const loops = [];
    const connectTolerance = 0.05; // 50 micrómetros

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].used) continue;

      const loop = [{ x: remaining[i].x1, y: remaining[i].y1 }, { x: remaining[i].x2, y: remaining[i].y2 }];
      remaining[i].used = true;

      let expanded = true;
      while (expanded) {
        expanded = false;
        const tail = loop[loop.length - 1];

        // Buscar siguiente segmento adyacente a la cola
        for (let j = 0; j < remaining.length; j++) {
          if (remaining[j].used) continue;
          const s = remaining[j];

          if (Math.hypot(tail.x - s.x1, tail.y - s.y1) < connectTolerance) {
            loop.push({ x: s.x2, y: s.y2 });
            s.used = true;
            expanded = true;
            break;
          } else if (Math.hypot(tail.x - s.x2, tail.y - s.y2) < connectTolerance) {
            loop.push({ x: s.x1, y: s.y1 });
            s.used = true;
            expanded = true;
            break;
          }
        }
      }

      if (loop.length >= 3) {
        loops.push(loop);
      }
    }

    return loops;
  }

  /**
   * Verifica si un punto 2D está dentro de un polígono cerrado (Raycasting Even-Odd rule).
   */
  function isPointInsidePolygon(pt, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi + 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Genera líneas de relleno celular (Infill) recortadas contra los contornos del polígono.
   */
  function generateInfillLines(polygons, density, pattern, layerIndex, nozzleDiameter) {
    if (!polygons || polygons.length === 0 || density <= 0.01) return [];
    if (density > 0.98) density = 1.0;

    const infillSegments = [];
    const spacing = Math.max(nozzleDiameter, nozzleDiameter / density);

    // Calcular Bounding Box del polígono
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    polygons.forEach(loop => {
      loop.forEach(pt => {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      });
    });

    if (!isFinite(minX)) return [];

    // ── Relleno Celular Giroide TPMS (Superficie Mínima Triplemente Periódica) ──
    if (pattern === 'GYROID') {
      const lambda = spacing * 1.6;
      const k = (2 * Math.PI) / lambda;
      const phaseZ = layerIndex * 0.45;
      const stepX = Math.max(0.6, nozzleDiameter * 1.2);

      for (let y = minY - spacing; y <= maxY + spacing; y += spacing) {
        let currentSegment = null;
        for (let x = minX; x <= maxX; x += stepX) {
          const waveY = y + (spacing * 0.38) * Math.sin(k * x + phaseZ);
          const pt = { x, y: waveY };
          const isInside = polygons.some(poly => isPointInsidePolygon(pt, poly));
          if (isInside) {
            if (!currentSegment) {
              currentSegment = [pt];
            } else {
              currentSegment.push(pt);
            }
          } else {
            if (currentSegment && currentSegment.length >= 2) {
              for (let s = 0; s < currentSegment.length - 1; s++) {
                infillSegments.push({
                  x1: currentSegment[s].x,
                  y1: currentSegment[s].y,
                  x2: currentSegment[s + 1].x,
                  y2: currentSegment[s + 1].y
                });
              }
            }
            currentSegment = null;
          }
        }
        if (currentSegment && currentSegment.length >= 2) {
          for (let s = 0; s < currentSegment.length - 1; s++) {
            infillSegments.push({
              x1: currentSegment[s].x,
              y1: currentSegment[s].y,
              x2: currentSegment[s + 1].x,
              y2: currentSegment[s + 1].y
            });
          }
        }
      }
      return infillSegments;
    }

    // Patrón de líneas alternadas a 45° y -45°
    const angleRad = (pattern === 'GRID' || (layerIndex % 2 === 0)) ? (Math.PI / 4) : (-Math.PI / 4);
    const cosA = Math.cos(angleRad), sinA = Math.sin(angleRad);

    // Bounding Box en espacio rotado
    const rMinX = minX * cosA + minY * sinA;
    const rMaxX = maxX * cosA + maxY * sinA;
    const rMinY = -minX * sinA + minY * cosA;
    const rMaxY = -maxX * sinA + maxY * cosA;

    const diag = Math.hypot(maxX - minX, maxY - minY);
    const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };

    const startOffset = -diag / 2;
    const endOffset = diag / 2;

    for (let offset = startOffset; offset <= endOffset; offset += spacing) {
      // Línea de barrido infinita perpendicular al ángulo
      const lineP0 = {
        x: center.x + offset * (-sinA) - (diag) * cosA,
        y: center.y + offset * cosA - (diag) * sinA
      };
      const lineP1 = {
        x: center.x + offset * (-sinA) + (diag) * cosA,
        y: center.y + offset * cosA + (diag) * sinA
      };

      // Intersectar la línea con todos los bordes de los polígonos
      const hits = [];
      polygons.forEach(loop => {
        for (let i = 0; i < loop.length - 1; i++) {
          const eA = loop[i], eB = loop[i + 1];
          const hit = getLineIntersection(lineP0, lineP1, eA, eB);
          if (hit) hits.push(hit);
        }
      });

      // Ordenar intersecciones a lo largo de la línea
      hits.sort((a, b) => a.param - b.param);

      // Emparejar de a 2 (regla par-impar de sólidos cerrados)
      for (let h = 0; h < hits.length - 1; h += 2) {
        const p1 = hits[h].point;
        const p2 = hits[h + 1].point;
        const midPt = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

        // Verificar que el punto medio esté dentro de al menos un polígono sólido
        const isInside = polygons.some(poly => isPointInsidePolygon(midPt, poly));
        if (isInside && Math.hypot(p2.x - p1.x, p2.y - p1.y) > nozzleDiameter * 0.5) {
          infillSegments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
        }
      }
    }

    return infillSegments;
  }

  /**
   * Intersección paramétrica entre dos segmentos de línea en 2D.
   */
  function getLineIntersection(p1, p2, p3, p4) {
    const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (Math.abs(denom) < 1e-12) return null;

    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return {
        param: ua,
        point: {
          x: p1.x + ua * (p2.x - p1.x),
          y: p1.y + ua * (p2.y - p1.y)
        }
      };
    }
    return null;
  }

  /**
   * Kernel principal de rebanado volumétrico.
   * Divide la geometría 3D en capas horizontales planas listas para fabricación aditiva.
   */
  function sliceGeometry(objectOrGeometry, options = {}) {
    let triangles = [];
    let bbox = null;

    if (options.triangles && options.bbox) {
      triangles = options.triangles;
      bbox = options.bbox;
    } else if (root.Atelier3DExporter && typeof root.Atelier3DExporter.extractTriangles === 'function') {
      const extracted = root.Atelier3DExporter.extractTriangles(objectOrGeometry, {
        targetDimensionMm: options.targetDimensionMm || 100.0,
        preserveScale: options.preserveScale || false
      });
      triangles = extracted.triangles;
      bbox = extracted.bbox;
    } else {
      throw new Error('AtelierSlicer: No se encontró Atelier3DExporter para extraer triángulos.');
    }

    const layerHeight = options.layerHeight || 0.20; // mm
    const infillDensity = typeof options.infillDensity === 'number' ? options.infillDensity : 0.20;
    const infillPattern = options.infillPattern || 'LINES'; // 'LINES' | 'GRID'
    const nozzleDiameter = options.nozzleDiameter || 0.40; // mm
    const bedSize = options.bedSize || DEFAULT_BED_SIZE;

    // Calcular altura total Z
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < triangles.length; i++) {
      const t = triangles[i];
      if (t.v0.z < minZ) minZ = t.v0.z;
      if (t.v1.z < minZ) minZ = t.v1.z;
      if (t.v2.z < minZ) minZ = t.v2.z;
      if (t.v0.z > maxZ) maxZ = t.v0.z;
      if (t.v1.z > maxZ) maxZ = t.v1.z;
      if (t.v2.z > maxZ) maxZ = t.v2.z;
    }

    const totalHeightMm = maxZ - minZ;
    const totalLayers = Math.max(1, Math.ceil(totalHeightMm / layerHeight));
    const layers = [];

    let totalFilamentLengthMm = 0;
    let totalPrintTimeSec = 0;
    const speedPerimeter = 30.0; // mm/s
    const speedInfill = 45.0; // mm/s
    const speedTravel = 80.0; // mm/s

    for (let k = 0; k < totalLayers; k++) {
      const zCut = minZ + (k + 0.5) * layerHeight;
      const rawSegments = intersectTrianglesWithPlane(triangles, zCut);
      const polygons = assemblePolygons(rawSegments);
      const infill = generateInfillLines(polygons, infillDensity, infillPattern, k, nozzleDiameter);

      // Calcular longitudes de trayectorias
      let perimeterLength = 0;
      polygons.forEach(poly => {
        for (let p = 0; p < poly.length - 1; p++) {
          perimeterLength += Math.hypot(poly[p + 1].x - poly[p].x, poly[p + 1].y - poly[p].y);
        }
      });

      let infillLength = 0;
      infill.forEach(s => {
        infillLength += Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
      });

      // Extrusión volumétrica
      const beadArea = layerHeight * nozzleDiameter;
      const layerFilamentVol = (perimeterLength + infillLength) * beadArea;
      const layerFilamentLen = layerFilamentVol / FILAMENT_AREA;
      totalFilamentLengthMm += layerFilamentLen;

      // Estimación temporal
      const layerTimeSec = (perimeterLength / speedPerimeter) + (infillLength / speedInfill) + 0.4;
      totalPrintTimeSec += layerTimeSec;

      layers.push({
        layerIndex: k,
        z: zCut,
        rawSegmentsCount: rawSegments.length,
        polygons,
        infill,
        perimeterLengthMm: perimeterLength,
        infillLengthMm: infillLength,
        filamentUsedMm: layerFilamentLen,
        estimatedTimeSec: layerTimeSec
      });
    }

    const totalFilamentGrams = (totalFilamentLengthMm * FILAMENT_AREA * DENSITY_PLA);

    return {
      totalLayers,
      layerHeightMm: layerHeight,
      totalHeightMm,
      infillDensity,
      infillPattern,
      nozzleDiameter,
      bedSize,
      bbox,
      layers,
      metrics: {
        filamentLengthM: totalFilamentLengthMm / 1000.0,
        filamentMassGrams: totalFilamentGrams,
        printTimeMinutes: Math.ceil(totalPrintTimeSec / 60.0),
        layerCount: totalLayers
      }
    };
  }

  /**
   * Compilador determinista de G-Code estándar (Marlin / RepRap).
   * Genera un archivo .gcode listo para imprimir en silicio físico.
   */
  function compileGCode(sliceResult, options = {}) {
    const bedX = sliceResult.bedSize ? sliceResult.bedSize.x : 220;
    const bedY = sliceResult.bedSize ? sliceResult.bedSize.y : 220;
    const centerX = bedX / 2;
    const centerY = bedY / 2;

    const nozzleTemp = options.nozzleTemp || options.hotendTemp || 205; // °C
    const bedTemp = options.bedTemp || 60; // °C
    const title = options.title || 'Atelier_Matematico_DFAM';

    const lines = [];

    // Cabecera ISO estándar
    lines.push(`; FLAVOR:Marlin`);
    lines.push(`; TIME:${sliceResult.metrics.printTimeMinutes * 60}`);
    lines.push(`; Filament used: ${(sliceResult.metrics.filamentLengthM).toFixed(3)}m (${(sliceResult.metrics.filamentMassGrams).toFixed(1)}g)`);
    lines.push(`; LAYER_HEIGHT:${sliceResult.layerHeightMm.toFixed(2)}`);
    lines.push(`; TOTAL_LAYERS:${sliceResult.totalLayers}`);
    lines.push(`; GENERATOR:Atelier Matematico Timonel F2 DFAM Slicer`);
    lines.push(`; TARGET_PIECE:${title}`);
    lines.push(`G21 ; Unidades métricas (mm)`);
    lines.push(`G90 ; Posicionamiento absoluto`);
    lines.push(`M82 ; Extrusión absoluta`);
    lines.push(`M140 S${bedTemp} ; Iniciar calentamiento de cama`);
    lines.push(`M104 S${nozzleTemp} ; Iniciar calentamiento de boquilla`);
    lines.push(`M190 S${bedTemp} ; Esperar temperatura de cama`);
    lines.push(`M109 S${nozzleTemp} ; Esperar temperatura de boquilla`);
    lines.push(`G28 ; Auto-Home de los 3 ejes`);
    lines.push(`G1 Z15.0 F3000 ; Elevar boquilla`);
    lines.push(`G92 E0 ; Resetear extrusor`);
    lines.push(`G1 F200 E3 ; Purga inicial de boquilla`);
    lines.push(`G92 E0 ; Resetear extrusor`);

    let currentE = 0;
    const beadArea = sliceResult.layerHeightMm * sliceResult.nozzleDiameter;
    const eMultiplier = beadArea / FILAMENT_AREA;

    for (let k = 0; k < sliceResult.layers.length; k++) {
      const layer = sliceResult.layers[k];
      lines.push(`; LAYER:${k}`);
      lines.push(`; Z:${layer.z.toFixed(3)}`);
      lines.push(`G0 F4800 Z${layer.z.toFixed(3)}`);

      // 1. Imprimir Perímetros
      layer.polygons.forEach(poly => {
        if (poly.length < 2) return;
        const startX = (poly[0].x + centerX).toFixed(3);
        const startY = (poly[0].y + centerY).toFixed(3);

        // Desplazamiento rápido sin extrusión
        lines.push(`G0 F4800 X${startX} Y${startY}`);

        for (let p = 1; p < poly.length; p++) {
          const nextX = (poly[p].x + centerX);
          const nextY = (poly[p].y + centerY);
          const prevX = (poly[p - 1].x + centerX);
          const prevY = (poly[p - 1].y + centerY);
          const dist = Math.hypot(nextX - prevX, nextY - prevY);

          currentE += dist * eMultiplier;
          lines.push(`G1 F1800 X${nextX.toFixed(3)} Y${nextY.toFixed(3)} E${currentE.toFixed(4)}`);
        }
      });

      // 2. Imprimir Relleno Celular (Infill)
      layer.infill.forEach(s => {
        const x1 = (s.x1 + centerX).toFixed(3);
        const y1 = (s.y1 + centerY).toFixed(3);
        const x2 = (s.x2 + centerX);
        const y2 = (s.y2 + centerY);
        const dist = Math.hypot(x2 - (s.x1 + centerX), y2 - (s.y1 + centerY));

        lines.push(`G0 F4800 X${x1} Y${y1}`);
        currentE += dist * eMultiplier;
        lines.push(`G1 F2400 X${x2.toFixed(3)} Y${y2.toFixed(3)} E${currentE.toFixed(4)}`);
      });
    }

    // Pie de máquina seguro (Cool-down)
    lines.push(`; Fin del programa de impresión`);
    lines.push(`M104 S0 ; Apagar boquilla`);
    lines.push(`M140 S0 ; Apagar cama`);
    lines.push(`G91 ; Modo relativo`);
    lines.push(`G1 E-2 F2700 ; Retracción de seguridad`);
    lines.push(`G1 Z10 F3000 ; Elevar boquilla 10mm`);
    lines.push(`G90 ; Modo absoluto`);
    lines.push(`G28 X0 Y0 ; Retraer carro a origen`);
    lines.push(`M84 ; Apagar motores paso a paso`);

    const gcodeText = lines.join('\n');
    return {
      text: gcodeText,
      totalLines: lines.length,
      totalE: currentE,
      metrics: sliceResult.metrics
    };
  }

  /**
   * Renderizado vectorial 2D en lienzo HTML5 Canvas de una capa específica.
   */
  function renderLayer2D(canvas, layerData, bedSize, options = {}) {
    if (!canvas || !layerData) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Fondo oscuro de estación de trabajo
    ctx.fillStyle = '#090a10';
    ctx.fillRect(0, 0, width, height);

    const bX = bedSize ? bedSize.x : 220;
    const bY = bedSize ? bedSize.y : 220;

    // Escala y centrado en el lienzo
    const margin = 24;
    const scale = Math.min((width - margin * 2) / bX, (height - margin * 2) / bY);
    const originX = width / 2;
    const originY = height / 2;

    const toScreenX = (x) => originX + x * scale;
    const toScreenY = (y) => originY - y * scale; // Invertir eje Y estándar de pantalla

    // 1. Dibujar cama de impresión y cuadrícula milimétrica
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    const gridStep = 20; // 20 mm
    for (let gx = -bX / 2; gx <= bX / 2; gx += gridStep) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(gx), toScreenY(-bY / 2));
      ctx.lineTo(toScreenX(gx), toScreenY(bY / 2));
      ctx.stroke();
    }
    for (let gy = -bY / 2; gy <= bY / 2; gy += gridStep) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(-bX / 2), toScreenY(gy));
      ctx.lineTo(toScreenX(bX / 2), toScreenY(gy));
      ctx.stroke();
    }

    // Marco exterior de la cama
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(toScreenX(-bX / 2), toScreenY(bY / 2), bX * scale, bY * scale);

    // Ejes de referencia en el centro
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath(); ctx.moveTo(toScreenX(-12), toScreenY(0)); ctx.lineTo(toScreenX(12), toScreenY(0)); ctx.stroke();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath(); ctx.moveTo(toScreenX(0), toScreenY(-12)); ctx.lineTo(toScreenX(0), toScreenY(12)); ctx.stroke();

    // 2. Dibujar Relleno Celular (Infill) en tono magenta/púrpura
    if (layerData.infill && layerData.infill.length > 0) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = Math.max(1, (options.nozzleDiameter || 0.4) * scale * 0.85);
      ctx.beginPath();
      layerData.infill.forEach(s => {
        ctx.moveTo(toScreenX(s.x1), toScreenY(s.y1));
        ctx.lineTo(toScreenX(s.x2), toScreenY(s.y2));
      });
      ctx.stroke();
    }

    // 3. Dibujar Perímetros en color cian luminoso
    if (layerData.polygons && layerData.polygons.length > 0) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = Math.max(1.5, (options.nozzleDiameter || 0.4) * scale);
      layerData.polygons.forEach(poly => {
        if (poly.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(toScreenX(poly[0].x), toScreenY(poly[0].y));
        for (let p = 1; p < poly.length; p++) {
          ctx.lineTo(toScreenX(poly[p].x), toScreenY(poly[p].y));
        }
        ctx.stroke();
      });
    }

    // 4. Indicador de escala gráfica en esquina inferior
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.fillText(`CAMA: ${bX}x${bY} mm  ·  CAPA Z: ${layerData.z.toFixed(2)} mm`, 16, height - 16);
  }

  /**
   * Crea un alambre 3D Three.js (LineSegments) para previsualizar todas las capas apiladas en el espacio R³.
   */
  function createToolpathWireframe(sliceResult, THREE) {
    if (!THREE || !sliceResult || !sliceResult.layers) return null;

    const positions = [];
    const colors = [];

    const total = sliceResult.layers.length;

    sliceResult.layers.forEach((layer, lIdx) => {
      // Gradiente viridis/cósmico según la altura
      const t = lIdx / Math.max(1, total - 1);
      const r = 0.2 + 0.7 * t;
      const g = 0.6 + 0.4 * (1 - t);
      const b = 0.9 - 0.5 * t;

      // Perímetros
      layer.polygons.forEach(poly => {
        for (let p = 0; p < poly.length - 1; p++) {
          positions.push(poly[p].x, layer.z, poly[p].y);
          positions.push(poly[p + 1].x, layer.z, poly[p + 1].y);
          colors.push(r, g, b, r, g, b);
        }
      });

      // Infill (con menor opacidad/brillo)
      layer.infill.forEach(s => {
        positions.push(s.x1, layer.z, s.y1);
        positions.push(s.x2, layer.z, s.y2);
        colors.push(r * 0.7, g * 0.7, b * 0.7, r * 0.7, g * 0.7, b * 0.7);
      });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    return new THREE.LineSegments(geometry, material);
  }

  /**
   * Descarga un buffer o cadena de texto como archivo local en el navegador.
   */
  function downloadTextFile(text, filename) {
    if (typeof document === 'undefined') return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // ── ESTADO DEL VISUALIZADOR DFAM MODAL ────────────────────────────
  let currentSliceResult = null;
  let currentActiveLayer = 0;
  let currentTargetObject = null;
  let currentTargetTitle = 'Atelier_Matematico_3D';
  let isSimulating = false;
  let simulationTimer = null;
  let currentViewMode = '2D';

  let slicer3D = {
    renderer: null,
    scene: null,
    camera: null,
    wireframeGroup: null,
    isInitialized: false,
    animFrameId: null,
    rotX: 0.45,
    rotY: 0.65,
    zoom: 160,
    isDragging: false,
    prevX: 0,
    prevY: 0
  };

  function setSlicerViewMode(mode) {
    currentViewMode = mode;
    const btn2D = document.getElementById('btn-slicer-view-2d');
    const btn3D = document.getElementById('btn-slicer-view-3d');
    const canvas2D = document.getElementById('dfam-slicer-canvas');
    const mount3D = document.getElementById('dfam-slicer-3d-mount');
    const badges2D = document.getElementById('dfam-slicer-2d-badges');
    const hint3D = document.getElementById('slicer-3d-hint');

    if (mode === '3D') {
      if (btn2D) {
        btn2D.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer';
      }
      if (btn3D) {
        btn3D.className = 'px-2.5 py-1 rounded bg-[#c5a059] text-black font-semibold transition cursor-pointer';
      }
      if (canvas2D) canvas2D.classList.add('hidden');
      if (mount3D) mount3D.classList.remove('hidden');
      if (badges2D) badges2D.classList.add('hidden');
      if (hint3D) hint3D.style.display = 'flex';
      initOrUpdate3DView();
    } else {
      if (btn2D) {
        btn2D.className = 'px-2.5 py-1 rounded bg-[#c5a059] text-black font-semibold transition cursor-pointer';
      }
      if (btn3D) {
        btn3D.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer';
      }
      if (canvas2D) canvas2D.classList.remove('hidden');
      if (mount3D) mount3D.classList.add('hidden');
      if (badges2D) badges2D.classList.remove('hidden');
      if (hint3D) hint3D.style.display = 'none';
      if (slicer3D.animFrameId) {
        cancelAnimationFrame(slicer3D.animFrameId);
        slicer3D.animFrameId = null;
      }
    }
  }

  function initOrUpdate3DView() {
    const mount = document.getElementById('dfam-slicer-3d-mount');
    if (!mount || typeof window === 'undefined' || !window.THREE) return;

    const width = mount.clientWidth || 460;
    const height = 380;

    if (!slicer3D.isInitialized) {
      slicer3D.scene = new window.THREE.Scene();
      slicer3D.scene.background = new window.THREE.Color(0x08090e);

      slicer3D.camera = new window.THREE.PerspectiveCamera(45, width / height, 1, 2000);
      slicer3D.renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: false });
      slicer3D.renderer.setSize(width, height);
      slicer3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(slicer3D.renderer.domElement);

      // Cama de impresión 3D
      const grid = new window.THREE.GridHelper(220, 22, 0xc5a059, 0x222638);
      grid.position.y = 0;
      slicer3D.scene.add(grid);

      // Contenedor para el wireframe
      slicer3D.wireframeGroup = new window.THREE.Group();
      slicer3D.scene.add(slicer3D.wireframeGroup);

      // Eventos de ratón y táctiles para rotación
      const dom = slicer3D.renderer.domElement;
      dom.addEventListener('mousedown', (e) => {
        slicer3D.isDragging = true;
        slicer3D.prevX = e.clientX;
        slicer3D.prevY = e.clientY;
      });
      window.addEventListener('mouseup', () => { slicer3D.isDragging = false; });
      window.addEventListener('mousemove', (e) => {
        if (!slicer3D.isDragging) return;
        const dx = e.clientX - slicer3D.prevX;
        const dy = e.clientY - slicer3D.prevY;
        slicer3D.rotY += dx * 0.01;
        slicer3D.rotX = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, slicer3D.rotX + dy * 0.01));
        slicer3D.prevX = e.clientX;
        slicer3D.prevY = e.clientY;
      });
      dom.addEventListener('wheel', (e) => {
        e.preventDefault();
        slicer3D.zoom = Math.max(40, Math.min(600, slicer3D.zoom + e.deltaY * 0.2));
      }, { passive: false });

      slicer3D.isInitialized = true;
    }

    // Actualizar Malla Wireframe 3D
    if (slicer3D.wireframeGroup) {
      while (slicer3D.wireframeGroup.children.length > 0) {
        const obj = slicer3D.wireframeGroup.children[0];
        slicer3D.wireframeGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
      if (currentSliceResult) {
        const wireframe = createToolpathWireframe(currentSliceResult, window.THREE);
        if (wireframe) {
          slicer3D.wireframeGroup.add(wireframe);
        }
      }
    }

    // Loop de renderizado 3D continuo
    if (!slicer3D.animFrameId) {
      function render3DLoop() {
        if (currentViewMode !== '3D') return;
        slicer3D.animFrameId = requestAnimationFrame(render3DLoop);

        const cy = Math.cos(slicer3D.rotX) * slicer3D.zoom;
        const cx = Math.sin(slicer3D.rotY) * Math.sin(slicer3D.rotX) * slicer3D.zoom;
        const cz = Math.cos(slicer3D.rotY) * Math.sin(slicer3D.rotX) * slicer3D.zoom;

        slicer3D.camera.position.set(cx, cy, cz);
        slicer3D.camera.lookAt(0, (currentSliceResult ? currentSliceResult.totalHeightMm * 0.4 : 20), 0);

        slicer3D.renderer.render(slicer3D.scene, slicer3D.camera);
      }
      render3DLoop();
    }
  }

  function ensureModalInDOM() {
    if (typeof document === 'undefined') return;
    let modal = document.getElementById('dfam-slicer-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dfam-slicer-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md hidden';
      modal.innerHTML = `
        <div class="max-w-4xl w-full bg-[#0c0d14] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
          <!-- Cabecera -->
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] mono px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/30 font-semibold">DFAM SLICER MK-I · TIMONEL F2</span>
                <span class="text-[10px] mono text-slate-400">MARLIN / REPRAP ISO G-CODE</span>
              </div>
              <h3 id="slicer-modal-title" class="text-base sm:text-lg font-serif font-bold text-white mt-1">Inspección de Rebanado 3D</h3>
            </div>
            <button onclick="closeSlicerModal()" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition text-sm cursor-pointer">✕</button>
          </div>

          <!-- Contenido Principal -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <!-- Columna Izquierda: Vista 2D / 3D (Lienzo Canvas / WebGL) -->
            <div class="md:col-span-7 flex flex-col gap-3">
              <!-- Selector de Pestañas de Vista -->
              <div class="flex items-center justify-between pb-1">
                <div class="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-[10px] mono">
                  <button id="btn-slicer-view-2d" onclick="setSlicerViewMode('2D')" class="px-2.5 py-1 rounded bg-[#c5a059] text-black font-semibold transition cursor-pointer">Sección 2D</button>
                  <button id="btn-slicer-view-3d" onclick="setSlicerViewMode('3D')" class="px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer">Órbita 3D Toolpath</button>
                </div>
                <div class="flex items-center gap-1 text-[10px] mono text-slate-400" id="slicer-3d-hint" style="display:none;">
                  <span>🖱️ Arrastrar para rotar · Rueda zoom</span>
                </div>
              </div>

              <div id="dfam-slicer-viewport-box" class="relative rounded-xl overflow-hidden border border-white/10 bg-[#08090e] shadow-inner flex items-center justify-center min-h-[380px]">
                <canvas id="dfam-slicer-canvas" width="460" height="400" class="w-full h-auto max-h-[380px] object-contain"></canvas>
                <div id="dfam-slicer-3d-mount" class="w-full h-[380px] hidden"></div>
                <div id="dfam-slicer-2d-badges" class="absolute top-2 left-2 pointer-events-none flex flex-col gap-1">
                  <span id="slicer-layer-badge" class="text-[10px] mono px-2 py-0.5 rounded bg-black/70 text-cyan-300 border border-cyan-500/30">Capa: 0 / 0</span>
                  <span id="slicer-z-badge" class="text-[10px] mono px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">Z: 0.00 mm</span>
                </div>
              </div>

              <!-- Controles de Capa -->
              <div class="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                <div class="flex items-center justify-between text-xs mono">
                  <span class="text-slate-400">Navegador de Capas Z</span>
                  <span id="slicer-layer-counter" class="text-[#dfc285] font-bold">Capa 0</span>
                </div>
                <input id="slicer-layer-slider" type="range" min="0" max="0" value="0" oninput="setSlicerLayer(parseInt(this.value))" class="w-full accent-[#c5a059] cursor-pointer" />
                <div class="flex items-center justify-between gap-2 pt-1">
                  <button id="btn-slicer-sim" onclick="toggleSimulation()" class="flex-1 py-1.5 px-3 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#dfc285] border border-[#c5a059]/40 rounded-lg text-xs mono font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <span id="btn-slicer-sim-icon">▶</span> <span id="btn-slicer-sim-text">Simular Trayectoria</span>
                  </button>
                  <button onclick="setSlicerLayer(0)" class="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs mono transition cursor-pointer">Primera</button>
                  <button onclick="setSlicerLayer(currentSliceResult ? currentSliceResult.totalLayers - 1 : 0)" class="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs mono transition cursor-pointer">Última</button>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Parámetros & Telemetría Física -->
            <div class="md:col-span-5 flex flex-col gap-4">
              <!-- Parámetros de Fabricación -->
              <div class="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-3">
                <div class="text-xs mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-1.5">
                  <span>⚙️ Parámetros de Impresión</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-xs mono">
                  <div>
                    <label class="text-[10px] text-slate-400 block mb-1">Altura Capa</label>
                    <select id="slicer-layer-height" class="w-full bg-[#08090e] border border-white/15 rounded-lg p-1.5 text-slate-200 cursor-pointer">
                      <option value="0.12">0.12 mm</option>
                      <option value="0.20" selected>0.20 mm</option>
                      <option value="0.28">0.28 mm</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[10px] text-slate-400 block mb-1">Relleno</label>
                    <select id="slicer-infill-density" class="w-full bg-[#08090e] border border-white/15 rounded-lg p-1.5 text-slate-200 cursor-pointer">
                      <option value="0.15">15%</option>
                      <option value="0.25" selected>25%</option>
                      <option value="0.40">40%</option>
                      <option value="1.00">100%</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[10px] text-slate-400 block mb-1">Patrón</label>
                    <select id="slicer-infill-pattern" class="w-full bg-[#08090e] border border-white/15 rounded-lg p-1.5 text-slate-200 cursor-pointer">
                      <option value="GYROID" selected>Giroide</option>
                      <option value="LINES">Líneas</option>
                      <option value="GRID">Grilla</option>
                    </select>
                  </div>
                </div>
                <button onclick="recalculateSlice()" class="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs mono font-semibold transition border border-white/15 cursor-pointer">
                  🔄 Recalcular Rebanado
                </button>
              </div>

              <!-- Telemetría Física Timonel F2 -->
              <div class="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div class="text-xs mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-1.5">
                  <span>📊 Telemetría Física DFAM</span>
                </div>
                <div class="grid grid-cols-2 gap-2.5 text-xs mono">
                  <div class="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span class="text-[9px] text-slate-400 block">Capas Totales</span>
                    <strong id="slicer-metric-layers" class="text-white text-sm">--</strong>
                  </div>
                  <div class="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span class="text-[9px] text-slate-400 block">Altura Z</span>
                    <strong id="slicer-metric-height" class="text-cyan-300 text-sm">-- mm</strong>
                  </div>
                  <div class="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span class="text-[9px] text-slate-400 block">Filamento PLA</span>
                    <strong id="slicer-metric-filament" class="text-emerald-400 text-sm">-- m (-- g)</strong>
                  </div>
                  <div class="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span class="text-[9px] text-slate-400 block">Tiempo Estimado</span>
                    <strong id="slicer-metric-time" class="text-[#dfc285] text-sm">-- min</strong>
                  </div>
                </div>
              </div>

              <!-- Botones de Descarga -->
              <div class="space-y-2 pt-1">
                <button onclick="downloadCurrentGCode()" class="w-full py-2.5 px-3 bg-fuchsia-950/60 hover:bg-fuchsia-900/80 border border-fuchsia-500/50 hover:border-fuchsia-400 rounded-xl text-xs mono text-fuchsia-200 transition flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer">
                  <span>💾 Descargar Código G (.gcode)</span>
                </button>
                <button onclick="downloadCurrentSTL()" class="w-full py-2 px-3 bg-[#0d1520] hover:bg-[#132032] border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-xs mono text-cyan-300 transition flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer">
                  <span>📥 Descargar Malla STL (100mm)</span>
                </button>
              </div>

              <div class="text-[9.5px] mono text-slate-400 bg-black/40 p-2.5 rounded-lg border border-white/5 leading-tight">
                🛡️ <strong class="text-slate-300">Timonel DFAM:</strong> Código G validado en silicio para boquillas 0.4mm en cinemática cartesiana/CoreXY estándar (Ender, Prusa, Voron, Bambu, etc.).
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    return modal;
  }

  function openSlicerModal(meshGroupOrObject, options = {}) {
    if (typeof document === 'undefined') return;
    ensureModalInDOM();

    currentTargetObject = meshGroupOrObject;
    currentTargetTitle = (options.title || 'Atelier_Matematico_3D').replace(/[^a-zA-Z0-9_\u00C0-\u017F]/g, '_');

    const titleEl = document.getElementById('slicer-modal-title');
    if (titleEl) titleEl.textContent = options.title || 'Inspección de Rebanado 3D';

    recalculateSlice();

    const modal = document.getElementById('dfam-slicer-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeSlicerModal() {
    if (typeof document === 'undefined') return;
    stopSimulation();
    if (slicer3D.animFrameId) {
      cancelAnimationFrame(slicer3D.animFrameId);
      slicer3D.animFrameId = null;
    }
    setSlicerViewMode('2D');
    const modal = document.getElementById('dfam-slicer-modal');
    if (modal) modal.classList.add('hidden');
  }

  function recalculateSlice() {
    if (!currentTargetObject) return;

    const layerHeightEl = document.getElementById('slicer-layer-height');
    const infillDensityEl = document.getElementById('slicer-infill-density');
    const infillPatternEl = document.getElementById('slicer-infill-pattern');

    const layerHeight = layerHeightEl ? parseFloat(layerHeightEl.value) : 0.20;
    const infillDensity = infillDensityEl ? parseFloat(infillDensityEl.value) : 0.25;
    const infillPattern = infillPatternEl ? infillPatternEl.value : 'GYROID';

    currentSliceResult = sliceGeometry(currentTargetObject, {
      layerHeight,
      infillDensity,
      infillPattern,
      targetDimensionMm: 100.0
    });

    currentActiveLayer = 0;

    // Actualizar Slider
    const slider = document.getElementById('slicer-layer-slider');
    if (slider) {
      slider.min = 0;
      slider.max = Math.max(0, currentSliceResult.totalLayers - 1);
      slider.value = 0;
    }

    // Actualizar Métricas
    const m = currentSliceResult.metrics;
    const layersEl = document.getElementById('slicer-metric-layers');
    const heightEl = document.getElementById('slicer-metric-height');
    const filEl = document.getElementById('slicer-metric-filament');
    const timeEl = document.getElementById('slicer-metric-time');

    if (layersEl) layersEl.textContent = `${currentSliceResult.totalLayers}`;
    if (heightEl) heightEl.textContent = `${currentSliceResult.totalHeightMm.toFixed(1)} mm`;
    if (filEl) filEl.textContent = `${m.filamentLengthM.toFixed(2)} m (${m.filamentMassGrams.toFixed(1)} g)`;
    if (timeEl) timeEl.textContent = `${m.printTimeMinutes} min`;

    setSlicerLayer(0);

    if (currentViewMode === '3D') {
      initOrUpdate3DView();
    }
  }

  function setSlicerLayer(layerIdx) {
    if (!currentSliceResult || !currentSliceResult.layers || currentSliceResult.layers.length === 0) return;
    currentActiveLayer = Math.max(0, Math.min(currentSliceResult.totalLayers - 1, layerIdx));

    const slider = document.getElementById('slicer-layer-slider');
    if (slider && parseInt(slider.value) !== currentActiveLayer) {
      slider.value = currentActiveLayer;
    }

    const layerData = currentSliceResult.layers[currentActiveLayer];

    // Actualizar Badges
    const badgeEl = document.getElementById('slicer-layer-badge');
    const zBadgeEl = document.getElementById('slicer-z-badge');
    const counterEl = document.getElementById('slicer-layer-counter');

    if (badgeEl) badgeEl.textContent = `Capa: ${currentActiveLayer + 1} / ${currentSliceResult.totalLayers}`;
    if (zBadgeEl) zBadgeEl.textContent = `Z: ${layerData.z.toFixed(2)} mm`;
    if (counterEl) counterEl.textContent = `Capa ${currentActiveLayer + 1} de ${currentSliceResult.totalLayers}`;

    // Renderizar en Canvas 2D
    const canvas = document.getElementById('dfam-slicer-canvas');
    if (canvas) {
      renderLayer2D(canvas, layerData, currentSliceResult.bedSize, {
        nozzleDiameter: currentSliceResult.nozzleDiameter
      });
    }
  }

  function toggleSimulation() {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  }

  function startSimulation() {
    if (!currentSliceResult) return;
    isSimulating = true;
    const btnIcon = document.getElementById('btn-slicer-sim-icon');
    const btnText = document.getElementById('btn-slicer-sim-text');
    if (btnIcon) btnIcon.textContent = '⏸';
    if (btnText) btnText.textContent = 'Pausar Simulación';

    simulationTimer = setInterval(() => {
      if (!currentSliceResult) {
        stopSimulation();
        return;
      }
      let nextLayer = currentActiveLayer + 1;
      if (nextLayer >= currentSliceResult.totalLayers) {
        nextLayer = 0;
      }
      setSlicerLayer(nextLayer);
    }, 120);
  }

  function stopSimulation() {
    isSimulating = false;
    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
    const btnIcon = document.getElementById('btn-slicer-sim-icon');
    const btnText = document.getElementById('btn-slicer-sim-text');
    if (btnIcon) btnIcon.textContent = '▶';
    if (btnText) btnText.textContent = 'Simular Trayectoria';
  }

  function downloadCurrentGCode() {
    if (!currentSliceResult) return;
    const gcode = compileGCode(currentSliceResult, { title: currentTargetTitle });
    downloadTextFile(gcode.text, `${currentTargetTitle}_DFAM.gcode`);
  }

  function downloadCurrentSTL() {
    if (!currentTargetObject || !root.Atelier3DExporter) return;
    root.Atelier3DExporter.downloadSTL(currentTargetObject, `${currentTargetTitle}_100mm.stl`, {
      title: currentTargetTitle,
      targetDimensionMm: 100.0
    });
  }

  // Objeto Maestro Exportado
  const AtelierSlicer = {
    sliceGeometry,
    compileGCode,
    renderLayer2D,
    createToolpathWireframe,
    downloadTextFile,
    openSlicerModal,
    closeSlicerModal,
    setSlicerViewMode,
    setSlicerLayer,
    toggleSimulation,
    recalculateSlice,
    downloadCurrentGCode,
    downloadCurrentSTL,
    DENSITY_PLA,
    FILAMENT_DIAMETER
  };

  root.AtelierSlicer = AtelierSlicer;

  // Bindings globales HTML
  root.openSlicerModal = openSlicerModal;
  root.closeSlicerModal = closeSlicerModal;
  root.setSlicerViewMode = setSlicerViewMode;
  root.setSlicerLayer = setSlicerLayer;
  root.toggleSimulation = toggleSimulation;
  root.recalculateSlice = recalculateSlice;
  root.downloadCurrentGCode = downloadCurrentGCode;
  root.downloadCurrentSTL = downloadCurrentSTL;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtelierSlicer;
  }

})(typeof window !== 'undefined' ? window : global);
