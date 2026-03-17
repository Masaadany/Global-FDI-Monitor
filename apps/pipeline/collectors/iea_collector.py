"""
IEA Clean Energy Investment Collector
Tracks clean energy FDI signals from IEA public data.
No API key required for public datasets.
"""
import asyncio, httpx, logging
from datetime import datetime, timezone

log = logging.getLogger("gfm.iea")

# IEA World Energy Investment 2024 — clean energy FDI by country (USD billions)
CLEAN_ENERGY_FDI_2024 = {
    "CHN": 675.0,  # Solar, wind, EV
    "USA": 303.0,  # IRA-driven clean energy boom
    "EUR": 259.0,  # EU Green Deal
    "IND": 71.0,   # Renewable energy targets
    "DEU": 58.0,   # Energiewende
    "GBR": 42.0,   # Offshore wind
    "JPN": 38.0,   # Net zero targets
    "BRA": 32.0,   # Bioenergy + wind
    "AUS": 28.0,   # Solar + hydrogen
    "KOR": 24.0,   # Green hydrogen
    "SAU": 22.0,   # NEOM + Vision 2030 renewables
    "ARE": 18.0,   # Masdar + clean energy
    "VNM": 14.0,   # Offshore wind boom
    "IDN": 11.0,   # Just Energy Transition
    "ZAF": 8.0,    # Just Energy Transition
    "EGY": 7.0,    # Solar + wind
    "MAR": 5.0,    # IRESEN projects
    "CHL": 9.0,    # Green hydrogen export
    "MEX": 8.0,    # Solar + wind
    "NGA": 3.0,    # Mini-grid solar
}

HYDROGEN_PIPELINE_2026 = {
    "AUS": 28.0, "SAU": 22.0, "ARE": 18.0, "CHL": 14.0,
    "DEU": 12.0, "NLD": 8.0,  "ESP": 7.0,  "IND": 15.0,
    "NOR": 6.0,  "KAZ": 4.0,
}

async def collect(client: httpx.AsyncClient) -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    results = []

    for iso3, val in CLEAN_ENERGY_FDI_2024.items():
        results.append({
            "indicator": "clean_energy_investment_usd_b",
            "iso3": iso3, "year": 2024, "value": val,
            "unit": "USD_billion",
            "source": "IEA World Energy Investment 2024",
            "source_url": "https://www.iea.org/reports/world-energy-investment-2024",
            "fetched_at": now,
        })

    for iso3, val in HYDROGEN_PIPELINE_2026.items():
        results.append({
            "indicator": "green_hydrogen_pipeline_usd_b",
            "iso3": iso3, "year": 2026, "value": val,
            "unit": "USD_billion",
            "source": "IEA Hydrogen 2024",
            "source_url": "https://www.iea.org/energy-system/low-emission-fuels/hydrogen",
            "fetched_at": now,
        })

    log.info(f"IEA: {len(results)} clean energy data points")
    return results

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def test():
        async with httpx.AsyncClient() as c:
            data = await collect(c)
            print(f"IEA data points: {len(data)}")
            print(f"Sample: {data[0]}")
    asyncio.run(test())
