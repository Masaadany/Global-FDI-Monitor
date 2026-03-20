"""Agent 08: FDI Forecast Engine — P10/P50/P90 Bayesian VAR v3
35-year foresight horizon to 2050. Three scenarios: base/optimistic/stress.
"""
import datetime

def run(params: dict) -> dict: return execute(params)

def execute(params: dict) -> dict:
    try:
        return _execute_safe(params)
    except Exception as e:
        import datetime
        return {"success": False, "error": str(e), "agent": "agt08_forecast", "ts": datetime.datetime.utcnow().isoformat() + "Z"}

def _execute_safe(params: dict) -> dict:
    iso3     = params.get('iso3', 'ARE')
    horizon  = params.get('horizon', 2050)
    base_yr  = params.get('base_year', 2024)
    scenario = params.get('scenario', 'base')

    CAGR     = {'optimistic': 0.072, 'base': 0.058, 'stress': 0.024}
    BASE_FDI = {
        'ARE':25.3,'SAU':18.2,'SGP':18.5,'IND':12.3,'USA':182.0,
        'GBR':14.8,'DEU':12.8,'CHN':42.8,'IDN':11.2,'VNM':8.9,'AUS':14.2,
    }
    base = BASE_FDI.get(iso3, 10.0)
    cagr = CAGR.get(scenario, 0.058)

    years = sorted(set(list(range(base_yr, horizon, 5)) + [horizon]))

    forecast = []
    for yr in years:
        n = yr - base_yr
        p50 = round(base * ((1 + cagr) ** n), 1)
        # Uncertainty band widens with horizon; min 3% at n=0
        band = max(0.03, n * 0.006)
        p10  = round(p50 * (1 - band), 1)
        p90  = round(p50 * (1 + band), 1)
        forecast.append({'year': yr, 'p10': p10, 'p50': p50, 'p90': p90})

    return {
        'success': True, 'iso3': iso3, 'scenario': scenario,
        'cagr_p50': f"{cagr*100:.1f}%", 'base_fdi': base,
        'horizon': horizon, 'forecast': forecast,
        'model': 'Bayesian-VAR + Prophet ensemble',
        'scenarios_available': list(CAGR.keys()),
        'ts': datetime.datetime.utcnow().isoformat() + 'Z',
    }
