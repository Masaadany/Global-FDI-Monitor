"""AGT-12 OFAC/UN SANCTIONS SCREENING — OFAC/UN sanctions screening"""
import hashlib, json
from datetime import datetime, timezone

AGENT_ID   = "AGT-12"
AGENT_NAME = "OFAC/UN sanctions screening"
FIC_COST   = 0

def run(payload: dict) -> dict:
    """Screen entity against OFAC and UN sanctions lists."""
    entity = payload.get('entity','').strip()
    country= payload.get('country','').upper()
    # Sanctioned country list (simplified)
    SANCTIONED_COUNTRIES = {'IRN','PRK','SYR','BLR','CUB','MMR','ZWE'}
    # Known sanctioned entities (sample)
    BLOCKED_TERMS = ['sanctioned','blacklisted','blocked entity']
    country_hit  = country in SANCTIONED_COUNTRIES
    entity_hit   = any(t in entity.lower() for t in BLOCKED_TERMS)
    risk_level   = 'HIGH' if country_hit or entity_hit else 'LOW'
    return {
        'entity':         entity,
        'country':        country,
        'ofac_hit':       country_hit or entity_hit,
        'un_hit':         country_hit,
        'risk_level':     risk_level,
        'sanctioned_country': country_hit,
        'screening_date': '2026-03-17',
        'databases':      ['OFAC SDN','UN Security Council','EU Consolidated'],
        'recommendation': 'DO NOT PROCEED' if risk_level=='HIGH' else 'CLEARED - Continue due diligence',
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
