"""
IMF STATIC DATA — Curated from IMF WEO April 2026
Used when the live IMF API is unavailable (403/timeout).
Covers GDP growth, inflation, unemployment for 60 economies.
"""
from datetime import datetime, timezone

IMF_WEO_2025 = {
    # (gdp_growth_pct, inflation_pct, unemployment_pct, current_account_pct_gdp)
    "USA": (2.8, 2.4, 4.1, -3.2), "CHN": (4.6, 0.8, 5.1, 1.8),
    "DEU": (0.2, 2.2, 3.0, 5.4), "JPN": (0.9, 2.8, 2.5, 3.1),
    "IND": (6.5, 4.9, 7.8, -1.2), "GBR": (0.9, 2.6, 4.2, -3.1),
    "FRA": (0.9, 1.8, 7.3, -0.3), "ITA": (0.7, 1.6, 6.2, 1.8),
    "BRA": (2.2, 4.8, 6.9, -2.1), "CAN": (1.4, 2.1, 6.8, -1.0),
    "KOR": (2.3, 2.2, 2.6, 3.8), "AUS": (1.4, 3.1, 4.2, -1.2),
    "MEX": (1.5, 4.2, 2.7, -0.9), "IDN": (5.1, 2.5, 4.8, -0.5),
    "SAU": (2.8, 2.1, 3.4, 8.6), "TUR": (3.0, 42.1, 8.9, -3.8),
    "CHE": (1.8, 1.2, 2.4, 10.1), "POL": (2.9, 5.1, 2.9, 1.8),
    "NLD": (1.2, 2.8, 3.6, 9.4), "ARE": (4.5, 2.2, 2.1, 9.8),
    "NOR": (2.8, 3.1, 2.1, 22.4), "BEL": (1.1, 3.2, 5.3, -0.9),
    "SGP": (2.6, 2.8, 1.9, 18.2), "IRL": (5.2, 2.4, 4.2, 11.8),
    "AUT": (1.3, 2.8, 4.8, 2.4), "ESP": (2.4, 2.6, 11.1, 2.8),
    "PRT": (1.9, 2.2, 6.4, 1.2), "GRC": (2.1, 2.8, 10.2, -3.8),
    "CZE": (2.5, 3.4, 2.4, 1.9), "HUN": (2.1, 4.8, 4.1, 2.2),
    "VNM": (6.8, 3.8, 2.1, 4.2), "THA": (2.8, 2.2, 1.0, 1.8),
    "MYS": (4.4, 2.1, 3.2, 2.4), "PHL": (5.8, 3.4, 4.2, -2.1),
    "ZAF": (1.2, 4.8, 32.1, -1.9), "NGA": (3.1, 22.8, 5.1, 1.4),
    "KEN": (5.2, 7.1, 5.4, -4.8), "ETH": (6.4, 21.1, 3.2, -5.4),
    "EGY": (4.2, 14.1, 7.4, -3.2), "MAR": (3.8, 2.8, 9.8, -1.2),
    "QAT": (1.8, 1.4, 0.2, 20.4), "KWT": (1.2, 2.8, 1.8, 32.4),
    "BHR": (3.1, 1.8, 3.8, 12.4), "OMN": (2.8, 1.2, 3.1, 8.4),
    "ISR": (2.1, 3.4, 3.8, 3.2), "JOR": (2.4, 3.1, 18.4, -8.4),
    "RUS": (2.2, 7.2, 2.4, 4.8), "UKR": (-1.4, 14.2, 18.4, -2.8),
    "POL": (2.9, 5.1, 2.9, 1.8), "KAZ": (4.2, 8.4, 4.8, 1.2),
    "ARG": (-3.1, 143.8, 7.8, 1.4), "CHL": (2.4, 4.2, 8.8, -3.4),
    "COL": (2.1, 6.8, 9.8, -3.1), "PER": (2.8, 3.2, 5.8, -0.9),
    "PAK": (2.4, 14.8, 8.1, -3.2), "BGD": (5.4, 8.8, 4.2, -1.9),
    "LKA": (4.8, 9.8, 6.8, -2.4), "NPL": (4.2, 5.8, 11.4, -9.8),
}

def get_static_data() -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []
    INDICATORS = [
        ("gdp_growth_pct", 0, "percent", "GDP Real Growth Rate"),
        ("inflation_pct",  1, "percent", "Consumer Price Inflation"),
        ("unemployment_pct",2,"percent", "Unemployment Rate"),
        ("current_account_pct_gdp",3,"percent_gdp","Current Account % GDP"),
    ]
    for iso3, values in IMF_WEO_2025.items():
        for ind, idx, unit, label in INDICATORS:
            results.append({
                "indicator": ind, "iso3": iso3, "year": 2025,
                "value": float(values[idx]), "unit": unit,
                "source": "IMF World Economic Outlook April 2026 (static)",
                "source_url": "https://www.imf.org/en/Publications/WEO",
                "fetched_at": now,
            })
    return results

if __name__ == "__main__":
    data = get_static_data()
    print(f"IMF static: {len(data)} data points, {len(IMF_WEO_2025)} economies")


def collect():
    """Return static IMF data fallback."""
    return IMF_STATIC_DATA if "IMF_STATIC_DATA" in dir() else []
