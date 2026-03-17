"""
GLOBAL FDI MONITOR — AGENT ROUTER
Efficient orchestration: routes requests to the right agent, shares memory,
loads modules only when needed. Replaces 50 separate agent invocations with
one entry point while keeping agents independently testable and maintainable.

Architecture:
  query → IntentRouter → [relevant agents] → Synthesizer → result

This is better than a single 5,000-line mega-class because:
  - Each agent file remains independently testable
  - Failed agents don't crash unrelated functionality
  - Memory profiling can identify which agent uses the most resources
  - New agents add without modifying core routing logic
"""
from __future__ import annotations
import asyncio, time, logging, os
from dataclasses import dataclass, field
from typing import Any, Optional
from enum import Enum

log = logging.getLogger("gfm.router")


# ── INTENT TAXONOMY ──────────────────────────────────────────────────────────

class Intent(str, Enum):
    SIGNAL_DETECTION    = "signal_detection"    # AGT-02, AGT-15
    REPORT_GENERATION   = "report_generation"   # AGT-05
    MISSION_PLANNING    = "mission_planning"    # AGT-06, AGT-14, AGT-26
    GFR_COMPUTATION     = "gfr_computation"     # AGT-09
    FORECASTING         = "forecasting"         # AGT-12, AGT-13
    COMPANY_INTEL       = "company_intel"       # AGT-10, AGT-16, AGT-17, AGT-18
    TRADE_ANALYSIS      = "trade_analysis"      # AGT-11, AGT-31, AGT-48
    RISK_ASSESSMENT     = "risk_assessment"     # AGT-19, AGT-33, AGT-34, AGT-35
    SECTOR_INTEL        = "sector_intel"        # AGT-27, AGT-36, AGT-37, AGT-38
    INVESTOR_TARGETING  = "investor_targeting"  # AGT-26, AGT-44
    NEWSLETTER          = "newsletter"          # AGT-07, AGT-08
    CALENDAR            = "calendar"            # AGT-29
    PIPELINE            = "pipeline"            # AGT-41, AGT-42, AGT-43
    SYNTHESIS           = "synthesis"           # AGT-50

# Map intent → which agent modules to load (lazy import by name)
INTENT_AGENT_MAP: dict[Intent, list[str]] = {
    Intent.SIGNAL_DETECTION:   ["agt02_signal_detector", "agt15"],
    Intent.REPORT_GENERATION:  ["agt05_report_generator"],
    Intent.MISSION_PLANNING:   ["agt06_mission_planner", "agt14", "agt26_investor"],
    Intent.GFR_COMPUTATION:    ["agt07_08_09_newsletter_qc_gfr"],
    Intent.FORECASTING:        ["agt12_15_forecast_anomaly_gap_social"],
    Intent.COMPANY_INTEL:      ["agt10_11_company_trade", "agt16_20"],
    Intent.TRADE_ANALYSIS:     ["agt10_11_company_trade", "agt31_35"],
    Intent.RISK_ASSESSMENT:    ["agt31_35_trade_supply_geo_fx_regulatory"],
    Intent.SECTOR_INTEL:       ["agt36_40_incentive_labour_infra_digital_energy"],
    Intent.INVESTOR_TARGETING: ["agt26_30_investor_sector_zone_calendar_bilateral"],
    Intent.NEWSLETTER:         ["agt07_08_09_newsletter_qc_gfr"],
    Intent.CALENDAR:           ["agt26_30_investor_sector_zone_calendar_bilateral"],
    Intent.PIPELINE:           ["agt41_45_pipeline_ma_vc_swf_realestate"],
    Intent.SYNTHESIS:          ["agt46_50_commodity_climate_fta_ports_synthesizer"],
}

# ── SHARED CONTEXT ────────────────────────────────────────────────────────────

@dataclass
class RequestContext:
    """Shared context passed to every agent — avoids re-querying the same data."""
    query_id:       str
    org_id:         str
    user_id:        str
    intents:        list[Intent]
    # Populated progressively as agents run
    economies:      list[str]         = field(default_factory=list)
    sectors:        list[str]         = field(default_factory=list)
    company_names:  list[str]         = field(default_factory=list)
    date_range:     Optional[tuple]   = None
    # Cached DB results (shared across agents in the same request)
    _cache:         dict              = field(default_factory=dict)

    def cache_get(self, key: str) -> Any:
        return self._cache.get(key)

    def cache_set(self, key: str, value: Any) -> None:
        self._cache[key] = value


# ── INTENT ROUTER ─────────────────────────────────────────────────────────────

class IntentRouter:
    """
    Classifies a query into one or more Intents.
    Simple keyword rules — no LLM needed for routing, saves tokens.
    """

    KEYWORDS: dict[Intent, list[str]] = {
        Intent.SIGNAL_DETECTION:   ["signal","investment","announcement","greenfield","expansion"],
        Intent.REPORT_GENERATION:  ["report","generate","download","pdf","dossier"],
        Intent.MISSION_PLANNING:   ["mission","target","company","engage","promote"],
        Intent.GFR_COMPUTATION:    ["gfr","ranking","score","readiness","dimension"],
        Intent.FORECASTING:        ["forecast","predict","outlook","scenario","project"],
        Intent.COMPANY_INTEL:      ["company","corporation","cic","esg","sanctions"],
        Intent.TRADE_ANALYSIS:     ["trade","corridor","bilateral","export","import","tariff"],
        Intent.RISK_ASSESSMENT:    ["risk","political","currency","fx","geopolitical","regulatory"],
        Intent.SECTOR_INTEL:       ["sector","industry","incentive","labour","infrastructure"],
        Intent.INVESTOR_TARGETING: ["investor","fund","swf","vc","pe","target investor"],
        Intent.NEWSLETTER:         ["newsletter","weekly","digest","publication"],
        Intent.CALENDAR:           ["calendar","event","release","meeting","summit"],
        Intent.PIPELINE:           ["pipeline","deal","m&a","acquisition","startup"],
        Intent.SYNTHESIS:          ["synthesis","gii","composite","overall","summary"],
    }

    def classify(self, query: str, economy: Optional[str] = None) -> list[Intent]:
        q = query.lower()
        matched: list[Intent] = []

        for intent, keywords in self.KEYWORDS.items():
            if any(kw in q for kw in keywords):
                matched.append(intent)

        # Defaults when query is ambiguous
        if not matched:
            matched = [Intent.SIGNAL_DETECTION]

        # Always include synthesis for complex multi-intent queries
        if len(matched) >= 3 and Intent.SYNTHESIS not in matched:
            matched.append(Intent.SYNTHESIS)

        return matched


# ── AGENT LOADER ──────────────────────────────────────────────────────────────

class AgentLoader:
    """Lazy-loads agent modules on first use. Unloaded agents use zero memory."""

    def __init__(self):
        self._loaded: dict = {}

    def load(self, module_name: str) -> Any:
        if module_name not in self._loaded:
            try:
                import importlib
                mod = importlib.import_module(f"apps.agents.{module_name}")
                self._loaded[module_name] = mod
                log.debug(f"Loaded agent module: {module_name}")
            except ImportError as e:
                log.warning(f"Could not load agent module {module_name}: {e}")
                return None
        return self._loaded[module_name]

    def unload(self, module_name: str) -> None:
        """Release module from memory (useful for background job cleanup)."""
        if module_name in self._loaded:
            del self._loaded[module_name]

    @property
    def loaded_count(self) -> int:
        return len(self._loaded)


# ── AGENT ROUTER ──────────────────────────────────────────────────────────────

class AgentRouter:
    """
    Main entry point for all agent orchestration.
    Replaces 50 separate agent instantiations with a single router.

    Usage:
        router = AgentRouter()
        result = await router.process({
            "query": "What are the latest FDI signals for UAE tech sector?",
            "economy": "ARE",
            "sector": "J",
            "org_id": "org-123",
            "user_id": "user-456",
        })
    """

    def __init__(self, db_pool=None, redis=None):
        self.db_pool = db_pool
        self.redis   = redis
        self.router  = IntentRouter()
        self.loader  = AgentLoader()

    async def process(self, request: dict) -> dict:
        start = time.monotonic()
        query_id = f"Q-{int(time.time())}-{id(request) % 10000:04d}"

        # Build context
        intents = self.router.classify(
            request.get("query",""),
            request.get("economy")
        )
        ctx = RequestContext(
            query_id   = query_id,
            org_id     = request.get("org_id",""),
            user_id    = request.get("user_id",""),
            intents    = intents,
            economies  = ([request["economy"]] if "economy" in request else []),
            sectors    = ([request["sector"]]  if "sector"  in request else []),
        )

        log.info(f"Router [{query_id}]: {len(intents)} intent(s) → {[i.value for i in intents]}")

        # Execute agents for each intent
        results: dict[str, Any] = {"query_id": query_id, "intents": [i.value for i in intents]}
        errors:  list[str] = []

        for intent in intents:
            agent_modules = INTENT_AGENT_MAP.get(intent, [])
            for module_name in agent_modules:
                mod = self.loader.load(module_name)
                if mod is None:
                    errors.append(f"{module_name} not available")
                    continue
                try:
                    handler = getattr(mod, f"handle_{intent.value}", None)
                    if handler:
                        results[intent.value] = await handler(ctx)
                    # If no specific handler, note intent was recognised
                    else:
                        results[intent.value] = {"status": "recognised", "module": module_name}
                except Exception as e:
                    log.error(f"Agent {module_name} error: {e}")
                    errors.append(f"{module_name}: {str(e)[:100]}")

        elapsed = round((time.monotonic() - start) * 1000, 1)
        results["_meta"] = {
            "elapsed_ms":     elapsed,
            "modules_loaded": self.loader.loaded_count,
            "errors":         errors,
        }
        return results


# ── SCHEDULED JOB RUNNER ──────────────────────────────────────────────────────

class ScheduledJobRunner:
    """
    Runs pipeline jobs triggered by Cloud Scheduler.
    Each job maps to a specific set of agents.
    """

    def __init__(self, router: AgentRouter):
        self.router = router

    JOB_QUERIES: dict[str, dict] = {
        "signal-detection":   {"query": "detect new investment signals", "economy": "all"},
        "worldbank":          {"query": "collect worldbank economic data"},
        "newsletter":         {"query": "generate weekly newsletter digest"},
        "gfr-compute":        {"query": "compute gfr ranking scores"},
        "publication-monthly":{"query": "generate monthly publication report"},
        "sanctions-refresh":  {"query": "refresh sanctions screening lists"},
    }

    async def run(self, job_name: str) -> dict:
        if job_name not in self.JOB_QUERIES:
            return {"error": f"Unknown job: {job_name}"}
        req = {**self.JOB_QUERIES[job_name], "org_id": "internal", "user_id": "scheduler"}
        log.info(f"ScheduledJobRunner: {job_name}")
        return await self.router.process(req)


# ── TEST ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    async def test():
        router   = AgentRouter()
        classifier = IntentRouter()

        tests = [
            ("What are the latest FDI signals for UAE tech sector?",       "ARE"),
            ("Generate a country profile report for India",                "IND"),
            ("What companies should we target for mission planning?",      "ARE"),
            ("What is the political risk and currency risk for Nigeria?",   "NGA"),
            ("Show me this week's newsletter digest",                      None),
            ("What is Germany's GFR score and ranking?",                   "DEU"),
        ]

        print("=== INTENT ROUTER TEST ===\n")
        for query, economy in tests:
            intents = classifier.classify(query, economy)
            print(f"  Query: {query[:50]}…")
            print(f"  Intents: {[i.value for i in intents]}\n")

        print("=== ROUTER PROCESS TEST ===\n")
        result = await router.process({
            "query":   "What are the latest platinum FDI signals for UAE tech sector?",
            "economy": "ARE",
            "sector":  "J",
            "org_id":  "org-test",
            "user_id": "user-test",
        })
        print(f"  Query ID:      {result['query_id']}")
        print(f"  Intents found: {result['intents']}")
        print(f"  Elapsed:       {result['_meta']['elapsed_ms']}ms")
        print(f"  Modules loaded:{result['_meta']['modules_loaded']}")
        if result['_meta']['errors']:
            print(f"  Errors:        {result['_meta']['errors']}")

    asyncio.run(test())