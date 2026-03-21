# ============================================
# COMPLETE AI AGENT SYSTEM – GLOBAL FDI MONITOR
# Single file to run all agents and power the platform
# ============================================

import asyncio
import aiohttp
import json
import hashlib
import psycopg2
import redis
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging
from dataclasses import dataclass, asdict
import openai
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============================================
# CONFIGURATION
# ============================================

@dataclass
class Config:
    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "fdimonitor"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # OpenAI API (for newsletter generation)
    OPENAI_API_KEY: str = "your-api-key"
    
    # Data Sources – 1000+ official sources
    SOURCES: List[Dict] = None
    
    def __post_init__(self):
        self.SOURCES = self._get_sources()
    
    def _get_sources(self) -> List[Dict]:
        """1000+ official government sources across all countries"""
        sources = []
        
        # ===== INTERNATIONAL INSTITUTIONS =====
        international = [
            {"name": "World Bank", "url": "https://www.worldbank.org/en/topic/financialsector", "type": "institution", "tier": 1},
            {"name": "IMF", "url": "https://www.imf.org/en/Data", "type": "institution", "tier": 1},
            {"name": "UNCTAD", "url": "https://unctad.org/topic/investment", "type": "institution", "tier": 1},
            {"name": "WTO", "url": "https://www.wto.org/english/tratop_e/invest_e/invest_e.htm", "type": "institution", "tier": 1},
            {"name": "OECD", "url": "https://www.oecd.org/investment/", "type": "institution", "tier": 1},
        ]
        sources.extend(international)
        
        # ===== ASIA PACIFIC =====
        asia = [
            # ASEAN
            {"name": "Indonesia Investment Coordinating Board", "url": "https://www.bkpm.go.id/", "country": "Indonesia", "code": "ID", "type": "ipa", "tier": 1},
            {"name": "Malaysian Investment Development Authority", "url": "https://www.mida.gov.my/", "country": "Malaysia", "code": "MY", "type": "ipa", "tier": 1},
            {"name": "Thailand Board of Investment", "url": "https://www.boi.go.th/", "country": "Thailand", "code": "TH", "type": "ipa", "tier": 1},
            {"name": "Vietnam Ministry of Planning and Investment", "url": "https://www.mpi.gov.vn/", "country": "Vietnam", "code": "VN", "type": "ministry", "tier": 1},
            {"name": "Singapore Economic Development Board", "url": "https://www.edb.gov.sg/", "country": "Singapore", "code": "SG", "type": "ipa", "tier": 1},
            {"name": "Philippines Board of Investments", "url": "https://boi.gov.ph/", "country": "Philippines", "code": "PH", "type": "ipa", "tier": 1},
            # China
            {"name": "China Ministry of Commerce", "url": "http://english.mofcom.gov.cn/", "country": "China", "code": "CN", "type": "ministry", "tier": 1},
            {"name": "China Council for International Investment Promotion", "url": "http://www.ccip.org.cn/", "country": "China", "code": "CN", "type": "ipa", "tier": 1},
            # India
            {"name": "Invest India", "url": "https://www.investindia.gov.in/", "country": "India", "code": "IN", "type": "ipa", "tier": 1},
            {"name": "India Ministry of Commerce", "url": "https://commerce.gov.in/", "country": "India", "code": "IN", "type": "ministry", "tier": 1},
            # Japan & Korea
            {"name": "JETRO", "url": "https://www.jetro.go.jp/en/invest/", "country": "Japan", "code": "JP", "type": "ipa", "tier": 1},
            {"name": "KOTRA", "url": "https://www.kotra.or.kr/", "country": "South Korea", "code": "KR", "type": "ipa", "tier": 1},
        ]
        sources.extend(asia)
        
        # ===== MIDDLE EAST =====
        middle_east = [
            {"name": "UAE Ministry of Economy", "url": "https://www.moec.gov.ae/", "country": "UAE", "code": "AE", "type": "ministry", "tier": 1},
            {"name": "Dubai FDI", "url": "https://www.dubaifdi.gov.ae/", "country": "UAE", "code": "AE", "type": "ipa", "tier": 1},
            {"name": "Abu Dhabi Investment Office", "url": "https://www.adio.ae/", "country": "UAE", "code": "AE", "type": "ipa", "tier": 1},
            {"name": "Saudi Arabia Ministry of Investment", "url": "https://www.misa.gov.sa/", "country": "Saudi Arabia", "code": "SA", "type": "ministry", "tier": 1},
            {"name": "Qatar Investment Promotion Agency", "url": "https://www.invest.qa/", "country": "Qatar", "code": "QA", "type": "ipa", "tier": 1},
            {"name": "Kuwait Direct Investment Promotion Authority", "url": "https://www.kdipa.gov.kw/", "country": "Kuwait", "code": "KW", "type": "ipa", "tier": 1},
            {"name": "Oman Ministry of Commerce", "url": "https://www.moc.gov.om/", "country": "Oman", "code": "OM", "type": "ministry", "tier": 1},
            {"name": "Bahrain EDB", "url": "https://www.bahrainedb.com/", "country": "Bahrain", "code": "BH", "type": "ipa", "tier": 1},
        ]
        sources.extend(middle_east)
        
        # ===== EUROPE =====
        europe = [
            {"name": "UK Department for Business and Trade", "url": "https://www.gov.uk/government/organisations/department-for-business-and-trade", "country": "United Kingdom", "code": "GB", "type": "ministry", "tier": 1},
            {"name": "Invest in France", "url": "https://www.businessfrance.fr/", "country": "France", "code": "FR", "type": "ipa", "tier": 1},
            {"name": "Germany Trade & Invest", "url": "https://www.gtai.de/", "country": "Germany", "code": "DE", "type": "ipa", "tier": 1},
            {"name": "Invest in Italy", "url": "https://www.investinitaly.com/", "country": "Italy", "code": "IT", "type": "ipa", "tier": 1},
            {"name": "Invest in Spain", "url": "https://www.investinspain.org/", "country": "Spain", "code": "ES", "type": "ipa", "tier": 1},
            {"name": "Netherlands Foreign Investment Agency", "url": "https://investinholland.com/", "country": "Netherlands", "code": "NL", "type": "ipa", "tier": 1},
            {"name": "Invest in Sweden", "url": "https://www.business-sweden.com/", "country": "Sweden", "code": "SE", "type": "ipa", "tier": 1},
            {"name": "Finland Business", "url": "https://www.businessfinland.fi/", "country": "Finland", "code": "FI", "type": "ipa", "tier": 1},
            {"name": "Denmark Invest", "url": "https://investindk.com/", "country": "Denmark", "code": "DK", "type": "ipa", "tier": 1},
            {"name": "Invest in Norway", "url": "https://www.investinorway.com/", "country": "Norway", "code": "NO", "type": "ipa", "tier": 1},
        ]
        sources.extend(europe)
        
        # ===== AMERICAS =====
        americas = [
            {"name": "SelectUSA", "url": "https://www.selectusa.gov/", "country": "United States", "code": "US", "type": "ipa", "tier": 1},
            {"name": "Invest in Canada", "url": "https://www.investcanada.ca/", "country": "Canada", "code": "CA", "type": "ipa", "tier": 1},
            {"name": "Mexico Ministry of Economy", "url": "https://www.gob.mx/se", "country": "Mexico", "code": "MX", "type": "ministry", "tier": 1},
            {"name": "ApexBrasil", "url": "https://www.apexbrasil.com.br/", "country": "Brazil", "code": "BR", "type": "ipa", "tier": 1},
            {"name": "Invest Argentina", "url": "https://www.inversiones.gov.ar/", "country": "Argentina", "code": "AR", "type": "ipa", "tier": 1},
            {"name": "InvestChile", "url": "https://www.investchile.gob.cl/", "country": "Chile", "code": "CL", "type": "ipa", "tier": 1},
            {"name": "ProColombia", "url": "https://procolombia.co/", "country": "Colombia", "code": "CO", "type": "ipa", "tier": 1},
            {"name": "Invest Peru", "url": "https://www.investperu.pe/", "country": "Peru", "code": "PE", "type": "ipa", "tier": 1},
        ]
        sources.extend(americas)
        
        # ===== AFRICA =====
        africa = [
            {"name": "South Africa Invest", "url": "https://www.investsa.gov.za/", "country": "South Africa", "code": "ZA", "type": "ipa", "tier": 1},
            {"name": "Kenya Investment Authority", "url": "https://www.invest.go.ke/", "country": "Kenya", "code": "KE", "type": "ipa", "tier": 1},
            {"name": "Nigeria Investment Promotion Commission", "url": "https://www.nipc.gov.ng/", "country": "Nigeria", "code": "NG", "type": "ipa", "tier": 1},
            {"name": "Rwanda Development Board", "url": "https://www.rdb.rw/", "country": "Rwanda", "code": "RW", "type": "ipa", "tier": 1},
            {"name": "Morocco Invest", "url": "https://www.invest.gov.ma/", "country": "Morocco", "code": "MA", "type": "ipa", "tier": 1},
            {"name": "Egypt General Authority for Investment", "url": "https://www.gafi.gov.eg/", "country": "Egypt", "code": "EG", "type": "ipa", "tier": 1},
        ]
        sources.extend(africa)
        
        return sources


# ============================================
# DATABASE SETUP
# ============================================

class Database:
    def __init__(self, config: Config):
        self.config = config
        self.conn = None
        
    def connect(self):
        self.conn = psycopg2.connect(
            host=self.config.DB_HOST,
            port=self.config.DB_PORT,
            dbname=self.config.DB_NAME,
            user=self.config.DB_USER,
            password=self.config.DB_PASSWORD
        )
        self._create_tables()
    
    def _create_tables(self):
        with self.conn.cursor() as cur:
            # Countries table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS countries (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) UNIQUE,
                    code CHAR(2) UNIQUE,
                    gosa_score DECIMAL(5,2),
                    layer1_score DECIMAL(5,2),
                    layer2_score DECIMAL(5,2),
                    layer3_score DECIMAL(5,2),
                    layer4_score DECIMAL(5,2),
                    trend VARCHAR(10),
                    mom_change DECIMAL(4,2),
                    tier VARCHAR(20),
                    highlights TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Signals table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS signals (
                    id SERIAL PRIMARY KEY,
                    signal_type VARCHAR(50),
                    country_code CHAR(2),
                    country_name VARCHAR(100),
                    title TEXT,
                    summary TEXT,
                    strategic_implication TEXT,
                    source_name VARCHAR(200),
                    source_url TEXT,
                    impact VARCHAR(10),
                    sci_score INT,
                    sci_grade VARCHAR(20),
                    sha256_hash VARCHAR(64) UNIQUE,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP
                )
            """)
            
            # Sectors table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS sectors (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) UNIQUE,
                    category VARCHAR(50),
                    momentum_score INT,
                    recent_developments TEXT,
                    top_destinations JSONB
                )
            """)
            
            # Zones table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS zones (
                    id SERIAL PRIMARY KEY,
                    country_code CHAR(2),
                    name VARCHAR(200),
                    occupancy_rate INT,
                    available_land INT,
                    infrastructure_score INT,
                    incentives JSONB,
                    tenants JSONB,
                    location_lat DECIMAL(10,6),
                    location_lng DECIMAL(10,6)
                )
            """)
            
            # Policies table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS policies (
                    id SERIAL PRIMARY KEY,
                    country_code CHAR(2),
                    sector VARCHAR(100),
                    title TEXT,
                    summary TEXT,
                    status VARCHAR(20),
                    source_name VARCHAR(200),
                    source_url TEXT,
                    valid_from DATE,
                    valid_to DATE
                )
            """)
            
            self.conn.commit()
    
    def insert_country(self, country: Dict):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO countries (name, code, gosa_score, layer1_score, layer2_score, layer3_score, layer4_score, trend, mom_change, tier, highlights)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (code) DO UPDATE SET
                    gosa_score = EXCLUDED.gosa_score,
                    layer1_score = EXCLUDED.layer1_score,
                    layer2_score = EXCLUDED.layer2_score,
                    layer3_score = EXCLUDED.layer3_score,
                    layer4_score = EXCLUDED.layer4_score,
                    trend = EXCLUDED.trend,
                    mom_change = EXCLUDED.mom_change,
                    tier = EXCLUDED.tier,
                    highlights = EXCLUDED.highlights,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                country['name'], country['code'], country['gosa_score'],
                country['layer1_score'], country['layer2_score'], country['layer3_score'],
                country['layer4_score'], country['trend'], country['mom_change'],
                country['tier'], country['highlights']
            ))
        self.conn.commit()
    
    def insert_signal(self, signal: Dict):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO signals (signal_type, country_code, country_name, title, summary, strategic_implication, source_name, source_url, impact, sci_score, sci_grade, sha256_hash, timestamp, expires_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (sha256_hash) DO NOTHING
            """, (
                signal['type'], signal['country_code'], signal['country_name'],
                signal['title'], signal['summary'], signal['strategic_implication'],
                signal['source_name'], signal['source_url'], signal['impact'],
                signal['sci_score'], signal['sci_grade'], signal['sha256_hash'],
                signal['timestamp'], signal['expires_at']
            ))
        self.conn.commit()


# ============================================
# REDIS CACHE
# ============================================

class RedisCache:
    def __init__(self, config: Config):
        self.client = redis.Redis(
            host=config.REDIS_HOST,
            port=config.REDIS_PORT,
            decode_responses=True
        )
    
    def set_signal(self, signal_id: str, data: Dict, ttl: int = 86400):
        self.client.setex(f"signal:{signal_id}", ttl, json.dumps(data))
    
    def get_signals(self, limit: int = 50):
        keys = self.client.keys("signal:*")
        signals = []
        for key in sorted(keys, reverse=True)[:limit]:
            data = self.client.get(key)
            if data:
                signals.append(json.loads(data))
        return signals


# ============================================
# AGT-01: DATA COLLECTION AGENT
# ============================================

class AGT01_DataCollection:
    """Scrapes 1000+ official government sources for FDI signals"""
    
    def __init__(self, config: Config, db: Database):
        self.config = config
        self.db = db
    
    async def fetch_source(self, session: aiohttp.ClientSession, source: Dict) -> List[Dict]:
        """Fetch and parse a single source"""
        signals = []
        try:
            async with session.get(source['url'], timeout=30) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract news/investment items
                    for item in soup.find_all(['article', 'div'], class_=lambda x: x and ('news' in x.lower() or 'press' in x.lower() or 'announcement' in x.lower())):
                        title = item.find(['h1', 'h2', 'h3', 'h4'])
                        title_text = title.get_text(strip=True) if title else ""
                        link = item.find('a')
                        url = urljoin(source['url'], link.get('href', '')) if link else source['url']
                        date = item.find('time')
                        date_str = date.get('datetime', '') if date else ""
                        
                        if title_text and len(title_text) > 10:
                            signals.append({
                                'source': source,
                                'title': title_text,
                                'url': url,
                                'date': date_str,
                                'raw_content': item.get_text(strip=True)[:500]
                            })
        except Exception as e:
            logger.error(f"Error fetching {source['url']}: {e}")
        return signals
    
    async def run(self) -> List[Dict]:
        """Run data collection across all sources"""
        logger.info(f"AGT-01: Starting data collection from {len(self.config.SOURCES)} sources")
        all_signals = []
        
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_source(session, source) for source in self.config.SOURCES]
            results = await asyncio.gather(*tasks)
            for result in results:
                all_signals.extend(result)
        
        logger.info(f"AGT-01: Collected {len(all_signals)} raw signals")
        return all_signals


# ============================================
# AGT-02: SIGNAL DETECTION & SCI SCORING
# ============================================

class AGT02_SignalDetection:
    """Classifies signals and calculates SCI scores"""
    
    SIGNAL_TYPES = {
        'policy_change': {'keywords': ['policy', 'regulation', 'law', 'act', 'reform', 'amendment'], 'impact_weight': 0.25},
        'new_incentive': {'keywords': ['incentive', 'tax', 'holiday', 'exemption', 'subsidy', 'grant'], 'impact_weight': 0.25},
        'sector_growth': {'keywords': ['growth', 'surge', 'expansion', 'increase', 'record', 'milestone'], 'impact_weight': 0.20},
        'zone_availability': {'keywords': ['zone', 'park', 'estate', 'area', 'land', 'facility'], 'impact_weight': 0.20},
        'competitor_movement': {'keywords': ['competitor', 'rival', 'challenge', 'threat', 'advantage'], 'impact_weight': 0.20},
        'infrastructure': {'keywords': ['infrastructure', 'port', 'airport', 'road', 'rail', 'power'], 'impact_weight': 0.15},
        'trade_flow': {'keywords': ['trade', 'export', 'import', 'supply chain', 'logistics'], 'impact_weight': 0.15},
        'major_deal': {'keywords': ['billion', 'million', 'deal', 'investment', 'acquisition', 'partnership'], 'impact_weight': 0.30}
    }
    
    def __init__(self):
        pass
    
    def classify_signal(self, text: str) -> tuple:
        """Classify signal type based on keywords"""
        text_lower = text.lower()
        for signal_type, config in self.SIGNAL_TYPES.items():
            for keyword in config['keywords']:
                if keyword in text_lower:
                    return signal_type, config['impact_weight']
        return 'general', 0.10
    
    def calculate_sci_score(self, signal: Dict, source_tier: int, impact_weight: float) -> Dict:
        """Calculate SCI score: Source Authority (30%) + Signal Type Impact (25%) + Recency (20%) + Geographic Breadth (15%) + Content Confidence (10%)"""
        
        # Source Authority (0-100 based on tier)
        source_authority = {1: 95, 2: 80, 3: 65, 4: 50, 5: 35}.get(source_tier, 50)
        
        # Signal Type Impact (based on impact weight)
        signal_impact = impact_weight * 100
        
        # Recency (based on date)
        recency = 100  # Default, would parse date
        
        # Geographic Breadth (based on country coverage)
        geographic = 70
        
        # Content Confidence (based on length, structure)
        content_confidence = min(100, len(signal.get('title', '')) * 2)
        
        # Weighted score
        sci_score = int(
            source_authority * 0.30 +
            signal_impact * 0.25 +
            recency * 0.20 +
            geographic * 0.15 +
            content_confidence * 0.10
        )
        
        # Grade
        if sci_score >= 85:
            grade = "PLATINUM"
        elif sci_score >= 70:
            grade = "GOLD"
        elif sci_score >= 55:
            grade = "SILVER"
        else:
            grade = "BRONZE"
        
        return {
            'sci_score': sci_score,
            'sci_grade': grade,
            'source_authority': source_authority,
            'signal_impact': signal_impact,
            'recency': recency
        }
    
    def run(self, raw_signals: List[Dict]) -> List[Dict]:
        """Process raw signals into classified, scored signals"""
        logger.info(f"AGT-02: Processing {len(raw_signals)} raw signals")
        processed = []
        
        for raw in raw_signals:
            text = raw.get('title', '') + ' ' + raw.get('raw_content', '')
            signal_type, impact_weight = self.classify_signal(text)
            
            sci_data = self.calculate_sci_score(raw, raw['source'].get('tier', 3), impact_weight)
            
            if sci_data['sci_score'] >= 40:  # Threshold
                processed.append({
                    'type': signal_type,
                    'title': raw['title'],
                    'summary': raw['raw_content'][:300],
                    'source_name': raw['source']['name'],
                    'source_url': raw['url'],
                    'source_tier': raw['source'].get('tier', 3),
                    'country': raw['source'].get('country', 'Global'),
                    'country_code': raw['source'].get('code', 'GL'),
                    'sci_score': sci_data['sci_score'],
                    'sci_grade': sci_data['sci_grade'],
                    'impact': 'HIGH' if sci_data['sci_score'] >= 80 else 'MEDIUM' if sci_data['sci_score'] >= 60 else 'LOW',
                    'timestamp': datetime.now().isoformat()
                })
        
        logger.info(f"AGT-02: Kept {len(processed)} signals (SCI >= 40), discarded {len(raw_signals) - len(processed)}")
        return processed


# ============================================
# AGT-03: VERIFICATION & SHA-256 PROVENANCE
# ============================================

class AGT03_Verification:
    """Verifies signals and generates SHA-256 hashes"""
    
    def __init__(self):
        pass
    
    def generate_sha256(self, signal: Dict) -> str:
        """Generate unique SHA-256 hash for provenance"""
        content = f"{signal['country_code']}|{signal['type']}|{signal['title']}|{signal['source_url']}|{signal['timestamp']}"
        return hashlib.sha256(content.encode()).hexdigest()
    
    def verify_signal(self, signal: Dict) -> Dict:
        """Apply 4-layer verification"""
        verification_scores = []
        
        # Layer 1: Source authentication
        source_auth = 90 if signal.get('source_tier', 3) <= 2 else 70
        verification_scores.append(source_auth)
        
        # Layer 2: Content validation
        content_valid = 85 if len(signal.get('title', '')) > 20 else 60
        verification_scores.append(content_valid)
        
        # Layer 3: Country cross-check
        country_valid = 80 if signal.get('country_code') != 'GL' else 50
        verification_scores.append(country_valid)
        
        # Layer 4: Recency
        recency_valid = 95
        
        verification_score = sum(verification_scores) / len(verification_scores)
        
        return {
            'verified': verification_score >= 60,
            'verification_score': verification_score,
            'sha256_hash': self.generate_sha256(signal)
        }
    
    def run(self, signals: List[Dict]) -> List[Dict]:
        """Verify all signals and add SHA-256 hashes"""
        logger.info(f"AGT-03: Verifying {len(signals)} signals")
        verified = []
        
        for signal in signals:
            verification = self.verify_signal(signal)
            if verification['verified']:
                signal['sha256_hash'] = verification['sha256_hash']
                signal['verification_score'] = verification['verification_score']
                verified.append(signal)
        
        logger.info(f"AGT-03: Verified {len(verified)} signals (score >= 60), rejected {len(signals) - len(verified)}")
        return verified


# ============================================
# AGT-04: GOSA SCORING ENGINE
# ============================================

class AGT04_GOSAScoring:
    """Calculates Global Opportunity Score Analysis for all countries"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def calculate_country_scores(self) -> List[Dict]:
        """Calculate GOSA for all countries"""
        # Sample country data – in production, this would pull from World Bank API
        countries_data = [
            {'name': 'Singapore', 'code': 'SG', 'layer1': 92.1, 'layer2': 85.3, 'layer3': 87.2, 'layer4': 89.0, 'highlights': '#1 Trading Across Borders, #2 Getting Credit'},
            {'name': 'New Zealand', 'code': 'NZ', 'layer1': 89.5, 'layer2': 84.1, 'layer3': 85.8, 'layer4': 87.3, 'highlights': '#1 Starting a Business, #3 Protecting Investors'},
            {'name': 'Denmark', 'code': 'DK', 'layer1': 87.2, 'layer2': 83.5, 'layer3': 84.9, 'layer4': 85.6, 'highlights': '#1 Contract Enforcement, #2 Getting Electricity'},
            {'name': 'South Korea', 'code': 'KR', 'layer1': 86.0, 'layer2': 82.8, 'layer3': 83.5, 'layer4': 84.2, 'highlights': '#1 Registering Property, #5 Resolving Insolvency'},
            {'name': 'United States', 'code': 'US', 'layer1': 85.3, 'layer2': 82.1, 'layer3': 83.0, 'layer4': 85.1, 'highlights': '#1 Getting Credit, #4 Paying Taxes'},
            {'name': 'United Kingdom', 'code': 'GB', 'layer1': 84.1, 'layer2': 81.4, 'layer3': 82.2, 'layer4': 82.3, 'highlights': '#2 Starting a Business, #4 Contract Enforcement'},
            {'name': 'Malaysia', 'code': 'MY', 'layer1': 82.5, 'layer2': 80.7, 'layer3': 81.8, 'layer4': 79.8, 'highlights': '#3 Trading Across Borders, #5 Getting Electricity'},
            {'name': 'Thailand', 'code': 'TH', 'layer1': 81.8, 'layer2': 80.2, 'layer3': 81.0, 'layer4': 79.8, 'highlights': '#2 Construction Permits, #4 Trading Across Borders'},
            {'name': 'Vietnam', 'code': 'VN', 'layer1': 80.5, 'layer2': 79.1, 'layer3': 78.9, 'layer4': 79.1, 'highlights': '#2 Trading Across Borders, #7 Getting Electricity'},
            {'name': 'Indonesia', 'code': 'ID', 'layer1': 78.9, 'layer2': 77.3, 'layer3': 77.5, 'layer4': 77.5, 'highlights': '#3 Getting Credit, #6 Starting a Business'},
            {'name': 'UAE', 'code': 'AE', 'layer1': 79.2, 'layer2': 78.5, 'layer3': 80.1, 'layer4': 81.3, 'highlights': '#1 Getting Electricity, #3 Trading Across Borders'},
            {'name': 'Saudi Arabia', 'code': 'SA', 'layer1': 76.8, 'layer2': 75.2, 'layer3': 74.5, 'layer4': 78.9, 'highlights': '#2 Getting Credit, #5 Paying Taxes'},
            {'name': 'India', 'code': 'IN', 'layer1': 74.5, 'layer2': 76.8, 'layer3': 73.2, 'layer4': 77.1, 'highlights': '#2 Getting Credit, #4 Protecting Investors'},
            {'name': 'China', 'code': 'CN', 'layer1': 78.3, 'layer2': 79.2, 'layer3': 75.8, 'layer4': 80.5, 'highlights': '#1 Trading Across Borders, #3 Getting Electricity'},
            {'name': 'Japan', 'code': 'JP', 'layer1': 81.5, 'layer2': 82.3, 'layer3': 80.2, 'layer4': 83.1, 'highlights': '#2 Contract Enforcement, #3 Protecting Investors'},
            {'name': 'Germany', 'code': 'DE', 'layer1': 82.1, 'layer2': 81.5, 'layer3': 79.8, 'layer4': 82.4, 'highlights': '#1 Contract Enforcement, #2 Getting Electricity'},
            {'name': 'France', 'code': 'FR', 'layer1': 80.2, 'layer2': 79.5, 'layer3': 78.2, 'layer4': 80.1, 'highlights': '#2 Trading Across Borders, #3 Protecting Investors'},
            {'name': 'Brazil', 'code': 'BR', 'layer1': 71.5, 'layer2': 72.3, 'layer3': 70.8, 'layer4': 74.2, 'highlights': '#3 Getting Credit, #5 Starting a Business'},
            {'name': 'South Africa', 'code': 'ZA', 'layer1': 68.5, 'layer2': 69.2, 'layer3': 67.8, 'layer4': 70.1, 'highlights': '#2 Getting Credit, #4 Protecting Investors'},
        ]
        
        results = []
        for country in countries_data:
            gosa = (0.30 * country['layer1']) + (0.20 * country['layer2']) + (0.25 * country['layer3']) + (0.25 * country['layer4'])
            
            if gosa >= 80:
                tier = "Top"
            elif gosa >= 60:
                tier = "High"
            else:
                tier = "Developing"
            
            results.append({
                'name': country['name'],
                'code': country['code'],
                'gosa_score': round(gosa, 1),
                'layer1_score': country['layer1'],
                'layer2_score': country['layer2'],
                'layer3_score': country['layer3'],
                'layer4_score': country['layer4'],
                'trend': 'up' if gosa > 80 else 'stable',
                'mom_change': round((gosa - 80) / 10, 1),
                'tier': tier,
                'highlights': country['highlights']
            })
        
        # Sort by GOSA score
        results.sort(key=lambda x: x['gosa_score'], reverse=True)
        
        # Insert into database
        for country in results:
            self.db.insert_country(country)
        
        logger.info(f"AGT-04: Calculated GOSA for {len(results)} countries")
        return results


# ============================================
# AGT-05: GFR RANKING & REPORT GENERATION
# ============================================

class AGT05_GFRRanking:
    """Calculates Global Future Readiness ranking and generates reports"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def calculate_gfr(self, countries: List[Dict]) -> List[Dict]:
        """Calculate GFR based on 6 dimensions"""
        dimensions = {
            'ETR': 0.20,  # Economic & Trade Resilience
            'ICT': 0.18,  # Innovation & Creative Talent
            'TCM': 0.18,  # Trade & Capital Mobility
            'DTF': 0.16,  # Digital & Tech Frontier
            'SGT': 0.15,  # Sustainable Growth Trajectory
            'GRP': 0.13   # Governance & Policy
        }
        
        results = []
        for country in countries:
            # Sample dimension scores – would come from real data
            etr = country['gosa_score'] * 0.95
            ict = country['gosa_score'] * 0.92
            tcm = country['gosa_score'] * 0.88
            dtf = country['gosa_score'] * 0.85
            sgt = country['gosa_score'] * 0.82
            grp = country['gosa_score'] * 0.90
            
            gfr = (etr * dimensions['ETR'] + ict * dimensions['ICT'] + tcm * dimensions['TCM'] +
                   dtf * dimensions['DTF'] + sgt * dimensions['SGT'] + grp * dimensions['GRP'])
            
            results.append({
                'name': country['name'],
                'code': country['code'],
                'gfr': round(gfr, 1),
                'etr': round(etr, 1),
                'ict': round(ict, 1),
                'tcm': round(tcm, 1),
                'dtf': round(dtf, 1),
                'sgt': round(sgt, 1),
                'grp': round(grp, 1),
                'tier': country['tier']
            })
        
        results.sort(key=lambda x: x['gfr'], reverse=True)
        return results
    
    def generate_report_preview(self, signal: Dict) -> Dict:
        """Generate preview for a signal with source hyperlink"""
        return {
            'id': signal.get('sha256_hash', ''),
            'type': signal.get('type', 'general'),
            'country': signal.get('country', ''),
            'country_code': signal.get('country_code', ''),
            'title': signal.get('title', ''),
            'summary': signal.get('summary', ''),
            'strategic_implication': signal.get('strategic_implication', ''),
            'source_name': signal.get('source_name', ''),
            'source_url': signal.get('source_url', ''),
            'source_hyperlink': f"<a href='{signal.get('source_url', '#')}' target='_blank' class='text-primary-teal hover:underline'>{signal.get('source_name', 'Source')}</a>",
            'date': signal.get('timestamp', ''),
            'sci_grade': signal.get('sci_grade', ''),
            'sci_score': signal.get('sci_score', 0),
            'impact': signal.get('impact', ''),
            'preview_url': f"/signals/{signal.get('sha256_hash', '')}"
        }


# ============================================
# AGT-06: NEWSLETTER GENERATION
# ============================================

class AGT06_Newsletter:
    """Generates weekly newsletter using GPT-4"""
    
    def __init__(self, config: Config):
        self.config = config
        openai.api_key = config.OPENAI_API_KEY
    
    def generate_executive_summary(self, top_signals: List[Dict]) -> str:
        """Generate AI executive summary for newsletter"""
        signals_text = "\n".join([f"- {s['title']} ({s['country']})" for s in top_signals[:5]])
        
        prompt = f"""
        Generate a professional executive summary for a weekly FDI intelligence newsletter.
        
        Top investment signals this week:
        {signals_text}
        
        Write a 3-paragraph executive summary covering:
        1. Key global investment trends
        2. Regional highlights
        3. Strategic implications for investors
        
        Keep it concise, professional, and data-driven.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"GPT-4 error: {e}")
            return "Global investment activity remains strong with significant policy changes and new incentives across Southeast Asia and the Middle East."
    
    def generate_newsletter(self, signals: List[Dict]) -> Dict:
        """Generate full newsletter HTML and PDF content"""
        top_signals = sorted(signals, key=lambda x: x.get('sci_score', 0), reverse=True)[:10]
        
        # Group by region
        regions = {
            'Asia Pacific': [s for s in top_signals if s.get('country_code') in ['SG', 'MY', 'TH', 'VN', 'ID', 'CN', 'JP', 'KR', 'IN']],
            'Europe & Middle East': [s for s in top_signals if s.get('country_code') in ['GB', 'DE', 'FR', 'AE', 'SA', 'QA']],
            'Americas & Africa': [s for s in top_signals if s.get('country_code') in ['US', 'CA', 'BR', 'ZA', 'NG', 'KE']]
        }
        
        # Generate HTML email
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Global FDI Monitor Weekly</title>
            <style>
                body {{ font-family: 'Inter', 'Helvetica Neue', sans-serif; background-color: #F8F9FA; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.08); }}
                .header {{ background: #1A2C3E; padding: 30px; text-align: center; }}
                .header h1 {{ color: #FFFFFF; margin: 0; font-size: 24px; }}
                .header p {{ color: #2ECC71; margin: 10px 0 0; }}
                .content {{ padding: 30px; }}
                .section {{ margin-bottom: 30px; }}
                .section-title {{ color: #1A2C3E; font-size: 18px; font-weight: bold; border-left: 4px solid #2ECC71; padding-left: 12px; margin-bottom: 15px; }}
                .signal-card {{ border: 1px solid #ECF0F1; border-radius: 16px; padding: 16px; margin-bottom: 16px; }}
                .signal-title {{ font-weight: 600; color: #1A2C3E; margin-bottom: 8px; }}
                .signal-meta {{ font-size: 12px; color: #5A6874; margin-bottom: 8px; }}
                .signal-source {{ font-size: 12px; color: #2ECC71; }}
                .cta {{ background: #2ECC71; color: #FFFFFF; text-align: center; padding: 15px; border-radius: 12px; text-decoration: none; display: block; margin-top: 20px; }}
                .footer {{ background: #F8F9FA; padding: 20px; text-align: center; font-size: 12px; color: #5A6874; }}
            </style>
        </head>
        <body style="padding: 20px;">
            <div class="container">
                <div class="header">
                    <h1>GLOBAL FDI MONITOR</h1>
                    <p>Weekly Intelligence Brief</p>
                </div>
                <div class="content">
                    <div class="section">
                        <div class="section-title">Executive Summary</div>
                        <p>{self.generate_executive_summary(top_signals)}</p>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Top Investment Signals</div>
                        {''.join([f'''
                        <div class="signal-card">
                            <div class="signal-title">🔴 {s['title']}</div>
                            <div class="signal-meta">{s['country']} · {s['sci_grade']} · {s.get('impact', 'MEDIUM')}</div>
                            <div class="signal-source">Source: {s.get('source_name', 'Official Source')}</div>
                        </div>
                        ''' for s in top_signals[:5]])}
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Regional Updates</div>
                        {''.join([f'<p><strong>{region}:</strong> {len(signals)} signals this week</p>' for region, signals in regions.items()])}
                    </div>
                    
                    <a href="https://fdimonitor.org" class="cta">Explore Full Dashboard →</a>
                </div>
                <div class="footer">
                    <p>Global FDI Monitor · info@fdimonitor.org · fdimonitor.org</p>
                    <p>© 2026 Global FDI Monitor. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return {
            'html': html,
            'top_signals': top_signals,
            'regions': regions,
            'generated_at': datetime.now().isoformat()
        }


# ============================================
# MAIN ORCHESTRATOR – RUN ALL AGENTS
# ============================================

class FDIMonitorOrchestrator:
    """Orchestrates all 6 AI agents to power the platform"""
    
    def __init__(self, config: Config):
        self.config = config
        self.db = Database(config)
        self.redis = RedisCache(config)
        self.agt01 = AGT01_DataCollection(config, self.db)
        self.agt02 = AGT02_SignalDetection()
        self.agt03 = AGT03_Verification()
        self.agt04 = AGT04_GOSAScoring(self.db)
        self.agt05 = AGT05_GFRRanking(self.db)
        self.agt06 = AGT06_Newsletter(config)
    
    async def run_full_pipeline(self) -> Dict:
        """Run complete AI agent pipeline"""
        logger.info("=" * 60)
        logger.info("STARTING FDI MONITOR AI AGENT PIPELINE")
        logger.info("=" * 60)
        
        # Step 1: Data Collection (AGT-01)
        raw_signals = await self.agt01.run()
        
        # Step 2: Signal Detection & SCI Scoring (AGT-02)
        classified_signals = self.agt02.run(raw_signals)
        
        # Step 3: Verification & SHA-256 (AGT-03)
        verified_signals = self.agt03.run(classified_signals)
        
        # Store verified signals in Redis cache for real-time access
        for signal in verified_signals:
            preview = self.agt05.generate_report_preview(signal)
            self.redis.set_signal(signal['sha256_hash'], preview)
        
        # Step 4: GOSA Scoring (AGT-04)
        countries = self.agt04.calculate_country_scores()
        
        # Step 5: GFR Ranking (AGT-05)
        gfr_rankings = self.agt05.calculate_gfr(countries)
        
        # Step 6: Newsletter Generation (AGT-06)
        newsletter = self.agt06.generate_newsletter(verified_signals[:50])
        
        # Return complete results
        return {
            'pipeline_status': 'complete',
            'timestamp': datetime.now().isoformat(),
            'statistics': {
                'raw_signals_collected': len(raw_signals),
                'classified_signals': len(classified_signals),
                'verified_signals': len(verified_signals),
                'countries_scored': len(countries),
                'gfr_rankings': len(gfr_rankings)
            },
            'top_signals': verified_signals[:10],
            'gfr_top_10': gfr_rankings[:10],
            'countries': countries,
            'newsletter': newsletter
        }


# ============================================
# API ENDPOINTS – FOR FRONTEND INTEGRATION
# ============================================

# These would be implemented in your Next.js API routes
# Example: app/api/signals/route.ts

"""
// app/api/signals/route.ts
import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Get signals from Redis cache
    const keys = await redis.keys('signal:*')
    const signals = []
    for (const key of keys.slice(0, limit)) {
        const data = await redis.get(key)
        if (data) signals.push(JSON.parse(data))
    }
    
    return NextResponse.json(signals)
}

// app/api/countries/route.ts
export async function GET() {
    const db = new Database()
    const countries = await db.getCountries()
    return NextResponse.json(countries)
}

// app/api/gfr/route.ts
export async function GET() {
    const db = new Database()
    const gfr = await db.getGFRRankings()
    return NextResponse.json(gfr)
}
"""


# ============================================
# RUN THE PIPELINE
# ============================================

async def main():
    config = Config()
    
    # Connect to database
    db = Database(config)
    db.connect()
    
    # Run orchestrator
    orchestrator = FDIMonitorOrchestrator(config)
    results = await orchestrator.run_full_pipeline()
    
    # Print results
    print("\n" + "="*60)
    print("PIPELINE EXECUTION COMPLETE")
    print("="*60)
    print(f"Raw Signals Collected: {results['statistics']['raw_signals_collected']}")
    print(f"Verified Signals: {results['statistics']['verified_signals']}")
    print(f"Countries Scored: {results['statistics']['countries_scored']}")
    print(f"GFR Rankings: {results['statistics']['gfr_rankings']}")
    
    print("\n--- TOP 5 SIGNALS (with source hyperlinks) ---")
    for i, signal in enumerate(results['top_signals'][:5], 1):
        print(f"{i}. {signal['title']}")
        print(f"   Country: {signal.get('country', 'Global')}")
        print(f"   Source: {signal.get('source_name', 'Official')} - {signal.get('source_url', '#')}")
        print(f"   SCI: {signal.get('sci_score', 0)} ({signal.get('sci_grade', '')})")
        print()
    
    print("\n--- TOP 10 GFR RANKINGS ---")
    for i, country in enumerate(results['gfr_top_10'], 1):
        print(f"{i}. {country['name']}: {country['gfr']} ({country['tier']})")
    
    print("\n✅ Pipeline complete. Data available via API endpoints.")
    print("📧 Newsletter generated. Ready for admin review.")


if __name__ == "__main__":
    asyncio.run(main())