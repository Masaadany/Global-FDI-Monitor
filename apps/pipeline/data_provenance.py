"""
GLOBAL FDI MONITOR — DATA PROVENANCE SYSTEM
Every data point carries: source URL, timestamp, reference code, and SHA-256 hash.
This powers the [Source] hyperlink shown next to every figure in reports and the dashboard.

Usage:
    dp = DataPoint(
        value=30.7e9,
        label="UAE FDI Inflows 2025",
        source_url="https://unctad.org/wir2025",
        source_name="UNCTAD World Investment Report 2025",
        data_date="2025-06-01",
    )
    html = dp.render_html()    # Inline HTML with [Source] superscript
    badge = dp.render_badge()  # For dashboard KPI tiles
"""
from __future__ import annotations
import hashlib, re, uuid
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Optional, Union


# ── DATA POINT ────────────────────────────────────────────────────────────────

@dataclass
class DataPoint:
    """
    A single verified data point with full provenance.
    Every figure displayed on the platform should be wrapped in DataPoint.
    """
    value:       Union[float, int, str]
    label:       str
    source_url:  str
    source_name: str
    data_date:   str                         # ISO date: YYYY-MM-DD
    unit:        str                  = ""   # e.g. "USD billion", "%", "index"
    notes:       str                  = ""
    ref_code:    str                  = field(default_factory=lambda: DataPoint._gen_ref())
    hash:        str                  = field(default="")
    created_at:  str                  = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def __post_init__(self):
        if not self.hash:
            self.hash = self._compute_hash()

    @staticmethod
    def _gen_ref() -> str:
        """GFM-DP-{YYYYMMDD}-{8 hex chars}"""
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        uid      = uuid.uuid4().hex[:8].upper()
        return f"GFM-DP-{date_str}-{uid}"

    def _compute_hash(self) -> str:
        """Tamper-evident hash of value + source + date."""
        content = f"{self.value}|{self.source_url}|{self.data_date}"
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def verify(self) -> bool:
        """Returns True if the data point has not been tampered with."""
        return self._compute_hash() == self.hash

    def format_value(self) -> str:
        """Human-readable value with unit."""
        if isinstance(self.value, float):
            if self.value >= 1e9:
                return f"${self.value/1e9:.1f}B"
            elif self.value >= 1e6:
                return f"${self.value/1e6:.1f}M"
            else:
                return f"{self.value:.2f}"
        return str(self.value)

    def render_html(self) -> str:
        """
        Inline HTML for use in reports and dashboard:
        [value] [Source] (timestamp)
        """
        formatted = self.format_value()
        safe_url  = self.source_url.replace('"', '%22')
        safe_name = self.source_name.replace('<', '&lt;').replace('>', '&gt;')
        return (
            f'<span class="data-verified" '
            f'data-ref="{self.ref_code}" '
            f'data-hash="{self.hash}" '
            f'data-verified="{"true" if self.verify() else "false"}">'
            f'{formatted}'
            f'<sup class="source-link">'
            f'<a href="{safe_url}" target="_blank" rel="noopener noreferrer" '
            f'title="{safe_name}">[Source]</a>'
            f'<span class="data-timestamp">{self.data_date}</span>'
            f'</sup>'
            f'</span>'
        )

    def render_badge(self) -> str:
        """Compact badge for dashboard KPI tiles."""
        formatted = self.format_value()
        return (
            f'<div class="kpi-tile" data-ref="{self.ref_code}">'
            f'<span class="kpi-value">{formatted}</span>'
            f'<span class="kpi-unit">{self.unit}</span>'
            f'<a class="kpi-source" href="{self.source_url}" target="_blank">'
            f'<span class="kpi-source-name">{self.source_name[:40]}</span>'
            f'<span class="kpi-date">{self.data_date}</span>'
            f'</a>'
            f'</div>'
        )

    def to_dict(self) -> dict:
        return {
            "value":       self.value,
            "label":       self.label,
            "source_url":  self.source_url,
            "source_name": self.source_name,
            "data_date":   self.data_date,
            "unit":        self.unit,
            "ref_code":    self.ref_code,
            "hash":        self.hash,
            "verified":    self.verify(),
            "created_at":  self.created_at,
        }


# ── SOURCE REGISTRY ───────────────────────────────────────────────────────────

class SourceRegistry:
    """
    Central registry of authoritative URLs for each data type.
    Agents use this to get the canonical source URL for any figure.
    """

    SOURCES: dict[str, dict] = {
        "IMF_WEO": {
            "name": "IMF World Economic Outlook",
            "base_url": "https://www.imf.org/en/Publications/WEO",
            "citation": "International Monetary Fund, World Economic Outlook",
            "tier": "T1",
        },
        "WORLDBANK_WDI": {
            "name": "World Bank World Development Indicators",
            "base_url": "https://data.worldbank.org/indicator",
            "citation": "World Bank, World Development Indicators",
            "tier": "T1",
        },
        "UNCTAD_WIR": {
            "name": "UNCTAD World Investment Report",
            "base_url": "https://unctad.org/topic/investment/world-investment-report",
            "citation": "UNCTAD, World Investment Report",
            "tier": "T1",
        },
        "UNCTAD_STAT": {
            "name": "UNCTAD Investment Statistics",
            "base_url": "https://unctad.org/topic/investment/statistics",
            "citation": "UNCTAD, Global Investment Trends Monitor",
            "tier": "T1",
        },
        "IEA": {
            "name": "International Energy Agency",
            "base_url": "https://www.iea.org/data-and-statistics",
            "citation": "International Energy Agency, World Energy Statistics",
            "tier": "T1",
        },
        "IRENA": {
            "name": "IRENA Renewable Energy Statistics",
            "base_url": "https://www.irena.org/Data",
            "citation": "IRENA, Renewable Energy Statistics",
            "tier": "T1",
        },
        "CDP": {
            "name": "CDP Climate Disclosure",
            "base_url": "https://www.cdp.net/en/scores",
            "citation": "CDP, Corporate Environmental Disclosure Scores",
            "tier": "T4",
        },
        "SBTI": {
            "name": "Science Based Targets Initiative",
            "base_url": "https://sciencebasedtargets.org/companies-taking-action",
            "citation": "Science Based Targets initiative (SBTi)",
            "tier": "T4",
        },
        "TI_CPI": {
            "name": "Transparency International CPI",
            "base_url": "https://www.transparency.org/en/cpi",
            "citation": "Transparency International, Corruption Perceptions Index",
            "tier": "T4",
        },
        "WEF_GCI": {
            "name": "WEF Global Competitiveness Index",
            "base_url": "https://www.weforum.org/reports",
            "citation": "World Economic Forum, Global Competitiveness Report",
            "tier": "T4",
        },
        "WB_LPI": {
            "name": "World Bank Logistics Performance Index",
            "base_url": "https://lpi.worldbank.org",
            "citation": "World Bank, Logistics Performance Index",
            "tier": "T1",
        },
        "ILO_STAT": {
            "name": "ILO Labour Statistics",
            "base_url": "https://ilostat.ilo.org",
            "citation": "International Labour Organization, ILOSTAT",
            "tier": "T1",
        },
        "UN_COMTRADE": {
            "name": "UN Comtrade Database",
            "base_url": "https://comtradeplus.un.org",
            "citation": "United Nations, Comtrade Database",
            "tier": "T1",
        },
        "GFM_COMPUTED": {
            "name": "GFM Proprietary Model",
            "base_url": "https://fdimonitor.org/methodology",
            "citation": "Global FDI Monitor, Proprietary Computation",
            "tier": "T0",  # Platform's own outputs
        },
    }

    @classmethod
    def get(cls, source_id: str) -> Optional[dict]:
        return cls.SOURCES.get(source_id)

    @classmethod
    def get_url(cls, source_id: str, iso3: str = "", year: int = 0) -> str:
        src = cls.SOURCES.get(source_id, {})
        url = src.get("base_url","https://fdimonitor.org")
        if iso3: url += f"/{iso3.lower()}" if not url.endswith("/") else f"{iso3.lower()}"
        return url

    @classmethod
    def wrap(
        cls,
        value: Union[float,int,str],
        label: str,
        source_id: str,
        data_date: str,
        unit: str = "",
    ) -> DataPoint:
        """Convenience: create a DataPoint using a registry source ID."""
        src = cls.SOURCES.get(source_id, cls.SOURCES["GFM_COMPUTED"])
        return DataPoint(
            value=value,
            label=label,
            source_url=src["base_url"],
            source_name=src["citation"],
            data_date=data_date,
            unit=unit,
        )


# ── PROVENANCE-AWARE ECONOMY STATS ───────────────────────────────────────────

@dataclass
class EconomyStats:
    """
    A bundle of verified data points for one economy.
    Everything displayed on the platform is sourced here.
    """
    iso3:   str
    year:   int
    points: dict[str, DataPoint] = field(default_factory=dict)

    def add(self, key: str, dp: DataPoint) -> None:
        self.points[key] = dp

    def get(self, key: str) -> Optional[DataPoint]:
        return self.points.get(key)

    def all_verified(self) -> bool:
        return all(dp.verify() for dp in self.points.values())

    def to_dict(self) -> dict:
        return {
            "iso3": self.iso3,
            "year": self.year,
            "all_verified": self.all_verified(),
            "points": {k: v.to_dict() for k, v in self.points.items()},
        }


# ── TESTS ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== DATA PROVENANCE SYSTEM TEST ===\n")

    # 1. Basic DataPoint
    dp = SourceRegistry.wrap(
        value=30.7e9,
        label="UAE FDI Inflows 2025",
        source_id="UNCTAD_WIR",
        data_date="2025-06-01",
        unit="USD",
    )
    print(f"✓ DataPoint created")
    print(f"  Value:     {dp.format_value()}")
    print(f"  Ref code:  {dp.ref_code}")
    print(f"  Hash:      {dp.hash}")
    print(f"  Verified:  {dp.verify()}")

    # 2. HTML rendering
    html = dp.render_html()
    assert 'class="data-verified"' in html
    assert 'data-verified="true"'  in html
    assert '[Source]'              in html
    print(f"\n✓ HTML render contains source attribution")

    # 3. Tamper detection
    dp.value = 999e9  # Tamper
    assert not dp.verify(), "Tampered value should fail verification"
    dp.value = 30.7e9 # Restore
    assert dp.verify(), "Restored value should pass verification"
    print(f"✓ Tamper detection working")

    # 4. Economy stats bundle
    stats = EconomyStats(iso3="ARE", year=2025)
    stats.add("fdi_inflows",  SourceRegistry.wrap(30.7e9, "UAE FDI Inflows", "UNCTAD_WIR",  "2025-06-01", "USD"))
    stats.add("gdp_growth",   SourceRegistry.wrap(3.4,    "UAE GDP Growth",  "IMF_WEO",     "2025-04-01", "%"))
    stats.add("labour_cost",  SourceRegistry.wrap(3200,   "UAE Avg Monthly Wage","ILO_STAT","2025-01-01", "USD/mo"))
    stats.add("lpi_score",    SourceRegistry.wrap(4.0,    "UAE LPI Score",   "WB_LPI",      "2025-01-01", "index"))

    print(f"\n✓ EconomyStats bundle")
    print(f"  Economy:    {stats.iso3}")
    print(f"  Year:       {stats.year}")
    print(f"  Data points:{len(stats.points)}")
    print(f"  All verified:{stats.all_verified()}")

    # 5. Source registry lookup
    unctad = SourceRegistry.get("UNCTAD_WIR")
    assert unctad is not None
    assert unctad["tier"] == "T1"
    print(f"\n✓ Source registry")
    print(f"  UNCTAD tier: {unctad['tier']}")
    print(f"  Citation:    {unctad['citation']}")

    print(f"\n{'='*40}")
    print(f"All tests passed ✓")
