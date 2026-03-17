"""
GLOBAL FDI MONITOR — AGT-41 through AGT-45
AGT-41: INVESTMENT PIPELINE TRACKER — IPA deal pipeline management and conversion analytics
AGT-42: M&A INTELLIGENCE — Cross-border merger and acquisition signal detection
AGT-43: STARTUP & VC MONITOR — Venture ecosystem tracking and Series A-E signal detection
AGT-44: SOVEREIGN WEALTH FUND TRACKER — SWF allocation intelligence and mandate mapping
AGT-45: REAL ESTATE INTELLIGENCE — Commercial real estate FDI signals and market data
"""
import asyncio, json, re, math, os, logging
from datetime import datetime, timezone, timedelta
from typing import Optional
from dataclasses import dataclass, field

log = logging.getLogger("gfm.agt41_45")


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-41: INVESTMENT PIPELINE TRACKER
# Manages IPA deal pipeline from first-contact to investment decision
# 6 pipeline stages: Prospecting → Engagement → Presenting → Negotiating → Committed → Live
# ═══════════════════════════════════════════════════════════════════════════════

PIPELINE_STAGES = [
    {"id":"PROSPECTING",  "label":"Prospecting",   "avg_days":30, "conversion":0.40},
    {"id":"ENGAGEMENT",   "label":"Engagement",    "avg_days":45, "conversion":0.55},
    {"id":"PRESENTING",   "label":"Presenting",    "avg_days":30, "conversion":0.60},
    {"id":"NEGOTIATING",  "label":"Negotiating",   "avg_days":60, "conversion":0.65},
    {"id":"COMMITTED",    "label":"Committed",     "avg_days":45, "conversion":0.85},
    {"id":"LIVE",         "label":"Live (Invested)","avg_days":0,  "conversion":1.00},
]

SAMPLE_PIPELINE = [
    {"id":"PL001","company":"Microsoft Corp",    "hq":"USA","sector":"J","capex_m":850,"stage":"NEGOTIATING","ipa_owner":"John Smith",  "first_contact":"2025-08-15","probability":0.72,"notes":"Data centre campus confirmed; legal review in progress"},
    {"id":"PL002","company":"Siemens Energy",    "hq":"DEU","sector":"D","capex_m":340,"stage":"COMMITTED",  "ipa_owner":"Sara Al-Rashid","first_contact":"2025-06-20","probability":0.91,"notes":"Contract signed; site preparation underway"},
    {"id":"PL003","company":"BlackRock Inc",      "hq":"USA","sector":"K","capex_m":500,"stage":"PRESENTING","ipa_owner":"Ahmed Hassan",  "first_contact":"2025-11-10","probability":0.58,"notes":"Presented incentive package; awaiting board decision"},
    {"id":"PL004","company":"Airbus SE",          "hq":"FRA","sector":"C","capex_m":220,"stage":"ENGAGEMENT","ipa_owner":"John Smith",   "first_contact":"2026-01-05","probability":0.45,"notes":"Attended AIM; follow-up meeting scheduled April"},
    {"id":"PL005","company":"Vestas Wind",        "hq":"DNK","sector":"D","capex_m":180,"stage":"PROSPECTING","ipa_owner":"Sara Al-Rashid","first_contact":"2026-02-20","probability":0.35,"notes":"Initial contact via GITEX; exploring renewable energy zone"},
    {"id":"PL006","company":"Databricks",         "hq":"USA","sector":"J","capex_m":150,"stage":"ENGAGEMENT","ipa_owner":"Ahmed Hassan",  "first_contact":"2026-01-18","probability":0.48,"notes":"AI cloud partnership discussions; MoU under review"},
    {"id":"PL007","company":"Nuveen AM",           "hq":"USA","sector":"K","capex_m":600,"stage":"NEGOTIATING","ipa_owner":"Sara Al-Rashid","first_contact":"2025-09-30","probability":0.68,"notes":"Infrastructure fund allocation; term sheet exchanged"},
    {"id":"PL008","company":"Samsung Electronics","hq":"KOR","sector":"C","capex_m":420,"stage":"COMMITTED",  "ipa_owner":"John Smith",   "first_contact":"2025-07-14","probability":0.88,"notes":"MoU signed at Future Investment Initiative; JV structure agreed"},
]

@dataclass
class PipelineDeal:
    deal_id:        str
    company:        str
    hq_iso3:        str
    sector_isic:    str
    capex_m:        float
    stage:          str
    ipa_owner:      str
    first_contact:  str
    probability:    float
    days_in_stage:  int
    expected_capex: float    # probability-weighted
    at_risk:        bool     # Stage stalled > 2× average days
    notes:          str

@dataclass
class PipelineSummary:
    total_deals:          int
    total_pipeline_value_m: float
    expected_value_m:     float
    by_stage:             dict
    conversion_rate_90d:  float
    at_risk_count:        int
    top_sectors:          dict

class AGT41_PipelineTracker:

    def _days_in_stage(self, first_contact: str) -> int:
        try:
            fc = datetime.strptime(first_contact, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            return (datetime.now(timezone.utc) - fc).days
        except:
            return 30

    def _at_risk(self, stage: str, days: int) -> bool:
        stage_data = next((s for s in PIPELINE_STAGES if s["id"]==stage), None)
        return bool(stage_data and days > stage_data["avg_days"] * 2)

    def enrich_deals(self, raw_deals: list) -> list[PipelineDeal]:
        deals = []
        for d in raw_deals:
            days = self._days_in_stage(d["first_contact"])
            deals.append(PipelineDeal(
                deal_id=d["id"], company=d["company"], hq_iso3=d["hq"],
                sector_isic=d["sector"], capex_m=d["capex_m"],
                stage=d["stage"], ipa_owner=d["ipa_owner"],
                first_contact=d["first_contact"], probability=d["probability"],
                days_in_stage=days,
                expected_capex=round(d["capex_m"] * d["probability"], 1),
                at_risk=self._at_risk(d["stage"], days),
                notes=d["notes"],
            ))
        return sorted(deals, key=lambda x: x.expected_capex, reverse=True)

    def summarise(self, deals: list[PipelineDeal]) -> PipelineSummary:
        by_stage: dict = {}
        sectors:  dict = {}
        for d in deals:
            by_stage.setdefault(d.stage, {"count":0,"value_m":0,"expected_m":0})
            by_stage[d.stage]["count"]      += 1
            by_stage[d.stage]["value_m"]    += d.capex_m
            by_stage[d.stage]["expected_m"] += d.expected_capex
            sectors.setdefault(d.sector_isic, 0)
            sectors[d.sector_isic]          += d.capex_m

        live_val = sum(d.capex_m for d in deals if d.stage=="LIVE")
        committed_val = sum(d.capex_m for d in deals if d.stage in ("COMMITTED","LIVE"))
        total_val = sum(d.capex_m for d in deals)
        conv = round(committed_val / total_val, 3) if total_val else 0

        return PipelineSummary(
            total_deals=len(deals),
            total_pipeline_value_m=round(sum(d.capex_m for d in deals), 1),
            expected_value_m=round(sum(d.expected_capex for d in deals), 1),
            by_stage=by_stage,
            conversion_rate_90d=conv,
            at_risk_count=sum(1 for d in deals if d.at_risk),
            top_sectors=dict(sorted(sectors.items(), key=lambda x: x[1], reverse=True)[:5]),
        )

    async def run(self, deals: Optional[list] = None) -> tuple:
        raw = deals or SAMPLE_PIPELINE
        enriched = self.enrich_deals(raw)
        summary  = self.summarise(enriched)
        return enriched, summary


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-42: M&A INTELLIGENCE AGENT
# Detects cross-border M&A signals: targets, acquirers, multiples, strategic rationale
# ═══════════════════════════════════════════════════════════════════════════════

MA_SIGNALS_SAMPLE = [
    {"acquirer":"BlackRock Inc","acquirer_hq":"USA","target":"Jadwa Investment","target_hq":"SAU","sector":"K","deal_value_b":1.2,"deal_type":"FULL_ACQUISITION","strategic_rationale":"MENA asset management expansion","status":"COMPLETED","announced":"2026-03-12"},
    {"acquirer":"Microsoft Corp","acquirer_hq":"USA","target":"G42 Cloud",     "target_hq":"ARE","sector":"J","deal_value_b":1.5,"deal_type":"STRATEGIC_STAKE","strategic_rationale":"Middle East cloud infrastructure JV","status":"COMPLETED","announced":"2026-02-28"},
    {"acquirer":"LVMH",          "acquirer_hq":"FRA","target":"Al Tayer Group Retail","target_hq":"ARE","sector":"G","deal_value_b":0.8,"deal_type":"JOINT_VENTURE","strategic_rationale":"GCC luxury retail consolidation","status":"ANNOUNCED","announced":"2026-03-08"},
    {"acquirer":"Goldman Sachs",  "acquirer_hq":"USA","target":"Emirates NBD Asset Mgmt","target_hq":"ARE","sector":"K","deal_value_b":0.6,"deal_type":"PARTIAL_ACQUISITION","strategic_rationale":"UAE wealth management market entry","status":"RUMOURED","announced":"2026-03-01"},
    {"acquirer":"Siemens AG",     "acquirer_hq":"DEU","target":"Elm Company",  "target_hq":"SAU","sector":"J","deal_value_b":0.4,"deal_type":"STRATEGIC_STAKE","strategic_rationale":"Saudi digital transformation partnership","status":"ANNOUNCED","announced":"2026-02-20"},
]

@dataclass
class MandASignal:
    signal_code:        str
    acquirer:           str
    acquirer_hq:        str
    target:             str
    target_hq:          str
    sector_isic:        str
    deal_value_usd_b:   float
    deal_type:          str
    strategic_rationale: str
    status:             str   # RUMOURED / ANNOUNCED / COMPLETED / TERMINATED
    announced_date:     str
    ebitda_multiple:    Optional[float]
    cross_border:       bool
    sci_score:          float

class AGT42_MandAIntelligence:

    def _sci(self, deal: dict) -> float:
        base = 65.0
        val  = deal.get("deal_value_b", 0)
        if val > 2: base += 20
        elif val > 0.5: base += 12
        elif val > 0.1: base += 6
        status_bonus = {"COMPLETED":15,"ANNOUNCED":8,"RUMOURED":2}.get(deal.get("status",""),0)
        return min(100, base + status_bonus)

    def _deal_code(self, deal: dict, idx: int) -> str:
        hq = deal.get("target_hq","UNK")
        return f"MSS-MAI-{hq}-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(idx).zfill(4)}"

    def _ebitda_multiple(self, deal: dict) -> Optional[float]:
        sector_multiples = {"J":18,"K":14,"C":9,"G":12,"D":11,"L":16,"M":13}
        return sector_multiples.get(deal.get("sector","J"))

    def process(self, raw_signals: list) -> list[MandASignal]:
        results = []
        for i, d in enumerate(raw_signals):
            results.append(MandASignal(
                signal_code=self._deal_code(d, i+1),
                acquirer=d["acquirer"], acquirer_hq=d["acquirer_hq"],
                target=d["target"],     target_hq=d["target_hq"],
                sector_isic=d["sector"],
                deal_value_usd_b=d["deal_value_b"],
                deal_type=d["deal_type"],
                strategic_rationale=d["strategic_rationale"],
                status=d["status"],
                announced_date=d["announced"],
                ebitda_multiple=self._ebitda_multiple(d),
                cross_border=d["acquirer_hq"] != d["target_hq"],
                sci_score=self._sci(d),
            ))
        return sorted(results, key=lambda x: x.sci_score, reverse=True)

    async def run(self, raw: Optional[list] = None) -> list[MandASignal]:
        return self.process(raw or MA_SIGNALS_SAMPLE)


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-43: STARTUP & VC MONITOR
# Tracks venture capital flows, funding rounds, and unicorn formations
# Detects signals: Series A-E, strategic rounds, unicorn threshold crossings
# ═══════════════════════════════════════════════════════════════════════════════

VC_ROUNDS_SAMPLE = [
    {"company":"Tabby",     "hq":"ARE","sector":"K","round":"Series D","amount_m":200,"lead_investor":"STV","stage":"GROWTH","valuation_m":660, "date":"2026-03-10"},
    {"company":"Kitopi",    "hq":"ARE","sector":"I","round":"Series C","amount_m":415,"lead_investor":"SoftBank","stage":"SCALE","valuation_m":1000,"date":"2026-02-28"},
    {"company":"Lean Technologies","hq":"SAU","sector":"K","round":"Series B","amount_m":67,"lead_investor":"Sequoia","stage":"GROWTH","valuation_m":350,"date":"2026-02-15"},
    {"company":"IYKONS",    "hq":"IND","sector":"J","round":"Series A","amount_m":32,"lead_investor":"Peak XV","stage":"EARLY","valuation_m":120,"date":"2026-03-05"},
    {"company":"Nana",      "hq":"SAU","sector":"G","round":"Series C","amount_m":133,"lead_investor":"STV","stage":"GROWTH","valuation_m":640,"date":"2026-01-20"},
    {"company":"Nowpay",    "hq":"EGY","sector":"K","round":"Series B","amount_m":22,"lead_investor":"IFC","stage":"GROWTH","valuation_m":95,"date":"2026-02-08"},
]

UNICORN_THRESHOLD_M = 1000  # $1B+

@dataclass
class VCSignal:
    signal_code:     str
    company:         str
    hq_iso3:         str
    sector_isic:     str
    round_type:      str
    amount_m:        float
    lead_investor:   str
    valuation_m:     float
    is_unicorn:      bool
    growth_stage:    str
    sci_score:       float
    investment_theme: str
    date:            str

class AGT43_StartupVCMonitor:

    THEME_MAP = {
        "K": "FinTech / Financial Services",
        "J": "Deep Tech / SaaS / AI",
        "I": "Food Tech / Restaurant Tech",
        "G": "e-Commerce / Retail Tech",
        "Q": "HealthTech / BioTech",
        "H": "LogTech / Supply Chain",
    }

    def _sci(self, round_data: dict) -> float:
        base = 55.0
        amt  = round_data.get("amount_m", 0)
        if amt >= 200: base += 20
        elif amt >= 50: base += 12
        elif amt >= 20: base += 6
        stage_bonus = {"SCALE":15,"GROWTH":8,"EARLY":3}.get(round_data.get("stage","EARLY"),3)
        unicorn_bonus = 10 if round_data.get("valuation_m",0) >= UNICORN_THRESHOLD_M else 0
        return min(100, base + stage_bonus + unicorn_bonus)

    def process(self, rounds: list) -> list[VCSignal]:
        results = []
        for i, r in enumerate(rounds):
            is_unicorn = r.get("valuation_m",0) >= UNICORN_THRESHOLD_M
            code = f"MSS-VCM-{r.get('hq','UNK')}-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(i+1).zfill(4)}"
            results.append(VCSignal(
                signal_code=code,
                company=r["company"], hq_iso3=r["hq"],
                sector_isic=r["sector"], round_type=r["round"],
                amount_m=r["amount_m"], lead_investor=r["lead_investor"],
                valuation_m=r.get("valuation_m",0),
                is_unicorn=is_unicorn,
                growth_stage=r.get("stage","GROWTH"),
                sci_score=self._sci(r),
                investment_theme=self.THEME_MAP.get(r["sector"],"Technology"),
                date=r["date"],
            ))
        return sorted(results, key=lambda x: x.sci_score, reverse=True)

    async def run(self, rounds: Optional[list] = None) -> list[VCSignal]:
        return self.process(rounds or VC_ROUNDS_SAMPLE)

    async def get_ecosystem_summary(self, iso3: str, rounds: Optional[list] = None) -> dict:
        all_rounds = rounds or VC_ROUNDS_SAMPLE
        eco_rounds = [r for r in all_rounds if r.get("hq") == iso3]
        total_raised = sum(r.get("amount_m",0) for r in eco_rounds)
        unicorns     = sum(1 for r in eco_rounds if r.get("valuation_m",0) >= UNICORN_THRESHOLD_M)
        return {
            "iso3": iso3,
            "total_rounds": len(eco_rounds),
            "total_raised_m": total_raised,
            "unicorns": unicorns,
            "top_sectors": list({r["sector"] for r in eco_rounds}),
            "avg_round_m": round(total_raised/len(eco_rounds), 1) if eco_rounds else 0,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-44: SOVEREIGN WEALTH FUND TRACKER
# Maps SWF investment mandates, portfolio allocations, and deal activity
# Sources: SWFI database proxy, public disclosures, SWF annual reports
# ═══════════════════════════════════════════════════════════════════════════════

SWF_UNIVERSE = [
    {"name":"Abu Dhabi Investment Authority (ADIA)","iso3":"ARE","aum_b":993,"mandate":"Global diversified","focus_sectors":["K","J","L","D","C","H"],"geography":"Global","stage_pref":["PUBLIC_EQUITY","PE","INFRA","REAL_ESTATE"],"annual_deployment_b":45},
    {"name":"Norway Government Pension Fund (NBIM)","iso3":"NOR","aum_b":1610,"mandate":"Global equities/bonds","focus_sectors":["all"],"geography":"Global (ex-Norway)","stage_pref":["PUBLIC_EQUITY","FIXED_INCOME","REAL_ESTATE"],"annual_deployment_b":60},
    {"name":"Kuwait Investment Authority (KIA)",    "iso3":"KWT","aum_b":803,"mandate":"Global diversified","focus_sectors":["K","D","C"],"geography":"Global","stage_pref":["PUBLIC_EQUITY","PE","INFRA"],"annual_deployment_b":30},
    {"name":"GIC (Government of Singapore)",       "iso3":"SGP","aum_b":770,"mandate":"Long-term global","focus_sectors":["J","K","L","D","H"],"geography":"Global","stage_pref":["PE","INFRA","REAL_ESTATE","PUBLIC_EQUITY"],"annual_deployment_b":35},
    {"name":"Mubadala Investment Company",          "iso3":"ARE","aum_b":302,"mandate":"Diversified strategic","focus_sectors":["J","D","Q","C","K"],"geography":"Global + MENA","stage_pref":["PE","DIRECT_EQUITY","VENTURE","INFRA"],"annual_deployment_b":20},
    {"name":"Temasek Holdings",                    "iso3":"SGP","aum_b":382,"mandate":"Strategic equities","focus_sectors":["J","K","L","D","Q"],"geography":"Asia + Global","stage_pref":["PUBLIC_EQUITY","PE","VENTURE"],"annual_deployment_b":25},
    {"name":"Saudi PIF (Public Investment Fund)",  "iso3":"SAU","aum_b":925,"mandate":"Vision 2030 strategic","focus_sectors":["J","D","F","L","C","R"],"geography":"KSA primary + Global","stage_pref":["DIRECT_EQUITY","PE","GIGA_PROJECTS"],"annual_deployment_b":80},
    {"name":"Qatar Investment Authority (QIA)",    "iso3":"QAT","aum_b":475,"mandate":"Global diversified","focus_sectors":["L","K","J","D","C"],"geography":"Global","stage_pref":["PUBLIC_EQUITY","REAL_ESTATE","PE"],"annual_deployment_b":22},
    {"name":"China Investment Corporation (CIC)",  "iso3":"CHN","aum_b":1350,"mandate":"Long-term global","focus_sectors":["K","D","C","J","B"],"geography":"Global","stage_pref":["PUBLIC_EQUITY","INFRA","PE"],"annual_deployment_b":55},
]

@dataclass
class SWFProfile:
    name:                str
    iso3:                str
    aum_usd_b:           float
    mandate:             str
    focus_sectors:       list
    geography_focus:     str
    preferred_stages:    list
    annual_deployment_b: float
    sector_fit:          float   # 0-100 vs target sectors
    is_strategic:        bool    # PIF / ADIA / Mubadala = strategic + IPA-relevant
    engagement_note:     str

class AGT44_SWFTracker:

    STRATEGIC_SWFS = {"ADIA","Mubadala Investment Company","Saudi PIF (Public Investment Fund)","GIC (Government of Singapore)","Temasek Holdings"}

    def _sector_fit(self, swf: dict, target_sectors: list) -> float:
        swf_sectors = swf.get("focus_sectors", [])
        if "all" in swf_sectors:
            return 85.0
        matches = sum(1 for s in target_sectors if s in swf_sectors)
        return min(100, matches * 20 + 20)

    def _engagement_note(self, swf: dict) -> str:
        aum = swf.get("aum_b", 100)
        deploy = swf.get("annual_deployment_b", 10)
        is_strategic = swf["name"] in self.STRATEGIC_SWFS
        if is_strategic:
            return f"Strategic SWF with IPA relationship channel. Direct access via government-to-government engagement. Annual deployment: ${deploy}B."
        return f"AUM ${aum}B · Annual deployment ${deploy}B. Engagement via bilateral investment conference or global investment banks."

    async def screen(self, target_sectors: list, target_iso3: Optional[str] = None, top_n: int = 5) -> list[SWFProfile]:
        results = []
        for swf in SWF_UNIVERSE:
            fit = self._sector_fit(swf, target_sectors)
            results.append(SWFProfile(
                name=swf["name"], iso3=swf["iso3"],
                aum_usd_b=swf["aum_b"],
                mandate=swf["mandate"],
                focus_sectors=swf["focus_sectors"][:5],
                geography_focus=swf["geography"],
                preferred_stages=swf["stage_pref"],
                annual_deployment_b=swf["annual_deployment_b"],
                sector_fit=fit,
                is_strategic=swf["name"] in self.STRATEGIC_SWFS,
                engagement_note=self._engagement_note(swf),
            ))
        results.sort(key=lambda x: (x.is_strategic, x.sector_fit, x.annual_deployment_b), reverse=True)
        return results[:top_n]


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-45: REAL ESTATE INTELLIGENCE AGENT
# Commercial real estate FDI signals: office, logistics, data centres, retail
# Sources: JLL proxy, CBRE proxy, Cushman & Wakefield, MSCI Real Estate
# ═══════════════════════════════════════════════════════════════════════════════

RE_MARKET_DATA = {
    "ARE_DXB": {"market":"Dubai","type":"OFFICE","grade_a_rent_m2_yr":500,"vacancy_pct":12,"cap_rate":6.5,"fdi_active":"HIGH","yoy_rent_change":8.2,"pipeline_m2":420000},
    "ARE_AUH": {"market":"Abu Dhabi","type":"OFFICE","grade_a_rent_m2_yr":380,"vacancy_pct":18,"cap_rate":7.0,"fdi_active":"HIGH","yoy_rent_change":5.4,"pipeline_m2":180000},
    "GBR_LON": {"market":"London City","type":"OFFICE","grade_a_rent_m2_yr":1050,"vacancy_pct":8,"cap_rate":4.2,"fdi_active":"HIGH","yoy_rent_change":-2.1,"pipeline_m2":380000},
    "DEU_FRA": {"market":"Frankfurt","type":"OFFICE","grade_a_rent_m2_yr":620,"vacancy_pct":11,"cap_rate":4.8,"fdi_active":"MEDIUM","yoy_rent_change":1.2,"pipeline_m2":210000},
    "SGP_CBD": {"market":"Singapore CBD","type":"OFFICE","grade_a_rent_m2_yr":890,"vacancy_pct":6,"cap_rate":3.8,"fdi_active":"HIGH","yoy_rent_change":4.2,"pipeline_m2":95000},
    "IND_BLR": {"market":"Bangalore","type":"OFFICE","grade_a_rent_m2_yr":195,"vacancy_pct":14,"cap_rate":8.5,"fdi_active":"HIGH","yoy_rent_change":6.8,"pipeline_m2":2800000},
    "ARE_LOG": {"market":"UAE Logistics","type":"LOGISTICS","grade_a_rent_m2_yr":140,"vacancy_pct":4,"cap_rate":7.2,"fdi_active":"HIGH","yoy_rent_change":12.5,"pipeline_m2":850000},
    "ARE_DC":  {"market":"UAE Data Centres","type":"DATA_CENTRE","grade_a_rent_m2_yr":2800,"vacancy_pct":2,"cap_rate":5.5,"fdi_active":"VERY_HIGH","yoy_rent_change":18.2,"pipeline_m2":120000},
}

@dataclass
class RESignal:
    market_code:        str
    market_name:        str
    asset_type:         str
    grade_a_rent_m2_yr: float
    vacancy_pct:        float
    cap_rate:           float
    fdi_activity:       str
    yoy_rent_change:    float
    pipeline_m2:        int
    investment_signal:  str    # BUY / HOLD / WATCH / AVOID
    signal_note:        str

class AGT45_RealEstateIntelligence:

    def _signal(self, data: dict) -> tuple[str, str]:
        vacancy  = data.get("vacancy_pct",15)
        yoy      = data.get("yoy_rent_change",0)
        fdi      = data.get("fdi_active","MEDIUM")
        pipeline = data.get("pipeline_m2",0)
        cap      = data.get("cap_rate",6)

        if vacancy < 8 and yoy > 5 and fdi in ("HIGH","VERY_HIGH"):
            sig = "BUY"
            note = f"Tight vacancy ({vacancy}%) + strong rental growth ({yoy:.1f}% YoY) + active FDI demand. Strong entry signal."
        elif vacancy < 12 and yoy > 0 and fdi in ("HIGH","VERY_HIGH"):
            sig = "HOLD"
            note = f"Healthy market fundamentals. Vacancy {vacancy}% with {yoy:.1f}% rental growth. Continue monitoring."
        elif vacancy > 18 or yoy < -3:
            sig = "AVOID"
            note = f"Elevated vacancy ({vacancy}%) or declining rents ({yoy:.1f}%). Wait for market correction."
        else:
            sig = "WATCH"
            note = f"Neutral signal. Vacancy {vacancy}%, rent change {yoy:.1f}%. Monitor for improvement trigger."

        return sig, note

    def analyse_market(self, market_code: str) -> Optional[RESignal]:
        data = RE_MARKET_DATA.get(market_code)
        if not data:
            return None
        sig, note = self._signal(data)
        return RESignal(
            market_code=market_code, market_name=data["market"],
            asset_type=data["type"],
            grade_a_rent_m2_yr=data["grade_a_rent_m2_yr"],
            vacancy_pct=data["vacancy_pct"], cap_rate=data["cap_rate"],
            fdi_activity=data["fdi_active"],
            yoy_rent_change=data["yoy_rent_change"],
            pipeline_m2=data["pipeline_m2"],
            investment_signal=sig, signal_note=note,
        )

    async def scan_all(self) -> list[RESignal]:
        results = [self.analyse_market(code) for code in RE_MARKET_DATA]
        results = [r for r in results if r]
        results.sort(key=lambda x: {"BUY":4,"HOLD":3,"WATCH":2,"AVOID":1}.get(x.investment_signal,0), reverse=True)
        return results


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)

    async def test():
        print("\n" + "="*60)
        print("AGT-41: INVESTMENT PIPELINE TRACKER")
        print("="*60)
        agt41 = AGT41_PipelineTracker()
        deals, summary = await agt41.run()
        print(f"✓ Pipeline deals:      {summary.total_deals}")
        print(f"✓ Total value:         ${summary.total_pipeline_value_m:.0f}M")
        print(f"✓ Expected value:      ${summary.expected_value_m:.0f}M (probability-weighted)")
        print(f"✓ At-risk deals:       {summary.at_risk_count}")
        print(f"✓ Conversion rate:     {summary.conversion_rate_90d:.1%}")
        print(f"✓ Top 3 deals:")
        for d in deals[:3]:
            risk_flag = " ⚠️ AT RISK" if d.at_risk else ""
            print(f"  [{d.stage:<12}] {d.company:<22} ${d.capex_m:.0f}M  P:{d.probability:.0%}{risk_flag}")

        print("\n" + "="*60)
        print("AGT-42: M&A INTELLIGENCE")
        print("="*60)
        agt42 = AGT42_MandAIntelligence()
        signals = await agt42.run()
        print(f"✓ M&A signals detected: {len(signals)}")
        for s in signals[:3]:
            print(f"  [{s.status:<10}] {s.acquirer} → {s.target} | ${s.deal_value_usd_b:.1f}B | SCI:{s.sci_score:.0f}")

        print("\n" + "="*60)
        print("AGT-43: STARTUP & VC MONITOR")
        print("="*60)
        agt43 = AGT43_StartupVCMonitor()
        rounds = await agt43.run()
        print(f"✓ VC rounds detected:  {len(rounds)}")
        for r in rounds[:3]:
            unicorn = " 🦄 UNICORN" if r.is_unicorn else ""
            print(f"  [{r.round_type:<8}] {r.company:<18} ${r.amount_m:.0f}M  Val:${r.valuation_m:.0f}M{unicorn}")
        eco_summary = await agt43.get_ecosystem_summary("ARE")
        print(f"✓ ARE ecosystem: {eco_summary['total_rounds']} rounds · ${eco_summary['total_raised_m']:.0f}M raised · {eco_summary['unicorns']} unicorn(s)")

        print("\n" + "="*60)
        print("AGT-44: SOVEREIGN WEALTH FUND TRACKER")
        print("="*60)
        agt44 = AGT44_SWFTracker()
        swfs = await agt44.screen(["J","D","F"], target_iso3="ARE", top_n=4)
        print(f"✓ SWFs screened:       {len(swfs)}")
        for s in swfs:
            strategic = " ★ STRATEGIC" if s.is_strategic else ""
            print(f"  {s.name[:40]:<40} AUM:${s.aum_usd_b:.0f}B  Deploy:${s.annual_deployment_b:.0f}B/yr  Fit:{s.sector_fit:.0f}{strategic}")

        print("\n" + "="*60)
        print("AGT-45: REAL ESTATE INTELLIGENCE")
        print("="*60)
        agt45 = AGT45_RealEstateIntelligence()
        markets = await agt45.scan_all()
        print(f"✓ Markets analysed:    {len(markets)}")
        for m in markets:
            print(f"  [{m.investment_signal:<5}] {m.market_name:<25} {m.asset_type:<12} "
                  f"Vac:{m.vacancy_pct:.0f}%  YoY:{m.yoy_rent_change:+.1f}%  FDI:{m.fdi_activity}")

    asyncio.run(test())
