"""
IMF World Economic Outlook — Static Curated Dataset
Based on IMF WEO October 2024 + April 2025 projections.
Used as fallback when IMF API is rate-limited or blocked.
"""
from datetime import datetime, timezone

# GDP Growth Rate (%) — 2024 actual / 2025 projection
GDP_GROWTH_2024 = {
    "USA":2.8,"GBR":1.1,"DEU":-0.2,"FRA":1.1,"ITA":0.7,"ESP":3.2,
    "JPN":-0.1,"KOR":2.3,"AUS":1.5,"CAN":1.5,"CHE":1.3,"NLD":0.9,
    "BEL":1.2,"SWE":0.5,"NOR":0.9,"DNK":2.1,"FIN":0.1,"AUT":0.3,
    "IRL":2.2,"PRT":1.7,"GRC":2.3,"POL":2.9,"CZE":1.1,"HUN":-0.8,
    "ROU":2.5,"BGR":2.4,"HRV":3.1,"SVK":1.5,"SVN":1.2,"LTU":2.2,
    "LVA":0.4,"EST":-0.8,"CYP":3.1,"LUX":1.1,"MLT":5.2,"ISL":1.9,
    "CHN":4.8,"IND":7.0,"JPN":-0.1,"KOR":2.3,"SGP":2.1,"MYS":4.4,
    "THA":2.7,"IDN":5.0,"VNM":6.8,"PHL":6.3,"BGD":6.5,"PAK":2.4,
    "LKA":4.4,"NPL":4.4,"BTN":4.9,"MDV":5.8,"AFG":0.0,
    "SAU":1.7,"ARE":4.5,"QAT":2.2,"KWT":2.9,"BHR":3.4,"OMN":1.2,
    "JOR":2.7,"LBN":-0.5,"EGY":2.8,"IRN":3.3,"IRQ":0.7,"MAR":3.0,
    "TUN":0.5,"DZA":3.2,"LBY":8.0,
    "NGA":3.3,"ZAF":0.6,"KEN":5.0,"ETH":7.6,"GHA":4.7,"TZA":5.3,
    "UGA":5.5,"SEN":7.1,"CIV":6.8,"CMR":3.8,"AGO":3.0,"MOZ":5.1,
    "ZMB":4.7,"ZWE":2.5,"MUS":6.2,"BWA":1.0,"NAM":2.6,"RWA":7.6,
    "BRA":3.5,"MEX":1.5,"ARG":-1.8,"CHL":2.5,"COL":2.1,"PER":2.7,
    "VEN":4.0,"ECU":0.4,"BOL":1.8,"PRY":3.8,"URY":3.3,"CRI":4.5,
    "DOM":5.0,"JAM":2.1,"TTO":1.2,"PAN":2.3,"GTM":3.7,"HND":3.8,
    "SLV":3.0,"NIC":4.1,"CUB":1.0,"HTI":-2.0,"GUY":34.3,
    "RUS":3.6,"TUR":3.2,"UKR":-3.7,"POL":2.9,"KAZ":3.8,
    "UZB":6.5,"AZE":3.9,"GEO":7.5,"ARM":5.2,"TJK":8.0,"KGZ":4.2,
    "TKM":6.0,"BLR":4.2,"MDA":2.0,"MKD":2.0,"SRB":3.7,"ALB":3.4,
    "MNE":3.8,"BIH":2.4,"XKX":3.7,"ROU":2.5,"BGR":2.4,
}

# Inflation (CPI %) — 2024
INFLATION_2024 = {
    "USA":2.9,"GBR":2.6,"DEU":2.4,"FRA":2.3,"ITA":1.2,"ESP":2.9,
    "JPN":2.5,"KOR":2.4,"AUS":3.8,"CAN":2.6,"CHE":1.1,"NLD":2.7,
    "SGP":2.4,"MYS":1.8,"THA":0.4,"IDN":2.8,"VNM":3.8,"PHL":3.2,
    "IND":4.5,"CHN":0.2,"SAU":1.6,"ARE":2.3,"QAT":0.8,"EGY":33.0,
    "TUR":55.0,"NGA":30.0,"ZAF":4.6,"KEN":5.2,"GHA":23.0,
    "BRA":4.6,"MEX":5.5,"ARG":150.0,"CHL":3.8,"COL":5.8,"PER":2.8,
    "VEN":1200.0,"RUS":7.9,"KAZ":8.5,"UKR":9.4,
}

# Unemployment Rate (%) — 2024
UNEMPLOYMENT_2024 = {
    "USA":4.0,"GBR":4.2,"DEU":3.4,"FRA":7.3,"ITA":6.7,"ESP":11.4,
    "JPN":2.6,"KOR":2.8,"AUS":4.0,"CAN":6.3,"CHE":2.4,"NLD":3.7,
    "SGP":2.0,"MYS":3.4,"THA":1.1,"IDN":5.2,"VNM":2.3,"PHL":3.1,
    "IND":7.8,"CHN":5.1,"SAU":3.4,"ARE":2.7,"BRA":6.2,"MEX":2.7,
    "ARG":8.4,"CHL":8.9,"COL":9.8,"NGA":5.3,"ZAF":33.5,
    "RUS":2.4,"TUR":8.8,"KAZ":4.7,"POL":2.9,"HUN":4.1,
}

def collect() -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []
    
    datasets = [
        ("gdp_growth_pct", "%", "GDP Real Growth Rate", GDP_GROWTH_2024, 2024),
        ("inflation_pct", "%", "Consumer Price Inflation", INFLATION_2024, 2024),
        ("unemployment_pct", "%", "Unemployment Rate", UNEMPLOYMENT_2024, 2024),
    ]
    
    for indicator, unit, label, data, year in datasets:
        for iso3, value in data.items():
            results.append({
                "indicator": indicator,
                "iso3": iso3, "year": year,
                "value": float(value), "unit": unit,
                "source": "IMF World Economic Outlook (static)",
                "source_url": "https://www.imf.org/en/Publications/WEO",
                "fetched_at": now,
            })
    
    return results

if __name__ == "__main__":
    data = collect()
    print(f"IMF static: {len(data)} data points")
    by_ind = {}
    for d in data:
        by_ind[d["indicator"]] = by_ind.get(d["indicator"],0)+1
    for k,v in by_ind.items():
        print(f"  {k}: {v}")
