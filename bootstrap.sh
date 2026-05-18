#!/usr/bin/env bash
# ─── Smart4AI · Demo S1 · ROI Studio · zero-to-localhost bootstrap (Linux/Mac) ─
# Target: clone → localhost:3000 en < 90 segundos (Test #5 brief)

set -euo pipefail

cd "$(dirname "$0")"

echo "🚀 Smart4AI ROI Studio · bootstrap"
echo "───────────────────────────────────"

if [ ! -f .env.local ]; then
  if [ -f .env.local.example ]; then
    echo "📝 Creando .env.local desde el template…"
    cp .env.local.example .env.local
    echo "   ⚠ Edita .env.local con tus keys reales antes de seguir (Ctrl+C para detener)"
    sleep 3
  else
    echo "⚠ No hay .env.local.example. Crea .env.local manualmente."
    exit 1
  fi
fi

if [ ! -d node_modules ]; then
  echo "📦 Instalando dependencias (~30s)…"
  npm install --no-audit --no-fund --silent
else
  echo "✓ node_modules ya existe · saltando install"
fi

echo "🟢 Levantando dev server en http://localhost:3000"
echo "   (Ctrl+C para detener · primer compile toma ~5-10s)"

if command -v open >/dev/null 2>&1; then
  (sleep 4 && open "http://localhost:3000") &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 4 && xdg-open "http://localhost:3000") &
fi

npm run dev
