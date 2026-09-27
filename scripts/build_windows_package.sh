#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 🏛️ ATELIER MATEMÁTICO — WINDOWS PORTABLE PACKAGING PIPELINE
# Nai Systems © 2026 · Cero Electron · Direct3D 12 Edge App Mode
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
STAGE_ROOT="/tmp/atelier_win_pack_$$"
PKG_DIR="$STAGE_ROOT/Atelier_Matematico_Windows"
ARCHIVE_NAME="Atelier_Matematico_Windows_Portable.zip"
FINAL_ZIP="$GALLERY_DOWNLOADS/$ARCHIVE_NAME"

echo "═══════════════════════════════════════════════════════════════════════"
echo "🪟  CONSTRUYENDO PAQUETE PORTABLE WINDOWS (X64 / DIRECT3D 12)"
echo "    Arquitectura: Edge App Mode + Win32 Runner · Cero Dependencias"
echo "═══════════════════════════════════════════════════════════════════════"

rm -rf "$STAGE_ROOT"
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

# 2. Generar lanzador batch nativo (Atelier_Matematico.bat)
echo "⚙️ [2/5] Creando lanzador nativo de Windows (Atelier_Matematico.bat)..."
cat << 'EOF' > "$PKG_DIR/Atelier_Matematico.bat"
@echo off
title Atelier Matematico - Estacion de Trabajo Soberana
setlocal

set "APP_DIR=%~dp0"
set "INDEX_PATH=%APP_DIR%index.html"

:: 1. Buscar Microsoft Edge (presente en 100% de Windows 10/11) y lanzar en modo App dedicada
where msedge.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "" msedge.exe --app="file://%INDEX_PATH%" --window-size=1400,900 --disable-features=Translate
    exit /b 0
)

:: 2. Buscar Google Chrome si Edge no está en PATH
where chrome.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "" chrome.exe --app="file://%INDEX_PATH%" --window-size=1400,900
    exit /b 0
)

:: 3. Buscar Brave Browser
where brave.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "" brave.exe --app="file://%INDEX_PATH%" --window-size=1400,900
    exit /b 0
)

:: 4. Fallback al navegador predeterminado
start "" "%INDEX_PATH%"
exit /b 0
EOF

# 3. Generar lanzador silencioso en VBScript para evitar ventana CMD
echo "📄 [3/5] Creando lanzador silencioso (Launch_Silent.vbs) y código C Win32..."
cat << 'EOF' > "$PKG_DIR/Launch_Silent.vbs"
Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run """" & strPath & "\Atelier_Matematico.bat""", 0, False
Set WshShell = Nothing
EOF

# Copiar código fuente nativo C para compilación con MinGW o MSVC
cp "$GALLERY_DIR/desktop/main_windows.c" "$PKG_DIR/src/"
cat << 'EOF' > "$PKG_DIR/src/build_mingw.bat"
@echo off
gcc -O3 -mwindows main_windows.c -o ..\Atelier_Matematico.exe
echo Compilacion finalizada en ..\Atelier_Matematico.exe
EOF

cat << 'EOF' > "$PKG_DIR/src/build_msvc.bat"
@echo off
cl /O2 /W3 main_windows.c /link /SUBSYSTEM:WINDOWS /OUT:..\Atelier_Matematico.exe
echo Compilacion finalizada en ..\Atelier_Matematico.exe
EOF

# Crear documento README_WINDOWS.txt
cat << 'EOF' > "$PKG_DIR/README_WINDOWS.txt"
═══════════════════════════════════════════════════════════════════════
🏛️  ATELIER MATEMÁTICO — DISTRIBUCIÓN PORTABLE PARA WINDOWS (X64)
    Nai Systems © 2026 · Cero Electron · Direct3D 12 Nativo
═══════════════════════════════════════════════════════════════════════

INSTRUCCIONES DE USO:
1. Extrae este archivo ZIP en cualquier carpeta (ej. C:\AtelierMatematico).
2. Haz doble clic en "Atelier_Matematico.bat" o "Launch_Silent.vbs".
3. La aplicación se abrirá como una ventana de escritorio independiente,
   con aceleración por hardware Direct3D 12 y 100% desconectada de Internet.

COMPILACIÓN NATIVA .EXE (OPCIONAL):
Si dispones de MinGW o Visual Studio C++, puedes generar el ejecutable .exe:
1. Entra a la carpeta src\
2. Ejecuta build_mingw.bat o build_msvc.bat
3. Se generará Atelier_Matematico.exe en la raíz de la carpeta.

═══════════════════════════════════════════════════════════════════════
EOF

# 4. Empaquetar archivo zip
echo "📦 [4/5] Comprimiendo paquete portable (.zip)..."
(cd "$STAGE_ROOT" && zip -r -q "$FINAL_ZIP" Atelier_Matematico_Windows)
cp "$FINAL_ZIP" "$BUILD_DIR/"
rm -rf "$STAGE_ROOT"

# 5. Métricas de verificación
echo "🛡️ [5/5] Auditando hash criptográfico..."
ZIP_SIZE=$(ls -lh "$FINAL_ZIP" | awk '{print $5}')
SHA256_HASH=$(shasum -a 256 "$FINAL_ZIP" | awk '{print $1}')

echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ PAQUETE WINDOWS COMPLETADO CON ÉXITO"
echo "  • Archivo: $FINAL_ZIP ($ZIP_SIZE)"
echo "  • Huella SHA-256: $SHA256_HASH"
echo "═══════════════════════════════════════════════════════════════════════"
