/**
 * GFM Filter Presets
 * Persistent multi-dimensional filters across pages.
 * Stored in localStorage with cross-tab sync via BroadcastChannel.
 */

export interface FilterState {
  countries:   string[];
  sectors:     string[];
  grades:      string[];
  signalTypes: string[];
  dateRange:   { from: string; to: string } | null;
  minCapex:    number | null;
  maxCapex:    number | null;
  region:      string;
}

export interface FilterPreset {
  id:      string;
  name:    string;
  filters: FilterState;
  saved:   string;
}

export const DEFAULT_FILTERS: FilterState = {
  countries:   [],
  sectors:     [],
  grades:      [],
  signalTypes: [],
  dateRange:   null,
  minCapex:    null,
  maxCapex:    null,
  region:      '',
};

export const PRESET_EXAMPLES: Omit<FilterPreset,'id'|'saved'>[] = [
  { name:'MENA Technology',    filters: { ...DEFAULT_FILTERS, countries:['UAE','SAU','QAT','EGY'], sectors:['J'], grades:['PLATINUM','GOLD'] } },
  { name:'ASEAN Manufacturing',filters: { ...DEFAULT_FILTERS, countries:['VNM','IDN','THA','MYS'], sectors:['C'], grades:['PLATINUM','GOLD'] } },
  { name:'Africa Energy',      filters: { ...DEFAULT_FILTERS, region:'SSA', sectors:['D'], grades:['GOLD','SILVER'] } },
  { name:'PLATINUM Only',      filters: { ...DEFAULT_FILTERS, grades:['PLATINUM'] } },
  { name:'EV + Battery Supply',filters: { ...DEFAULT_FILTERS, sectors:['C'], signalTypes:['Greenfield','Expansion'] } },
];

const STORAGE_KEY = 'gfm_filter_presets';
const ACTIVE_KEY  = 'gfm_active_filters';

export function savePreset(name: string, filters: FilterState): FilterPreset {
  if (typeof window === 'undefined') return { id:'',name,filters,saved:'' };
  const preset: FilterPreset = { id: `preset_${Date.now()}`, name, filters, saved: new Date().toISOString() };
  const existing = loadPresets();
  existing.push(preset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return preset;
}

export function loadPresets(): FilterPreset[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export function deletePreset(id: string): void {
  if (typeof window === 'undefined') return;
  const presets = loadPresets().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function getActiveFilters(): FilterState {
  if (typeof window === 'undefined') return DEFAULT_FILTERS;
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null') || DEFAULT_FILTERS; } catch { return DEFAULT_FILTERS; }
}

export function setActiveFilters(filters: FilterState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(filters));
  try {
    const bc = new BroadcastChannel('gfm_filters');
    bc.postMessage({ type: 'filter_update', filters });
    bc.close();
  } catch {}
}

export function clearFilters(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVE_KEY);
}

export function isFiltered(filters: FilterState): boolean {
  return filters.countries.length > 0 || filters.sectors.length > 0 || filters.grades.length > 0 ||
    filters.signalTypes.length > 0 || !!filters.dateRange || !!filters.minCapex || !!filters.maxCapex || !!filters.region;
}
