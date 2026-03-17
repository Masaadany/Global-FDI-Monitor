# 🌍 Global FDI Monitor — Production Platform

**The world's most comprehensive FDI intelligence platform.**

[![Tests](https://img.shields.io/badge/Tests-100%20passing-brightgreen)](https://github.com/masaadany/Global-FDI-Monitor)
[![Pages](https://img.shields.io/badge/Pages-71%20static-blue)](#)
[![API](https://img.shields.io/badge/API-53%20routes-0A66C2)](#)
[![Agents](https://img.shields.io/badge/Agents-50%20AI-7C3AED)](#)

## Live Platform

| | URL | Status |
|---|---|---|
| **Frontend** | https://fdimonitor.org | ✅ Live (GFM2026PREVIEW) |
| **API** | https://api.fdimonitor.org | ✅ Live |
| **Health** | https://api.fdimonitor.org/api/v1/health | ✅ |
| **OpenAPI** | https://api.fdimonitor.org/api/v1/openapi.json | ✅ |

## Platform Inventory

### Pages (71 static)
- **37 page files** generating 71 static routes at build
- **30 country profiles** (`/country/ARE`, `/country/SAU`, `/country/IND`… 30 economies)
- **Core pages**: Homepage, Dashboard, Signals, GFR Rankings, Analytics, Forecast
- **Tools**: Benchmarking (radar chart), Scenario Planner (Monte Carlo), Mission Planning (FlightRadar map)
- **Data**: Company Profiles, Corridor Intelligence, Sectors, Investment Pipeline (Kanban)
- **Platform**: Reports (real-time polling), Watchlists, Alerts, Publications, FIC Credits, Subscription

### Design System
- **Font**: Plus Jakarta Sans (display) + JetBrains Mono (data/metrics)
- **Colors**: `--primary:#0A66C2` · `--deep:#0A2540` · `--surface:#F8FAFC`
- **Components**: `.gfm-card` `.gfm-btn-primary` `.gfm-badge` `.gfm-hero` `.signal-card` `.sector-icon` `.live-dot`

### API (53 routes)
Authentication, signals, GFR, economies, companies, corridors, search, reports, publications, scenarios, pipeline, watchlists, alerts, FIC/billing, admin, health, OpenAPI.

### Data Pipeline (14 collectors)
IMF WEO, World Bank WDI, OECD, GDELT, Transparency International, UNCTAD, IEA, WorldBank v2, Governance (Freedom House + Heritage EFI + Yale EPI), Trade Barriers (WTO + LSCI), GDELT Curated (20 Q1 2026 signals).

### AI Agents (50 agents, 15 specialists)
Signal Detection, GFR Computation, Country Profile, Market Brief, Mission Planning, Newsletter, Forecast, Scenario, Enrichment, Translation, Sanctions, Company Intel, Corridor, Publication, Alert. HTTP server mode on port 8080.

## Test Suite (100 passing)

```bash
cd apps/pipeline && python3 -m pytest tests/ -v
```

Categories: Signal detection, GFR formula, enrichment, provenance, agents, corridors, sectors, country profiles, API routes, design tokens.

## Quick Start

```bash
git clone https://github.com/masaadany/Global-FDI-Monitor
cp .env.example .env  # fill in credentials
docker compose up -d db redis
cd apps/api && npm install && node server.js        # API :3001
cd apps/web && npm install && npm run dev          # Web :3000
cd apps/pipeline && python collectors/master_pipeline.py
```

See [DEPLOYMENT/SETUP_GUIDE.md](DEPLOYMENT/SETUP_GUIDE.md) for full production deployment.

## Architecture

```
fdimonitor.org                     (GitHub Pages, HTTPS)
api.fdimonitor.org                 (Azure Container Apps, UAE North)
agents.fdimonitor.org:8080         (Azure Container Apps, port 8080)
fdi-db-prod-fdimahmoud             (Azure PostgreSQL v16, UAE North)
fdi-cache-prod                     (Azure Redis, UAE North)
```

## Cost (~$77/month)

| Service | Cost |
|---|---|
| Azure Container Apps (API + Agents) | $23 |
| Azure PostgreSQL Flex | $18 |
| Azure Redis Cache | $16 |
| Anthropic API | $15 |
| Misc (domain, monitoring) | $5 |
| **Total** | **$77** |

## Contact

**info@fdimonitor.org · +971 50 286 7070**
Global FDI Monitor is a product of Forecasta Ltd, Dubai, UAE.
