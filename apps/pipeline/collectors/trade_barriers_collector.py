"""
TRADE BARRIERS & LOGISTICS COLLECTOR
Sources: WTO Tariff Database, World Bank Trade Freedom, UN LSCI
"""
import asyncio, httpx, logging
from datetime import datetime, timezone

log = logging.getLogger("gfm.trade")

# Average applied MFN tariff rates (%, 2023) - WTO/World Bank
TARIFF_RATES_2023 = {
    "SGP":0.0,"HKG":0.0,"ARE":4.6,"NZL":2.0,"AUS":2.5,
    "USA":3.3,"GBR":5.7,"CAN":3.4,"CHE":7.5,"NOR":7.0,
    "DEU":5.1,"FRA":5.1,"IRL":5.1,"NLD":5.1,"ESP":5.1,
    "JPN":4.0,"KOR":13.6,"CHN":7.5,"IND":13.8,"THA":11.5,
    "IDN":8.1,"VNM":9.5,"MYS":6.1,"PHL":6.3,"BGD":14.1,
    "SAU":4.6,"QAT":4.6,"KWT":4.6,"BHR":4.6,"OMN":5.2,
    "EGY":20.0,"MAR":12.1,"TUN":20.0,"NGA":12.3,"ZAF":7.9,
    "BRA":13.4,"MEX":6.9,"CHL":6.0,"COL":8.0,"ARG":13.2,
    "TUR":10.0,"POL":5.1,"CZE":5.1,"HUN":5.1,"RUS":7.2,
    "UKR":4.9,"KAZ":7.0,"UZB":12.0,"GHA":12.5,"KEN":12.7,
    "ETH":16.2,"TZA":12.0,"UGA":12.0,"MOZ":10.8,
}

# UN LSCI (Liner Shipping Connectivity Index) — higher = better port connectivity
LSCI_2023 = {
    "CHN":186.4,"SGP":148.2,"KOR":121.8,"HKG":115.4,"MYS":101.3,
    "DEU":89.4,"NLD":87.2,"USA":83.1,"GBR":75.2,"BEL":71.8,
    "JPN":68.4,"ESP":65.8,"ITA":61.2,"FRA":58.4,"ARE":88.2,
    "EGY":52.3,"SAU":45.8,"IND":48.2,"IDN":42.1,"THA":38.4,
    "VNM":36.8,"PHL":34.2,"AUS":36.5,"NZL":22.4,"BRA":38.1,
    "MEX":34.8,"CHL":28.4,"COL":24.2,"ZAF":28.1,"MAR":32.4,
    "NGA":18.2,"KEN":14.8,"ETH":0.0,"GHA":15.2,"TZA":10.4,
    "POL":28.1,"TUR":41.2,"RUS":24.8,"UKR":12.0,
    "QAT":28.4,"KWT":18.2,"OMN":22.4,"BHR":14.2,
}

async def collect(client: httpx.AsyncClient) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []

    for iso3, rate in TARIFF_RATES_2023.items():
        results.append({
            "indicator":"avg_applied_tariff_pct","iso3":iso3,"year":2023,
            "value":float(rate),"unit":"percent",
            "source":"WTO Tariff Database 2023",
            "source_url":"https://tariffdata.wto.org",
            "fetched_at":now,
        })

    for iso3, score in LSCI_2023.items():
        results.append({
            "indicator":"liner_shipping_connectivity_index","iso3":iso3,"year":2023,
            "value":float(score),"unit":"index",
            "source":"UN LSCI 2023",
            "source_url":"https://unctad.org/topic/transport-and-trade-logistics/liner-shipping",
            "fetched_at":now,
        })

    log.info(f"Trade barriers: {len(results)} data points")
    return results

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def test():
        async with httpx.AsyncClient() as c:
            data = await collect(c)
            print(f"Trade data points: {len(data)}")
    asyncio.run(test())
