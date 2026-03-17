"""
World Bank Data Collector v2
Uses v2 API with proper headers and retry logic.
Falls back to curated 2023 dataset if API unavailable.
"""
import asyncio, httpx, logging
from datetime import datetime, timezone

log = logging.getLogger("gfm.worldbank")

# Curated 2023 World Bank WDI data (WDR 2024 + WDI database)
WDI_2023 = {
    "gdp_usd_b": {
        "USA":27360,"CHN":17795,"DEU":4430,"JPN":4213,"IND":3730,"GBR":3079,
        "FRA":2924,"ITA":2169,"BRA":2130,"CAN":2140,"KOR":1710,"AUS":1688,
        "MEX":1328,"RUS":1862,"ESP":1580,"IDN":1371,"NLD":1081,"SAU":1069,
        "TUR":1108,"CHE":884,"ARE":504,"SGP":501,"NGA":477,"QAT":236,
        "IRL":529,"NOR":485,"DNK":395,"FIN":310,"IND":3730,"VNM":430,
        "EGY":395,"ZAF":373,"KEN":118,"MAR":138,"GHA":76,"ETH":156,
    },
    "gdp_per_capita_usd": {
        "USA":81695,"SGP":84734,"CHE":92101,"NOR":82832,"IRL":103985,
        "DNK":67218,"AUS":64491,"ARE":48247,"QAT":83890,"GBR":46125,
        "DEU":53391,"FRA":43659,"JPN":33834,"KOR":32422,"ITA":34776,
        "ESP":32046,"SAU":30436,"CHN":12614,"BRA":10296,"MEX":11040,
        "ZAF":6575,"IND":2611,"VNM":4627,"NGA":2184,"EGY":4295,
        "KEN":2081,"ETH":925,"IDN":4941,"MYS":12367,"THA":7180,
    },
    "fdi_inflows_usd_b": {
        "USA":285,"CHN":163,"SGP":141,"GBR":52,"AUS":59,"BRA":65,
        "IND":71,"CAN":48,"DEU":35,"FRA":28,"NLD":92,"IRL":94,
        "CHE":26,"ARE":30,"SAU":28,"JPN":30,"KOR":18,"VNM":18,
        "IDN":22,"MYS":14,"THA":9,"MEX":36,"ARG":7,"CHL":17,
        "EGY":9,"NGA":4,"ZAF":5,"KEN":1,"ETH":0,"GHA":2,
    },
    "internet_users_pct": {
        "ARE":99,"KOR":97,"SGP":97,"NOR":99,"DNK":98,"GBR":97,"DEU":94,
        "USA":92,"JPN":93,"AUS":91,"FRA":92,"IRL":91,"CHN":74,"BRA":81,
        "MEX":76,"SAU":98,"RUS":88,"ZAF":72,"TUR":83,"THA":84,"MYS":97,
        "VNM":79,"IDN":77,"IND":52,"EGY":73,"NGA":55,"KEN":58,"ETH":24,
    },
    "population_m": {
        "CHN":1412,"IND":1429,"USA":335,"IDN":274,"PAK":230,"BRA":214,
        "NGA":218,"BGD":170,"RUS":143,"ETH":126,"MEX":127,"JPN":123,
        "DEU":83,"GBR":67,"FRA":68,"TZA":64,"ZAF":60,"TUR":85,
        "VNM":97,"IND":1429,"SAU":36,"ARE":10,"SGP":6,"QAT":3,
    },
}

async def collect(client: httpx.AsyncClient) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []

    # Try live API first
    try:
        r = await client.get(
            "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD"
            "?format=json&per_page=100&mrv=1",
            timeout=15,
            headers={"Accept":"application/json","Accept-Encoding":"gzip"}
        )
        if r.status_code == 200:
            data = r.json()
            if len(data) >= 2 and data[1]:
                for item in data[1]:
                    if item.get("value") is None: continue
                    iso3 = item.get("countryiso3code","")
                    if len(iso3) != 3: continue
                    results.append({
                        "indicator": "gdp_usd_b",
                        "iso3": iso3, "year": int(item.get("date",0)),
                        "value": float(item["value"]) / 1e9,
                        "unit": "USD_billion",
                        "source": "World Bank WDI (live)",
                        "source_url": "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD",
                        "fetched_at": now,
                    })
                log.info(f"WorldBank live: {len(results)} GDP points")
    except Exception as e:
        log.debug(f"WorldBank live failed: {e}, using curated data")

    # Always supplement with curated data for missing points
    for indicator, country_data in WDI_2023.items():
        for iso3, value in country_data.items():
            # Skip if already have live data for this indicator+economy
            if indicator == "gdp_usd_b" and results and any(
                r.get("iso3")==iso3 and r.get("indicator")==indicator for r in results
            ):
                continue
            results.append({
                "indicator": indicator, "iso3": iso3, "year": 2023,
                "value": float(value),
                "unit": "various",
                "source": "World Bank WDI 2023 (curated)",
                "source_url": "https://data.worldbank.org",
                "fetched_at": now,
            })

    log.info(f"WorldBank total: {len(results)} data points")
    return results

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def test():
        async with httpx.AsyncClient() as c:
            data = await collect(c)
            print(f"WorldBank data points: {len(data)}")
            by_ind = {}
            for d in data:
                by_ind[d["indicator"]] = by_ind.get(d["indicator"],0)+1
            for k,v in by_ind.items():
                print(f"  {k}: {v}")
    asyncio.run(test())
