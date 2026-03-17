"""AGT-7 WEEKLY FDI NEWSLETTER GENERATOR — Weekly FDI newsletter generator"""
import hashlib, json
from datetime import datetime, timezone

AGENT_ID   = "AGT-7"
AGENT_NAME = "Weekly FDI newsletter generator"
FIC_COST   = 0

def run(payload: dict) -> dict:
    """Generate weekly FDI intelligence digest."""
    import sys, datetime; sys.path.insert(0,'apps/pipeline')
    week = datetime.datetime.now().strftime('W%V %Y')
    try:
        from collectors.gdelt_curated import collect
        signals = collect()
        platinum = [s for s in signals if s.get('grade')=='PLATINUM']
        gold     = [s for s in signals if s.get('grade')=='GOLD']
        total_cap = sum(s.get('capex_usd',0)/1e9 for s in signals)
        return {
            'week':           week,
            'headline':       f"GFM Intelligence Digest — {week}",
            'total_signals':  len(signals),
            'platinum_count': len(platinum),
            'total_capex_b':  round(total_cap,1),
            'top_platinum':   platinum[:3],
            'top_gold':       gold[:3],
            'regions':        list(set(s.get('target_iso3','?') for s in platinum[:6])),
            'status':         'compiled',
        }
    except Exception as e:
        return {'error': str(e), 'week': week}

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
