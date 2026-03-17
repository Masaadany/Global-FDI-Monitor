"""AGT-02 SIGNAL DETECTION AGENT — Signal Detection Agent"""
import hashlib, json, sys
from datetime import datetime, timezone

AGENT_ID   = "AGT-02"
AGENT_NAME = "Signal Detection Agent"
FIC_COST   = 0

def run(payload: dict) -> dict:
    """Detect FDI signals from GDELT, news, and curated sources."""
    import sys; sys.path.insert(0, 'apps/pipeline')
    try:
        from collectors.gdelt_curated import collect
        signals = collect()
        filtered = signals
        if payload.get('iso3'):
            filtered = [s for s in signals if s.get('target_iso3') == payload['iso3']]
        if payload.get('sector'):
            filtered = [s for s in filtered if s.get('sector') == payload['sector']]
        return {
            'signals': filtered[:20],
            'total': len(filtered),
            'grades': {g: sum(1 for s in filtered if s.get('grade')==g) for g in ['PLATINUM','GOLD','SILVER','BRONZE']},
        }
    except Exception as e:
        return {'error': str(e), 'signals': [], 'total': 0}

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
        "provenance": {
            "hash":       f"sha256:{hashlib.sha256(ref.encode()).hexdigest()[:16]}",
            "executed_at": datetime.now(timezone.utc).isoformat(),
        }
    }

if __name__ == "__main__":
    print(json.dumps(execute({"test": True}), indent=2))
