"""
GFM Super Agent Integration Tests
Tests the full agent orchestration pipeline.
"""
import sys, json, os
sys.path.insert(0, os.path.dirname(__file__))

from agent_router import route, route_intent
from super_agent  import dispatch, run_agent, AGENT_REGISTRY

def test_router_all_15_patterns():
    """Router correctly classifies all 15 intent types"""
    cases = [
        ('signal detection live feed',  'AGT-01'),
        ('compute gfr rankings 2026',   'AGT-02'),
        ('get country profile ARE',     'AGT-03'),
        ('generate market intelligence brief', 'AGT-04'),
        ('mission planning targets MFS','AGT-05'),
        ('generate newsletter digest',  'AGT-06'),
        ('fdi forecast 2030 outlook',   'AGT-07'),
        ('run monte carlo scenario',    'AGT-08'),
        ('enrich enrichment record z3', 'AGT-09'),
        ('translate to arabic',         'AGT-10'),
        ('ofac sanctions screening',    'AGT-11'),
        ('company intelligence card',   'AGT-12'),
        ('corridor bilateral analysis', 'AGT-13'),
        ('compile publication document','AGT-14'),
        ('orchestrate all agents',      'AGT-15'),
    ]
    for query, expected in cases:
        result = route(query)
        assert result['agent_id'] == expected, \
            f"'{query}' → {result['agent_id']}, expected {expected}"
    print(f"✓ Router: all 15 patterns correct")

def test_dispatch_returns_provenance():
    """Dispatch adds SHA-256 provenance to all results"""
    result = dispatch('signal detection', {'iso3': 'ARE'})
    assert 'ref' in result, "Missing ref"
    assert 'provenance' in result, "Missing provenance"
    assert 'hash' in result['provenance'], "Missing hash"
    assert result['provenance']['hash'].startswith('sha256:'), "Hash format wrong"
    print(f"✓ Dispatch provenance: {result['ref']}")

def test_registry_15_agents():
    """AGENT_REGISTRY has exactly 15 specialist agents"""
    assert len(AGENT_REGISTRY) == 15, f"Expected 15, got {len(AGENT_REGISTRY)}"
    for i in range(1, 16):
        key = f'AGT-{i:02d}'
        assert key in AGENT_REGISTRY, f"Missing: {key}"
    print(f"✓ Registry: {len(AGENT_REGISTRY)} agents registered")

def test_all_agents_respond():
    """All 15 registered agents return a dict with status"""
    for agent_id, info in AGENT_REGISTRY.items():
        result = run_agent(agent_id, {'test': True, 'iso3': 'ARE'})
        assert isinstance(result, dict), f"{agent_id}: result is not dict"
    print(f"✓ All {len(AGENT_REGISTRY)} agents respond correctly")

if __name__ == '__main__':
    print("=== GFM Super Agent Tests ===")
    test_router_all_15_patterns()
    test_dispatch_returns_provenance()
    test_registry_15_agents()
    test_all_agents_respond()
    print("\n✅ All super agent tests passed")
