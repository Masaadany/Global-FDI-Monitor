# GFM COMPLETE SETUP GUIDE

## Quick Start (Local)

```bash
# 1. Clone repo
git clone https://github.com/Masaadany/Global-FDI-Monitor
cd Global-FDI-Monitor

# 2. Start local infra (PostgreSQL + Redis)
docker compose up -d db redis

# 3. Run DB migration
node DEPLOYMENT/migrate.js

# 4. Start API
cd apps/api && npm install && npm start

# 5. Start frontend
cd apps/web && npm install && npm run dev
```

## Production Deploy (Azure)

```powershell
# Deploy frontend → GitHub Pages (auto via CI/CD on push)
git push origin main

# Deploy API → Azure Container Apps
docker build -t melsaadany/gfm-api apps/api/
docker push melsaadany/gfm-api
az containerapp update --name fdi-backend-api --resource-group fdi-monitor-prod --image melsaadany/gfm-api:latest

# Run DB migration
node DEPLOYMENT/migrate.js

# Deploy pipeline jobs
bash DEPLOYMENT/azure_pipeline_jobs.sh
```

## Environment Variables
Copy `.env.example` to `.env` and fill in values.

## Stripe Setup
1. Create products in Stripe dashboard
2. Add price IDs to `.env`
3. Set webhook URL: `https://api.fdimonitor.org/api/v1/billing/webhook`
4. Events to enable: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`

## Cost Estimate
| Service | SKU | Est. USD/month |
|---------|-----|----------------|
| Azure Container Apps (API) | 0.25 CPU, 0.5Gi | ~$15 |
| Azure Container Apps (Agents) | Scale to 0 | ~$8 |
| Azure PostgreSQL | B1ms, 32GB | ~$18 |
| Azure Redis | C0 | ~$16 |
| GitHub Pages (frontend) | Free | $0 |
| Anthropic API (Haiku) | 500K tokens/mo | ~$15 |
| **Total** | | **~$72/month** |

## Architecture
- Frontend: Next.js 14 on GitHub Pages (free)
- API: Node.js on Azure Container Apps (scales 0→3)
- DB: Azure PostgreSQL (B1ms, lowest tier)
- Cache: Azure Redis (C0, basic)
- Pipeline: Azure Container Jobs (only runs when scheduled)
- Agents: Azure Container Apps (scale to 0 when idle)
