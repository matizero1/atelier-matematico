#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 🏛️ ATELIER MATEMÁTICO — BUILD & PACKAGING PIPELINE (MACOS DMG)
# Nai Systems © 2026 · Cero Electron · Silicio Nativo Puro
# Admite arquitecturas: arm64 (Silicon), x86_64 (Intel), o 'all' (ambos)
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
APP_NAME="Atelier Matematico"
GALLERY_DOWNLOADS="$GALLERY_DIR/downloads"
mkdir -p "$BUILD_DIR" "$GALLERY_DOWNLOADS"

MODE="${1:-all}"

build_arch() {
  local ARCH="$1"
  local DMG_NAME="$2"
  local TARGET_FLAG=""
  local ARCH_TITLE=""

  if [ "$ARCH" = "arm64" ]; then
    TARGET_FLAG="-target arm64-apple-macos12.0"
    ARCH_TITLE="APPLE SILICON (ARM64)"
  else
    TARGET_FLAG="-target x86_64-apple-macos11.0"
    ARCH_TITLE="MACOS INTEL (X86_64)"
  fi

  local STAGE_ROOT="/tmp/atelier_build_${ARCH}_$$"
  local APP_BUNDLE="$STAGE_ROOT/$APP_NAME.app"
  local FINAL_DMG="$STAGE_ROOT/$DMG_NAME"

  echo "═══════════════════════════════════════════════════════════════════════"
  echo "🏛️  CONSTRUYENDO ESTACIÓN DE TRABAJO NATIVA DE ESCRITORIO: $ARCH_TITLE"
  echo "    Arquitectura: Swift / AppKit + WebKit Nativo · Cero Bloatware"
  echo "═══════════════════════════════════════════════════════════════════════"

  # 1. Preparar bundle limpio
  rm -rf "$STAGE_ROOT"
  mkdir -p "$APP_BUNDLE/Contents/MacOS"
  mkdir -p "$APP_BUNDLE/Contents/Resources"

  # 2. Compilar binario nativo
  echo "⚙️ [1/5] Compilando ejecutable nativo ($TARGET_FLAG)..."
  swiftc -O $TARGET_FLAG \
    "$GALLERY_DIR/desktop/main.swift" \
    -o "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

  chmod +x "$APP_BUNDLE/Contents/MacOS/$APP_NAME"
  local BIN_SIZE
  BIN_SIZE=$(ls -lh "$APP_BUNDLE/Contents/MacOS/$APP_NAME" | awk '{print $5}')
  echo "  ✓ Binario nativo generado: $BIN_SIZE ($ARCH)"

  # 3. Metadatos y recursos
  echo "🎨 [2/5] Integrando metadatos Info.plist, puente y salas offline..."
  cp "$GALLERY_DIR/desktop/Info.plist" "$APP_BUNDLE/Contents/Info.plist"
  cp "$GALLERY_DIR/desktop/bridge.js" "$APP_BUNDLE/Contents/Resources/bridge.js"
  cp -R "$GALLERY_DIR/"*.html "$APP_BUNDLE/Contents/Resources/"
  cp -R "$GALLERY_DIR/js" "$APP_BUNDLE/Contents/Resources/"
  if [ -d "$GALLERY_DIR/assets" ]; then cp -R "$GALLERY_DIR/assets" "$APP_BUNDLE/Contents/Resources/"; fi
  if [ -d "$GALLERY_DIR/css" ]; then cp -R "$GALLERY_DIR/css" "$APP_BUNDLE/Contents/Resources/"; fi
  rm -rf "$APP_BUNDLE/Contents/Resources/downloads"

  # 4. Firma de código ad-hoc
  echo "🛡️ [3/5] Aplicando firma criptográfica ad-hoc de macOS..."
  find "$APP_BUNDLE" -name ".DS_Store" -delete 2>/dev/null || true
  dot_clean -m "$APP_BUNDLE" 2>/dev/null || true
  xattr -c -r "$APP_BUNDLE" 2>/dev/null || true
  codesign -s - --force --deep "$APP_BUNDLE"
  codesign -v "$APP_BUNDLE"

  # 5. Empaquetar DMG
  echo "💿 [4/5] Creando imagen de disco DMG instalable con hdiutil..."
  local STAGING_DIR="$STAGE_ROOT/dmg_staging"
  mkdir -p "$STAGING_DIR"
  cp -R "$APP_BUNDLE" "$STAGING_DIR/"
  ln -s /Applications "$STAGING_DIR/Applications"

  /usr/bin/hdiutil create \
    -volname "Atelier Matematico" \
    -srcfolder "$STAGING_DIR" \
    -ov \
    -format UDZO \
    "$FINAL_DMG"

  # Copiar artefactos
  echo "📦 [5/5] Registrando instalador en build y downloads..."
  cp "$FINAL_DMG" "$BUILD_DIR/$DMG_NAME"
  cp "$FINAL_DMG" "$GALLERY_DOWNLOADS/$DMG_NAME"
  rm -rf "$STAGE_ROOT"

  local DMG_SIZE
  local SHA256_HASH
  DMG_SIZE=$(ls -lh "$GALLERY_DOWNLOADS/$DMG_NAME" | awk '{print $5}')
  SHA256_HASH=$(shasum -a 256 "$GALLERY_DOWNLOADS/$DMG_NAME" | awk '{print $1}')

  echo "✅ GENERADO: $DMG_NAME ($DMG_SIZE)"
  echo "   SHA-256: $SHA256_HASH"
}

if [ "$MODE" = "arm64" ]; then
  build_arch "arm64" "Atelier_Matematico_Silicon_arm64.dmg"
elif [ "$MODE" = "x86_64" ] || [ "$MODE" = "intel" ]; then
  build_arch "x86_64" "Atelier_Matematico_Intel_x64.dmg"
elif [ "$MODE" = "all" ]; then
  build_arch "arm64" "Atelier_Matematico_Silicon_arm64.dmg"
  build_arch "x86_64" "Atelier_Matematico_Intel_x64.dmg"
else
  echo "Modo desconocido: $MODE. Usa 'arm64', 'intel' o 'all'."
  exit 1
fi

echo "═══════════════════════════════════════════════════════════════════════"
echo "🏛️  PROCESO MACOS FINALIZADO SATISFACTORIAMENTE"
echo "═══════════════════════════════════════════════════════════════════════"
