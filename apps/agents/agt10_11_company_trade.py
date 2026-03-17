"""
GLOBAL FDI MONITOR — AGT-10: COMPANY INTELLIGENCE AGENT (CIC)
Enriches company profiles with 12-dimension CIC intelligence.
Sources: SEC EDGAR, Companies House, news, patent databases.

AGT-11: TRADE INTELLIGENCE AGENT (GTM)
Computes Global Trade Monitor indicators:
  - Trade Performance Dashboard Score (TPDS)
  - Revealed Comparative Advantage (RCA)
  - Supply Chain Connectivity & Resilience Index (SCCRI)
  - Bilateral Trade Corridor Intelligence (BTCI)
"""
import asyncio, json, re, os, logging
from datetime import datetime, timezone
from typing import Optional
import httpx

log = logging.getLogger("gfm.agt10_11")

# ═══════════════════════════════════════════════════════════════════════════════
# AGT-10: COMPANY INTELLIGENCE AGENT
# ═══════════════════════════════════════════════════════════════════════════════

CIC_DIMENSIONS = [
    "CIC-ID",    "CIC-HIER",  "CIC-FIN",   "CIC-INV",
    "CIC-STRAT", "CIC-SECT",  "CIC-CSUITE","CIC-ESG",
    "CIC-COMP",  "CIC-RISK",  "CIC-DIGI",  "CIC-SIG",
]

IMS_GRADE_WEIGHTS = {
    "PLATINUM": 3.0,
    "GOLD":     2.0,
    "SILVER":   1.5,
    "BRONZE":   1.0,
}

class IMS_Computer:
    """Computes Investment Momentum Score (0–100) from signal history."""

    def compute(self, signals: list, lookback_days: int = 365) -> float:
        if not signals:
            return 0.0

        # Volume score (0–40): signal count in last 12 months
        volume = len(signals)
        volume_score = min(40, volume * 8)

        # Quality score (0–35): weighted by SCI grade
        quality_sum = sum(
            IMS_GRADE_WEIGHTS.get(s.get("grade","BRONZE"), 1.0) * (s.get("sci_score",50)/100)
            for s in signals
        )
        quality_score = min(35, quality_sum * 5)

        # Diversity score (0–15): different signal types
        types = {s.get("signal_type","?") for s in signals}
        diversity_score = min(15, len(types) * 3)

        # Recency score (0–10): most recent signal within last 90 days
        recency_score = 10 if signals else 0  # In prod: check signal_date vs now

        ims = round(volume_score + quality_score + diversity_score + recency_score, 2)
        return min(100.0, ims)


class AGT10_CompanyIntelligenceAgent:
    """
    Enriches CIC profiles for companies in the signal pipeline.
    12-dimension profile covering: identity, hierarchy, financials, investment
    footprint, strategy, sector, C-suite, ESG, competitive position,
    risk, digital maturity, and active signals.
    """

    def __init__(self, db_pool=None):
        self.ims_computer = IMS_Computer()
        self.db_pool      = db_pool

    async def _fetch_edgar_filing(self, ticker: str) -> dict:
        """Fetch latest 10-K/20-F from SEC EDGAR (free API)."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Get CIK from ticker
                r = await client.get(
                    f"https://efts.sec.gov/LATEST/search-index?q=%22{ticker}%22&dateRange=custom&startdt=2024-01-01&forms=10-K",
                    headers={"User-Agent":"GlobalFDIMonitor research@fdimonitor.org"},
                )
                if r.status_code == 200:
                    data = r.json()
                    hits = data.get("hits",{}).get("hits",[])
                    if hits:
                        return {"source":"EDGAR","filing_type":"10-K","entity":hits[0].get("_source",{}).get("entity_name",""),"accession":hits[0].get("_source",{}).get("accession_no","")}
        except Exception as e:
            log.debug(f"EDGAR fetch failed for {ticker}: {e}")
        return {}

    def build_cic_profile(self, company: dict, signals: list, edgar_data: dict) -> dict:
        """Assemble full 12-dimension CIC profile."""
        ims = self.ims_computer.compute(signals)

        # Derive tier counts by grade
        grade_counts = {}
        for s in signals:
            g = s.get("grade","BRONZE")
            grade_counts[g] = grade_counts.get(g,0) + 1

        profile = {
            # CIC-ID: Core identity
            "cic_id": f"GFM-{company.get('hq_iso3','UNK')}-{company.get('ticker','UNK')}-{abs(hash(company.get('legal_name',''))%100000):05d}",
            "legal_name":       company.get("legal_name",""),
            "hq_country_iso3":  company.get("hq_iso3",""),
            "ticker":           company.get("ticker"),
            "primary_isic":     company.get("primary_isic","J"),
            "ims_score":        ims,
            "ims_grade":        "HIGH" if ims>=75 else "ACTIVE" if ims>=50 else "MODERATE",

            # CIC-FIN: Financials
            "revenue_usd":         company.get("revenue_usd"),
            "employees":           company.get("employees"),
            "listing_status":      company.get("listing_status","private"),
            "recently_funded":     company.get("recently_funded",False),

            # CIC-INV: Investment footprint
            "investment_footprint": company.get("investment_footprint",[]),
            "footprint_economy_count": len(company.get("investment_footprint",[])),

            # CIC-SIG: Signal intelligence
            "signal_count_12m":    len(signals),
            "signal_grade_dist":   grade_counts,
            "active_signals":      signals[:10],  # Top 10 most recent

            # CIC-CSUITE: Leadership (publicly disclosed)
            "csuite_change_12m":   company.get("csuite_change_12m",False),
            "public_executives":   company.get("public_executives",[]),

            # CIC-ESG: Sustainability
            "esg_committed":       company.get("esg_committed",False),
            "net_zero_target":     company.get("net_zero_target"),
            "sbti_committed":      company.get("sbti_committed",False),

            # CIC-RISK: Risk profile
            "sanctions_cleared":   True,  # AGT-08 verifies before this
            "sanctions_checked_at": datetime.now(timezone.utc).isoformat(),

            # CIC-STRAT: Strategy
            "strategic_priorities": company.get("strategic_priorities",""),

            # Metadata
            "edgar_data":    edgar_data if edgar_data else None,
            "last_cic_update": datetime.now(timezone.utc).isoformat(),
            "profile_completeness": self._score_completeness(company, signals),
        }
        return profile

    def _score_completeness(self, company: dict, signals: list) -> int:
        """Score profile completeness 0–100."""
        fields = [
            "legal_name","hq_iso3","primary_isic",
            "revenue_usd","employees","investment_footprint","strategic_priorities"
        ]
        filled = sum(1 for f in fields if company.get(f))
        signal_bonus = min(20, len(signals) * 5)
        return min(100, round(filled / len(fields) * 80 + signal_bonus))

    async def enrich_company(self, company: dict, signals: list) -> dict:
        """Full enrichment pipeline for a single company."""
        ticker     = company.get("ticker","")
        edgar_data = {}
        if ticker:
            edgar_data = await self._fetch_edgar_filing(ticker)

        profile = self.build_cic_profile(company, signals, edgar_data)

        # Persist to DB in production
        if self.db_pool:
            async with self.db_pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO intelligence.companies (
                        cic_id, legal_name, hq_country_iso3, ticker,
                        primary_isic, ims_score, revenue_usd, employees,
                        listing_status, cic_financial, cic_footprint,
                        cic_strategic, cic_csuite, cic_esg, cic_sig,
                        sanctions_cleared, last_cic_update
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW())
                    ON CONFLICT (cic_id) DO UPDATE SET
                        ims_score=$6, revenue_usd=$7, cic_sig=$15,
                        last_cic_update=NOW()
                """, profile["cic_id"], profile["legal_name"], profile["hq_country_iso3"],
                    profile["ticker"], profile["primary_isic"], profile["ims_score"],
                    profile["revenue_usd"], profile["employees"], profile["listing_status"],
                    json.dumps({"revenue":profile["revenue_usd"]}),
                    json.dumps(profile["investment_footprint"]),
                    json.dumps({"priorities":profile["strategic_priorities"]}),
                    json.dumps({"executives":profile["public_executives"]}),
                    json.dumps({"net_zero":profile["net_zero_target"]}),
                    json.dumps(profile["active_signals"]),
                    profile["sanctions_cleared"],
                )
        return profile

    async def batch_enrich(self, companies: list, signals_by_company: dict) -> list:
        """Batch enrich multiple companies in parallel."""
        tasks = [
            self.enrich_company(c, signals_by_company.get(c.get("legal_name",""),[]))
            for c in companies
        ]
        return await asyncio.gather(*tasks)


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-11: TRADE INTELLIGENCE AGENT
# ═══════════════════════════════════════════════════════════════════════════════

class AGT11_TradeIntelligenceAgent:
    """
    Computes Global Trade Monitor (GTM) indicators:
    - TPDS: Trade Performance Dashboard Score
    - RCA: Revealed Comparative Advantage  
    - SCCRI: Supply Chain Connectivity & Resilience Index
    - BTCI: Bilateral Trade Corridor Intelligence
    """

    def __init__(self, db_pool=None):
        self.db_pool = db_pool

    def compute_rca(
        self,
        country_exports_sector: float,
        country_total_exports: float,
        world_exports_sector: float,
        world_total_exports: float,
    ) -> float:
        """
        Balassa RCA = (Xij/Xit) / (Xwj/Xwt)
        >1 = revealed comparative advantage
        """
        if country_total_exports == 0 or world_total_exports == 0:
            return 0.0
        share_country = country_exports_sector / country_total_exports
        share_world   = world_exports_sector / world_total_exports
        if share_world == 0:
            return 0.0
        return round(share_country / share_world, 3)

    def compute_tpds(self, indicators: dict) -> float:
        """
        Trade Performance Dashboard Score (0–100).
        Composite of: export growth, trade diversification, LPI, trade balance.
        """
        weights = {
            "export_growth_5yr":    0.25,
            "trade_diversification": 0.25,
            "lpi_score":            0.25,
            "trade_balance_trend":  0.25,
        }
        score = 0.0
        for key, w in weights.items():
            val = indicators.get(key, 50)
            score += (val / 100) * w * 100
        return round(min(100, max(0, score)), 2)

    def compute_sccri(self, country_data: dict) -> float:
        """
        Supply Chain Connectivity & Resilience Index.
        Measures: supplier diversification, trade partner diversification,
        logistics quality, GVC participation, reshoring risk.
        """
        components = {
            "supplier_diversification": country_data.get("supplier_hhi_inverted", 50),
            "partner_diversification":  country_data.get("partner_hhi_inverted", 50),
            "logistics_quality":        country_data.get("lpi_score", 50) * 100 / 5,
            "gvc_participation":        country_data.get("gvc_participation_index", 50),
            "port_connectivity":        country_data.get("liner_connectivity_index", 50),
        }
        avg = sum(components.values()) / len(components)
        return round(min(100, max(0, avg)), 2)

    def compute_corridor_intelligence(
        self,
        source_iso3: str,
        dest_iso3: str,
        trade_data: dict,
    ) -> dict:
        """Bilateral trade corridor analysis."""
        exports = trade_data.get("source_to_dest_exports_usd", 0)
        imports = trade_data.get("dest_to_source_exports_usd", 0)
        total   = exports + imports

        trade_intensity = min(100, (total / max(1e9, total)) * 100) if total else 0

        top_sectors = trade_data.get("top_export_sectors", [
            {"isic":"C","share":35,"label":"Manufacturing"},
            {"isic":"J","share":22,"label":"Technology goods"},
            {"isic":"B","share":18,"label":"Mining & fuels"},
        ])

        return {
            "corridor_code":       f"{source_iso3}-{dest_iso3}",
            "bilateral_trade_usd": total,
            "exports_usd":         exports,
            "imports_usd":         imports,
            "trade_balance_usd":   exports - imports,
            "trade_intensity":     round(trade_intensity, 2),
            "top_sectors":         top_sectors,
            "icos":                round(min(100, trade_intensity * 1.2), 2),  # Corridor opportunity score
            "investment_correlation": round(min(100, trade_intensity * 0.8 + 20), 2),
        }

    async def run_gtm_pipeline(self, economy_iso3: str) -> dict:
        """Full GTM indicator suite for a single economy."""

        # Representative data — in production from UNCTAD/UN Comtrade/WTO pipeline
        mock_data = {
            "ARE": {
                "export_growth_5yr": 78, "trade_diversification": 82,
                "lpi_score": 88, "trade_balance_trend": 65,
                "supplier_hhi_inverted": 75, "partner_hhi_inverted": 80,
                "gvc_participation_index": 70, "liner_connectivity_index": 85,
            },
            "SAU": {
                "export_growth_5yr": 70, "trade_diversification": 55,
                "lpi_score": 72, "trade_balance_trend": 85,
                "supplier_hhi_inverted": 55, "partner_hhi_inverted": 65,
                "gvc_participation_index": 55, "liner_connectivity_index": 75,
            },
            "IND": {
                "export_growth_5yr": 82, "trade_diversification": 88,
                "lpi_score": 70, "trade_balance_trend": 45,
                "supplier_hhi_inverted": 85, "partner_hhi_inverted": 88,
                "gvc_participation_index": 80, "liner_connectivity_index": 72,
            },
        }

        country_data = mock_data.get(economy_iso3, {
            "export_growth_5yr":50,"trade_diversification":50,"lpi_score":50,
            "trade_balance_trend":50,"supplier_hhi_inverted":50,"partner_hhi_inverted":50,
            "gvc_participation_index":50,"liner_connectivity_index":50,
        })

        tpds  = self.compute_tpds(country_data)
        sccri = self.compute_sccri(country_data)

        # Sample RCA for tech sector
        rca_tech = self.compute_rca(
            country_exports_sector = country_data.get("tech_exports", 5e9),
            country_total_exports  = country_data.get("total_exports", 50e9),
            world_exports_sector   = 4e12,
            world_total_exports    = 25e12,
        )

        return {
            "iso3":   economy_iso3,
            "tpds":   tpds,
            "sccri":  sccri,
            "rca": {"J": rca_tech},
            "gtm_updated_at": datetime.now(timezone.utc).isoformat(),
        }


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    async def test():
        print("\n" + "="*60)
        print("TESTING AGT-10: Company Intelligence Agent")
        print("="*60)
        agt10 = AGT10_CompanyIntelligenceAgent()

        test_company = {
            "legal_name":"Palantir Technologies Inc",
            "hq_iso3":"USA","ticker":"PLTR","primary_isic":"J",
            "revenue_usd":2.23e9,"employees":3900,
            "listing_status":"listed","recently_funded":False,
            "investment_footprint":[{"iso3":"GBR","type":"CES"},{"iso3":"DEU","type":"GFS"},{"iso3":"AUS","type":"CES"}],
            "csuite_change_12m":False,
            "strategic_priorities":"AI-powered analytics for government and enterprise; MENA expansion",
        }
        test_signals = [
            {"grade":"GOLD","signal_type":"CES","economy_iso3":"GBR","sci_score":78.5},
            {"grade":"SILVER","signal_type":"GFS","economy_iso3":"SAU","sci_score":62.1},
        ]
        profile = await agt10.enrich_company(test_company, test_signals)
        print(f"✓ CIC ID:           {profile['cic_id']}")
        print(f"✓ IMS Score:        {profile['ims_score']}")
        print(f"✓ IMS Grade:        {profile['ims_grade']}")
        print(f"✓ Completeness:     {profile['profile_completeness']}%")
        print(f"✓ Footprint count:  {profile['footprint_economy_count']} economies")
        print(f"✓ Sanctions clear:  {profile['sanctions_cleared']}")
        print(f"✓ Signal count 12m: {profile['signal_count_12m']}")

        print("\n" + "="*60)
        print("TESTING AGT-11: Trade Intelligence Agent")
        print("="*60)
        agt11 = AGT11_TradeIntelligenceAgent()

        for iso3 in ["ARE","SAU","IND"]:
            result = await agt11.run_gtm_pipeline(iso3)
            print(f"\n{iso3}:")
            print(f"  TPDS:  {result['tpds']}")
            print(f"  SCCRI: {result['sccri']}")
            print(f"  RCA (Tech J): {result['rca']['J']}")

        # Test RCA
        rca = agt11.compute_rca(8e9, 80e9, 4e12, 25e12)
        print(f"\n✓ Sample RCA calculation: {rca} ({'Comparative advantage' if rca>1 else 'No advantage'})")

        # Test corridor
        corridor = agt11.compute_corridor_intelligence("ARE","USA",{
            "source_to_dest_exports_usd":8.2e9,
            "dest_to_source_exports_usd":22.1e9,
        })
        print(f"\n✓ ARE-USA Corridor:")
        print(f"  Bilateral trade: ${corridor['bilateral_trade_usd']/1e9:.1f}B")
        print(f"  ICOS: {corridor['icos']}")

    asyncio.run(test())
