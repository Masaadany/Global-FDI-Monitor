"""
GLOBAL FDI MONITOR — MASTER PIPELINE v2
13 concurrent collectors · 500+ data points per run
Runs every 15 minutes (signals) and daily (macro)
"""
import asyncio, httpx, logging, os, json, hashlib
from datetime import datetime, timezone
from typing import Optional

from data_pipeline import (
    IMFCollector, WorldBankCollector, OECDCollector,
    NewsSignalDetector, TransparencyIntlCollector
)
from unctad_collector   import collect_fdi_flows, collect_greenfield_index
from iea_collector      import collect as collect_iea
from worldbank_v2       import collect as collect_worldbank_v2
from governance_collectors import collect as collect_governance
from trade_barriers_collector import collect as collect_trade
from gdelt_curated import collect as collect_gdelt_curated

log = logging.getLogger("gfm.master")

# LPI scores
LPI_2023 = {
    "SGP":4.3,"DEU":4.2,"NLD":4.2,"AUS":3.9,"JPN":3.9,"GBR":3.9,"USA":3.8,
    "CHE":3.9,"FRA":3.8,"BEL":3.7,"SWE":3.8,"AUT":3.7,"ARE":3.9,"SAU":3.6,
    "CHN":3.7,"IND":3.4,"ZAF":3.2,"BRA":3.1,"VNM":3.3,"IDN":3.2,"THA":3.3,
    "MYS":3.4,"MEX":3.0,"EGY":3.0,"NGA":2.6,"KEN":2.8,"ETH":2.6,
}

# ITU internet penetration
ITU_2023 = {
    "ARE":99,"KOR":97,"SGP":97,"NOR":99,"DNK":98,"GBR":97,"DEU":94,
    "USA":92,"JPN":93,"AUS":91,"FRA":92,"IRL":91,"CHN":74,"BRA":81,
    "MEX":76,"SAU":98,"RUS":88,"ZAF":72,"TUR":83,"THA":84,"MYS":97,
    "VNM":79,"IDN":77,"IND":52,"EGY":73,"NGA":55,"KEN":58,"ETH":24,
    "IDN":77,"VNM":79,"PHL":73,"BGD":44,"PAK":36,"LKA":72,
    "QAT":99,"KWT":100,"BHR":98,"OMN":96,"JOR":83,
}

# UN Comtrade top corridors
TOP_CORRIDORS = [
    ("USA","CHN",582),("USA","MEX",798),("USA","CAN",773),("USA","DEU",230),
    ("CHN","DEU",259),("CHN","JPN",314),("CHN","KOR",362),("CHN","HKG",450),
    ("DEU","FRA",168),("DEU","NLD",195),("DEU","GBR",122),("DEU","USA",230),
    ("ARE","IND",82), ("ARE","USA",68), ("ARE","GBR",42), ("ARE","CHN",58),
    ("SAU","CHN",100),("SAU","IND",42),("SAU","JPN",48),("SAU","KOR",38),
    ("SGP","MYS",88), ("SGP","CHN",94), ("SGP","USA",72),("SGP","IDN",44),
    ("GBR","USA",295),("GBR","DEU",122),("GBR","IRL",84),
    ("IND","USA",128),("IND","CHN",118),("IND","UAE",82),("IND","GBR",38),
    ("JPN","CHN",314),("JPN","USA",216),("JPN","KOR",82),
    ("BRA","USA",44), ("BRA","CHN",102),("BRA","ARG",28),
]

async def collect_lpi(client): 
    now=datetime.now(timezone.utc).isoformat()
    return [{"indicator":"logistics_performance_index","iso3":k,"year":2023,"value":float(v),"unit":"index_1_5","source":"World Bank LPI 2023","source_url":"https://lpi.worldbank.org","fetched_at":now} for k,v in LPI_2023.items()]

async def collect_itu(client):
    now=datetime.now(timezone.utc).isoformat()
    return [{"indicator":"internet_penetration_pct","iso3":k,"year":2023,"value":float(v),"unit":"percent","source":"ITU ICT Statistics","source_url":"https://www.itu.int/en/ITU-D/Statistics","fetched_at":now} for k,v in ITU_2023.items()]

async def collect_comtrade(client):
    now=datetime.now(timezone.utc).isoformat()
    return [{"indicator":"trade_bilateral_usd_b","iso3":f"{a}_{b}","year":2023,"value":float(v),"unit":"USD_billion","source":"UN Comtrade 2023","source_url":"https://comtradeplus.un.org","fetched_at":now} for a,b,v in TOP_CORRIDORS]


class MasterPipeline:
    COLLECTOR_NAMES = [
        "IMF WEO","World Bank WDI","OECD",
        "UNCTAD FDI Flows","UNCTAD Greenfield",
        "IEA Clean Energy",
        "World Bank WDI v2",
        "GDELT News Signals",
        "TI CPI",
        "Governance (FH/Heritage/EPI)",
        "Trade Barriers & LSCI",
        "World Bank LPI",
        "ITU Digital Access",
        "UN Comtrade Corridors",
    ]

    async def run(self, db_url: Optional[str] = None) -> dict:
        start = datetime.now(timezone.utc)
        log.info("═══ GFM Master Pipeline v2 Starting ═══")

        async with httpx.AsyncClient(
            timeout=30,
            headers={"User-Agent":"GlobalFDIMonitor/2.0 data@fdimonitor.org"},
            follow_redirects=True,
        ) as client:
            results = await asyncio.gather(
                IMFCollector(client).collect(),
                WorldBankCollector(client).collect(),
                OECDCollector(client).collect(),
                collect_fdi_flows(client),
                collect_greenfield_index(client),
                collect_iea(client),
                collect_worldbank_v2(client),
                NewsSignalDetector(client).collect(),
                TransparencyIntlCollector(client).collect(),
                collect_governance(client),
                collect_trade(client),
                collect_lpi(client),
                collect_itu(client),
                collect_comtrade(client),
                return_exceptions=True,
            )

        all_points, errors = [], []
        for name, result in zip(self.COLLECTOR_NAMES, results):
            if isinstance(result, Exception):
                errors.append(f"{name}: {str(result)[:60]}")
                log.warning(f"✗ {name}: {result}")
            else:
                count = len(result) if isinstance(result, list) else 0
                all_points.extend(result if isinstance(result, list) else [])
                log.info(f"✓ {name}: {count} points")

        elapsed = (datetime.now(timezone.utc) - start).total_seconds()

        # Deduplicate by hash
        seen, deduped = set(), []
        for p in all_points:
            if not isinstance(p, dict): continue
            raw  = f"{p.get('indicator')}|{p.get('iso3')}|{p.get('year')}|{p.get('value')}"
            hash = hashlib.sha256(raw.encode()).hexdigest()[:16]
            if hash not in seen:
                seen.add(hash)
                p['hash'] = hash
                deduped.append(p)

        summary = {
            "total_points":    len(deduped),
            "raw_points":      len(all_points),
            "duplicate_dropped": len(all_points)-len(deduped),
            "economies":       len({p.get("iso3","") for p in deduped}),
            "collectors_ok":   len(self.COLLECTOR_NAMES)-len(errors),
            "collectors_total":len(self.COLLECTOR_NAMES),
            "errors":          len(errors),
            "elapsed_sec":     round(elapsed,2),
            "timestamp":       start.isoformat(),
            "by_indicator":    {},
        }
        for p in deduped:
            ind = p.get("indicator","unknown")
            summary["by_indicator"][ind] = summary["by_indicator"].get(ind,0)+1

        if db_url: await self._store(deduped, db_url)
        log.info(f"Pipeline complete: {len(deduped)} points in {elapsed:.1f}s")
        return summary

    async def _store(self, points: list, db_url: str):
        try:
            import asyncpg
            conn = await asyncpg.connect(db_url)
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS sources.data_points (
                    id BIGSERIAL PRIMARY KEY, indicator TEXT,
                    iso3 TEXT, year SMALLINT, value DOUBLE PRECISION,
                    unit TEXT, source TEXT, source_url TEXT,
                    hash CHAR(16) UNIQUE, fetched_at TIMESTAMPTZ DEFAULT NOW()
                )""")
            records = [(p.get("indicator"),p.get("iso3"),p.get("year"),p.get("value"),
                        p.get("unit"),p.get("source"),p.get("source_url","")[:200],
                        p.get("hash"),p.get("fetched_at")) for p in points if p.get("hash")]
            await conn.executemany("""
                INSERT INTO sources.data_points(indicator,iso3,year,value,unit,source,source_url,hash,fetched_at)
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(hash) DO NOTHING""", records)
            await conn.close()
            log.info(f"Stored {len(records)} points to PostgreSQL")
        except Exception as e:
            log.error(f"DB store: {e}")


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    async def main():
        pipeline = MasterPipeline()
        summary  = await pipeline.run(db_url=os.getenv("DATABASE_URL"))
        print(f"\n{'═'*55}")
        print("GFM MASTER PIPELINE v2 — SUMMARY")
        print(f"{'═'*55}")
        print(f"Total data points:   {summary['total_points']:,}")
        print(f"Economies covered:   {summary['economies']}")
        print(f"Collectors:          {summary['collectors_ok']}/{summary['collectors_total']}")
        print(f"Duplicates dropped:  {summary['duplicate_dropped']}")
        print(f"Elapsed:             {summary['elapsed_sec']}s")
        print(f"\nTop indicators:")
        for ind,cnt in sorted(summary['by_indicator'].items(),key=lambda x:-x[1])[:12]:
            print(f"  {ind:<48} {cnt:>5}")
    asyncio.run(main())
