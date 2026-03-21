'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Zap, X } from 'lucide-react';

interface TrialState {
  active: boolean;
  daysLeft: number;
  reportsUsed: number;
  searchesUsed: number;
  tier: 'trial' | 'professional' | 'enterprise' | 'none';
  startDate: number;
}

const TRIAL_LIMITS = { days: 7, reports: 2, searches: 3 };

const DEFAULT_STATE: TrialState = {
  active: false, daysLeft: 7, reportsUsed: 0, searchesUsed: 0,
  tier: 'none', startDate: 0
};

export const TrialContext = createContext<{
  state: TrialState;
  consumeReport: () => boolean;
  consumeSearch: () => boolean;
  canDownloadReport: boolean;
  canSearch: boolean;
  isExpired: boolean;
  startTrial: () => void;
  showGate: (trigger: string) => void;
}>({
  state: DEFAULT_STATE,
  consumeReport: () => true,
  consumeSearch: () => true,
  canDownloadReport: true,
  canSearch: true,
  isExpired: false,
  startTrial: () => {},
  showGate: () => {},
});

export function TrialProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TrialState>(DEFAULT_STATE);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateTrigger, setGateTrigger] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gfm_trial');
      if (saved) {
        const parsed = JSON.parse(saved);
        const msElapsed = Date.now() - parsed.startDate;
        const daysLeft = Math.max(0, TRIAL_LIMITS.days - Math.floor(msElapsed / 86400000));
        setState({ ...parsed, daysLeft, active: daysLeft > 0 && parsed.tier === 'trial' });
      }
    } catch {}
  }, []);

  function save(s: TrialState) {
    setState(s);
    try { localStorage.setItem('gfm_trial', JSON.stringify(s)); } catch {}
  }

  function startTrial() {
    save({ active: true, daysLeft: 7, reportsUsed: 0, searchesUsed: 0, tier: 'trial', startDate: Date.now() });
  }

  function consumeReport(): boolean {
    if (state.tier === 'professional' || state.tier === 'enterprise') return true;
    if (state.reportsUsed >= TRIAL_LIMITS.reports) { setGateTrigger('report'); setGateOpen(true); return false; }
    save({ ...state, reportsUsed: state.reportsUsed + 1 });
    return true;
  }

  function consumeSearch(): boolean {
    if (state.tier === 'professional' || state.tier === 'enterprise') return true;
    if (state.searchesUsed >= TRIAL_LIMITS.searches) { setGateTrigger('search'); setGateOpen(true); return false; }
    save({ ...state, searchesUsed: state.searchesUsed + 1 });
    return true;
  }

  function showGate(trigger: string) { setGateTrigger(trigger); setGateOpen(true); }

  const isExpired = state.tier === 'trial' && state.daysLeft <= 0;
  const canDownloadReport = state.tier === 'professional' || state.tier === 'enterprise' || (state.tier === 'trial' && state.reportsUsed < TRIAL_LIMITS.reports);
  const canSearch = state.tier === 'professional' || state.tier === 'enterprise' || (state.tier === 'trial' && state.searchesUsed < TRIAL_LIMITS.searches);

  return (
    <TrialContext.Provider value={{ state, consumeReport, consumeSearch, canDownloadReport, canSearch, isExpired, startTrial, showGate }}>
      {children}
      {gateOpen && (
        <TrialGateModal trigger={gateTrigger} onClose={() => setGateOpen(false)} state={state}/>
      )}
    </TrialContext.Provider>
  );
}

export function useTrialGate() { return useContext(TrialContext); }

function TrialGateModal({ trigger, onClose, state }: { trigger: string; onClose: () => void; state: TrialState }) {
  const msg: Record<string, { title: string; desc: string; icon: string }> = {
    report: { title: 'Report Limit Reached', desc: `Your trial includes ${TRIAL_LIMITS.reports} PDF reports. You've used ${state.reportsUsed}/${TRIAL_LIMITS.reports}.`, icon: '📄' },
    search: { title: 'Search Limit Reached', desc: `Your trial includes ${TRIAL_LIMITS.searches} country searches. You've used ${state.searchesUsed}/${TRIAL_LIMITS.searches}.`, icon: '🔍' },
    expired: { title: 'Trial Expired', desc: 'Your 7-day free trial has ended. Upgrade to Professional for unlimited access.', icon: '⏰' },
    default: { title: 'Professional Access Required', desc: 'This feature requires a Professional or Enterprise subscription.', icon: '🔒' },
  };
  const { title, desc, icon } = msg[trigger] || msg.default;

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'rgba(10,22,40,0.98)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'16px',padding:'36px',maxWidth:'460px',width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,200,0.08)',position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute',top:'14px',right:'14px',background:'none',border:'none',color:'rgba(232,244,248,0.4)',cursor:'pointer',fontSize:'18px',lineHeight:1,padding:'4px' }}><X size={16}/></button>
        <div style={{ fontSize:'40px',marginBottom:'16px',textAlign:'center' }}>{icon}</div>
        <h2 style={{ fontSize:'20px',fontWeight:900,color:'#e8f4f8',marginBottom:'8px',textAlign:'center' }}>{title}</h2>
        <p style={{ fontSize:'13px',color:'rgba(232,244,248,0.55)',lineHeight:1.75,marginBottom:'24px',textAlign:'center' }}>{desc}</p>
        <div style={{ background:'rgba(0,255,200,0.04)',borderRadius:'10px',padding:'14px',border:'1px solid rgba(0,255,200,0.1)',marginBottom:'20px' }}>
          <div style={{ fontSize:'11px',fontWeight:700,color:'rgba(0,255,200,0.7)',marginBottom:'8px' }}>PROFESSIONAL PLAN INCLUDES</div>
          {['Unlimited PDF reports','Unlimited country searches','Weekly Intelligence Brief','API access (1,000 calls/day)','All 67+ platform pages'].map(f => (
            <div key={f} style={{ display:'flex',alignItems:'center',gap:'7px',padding:'4px 0',fontSize:'12px',color:'rgba(232,244,248,0.65)' }}>
              <span style={{ color:'#00ffc8',fontSize:'10px' }}>✓</span>{f}
            </div>
          ))}
        </div>
        <div style={{ display:'flex',gap:'10px' }}>
          <Link href="/contact?plan=professional" style={{ flex:1,padding:'11px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800,textAlign:'center',boxShadow:'0 4px 16px rgba(0,255,200,0.25)' }}>
            Upgrade to Professional
          </Link>
          <button onClick={onClose} style={{ padding:'11px 18px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'9px',color:'rgba(232,244,248,0.6)',cursor:'pointer',fontSize:'13px',fontWeight:600,fontFamily:"'Inter',sans-serif" }}>
            Later
          </button>
        </div>
        <div style={{ textAlign:'center',marginTop:'12px',fontSize:'11px',color:'rgba(232,244,248,0.25)' }}>$9,588/year · No setup fee · Cancel anytime</div>
      </div>
    </div>
  );
}

// Trial status bar — shows in dashboard header
export function TrialStatusBar() {
  const { state, isExpired } = useTrialGate();
  if (state.tier !== 'trial' || (!state.active && !isExpired)) return null;

  const pctDays = (state.daysLeft / TRIAL_LIMITS.days) * 100;
  const urgency = state.daysLeft <= 2 || isExpired;

  return (
    <div style={{ background:urgency?'rgba(255,68,102,0.08)':'rgba(0,255,200,0.05)',borderBottom:`1px solid ${urgency?'rgba(255,68,102,0.2)':'rgba(0,255,200,0.1)'}`,padding:'7px 24px',display:'flex',alignItems:'center',gap:'16px',fontSize:'11px',flexWrap:'wrap' }}>
      <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
        <Zap size={12} color={urgency?'#ff4466':'#00ffc8'}/>
        <span style={{ fontWeight:700,color:urgency?'#ff4466':'#00ffc8' }}>
          {isExpired ? 'Trial Expired' : `${state.daysLeft} day${state.daysLeft!==1?'s':''} left in trial`}
        </span>
      </div>
      <div style={{ display:'flex',gap:'12px',color:'rgba(232,244,248,0.45)' }}>
        <span>Reports: <b style={{ color:'rgba(232,244,248,0.7)' }}>{state.reportsUsed}/{TRIAL_LIMITS.reports}</b></span>
        <span>Searches: <b style={{ color:'rgba(232,244,248,0.7)' }}>{state.searchesUsed}/{TRIAL_LIMITS.searches}</b></span>
      </div>
      {!isExpired && (
        <div style={{ width:'80px',height:'4px',background:'rgba(255,255,255,0.08)',borderRadius:'2px',overflow:'hidden' }}>
          <div style={{ height:'100%',width:pctDays+'%',background:urgency?'#ff4466':'#00ffc8',borderRadius:'2px',transition:'width 0.5s ease' }}/>
        </div>
      )}
      <Link href="/contact?plan=professional" style={{ marginLeft:'auto',padding:'4px 14px',background:urgency?'rgba(255,68,102,0.12)':'rgba(0,255,200,0.08)',border:`1px solid ${urgency?'rgba(255,68,102,0.25)':'rgba(0,255,200,0.2)'}`,borderRadius:'6px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:urgency?'#ff4466':'#00ffc8',flexShrink:0 }}>
        Upgrade →
      </Link>
    </div>
  );
}
