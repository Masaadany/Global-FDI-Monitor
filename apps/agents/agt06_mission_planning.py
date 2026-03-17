"""AGT-6 MISSION FEASIBILITY SCORE RANKING — Mission Feasibility Score ranking"""
import hashlib, json
from datetime import datetime, timezone

AGENT_ID   = "AGT-6"
AGENT_NAME = "Mission Feasibility Score ranking"
FIC_COST   = 30

def run(payload: dict) -> dict:
    """Rank companies by Mission Feasibility Score for target economy."""
    iso3   = payload.get('iso3','ARE').upper()
    sector = payload.get('sector','J')
    # Static company database for MFS calculation
    COMPANIES = [
        {'cic':'GFM-USA-MSFT-12847','name':'Microsoft','ims':96,'grade':'PLATINUM','mfs_base':94},
        {'cic':'GFM-USA-AMZN-98120','name':'Amazon AWS','ims':95,'grade':'PLATINUM','mfs_base':92},
        {'cic':'GFM-CHN-CATL-11234','name':'CATL',      'ims':92,'grade':'PLATINUM','mfs_base':90},
        {'cic':'GFM-USA-NVDA-66234','name':'NVIDIA',    'ims':94,'grade':'PLATINUM','mfs_base':89},
        {'cic':'GFM-DEU-SINEN-44221','name':'Siemens Energy','ims':85,'grade':'GOLD','mfs_base':88},
    ]
    import random
    targets = []
    for co in COMPANIES:
        # Adjust MFS by sector match and some randomness
        sector_bonus = 5 if co.get('name') in ['Microsoft','Amazon AWS','NVIDIA'] and sector=='J' else 0
        mfs = min(99, co['mfs_base'] + sector_bonus + random.randint(-2,4))
        targets.append({**co, 'mfs':mfs, 'target_iso3':iso3, 'conviction':'VERY HIGH' if mfs>92 else 'HIGH' if mfs>85 else 'MEDIUM'})
    targets.sort(key=lambda x: -x['mfs'])
    return {'targets': targets[:5], 'total': len(targets), 'economy': iso3, 'sector': sector}

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
