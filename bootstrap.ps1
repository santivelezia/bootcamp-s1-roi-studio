# ─── Smart4AI · Demo S1 · ROI Studio · zero-to-localhost bootstrap (Windows) ─
# Target: clone → localhost:3000 en < 90 segundos (Test #5 brief)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host "🚀 Smart4AI ROI Studio · bootstrap" -ForegroundColor Cyan
Write-Host "───────────────────────────────────"

if (-not (Test-Path '.env.local')) {
  if (Test-Path '.env.local.example') {
    Write-Host "📝 Creando .env.local desde el template…"
    Copy-Item '.env.local.example' '.env.local'
    Write-Host "   ⚠ Edita .env.local con tus keys reales antes de seguir (Ctrl+C para detener)" -ForegroundColor Yellow
    Start-Sleep -Seconds 3
  } else {
    Write-Host "⚠ No hay .env.local.example. Crea .env.local manualmente." -ForegroundColor Red
    exit 1
  }
}

if (-not (Test-Path 'node_modules')) {
  Write-Host "📦 Instalando dependencias (~30s)…"
  npm install --no-audit --no-fund --silent
} else {
  Write-Host "✓ node_modules ya existe · saltando install"
}

Write-Host "🟢 Levantando dev server en http://localhost:3000" -ForegroundColor Green
Write-Host "   (Ctrl+C para detener · primer compile toma ~5-10s)"

Start-Job -ScriptBlock { Start-Sleep -Seconds 4; Start-Process 'http://localhost:3000' } | Out-Null

npm run dev
