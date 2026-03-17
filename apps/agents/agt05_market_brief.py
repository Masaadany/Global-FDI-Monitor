"""AGT-5 GENERATES MARKET INTELLIGENCE BRIEF — Generates market intelligence brief"""
import hashlib, json
from datetime import datetime, timezone

AGENT_ID   = "AGT-5"
AGENT_NAME = "Generates market intelligence brief"
FIC_COST   = 5

def run(payload: dict) -> dict:
    """Generate market intelligence brief for economy+sector."""
    import sys; sys.path.insert(0,'apps/pipeline')
    iso3   = payload.get('iso3','ARE').upper()
    sector = payload.get('sector','J')
    try:
        from collectors.gdelt_curated import collect
        signals = [s for s in collect() if s.get('target_iso3')==iso3 and s.get('sector')==sector]
        total_capex = sum(s.get('capex_usd',0)/1e9 for s in signals)
        grade_dist  = {}
        for s in signals:
            g = s.get('grade','BRONZE')
            grade_dist[g] = grade_dist.get(g,0)+1
        return {
            'iso3':          iso3,
            'sector':        sector,
            'signal_count':  len(signals),
            'total_capex_b': round(total_capex,2),
            'grade_dist':    grade_dist,
            'top_signals':   signals[:3],
            'summary':       f"{'Brief for' if not signals else f'{len(signals)} signals'} {iso3} ISIC-{sector}: ${total_capex:.1f}B total capex",
        }
    except Exception as e:
        return {'error': str(e), 'iso3': iso3, 'sector': sector}

def execute(payload: dict) -> dict:
    ref = f"{AGENT_ID}-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}-{hashlib.sha256(json.dumps(payload).encode()).hexdigest()[:8].upper()}"
    result = run(payload)
    return {
        "agent":     AGENT_ID,
        "name":      AGENT_NAME,
        "ref":       ref,
        "status":    "completed" if "error" not in result else "error",
        "fic":       FIC_COST,
        "result":    result,
        "provenance": {"hash": f"sha256:{hashlib.sha256(ref.encode()).hexdigest()[:16]}", "executed_at": datetime.now(timezone.utc).isoformat()}
    }

if __name__ == "__main__":
    print(json.dumps(execute({"test": True}), indent=2))
