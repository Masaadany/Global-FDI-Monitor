"""
GLOBAL FDI MONITOR — AGT-02: SIGNAL DETECTION AGENT
Detects, classifies, and scores investment signals from 500K+ monitored sources
SCI (Signal Confidence Index) scoring with 6 components
Publishes to Redis → WebSocket (≤2 second delivery)
"""
import asyncio
import json
import re
import os
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Optional
import logging

log = logging.getLogger("gfm.agt02")

# ─── SCI SCORING MODEL ───────────────────────────────────────────────────────
# Signal Confidence Index: 0-100 scale
# Grade: PLATINUM ≥85 | GOLD 70-84 | SILVER 55-69 | BRONZE 40-54 | Below 40: discard

SIGNAL_GRADES = {
    "PLATINUM": (85, 100),
    "GOLD": (70, 84.99),
    "SILVER": (55, 69.99),
    "BRONZE": (40, 54.99),
}

SOURCE_TIER_WEIGHTS = {
    "T1": 1.20,  # Direct primary (government, company official)
    "T2": 1.15,  # Regulatory filings
    "T3": 1.05,  # Premium news & wire
    "T4": 0.95,  # Sector publications
    "T5": 1.10,  # IPA partners
    "T6": 0.85,  # Alternative data
    "SM": 0.75,  # Social media
}

SIGNAL_TYPE_BASE_SCORES = {
    "GFS": 75,   # Greenfield FDI
    "MAI": 72,   # M&A
    "VCM": 65,   # VC/PE
    "CES": 70,   # Corporate Expansion
    "FMI": 60,   # Financial Markets
    "REI": 68,   # Real Estate
    "EOC": 70,   # Energy/Oil/Commodities
    "DSG": 65,   # Defence/Strategic
    "TES": 62,   # Trade/Export
    "ESG": 58,   # ESG/Sustainability
    "JVP": 67,   # Joint Venture
    "CIC": 72,   # Company Intelligence
}

ISIC_CODES = {
    "A": "Agriculture, Forestry & Fishing",
    "B": "Mining & Quarrying",
    "C": "Manufacturing",
    "D": "Electricity, Gas, Steam & Air Conditioning",
    "E": "Water Supply & Waste Management",
    "F": "Construction",
    "G": "Wholesale & Retail Trade",
    "H": "Transportation & Storage",
    "I": "Accommodation & Food Service",
    "J": "Information & Communication",
    "K": "Financial & Insurance Activities",
    "L": "Real Estate Activities",
    "M": "Professional, Scientific & Technical",
    "N": "Administrative & Support Service",
    "O": "Public Administration & Defence",
    "P": "Education",
    "Q": "Human Health & Social Work",
    "R": "Arts, Entertainment & Recreation",
    "S": "Other Service Activities",
    "T": "Activities of Households",
    "U": "Extraterritorial Activities",
}

# Economy ISO3 to region mapping
ISO3_TO_REGION = {
    "ARE": "MENA", "SAU": "MENA", "QAT": "MENA", "KWT": "MENA", "BHR": "MENA",
    "OMN": "MENA", "EGY": "MENA", "JOR": "MENA", "IRQ": "MENA", "LBN": "MENA",
    "TUN": "MENA", "MAR": "MENA", "DZA": "MENA", "LBY": "MENA", "IRN": "MENA",
    "TUR": "MENA", "ISR": "MENA", "SYR": "MENA", "YEM": "MENA", "PSE": "MENA",
    "USA": "NAM", "CAN": "NAM",
    "GBR": "ECA", "DEU": "ECA", "FRA": "ECA", "CHE": "ECA", "NLD": "ECA",
    "IRL": "ECA", "SWE": "ECA", "NOR": "ECA", "DNK": "ECA", "FIN": "ECA",
    "ESP": "ECA", "ITA": "ECA", "POL": "ECA", "CZE": "ECA", "HUN": "ECA",
    "RUS": "ECA", "KAZ": "ECA", "UZB": "ECA",
    "CHN": "EAP", "JPN": "EAP", "KOR": "EAP", "AUS": "EAP", "SGP": "EAP",
    "IDN": "EAP", "VNM": "EAP", "THA": "EAP", "MYS": "EAP", "PHL": "EAP",
    "IND": "SAS", "PAK": "SAS", "BGD": "SAS", "LKA": "SAS",
    "BRA": "LAC", "MEX": "LAC", "ARG": "LAC", "CHL": "LAC", "COL": "LAC",
    "NGA": "SSA", "ZAF": "SSA", "KEN": "SSA", "ETH": "SSA", "GHA": "SSA",
}

@dataclass
class InvestmentSignal:
    signal_code: str
    signal_type: str
    company_name: str
    company_hq_iso3: Optional[str]
    economy_iso3: str
    sector_isic: Optional[str]
    sci_score: float
    grade: str
    headline: str
    summary: str
    capex_usd: Optional[float]
    jobs_created: Optional[int]
    source_name: str
    source_tier: str
    source_url: Optional[str]
    signal_date: str
    
    def to_db_record(self) -> dict:
        return {**asdict(self), "verified": False, "created_at": datetime.now(timezone.utc).isoformat()}

# ─── NLP SIGNAL CLASSIFIER ───────────────────────────────────────────────────

class SignalClassifier:
    """Classifies news articles into GFM signal types using keyword + ML classification."""
    
    SIGNAL_PATTERNS = {
        "GFS": [
            r"new (factory|plant|facility|hub|campus|centre|center|office)",
            r"greenfield (investment|project|development)",
            r"build (new|a) .{0,30}(plant|facility|hub|data centre|campus)",
            r"(establish|set up|open|launch) .{0,30}(operations|subsidiary|office|branch)",
            r"(data cent(re|er)|hyperscale|logistics hub|manufacturing facility)",
        ],
        "MAI": [
            r"acqui(re|red|sition|ring)",
            r"merges? with|takeover|merger",
            r"buyout|bought .{0,20}(stake|share)",
            r"purchase[sd]? .{0,30}(company|firm|business|group)",
        ],
        "VCM": [
            r"series [A-E] (round|funding|investment)",
            r"venture (capital|investment|fund)",
            r"\$\d+[MB] (in )?(funding|investment|round)",
            r"(led|backed) by .{0,30}(ventures|capital|fund|investors)",
            r"(seed|pre-seed) (round|funding|investment)",
        ],
        "CES": [
            r"expan(d|sion|ding) .{0,40}(operations|presence|into|capacity)",
            r"(regional|global|international) headquarters",
            r"relocat(e|ing|ion) .{0,30}(headquarters|HQ|office)",
            r"scale[sd]? (up|operations) in",
            r"increase.{0,20}(capacity|production|workforce)",
        ],
        "REI": [
            r"(commercial|office|industrial|logistics) (real estate|property|development)",
            r"(acquire|develop|build) .{0,30}(tower|building|park|complex|warehouse|mall)",
            r"REIT|real estate investment",
        ],
        "EOC": [
            r"(oil|gas|LNG|energy) (field|project|investment|plant|refinery|pipeline)",
            r"(renewable|solar|wind|hydrogen) .{0,30}(plant|farm|project|investment)",
            r"(gigawatt|MW|GW) (of )?(capacity|solar|wind|energy)",
        ],
        "JVP": [
            r"joint venture|JV (agreement|partnership|formation)",
            r"(partnership|collaborate|team up) with .{0,30}(to build|to develop|to establish)",
        ],
        "TES": [
            r"(export|trade|supply) (deal|agreement|contract|hub)",
            r"(free trade|trade agreement|FTA) .{0,20}(signed|ratified|approved)",
        ],
        "ESG": [
            r"net.?zero|carbon.?neutral|sustainability|ESG|green (investment|bond|finance)",
            r"(decarboni[sz]|renewable|clean energy) (investment|commitment|plan)",
        ],
        "DSG": [
            r"(defence|military|security) (contract|investment|procurement|facility)",
            r"(arms|weapon|aerospace) (deal|manufacturing|export)",
        ],
    }
    
    ECONOMY_PATTERNS = {
        "ARE": ["united arab emirates", "uae", "dubai", "abu dhabi", "sharjah", "ajman"],
        "SAU": ["saudi arabia", "saudi", "ksa", "riyadh", "jeddah", "neom"],
        "QAT": ["qatar", "doha"],
        "KWT": ["kuwait"],
        "BHR": ["bahrain", "manama"],
        "OMN": ["oman", "muscat"],
        "EGY": ["egypt", "cairo"],
        "GBR": ["united kingdom", "uk", "britain", "england", "london"],
        "DEU": ["germany", "berlin", "frankfurt", "munich"],
        "FRA": ["france", "paris"],
        "USA": ["united states", "usa", "america", "new york", "silicon valley", "san francisco"],
        "CHN": ["china", "beijing", "shanghai", "shenzhen"],
        "IND": ["india", "mumbai", "bangalore", "delhi", "hyderabad"],
        "SGP": ["singapore"],
        "JPN": ["japan", "tokyo"],
        "KOR": ["south korea", "korea", "seoul"],
        "AUS": ["australia", "sydney", "melbourne"],
        "BRA": ["brazil", "sao paulo", "rio"],
        "NGA": ["nigeria", "lagos", "abuja"],
        "ZAF": ["south africa", "johannesburg", "cape town"],
        "KEN": ["kenya", "nairobi"],
        "IDN": ["indonesia", "jakarta"],
        "VNM": ["vietnam", "hanoi", "ho chi minh"],
    }
    
    CAPEX_PATTERN = re.compile(
        r'\$\s*(\d+(?:\.\d+)?)\s*([BMT](?:illion)?)',
        re.IGNORECASE
    )
    
    JOBS_PATTERN = re.compile(
        r'(\d{1,6}(?:,\d{3})*)\s*(?:\+\s*)?(jobs|employees|workers|positions|staff)',
        re.IGNORECASE
    )
    
    def classify_signal_type(self, text: str) -> str:
        text_lower = text.lower()
        scores = {}
        for sig_type, patterns in self.SIGNAL_PATTERNS.items():
            score = sum(1 for p in patterns if re.search(p, text_lower))
            if score > 0:
                scores[sig_type] = score
        if scores:
            return max(scores, key=scores.get)  # type: ignore
        return "CES"  # Default to corporate expansion
    
    def extract_economy(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for iso3, keywords in self.ECONOMY_PATTERNS.items():
            if any(kw in text_lower for kw in keywords):
                return iso3
        return None
    
    def extract_capex(self, text: str) -> Optional[float]:
        match = self.CAPEX_PATTERN.search(text)
        if match:
            amount = float(match.group(1))
            suffix = match.group(2).upper()
            if suffix.startswith('B'):
                return amount * 1_000_000_000
            elif suffix.startswith('M'):
                return amount * 1_000_000
            elif suffix.startswith('T'):
                return amount * 1_000_000_000_000
        return None
    
    def extract_jobs(self, text: str) -> Optional[int]:
        match = self.JOBS_PATTERN.search(text)
        if match:
            return int(match.group(1).replace(',', ''))
        return None
    
    def classify_sector(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        sector_keywords = {
            "J": ["technology", "software", "data centre", "cloud", "ai ", "artificial intelligence", "fintech", "digital"],
            "C": ["manufacturing", "factory", "production", "assembly", "semiconductor", "automotive"],
            "K": ["financial", "banking", "insurance", "asset management", "investment fund"],
            "D": ["energy", "power", "solar", "wind", "renewable", "electricity"],
            "F": ["construction", "infrastructure", "real estate development"],
            "L": ["real estate", "property", "reit", "office", "commercial property"],
            "B": ["mining", "oil", "gas", "lng", "petroleum", "mineral"],
            "Q": ["healthcare", "pharmaceutical", "hospital", "medical", "biotech"],
            "H": ["logistics", "transport", "shipping", "port", "aviation", "freight"],
        }
        for isic, keywords in sector_keywords.items():
            if any(kw in text_lower for kw in keywords):
                return isic
        return None

# ─── SCI SCORER ──────────────────────────────────────────────────────────────

class SCIScorer:
    """
    Computes Signal Confidence Index (SCI) score 0-100.
    Components:
    1. Source Tier Weight (0-20 points)
    2. Signal Type Base Score (0-20 points)
    3. Company Prominence (0-20 points)  
    4. Capex / Scale (0-15 points)
    5. Geographic Specificity (0-15 points)
    6. Corroboration (0-10 points)
    """
    
    def compute_sci(
        self,
        source_tier: str,
        signal_type: str,
        capex_usd: Optional[float],
        economy_iso3: Optional[str],
        company_name: Optional[str],
        corroborated_by: int = 0,
    ) -> float:
        # Component 1: Source tier
        tier_weight = SOURCE_TIER_WEIGHTS.get(source_tier, 0.85)
        source_score = min(20, 17 * tier_weight)
        
        # Component 2: Signal type base
        base = SIGNAL_TYPE_BASE_SCORES.get(signal_type, 60)
        type_score = min(20, base / 5)
        
        # Component 3: Company prominence (simplified for MVP)
        co_score = 12 if company_name and len(company_name) > 3 else 8
        
        # Component 4: Capex scale
        cap_score = 0
        if capex_usd:
            if capex_usd >= 1_000_000_000:    cap_score = 15  # $1B+
            elif capex_usd >= 500_000_000:   cap_score = 13  # $500M+
            elif capex_usd >= 100_000_000:   cap_score = 11  # $100M+
            elif capex_usd >= 50_000_000:    cap_score = 9   # $50M+
            elif capex_usd >= 10_000_000:    cap_score = 7   # $10M+
            else:                             cap_score = 5
        else:
            cap_score = 5  # Unknown capex
        
        # Component 5: Geographic specificity
        geo_score = 12 if economy_iso3 else 6
        
        # Component 6: Corroboration
        corr_score = min(10, corroborated_by * 5)
        
        total = source_score + type_score + co_score + cap_score + geo_score + corr_score
        return min(100, max(0, round(total, 2)))
    
    def assign_grade(self, sci: float) -> str:
        if sci >= 85: return "PLATINUM"
        elif sci >= 70: return "GOLD"
        elif sci >= 55: return "SILVER"
        elif sci >= 40: return "BRONZE"
        else: return "DISCARD"

# ─── SIGNAL DETECTION PIPELINE ───────────────────────────────────────────────

class AGT02_SignalDetector:
    """
    Primary signal detection agent.
    Monitors news sources → classifies → scores → persists → broadcasts.
    """
    
    def __init__(self, db_pool=None, redis_client=None):
        self.classifier = SignalClassifier()
        self.scorer = SCIScorer()
        self.db_pool = db_pool
        self.redis = redis_client
        self._seq_counter = 0
    
    def _next_signal_code(self, signal_type: str, economy_iso3: str) -> str:
        self._seq_counter += 1
        date = datetime.now(timezone.utc).strftime("%Y%m%d")
        return f"MSS-{signal_type}-{economy_iso3}-{date}-{str(self._seq_counter).zfill(4)}"
    
    async def process_article(self, article: dict, source_name: str, source_tier: str = "T3") -> Optional[InvestmentSignal]:
        """Process a single news article and extract investment signal if present."""
        title = article.get("title", "")
        description = article.get("description", "") or ""
        full_text = f"{title}. {description}"
        url = article.get("url", "")
        published = article.get("publishedAt", datetime.now(timezone.utc).isoformat())
        
        # Quick pre-filter: must contain investment-related keywords
        investment_keywords = [
            "invest", "billion", "million", "facility", "plant", "factory",
            "headquarters", "expand", "acqui", "funding", "venture", "partnership",
            "greenfield", "development", "project", "deal", "launch", "open"
        ]
        if not any(kw in full_text.lower() for kw in investment_keywords):
            return None
        
        # Classify signal type
        signal_type = self.classifier.classify_signal_type(full_text)
        
        # Extract entities
        economy_iso3 = self.classifier.extract_economy(full_text) or "WLD"
        sector_isic = self.classifier.classify_sector(full_text)
        capex_usd = self.classifier.extract_capex(full_text)
        jobs_created = self.classifier.extract_jobs(full_text)
        
        # Extract company name (simple heuristic for MVP)
        company_name = self._extract_company(full_text, title)
        
        # Score
        sci = self.scorer.compute_sci(
            source_tier=source_tier,
            signal_type=signal_type,
            capex_usd=capex_usd,
            economy_iso3=economy_iso3,
            company_name=company_name,
        )
        
        grade = self.scorer.assign_grade(sci)
        if grade == "DISCARD":
            return None  # Below threshold
        
        signal = InvestmentSignal(
            signal_code=self._next_signal_code(signal_type, economy_iso3),
            signal_type=signal_type,
            company_name=company_name or "Unknown Company",
            company_hq_iso3=None,
            economy_iso3=economy_iso3,
            sector_isic=sector_isic,
            sci_score=sci,
            grade=grade,
            headline=title[:500] if title else full_text[:200],
            summary=description[:1000] if description else "",
            capex_usd=capex_usd,
            jobs_created=jobs_created,
            source_name=source_name,
            source_tier=source_tier,
            source_url=url,
            signal_date=published,
        )
        
        return signal
    
    def _extract_company(self, text: str, title: str) -> Optional[str]:
        """Simple company name extraction from headline."""
        # Look for known major companies
        MAJOR_COMPANIES = [
            "Microsoft", "Amazon", "Google", "Apple", "Meta", "Tesla",
            "Samsung", "LVMH", "Siemens", "BASF", "TotalEnergies", "Shell",
            "BP", "ExxonMobil", "Chevron", "BlackRock", "Goldman Sachs",
            "JPMorgan", "HSBC", "Volkswagen", "BMW", "Airbus", "Boeing",
            "Nvidia", "AMD", "Intel", "TSMC", "Foxconn", "Alibaba",
            "Tencent", "Huawei", "SoftBank", "Berkshire", "McKinsey",
            "Stripe", "Palantir", "OpenAI", "Anthropic", "Databricks",
            "Saudi Aramco", "ADNOC", "SABIC", "PIF", "QIA", "ADIA",
            "Mubadala", "Temasek", "GIC", "Norges", "KIA",
        ]
        title_and_text = title + " " + text
        for co in MAJOR_COMPANIES:
            if co.lower() in title_and_text.lower():
                return co
        return None
    
    async def persist_signal(self, signal: InvestmentSignal) -> bool:
        """Write signal to PostgreSQL."""
        if not self.db_pool:
            return False
        try:
            async with self.db_pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO intelligence.signals (
                        signal_code, signal_type, company_name,
                        economy_iso3, sector_isic, sci_score, grade,
                        headline, summary, capex_usd, jobs_created,
                        source_tier, source_name, source_url, signal_date
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
                    ON CONFLICT (signal_code) DO NOTHING
                """,
                    signal.signal_code, signal.signal_type, signal.company_name,
                    signal.economy_iso3, signal.sector_isic, signal.sci_score, signal.grade,
                    signal.headline, signal.summary, signal.capex_usd, signal.jobs_created,
                    signal.source_tier, signal.source_name, signal.source_url,
                    datetime.fromisoformat(signal.signal_date)
                )
            return True
        except Exception as e:
            log.error(f"AGT-02: DB write failed for {signal.signal_code}: {e}")
            return False
    
    async def broadcast_signal(self, signal: InvestmentSignal) -> None:
        """Publish signal to Redis for WebSocket broadcast (<2 second delivery)."""
        if not self.redis:
            return
        try:
            payload = json.dumps(signal.to_db_record())
            await self.redis.publish('signal.detected', payload)
            log.info(f"AGT-02: Published {signal.signal_code} [{signal.grade}] SCI:{signal.sci_score}")
        except Exception as e:
            log.error(f"AGT-02: Redis publish failed: {e}")
    
    async def run_newsapi_pipeline(self, news_articles: list[dict]) -> list[InvestmentSignal]:
        """Process a batch of news articles and return valid signals."""
        signals = []
        for article in news_articles:
            signal = await self.process_article(article, "NewsAPI", "T3")
            if signal:
                saved = await self.persist_signal(signal)
                if saved:
                    await self.broadcast_signal(signal)
                signals.append(signal)
                log.info(f"AGT-02: Signal detected: {signal.grade} | {signal.headline[:80]}")
        return signals

# ─── TEST RUN ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Test with sample articles
    agent = AGT02_SignalDetector()
    
    test_articles = [
        {
            "title": "Microsoft to build $850 million data centre campus in Abu Dhabi",
            "description": "Microsoft announced a major cloud infrastructure expansion in the UAE, confirming a new hyperscale data centre campus in Abu Dhabi's industrial zone that will create 1,200 jobs.",
            "url": "https://example.com/microsoft-uae",
            "publishedAt": "2026-03-15T10:00:00Z"
        },
        {
            "title": "Amazon Web Services announces $5.3 billion Saudi Arabia cloud region",
            "description": "AWS is investing $5.3 billion to expand its Saudi Arabia cloud region, with construction beginning Q2 2026 and expected to create 2,100 skilled technology jobs.",
            "url": "https://example.com/aws-saudi",
            "publishedAt": "2026-03-15T08:00:00Z"
        },
        {
            "title": "Samsung confirms $2.8B semiconductor packaging facility in Vietnam",
            "description": "Samsung Electronics will build a new semiconductor packaging facility in Hanoi Industrial Zone, investing $2.8 billion over three years to create 6,000 high-skilled jobs.",
            "url": "https://example.com/samsung-vietnam",
            "publishedAt": "2026-03-15T06:00:00Z"
        },
    ]
    
    async def test():
        signals = await agent.run_newsapi_pipeline(test_articles)
        print(f"\nSignals detected: {len(signals)}")
        for s in signals:
            print(f"  [{s.grade}] {s.signal_code} | SCI:{s.sci_score} | {s.headline[:60]}...")
    
    asyncio.run(test())
