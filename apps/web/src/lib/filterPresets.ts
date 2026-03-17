/**
 * GFM Signal Filter Presets
 * Saves/loads named filter combinations to localStorage
 */
export interface FilterPreset {
  id:      string;
  name:    string;
  grade:   string;
  sector:  string;
  type:    string;
  status:  string;
  search:  string;
  created: string;
}

const STORAGE_KEY = 'gfm_filter_presets';

export function getPresets(): FilterPreset[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export function savePreset(name: string, filters: Omit<FilterPreset,'id'|'name'|'created'>): FilterPreset {
  const preset: FilterPreset = {
    id:      `preset_${Date.now()}`,
    name,
    created: new Date().toISOString(),
    ...filters,
  };
  const all = getPresets().filter(p => p.name !== name);
  const updated = [preset, ...all].slice(0, 10);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return preset;
}

export function deletePreset(id: string) {
  const updated = getPresets().filter(p => p.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Built-in presets
export const BUILTIN_PRESETS: Omit<FilterPreset,'id'|'created'>[] = [
  {name:'MENA Platinum',  grade:'PLATINUM',sector:'', type:'',            status:'',          search:''},
  {name:'Clean Energy',   grade:'',        sector:'D',type:'Greenfield',  status:'CONFIRMED', search:''},
  {name:'ICT APAC',       grade:'',        sector:'J',type:'',            status:'ANNOUNCED', search:''},
  {name:'Confirmed Only', grade:'',        sector:'', type:'',            status:'CONFIRMED', search:''},
  {name:'Gold Finance',   grade:'GOLD',    sector:'K',type:'',            status:'',          search:''},
];
