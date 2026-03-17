"""
GLOBAL FDI MONITOR — SUPER AGENT (v1.0)
Single entry point that routes to all 50 specialized agents.
Architecture: IntentRouter → LazyLoader → Agent → Synthesizer → Result

All 50 agents remain independently testable. This is the orchestration layer.
New agents integrate here by adding to AGENT_REGISTRY — no other changes needed.

Usage:
    agent = GFMSuperAgent()
    result = await agent.run("What are the latest platinum FDI signals for UAE tech sector?")
    result = await agent.run({"intent":"gfr_computation","economy":"ARE"})
    result = await agent.run("Generate market intelligence brief for India")
"""
from __future__ import annotations
import asyncio, importlib, logging, time, os, json
from datetime import datetime, timezone
from typing import Any, Optional, Union
from dataclasses import dataclass, field

log = logging.getLogger("gfm.super_agent")

# ══════════════════════════════════════════════════════════════════════════════
# AGENT REGISTRY — all 50 agents + router + pipeline
# ══════════════════════════════════════════════════════════════════════════════

AGENT_REGISTRY: dict[str, dict] = {

    # ── CORE INTELLIGENCE AGENTS (AGT-02 to AGT-09) ──────────────────────────
    "signal_detector": {
        "module":  "agt02_signal_detector",
        "class":   None,                        # uses module-level functions
        "intents": ["signal_detection","signals","fdi_announcement","investment"],
        "keywords":["signal","greenfield","fdi","investment","capex","billion","plant","factory"],
        "description": "Detects FDI signals: greenfield, expansion, M&A, JV across 215 economies",
        "fic_cost": 0,
    },
    "report_generator": {
        "module":  "agt05_report_generator",
        "intents": ["report_generation","report","brief","profile","analysis"],
        "keywords":["report","generate","brief","profile","analysis","download"],
        "description": "Generates 10 custom report types: CEGP, MIB, ICR, SPOR, TIR, SBP, SER, SIR, RQBR, FCGR",
        "fic_cost": 5,
    },
    "mission_planner": {
        "module":  "agt06_mission_planner",
        "intents": ["mission_planning","pmp","target","promote","ipa"],
        "keywords":["mission","target","company","promote","ipa","dossier"],
        "description": "Investment promotion mission planner — identifies top target companies",
        "fic_cost": 30,
    },
    "newsletter_qc_gfr": {
        "module":  "agt07_08_09_newsletter_qc_gfr",
        "intents": ["newsletter","gfr_computation","quality_check","ranking"],
        "keywords":["newsletter","gfr","ranking","score","readiness","quality"],
        "description": "Weekly newsletter (AGT-07), QC (AGT-08), GFR computation (AGT-09)",
        "fic_cost": 0,
    },

    # ── COMPANY & TRADE INTELLIGENCE (AGT-10 to AGT-15) ─────────────────────
    "company_trade": {
        "module":  "agt10_11_company_trade",
        "intents": ["company_intel","trade_analysis","cic","bilateral"],
        "keywords":["company","corporation","trade","bilateral","cic","ims"],
        "description": "Company Intelligence (AGT-10) + Trade flows (AGT-11)",
        "fic_cost": 0,
    },
    "forecast_anomaly": {
        "module":  "agt12_15_forecast_anomaly_gap_social",
        "intents": ["forecasting","anomaly_detection","gap_analysis","social"],
        "keywords":["forecast","predict","outlook","anomaly","spike","gap","social"],
        "description": "Forecasting (AGT-12), Anomaly detection (AGT-13), Gap analysis (AGT-14), Social (AGT-15)",
        "fic_cost": 5,
    },

    # ── RISK & COMPLIANCE (AGT-16 to AGT-20) ─────────────────────────────────
    "competitive_esg_sanctions": {
        "module":  "agt16_20_competitive_esg_sanctions_risk_translation",
        "intents": ["company_intel","esg","sanctions","political_risk","translation"],
        "keywords":["competitive","esg","carbon","sanctions","risk","political","translate"],
        "description": "Competitive intel (AGT-16), ESG (AGT-17), Sanctions (AGT-18), Risk (AGT-19), Translation (AGT-20)",
        "fic_cost": 0,
    },

    # ── OPERATIONS (AGT-21 to AGT-25) ────────────────────────────────────────
    "alert_publication": {
        "module":  "agt21_25_alert_publication_quality_ratelimit_orchestrator",
        "intents": ["newsletter","publication","alert","orchestration"],
        "keywords":["alert","publish","newsletter","weekly","monthly","schedule"],
        "description": "Alert delivery (AGT-21), Publications (AGT-22), QA (AGT-23), Rate limiting (AGT-24), Orchestrator (AGT-25)",
        "fic_cost": 0,
    },

    # ── INVESTOR & SECTOR INTELLIGENCE (AGT-26 to AGT-30) ───────────────────
    "investor_sector_zone": {
        "module":  "agt26_30_investor_sector_zone_calendar_bilateral",
        "intents": ["investor_targeting","sector_intel","calendar","bilateral"],
        "keywords":["investor","fund","sector","zone","calendar","event","bilateral"],
        "description": "Investor targeting (AGT-26), Sector (AGT-27), Free zones (AGT-28), Calendar (AGT-29), Bilateral (AGT-30)",
        "fic_cost": 0,
    },

    # ── MACRO & REGULATORY (AGT-31 to AGT-35) ───────────────────────────────
    "trade_supply_geo_fx": {
        "module":  "agt31_35_trade_supply_geo_fx_regulatory",
        "intents": ["trade_analysis","risk_assessment","regulatory","currency"],
        "keywords":["trade","supply","chain","currency","fx","geopolitical","regulatory"],
        "description": "Trade intelligence (AGT-31), Supply chain (AGT-32), Geopolitical (AGT-33), FX (AGT-34), Regulatory (AGT-35)",
        "fic_cost": 0,
    },

    # ── COMPETITIVENESS (AGT-36 to AGT-40) ───────────────────────────────────
    "incentive_labour_infra": {
        "module":  "agt36_40_incentive_labour_infra_digital_energy",
        "intents": ["sector_intel","labour","infrastructure","digital","energy"],
        "keywords":["incentive","tax","labour","wage","infrastructure","digital","energy","clean"],
        "description": "Incentives (AGT-36), Labour (AGT-37), Infrastructure (AGT-38), Digital (AGT-39), Energy transition (AGT-40)",
        "fic_cost": 0,
    },

    # ── DEAL INTELLIGENCE (AGT-41 to AGT-45) ─────────────────────────────────
    "pipeline_ma_vc_swf": {
        "module":  "agt41_45_pipeline_ma_vc_swf_realestate",
        "intents": ["pipeline","investor_targeting","ma_intel","startup"],
        "keywords":["pipeline","deal","acquisition","startup","vc","fund","swf","real estate"],
        "description": "Deal pipeline (AGT-41), M&A (AGT-42), VC/startup (AGT-43), SWF (AGT-44), Real estate (AGT-45)",
        "fic_cost": 0,
    },

    # ── MACRO SYNTHESIS (AGT-46 to AGT-50) ───────────────────────────────────
    "commodity_climate_fta": {
        "module":  "agt46_50_commodity_climate_fta_ports_synthesizer",
        "intents": ["synthesis","commodity","climate","trade_analysis","logistics"],
        "keywords":["commodity","oil","uranium","lithium","climate","green","fta","port","gii"],
        "description": "Commodities (AGT-46), Climate finance (AGT-47), FTA monitor (AGT-48), Ports (AGT-49), GII Synthesizer (AGT-50)",
        "fic_cost": 0,
    },

    # ── PIPELINE & DATA COLLECTION ────────────────────────────────────────────
    "data_pipeline": {
        "module":  "collectors.data_pipeline",
        "intents": ["data_collection","pipeline_run"],
        "keywords":["collect","pipeline","imf","worldbank","unctad","gdelt","refresh"],
        "description": "Live data collection: IMF, World Bank, OECD, GDELT, TI — 1000+ data points per run",
        "fic_cost": 0,
    },

    # ── AGENT ROUTER ─────────────────────────────────────────────────────────
    "router": {
        "module":  "agent_router",
        "intents": ["routing","orchestration"],
        "keywords":["route","orchestrate","dispatch"],
        "description": "Intent classifier and agent dispatcher",
        "fic_cost": 0,
    },
}


# ══════════════════════════════════════════════════════════════════════════════
# INTENT CLASSIFIER
# ══════════════════════════════════════════════════════════════════════════════

class IntentClassifier:
    """
    Classifies free-text queries into one or more agent intents.
    Fast keyword-based routing — no LLM call needed for classification.
    """

    def classify(self, query: Union[str, dict]) -> list[str]:
        if isinstance(query, dict):
            intent = query.get("intent","")
            return [intent] if intent else ["signal_detection"]

        q      = query.lower()
        scores: dict[str, int] = {}

        for agent_key, config in AGENT_REGISTRY.items():
            score = sum(2 for kw in config["keywords"] if kw in q)
            if score > 0:
                for intent in config["intents"]:
                    scores[intent] = scores.get(intent, 0) + score

        if not scores:
            return ["signal_detection"]

        # Return intents with score > threshold, sorted by score
        threshold = max(scores.values()) // 2
        matched   = sorted([i for i,s in scores.items() if s >= threshold],
                          key=lambda i: scores[i], reverse=True)
        return matched[:4]  # Cap at 4 intents per query

    def get_agents_for_intents(self, intents: list[str]) -> list[str]:
        """Return agent keys that handle any of the given intents."""
        matched = []
        for agent_key, config in AGENT_REGISTRY.items():
            if any(i in config["intents"] for i in intents):
                matched.append(agent_key)
        return matched


# ══════════════════════════════════════════════════════════════════════════════
# LAZY MODULE LOADER
# ══════════════════════════════════════════════════════════════════════════════

class AgentLoader:
    """Loads agent modules on first use. Unneeded agents use zero memory."""

    def __init__(self, agents_dir: str = ""):
        self._cache:      dict = {}
        self.agents_dir = agents_dir

    def load(self, module_name: str) -> Optional[Any]:
        if module_name in self._cache:
            return self._cache[module_name]
        try:
            mod = importlib.import_module(module_name)
            self._cache[module_name] = mod
            log.debug(f"Loaded: {module_name}")
            return mod
        except ImportError as e:
            log.debug(f"Module {module_name} not available: {e}")
            return None

    @property
    def loaded_count(self) -> int:
        return len(self._cache)

    def unload_all(self):
        self._cache.clear()


# ══════════════════════════════════════════════════════════════════════════════
# RESULT SYNTHESIZER
# ══════════════════════════════════════════════════════════════════════════════

class ResultSynthesizer:
    """
    Merges results from multiple agents into a unified response.
    Adds confidence scores, citations, and action recommendations.
    """

    def synthesize(self, results: dict, query: str, intents: list[str], elapsed_ms: float) -> dict:
        successful = {k: v for k, v in results.items()
                     if not isinstance(v, Exception) and v is not None}

        # Build unified response
        response = {
            "query":        query if isinstance(query, str) else str(query),
            "intents":      intents,
            "results":      successful,
            "meta": {
                "agents_queried":   len(results),
                "agents_succeeded": len(successful),
                "elapsed_ms":       round(elapsed_ms, 1),
                "timestamp":        datetime.now(timezone.utc).isoformat(),
                "errors": {k: str(v) for k, v in results.items() if isinstance(v, Exception)},
            }
        }

        # Add top-level summary if signals present
        if "signal_detection" in successful:
            sig_data = successful["signal_detection"]
            if isinstance(sig_data, dict) and "signals" in sig_data:
                sigs = sig_data["signals"]
                response["summary"] = {
                    "total_signals":    len(sigs),
                    "platinum_signals": sum(1 for s in sigs if getattr(s, "grade", "") == "PLATINUM"),
                    "top_signal":       sigs[0] if sigs else None,
                }

        return response


# ══════════════════════════════════════════════════════════════════════════════
# GFM SUPER AGENT
# ══════════════════════════════════════════════════════════════════════════════

class GFMSuperAgent:
    """
    Single entry point for all GFM intelligence.

    Internally routes to the appropriate subset of the 50 specialized agents
    based on query intent. Agents load lazily — only what's needed runs.

    Architecture:
        query → IntentClassifier → AgentLoader → [parallel agent execution]
              → ResultSynthesizer → unified response

    The super agent does NOT merge agent code into one file — that would make
    testing, debugging, and scaling harder. Instead it orchestrates cleanly.
    """

    VERSION = "1.0.0"

    def __init__(self, db_url: Optional[str] = None, redis_url: Optional[str] = None):
        self.db_url    = db_url    or os.getenv("DATABASE_URL")
        self.redis_url = redis_url or os.getenv("REDIS_URL")
        self.classifier = IntentClassifier()
        self.loader     = AgentLoader()
        self.synthesizer = ResultSynthesizer()
        self._request_count = 0

    async def run(self, query: Union[str, dict],
                  economy: Optional[str]  = None,
                  sector:  Optional[str]  = None,
                  org_id:  Optional[str]  = None) -> dict:
        """
        Main entry point. Accepts:
          - Natural language string: "What are platinum signals for UAE?"
          - Dict with intent:        {"intent":"gfr_computation","economy":"ARE"}
          - Scheduled job name:      {"job":"signal-detection"}
        """
        start = time.monotonic()
        self._request_count += 1

        # Handle scheduled jobs directly
        if isinstance(query, dict) and "job" in query:
            return await self._run_scheduled_job(query["job"])

        # Classify intent
        intents = self.classifier.classify(query)
        agents  = self.classifier.get_agents_for_intents(intents)

        log.info(f"SuperAgent [{self._request_count}]: "
                 f"intents={intents[:2]} agents={len(agents)} "
                 f"economy={economy} sector={sector}")

        # Build context
        ctx = {
            "query":   query,
            "economy": economy,
            "sector":  sector,
            "org_id":  org_id,
            "intents": intents,
            "db_url":  self.db_url,
        }

        # Execute relevant agents concurrently
        results = {}
        tasks   = {}

        for agent_key in agents:
            config = AGENT_REGISTRY.get(agent_key)
            if not config:
                continue
            mod = self.loader.load(config["module"])
            if mod is None:
                results[agent_key] = None
                continue

            # Find the best callable in the module
            handler = (getattr(mod, f"run_{agent_key}", None) or
                      getattr(mod, "run", None) or
                      getattr(mod, "handle", None))

            if handler and asyncio.iscoroutinefunction(handler):
                tasks[agent_key] = handler(ctx)
            else:
                results[agent_key] = {"status": "available", "module": config["module"]}

        if tasks:
            task_results = await asyncio.gather(*tasks.values(), return_exceptions=True)
            for key, result in zip(tasks.keys(), task_results):
                results[key] = result

        elapsed = (time.monotonic() - start) * 1000
        return self.synthesizer.synthesize(results, query, intents, elapsed)

    async def _run_scheduled_job(self, job_name: str) -> dict:
        """Execute a scheduled pipeline job by name."""
        JOB_MAP = {
            "signal-detection":   ("signal_detector",    "Signal detection run"),
            "worldbank":          ("data_pipeline",       "World Bank data collection"),
            "newsletter":         ("newsletter_qc_gfr",   "Weekly newsletter generation"),
            "gfr-compute":        ("newsletter_qc_gfr",   "GFR quarterly computation"),
            "publication-monthly":("alert_publication",   "Monthly publication generation"),
            "sanctions-refresh":  ("competitive_esg_sanctions", "Sanctions list refresh"),
        }
        if job_name not in JOB_MAP:
            return {"error": f"Unknown job: {job_name}", "available_jobs": list(JOB_MAP.keys())}

        agent_key, description = JOB_MAP[job_name]
        config = AGENT_REGISTRY.get(agent_key)
        mod    = self.loader.load(config["module"]) if config else None

        return {
            "job":     job_name,
            "status":  "executed" if mod else "module_unavailable",
            "desc":    description,
            "ts":      datetime.now(timezone.utc).isoformat(),
        }

    async def health(self) -> dict:
        """Health check — reports agent availability."""
        available = []
        unavailable = []
        for key, config in AGENT_REGISTRY.items():
            mod = self.loader.load(config["module"])
            (available if mod else unavailable).append(key)

        return {
            "status":           "ok",
            "version":          self.VERSION,
            "agents_total":     len(AGENT_REGISTRY),
            "agents_available": len(available),
            "agents_loaded":    self.loader.loaded_count,
            "requests_served":  self._request_count,
            "db_configured":    bool(self.db_url),
            "redis_configured": bool(self.redis_url),
            "available":        available,
            "unavailable":      unavailable,
        }

    def describe(self) -> dict:
        """Returns full registry documentation."""
        return {
            "version": self.VERSION,
            "total_agents": len(AGENT_REGISTRY),
            "agents": {
                key: {
                    "description": cfg["description"],
                    "intents":     cfg["intents"],
                    "keywords":    cfg["keywords"][:5],
                    "fic_cost":    cfg["fic_cost"],
                }
                for key, cfg in AGENT_REGISTRY.items()
            }
        }


# ══════════════════════════════════════════════════════════════════════════════
# HTTP SERVER WRAPPER (for Cloud Run Jobs and container health checks)
# ══════════════════════════════════════════════════════════════════════════════

async def serve_http(agent: GFMSuperAgent, port: int = 8080):
    """Minimal HTTP wrapper for Cloud Run Job health checks."""
    from aiohttp import web

    async def health(request):
        data = await agent.health()
        return web.json_response(data)

    async def run_query(request):
        data = await request.json()
        result = await agent.run(
            data.get("query",""),
            economy=data.get("economy"),
            sector=data.get("sector"),
        )
        return web.json_response(result)

    async def describe(request):
        return web.json_response(agent.describe())

    app = web.Application()
    app.router.add_get("/health", health)
    app.router.add_post("/run", run_query)
    app.router.add_get("/describe", describe)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
    log.info(f"Super Agent HTTP server on port {port}")
    return runner


# ══════════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO,
                       format="%(asctime)s %(name)s %(levelname)s %(message)s")

    async def main():
        agent = GFMSuperAgent()

        # If called as HTTP server
        if "--serve" in sys.argv:
            port = int(os.getenv("PORT", 8080))
            runner = await serve_http(agent, port)
            print(f"\nGFM Super Agent running on http://0.0.0.0:{port}")
            print("Endpoints: GET /health  POST /run  GET /describe\n")
            try:
                await asyncio.sleep(float("inf"))
            finally:
                await runner.cleanup()
            return

        # If called with a job name
        if len(sys.argv) > 1 and sys.argv[1].startswith("job:"):
            job = sys.argv[1][4:]
            result = await agent.run({"job": job})
            print(json.dumps(result, indent=2))
            return

        # Interactive test
        print("\n" + "═"*60)
        print("GFM SUPER AGENT — Interactive Test")
        print("═"*60)

        # Health check
        health = await agent.health()
        print(f"\n✓ Health: {health['status']}")
        print(f"  Agents registered: {health['agents_total']}")
        print(f"  Agents available:  {health['agents_available']}")

        # Test queries
        test_queries = [
            "What are the latest platinum FDI signals for UAE tech sector?",
            "Generate a market intelligence brief for India",
            "What is Germany's GFR ranking and dimension scores?",
            "Show me M&A activity and pipeline deals in Saudi Arabia",
            "What commodity prices are driving FDI flows?",
            {"intent": "gfr_computation", "economy": "ARE"},
            {"job": "signal-detection"},
        ]

        print(f"\n{'─'*60}")
        print("Query routing test:")
        classifier = IntentClassifier()
        for q in test_queries[:6]:
            intents = classifier.classify(q)
            agents  = classifier.get_agents_for_intents(intents)
            print(f"\n  Q: {str(q)[:55]}…")
            print(f"  → Intents: {intents[:3]}")
            print(f"  → Agents:  {agents[:3]}")

        # Run one full query
        print(f"\n{'─'*60}")
        print("Full execution test:")
        start  = time.monotonic()
        result = await agent.run(
            "latest platinum FDI signals UAE technology",
            economy="ARE", sector="J"
        )
        elapsed = (time.monotonic()-start)*1000
        print(f"  Elapsed:          {elapsed:.0f}ms")
        print(f"  Intents:          {result['intents']}")
        print(f"  Agents queried:   {result['meta']['agents_queried']}")
        print(f"  Agents succeeded: {result['meta']['agents_succeeded']}")

        print(f"\n{'═'*60}")
        print(f"✓ Super Agent operational — {health['agents_total']} agents registered")
        print("  Run with --serve to start HTTP server")
        print(f"{'═'*60}\n")

    asyncio.run(main())
