# GLOBAL FDI MONITOR — MASTER INDEX

Last Updated: 2026-03-17

## Platform Status
- Frontend: LIVE at https://fdimonitor.org
- API: LIVE at https://fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io
- Password: GFM2026PREVIEW (preview mode)
- GitHub: https://github.com/Masaadany/Global-FDI-Monitor

## Architecture
```
apps/
├── web/           Next.js 14 frontend (26 pages)
├── api/           Node.js Express API (28 endpoints)
├── agents/        50 AI agents + Super Agent
└── pipeline/      11 data collectors
DEPLOYMENT/
├── azure_api_deploy.sh
├── azure_pipeline_jobs.sh
└── migrate.js
```

## Pages (26)
| Route | Status | Description |
|-------|--------|-------------|
| / | ✅ | Homepage with live signal feed |
| /dashboard | ✅ | KPI tiles + map + analytics |
| /signals | ✅ | Signal monitor with drill-down |
| /gfr | ✅ | GFR Rankings (215 economies) |
| /analytics | ✅ | World map + 5 chart types |
| /reports | ✅ | 10 report types generator |
| /pmp | ✅ | Mission planning |
| /forecast | ✅ | 9-horizon forecasts |
| /investment-pipeline | ✅ | Kanban + table pipeline |
| /company-profiles | ✅ | CIC company intelligence |
| /market-insights | ✅ | Intelligence digest |
| /watchlists | ✅ | Watchlist management |
| /alerts | ✅ | Alert centre |
| /publications | ✅ | Newsletter + reports archive |
| /sources | ✅ | 20 data sources |
| /benchmarking | ✅ | Economy comparison |
| /scenario-planner | ✅ | Macro scenario modelling |
| /corridor-intelligence | ✅ | Bilateral corridor analysis |
| /pricing | ✅ | $899/month + annual |
| /about | ✅ | Mission + methodology |
| /contact | ✅ | Contact form |
| /register | ✅ | 3-step trial signup |
| /auth/login | ✅ | Login with API |

## API Endpoints (28)
- GET  /api/v1/health
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET  /api/v1/signals
- GET  /api/v1/gfr
- GET  /api/v1/gfr/:iso3
- GET  /api/v1/economies
- GET  /api/v1/economies/:iso3
- POST /api/v1/reports/generate
- GET  /api/v1/reports
- GET  /api/v1/forecast
- GET  /api/v1/publications
- GET  /api/v1/alerts
- PATCH /api/v1/alerts/:id/read
- POST /api/v1/pmp/missions
- GET  /api/v1/pmp/missions
- GET  /api/v1/sources
- GET  /api/v1/billing/plans
- POST /api/v1/billing/webhook
- GET  /api/v1/watchlists
- POST /api/v1/watchlists
- POST /api/v1/internal/pipeline/*
- POST /api/v1/internal/agents/*

## Agents (50 total)
- Super Agent: apps/agents/super_agent.py (routes to all 50)
- Signal Detector: AGT-02
- Report Generator: AGT-05
- Mission Planner: AGT-06
- Newsletter+QC+GFR: AGT-07/08/09
- Company+Trade: AGT-10/11
- Forecast+Anomaly+Gap+Social: AGT-12-15
- Competitive+ESG+Sanctions+Risk+Translation: AGT-16-20
- Alert+Publication+QA+RateLimit+Orchestrator: AGT-21-25
- Investor+Sector+Zone+Calendar+Bilateral: AGT-26-30
- Trade+Supply+Geo+FX+Regulatory: AGT-31-35
- Incentive+Labour+Infra+Digital+Energy: AGT-36-40
- Pipeline+MA+VC+SWF+RealEstate: AGT-41-45
- Commodity+Climate+FTA+Ports+Synthesizer: AGT-46-50

## Data Pipeline (11 collectors)
1. IMF WEO — GDP, inflation, unemployment
2. World Bank WDI — FDI, internet, electricity
3. OECD — FDI statistics
4. UNCTAD — FDI flows + greenfield index
5. IEA — Clean energy investment
6. GDELT — News signal detection (15min)
7. TI CPI — Corruption index
8. World Bank LPI — Logistics index
9. ITU ICT — Digital penetration
10. UN Comtrade — Bilateral trade flows
11. Internal curated datasets

## Subscription Model
| Tier | Price | FIC/yr | Users |
|------|-------|--------|-------|
| Free Trial | $0 | 5 total | 1 |
| Professional | $899/month | 4,800 | 3 |
| Professional Annual | $9,588/year | 4,800 | 3 |
| Enterprise | $29,500/year | 60,000 | 10 |

## Deployment Commands
```bash
# Push to production
git add . && git commit -m "..." && git push origin main

# Redeploy API
docker build -t melsaadany/gfm-api apps/api/
docker push melsaadany/gfm-api
az containerapp update --name fdi-backend-api --resource-group fdi-monitor-prod --image melsaadany/gfm-api:latest

# Run DB migration
node DEPLOYMENT/migrate.js

# Deploy pipeline jobs
bash DEPLOYMENT/azure_pipeline_jobs.sh
```
