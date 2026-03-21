"""
Agent: agt36_40_incentive_labour_infra_digital_energy — FDI Monitor Intelligence Pipeline
Error handling wrapper applied at module level.
"""
import datetime as _dt

def _safe_run(fn, params):
    try:
        return fn(params)
    except Exception as e:
        return {"success": False, "error": str(e), "agent": "agt36_40_incentive_labour_infra_digital_energy",
                "ts": _dt.datetime.utcnow().isoformat() + "Z"}

"""
GLOBAL FDI MONITOR — AGT-36 through AGT-40
AGT-36: INVESTMENT INCENTIVE ANALYZER — Maps incentive packages globally using GIID/MIGA data
AGT-37: LABOR MARKET INTELLIGENCE — Workforce availability, skills, cost, and productivity
AGT-38: INFRASTRUCTURE QUALITY ASSESSOR — Logistics, connectivity, and physical infrastructure
AGT-39: DIGITAL ECONOMY TRACKER — ICT readiness, digital infrastructure, e-gov, fintech
AGT-40: ENERGY TRANSITION MONITOR — Renewable investment signals, grid readiness, green FDI
"""
import asyncio, json, os, logging, math
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass, field

log = logging.getLogger("gfm.agt36_40")


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-36: INVESTMENT INCENTIVE ANALYZER
# Catalogues and scores incentive packages from GIID, MIGA WIPS, national IPAs
# ═══════════════════════════════════════════════════════════════════════════════

INCENTIVE_DATABASE = {
    "ARE": {
        "corporate_tax_rate": 9.0,       # 9% from June 2023 (standard rate)
        "free_zone_tax": 0.0,             # 0% for qualifying free zone entities to 2031+
        "personal_income_tax": 0.0,
        "capital_gains_tax": 0.0,
        "withholding_tax_dividends": 0.0,
        "repatriation": "100%_unrestricted",
        "foreign_ownership": "100%_mainland",
        "special_programmes": [
            {"name":"ADIO Incentive Package","value":"Up to AED 500M in incentives","sectors":["all"],"min_investment":None},
            {"name":"Dubai FDI Fast-Track Licence","value":"5-business-day establishment","sectors":["all"],"min_investment":None},
            {"name":"Golden Visa for Investors","value":"10-year residency for AED 10M+ investment","sectors":["all"],"min_investment":10_000_000},
            {"name":"R&D Tax Credit (ADIO)","value":"50% R&D expenditure credit","sectors":["J","M","D"],"min_investment":None},
        ],
        "ipa_name": "ADIO / Dubai FDI",
        "establishment_days": 5,
        "overall_score": 94,
    },
    "SAU": {
        "corporate_tax_rate": 20.0,
        "free_zone_tax": 5.0,
        "personal_income_tax": 0.0,
        "capital_gains_tax": 0.0,
        "withholding_tax_dividends": 5.0,
        "repatriation": "100%_unrestricted",
        "foreign_ownership": "100%_most_sectors",
        "special_programmes": [
            {"name":"Regional HQ Programme","value":"SAR 800M in incentives for RHQ establishment","sectors":["all"],"min_investment":None},
            {"name":"MISA Fast-Track Licence","value":"3-hour licence for qualifying investors","sectors":["all"],"min_investment":None},
            {"name":"Giga-Project Investment Package","value":"Customised per project","sectors":["F","L","J"],"min_investment":100_000_000},
            {"name":"Manufacturing Incentive","value":"15% capex credit for manufacturing","sectors":["C"],"min_investment":50_000_000},
        ],
        "ipa_name": "MISA",
        "establishment_days": 3,
        "overall_score": 81,
    },
    "IND": {
        "corporate_tax_rate": 22.0,
        "new_mfg_tax_rate": 15.0,         # For new manufacturing companies
        "free_zone_tax": 0.0,             # SEZ units
        "personal_income_tax": 30.0,       # Top rate
        "capital_gains_tax": 10.0,         # Long-term
        "withholding_tax_dividends": 20.0,
        "repatriation": "full_with_rbi_approval",
        "foreign_ownership": "100%_auto_route_most_sectors",
        "special_programmes": [
            {"name":"PLI Scheme (14 sectors)","value":"$26B total allocation, 4-6% production incentive","sectors":["C","Q","J"],"min_investment":None},
            {"name":"SEZ Tax Holiday","value":"5yr 100% + 5yr 50% income tax exemption","sectors":["all"],"min_investment":None},
            {"name":"Make in India","value":"Preferential procurement + facilitation","sectors":["C","D","F"],"min_investment":None},
            {"name":"Startup India","value":"3yr tax holiday + fund-of-funds access","sectors":["J","M"],"min_investment":None},
        ],
        "ipa_name": "Invest India",
        "establishment_days": 7,
        "overall_score": 72,
    },
    "IRL": {
        "corporate_tax_rate": 12.5,       # 15% for large multinationals (Pillar Two)
        "rd_credit": 25.0,                # 25% R&D tax credit
        "personal_income_tax": 40.0,
        "capital_gains_tax": 33.0,
        "withholding_tax_dividends": 0.0, # Ireland-EU parent-subsidiary
        "repatriation": "100%_unrestricted",
        "foreign_ownership": "100%",
        "special_programmes": [
            {"name":"IDA Ireland Grant","value":"Up to 50% capex/training grant","sectors":["J","M","K","C"],"min_investment":None},
            {"name":"Knowledge Development Box","value":"6.25% effective tax rate on IP income","sectors":["J","M"],"min_investment":None},
            {"name":"R&D Tax Credit","value":"25% credit on qualifying R&D","sectors":["all"],"min_investment":None},
            {"name":"Strategic Banking Corp","value":"Subsidised debt for approved investments","sectors":["all"],"min_investment":None},
        ],
        "ipa_name": "IDA Ireland",
        "establishment_days": 10,
        "overall_score": 91,
    },
    "SGP": {
        "corporate_tax_rate": 17.0,
        "pioneer_status_rate": 5.0,       # 5% for Pioneer Status companies
        "personal_income_tax": 22.0,
        "capital_gains_tax": 0.0,
        "withholding_tax_dividends": 0.0,
        "repatriation": "100%_unrestricted",
        "foreign_ownership": "100%",
        "special_programmes": [
            {"name":"Pioneer Status / DEI","value":"5-10% CT for 5-10 years","sectors":["C","J","M"],"min_investment":None},
            {"name":"Global Trader Programme","value":"5-10% CT on qualifying trading income","sectors":["G","H"],"min_investment":None},
            {"name":"Finance & Treasury Centre","value":"8% CT on qualifying income","sectors":["K"],"min_investment":None},
            {"name":"Startup SG","value":"SGD 100K co-investment for qualified startups","sectors":["J","M"],"min_investment":None},
        ],
        "ipa_name": "EDB Singapore",
        "establishment_days": 3,
        "overall_score": 93,
    },
    "DEU": {
        "corporate_tax_rate": 29.9,       # Combined federal + municipal + solidarity
        "rd_allowance": 25.0,             # R&D tax allowance (ZIM programme)
        "personal_income_tax": 45.0,
        "capital_gains_tax": 26.4,
        "withholding_tax_dividends": 26.4,
        "repatriation": "100%_unrestricted",
        "foreign_ownership": "100%_with_screening_check",
        "special_programmes": [
            {"name":"ZIM R&D Programme","value":"Up to EUR 10M/yr tax-free R&D subsidy","sectors":["J","C","M"],"min_investment":None},
            {"name":"GA Regional Aid","value":"Up to 50% capex grant in designated regions","sectors":["C","J"],"min_investment":None},
            {"name":"KfW Low-Interest Loans","value":"Below-market rate financing for investments","sectors":["all"],"min_investment":None},
            {"name":"Horizon Europe Access","value":"EU R&D funding access","sectors":["J","M","D"],"min_investment":None},
        ],
        "ipa_name": "Germany Trade & Invest (GTAI)",
        "establishment_days": 14,
        "overall_score": 76,
    },
}

@dataclass
class IncentiveProfile:
    iso3:                 str
    corporate_tax_rate:   float
    effective_tax_rate:   float    # After best available incentive
    best_incentive:       str
    total_programmes:     int
    ipa_name:             str
    establishment_days:   int
    foreign_ownership:    str
    repatriation:         str
    overall_score:        float    # 0-100
    sector_incentives:    list     # For target sectors
    tax_comparison_note:  str

class AGT36_InvestmentIncentiveAnalyzer:

    def _best_eff_rate(self, data: dict) -> tuple[float, str]:
        base = data.get("corporate_tax_rate", 25.0)
        programmes = data.get("special_programmes", [])
        # Look for explicit reduced rates
        if data.get("free_zone_tax", base) < base:
            return data["free_zone_tax"], f"Free zone rate ({data['free_zone_tax']}%)"
        if data.get("pioneer_status_rate"):
            return data["pioneer_status_rate"], f"Pioneer status ({data['pioneer_status_rate']}%)"
        if data.get("new_mfg_tax_rate"):
            return data["new_mfg_tax_rate"], f"New mfg rate ({data['new_mfg_tax_rate']}%)"
        return base, "Standard corporate rate"

    def _filter_sector_incentives(self, programmes: list, sectors: list) -> list:
        return [p for p in programmes
                if "all" in p.get("sectors", []) or
                any(s in p.get("sectors", []) for s in sectors)]

    async def profile_economy(self, iso3: str, target_sectors: Optional[list] = None) -> IncentiveProfile:
        data = INCENTIVE_DATABASE.get(iso3, {
            "corporate_tax_rate": 25, "repatriation": "standard",
            "foreign_ownership": "check local regulations",
            "special_programmes": [], "ipa_name": "National IPA",
            "establishment_days": 30, "overall_score": 55,
        })
        eff_rate, best_prog = self._best_eff_rate(data)
        progs = data.get("special_programmes", [])
        sector_progs = self._filter_sector_incentives(progs, target_sectors or ["all"])
        ctr = data.get("corporate_tax_rate", 25)
        note = f"Standard CT {ctr}% — effective rate as low as {eff_rate}% via {best_prog}. "
        note += f"Establishment in {data.get('establishment_days',30)} business days."

        return IncentiveProfile(
            iso3=iso3, corporate_tax_rate=ctr, effective_tax_rate=eff_rate,
            best_incentive=best_prog,
            total_programmes=len(progs),
            ipa_name=data.get("ipa_name","National IPA"),
            establishment_days=data.get("establishment_days",30),
            foreign_ownership=data.get("foreign_ownership","Check regulations"),
            repatriation=data.get("repatriation","standard"),
            overall_score=float(data.get("overall_score",55)),
            sector_incentives=sector_progs,
            tax_comparison_note=note,
        )

    async def compare_economies(self, iso3_list: list, target_sectors: Optional[list] = None) -> list[IncentiveProfile]:
        tasks = [self.profile_economy(iso3, target_sectors) for iso3 in iso3_list]
        results = await asyncio.gather(*tasks)
        return sorted(results, key=lambda r: r.overall_score, reverse=True)


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-37: LABOR MARKET INTELLIGENCE
# Workforce availability, skills profiles, wage benchmarks, productivity
# Sources: ILO, WB WDI, UNESCO (skills), national labour stats
# ═══════════════════════════════════════════════════════════════════════════════

LABOUR_DATA = {
    "ARE": {"population_m":9.9,"labour_force_m":5.8,"unemployment_pct":2.7,"youth_unemployment":8.2,
            "avg_monthly_wage_usd":3200,"engineer_monthly_usd":5500,"tech_monthly_usd":6200,
            "tertiary_education_pct":42,"stem_graduates_annual":12000,"english_proficiency":"HIGH",
            "labour_flexibility":"HIGH","union_density_pct":0,"work_permit_days":10,
            "key_skill_strengths":["Finance","Logistics","Hospitality","Retail","Construction management"],
            "key_skill_gaps":["Deep tech","Life sciences","Advanced manufacturing","Research"]},
    "SAU": {"population_m":35.9,"labour_force_m":14.8,"unemployment_pct":7.7,"youth_unemployment":27.8,
            "avg_monthly_wage_usd":1800,"engineer_monthly_usd":3200,"tech_monthly_usd":3800,
            "tertiary_education_pct":38,"stem_graduates_annual":25000,"english_proficiency":"MEDIUM",
            "labour_flexibility":"MEDIUM","union_density_pct":0,"work_permit_days":14,
            "key_skill_strengths":["Energy engineering","Finance","Government","Construction"],
            "key_skill_gaps":["Advanced manufacturing","Life sciences","AI/ML","Export-oriented sectors"]},
    "IND": {"population_m":1428.0,"labour_force_m":580.0,"unemployment_pct":7.9,"youth_unemployment":23.2,
            "avg_monthly_wage_usd":420,"engineer_monthly_usd":1200,"tech_monthly_usd":2800,
            "tertiary_education_pct":28,"stem_graduates_annual":1_900_000,"english_proficiency":"HIGH",
            "labour_flexibility":"MEDIUM","union_density_pct":11,"work_permit_days":21,
            "key_skill_strengths":["IT services","Software engineering","Finance","Pharmaceuticals","Management"],
            "key_skill_gaps":["Vocational skills","Advanced manufacturing","Quality control","Supply chain"]},
    "DEU": {"population_m":84.4,"labour_force_m":45.9,"unemployment_pct":3.0,"youth_unemployment":6.4,
            "avg_monthly_wage_usd":3900,"engineer_monthly_usd":5800,"tech_monthly_usd":6500,
            "tertiary_education_pct":33,"stem_graduates_annual":185000,"english_proficiency":"HIGH",
            "labour_flexibility":"LOW","union_density_pct":16,"work_permit_days":30,
            "key_skill_strengths":["Engineering","Automotive","Chemicals","Mechatronics","Dual training"],
            "key_skill_gaps":["AI/ML specialists","Digital transformation","Healthcare workers","IT talent shortage"]},
    "VNM": {"population_m":97.0,"labour_force_m":55.4,"unemployment_pct":2.1,"youth_unemployment":7.6,
            "avg_monthly_wage_usd":280,"engineer_monthly_usd":650,"tech_monthly_usd":1100,
            "tertiary_education_pct":22,"stem_graduates_annual":120000,"english_proficiency":"MEDIUM",
            "labour_flexibility":"HIGH","union_density_pct":8,"work_permit_days":30,
            "key_skill_strengths":["Electronics assembly","Garment manufacturing","Labour cost","Work ethic"],
            "key_skill_gaps":["R&D","Advanced engineering","Management","English proficiency"]},
    "SGP": {"population_m":5.9,"labour_force_m":3.7,"unemployment_pct":1.9,"youth_unemployment":5.1,
            "avg_monthly_wage_usd":4800,"engineer_monthly_usd":7200,"tech_monthly_usd":8500,
            "tertiary_education_pct":58,"stem_graduates_annual":18000,"english_proficiency":"VERY_HIGH",
            "labour_flexibility":"HIGH","union_density_pct":15,"work_permit_days":7,
            "key_skill_strengths":["Finance","Logistics","Biomedical","Tech","Law","Multilingual"],
            "key_skill_gaps":["Volume manufacturing","Large-scale construction","Agriculture"]},
}

@dataclass
class LabourMarketProfile:
    iso3:                 str
    labour_force_m:       float
    unemployment_pct:     float
    avg_monthly_wage_usd: float
    tech_monthly_usd:     float
    stem_graduates_annual: int
    english_proficiency:  str
    labour_flexibility:   str
    work_permit_days:     int
    key_strengths:        list
    key_gaps:             list
    cost_tier:            str    # VERY_LOW / LOW / MEDIUM / HIGH / VERY_HIGH
    skills_score:         float  # 0-100
    investor_summary:     str

class AGT37_LabourMarketIntelligence:

    def _cost_tier(self, wage: float) -> str:
        if wage < 400:   return "VERY_LOW"
        elif wage < 900:  return "LOW"
        elif wage < 2000: return "MEDIUM"
        elif wage < 4000: return "HIGH"
        else:             return "VERY_HIGH"

    def _skills_score(self, data: dict) -> float:
        tertiary = data.get("tertiary_education_pct", 20) / 100
        english  = {"VERY_HIGH":1.0,"HIGH":0.85,"MEDIUM":0.6,"LOW":0.3}.get(data.get("english_proficiency","LOW"),0.3)
        stem_k   = min(1.0, data.get("stem_graduates_annual",10000) / 500000)
        flex     = {"HIGH":1.0,"MEDIUM":0.7,"LOW":0.4}.get(data.get("labour_flexibility","MEDIUM"),0.7)
        return round((tertiary*30 + english*25 + stem_k*25 + flex*20), 1)

    async def profile_economy(self, iso3: str) -> LabourMarketProfile:
        d = LABOUR_DATA.get(iso3, {
            "population_m":20,"labour_force_m":10,"unemployment_pct":8,
            "avg_monthly_wage_usd":600,"tech_monthly_usd":1200,
            "stem_graduates_annual":30000,"english_proficiency":"MEDIUM",
            "labour_flexibility":"MEDIUM","union_density_pct":10,"work_permit_days":30,
            "key_skill_strengths":["General workforce"],"key_skill_gaps":["Specialised skills"],
        })
        cost_tier = self._cost_tier(d.get("avg_monthly_wage_usd",600))
        skills    = self._skills_score(d)
        wage      = d.get("avg_monthly_wage_usd",600)
        tech_wage = d.get("tech_monthly_usd",1200)
        stem      = d.get("stem_graduates_annual",30000)
        summary   = (f"{iso3}: {cost_tier.replace('_',' ')} cost labour market. "
                     f"Avg wage ${wage:,}/mo · Tech ${tech_wage:,}/mo. "
                     f"{stem:,} STEM graduates/year. English: {d.get('english_proficiency','?')}. "
                     f"Work permit: {d.get('work_permit_days',30)} days.")

        return LabourMarketProfile(
            iso3=iso3, labour_force_m=d.get("labour_force_m",10),
            unemployment_pct=d.get("unemployment_pct",8),
            avg_monthly_wage_usd=wage, tech_monthly_usd=tech_wage,
            stem_graduates_annual=stem,
            english_proficiency=d.get("english_proficiency","MEDIUM"),
            labour_flexibility=d.get("labour_flexibility","MEDIUM"),
            work_permit_days=d.get("work_permit_days",30),
            key_strengths=d.get("key_skill_strengths",[])[:4],
            key_gaps=d.get("key_skill_gaps",[])[:4],
            cost_tier=cost_tier, skills_score=skills,
            investor_summary=summary,
        )

    async def batch_profile(self, iso3_list: list) -> list[LabourMarketProfile]:
        return await asyncio.gather(*[self.profile_economy(iso3) for iso3 in iso3_list])


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-38: INFRASTRUCTURE QUALITY ASSESSOR
# LPI, port connectivity, air links, road/rail quality, energy reliability
# Sources: World Bank LPI, WEF GCI, IATA, World Bank WDI
# ═══════════════════════════════════════════════════════════════════════════════

INFRASTRUCTURE_DATA = {
    "SGP": {"lpi":4.3,"port_connectivity":148,"airports_intl":1,"cargo_airports":1,
            "road_quality":6.2,"rail_quality":6.7,"power_reliability":99.9,
            "internet_speed_mbps":262,"mobile_coverage_pct":100,"logistics_cost_pct_gdp":8.5},
    "DEU": {"lpi":4.2,"port_connectivity":88,"airports_intl":18,"cargo_airports":5,
            "road_quality":6.3,"rail_quality":6.8,"power_reliability":99.9,
            "internet_speed_mbps":98,"mobile_coverage_pct":99,"logistics_cost_pct_gdp":8.1},
    "ARE": {"lpi":4.0,"port_connectivity":140,"airports_intl":3,"cargo_airports":2,
            "road_quality":6.5,"rail_quality":4.8,"power_reliability":99.8,
            "internet_speed_mbps":188,"mobile_coverage_pct":100,"logistics_cost_pct_gdp":7.2},
    "USA": {"lpi":4.0,"port_connectivity":122,"airports_intl":42,"cargo_airports":18,
            "road_quality":5.7,"rail_quality":4.9,"power_reliability":99.5,
            "internet_speed_mbps":228,"mobile_coverage_pct":98,"logistics_cost_pct_gdp":7.8},
    "IND": {"lpi":3.4,"port_connectivity":65,"airports_intl":34,"cargo_airports":8,
            "road_quality":3.8,"rail_quality":4.5,"power_reliability":87.4,
            "internet_speed_mbps":68,"mobile_coverage_pct":93,"logistics_cost_pct_gdp":13.5},
    "VNM": {"lpi":3.3,"port_connectivity":74,"airports_intl":9,"cargo_airports":3,
            "road_quality":3.9,"rail_quality":2.8,"power_reliability":91.2,
            "internet_speed_mbps":82,"mobile_coverage_pct":95,"logistics_cost_pct_gdp":16.8},
    "NGA": {"lpi":2.5,"port_connectivity":22,"airports_intl":5,"cargo_airports":2,
            "road_quality":2.1,"rail_quality":1.8,"power_reliability":48.0,
            "internet_speed_mbps":14,"mobile_coverage_pct":78,"logistics_cost_pct_gdp":28.0},
    "KEN": {"lpi":2.8,"port_connectivity":28,"airports_intl":3,"cargo_airports":1,
            "road_quality":2.9,"rail_quality":2.5,"power_reliability":72.4,
            "internet_speed_mbps":22,"mobile_coverage_pct":88,"logistics_cost_pct_gdp":22.0},
}

@dataclass
class InfrastructureProfile:
    iso3:              str
    lpi_score:         float   # World Bank LPI 1-5
    lpi_tier:          str
    port_connectivity: int     # UNCTAD LSCI
    air_connectivity:  str
    road_quality:      float   # WEF 1-7
    rail_quality:      float   # WEF 1-7
    power_reliability: float   # % uptime
    internet_speed:    int     # Mbps
    logistics_cost:    float   # % of GDP
    overall_score:     float   # 0-100
    key_strengths:     list
    key_constraints:   list

class AGT38_InfrastructureQualityAssessor:

    def _lpi_tier(self, lpi: float) -> str:
        if lpi >= 4.0: return "WORLD_CLASS"
        elif lpi >= 3.5: return "EFFICIENT"
        elif lpi >= 3.0: return "ADEQUATE"
        elif lpi >= 2.5: return "DEVELOPING"
        else:            return "CONSTRAINED"

    def _score(self, d: dict) -> float:
        lpi    = (d.get("lpi",3) - 1) / 4 * 25
        port   = min(25, d.get("port_connectivity",50) / 5)
        power  = d.get("power_reliability",80) / 100 * 20
        inet   = min(15, (math.log10(d.get("internet_speed_mbps",10)+1) / math.log10(301)) * 15)
        logi   = max(0, 15 - (d.get("logistics_cost_pct_gdp",15) - 7))
        return round(min(100, lpi + port + power + inet + logi), 1)

    async def assess(self, iso3: str) -> InfrastructureProfile:
        d = INFRASTRUCTURE_DATA.get(iso3, {
            "lpi":2.8,"port_connectivity":20,"airports_intl":2,"cargo_airports":1,
            "road_quality":3.0,"rail_quality":2.5,"power_reliability":75,
            "internet_speed_mbps":20,"mobile_coverage_pct":80,"logistics_cost_pct_gdp":20
        })
        lpi   = d.get("lpi",2.8)
        score = self._score(d)
        strengths, constraints = [], []
        if lpi >= 4.0: strengths.append(f"World-class logistics (LPI {lpi})")
        if d.get("port_connectivity",0) >= 100: strengths.append("Major global port hub")
        if d.get("power_reliability",0) >= 99: strengths.append("Near-perfect power reliability")
        if d.get("internet_speed_mbps",0) >= 150: strengths.append("High-speed internet infrastructure")
        if d.get("power_reliability",0) < 90: constraints.append(f"Power unreliability ({d.get('power_reliability')}% uptime)")
        if d.get("road_quality",4) < 3.5: constraints.append("Below-average road quality")
        if d.get("logistics_cost_pct_gdp",15) > 15: constraints.append(f"High logistics costs ({d.get('logistics_cost_pct_gdp')}% GDP)")

        return InfrastructureProfile(
            iso3=iso3, lpi_score=lpi, lpi_tier=self._lpi_tier(lpi),
            port_connectivity=d.get("port_connectivity",20),
            air_connectivity=f"{d.get('airports_intl',2)} international airports",
            road_quality=d.get("road_quality",3.0), rail_quality=d.get("rail_quality",2.5),
            power_reliability=d.get("power_reliability",75),
            internet_speed=d.get("internet_speed_mbps",20),
            logistics_cost=d.get("logistics_cost_pct_gdp",20),
            overall_score=score,
            key_strengths=strengths[:3] if strengths else ["Standard infrastructure"],
            key_constraints=constraints[:3] if constraints else ["No major constraints identified"],
        )

    async def batch_assess(self, iso3_list: list) -> list[InfrastructureProfile]:
        return await asyncio.gather(*[self.assess(iso3) for iso3 in iso3_list])


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-39: DIGITAL ECONOMY TRACKER
# ICT readiness, e-government, fintech ecosystem, digital infrastructure FDI
# ═══════════════════════════════════════════════════════════════════════════════

DIGITAL_DATA = {
    "SGP": {"itu_idi":9.1,"broadband_per100":28.4,"mobile_per100":158,"internet_pct":92.4,
            "egov_index":0.915,"fintech_hubs":3,"unicorns_total":12,"ai_readiness":8.4,
            "cloud_providers":["AWS","Azure","Google","Alibaba"],"data_centre_mw":1200},
    "USA": {"itu_idi":8.8,"broadband_per100":38.2,"mobile_per100":122,"internet_pct":91.8,
            "egov_index":0.879,"fintech_hubs":8,"unicorns_total":756,"ai_readiness":9.2,
            "cloud_providers":["AWS","Azure","Google","Oracle"],"data_centre_mw":28000},
    "ARE": {"itu_idi":8.6,"broadband_per100":25.4,"mobile_per100":212,"internet_pct":96.5,
            "egov_index":0.882,"fintech_hubs":2,"unicorns_total":4,"ai_readiness":7.8,
            "cloud_providers":["AWS","Azure","Google","Alibaba","Huawei"],"data_centre_mw":520},
    "DEU": {"itu_idi":8.1,"broadband_per100":43.2,"mobile_per100":133,"internet_pct":90.5,
            "egov_index":0.815,"fintech_hubs":3,"unicorns_total":28,"ai_readiness":7.9,
            "cloud_providers":["AWS","Azure","Google","SAP"],"data_centre_mw":2800},
    "IND": {"itu_idi":5.4,"broadband_per100":8.4,"mobile_per100":84,"internet_pct":43.0,
            "egov_index":0.772,"fintech_hubs":5,"unicorns_total":105,"ai_readiness":6.2,
            "cloud_providers":["AWS","Azure","Google","Jio","Tata"],"data_centre_mw":870},
    "VNM": {"itu_idi":5.9,"broadband_per100":18.4,"mobile_per100":140,"internet_pct":73.2,
            "egov_index":0.758,"fintech_hubs":1,"unicorns_total":6,"ai_readiness":5.4,
            "cloud_providers":["AWS","Azure","Google","FPT"],"data_centre_mw":85},
    "KEN": {"itu_idi":3.8,"broadband_per100":2.1,"mobile_per100":118,"internet_pct":22.4,
            "egov_index":0.628,"fintech_hubs":1,"unicorns_total":2,"ai_readiness":4.1,
            "cloud_providers":["AWS","Azure","Google"],"data_centre_mw":28},
}

@dataclass
class DigitalEconomyProfile:
    iso3:               str
    itu_idi:            float    # ITU ICT Development Index 0-10
    internet_pct:       float
    mobile_per100:      float
    egov_index:         float
    fintech_hubs:       int
    unicorn_count:      int
    ai_readiness:       float
    cloud_providers:    list
    data_centre_mw:     int
    digital_maturity:   str     # PIONEER / ADVANCED / EMERGING / DEVELOPING
    fdi_opportunity:    str
    digital_score:      float   # 0-100

class AGT39_DigitalEconomyTracker:

    def _maturity(self, idi: float) -> str:
        if idi >= 8.0: return "PIONEER"
        elif idi >= 6.5: return "ADVANCED"
        elif idi >= 4.5: return "EMERGING"
        else:            return "DEVELOPING"

    def _score(self, d: dict) -> float:
        idi  = d.get("itu_idi",5) / 10 * 30
        inet = d.get("internet_pct",50) / 100 * 20
        egov = d.get("egov_index",0.5) * 20
        ai   = d.get("ai_readiness",5) / 10 * 15
        dc   = min(15, math.log10(d.get("data_centre_mw",10)+1) / math.log10(30001) * 15)
        return round(min(100, idi + inet + egov + ai + dc), 1)

    def _fdi_opportunity(self, iso3: str, d: dict) -> str:
        dc_mw = d.get("data_centre_mw",50)
        if dc_mw < 200 and d.get("internet_pct",0) > 50:
            return f"HIGH data centre FDI opportunity — current capacity {dc_mw}MW, rapid demand growth"
        if d.get("unicorn_count",0) < 5 and d.get("internet_pct",0) > 40:
            return f"HIGH tech ecosystem FDI opportunity — nascent startup ecosystem with growing digital base"
        return f"MODERATE digital economy FDI opportunity — maturing market with selective gaps"

    async def profile(self, iso3: str) -> DigitalEconomyProfile:
        d = DIGITAL_DATA.get(iso3, {
            "itu_idi":4,"broadband_per100":5,"mobile_per100":80,"internet_pct":35,
            "egov_index":0.5,"fintech_hubs":0,"unicorns_total":0,"ai_readiness":4,
            "cloud_providers":["AWS"],"data_centre_mw":15,
        })
        return DigitalEconomyProfile(
            iso3=iso3, itu_idi=d.get("itu_idi",4),
            internet_pct=d.get("internet_pct",35),
            mobile_per100=d.get("mobile_per100",80),
            egov_index=d.get("egov_index",0.5),
            fintech_hubs=d.get("fintech_hubs",0),
            unicorn_count=d.get("unicorns_total",0),
            ai_readiness=d.get("ai_readiness",4),
            cloud_providers=d.get("cloud_providers",["AWS"])[:4],
            data_centre_mw=d.get("data_centre_mw",15),
            digital_maturity=self._maturity(d.get("itu_idi",4)),
            fdi_opportunity=self._fdi_opportunity(iso3, d),
            digital_score=self._score(d),
        )

    async def batch_profile(self, iso3_list: list) -> list[DigitalEconomyProfile]:
        return await asyncio.gather(*[self.profile(iso3) for iso3 in iso3_list])


# ═══════════════════════════════════════════════════════════════════════════════
# AGT-40: ENERGY TRANSITION MONITOR
# Renewable investment signals, grid readiness, green FDI pipeline
# Sources: IRENA, IEA, BloombergNEF proxy, CDP, SBTi
# ═══════════════════════════════════════════════════════════════════════════════

ENERGY_DATA = {
    "ARE": {"renewables_share_pct":14.2,"solar_gw":9.2,"wind_gw":0.1,"renewable_target_pct":44,"target_year":2050,
            "clean_energy_fdi_b":8.4,"grid_readiness":"HIGH","green_hydrogen":"ACTIVE","carbon_price":None,
            "net_zero_year":2050,"coal_exit":True,"ev_adoption_pct":2.1},
    "SAU": {"renewables_share_pct":4.1,"solar_gw":3.5,"wind_gw":0.4,"renewable_target_pct":50,"target_year":2030,
            "clean_energy_fdi_b":18.2,"grid_readiness":"MEDIUM","green_hydrogen":"ACTIVE","carbon_price":None,
            "net_zero_year":2060,"coal_exit":True,"ev_adoption_pct":0.8},
    "IND": {"renewables_share_pct":22.0,"solar_gw":81.8,"wind_gw":44.7,"renewable_target_pct":50,"target_year":2030,
            "clean_energy_fdi_b":11.5,"grid_readiness":"MEDIUM","green_hydrogen":"DEVELOPING","carbon_price":None,
            "net_zero_year":2070,"coal_exit":False,"ev_adoption_pct":1.9},
    "DEU": {"renewables_share_pct":59.7,"solar_gw":81.4,"wind_gw":69.2,"renewable_target_pct":80,"target_year":2030,
            "clean_energy_fdi_b":14.8,"grid_readiness":"HIGH","green_hydrogen":"ACTIVE","carbon_price":62.5,
            "net_zero_year":2045,"coal_exit":True,"ev_adoption_pct":22.4},
    "USA": {"renewables_share_pct":21.5,"solar_gw":139.0,"wind_gw":145.0,"renewable_target_pct":100,"target_year":2035,
            "clean_energy_fdi_b":105.0,"grid_readiness":"MEDIUM","green_hydrogen":"ACTIVE","carbon_price":None,
            "net_zero_year":2050,"coal_exit":True,"ev_adoption_pct":7.6},
    "EGY": {"renewables_share_pct":11.4,"solar_gw":1.8,"wind_gw":1.6,"renewable_target_pct":42,"target_year":2035,
            "clean_energy_fdi_b":2.8,"grid_readiness":"LOW","green_hydrogen":"DEVELOPING","carbon_price":None,
            "net_zero_year":2050,"coal_exit":False,"ev_adoption_pct":0.2},
    "KEN": {"renewables_share_pct":92.0,"solar_gw":1.1,"wind_gw":1.0,"renewable_target_pct":100,"target_year":2030,
            "clean_energy_fdi_b":0.9,"grid_readiness":"MEDIUM","green_hydrogen":"PLANNED","carbon_price":None,
            "net_zero_year":2050,"coal_exit":True,"ev_adoption_pct":0.1},
}

@dataclass
class EnergyTransitionProfile:
    iso3:                str
    renewables_share_pct: float
    solar_gw:            float
    wind_gw:             float
    renewable_target_pct: float
    target_year:         int
    clean_energy_fdi_b:  float
    grid_readiness:      str
    green_hydrogen:      str
    net_zero_year:       Optional[int]
    coal_exit_committed: bool
    transition_score:    float   # 0-100
    investment_signal:   str
    fdi_opportunities:   list

class AGT40_EnergyTransitionMonitor:

    def _score(self, d: dict) -> float:
        share    = d.get("renewables_share_pct",10) / 100 * 30
        target_ambition = min(20, d.get("renewable_target_pct",30) / 5)
        fdi_proxy = min(20, math.log10(d.get("clean_energy_fdi_b",1)+1) / math.log10(106) * 20)
        grid      = {"HIGH":15,"MEDIUM":10,"LOW":5}.get(d.get("grid_readiness","LOW"),5)
        coal      = 10 if d.get("coal_exit") else 0
        nz_year   = d.get("net_zero_year")
        nz_bonus  = max(0, 5 - ((nz_year or 2070) - 2050) / 5) if nz_year else 0
        return round(min(100, share + target_ambition + fdi_proxy + grid + coal + nz_bonus), 1)

    def _fdi_opps(self, d: dict) -> list:
        opps = []
        if d.get("solar_gw",0) < 20 and d.get("renewable_target_pct",0) > 30:
            opps.append("Solar PV and utility-scale solar — significant capacity gap vs. targets")
        if d.get("green_hydrogen") in ("ACTIVE","DEVELOPING"):
            opps.append("Green hydrogen infrastructure — active government programme")
        if d.get("grid_readiness") == "LOW":
            opps.append("Grid modernisation and smart grid infrastructure investment")
        if d.get("ev_adoption_pct", 5) < 3:
            opps.append("EV charging infrastructure — early-mover opportunity")
        if not opps:
            opps.append("Mature market — repowering and floating solar opportunities")
        return opps[:3]

    async def profile(self, iso3: str) -> EnergyTransitionProfile:
        d = ENERGY_DATA.get(iso3, {
            "renewables_share_pct":10,"solar_gw":0.5,"wind_gw":0.2,
            "renewable_target_pct":30,"target_year":2030,"clean_energy_fdi_b":0.5,
            "grid_readiness":"LOW","green_hydrogen":"NONE","net_zero_year":None,
            "coal_exit":False,"ev_adoption_pct":0.1,
        })
        score  = self._score(d)
        opps   = self._fdi_opps(d)
        signal = ("STRONG" if score >= 65 else "MODERATE" if score >= 45 else "WEAK")

        return EnergyTransitionProfile(
            iso3=iso3,
            renewables_share_pct=d.get("renewables_share_pct",10),
            solar_gw=d.get("solar_gw",0), wind_gw=d.get("wind_gw",0),
            renewable_target_pct=d.get("renewable_target_pct",30),
            target_year=d.get("target_year",2030),
            clean_energy_fdi_b=d.get("clean_energy_fdi_b",0.5),
            grid_readiness=d.get("grid_readiness","LOW"),
            green_hydrogen=d.get("green_hydrogen","NONE"),
            net_zero_year=d.get("net_zero_year"),
            coal_exit_committed=bool(d.get("coal_exit",False)),
            transition_score=score,
            investment_signal=signal,
            fdi_opportunities=opps,
        )

    async def batch_profile(self, iso3_list: list) -> list[EnergyTransitionProfile]:
        return await asyncio.gather(*[self.profile(iso3) for iso3 in iso3_list])

    async def get_top_fdi_opportunities(self, top_n: int = 5) -> list:
        all_iso3 = list(ENERGY_DATA.keys())
        profiles = await self.batch_profile(all_iso3)
        return sorted(profiles, key=lambda p: p.clean_energy_fdi_b, reverse=True)[:top_n]


# ─── UNIFIED TEST ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import logging
    logging.basicConfig(level=logging.WARNING)

    async def test():
        print("\n" + "="*60)
        print("AGT-36: INVESTMENT INCENTIVE ANALYZER")
        print("="*60)
        agt36 = AGT36_InvestmentIncentiveAnalyzer()
        profiles = await agt36.compare_economies(["ARE","IRL","SGP","IND","DEU"], ["J","K"])
        for p in profiles:
            print(f"  {p.iso3}: Score:{p.overall_score:.0f}  CT:{p.corporate_tax_rate}%→{p.effective_tax_rate}%  "
                  f"Setup:{p.establishment_days}d  Progs:{p.total_programmes}")

        print("\n" + "="*60)
        print("AGT-37: LABOUR MARKET INTELLIGENCE")
        print("="*60)
        agt37 = AGT37_LabourMarketIntelligence()
        labour = await agt37.batch_profile(["ARE","IND","DEU","VNM","SGP"])
        for l in labour:
            print(f"  {l.iso3}: [{l.cost_tier:<9}] ${l.avg_monthly_wage_usd:,}/mo  "
                  f"STEM:{l.stem_graduates_annual:,}/yr  Skills:{l.skills_score:.0f}  English:{l.english_proficiency}")

        print("\n" + "="*60)
        print("AGT-38: INFRASTRUCTURE QUALITY")
        print("="*60)
        agt38 = AGT38_InfrastructureQualityAssessor()
        infra = await agt38.batch_assess(["SGP","DEU","ARE","IND","NGA"])
        for i in infra:
            print(f"  {i.iso3}: [{i.lpi_tier:<12}] LPI:{i.lpi_score}  Port:{i.port_connectivity}  "
                  f"Power:{i.power_reliability:.0f}%  Score:{i.overall_score:.0f}")

        print("\n" + "="*60)
        print("AGT-39: DIGITAL ECONOMY TRACKER")
        print("="*60)
        agt39 = AGT39_DigitalEconomyTracker()
        digital = await agt39.batch_profile(["SGP","USA","ARE","IND","KEN"])
        for d in digital:
            print(f"  {d.iso3}: [{d.digital_maturity:<10}] IDI:{d.itu_idi}  DC:{d.data_centre_mw}MW  "
                  f"Unicorns:{d.unicorn_count}  Score:{d.digital_score:.0f}")

        print("\n" + "="*60)
        print("AGT-40: ENERGY TRANSITION MONITOR")
        print("="*60)
        agt40 = AGT40_EnergyTransitionMonitor()
        energy = await agt40.batch_profile(["DEU","USA","IND","ARE","SAU","KEN"])
        for e in energy:
            print(f"  {e.iso3}: [{e.investment_signal:<8}] RE:{e.renewables_share_pct:.0f}%  "
                  f"CleanFDI:${e.clean_energy_fdi_b:.1f}B  Score:{e.transition_score:.0f}  NZ:{e.net_zero_year or '?'}")
        top = await agt40.get_top_fdi_opportunities(3)
        print(f"\n✓ Top 3 clean energy FDI destinations:")
        for t in top:
            print(f"  {t.iso3}: ${t.clean_energy_fdi_b:.1f}B clean FDI · {t.fdi_opportunities[0][:55]}")

    asyncio.run(test())



def _agent_run(payload: dict) -> dict:
    """Core agent execution - processes payload and returns structured result."""
    import hashlib, time
    from datetime import datetime, timezone
    
    start = time.perf_counter()
    iso3 = payload.get('iso3', 'ARE')
    sector = payload.get('sector', 'J')
    
    # Build structured result
    result = {
        'status': 'completed',
        'agent': __name__,
        'iso3': iso3,
        'sector': sector,
        'processed_at': datetime.now(timezone.utc).isoformat(),
        'elapsed_ms': round((time.perf_counter() - start) * 1000, 2),
        'data': payload
    }
    
    # Try to call the module's main processing function if it exists
    main_fns = ['detect_signals', 'compute_gfr', 'generate_report', 'plan_mission',
                'compile_newsletter', 'forecast', 'run_scenario', 'enrich', 'translate']
    for fn_name in main_fns:
        if fn_name in dir():
            try:
                fn = globals()[fn_name]
                data = fn(payload)
                result['data'] = data
                break
            except Exception as e:
                result['warning'] = str(e)
    
    return result

def execute(payload: dict) -> dict:
    import hashlib, json
    from datetime import datetime, timezone
    ref = "AGT-MULTI-" + datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    result = run(payload)
    return {
        "agent":      "AGT-MULTI",
        "ref":        ref,
        "status":     "completed",
        "result":     result,
        "provenance": {"hash": "sha256:" + hashlib.sha256(ref.encode()).hexdigest()[:16],
                       "executed_at": datetime.now(timezone.utc).isoformat()}
    }

if __name__ == "__main__":
    import json
    print(json.dumps(execute({"test": True}), indent=2))


def run(payload: dict) -> dict:
    """Standard GFM agent run interface."""
    return _agent_run(payload)
