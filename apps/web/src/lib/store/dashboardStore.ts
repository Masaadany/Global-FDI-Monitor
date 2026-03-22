'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FilterState {
  region: string; country: string; city: string; category: string;
  duration: string; customStart: string; customEnd: string;
  investmentType: string; sector: string; subSector: string;
  investmentCapital: string; jobs: string; opportunities: string;
  policy: string; incentives: string; futureReadiness: string;
  search: string;
}
const DEFAULT: FilterState = {
  region:'All', country:'', city:'', category:'All',
  duration:'1 Year', customStart:'', customEnd:'',
  investmentType:'All', sector:'All', subSector:'',
  investmentCapital:'All', jobs:'All', opportunities:'All',
  policy:'All', incentives:'All', futureReadiness:'All', search:'',
}
interface Store {
  filters: FilterState; activeFilters: Record<string,string>;
  selectedEntity: any | null; isLoading: boolean; lastUpdated: Date;
  setFilter: (k: keyof FilterState, v: string) => void;
  clearFilters: () => void; removeFilter: (k: string) => void;
  setSelectedEntity: (e: any) => void;
}
export const useDashboardStore = create<Store>()(
  persist((set, get) => ({
    filters: DEFAULT, activeFilters: {}, selectedEntity: null,
    isLoading: false, lastUpdated: new Date(),
    setFilter: (k, v) => set(s => {
      const f = { ...s.filters, [k]: v }
      const af = { ...s.activeFilters }
      if (v && v !== 'All' && v !== '') af[k as string] = v; else delete af[k as string]
      return { filters: f, activeFilters: af }
    }),
    clearFilters: () => set({ filters: DEFAULT, activeFilters: {} }),
    removeFilter: (k) => set(s => ({
      filters: { ...s.filters, [k]: DEFAULT[k as keyof FilterState] ?? '' },
      activeFilters: Object.fromEntries(Object.entries(s.activeFilters).filter(([kk]) => kk !== k))
    })),
    setSelectedEntity: (e) => set({ selectedEntity: e }),
  }), { name: 'fdi-dashboard-v2' })
)
