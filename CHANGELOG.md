# FDI Monitor — Changelog
## v74 (March 2026) — Production Final
- /ar: Full institutional Arabic RTL landing page (126L)
- Toast: useToast hook + ToastProvider with 4 types
- sitemap.xml: 33 URLs covering all major pages
- API: +5 routes (signals/grades, economies, reports/download, watchlists/:id, version) → 70 routes

## v73 (March 2026)
- Homepage: Brand hero 162L with GlobeMap, 8 feature cards, pricing preview, footer
- /gfr: 20 economies, expandable dimension rows, tier filter, InvestmentHeatmap
- /signals: 20 demo signals, table+cards view, grade/type/search filters, WebSocket, SCI score

## v72 (March 2026)
- /market-insights: 168L, featured articles, category+region+search, TrialBanner
- /investment-pipeline: 239L, 6-stage Kanban, table view, add deal modal, TrialBanner
- TrialBanner: Now on 15 pages (watchlists/alerts/company-profiles added)
- API: +4 routes → 70 total

## v71 (March 2026)
- /forecast: 264L, 4-tab (Timeline/Top 20/Signals/What-If), ForecastChart SVG 2015-2050
- /analytics: 161L, TrendChart SVG, FDIWorldMap, regional+sector breakdowns, AdvancedAnalytics

## v70 (March 2026)
- Globe4D integrated into dashboard overview tab
- /scenario-planner: 182L, 4 presets, 3 sliders, ConfBar SVG, scenario comparison table
- /pricing: 164L, 3 plan cards, 30-feature comparison table, annual savings banner

## v69 (March 2026)
- /api-docs: 176L, 10 groups, all 66 endpoints with method colours and auth badges
- /benchmarking: 172L, SVG RadarChart, 8 economies, live dimension table
- /corridor-intelligence: 156L, 10 corridors, MiniBar SVG, bilateral bar chart
- API: +3 routes → 66 (scenario/run, pmp/dossier 402, analytics/forecast)
- 14 agents hardened with try/except error handler

## v68 (March 2026)
- /publications: Category filters, PreviewGate trial lock
- /onboarding: 5-step wizard (Welcome/UseCase/Regions/Sectors/Ready)
- /settings: 4-tab (Profile/Notifications/API key/Billing)
- /contact: 7 enquiry types, Data Source Request conditional form

## v67 (March 2026)
- /sources: 128L, 5 data tiers, 6-step pipeline, SCI formula, grade thresholds
- /about: 129L, INSIGHT philosophy 7 letters, GFR methodology, mission, values
- /demo: 167L, 4 interactive feature tabs (signals/GFR/foresight/reports)

## v66 (March 2026)
- /auth/login: Two-panel layout with social proof + trusted-by logos
- /register: 2-step dark brand wizard with trial messaging
- Error boundaries: 7 error.tsx files (dashboard/signals/gfr/pmp/reports/forecast + more)
- Loading skeletons: 13 total
- globals.css: focus-visible, sr-only, animations, glassmorphism, print styles

## v65 (March 2026)
- Dashboard: FDIWorldMap + BentoDashboard + AdvancedAnalytics integrated
- Agents: agt02/03/08/09 + agt04-15 upgraded from stubs
- API: +3 routes (auth/refresh, auth/me, search) → 64

## v64 (March 2026)
- 19 components all rebuilt: FDIWorldMap/PreviewGate/MobileNav/InvestmentHeatmap/Globe3D/Globe4D/Skeleton/LanguageSelector
- NavBar: GlobalSearch + NotificationBell integrated
- PLATFORM.md: 163-line technical documentation

## v63 (March 2026)
- AdvancedAnalytics: 3-view SVG (trend LineChart/region DonutChart/sector bars)
- BentoDashboard: 6-bento tile layout
- M_CORRIDORS: 10 mock bilateral corridors
- API: 63 routes

## v62 (March 2026)
- 404 not-found.tsx: dark brand with 6 quick-link grid
- Loading skeletons for 8 major pages
- CookieConsent: dark glassmorphism
- LiveTicker: RAF smooth scroll + WebSocket
- GlobalSearch: Cmd/Ctrl+K keyboard shortcut
- Credits guide: 13 credit-costing actions

## v60 (March 2026)
- /ar: NavBar + institutional content
- Dashboard: 4D animated SVG globe with signal hotspots
- JsonLd: 3 schema types (Organization/WebSite/SoftwareApplication)
- country/[iso3]: 4-tab profile, 31 static ISOs, GFR dimensions

## Earlier versions (v55-v59)
- Complete platform rebuild: all 43 pages to dark brand
- FIC = 0: Complete purge of FIC references
- 7-day trial system: TrialBanner + trial-start localStorage
- PDF-only reports: watermarks + SHA-256 + 402 for trial
- API: 58 routes covering complete platform

## v83 (March 2026)
- TrialBanner: Expanded to 26 pages (added pricing/settings/subscription/faq/api-docs/admin/demo/about/contact)
- /sources: 161L — live freshness dashboard (5 tiers × last_refresh/signals), 6-step pipeline, SCI formula
- /pmp: Globe4D added to Mission Planning Command Centre header
- Aria-labels added to 6 more components (LiveTicker/InvestmentHeatmap/PreviewGate/GlobalSearch/BentoDashboard/FDIWorldMap)
- 671 tests passing

## v82 (March 2026)
- /reports: 185L — 10 report types (MIB/SER/ICR/TIR/CEGP/RQBR/SPOR/FCGR/PMP/CRP), category filter, generate+library tabs, PreviewGate
- /admin: 196L — 4 tabs (Metrics KPIs / Users table / Jobs pause-resume / System info)
- TrialBanner: Expanded to 17 pages (+publications/sources)
- Brand compliance: FIC=0, Forecasta=0, ISIC_UI=0 enforced
- 662 tests passing

## v81 (March 2026)
- /company-profiles: 166L — 12 companies, grade/sector/search filters, expandable IMS/SCI rows, PreviewGate
- /subscription: 145L — monthly/annual toggle, Stripe checkout integration, $1,440/year savings callout
- /faq: 101L — 5 accordion sections, 15 Q&A pairs covering signals/GFR/reports/API
- NavBar added to /dashboard (was missing)
- API: +5 routes → 78 total
- 653 tests passing

## v90 (March 2026)
- New typographic logo system: Logo.tsx component (4 variants: dark/light/nav/hero)
- All logo SVGs with transparent/blank backgrounds matching uploaded design
- FDI in large black-weight (#FAFAF0 dark | #2E4A7A light) + MONITOR medium-weight below
- Deployed in NavBar, MobileNav, auth/login, auth/reset, register, onboarding, holding page
- SVG assets: logo.svg, logo-light.svg, favicon.svg, apple-touch-icon.svg, og-image.svg
- 724 tests passing

## v89 (March 2026)
- All 30/30 agents hardened with error handling (agent_router.py _safe_route added)
- API: +5 routes → 86 total (analytics/signals, analytics/regions, analytics/sectors, onboarding GET/POST)
- /terms: 70L, 13 comprehensive sections, DIFC governing law, TrialBanner
- /privacy: 68L, 12 sections, GDPR+DIFC+UAE compliance, TrialBanner
- 712 tests passing

## v88 (March 2026)
- Holding page activated: "Under Development" mode with email capture waitlist
- Secret preview bypass: ?preview=fdimonitor2026 → localStorage → auto-redirect to /dashboard
- Real homepage backed up as page.production.tsx
- /market-signals rebuilt: 126L, 6 signal types explained, 4 grade thresholds, SCI formula
- TrialBanner expanded to 37 pages
- 704 tests passing — 700 milestone

## v95 (March 2026)
- Loading skeletons: 19→27 (added about/alerts/contact/demo/faq/investment-pipeline/pricing/country/[iso3])
- /contact: 142L — 7 enquiry types, form + success state, POST /api/v1/contact
- /ar: 102L — full Arabic RTL page, 6 feature cards, stats, Cairo/Noto Naskh Arabic font
- API: 93 routes · 2238 server lines
- 767 tests passing

## v94 (March 2026)
- Error boundaries: 7→17 (added analytics/benchmarking/corridor/company-profiles/market-insights/publications/watchlists/admin/investment-pipeline/scenario-planner)
- API: 90 routes, all 30 agents verified cleanly executing
- 753 tests passing

## v93 (March 2026)
- SEO: 30 layout.tsx files with Metadata + OpenGraph for all client pages
- /about: 113L — INSIGHT framework (7 letters), 4 values, mission statement
- sitemap.xml: 52 URLs with priorities; robots.txt: admin/settings protected
- 746 tests passing

## v92 (March 2026)
- /publications: 121L — 10 publications, 7 category filters, search, PreviewGate
- API: 88 routes, 2184 server lines
- PLATFORM.md: 210L comprehensive final documentation
- 740 tests — milestone hit

## v97 (March 2026)
- 30 error boundaries (added 13 more: about/alerts/contact/faq/gfr-methodology/market-insights/market-signals/pricing/sectors/settings/sources/subscription/watchlists/ar/country-iso3)
- /privacy: 70L, 12 sections with GDPR+DIFC+UAE compliance
- /terms: 70L, 13 sections with Enterprise tier, DIFC-LCIA arbitration
- /health: 121L, 12 services in 4 tiers, 3 incidents, KPIs
- /fic/success: 90L, 7-type credit guide showing report counts
- /dashboard/success: 81L, billing cycle, credits, feature tiles
- 780 tests passing

## v99 (March 2026)
- API: 100 routes milestone hit (added analytics/corridors, gfr/:iso3/signals, auth/reset-request)
- /onboarding: 204L — full 5-step wizard (welcome/use-case/regions/sectors/launch)
- /auth/login: 131L — two-panel with features list, Logo component, social proof
- 791 tests passing

## v98 (March 2026)
- /settings: 195L — 4-tab account management (profile/notifications/api/billing)
- API: 98 routes · 2332 server lines
- 30 error boundaries · 27 loading skeletons
- 786 tests passing

## v101 (March 2026) — SPEC UPDATE
- Brand: updated 57 files from dark theme (#0F0A0A/#FF6600) to new brand (#74BB65/#0A3D62/#E2F2DF)
- NEW: SourceBadge.tsx (61L) — hover tooltip with source/date/accessed/ref for all data points
- NEW: DimensionWheel.tsx (132L) — SVG radial wheel + dimension cards (ETR/ICT/TCM/DTF/SGT/GRP)
- NEW: Proprietary factors: IRES/IMS/SCI/FZII/PAI/GCI in data models
- /pricing: 229L — new model: 3-day trial (5 FIC), $9,588/yr Professional, Enterprise custom
- /gfr/methodology: 166L — full infographic with DimensionWheel, 7 pillars, 6-step normalisation
- types.ts: 191L — complete GFR dimensions, proprietary factors, PMP entities, DataSource provenance
- 802 tests passing

## v101 continued (March 2026) — Spec Execution
- page.production.tsx: 209L — cinematic hero, rotating quote carousel (5s), 8 feature cards, stats, CTA band
- /gfr: 464L — full 5-tab spec interface (Results/Ranking/Country Profile/Comparison/Methodology)
- /about: 155L — full INSIGHT 7-cards, Vision/Mission, Expertise, 6 Strengths, Methodology, Stats
- /contact: 178L — country dropdown (70+ countries), LinkedIn, info@fdimonitor.org
- /market-insights: 148L — full filter panel (Type/Topic/Region/Search), featured publications, grid
- /gfr/methodology: 166L — DimensionWheel SVG infographic, 7 pillars, 6-step normalisation, sources
- /pricing: 229L — 3-day trial / 5 FIC / $9,588/yr Professional / Enterprise custom / FIC cost guide
- Trial: updated 3-day across all 8 remaining files
- types.ts: 191L — GovernmentEntity · SectorLead · PotentialCompany · PMPDossier · DataSource
- 834 tests passing

## v103 (March 2026) — Trial Expiry + LIVE Indicator
- trialContext.tsx: 250L — 3 expiry triggers (7d/2reports/3searches), redirect logic, consumeSearch, submitDemoRequest
- TrialGate.tsx: 142L — animated overlay with contextual message, 2.8s countdown, redirect to demoUrl
- TrialGateWrapper.tsx: 7L — client wrapper for layout
- SoftLockBanner.tsx: 46L — red sticky banner for expired state
- ReadOnlyOverlay.tsx: 69L — blocks all features on soft-lock (incl. filter+search per updated spec)
- NavBar.tsx: 130L — LIVE indicator always visible in all auth states, links to /signals
- TrialBanner.tsx: 62L — uses useTrial() hook, shows days/reports/searches remaining
- /contact: 254L — smart demo request page with 3 trigger contexts, pre-fill, submitDemoRequest
- /signals: 329L — full professional feed, SCI formula, trial quota display, SourceBadge provenance
- /analytics: 190L — SVG trend chart, KPI cards with SourceBadge, regional/sector bars, corridors
- API: 103 routes — trial/status, trial/consume, demo/request
- 869 tests passing
