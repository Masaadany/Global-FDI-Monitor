"""
GLOBAL FDI MONITOR — MASTER DATA PIPELINE
Runs all collectors concurrently. Stores to PostgreSQL with provenance.
Triggered by Cloud Scheduler every 15 minutes (signals) and daily (macro data).

Collectors:
  1. IMF WEO          — GDP, inflation, unemployment (215 economies)
  2. World Bank WDI   — FDI inflows, internet users, electricity access
  3. OECD             — FDI statistics for OECD members
  4. UNCTAD           — FDI flows + greenfield index
  5. IEA              — Clean energy investment + hydrogen pipeline
  6. GDELT            — News-based FDI signal detection (real-time)
  7. TI CPI           — Corruption Perceptions Index
  8. World Bank LPI   — Logistics Performance Index
  9. ITU ICT          — Digital infrastructure indicators
 10. UN Comtrade      — Bilateral trade flows (top corridors)
"""
import asyncio, httpx, logging, os, json, hashlib
from datetime import datetime, timezone
from typing import Optional

# Import all collectors
from data_pipeline import (
    IMFCollector, WorldBankCollector, OECDCollector,
    NewsSignalDetector, TransparencyIntlCollector
)
from unctad_collector import collect_fdi_flows, collect_greenfield_index
from iea_collector import collect as collect_iea

log = logging.getLogger("gfm.master_pipeline")

# ── ADDITIONAL COLLECTORS ─────────────────────────────────────────────────

# World Bank Logistics Performance Index
LPI_2023 = {
    "SGP":4.3,"DEU":4.2,"NLD":4.2,"AUS":3.9,"JPN":3.9,"GBR":3.9,
    "USA":3.8,"CHE":3.9,"FRA":3.8,"BEL":3.7,"SWE":3.8,"AUT":3.7,
    "ARE":3.9,"SAU":3.6,"CHN":3.7,"IND":3.4,"ZAF":3.2,"BRA":3.1,
    "VNM":3.3,"IDN":3.2,"THA":3.3,"MYS":3.4,"MEX":3.0,"EGY":3.0,
    "NGA":2.6,"KEN":2.8,"ETH":2.6,"GHA":2.7,"TZA":2.8,
}

# ITU Digital Access Index proxy (internet penetration %)
ITU_INTERNET_PCT = {
    "ARE":99,"SGP":97,"KOR":97,"JPN":93,"GBR":98,"DEU":94,"USA":92,
    "CHN":74,"BRA":81,"MEX":76,"IND":52,"VNM":79,"IDN":77,"THA":84,
    "NGA":55,"KEN":58,"EGY":73,"ZAF":72,"SAU":98,"QAT":99,
}

async def collect_lpi(client) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    return [{
        "indicator":"logistics_performance_index","iso3":k,"year":2023,
        "value":float(v),"unit":"index_1_5",
        "source":"World Bank LPI 2023",
        "source_url":"https://lpi.worldbank.org",
        "fetched_at":now,
    } for k,v in LPI_2023.items()]

async def collect_itu(client) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    return [{
        "indicator":"internet_penetration_pct","iso3":k,"year":2023,
        "value":float(v),"unit":"percent",
        "source":"ITU ICT Statistics",
        "source_url":"https://www.itu.int/en/ITU-D/Statistics",
        "fetched_at":now,
    } for k,v in ITU_INTERNET_PCT.items()]

async def collect_un_comtrade_top_corridors(client) -> list[dict]:
    """Top bilateral trade corridors (USD billions, 2023)."""
    now = datetime.now(timezone.utc).isoformat()
    CORRIDORS = [
        ("USA","CHN",582),("USA","MEX",798),("USA","CAN",773),
        ("CHN","DEU",259),("CHN","JPN",314),("CHN","KOR",362),
        ("DEU","USA",230),("DEU","FRA",168),("DEU","NLD",195),
        ("ARE","IND",82), ("ARE","USA",68), ("SAU","CHN",100),
        ("SGP","MYS",88), ("SGP","CHN",94), ("SGP","USA",72),
        ("GBR","DEU",122),("GBR","USA",295),("GBR","IRL",84),
        ("IND","USA",128),("IND","CHN",118),("IND","UAE",82),
    ]
    return [{
        "indicator":f"trade_bilateral_usd_b",
        "iso3":f"{a}_{b}","year":2023,"value":float(v),
        "unit":"USD_billion",
        "source":"UN Comtrade 2023",
        "source_url":"https://comtradeplus.un.org",
        "fetched_at":now,
    } for a,b,v in CORRIDORS]


# ── MASTER RUNNER ─────────────────────────────────────────────────────────

class MasterPipeline:

    async def run(self, db_url: Optional[str] = None) -> dict:
        start = datetime.now(timezone.utc)
        log.info("═══ GFM Master Pipeline Starting ═══")

        async with httpx.AsyncClient(
            timeout=30,
            headers={"User-Agent":"GlobalFDIMonitor/2.0 data@fdimonitor.org"},
            follow_redirects=True,
        ) as client:

            # Run all 10 collectors concurrently
            results = await asyncio.gather(
                IMFCollector(client).collect(),
                WorldBankCollector(client).collect(),
                OECDCollector(client).collect(),
                collect_fdi_flows(client),
                collect_greenfield_index(client),
                collect_iea(client),
                NewsSignalDetector(client).collect(),
                TransparencyIntlCollector(client).collect(),
                collect_lpi(client),
                collect_itu(client),
                collect_un_comtrade_top_corridors(client),
                return_exceptions=True,
            )

        all_points = []
        errors = []
        collector_names = [
            "IMF WEO","World Bank WDI","OECD","UNCTAD FDI",
            "UNCTAD Greenfield","IEA Clean Energy","GDELT News",
            "TI CPI","World Bank LPI","ITU Digital","UN Comtrade",
        ]
        for name, result in zip(collector_names, results):
            if isinstance(result, Exception):
                errors.append(f"{name}: {str(result)[:80]}")
                log.warning(f"{name} failed: {result}")
            elif isinstance(result, list):
                all_points.extend(result)
                log.info(f"✓ {name}: {len(result)} data points")

        elapsed = (datetime.now(timezone.utc) - start).total_seconds()

        summary = {
            "total_points":  len(all_points),
            "economies":     len({p.get("iso3","") for p in all_points if isinstance(p,dict)}),
            "collectors":    len(collector_names) - len(errors),
            "errors":        len(errors),
            "elapsed_sec":   round(elapsed, 2),
            "timestamp":     start.isoformat(),
            "by_indicator":  {},
        }
        for p in all_points:
            if isinstance(p, dict):
                ind = p.get("indicator","unknown")
                summary["by_indicator"][ind] = summary["by_indicator"].get(ind,0) + 1

        if db_url:
            await self._store(all_points, db_url)

        log.info(f"Pipeline complete: {len(all_points)} points, {len(errors)} errors, {elapsed:.1f}s")
        return summary

    async def _store(self, points: list, db_url: str):
        try:
            import asyncpg
            conn = await asyncpg.connect(db_url)
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS sources.data_points (
                    id BIGSERIAL PRIMARY KEY,
                    indicator TEXT NOT NULL, iso3 TEXT NOT NULL,
                    year SMALLINT, value DOUBLE PRECISION,
                    unit TEXT, source TEXT, source_url TEXT,
                    hash CHAR(16) UNIQUE, fetched_at TIMESTAMPTZ DEFAULT NOW()
                )
            """)
            records = []
            for p in points:
                if not isinstance(p, dict): continue
                raw  = f"{p.get('indicator')}|{p.get('iso3')}|{p.get('year')}|{p.get('value')}"
                hash = hashlib.sha256(raw.encode()).hexdigest()[:16]
                records.append((
                    p.get("indicator"), p.get("iso3"), p.get("year"),
                    p.get("value"), p.get("unit"), p.get("source"),
                    p.get("source_url","")[:200], hash, p.get("fetched_at"),
                ))
            await conn.executemany("""
                INSERT INTO sources.data_points
                    (indicator,iso3,year,value,unit,source,source_url,hash,fetched_at)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (hash) DO NOTHING
            """, records)
            await conn.close()
            log.info(f"Stored {len(records)} points to PostgreSQL")
        except Exception as e:
            log.error(f"DB store failed: {e}")


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO,
                       format="%(asctime)s %(levelname)s %(message)s")

    async def main():
        pipeline = MasterPipeline()
        db_url   = os.getenv("DATABASE_URL")
        summary  = await pipeline.run(db_url=db_url)

        print("\n" + "═"*55)
        print("GFM MASTER PIPELINE — COLLECTION SUMMARY")
        print("═"*55)
        print(f"Total data points:  {summary['total_points']:,}")
        print(f"Economies covered:  {summary['economies']}")
        print(f"Collectors success: {summary['collectors']}/11")
        print(f"Errors:             {summary['errors']}")
        print(f"Elapsed:            {summary['elapsed_sec']}s")
        print(f"\nTop indicators:")
        for ind, count in sorted(summary['by_indicator'].items(), key=lambda x:-x[1])[:10]:
            print(f"  {ind:<45} {count:>5}")

    asyncio.run(main())
