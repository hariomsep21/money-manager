# Simple script to run the React Native app
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Money Manager RN - Expo Start  " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start Expo
Write-Host "Starting Expo development server..." -ForegroundColor Green
Write-Host ""
npx expo start
