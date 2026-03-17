<div align="center">
  <h1>🌍 Global FDI Monitor</h1>
  <p><strong>World's First Fully Integrated FDI Intelligence Platform</strong></p>
  <p>
    <a href="https://fdimonitor.org">fdimonitor.org</a> ·
    <a href="https://fdimonitor.org/demo">Live Demo</a> ·
    <a href="https://fdimonitor.org/pricing">Pricing</a> ·
    <a href="https://fdimonitor.org/health">Status</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black" />
    <img src="https://img.shields.io/badge/Node.js-20-green" />
    <img src="https://img.shields.io/badge/Python-3.12-blue" />
    <img src="https://img.shields.io/badge/Tests-42%20passing-brightgreen" />
    <img src="https://img.shields.io/badge/Pages-38-blue" />
    <img src="https://img.shields.io/badge/Economies-215-orange" />
  </p>
</div>

---

## Overview

Global FDI Monitor (GFM) is a full-stack investment intelligence platform covering 215 economies. It combines real-time signal detection, AI-powered GFR rankings, custom report generation, mission planning, and data pipeline automation.

Built for **Investment Promotion Agencies (IPAs)**, government ministries, and institutional investors.

### Live Infrastructure

| Component | URL |
|-----------|-----|
| Frontend  | https://fdimonitor.org (GitHub Pages) |
| API       | https://fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io |
| API alias | https://api.fdimonitor.org |
| Status    | https://fdimonitor.org/health |
| Demo      | https://fdimonitor.org/demo |

## Quick Start

### Local Development

```bash
# 1. Start PostgreSQL + Redis
docker compose up -d db redis

# 2. Run DB migration
node DEPLOYMENT/migrate.js

# 3. Start API (port 3001)
cd apps/api && npm install && npm start

# 4. Start frontend (port 3000)
cd apps/web && npm install && npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure. Required:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string  
- `JWT_SECRET` — Random 64-char string

Optional (for full functionality):
- `STRIPE_SECRET_KEY` — Stripe payments
- `ANTHROPIC_API_KEY` — AI agents
- `SMTP_HOST/USER/PASS` — Email notifications
- `APPLICATIONINSIGHTS_CONNECTION_STRING` — Azure monitoring

## Architecture

```
apps/
├── web/                    # Next.js 14 frontend (38 pages)
│   ├── src/app/           # App Router pages
│   ├── src/components/    # Reusable components (11)
│   └── src/lib/           # Utilities (export, seo, i18n, hooks)
├── api/                    # Node.js REST API (~50 endpoints)
│   ├── server.js          # Main server + all routes
│   ├── email.js           # Email notification system
│   └── openapi.yaml       # API specification
├── agents/                 # 50 AI agents (15 modules + super agent)
│   ├── super_agent.py     # Orchestration layer
│   └── agt*.py            # Agent modules (AGT-02 to AGT-50)
└── pipeline/               # Data collection + enrichment
    ├── collectors/         # 14 data source collectors
    ├── enrichment.py       # Waterfall enrichment + Z3 verification
    ├── reference_data.py   # 215 economies + 21 sectors master data
    └── tests/             # 42 tests
DEPLOYMENT/
├── migrate.js             # DB schema + seed (9 schemas, 14 tables)
├── azure_api_deploy.sh    # API deployment script
├── azure_pipeline_jobs.sh # 4 scheduled Container Jobs
├── bicep/                 # Infrastructure as Code (Bicep)
└── SETUP_GUIDE.md         # Step-by-step setup guide
```

## Platform Pages (38)

| Route | Description |
|-------|-------------|
| `/` | Homepage with 4D Globe + Bento Dashboard |
| `/demo` | Interactive demo (no login required) |
| `/dashboard` | Personalised dashboard |
| `/signals` | Live signal monitor + WebSocket feed |
| `/gfr` | GFR Rankings — 215 economies, 40 indicators |
| `/analytics` | 4D Globe · Charts · Heatmap · Live feed |
| `/reports` | 10 AI report types with FIC deduction |
| `/pmp` | Mission planning — AI company targeting |
| `/forecast` | FDI forecasts 2025–2030, 3 scenarios |
| `/investment-pipeline` | Kanban + table pipeline management |
| `/company-profiles` | CIC database — 15 companies |
| `/market-insights` | Intelligence digest |
| `/watchlists` | Custom watchlists with live signals |
| `/alerts` | Alert centre with real-time WebSocket |
| `/benchmarking` | Economy comparison — radar + gap analysis |
| `/scenario-planner` | Macro scenarios + Monte Carlo |
| `/corridor-intelligence` | 8 bilateral FDI corridors |
| `/sectors` | 21 ISIC sector intelligence |
| `/pricing` | Plans + Stripe checkout |
| `/fic` | FIC credits top-up |
| `/publications` | Weekly/monthly/GFR reports |
| `/about` | Methodology + data sources |
| `/contact` | Contact form |
| `/register` | 3-step trial signup |
| `/auth/login` | Login with JWT |
| `/auth/reset` | Password reset flow |
| `/onboarding` | New user wizard |
| `/settings` | Profile, billing, API, notifications |
| `/admin` | Operations console + user/org management |
| `/health` | System status monitor |
| `/ar` | Arabic RTL homepage |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## API Endpoints (~50)

See `apps/api/openapi.yaml` for full specification.

Key endpoints:
- `GET /api/v1/health` — System health + metrics
- `POST /api/v1/auth/register` — Register + welcome email
- `POST /api/v1/auth/login` — JWT authentication
- `GET /api/v1/signals` — Live signals with pagination
- `GET /api/v1/gfr` — GFR rankings with pagination
- `GET /api/v1/economies` — 215 economies
- `POST /api/v1/reports/generate` — Generate report (deducts FIC)
- `POST /api/v1/billing/checkout` — Stripe checkout session
- `POST /api/v1/billing/webhook` — Stripe webhook (HMAC verified)
- `GET /api/v1/metrics` — Runtime metrics
- `GET /api/docs` — OpenAPI spec (YAML)

WebSocket: `wss://api.fdimonitor.org/ws` — 2-second signal broadcast

## Data Pipeline

14 collectors running concurrently, 598+ data points per run:

| Source | Indicator | Economies |
|--------|-----------|-----------|
| IMF WEO | GDP, inflation, unemployment | 60 |
| World Bank WDI | FDI, internet, electricity | 60 |
| OECD | FDI statistics | 38 |
| UNCTAD | FDI flows + greenfield index | 40 |
| IEA | Clean energy investment | 30 |
| GDELT | News signal detection | 215 |
| TI CPI | Corruption index | 55 |
| Freedom House | Freedom score | 66 |
| Heritage Foundation | Economic freedom | 51 |
| Yale EPI | Environmental performance | 52 |
| WTO Tariff DB | Applied tariff rates | 54 |
| UN LSCI | Shipping connectivity | 43 |
| World Bank LPI | Logistics performance | 29 |
| ITU ICT | Internet penetration | 37 |

## Intelligence Layer

### Z3 Verification
Every data point passes logical constraint checking before acceptance:
- 14 per-indicator bounds (e.g., GDP $0.01B–$50,000B)
- Cross-field domain rules (e.g., FDI ≤ 3× GDP)

### Provenance System
Every data point carries:
```json
{
  "source_name": "UNCTAD WIR 2024",
  "source_url": "https://unctad.org/wir",
  "source_tier": "T1",
  "retrieved_at": "2026-03-17T10:30:00Z",
  "verification_hash": "sha256:a1b2c3...",
  "reference_code": "GFM-DP-20260317-8A3F5B",
  "completeness": 1.0
}
```

### Reference Code System
| Type | Format | Example |
|------|--------|---------|
| Signal | `MSS-[TYPE]-[ISO3]-[DATE]-[SEQ]` | `MSS-J-ARE-20260317-0001` |
| Report | `FCR-[TYPE]-[ECON]-[DATE]-[SEQ]` | `FCR-CEGP-ARE-20260317-0001` |
| Newsletter | `FNL-WK-[YYYY]-[WW]-[DATE]` | `FNL-WK-2026-11-20260317` |
| Data Point | `GFM-DP-[DATE]-[HEX]` | `GFM-DP-20260317-A3F12B` |
| Mission | `PMP-[ISO3]-[SECTOR]-[DATE]` | `PMP-ARE-J-20260317-0001` |

## Subscription Model

| Tier | Price | FIC/year | Seats |
|------|-------|----------|-------|
| Free Trial | $0 | 5 total | 1 (3 days) |
| Professional | $899/mo or $799/mo (annual) | 4,800 | 3 |
| Enterprise | $2,458/mo (annual) | 60,000 | 10 |
| FIC Top-up | $79–$599 | 50–500 | — |

## Cost Architecture (~$77/month)

| Service | SKU | Est. USD/mo |
|---------|-----|-------------|
| Azure Container Apps (API) | 0.25 CPU, scale 1–5 | $15 |
| Azure Container Apps (Agents) | Scale to 0 | $8 |
| Azure PostgreSQL | B1ms, 32GB | $18 |
| Azure Redis Cache | C0 Basic | $16 |
| GitHub Pages (frontend) | Free | $0 |
| Anthropic API (Haiku) | 500K tokens/mo | $15 |
| **Total** | | **~$72/mo** |

## GFR Methodology

Composite = `macro×0.20 + policy×0.18 + digital×0.15 + human×0.15 + infra×0.15 + sustain×0.17`

| Dimension | Weight | Indicators |
|-----------|--------|-----------|
| Macro Foundations | 20% | GDP growth, inflation, sovereign rating, debt/GDP, trade openness |
| Policy & Institutional | 18% | Rule of law, corruption, ease of doing business, FDI policy |
| Digital Foundations | 15% | Internet penetration, 5G, digital government, AI readiness |
| Human Capital | 15% | Tertiary enrolment, PISA, labour productivity, skills index |
| Infrastructure | 15% | LPI, airport connectivity, port efficiency, energy reliability |
| Sustainability | 17% | EPI, renewable share, carbon price, climate resilience |

## Tests

```bash
# Run all 68 tests
python3 -m pytest apps/pipeline/tests/ -v

# Individual suites
python3 -m pytest apps/pipeline/tests/test_agents.py
python3 -m pytest apps/pipeline/tests/test_api_integration.py
```

## Deploy to Production

```bash
# Frontend (GitHub Actions auto-deploys on push to main)
git push origin main

# API
docker build -t melsaadany/gfm-api apps/api/
docker push melsaadany/gfm-api
az containerapp update --name fdi-backend-api --resource-group fdi-monitor-prod --image melsaadany/gfm-api:latest

# DB migration (run once)
node DEPLOYMENT/migrate.js

# Schedule pipeline jobs
bash DEPLOYMENT/azure_pipeline_jobs.sh
```

---

© 2026 Forecasta Ltd · [fdimonitor.org](https://fdimonitor.org) · [Privacy](https://fdimonitor.org/privacy) · [Terms](https://fdimonitor.org/terms)
