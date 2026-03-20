# Global FDI Monitor — Platform Documentation v112

**Live:** https://fdimonitor.org  
**API:** https://api.fdimonitor.org  
**Status:** https://fdimonitor.org/health

---

## Platform Summary

| Metric               | Value                          |
|----------------------|--------------------------------|
| Pages                | 44 → 78 static routes          |
| Components           | 31                             |
| API Routes           | 107                            |
| Test Suite           | 953 passing                    |
| Ranking refs         | 0 ✓                            |
| FIC refs (UI)        | 0 ✓                            |
| Forecasta refs       | 0 ✓                            |
| Footer pages         | 27+                            |
| Production homepage  | LIVE (FDIFlowMap + AnimatedCounter) |

---

## Navigation Structure

| Nav Item                | Route                   |
|-------------------------|-------------------------|
| Home                    | /                       |
| About Us                | /about                  |
| Global Dashboard        | /dashboard              |
| Investment Analysis     | /investment-analysis    |
| Promotion Mission Planning | /pmp                 |
| Resources & Insights    | /market-insights        |
| Contact Us              | /contact                |

**Note:** "Global Ranking" has been removed. Investment Analysis replaces it.

---

## Investment Analysis (Core Feature)

**Route:** `/investment-analysis`  
**Lines:** 762L  
**Tabs:** Overview · Global Investment Analysis · Benchmark · Impact Analysis

### Formula
```
GOSA = (0.30 × Layer 1: Doing Business Indicators)
     + (0.20 × Layer 2: Sector Indicators)
     + (0.25 × Layer 3: Special Investment Zone Indicators)
     + (0.25 × Layer 4: Market Intelligence Matrix)
```

### Score Tiers
- Top Tier: 80–100
- High Tier: 60–79
- Developing Tier: below 60

### Terminology Rules
**NEVER USE:** ranking, rankings, ranked, leaderboard, ranking table  
**USE:** analysis, assessment, position, tier, sorted by, country analysis table

---

## Trial System

| Trigger           | Limit | Action                    |
|-------------------|-------|---------------------------|
| Time              | 7 days | Soft-lock + redirect      |
| Report downloads  | 2     | Soft-lock + redirect      |
| Search views      | 3     | Soft-lock + redirect      |

**Soft-lock:** All features disabled (filters, search, downloads, reports)  
**Redirect URL:** `/contact?reason=trial_expired&trigger=X&msg=...`  
**Lift restriction:** Submit demo request → `gfm_demo_submitted: true`

---

## Brand Colors

```css
--color-primary:  #74BB65;  /* Investment Green */
--color-navy:     #0A3D62;  /* Deep Navy */
--color-blue:     #1B6CA8;  /* Medium Blue */
--color-bg:       #E2F2DF;  /* Light Background */
--color-grey:     #696969;  /* Text Secondary */
```

---

## AI Agent Context

**File:** `src/lib/agentContext.ts` (138L)  
**Languages:** EN, AR, ZH, FR, ES, DE, JA, KO, PT, RU  
**Domain expertise:** FDI analytics, trade policy, sector intelligence, investment zones  
**Report structure:** 16-page PDF template with AI cover image  

---

## Free Asset Sources

See `PUBLIC_ASSETS.md` for full list.  
**Icons:** Lucide React (MIT) + Tabler Icons (MIT) — 42/44 pages  
**Video:** Pexels, Pixabay, Coverr, Mixkit (CC0)  
**Video editing:** DaVinci Resolve free, FFmpeg  

---

## Infrastructure

| Resource              | Value                                              |
|-----------------------|----------------------------------------------------|
| Frontend              | GitHub Pages (fdimonitor.org)                     |
| API                   | Azure Container Apps (UAE North)                  |
| Database              | Azure PostgreSQL 16 (UAE North)                   |
| Cache                 | Azure Redis (UAE North)                           |
| Docker image          | melsaadany/gfm-api:latest                        |

---

## Deploy Commands

```powershell
# Frontend
tar -xzf GFM_FINAL_v112_COMPLETE.tar.gz
git add . && git commit -m "vXXX: description" && git push origin main

# Backend
docker build -t melsaadany/gfm-api apps/api/
docker push melsaadany/gfm-api
az containerapp update --name fdi-backend-api --resource-group fdi-monitor-prod --image melsaadany/gfm-api:latest

# Enable production homepage
cp apps/web/src/app/page.production.tsx apps/web/src/app/page.tsx
```
