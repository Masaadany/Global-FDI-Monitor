"""Agent Router — FDI Monitor Intelligence Pipeline
Routes intelligence requests to appropriate specialist agents.
"""
import datetime as _dt

def _safe_route(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except Exception as e:
        return {"success": False, "error": str(e), "agent": "agent_router",
                "ts": _dt.datetime.utcnow().isoformat() + "Z"}


import re, time

ROUTING_PATTERNS = [
    ('AGT-01', ['signal','detect','feed','live','stream','gdelt','curated']),
    ('AGT-02', ['gfr','ranking','score','readiness','composite','215 economies']),
    ('AGT-03', ['country','profile','economy','iso3','geographic']),
    ('AGT-04', ['brief','market','summary','mib','intelligence brief']),
    ('AGT-05', ['mission','target','mfs','feasibility','outreach']),
    ('AGT-06', ['newsletter','digest','weekly','fnl','compile news']),
    ('AGT-07', ['forecast','projection','outlook','2030','2028','future fdi']),
    ('AGT-08', ['scenario','monte carlo','simulation','stress test','p10','p50','p90']),
    ('AGT-09', ['enrich','provenance','verify','waterfall','z3','enrichment']),
    ('AGT-10', ['translate','arabic','french','spanish','language','localise']),
    ('AGT-11', ['ofac','sanction','compliance','screen','sanctioned','un list']),
    ('AGT-12', ['company','intelligence','ims','cic','esg','corporate']),
    ('AGT-13', ['corridor','bilateral','route','flow','trade route']),
    ('AGT-14', ['publish','publication','document','compile report','document']),
    ('AGT-15', ['orchestrat','dispatch','pipeline','all agents','coordinate']),
]

def route(query: str) -> dict:
    """Classify query and return routing decision in <5ms."""
    start = time.perf_counter()
    q = query.lower().strip()
    
    best_agent = 'AGT-01'
    best_score = 0
    
    for agent_id, keywords in ROUTING_PATTERNS:
        score = sum(1 for kw in keywords if kw in q)
        if score > best_score:
            best_score = score
            best_agent = agent_id
    
    elapsed = (time.perf_counter() - start) * 1000
    
    return {
        'agent_id':    best_agent,
        'confidence':  min(1.0, best_score / 2),
        'elapsed_ms':  round(elapsed, 3),
        'query':       query,
    }

def route_intent(query: str) -> str:
    """Simple helper returning just agent ID."""
    return route(query)['agent_id']

if __name__ == "__main__":
    tests = [
        ('signal detection run',    'AGT-01'),
        ('compute gfr rankings',    'AGT-02'),
        ('country profile UAE',     'AGT-03'),
        ('market brief ICT',        'AGT-04'),
        ('mission planning targets','AGT-05'),
        ('generate newsletter',     'AGT-06'),
        ('forecast fdi 2030',       'AGT-07'),
        ('monte carlo scenario',    'AGT-08'),
        ('enrich signal record',    'AGT-09'),
        ('translate arabic',        'AGT-10'),
        ('ofac sanctions check',    'AGT-11'),
        ('company intelligence',    'AGT-12'),
        ('corridor analysis',       'AGT-13'),
        ('compile publication',     'AGT-14'),
        ('orchestrate pipeline',    'AGT-15'),
    ]
    print("Agent Router Test:")
    for query, expected in tests:
        result = route(query)
        status = '✓' if result['agent_id'] == expected else '✗'
        print(f"  {status} {result['agent_id']} ({result['elapsed_ms']:.3f}ms): {query}")


def run(payload: dict) -> dict:
    """Standard GFM agent run interface for agent_router."""
    query = payload.get('query', '')
    return route(query)

def execute(payload: dict) -> dict:
    """Standard GFM execute interface."""
    return {'status': 'completed', 'result': run(payload)}
