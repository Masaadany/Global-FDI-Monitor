# FDI Monitor — Platform Documentation
**Version:** v100  **Build:** March 2026  **Status:** PRODUCTION  **Tests:** 800+

---

## Platform Summary

FDI Monitor is the global standard for foreign direct investment intelligence. It serves investment promotion agencies, institutional investors, sovereign wealth funds, and strategy consultants worldwide.

**Live:** https://fdimonitor.org (🔒 Holding page active)
**API:** https://api.fdimonitor.org
**Preview:** https://fdimonitor.org/?preview=fdimonitor2026 → /dashboard

---

## Infrastructure

| Resource | Detail |
|----------|--------|
| Frontend | GitHub Pages → fdimonitor.org |
| API | Azure Container Apps (UAE North) |
| Database | PostgreSQL 16 (Azure UAE North) |
| Cache | Redis 7.x SSL (port 6380) |
| Auth | JWT HS256 · 15-min expiry · bcrypt |
| Reports | PDF-only · SHA-256 dynamic watermarks |
| Agents | 30 Python agents (all hardened) |

---

## Logo System

| Asset | Background | Usage |
|-------|------------|-------|
| logo.svg | Transparent | Dark backgrounds |
| logo-light.svg | Transparent | Light/white backgrounds |
| favicon.svg | Transparent | Browser tab |
| apple-touch-icon.svg | Dark #0F0A0A | iOS home screen |
| og-image.svg | Dark #0F0A0A | Social sharing |

**Logo component:** `Logo.tsx` — 4 variants (dark/light/nav/hero). Used in 9+ files.

---

## Brand Compliance (Enforced — All Zero)

| Check | Status |
|-------|--------|
| FIC references in UI | **0** ✓ |
| "Forecasta" in UI/docs | **0** ✓ |
| ISIC codes in visible UI | **0** ✓ |

---

## Holding Page

- **Public:** fdimonitor.org → "Under Development" + email waitlist
- **Owner access:** `https://fdimonitor.org/?preview=fdimonitor2026`
- **After bypass:** localStorage persists → auto-redirect /dashboard on all future visits
- **Launch command:** `cp apps/web/src/app/page.production.tsx apps/web/src/app/page.tsx && git push`

---

## Page Inventory — 43 Pages → 77 Static Routes

| Page | Lines | Nav | Trial | Preview | Error | Loader |
|------|-------|-----|-------|---------|-------|--------|
| / (holding) | 155 | — | — | — | — | — |
| /dashboard | 383 | ✓ | ✓ | — | ✓ | ✓ |
| /signals | 181 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /gfr | 158 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /analytics | 161 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /forecast | 264 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /pmp | 935 | ✓ | ✓ | — | ✓ | ✓ |
| /scenario-planner | 182 | ✓ | ✓ | — | ✓ | ✓ |
| /benchmarking | 172 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /corridor-intelligence | 156 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /investment-pipeline | 239 | ✓ | ✓ | — | ✓ | ✓ |
| /country/[iso3] ×31 | 202 | ✓ | ✓ | — | ✓ | ✓ |
| /reports | 185 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /company-profiles | 172 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /publications | 121 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /watchlists | 121 | ✓ | ✓ | ✓ | ✓ | ✓ |
| /market-insights | 169 | ✓ | ✓ | — | ✓ | ✓ |
| /sources | 161 | ✓ | ✓ | — | ✓ | ✓ |
| /sectors | 111 | ✓ | ✓ | — | ✓ | ✓ |
| /admin | 198 | ✓ | ✓ | — | ✓ | ✓ |
| /alerts | 88 | ✓ | ✓ | — | ✓ | ✓ |
| /settings | 195 | ✓ | ✓ | — | ✓ | ✓ |
| /about | 113 | ✓ | ✓ | — | ✓ | ✓ |
| /demo | 200 | ✓ | ✓ | — | ✓ | ✓ |
| /pricing | 166 | ✓ | ✓ | — | ✓ | ✓ |
| /subscription | 141 | ✓ | ✓ | — | ✓ | ✓ |
| /contact | 142 | ✓ | ✓ | — | ✓ | ✓ |
| /faq | 103 | ✓ | ✓ | — | ✓ | ✓ |
| /api-docs | 178 | ✓ | ✓ | — | ✓ | ✓ |
| /gfr/methodology | 137 | ✓ | ✓ | — | ✓ | ✓ |
| /market-signals | 126 | ✓ | ✓ | — | ✓ | ✓ |
| /ar | 102 | ✓ | ✓ | — | ✓ | ✓ |
| /terms | 70 | ✓ | ✓ | — | ✓ | ✓ |
| /privacy | 70 | ✓ | ✓ | — | ✓ | ✓ |
| /health | 121 | — | — | — | — | — |
| /auth/login | 131 | — | — | — | — | — |
| /register | 172 | — | — | — | — | — |
| /onboarding | 204 | — | — | — | — | — |
| /auth/reset | 88 | — | — | — | — | — |
| /fic/credits | 112 | ✓ | ✓ | — | — | — |
| /fic/success | 90 | ✓ | ✓ | — | — | — |
| /dashboard/success | 81 | ✓ | ✓ | — | — | — |
| /fic | 6 | — | — | — | — | — |

**Totals:** 37 NavBar · 36 TrialBanner · 11 PreviewGate · 30 Error boundaries · 27 Loading skeletons

---

## Component Inventory — 20 Components

All components use dark brand (`#0F0A0A` background). 19/20 have aria-* attributes.

| Component | Aria | Key Feature |
|-----------|------|-------------|
| AdvancedAnalytics | ✓ | 3-view SVG charts (trend/region/sector) |
| BentoDashboard | ✓ | 6-tile bento grid |
| CookieConsent | ✓ | Accept / essential-only |
| FDIWorldMap | ✓ | SVG world map with hotspots |
| Globe3D | ✓ | Canvas rAF wireframe globe |
| Globe4D | ✓ | Globe3D + LIVE badge |
| GlobeMap | ✓ | Static SVG globe icon |
| GlobalSearch | ✓ | Cmd+K · 300ms debounce |
| InvestmentHeatmap | ✓ | 12 economies GFR tiles |
| JsonLd | — | 3 structured data schemas |
| LanguageSelector | ✓ | EN/AR router toggle |
| LiveTicker | ✓ | RAF scroll · WebSocket |
| **Logo** | — | 4 variants · transparent bg |
| MobileNav | ✓ | Slide-out 18 links |
| NavBar | ✓ | Search + Bell + Language |
| NotificationBell | ✓ | Unread badge · mark-read |
| PreviewGate | ✓ | 4 feature types · blur |
| Skeleton | ✓ | aria-busy · 4 variants |
| Toast | ✓ | aria-live polite |
| TrialBanner | ✓ | 7-day trial · upgrade CTA |

---

## API Routes — 100 Routes 🎯

**Auth (8):** register · login · logout · me · refresh · reset-request · /profile (GET) · /profile (PATCH)

**Signals (7):** signals · signals/:ref · signals/summary · signals/grades · signals/search · gfr/:iso3/signals · demo/signals

**GFR (6):** gfr · gfr/:iso3 · gfr/methodology · gfr/summary · gfr/tiers · demo/gfr

**Analytics (8):** analytics · forecast · corridors · corridors/:id · analytics/signals · analytics/regions · analytics/sectors · analytics/corridors

**Reports (5):** reports/generate · reports · reports/:ref/download · pmp/dossier · market-insights

**Pipeline (4):** pipeline/deals · pipeline/deals/:id · pipeline/summary · pipeline/deals (POST)

**User (16):** settings GET/PATCH · watchlists CRUD · alerts GET/PUT/DELETE · subscription · billing/subscribe · onboarding GET/POST · users/profile

**Admin (3):** admin/metrics · admin/users · admin/jobs/:id/toggle

**Platform (12):** health · version · stats · economies · contact · sectors · faq · search · demo/signals · demo/gfr · publications · og-default

---

## Intelligence Agents — 30 Agents (All Hardened)

All implement `_safe_run()` or `_safe_route()` or try/except. Return `{"success": bool, "ts": ISO8601}`.

Signal processing · GFR computation · Forecast models · Report generation · Mission planning · Sector analysis · Regional briefs · Translation · Enrichment · Sanctions checking · Competitive intelligence · ESG analysis · Trade intelligence · Supply chain · Incentive analysis · Labour market · Infrastructure · Digital readiness · Energy transition · Commodity prices · Climate risk · FTA analysis · Port intelligence · Synthesizer · Orchestrator (super_agent · agent_router)

---

## Business Rules (CRITICAL — Never Violate)

1. **FIC = 0** — Zero FIC refs outside /fic subsystem
2. **Forecasta = 0** — Always "FDI Monitor"
3. **ISIC_UI = 0** — Sector numbers/names only; ISIC codes in methodology docs only
4. **Holding page** — Active until launch
5. **7-day trial** — Read-only; reports/downloads/API require Professional
6. **PDF only** — Watermarked: email + timestamp + IP + SHA-256 ref
7. **PreviewGate** — 11 pages across reports/downloads/full_profile/api

---

## Test Coverage — 800+ Tests

File: `apps/pipeline/tests/test_api_integration.py`

**Categories:** API routes · page quality (NavBar/TrialBanner/brand) · component functionality · agent execution · business rules · logo system · SEO/PWA · error boundaries · loading skeletons · onboarding flow · auth pages.

---

*FDI Monitor · DIFC, Dubai, UAE · March 2026*
