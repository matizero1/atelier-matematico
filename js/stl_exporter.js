/**
 * 🌌 ATELIER MATEMÁTICO — EXPORTADOR 3D SOBERANO STL & OBJ (DFAM)
 * Serializador de Geometrías en Silicio para Fabricación Aditiva e Impresión 3D
 * Gobernanza: Timonel F2 · Estándar ISO/ASTM 52915 · Cero Autoengaño
 */

(function(root) {
  'use strict';

  /**
   * Extrae triángulos planos limpios desde cualquier objeto Three.js (Mesh, BufferGeometry o Group).
   * Aplica transformaciones de matriz local/mundial y escala milimétrica para DFAM.
   */
  function extractTriangles(objectOrGeometry, options = {}) {
    const targetDimensionMm = options.targetDimensionMm || 100.0; // Envergadura estándar para impresión 3D
    const preserveScale = options.preserveScale || false;

    const meshes = [];

    // Caso 1: Se pasó directamente una BufferGeometry
    if (objectOrGeometry.isBufferGeometry || (objectOrGeometry.attributes && objectOrGeometry.attributes.position)) {
      meshes.push({
        geometry: objectOrGeometry,
        matrix: null
      });
    } 
    // Caso 2: Se pasó un Object3D / Group / Mesh
    else if (objectOrGeometry.traverse) {
      objectOrGeometry.updateMatrixWorld(true);
      objectOrGeometry.traverse(child => {
        // Solo exportamos mallas sólidas (descartamos partículas Points, LineSegments y halos decorativos invisibles)
        if (child.isMesh && child.geometry && child.geometry.attributes && child.geometry.attributes.position) {
          // Omitir mallas de asistencia transparentes o con nombres reservados
          if (child.name && (child.name.includes('halo') || child.name.includes('helper') || child.name.includes('grid'))) {
            return;
          }
          meshes.push({
            geometry: child.geometry,
            matrix: child.matrixWorld.clone()
          });
        }
      });
    }

    if (meshes.length === 0) {
      throw new Error('Timonel STL Exporter: No se encontraron mallas 3D válidas para exportar.');
    }

    // Acumulador de todos los triángulos en coordenadas mundiales
    const rawTriangles = [];
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    meshes.forEach(({ geometry, matrix }) => {
      const posAttr = geometry.attributes.position;
      const indexAttr = geometry.index;
      const vertexCount = indexAttr ? indexAttr.count : posAttr.count;

      const getVertex = (idx) => {
        let x = posAttr.getX(idx);
        let y = posAttr.getY(idx);
        let z = posAttr.getZ(idx);

        if (matrix) {
          // Aplicar matriz de transformación en silicio
          const e = matrix.elements;
          const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
          const tx = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
          const ty = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
          const tz = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
          x = tx; y = ty; z = tz;
        }

        // Validación estricta Timonel F2: rechazo de coordenadas corruptas
        if (isNaN(x) || isNaN(y) || isNaN(z) || !isFinite(x) || !isFinite(y) || !isFinite(z)) {
          throw new Error(`Timonel STL Exporter: Coordenada degenerada detectada (${x}, ${y}, ${z})`);
        }

        return { x, y, z };
      };

      for (let i = 0; i < vertexCount; i += 3) {
        const i0 = indexAttr ? indexAttr.getX(i) : i;
        const i1 = indexAttr ? indexAttr.getX(i + 1) : i + 1;
        const i2 = indexAttr ? indexAttr.getX(i + 2) : i + 2;

        const v0 = getVertex(i0);
        const v1 = getVertex(i1);
        const v2 = getVertex(i2);

        // Actualizar caja envolvente (Bounding Box)
        [v0, v1, v2].forEach(v => {
          if (v.x < minX) minX = v.x;
          if (v.x > maxX) maxX = v.x;
          if (v.y < minY) minY = v.y;
          if (v.y > maxY) maxY = v.y;
          if (v.z < minZ) minZ = v.z;
          if (v.z > maxZ) maxZ = v.z;
        });

        // Cálculo determinista del vector normal por producto cruz
        const ax = v1.x - v0.x, ay = v1.y - v0.y, az = v1.z - v0.z;
        const bx = v2.x - v0.x, by = v2.y - v0.y, bz = v2.z - v0.z;
        let nx = ay * bz - az * by;
        let ny = az * bx - ax * bz;
        let nz = ax * by - ay * bx;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

        if (len > 1e-12) {
          nx /= len;
          ny /= len;
          nz /= len;
        } else {
          nx = 0; ny = 0; nz = 1; // Normal de contingencia para triángulos degenerados
        }

        rawTriangles.push({
          normal: { x: nx, y: ny, z: nz },
          v0, v1, v2
        });
      }
    });

    // Dimensiones en coordenadas modelo
    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const spanZ = maxZ - minZ;
    const maxSpan = Math.max(spanX, Math.max(spanY, spanZ));

    // Factor de escala milimétrica para fabricación aditiva (DFAM)
    let scaleFactor = 1.0;
    if (!preserveScale && maxSpan > 1e-6) {
      scaleFactor = targetDimensionMm / maxSpan;
    }

    // Centrar en el origen (0, 0, 0) y apoyar en la base Z = 0 para la cama de impresión
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const baseZ = minZ;

    const scaledTriangles = rawTriangles.map(t => {
      const transformV = (v) => ({
        x: (v.x - centerX) * scaleFactor,
        y: (v.y - centerY) * scaleFactor,
        z: (v.z - baseZ) * scaleFactor
      });

      return {
        normal: t.normal,
        v0: transformV(t.v0),
        v1: transformV(t.v1),
        v2: transformV(t.v2)
      };
    });

    return {
      triangles: scaledTriangles,
      count: scaledTriangles.length,
      bbox: {
        widthMm: spanX * scaleFactor,
        depthMm: spanY * scaleFactor,
        heightMm: spanZ * scaleFactor,
        scaleApplied: scaleFactor
      }
    };
  }

  /**
   * Genera un archivo STL Binario estándar (ISO/ASTM 52915).
   * Retorna un ArrayBuffer de tamaño exacto: 80 + 4 + (N * 50) bytes.
   */
  function exportBinarySTL(objectOrGeometry, options = {}) {
    const { triangles, count, bbox } = extractTriangles(objectOrGeometry, options);

    // Cabecera de 80 bytes + 4 bytes uint32 + 50 bytes por cada triángulo
    const bufferSize = 84 + (count * 50);
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    // 1. Escribir Cabecera de 80 bytes (Little-Endian ASCII)
    const headerTitle = (options.title || 'Atelier Matematico 3D Manifold (DFAM Timonel F2)').substring(0, 79);
    for (let i = 0; i < 80; i++) {
      view.setUint8(i, i < headerTitle.length ? headerTitle.charCodeAt(i) : 0);
    }

    // 2. Escribir número de triángulos en offset 80 (uint32 Little-Endian)
    view.setUint32(80, count, true);

    // 3. Escribir facetas de triángulos
    let offset = 84;
    for (let i = 0; i < count; i++) {
      const t = triangles[i];

      // Vector Normal (3x Float32)
      view.setFloat32(offset, t.normal.x, true);
      view.setFloat32(offset + 4, t.normal.y, true);
      view.setFloat32(offset + 8, t.normal.z, true);

      // Vértice 0 (3x Float32)
      view.setFloat32(offset + 12, t.v0.x, true);
      view.setFloat32(offset + 16, t.v0.y, true);
      view.setFloat32(offset + 20, t.v0.z, true);

      // Vértice 1 (3x Float32)
      view.setFloat32(offset + 24, t.v1.x, true);
      view.setFloat32(offset + 28, t.v1.y, true);
      view.setFloat32(offset + 32, t.v1.z, true);

      // Vértice 2 (3x Float32)
      view.setFloat32(offset + 36, t.v2.x, true);
      view.setFloat32(offset + 40, t.v2.y, true);
      view.setFloat32(offset + 44, t.v2.z, true);

      // Attribute byte count (Uint16 = 0)
      view.setUint16(offset + 48, 0, true);

      offset += 50;
    }

    return {
      buffer,
      triangleCount: count,
      bbox,
      byteLength: bufferSize
    };
  }

  /**
   * Genera un archivo STL ASCII estándar.
   * Retorna una cadena de texto lista para guardar.
   */
  function exportAsciiSTL(objectOrGeometry, options = {}) {
    const { triangles, count, bbox } = extractTriangles(objectOrGeometry, options);
    const solidName = (options.title || 'AtelierMatematico_3D').replace(/\s+/g, '_');

    let output = `solid ${solidName}\n`;
    for (let i = 0; i < count; i++) {
      const t = triangles[i];
      output += `  facet normal ${t.normal.x.toExponential(6)} ${t.normal.y.toExponential(6)} ${t.normal.z.toExponential(6)}\n`;
      output += `    outer loop\n`;
      output += `      vertex ${t.v0.x.toExponential(6)} ${t.v0.y.toExponential(6)} ${t.v0.z.toExponential(6)}\n`;
      output += `      vertex ${t.v1.x.toExponential(6)} ${t.v1.y.toExponential(6)} ${t.v1.z.toExponential(6)}\n`;
      output += `      vertex ${t.v2.x.toExponential(6)} ${t.v2.y.toExponential(6)} ${t.v2.z.toExponential(6)}\n`;
      output += `    endloop\n`;
      output += `  endfacet\n`;
    }
    output += `endsolid ${solidName}\n`;

    return {
      text: output,
      triangleCount: count,
      bbox
    };
  }

  /**
   * Genera un archivo Wavefront OBJ estándar.
   */
  function exportOBJ(objectOrGeometry, options = {}) {
    const { triangles, count, bbox } = extractTriangles(objectOrGeometry, options);
    let output = `# Atelier Matematico 3D Wavefront OBJ Exporter\n`;
    output += `# Timonel F2 DFAM Standard\n`;
    output += `# Triangulos: ${count}\n\n`;

    // Escribir vértices y normales
    for (let i = 0; i < count; i++) {
      const t = triangles[i];
      output += `v ${t.v0.x.toFixed(4)} ${t.v0.y.toFixed(4)} ${t.v0.z.toFixed(4)}\n`;
      output += `v ${t.v1.x.toFixed(4)} ${t.v1.y.toFixed(4)} ${t.v1.z.toFixed(4)}\n`;
      output += `v ${t.v2.x.toFixed(4)} ${t.v2.y.toFixed(4)} ${t.v2.z.toFixed(4)}\n`;
      output += `vn ${t.normal.x.toFixed(4)} ${t.normal.y.toFixed(4)} ${t.normal.z.toFixed(4)}\n`;
    }

    output += `\ns 1\n`;

    // Escribir caras
    for (let i = 0; i < count; i++) {
      const vIdx = i * 3 + 1;
      const nIdx = i + 1;
      output += `f ${vIdx}//${nIdx} ${vIdx + 1}//${nIdx} ${vIdx + 2}//${nIdx}\n`;
    }

    return {
      text: output,
      triangleCount: count,
      bbox
    };
  }

  /**
   * Dispara la descarga del archivo STL Binario en el navegador o en la app de escritorio nativa.
   */
  function downloadSTL(objectOrGeometry, filename = 'Atelier_Obra_3D.stl', options = {}) {
    const exportResult = exportBinarySTL(objectOrGeometry, options);
    const blob = new Blob([exportResult.buffer], { type: 'application/octet-stream' });

    // Si estamos en la app de escritorio nativa (WebKit macOS, Linux o Windows)
    if (typeof window !== 'undefined' && window.AtelierDesktop && typeof window.AtelierDesktop.saveFile === 'function') {
      const reader = new FileReader();
      reader.onload = function() {
        window.AtelierDesktop.saveFile(filename, reader.result, false);
      };
      reader.readAsDataURL(blob);
    } else if (typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.stl') ? filename : `${filename}.stl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    return exportResult;
  }

  // ── EXPORTACIÓN DEL MÓDULO SOBERANO ──────────────────────────────────
  const Atelier3DExporter = {
    extractTriangles,
    exportBinarySTL,
    exportAsciiSTL,
    exportOBJ,
    downloadSTL
  };

  root.Atelier3DExporter = Atelier3DExporter;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Atelier3DExporter;
  }

})(typeof window !== 'undefined' ? window : global);
