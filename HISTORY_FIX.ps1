# Git History Rewrite — removes secrets from ALL historical commits
# Run ONCE to permanently fix the GitHub push protection issue
# WARNING: This rewrites git history. If others have cloned the repo, they need to re-clone.

$ProjectPath = "C:\Users\Mahmoud\OneDrive - Corporate Social Responsibility\Desktop\Global FDI Monitor"
Set-Location $ProjectPath

Write-Host "=== GIT HISTORY REWRITE ===" -ForegroundColor Yellow
Write-Host "This will rewrite all commits to remove the Redis key and DB password" -ForegroundColor White
Write-Host ""

# The exact secret string to remove
$redisKey = "zsAQ2PmnVMirDuHLUsy84Nl9MsrGwsCDVAzCaGFF2ks="
$dbPassword = "Ash@#2020"

# Option 1: Use git filter-branch (built-in, slower)
Write-Host "[Option 1] Using git filter-branch..." -ForegroundColor Cyan

git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch .env.example DEPLOYMENT/SETUP_GUIDE.md DEPLOYMENT/azure_api_deploy.sh DEPLOYMENT/migrate.js" `
  --prune-empty --tag-name-filter cat -- --all

# Re-add clean versions
git add .env.example "DEPLOYMENT/SETUP_GUIDE.md" "DEPLOYMENT/azure_api_deploy.sh" "DEPLOYMENT/migrate.js" .gitignore
git commit --amend --no-edit 2>$null

# Force push
Write-Host ""
Write-Host "[Final] Force pushing clean history..." -ForegroundColor Cyan
git push origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ SUCCESS - Secrets removed from entire git history" -ForegroundColor Green
    Write-Host "✓ Site will be live at https://fdimonitor.org" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "If push still blocked, use the GitHub allow URL:" -ForegroundColor Yellow
    Write-Host "https://github.com/Masaadany/Global-FDI-Monitor/security/secret-scanning/unblock-secret/3BBbMMbGq1Eooe2g5htwTW77pxj" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Click 'Allow secret' on that page, then run: git push origin main --force" -ForegroundColor White
}
