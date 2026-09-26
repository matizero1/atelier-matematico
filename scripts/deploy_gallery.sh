#!/bin/bash
# ==============================================================================
# 🚀 ATELIER MATEMÁTICO — SCRIPT DETERMINISTA DE DESPLIEGUE A PRODUCCIÓN
# Gobernanza: Timonel F2 · Cero Autoengaño · CI/CD Seguro en Silicio
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GALLERY_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_REPO="/tmp/atelier-matematico-repo"
REMOTE_URL="https://github.com/matizero1/atelier-matematico.git"

echo "═══════════════════════════════════════════════════════════════════════"
echo "🚀 ATELIER MATEMÁTICO — PIPELINE DE DESPLIEGUE CONTINUO (TIMONEL F2)"
echo "   Origen:  $GALLERY_ROOT"
echo "   Destino: $TARGET_REPO (origin/main)"
echo "═══════════════════════════════════════════════════════════════════════"

# 1. EJECUTAR AUDITORÍA DETERMINISTA PRE-DEPLOY
echo -e "\n🔍 PASO 1: Ejecutando auditoría de integridad estricta..."
if ! node "$GALLERY_ROOT/tests/system_integrity_audit.mjs"; then
  echo -e "\n❌ [ERROR CRÍTICO] La auditoría de integridad ha fallado."
  echo "   Gobernanza NASA JPL / Timonel F2: Prohibido desplegar código con defectos."
  exit 1
fi
echo "✓ Auditoría completada con 100% de pruebas aprobadas."

# 2. ASEGURAR EXISTENCIA Y SINCRONÍA DEL REPOSITORIO DESTINO
echo -e "\n📦 PASO 2: Verificando repositorio de destino..."
if [ ! -d "$TARGET_REPO/.git" ]; then
  echo "Clonando repositorio remoto $REMOTE_URL en $TARGET_REPO..."
  git clone "$REMOTE_URL" "$TARGET_REPO"
fi

cd "$TARGET_REPO"
git fetch origin
git checkout main
git pull origin main

# 3. SINCRONIZACIÓN DETERMINISTA EXCLUYENDO METADATOS GIT
echo -e "\n🔄 PASO 3: Sincronizando archivos desde $GALLERY_ROOT..."
rsync -av --delete \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='node_modules' \
  --exclude='*.swp' \
  "$GALLERY_ROOT/" "$TARGET_REPO/"

# 4. COMPROBACIÓN DE CAMBIOS Y DESPLIEGUE A GITHUB
echo -e "\n📊 PASO 4: Evaluando árbol de trabajo en git..."
STATUS_OUTPUT=$(git status --porcelain)

if [ -z "$STATUS_OUTPUT" ]; then
  echo "✨ No hay cambios que desplegar. El repositorio remoto ya está al día."
  exit 0
fi

echo "Cambios detectados para despliegue:"
git status -s

COMMIT_MSG="${1:-feat(architecture): modularize 3D models into museum_models.js, unify SSOT catalog schema, and expand Timonel audit to 95 passing tests}"

echo -e "\n🚀 PASO 5: Desplegando a producción..."
git add -A
git commit -m "$COMMIT_MSG"
git push origin main

echo -e "\n═══════════════════════════════════════════════════════════════════════"
echo "✅ DESPLIEGUE COMPLETADO CON ÉXITO EN GITHUB PAGES:"
echo "   URL: https://matizero1.github.io/atelier-matematico/"
echo "═══════════════════════════════════════════════════════════════════════"
