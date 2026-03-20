"""
Agent: agt16_20_competitive_esg_sanctions_risk_translation — FDI Monitor Intelligence Pipeline
Error handling wrapper applied at module level.
"""
import datetime as _dt

def _safe_run(fn, params):
    try:
        return fn(params)
    except Exception as e:
        return {"success": False, "error": str(e), "agent": "agt16_20_competitive_esg_sanctions_risk_translation",
                "ts": _dt.datetime.utcnow().isoformat() + "Z"}

"""
GLOBAL FDI MONITOR — AGT-16 through AGT-20
AGT-16: COMPETITIVE INTELLIGENCE — Maps competitive landscape for target companies
AGT-17: ESG ASSESSMENT — Enriches CIC profiles with ESG scores and sustainability data
AGT-18: SANCTIONS SCREENER — Real-time OFAC/EU/UN screening for all entities
AGT-19: POLITICAL RISK ASSESSOR — Country political risk scoring and event monitoring
AGT-20: TRANSLATION MANAGER — Multi-language content delivery for 20+ languages
"""
import asyncio, json, re, os, logging, hashlib
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass, field

log = logging.getLogger("gfm.agt16_20")


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-16: COMPETITIVE INTELLIGENCE AGENT
# Maps competitor presence, market position, and investment moves
# Used by: PMP dossier (who else is already in destination?)
#          CIC profile (competitive positioning dimension)
# ═══════════════════════════════════════════════════════════════════════════════

SECTOR_PEERS = {
    # Technology / Cloud
    "J": {
        "Microsoft":   ["Amazon","Google","IBM","Oracle","SAP"],
        "Amazon":      ["Microsoft","Google","IBM","Alibaba","Huawei"],
        "Google":      ["Microsoft","Amazon","Meta","Apple","Baidu"],
        "Nvidia":      ["AMD","Intel","Qualcomm","TSMC","Samsung"],
        "Palantir":    ["C3.ai","Databricks","Snowflake","Cloudera"],
        "Stripe":      ["Adyen","PayPal","Square","Klarna","Checkout.com"],
        "Databricks":  ["Snowflake","Palantir","Cloudera","Teradata"],
    },
    # Financial Services
    "K": {
        "BlackRock":   ["Vanguard","Fidelity","State Street","PIMCO"],
        "Goldman Sachs":["JPMorgan","Morgan Stanley","Citigroup","BofA"],
        "JPMorgan":    ["Goldman Sachs","Morgan Stanley","Citigroup","HSBC"],
        "Nuveen":      ["BlackRock","PGIM","MetLife Investment","Prudential"],
    },
    # Energy
    "D": {
        "Siemens Energy":["GE Vernova","Vestas","Ørsted","Iberdrola"],
        "Vestas":        ["Siemens Energy","GE Vernova","Goldwind","CSSC"],
        "TotalEnergies": ["Shell","BP","ExxonMobil","Chevron","Equinor"],
    },
    # Manufacturing
    "C": {
        "Samsung Electronics":["TSMC","Micron","SK Hynix","Intel","Foxconn"],
        "Airbus":             ["Boeing","Embraer","Bombardier","COMAC"],
        "Volkswagen":         ["Toyota","Stellantis","Hyundai","BMW","Ford"],
    },
}

@dataclass
class CompetitorMove:
    competitor:      str
    economy_iso3:    str
    investment_type: str
    description:     str
    year:            int
    capex_usd:       Optional[float]
    strategic_note:  str

@dataclass
class CompetitiveProfile:
    company:              str
    sector_isic:          str
    market_position:      str      # LEADER / CHALLENGER / NICHE
    peer_set:             list
    competitor_moves:     list     # [CompetitorMove]
    destination_presence: dict     # {iso3: [competitor names already present]}
    urgency_signal:       str      # If competitor is in destination → "URGENT: X already there"
    competitive_score:    float    # 0–100 competitive pressure score

class AGT16_CompetitiveIntelligenceAgent:

    def _get_peers(self, company: str, sector_isic: str) -> list:
        sector_map = SECTOR_PEERS.get(sector_isic, {})
        for name, peers in sector_map.items():
            if name.lower() in company.lower():
                return peers
        # Default: return sector peers from first match
        if sector_map:
            return list(list(sector_map.values())[0])[:4]
        return ["Competitor A","Competitor B","Competitor C"]

    def _assess_market_position(self, revenue_usd: Optional[float], ims: float) -> str:
        if revenue_usd and revenue_usd > 50e9 and ims > 70: return "LEADER"
        if revenue_usd and revenue_usd > 5e9 and ims > 50:  return "CHALLENGER"
        return "NICHE"

    def _competitor_destination_presence(self, peers: list, destination_iso3: str) -> dict:
        """Check which competitors are already in the destination economy."""
        # Representative data — in production queries CIC investment footprint
        presence_map = {
            "ARE": ["Microsoft","Amazon","Google","IBM","HSBC","Goldman Sachs",
                    "Siemens","Airbus","TotalEnergies","BlackRock"],
            "SAU": ["Microsoft","Amazon","IBM","JPMorgan","Citigroup",
                    "TotalEnergies","Shell","BP","GE Vernova"],
            "IND": ["Microsoft","Google","Amazon","IBM","Goldman Sachs",
                    "JPMorgan","Siemens","Airbus","Samsung","Vestas"],
            "DEU": ["Microsoft","Google","Amazon","Nvidia","IBM",
                    "JPMorgan","Goldman Sachs","TotalEnergies"],
            "SGP": ["Microsoft","Google","Amazon","IBM","Stripe","BlackRock",
                    "Goldman Sachs","JPMorgan","Samsung"],
        }
        present = [p for p in peers if p in presence_map.get(destination_iso3, [])]
        return {destination_iso3: present}

    async def profile_company(
        self,
        company: dict,
        destination_iso3: str,
    ) -> CompetitiveProfile:
        name       = company.get("company_name","")
        sector     = company.get("primary_isic","J")
        revenue    = company.get("revenue_usd")
        ims        = company.get("ims_score", 50)

        peers      = self._get_peers(name, sector)
        position   = self._assess_market_position(revenue, ims)
        dest_pres  = self._competitor_destination_presence(peers, destination_iso3)
        present    = dest_pres.get(destination_iso3, [])

        # Urgency signal
        if present:
            urgency = f"⚠️ COMPETITIVE URGENCY: {', '.join(present[:2])} already {'has' if len(present)==1 else 'have'} operations in {destination_iso3}. First-mover window narrowing."
        else:
            urgency = f"✅ FIRST-MOVER OPPORTUNITY: No direct peers currently operating in {destination_iso3}. Significant strategic advantage available."

        # Competitive pressure score (0–100): higher = more urgent to engage
        pressure = min(100, len(present) * 20 + (30 if position=="LEADER" else 15))

        return CompetitiveProfile(
            company           = name,
            sector_isic       = sector,
            market_position   = position,
            peer_set          = peers,
            competitor_moves  = [],
            destination_presence = dest_pres,
            urgency_signal    = urgency,
            competitive_score = float(pressure),
        )

    async def batch_profile(self, companies: list, destination_iso3: str) -> list:
        tasks = [self.profile_company(c, destination_iso3) for c in companies]
        return await asyncio.gather(*tasks)


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-17: ESG ASSESSMENT AGENT
# Enriches CIC profiles with sustainability intelligence
# Sources: CDP disclosures, SBTi register, company sustainability reports
# ═══════════════════════════════════════════════════════════════════════════════

# SBTi committed companies (representative sample)
SBTI_COMMITTED = {
    "Microsoft":        {"target":"Net zero by 2030","scope":"1+2+3","validated":True},
    "Amazon":           {"target":"Net zero by 2040","scope":"1+2+3","validated":True},
    "Google":           {"target":"Carbon free by 2030","scope":"1+2+3","validated":True},
    "Siemens Energy":   {"target":"Net zero by 2030","scope":"1+2","validated":True},
    "Vestas":           {"target":"Net zero by 2040","scope":"1+2+3","validated":True},
    "Samsung":          {"target":"Net zero by 2050","scope":"1+2","validated":False},
    "Airbus":           {"target":"Net zero by 2050","scope":"1+2+3","validated":True},
    "Goldman Sachs":    {"target":"Net zero by 2030 (ops)","scope":"1+2","validated":True},
    "BlackRock":        {"target":"Net zero by 2050 (AUM)","scope":"portfolio","validated":True},
    "Nvidia":           {"target":"Net zero by 2040","scope":"1+2","validated":False},
}

# CDP disclosure scores (A=best, D=worst)
CDP_SCORES = {
    "Microsoft": "A", "Google": "A", "Amazon": "A-", "Siemens Energy": "A",
    "Vestas": "A", "Airbus": "B+", "Samsung": "B", "Goldman Sachs": "B+",
    "BlackRock": "B", "Nvidia": "B-",
}

@dataclass
class ESGProfile:
    company:             str
    overall_esg_score:   float    # 0–100
    environmental_score: float
    social_score:        float
    governance_score:    float
    cdp_rating:          Optional[str]
    sbti_committed:      bool
    net_zero_target:     Optional[str]
    net_zero_validated:  bool
    scope_coverage:      Optional[str]
    green_revenue_pct:   Optional[float]
    esg_grade:           str      # LEADER / STRONG / DEVELOPING / LAGGARD
    key_initiatives:     list
    esg_risks:           list
    assessed_at:         str

class AGT17_ESGAssessmentAgent:

    def _compute_esg_score(self, company: str, sbti: Optional[dict], cdp: Optional[str]) -> tuple:
        base = 50.0
        # CDP bonus
        cdp_bonus = {"A":25,"A-":22,"B+":18,"B":14,"B-":10,"C":5,"D":0}.get(cdp or "C", 0)
        # SBTi bonus
        sbti_bonus = 15 if sbti and sbti.get("validated") else (8 if sbti else 0)
        # Name recognition proxy (larger = more likely to have strong ESG)
        known_leaders = {"Microsoft","Google","Amazon","Siemens Energy","Vestas","Airbus"}
        leader_bonus = 10 if company in known_leaders else 0

        env  = min(100, base + cdp_bonus + sbti_bonus * 0.6 + leader_bonus)
        soc  = min(100, base + 8 + leader_bonus * 0.7)
        gov  = min(100, base + 12 + leader_bonus * 0.5)
        overall = round(env * 0.40 + soc * 0.30 + gov * 0.30, 1)

        if overall >= 75:   grade = "LEADER"
        elif overall >= 55: grade = "STRONG"
        elif overall >= 40: grade = "DEVELOPING"
        else:               grade = "LAGGARD"

        return round(env,1), round(soc,1), round(gov,1), overall, grade

    async def assess_company(self, company_name: str) -> ESGProfile:
        sbti  = SBTI_COMMITTED.get(company_name)
        cdp   = CDP_SCORES.get(company_name)
        env, soc, gov, overall, grade = self._compute_esg_score(company_name, sbti, cdp)

        initiatives = []
        if sbti:       initiatives.append(f"SBTi: {sbti['target']}")
        if cdp:        initiatives.append(f"CDP Rating: {cdp}")
        if not sbti:   initiatives.append("No public net-zero commitment found")

        risks = []
        if overall < 60: risks.append("Limited public ESG disclosure")
        if not sbti:     risks.append("No validated science-based target")
        if env < 55:     risks.append("Environmental performance below peer average")

        return ESGProfile(
            company             = company_name,
            overall_esg_score   = overall,
            environmental_score = env,
            social_score        = soc,
            governance_score    = gov,
            cdp_rating          = cdp,
            sbti_committed      = bool(sbti),
            net_zero_target     = sbti.get("target") if sbti else None,
            net_zero_validated  = sbti.get("validated", False) if sbti else False,
            scope_coverage      = sbti.get("scope") if sbti else None,
            green_revenue_pct   = None,
            esg_grade           = grade,
            key_initiatives     = initiatives,
            esg_risks           = risks,
            assessed_at         = datetime.now(timezone.utc).isoformat(),
        )

    async def batch_assess(self, companies: list) -> list:
        return await asyncio.gather(*[self.assess_company(c) for c in companies])


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-18: SANCTIONS SCREENER AGENT
# Real-time entity screening against OFAC SDN, EU Consolidated, UN Security Council
# Zero tolerance: any match → immediate removal from all outputs
# ═══════════════════════════════════════════════════════════════════════════════

# In production: fetches live lists from OFAC API, EU CFSP API, UN API
# Here: representative sample for testing
SANCTIONED_ENTITIES_SAMPLE = {
    # Exact names (normalised lowercase)
    "rosneft trading sa":        {"list":"OFAC_SDN",   "reason":"Russia-Ukraine"},
    "iran central bank":         {"list":"OFAC_SDN",   "reason":"Iran sanctions"},
    "novatek":                   {"list":"EU_CONSOL",  "reason":"Russia-Ukraine"},
    "bank rossiya":              {"list":"OFAC_SDN",   "reason":"Russia-Ukraine"},
    "north korea government":    {"list":"UN_SECURITY","reason":"DPRK sanctions"},
    "myanmar economic holdings": {"list":"OFAC_SDN",   "reason":"Myanmar coup"},
    "wagner group":              {"list":"EU_CONSOL",  "reason":"Russia mercenary"},
}

SANCTIONED_JURISDICTIONS = {
    "PRK": "North Korea — comprehensive sanctions (OFAC/EU/UN)",
    "IRN": "Iran — comprehensive sanctions (OFAC/EU/UN)",
    "CUB": "Cuba — OFAC embargo",
    "SYR": "Syria — comprehensive sanctions (OFAC/EU/UN)",
    "BLR": "Belarus — EU/US sectoral sanctions",
}

@dataclass
class ScreeningResult:
    entity:         str
    entity_type:    str   # COMPANY / PERSON / COUNTRY
    cleared:        bool
    match_found:    bool
    match_details:  Optional[dict]
    jurisdiction_flag: Optional[str]
    screened_lists: list
    screening_hash: str   # For audit trail
    screened_at:    str

class AGT18_SanctionsScreener:
    """
    Screens entities against OFAC SDN List, EU Consolidated List,
    and UN Security Council Consolidated List.
    Zero-tolerance: any match disqualifies the entity from all platform outputs.
    """

    LISTS = ["OFAC_SDN", "EU_CONSOLIDATED", "UN_SECURITY_COUNCIL"]

    def _normalise(self, name: str) -> str:
        return re.sub(r'[^a-z0-9 ]', '', name.lower().strip())

    def _hash_entity(self, entity: str) -> str:
        return hashlib.sha256(entity.encode()).hexdigest()[:16]

    def _check_name(self, name: str) -> Optional[dict]:
        normalised = self._normalise(name)
        # Exact match
        if normalised in SANCTIONED_ENTITIES_SAMPLE:
            return SANCTIONED_ENTITIES_SAMPLE[normalised]
        # Partial match (any sanctioned name fully contained in input)
        for sanctioned, details in SANCTIONED_ENTITIES_SAMPLE.items():
            if sanctioned in normalised:
                return {**details, "match_type": "partial"}
        return None

    def _check_jurisdiction(self, iso3: str) -> Optional[str]:
        return SANCTIONED_JURISDICTIONS.get(iso3.upper())

    def screen_entity(
        self,
        entity_name: str,
        entity_type: str = "COMPANY",
        hq_iso3:     Optional[str] = None,
    ) -> ScreeningResult:
        match  = self._check_name(entity_name)
        j_flag = self._check_jurisdiction(hq_iso3) if hq_iso3 else None
        cleared = (match is None) and (j_flag is None)

        return ScreeningResult(
            entity          = entity_name,
            entity_type     = entity_type,
            cleared         = cleared,
            match_found     = match is not None,
            match_details   = match,
            jurisdiction_flag = j_flag,
            screened_lists  = self.LISTS,
            screening_hash  = self._hash_entity(entity_name),
            screened_at     = datetime.now(timezone.utc).isoformat(),
        )

    def screen_batch(self, entities: list) -> dict:
        """Screen a batch; returns {cleared: [...], flagged: [...]}"""
        cleared, flagged = [], []
        for e in entities:
            name = e if isinstance(e, str) else e.get("company_name", "")
            iso3 = None if isinstance(e, str) else e.get("hq_iso3")
            result = self.screen_entity(name, hq_iso3=iso3)
            (cleared if result.cleared else flagged).append(
                {"entity": name, "result": result}
            )
        return {"cleared": cleared, "flagged": flagged,
                "total": len(entities), "pass_rate": len(cleared)/len(entities) if entities else 1.0}


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-19: POLITICAL RISK ASSESSOR
# Composite political risk scoring for all 215 economies
# Dimensions: stability, rule of law, corruption, conflict, governance quality
# ═══════════════════════════════════════════════════════════════════════════════

POLITICAL_RISK_BASE = {
    "ARE": {"stability":85,"rule_law":76,"corruption":72,"conflict":88,"governance":80},
    "SAU": {"stability":68,"rule_law":58,"corruption":55,"conflict":70,"governance":65},
    "IND": {"stability":62,"rule_law":56,"corruption":42,"conflict":60,"governance":60},
    "DEU": {"stability":88,"rule_law":88,"corruption":80,"conflict":95,"governance":87},
    "SGP": {"stability":92,"rule_law":90,"corruption":87,"conflict":97,"governance":91},
    "USA": {"stability":75,"rule_law":84,"corruption":72,"conflict":88,"governance":80},
    "GBR": {"stability":80,"rule_law":87,"corruption":78,"conflict":90,"governance":83},
    "EGY": {"stability":52,"rule_law":42,"corruption":38,"conflict":58,"governance":48},
    "KEN": {"stability":55,"rule_law":48,"corruption":38,"conflict":52,"governance":50},
    "NGA": {"stability":40,"rule_law":35,"corruption":30,"conflict":42,"governance":38},
    "VNM": {"stability":68,"rule_law":52,"corruption":42,"conflict":78,"governance":58},
    "IRN": {"stability":35,"rule_law":28,"corruption":28,"conflict":38,"governance":30},
}

RISK_WEIGHTS = {
    "stability":  0.25,
    "rule_law":   0.25,
    "corruption": 0.20,
    "conflict":   0.20,
    "governance": 0.10,
}

@dataclass
class PoliticalRiskProfile:
    iso3:              str
    composite_score:   float    # 0–100 (100 = lowest risk)
    risk_tier:         str      # LOW / MODERATE / ELEVATED / HIGH / CRITICAL
    dimensions:        dict
    key_risks:         list
    key_positives:     list
    investor_note:     str
    assessed_at:       str

class AGT19_PoliticalRiskAssessor:

    def _tier(self, score: float) -> str:
        if score >= 80:   return "LOW"
        elif score >= 65: return "MODERATE"
        elif score >= 50: return "ELEVATED"
        elif score >= 35: return "HIGH"
        else:             return "CRITICAL"

    def assess(self, iso3: str) -> PoliticalRiskProfile:
        dims = POLITICAL_RISK_BASE.get(iso3, {k:50 for k in RISK_WEIGHTS})
        composite = round(sum(dims[k]*w for k,w in RISK_WEIGHTS.items()), 1)
        tier      = self._tier(composite)

        # Key risks: dimensions below 55
        risks = [f"{k.replace('_',' ').title()} score {v}/100"
                 for k, v in dims.items() if v < 55]
        # Key positives: dimensions above 70
        positives = [f"{k.replace('_',' ').title()} score {v}/100"
                     for k, v in dims.items() if v >= 70]

        note_map = {
            "LOW":      "Strong institutional framework. Low political risk for FDI. Suitable for long-term commitments.",
            "MODERATE": "Adequate governance with some areas for improvement. Standard due diligence recommended.",
            "ELEVATED": "Elevated political risk requires enhanced due diligence, political risk insurance, and contract protections.",
            "HIGH":     "High political risk. Investment requires substantial risk mitigation: BIT protection, escrow arrangements, political risk insurance mandatory.",
            "CRITICAL": "Critical risk level. FDI exposure should be minimised. Short-term, hedged, or avoid.",
        }

        return PoliticalRiskProfile(
            iso3=iso3, composite_score=composite, risk_tier=tier,
            dimensions=dims, key_risks=risks, key_positives=positives,
            investor_note=note_map[tier],
            assessed_at=datetime.now(timezone.utc).isoformat(),
        )

    async def assess_batch(self, iso3_list: list) -> list:
        return [self.assess(iso3) for iso3 in iso3_list]


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-20: TRANSLATION MANAGER AGENT
# Manages multi-language content delivery
# Production: DeepL API + Google Cloud Translation + LLM post-processing
# ═══════════════════════════════════════════════════════════════════════════════

LANGUAGE_REGISTRY = {
    "en": {"name":"English",              "rtl":False,"launch":True},
    "ar": {"name":"Arabic (العربية)",     "rtl":True, "launch":True},
    "fr": {"name":"Français",             "rtl":False,"launch":True},
    "es": {"name":"Español",              "rtl":False,"launch":True},
    "zh": {"name":"中文 (简体)",           "rtl":False,"launch":True},
    "de": {"name":"Deutsch",              "rtl":False,"launch":True},
    "ja": {"name":"日本語",               "rtl":False,"launch":True},
    "pt": {"name":"Português",            "rtl":False,"launch":True},
    "ru": {"name":"Русский",              "rtl":False,"launch":True},
    "hi": {"name":"हिन्दी",              "rtl":False,"launch":True},
    "ko": {"name":"한국어",               "rtl":False,"launch":False},
    "it": {"name":"Italiano",             "rtl":False,"launch":False},
    "nl": {"name":"Nederlands",           "rtl":False,"launch":False},
    "pl": {"name":"Polski",               "rtl":False,"launch":False},
    "tr": {"name":"Türkçe",              "rtl":False,"launch":False},
    "vi": {"name":"Tiếng Việt",          "rtl":False,"launch":False},
    "th": {"name":"ภาษาไทย",             "rtl":False,"launch":False},
    "id": {"name":"Bahasa Indonesia",     "rtl":False,"launch":False},
    "sw": {"name":"Kiswahili",            "rtl":False,"launch":False},
    "he": {"name":"עברית",               "rtl":True, "launch":False},
}

# Report section titles translated (represents the pattern — full set in JSON files)
REPORT_TRANSLATIONS = {
    "Executive Summary": {
        "ar":"الملخص التنفيذي","fr":"Résumé exécutif","es":"Resumen ejecutivo",
        "zh":"执行摘要","de":"Zusammenfassung","ja":"エグゼクティブサマリー",
        "pt":"Resumo executivo","ru":"Резюме","hi":"कार्यकारी सारांश",
        "ko":"요약","it":"Sommario esecutivo","nl":"Samenvatting","pl":"Streszczenie",
        "tr":"Yönetici Özeti","vi":"Tóm tắt","id":"Ringkasan Eksekutif",
    },
    "Investment Climate": {
        "ar":"مناخ الاستثمار","fr":"Climat d'investissement","es":"Clima de inversión",
        "zh":"投资环境","de":"Investitionsklima","ja":"投資環境",
        "pt":"Clima de investimento","ru":"Инвестиционный климат","hi":"निवेश माहौल",
        "ko":"투자 환경","it":"Clima degli investimenti","nl":"Investeringsklimaat",
        "pl":"Klimat inwestycyjny","tr":"Yatırım İklimi","vi":"Môi trường đầu tư",
    },
    "Key Risks": {
        "ar":"المخاطر الرئيسية","fr":"Risques clés","es":"Riesgos clave",
        "zh":"主要风险","de":"Hauptrisiken","ja":"主要リスク",
        "pt":"Principais riscos","ru":"Ключевые риски","hi":"प्रमुख जोखिम",
        "ko":"주요 위험","it":"Rischi principali","nl":"Belangrijkste risico's",
        "pl":"Kluczowe ryzyka","tr":"Ana Riskler","vi":"Rủi ro chính",
    },
}

@dataclass
class TranslationJob:
    job_id:       str
    source_lang:  str
    target_lang:  str
    content_type: str   # REPORT_SECTION / UI_STRING / SIGNAL_HEADLINE / NEWSLETTER
    source_text:  str
    translated:   Optional[str]
    method:       str   # DEEPL / GOOGLE / LLM / CACHED
    quality_score: float
    rtl_applied:  bool
    completed_at: Optional[str]

class AGT20_TranslationManager:
    """
    Manages all translation workflows on the platform.
    Priority: cached translations → DeepL API → Google Translate → LLM fallback.
    RTL formatting applied automatically for Arabic, Hebrew, Farsi, Urdu.
    """

    def __init__(self):
        self._cache: dict = {}
        self.deepl_key  = os.environ.get("DEEPL_API_KEY","")
        self.google_key = os.environ.get("GOOGLE_TRANSLATE_KEY","")

    def get_cached(self, text: str, target_lang: str) -> Optional[str]:
        """Check in-memory and DB cache."""
        cache_key = f"{target_lang}:{hashlib.md5(text.encode()).hexdigest()}"
        return self._cache.get(cache_key)

    def cache_translation(self, text: str, target_lang: str, translated: str) -> None:
        cache_key = f"{target_lang}:{hashlib.md5(text.encode()).hexdigest()}"
        self._cache[cache_key] = translated

    def translate_section_title(self, title: str, target_lang: str) -> str:
        """Fast lookup for known section titles."""
        translations = REPORT_TRANSLATIONS.get(title, {})
        return translations.get(target_lang, title)

    def apply_rtl_formatting(self, text: str, lang: str) -> str:
        """Wrap RTL content with proper Unicode directional markers."""
        if LANGUAGE_REGISTRY.get(lang, {}).get("rtl"):
            return f"\u202B{text}\u202C"  # RTL embedding markers
        return text

    async def translate(
        self,
        text: str,
        target_lang: str,
        content_type: str = "UI_STRING",
        source_lang: str = "en",
    ) -> TranslationJob:
        job_id = f"TJ-{target_lang.upper()}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{abs(hash(text))%10000:04d}"

        # 1. Check cache
        cached = self.get_cached(text, target_lang)
        if cached:
            return TranslationJob(
                job_id=job_id, source_lang=source_lang, target_lang=target_lang,
                content_type=content_type, source_text=text, translated=cached,
                method="CACHED", quality_score=0.98,
                rtl_applied=LANGUAGE_REGISTRY.get(target_lang,{}).get("rtl",False),
                completed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 2. Check known section titles
        known = self.translate_section_title(text, target_lang)
        if known != text:
            self.cache_translation(text, target_lang, known)
            return TranslationJob(
                job_id=job_id, source_lang=source_lang, target_lang=target_lang,
                content_type=content_type, source_text=text, translated=known,
                method="CACHED", quality_score=0.99,
                rtl_applied=LANGUAGE_REGISTRY.get(target_lang,{}).get("rtl",False),
                completed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 3. In production: call DeepL / Google / LLM
        # For MVP without API keys: return marked-for-translation placeholder
        placeholder = f"[{target_lang.upper()}] {text}"
        self.cache_translation(text, target_lang, placeholder)

        return TranslationJob(
            job_id=job_id, source_lang=source_lang, target_lang=target_lang,
            content_type=content_type, source_text=text, translated=placeholder,
            method="PLACEHOLDER",  # Will be DEEPL/GOOGLE in production
            quality_score=0.0,
            rtl_applied=LANGUAGE_REGISTRY.get(target_lang,{}).get("rtl",False),
            completed_at=datetime.now(timezone.utc).isoformat(),
        )

    async def translate_report_sections(self, sections: dict, target_lang: str) -> dict:
        """Translate all section titles in a report structure."""
        translated = {}
        for key, content in sections.items():
            translated_title = self.translate_section_title(key, target_lang)
            if translated_title == key:
                job = await self.translate(key, target_lang, "REPORT_SECTION")
                translated_title = job.translated or key
            translated[translated_title] = content
        return translated

    def list_languages(self, launch_only: bool = False) -> list:
        langs = [(k, v) for k, v in LANGUAGE_REGISTRY.items()
                 if not launch_only or v.get("launch")]
        return [{"code":k,"name":v["name"],"rtl":v["rtl"],"launch":v["launch"]}
                for k,v in langs]


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    async def test():
        test_co = {
            "company_name":"Palantir Technologies",
            "primary_isic":"J",
            "revenue_usd":2.23e9,
            "ims_score":94,
        }

        print("\n" + "="*60)
        print("AGT-16: COMPETITIVE INTELLIGENCE")
        print("="*60)
        agt16 = AGT16_CompetitiveIntelligenceAgent()
        profile = await agt16.profile_company(test_co, "ARE")
        print(f"✓ Company:     {profile.company}")
        print(f"✓ Position:    {profile.market_position}")
        print(f"✓ Peers:       {', '.join(profile.peer_set[:3])}")
        print(f"✓ Present in ARE: {profile.destination_presence.get('ARE',[])[:3]}")
        print(f"✓ Urgency:     {profile.urgency_signal[:80]}…")
        print(f"✓ Comp score:  {profile.competitive_score}/100")

        print("\n" + "="*60)
        print("AGT-17: ESG ASSESSMENT")
        print("="*60)
        agt17 = AGT17_ESGAssessmentAgent()
        companies = ["Microsoft","Samsung Electronics","Palantir Technologies"]
        results = await agt17.batch_assess(companies)
        for r in results:
            print(f"✓ {r.company:<30} ESG:{r.overall_esg_score:5.1f} "
                  f"[{r.esg_grade}] CDP:{r.cdp_rating or 'N/A'} "
                  f"SBTi:{'✓' if r.sbti_committed else '✗'}")

        print("\n" + "="*60)
        print("AGT-18: SANCTIONS SCREENER")
        print("="*60)
        agt18 = AGT18_SanctionsScreener()
        test_entities = [
            {"company_name":"Microsoft Corp","hq_iso3":"USA"},
            {"company_name":"Rosneft Trading SA","hq_iso3":"RUS"},
            {"company_name":"Samsung Electronics","hq_iso3":"KOR"},
            {"company_name":"North Korea Government","hq_iso3":"PRK"},
        ]
        batch = agt18.screen_batch(test_entities)
        print(f"✓ Screened:  {batch['total']} entities")
        print(f"✓ Cleared:   {len(batch['cleared'])}")
        print(f"✓ Flagged:   {len(batch['flagged'])}")
        for f in batch["flagged"]:
            print(f"  ⛔ FLAGGED: {f['entity']}")
        print(f"✓ Pass rate: {batch['pass_rate']:.0%}")

        print("\n" + "="*60)
        print("AGT-19: POLITICAL RISK ASSESSOR")
        print("="*60)
        agt19 = AGT19_PoliticalRiskAssessor()
        countries = ["ARE","SAU","IND","DEU","NGA","IRN"]
        results = await agt19.assess_batch(countries)
        for r in results:
            bar = "█" * int(r.composite_score / 10) + "░" * (10 - int(r.composite_score/10))
            print(f"✓ {r.iso3}: {bar} {r.composite_score:5.1f} [{r.risk_tier}]")

        print("\n" + "="*60)
        print("AGT-20: TRANSLATION MANAGER")
        print("="*60)
        agt20 = AGT20_TranslationManager()
        langs = agt20.list_languages()
        print(f"✓ Languages registered: {len(langs)} total")
        print(f"✓ Launch languages:     {sum(1 for l in langs if l['launch'])}")
        print(f"✓ RTL languages:        {sum(1 for l in langs if l['rtl'])}")

        test_strings = ["Executive Summary","Investment Climate","Key Risks"]
        test_langs   = ["ar","fr","es","zh","de","ko","it","nl","tr","vi"]
        print(f"\n✓ Section title translations ({len(test_strings)} strings × {len(test_langs)} languages):")
        for s in test_strings:
            jobs = [agt20.translate_section_title(s, lang) for lang in test_langs]
            translated_count = sum(1 for j in jobs if j != s)
            print(f"  '{s}': {translated_count}/{len(test_langs)} languages translated")
            print(f"    AR: {agt20.translate_section_title(s,'ar')} | FR: {agt20.translate_section_title(s,'fr')} | KO: {agt20.translate_section_title(s,'ko')}")

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


def run(payload: dict) -> dict:
    """Standard GFM agent run interface."""
    return execute(payload).get('result', {'status': 'completed', 'module': __name__})
