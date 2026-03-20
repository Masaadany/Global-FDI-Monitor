# Global FDI Monitor — Complete Setup & Deployment Guide
**v3.0 | March 2026 | Forecasta Ltd, DIFC Dubai UAE**

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥20 LTS | Frontend build + API runtime |
| Python | ≥3.12 | Pipeline, agents, tests |
| Docker | ≥24 | Container builds |
| Azure CLI | ≥2.50 | Cloud deployment |
| Git | any | Source control |

---

## 1. Clone & Install

```bash
git clone https://github.com/Masaadany/Global-FDI-Monitor.git
cd Global-FDI-Monitor

# Frontend
cd apps/web && npm ci && cd ../..

# Run tests
python3 -m pytest apps/pipeline/tests/ -q
```

---

## 2. Environment Variables

Create `apps/api/.env`:
```env
# Required
JWT_SECRET=<32+ char random string>
DATABASE_URL=postgresql://fdiuser:DB_PASSWORD_REDACTED@fdi-db-prod-fdimahmoud.postgres.database.azure.com:5432/gfm?sslmode=require
REDIS_URL=rediss://:REDIS_KEY_REDACTED@fdi-cache-prod.redis.cache.windows.net:6380

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# App
APP_URL=https://fdimonitor.org
PORT=3001
NODE_ENV=production
```

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.fdimonitor.org
NEXT_PUBLIC_WS_URL=wss://api.fdimonitor.org/ws
NEXT_PUBLIC_PREVIEW_PASSWORD=GFM2026PREVIEW
```

---

## 3. Database Setup

```bash
# Run migrations (creates all 28 tables across 5 schemas)
node DEPLOYMENT/migrate.js

# Schemas created:
# auth (users, organisations, sessions, api_keys)
# intelligence (signals, gfr_scores, company_profiles, economies, publications)
# pipeline (deals, watchlists)
# notifications (alerts, preferences)
# billing (fic_transactions, subscriptions, webhook_events)
```

---

## 4. Local Development

```bash
# Start all services
docker-compose up -d

# Services:
# db      → PostgreSQL 16 on :5432
# redis   → Redis 7 on :6379
# api     → Node.js API on :3001
# web     → Next.js dev on :3000
# agents  → Python agents on :8080
# pipeline → Data collectors (runs once)

# Frontend only
cd apps/web && npm run dev

# API only
cd apps/api && node server.js
```

---

## 5. Production Deployment

### 5a. Frontend (GitHub Pages)
```bash
cd apps/web
npm run build
git add . && git commit -m "deploy" && git push origin main
# GitHub Actions auto-deploys to fdimonitor.org
```

### 5b. API Docker Build
```bash
docker build -t melsaadany/gfm-api:latest apps/api/
docker push melsaadany/gfm-api:latest
```

### 5c. Azure Container App Update
```bash
az containerapp update \
  --name fdi-backend-api \
  --resource-group fdi-monitor-prod \
  --image melsaadany/gfm-api:latest

# Verify deployment
curl https://api.fdimonitor.org/api/v1/health
```

### 5d. Agents Deploy
```bash
docker build -t melsaadany/gfm-agents:latest apps/agents/
docker push melsaadany/gfm-agents:latest
az containerapp update \
  --name fdi-agents \
  --resource-group fdi-monitor-prod \
  --image melsaadany/gfm-agents:latest
```

---

## 6. GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `AZURE_CREDENTIALS` | `az ad sp create-for-rbac --sdk-auth` JSON |
| `DATABASE_URL` | PostgreSQL connection string |
| `PREVIEW_PASSWORD` | Password for preview gate |

---

## 7. Azure Infrastructure (Bicep)

```bash
# Deploy infrastructure from scratch
az deployment sub create \
  --location uaenorth \
  --template-file DEPLOYMENT/bicep/main.bicep \
  --parameters @DEPLOYMENT/bicep/main.parameters.json
```

Key resources created:
- Container Apps Environment (UAE North)
- PostgreSQL Flexible Server v16
- Redis Cache 1GB
- Container Registry (optional — using Docker Hub)
- DNS zone for api.fdimonitor.org

---

## 8. Health Verification

```bash
# API health
curl https://api.fdimonitor.org/api/v1/health | jq

# Expected response:
# { "status": "ok", "db": "connected", "redis": "connected", "ws_clients": N }

# Run test suite
python3 -m pytest apps/pipeline/tests/ -q --no-header
# Expected: 253 passed

# Check static pages
curl -I https://fdimonitor.org/signals
# Expected: HTTP/2 200
```

---

## 9. Monitoring & Operations

| Task | Command |
|------|---------|
| View API logs | `az containerapp logs show --name fdi-backend-api --resource-group fdi-monitor-prod` |
| Flush Redis | POST `https://api.fdimonitor.org/api/v1/internal/cache_flush` (admin token) |
| Trigger GFR refresh | POST `https://api.fdimonitor.org/api/v1/internal/gfr_refresh` (admin token) |
| Check agent status | GET `https://[agents-url]:8080/health` |
| DB backup | Azure Portal → PostgreSQL → Backup (automated daily, 7-day retention) |

---

## 10. Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails: `use client` error | Ensure `'use client';` is first line of file |
| 502 from API | Check Container App min replicas ≥ 1; check logs |
| DB connection timeout | Verify Azure PostgreSQL firewall allows Container App outbound IP |
| JWT errors after redeploy | Ensure `JWT_SECRET` env var matches across deployments |
| FIC not deducting | Check `billing.fic_transactions` table; verify JWT in request |
| Stripe webhook 400 | Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard |
| Redis NOAUTH | Ensure `REDIS_URL` includes password; check port 6380 (SSL) |

---

*© 2026 Forecasta Ltd · DIFC, Dubai, UAE · info@fdimonitor.org*
