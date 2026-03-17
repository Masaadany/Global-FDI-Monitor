"""
GLOBAL FDI MONITOR — AGT-26 through AGT-30
AGT-26: INVESTOR TARGETING ENGINE — Scores and ranks global investors for specific opportunities
AGT-27: SECTOR INTELLIGENCE AGGREGATOR — Builds sector profiles across ISIC classifications
AGT-28: SPECIAL ECONOMIC ZONE INTELLIGENCE — Profiles 2,400+ free zones and SEZs globally
AGT-29: ECONOMIC CALENDAR AGENT — Tracks data releases, events, and policy announcements
AGT-30: BILATERAL RELATIONS INTELLIGENCE — Maps investment treaty networks and BIT coverage
"""
import asyncio, json, re, os, logging
from datetime import datetime, timezone, timedelta
from typing import Optional
from dataclasses import dataclass, field

log = logging.getLogger("gfm.agt26_30")


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-26: INVESTOR TARGETING ENGINE
# Scores global investors for a specific economy / sector opportunity
# Powers PMP shortlisting and IPA lead pipeline
# ═══════════════════════════════════════════════════════════════════════════════

INVESTOR_UNIVERSE_SAMPLE = [
    {"name":"Microsoft Corporation",    "hq":"USA","type":"TECH","revenue_b":211.9,"employees":221000,"expansion_budget_b":15,"ims":96,"recent_greenfields":12},
    {"name":"Amazon Web Services",      "hq":"USA","type":"CLOUD","revenue_b":90.8, "employees":350000,"expansion_budget_b":25,"ims":95,"recent_greenfields":18},
    {"name":"Alphabet / Google",        "hq":"USA","type":"TECH","revenue_b":307.4,"employees":182000,"expansion_budget_b":12,"ims":93,"recent_greenfields":9},
    {"name":"Saudi Aramco",             "hq":"SAU","type":"ENERGY","revenue_b":440.0,"employees":70000,"expansion_budget_b":40,"ims":88,"recent_greenfields":8},
    {"name":"LVMH",                     "hq":"FRA","type":"LUXURY","revenue_b":86.2,"employees":213000,"expansion_budget_b":5,"ims":82,"recent_greenfields":6},
    {"name":"Siemens AG",               "hq":"DEU","type":"INDUSTRIAL","revenue_b":78.5,"employees":311000,"expansion_budget_b":8,"ims":85,"recent_greenfields":14},
    {"name":"Samsung Electronics",      "hq":"KOR","type":"TECH","revenue_b":244.2,"employees":267000,"expansion_budget_b":20,"ims":91,"recent_greenfields":11},
    {"name":"Volkswagen Group",         "hq":"DEU","type":"AUTO","revenue_b":293.6,"employees":684000,"expansion_budget_b":18,"ims":80,"recent_greenfields":7},
    {"name":"BlackRock",                "hq":"USA","type":"FINANCE","revenue_b":17.9,"employees":21000, "expansion_budget_b":50,"ims":87,"recent_greenfields":4},
    {"name":"Softbank Group",           "hq":"JPN","type":"FINANCE","revenue_b":54.2,"employees":80000, "expansion_budget_b":10,"ims":79,"recent_greenfields":15},
    {"name":"ADNOC",                    "hq":"ARE","type":"ENERGY","revenue_b":80.0,"employees":75000, "expansion_budget_b":20,"ims":86,"recent_greenfields":6},
    {"name":"Temasek Holdings",         "hq":"SGP","type":"SWF","revenue_b":0,      "employees":900,   "expansion_budget_b":30,"ims":90,"recent_greenfields":20},
    {"name":"Mubadala Investment",      "hq":"ARE","type":"SWF","revenue_b":0,      "employees":3000,  "expansion_budget_b":25,"ims":91,"recent_greenfields":18},
    {"name":"Alibaba Group",            "hq":"CHN","type":"TECH","revenue_b":126.5,"employees":235000,"expansion_budget_b":8,"ims":76,"recent_greenfields":5},
    {"name":"Airbus SE",                "hq":"FRA","type":"AEROSPACE","revenue_b":65.4,"employees":134000,"expansion_budget_b":6,"ims":83,"recent_greenfields":5},
]

INVESTOR_TYPE_SECTOR_FIT = {
    "TECH":       {"J":95,"K":60,"M":70,"C":40},
    "CLOUD":      {"J":98,"K":55,"M":65,"F":30},
    "ENERGY":     {"D":90,"B":85,"F":75,"C":60},
    "FINANCE":    {"K":95,"L":70,"M":65},
    "SWF":        {"K":90,"L":80,"J":70,"D":75,"F":65,"B":60},
    "INDUSTRIAL": {"C":90,"D":80,"F":75,"M":70},
    "AUTO":       {"C":92,"F":70,"M":65},
    "LUXURY":     {"G":85,"L":70,"I":80},
    "AEROSPACE":  {"C":90,"M":85,"F":60},
}

@dataclass
class InvestorScore:
    investor_name:   str
    hq_iso3:         str
    investor_type:   str
    its_score:       float     # Investor Targeting Score 0-100
    its_tier:        int       # 1 = highest priority
    sector_fit:      float
    capacity_score:  float
    momentum_score:  float
    strategic_note:  str

class AGT26_InvestorTargetingEngine:
    """Scores and ranks investors for a specific destination + sector opportunity."""

    def score_investor(
        self,
        investor: dict,
        destination_iso3: str,
        target_sectors: list,
    ) -> InvestorScore:
        # Sector fit (0-30)
        inv_type   = investor.get("type","TECH")
        type_fits  = INVESTOR_TYPE_SECTOR_FIT.get(inv_type, {})
        best_fit   = max((type_fits.get(s, 30) for s in target_sectors), default=30)
        sector_score = best_fit * 0.30

        # Financial capacity (0-25)
        budget = investor.get("expansion_budget_b", 1)
        cap_score = min(25, (budget / 50) * 25)

        # Investment momentum (0-25)
        ims = investor.get("ims", 50)
        grflds = investor.get("recent_greenfields", 0)
        mom_score = min(25, (ims/100)*15 + min(10, grflds*0.8))

        # Geographic diversification bonus (0-20)
        # Bonus if HQ ≠ destination (inward investment, not domestic)
        geo_score = 20 if investor.get("hq") != destination_iso3 else 8

        its = round(sector_score + cap_score + mom_score + geo_score, 2)
        tier = 1 if its >= 70 else 2 if its >= 50 else 3

        note = f"{investor['name']} ({investor.get('hq')}) — {inv_type} · Budget: ${budget:.0f}B · IMS: {ims}"

        return InvestorScore(
            investor_name  = investor["name"],
            hq_iso3        = investor.get("hq","?"),
            investor_type  = inv_type,
            its_score      = its,
            its_tier       = tier,
            sector_fit     = round(sector_score/0.30, 1),
            capacity_score = round(cap_score/0.25*100, 1),
            momentum_score = round(mom_score/0.25*100, 1),
            strategic_note = note,
        )

    async def run_targeting(
        self,
        destination_iso3: str,
        target_sectors: list,
        top_n: int = 10,
    ) -> list[InvestorScore]:
        scores = [self.score_investor(inv, destination_iso3, target_sectors)
                  for inv in INVESTOR_UNIVERSE_SAMPLE]
        scores.sort(key=lambda s: s.its_score, reverse=True)
        return scores[:top_n]


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-27: SECTOR INTELLIGENCE AGGREGATOR
# Builds composite sector profiles integrating signals, forecasts, GFR data
# ═══════════════════════════════════════════════════════════════════════════════

SECTOR_META = {
    "J": {"name":"Information & Communication Technology","global_fdi_b":450,"growth_5yr":8.2,"top_investors":["USA","CHN","KOR","IRL","SGP"]},
    "K": {"name":"Financial & Insurance Activities",      "global_fdi_b":320,"growth_5yr":5.4,"top_investors":["USA","GBR","CHE","SGP","HKG"]},
    "C": {"name":"Manufacturing",                         "global_fdi_b":380,"growth_5yr":3.1,"top_investors":["CHN","DEU","JPN","KOR","USA"]},
    "D": {"name":"Electricity, Gas & Energy",             "global_fdi_b":290,"growth_5yr":12.8,"top_investors":["USA","GBR","FRA","DEU","CHN"]},
    "L": {"name":"Real Estate Activities",                "global_fdi_b":210,"growth_5yr":4.2,"top_investors":["USA","ARE","SGP","CHN","GBR"]},
    "F": {"name":"Construction & Infrastructure",         "global_fdi_b":175,"growth_5yr":6.5,"top_investors":["CHN","USA","FRA","ARE","KOR"]},
    "H": {"name":"Transportation & Storage",              "global_fdi_b":140,"growth_5yr":7.1,"top_investors":["ARE","SGP","DEU","USA","HKG"]},
    "Q": {"name":"Human Health & Social Work",            "global_fdi_b":120,"growth_5yr":9.4,"top_investors":["USA","GBR","IND","CHN","DEU"]},
    "B": {"name":"Mining & Quarrying",                    "global_fdi_b":185,"growth_5yr":-1.2,"top_investors":["AUS","CAN","USA","GBR","CHN"]},
    "M": {"name":"Professional & Scientific Services",   "global_fdi_b":95, "growth_5yr":6.8,"top_investors":["USA","GBR","IRL","IND","AUS"]},
}

@dataclass
class SectorProfile:
    isic:             str
    name:             str
    global_fdi_usd_b: float
    growth_5yr_pct:   float
    top_investor_hqs: list
    signal_count_30d: int
    top_destinations: list
    technology_disruption: str
    esg_transition:   str
    outlook:          str

class AGT27_SectorIntelligenceAggregator:

    async def build_profile(self, isic: str) -> SectorProfile:
        meta = SECTOR_META.get(isic, {"name":"Unknown","global_fdi_b":50,"growth_5yr":3.0,"top_investors":[]})

        disruption_map = {
            "J": "AI/LLM integration transforming software delivery; edge computing growth",
            "K": "DeFi and tokenisation challenging traditional banking infrastructure",
            "C": "Automation and reshoring driving near-market manufacturing investment",
            "D": "Renewables overtaking fossil fuels in new capacity investment globally",
            "L": "PropTech and data centres replacing traditional commercial real estate",
            "H": "Autonomous logistics and drone delivery disrupting last-mile economics",
            "Q": "Digital health and AI diagnostics scaling healthcare delivery globally",
            "B": "Critical minerals boom (lithium, cobalt, rare earths) vs. ESG pressure",
        }
        esg_map = {
            "J": "Scope 2 electricity intensity; hardware e-waste; AI energy consumption",
            "K": "Financed emissions (Scope 3); climate risk disclosure; green finance growth",
            "C": "Scope 1 process emissions; circular economy transition; supply chain",
            "D": "Direct decarbonisation leader; renewable capacity addition accelerating",
            "B": "Highest ESG scrutiny; water use; mine rehabilitation; biodiversity",
        }

        top_dest_map = {
            "J": ["USA","ARE","SGP","IRL","IND","GBR","DEU"],
            "K": ["USA","GBR","SGP","LUX","CHE","HKG","IRL"],
            "C": ["CHN","VNM","MEX","IND","DEU","USA","POL"],
            "D": ["USA","GBR","DEU","IND","AUS","BRA","ARE"],
        }

        return SectorProfile(
            isic=isic, name=meta["name"],
            global_fdi_usd_b=meta["global_fdi_b"],
            growth_5yr_pct=meta["growth_5yr"],
            top_investor_hqs=meta["top_investors"],
            signal_count_30d=int(meta["global_fdi_b"] * 0.8),
            top_destinations=top_dest_map.get(isic, ["USA","CHN","DEU","GBR","SGP"]),
            technology_disruption=disruption_map.get(isic,"Sector undergoing digital transformation"),
            esg_transition=esg_map.get(isic,"ESG compliance requirements increasing"),
            outlook="POSITIVE" if meta["growth_5yr"] > 5 else "STABLE" if meta["growth_5yr"] > 0 else "CONTRACTING",
        )

    async def build_all_profiles(self) -> list[SectorProfile]:
        tasks = [self.build_profile(isic) for isic in SECTOR_META]
        return await asyncio.gather(*tasks)


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-28: SPECIAL ECONOMIC ZONE INTELLIGENCE
# Profiles 2,400+ free zones and SEZs globally
# FZID reference system: [ISO3]-[TYPE]-[SEQ4]
# ═══════════════════════════════════════════════════════════════════════════════

ZONE_DATABASE = [
    {"fzid":"ARE-FZ-0001","name":"Jebel Ali Free Zone (JAFZA)","iso3":"ARE","city":"Dubai","type":"FREE_ZONE","sectors":["all"],"companies":9500,"established":1985,"operator":"DP World","incentives":["100% foreign ownership","0% corporate tax","0% personal income tax","100% capital repatriation","No import/export duties"],"setup_days":5,"min_capital_usd":0,"notable_tenants":["Amazon","Samsung","Siemens","Adidas"]},
    {"fzid":"ARE-FZ-0002","name":"Dubai Internet City (DIC)","iso3":"ARE","city":"Dubai","type":"TECH_ZONE","sectors":["J","M"],"companies":1600,"established":1999,"operator":"TECOM","incentives":["100% foreign ownership","0% corporate tax","Sector: Technology only","Fast-track licensing 1-3 days"],"setup_days":3,"min_capital_usd":0,"notable_tenants":["Microsoft","Google","Facebook","IBM","Oracle"]},
    {"fzid":"ARE-FZ-0003","name":"Abu Dhabi Global Market (ADGM)","iso3":"ARE","city":"Abu Dhabi","type":"FINANCIAL_CENTRE","sectors":["K","M"],"companies":2100,"established":2015,"operator":"ADGM Authority","incentives":["English common law jurisdiction","0% corporate tax","No capital controls","Full ownership","FSRA regulated"],"setup_days":7,"min_capital_usd":0,"notable_tenants":["Goldman Sachs","JPMorgan","Citi","BlackRock","Mubadala"]},
    {"fzid":"ARE-FZ-0004","name":"Masdar City Free Zone","iso3":"ARE","city":"Abu Dhabi","type":"GREEN_ZONE","sectors":["D","J","M"],"companies":1000,"established":2008,"operator":"Masdar","incentives":["0% corporate tax","Green tech focus","Zero-carbon environment","IRENA headquarters"],"setup_days":5,"min_capital_usd":0,"notable_tenants":["Siemens","GE","Honeywell","Lockheed Martin"]},
    {"fzid":"SAU-SEZ-0001","name":"NEOM","iso3":"SAU","city":"Tabuk Region","type":"GIGA_PROJECT","sectors":["all"],"companies":500,"established":2017,"operator":"NEOM Company","incentives":["Distinct regulatory framework","0% personal income tax","Smart city infrastructure","AI-native environment"],"setup_days":30,"min_capital_usd":100000,"notable_tenants":["NEOM partners","First stages under construction"]},
    {"fzid":"SAU-SEZ-0002","name":"King Abdullah Economic City (KAEC)","iso3":"SAU","city":"Jeddah","type":"INDUSTRIAL_CITY","sectors":["C","H","F","D"],"companies":200,"established":2005,"operator":"Emaar EC","incentives":["King Salman Energy Park adjacent","Industrial incentive package","Port access","Logistics hub"],"setup_days":14,"min_capital_usd":500000,"notable_tenants":["P&G","Nestlé","Unilever"]},
    {"fzid":"SGP-FZ-0001","name":"Jurong Island","iso3":"SGP","city":"Singapore","type":"INDUSTRIAL_ISLAND","sectors":["B","C","D"],"companies":100,"established":1995,"operator":"JTC Corporation","incentives":["Pioneer status tax incentives","R&D grants","Skilled talent pipeline","World-class infrastructure"],"setup_days":30,"min_capital_usd":1000000,"notable_tenants":["ExxonMobil","Shell","BASF","Sumitomo"]},
    {"fzid":"IRL-FZ-0001","name":"Shannon Free Zone","iso3":"IRL","city":"Shannon","type":"FREE_ZONE","sectors":["C","H","M","J"],"companies":150,"established":1959,"operator":"Shannon Group","incentives":["EU market access","12.5% corporate tax","Skilled English-speaking workforce","IDA supported"],"setup_days":21,"min_capital_usd":0,"notable_tenants":["GE Aviation","Lufthansa Technik","DHL","Zimmer Biomet"]},
    {"fzid":"IND-SEZ-0001","name":"GIFT City","iso3":"IND","city":"Gandhinagar","type":"FINANCIAL_CENTRE","sectors":["K","J","M"],"companies":450,"established":2007,"operator":"GIFT SEZ Ltd","incentives":["0% GST","0% STT","10yr tax holiday","Offshore banking"],"setup_days":7,"min_capital_usd":0,"notable_tenants":["BSE","NSE","JP Morgan","Bank of America","Deutsche Bank"]},
    {"fzid":"KEN-SEZ-0001","name":"Nairobi International Financial Centre","iso3":"KEN","city":"Nairobi","type":"FINANCIAL_CENTRE","sectors":["K","M","J"],"companies":80,"established":2017,"operator":"NIFC Authority","incentives":["15% corporate tax (vs 30% standard)","100% foreign ownership","Fintech sandbox","East Africa gateway"],"setup_days":14,"min_capital_usd":0,"notable_tenants":["Safaricom M-Pesa","Standard Chartered","Visa"]},
]

@dataclass
class ZoneProfile:
    fzid:          str
    name:          str
    iso3:          str
    city:          str
    zone_type:     str
    sectors:       list
    company_count: int
    established:   int
    operator:      str
    incentives:    list
    setup_days:    int
    min_capital:   int
    notable_tenants: list
    strategic_fit: float    # 0-100 for given sector query

class AGT28_ZoneIntelligenceAgent:

    def score_zone_fit(self, zone: dict, target_sectors: list) -> float:
        zone_sectors = zone.get("sectors", [])
        if "all" in zone_sectors:
            return 85.0
        matches = len([s for s in target_sectors if s in zone_sectors])
        return min(100, matches * 30 + 40)

    async def search_zones(
        self,
        iso3: Optional[str] = None,
        sectors: Optional[list] = None,
        zone_type: Optional[str] = None,
    ) -> list[ZoneProfile]:
        results = []
        for z in ZONE_DATABASE:
            if iso3 and z["iso3"] != iso3:
                continue
            if zone_type and z["type"] != zone_type:
                continue

            fit = self.score_zone_fit(z, sectors or [])

            results.append(ZoneProfile(
                fzid=z["fzid"], name=z["name"], iso3=z["iso3"],
                city=z["city"], zone_type=z["type"],
                sectors=z["sectors"], company_count=z["companies"],
                established=z["established"], operator=z["operator"],
                incentives=z["incentives"], setup_days=z["setup_days"],
                min_capital=z["min_capital_usd"],
                notable_tenants=z["notable_tenants"],
                strategic_fit=fit,
            ))

        results.sort(key=lambda z: z.strategic_fit, reverse=True)
        return results


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-29: ECONOMIC CALENDAR AGENT
# Tracks data releases, policy meetings, and investment events
# Users get personalised economic calendars filtered to their watchlist
# ═══════════════════════════════════════════════════════════════════════════════

CALENDAR_EVENTS = [
    {"date":"2026-03-18","time":"14:00 UTC","event":"US Federal Reserve FOMC Meeting","iso3":"USA","category":"MONETARY_POLICY","impact":"HIGH","description":"Fed interest rate decision and press conference"},
    {"date":"2026-03-19","time":"09:00 UTC","event":"Eurozone CPI Inflation (Feb)","iso3":"EEA","category":"DATA_RELEASE","impact":"MEDIUM","description":"Eurozone consumer price inflation data"},
    {"date":"2026-03-20","time":"06:00 UTC","event":"IMF World Economic Outlook Update","iso3":"INTL","category":"PUBLICATION","impact":"HIGH","description":"IMF releases updated global growth forecasts"},
    {"date":"2026-03-21","time":"08:00 UTC","event":"Saudi Arabia Q4 GDP (Preliminary)","iso3":"SAU","category":"DATA_RELEASE","impact":"HIGH","description":"Saudi Arabia preliminary Q4 2025 GDP growth"},
    {"date":"2026-03-22","time":"10:00 UTC","event":"GITEX Future Stars — Dubai","iso3":"ARE","category":"INVESTMENT_EVENT","impact":"MEDIUM","description":"Technology startup investment showcase"},
    {"date":"2026-03-25","time":"09:00 UTC","event":"UAE Annual Investment Meeting (AIM) — Day 1","iso3":"ARE","category":"INVESTMENT_EVENT","impact":"HIGH","description":"Annual Investment Meeting Abu Dhabi — FDI announcements expected"},
    {"date":"2026-03-26","time":"09:00 UTC","event":"UAE Annual Investment Meeting (AIM) — Day 2","iso3":"ARE","category":"INVESTMENT_EVENT","impact":"HIGH","description":"Investment commitments and MOU signings"},
    {"date":"2026-04-01","time":"01:30 UTC","event":"China PMI Manufacturing (Mar)","iso3":"CHN","category":"DATA_RELEASE","impact":"HIGH","description":"NBS China manufacturing activity index"},
    {"date":"2026-04-02","time":"07:00 UTC","event":"India Budget Supplementary Estimates","iso3":"IND","category":"FISCAL_POLICY","impact":"MEDIUM","description":"India revised infrastructure spending data"},
    {"date":"2026-04-15","time":"13:00 UTC","event":"UNCTAD World Investment Report Preview","iso3":"INTL","category":"PUBLICATION","impact":"HIGH","description":"UNCTAD advance release of global FDI trends"},
    {"date":"2026-04-16","time":"09:00 UTC","event":"Select USA Investment Summit — Day 1","iso3":"USA","category":"INVESTMENT_EVENT","impact":"HIGH","description":"5,000+ participants; foreign IPAs and investors"},
    {"date":"2026-05-01","time":"08:00 UTC","event":"GFR Quarterly Rankings Update — Q1 2026","iso3":"INTL","category":"PLATFORM_UPDATE","impact":"HIGH","description":"Global FDI Monitor GFR scores updated for all 215 economies"},
]

@dataclass
class CalendarEvent:
    date:        str
    time:        str
    event:       str
    iso3:        str
    category:    str
    impact:      str
    description: str
    days_until:  int
    relevant:    bool   # True if matches user watchlist

class AGT29_EconomicCalendarAgent:

    IMPACT_PRIORITY = {"HIGH":3,"MEDIUM":2,"LOW":1}

    def _days_until(self, date_str: str) -> int:
        try:
            event_date = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            return max(0, (event_date - datetime.now(timezone.utc)).days)
        except Exception:
            return 999

    async def get_calendar(
        self,
        days_ahead: int = 30,
        iso3_filter: Optional[list] = None,
        categories: Optional[list] = None,
        impact_min: str = "LOW",
    ) -> list[CalendarEvent]:
        min_impact = self.IMPACT_PRIORITY.get(impact_min, 1)
        events = []
        for ev in CALENDAR_EVENTS:
            days = self._days_until(ev["date"])
            if days > days_ahead:
                continue
            if self.IMPACT_PRIORITY.get(ev["impact"],1) < min_impact:
                continue
            if iso3_filter and ev["iso3"] not in iso3_filter + ["INTL","EEA"]:
                continue
            if categories and ev["category"] not in categories:
                continue

            relevant = bool(iso3_filter) and ev["iso3"] in (iso3_filter + ["INTL"])
            events.append(CalendarEvent(
                date=ev["date"], time=ev["time"], event=ev["event"],
                iso3=ev["iso3"], category=ev["category"],
                impact=ev["impact"], description=ev["description"],
                days_until=days, relevant=relevant,
            ))

        events.sort(key=lambda e: (e.days_until, -self.IMPACT_PRIORITY.get(e.impact,1)))
        return events


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-30: BILATERAL RELATIONS INTELLIGENCE
# Maps investment treaty networks, BIT coverage, and diplomatic investment ties
# ═══════════════════════════════════════════════════════════════════════════════

# BIT / investment treaty coverage (representative sample from UNCTAD IIA database)
BIT_NETWORK = {
    "ARE": {
        "total_bits": 148, "in_force": 87,
        "partners": ["USA","GBR","DEU","FRA","CHN","IND","JPN","KOR","AUS","RUS",
                     "SGP","ITA","NLD","CHE","SWE","FIN","DNK","NOR","AUT","ESP"],
        "recent_concluded": [("USA","TIFA 2004"),("IND","CEPA 2022"),("ISR","CEPA 2023")],
        "negotiating": ["EU CEPA","UK bilateral investment","BRICS+ frameworks"],
    },
    "SAU": {
        "total_bits": 88, "in_force": 64,
        "partners": ["CHN","IND","USA","DEU","FRA","GBR","JPN","KOR","RUS","TUR"],
        "recent_concluded": [("CHN","MOU 2023"),("IND","Enhanced partnership 2023")],
        "negotiating": ["EU FTA","UK bilateral","ASEAN dialogue"],
    },
    "IND": {
        "total_bits": 84, "in_force": 14,  # Many lapsed after 2016 model BIT review
        "partners": ["USA","GBR","DEU","FRA","JPN","KOR","AUS","SGP","UAE","NLD"],
        "recent_concluded": [("ARE","CEPA 2022"),("AUS","ECTA 2022")],
        "negotiating": ["EU FTA","UK FTA","Canada FTA","GCC FTA"],
    },
    "DEU": {
        "total_bits": 130, "in_force": 122,
        "partners": ["CHN","RUS","IND","IDN","VNM","THA","MYS","NGA","ZAF","EGY"],
        "recent_concluded": [("CHN","EU-China CAI 2020 (suspended)")],
        "negotiating": ["EU-Mercosur FTA","EU-India FTA"],
    },
    "SGP": {
        "total_bits": 74, "in_force": 40,
        "partners": ["CHN","IND","USA","AUS","NZL","GBR","DEU","FRA","JPN","KOR"],
        "recent_concluded": [("EU","EU-Singapore FTA 2019"),("UK","UK-Singapore FTA 2022")],
        "negotiating": ["CPTPP expansion","India CEPA upgrade"],
    },
}

@dataclass
class BilateralRelationsProfile:
    source_iso3:       str
    dest_iso3:         str
    bit_in_force:      bool
    bit_name:          Optional[str]
    bit_year:          Optional[int]
    protection_level:  str     # STRONG / MODERATE / WEAK / NONE
    dispute_mechanism: str     # ICSID / UNCITRAL / BILATERAL / NONE
    total_source_bits: int
    total_dest_bits:   int
    diplomatic_tier:   str     # STRATEGIC / COMPREHENSIVE / NORMAL / RESTRICTED
    investment_note:   str

class AGT30_BilateralRelationsAgent:

    def _check_bit(self, source: str, dest: str) -> tuple[bool, Optional[str]]:
        dest_network = BIT_NETWORK.get(dest, {})
        source_network = BIT_NETWORK.get(source, {})
        # Check if source is in destination's BIT partners list
        dest_partners = dest_network.get("partners", [])
        source_partners = source_network.get("partners", [])
        has_bit = source in dest_partners or dest in source_partners
        return has_bit, "Bilateral Investment Treaty" if has_bit else None

    def _protection_level(self, has_bit: bool, source: str, dest: str) -> str:
        if not has_bit:
            return "NONE"
        # MENA economies have strong BIT networks with Western countries
        strong_pairs = {("USA","ARE"),("GBR","ARE"),("DEU","ARE"),
                        ("USA","SAU"),("GBR","IND"),("USA","SGP")}
        if (source,dest) in strong_pairs or (dest,source) in strong_pairs:
            return "STRONG"
        return "MODERATE"

    def _diplomatic_tier(self, source: str, dest: str) -> str:
        strategic = {("USA","ARE"),("USA","SAU"),("USA","IND"),("USA","SGP"),
                     ("GBR","ARE"),("GBR","IND"),("DEU","CHN"),("DEU","IND")}
        if (source,dest) in strategic or (dest,source) in strategic:
            return "STRATEGIC"
        # Both high-income democracies
        hic_democracies = {"USA","GBR","DEU","FRA","AUS","CAN","JPN","KOR","SGP","NLD","CHE","SWE","NOR","DNK"}
        if source in hic_democracies and dest in hic_democracies:
            return "COMPREHENSIVE"
        return "NORMAL"

    async def analyse_corridor(self, source_iso3: str, dest_iso3: str) -> BilateralRelationsProfile:
        has_bit, bit_name = self._check_bit(source_iso3, dest_iso3)
        protection  = self._protection_level(has_bit, source_iso3, dest_iso3)
        diplo_tier  = self._diplomatic_tier(source_iso3, dest_iso3)

        source_bits = BIT_NETWORK.get(source_iso3, {}).get("in_force", 0)
        dest_bits   = BIT_NETWORK.get(dest_iso3,   {}).get("in_force", 0)

        dispute = "ICSID" if has_bit and protection == "STRONG" else \
                  "UNCITRAL" if has_bit else "BILATERAL" if diplo_tier in ("STRATEGIC","COMPREHENSIVE") else "NONE"

        note_map = {
            "STRONG":   f"Strong BIT framework provides robust investor protection between {source_iso3} and {dest_iso3}. ICSID arbitration available for dispute resolution.",
            "MODERATE": f"BIT exists but investor should verify coverage scope. Enhanced contractual protections recommended.",
            "WEAK":     f"Limited treaty protection. Contractual protections, political risk insurance, and escrow arrangements recommended.",
            "NONE":     f"No BIT in force between {source_iso3} and {dest_iso3}. Recommend: political risk insurance, international arbitration clauses, and third-country structuring through a jurisdiction with strong BIT coverage.",
        }

        return BilateralRelationsProfile(
            source_iso3=source_iso3, dest_iso3=dest_iso3,
            bit_in_force=has_bit, bit_name=bit_name, bit_year=None,
            protection_level=protection, dispute_mechanism=dispute,
            total_source_bits=source_bits, total_dest_bits=dest_bits,
            diplomatic_tier=diplo_tier,
            investment_note=note_map.get(protection, ""),
        )

    async def batch_analyse(self, corridors: list) -> list[BilateralRelationsProfile]:
        tasks = [self.analyse_corridor(s, d) for s, d in corridors]
        return await asyncio.gather(*tasks)


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)

    async def test():
        print("\n" + "="*60)
        print("AGT-26: INVESTOR TARGETING ENGINE")
        print("="*60)
        agt26 = AGT26_InvestorTargetingEngine()
        targets = await agt26.run_targeting("ARE", ["J","K"], top_n=5)
        print(f"✓ Top 5 investors for ARE (Tech+Finance):")
        for t in targets:
            print(f"  [T{t.its_tier}] ITS:{t.its_score:5.1f} | {t.investor_name:<30} ({t.hq_iso3})")

        print("\n" + "="*60)
        print("AGT-27: SECTOR INTELLIGENCE AGGREGATOR")
        print("="*60)
        agt27 = AGT27_SectorIntelligenceAggregator()
        profiles = await agt27.build_all_profiles()
        print(f"✓ Sector profiles built: {len(profiles)}")
        for p in sorted(profiles, key=lambda x: x.global_fdi_usd_b, reverse=True)[:5]:
            print(f"  ISIC-{p.isic} {p.name[:30]:<30} ${p.global_fdi_usd_b:.0f}B  {p.outlook}")

        print("\n" + "="*60)
        print("AGT-28: ZONE INTELLIGENCE")
        print("="*60)
        agt28 = AGT28_ZoneIntelligenceAgent()
        zones = await agt28.search_zones(iso3="ARE", sectors=["J","K"])
        print(f"✓ UAE zones found: {len(zones)}")
        for z in zones:
            print(f"  [{z.fzid}] {z.name} | Fit:{z.strategic_fit:.0f} | {z.company_count} companies | Setup:{z.setup_days}d")

        print("\n" + "="*60)
        print("AGT-29: ECONOMIC CALENDAR")
        print("="*60)
        agt29 = AGT29_EconomicCalendarAgent()
        events = await agt29.get_calendar(days_ahead=60, iso3_filter=["ARE","USA"], impact_min="MEDIUM")
        print(f"✓ Events in next 60 days (ARE/USA/INTL, MEDIUM+): {len(events)}")
        for ev in events[:5]:
            print(f"  [{ev.days_until:2d}d] [{ev.impact:<6}] {ev.date} | {ev.event[:55]}")

        print("\n" + "="*60)
        print("AGT-30: BILATERAL RELATIONS INTELLIGENCE")
        print("="*60)
        agt30 = AGT30_BilateralRelationsAgent()
        corridors = [("USA","ARE"),("GBR","IND"),("DEU","CHN"),("USA","IND")]
        profiles = await agt30.batch_analyse(corridors)
        print(f"✓ Corridors analysed: {len(profiles)}")
        for p in profiles:
            print(f"  {p.source_iso3}↔{p.dest_iso3} | BIT:{'✓' if p.bit_in_force else '✗'} | "
                  f"Protection:{p.protection_level:<8} | Dispute:{p.dispute_mechanism} | "
                  f"Diplomatic:{p.diplomatic_tier}")

    asyncio.run(test())
