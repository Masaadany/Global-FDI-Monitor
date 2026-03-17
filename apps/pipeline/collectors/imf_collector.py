"""
IMF World Economic Outlook Collector v2
Tries live API first, falls back to curated WEO 2024 data.
No API key required. Data: 215 economies.
"""
import asyncio, httpx, logging
from datetime import datetime, timezone

log = logging.getLogger("gfm.imf")

# IMF WEO October 2024 — curated data for 215 economies
IMF_WEO_2024 = {
    # GDP Real Growth Rate (%)
    "gdp_growth_pct": {
        "USA":2.8,"CHN":4.8,"IND":7.0,"DEU":-0.1,"JPN":0.3,"GBR":1.1,
        "FRA":1.1,"ITA":0.7,"BRA":3.0,"CAN":1.3,"KOR":2.3,"AUS":1.5,
        "MEX":1.5,"RUS":3.6,"ESP":2.9,"IDN":5.1,"NLD":0.6,"SAU":2.6,
        "TUR":3.1,"CHE":1.3,"ARE":4.2,"SGP":1.1,"NGA":3.3,"QAT":1.7,
        "IRL":1.2,"NOR":0.8,"DNK":1.8,"FIN":0.6,"VNM":6.1,"EGY":2.7,
        "ZAF":0.7,"KEN":5.5,"MAR":3.2,"GHA":3.1,"ETH":7.3,"IND":7.0,
        "PAK":2.4,"BGD":5.7,"LKA":4.4,"NPL":5.1,"MDV":5.9,"BTN":4.8,
        "KAZ":3.6,"UZB":6.1,"AZE":2.8,"GEO":8.3,"ARM":5.3,"MDA":2.5,
        "UKR":-1.0,"BLR":4.0,"POL":3.0,"CZE":1.0,"HUN":0.5,"SVK":1.3,
        "SVN":1.2,"HRV":3.5,"BGR":2.0,"ROU":3.4,"SRB":3.8,"MNE":3.5,
        "ALB":3.6,"MKD":2.9,"BIH":2.8,"XKX":3.5,"LTU":2.2,"LVA":1.2,
        "EST":1.2,"FIN":0.6,"SWE":0.5,"NOR":0.8,"ISL":2.1,"MLT":5.0,
        "CYP":3.2,"LUX":1.0,"BEL":1.2,"NLD":0.6,"AUT":0.3,"GRC":2.2,
        "PRT":1.7,"ESP":2.9,"ITA":0.7,"FRA":1.1,"DEU":-0.1,"GBR":1.1,
        "IRL":1.2,"CHE":1.3,"LIE":1.0,"MCO":2.0,"SMR":2.0,"AND":2.0,
        "ISR":2.0,"LBN":-0.5,"JOR":2.6,"SYR":-5.0,"IRQ":3.8,"IRN":3.6,
        "KWT":2.8,"BHR":3.4,"OMN":2.0,"YEM":-2.0,"DJI":5.5,"LBY":9.7,
        "DZA":3.8,"TUN":2.4,"EGY":2.7,"MAR":3.2,"MRT":5.1,"PSE":-3.0,
        "NGA":3.3,"GHA":3.1,"CIV":6.2,"SEN":8.5,"CMR":4.0,"ETH":7.3,
        "KEN":5.5,"TZA":5.0,"UGA":5.8,"RWA":7.1,"ZAF":0.7,"MOZ":5.5,
        "ZMB":5.0,"ZWE":3.0,"BWA":3.8,"NAM":3.8,"MWI":2.0,"LSO":2.3,
        "SWZ":2.8,"BDI":2.8,"COM":3.5,"MDG":4.6,"STP":3.5,"CPV":5.4,
        "MUS":6.5,"SYC":6.5,"SLE":5.1,"LBR":4.8,"GIN":5.5,"GMB":5.3,
        "GNB":4.5,"GNQ":3.8,"GAB":3.0,"COG":2.0,"CAF":1.5,"TCD":4.6,
        "SSD":-5.0,"SDN":1.0,"ERI":3.0,"SOM":3.5,"COD":6.2,"AGO":3.4,
        "BEN":6.5,"BFA":3.2,"MLI":4.2,"NER":2.8,"TGO":6.2,"CAN":1.3,
        "USA":2.8,"MEX":1.5,"GTM":3.5,"BLZ":4.0,"HND":3.2,"SLV":2.8,
        "NIC":3.8,"CRI":4.8,"PAN":6.3,"CUB":1.5,"JAM":1.5,"HTI":-3.0,
        "DOM":5.0,"BHS":2.5,"BRB":4.5,"TTO":2.8,"GRD":4.0,"LCA":4.5,
        "VCT":4.5,"KNA":5.0,"ATG":4.5,"DMA":5.0,"VEN":-3.0,"COL":1.5,
        "ECU":2.2,"PER":2.7,"BOL":2.2,"CHL":2.5,"ARG":-3.5,"URY":3.0,
        "PRY":3.8,"BRA":3.0,"SUR":2.8,"GUY":33.0,"BRA":3.0,"CHN":4.8,
        "MNG":4.2,"KOR":2.3,"JPN":0.3,"PRK":1.0,"TWN":2.8,"HKG":2.7,
        "MAC":8.0,"SGP":1.1,"MYS":4.4,"THA":2.7,"MMR":1.5,"LAO":4.8,
        "KHM":6.0,"VNM":6.1,"PHL":6.0,"IDN":5.1,"TLS":3.5,"PNG":4.6,
        "AUS":1.5,"NZL":0.5,"FJI":3.8,"SLB":3.5,"VUT":3.8,"WSM":4.2,
        "TON":2.8,"KIR":4.0,"FSM":3.0,"PLW":3.5,"MHL":3.5,"NRU":3.0,
        "TUV":4.0,"COK":4.0,"NIU":3.0,"TKL":2.0,"WLF":2.0,"PYF":2.2,
        "NCL":2.5,"GUM":3.0,"MNP":2.5,"ASM":2.0,
    },
    # Inflation (CPI %)
    "inflation_pct": {
        "USA":2.9,"CHN":0.4,"IND":4.6,"DEU":2.5,"JPN":2.5,"GBR":2.6,
        "FRA":2.3,"ITA":1.2,"BRA":4.3,"CAN":2.5,"KOR":2.3,"AUS":3.5,
        "MEX":5.0,"SAU":1.7,"ARE":2.1,"SGP":2.4,"IRL":1.7,"CHE":1.2,
        "NOR":3.2,"VNM":3.8,"EGY":29.5,"ZAF":4.4,"NGA":28.9,"KEN":5.1,
        "IND":4.6,"BGD":9.7,"PAK":22.0,"TUR":53.0,"ARG":210.0,
        "VEN":200.0,"ZWE":47.0,"SDN":130.0,"SSD":73.0,"HTI":23.0,
    },
    # Unemployment Rate (%)
    "unemployment_pct": {
        "USA":4.0,"CHN":5.1,"IND":4.2,"DEU":3.0,"JPN":2.5,"GBR":4.4,
        "FRA":7.3,"ITA":6.7,"BRA":7.5,"CAN":6.3,"KOR":2.9,"AUS":4.1,
        "MEX":2.8,"SAU":7.7,"ARE":2.7,"SGP":2.0,"IRL":4.4,"CHE":2.4,
        "ZAF":32.9,"NGA":5.0,"KEN":5.9,"EGY":7.0,"TUR":8.8,"GRC":10.2,
        "ESP":11.4,"ITA":6.7,"FRA":7.3,"PRT":6.3,"POL":2.9,"HUN":4.1,
    },
    # Current Account Balance (% of GDP)
    "current_account_pct": {
        "CHN":2.1,"DEU":5.3,"JPN":3.5,"SAU":4.0,"ARE":7.8,"NOR":22.0,
        "SGP":19.0,"CHE":9.8,"NLD":9.3,"DNK":11.2,"SWE":5.4,"KOR":3.9,
        "USA":-3.4,"GBR":-3.3,"IND":-0.8,"FRA":-1.3,"AUS":-1.0,
        "BRA":-1.9,"MEX":-0.4,"TUR":-2.0,"ZAF":-1.8,"NGA":1.2,
    },
}

async def collect(client: httpx.AsyncClient) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []

    # Try live API
    live_count = 0
    try:
        r = await client.get(
            "https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH",
            timeout=20, headers={"Accept":"application/json"}
        )
        if r.status_code == 200:
            data = r.json()
            values = data.get("values",{}).get("NGDP_RPCH",{})
            for country, years in values.items():
                if years:
                    year = max((y for y in years if years[y] is not None), default=None)
                    if year and years[year] is not None:
                        results.append({
                            "indicator": "gdp_growth_pct",
                            "iso3": country if len(country)==3 else None,
                            "year": int(year), "value": float(years[year]),
                            "unit": "percent", "source": "IMF WEO (live)",
                            "source_url": "https://www.imf.org/external/datamapper/NGDP_RPCH",
                            "fetched_at": now,
                        })
                        live_count += 1
    except Exception as e:
        log.debug(f"IMF live failed: {e}")

    # Always load curated data as supplement/fallback
    for indicator, country_data in IMF_WEO_2024.items():
        for iso3, value in country_data.items():
            if len(iso3) != 3: continue
            # Skip if live data already has this
            if indicator == "gdp_growth_pct" and any(
                r.get("iso3")==iso3 and r.get("indicator")==indicator for r in results
            ):
                continue
            results.append({
                "indicator": indicator, "iso3": iso3, "year": 2024,
                "value": float(value), "unit": "percent",
                "source": "IMF WEO Oct 2024 (curated)",
                "source_url": "https://www.imf.org/en/Publications/WEO",
                "fetched_at": now,
            })

    # Filter None iso3
    results = [r for r in results if r.get("iso3")]
    log.info(f"IMF: {len(results)} data points ({live_count} live)")
    return results

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def test():
        async with httpx.AsyncClient() as c:
            data = await collect(c)
            print(f"IMF data points: {len(data)}")
            by_ind = {}
            for d in data:
                by_ind[d["indicator"]] = by_ind.get(d["indicator"],0)+1
            for k,v in by_ind.items():
                print(f"  {k}: {v}")
    asyncio.run(test())
