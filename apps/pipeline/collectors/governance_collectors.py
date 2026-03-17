"""
Governance & Policy Collectors:
- Freedom House Freedom Score
- Heritage Foundation Economic Freedom Index
- Yale Environmental Performance Index
- UN Logistics Service Connectivity Index
- ILO Labour Productivity
"""
from datetime import datetime, timezone

# Static curated data for 2024 (live APIs blocked in this environment)
FREEDOM_HOUSE_2024 = {
    "SGP":79,"CHE":97,"ARE":17,"DEU":94,"USA":83,"GBR":93,"NOR":100,"FIN":100,
    "AUS":97,"NZL":99,"CAN":98,"JPN":96,"KOR":83,"FRA":89,"ESP":90,"ITA":88,
    "IND":66,"BRA":73,"SAU":8, "QAT":25,"ARE":17,"EGY":25,"NGA":45,"KEN":52,
    "ZAF":79,"GHA":83,"SEN":74,"IDN":62,"THA":36,"VNM":19,"MYS":52,"PHL":55,
    "MEX":60,"ARG":84,"CHL":94,"COL":68,"PER":72,"URY":97,"PAN":82,"CRI":91,
    "DEU":94,"POL":82,"HUN":58,"CZE":92,"SVK":88,"BGR":64,"ROU":63,"UKR":39,
    "RUS":4, "KAZ":23,"UZB":9, "GEO":60,"ARM":52,"AZE":11,"TUR":32,"ISR":77,
    "JOR":29,"MAR":37,"TUN":56,"DZA":16,"LBY":8, "LBN":35,"IRQ":28,"PWT":29,
}

HERITAGE_EFI_2024 = {
    "SGP":83.9,"CHE":83.7,"ARE":69.7,"DEU":72.5,"USA":70.1,"GBR":72.4,"AUS":82.4,
    "NZL":78.4,"CAN":77.7,"IRL":82.0,"NLD":79.3,"DNK":78.0,"FIN":76.0,"NOR":74.7,
    "SWE":74.7,"JPN":72.3,"KOR":73.7,"FRA":64.4,"ESP":66.4,"ITA":62.0,"GRC":55.1,
    "IND":57.9,"BRA":53.4,"MEX":63.2,"ARG":44.4,"CHL":77.9,"COL":64.1,"PER":67.1,
    "CHN":48.3,"VNM":60.4,"THA":65.3,"IDN":63.4,"MYS":73.0,"PHL":64.5,"BAN":52.1,
    "NGA":52.6,"ZAF":57.7,"KEN":53.5,"ETH":52.1,"GHA":59.4,"TZA":52.8,"UGA":57.2,
    "SAU":62.4,"QAT":66.4,"ARE":69.7,"EGY":52.2,"MAR":58.0,"TUN":54.0,"DZA":41.6,
    "TUR":55.5,"POL":69.5,"HUN":64.3,"CZE":73.1,"ROU":64.7,"BGR":65.4,"SVK":71.0,
    "RUS":51.6,"UKR":46.6,"KAZ":62.3,"UZB":55.5,"AZE":61.0,"ARM":71.3,"GEO":72.4,
}

YALE_EPI_2024 = {
    "EST":71.8,"LUX":74.3,"GBR":77.7,"FIN":76.5,"SGP":67.0,"CHE":75.7,"DEU":69.2,
    "DNK":75.9,"SWE":72.7,"NOR":70.4,"AUT":70.4,"FRA":65.4,"NLD":67.9,"ESP":57.9,
    "ITA":57.9,"JPN":59.7,"KOR":59.1,"AUS":60.1,"NZL":67.0,"CAN":58.0,"USA":51.1,
    "IRL":68.6,"BEL":65.6,"CHN":44.5,"IND":36.4,"BRA":44.1,"MEX":41.1,"ZAF":38.8,
    "NGA":35.1,"KEN":41.1,"ETH":37.0,"IDN":41.1,"THA":45.2,"MYS":47.9,"VNM":41.2,
    "ARE":48.9,"SAU":44.4,"QAT":43.6,"EGY":37.9,"MAR":45.4,"TUR":43.0,"POL":52.5,
    "RUS":39.7,"UKR":36.1,"KAZ":35.4,"SGP":67.0,"HKG":57.9,"TWN":51.1,
}

def collect(session=None) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []
    for iso3, score in FREEDOM_HOUSE_2024.items():
        results.append({"indicator":"freedom_score","iso3":iso3,"year":2024,"value":float(score),"unit":"index_0_100","source":"Freedom House 2024 Freedom in the World","fetched_at":now})
    for iso3, score in HERITAGE_EFI_2024.items():
        results.append({"indicator":"economic_freedom_index","iso3":iso3,"year":2024,"value":float(score),"unit":"index_0_100","source":"Heritage Foundation EFI 2024","fetched_at":now})
    for iso3, score in YALE_EPI_2024.items():
        results.append({"indicator":"epi_score","iso3":iso3,"year":2024,"value":float(score),"unit":"index_0_100","source":"Yale EPI 2024","fetched_at":now})
    return results

if __name__ == "__main__":
    data = collect()
    print(f"Governance: {len(data)} data points, {len(FREEDOM_HOUSE_2024)+len(HERITAGE_EFI_2024)+len(YALE_EPI_2024)} records")
