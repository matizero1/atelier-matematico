#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 🏛️ ATELIER MATEMÁTICO — MASTER DESKTOP PACKAGING SUITE
# Nai Systems © 2026 · Soberanía Multiplataforma Total en Silicio
# Compila y empaqueta: macOS ARM64, macOS Intel, Linux x64 y Windows x64
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "$SCRIPT_DIR" == *"gallery/scripts"* ]]; then
  GALLERY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
else
  GALLERY_DIR="$SCRIPT_DIR/gallery"
fi

DOWNLOADS_DIR="$GALLERY_DIR/downloads"
mkdir -p "$DOWNLOADS_DIR"

echo "======================================================================="
echo "🌍  INICIANDO CONSTRUCCIÓN MAESTRA MULTIPLATAFORMA ATELIER MATEMÁTICO"
echo "    Sistemas: macOS ARM64 · macOS Intel x64 · Linux x64 · Windows x64"
echo "======================================================================="

# 1. Compilar macOS (ARM64 e Intel)
echo ""
echo "🍎 [FASE 1/3] Generando instaladores macOS (.dmg)..."
"$SCRIPT_DIR/build_desktop_app.sh" all

# 2. Compilar paquete Linux
echo ""
echo "🐧 [FASE 2/3] Generando paquete portable Linux (.tar.gz)..."
"$SCRIPT_DIR/build_linux_package.sh"

# 3. Compilar paquete Windows
echo ""
echo "🪟 [FASE 3/3] Generando paquete portable Windows (.zip)..."
"$SCRIPT_DIR/build_windows_package.sh"

# 4. Generar manifiesto SHA256SUMS.txt
echo ""
echo "🔒 Generando manifiesto criptográfico SHA256SUMS.txt..."
MANIFEST_FILE="$DOWNLOADS_DIR/SHA256SUMS.txt"
rm -f "$MANIFEST_FILE"

cd "$DOWNLOADS_DIR"
for pkg in *.dmg *.tar.gz *.zip; do
  if [ -f "$pkg" ]; then
    shasum -a 256 "$pkg" >> "$MANIFEST_FILE"
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "🏛️  MATRIZ DE ENTREGABLES DE ESCRITORIO SOBERANOS"
echo "═══════════════════════════════════════════════════════════════════════"
printf "%-40s | %-10s | %s\n" "PAQUETE" "TAMAÑO" "SHA-256"
echo "───────────────────────────────────────────────────────────────────────"
while read -r hash filename; do
  size=$(ls -lh "$DOWNLOADS_DIR/$filename" | awk '{print $5}')
  printf "%-40s | %-10s | %s\n" "$filename" "$size" "$hash"
done < "$MANIFEST_FILE"
echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ Todos los paquetes están listos para distribución offline en silicio."
