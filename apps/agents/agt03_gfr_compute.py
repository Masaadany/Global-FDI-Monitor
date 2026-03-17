"""AGT-03 GFR COMPUTATION AGENT — GFR Computation Agent"""
import hashlib, json, sys
from datetime import datetime, timezone

AGENT_ID   = "AGT-03"
AGENT_NAME = "GFR Computation Agent"
FIC_COST   = 0

def run(payload: dict) -> dict:
    """Compute GFR scores using the composite formula."""
    import sys; sys.path.insert(0, 'apps/pipeline')
    WEIGHTS = {'macro':0.20,'policy':0.18,'digital':0.15,'human':0.15,'infra':0.15,'sustain':0.17}
    try:
        from reference_data import ALL_215_ECONOMIES
        results = []
        for eco in ALL_215_ECONOMIES:
            composite = sum(eco[k]*w for k,w in WEIGHTS.items())
            eco['computed_gfr'] = round(composite, 2)
            eco['delta_vs_stored'] = round(composite - eco['gfr'], 2)
            results.append(eco)
        results.sort(key=lambda x: -x['computed_gfr'])
        return {'rankings': results[:10], 'total': len(results), 'formula': WEIGHTS}
    except Exception as e:
        return {'error': str(e), 'rankings': []}

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
