# Contributing to Global FDI Monitor

## Development Setup

```bash
git clone https://github.com/Masaadany/Global-FDI-Monitor
cd Global-FDI-Monitor
docker compose up -d db redis
node DEPLOYMENT/migrate.js
cd apps/api && npm install && npm start &
cd apps/web && npm install && npm run dev
```

## Project Structure

```
apps/
  web/          Next.js 14 frontend
    src/app/    Page routes (35 pages)
    src/components/  Shared components (11)
    src/lib/    Utilities (export, i18n, seo, useRealTimeSignals)
  api/
    server.js   Express-style Node.js API (~50 routes)
    email.js    Email notification system
    openapi.yaml  API documentation
  agents/
    super_agent.py        One super agent (50 agents)
    agt02_*.py … agt50_*  15 agent module files
  pipeline/
    collectors/           14 data collectors
    enrichment.py         Waterfall + Z3 + provenance
    reference_data.py     215 economies + 21 sectors + 20 sources
    tests/                42 tests
DEPLOYMENT/
  migrate.js              PostgreSQL schema + seed data
  azure_api_deploy.sh     API deployment script
  azure_pipeline_jobs.sh  Container Job scheduler
  bicep/                  Infrastructure as Code
  SETUP_GUIDE.md
```

## Adding a New Page

1. Create `apps/web/src/app/[route]/page.tsx`
2. Add to nav in `apps/web/src/app/layout.tsx`
3. Add to `apps/web/src/app/sitemap.ts`
4. Add to `GlobalSearch` in `apps/web/src/components/GlobalSearch.tsx`

## Adding a New API Endpoint

```js
// In apps/api/server.js
ROUTES['GET /api/v1/your-endpoint'] = async(req,res) => {
  const data = await dbQ('SELECT ...', [], fallbackData);
  ok(res, { your_data: data });
};
```

## Adding a New Agent

1. Create `apps/agents/agt[N]_name.py` with `class YourAgent` and `async def run(self, context)` 
2. Register in `super_agent.py` `AGENT_REGISTRY`

## Adding a New Collector

1. Create `apps/pipeline/collectors/your_collector.py` with `async def collect(client)` returning `list[dict]`
2. Import and add to `MasterPipeline.run()` in `master_pipeline.py`
3. Add to `COLLECTOR_NAMES` list

## Code Standards

- **TypeScript**: Strict mode, no `any` except explicit
- **Python**: Type hints, docstrings, `asyncio`
- **Tests**: Every new feature needs a test in `apps/pipeline/tests/`
- **Provenance**: Every data point must use `make_provenance()` from `enrichment.py`
- **Reference codes**: Always use `ReferenceCodeSystem.generate()` for output IDs

## Running Tests

```bash
python -m pytest apps/pipeline/tests/ -v
cd apps/web && npm run build
```

All 42 tests must pass before merging.
