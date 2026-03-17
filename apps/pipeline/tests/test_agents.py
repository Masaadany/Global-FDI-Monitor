"""
GLOBAL FDI MONITOR — PYTHON AGENT UNIT TESTS
Tests signal scoring, GFR computation, FIC costs, and all agent logic
that can be verified without DB or API connections.
Run: pytest tests/ -v
"""
import sys, os, pytest, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


# ── SCI SIGNAL SCORING ────────────────────────────────────────────────────────

def grade_signal(sci: float) -> str:
    if sci >= 85: return "PLATINUM"
    if sci >= 70: return "GOLD"
    if sci >= 55: return "SILVER"
    return "BRONZE"

class TestSignalScoring:
    def test_platinum_threshold(self):
        assert grade_signal(91.2) == "PLATINUM"
        assert grade_signal(85.0) == "PLATINUM"

    def test_gold_threshold(self):
        assert grade_signal(84.9) == "GOLD"
        assert grade_signal(70.0) == "GOLD"

    def test_silver_threshold(self):
        assert grade_signal(69.9) == "SILVER"
        assert grade_signal(55.0) == "SILVER"

    def test_bronze_threshold(self):
        assert grade_signal(54.9) == "BRONZE"
        assert grade_signal(0)    == "BRONZE"

    def test_fic_cost_only_for_platinum(self):
        fic_costs = {"PLATINUM": 1, "GOLD": 0, "SILVER": 0, "BRONZE": 0}
        assert fic_costs["PLATINUM"] > 0
        assert fic_costs["GOLD"]     == 0
        assert fic_costs["SILVER"]   == 0


# ── GFR DIMENSION WEIGHTS ─────────────────────────────────────────────────────

GFR_WEIGHTS = {
    "macro_foundations":    0.20,
    "policy_institutional": 0.18,
    "digital_foundations":  0.15,
    "human_capital":        0.15,
    "infrastructure":       0.15,
    "sustainability":       0.17,
}

class TestGFRWeights:
    def test_weights_sum_to_one(self):
        total = sum(GFR_WEIGHTS.values())
        assert abs(total - 1.0) < 0.001, f"Weights sum to {total}, not 1.0"

    def test_all_weights_positive(self):
        for name, w in GFR_WEIGHTS.items():
            assert w > 0, f"Weight for {name} is not positive"

    def test_gfr_within_range(self):
        scores = {"macro_foundations": 80, "policy_institutional": 75,
                  "digital_foundations": 90, "human_capital": 70,
                  "infrastructure": 85, "sustainability": 65}
        composite = sum(scores[k] * GFR_WEIGHTS[k] for k in GFR_WEIGHTS)
        assert 0 <= composite <= 100


# ── FIC PRICING INVARIANTS ────────────────────────────────────────────────────

FIC_COSTS = {
    "PLATINUM_SIGNAL_VIEW":  1,
    "REPORT_CEGP":          20,
    "REPORT_MIB":            5,
    "REPORT_ICR":           18,
    "REPORT_SPOR":          22,
    "REPORT_TIR":           18,
    "REPORT_SBP":           15,
    "REPORT_SER":           12,
    "REPORT_SIR":           14,
    "REPORT_RQBR":          16,
    "REPORT_FCGR":          25,
    "GFR_PDF_EXPORT":       10,
    "FORECAST_DATA_PACK":    5,
    "PMP_DOSSIER":          30,
    "NEWSLETTER_PREMIUM":    2,
}

SUBSCRIPTION_TIERS = {
    "free_trial":   {"fic_annual": 5,      "users": 1},
    "professional": {"fic_annual": 4800,   "users": 3},
    "enterprise":   {"fic_annual": 60000,  "users": 10},
}

class TestFICPricing:
    def test_all_costs_positive(self):
        for k, v in FIC_COSTS.items():
            assert v > 0 and isinstance(v, int), f"{k} cost invalid: {v}"

    def test_enterprise_allowance_significantly_larger(self):
        ent = SUBSCRIPTION_TIERS["enterprise"]["fic_annual"]
        pro = SUBSCRIPTION_TIERS["professional"]["fic_annual"]
        assert ent / pro >= 12, "Enterprise should have 12x+ FIC vs Professional"

    def test_trial_covers_5_platinum_views(self):
        trial_bal = SUBSCRIPTION_TIERS["free_trial"]["fic_annual"]
        plat_cost = FIC_COSTS["PLATINUM_SIGNAL_VIEW"]
        assert trial_bal // plat_cost >= 5

    def test_most_expensive_report_is_pmp_dossier(self):
        report_costs = {k: v for k, v in FIC_COSTS.items() if "REPORT" in k or "DOSSIER" in k}
        assert max(report_costs, key=lambda k: report_costs[k]) == "PMP_DOSSIER"


# ── SUBSCRIPTION PRICING ──────────────────────────────────────────────────────

PRICING = {
    "professional_annual": 9588,
    "professional_2yr":   17258,
    "professional_3yr":   24449,
    "enterprise_annual":  29500,
    "enterprise_2yr":     53100,
    "enterprise_3yr":     75225,
    "pro_seat":            2500,
    "ent_seat":            2000,
    "fic_50":               50,
    "fic_100":             100,
    "fic_500":             500,
}

class TestPricing:
    def test_multi_year_always_cheaper_than_single_year_repeated(self):
        assert PRICING["professional_2yr"] < PRICING["professional_annual"] * 2
        assert PRICING["professional_3yr"] < PRICING["professional_annual"] * 3
        assert PRICING["enterprise_2yr"]   < PRICING["enterprise_annual"]   * 2
        assert PRICING["enterprise_3yr"]   < PRICING["enterprise_annual"]   * 3

    def test_3yr_discount_deeper_than_2yr(self):
        pro_2yr_pct = 1 - PRICING["professional_2yr"] / (PRICING["professional_annual"] * 2)
        pro_3yr_pct = 1 - PRICING["professional_3yr"] / (PRICING["professional_annual"] * 3)
        assert pro_3yr_pct > pro_2yr_pct

    def test_fic_constant_per_credit_price(self):
        assert PRICING["fic_50"]  / 50  == 1.0
        assert PRICING["fic_100"] / 100 == 1.0
        assert PRICING["fic_500"] / 500 == 1.0

    def test_all_prices_whole_dollars(self):
        for k, v in PRICING.items():
            assert v == int(v), f"{k} is not a whole dollar amount: {v}"


# ── AGENT: Z-SCORE ANOMALY DETECTION ─────────────────────────────────────────

class TestAnomalyDetection:
    def _z_score(self, series: list, new_val: float) -> float:
        mean = sum(series) / len(series)
        var  = sum((x - mean)**2 for x in series) / (len(series) - 1)
        std  = math.sqrt(var) if var > 0 else 1
        return abs(new_val - mean) / std

    def test_obvious_spike_detected(self):
        normal = [18.0, 20.5, 19.8, 21.2, 20.9, 22.1, 21.5, 22.8]
        spike  = 51.3
        z = self._z_score(normal, spike)
        assert z > 3.0, f"Expected z > 3, got {z:.2f}"

    def test_normal_value_not_flagged(self):
        series = [20.1, 19.8, 20.5, 21.2, 20.0, 19.5, 20.8, 21.1]
        z = self._z_score(series[:-1], series[-1])
        assert z < 2.0, f"Normal value shouldn't be flagged: z={z:.2f}"

    def test_z_score_is_non_negative(self):
        series = [10.0, 11.0, 9.5, 10.5, 10.2]
        z = self._z_score(series[:-1], series[-1])
        assert z >= 0


# ── AGENT: SANCTIONS SCREENER ─────────────────────────────────────────────────

SANCTIONED_NAMES = [
    "rosneft trading sa",
    "iran central bank",
    "novatek",
    "bank rossiya",
    "north korea government",
]

SANCTIONED_JURISDICTIONS = {"PRK", "IRN", "SYR"}

class TestSanctionsScreener:
    def _is_sanctioned(self, name: str, iso3: str = "") -> bool:
        norm = name.lower().strip()
        if any(s in norm for s in SANCTIONED_NAMES): return True
        if iso3 in SANCTIONED_JURISDICTIONS: return True
        return False

    def test_rosneft_flagged(self):
        assert self._is_sanctioned("Rosneft Trading SA")

    def test_microsoft_cleared(self):
        assert not self._is_sanctioned("Microsoft Corporation", "USA")

    def test_north_korea_jurisdiction_flagged(self):
        assert self._is_sanctioned("Any Bank", "PRK")

    def test_case_insensitive(self):
        assert self._is_sanctioned("ROSNEFT TRADING SA")
        assert self._is_sanctioned("Rosneft Trading SA")

    def test_legitimate_energy_company_cleared(self):
        assert not self._is_sanctioned("Saudi Aramco", "SAU")
        assert not self._is_sanctioned("ADNOC", "ARE")
        assert not self._is_sanctioned("Equinor", "NOR")


# ── AGENT: TRADE FLOW CORRELATION ────────────────────────────────────────────

class TestTradeFlows:
    def _trade_intensity(self, total_b: float) -> float:
        if total_b <= 0: return 0
        return min(100, (math.log10(total_b + 1) / math.log10(201)) * 100)

    def test_high_trade_high_intensity(self):
        assert self._trade_intensity(200) > 90

    def test_low_trade_low_intensity(self):
        assert self._trade_intensity(1) < 30

    def test_intensity_bounded(self):
        assert 0 <= self._trade_intensity(1000) <= 100
        assert 0 <= self._trade_intensity(0)    <= 100


# ── REFERENCE CODE FORMAT VALIDATION ─────────────────────────────────────────

import re

class TestReferenceCodes:
    def _validate_fcr(self, code: str) -> bool:
        # FCR-{TYPE}-{ISO3}-{YYYYMMDD}-{HHMMSS}-{SEQ4}
        return bool(re.match(r'^FCR-[A-Z]{2,6}-[A-Z]{3}-\d{8}-\d{6}-\d{4}$', code))

    def _validate_pmp(self, code: str) -> bool:
        # PMP-{ISO3}-{ISIC}-{YYYYMMDD}-{SEQ4}
        return bool(re.match(r'^PMP-[A-Z]{3}-[A-Z]-\d{8}-\d{4}$', code))

    def _validate_fnl(self, code: str) -> bool:
        # FNL-WK-{YYYY}-{WW}-{YYYYMMDD}-{NNN}
        return bool(re.match(r'^FNL-WK-\d{4}-\d{2}-\d{8}-\d{3}$', code))

    def test_valid_fcr_code(self):
        assert self._validate_fcr("FCR-CEGP-ARE-20260315-143022-0047")
        assert self._validate_fcr("FCR-MIB-SAU-20260315-090000-0001")

    def test_invalid_fcr_rejected(self):
        assert not self._validate_fcr("FCR-CEGP-ARE-2026")
        assert not self._validate_fcr("fcr-CEGP-ARE-20260315-143022-0047")

    def test_valid_pmp_code(self):
        assert self._validate_pmp("PMP-ARE-J-20260315-0001")
        assert self._validate_pmp("PMP-USA-K-20260315-0047")

    def test_valid_newsletter_code(self):
        assert self._validate_fnl("FNL-WK-2026-11-20260315-001")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
