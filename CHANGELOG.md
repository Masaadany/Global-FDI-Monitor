# Global FDI Monitor — Changelog

---

## v115 (Current — March 2026)
### Added
- `/reports` — 274L: Full 10-type report generator with ReadOnlyOverlay, history tab, watermark info
- `/publications` — 170L: 10 publications across 6 categories, ReadOnlyOverlay on Pro content
- `/sources` — 197L: 304-source registry, 4-tier T1–T4, SourceBadge on each, 6-step pipeline
- `/fic/credits` — 108L: 3 credit packs with pricing, credit usage guide
- `/fic/success` — 55L: 5s countdown redirect with feature confirmation tiles
- `CHANGELOG.md` — this file

### API
- 110 total routes — added 3 new: `/admin/agents`, `/admin/agents/:id/run`, `/pipeline/status`
- 30-agent pipeline: Tier 1 (10 Signal), Tier 2 (8 GFR), Tier 3 (7 Investment Analysis), Tier 4 (5 Platform)

---

## v114 (March 2026)
### Added
- `globals.css` — 399L: All animations (`spin`, `fadeIn`, `progressFill`, `skeletonPulse`) + utilities
- `/subscription` — 185L: Annual/monthly toggle, Professional/Enterprise cards, trial status bar
- `/gfr/methodology` — 208L: DimensionWheel, 6 dimensions with 5 indicators + sources, normalisation pipeline
- `/market-signals` — 209L: 3-tab SCI methodology / signal types / Z3 verification
- `/dashboard/success` — 52L: 5-second countdown redirect, 3 feature tiles
- `/auth/reset` — 82L: Two-state password reset with API call

---

## v113 (March 2026)
### Added
- `/ar` — 209L: Full Arabic RTL page (`dir="rtl" lang="ar"`), Investment Analysis linked as تحليل الاستثمار
- `/register` — 200L: 2-step wizard with feature panel
- `/auth/login` — 139L: Features panel + login form
- `PLATFORM.md` — 136L: Full platform documentation
- TrialBanner added to 35+ pages

---

## v112 (March 2026)
### Added
- `/gfr` — 389L: 5-tab (Results/Profile/Compare/Methodology/→IA), RadarChart, SourceBadge, PreviewGate
- `/health` — 161L: 12 services, 30-day uptime chart, incident history
- `/api-docs` — 244L: 11 endpoint groups, all 107 routes documented, method badges, curl examples
- `/onboarding` — 226L: 5-step wizard (Welcome/Language/Role/Regions/Sectors), 10 languages

### Fixed
- Zero ranking references across GFR page (replaced with "assessment")

---

## v111 (March 2026)
### Added
- `/privacy` — GDPR + DIFC, 13 sections
- `/terms` — 13 sections with trial terms, watermark clause, DIFC governing law
- `/faq` — 5 categories, 20 Q&A, accordion, left nav
- `/sectors` — All 21 ISIC sectors, FDI data, hover CTAs
- Dashboard FDIFlowMap integration
- Footer on 25+ pages

---

## v110 (March 2026)
### Added
- `/pricing` — 260L: 3-tier cards + full feature comparison table
- `/settings` — 283L: 4-tab (Profile/Notifications/API/Billing), iOS-style toggles
- `/demo` — 256L: 4-feature interactive showcase (Signals/Analysis/Benchmark/Mission)
- `/market-insights` — 175L: 6-category hub, featured cards, newsletter CTA
- Footer component — 161L, newsletter, 4 link columns

---

## v109 (March 2026)
### Added
- `Footer.tsx` — 161L: Newsletter, Platform/Intelligence/Company/Legal link columns
- `agentContext.ts` — 138L: FDI domain expertise, 10 languages, terminology enforcement
- `GFM_REPORT_STRUCTURE` — 16-page PDF structure constants
- Investment Analysis API endpoints: `/countries`, `/country/:iso3`, `/impact`, `/benchmark`
- `/about` — INSIGHT framework, GOSA methodology, Investment Analysis CTA

---

## v108 (March 2026)
### Brand Relaunch
- Removed "Global Ranking" from NavBar → replaced with "Investment Analysis" → `/investment-analysis`
- Zero ranking references across entire codebase
- Zero FIC references in UI
- Zero Forecasta references

### Added
- `/investment-analysis` — 762L: 4-tab full spec (Overview/Analysis/Benchmark/Impact Analysis)
- Global Opportunity Score Analysis formula throughout
- GOSA tiers: Top Tier (80–100), High Tier (60–79), Developing Tier (below 60)

---

## Brand Spec (Final)
```
Colors:
  Primary:    #74BB65  (Investment Green)
  Navy:       #0A3D62  (Deep Navy)
  Blue:       #1B6CA8  (Medium Blue)
  Background: #E2F2DF  (Light Green)
  Grey:       #696969  (Text Secondary)

Terminology:
  ✓ Analysis, Assessment, Position, Tier, Sorted by
  ✗ Ranking, Rankings, Ranked, Leaderboard, Ranking Table

NavBar (7 items):
  Home · About Us · Global Dashboard · Investment Analysis · 
  Promotion Mission Planning · Resources & Insights · Contact Us
```

---

## v117 (March 2026)
### PUBLIC LOCK
- `middleware.ts` — All public visitors see "Under Development" page
- `/maintenance` — 108L: Futuristic Under Development page with email capture
- `/admin/access` — Admin bypass cookie setter (`/admin/access` URL grants access)
- Admin cookie: `gfm_admin_access=gfm_admin_2026_secure` (7-day session)

### Newsletter System (4-Step Automated Workflow)
- `/newsletter` — 524L: Full admin review dashboard
  - Section 1: Top Global Update (inline edit, source verification badges)
  - Section 2: Regional Updates (3-region grid with scores)
  - Section 3: Sector Updates (momentum scores)
  - Section 4: Top 5 Signals (color-coded, priority badges)
  - Approve & Schedule button → triggers distribution
  - Distribute Now → email + PDF + LinkedIn
  - PDF preview modal (4-page futuristic design preview)
  - Issue history table with analytics
  - Distribution settings panel

### API
- 121 routes total (11 new newsletter endpoints)
- `POST /newsletter/generate` — AI content generation
- `PUT /newsletter/review` — Admin content update
- `POST /newsletter/approve` — Admin approval → triggers distribution
- `POST /newsletter/reject` — Reject with reason
- `POST /newsletter/distribute` — Email + PDF + LinkedIn auto-distribution
- `GET /newsletter/analytics` — Engagement tracking
- `GET /newsletter/current` — Current issue status
- `GET /newsletter/history` — Past issues
- `POST /newsletter/generate-pdf` — 4-page PDF generation
- `POST /newsletter/send-email` — Email campaign creation
- `POST /newsletter/linkedin-post` — LinkedIn auto-post

---

## v118 (March 2026)
### Newsletter System — Complete Implementation
- `/newsletter/preview` — 517L: Exact 4-page futuristic PDF design (per spec)
  - Page 1: Cover — Dark gradient, logo, issue number, headline box, featured inside list
  - Page 2: Executive Summary + Top Global Update (3 key takeaways, strategic implication)
  - Page 3: Regional Analysis (3-region grid + heatmap) + Sector Analysis + Top 5 Signals
  - Page 4: About Platform + GOSA methodology + CTA + contact details
  - Zoom controls (50%–100%), Download button
- `/newsletter/email` — 174L: Responsive HTML email template (mobile-optimised)
  - Branded header, hero headline, executive summary, regional grid, top 5 signals
  - PDF download CTA, Investment Analysis link, unsubscribe footer
- `/newsletter` — 534L: Enhanced dashboard with Full PDF + Email Preview links

### Platform Quality
- Footer added to /company-profiles
- 82 static pages generated (was 78)
- Total pages: 49 (includes newsletter/preview, newsletter/email, maintenance, admin/access)
