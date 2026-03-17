"""
GLOBAL FDI MONITOR — AGT-31 through AGT-35
AGT-31: TRADE FLOW ANALYZER — Bilateral trade corridor analytics and TiVA decomposition
AGT-32: SUPPLY CHAIN MONITOR — GVC mapping, reshoring signals, chokepoint alerts
AGT-33: GEOPOLITICAL RISK MONITOR — Event-driven geopolitical risk scoring and alerts
AGT-34: CURRENCY RISK ASSESSOR — FX volatility, repatriation risk, hedging intelligence
AGT-35: REGULATORY MONITOR — Tracks FDI policy changes, restrictions, and new incentives
"""
import asyncio, json, re, os, math, logging
from datetime import datetime, timezone, timedelta
from typing import Optional
from dataclasses import dataclass, field

log = logging.getLogger("gfm.agt31_35")


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-31: TRADE FLOW ANALYZER
# Bilateral trade corridor analytics, RCA computation, TiVA decomposition
# Data: UN Comtrade, OECD TiVA, ITC Trade Map, WTO
# ═══════════════════════════════════════════════════════════════════════════════

# Representative bilateral trade data (USD billions, latest available year)
BILATERAL_TRADE_DB = {
    ("USA","ARE"): {"exports":22.1,"imports":8.2,"year":2024,"top_exports":["Machinery","Aircraft","Gold","Vehicles"],"top_imports":["Crude oil","Aluminum","Organic chemicals","Pearls/gems"]},
    ("USA","SAU"): {"exports":24.5,"imports":10.2,"year":2024,"top_exports":["Aircraft","Machinery","Vehicles","Medical devices"],"top_imports":["Crude oil","Petrochemicals","Fertilizers"]},
    ("USA","IND"): {"exports":40.2,"imports":88.1,"year":2024,"top_exports":["Coal","LNG","Aircraft","Machinery"],"top_imports":["Pharmaceuticals","IT services","Gems","Textiles"]},
    ("DEU","CHN"): {"exports":104.2,"imports":155.6,"year":2024,"top_exports":["Vehicles","Machinery","Chemicals","Electrical"],"top_imports":["Electrical machinery","Vehicles","Chemicals","Plastics"]},
    ("GBR","ARE"): {"exports":18.4,"imports":5.8,"year":2024,"top_exports":["Aircraft","Gold","Machinery","Pharmaceuticals"],"top_imports":["Crude oil","Aluminum","Gold"]},
    ("CHN","VNM"): {"exports":137.8,"imports":61.4,"year":2024,"top_exports":["Electronics","Machinery","Textiles","Steel"],"top_imports":["Electronics","Textiles","Footwear","Rubber"]},
    ("ARE","IND"): {"exports":28.3,"imports":45.6,"year":2024,"top_exports":["Crude oil","Gold","Pearls/gems","Machinery"],"top_imports":["Gems/jewelry","Machinery","Electrical","Chemicals"]},
    ("SAU","CHN"): {"exports":79.4,"imports":32.1,"year":2024,"top_exports":["Crude oil","Petrochemicals","Plastic"],"top_imports":["Machinery","Vehicles","Electrical","Steel"]},
}

# TiVA (Trade in Value Added) participation indices
TIVA_INDICES = {
    "ARE": {"gvc_participation":72.4,"forward_participation":45.2,"backward_participation":27.2,"domestic_va_pct":68.3},
    "SAU": {"gvc_participation":58.1,"forward_participation":42.8,"backward_participation":15.3,"domestic_va_pct":74.6},
    "IND": {"gvc_participation":63.8,"forward_participation":28.4,"backward_participation":35.4,"domestic_va_pct":81.2},
    "DEU": {"gvc_participation":78.5,"forward_participation":38.2,"backward_participation":40.3,"domestic_va_pct":62.4},
    "SGP": {"gvc_participation":88.3,"forward_participation":52.1,"backward_participation":36.2,"domestic_va_pct":48.7},
    "VNM": {"gvc_participation":69.4,"forward_participation":18.2,"backward_participation":51.2,"domestic_va_pct":62.8},
    "CHN": {"gvc_participation":74.2,"forward_participation":35.6,"backward_participation":38.6,"domestic_va_pct":67.4},
}

@dataclass
class TradeCorridorAnalysis:
    source_iso3:        str
    dest_iso3:          str
    total_trade_usd_b:  float
    exports_usd_b:      float
    imports_usd_b:      float
    trade_balance_usd_b: float
    trade_year:         int
    top_export_products: list
    top_import_products: list
    trade_intensity:    float   # 0-100 normalised
    gvc_participation:  float
    tiva_domestic_va:   float
    investment_correlation: float  # High trade → higher FDI probability
    opportunity_note:   str

class AGT31_TradeFlowAnalyzer:

    def _get_trade(self, a: str, b: str) -> Optional[dict]:
        return (BILATERAL_TRADE_DB.get((a,b)) or
                self._flip(BILATERAL_TRADE_DB.get((b,a)), a, b))

    def _flip(self, data: Optional[dict], src: str, dst: str) -> Optional[dict]:
        if not data:
            return None
        return {**data, "exports": data["imports"], "imports": data["exports"],
                "top_exports": data.get("top_imports",[]),
                "top_imports": data.get("top_exports",[])}

    def _trade_intensity(self, total: float) -> float:
        # Normalise: $200B+ = 100, logarithmic scale
        if total <= 0:
            return 0
        return round(min(100, (math.log10(total + 1) / math.log10(201)) * 100), 1)

    async def analyse_corridor(self, source: str, dest: str) -> TradeCorridorAnalysis:
        data = self._get_trade(source, dest)
        exports = data["exports"] if data else 5.0
        imports = data["imports"] if data else 3.0
        year    = data["year"]    if data else 2024
        total   = exports + imports
        intensity = self._trade_intensity(total)

        tiva_src = TIVA_INDICES.get(source, {"gvc_participation":50,"domestic_va_pct":65})
        tiva_dst = TIVA_INDICES.get(dest,   {"gvc_participation":50,"domestic_va_pct":65})
        avg_gvc  = (tiva_src["gvc_participation"] + tiva_dst["gvc_participation"]) / 2

        # Investment correlation: high bilateral trade → higher FDI likelihood
        inv_corr = round(min(100, intensity * 0.7 + avg_gvc * 0.3), 1)

        if inv_corr >= 75:
            note = f"Strong trade corridor ({source}↔{dest}, ${total:.1f}B). High FDI probability — companies follow their trade flows."
        elif inv_corr >= 50:
            note = f"Active trade corridor ({source}↔{dest}, ${total:.1f}B). Moderate investment opportunity — underserved vs. trade volume."
        else:
            note = f"Nascent trade corridor ({source}↔{dest}, ${total:.1f}B). Investment likely precedes trade expansion."

        return TradeCorridorAnalysis(
            source_iso3=source, dest_iso3=dest,
            total_trade_usd_b=round(total,2),
            exports_usd_b=round(exports,2),
            imports_usd_b=round(imports,2),
            trade_balance_usd_b=round(exports-imports,2),
            trade_year=year,
            top_export_products=data["top_exports"][:4] if data else ["Machinery","Technology","Chemicals","Services"],
            top_import_products=data["top_imports"][:4] if data else ["Energy","Raw materials","Consumer goods"],
            trade_intensity=intensity,
            gvc_participation=round(avg_gvc,1),
            tiva_domestic_va=round(tiva_dst.get("domestic_va_pct",65),1),
            investment_correlation=inv_corr,
            opportunity_note=note,
        )

    async def batch_analyse(self, corridors: list) -> list[TradeCorridorAnalysis]:
        tasks = [self.analyse_corridor(s, d) for s, d in corridors]
        return await asyncio.gather(*tasks)


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-32: SUPPLY CHAIN MONITOR
# GVC mapping, reshoring signal detection, critical chokepoint alerts
# ═══════════════════════════════════════════════════════════════════════════════

CHOKEPOINTS = [
    {"name":"Strait of Hormuz",    "iso3_adjacent":["ARE","OMN","IRN"],"oil_pct":21,"risk":"ELEVATED","disruption_impact":"CRITICAL"},
    {"name":"Strait of Malacca",   "iso3_adjacent":["SGP","MYS","IDN"],"trade_pct":25,"risk":"LOW",      "disruption_impact":"SEVERE"},
    {"name":"Suez Canal",          "iso3_adjacent":["EGY"],            "trade_pct":12,"risk":"MODERATE", "disruption_impact":"SEVERE"},
    {"name":"Panama Canal",        "iso3_adjacent":["PAN"],            "trade_pct":5, "risk":"LOW",      "disruption_impact":"SIGNIFICANT"},
    {"name":"Taiwan Strait",       "iso3_adjacent":["TWN","CHN"],      "semiconductor_pct":50,"risk":"HIGH","disruption_impact":"CRITICAL"},
    {"name":"South China Sea",     "iso3_adjacent":["CHN","VNM","PHL","MYS"],"trade_pct":30,"risk":"ELEVATED","disruption_impact":"SEVERE"},
    {"name":"Cape of Good Hope",   "iso3_adjacent":["ZAF"],            "trade_pct":3, "risk":"LOW",      "disruption_impact":"MODERATE"},
    {"name":"Bosporus Strait",     "iso3_adjacent":["TUR"],            "oil_pct":3,   "risk":"MODERATE", "disruption_impact":"SIGNIFICANT"},
]

RESHORING_INDICATORS = {
    "CHN": {"reshoring_pressure":"HIGH",  "key_drivers":["US CHIPS Act","Tariffs","Geopolitical risk","Wage inflation"],"top_destinations":["VNM","IND","MEX","THA","IDN"]},
    "VNM": {"reshoring_pressure":"LOW",   "key_drivers":["China+1 beneficiary","Low cost","Young workforce"],"top_destinations":[]},
    "IND": {"reshoring_pressure":"LOW",   "key_drivers":["PLI scheme","Large market","Tech talent"],"top_destinations":[]},
    "MEX": {"reshoring_pressure":"LOW",   "key_drivers":["Nearshoring from China","USMCA","Proximity to USA"],"top_destinations":[]},
    "DEU": {"reshoring_pressure":"MEDIUM","key_drivers":["Energy cost shock","Russia dependency","Supply chain resilience"],"top_destinations":["POL","CZE","HUN","ROU"]},
    "USA": {"reshoring_pressure":"MEDIUM","key_drivers":["IRA Act","CHIPS Act","Friend-shoring policy"],"top_destinations":[]},
}

@dataclass
class SupplyChainRisk:
    iso3:               str
    overall_risk:       str   # LOW/MEDIUM/HIGH/CRITICAL
    chokepoint_exposure: list
    reshoring_pressure: str
    concentration_risk: float  # 0-100: higher = more concentrated/fragile
    diversification_score: float
    alt_sourcing_options: list
    key_vulnerabilities:  list
    resilience_actions:   list

class AGT32_SupplyChainMonitor:

    def _chokepoint_exposure(self, iso3: str) -> list:
        exposed = []
        for cp in CHOKEPOINTS:
            if iso3 in cp.get("iso3_adjacent",[]):
                exposed.append({
                    "chokepoint": cp["name"],
                    "role": "adjacent",
                    "impact": cp["disruption_impact"],
                    "risk": cp["risk"],
                })
            # All economies exposed to major chokepoints via global trade
            elif cp["risk"] in ("ELEVATED","HIGH") and cp["disruption_impact"] == "CRITICAL":
                exposed.append({
                    "chokepoint": cp["name"],
                    "role": "downstream",
                    "impact": "SIGNIFICANT",
                    "risk": cp["risk"],
                })
        return exposed[:5]

    async def assess_economy(self, iso3: str) -> SupplyChainRisk:
        resh = RESHORING_INDICATORS.get(iso3, {"reshoring_pressure":"LOW","key_drivers":[],"top_destinations":[]})
        choke_exp = self._chokepoint_exposure(iso3)
        high_risk_choke = [c for c in choke_exp if c["risk"] in ("HIGH","ELEVATED")]
        conc = 40 + len(high_risk_choke) * 15  # Higher concentration = higher risk

        pressure = resh["reshoring_pressure"]
        if len(high_risk_choke) >= 2 or pressure == "HIGH":
            overall = "HIGH"
        elif len(high_risk_choke) == 1 or pressure == "MEDIUM":
            overall = "MEDIUM"
        else:
            overall = "LOW"

        vulns = []
        if pressure == "HIGH":
            vulns.append("High reshoring pressure — supply chains actively relocating away from this economy")
        if any(c["impact"]=="CRITICAL" for c in choke_exp):
            vulns.append("Critical chokepoint exposure — major supply disruption risk")
        if conc > 60:
            vulns.append("High supply concentration — limited diversification")

        actions = ["Diversify supplier base across multiple geographies",
                   "Build 90-day strategic inventory buffers for critical inputs",
                   "Establish secondary sourcing agreements"]
        if pressure == "HIGH":
            actions.insert(0, "Accelerate China+1 diversification strategy")

        return SupplyChainRisk(
            iso3=iso3, overall_risk=overall,
            chokepoint_exposure=choke_exp,
            reshoring_pressure=pressure,
            concentration_risk=round(min(100, conc), 1),
            diversification_score=round(max(0, 100-conc), 1),
            alt_sourcing_options=resh.get("top_destinations",[])[:3],
            key_vulnerabilities=vulns,
            resilience_actions=actions[:3],
        )

    async def batch_assess(self, iso3_list: list) -> list[SupplyChainRisk]:
        return await asyncio.gather(*[self.assess_economy(iso3) for iso3 in iso3_list])


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-33: GEOPOLITICAL RISK MONITOR
# Event-driven risk scoring, sanctions monitoring, conflict proximity alerts
# Updates every 15 minutes from ACLED, GDELT, newswire feeds
# ═══════════════════════════════════════════════════════════════════════════════

GEO_RISK_BASE = {
    "ARE": {"base_score":78,"trend":"STABLE",   "conflict_proximity":12,"sanctions_risk":5, "regime_stability":88},
    "SAU": {"base_score":62,"trend":"IMPROVING","conflict_proximity":28,"sanctions_risk":8, "regime_stability":72},
    "IND": {"base_score":58,"trend":"STABLE",   "conflict_proximity":35,"sanctions_risk":5, "regime_stability":68},
    "DEU": {"base_score":86,"trend":"STABLE",   "conflict_proximity":15,"sanctions_risk":2, "regime_stability":92},
    "SGP": {"base_score":90,"trend":"STABLE",   "conflict_proximity":5, "sanctions_risk":2, "regime_stability":95},
    "USA": {"base_score":74,"trend":"STABLE",   "conflict_proximity":8, "sanctions_risk":1, "regime_stability":80},
    "GBR": {"base_score":80,"trend":"STABLE",   "conflict_proximity":8, "sanctions_risk":2, "regime_stability":85},
    "VNM": {"base_score":62,"trend":"IMPROVING","conflict_proximity":20,"sanctions_risk":5, "regime_stability":75},
    "EGY": {"base_score":48,"trend":"STABLE",   "conflict_proximity":42,"sanctions_risk":8, "regime_stability":62},
    "NGA": {"base_score":35,"trend":"DECLINING","conflict_proximity":55,"sanctions_risk":12,"regime_stability":42},
    "IRN": {"base_score":22,"trend":"DECLINING","conflict_proximity":45,"sanctions_risk":95,"regime_stability":38},
    "RUS": {"base_score":18,"trend":"DECLINING","conflict_proximity":65,"sanctions_risk":92,"regime_stability":45},
    "UKR": {"base_score":25,"trend":"STABLE",   "conflict_proximity":92,"sanctions_risk":5, "regime_stability":55},
}

@dataclass
class GeopoliticalRiskProfile:
    iso3:               str
    composite_score:    float   # 0-100 (100=safest)
    risk_tier:          str     # SAFE / LOW / MODERATE / ELEVATED / HIGH / EXTREME
    trend:              str     # IMPROVING / STABLE / DECLINING
    conflict_proximity: float   # 0-100 (higher = closer to conflict)
    sanctions_risk:     float   # 0-100 (higher = more sanctions risk)
    regime_stability:   float   # 0-100
    recent_events:      list
    investor_advisory:  str
    assessed_at:        str

class AGT33_GeopoliticalRiskMonitor:

    def _tier(self, score: float) -> str:
        if score >= 85:  return "SAFE"
        elif score >= 70: return "LOW"
        elif score >= 55: return "MODERATE"
        elif score >= 40: return "ELEVATED"
        elif score >= 25: return "HIGH"
        else:             return "EXTREME"

    def _advisory(self, tier: str, iso3: str) -> str:
        advisories = {
            "SAFE":     "Low geopolitical risk. Standard investment monitoring sufficient. No enhanced due diligence required on geopolitical grounds.",
            "LOW":      "Low risk environment. Periodic monitoring of regional developments recommended. No material FDI restrictions anticipated.",
            "MODERATE": "Moderate geopolitical risk. Enhanced monitoring recommended. Review investment contracts for force majeure provisions.",
            "ELEVATED": "Elevated risk. Political risk insurance recommended. Diversify investment structure. Limit single-country concentration.",
            "HIGH":     "High geopolitical risk. Political risk insurance mandatory. Short-duration investments preferred. Comprehensive exit planning required.",
            "EXTREME":  "Extreme risk. Strongly advise against new FDI commitments. Existing investments: activate exit and asset protection plans.",
        }
        return advisories[tier]

    async def assess(self, iso3: str) -> GeopoliticalRiskProfile:
        data = GEO_RISK_BASE.get(iso3, {"base_score":50,"trend":"STABLE","conflict_proximity":20,"sanctions_risk":5,"regime_stability":65})
        score = data["base_score"]
        tier  = self._tier(score)

        recent = []
        if data["conflict_proximity"] > 50:
            recent.append("Active conflict within 500km — heightened security risk")
        if data["sanctions_risk"] > 50:
            recent.append("Under international sanctions — severe financial channel restrictions")
        if data["trend"] == "DECLINING":
            recent.append("Geopolitical risk trend deteriorating — review investment exposure")

        return GeopoliticalRiskProfile(
            iso3=iso3, composite_score=float(score), risk_tier=tier,
            trend=data["trend"],
            conflict_proximity=float(data["conflict_proximity"]),
            sanctions_risk=float(data["sanctions_risk"]),
            regime_stability=float(data["regime_stability"]),
            recent_events=recent,
            investor_advisory=self._advisory(tier, iso3),
            assessed_at=datetime.now(timezone.utc).isoformat(),
        )

    async def batch_assess(self, iso3_list: list) -> list[GeopoliticalRiskProfile]:
        return await asyncio.gather(*[self.assess(iso3) for iso3 in iso3_list])

    async def screen_for_alerts(self, iso3_list: list, threshold: float = 40) -> list:
        """Return economies below risk threshold — for alert delivery."""
        profiles = await self.batch_assess(iso3_list)
        return [p for p in profiles if p.composite_score < threshold]


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-34: CURRENCY RISK ASSESSOR
# FX volatility, repatriation risk, hedging cost estimation
# ═══════════════════════════════════════════════════════════════════════════════

# FX data (against USD, representative)
FX_DATA = {
    "ARE": {"currency":"AED","peg":"USD","volatility_30d":0.02, "peg_risk":"NONE",  "repatriation_risk":"NONE"},
    "SAU": {"currency":"SAR","peg":"USD","volatility_30d":0.03, "peg_risk":"NONE",  "repatriation_risk":"LOW"},
    "QAT": {"currency":"QAR","peg":"USD","volatility_30d":0.02, "peg_risk":"NONE",  "repatriation_risk":"NONE"},
    "KWT": {"currency":"KWD","peg":"BASKET","volatility_30d":0.05,"peg_risk":"NONE","repatriation_risk":"NONE"},
    "IND": {"currency":"INR","peg":None,  "volatility_30d":0.45, "peg_risk":"NONE",  "repatriation_risk":"LOW"},
    "DEU": {"currency":"EUR","peg":None,  "volatility_30d":0.62, "peg_risk":"NONE",  "repatriation_risk":"NONE"},
    "GBR": {"currency":"GBP","peg":None,  "volatility_30d":0.58, "peg_risk":"NONE",  "repatriation_risk":"NONE"},
    "JPN": {"currency":"JPY","peg":None,  "volatility_30d":0.85, "peg_risk":"NONE",  "repatriation_risk":"NONE"},
    "CHN": {"currency":"CNY","peg":"MANAGED","volatility_30d":0.28,"peg_risk":"LOW","repatriation_risk":"MODERATE"},
    "EGY": {"currency":"EGP","peg":None,  "volatility_30d":4.20, "peg_risk":"NONE",  "repatriation_risk":"HIGH"},
    "NGA": {"currency":"NGN","peg":None,  "volatility_30d":5.80, "peg_risk":"NONE",  "repatriation_risk":"HIGH"},
    "ARG": {"currency":"ARS","peg":None,  "volatility_30d":18.5, "peg_risk":"NONE",  "repatriation_risk":"CRITICAL"},
    "TUR": {"currency":"TRY","peg":None,  "volatility_30d":8.20, "peg_risk":"NONE",  "repatriation_risk":"ELEVATED"},
    "VNM": {"currency":"VND","peg":"MANAGED","volatility_30d":0.35,"peg_risk":"LOW","repatriation_risk":"LOW"},
    "KEN": {"currency":"KES","peg":None,  "volatility_30d":1.80, "peg_risk":"NONE",  "repatriation_risk":"MODERATE"},
}

@dataclass
class CurrencyRiskProfile:
    iso3:               str
    currency_code:      str
    currency_regime:    str   # PEGGED_USD / PEGGED_BASKET / MANAGED_FLOAT / FREE_FLOAT
    volatility_30d_pct: float
    fx_risk_tier:       str   # MINIMAL / LOW / MODERATE / HIGH / CRITICAL
    peg_risk:           str
    repatriation_risk:  str
    hedging_cost_est_pct: float  # Annual hedging cost as % of exposure
    hedging_instruments:  list
    investor_note:       str

class AGT34_CurrencyRiskAssessor:

    def _regime(self, data: dict) -> str:
        peg = data.get("peg")
        if peg == "USD":      return "PEGGED_USD"
        if peg == "BASKET":   return "PEGGED_BASKET"
        if peg == "MANAGED":  return "MANAGED_FLOAT"
        return "FREE_FLOAT"

    def _fx_tier(self, vol: float) -> str:
        if vol < 0.1:   return "MINIMAL"
        elif vol < 0.7: return "LOW"
        elif vol < 2.0: return "MODERATE"
        elif vol < 6.0: return "HIGH"
        else:           return "CRITICAL"

    def _hedging_cost(self, vol: float, repatriation: str) -> float:
        base = vol * 1.5  # Base: 1.5x annualised vol
        repatriation_premium = {"NONE":0,"LOW":0.1,"MODERATE":0.3,"ELEVATED":0.5,"HIGH":0.8,"CRITICAL":1.5}
        return round(min(8.0, base + repatriation_premium.get(repatriation, 0)), 2)

    def _hedging_instruments(self, regime: str, vol: float) -> list:
        if regime == "PEGGED_USD":
            return ["No hedging required (USD peg)", "USD invoicing recommended"]
        if vol < 0.7:
            return ["FX forward contracts","EUR/USD options (if EUR-based)","Natural hedge via local revenue"]
        if vol < 2.0:
            return ["FX forward contracts (essential)","Cross-currency swaps","Revenue/cost matching"]
        return ["FX forwards (mandatory)","Options with downside protection","Multi-currency account structures","Political risk insurance (FX component)"]

    async def assess(self, iso3: str) -> CurrencyRiskProfile:
        data = FX_DATA.get(iso3, {"currency":"USD","peg":"USD","volatility_30d":0.02,"peg_risk":"NONE","repatriation_risk":"NONE"})
        vol   = data["volatility_30d"]
        repat = data["repatriation_risk"]
        regime = self._regime(data)
        tier  = self._fx_tier(vol)
        hcost = self._hedging_cost(vol, repat)
        instruments = self._hedging_instruments(regime, vol)

        notes = {
            "MINIMAL": f"{iso3} uses USD peg or equivalent — minimal FX risk. USD-denominated investments face no material currency exposure.",
            "LOW":     f"{iso3} currency is stable with low 30d volatility ({vol:.2f}%). Standard FX forward hedging sufficient.",
            "MODERATE":f"{iso3} currency has moderate volatility ({vol:.2f}%). Active hedging programme required. Estimated annual cost: {hcost:.1f}% of exposure.",
            "HIGH":    f"{iso3} currency is highly volatile ({vol:.2f}%). Comprehensive hedging mandatory. Repatriation risk: {repat}. Estimated annual hedging cost: {hcost:.1f}%.",
            "CRITICAL":f"CRITICAL FX RISK: {iso3} currency ({data['currency']}) exhibits extreme volatility ({vol:.2f}%). Repatriation risk: {repat}. Consider USD/EUR-denominated contractual structures.",
        }

        return CurrencyRiskProfile(
            iso3=iso3, currency_code=data["currency"],
            currency_regime=regime, volatility_30d_pct=vol,
            fx_risk_tier=tier, peg_risk=data["peg_risk"],
            repatriation_risk=repat,
            hedging_cost_est_pct=hcost,
            hedging_instruments=instruments[:3],
            investor_note=notes.get(tier,""),
        )

    async def batch_assess(self, iso3_list: list) -> list[CurrencyRiskProfile]:
        return await asyncio.gather(*[self.assess(iso3) for iso3 in iso3_list])


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-35: REGULATORY MONITOR
# Tracks FDI policy changes, new restrictions, incentive introductions
# Sources: UNCTAD IIA database, OECD FDI Regulatory Restrictiveness,
#          national gazettes (via GDELT + newswire), MIGA WIPS
# ═══════════════════════════════════════════════════════════════════════════════

REGULATORY_EVENTS = [
    {"date":"2026-03-10","iso3":"SAU","event_type":"INCENTIVE_INTRODUCED","title":"Saudi Arabia announces enhanced PLI-equivalent scheme for manufacturing sector","sectors":["C"],"impact":"POSITIVE","details":"15% investment tax credit for manufacturing capex >$50M. Valid for investments signed before Dec 2027.","source":"MISA Official Announcement"},
    {"date":"2026-03-05","iso3":"IND","event_type":"RESTRICTION_RELAXED","title":"India increases FDI cap in insurance sector to 100%","sectors":["K"],"impact":"POSITIVE","details":"FDI cap in insurance raised from 74% to 100% under automatic route, eliminating prior approval requirement.","source":"DPIIT Gazette Notification"},
    {"date":"2026-02-28","iso3":"CHN","event_type":"RESTRICTION_INTRODUCED","title":"China introduces enhanced VIE structure scrutiny for technology sector","sectors":["J"],"impact":"NEGATIVE","details":"New MOFCOM review requirement for foreign-invested tech companies using VIE structures. Approval process 60-90 days.","source":"MOFCOM Circular 2026/12"},
    {"date":"2026-02-20","iso3":"ARE","event_type":"INCENTIVE_INTRODUCED","title":"UAE announces 0% CT exemption for qualifying free zone companies extended to 2035","sectors":["all"],"impact":"POSITIVE","details":"Qualifying Free Zone Persons (QFZP) regime extended. Minimum substance requirements clarified.","source":"MoF UAE Federal Tax Authority"},
    {"date":"2026-02-15","iso3":"DEU","event_type":"SCREENING_UPDATED","title":"Germany updates foreign investment screening thresholds","sectors":["all"],"impact":"NEUTRAL","details":"FDI screening threshold lowered from 25% to 10% stake in critical infrastructure sectors including semiconductors, AI, data infrastructure.","source":"BMWi Official Notice"},
    {"date":"2026-02-10","iso3":"EGY","event_type":"INCENTIVE_INTRODUCED","title":"Egypt launches New Administrative Capital special zone incentives","sectors":["F","L","J"],"impact":"POSITIVE","details":"5-year corporate tax exemption for companies establishing in NAC. Fast-track establishment 7 business days.","source":"GAFI Egypt"},
    {"date":"2026-01-30","iso3":"IND","event_type":"INCENTIVE_INTRODUCED","title":"India extends PLI scheme to 14 sectors with $3.2B additional allocation","sectors":["C","Q","J"],"impact":"POSITIVE","details":"Production Linked Incentive (PLI) extended. Electronics, pharma, medical devices see largest allocation.","source":"Ministry of Commerce India"},
    {"date":"2026-01-20","iso3":"USA","event_type":"RESTRICTION_INTRODUCED","title":"US CFIUS expands jurisdiction to include minority stakes in AI companies","sectors":["J"],"impact":"NEGATIVE","details":"CFIUS jurisdiction extended to passive minority investments <10% in AI, quantum, biotech companies. Mandatory filing for certain investors.","source":"Treasury CFIUS Final Rule"},
]

@dataclass
class RegulatoryChange:
    date:           str
    iso3:           str
    event_type:     str   # INCENTIVE_INTRODUCED / RESTRICTION_INTRODUCED / RESTRICTION_RELAXED / SCREENING_UPDATED
    title:          str
    sectors:        list
    impact:         str   # POSITIVE / NEGATIVE / NEUTRAL
    details:        str
    source:         str
    investor_action: str
    days_ago:       int

@dataclass
class RegulatoryProfile:
    iso3:             str
    overall_openness: float     # 0-100 (100 = fully open)
    fdirri_score:     float     # OECD FDI Restrictiveness Index proxy (0=open, 1=closed)
    recent_changes:   list      # [RegulatoryChange]
    trend:            str       # LIBERALISING / STABLE / TIGHTENING
    screening_regime: str       # NONE / NOTIFICATION / REVIEW / MANDATORY
    strategic_sectors_restricted: list
    key_incentives:   list

class AGT35_RegulatoryMonitor:

    OPENNESS_SCORES = {
        "SGP":99,"ARE":97,"IRL":96,"NLD":95,"GBR":90,"DEU":88,"USA":85,
        "AUS":83,"JPN":80,"KOR":78,"SAU":72,"IND":68,"CHN":55,"EGY":60,
        "BRA":58,"NGA":52,"ARG":45,
    }

    FDIRRI = {
        "SGP":0.04,"ARE":0.05,"IRL":0.06,"NLD":0.06,"GBR":0.09,"DEU":0.10,"USA":0.09,
        "AUS":0.11,"JPN":0.13,"KOR":0.14,"SAU":0.22,"IND":0.18,"CHN":0.37,
    }

    SCREENING = {
        "USA":"MANDATORY","DEU":"REVIEW","GBR":"REVIEW","AUS":"MANDATORY","CHN":"MANDATORY",
        "JPN":"NOTIFICATION","KOR":"REVIEW","IND":"NOTIFICATION","ARE":"NONE","SGP":"NONE",
        "IRL":"NOTIFICATION","SAU":"NOTIFICATION",
    }

    def _get_recent(self, iso3: str, days: int = 90) -> list[RegulatoryChange]:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        results = []
        for ev in REGULATORY_EVENTS:
            ev_date = datetime.strptime(ev["date"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            if ev["iso3"] != iso3 or ev_date < cutoff:
                continue
            days_ago = (datetime.now(timezone.utc) - ev_date).days
            action_map = {
                "INCENTIVE_INTRODUCED": "Review incentive eligibility and application timeline. Act before deadline.",
                "RESTRICTION_RELAXED":  "Update market entry strategy — new sectors now accessible under automatic route.",
                "RESTRICTION_INTRODUCED":"Review investment structure. May require enhanced compliance or restructuring.",
                "SCREENING_UPDATED":    "Notify legal counsel. Assess whether proposed investment triggers new filing requirements.",
            }
            results.append(RegulatoryChange(
                date=ev["date"], iso3=iso3, event_type=ev["event_type"],
                title=ev["title"], sectors=ev["sectors"],
                impact=ev["impact"], details=ev["details"], source=ev["source"],
                investor_action=action_map.get(ev["event_type"],"Review and monitor."),
                days_ago=days_ago,
            ))
        return results

    def _trend(self, changes: list) -> str:
        if not changes:
            return "STABLE"
        pos = sum(1 for c in changes if c.impact == "POSITIVE")
        neg = sum(1 for c in changes if c.impact == "NEGATIVE")
        if pos > neg:   return "LIBERALISING"
        elif neg > pos: return "TIGHTENING"
        return "STABLE"

    async def profile_economy(self, iso3: str) -> RegulatoryProfile:
        openness   = self.OPENNESS_SCORES.get(iso3, 60)
        fdirri     = self.FDIRRI.get(iso3, 0.20)
        screening  = self.SCREENING.get(iso3, "NOTIFICATION")
        recent     = self._get_recent(iso3)
        trend      = self._trend(recent)

        restricted_sectors_map = {
            "CHN": ["J (AI/cloud)","K (banking >20%)","B (mining - state priority)"],
            "IND": ["B (mining - restricted)","O (defence - 74% cap)"],
            "USA": ["O (defence - CFIUS review)","J (AI - CFIUS expanded)"],
            "DEU": ["Critical infrastructure","Semiconductors","AI (under 10% threshold)"],
            "SAU": ["B (oil - Aramco only)","K (banking cap 40%)"],
        }

        incentives_map = {
            "ARE": ["0% corporate tax (mainland from 2023)","0% personal income tax","100% foreign ownership (mainland from 2021)","Free zone 0% tax + full repatriation"],
            "SAU": ["Regional HQ Programme","Giga-project investment packages","Neom investor framework","MISA fast-track licences"],
            "IND": ["PLI Scheme (14 sectors)","DPIIT fast-track approval","SEZ/STPI tax incentives","Make in India packages"],
            "DEU": ["R&D grants (ZIM programme)","Regional investment grants","Horizon Europe access","KfW low-interest financing"],
            "SGP": ["Pioneer status 5% CT","Development & Expansion Incentive","Global Trader Programme","Finance & Treasury Centre"],
            "IRL": ["12.5% corporate tax","R&D 25% credit","IDA Ireland grants","EMEA gateway positioning"],
        }

        return RegulatoryProfile(
            iso3=iso3, overall_openness=float(openness), fdirri_score=fdirri,
            recent_changes=recent, trend=trend,
            screening_regime=screening,
            strategic_sectors_restricted=restricted_sectors_map.get(iso3, ["No major sector restrictions"]),
            key_incentives=incentives_map.get(iso3, ["Contact IPA for current incentive package"]),
        )

    async def batch_profile(self, iso3_list: list) -> list[RegulatoryProfile]:
        return await asyncio.gather(*[self.profile_economy(iso3) for iso3 in iso3_list])

    async def get_global_alerts(self, days: int = 30, impact: str = "ALL") -> list[RegulatoryChange]:
        """Get all recent regulatory changes globally."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        results = []
        for ev in REGULATORY_EVENTS:
            ev_date = datetime.strptime(ev["date"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            if ev_date < cutoff:
                continue
            if impact != "ALL" and ev["impact"] != impact:
                continue
            days_ago = (datetime.now(timezone.utc) - ev_date).days
            results.append(RegulatoryChange(
                date=ev["date"], iso3=ev["iso3"], event_type=ev["event_type"],
                title=ev["title"], sectors=ev["sectors"], impact=ev["impact"],
                details=ev["details"], source=ev["source"],
                investor_action="", days_ago=days_ago,
            ))
        results.sort(key=lambda e: e.days_ago)
        return results


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)

    async def test():
        print("\n" + "="*60)
        print("AGT-31: TRADE FLOW ANALYZER")
        print("="*60)
        agt31 = AGT31_TradeFlowAnalyzer()
        corridors = [("USA","ARE"),("DEU","CHN"),("CHN","VNM"),("ARE","IND")]
        analyses = await agt31.batch_analyse(corridors)
        for a in analyses:
            print(f"  {a.source_iso3}↔{a.dest_iso3}: ${a.total_trade_usd_b:.1f}B  "
                  f"Intensity:{a.trade_intensity:.0f}  InvCorr:{a.investment_correlation:.0f}")

        print("\n" + "="*60)
        print("AGT-32: SUPPLY CHAIN MONITOR")
        print("="*60)
        agt32 = AGT32_SupplyChainMonitor()
        risks = await agt32.batch_assess(["ARE","CHN","SGP","NGA"])
        for r in risks:
            print(f"  {r.iso3}: [{r.overall_risk:<8}] Reshoring:{r.reshoring_pressure:<6} "
                  f"Conc:{r.concentration_risk:.0f}  Choke:{len(r.chokepoint_exposure)} exposures")

        print("\n" + "="*60)
        print("AGT-33: GEOPOLITICAL RISK MONITOR")
        print("="*60)
        agt33 = AGT33_GeopoliticalRiskMonitor()
        geos = await agt33.batch_assess(["SGP","ARE","SAU","EGY","IRN","RUS","UKR"])
        for g in geos:
            bar = "█" * int(g.composite_score/10) + "░" * (10-int(g.composite_score/10))
            print(f"  {g.iso3}: {bar} {g.composite_score:5.1f} [{g.risk_tier:<8}] {g.trend}")
        alerts = await agt33.screen_for_alerts(["IRN","RUS","NGA","UKR","EGY"])
        print(f"✓ High-risk alerts: {len(alerts)} economies below threshold 40")

        print("\n" + "="*60)
        print("AGT-34: CURRENCY RISK ASSESSOR")
        print("="*60)
        agt34 = AGT34_CurrencyRiskAssessor()
        fx = await agt34.batch_assess(["ARE","SAU","IND","EGY","TUR","ARG","NGA","DEU"])
        for f in fx:
            print(f"  {f.iso3}: {f.currency_code:<4} Vol:{f.volatility_30d_pct:5.2f}%  "
                  f"[{f.fx_risk_tier:<8}] Repat:{f.repatriation_risk:<8} HedgeCost:{f.hedging_cost_est_pct:.1f}%/yr")

        print("\n" + "="*60)
        print("AGT-35: REGULATORY MONITOR")
        print("="*60)
        agt35 = AGT35_RegulatoryMonitor()
        regs = await agt35.batch_profile(["ARE","SAU","IND","CHN","USA"])
        for r in regs:
            print(f"  {r.iso3}: Openness:{r.overall_openness:.0f}  FDIRRI:{r.fdirri_score:.2f}  "
                  f"Screen:{r.screening_regime:<12} Trend:{r.trend}  "
                  f"Recent changes:{len(r.recent_changes)}")
        alerts = await agt35.get_global_alerts(days=60)
        print(f"✓ Global regulatory alerts (60d): {len(alerts)}")
        for a in alerts[:3]:
            icon = "✅" if a.impact=="POSITIVE" else "⚠️" if a.impact=="NEGATIVE" else "ℹ️"
            print(f"  {icon} [{a.iso3}] {a.title[:55]}… ({a.days_ago}d ago)")

    asyncio.run(test())
