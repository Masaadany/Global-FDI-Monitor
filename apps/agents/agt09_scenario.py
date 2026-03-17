"""AGT-09 SCENARIO AGENT — Scenario Agent"""
import hashlib, json, sys
from datetime import datetime, timezone

AGENT_ID   = "AGT-09"
AGENT_NAME = "Scenario Agent"
FIC_COST   = 0

def run(payload: dict) -> dict:
    """Run Monte Carlo scenario simulation."""
    import random, math
    gdp = float(payload.get('gdp', 3.4))
    fdi_base = float(payload.get('fdi_base', 30.0))
    n_sim = int(payload.get('n_simulations', 1000))
    
    # Simulate FDI outcomes
    outcomes = []
    for _ in range(n_sim):
        shock = random.gauss(0, 0.12)  # 12% std dev
        policy_factor = random.uniform(0.85, 1.15)
        fdi = fdi_base * (1 + (gdp - 2.5) / 100 * 1.2 + shock) * policy_factor
        outcomes.append(round(fdi, 2))
    outcomes.sort()
    p10 = outcomes[int(n_sim * 0.10)]
    p50 = outcomes[int(n_sim * 0.50)]
    p90 = outcomes[int(n_sim * 0.90)]
    return {
        'n_simulations': n_sim,
        'p10_stress':    round(p10, 1),
        'p50_base':      round(p50, 1),
        'p90_optimistic':round(p90, 1),
        'mean':          round(sum(outcomes)/len(outcomes), 1),
        'std_dev':       round((sum((x - p50)**2 for x in outcomes) / len(outcomes))**0.5, 2),
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
        "provenance": {
            "hash":       f"sha256:{hashlib.sha256(ref.encode()).hexdigest()[:16]}",
            "executed_at": datetime.now(timezone.utc).isoformat(),
        }
    }

if __name__ == "__main__":
    print(json.dumps(execute({"test": True}), indent=2))
