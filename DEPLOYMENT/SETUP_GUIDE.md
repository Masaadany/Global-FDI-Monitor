# Global FDI Monitor — Complete Setup Guide
**v18 · March 2026 · fdimonitor.org**

## Architecture

```
fdimonitor.org (GitHub Pages)
         ↓
api.fdimonitor.org (Azure Container Apps — Node.js API)
         ↓
fdi-db-prod-fdimahmoud (Azure PostgreSQL v16)
fdi-cache-prod         (Azure Redis)
         ↓
melsaadany/gfm-agents:latest (Agent service port 8080)
melsaadany/gfm-api:latest    (API service port 3001)
```

## Prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.12+
- Azure CLI (az)
- GitHub account with push access to masaadany/Global-FDI-Monitor

## 1. Local Development

```bash
# Clone + install
git clone https://github.com/masaadany/Global-FDI-Monitor
cd "Global-FDI-Monitor"
cp .env.example .env

# Start all services
docker compose up -d db redis

# API
cd apps/api && npm install && node server.js

# Web
cd apps/web && npm install && npm run dev

# Pipeline (optional)
cd apps/pipeline && pip install -r requirements.txt --break-system-packages
python collectors/master_pipeline.py

# Agents (optional)
AGENT_SERVER_MODE=true python apps/agents/super_agent.py
```

## 2. Database Migration

```bash
export DATABASE_URL="postgresql://fdiuser:Ash@#2020@localhost:5432/gfm"
node DEPLOYMENT/migrate.js
```

## 3. Production Deploy

### Frontend (GitHub Pages)
```bash
cd apps/web
npm run build
git add . && git commit -m "deploy" && git push origin main
```

### API (Azure Container Apps)
```bash
docker build -t melsaadany/gfm-api:latest apps/api/
docker push melsaadany/gfm-api:latest
az containerapp update \
  --name fdi-backend-api \
  --resource-group fdi-monitor-prod \
  --image melsaadany/gfm-api:latest
```

### Agents (Azure Container Apps)
```bash
docker build -t melsaadany/gfm-agents:latest apps/agents/
docker push melsaadany/gfm-agents:latest
az containerapp update \
  --name fdi-agents \
  --resource-group fdi-monitor-prod \
  --image melsaadany/gfm-agents:latest
```

## 4. Infrastructure (Bicep)

```bash
cd DEPLOYMENT/bicep
az deployment group create \
  --resource-group fdi-monitor-prod \
  --template-file main.bicep \
  --parameters @main.parameters.json
```

## 5. Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://fdiuser:...@host/gfm` |
| `REDIS_URL` | Redis connection string | `rediss://:key@host:6380` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `gfm-prod-secret-...` |
| `STRIPE_SECRET_KEY` | Stripe API key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `ANTHROPIC_API_KEY` | Anthropic API (for agents) | `sk-ant-...` |
| `RESEND_API_KEY` | Email delivery | `re_...` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | `https://api.fdimonitor.org` |
| `NEXT_PUBLIC_PREVIEW_PASSWORD` | Preview gate password | `GFM2026PREVIEW` |

## 6. Platform Credentials

| Service | URL |
|---|---|
| Frontend | https://fdimonitor.org (password: `GFM2026PREVIEW`) |
| API | https://api.fdimonitor.org |
| Azure Portal | portal.azure.com → fdi-monitor-prod |
| GitHub | github.com/masaadany/Global-FDI-Monitor |
| Docker Hub | hub.docker.com/u/melsaadany |

## 7. Post-Deploy Checklist

- [ ] `node DEPLOYMENT/migrate.js` — apply DB migrations
- [ ] Visit https://fdimonitor.org/api/v1/health — confirm `{"status":"ok"}`
- [ ] Visit https://fdimonitor.org — enter preview password
- [ ] Test register → onboarding → dashboard flow
- [ ] Test signal generation: /signals
- [ ] Test FIC purchase: /fic → Stripe sandbox
- [ ] Test report generation: /reports → Generate → polling
- [ ] Test WebSocket: /analytics → Live Feed

## 8. Monthly Cost (~$77/month)

| Service | Cost |
|---|---|
| Azure Container Apps (API + Agents) | $23 |
| Azure PostgreSQL Flex | $18 |
| Azure Redis Cache | $16 |
| GitHub Pages | $0 |
| Anthropic API | $15 |
| Misc (domain, DNS, monitoring) | $5 |
| **Total** | **$77** |

## 9. Support

Email: info@fdimonitor.org | +971 50 286 7070
