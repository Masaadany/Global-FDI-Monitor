'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, TrendingUp, Globe, Zap, FileText, ArrowRight } from 'lucide-react';

const SEARCH_INDEX = [
  // Economies
  {type:'economy',id:'SGP',name:'Singapore',flag:'🇸🇬',sub:'GOSA 88.4 · Asia Pacific · TOP',href:'/country/SGP',score:88.4},
  {type:'economy',id:'ARE',name:'UAE',flag:'🇦🇪',sub:'GOSA 82.1 · Middle East · TOP',href:'/country/ARE',score:82.1},
  {type:'economy',id:'MYS',name:'Malaysia',flag:'🇲🇾',sub:'GOSA 81.2 · Asia Pacific · HIGH',href:'/country/MYS',score:81.2},
  {type:'economy',id:'THA',name:'Thailand',flag:'🇹🇭',sub:'GOSA 80.7 · Asia Pacific · HIGH',href:'/country/THA',score:80.7},
  {type:'economy',id:'VNM',name:'Vietnam',flag:'🇻🇳',sub:'GOSA 79.4 · Asia Pacific · HIGH',href:'/country/VNM',score:79.4},
  {type:'economy',id:'SAU',name:'Saudi Arabia',flag:'🇸🇦',sub:'GOSA 79.1 · Middle East · HIGH',href:'/country/SAU',score:79.1},
  {type:'economy',id:'IND',name:'India',flag:'🇮🇳',sub:'GOSA 73.2 · Asia Pacific · HIGH',href:'/country/IND',score:73.2},
  {type:'economy',id:'IDN',name:'Indonesia',flag:'🇮🇩',sub:'GOSA 77.8 · Asia Pacific · HIGH',href:'/country/IDN',score:77.8},
  {type:'economy',id:'KOR',name:'South Korea',flag:'🇰🇷',sub:'GOSA 84.1 · Asia Pacific · TOP',href:'/country/KOR',score:84.1},
  {type:'economy',id:'JPN',name:'Japan',flag:'🇯🇵',sub:'GOSA 81.4 · Asia Pacific · TOP',href:'/country/JPN',score:81.4},
  {type:'economy',id:'GBR',name:'United Kingdom',flag:'🇬🇧',sub:'GOSA 82.5 · Europe · TOP',href:'/country/GBR',score:82.5},
  {type:'economy',id:'DEU',name:'Germany',flag:'🇩🇪',sub:'GOSA 83.1 · Europe · TOP',href:'/country/DEU',score:83.1},
  {type:'economy',id:'USA',name:'United States',flag:'🇺🇸',sub:'GOSA 83.9 · Americas · TOP',href:'/country/USA',score:83.9},
  {type:'economy',id:'BRA',name:'Brazil',flag:'🇧🇷',sub:'GOSA 71.3 · Americas · HIGH',href:'/country/BRA',score:71.3},
  {type:'economy',id:'MAR',name:'Morocco',flag:'🇲🇦',sub:'GOSA 66.8 · Africa · HIGH',href:'/country/MAR',score:66.8},
  {type:'economy',id:'DNK',name:'Denmark',flag:'🇩🇰',sub:'GOSA 85.3 · Europe · TOP',href:'/country/DNK',score:85.3},
  {type:'economy',id:'CHE',name:'Switzerland',flag:'🇨🇭',sub:'GOSA 84.8 · Europe · TOP',href:'/country/CHE',score:84.8},
  {type:'economy',id:'NLD',name:'Netherlands',flag:'🇳🇱',sub:'GOSA 84.6 · Europe · TOP',href:'/country/NLD',score:84.6},
  {type:'economy',id:'CAN',name:'Canada',flag:'🇨🇦',sub:'GOSA 80.8 · Americas · TOP',href:'/country/CAN',score:80.8},
  {type:'economy',id:'NZL',name:'New Zealand',flag:'🇳🇿',sub:'GOSA 86.7 · Oceania · TOP',href:'/country/NZL',score:86.7},
  {type:'economy',id:'AUS',name:'Australia',  flag:'🇦🇺',sub:'GOSA 82.8 · Oceania · TOP',href:'/country/AUS',score:82.8},
  {type:'economy',id:'FRA',name:'France',     flag:'🇫🇷',sub:'GOSA 81.6 · Europe · TOP', href:'/country/FRA',score:81.6},
  {type:'economy',id:'CHN',name:'China',      flag:'🇨🇳',sub:'GOSA 64.2 · Asia Pacific · HIGH',href:'/country/CHN',score:64.2},
  // Pages
  {type:'page',name:'Dashboard',sub:'7 live HUD widgets',href:'/dashboard',icon:'📊'},
  {type:'page',name:'Investment Analysis',sub:'15 economies · GOSA scoring',href:'/investment-analysis',icon:'🌍'},
  {type:'page',name:'Market Signals',sub:'Live PLATINUM/GOLD signal feed',href:'/signals',icon:'⚡'},
  {type:'page',name:'GFR Ranking',sub:'25 economies · 6 dimensions',href:'/gfr',icon:'🏆'},
  {type:'page',name:'PDF Reports',sub:'AI-generated investment reports',href:'/reports',icon:'📄'},
  {type:'page',name:'Mission Planning',sub:'4 guided investment workflows',href:'/pmp',icon:'🎯'},
  {type:'page',name:'Publications',sub:'Weekly Intelligence Brief',href:'/publications',icon:'📰'},
  {type:'page',name:'Data Sources',sub:'304+ official sources',href:'/sources',icon:'📡'},
  {type:'page',name:'API Documentation',sub:'REST + WebSocket endpoints',href:'/api-docs',icon:'🔌'},
  {type:'page',name:'Pricing',sub:'Free trial · Professional · Enterprise',href:'/pricing',icon:'💼'},
  // Sectors
  {type:'sector',name:'EV Battery',sub:'Momentum: HOT · Top: VNM, THA, IDN',href:'/investment-analysis?sector=ev-battery',icon:'🔋'},
  {type:'sector',name:'Data Centers',sub:'Momentum: HOT · Top: MYS, SGP, ARE',href:'/investment-analysis?sector=data-centers',icon:'🖥'},
  {type:'sector',name:'Semiconductors',sub:'Momentum: RISING · Top: SGP, KOR, USA',href:'/investment-analysis?sector=semiconductors',icon:'💻'},
  {type:'sector',name:'Renewable Energy',sub:'Momentum: RISING · Top: SAU, MAR, DNK',href:'/investment-analysis?sector=renewables',icon:'⚡'},
  {type:'sector',name:'AI & Technology',sub:'Momentum: HOT · Top: ARE, USA, SGP',href:'/investment-analysis?sector=ai-tech',icon:'🤖'},
];

type SearchResult = typeof SEARCH_INDEX[0];

const TYPE_COLOR: Record<string, string> = {
  economy: '#00ffc8', page: '#00d4ff', sector: '#ffd700',
};
const TYPE_LABEL: Record<string, string> = {
  economy: 'Economy', page: 'Page', sector: 'Sector',
};

export default function GlobalSearch({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const res = SEARCH_INDEX.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.sub?.toLowerCase().includes(q) ||
      (item as any).id?.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(res);
    setSelected(0);
  }, [query]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s+1, results.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s-1, 0)); }
    if (e.key === 'Escape') { onClose?.(); }
    if (e.key === 'Enter' && results[selected]) {
      window.location.href = results[selected].href;
      onClose?.();
    }
  }

  const recents = SEARCH_INDEX.filter(i => i.type === 'economy').slice(0, 4);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', maxHeight:'520px' }}>
      {/* Search input */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', borderBottom:'1px solid rgba(0,255,200,0.08)' }}>
        <Search size={16} color="#00ffc8"/>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search economies, signals, sectors, pages..."
          style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:'15px', color:'#e8f4f8', fontFamily:"'Inter',sans-serif" }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(232,244,248,0.4)', padding:0, lineHeight:1 }}>
            <X size={14}/>
          </button>
        )}
        {onClose && (
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'5px', cursor:'pointer', color:'rgba(232,244,248,0.4)', padding:'3px 7px', fontSize:'10px', fontFamily:"'Inter',sans-serif", lineHeight:1 }}>
            ESC
          </button>
        )}
      </div>

      <div ref={listRef} style={{ flex:1, overflowY:'auto', padding:'6px' }}>
        {!query && (
          <>
            <div style={{ padding:'8px 10px 4px', fontSize:'9px', fontWeight:800, color:'rgba(0,255,200,0.4)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'Orbitron','Inter',sans-serif" }}>Top Economies</div>
            {recents.map(item => (
              <Link key={item.name} href={item.href} onClick={onClose}
                style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 10px', borderRadius:'8px', textDecoration:'none', transition:'background 120ms' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,255,200,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                <span style={{ fontSize:'20px', flexShrink:0 }}>{(item as any).flag || (item as any).icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:600, color:'#e8f4f8' }}>{item.name}</div>
                  <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.4)' }}>{item.sub}</div>
                </div>
                <ArrowRight size={12} color="rgba(232,244,248,0.2)"/>
              </Link>
            ))}
            <div style={{ padding:'8px 10px 4px', marginTop:'4px', fontSize:'9px', fontWeight:800, color:'rgba(0,212,255,0.4)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'Orbitron','Inter',sans-serif" }}>Quick Links</div>
            {SEARCH_INDEX.filter(i => i.type === 'page').slice(0, 4).map(item => (
              <Link key={item.name} href={item.href} onClick={onClose}
                style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', borderRadius:'8px', textDecoration:'none', transition:'background 120ms' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,180,216,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                <span style={{ fontSize:'18px', flexShrink:0 }}>{(item as any).icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12px', fontWeight:600, color:'rgba(232,244,248,0.85)' }}>{item.name}</div>
                  <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.35)' }}>{item.sub}</div>
                </div>
              </Link>
            ))}
          </>
        )}

        {query && results.length === 0 && (
          <div style={{ padding:'32px 16px', textAlign:'center', color:'rgba(232,244,248,0.35)', fontSize:'13px' }}>
            No results for "{query}"
          </div>
        )}

        {results.length > 0 && (
          <>
            {['economy','sector','page'].map(type => {
              const group = results.filter(r => r.type === type);
              if (!group.length) return null;
              return (
                <div key={type}>
                  <div style={{ padding:'8px 10px 4px', fontSize:'9px', fontWeight:800, color:`${TYPE_COLOR[type]}50`, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'Orbitron','Inter',sans-serif" }}>{TYPE_LABEL[type]}</div>
                  {group.map((item, gi) => {
                    const idx = results.indexOf(item);
                    const isSel = idx === selected;
                    return (
                      <Link key={item.name} href={item.href} onClick={onClose}
                        style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 10px', borderRadius:'8px', textDecoration:'none', background:isSel?`${TYPE_COLOR[type]}08`:'transparent', transition:'background 120ms' }}
                        onMouseEnter={() => setSelected(idx)}>
                        <span style={{ fontSize:'20px', flexShrink:0, lineHeight:1 }}>{(item as any).flag || (item as any).icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'13px', fontWeight:isSel?700:500, color:isSel?'#e8f4f8':'rgba(232,244,248,0.8)' }}>{item.name}</div>
                          <div style={{ fontSize:'10px', color:'rgba(232,244,248,0.4)' }}>{item.sub}</div>
                        </div>
                        {item.type === 'economy' && (item as any).score && (
                          <span style={{ fontSize:'14px', fontWeight:900, color:TYPE_COLOR.economy, fontFamily:"'JetBrains Mono',monospace" }}>{(item as any).score}</span>
                        )}
                        {isSel && <ArrowRight size={12} color={TYPE_COLOR[type]}/>}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div style={{ padding:'8px 14px', borderTop:'1px solid rgba(0,255,200,0.06)', display:'flex', gap:'14px', fontSize:'10px', color:'rgba(232,244,248,0.2)' }}>
        <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        <span style={{ marginLeft:'auto' }}>{SEARCH_INDEX.length} indexed items</span>
      </div>
    </div>
  );
}

// Full-page search overlay
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open ? onClose() : null; }
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', zIndex:9000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'80px 20px 20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'rgba(8,20,36,0.98)', border:'1px solid rgba(0,255,200,0.2)', borderRadius:'14px', width:'100%', maxWidth:'580px', boxShadow:'0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,200,0.06)', overflow:'hidden', backdropFilter:'blur(20px)' }}>
        <GlobalSearch onClose={onClose}/>
      </div>
    </div>
  );
}
