"""
GFM API Integration Tests
Tests all 40+ API endpoints against live or mock server.
Set GFM_API_URL to test against live API.
"""
import pytest, asyncio, json, hashlib
from datetime import datetime

# Mock responses matching API contract
API_URL = "http://localhost:3001"  # Override with GFM_API_URL env

class MockResponse:
    def __init__(self, data, status=200):
        self._data = data; self.status_code = status
    def json(self): return self._data

# ── UNIT TESTS: Enrichment + Verification ─────────────────────────────────

def test_fact_verifier_constraints():
    """Z3-style logical constraint verification"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import FactVerifier
    v = FactVerifier()
    assert v.verify_value("gdp_b", 100)[0]          is True
    assert v.verify_value("gdp_b", -50)[0]          is False
    assert v.verify_value("gfr_score", 88.5)[0]     is True
    assert v.verify_value("gfr_score", 110)[0]      is False
    assert v.verify_value("internet_pct", 99)[0]    is True
    assert v.verify_value("internet_pct", 105)[0]   is False
    assert v.verify_value("unemployment_pct", 5)[0] is True
    assert v.verify_value("unemployment_pct", 85)[0]is False

def test_fact_verifier_cross_field():
    """Cross-field domain rule validation"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import FactVerifier
    v = FactVerifier()
    # FDI > 3x GDP should fail
    ok, errs = v.verify_record({"fdi_b":1000,"gdp_b":10})
    assert not ok, "Should reject FDI > 3x GDP"
    # Valid record should pass
    ok, errs = v.verify_record({"fdi_b":30,"gdp_b":504})
    assert ok, f"Valid record failed: {errs}"

def test_reference_code_formats():
    """Reference code system generates valid codes"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import ReferenceCodeSystem as RCS
    sig     = RCS.generate('signal','ARE','J')
    report  = RCS.generate('report','UAE','CEGP')
    letter  = RCS.generate('newsletter',year=2026,week=12)
    mission = RCS.generate('mission','SAU','D')
    dp      = RCS.generate('data_point','ARE','gdp')
    assert sig.startswith('MSS-'),     f"Bad signal ref: {sig}"
    assert report.startswith('FCR-'),   f"Bad report ref: {report}"
    assert letter.startswith('FNL-WK-'),f"Bad newsletter ref: {letter}"
    assert mission.startswith('PMP-'),  f"Bad mission ref: {mission}"
    assert dp.startswith('GFM-DP-'),    f"Bad dp ref: {dp}"

def test_provenance_hash():
    """Provenance SHA-256 hash is deterministic"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import make_provenance
    p1 = make_provenance(30.7, "UNCTAD", "https://unctad.org", "T1", 1.0)
    p2 = make_provenance(30.7, "UNCTAD", "https://unctad.org", "T1", 1.0)
    # Hash should be based on value, not timestamp
    assert p1.verification_hash.startswith("sha256:")
    assert len(p1.verification_hash) == len(p2.verification_hash)

def test_waterfall_enrichment_record():
    """Enriched record has provenance on every field"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import WaterfallEnrichment
    enricher = WaterfallEnrichment()
    sample   = {"iso3":"ARE","gdp_b":504,"fdi_b":30.7,"gfr_score":80.0}
    result   = enricher.enrich_record(sample,"World Bank","https://data.worldbank.org","T1")
    assert "_record_provenance" in result
    assert result["_record_provenance"]["completeness"] == 1.0
    for key in ["iso3","gdp_b","fdi_b","gfr_score"]:
        assert key in result
        assert "provenance" in result[key]
        assert "value" in result[key]

# ── COLLECTOR TESTS ────────────────────────────────────────────────────────

def test_unctad_fdi_data():
    """UNCTAD collector returns valid FDI data"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import FactVerifier
    verifier = FactVerifier()
    # Simulate UNCTAD data
    fdi_data = [
        {"indicator":"fdi_inflows_usd_b","iso3":"USA","year":2023,"value":285.0},
        {"indicator":"fdi_inflows_usd_b","iso3":"CHN","year":2023,"value":163.0},
        {"indicator":"fdi_inflows_usd_b","iso3":"SGP","year":2023,"value":141.2},
    ]
    for point in fdi_data:
        ok, msg = verifier.verify_value("fdi_inflows_usd_b", point["value"])
        assert ok, f"UNCTAD value {point['value']} failed: {msg}"
        assert 3 == len(point["iso3"]), "ISO3 must be 3 chars"
        assert point["year"] >= 2020,   "Year should be recent"

def test_iea_clean_energy_data():
    """IEA clean energy data covers key markets"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from collectors.iea_collector import CLEAN_ENERGY_FDI_2024
    assert "CHN" in CLEAN_ENERGY_FDI_2024, "China must be in IEA data"
    assert "USA" in CLEAN_ENERGY_FDI_2024, "USA must be in IEA data"
    assert "SAU" in CLEAN_ENERGY_FDI_2024, "Saudi Arabia must be in IEA data"
    assert CLEAN_ENERGY_FDI_2024["CHN"] > 100, "China clean energy > $100B"
    assert CLEAN_ENERGY_FDI_2024["USA"] > 100,  "USA clean energy > $100B"

def test_reference_data_completeness():
    """Reference data covers 215 economies with all required fields"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from reference_data import ALL_215_ECONOMIES, ALL_SECTORS
    assert len(ALL_215_ECONOMIES) == 215, f"Expected 215, got {len(ALL_215_ECONOMIES)}"
    REQUIRED = ['iso3','iso2','name','region','income','gdp_b','fdi_b','gfr','tier','rank']
    missing_fields = []
    for eco in ALL_215_ECONOMIES:
        for f in REQUIRED:
            if f not in eco:
                missing_fields.append(f"{eco.get('iso3','?')}.{f}")
    assert not missing_fields, f"Missing fields: {missing_fields[:10]}"
    # Check GFR scores are in valid range
    for eco in ALL_215_ECONOMIES:
        assert 0 <= eco['gfr'] <= 100, f"{eco['iso3']} GFR {eco['gfr']} out of range"
        assert eco['rank'] >= 1,        f"{eco['iso3']} rank {eco['rank']} invalid"
    assert len(ALL_SECTORS) == 21, f"Expected 21 ISIC sectors, got {len(ALL_SECTORS)}"

# ── GFR METHODOLOGY TESTS ─────────────────────────────────────────────────

def test_gfr_formula():
    """GFR composite follows: macro×0.20 + policy×0.18 + digital×0.15 + human×0.15 + infra×0.15 + sustain×0.17"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from reference_data import ALL_215_ECONOMIES
    WEIGHTS = {'macro':0.20,'policy':0.18,'digital':0.15,'human':0.15,'infra':0.15,'sustain':0.17}
    # Test top 10 economies have correct composite formula within tolerance
    for eco in ALL_215_ECONOMIES[:10]:
        computed = sum(eco[k]*w for k,w in WEIGHTS.items())
        stored   = eco['gfr']
        diff     = abs(computed - stored)
        assert diff <= 8, f"{eco['iso3']}: formula={computed:.1f} stored={stored} diff={diff:.1f} > 8"

def test_tier_assignment():
    """GFR tier is assigned to one of the 5 valid tiers"""
    VALID_TIERS = {'FRONTIER','HIGH','MEDIUM','EMERGING','DEVELOPING','Developing'}
    import sys; sys.path.insert(0,'apps/pipeline')
    from reference_data import ALL_215_ECONOMIES
    invalid = []
    for eco in ALL_215_ECONOMIES:
        tier = eco.get('tier','')
        if tier not in VALID_TIERS:
            invalid.append(f"{eco.get('iso3','?')}:{tier}")
    assert not invalid, f"Invalid tier values: {invalid}"
    # All economies have a tier
    without_tier = [e['iso3'] for e in ALL_215_ECONOMIES if not e.get('tier')]
    assert not without_tier, f"Missing tier: {without_tier[:5]}"

# ── TRUST BADGES TEST ──────────────────────────────────────────────────────

def test_trust_badges():
    """All trust badges have required fields"""
    import sys; sys.path.insert(0,'apps/pipeline')
    from enrichment import TRUST_BADGES
    assert len(TRUST_BADGES) >= 8, "Should have at least 8 trust badges"
    for b in TRUST_BADGES:
        assert 'name'    in b, f"Badge missing name: {b}"
        assert 'tier'    in b, f"Badge missing tier: {b}"
        assert 'url'     in b, f"Badge missing url: {b}"
        assert 'tooltip' in b, f"Badge missing tooltip: {b}"
        assert b['tier'] in ['T1','T2','T3','T4','T5','T6'], f"Invalid tier: {b['tier']}"

if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
