#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 🏛️ ATELIER MATEMÁTICO — LINUX PORTABLE PACKAGING PIPELINE
# Nai Systems © 2026 · Cero Electron · Estación de Trabajo Linux Soberana
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "$SCRIPT_DIR" == *"gallery/scripts"* ]]; then
  GALLERY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
  REPO_DIR="$(cd "$GALLERY_DIR/.." && pwd)"
else
  REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
  GALLERY_DIR="$REPO_DIR/gallery"
fi

BUILD_DIR="$REPO_DIR/build/desktop"
GALLERY_DOWNLOADS="$GALLERY_DIR/downloads"
STAGE_ROOT="/tmp/atelier_linux_pack_$$"
PKG_DIR="$STAGE_ROOT/Atelier_Matematico_Linux"
ARCHIVE_NAME="Atelier_Matematico_Linux_Portable.tar.gz"
FINAL_TAR="$GALLERY_DOWNLOADS/$ARCHIVE_NAME"

echo "═══════════════════════════════════════════════════════════════════════"
echo "🐧  CONSTRUYENDO PAQUETE PORTABLE LINUX (X86_64 / GLIBC)"
echo "    Arquitectura: Launcher POSIX + WebKitGTK / Chromium Standalone"
echo "═══════════════════════════════════════════════════════════════════════"

rm -rf "$STAGE_ROOT"
mkdir -p "$PKG_DIR/bin"
mkdir -p "$PKG_DIR/src"
mkdir -p "$PKG_DIR/assets"
mkdir -p "$BUILD_DIR"
mkdir -p "$GALLERY_DOWNLOADS"

# 1. Copiar recursos web completos para ejecución 100% offline
echo "🎨 [1/5] Integrando salas, motores CAS y recursos de museo..."
cp -R "$GALLERY_DIR/"*.html "$PKG_DIR/"
cp -R "$GALLERY_DIR/js" "$PKG_DIR/"
if [ -d "$GALLERY_DIR/assets" ]; then cp -R "$GALLERY_DIR/assets"/* "$PKG_DIR/assets/" 2>/dev/null || true; fi
if [ -d "$GALLERY_DIR/css" ]; then cp -R "$GALLERY_DIR/css" "$PKG_DIR/"; fi
rm -rf "$PKG_DIR/downloads"

# 2. Generar script lanzador POSIX atelier-matematico.sh
echo "⚙️ [2/5] Creando lanzador POSIX inteligente (atelier-matematico.sh)..."
cat << 'EOF' > "$PKG_DIR/atelier-matematico.sh"
#!/usr/bin/env bash
# Lanzador Autónomo de Atelier Matemático en Linux
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_FILE="$DIR/index.html"

# 1. Si existe binario nativo GTK3/WebKit2GTK compilado, ejecutarlo directamente
if [ -x "$DIR/bin/atelier-matematico-bin" ]; then
    exec "$DIR/bin/atelier-matematico-bin" "$@"
fi

# 2. Buscar motores de renderizado con aceleración WebGL por hardware
CHROME_FLAGS="--app=file://$INDEX_FILE --window-size=1400,900 --enable-features=VaapiVideoDecoder,CanvasOopRasterization --ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy"

for browser in google-chrome google-chrome-stable chromium chromium-browser brave-browser microsoft-edge-stable vivaldi; do
    if command -v "$browser" >/dev/null 2>&1; then
        exec "$browser" $CHROME_FLAGS "$@"
    fi
done

# 3. Fallback a Firefox en modo ventana
if command -v firefox >/dev/null 2>&1; then
    exec firefox --new-window "file://$INDEX_FILE" "$@"
fi

# 4. Fallback al visualizador predeterminado del sistema (xdg-open)
if command -v xdg-open >/dev/null 2>&1; then
    exec xdg-open "$INDEX_FILE"
fi

echo "Error: No se encontró ningún visualizador WebGL compatible (Chrome, Chromium, Firefox, xdg-open)."
exit 1
EOF

chmod +x "$PKG_DIR/atelier-matematico.sh"

# 3. Generar entrada XDG de escritorio (.desktop)
echo "📄 [3/5] Generando entrada XDG (.desktop) y código fuente C99..."
cat << 'EOF' > "$PKG_DIR/atelier-matematico.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=Atelier Matemático
Comment=Estación de Trabajo Soberana de Física & Matemáticas
Exec=/bin/bash -c "cd $(dirname %k) && ./atelier-matematico.sh"
Icon=applications-science
Terminal=false
Categories=Education;Science;Math;Physics;
StartupNotify=true
EOF

chmod +x "$PKG_DIR/atelier-matematico.desktop"

# Copiar código fuente nativo C y Makefile para usuarios que quieran binario nativo puro GTK
cp "$GALLERY_DIR/desktop/main_linux.c" "$PKG_DIR/src/"
cat << 'EOF' > "$PKG_DIR/src/Makefile"
CC ?= gcc
CFLAGS ?= -O3 -Wall
GTK_FLAGS = $(shell pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.1 2>/dev/null || pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.0)

all:
	$(CC) $(CFLAGS) main_linux.c $(GTK_FLAGS) -o ../bin/atelier-matematico-bin

clean:
	rm -f ../bin/atelier-matematico-bin
EOF

# Crear documento README_LINUX.txt
cat << 'EOF' > "$PKG_DIR/README_LINUX.txt"
═══════════════════════════════════════════════════════════════════════
🏛️  ATELIER MATEMÁTICO — DISTRIBUCIÓN PORTABLE PARA LINUX
    Nai Systems © 2026 · Cero Electron · Silicio Nativo
═══════════════════════════════════════════════════════════════════════

INSTRUCCIONES DE USO:
1. Descomprime este archivo en cualquier directorio de tu usuario.
2. Ejecuta directamente el script lanzador:
     ./atelier-matematico.sh
3. El lanzador detectará automáticamente tu acelerador gráfico WebGL
   (Chromium/Chrome/Brave/Edge en modo ventana nativa o Firefox).

COMPILACIÓN DE EJECUTABLE NATIVO GTK3/WEBKIT (OPCIONAL):
Si deseas un binario ELF nativo compilado en tu propio kernel:
1. Instala las dependencias en tu distribución:
     Debian/Ubuntu: sudo apt install build-essential libgtk-3-dev libwebkit2gtk-4.1-dev
     Fedora:        sudo dnf install gcc gtk3-devel webkit2gtk4.1-devel
     Arch Linux:    sudo pacman -S base-devel gtk3 webkit2gtk-4.1
2. Entra al directorio src/ y compila:
     cd src && make
3. El binario quedará en bin/atelier-matematico-bin y el lanzador lo usará
   como primera opción preferente.

═══════════════════════════════════════════════════════════════════════
EOF

# 4. Empaquetar archivo tar.gz
echo "📦 [4/5] Comprimiendo paquete portable (.tar.gz)..."
tar -czf "$FINAL_TAR" -C "$STAGE_ROOT" Atelier_Matematico_Linux
cp "$FINAL_TAR" "$BUILD_DIR/"
rm -rf "$STAGE_ROOT"

# 5. Métricas de verificación
echo "🛡️ [5/5] Auditando hash criptográfico..."
TAR_SIZE=$(ls -lh "$FINAL_TAR" | awk '{print $5}')
SHA256_HASH=$(shasum -a 256 "$FINAL_TAR" | awk '{print $1}')

echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ PAQUETE LINUX COMPLETADO CON ÉXITO"
echo "  • Archivo: $FINAL_TAR ($TAR_SIZE)"
echo "  • Huella SHA-256: $SHA256_HASH"
echo "═══════════════════════════════════════════════════════════════════════"
