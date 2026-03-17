"""GDELT Live Collector — fetches real-time events from GDELT API."""
import urllib.request, json, hashlib, datetime

GDELT_API = "https://api.gdeltproject.org/api/v2/doc/doc?query=FDI+investment&mode=ArtList&maxrecords=10&format=json"

FDI_KEYWORDS = ['investment','fdi','greenfield','factory','data centre','plant','expansion','acquisition']

def collect():
    """Fetch live GDELT events and filter for FDI signals."""
    try:
        with urllib.request.urlopen(GDELT_API, timeout=10) as r:
            data = json.loads(r.read())
        articles = data.get('articles', [])
        signals = []
        for art in articles:
            title = art.get('title','').lower()
            if any(kw in title for kw in FDI_KEYWORDS):
                url = art.get('url','')
                signals.append({
                    'source': 'GDELT Live',
                    'title':  art.get('title',''),
                    'url':    url,
                    'date':   art.get('seendate','')[:8],
                    'lang':   art.get('language','English'),
                    'country':art.get('sourcecountry',''),
                    'hash':   hashlib.sha256(url.encode()).hexdigest()[:16],
                })
        return signals[:5]
    except Exception as e:
        return []  # Silent fallback

if __name__ == "__main__":
    r = collect()
    print(f"GDELT Live: {len(r)} FDI signals")
    for s in r[:3]:
        print(f"  {s['title'][:80]}")
