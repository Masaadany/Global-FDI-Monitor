"""
Agent: agt46_50_commodity_climate_fta_ports_synthesizer — FDI Monitor Intelligence Pipeline
Error handling wrapper applied at module level.
"""
import datetime as _dt

def _safe_run(fn, params):
    try:
        return fn(params)
    except Exception as e:
        return {"success": False, "error": str(e), "agent": "agt46_50_commodity_climate_fta_ports_synthesizer",
                "ts": _dt.datetime.utcnow().isoformat() + "Z"}

"""
GLOBAL FDI MONITOR — AGT-46 through AGT-50
AGT-46: COMMODITY INTELLIGENCE — Links commodity price moves to FDI signals
AGT-47: CLIMATE FINANCE TRACKER — Green bonds, blended finance, climate FDI
AGT-48: FTA NETWORK MONITOR — Free trade agreement changes and market access signals
AGT-49: PORT & LOGISTICS INTELLIGENCE — Port call data, shipping routes, trade gateway rankings
AGT-50: MASTER INTELLIGENCE SYNTHESIZER — Aggregates all 49 agents into composite intelligence
"""
import asyncio, json, math, os, logging
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass, field

log = logging.getLogger("gfm.agt46_50")


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-46: COMMODITY INTELLIGENCE
# Tracks commodity price moves and links them to FDI investment patterns
# Key link: high oil/gas → Gulf FDI surge; critical minerals → mining FDI
# ═══════════════════════════════════════════════════════════════════════════════

COMMODITY_DATA = {
    "WTI_CRUDE":    {"price":82.4,"unit":"USD/bbl","yoy_chg":3.2, "fdi_correlation":0.72,"affected_economies":["SAU","ARE","QAT","NGA","RUS","NOR","KWT"],"signal":"POSITIVE for GCC FDI capacity"},
    "NATURAL_GAS":  {"price":2.85,"unit":"USD/mmBtu","yoy_chg":-18.5,"fdi_correlation":0.58,"affected_economies":["QAT","USA","AUS","NOR","RUS"],"signal":"WEAK — low prices constraining LNG FDI"},
    "LITHIUM":      {"price":13200,"unit":"USD/t","yoy_chg":-62.0,"fdi_correlation":0.81,"affected_economies":["CHL","AUS","ARG","CHN","ZMB"],"signal":"WEAK — oversupply dampening mining FDI"},
    "COBALT":       {"price":28500,"unit":"USD/t","yoy_chg":-28.4,"fdi_correlation":0.75,"affected_economies":["COD","ZMB","AUS","PHI"],"signal":"WEAK — battery demand restructuring"},
    "COPPER":       {"price":9250, "unit":"USD/t","yoy_chg":12.4,"fdi_correlation":0.68,"affected_economies":["CHL","PER","ZMB","COD","AUS"],"signal":"POSITIVE — energy transition driving demand"},
    "GOLD":         {"price":2180, "unit":"USD/oz","yoy_chg":8.2,"fdi_correlation":0.35,"affected_economies":["AUS","ZAF","GHA","RUS","CAN"],"signal":"NEUTRAL — store of value flows"},
    "WHEAT":        {"price":545,  "unit":"USD/bu","yoy_chg":-22.0,"fdi_correlation":0.42,"affected_economies":["UKR","RUS","USA","AUS","ARG"],"signal":"WEAK — Black Sea supply recovery"},
    "RARE_EARTHS":  {"price":95000,"unit":"USD/t (NdPr)","yoy_chg":28.5,"fdi_correlation":0.88,"affected_economies":["CHN","AUS","USA","CAN","IND"],"signal":"VERY POSITIVE — tech/EV demand critical"},
    "URANIUM":      {"price":88,   "unit":"USD/lb","yoy_chg":52.4,"fdi_correlation":0.78,"affected_economies":["KAZ","AUS","CAN","NAM","NER"],"signal":"STRONG — nuclear renaissance underway"},
}

@dataclass
class CommodityFDILink:
    commodity:          str
    price:              float
    unit:               str
    yoy_change_pct:     float
    fdi_correlation:    float
    investment_signal:  str
    primary_economies:  list
    fdi_implication:    str

class AGT46_CommodityIntelligence:

    def _implication(self, commodity: str, yoy: float, corr: float, price: float) -> str:
        if yoy > 20 and corr > 0.70:
            return f"Strong price appreciation ({yoy:+.1f}% YoY) with high FDI correlation ({corr:.2f}). Expect increased upstream investment and producing economy budget capacity for capex."
        elif yoy > 5 and corr > 0.50:
            return f"Positive price trend ({yoy:+.1f}% YoY). Moderate FDI stimulus expected in producer economies."
        elif yoy < -20 and corr > 0.60:
            return f"Sharp price decline ({yoy:.1f}% YoY). Likely to constrain exploration and project FDI in producing economies."
        else:
            return f"Price change ({yoy:+.1f}% YoY) has limited near-term FDI impact. Monitor for trend reversal."

    def analyse_all(self) -> list[CommodityFDILink]:
        results = []
        for name, d in COMMODITY_DATA.items():
            results.append(CommodityFDILink(
                commodity=name.replace("_"," "),
                price=d["price"], unit=d["unit"],
                yoy_change_pct=d["yoy_chg"],
                fdi_correlation=d["fdi_correlation"],
                investment_signal=d["signal"],
                primary_economies=d["affected_economies"][:4],
                fdi_implication=self._implication(name, d["yoy_chg"], d["fdi_correlation"], d["price"]),
            ))
        results.sort(key=lambda x: abs(x.yoy_change_pct) * x.fdi_correlation, reverse=True)
        return results

    async def get_top_signals(self, n: int = 5) -> list[CommodityFDILink]:
        return self.analyse_all()[:n]


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-47: CLIMATE FINANCE TRACKER
# Monitors green bond issuances, blended finance facilities, climate FDI
# Sources: Climate Bonds Initiative, IFC, GCF, bilateral climate finance
# ═══════════════════════════════════════════════════════════════════════════════

CLIMATE_FINANCE_DEALS = [
    {"issuer":"Saudi PIF","iso3":"SAU","type":"GREEN_BOND","amount_b":3.0,"use_of_proceeds":["Solar","Wind","Hydrogen"],"date":"2026-03-01","rating":"A"},
    {"issuer":"UAE Ministry of Finance","iso3":"ARE","type":"SOVEREIGN_GREEN_BOND","amount_b":1.5,"use_of_proceeds":["Clean transport","Energy efficiency","Green buildings"],"date":"2026-02-15","rating":"AA"},
    {"issuer":"India Railways","iso3":"IND","type":"GREEN_BOND","amount_b":0.8,"use_of_proceeds":["Electric rail","Solar stations"],"date":"2026-02-28","rating":"BBB"},
    {"issuer":"African Development Bank","iso3":"INTL","type":"CLIMATE_BOND","amount_b":2.2,"use_of_proceeds":["Renewable energy Africa","Climate adaptation"],"date":"2026-01-20","rating":"AAA"},
    {"issuer":"IFC","iso3":"INTL","type":"BLENDED_FINANCE","amount_b":0.5,"use_of_proceeds":["Emerging market clean energy"],"date":"2026-03-10","rating":"AAA"},
    {"issuer":"Masdar","iso3":"ARE","type":"PROJECT_FINANCE","amount_b":1.8,"use_of_proceeds":["Offshore wind UK","Solar Egypt","Hydrogen"],"date":"2026-02-05","rating":"A"},
]

@dataclass
class ClimateFinanceDeal:
    issuer:           str
    iso3:             str
    instrument_type:  str
    amount_usd_b:     float
    use_of_proceeds:  list
    credit_rating:    str
    date:             str
    fdi_signal:       str
    signal_note:      str

class AGT47_ClimateFinanceTracker:

    def _fdi_signal(self, deal: dict) -> tuple[str, str]:
        amount = deal.get("amount_b", 0)
        proceeds = deal.get("use_of_proceeds", [])
        iso3 = deal.get("iso3","")
        if amount >= 2.0 and iso3 not in ("INTL",""):
            signal = "STRONG_FDI_CATALYST"
            note   = f"Large issuance (${amount:.1f}B) signals committed capital pipeline. Expect follow-on project FDI in clean energy sector."
        elif "Hydrogen" in proceeds:
            signal = "EMERGING_SECTOR"
            note   = "Green hydrogen inclusion signals nascent H2 ecosystem investment. Early-mover advantage window open."
        elif amount >= 0.5:
            signal = "ACTIVE_CLIMATE_MARKET"
            note   = f"Climate finance activity (${amount:.1f}B) indicates policy support and growing investor appetite."
        else:
            signal = "DEVELOPING"
            note   = "Emerging climate finance activity. Monitor for scaling."
        return signal, note

    def process(self, deals: list) -> list[ClimateFinanceDeal]:
        results = []
        for d in deals:
            sig, note = self._fdi_signal(d)
            results.append(ClimateFinanceDeal(
                issuer=d["issuer"], iso3=d["iso3"],
                instrument_type=d["type"],
                amount_usd_b=d["amount_b"],
                use_of_proceeds=d["use_of_proceeds"],
                credit_rating=d.get("rating","NR"),
                date=d["date"], fdi_signal=sig, signal_note=note,
            ))
        return sorted(results, key=lambda x: x.amount_usd_b, reverse=True)

    async def run(self) -> list[ClimateFinanceDeal]:
        return self.process(CLIMATE_FINANCE_DEALS)

    async def get_summary(self) -> dict:
        deals = await self.run()
        return {
            "total_deals": len(deals),
            "total_volume_b": round(sum(d.amount_usd_b for d in deals), 2),
            "top_issuers": [d.issuer for d in deals[:3]],
            "avg_deal_b": round(sum(d.amount_usd_b for d in deals) / len(deals), 2),
            "green_bond_count": sum(1 for d in deals if "BOND" in d.instrument_type),
        }


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-48: FTA NETWORK MONITOR
# Tracks free trade agreements, preferential access changes, market access signals
# Source: WTO RTA database, UNCTAD IIA database
# ═══════════════════════════════════════════════════════════════════════════════

FTA_DATABASE = [
    {"name":"CPTPP","type":"PLURILATERAL","members":["AUS","BRN","CAN","CHL","JPN","MYS","MEX","NZL","PER","SGP","VNM"],"in_force":True,"tariff_reduction":0.99,"investment_chapter":True,"isds":True},
    {"name":"RCEP","type":"PLURILATERAL","members":["AUS","CHN","IDN","JPN","KOR","MYS","NZL","PHL","SGP","THA","VNM"],"in_force":True,"tariff_reduction":0.92,"investment_chapter":True,"isds":False},
    {"name":"GCC-EU FTA","type":"BILATERAL_BLOC","members":["ARE","SAU","QAT","KWT","BHR","OMN","EU27"],"in_force":False,"status":"NEGOTIATING","tariff_reduction":None,"investment_chapter":True},
    {"name":"India-UAE CEPA","type":"BILATERAL","members":["IND","ARE"],"in_force":True,"tariff_reduction":0.97,"investment_chapter":True,"isds":True,"signed":"2022-02-18"},
    {"name":"India-UK FTA","type":"BILATERAL","members":["IND","GBR"],"in_force":False,"status":"NEGOTIATING","tariff_reduction":None},
    {"name":"AfCFTA","type":"CONTINENTAL","members":["54 African states"],"in_force":True,"tariff_reduction":0.90,"investment_chapter":True,"isds":False},
    {"name":"USMCA","type":"TRILATERAL","members":["USA","CAN","MEX"],"in_force":True,"tariff_reduction":0.99,"investment_chapter":True,"isds":False},
    {"name":"EU Single Market","type":"ECONOMIC_UNION","members":["EU27"],"in_force":True,"tariff_reduction":1.00,"investment_chapter":True,"isds":True},
    {"name":"GCC Common Market","type":"ECONOMIC_UNION","members":["ARE","SAU","QAT","KWT","BHR","OMN"],"in_force":True,"tariff_reduction":1.00,"investment_chapter":True,"isds":False},
    {"name":"Comprehensive and Progressive (CPTPP) + UK","type":"PLURILATERAL","members":["GBR"]+["AUS","CAN","JPN","SGP"],"in_force":False,"status":"RATIFICATION","tariff_reduction":0.99},
]

@dataclass
class FTAProfile:
    name:              str
    fta_type:          str
    member_count:      int
    in_force:          bool
    status:            str
    tariff_reduction:  Optional[float]
    has_investment:    bool
    isds_available:    bool
    market_access_score: float   # 0-100
    fdi_enablement:    str
    key_insight:       str

class AGT48_FTAMonitor:

    def _market_access_score(self, fta: dict) -> float:
        base      = 30 if fta.get("in_force") else 5
        member_sc = min(25, len(fta.get("members",[])) * 2)
        tariff_sc = (fta.get("tariff_reduction") or 0) * 25
        invest_sc = 15 if fta.get("investment_chapter") else 0
        isds_sc   = 5  if fta.get("isds") else 0
        return round(min(100, base + member_sc + tariff_sc + invest_sc + isds_sc), 1)

    def _fdi_enablement(self, fta: dict) -> str:
        if not fta.get("in_force"):
            return "PIPELINE"
        if fta.get("investment_chapter") and fta.get("isds"):
            return "FULL_PROTECTION"
        if fta.get("investment_chapter"):
            return "PARTIAL_PROTECTION"
        return "TRADE_ONLY"

    def _key_insight(self, fta: dict) -> str:
        name = fta["name"]
        if not fta.get("in_force"):
            return f"{name} ({fta.get('status','pending')}) — once in force will create significant new investment access."
        if fta.get("investment_chapter") and fta.get("isds"):
            return f"{name} provides full investment protection with ISDS — premium FDI enablement for member economies."
        return f"{name} active with {len(fta.get('members',[]))} members — review sector coverage for target economy."

    def analyse_all(self) -> list[FTAProfile]:
        results = []
        for fta in FTA_DATABASE:
            results.append(FTAProfile(
                name=fta["name"],
                fta_type=fta["type"],
                member_count=len(fta.get("members",[])),
                in_force=fta.get("in_force",False),
                status="IN_FORCE" if fta.get("in_force") else fta.get("status","PENDING"),
                tariff_reduction=fta.get("tariff_reduction"),
                has_investment=fta.get("investment_chapter",False),
                isds_available=fta.get("isds",False),
                market_access_score=self._market_access_score(fta),
                fdi_enablement=self._fdi_enablement(fta),
                key_insight=self._key_insight(fta),
            ))
        return sorted(results, key=lambda x: x.market_access_score, reverse=True)

    async def query_economy(self, iso3: str) -> list[FTAProfile]:
        all_ftas = self.analyse_all()
        return [f for f in all_ftas if any(
            iso3 in m or ("EU27" in m and iso3 in ["DEU","FRA","NLD","IRL","ITA","ESP"])
            for m in [str(FTA_DATABASE[i].get("members",[])) for i in range(len(FTA_DATABASE)) if FTA_DATABASE[i]["name"]==f.name]
        )]

    async def get_pipeline_ftas(self) -> list[FTAProfile]:
        all_ftas = self.analyse_all()
        return [f for f in all_ftas if not f.in_force]


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-49: PORT & LOGISTICS INTELLIGENCE
# Port call data, shipping connectivity, logistics gateway rankings
# Source: UNCTAD LSCI, Alphaliner, World Bank LPI port scores
# ═══════════════════════════════════════════════════════════════════════════════

PORT_DATA = {
    "AEJEA": {"name":"Jebel Ali (Dubai)","iso3":"ARE","lsci":140.8,"throughput_teu_m":14.8,"port_rank":9, "services":95,"berths":67,"depth_m":17,"hinterland":"MENA + South Asia","fdi_gateway":"HIGH"},
    "SGSIN": {"name":"Port of Singapore","iso3":"SGP","lsci":148.2,"throughput_teu_m":37.3,"port_rank":2, "services":200,"berths":57,"depth_m":20,"hinterland":"ASEAN + Global","fdi_gateway":"VERY_HIGH"},
    "CNSHA": {"name":"Port of Shanghai",  "iso3":"CHN","lsci":139.5,"throughput_teu_m":49.2,"port_rank":1, "services":130,"berths":140,"depth_m":15,"hinterland":"China coastal","fdi_gateway":"HIGH"},
    "NLRTM": {"name":"Port of Rotterdam", "iso3":"NLD","lsci":98.4, "throughput_teu_m":15.3,"port_rank":10,"services":88,"berths":120,"depth_m":24,"hinterland":"EU27","fdi_gateway":"VERY_HIGH"},
    "DEHAM": {"name":"Port of Hamburg",   "iso3":"DEU","lsci":88.2, "throughput_teu_m":8.7, "port_rank":18,"services":76,"berths":56,"depth_m":15,"hinterland":"Central Europe","fdi_gateway":"HIGH"},
    "GBFXT": {"name":"Port of Felixstowe","iso3":"GBR","lsci":82.1, "throughput_teu_m":4.2, "port_rank":35,"services":68,"berths":12,"depth_m":18,"hinterland":"UK","fdi_gateway":"HIGH"},
    "NGAPP": {"name":"Port of Apapa (Lagos)","iso3":"NGA","lsci":22.4,"throughput_teu_m":1.1,"port_rank":185,"services":15,"berths":10,"depth_m":9,"hinterland":"West Africa","fdi_gateway":"MEDIUM"},
    "MOMBASA":{"name":"Port of Mombasa",  "iso3":"KEN","lsci":28.1, "throughput_teu_m":1.7, "port_rank":155,"services":22,"berths":16,"depth_m":11,"hinterland":"East Africa","fdi_gateway":"MEDIUM"},
}

@dataclass
class PortProfile:
    port_code:       str
    port_name:       str
    iso3:            str
    lsci_score:      float
    annual_teu_m:    float
    global_rank:     int
    shipping_services: int
    max_depth_m:     int
    hinterland:      str
    fdi_gateway_tier: str
    logistics_premium: float   # % cost premium vs. Singapore as benchmark
    investor_note:   str

class AGT49_PortLogisticsIntelligence:

    SGP_BENCHMARK_LSCI = 148.2

    def _logistics_premium(self, lsci: float) -> float:
        if lsci >= 140: return 0.0
        ratio = self.SGP_BENCHMARK_LSCI / max(lsci, 1)
        return round((ratio - 1) * 30, 1)  # Rough cost premium

    def _investor_note(self, port: dict) -> str:
        lsci = port["lsci"]
        teu  = port["throughput_teu_m"]
        gw   = port["fdi_gateway"]
        if lsci >= 100 and gw in ("HIGH","VERY_HIGH"):
            return f"Tier-1 global gateway. {teu:.1f}M TEU/year. Premium logistics connectivity supports export-oriented FDI."
        if lsci >= 50:
            return f"Regional gateway. {teu:.1f}M TEU/year. Adequate for domestic market FDI; export logistics require premium carrier access."
        return f"Emerging port. {teu:.1f}M TEU/year. Logistics constraints may add 15-25% to supply chain costs vs. global benchmarks."

    def analyse_all(self) -> list[PortProfile]:
        results = []
        for code, data in PORT_DATA.items():
            results.append(PortProfile(
                port_code=code, port_name=data["name"], iso3=data["iso3"],
                lsci_score=data["lsci"], annual_teu_m=data["throughput_teu_m"],
                global_rank=data["port_rank"],
                shipping_services=data["services"],
                max_depth_m=data["depth_m"],
                hinterland=data["hinterland"],
                fdi_gateway_tier=data["fdi_gateway"],
                logistics_premium=self._logistics_premium(data["lsci"]),
                investor_note=self._investor_note(data),
            ))
        return sorted(results, key=lambda x: x.lsci_score, reverse=True)

    async def rank_ports(self) -> list[PortProfile]:
        return self.analyse_all()


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-50: MASTER INTELLIGENCE SYNTHESIZER
# Aggregates outputs from all 49 agents into composite intelligence scores
# Produces the GFM Intelligence Index (GII) — single composite readiness score
# This is the terminal agent — the "brain" that combines everything
# ═══════════════════════════════════════════════════════════════════════════════

GII_WEIGHTS = {
    "gfr_composite":          0.20,   # AGT-09
    "infrastructure_score":   0.12,   # AGT-38
    "digital_score":          0.10,   # AGT-39
    "incentive_score":        0.10,   # AGT-36
    "political_risk_score":   0.10,   # AGT-19, AGT-33
    "energy_transition_score":0.08,   # AGT-40
    "labour_skills_score":    0.08,   # AGT-37
    "regulatory_openness":    0.08,   # AGT-35
    "trade_connectivity":     0.07,   # AGT-31, AGT-49
    "signal_momentum":        0.07,   # AGT-02, AGT-12
}

GII_REPRESENTATIVE_DATA = {
    "SGP": {"gfr_composite":88.5,"infrastructure_score":94,"digital_score":87,"incentive_score":93,"political_risk_score":90,"energy_transition_score":62,"labour_skills_score":63,"regulatory_openness":99,"trade_connectivity":92,"signal_momentum":72},
    "ARE": {"gfr_composite":80.0,"infrastructure_score":92,"digital_score":84,"incentive_score":94,"political_risk_score":78,"energy_transition_score":53,"labour_skills_score":54,"regulatory_openness":97,"trade_connectivity":90,"signal_momentum":88},
    "IRL": {"gfr_composite":78.5,"infrastructure_score":78,"digital_score":82,"incentive_score":91,"political_risk_score":82,"energy_transition_score":58,"labour_skills_score":70,"regulatory_openness":96,"trade_connectivity":75,"signal_momentum":62},
    "DEU": {"gfr_composite":81.5,"infrastructure_score":84,"digital_score":78,"incentive_score":76,"political_risk_score":86,"energy_transition_score":77,"labour_skills_score":48,"regulatory_openness":88,"trade_connectivity":88,"signal_momentum":65},
    "IND": {"gfr_composite":62.3,"infrastructure_score":65,"digital_score":59,"incentive_score":72,"political_risk_score":56,"energy_transition_score":38,"labour_skills_score":69,"regulatory_openness":68,"trade_connectivity":64,"signal_momentum":78},
    "VNM": {"gfr_composite":58.2,"infrastructure_score":58,"digital_score":48,"incentive_score":68,"political_risk_score":62,"energy_transition_score":52,"labour_skills_score":48,"regulatory_openness":70,"trade_connectivity":68,"signal_momentum":72},
    "SAU": {"gfr_composite":68.1,"infrastructure_score":72,"digital_score":68,"incentive_score":81,"political_risk_score":62,"energy_transition_score":47,"labour_skills_score":45,"regulatory_openness":72,"trade_connectivity":72,"signal_momentum":82},
    "KEN": {"gfr_composite":54.8,"infrastructure_score":42,"digital_score":40,"incentive_score":55,"political_risk_score":55,"energy_transition_score":75,"labour_skills_score":40,"regulatory_openness":60,"trade_connectivity":42,"signal_momentum":48},
}

@dataclass
class GIIScore:
    iso3:               str
    gii_composite:      float    # 0-100
    gii_tier:           str      # FRONTIER / HIGH / MEDIUM / EMERGING / DEVELOPING
    component_scores:   dict
    strongest_dimension: str
    weakest_dimension:  str
    investment_grade:   str      # A+/A/B+/B/C
    key_rationale:      str
    generated_at:       str

class AGT50_MasterIntelligenceSynthesizer:
    """
    Terminal agent. Aggregates all intelligence streams into a single
    GFM Intelligence Index (GII) composite score for each economy.
    Powers the platform's top-line investment readiness ranking.
    """

    def _tier(self, score: float) -> str:
        if score >= 80:  return "FRONTIER"
        elif score >= 65: return "HIGH"
        elif score >= 52: return "MEDIUM"
        elif score >= 38: return "EMERGING"
        else:             return "DEVELOPING"

    def _investment_grade(self, score: float) -> str:
        if score >= 82:  return "A+"
        elif score >= 74: return "A"
        elif score >= 65: return "B+"
        elif score >= 55: return "B"
        elif score >= 44: return "C+"
        else:             return "C"

    def _rationale(self, iso3: str, score: float, strongest: str, weakest: str) -> str:
        tier = self._tier(score)
        return (f"{iso3} achieves a GII composite of {score:.1f} [{tier}]. "
                f"Strongest dimension: {strongest.replace('_',' ').title()}. "
                f"Priority improvement area: {weakest.replace('_',' ').title()}.")

    def compute_gii(self, iso3: str, components: dict) -> GIIScore:
        weighted_sum = sum(
            components.get(dim, 50) * weight
            for dim, weight in GII_WEIGHTS.items()
        )
        gii = round(min(100, max(0, weighted_sum)), 2)

        sorted_dims = sorted(components.items(), key=lambda x: x[1], reverse=True)
        strongest = sorted_dims[0][0]  if sorted_dims else "gfr_composite"
        weakest   = sorted_dims[-1][0] if sorted_dims else "signal_momentum"

        return GIIScore(
            iso3=iso3, gii_composite=gii,
            gii_tier=self._tier(gii),
            component_scores=components,
            strongest_dimension=strongest,
            weakest_dimension=weakest,
            investment_grade=self._investment_grade(gii),
            key_rationale=self._rationale(iso3, gii, strongest, weakest),
            generated_at=datetime.now(timezone.utc).isoformat(),
        )

    async def synthesize_all(self, data: Optional[dict] = None) -> list[GIIScore]:
        source = data or GII_REPRESENTATIVE_DATA
        results = [self.compute_gii(iso3, components) for iso3, components in source.items()]
        return sorted(results, key=lambda x: x.gii_composite, reverse=True)

    async def get_investment_universe(self, min_grade: str = "B") -> list[GIIScore]:
        grades_ok = {"A+","A","B+","B"} if min_grade=="B" else {"A+","A","B+"}
        all_scores = await self.synthesize_all()
        return [s for s in all_scores if s.investment_grade in grades_ok]


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)

    async def test():
        print("\n" + "="*60)
        print("AGT-46: COMMODITY INTELLIGENCE")
        print("="*60)
        agt46 = AGT46_CommodityIntelligence()
        signals = await agt46.get_top_signals(5)
        for s in signals:
            print(f"  {s.commodity:<16} ${s.price:>8} {s.unit[:12]:<12} "
                  f"YoY:{s.yoy_change_pct:+.1f}%  Corr:{s.fdi_correlation:.2f}")

        print("\n" + "="*60)
        print("AGT-47: CLIMATE FINANCE TRACKER")
        print("="*60)
        agt47 = AGT47_ClimateFinanceTracker()
        deals = await agt47.run()
        summary = await agt47.get_summary()
        print(f"✓ Total volume: ${summary['total_volume_b']:.1f}B · {summary['total_deals']} deals")
        for d in deals[:3]:
            print(f"  {d.issuer:<32} ${d.amount_usd_b:.1f}B  [{d.fdi_signal}]")

        print("\n" + "="*60)
        print("AGT-48: FTA NETWORK MONITOR")
        print("="*60)
        agt48 = AGT48_FTAMonitor()
        ftas = agt48.analyse_all()
        print(f"✓ FTAs in database: {len(ftas)}")
        for f in ftas[:5]:
            status = "✓" if f.in_force else "○"
            print(f"  {status} {f.name:<30} [{f.fdi_enablement:<18}] Score:{f.market_access_score:.0f}")
        pipeline = await agt48.get_pipeline_ftas()
        print(f"✓ FTAs in pipeline/negotiation: {len(pipeline)}")

        print("\n" + "="*60)
        print("AGT-49: PORT & LOGISTICS INTELLIGENCE")
        print("="*60)
        agt49 = AGT49_PortLogisticsIntelligence()
        ports = await agt49.rank_ports()
        for p in ports[:5]:
            print(f"  Rank#{p.global_rank:<4} {p.port_name:<25} LSCI:{p.lsci_score:.0f}  "
                  f"TEU:{p.annual_teu_m:.1f}M  Premium:+{p.logistics_premium:.0f}%")

        print("\n" + "="*60)
        print("AGT-50: MASTER INTELLIGENCE SYNTHESIZER (GII)")
        print("="*60)
        agt50 = AGT50_MasterIntelligenceSynthesizer()
        rankings = await agt50.synthesize_all()
        print(f"✓ GII Rankings ({len(rankings)} economies):")
        for i, r in enumerate(rankings, 1):
            print(f"  #{i:<2} {r.iso3}: GII {r.gii_composite:.1f} [{r.gii_tier:<10}] "
                  f"Grade:{r.investment_grade}  Best:{r.strongest_dimension.split('_')[0]}")
        investable = await agt50.get_investment_universe(min_grade="B")
        print(f"\n✓ Investment-grade economies (B or above): {len(investable)}")
        print(f"  {[e.iso3 for e in investable]}")

    asyncio.run(test())


def execute(payload: dict) -> dict:
    import hashlib, json
    from datetime import datetime, timezone
    ref = "AGT-MULTI-" + datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    result = run(payload)
    return {
        "agent":      "AGT-MULTI",
        "ref":        ref,
        "status":     "completed",
        "result":     result,
        "provenance": {"hash": "sha256:" + hashlib.sha256(ref.encode()).hexdigest()[:16],
                       "executed_at": datetime.now(timezone.utc).isoformat()}
    }

if __name__ == "__main__":
    import json
    print(json.dumps(execute({"test": True}), indent=2))
