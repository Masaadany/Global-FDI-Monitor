// Inlined from @gfm/shared — removes monorepo dependency for standalone build
export const UPDATE_INTERVALS = {
  critical_signals_ms:      2000,
  dashboard_kpis_ms:        2000,
  signal_feed_ms:           2000,
  source_to_cache_max_ms:    500,
  cache_to_dashboard_max_ms: 100,
} as const;

export const SUBSCRIPTION_TIERS = {
  free_trial:   { fic_annual: 5,     users: 1,  label: 'Free Trial' },
  professional: { fic_annual: 4800,  users: 3,  label: 'Professional' },
  enterprise:   { fic_annual: 60000, users: 10, label: 'Enterprise' },
} as const;

export const PRICING = {
  professional_annual: 9588,
  enterprise_annual:   29500,
} as const;
