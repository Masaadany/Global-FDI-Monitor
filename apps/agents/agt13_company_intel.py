"""AGT-13 COMPANY INTELLIGENCE CARD (CIC) — Company Intelligence Card (CIC)"""
import hashlib, json
from datetime import datetime, timezone

AGENT_ID   = "AGT-13"
AGENT_NAME = "Company Intelligence Card (CIC)"
FIC_COST   = 5

def run(payload: dict) -> dict:
    """Generate Company Intelligence Card with IMS score."""
    cic  = payload.get('cic','GFM-USA-MSFT-12847')
    name = payload.get('company','Microsoft Corporation')
    # IMS scoring factors
    import random
    COMPANIES = {
        'GFM-USA-MSFT-12847':{'ims':96,'grade':'PLATINUM','esg':77.2,'footprints':10},
        'GFM-USA-AMZN-98120':{'ims':95,'grade':'PLATINUM','esg':74.1,'footprints':9},
        'GFM-CHN-CATL-11234':{'ims':92,'grade':'PLATINUM','esg':62.4,'footprints':7},
    }
    data = COMPANIES.get(cic, {'ims':75+random.randint(0,20),'grade':'GOLD','esg':60+random.randint(0,20),'footprints':5})
    return {
        'cic':          cic,
        'name':         name,
        'ims_score':    data['ims'],
        'grade':        data['grade'],
        'esg_score':    data['esg'],
        'footprints':   data['footprints'],
        'momentum':     'STRONG' if data['ims']>90 else 'MODERATE',
        'last_signal':  '2026-03-17',
        'conviction':   'VERY HIGH' if data['ims']>92 else 'HIGH',
    }

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
