// FDI Monitor — TypeScript Interfaces v101
// Brand: #74BB65 · #0A3D62 · #E2F2DF · #696969

// ── Signal Intelligence ──────────────────────────────────────
export type SignalGrade = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';

export interface FDISignal {
  ref:          string;     // GFM-SIG-XXX-NNN
  grade:        SignalGrade;
  company:      string;
  iso3:         string;
  economy_name: string;
  sector:       string;     // ISIC section name
  sub_sector?:  string;     // ISIC division name
  capex_m:      number;     // USD millions
  jobs?:        number;
  sci:          number;     // Signal Confidence Index 0-100
  z3_verified:  boolean;
  sha256_hash:  string;
  source:       string;
  source_url?:  string;
  source_ref:   string;     // GFM-SRC-NNNNNN
  published_at: string;     // ISO8601
  ts:           string;     // ingested at
  corridor?:    string;     // origin→destination
  free_zone_id?:string;     // FZID
}

// ── GFR Dimensions (6 core) ─────────────────────────────────
export type GFRDimensionCode = 'ETR' | 'ICT' | 'TCM' | 'DTF' | 'SGT' | 'GRP';

export interface GFRDimensionScore {
  code:       GFRDimensionCode;
  name:       string;
  score:      number;       // 0-100
  weight:     number;       // % of total
  rank:       number;
  change:     number;
  indicators: GFRIndicator[];
}

export interface GFRIndicator {
  name:       string;
  value:      number | string;
  unit:       string;
  source:     string;
  source_url?: string;
  source_ref: string;       // GFM-SRC-NNNNNN
  date:       string;
  score:      number;       // 0-100 normalised
}

// ── Proprietary Intelligence Factors ────────────────────────
export interface ProprietaryFactors {
  IRES: number; // Investment Readiness Score
  IMS:  number; // Investment Momentum Score
  SCI:  number; // Signal Confidence Index
  FZII: number; // Free Zone Investment Intelligence
  PAI:  number; // Policy Alignment Indicator
  GCI:  number; // Green Capital Index
}

// ── GFR Economy Record ───────────────────────────────────────
export type GFRTier = 'FRONTIER' | 'HIGH' | 'MEDIUM' | 'DEVELOPING';

export interface GFRRecord {
  iso3:         string;
  economy_name: string;
  region:       string;
  tier:         GFRTier;
  rank:         number;
  score:        number;       // composite 0-100
  change:       number;       // QoQ
  dimensions:   GFRDimensionScore[];
  factors:      ProprietaryFactors;
  updated_at:   string;
}

// ── Mission Planning (PMP) ───────────────────────────────────
export interface TargetEconomy extends GFRRecord {
  rationale:  string;
  fit_score:  number;
}

export interface PotentialCompany {
  cic:            string;     // Company Intelligence Code
  name:           string;
  hq_iso3:        string;
  sector:         string;
  ims:            number;     // Investment Momentum Score
  capex_m_ttm:    number;     // trailing 12-month CapEx
  signals_count:  number;
  financials: {
    revenue_m:    number;
    ebitda_m:     number;
    market_cap_m: number;
    source:       string;
    source_url?:  string;
    source_ref:   string;
  };
  investment_history: { year:number; eco:string; capex_m:number; sector:string }[];
}

export interface GovernmentEntity {
  id:       string;
  name:     string;
  type:     'MINISTRY' | 'IPA' | 'FREE_ZONE' | 'SECTOR_LEAD' | 'CENTRAL_BANK';
  iso3:     string;
  website?: string;
  contact?: string;
  source:   string;
  source_ref: string;
  sectors:  string[];
  fzid?:    string;   // Free Zone ID (if applicable)
}

export interface SectorLead {
  id:       string;
  name:     string;
  iso3:     string;
  sector:   string;
  entity:   string;
  role:     string;
  email?:   string;
  source:   string;
  source_ref: string;
}

export interface PMPDossier {
  ref:               string;
  target_economies:  TargetEconomy[];
  potential_companies: PotentialCompany[];
  gov_entities:      GovernmentEntity[];
  sector_leads:      SectorLead[];
  corridors:         FDICorridor[];
  generated_at:      string;
  credits_used:      number;
}

// ── Investment Corridor ──────────────────────────────────────
export interface FDICorridor {
  id:          string;
  origin_iso3: string;
  dest_iso3:   string;
  label:       string;
  capex_m:     number;
  signals:     number;
  sectors:     string[];
  trend:       'RISING' | 'STABLE' | 'DECLINING';
  source:      string;
  source_ref:  string;
}

// ── Data Source Provenance ───────────────────────────────────
export interface DataSource {
  ref:          string;     // GFM-SRC-NNNNNN
  name:         string;
  abbr:         string;
  url:          string;
  publisher:    string;
  date:         string;
  accessed:     string;     // 20 Mar 2026
  tier:         'T1' | 'T2' | 'T3';
  coverage:     string[];   // ISO3 list or ['GLOBAL']
}

// ── API Response ─────────────────────────────────────────────
export interface APIResponse<T = unknown> {
  data:  T;
  meta?: { total:number; page:number; per_page:number };
  ts:    string;
}

export interface APIError {
  error: { code:string; message:string; ref?:string };
  ts:    string;
}

// ── Subscription ─────────────────────────────────────────────
export type SubTier = 'free_trial' | 'professional' | 'enterprise';

export interface Subscription {
  tier:             SubTier;
  trial_days_left?: number;     // 0-3 for free_trial
  fic_remaining:    number;
  fic_total:        number;
  users:            number;
  billing_cycle:    'annual' | 'multi_year';
  next_renewal:     string;
  annual_price_usd: number;
}
