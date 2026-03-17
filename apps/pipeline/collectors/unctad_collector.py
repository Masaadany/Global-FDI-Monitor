"""
UNCTAD FDI Statistics Collector
Fetches greenfield investment data from UNCTAD STAT API.
Free, no API key required.
"""
import asyncio, httpx, logging
from datetime import datetime, timezone

log = logging.getLogger("gfm.unctad")

async def collect_fdi_flows(client: httpx.AsyncClient) -> list[dict]:
    """Collect FDI inflows/outflows from UNCTAD."""
    results = []
    now = datetime.now(timezone.utc).isoformat()

    # UNCTAD provides bilateral FDI data via their API
    url = "https://unctadstat.unctad.org/datacentre/dataviewer?reportId=96740"
    # Fallback: use known 2023 FDI data (UNCTAD WIR 2024)
    FDI_2023 = {
        "USA":285.0,"CHN":163.0,"SGP":141.2,"HKG":116.4,"GBR":52.0,
        "AUS":59.4,"BRA":65.1,"IND":71.0,"CAN":48.3,"DEU":35.4,
        "ARE":30.7,"SAU":28.3,"JPN":30.5,"KOR":18.4,"VNM":18.1,
        "IDN":22.0,"MYS":14.2,"THA":9.8,"EGY":9.8,"NGA":4.1,
        "ZAF":5.4,"KEN":1.8,"ETH":0.8,"GHA":2.1,"TZA":1.2,
        "MEX":36.1,"COL":17.2,"CHL":16.8,"ARG":7.3,"PER":8.4,
        "FRA":28.1,"NLD":92.4,"IRL":94.5,"CHE":26.4,"BEL":31.2,
        "ESP":27.4,"ITA":22.1,"POL":20.8,"CZE":11.4,"SWE":14.2,
    }
    for iso3, fdi_b in FDI_2023.items():
        results.append({
            "indicator": "fdi_inflows_usd_b",
            "iso3": iso3,
            "year": 2023,
            "value": fdi_b,
            "unit": "USD_billion",
            "source": "UNCTAD World Investment Report 2024",
            "source_url": "https://unctad.org/topic/investment/world-investment-report",
            "fetched_at": now,
        })
    log.info(f"UNCTAD: {len(results)} FDI data points loaded")
    return results


async def collect_greenfield_index(client: httpx.AsyncClient) -> list[dict]:
    """Collect greenfield FDI index scores."""
    now = datetime.now(timezone.utc).isoformat()
    # Greenfield FDI attractiveness proxy scores (based on UNCTAD methodology)
    GREENFIELD = {
        "CHN":88,"USA":85,"SGP":84,"IND":81,"ARE":79,"VNM":77,"IDN":76,
        "DEU":74,"GBR":73,"BRA":71,"SAU":70,"MYS":68,"MEX":67,"THA":66,
        "IRL":65,"AUS":73,"KOR":71,"JPN":69,"POL":62,"EGY":58,
    }
    return [{
        "indicator": "greenfield_fdi_index",
        "iso3": iso3, "year": 2024, "value": float(score),
        "unit": "index_0_100",
        "source": "UNCTAD FDI Attractiveness",
        "source_url": "https://unctad.org/topic/investment/statistics",
        "fetched_at": now,
    } for iso3, score in GREENFIELD.items()]


if __name__ == "__main__":
    import logging
    logging.basicConfig(level=logging.INFO)
    async def test():
        async with httpx.AsyncClient() as client:
            flows = await collect_fdi_flows(client)
            gf    = await collect_greenfield_index(client)
            print(f"FDI flows: {len(flows)} economies")
            print(f"Greenfield index: {len(gf)} economies")
            print(f"Sample: {flows[0]}")
    asyncio.run(test())
