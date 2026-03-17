"""
GFM Agent Router — Fast Intent Classification
Routes requests to appropriate agent with <1ms latency.
"""
import re, time, hashlib
from datetime import datetime, timezone

# Keyword → agent mapping (ordered by priority)
ROUTES = [
    (r'\b(signal|detect|news|gdelt|announcement)\b',     'AGT-01', 'Signal Detection'),
    (r'\b(gfr|ranking|score|readiness|tier)\b',          'AGT-02', 'GFR Computation'),
    (r'\b(country|economy|profile|gdp|cegp)\b',          'AGT-03', 'Country Profile'),
    (r'\b(brief|market|sector|summary|mib)\b',           'AGT-04', 'Market Brief'),
    (r'\b(mission|target|company|mfs|pmp)\b',            'AGT-05', 'Mission Planning'),
    (r'\b(newsletter|digest|weekly|monthly)\b',           'AGT-06', 'Newsletter'),
    (r'\b(forecast|predict|projection|var|prophet)\b',   'AGT-07', 'Forecast'),
    (r'\b(scenario|monte.carlo|simulate|stress)\b',      'AGT-08', 'Scenario'),
    (r'\b(enrich|verify|provenance|z3|waterfall)\b',     'AGT-09', 'Enrichment'),
    (r'\b(translat|language|arabic|french|arabic)\b',    'AGT-10', 'Translation'),
    (r'\b(sanction|ofac|blocklist|compliance)\b',         'AGT-11', 'Sanctions'),
    (r'\b(cic|company.intel|ims|footprint|esg)\b',       'AGT-12', 'Company Intel'),
    (r'\b(corridor|bilateral|flow|trade.route)\b',        'AGT-13', 'Corridor'),
    (r'\b(publish|pdf|compile|render|report)\b',          'AGT-14', 'Publication'),
    (r'\b(alert|notify|threshold|watchlist)\b',           'AGT-15', 'Alert'),
]
_COMPILED = [(re.compile(p, re.IGNORECASE), aid, name) for p, aid, name in ROUTES]

def route(query: str, context: dict | None = None) -> dict:
    """Route query to best-match agent. Returns routing decision with latency."""
    t0      = time.perf_counter()
    matches = [(aid, name) for pat, aid, name in _COMPILED if pat.search(query)]
    agent_id, agent_name = matches[0] if matches else ('AGT-03', 'Country Profile')
    latency_ms = (time.perf_counter() - t0) * 1000

    return {
        'query':       query,
        'agent_id':    agent_id,
        'agent_name':  agent_name,
        'confidence':  0.92 if matches else 0.55,
        'alternatives':[{'id':m[0],'name':m[1]} for m in matches[1:3]],
        'latency_ms':  round(latency_ms, 3),
        'timestamp':   datetime.now(timezone.utc).isoformat(),
    }

def batch_route(queries: list[str]) -> list[dict]:
    return [route(q) for q in queries]

if __name__ == '__main__':
    tests = [
        "Run signal detection for UAE tech sector",
        "Compute GFR scores for all 215 economies",
        "Generate country profile for India",
        "Weekly newsletter generation",
        "Monte Carlo scenario for oil price shock",
        "OFAC sanctions check for new company",
        "Bilateral corridor analysis UAE-India",
    ]
    print("GFM Agent Router — Test Results")
    print("=" * 60)
    for q in tests:
        r = route(q)
        print(f"  [{r['agent_id']}] {r['agent_name']:20s} | {r['latency_ms']:.3f}ms | {q[:45]}")
