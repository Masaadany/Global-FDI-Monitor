"""AGT-4 GENERATES COUNTRY ECONOMIC PROFILE — Generates country economic profile"""
import hashlib, json
from datetime import datetime, timezone

AGENT_ID   = "AGT-4"
AGENT_NAME = "Generates country economic profile"
FIC_COST   = 20

def run(payload: dict) -> dict:
    """Generate country economic profile from reference data."""
    import sys; sys.path.insert(0,'apps/pipeline')
    iso3 = payload.get('iso3','ARE').upper()
    try:
        from reference_data import ALL_215_ECONOMIES
        eco = next((e for e in ALL_215_ECONOMIES if e['iso3']==iso3), None)
        if not eco:
            return {'error': f'Economy {iso3} not found'}
        from enrichment import ReferenceCodeSystem
        ref = ReferenceCodeSystem.generate('profile', iso3, 'E')
        return {
            'iso3':       iso3,
            'name':       eco['name'],
            'region':     eco['region'],
            'income':     eco['income'],
            'gfr':        eco['gfr'],
            'tier':       eco['tier'],
            'fdi_b':      eco['fdi_b'],
            'gdp_b':      eco['gdp_b'],
            'internet':   eco['internet_pct'],
            'dimensions': {k: eco[k] for k in ['macro','policy','digital','human','infra','sustain']},
            'ref':        ref,
        }
    except Exception as e:
        return {'error': str(e), 'iso3': iso3}

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
