"""
GFM Super Agent — Orchestration Layer
HTTP server mode (port 8080) + CLI demo mode
Routes intents to 15 specialist agents, returns structured results with SHA-256 provenance.
"""
import sys, json, hashlib, time, importlib
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler

# ── Agent registry ────────────────────────────────────────────────────────
AGENT_REGISTRY = {
    'AGT-01': {'module':'agt02_signal_detection', 'name':'Signal Detection Agent',       'fic':0},
    'AGT-02': {'module':'agt03_gfr_compute',      'name':'GFR Computation Agent',        'fic':0},
    'AGT-03': {'module':'agt04_country_profile',  'name':'Country Profile Agent',        'fic':20},
    'AGT-04': {'module':'agt05_market_brief',     'name':'Market Brief Agent',           'fic':5},
    'AGT-05': {'module':'agt06_mission_planning', 'name':'Mission Planning Agent',       'fic':30},
    'AGT-06': {'module':'agt07_newsletter',       'name':'Newsletter Agent',             'fic':0},
    'AGT-07': {'module':'agt08_forecast',         'name':'Forecast Agent',               'fic':12},
    'AGT-08': {'module':'agt09_scenario',         'name':'Scenario Agent',               'fic':8},
    'AGT-09': {'module':'agt10_enrichment',       'name':'Enrichment Agent',             'fic':0},
    'AGT-10': {'module':'agt11_translation',      'name':'Translation Agent',            'fic':0},
    'AGT-11': {'module':'agt12_sanctions',        'name':'Sanctions Screening Agent',    'fic':0},
    'AGT-12': {'module':'agt13_company_intel',    'name':'Company Intelligence Agent',   'fic':5},
    'AGT-13': {'module':'agt14_corridor',         'name':'Corridor Intelligence Agent',  'fic':5},
    'AGT-14': {'module':'agt15_publication',      'name':'Publication Agent',            'fic':0},
    'AGT-15': {'module':'agt02_signal_detection', 'name':'Orchestration Agent',          'fic':0},
}

# ── Intent routing ────────────────────────────────────────────────────────
ROUTING_PATTERNS = [
    (['signal','detect','feed','live','stream'],              'AGT-01'),
    (['gfr','ranking','score','readiness','composite'],       'AGT-02'),
    (['country','profile','economy','iso3'],                  'AGT-03'),
    (['brief','market','summary','report','insight'],         'AGT-04'),
    (['mission','target','company','mfs','feasibility'],      'AGT-05'),
    (['newsletter','digest','weekly','compile'],              'AGT-06'),
    (['forecast','projection','2030','outlook'],              'AGT-07'),
    (['scenario','monte','carlo','simulation','stress'],      'AGT-08'),
    (['enrich','provenance','verify','waterfall'],            'AGT-09'),
    (['translate','arabic','french','language'],              'AGT-10'),
    (['ofac','sanction','compliance','screen'],               'AGT-11'),
    (['company','intelligence','ims','cic'],                  'AGT-12'),
    (['corridor','bilateral','route','flow'],                 'AGT-13'),
    (['publish','publication','document','compile'],          'AGT-14'),
    (['orchestrat','dispatch','pipeline','all'],              'AGT-15'),
]

def route_intent(query: str) -> str:
    q = query.lower()
    for keywords, agent_id in ROUTING_PATTERNS:
        if any(kw in q for kw in keywords):
            return agent_id
    return 'AGT-01'  # default

def run_agent(agent_id: str, payload: dict) -> dict:
    """Load and execute the specialist agent."""
    start = time.perf_counter()
    reg = AGENT_REGISTRY.get(agent_id, AGENT_REGISTRY['AGT-01'])
    try:
        mod = importlib.import_module(reg['module'])
        result = mod.execute(payload)
    except Exception as e:
        result = {'status':'error','error':str(e),'agent':agent_id}
    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
    return {**result, 'elapsed_ms': elapsed_ms}

def dispatch(query: str, payload: dict) -> dict:
    """Main dispatch: route → execute → return with master provenance."""
    agent_id = route_intent(query)
    result    = run_agent(agent_id, payload)
    ref       = f"SA-{agent_id}-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}-{hashlib.sha256(query.encode()).hexdigest()[:8].upper()}"
    return {
        'super_agent': 'GFM-SA-v3.0',
        'ref':          ref,
        'agent_id':     agent_id,
        'agent_name':   AGENT_REGISTRY.get(agent_id,{}).get('name','Unknown'),
        'query':        query,
        'result':       result,
        'provenance': {
            'hash':        f"sha256:{hashlib.sha256(ref.encode()).hexdigest()[:16]}",
            'executed_at': datetime.now(timezone.utc).isoformat(),
            'fic_cost':    AGENT_REGISTRY.get(agent_id,{}).get('fic',0),
        }
    }

# ── HTTP Server ───────────────────────────────────────────────────────────
class AgentHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # Suppress default logging

    def _json(self, data: dict, status: int = 200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/health':
            return self._json({'status':'ok','agents':len(AGENT_REGISTRY),'version':'3.0.0'})
        if self.path == '/agents':
            return self._json({'agents':[{'id':k,'name':v['name'],'fic':v['fic']} for k,v in AGENT_REGISTRY.items()]})
        self._json({'error':'Not found'}, 404)

    def do_POST(self):
        length = int(self.headers.get('Content-Length',0))
        body   = json.loads(self.rfile.read(length) or b'{}')
        if self.path == '/dispatch':
            query   = body.get('query','signal detection')
            payload = body.get('payload',{})
            result  = dispatch(query, payload)
            return self._json(result)
        if self.path.startswith('/agents/'):
            agent_id = self.path.split('/')[-1]
            result   = run_agent(agent_id, body)
            return self._json(result)
        self._json({'error':'Not found'}, 404)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers','Content-Type')
        self.end_headers()

# ── Entry point ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import os
    SERVER_MODE = os.environ.get('AGENT_SERVER_MODE','false').lower() == 'true'
    PORT = int(os.environ.get('AGENT_PORT','8080'))

    if SERVER_MODE:
        print(f"GFM Agent Server — {len(AGENT_REGISTRY)} agents — port {PORT}")
        server = HTTPServer(('0.0.0.0', PORT), AgentHandler)
        server.serve_forever()
    else:
        # Demo mode
        print("GFM Super Agent — Demo Mode")
        tests = [
            ('AGT-AGT-01', 'signal detection run',   {'iso3':'ARE','sector':'J'}),
            ('AGT-AGT-02', 'compute gfr rankings',   {'quarter':'Q1-2026'}),
            ('AGT-AGT-03', 'country profile UAE',    {'iso3':'ARE'}),
            ('AGT-AGT-08', 'monte carlo scenario',   {'gdp':4.0,'fdi_base':30.0,'n_simulations':200}),
        ]
        for _,query,payload in tests:
            r = dispatch(query, payload)
            elapsed = r['result'].get('elapsed_ms','?')
            print(f"  [{r['agent_id']}] {r['agent_name']} → {r['ref']} ({elapsed}ms)")


def run(payload: dict) -> dict:
    """Standard GFM agent run interface for super_agent."""
    query = payload.get('query', 'signal detection')
    result = dispatch(query, payload)
    return result

def execute(payload: dict) -> dict:
    """Standard GFM execute interface."""
    return run(payload)
