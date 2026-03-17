"""
GFM SUPER AGENT — Orchestration Layer
Routes intelligence requests to the appropriate specialist agent.
Runs as HTTP server on port 8080 when AGENT_SERVER_MODE=true.
"""
import os, sys, json, time, asyncio, hashlib
from datetime import datetime, timezone
from typing import Any, Optional

# Agent registry
AGENT_REGISTRY: dict[str, dict] = {
    "AGT-01": {"name": "Signal Detection Agent",     "module": "agt02_signal_detection",  "fic_cost": 0,  "capabilities": ["signal_scan", "news_parse"]},
    "AGT-02": {"name": "GFR Computation Agent",      "module": "agt03_gfr_compute",        "fic_cost": 0,  "capabilities": ["gfr_score", "tier_assign", "dimension_score"]},
    "AGT-03": {"name": "Country Profile Agent",      "module": "agt04_country_profile",    "fic_cost": 20, "capabilities": ["cegp", "economic_analysis"]},
    "AGT-04": {"name": "Market Brief Agent",         "module": "agt05_market_brief",       "fic_cost": 5,  "capabilities": ["mib", "sector_summary"]},
    "AGT-05": {"name": "Mission Planning Agent",     "module": "agt06_mission_planning",   "fic_cost": 30, "capabilities": ["pmp", "company_targeting", "mfs_score"]},
    "AGT-06": {"name": "Newsletter Agent",           "module": "agt07_newsletter",         "fic_cost": 0,  "capabilities": ["weekly_digest", "monthly_report"]},
    "AGT-07": {"name": "Forecast Agent",             "module": "agt08_forecast",           "fic_cost": 0,  "capabilities": ["fdi_forecast", "bayesian_var", "prophet"]},
    "AGT-08": {"name": "Scenario Agent",             "module": "agt09_scenario",           "fic_cost": 0,  "capabilities": ["monte_carlo", "scenario_build"]},
    "AGT-09": {"name": "Enrichment Agent",           "module": "agt10_enrichment",         "fic_cost": 0,  "capabilities": ["waterfall_enrich", "z3_verify", "provenance"]},
    "AGT-10": {"name": "Translation Agent",          "module": "agt11_translation",        "fic_cost": 0,  "capabilities": ["translate", "localize"]},
    "AGT-11": {"name": "Sanctions Agent",            "module": "agt12_sanctions",          "fic_cost": 0,  "capabilities": ["ofac_check", "un_sanctions"]},
    "AGT-12": {"name": "Company Intel Agent",        "module": "agt13_company_intel",      "fic_cost": 5,  "capabilities": ["cic_profile", "ims_score", "footprint"]},
    "AGT-13": {"name": "Corridor Analysis Agent",    "module": "agt14_corridor",           "fic_cost": 0,  "capabilities": ["bilateral_analysis", "flow_detection"]},
    "AGT-14": {"name": "Publication Agent",          "module": "agt15_publication",        "fic_cost": 0,  "capabilities": ["pdf_compile", "chart_render", "publish"]},
    "AGT-15": {"name": "Alert Agent",                "module": "agt16_alert",              "fic_cost": 0,  "capabilities": ["threshold_check", "notify"]},
}

INTENT_MAP: dict[str, str] = {
    "signal":    "AGT-01", "detect":     "AGT-01", "news":      "AGT-01",
    "gfr":       "AGT-02", "ranking":    "AGT-02", "score":     "AGT-02",
    "country":   "AGT-03", "profile":    "AGT-03", "economy":   "AGT-03",
    "brief":     "AGT-04", "market":     "AGT-04", "sector":    "AGT-04",
    "mission":   "AGT-05", "target":     "AGT-05", "company":   "AGT-05",
    "newsletter":"AGT-06", "digest":     "AGT-06", "weekly":    "AGT-06",
    "forecast":  "AGT-07", "predict":    "AGT-07", "project":   "AGT-07",
    "scenario":  "AGT-08", "monte":      "AGT-08", "simulate":  "AGT-08",
    "enrich":    "AGT-09", "verify":     "AGT-09", "provenance":"AGT-09",
    "translate": "AGT-10", "language":   "AGT-10",
    "sanctions": "AGT-11", "ofac":       "AGT-11",
    "corridor":  "AGT-13", "bilateral":  "AGT-13",
    "alert":     "AGT-15", "notify":     "AGT-15",
}

def route_intent(query: str) -> str:
    """Route query to appropriate agent in <1ms."""
    q_lower = query.lower()
    for keyword, agent_id in INTENT_MAP.items():
        if keyword in q_lower:
            return agent_id
    return "AGT-03"  # Default: country profile

def run_agent(agent_id: str, payload: dict) -> dict:
    """Simulate agent execution with provenance."""
    agent = AGENT_REGISTRY.get(agent_id, {})
    start = time.time()
    
    # Generate reference code
    ts  = datetime.now(timezone.utc)
    ref = f"AGT-{agent_id}-{ts.strftime('%Y%m%d-%H%M%S')}-{hashlib.sha256(json.dumps(payload).encode()).hexdigest()[:8].upper()}"
    
    result = {
        "agent":       agent_id,
        "agent_name":  agent.get("name", "Unknown"),
        "reference":   ref,
        "payload":     payload,
        "result":      {
            "status":    "completed",
            "capability":agent.get("capabilities",["unknown"])[0],
            "data":      {"note": f"Agent {agent_id} executed successfully"},
        },
        "provenance": {
            "agent":      agent_id,
            "hash":       f"sha256:{hashlib.sha256(ref.encode()).hexdigest()[:16]}",
            "executed_at":ts.isoformat(),
            "latency_ms": round((time.time()-start)*1000, 2),
        },
        "fic_cost":    agent.get("fic_cost", 0),
    }
    return result

def http_server():
    """Simple HTTP server for agent API."""
    import http.server, json as jsonlib
    class AgentHandler(http.server.BaseHTTPRequestHandler):
        def log_message(self, fmt, *args): pass  # Suppress default logging
        def do_GET(self):
            if self.path == '/health':
                self.respond(200,{"status":"ok","agents":len(AGENT_REGISTRY),"version":"3.0.0"})
            elif self.path == '/agents':
                self.respond(200,{"agents":list(AGENT_REGISTRY.values()),"total":len(AGENT_REGISTRY)})
            else:
                self.respond(404,{"error":"Not found"})
        def do_POST(self):
            length = int(self.headers.get('Content-Length',0))
            body   = jsonlib.loads(self.rfile.read(length) or b'{}')
            if self.path == '/route':
                agent_id = route_intent(body.get('query',''))
                result   = run_agent(agent_id, body)
                self.respond(200, result)
            elif self.path.startswith('/agents/'):
                agent_id = self.path.split('/')[-1]
                result   = run_agent(agent_id, body)
                self.respond(200, result)
            else:
                self.respond(404,{"error":"Not found"})
        def respond(self, code, data):
            self.send_response(code)
            self.send_header('Content-Type','application/json')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            self.wfile.write(jsonlib.dumps(data).encode())

    port = int(os.getenv('AGENT_PORT','8080'))
    print(f"[SuperAgent] HTTP server starting on port {port}")
    print(f"[SuperAgent] {len(AGENT_REGISTRY)} agents registered")
    server = http.server.HTTPServer(('0.0.0.0', port), AgentHandler)
    server.serve_forever()

if __name__ == '__main__':
    if os.getenv('AGENT_SERVER_MODE','false').lower() == 'true':
        http_server()
    else:
        # Demo mode
        print("GFM Super Agent — Demo Mode")
        test_queries = [
            "Run signal detection for UAE",
            "Compute GFR scores Q1 2026",
            "Generate country profile for India",
            "Run Monte Carlo scenario for Saudi Arabia",
        ]
        for q in test_queries:
            agent_id = route_intent(q)
            result   = run_agent(agent_id, {"query":q})
            print(f"  [{agent_id}] {result['agent_name']} → {result['reference']} ({result['provenance']['latency_ms']}ms)")
