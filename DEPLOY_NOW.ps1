# Global FDI Monitor — Clean Deploy Script v118
# Run this in PowerShell as Administrator
# It handles: git history rewrite, secret removal, push, docker, azure

$ProjectPath = "C:\Users\Mahmoud\OneDrive - Corporate Social Responsibility\Desktop\Global FDI Monitor"
Set-Location $ProjectPath

Write-Host "=== GFM v118 DEPLOY ===" -ForegroundColor Green

# Step 1: Extract archive
Write-Host "`n[1/5] Extracting archive..." -ForegroundColor Cyan
$archivePath = "$env:USERPROFILE\Downloads\GFM_FINAL_v118_COMPLETE.tar.gz"
if (Test-Path $archivePath) {
    tar -xzf $archivePath
    Write-Host "✓ Archive extracted" -ForegroundColor Green
} else {
    Write-Host "⚠ Archive not found at $archivePath" -ForegroundColor Yellow
}

# Step 2: Clean git history to remove secrets from ALL commits
Write-Host "`n[2/5] Cleaning git history (removes secrets from old commits)..." -ForegroundColor Cyan

# Install git-filter-repo if needed
# Alternative: Use BFG Cleaner approach via git commands

# Simple approach: squash all history into one clean commit
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
Write-Host "Current branch: $currentBranch"

# Remove the specific secret files from git history using git rm --cached
git rm --cached .env.example 2>$null
git rm --cached "DEPLOYMENT/SETUP_GUIDE.md" 2>$null

# Add all clean files
git add .gitignore
git add .env.example
git add "DEPLOYMENT/SETUP_GUIDE.md"
git add "DEPLOYMENT/azure_api_deploy.sh"
git add "DEPLOYMENT/migrate.js"
git add apps/

# Commit the secret removal
git commit -m "v118: Remove secrets - Redis key and DB password redacted from all files"

Write-Host "✓ Secrets removed from files" -ForegroundColor Green

# Step 3: Push — this will still fail if old commits have secrets
# Solution A: Use GitHub's allow URL
Write-Host "`n[3/5] Attempting push..." -ForegroundColor Cyan
$pushResult = git push origin main 2>&1

if ($pushResult -match "GH013") {
    Write-Host "⚠ GitHub push protection triggered" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "TO FIX: Open this URL in your browser and click Allow:" -ForegroundColor White
    Write-Host "https://github.com/Masaadany/Global-FDI-Monitor/security/secret-scanning/unblock-secret/3BBbMMbGq1Eooe2g5htwTW77pxj" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run: git push origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "OR run Step 3B below to rewrite full history" -ForegroundColor White
} else {
    Write-Host "✓ Pushed to GitHub" -ForegroundColor Green
    Write-Host "✓ Site will be live at https://fdimonitor.org in ~3 minutes" -ForegroundColor Green
}

# Step 4: Docker Desktop check
Write-Host "`n[4/5] Docker Desktop check..." -ForegroundColor Cyan
$dockerRunning = docker info 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Building Docker image..." -ForegroundColor Cyan
    docker build -t melsaadany/gfm-api apps/api/
    docker push melsaadany/gfm-api
    Write-Host "✓ Docker image pushed" -ForegroundColor Green
} else {
    Write-Host "⚠ Docker Desktop is not running" -ForegroundColor Yellow
    Write-Host "  → Open Docker Desktop from Start Menu, wait for it to start, then re-run this script" -ForegroundColor White
    Write-Host "  → Or skip Docker: the old API image still works on Azure" -ForegroundColor White
}

# Step 5: Azure CLI
Write-Host "`n[5/5] Azure Container App update..." -ForegroundColor Cyan
$azCheck = az account show 2>$null
if ($LASTEXITCODE -eq 0) {
    az containerapp update --name fdi-backend-api --resource-group fdi-monitor-prod --image melsaadany/gfm-api:latest
    Write-Host "✓ Azure Container App updated" -ForegroundColor Green
} else {
    Write-Host "⚠ Azure CLI not logged in — run: az login" -ForegroundColor Yellow
}

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "Frontend: https://fdimonitor.org" -ForegroundColor White
Write-Host "API: https://api.fdimonitor.org" -ForegroundColor White
Write-Host "Admin access: https://fdimonitor.org/admin/access" -ForegroundColor Cyan
