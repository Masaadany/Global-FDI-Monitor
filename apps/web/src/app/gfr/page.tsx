'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Award, Download } from 'lucide-react';

const DIMS = [
  {code:'ETR',name:'Economic & Trade Resilience',weight:0.20,color:'#00ffc8'},
  {code:'ICT',name:'Innovation & Creative Talent', weight:0.18,color:'#00d4ff'},
  {code:'TCM',name:'Trade & Capital Mobility',     weight:0.18,color:'#ffd700'},
  {code:'DTF',name:'Digital & Tech Frontier',      weight:0.16,color:'#9b59b6'},
  {code:'SGT',name:'Sustainable Growth',           weight:0.15,color:'#e67e22'},
  {code:'GRP',name:'Governance & Policy',          weight:0.13,color:'#ff4466'},
];

const COUNTRIES = [
  {rank:1, name:'Singapore',     flag:'🇸🇬',gfr:91.2,etr:93.1,ict:89.4,tcm:94.2,dtf:91.8,sgt:82.1,grp:96.4,trend:+0.3,tier:'TOP',  region:'Asia Pacific', move:0},
  {rank:2, name:'Denmark',       flag:'🇩🇰',gfr:89.8,etr:88.2,ict:91.4,tcm:86.3,dtf:90.1,sgt:94.2,grp:95.1,trend:+0.2,tier:'TOP',  region:'Europe',       move:0},
  {rank:3, name:'Switzerland',   flag:'🇨🇭',gfr:89.1,etr:91.0,ict:92.3,tcm:88.4,dtf:87.6,sgt:88.3,grp:93.8,trend:+0.1,tier:'TOP',  region:'Europe',       move:0},
  {rank:4, name:'Netherlands',   flag:'🇳🇱',gfr:87.4,etr:86.8,ict:88.2,tcm:89.1,dtf:89.4,sgt:87.6,grp:91.2,trend:-0.1,tier:'TOP',  region:'Europe',       move:0},
  {rank:5, name:'New Zealand',   flag:'🇳🇿',gfr:86.3,etr:83.1,ict:84.6,tcm:87.2,dtf:85.4,sgt:89.8,grp:94.6,trend:-0.2,tier:'TOP',  region:'Oceania',      move:-1},
  {rank:6, name:'South Korea',   flag:'🇰🇷',gfr:86.9,etr:84.3,ict:93.1,tcm:82.6,dtf:94.8,sgt:78.4,grp:88.2,trend:+0.4,tier:'TOP',  region:'Asia Pacific', move:+1},
  {rank:7, name:'Sweden',        flag:'🇸🇪',gfr:85.8,etr:82.4,ict:90.2,tcm:83.4,dtf:88.6,sgt:92.4,grp:92.8,trend:+0.1,tier:'TOP',  region:'Europe',       move:0},
  {rank:8, name:'United Kingdom',flag:'🇬🇧',gfr:84.2,etr:81.6,ict:87.4,tcm:85.8,dtf:86.2,sgt:81.4,grp:89.6,trend:-0.3,tier:'TOP',  region:'Europe',       move:0},
  {rank:9, name:'UAE',           flag:'🇦🇪',gfr:83.8,etr:86.4,ict:82.1,tcm:88.6,dtf:84.2,sgt:76.8,grp:88.4,trend:+1.4,tier:'TOP',  region:'Middle East',  move:+2},
  {rank:10,name:'Germany',       flag:'🇩🇪',gfr:83.1,etr:84.2,ict:85.6,tcm:81.4,dtf:82.8,sgt:85.6,grp:88.2,trend:-0.2,tier:'TOP',  region:'Europe',       move:0},
  {rank:11,name:'United States', flag:'🇺🇸',gfr:82.6,etr:83.8,ict:88.4,tcm:84.2,dtf:89.6,sgt:72.4,grp:82.8,trend:-0.1,tier:'TOP',  region:'Americas',     move:0},
  {rank:12,name:'Japan',         flag:'🇯🇵',gfr:81.4,etr:79.8,ict:84.2,tcm:78.6,dtf:82.4,sgt:82.6,grp:86.8,trend:+0.2,tier:'TOP',  region:'Asia Pacific', move:0},
  {rank:13,name:'Canada',        flag:'🇨🇦',gfr:80.8,etr:78.4,ict:82.6,tcm:82.4,dtf:81.6,sgt:80.4,grp:88.4,trend:0.0, tier:'TOP',  region:'Americas',     move:0},
  {rank:14,name:'Malaysia',      flag:'🇲🇾',gfr:79.2,etr:78.6,ict:76.4,tcm:81.8,dtf:78.2,sgt:74.6,grp:82.4,trend:+0.6,tier:'HIGH', region:'Asia Pacific', move:+1},
  {rank:15,name:'Saudi Arabia',  flag:'🇸🇦',gfr:78.6,etr:82.4,ict:74.2,tcm:80.6,dtf:76.8,sgt:68.4,grp:82.6,trend:+2.2,tier:'HIGH', region:'Middle East',  move:+3},
  {rank:16,name:'Thailand',      flag:'🇹🇭',gfr:77.4,etr:75.8,ict:72.6,tcm:78.4,dtf:74.6,sgt:72.8,grp:78.4,trend:+0.3,tier:'HIGH', region:'Asia Pacific', move:0},
  {rank:17,name:'Vietnam',       flag:'🇻🇳',gfr:76.8,etr:74.2,ict:71.4,tcm:77.6,dtf:72.4,sgt:74.2,grp:74.8,trend:+0.8,tier:'HIGH', region:'Asia Pacific', move:+1},
  {rank:18,name:'India',         flag:'🇮🇳',gfr:75.6,etr:72.8,ict:76.4,tcm:74.2,dtf:72.8,sgt:68.6,grp:76.2,trend:+1.1,tier:'HIGH', region:'Asia Pacific', move:+2},
  {rank:19,name:'Indonesia',     flag:'🇮🇩',gfr:74.2,etr:72.4,ict:68.6,tcm:74.8,dtf:68.4,sgt:70.4,grp:74.6,trend:+0.4,tier:'HIGH', region:'Asia Pacific', move:0},
  {rank:20,name:'Brazil',        flag:'🇧🇷',gfr:70.8,etr:68.4,ict:69.2,tcm:70.4,dtf:66.8,sgt:72.6,grp:68.4,trend:+0.6,tier:'HIGH', region:'Americas',     move:0},
  {rank:21,name:'Morocco',       flag:'🇲🇦',gfr:68.4,etr:66.8,ict:64.2,tcm:68.6,dtf:62.4,sgt:66.8,grp:70.2,trend:+0.8,tier:'HIGH', region:'Africa',       move:+2},
  {rank:22,name:'Mexico',        flag:'🇲🇽',gfr:67.2,etr:65.4,ict:64.8,tcm:68.2,dtf:62.8,sgt:64.4,grp:66.8,trend:+0.2,tier:'HIGH', region:'Americas',     move:0},
  {rank:23,name:'Turkey',        flag:'🇹🇷',gfr:64.8,etr:63.2,ict:63.6,tcm:65.4,dtf:62.4,sgt:62.8,grp:62.4,trend:-0.4,tier:'HIGH', region:'Europe',       move:-2},
  {rank:24,name:'Egypt',         flag:'🇪🇬',gfr:62.4,etr:60.8,ict:58.6,tcm:62.4,dtf:56.8,sgt:62.4,grp:64.8,trend:+0.4,tier:'HIGH', region:'Africa',       move:0},
  {rank:25,name:'Nigeria',       flag:'🇳🇬',gfr:54.6,etr:52.4,ict:50.8,tcm:54.2,dtf:48.6,sgt:56.4,grp:52.8,trend:+0.2,tier:'DEV',  region:'Africa',       move:0},
];

function sc(v: number) { return v>=80?'#00ffc8':v>=60?'#00d4ff':v>=40?'#ffd700':'#ff4466'; }

function RadarChart({ data, size=140, colors=['#00ffc8'] }: { data: number[][]; size?: number; colors?: string[] }) {
  const n = 6; const cx = size/2, cy = size/2, r = size*0.38;
  const labels = ['ETR','ICT','TCM','DTF','SGT','GRP'];
  function pt(i: number, v: number) {
    const a = (Math.PI*2*i/n) - Math.PI/2;
    return { x: cx + (v/100)*r*Math.cos(a), y: cy + (v/100)*r*Math.sin(a) };
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[20,40,60,80,100].map(l => {
        const ps = Array.from({length:n},(_,i)=>pt(i,l));
        return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(0,255,200,0.06)" strokeWidth="0.5"/>;
      })}
      {Array.from({length:n},(_,i)=>{const p=pt(i,100);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,255,200,0.06)" strokeWidth="0.5"/>;
      })}
      {data.map((vals, di) => {
        const pts = vals.map((v,i) => pt(i, v));
        const poly = pts.map(p=>`${p.x},${p.y}`).join(' ');
        const c = colors[di % colors.length];
        return (
          <g key={di}>
            <polygon points={poly} fill={c+'15'} stroke={c} strokeWidth="1.5" strokeOpacity="0.8"/>
            {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={c} style={{filter:`drop-shadow(0 0 4px ${c})`}}/>)}
          </g>
        );
      })}
      {labels.map((label,i) => {
        const p = pt(i, 116);
        return <text key={label} x={p.x} y={p.y} fontSize="7.5" fill="rgba(232,244,248,0.45)" textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace">{label}</text>;
      })}
    </svg>
  );
}

const COMPARE_COLORS = ['#00ffc8','#00d4ff','#ffd700','#9b59b6'];

export default function GFRPage() {
  const [tab, setTab] = useState('ranking');
  const [sortCol, setSortCol] = useState('rank');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [selRegion, setSelRegion] = useState('ALL');
  const [selTier, setSelTier] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selCountry, setSelCountry] = useState(COUNTRIES[0]);
  const [compareSet, setCompareSet] = useState(['Singapore','UAE','Malaysia','Saudi Arabia']);

  const filtered = useMemo(() => {
    let d = [...COUNTRIES];
    if (selRegion !== 'ALL') d = d.filter(c => c.region === selRegion);
    if (selTier !== 'ALL') d = d.filter(c => c.tier === selTier);
    if (search) d = d.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    d.sort((a,b) => {
      const av = (a as any)[sortCol]??0, bv = (b as any)[sortCol]??0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return d;
  }, [sortCol, sortDir, selRegion, selTier, search]);

  const regions = ['ALL', ...Array.from(new Set(COUNTRIES.map(c=>c.region)))];
  const compareCountries = COUNTRIES.filter(c => compareSet.includes(c.name));

  function toggleCompare(name: string) {
    setCompareSet(s => s.includes(name) ? s.filter(x=>x!==name) : [...s.slice(-3), name]);
  }

  const regionOptions = regions.map(r => ({ value: r, label: r === 'ALL' ? 'All Regions' : r }));
  const tierOptions = [
    {value:'ALL',label:'All Tiers'},
    {value:'TOP',label:'TOP Tier (≥80)'},
    {value:'HIGH',label:'HIGH Tier (60-79)'},
    {value:'DEV',label:'DEV (<60)'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a,#0a1628)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.08)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',gap:'10px',alignItems:'center',marginBottom:'8px',flexWrap:'wrap'}}>
            <Award size={16} color="#ffd700"/>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(255,215,0,0.7)',letterSpacing:'0.18em',fontFamily:"'Orbitron','Inter',sans-serif"}}>GFR RANKING 2026</div>
            <span style={{fontSize:'9px',padding:'2px 8px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'4px',color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>COMPARABLE TO IMD WCR · KEARNEY GCR · WORLD HAPPINESS REPORT</span>
          </div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'6px'}}>Global Future Readiness Ranking</h1>
          <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)',marginBottom:'16px'}}>6-dimension composite · 25 economies · AI-updated weekly · Compare tab with radar + bar charts</p>
          <div style={{padding:'8px 14px',background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'7px',display:'inline-block'}}>
            <span style={{fontSize:'10px',color:'rgba(232,244,248,0.5)',fontFamily:"'JetBrains Mono',monospace"}}>GFR = (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:'rgba(6,15,26,0.95)',borderBottom:'1px solid rgba(0,255,200,0.06)',backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1540px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['ranking','📊 Ranking Table'],['compare','⚖ Compare Economies'],['methodology','🔬 Methodology']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'13px 20px',border:'none',borderBottom:`2px solid ${tab===t?'#ffd700':'transparent'}`,background:'transparent',fontSize:'12px',fontWeight:tab===t?700:400,color:tab===t?'#ffd700':'rgba(232,244,248,0.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",marginBottom:'-1px',transition:'all 200ms'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>

        {/* ── RANKING TAB ─────────────────────────────────────────── */}
        {tab === 'ranking' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:'16px',alignItems:'start'}}>
            <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',overflow:'hidden'}}>
              {/* Filters */}
              <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center',background:'rgba(0,0,0,0.2)'}}>
                <input placeholder="Search economy..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{padding:'7px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'12px',outline:'none',fontFamily:"'Inter',sans-serif",color:'#e8f4f8',minWidth:'160px'}}/>
                <ScrollableSelect value={selRegion} onChange={setSelRegion} width="150px" options={regionOptions} accentColor="#00ffc8"/>
                <ScrollableSelect value={selTier} onChange={setSelTier} width="130px" options={tierOptions} accentColor="#ffd700"/>
                <span style={{marginLeft:'auto',fontSize:'10px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} economies</span>
                <button style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:700,color:'#00ffc8',fontFamily:"'Inter',sans-serif"}}>
                  <Download size={11}/> Export
                </button>
              </div>

              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(0,0,0,0.3)'}}>
                      {[['rank','#'],['name','Economy'],['gfr','GFR'],['etr','ETR'],['ict','ICT'],['tcm','TCM'],['dtf','DTF'],['sgt','SGT'],['grp','GRP'],['trend','Trend']].map(([col,lbl])=>(
                        <th key={col} onClick={()=>{if(sortCol===col)setSortDir(d=>d==='asc'?'desc':'asc');else{setSortCol(col);setSortDir('desc');}}}
                          style={{padding:'10px 12px',textAlign:lbl==='Economy'?'left':'center',fontWeight:700,color:sortCol===col?'#00ffc8':'rgba(232,244,248,0.3)',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.08em',borderBottom:'1px solid rgba(0,255,200,0.06)',whiteSpace:'nowrap',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",transition:'color 150ms'}}>
                          {lbl}{sortCol===col?(sortDir==='asc'?' ↑':' ↓'):''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c,ri) => {
                      const tierStyle = c.tier==='TOP'?{bg:'rgba(0,255,200,0.08)',color:'#00ffc8',border:'rgba(0,255,200,0.2)'}:c.tier==='HIGH'?{bg:'rgba(0,180,216,0.08)',color:'#00b4d8',border:'rgba(0,180,216,0.2)'}:{bg:'rgba(255,215,0,0.08)',color:'#ffd700',border:'rgba(255,215,0,0.2)'};
                      return (
                        <tr key={c.name} onClick={()=>setSelCountry(c)}
                          style={{borderBottom:'1px solid rgba(255,255,255,0.025)',cursor:'pointer',transition:'background 150ms ease',background:selCountry.name===c.name?'rgba(255,215,0,0.03)':'transparent'}}
                          onMouseEnter={e=>{if(selCountry.name!==c.name)e.currentTarget.style.background='rgba(0,255,200,0.02)';}}
                          onMouseLeave={e=>{if(selCountry.name!==c.name)e.currentTarget.style.background='transparent';}}>
                          <td style={{padding:'11px 12px',textAlign:'center'}}>
                            <div style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.4)',fontFamily:"'JetBrains Mono',monospace"}}>{c.rank===1?'🥇':c.rank===2?'🥈':c.rank===3?'🥉':c.rank}</div>
                            {c.move!==0 && <div style={{fontSize:'8px',color:c.move>0?'#00ffc8':'#ff4466',fontWeight:700}}>{c.move>0?`↑${c.move}`:`↓${Math.abs(c.move)}`}</div>}
                          </td>
                          <td style={{padding:'11px 12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
                              <span style={{fontSize:'20px'}}>{c.flag}</span>
                              <div>
                                <div style={{fontWeight:700,color:'#e8f4f8',fontSize:'13px'}}>{c.name}</div>
                                <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>{c.region}</div>
                              </div>
                              <span style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'10px',background:tierStyle.bg,color:tierStyle.color,border:`1px solid ${tierStyle.border}`,letterSpacing:'0.04em'}}>{c.tier}</span>
                            </div>
                          </td>
                          <td style={{padding:'11px 8px',textAlign:'center'}}>
                            <div style={{fontSize:'16px',fontWeight:900,color:sc(c.gfr),fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 10px ${sc(c.gfr)}60`}}>{c.gfr}</div>
                            <div style={{width:'44px',height:'3px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',margin:'3px auto 0',overflow:'hidden'}}><div style={{height:'100%',width:c.gfr+'%',background:sc(c.gfr),borderRadius:'2px'}}/></div>
                          </td>
                          {[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp].map((v,vi)=>(
                            <td key={vi} style={{padding:'11px 8px',textAlign:'center',fontSize:'12px',fontWeight:600,color:sc(v),fontFamily:"'JetBrains Mono',monospace"}}>{v}</td>
                          ))}
                          <td style={{padding:'11px 12px',textAlign:'center'}}>
                            <span style={{display:'flex',alignItems:'center',gap:'3px',justifyContent:'center',fontSize:'11px',fontWeight:700,color:c.trend>0?'#00ffc8':c.trend<0?'#ff4466':'rgba(232,244,248,0.3)'}}>
                              {c.trend>0?<TrendingUp size={11}/>:c.trend<0?<TrendingDown size={11}/>:null}
                              {c.trend!==0?(c.trend>0?'+':'')+c.trend:'—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side panel */}
            <div style={{background:'rgba(10,22,40,0.9)',border:'1px solid rgba(0,180,216,0.15)',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{background:'linear-gradient(135deg,rgba(0,255,200,0.06),rgba(0,180,216,0.03))',padding:'16px 18px',borderBottom:'1px solid rgba(0,255,200,0.08)'}}>
                <div style={{fontSize:'8px',color:'rgba(0,255,200,0.4)',letterSpacing:'0.15em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SELECTED ECONOMY</div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}}>
                  <span style={{fontSize:'36px'}}>{selCountry.flag}</span>
                  <div>
                    <div style={{fontSize:'17px',fontWeight:900,color:'#e8f4f8'}}>{selCountry.name}</div>
                    <div style={{fontSize:'10px',color:'rgba(0,255,200,0.5)'}}>{selCountry.region} · #{selCountry.rank}</div>
                  </div>
                  <div style={{marginLeft:'auto',textAlign:'right'}}>
                    <div style={{fontSize:'44px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 20px rgba(0,255,200,0.5)',lineHeight:1}}>{selCountry.gfr}</div>
                    <div style={{fontSize:'10px',color:selCountry.trend>0?'#00ffc8':'#ff4466',fontWeight:700,display:'flex',alignItems:'center',gap:'2px',justifyContent:'flex-end'}}>
                      {selCountry.trend>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{selCountry.trend>0?'+':''}{selCountry.trend}
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
                  <RadarChart data={[[selCountry.etr,selCountry.ict,selCountry.tcm,selCountry.dtf,selCountry.sgt,selCountry.grp]]} size={150}/>
                </div>
                {DIMS.map(dim => {
                  const v = (selCountry as any)[dim.code.toLowerCase()];
                  return (
                    <div key={dim.code} style={{marginBottom:'7px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                        <span style={{fontSize:'9px',fontWeight:600,color:'rgba(232,244,248,0.5)'}}>{dim.code} <span style={{color:'rgba(232,244,248,0.25)',fontSize:'8px'}}>({(dim.weight*100).toFixed(0)}%)</span></span>
                        <span style={{fontSize:'11px',fontWeight:800,color:dim.color,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                      </div>
                      <div style={{height:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:v+'%',background:dim.color,borderRadius:'2px',boxShadow:`0 0 5px ${dim.color}60`}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{padding:'12px 16px',display:'flex',gap:'8px'}}>
                <button onClick={()=>{toggleCompare(selCountry.name);setTab('compare');}} style={{flex:1,padding:'8px',background:'rgba(255,215,0,0.07)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:700,color:'#ffd700',fontFamily:"'Inter',sans-serif",textAlign:'center'}}>
                  {compareSet.includes(selCountry.name)?'Remove from Compare':'Add to Compare'}
                </button>
                <Link href="/reports" style={{flex:1,padding:'8px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00ffc8',textAlign:'center'}}>Report</Link>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPARE TAB ─────────────────────────────────────────── */}
        {tab === 'compare' && (
          <div>
            {/* Economy selector */}
            <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',padding:'16px 18px',marginBottom:'14px'}}>
              <div style={{fontSize:'10px',fontWeight:700,color:'rgba(232,244,248,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'12px'}}>Select up to 4 economies to compare</div>
              <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
                {COUNTRIES.map(c => {
                  const idx = compareSet.indexOf(c.name);
                  const isIn = idx !== -1;
                  const col = isIn ? COMPARE_COLORS[idx] : 'rgba(255,255,255,0.06)';
                  return (
                    <button key={c.name} onClick={() => toggleCompare(c.name)}
                      style={{padding:'5px 12px',borderRadius:'20px',border:`2px solid ${isIn?col+'60':'rgba(255,255,255,0.07)'}`,background:isIn?col+'10':'rgba(255,255,255,0.02)',cursor:'pointer',fontSize:'11px',fontWeight:isIn?700:400,color:isIn?col:'rgba(232,244,248,0.45)',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:'5px',transition:'all 150ms'}}>
                      {c.flag} {c.name}
                      {isIn && <span style={{fontSize:'8px',fontWeight:800,padding:'0 4px',background:col+'20',borderRadius:'4px'}}>#{idx+1}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {compareCountries.length >= 2 && (
              <>
                {/* Radar chart comparison */}
                <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',padding:'22px',marginBottom:'14px'}}>
                  <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.5)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'16px'}}>Radar Comparison — All 6 Dimensions</div>
                  <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:'24px',alignItems:'center'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
                      <RadarChart
                        data={compareCountries.map(c => [c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp])}
                        size={220}
                        colors={COMPARE_COLORS}
                      />
                      <div style={{display:'flex',gap:'10px',flexWrap:'wrap',justifyContent:'center'}}>
                        {compareCountries.map((c,i) => (
                          <div key={c.name} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:COMPARE_COLORS[i]}}>
                            <div style={{width:'10px',height:'3px',background:COMPARE_COLORS[i],borderRadius:'2px'}}/>
                            {c.flag} {c.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Bar chart per dimension */}
                    <div>
                      {DIMS.map(dim => {
                        const vals = compareCountries.map(c => ({ name:c.name, flag:c.flag, v:(c as any)[dim.code.toLowerCase()], i:compareCountries.indexOf(c) }));
                        const max = Math.max(...vals.map(v=>v.v));
                        return (
                          <div key={dim.code} style={{marginBottom:'12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
                              <span style={{fontSize:'10px',fontWeight:700,color:dim.color,fontFamily:"'JetBrains Mono',monospace",minWidth:'32px'}}>{dim.code}</span>
                              <span style={{fontSize:'10px',color:'rgba(232,244,248,0.35)'}}>{dim.name} ({(dim.weight*100).toFixed(0)}%)</span>
                            </div>
                            <div style={{display:'flex',gap:'6px'}}>
                              {vals.map(({name,flag,v,i}) => (
                                <div key={name} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                                  <div style={{width:'100%',height:'32px',background:'rgba(255,255,255,0.04)',borderRadius:'4px',overflow:'hidden',position:'relative',display:'flex',alignItems:'flex-end'}}>
                                    <div style={{width:'100%',height:(v/100*32)+'px',background:COMPARE_COLORS[i],borderRadius:'2px',boxShadow:`0 0 6px ${COMPARE_COLORS[i]}60`,transition:'height 0.8s ease',position:'relative'}}>
                                      {v === max && <div style={{position:'absolute',top:'-2px',left:0,right:0,height:'2px',background:'#ffd700',borderRadius:'1px'}}/>}
                                    </div>
                                  </div>
                                  <div style={{display:'flex',alignItems:'center',gap:'3px'}}>
                                    <span style={{fontSize:'9px'}}>{flag}</span>
                                    <span style={{fontSize:'10px',fontWeight:v===max?900:600,color:v===max?COMPARE_COLORS[i]:'rgba(232,244,248,0.5)',fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                                    {v===max && <span style={{fontSize:'7px',color:'#ffd700',fontWeight:800}}>★</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* GFR total comparison bars */}
                <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',padding:'22px',marginBottom:'14px'}}>
                  <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.5)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'18px'}}>Overall GFR Score Comparison</div>
                  {compareCountries.map((c,i) => (
                    <div key={c.name} style={{marginBottom:'16px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                        <span style={{fontSize:'14px',fontWeight:700,color:'rgba(232,244,248,0.85)',display:'flex',alignItems:'center',gap:'8px'}}>{c.flag} {c.name} <span style={{fontSize:'10px',color:'rgba(232,244,248,0.35)'}}>{c.region} · Rank #{c.rank}</span></span>
                        <span style={{fontSize:'22px',fontWeight:900,color:COMPARE_COLORS[i],fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 12px ${COMPARE_COLORS[i]}60`}}>{c.gfr}</span>
                      </div>
                      <div style={{height:'12px',background:'rgba(255,255,255,0.05)',borderRadius:'6px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:c.gfr+'%',background:`linear-gradient(90deg, ${COMPARE_COLORS[i]}60, ${COMPARE_COLORS[i]})`,borderRadius:'6px',transition:'width 0.8s ease',boxShadow:`0 0 8px ${COMPARE_COLORS[i]}60`}}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed scorecard table */}
                <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',overflow:'hidden'}}>
                  <div style={{padding:'12px 18px',borderBottom:'1px solid rgba(0,255,200,0.06)',fontSize:'10px',fontWeight:700,color:'rgba(232,244,248,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',background:'rgba(0,0,0,0.2)'}}>Scorecard — All Dimensions</div>
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                      <thead>
                        <tr style={{background:'rgba(0,0,0,0.2)'}}>
                          <th style={{padding:'9px 14px',textAlign:'left',fontWeight:700,color:'rgba(232,244,248,0.3)',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.08em',borderBottom:'1px solid rgba(0,255,200,0.06)'}}>Dimension</th>
                          {compareCountries.map((c,i) => (
                            <th key={c.name} style={{padding:'9px 14px',textAlign:'center',fontWeight:700,color:COMPARE_COLORS[i],textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.06em',borderBottom:'1px solid rgba(0,255,200,0.06)'}}>
                              {c.flag} {c.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[{code:'GFR',name:'GFR Total',weight:1},...DIMS].map(dim => {
                          const vals = compareCountries.map(c => (c as any)[dim.code.toLowerCase()]);
                          const best = Math.max(...vals);
                          return (
                            <tr key={dim.code} style={{borderBottom:'1px solid rgba(255,255,255,0.025)'}}>
                              <td style={{padding:'9px 14px',fontSize:'11px',fontWeight:600,color:'rgba(232,244,248,0.65)'}}>{dim.name || dim.code} {dim.weight < 1 ? <span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>({(dim.weight*100).toFixed(0)}%)</span> : ''}</td>
                              {vals.map((v,ci) => (
                                <td key={ci} style={{padding:'9px 14px',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontWeight:v===best?900:600,fontSize:dim.code==='GFR'?'16px':'13px',color:v===best?COMPARE_COLORS[ci]:sc(v)}}>
                                  {v===best?`★ ${v}`:v}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {compareCountries.length < 2 && (
              <div style={{background:'rgba(10,22,40,0.7)',borderRadius:'14px',padding:'56px',textAlign:'center',border:'1px solid rgba(0,180,216,0.08)'}}>
                <div style={{fontSize:'40px',marginBottom:'14px'}}>⚖</div>
                <div style={{fontSize:'16px',fontWeight:700,color:'rgba(232,244,248,0.6)',marginBottom:'6px'}}>Select at least 2 economies above</div>
                <div style={{fontSize:'13px',color:'rgba(232,244,248,0.35)'}}>Radar charts, bar charts, and full scorecard will appear</div>
              </div>
            )}
          </div>
        )}

        {/* ── METHODOLOGY TAB ─────────────────────────────────────── */}
        {tab === 'methodology' && (
          <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',padding:'28px'}}>
            <h2 style={{fontSize:'20px',fontWeight:900,color:'#e8f4f8',marginBottom:'8px'}}>GFR Ranking Methodology</h2>
            <p style={{fontSize:'13px',color:'rgba(232,244,248,0.5)',marginBottom:'24px',lineHeight:1.75,maxWidth:'700px'}}>The Global Future Readiness Ranking measures an economy's preparedness to attract and sustain FDI over the medium-to-long term. Designed to be comparable in rigour to IMD WCR, Kearney GCR, and the World Happiness Report.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>
              {DIMS.map(dim => (
                <div key={dim.code} style={{padding:'20px',background:'rgba(255,255,255,0.02)',borderRadius:'10px',border:`1px solid ${dim.color}15`,borderLeft:`3px solid ${dim.color}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                    <span style={{fontSize:'18px',fontWeight:900,color:dim.color,fontFamily:"'JetBrains Mono',monospace"}}>{dim.code}</span>
                    <span style={{fontSize:'11px',fontWeight:800,padding:'3px 9px',borderRadius:'12px',background:dim.color+'10',color:dim.color}}>{(dim.weight*100).toFixed(0)}%</span>
                  </div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.8)',marginBottom:'6px'}}>{dim.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer/>
    </div>
  );
}
