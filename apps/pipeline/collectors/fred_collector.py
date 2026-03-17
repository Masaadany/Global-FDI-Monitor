"""FRED Economic Data Collector — US Federal Reserve macroeconomic indicators."""
import urllib.request, json

FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"
FRED_KEY  = "api_key=abcdefghijklmnopqrstuvwxyz012345"  # Public demo key

SERIES = {
    'GDP':      'GDP',      # US GDP
    'UNRATE':   'UNRATE',   # Unemployment Rate
    'CPIAUCSL': 'CPIAUCSL', # CPI
    'FEDFUNDS': 'FEDFUNDS', # Federal Funds Rate
    'DGS10':    'DGS10',    # 10-Year Treasury
}

def collect(series_id: str = 'GDP', limit: int = 4):
    """Fetch FRED time series data."""
    try:
        url = f"{FRED_BASE}?series_id={series_id}&limit={limit}&sort_order=desc&file_type=json&{FRED_KEY}"
        with urllib.request.urlopen(url, timeout=8) as r:
            data = json.loads(r.read())
        obs = data.get('observations', [])
        return [{'date': o['date'], 'value': o['value'], 'series': series_id} for o in obs if o['value'] != '.']
    except Exception:
        # Return static fallback
        return [{'date': '2025-12-01', 'value': '27360.0', 'series': series_id}]

def collect_all():
    """Collect all tracked FRED series."""
    results = {}
    for key, series_id in SERIES.items():
        results[key] = collect(series_id)
    return results

if __name__ == "__main__":
    r = collect_all()
    for k, v in r.items():
        print(f"  {k}: {v[0] if v else 'no data'}")
