#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 🏛️ ATELIER MATEMÁTICO — BUILD & PACKAGING PIPELINE (APPLE SILICON DMG)
# Nai Systems © 2026 · Cero Electron · Silicio Nativo Puro
# ─────────────────────────────────────────────────────────────────────────────

set -e

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$WORKSPACE_DIR/build/desktop"
APP_NAME="Atelier Matematico"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"
DMG_NAME="Atelier_Matematico_Silicon_arm64.dmg"
FINAL_DMG="$BUILD_DIR/$DMG_NAME"
GALLERY_DOWNLOADS="$WORKSPACE_DIR/gallery/downloads"

echo "═══════════════════════════════════════════════════════════════════════"
echo "🏛️  CONSTRUYENDO ESTACIÓN DE TRABAJO NATIVA DE ESCRITORIO (MACOS ARM64)"
echo "    Arquitectura: Swift / AppKit + WebKit Nativo · Cero Bloatware"
echo "═══════════════════════════════════════════════════════════════════════"

# 1. Preparar directorios limpios
echo "📦 [1/6] Estructurando Bundle de Aplicación macOS..."
rm -rf "$BUILD_DIR"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources"
mkdir -p "$GALLERY_DOWNLOADS"

# 2. Compilar binario nativo ARM64 con swiftc
echo "⚙️ [2/6] Compilando ejecutable nativo en silicio (swiftc -O)..."
swiftc -O -target arm64-apple-macos12.0 \
  "$WORKSPACE_DIR/desktop/main.swift" \
  -o "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

chmod +x "$APP_BUNDLE/Contents/MacOS/$APP_NAME"
BIN_SIZE=$(ls -lh "$APP_BUNDLE/Contents/MacOS/$APP_NAME" | awk '{print $5}')
echo "  ✓ Binario nativo generado: $BIN_SIZE (Ultra-compacto en silicio puro)"

# 3. Copiar metadatos Info.plist y puente de silicio
echo "📄 [3/6] Inyectando metadatos Info.plist y puente TimonelDesktop..."
cp "$WORKSPACE_DIR/desktop/Info.plist" "$APP_BUNDLE/Contents/Info.plist"
cp "$WORKSPACE_DIR/desktop/bridge.js" "$APP_BUNDLE/Contents/Resources/bridge.js"

# 4. Copiar recursos web completos para ejecución 100% offline
echo "🎨 [4/6] Integrando salas, motores CAS y recursos de museo..."
cp -R "$WORKSPACE_DIR/gallery/"* "$APP_BUNDLE/Contents/Resources/"
# Eliminar posibles descargas anidadas o temporales
rm -rf "$APP_BUNDLE/Contents/Resources/downloads"

# 5. Firma de código ad-hoc
echo "🛡️ [5/6] Aplicando firma criptográfica ad-hoc de macOS..."
find "$APP_BUNDLE" -name ".DS_Store" -delete 2>/dev/null || true
xattr -cr "$APP_BUNDLE" 2>/dev/null || true
xattr -d com.apple.FinderInfo "$APP_BUNDLE" 2>/dev/null || true
codesign -s - --force --deep "$APP_BUNDLE"
codesign -v "$APP_BUNDLE" && echo "  ✓ Firma ad-hoc verificada por Gatekeeper local."

# 6. Empaquetar imagen de disco (.dmg) instalable
echo "💿 [6/6] Creando imagen de disco DMG instalable con hdiutil..."
STAGING_DIR="$BUILD_DIR/dmg_staging"
mkdir -p "$STAGING_DIR"
cp -R "$APP_BUNDLE" "$STAGING_DIR/"
ln -s /Applications "$STAGING_DIR/Applications"

/usr/bin/hdiutil create \
  -volname "Atelier Matematico" \
  -srcfolder "$STAGING_DIR" \
  -ov \
  -format UDZO \
  "$FINAL_DMG"

# Copiar DMG al directorio de descargas públicas para la web
cp "$FINAL_DMG" "$GALLERY_DOWNLOADS/$DMG_NAME"
rm -rf "$STAGING_DIR"

DMG_SIZE=$(ls -lh "$FINAL_DMG" | awk '{print $5}')
SHA256_HASH=$(shasum -a 256 "$FINAL_DMG" | awk '{print $1}')

echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ CONSTRUCCIÓN COMPLETADA CON ÉXITO"
echo "  • Bundle .app: $APP_BUNDLE"
echo "  • Instalador DMG: $FINAL_DMG ($DMG_SIZE)"
echo "  • Huella SHA-256: $SHA256_HASH"
echo "  • Copiado a Web: $GALLERY_DOWNLOADS/$DMG_NAME"
echo "═══════════════════════════════════════════════════════════════════════"
