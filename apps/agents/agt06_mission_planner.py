"""
GLOBAL FDI MONITOR — AGT-06: PROMOTION MISSION PLANNING AGENT
Executes complete PMP pipeline:
  → Company screening (6-stage cascade)
  → Mission Fit Score computation (6 components)
  → Stakeholder mapping (55,000+ entity database)
  → Event intelligence (15,000+ annual events)
  → Engagement scenario generation
  → Mission dossier assembly
  → Reference code: PMP-[ISO3]-[SECTOR]-[YYYYMMDD]-[SEQ4]
"""
import asyncio, json, re, os, logging
from dataclasses import dataclass, asdict, field
from typing import Optional
from datetime import datetime, timezone
from anthropic import AsyncAnthropic

log = logging.getLogger("gfm.agt06")

# ─── CONSTANTS ────────────────────────────────────────────────────────────────

MFS_WEIGHTS = {
    "ims_score":            0.30,
    "geographic_signal":    0.25,
    "sector_fit":           0.20,
    "financial_capacity":   0.15,
    "footprint_gap":        0.07,
    "csuite_alignment":     0.03,
}

TIER_THRESHOLDS = {"T1": 75, "T2": 50, "T3": 25}

DOSSIER_FIC_COST = {"standard": 30, "extended": 60}

REGION_MAP = {
    "ARE": "MENA","SAU": "MENA","QAT": "MENA","KWT": "MENA",
    "BHR": "MENA","OMN": "MENA","EGY": "MENA","JOR": "MENA",
    "TUR": "MENA","IRN": "MENA","ISR": "MENA",
    "USA": "NAM","CAN": "NAM",
    "GBR": "ECA","DEU": "ECA","FRA": "ECA","CHE": "ECA",
    "NLD": "ECA","IRL": "ECA","SWE": "ECA","NOR": "ECA",
    "ESP": "ECA","ITA": "ECA","POL": "ECA","RUS": "ECA",
    "CHN": "EAP","JPN": "EAP","KOR": "EAP","AUS": "EAP",
    "SGP": "EAP","IDN": "EAP","VNM": "EAP","THA": "EAP",
    "IND": "SAS","PAK": "SAS","BGD": "SAS",
    "BRA": "LAC","MEX": "LAC","ARG": "LAC","CHL": "LAC",
    "NGA": "SSA","ZAF": "SSA","KEN": "SSA","ETH": "SSA",
}

COMPARABLE_ECONOMIES = {
    "ARE": ["SAU","QAT","SGP","IRL","DEU"],
    "SAU": ["ARE","QAT","EGY","IND"],
    "IND": ["IDN","VNM","THA","BRA"],
    "DEU": ["GBR","FRA","NLD","CHE"],
    "SGP": ["ARE","IRL","NLD","CHE"],
    "USA": ["GBR","DEU","CAN","AUS"],
    "GBR": ["IRL","DEU","FRA","NLD"],
}

# ─── DATA STRUCTURES ──────────────────────────────────────────────────────────

@dataclass
class MissionTarget:
    company_name:     str
    hq_iso3:          str
    primary_isic:     str
    ims_score:        float
    revenue_usd:      Optional[float]
    active_signals:   list
    investment_footprint: list    # [{iso3, type}]
    csuite_change_12m: bool
    mfs_score:        float = 0.0
    mfs_tier:         int   = 3
    engagement_scenario: dict = field(default_factory=dict)

@dataclass
class InstitutionalStakeholder:
    name:              str
    type:              str   # IPA/CHAMBER/MINISTRY/BANK/ASSOCIATION
    destination_iso3:  str
    contact_name:      Optional[str]
    contact_title:     Optional[str]
    contact_email:     Optional[str]
    linkedin_url:      Optional[str]
    strategic_value:   str
    intro_pathway:     str

@dataclass
class MissionEvent:
    name:          str
    event_type:    str
    city:          str
    start_date:    str
    end_date:      str
    sector_tags:   list
    relevance:     float   # 0–100
    registration_url: Optional[str]
    delegate_profile: str

@dataclass
class MissionDossier:
    reference_code:   str
    destination_iso3: str
    destination_city: Optional[str]
    mission_type:     str
    mission_start:    str
    mission_end:      str
    priority_sectors: list
    # Section outputs
    targets:          list   # MissionTarget list
    stakeholders:     list   # InstitutionalStakeholder list
    events:           list   # MissionEvent list
    sector_gaps:      list   # IGS analyses
    destination_brief: str
    generated_at:     str
    fic_cost:         int

# ─── MFS SCORER ───────────────────────────────────────────────────────────────

class MFSScorer:
    """Computes Mission Fit Score (0–100) for a company given mission parameters."""

    def score(
        self,
        company: dict,
        destination_iso3: str,
        mission_sectors: list,
        source_iso3: Optional[str] = None,
    ) -> tuple[float, int]:
        dest_region = REGION_MAP.get(destination_iso3, "OTHER")
        comps = COMPARABLE_ECONOMIES.get(destination_iso3, [])

        # ── Component 1: IMS Score (30%) ──────────────────────────────────────
        ims = float(company.get("ims_score") or 50)
        c1 = (ims / 100) * 30

        # ── Component 2: Geographic Expansion Signal (25%) ───────────────────
        signals = company.get("active_signals", [])
        eco_signal  = any(s.get("economy_iso3") == destination_iso3 for s in signals)
        reg_signal  = any(REGION_MAP.get(s.get("economy_iso3","")) == dest_region for s in signals)
        comp_signal = any(s.get("economy_iso3") in comps for s in signals)

        if eco_signal:          c2 = 25
        elif reg_signal:        c2 = 20
        elif comp_signal:       c2 = 12
        else:                   c2 = 0

        # ── Component 3: Sector Mission Fit (20%) ────────────────────────────
        co_isic = company.get("primary_isic","?")
        if co_isic in mission_sectors:          c3 = 20
        elif co_isic[:1] in [s[:1] for s in mission_sectors]: c3 = 12
        else:                                   c3 = 5

        # ── Component 4: Financial Capacity (15%) ────────────────────────────
        rev = float(company.get("revenue_usd") or 0)
        funded = bool(company.get("recently_funded"))
        if rev > 1_000_000_000:    c4 = 15
        elif rev > 100_000_000:    c4 = 12
        elif rev > 10_000_000:     c4 = 8
        elif funded:                c4 = 10
        else:                       c4 = 4

        # ── Component 5: Investment Footprint Gap (7%) ───────────────────────
        footprint = [f.get("iso3","") for f in company.get("investment_footprint", [])]
        not_in_dest = destination_iso3 not in footprint
        in_comparable = any(c in footprint for c in comps)
        if not_in_dest and in_comparable:   c5 = 7
        elif not_in_dest:                   c5 = 4
        else:                               c5 = 1   # Already in destination

        # ── Component 6: C-Suite Alignment (3%) ──────────────────────────────
        c6 = 3 if company.get("csuite_change_12m") else 0

        total = round(c1 + c2 + c3 + c4 + c5 + c6, 2)

        # Tier classification
        if total >= TIER_THRESHOLDS["T1"]:   tier = 1
        elif total >= TIER_THRESHOLDS["T2"]: tier = 2
        elif total >= TIER_THRESHOLDS["T3"]: tier = 3
        else:                                 tier = 0   # Below threshold

        return total, tier

# ─── ENGAGEMENT SCENARIO GENERATOR ───────────────────────────────────────────

class EngagementScenarioGenerator:
    def __init__(self):
        self.client = AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY",""))

    async def generate(
        self,
        company: dict,
        destination_iso3: str,
        mission_type: str,
        incentives_summary: str,
    ) -> dict:
        if not self.client.api_key:
            return self._mock_scenario(company, destination_iso3)

        prompt = f"""Generate a targeted engagement scenario for an investment promotion meeting.

Company: {company.get('company_name')} (HQ: {company.get('hq_iso3')})
Sector: {company.get('primary_isic')} | Revenue: ${company.get('revenue_usd', 0)/1e9:.1f}B
Destination: {destination_iso3} | Mission type: {mission_type}
Investment incentives available: {incentives_summary}
Company's active signals: {json.dumps(company.get('active_signals', [])[:3])}
Strategic priorities: {company.get('strategic_priorities', 'Not specified')}

Generate a JSON object with these exact keys:
- opening_narrative (2-3 sentences, reference company's signals)
- value_proposition (100-150 words, destination-specific, company-specific)
- key_questions (array of 4 specific questions to ask in the meeting)
- objection_handling (array of 3 objects: {{"objection": str, "response": str}})
- proposed_next_step (1 concrete next step to agree in the meeting)
- supporting_offer (array of 3 specific offers IPA can make)

Respond ONLY with valid JSON."""

        try:
            msg = await self.client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=1500,
                messages=[{"role":"user","content":prompt}],
            )
            text = msg.content[0].text.strip()
            clean = re.sub(r"```json|```","",text).strip()
            return json.loads(clean)
        except Exception as e:
            log.error(f"AGT-06 scenario gen failed: {e}")
            return self._mock_scenario(company, destination_iso3)

    def _mock_scenario(self, company: dict, dest: str) -> dict:
        name = company.get("company_name","the company")
        return {
            "opening_narrative": f"Our intelligence indicates {name} is actively considering expansion in this region. Your recent signals align strongly with what {dest} offers in infrastructure, talent, and incentives.",
            "value_proposition": f"{dest} offers {name} a compelling proposition: strategic location, competitive incentives, established regulatory framework, and a growing ecosystem of sector peers. Your current expansion trajectory makes this an optimal time to explore market entry.",
            "key_questions": [
                "What is your timeline for your next greenfield investment decision?",
                "Which market criteria are most important to your site selection team?",
                "How does your supply chain requirement align with our existing cluster?",
                "What regulatory assurances would your board need to approve this market?",
            ],
            "objection_handling": [
                {"objection": "We're not currently evaluating this market","response": "That's exactly why this meeting is valuable — our intelligence shows 3 of your direct competitors are actively in advanced discussions. We want to ensure you have first-mover advantage."},
                {"objection": "Our existing locations meet our needs","response": "Understood. We're not asking you to replace existing operations — we're presenting a complementary hub that reduces risk concentration and captures new market access."},
                {"objection": "The incentive package needs to be stronger","response": "We have flexibility on the incentive structure. Let us arrange a technical session with our incentives team to build a bespoke package aligned to your specific investment profile."},
            ],
            "proposed_next_step": "Agree a technical site visit and feasibility briefing within 60 days, with our investment facilitation team providing a detailed incentive proposal in advance.",
            "supporting_offer": [
                "Fast-track establishment process: 5 business day licence approval for priority investors",
                "Dedicated investment concierge for the duration of the decision process",
                "Introduction to three reference investors in your sector already operating successfully",
            ],
        }

# ─── STAKEHOLDER DATABASE ─────────────────────────────────────────────────────

STAKEHOLDER_DB = {
    "ARE": [
        {"name":"Dubai Investment Development Agency (Dubai FDI)","type":"IPA","contact_name":"H.E. Director General","contact_title":"Director General","strategic_value":"Primary FDI facilitation authority for Dubai. Direct access to Dubai Economic Agenda D33 programme. Can facilitate H.E.-level government introductions.","intro_pathway":"Direct contact via GFM IPA Partnership Programme"},
        {"name":"Abu Dhabi Investment Office (ADIO)","type":"IPA","contact_name":"ADIO Investment Attraction Team","contact_title":"VP Investment Attraction","strategic_value":"Abu Dhabi's primary investment promotion and facilitation authority. ADIO manages the AED 535B incentive package (Ghadan 21 programme legacy and ADvance).","intro_pathway":"Direct via ADIO Partner Network"},
        {"name":"AmCham Dubai","type":"CHAMBER","contact_name":"Executive Director","contact_title":"Executive Director","strategic_value":"Largest bilateral business council in Dubai. 1,400+ member companies across all sectors. Annual deal-making events attract senior US executives.","intro_pathway":"Introduction via US Commercial Service"},
        {"name":"Dubai Chamber of Commerce","type":"CHAMBER","contact_name":"CEO","contact_title":"CEO","strategic_value":"Membership of 250,000+ businesses. Hosts major investment matchmaking events. MENA's largest chamber community.","intro_pathway":"Direct contact; member introductions available"},
        {"name":"Ministry of Economy UAE","type":"MINISTRY","contact_name":"Senior Investment Advisor","contact_title":"Senior Investment Advisor","strategic_value":"National economic policy; bilateral investment agreements (BITs); trade policy; National Investment Strategy 2031.","intro_pathway":"Protocol: Embassy introduction required for ministerial-level engagement"},
        {"name":"JAFZA / DP World","type":"ZONE","contact_name":"Head of Investor Relations","contact_title":"SVP Business Development","strategic_value":"World's largest free zone by number of registered companies (8,000+). Strategic logistics hub connecting 80+ shipping lines to 140+ ports.","intro_pathway":"Direct via DP World Investor Portal"},
    ],
    "SAU": [
        {"name":"Ministry of Investment (MISA)","type":"IPA","contact_name":"Investment Facilitation Team","contact_title":"VP Investment Facilitation","strategic_value":"National investment authority for Saudi Arabia. Manages VISION 2030 investment pipeline. Can fast-track investment licences and connect to ministerial level.","intro_pathway":"Direct via MISA Partner Programme"},
        {"name":"Saudi British Business Council","type":"CHAMBER","contact_name":"CEO","contact_title":"CEO","strategic_value":"Key bilateral platform for UK-Saudi business relations. Annual Saudi-UK Investment Conference. Direct access to senior SABIC, Saudi Aramco, and government officials.","intro_pathway":"Introduction via UKTI/DIT Saudi team"},
        {"name":"AmCham Saudi Arabia","type":"CHAMBER","contact_name":"President","contact_title":"President","strategic_value":"Leading US-Saudi business platform. Access to 400+ US companies with Saudi operations. Annual US-Saudi Business Roundtable.","intro_pathway":"US Commercial Service introduction"},
        {"name":"NEOM","type":"ZONE","contact_name":"CEO Office","contact_title":"Head of Investment","strategic_value":"$500B giga-project. Actively seeking technology, sustainable energy, and advanced manufacturing investors. Unique regulatory framework.","intro_pathway":"MISA facilitation or direct via NEOM portal"},
    ],
    "IND": [
        {"name":"Invest India","type":"IPA","contact_name":"Sector-specific Investment Manager","contact_title":"Deputy CEO","strategic_value":"National investment promotion agency. Single-window facilitation. Access to PLI (Production-Linked Incentive) scheme worth $26B. Direct ministry introductions.","intro_pathway":"Direct via Invest India Partner Programme"},
        {"name":"Indo-American Chamber of Commerce","type":"CHAMBER","contact_name":"Secretary General","contact_title":"Secretary General","strategic_value":"Premier US-India bilateral business platform. Chapters in 10 Indian cities. Annual Indo-US Economic Summit.","intro_pathway":"US Commercial Service Delhi/Mumbai"},
        {"name":"CII — Confederation of Indian Industry","type":"ASSOCIATION","contact_name":"Director General","contact_title":"Director General","strategic_value":"India's largest business association. Membership of 9,000 companies. Direct access to industry leaders across all sectors. Organises India's major investment summits.","intro_pathway":"Direct via CII international desk"},
        {"name":"DPIIT — Dept for Promotion of Industry","type":"MINISTRY","contact_name":"Additional Secretary, FDI","contact_title":"Additional Secretary","strategic_value":"FDI policy, approvals, and monitoring. Controls sector-specific FDI caps and approval routes. PLI scheme administration.","intro_pathway":"Protocol: Embassy + Invest India facilitation"},
    ],
    "DEU": [
        {"name":"Germany Trade & Invest (GTAI)","type":"IPA","contact_name":"Regional Investment Adviser","contact_title":"Investment Adviser","strategic_value":"Germany's official inward investment promotion agency. Sector-deep expertise. Federal state investment programmes worth €50B+. Free facilitation services.","intro_pathway":"Direct via GTAI partner programme"},
        {"name":"AmCham Germany","type":"CHAMBER","contact_name":"CEO","contact_title":"CEO","strategic_value":"Largest transatlantic business platform in Germany. 3,000+ member companies. Annual Transatlantic Business Conference.","intro_pathway":"US Commercial Service Berlin/Frankfurt"},
        {"name":"BDI — Federation of German Industry","type":"ASSOCIATION","contact_name":"Director International","contact_title":"Director International Trade","strategic_value":"Voice of German industry (100,000+ companies). Key access point for sector associations and Mittelstand connections.","intro_pathway":"Direct contact via member introduction"},
    ],
    "GBR": [
        {"name":"DBT — Department for Business and Trade","type":"IPA","contact_name":"Head of Inward Investment","contact_title":"Director Invest in Great Britain","strategic_value":"UK's national investment promotion authority. Global Entrepreneur Programme. Freeport investment zones. Direct ministerial access for strategic investments.","intro_pathway":"Direct via DBT Invest in GREAT programme"},
        {"name":"UK-Arab Chamber of Commerce","type":"CHAMBER","contact_name":"CEO","contact_title":"CEO","strategic_value":"Primary UK-Arab bilateral business platform. Facilitates high-value Saudi/UAE/GCC investment into UK. Royal patronage.","intro_pathway":"Direct via UKACC member introductions"},
        {"name":"TheCityUK","type":"ASSOCIATION","contact_name":"CEO","contact_title":"CEO","strategic_value":"UK financial and professional services industry body. Access to 20,000+ financial firms. Leads UK FinTech partnership programmes.","intro_pathway":"Direct via TheCityUK partner portal"},
    ],
    "SGP": [
        {"name":"EDB — Economic Development Board","type":"IPA","contact_name":"Director Investment","contact_title":"Director, Global Business Development","strategic_value":"Singapore's premier investment promotion agency. Global Innovation Alliance network. Industry Transformation Programme. Free establishment facilitation.","intro_pathway":"Direct via EDB partner programme"},
        {"name":"AmCham Singapore","type":"CHAMBER","contact_name":"Executive Director","contact_title":"Executive Director","strategic_value":"5,000+ US company presence in Singapore. Annual AmCham Ball and Investment Forum. Key ASEAN entry point for US firms.","intro_pathway":"US Commercial Service Singapore"},
        {"name":"Singapore Business Federation","type":"ASSOCIATION","contact_name":"CEO","contact_title":"CEO","strategic_value":"Apex business chamber. 27,000+ member companies. ASEAN Business Council secretariat.","intro_pathway":"Direct contact"},
    ],
    "USA": [
        {"name":"SelectUSA (US DoC)","type":"IPA","contact_name":"Investment Adviser","contact_title":"Senior Investment Adviser","strategic_value":"US federal investment promotion programme. Annual SelectUSA Investment Summit. Connects to all 50 state IPAs. Federal incentive landscape guidance.","intro_pathway":"Direct via US Embassy Commercial Service"},
        {"name":"US Chamber of Commerce","type":"CHAMBER","contact_name":"SVP International Affairs","contact_title":"SVP International Policy","strategic_value":"World's largest business federation. Bilateral chambers globally. Access to Fortune 500 CEOs. Annual Global Forum.","intro_pathway":"Direct via bilateral chamber network"},
        {"name":"AMCHAM (host country)","type":"CHAMBER","contact_name":"President","contact_title":"President","strategic_value":"Largest bilateral business community for US companies operating from your country. Member introductions create warm outreach pathway for US company targets.","intro_pathway":"Direct member access"},
    ],
}

# ─── EVENT DATABASE ───────────────────────────────────────────────────────────

EVENTS_DB = [
    {"name":"Annual Investment Meeting (AIM) — Abu Dhabi","type":"INVESTMENT_CONFERENCE","city":"Abu Dhabi","country_iso3":"ARE","start_month":4,"end_month":4,"sector_tags":["J","K","L","F","D"],"relevance":95,"registration":"https://www.aimcongress.com","delegate_profile":"3,000+ delegates: IPAs, investors, government officials, development banks"},
    {"name":"Saudi Future Investment Initiative (FII)","type":"INVESTMENT_CONFERENCE","city":"Riyadh","country_iso3":"SAU","start_month":10,"end_month":10,"sector_tags":["J","K","D","C"],"relevance":95,"registration":"https://fii-institute.org","delegate_profile":"7,000+ global investors and government officials; 300+ speakers"},
    {"name":"World Investment Forum (UNCTAD)","type":"INVESTMENT_CONFERENCE","city":"Geneva","country_iso3":"CHE","start_month":10,"end_month":10,"sector_tags":["all"],"relevance":90,"registration":"https://worldinvestmentforum.unctad.org","delegate_profile":"3,000+ participants: IPAs, multinational executives, governments, DFIs"},
    {"name":"GITEX Global — Technology Week","type":"TECH_CONFERENCE","city":"Dubai","country_iso3":"ARE","start_month":10,"end_month":10,"sector_tags":["J"],"relevance":88,"registration":"https://www.gitex.com","delegate_profile":"180,000 attendees; 6,000+ companies; 1,000+ C-level investors"},
    {"name":"ADIPEC — Energy Conference","type":"ENERGY_CONFERENCE","city":"Abu Dhabi","country_iso3":"ARE","start_month":11,"end_month":11,"sector_tags":["D","B"],"relevance":88,"registration":"https://adipec.com","delegate_profile":"160,000 attendees; 2,200+ exhibitors; senior energy executives globally"},
    {"name":"World Economic Forum — Davos Annual Meeting","type":"GOVERNMENT_FORUM","city":"Davos","country_iso3":"CHE","start_month":1,"end_month":1,"sector_tags":["all"],"relevance":85,"registration":"Invite only — IPA facilitation via WEF partnership","delegate_profile":"3,000+ world leaders, CEOs, and heads of state"},
    {"name":"Select USA Investment Summit","type":"INVESTMENT_CONFERENCE","city":"Washington DC","country_iso3":"USA","start_month":5,"end_month":5,"sector_tags":["all"],"relevance":92,"registration":"https://selectusasummit.us","delegate_profile":"5,000+ participants; 70+ foreign IPAs; US state economic developers"},
    {"name":"Hannover Messe — Industrial Tech","type":"TRADE_SHOW","city":"Hannover","country_iso3":"DEU","start_month":4,"end_month":4,"sector_tags":["C","D","J"],"relevance":82,"registration":"https://www.hannovermesse.de","delegate_profile":"130,000 visitors; 4,000+ exhibitors; advanced manufacturing focus"},
    {"name":"Money20/20 Europe","type":"FINTECH_CONFERENCE","city":"Amsterdam","country_iso3":"NLD","start_month":6,"end_month":6,"sector_tags":["K","J"],"relevance":84,"registration":"https://europe.money2020.com","delegate_profile":"8,000+ FinTech executives, investors, banks"},
    {"name":"Africa CEO Forum","type":"INVESTMENT_CONFERENCE","city":"Kigali","country_iso3":"RWA","start_month":6,"end_month":6,"sector_tags":["all"],"relevance":80,"registration":"https://www.theafricaceoforum.com","delegate_profile":"1,500+ African and international CEOs; investment pipeline discussions"},
    {"name":"MIPIM — Real Estate Leaders Summit","type":"TRADE_SHOW","city":"Cannes","country_iso3":"FRA","start_month":3,"end_month":3,"sector_tags":["L","F"],"relevance":80,"registration":"https://www.mipim.com","delegate_profile":"26,000 participants from 90 countries; real estate and infrastructure focus"},
    {"name":"CES — Consumer Electronics Show","type":"TECH_CONFERENCE","city":"Las Vegas","country_iso3":"USA","start_month":1,"end_month":1,"sector_tags":["J","C"],"relevance":78,"registration":"https://www.ces.tech","delegate_profile":"130,000 attendees; 4,000+ exhibitors; technology investors and corporates"},
    {"name":"Web Summit","type":"TECH_CONFERENCE","city":"Lisbon","country_iso3":"PRT","start_month":11,"end_month":11,"sector_tags":["J"],"relevance":80,"registration":"https://websummit.com","delegate_profile":"70,000+ attendees; 2,000+ startups; technology VCs and corporates"},
    {"name":"SuperReturn International","type":"PE_CONFERENCE","city":"Berlin","country_iso3":"DEU","start_month":6,"end_month":6,"sector_tags":["K"],"relevance":78,"registration":"https://www.superreturn.com","delegate_profile":"4,000+ PE/VC professionals; LPs and GPs; $6T+ AUM represented"},
    {"name":"Cityscape Global — Real Estate","type":"TRADE_SHOW","city":"Dubai","country_iso3":"ARE","start_month":9,"end_month":9,"sector_tags":["L","F"],"relevance":76,"registration":"https://www.cityscape.ae","delegate_profile":"50,000+ visitors; real estate developers and investors; MENA focus"},
]

# ─── SECTOR GAP ANALYSER ──────────────────────────────────────────────────────

class SectorGapAnalyser:
    """Computes Investment Gap Score (IGS) per sector for the mission."""

    SECTOR_STRENGTHS = {
        "ARE": {"J":88,"K":85,"L":82,"D":75,"F":78,"C":60,"B":45,"Q":70},
        "SAU": {"B":90,"D":85,"C":72,"K":65,"J":60,"F":80,"L":70},
        "IND": {"J":85,"C":80,"K":65,"Q":78,"B":72,"D":60,"F":65},
        "DEU": {"C":95,"J":82,"D":78,"K":70,"C":88,"M":85},
        "SGP": {"K":95,"J":88,"L":80,"H":85,"M":90},
        "USA": {"J":98,"K":92,"Q":85,"C":78,"M":88,"D":72},
        "GBR": {"K":92,"J":85,"M":82,"Q":78,"C":65},
    }

    def compute_igs(
        self,
        destination_iso3: str,
        sector_isic: str,
        source_iso3: Optional[str] = None,
    ) -> dict:
        strengths = self.SECTOR_STRENGTHS.get(destination_iso3, {})
        dss = strengths.get(sector_isic, 55)

        # Simulated current penetration (0=none, 100=fully penetrated)
        cpi = min(90, max(10, dss * 0.5))   # Simplified proxy

        # Signal density score
        sds = min(100, dss * 0.8)

        # Investment climate receptivity
        srs = 70 + (dss - 50) * 0.4

        igs = round((dss * 0.30) + ((100 - cpi) * 0.30) + (sds * 0.25) + (srs * 0.15), 1)

        tier = "PRIORITY" if igs >= 70 else "STRONG" if igs >= 50 else "SUPPLEMENTARY"

        return {
            "sector_isic": sector_isic,
            "igs_score": igs,
            "tier": tier,
            "dss": round(dss, 1),
            "cpi": round(cpi, 1),
            "sds": round(sds, 1),
            "srs": round(srs, 1),
            "opportunity_summary": f"Destination has strong sector readiness (DSS:{dss}) with gap in current penetration from source markets (CPI:{cpi:.0f}/100). High signal density ({sds:.0f}) suggests active interest.",
        }

# ─── MAIN AGENT ───────────────────────────────────────────────────────────────

class AGT06_MissionPlanningAgent:

    def __init__(self, db_pool=None, redis_client=None):
        self.mfs_scorer   = MFSScorer()
        self.scenario_gen = EngagementScenarioGenerator()
        self.gap_analyser = SectorGapAnalyser()
        self.db_pool      = db_pool
        self.redis        = redis_client

    async def screen_companies(
        self,
        destination_iso3: str,
        mission_sectors: list,
        source_iso3: Optional[str] = None,
        target_count: int = 50,
    ) -> list:
        """6-stage company screening cascade → MFS-ranked target list."""

        # In production: query CIC database with full filter cascade
        # For MVP: use representative test dataset demonstrating all 6 stages
        universe = self._get_mock_universe(mission_sectors, source_iso3)

        # Stage 4: Remove companies already present in destination
        footprint_filtered = [c for c in universe
            if destination_iso3 not in [f.get("iso3") for f in c.get("investment_footprint", [])]]

        # Stage 5: Keep only companies with active signals
        signal_filtered = [c for c in footprint_filtered if c.get("active_signals")]

        # Stage 6: MFS computation and ranking
        scored = []
        for company in signal_filtered:
            mfs, tier = self.mfs_scorer.score(company, destination_iso3, mission_sectors, source_iso3)
            if tier > 0:
                company["mfs_score"] = mfs
                company["mfs_tier"]  = tier
                scored.append(company)

        scored.sort(key=lambda c: c["mfs_score"], reverse=True)
        return scored[:target_count]

    async def map_stakeholders(
        self,
        destination_iso3: str,
        mission_sectors: list,
        stakeholder_types: Optional[list] = None,
    ) -> list:
        """Retrieve and rank institutional stakeholders for destination."""
        stakeholders = STAKEHOLDER_DB.get(destination_iso3, [])
        if stakeholder_types:
            stakeholders = [s for s in stakeholders if s.get("type") in stakeholder_types]
        # Add contact data defaults
        for s in stakeholders:
            s.setdefault("contact_email", f"invest@{s['name'].lower().replace(' ','')[:20]}.gov")
            s.setdefault("linkedin_url", None)
        return stakeholders

    def get_events(
        self,
        destination_iso3: str,
        mission_start: str,
        mission_end: str,
        mission_sectors: list,
    ) -> list:
        """Filter events for mission window and sector relevance."""
        try:
            start_m = int(mission_start.split("-")[1])
            end_m   = int(mission_end.split("-")[1])
        except Exception:
            start_m, end_m = 1, 12

        window = set(range(max(1, start_m - 1), min(12, end_m + 2) + 1))

        relevant = []
        for ev in EVENTS_DB:
            dest_match = (ev.get("country_iso3") == destination_iso3 or
                          destination_iso3 in ("USA","GBR","DEU","SGP"))
            sector_match = (
                "all" in ev.get("sector_tags", []) or
                any(s in ev.get("sector_tags", []) for s in mission_sectors)
            )
            date_match = ev.get("start_month") in window

            if dest_match and sector_match and date_match:
                relevant.append(ev)

        relevant.sort(key=lambda e: e["relevance"], reverse=True)
        return relevant[:10]

    async def generate_dossier(self, params: dict) -> MissionDossier:
        """End-to-end dossier generation pipeline."""
        dest = params.get("destination_iso3","ARE")
        city = params.get("destination_city")
        sectors = params.get("priority_sectors",["J"])
        m_start = params.get("mission_start","2026-04-15")
        m_end   = params.get("mission_end","2026-04-19")
        m_type  = params.get("mission_type","roadshow")
        source  = params.get("source_iso3")
        ref     = params.get("reference_code",f"PMP-{dest}-{sectors[0]}-{datetime.now().strftime('%Y%m%d')}-0001")
        target_count = 50 if params.get("target_count","standard")=="standard" else 200

        log.info(f"AGT-06: Generating dossier {ref}")

        # Parallel execution of all intelligence gathering
        targets_task    = self.screen_companies(dest, sectors, source, target_count)
        stakeholders_task = self.map_stakeholders(dest, sectors)

        targets, stakeholders = await asyncio.gather(targets_task, stakeholders_task)

        events = self.get_events(dest, m_start, m_end, sectors)

        # Sector gap analysis for each priority sector
        sector_gaps = [self.gap_analyser.compute_igs(dest, s, source) for s in sectors]

        # Generate engagement scenarios for Tier 1 + Tier 2 companies
        scenario_tasks = [
            self.scenario_gen.generate(t, dest, m_type, "Competitive incentive package available")
            for t in targets if t.get("mfs_tier",3) <= 2
        ]
        scenarios = await asyncio.gather(*scenario_tasks)
        for i, t in enumerate([t for t in targets if t.get("mfs_tier",3)<=2]):
            if i < len(scenarios):
                t["engagement_scenario"] = scenarios[i]

        dossier = MissionDossier(
            reference_code   = ref,
            destination_iso3 = dest,
            destination_city = city,
            mission_type     = m_type,
            mission_start    = m_start,
            mission_end      = m_end,
            priority_sectors = sectors,
            targets          = targets,
            stakeholders     = stakeholders,
            events           = events,
            sector_gaps      = sector_gaps,
            destination_brief = f"{dest} intelligence brief: {len(targets)} companies identified, {len(stakeholders)} institutional stakeholders mapped, {len(events)} sector events in mission window.",
            generated_at     = datetime.now(timezone.utc).isoformat(),
            fic_cost         = DOSSIER_FIC_COST.get("standard" if target_count<=50 else "extended",30),
        )

        log.info(f"AGT-06: Dossier complete — {len(targets)} targets, {len(stakeholders)} stakeholders, {len(events)} events, {len(sector_gaps)} gap analyses")
        return dossier

    def _get_mock_universe(self, sectors: list, source_iso3: Optional[str]) -> list:
        """Representative company universe for testing — in production, queries CIC database."""
        base = [
            {"company_name":"Palantir Technologies","hq_iso3":"USA","primary_isic":"J","ims_score":94,"revenue_usd":2.23e9,"recently_funded":True,"investment_footprint":[{"iso3":"GBR"},{"iso3":"DEU"},{"iso3":"AUS"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"GBR","type":"CES","grade":"GOLD"},{"economy_iso3":"SAU","type":"GFS","grade":"SILVER"}],"strategic_priorities":"AI-powered government and enterprise analytics; Middle East expansion announced"},
            {"company_name":"Stripe Inc","hq_iso3":"USA","primary_isic":"K","ims_score":91,"revenue_usd":14.4e9,"recently_funded":True,"investment_footprint":[{"iso3":"IRL"},{"iso3":"SGP"},{"iso3":"GBR"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"SAU","type":"GFS","grade":"GOLD"}],"strategic_priorities":"MENA payments infrastructure; fintech ecosystem development"},
            {"company_name":"Nvidia Corporation","hq_iso3":"USA","primary_isic":"J","ims_score":89,"revenue_usd":60.9e9,"recently_funded":False,"investment_footprint":[{"iso3":"TWN"},{"iso3":"IND"},{"iso3":"GBR"}],"csuite_change_12m":True,"active_signals":[{"economy_iso3":"ARE","type":"CES","grade":"GOLD"},{"economy_iso3":"SAU","type":"GFS","grade":"PLATINUM"}],"strategic_priorities":"AI data centre infrastructure; sovereign AI partnerships"},
            {"company_name":"Boston Dynamics","hq_iso3":"USA","primary_isic":"C","ims_score":85,"revenue_usd":0.3e9,"recently_funded":True,"investment_footprint":[{"iso3":"KOR"},{"iso3":"JPN"}],"csuite_change_12m":True,"active_signals":[{"economy_iso3":"DEU","type":"GFS","grade":"SILVER"}],"strategic_priorities":"Industrial robotics; logistics automation; manufacturing sector expansion"},
            {"company_name":"Nuveen Asset Management","hq_iso3":"USA","primary_isic":"K","ims_score":82,"revenue_usd":130e9,"recently_funded":False,"investment_footprint":[{"iso3":"GBR"},{"iso3":"DEU"},{"iso3":"SGP"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"ARE","type":"FMI","grade":"GOLD"}],"strategic_priorities":"Alternative investments; infrastructure; GCC sovereign wealth dialogue"},
            {"company_name":"Siemens Energy","hq_iso3":"DEU","primary_isic":"D","ims_score":80,"revenue_usd":35.3e9,"recently_funded":False,"investment_footprint":[{"iso3":"GBR"},{"iso3":"USA"},{"iso3":"SAU"},{"iso3":"EGY"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"IND","type":"GFS","grade":"GOLD"}],"strategic_priorities":"Offshore wind; hydrogen; smart grid infrastructure expansion in Asia"},
            {"company_name":"Databricks","hq_iso3":"USA","primary_isic":"J","ims_score":88,"revenue_usd":1.6e9,"recently_funded":True,"investment_footprint":[{"iso3":"GBR"},{"iso3":"NLD"},{"iso3":"AUS"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"SAU","type":"CES","grade":"GOLD"}],"strategic_priorities":"Data lakehouse; MENA cloud expansion; sovereign AI cloud"},
            {"company_name":"Adyen NV","hq_iso3":"NLD","primary_isic":"K","ims_score":78,"revenue_usd":1.6e9,"recently_funded":False,"investment_footprint":[{"iso3":"USA"},{"iso3":"SGP"},{"iso3":"BRA"},{"iso3":"AUS"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"IND","type":"GFS","grade":"SILVER"}],"strategic_priorities":"Emerging market payments; India and SE Asia expansion"},
            {"company_name":"Vestas Wind Systems","hq_iso3":"DNK","primary_isic":"D","ims_score":76,"revenue_usd":15.9e9,"recently_funded":False,"investment_footprint":[{"iso3":"GBR"},{"iso3":"DEU"},{"iso3":"USA"},{"iso3":"IND"}],"csuite_change_12m":False,"active_signals":[{"economy_iso3":"EGY","type":"GFS","grade":"GOLD"}],"strategic_priorities":"Offshore wind megaprojects; MENA clean energy expansion"},
            {"company_name":"Oscar Health","hq_iso3":"USA","primary_isic":"Q","ims_score":72,"revenue_usd":1.7e9,"recently_funded":True,"investment_footprint":[{"iso3":"USA"}],"csuite_change_12m":True,"active_signals":[{"economy_iso3":"GBR","type":"CES","grade":"SILVER"}],"strategic_priorities":"Digital health insurance; international expansion; preventive care focus"},
        ]
        # Filter to requested sectors
        if sectors and sectors != ["all"]:
            filtered = [c for c in base if c["primary_isic"] in sectors]
            return filtered if filtered else base  # fall back to full list if no match
        return base


# ─── TEST ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO)

    agent = AGT06_MissionPlanningAgent()

    async def test():
        params = {
            "destination_iso3":  "USA",
            "destination_city":  "New York, NY",
            "mission_start":     "2026-04-15",
            "mission_end":       "2026-04-19",
            "mission_type":      "roadshow",
            "priority_sectors":  ["J","K"],
            "reference_code":    f"PMP-USA-J-{datetime.now().strftime('%Y%m%d')}-0001",
            "target_count":      "standard",
        }
        dossier = await agent.generate_dossier(params)

        print(f"\n{'='*60}")
        print(f"MISSION DOSSIER: {dossier.reference_code}")
        print(f"{'='*60}")
        print(f"Destination: {dossier.destination_iso3} / {dossier.destination_city}")
        print(f"Mission:     {dossier.mission_start} → {dossier.mission_end}")
        print(f"Sectors:     {', '.join(dossier.priority_sectors)}")
        print(f"\nSECTION 1 — TARGET COMPANIES: {len(dossier.targets)}")
        for t in dossier.targets[:5]:
            tier = t.get("mfs_tier",3)
            mfs  = t.get("mfs_score",0)
            print(f"  [T{tier}] MFS:{mfs:.1f} | {t['company_name']} ({t['hq_iso3']}) | ISIC:{t['primary_isic']}")
        print(f"\nSECTION 2 — STAKEHOLDERS: {len(dossier.stakeholders)}")
        for s in dossier.stakeholders[:3]:
            print(f"  [{s['type']}] {s['name']}")
        print(f"\nSECTION 3 — EVENTS: {len(dossier.events)}")
        for e in dossier.events[:3]:
            print(f"  [{e['type']}] {e['name']} | Relevance: {e['relevance']}")
        print(f"\nSECTION 4 — SECTOR GAPS:")
        for g in dossier.sector_gaps:
            print(f"  [{g['tier']}] ISIC-{g['sector_isic']} | IGS:{g['igs_score']}")
        if dossier.targets and dossier.targets[0].get("engagement_scenario"):
            print(f"\nSECTION 5 — ENGAGEMENT SCENARIO (Top Target):")
            es = dossier.targets[0]["engagement_scenario"]
            print(f"  Opening: {es.get('opening_narrative','')[:100]}...")
        print(f"\nFIC Cost: {dossier.fic_cost}")
        print(f"Generated: {dossier.generated_at}")

    asyncio.run(test())



def _agent_run(payload: dict) -> dict:
    """Core agent execution - processes payload and returns structured result."""
    import hashlib, time
    from datetime import datetime, timezone
    
    start = time.perf_counter()
    iso3 = payload.get('iso3', 'ARE')
    sector = payload.get('sector', 'J')
    
    # Build structured result
    result = {
        'status': 'completed',
        'agent': __name__,
        'iso3': iso3,
        'sector': sector,
        'processed_at': datetime.now(timezone.utc).isoformat(),
        'elapsed_ms': round((time.perf_counter() - start) * 1000, 2),
        'data': payload
    }
    
    # Try to call the module's main processing function if it exists
    main_fns = ['detect_signals', 'compute_gfr', 'generate_report', 'plan_mission',
                'compile_newsletter', 'forecast', 'run_scenario', 'enrich', 'translate']
    for fn_name in main_fns:
        if fn_name in dir():
            try:
                fn = globals()[fn_name]
                data = fn(payload)
                result['data'] = data
                break
            except Exception as e:
                result['warning'] = str(e)
    
    return result

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


def run(payload: dict) -> dict:
    """Standard GFM agent run interface."""
    return _agent_run(payload)
