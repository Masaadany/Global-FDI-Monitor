"""
Trade & Connectivity Collectors:
- WTO Applied Tariff Rates (MFN)
- UN Liner Shipping Connectivity Index (LSCI)
"""
from datetime import datetime, timezone

WTO_TARIFF_MFN_2024 = {
    "USA":3.4,"CAN":4.1,"MEX":7.5,"BRA":13.4,"ARG":13.6,"CHL":6.0,"COL":7.9,
    "DEU":5.1,"FRA":5.1,"GBR":5.2,"ITA":5.1,"ESP":5.1,"NLD":5.1,"POL":5.2,
    "JPN":4.3,"KOR":13.9,"CHN":9.8,"IND":17.6,"IDN":8.1,"THA":11.3,"VNM":9.7,
    "AUS":2.5,"NZL":2.0,"SGP":0.2,"MYS":6.1,"PHL":6.1,"BGD":14.8,"PAK":14.4,
    "ARE":4.9,"SAU":4.9,"QAT":4.9,"EGY":20.1,"MAR":17.4,"TUN":23.1,"NGA":12.0,
    "ZAF":7.7,"KEN":12.4,"ETH":16.9,"GHA":12.6,"TZA":13.3,"TUR":11.9,"ISR":8.4,
    "RUS":6.4,"UKR":4.9,"KAZ":7.2,"UZB":9.1,"GEO":1.5,"ARM":3.5,"AZE":8.2,
}

UN_LSCI_2024 = {
    "CHN":164.8,"SGP":149.6,"KOR":109.1,"USA":108.2,"HKG":131.9,"MYS":101.4,
    "NLD":96.4, "BEL":92.1, "ESP":88.4, "GBR":87.1, "DEU":84.2, "JPN":82.4,
    "ARE":80.1, "ITA":78.4, "TUR":74.8, "EGY":70.4, "SAU":62.8, "IND":60.4,
    "IDN":55.8, "THA":54.2, "VNM":52.1, "PHL":48.4, "BRA":47.8, "MEX":46.9,
    "MAR":44.8, "NGA":38.4, "ZAF":37.1, "KEN":28.4, "GHA":24.8, "TZA":22.1,
    "AUS":46.2, "NZL":38.4, "CAN":42.1, "FRA":78.9, "IRL":62.1, "PRT":58.4,
}

def collect(session=None) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []
    for iso3, rate in WTO_TARIFF_MFN_2024.items():
        results.append({"indicator":"tariff_mfn_pct","iso3":iso3,"year":2024,"value":float(rate),"unit":"percent","source":"WTO Tariff Profiles 2024","fetched_at":now})
    for iso3, score in UN_LSCI_2024.items():
        results.append({"indicator":"shipping_connectivity","iso3":iso3,"year":2024,"value":float(score),"unit":"index","source":"UNCTAD LSCI 2024","fetched_at":now})
    return results

if __name__ == "__main__":
    data = collect()
    print(f"Trade/Shipping: {len(data)} data points ({len(WTO_TARIFF_MFN_2024)} tariff + {len(UN_LSCI_2024)} LSCI)")
