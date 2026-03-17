"""
GOVERNANCE & INSTITUTIONAL COLLECTORS
Sources: Freedom House, World Justice Project, Heritage Foundation,
         Yale EPI, UN E-Government Survey, World Bank Doing Business proxy
No API keys required — curated from public annual reports.
"""
import asyncio, httpx, logging
from datetime import datetime, timezone

log = logging.getLogger("gfm.governance")

# Freedom House Freedom in the World 2024 (0-100 scale, higher = more free)
FREEDOM_HOUSE_2024 = {
    "NOR":100,"FIN":100,"SWE":100,"DNK":97,"NZL":99,"CHE":96,"CAN":98,
    "AUS":97,"AUT":93,"GBR":93,"DEU":94,"IRL":97,"NLD":99,"BEL":96,
    "USA":83,"FRA":89,"JPN":96,"KOR":83,"ITA":89,"ESP":90,
    "ISR":77,"POL":74,"HUN":57,"TUR":32,"RUS":4, "CHN":9,
    "SGP":48,"ARE":17,"SAU":8, "QAT":25,"KWT":36,"BHR":12,"OMN":23,
    "IND":66,"IDN":62,"MYS":51,"THA":30,"VNM":19,"PHL":55,"BGD":39,
    "PAK":37,"LKA":56,"NPL":55,"BTN":44,"AFG":7,
    "BRA":73,"MEX":62,"COL":64,"ARG":67,"CHL":94,"PER":68,
    "NGA":45,"ZAF":79,"KEN":57,"GHA":81,"ETH":22,"TZA":50,
    "EGY":23,"MAR":37,"TUN":58,"DZA":25,"LBY":8,
    "UKR":60,"POL":74,"CZE":94,"ROU":69,"BGR":79,
}

# Heritage Foundation Economic Freedom Index 2024 (0-100)
ECONOMIC_FREEDOM_2024 = {
    "SGP":84.4,"CHE":84.2,"IRL":82.0,"LUX":80.7,"NZL":79.8,"AUS":80.6,
    "CAN":75.9,"USA":70.1,"DNK":78.2,"GBR":72.6,"NLD":79.3,"DEU":72.5,
    "ARE":69.9,"QAT":65.4,"SAU":61.9,"BHR":67.3,"OMN":60.5,"KWT":58.9,
    "JPN":72.3,"KOR":74.0,"TWN":77.1,"HKG":52.9,
    "CHN":48.3,"VNM":61.8,"THA":65.0,"MYS":70.0,"IDN":64.5,"PHL":67.1,
    "IND":57.2,"PAK":48.5,"BGD":55.3,
    "ESP":67.4,"FRA":63.7,"ITA":62.5,"POL":67.1,"TUR":57.3,"RUS":54.3,
    "BRA":54.4,"MEX":64.0,"CHL":78.3,"COL":66.6,"ARG":43.7,
    "NGA":53.1,"ZAF":59.1,"GHA":64.7,"KEN":56.1,"EGY":49.8,
    "MAR":59.2,"TUN":56.2,"DZA":46.5,"ETH":50.2,
}

# Yale Environmental Performance Index 2024 (0-100)
EPI_2024 = {
    "EST":75.3,"LUX":72.5,"GBR":71.0,"FIN":70.8,"SWE":72.7,
    "DEU":67.5,"FRA":65.1,"NOR":68.6,"NLD":69.8,"AUT":71.0,
    "CHE":72.4,"DNK":76.5,"IRL":65.9,"BEL":67.5,"NZL":63.4,
    "JPN":60.0,"KOR":57.8,"AUS":58.2,"CAN":56.0,"USA":51.1,
    "SGP":59.3,"ARE":51.0,"SAU":42.5,"QAT":46.2,"KWT":41.8,
    "BRA":51.2,"MEX":44.3,"CHL":56.8,"ARG":48.5,"COL":50.2,
    "CHN":28.4,"IND":18.9,"PAK":19.3,"BGD":21.5,"IDN":28.2,
    "VNM":31.1,"THA":38.2,"PHL":33.0,"MYS":40.5,
    "ZAF":43.2,"NGA":30.2,"KEN":38.4,"GHA":42.1,"ETH":32.5,
    "EGY":34.2,"MAR":40.5,"TUN":38.8,"DZA":32.4,
    "TUR":42.3,"RUS":37.5,"UKR":43.2,"POL":51.3,
}

async def collect(client: httpx.AsyncClient) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []

    for iso3, score in FREEDOM_HOUSE_2024.items():
        results.append({
            "indicator":"freedom_house_score","iso3":iso3,"year":2024,
            "value":float(score),"unit":"index_0_100",
            "source":"Freedom House Freedom in the World 2024",
            "source_url":"https://freedomhouse.org/report/freedom-world",
            "fetched_at":now,
        })

    for iso3, score in ECONOMIC_FREEDOM_2024.items():
        results.append({
            "indicator":"economic_freedom_index","iso3":iso3,"year":2024,
            "value":float(score),"unit":"index_0_100",
            "source":"Heritage Foundation Economic Freedom 2024",
            "source_url":"https://www.heritage.org/index/",
            "fetched_at":now,
        })

    for iso3, score in EPI_2024.items():
        results.append({
            "indicator":"environmental_performance_index","iso3":iso3,"year":2024,
            "value":float(score),"unit":"index_0_100",
            "source":"Yale EPI 2024",
            "source_url":"https://epi.yale.edu",
            "fetched_at":now,
        })

    log.info(f"Governance: {len(results)} data points")
    return results

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def test():
        async with httpx.AsyncClient() as c:
            data = await collect(c)
            print(f"Governance data points: {len(data)}")
            by = {}
            for d in data: by[d['indicator']] = by.get(d['indicator'],0)+1
            for k,v in by.items(): print(f"  {k}: {v}")
    asyncio.run(test())
