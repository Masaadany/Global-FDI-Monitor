'use client';
import { useState } from 'react';
import {
  BarChart3, Globe, TrendingUp, Target, Activity, Shield, CheckCircle,
  ArrowRight, FileText, Download, Filter, Plus, Search, Zap, Building2
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';
import ReadOnlyOverlay from '@/components/ReadOnlyOverlay';
import { useTrial } from '@/lib/trialContext';

// ── DATA ──────────────────────────────────────────────────────────────────────

const LAYERS = [
  {n:1, name:'Doing Business Indicators',       weight:30, color:'#0A3D62',
   desc:'World Bank Doing Business methodology. All 10 indicators normalized using Distance-to-Frontier method.'},
  {n:2, name:'Sector Indicators',               weight:20, color:'#74BB65',
   desc:'Sector regulations, incentives, labor specialization, infrastructure, and export potential per country.'},
  {n:3, name:'Special Investment Zone Indicators',weight:25,color:'#1B6CA8',
   desc:'Land availability, occupancy rate, infrastructure readiness, zone-specific incentives, tenant clustering.'},
  {n:4, name:'Market Intelligence Matrix',      weight:25, color:'#2E86AB',
   desc:'Real-time signals from IFIs, trade organizations, development banks, central banks, and company announcements.'},
];

const DB_INDICATORS = [
  'Starting a Business','Construction Permits','Getting Electricity','Registering Property',
  'Getting Credit','Protecting Minority Investors','Paying Taxes','Trading Across Borders',
  'Enforcing Contracts','Resolving Insolvency',
];

const COUNTRIES_DATA = [
  {flag:'🇸🇬',name:'Singapore',   score:88.4, l1:92.1, l2:85.3, l3:87.2, l4:89.0, trend:'▲', mom:+0.2, tier:'Top Tier',    region:'Asia',   dbHL:['#1 Trading Across Borders','#2 Getting Credit'],
   db:[98,85,96,94,91,93,89,100,92,88],},
  {flag:'🇳🇿',name:'New Zealand', score:86.7, l1:89.5, l2:84.1, l3:85.8, l4:87.3, trend:'▼', mom:-0.1, tier:'Top Tier',    region:'Asia',   dbHL:['#1 Starting a Business','#3 Protecting Investors'],
   db:[100,80,88,87,82,90,82,92,85,84],},
  {flag:'🇩🇰',name:'Denmark',     score:85.3, l1:87.2, l2:83.5, l3:84.9, l4:85.6, trend:'▲', mom:+0.3, tier:'Top Tier',    region:'Europe', dbHL:['#1 Contract Enforcement','#2 Getting Electricity'],
   db:[95,88,96,85,87,84,90,91,98,80],},
  {flag:'🇰🇷',name:'South Korea', score:84.1, l1:86.0, l2:82.8, l3:83.5, l4:84.2, trend:'▲', mom:+0.1, tier:'Top Tier',    region:'Asia',   dbHL:['#1 Registering Property','#5 Resolving Insolvency'],
   db:[90,84,92,97,80,86,82,88,87,84],},
  {flag:'🇦🇪',name:'UAE',         score:83.5, l1:85.2, l2:82.1, l3:84.8, l4:82.0, trend:'▲', mom:+0.4, tier:'Top Tier',    region:'Middle East', dbHL:['#1 Getting Electricity','#2 Starting a Business'],
   db:[92,88,95,84,83,85,86,90,80,82],},
  {flag:'🇩🇪',name:'Germany',     score:82.3, l1:84.1, l2:81.0, l3:82.5, l4:81.6, trend:'→', mom: 0.0, tier:'Top Tier',    region:'Europe', dbHL:['#1 Getting Electricity','#3 Enforcing Contracts'],
   db:[85,82,95,86,85,84,88,87,90,82],},
  {flag:'🇸🇦',name:'Saudi Arabia',score:80.2, l1:82.0, l2:79.5, l3:81.0, l4:78.3, trend:'▲', mom:+0.6, tier:'Top Tier',    region:'Middle East', dbHL:['#1 Starting a Business','#4 Getting Credit'],
   db:[88,78,86,80,82,79,84,85,76,78],},
  {flag:'🇻🇳',name:'Vietnam',     score:79.4, l1:80.5, l2:79.1, l3:78.9, l4:79.1, trend:'▲', mom:+0.5, tier:'High Tier',  region:'Asia',   dbHL:['#2 Trading Across Borders','#7 Getting Electricity'],
   db:[84,62,78,71,80,82,73,91,65,68],},
  {flag:'🇲🇾',name:'Malaysia',    score:78.2, l1:79.8, l2:77.5, l3:78.1, l4:77.4, trend:'▲', mom:+0.3, tier:'High Tier',  region:'Asia',   dbHL:['#2 Getting Electricity','#3 Trading Across Borders'],
   db:[88,70,82,78,84,80,76,88,72,74],},
  {flag:'🇹🇭',name:'Thailand',    score:77.1, l1:78.2, l2:76.8, l3:77.0, l4:76.4, trend:'→', mom: 0.0, tier:'High Tier',  region:'Asia',   dbHL:['#3 Starting a Business','#4 Getting Credit'],
   db:[82,68,76,74,82,78,72,85,70,72],},
  {flag:'🇮🇩',name:'Indonesia',   score:74.8, l1:76.0, l2:74.5, l3:74.2, l4:74.5, trend:'▲', mom:+0.2, tier:'High Tier',  region:'Asia',   dbHL:['#5 Trading Across Borders','#6 Getting Credit'],
   db:[75,58,71,68,76,74,68,80,65,66],},
  {flag:'🇮🇳',name:'India',       score:72.1, l1:74.2, l2:71.5, l3:72.0, l4:70.7, trend:'▲', mom:+0.4, tier:'High Tier',  region:'Asia',   dbHL:['#3 Paying Taxes','#4 Getting Credit'],
   db:[80,56,85,62,74,72,82,78,58,64],},
];

const REGIONS    = ['All','Asia','Europe','Americas','Africa','Middle East'];
const SECTORS    = ['All','Manufacturing','Digital Economy','Agriculture','Services','Energy'];
const INV_SIZES  = ['All','$1M–$50M','$50M–$250M','$250M–$1B','$1B+'];
const TIER_C: Record<string,string> = {'Top Tier':'#74BB65','High Tier':'#0A3D62','Developing Tier':'#696969'};
const TIER_BG: Record<string,string> = {'Top Tier':'rgba(116,187,101,0.1)','High Tier':'rgba(10,61,98,0.1)','Developing Tier':'rgba(105,105,105,0.1)'};

// ── IMPACT DATA ──
const IMPACT_SCENARIOS: Record<string,any> = {
  '$50M':  {gdp:'+0.4%',jobs:'1,200 direct / 2,400 indirect',taxSave:'$4.2M',timeOp:'9–14 months', polRisk:'Low',    mktRisk:'Low-Medium',  roi:12},
  '$100M': {gdp:'+0.8%',jobs:'2,500 direct / 5,000 indirect',taxSave:'$8.5M',timeOp:'12–18 months',polRisk:'Low',    mktRisk:'Medium',       roi:15},
  '$250M': {gdp:'+1.9%',jobs:'5,800 direct / 11,600 indirect',taxSave:'$21M',timeOp:'18–24 months',polRisk:'Low-Medium',mktRisk:'Medium',    roi:18},
  '$500M': {gdp:'+3.5%',jobs:'11,000 direct / 22,000 indirect',taxSave:'$42M',timeOp:'24–36 months',polRisk:'Medium',mktRisk:'Medium-High', roi:20},
};

// ── SUBCOMPONENTS ──────────────────────────────────────────────────────────────

function ScoreBar({val,max=100,color,height=8}:{val:number,max?:number,color:string,height?:number}) {
  return (
    <div style={{height,borderRadius:height/2,background:'rgba(10,61,98,0.07)',overflow:'hidden'}}>
      <div style={{height:'100%',borderRadius:height/2,width:`${(val/max)*100}%`,background:color,transition:'width 0.5s ease'}}/>
    </div>
  );
}

function TierBadge({tier}:{tier:string}) {
  return (
    <span style={{fontSize:'11px',fontWeight:700,padding:'3px 9px',borderRadius:'12px',
      background:TIER_BG[tier],color:TIER_C[tier],whiteSpace:'nowrap'}}>
      {tier}
    </span>
  );
}

// ── TAB: OVERVIEW ─────────────────────────────────────────────────────────────

function OverviewTab({setTab}:{setTab:(t:string)=>void}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      {/* Intro */}
      <div className="gfm-card" style={{padding:'24px'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
          <Globe size={16} color="#74BB65"/> Section Overview
        </div>
        <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.75',margin:0}}>
          The Investment Analysis module provides comprehensive tools for evaluating global investment opportunities across countries, sectors, and special investment zones. This module combines World Bank Doing Business methodology with advanced sector-level intelligence, zone-specific reality data, and real-time market signals to deliver actionable investment insights.
        </p>
      </div>

      {/* Available tools */}
      <div className="gfm-card" style={{padding:'24px'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
          <Target size={16} color="#74BB65"/> Available Tools
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {[
            {icon:'📊',tab:'analysis',title:'Global Investment Analysis',desc:'Full country analysis with detailed scores, trends, and component breakdowns'},
            {icon:'📈',tab:'benchmark',title:'Benchmark',desc:'Compare multiple countries or sectors side-by-side to identify relative strengths and weaknesses'},
            {icon:'📉',tab:'impact',title:'Impact Analysis',desc:'Model investment scenarios to project economic impact, operational feasibility, and return on investment'},
          ].map(t=>(
            <div key={t.tab} onClick={()=>setTab(t.tab)}
              style={{display:'flex',alignItems:'center',gap:'12px',padding:'16px',borderRadius:'10px',
                background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.08)',cursor:'pointer',
                transition:'all 0.15s'}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='#74BB65')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(10,61,98,0.08)')}>
              <span style={{fontSize:'28px',flexShrink:0}}>{t.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'2px'}}>{t.title}</div>
                <div style={{fontSize:'12px',color:'#696969'}}>{t.desc}</div>
              </div>
              <ArrowRight size={16} color="#74BB65"/>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="gfm-card" style={{padding:'24px'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
          <Shield size={16} color="#74BB65"/> Methodology Overview — Unified Scoring Model
        </div>
        <p style={{fontSize:'13px',color:'#696969',marginBottom:'14px'}}>
          All scores in this module are derived from the Unified Scoring Model, which combines four core layers:
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {LAYERS.map(l=>(
            <div key={l.n} style={{padding:'16px',borderRadius:'10px',background:`${l.color}06`,
              border:`1px solid ${l.color}20`,borderLeft:`4px solid ${l.color}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:l.color}}>
                  LAYER {l.n}: {l.name.toUpperCase()}
                </div>
                <span style={{fontSize:'12px',fontWeight:800,color:l.color,
                  background:`${l.color}12`,padding:'3px 10px',borderRadius:'10px'}}>Weight: {l.weight}%</span>
              </div>
              <p style={{fontSize:'12px',color:'#696969',margin:0,lineHeight:'1.5'}}>{l.desc}</p>
              {l.n===1 && (
                <div style={{marginTop:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3px'}}>
                  {DB_INDICATORS.map(i=>(
                    <div key={i} style={{fontSize:'11px',color:'#696969',display:'flex',alignItems:'center',gap:'4px'}}>
                      <CheckCircle size={10} color={l.color}/>{i}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formula */}
      <div className="gfm-card" style={{padding:'24px',borderLeft:'4px solid #74BB65'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
          <BarChart3 size={16} color="#74BB65"/> Global Opportunity Score Analysis
        </div>
        <div style={{fontFamily:'monospace',fontSize:'13px',background:'rgba(10,61,98,0.04)',
          padding:'16px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.1)',
          color:'#0A3D62',lineHeight:'1.9',marginBottom:'14px'}}>
          Global Opportunity Score Analysis =<br/>
          &nbsp;&nbsp;(0.30 × Layer 1: Doing Business Indicators) +<br/>
          &nbsp;&nbsp;(0.20 × Layer 2: Sector Indicators) +<br/>
          &nbsp;&nbsp;(0.25 × Layer 3: Special Investment Zone Indicators) +<br/>
          &nbsp;&nbsp;(0.25 × Layer 4: Market Intelligence Matrix)
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
          {[{range:'80–100',label:'Top Tier',color:'#74BB65',bg:'rgba(116,187,101,0.1)'},
            {range:'60–79', label:'High Tier',color:'#0A3D62',bg:'rgba(10,61,98,0.1)'},
            {range:'Below 60',label:'Developing Tier',color:'#696969',bg:'rgba(105,105,105,0.1)'}].map(t=>(
            <div key={t.label} style={{padding:'12px',borderRadius:'8px',background:t.bg,textAlign:'center'}}>
              <div style={{fontSize:'14px',fontWeight:800,color:t.color,fontFamily:'monospace'}}>{t.range}</div>
              <div style={{fontSize:'11px',fontWeight:700,color:t.color,marginTop:'3px'}}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="gfm-card" style={{padding:'20px'}}>
        <div style={{fontSize:'13px',fontWeight:700,color:'#696969',textTransform:'uppercase',
          letterSpacing:'0.06em',marginBottom:'12px'}}>Quick Links</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
          {[{tab:'analysis',label:'Global Investment Analysis',icon:BarChart3},
            {tab:'benchmark',label:'Benchmark',icon:Target},
            {tab:'impact',label:'Impact Analysis',icon:Activity}].map(({tab,label,icon:Icon})=>(
            <button key={tab} onClick={()=>setTab(tab)}
              style={{padding:'14px',borderRadius:'10px',background:'#0A3D62',color:'white',
                border:'none',cursor:'pointer',fontSize:'13px',fontWeight:700,
                display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',transition:'background 0.15s'}}
              onMouseEnter={e=>(e.currentTarget.style.background='#74BB65')}
              onMouseLeave={e=>(e.currentTarget.style.background='#0A3D62')}>
              <Icon size={14}/>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB: GLOBAL INVESTMENT ANALYSIS ──────────────────────────────────────────

function AnalysisTab() {
  const [region,  setRegion]  = useState('All');
  const [sector,  setSector]  = useState('All');
  const [invSize, setInvSize] = useState('All');
  const [search,  setSearch]  = useState('');
  const [expanded,setExpanded]= useState<string|null>(null);
  const trial = useTrial();

  const filtered = COUNTRIES_DATA.filter(c => {
    const mr = region==='All' || c.region===region;
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return mr && ms;
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      {/* Filters */}
      <div className="gfm-card" style={{padding:'16px'}}>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
          <Filter size={14} color="#696969"/>
          <select value={region} onChange={e=>setRegion(e.target.value)}
            style={{padding:'7px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62',background:'white'}}>
            {REGIONS.map(r=><option key={r}>Region: {r}</option>)}
          </select>
          <select value={sector} onChange={e=>setSector(e.target.value)}
            style={{padding:'7px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62',background:'white'}}>
            {SECTORS.map(s=><option key={s}>Sector: {s}</option>)}
          </select>
          <select value={invSize} onChange={e=>setInvSize(e.target.value)}
            style={{padding:'7px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62',background:'white'}}>
            {INV_SIZES.map(s=><option key={s}>Investment Size: {s}</option>)}
          </select>
          <div style={{display:'flex',alignItems:'center',gap:'6px',marginLeft:'auto'}}>
            <Search size={14} color="#696969"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search country…"
              style={{padding:'7px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',
                fontSize:'13px',color:'#000',outline:'none',background:'white',width:'160px'}}/>
          </div>
          <span style={{fontSize:'12px',color:'#696969'}}>{filtered.length} countries</span>
        </div>
      </div>

      {/* Country Analysis Table */}
      <div className="gfm-card" style={{overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',
          display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
            <BarChart3 size={14} color="#74BB65"/> Country Analysis Table
          </div>
          <div style={{fontSize:'11px',color:'#696969',fontStyle:'italic'}}>
            Sorted by Global Opportunity Score Analysis (highest first)
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'rgba(10,61,98,0.03)',borderBottom:'2px solid rgba(10,61,98,0.08)'}}>
                {['Country','Global Opportunity Score Analysis','Layer 1: Doing Business','Layer 2: Sector','Layer 3: Investment Zones','Layer 4: Market Intel','Trend','Δ MoM','Position','DB Highlights'].map(h=>(
                  <th key={h} style={{padding:'10px 12px',fontSize:'11px',fontWeight:700,color:'#696969',
                    textAlign:'left',textTransform:'uppercase',letterSpacing:'0.04em',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c,i)=>(
                <>
                  <tr key={c.name}
                    onClick={()=>setExpanded(expanded===c.name?null:c.name)}
                    style={{borderBottom:'1px solid rgba(10,61,98,0.05)',cursor:'pointer',
                      background:i%2===0?'white':'rgba(10,61,98,0.01)',transition:'background 0.15s'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(116,187,101,0.05)')}
                    onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?'white':'rgba(10,61,98,0.01)')}>
                    <td style={{padding:'12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                        <span style={{fontSize:'20px'}}>{c.flag}</span>
                        <span style={{fontWeight:700,color:'#0A3D62',fontSize:'13px'}}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{padding:'12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'16px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{c.score.toFixed(1)}</span>
                        <ScoreBar val={c.score} color={TIER_C[c.tier]} height={6}/>
                      </div>
                    </td>
                    {[c.l1,c.l2,c.l3,c.l4].map((v,j)=>(
                      <td key={j} style={{padding:'12px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                          <span style={{fontSize:'12px',fontWeight:700,color:LAYERS[j].color,fontFamily:'monospace',minWidth:'32px'}}>{v.toFixed(1)}</span>
                          <div style={{width:'48px',height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.06)'}}>
                            <div style={{height:'100%',borderRadius:'3px',width:`${v}%`,background:LAYERS[j].color}}/>
                          </div>
                        </div>
                      </td>
                    ))}
                    <td style={{padding:'12px',fontSize:'16px',fontWeight:800,
                      color:c.trend==='▲'?'#74BB65':c.trend==='▼'?'#E57373':'#696969'}}>{c.trend}</td>
                    <td style={{padding:'12px',fontFamily:'monospace',fontSize:'12px',fontWeight:700,
                      color:c.mom>0?'#74BB65':c.mom<0?'#E57373':'#696969'}}>
                      {c.mom>0?`+${c.mom.toFixed(1)}`:c.mom.toFixed(1)}
                    </td>
                    <td style={{padding:'12px'}}><TierBadge tier={c.tier}/></td>
                    <td style={{padding:'12px'}}>
                      <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                        {c.dbHL.map(h=><div key={h} style={{fontSize:'10px',color:'#696969'}}>{h}</div>)}
                      </div>
                    </td>
                  </tr>
                  {expanded===c.name && (
                    <tr key={`${c.name}-exp`}>
                      <td colSpan={10} style={{padding:'16px 20px',background:'rgba(116,187,101,0.03)',
                        borderBottom:'2px solid rgba(10,61,98,0.08)'}}>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'10px'}}>
                          Layer 1: Doing Business Indicators — {c.name}
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px'}}>
                          {DB_INDICATORS.map((ind,j)=>(
                            <div key={ind} style={{padding:'8px',borderRadius:'7px',background:'white',
                              border:'1px solid rgba(10,61,98,0.07)'}}>
                              <div style={{fontSize:'10px',color:'#696969',marginBottom:'4px',lineHeight:'1.3'}}>{ind}</div>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                <span style={{fontSize:'13px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{c.db[j]}</span>
                                <div style={{width:'36px',height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.07)'}}>
                                  <div style={{height:'100%',borderRadius:'3px',width:`${c.db[j]}%`,
                                    background:c.db[j]>=80?'#74BB65':c.db[j]>=60?'#0A3D62':'#E57373'}}/>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scale reference */}
      <div className="gfm-card" style={{padding:'18px'}}>
        <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Scale Reference</div>
        <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
          {[{range:'80–100',label:'Top Tier',color:'#74BB65',pct:100},
            {range:'60–79', label:'High Tier',color:'#0A3D62',pct:79},
            {range:'Below 60',label:'Developing Tier',color:'#696969',pct:59}].map(t=>(
            <div key={t.label} style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <span style={{fontSize:'12px',fontWeight:700,color:t.color,minWidth:'60px',fontFamily:'monospace'}}>{t.range}</span>
              <div style={{flex:1,height:'10px',borderRadius:'5px',background:'rgba(10,61,98,0.06)'}}>
                <div style={{height:'100%',borderRadius:'5px',width:`${t.pct}%`,background:t.color}}/>
              </div>
              <span style={{fontSize:'11px',fontWeight:700,color:t.color,minWidth:'100px'}}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate PDF */}
      <ReadOnlyOverlay feature="generate_report">
        <button style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 28px',
          background:'#0A3D62',color:'white',border:'none',borderRadius:'10px',
          cursor:'pointer',fontSize:'14px',fontWeight:700,alignSelf:'flex-start'}}>
          <FileText size={16}/> Generate PDF Report
        </button>
      </ReadOnlyOverlay>
    </div>
  );
}

// ── TAB: BENCHMARK ────────────────────────────────────────────────────────────

function BenchmarkTab() {
  const [selected, setSelected] = useState<string[]>(['Vietnam','Thailand','Malaysia','Indonesia']);
  const [sector,   setSector]   = useState('All Sectors');
  const trial = useTrial();

  const selData = COUNTRIES_DATA.filter(c=>selected.includes(c.name));
  const allNames = COUNTRIES_DATA.map(c=>c.name);

  function toggleCountry(name:string) {
    setSelected(s => s.includes(name) ? s.filter(x=>x!==name) : s.length<5 ? [...s,name] : s);
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      {/* Country selector */}
      <div className="gfm-card" style={{padding:'20px'}}>
        <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',
          display:'flex',alignItems:'center',gap:'6px'}}>
          <Globe size={14} color="#74BB65"/> Select Countries to Compare (min 2, max 5)
        </div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}}>
          {allNames.map(n=>(
            <button key={n} onClick={()=>toggleCountry(n)}
              style={{padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,
                cursor:'pointer',border:'none',transition:'all 0.15s',
                background:selected.includes(n)?'#0A3D62':'rgba(10,61,98,0.07)',
                color:selected.includes(n)?'white':'#0A3D62'}}>
              {COUNTRIES_DATA.find(c=>c.name===n)?.flag} {n}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px',paddingTop:'12px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
          <label style={{fontSize:'12px',fontWeight:700,color:'#696969'}}>Sector (optional):</label>
          <select value={sector} onChange={e=>setSector(e.target.value)}
            style={{padding:'7px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62',background:'white'}}>
            {['All Sectors',...SECTORS.slice(1)].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {selData.length >= 2 && (
        <>
          {/* Overall comparison */}
          <div className="gfm-card" style={{padding:'22px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
              display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={14} color="#74BB65"/> Global Opportunity Score Analysis — Comparison
            </div>
            {selData.sort((a,b)=>b.score-a.score).map(c=>(
              <div key={c.name} style={{marginBottom:'10px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                  <span style={{fontSize:'16px'}}>{c.flag}</span>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',minWidth:'110px'}}>{c.name}</span>
                  <div style={{flex:1,height:'14px',borderRadius:'7px',background:'rgba(10,61,98,0.06)',overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:'7px',
                      width:`${c.score}%`,background:TIER_C[c.tier],transition:'width 0.5s ease'}}/>
                  </div>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',minWidth:'80px'}}>
                    <span style={{fontSize:'14px',fontWeight:800,color:TIER_C[c.tier],fontFamily:'monospace'}}>{c.score.toFixed(1)}</span>
                    <TierBadge tier={c.tier}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Layer 1 detailed comparison */}
          <div className="gfm-card" style={{padding:'22px',overflow:'hidden'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
              display:'flex',alignItems:'center',gap:'6px'}}>
              <Shield size={14} color="#74BB65"/> Layer 1: Doing Business Indicators — Comparison
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'rgba(10,61,98,0.03)'}}>
                    <th style={{padding:'9px 12px',fontSize:'11px',fontWeight:700,color:'#696969',
                      textAlign:'left',textTransform:'uppercase',letterSpacing:'0.04em'}}>Indicator</th>
                    {selData.map(c=>(
                      <th key={c.name} style={{padding:'9px 12px',fontSize:'11px',fontWeight:700,
                        color:'#0A3D62',textAlign:'center',whiteSpace:'nowrap'}}>
                        {c.flag} {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DB_INDICATORS.map((ind,i)=>{
                    const vals = selData.map(c=>c.db[i]);
                    const maxV = Math.max(...vals);
                    return (
                      <tr key={ind} style={{borderBottom:'1px solid rgba(10,61,98,0.05)'}}>
                        <td style={{padding:'9px 12px',fontSize:'12px',color:'#0A3D62',fontWeight:500}}>{ind}</td>
                        {selData.map(c=>{
                          const v = c.db[i];
                          const isMax = v===maxV;
                          return (
                            <td key={c.name} style={{padding:'9px 12px',textAlign:'center'}}>
                              <span style={{fontSize:'13px',fontWeight:isMax?800:600,
                                color:isMax?'#74BB65':'#0A3D62',fontFamily:'monospace',
                                background:isMax?'rgba(116,187,101,0.1)':'transparent',
                                padding:isMax?'2px 7px':'0',borderRadius:'6px'}}>{v}</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Layer 2 if sector selected */}
          {sector !== 'All Sectors' && (
            <div className="gfm-card" style={{padding:'22px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
                display:'flex',alignItems:'center',gap:'6px'}}>
                <Activity size={14} color="#74BB65"/> Layer 2: Sector Indicators — {sector}
              </div>
              {selData.sort((a,b)=>b.l2-a.l2).map(c=>(
                <div key={c.name} style={{marginBottom:'10px',display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'16px'}}>{c.flag}</span>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',minWidth:'110px'}}>{c.name}</span>
                  <div style={{flex:1,height:'12px',borderRadius:'6px',background:'rgba(10,61,98,0.06)',overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:'6px',width:`${c.l2}%`,background:'#74BB65'}}/>
                  </div>
                  <span style={{fontSize:'13px',fontWeight:800,color:'#74BB65',fontFamily:'monospace',minWidth:'32px'}}>{c.l2.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}

          <ReadOnlyOverlay feature="generate_report">
            <button style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px 24px',
              background:'#0A3D62',color:'white',border:'none',borderRadius:'10px',
              cursor:'pointer',fontSize:'14px',fontWeight:700}}>
              <FileText size={15}/> Generate Benchmark Report → PDF
            </button>
          </ReadOnlyOverlay>
        </>
      )}
      {selData.length < 2 && (
        <div className="gfm-card" style={{padding:'40px',textAlign:'center'}}>
          <Globe size={36} color="#696969" style={{marginBottom:'12px'}}/>
          <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>Select at least 2 countries to start benchmarking</div>
          <p style={{fontSize:'13px',color:'#696969',marginTop:'6px'}}>You can compare up to 5 countries simultaneously.</p>
        </div>
      )}
    </div>
  );
}

// ── TAB: IMPACT ANALYSIS ──────────────────────────────────────────────────────

function ImpactTab() {
  const [country, setCountry]  = useState('Vietnam');
  const [sectr,   setSectr]    = useState('EV/Battery Manufacturing');
  const [inv,     setInv]      = useState('$100M');
  const [zone,    setZone]     = useState('Ho Chi Minh High-Tech Park');
  const [ran,     setRan]      = useState(false);
  const trial = useTrial();

  const scenario = IMPACT_SCENARIOS[inv] || IMPACT_SCENARIOS['$100M'];
  const cd = COUNTRIES_DATA.find(c=>c.name===country);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      {/* Scenario selector */}
      <div className="gfm-card" style={{padding:'22px'}}>
        <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',
          display:'flex',alignItems:'center',gap:'6px'}}>
          <Target size={14} color="#74BB65"/> Select Investment Scenario
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'12px'}}>
          {[
            {l:'Country',val:country,set:setCountry,opts:COUNTRIES_DATA.map(c=>c.name)},
            {l:'Sector',val:sectr,set:setSectr,opts:['EV/Battery Manufacturing','Digital Economy','Pharmaceutical','Renewable Energy','Logistics','Agribusiness']},
            {l:'Investment Size',val:inv,set:setInv,opts:Object.keys(IMPACT_SCENARIOS)},
            {l:'Zone',val:zone,set:setZone,opts:['Ho Chi Minh High-Tech Park','VSIP Binh Duong','Dinh Vu Industrial','Chu Lai Open Economy']},
          ].map(({l,val,set,opts})=>(
            <div key={l}>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>{l}</label>
              <select value={val} onChange={e=>{(set as any)(e.target.value);setRan(false);}}
                style={{width:'100%',padding:'9px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                  fontSize:'13px',color:'#0A3D62',background:'white'}}>
                {opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={()=>setRan(true)}
          style={{marginTop:'14px',display:'flex',alignItems:'center',gap:'7px',padding:'11px 24px',
            background:'#74BB65',color:'white',border:'none',borderRadius:'9px',
            cursor:'pointer',fontSize:'14px',fontWeight:700}}>
          <Zap size={14}/> Run Impact Analysis
        </button>
      </div>

      {ran && (
        <>
          {/* Country score context */}
          {cd && (
            <div style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'12px',padding:'20px',
              display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
              <span style={{fontSize:'40px'}}>{cd.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'18px',fontWeight:800,color:'white',marginBottom:'3px'}}>{country} — {sectr}</div>
                <div style={{fontSize:'13px',color:'rgba(226,242,223,0.75)'}}>{zone} · Investment: {inv}</div>
              </div>
              <div style={{display:'flex',gap:'16px'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'24px',fontWeight:900,color:'#74BB65',fontFamily:'monospace'}}>{cd.score.toFixed(1)}</div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>Opportunity Score</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'18px',fontWeight:700,color:'white'}}><TierBadge tier={cd.tier}/></div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)',marginTop:'4px'}}>Position</div>
                </div>
              </div>
            </div>
          )}

          {/* Impact projections */}
          <div className="gfm-card" style={{padding:'22px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
              display:'flex',alignItems:'center',gap:'6px'}}>
              <TrendingUp size={14} color="#74BB65"/> Impact Projections
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {[
                {title:'Economic Impact',icon:'📈',items:[
                  ['GDP Contribution',scenario.gdp+' / 5 years'],
                  ['Jobs Created',scenario.jobs],
                ]},
                {title:'Operational Feasibility',icon:'⚙',items:[
                  ['Time to Operation',scenario.timeOp],
                  ['Regulatory Approval','Low Risk'],
                ]},
                {title:'Incentive Impact',icon:'💰',items:[
                  ['Tax Savings',scenario.taxSave+' / 5 years'],
                  ['Incentive Package','Fully applicable'],
                ]},
                {title:'Risk Assessment',icon:'🛡',items:[
                  ['Political Risk',scenario.polRisk],
                  ['Market Risk',scenario.mktRisk],
                ]},
              ].map(({title,icon,items})=>(
                <div key={title} style={{padding:'16px',borderRadius:'10px',background:'rgba(10,61,98,0.02)',
                  border:'1px solid rgba(10,61,98,0.08)'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'10px',
                    display:'flex',alignItems:'center',gap:'6px'}}>
                    <span>{icon}</span>{title}
                  </div>
                  {items.map(([l,v])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'13px'}}>
                      <span style={{color:'#696969'}}>{l}</span>
                      <span style={{fontWeight:700,color:'#0A3D62'}}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Sensitivity analysis */}
          <div className="gfm-card" style={{padding:'22px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
              display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={14} color="#74BB65"/> Sensitivity Analysis — ROI by Investment Size
            </div>
            {Object.entries(IMPACT_SCENARIOS).map(([size,s])=>(
              <div key={size} style={{marginBottom:'10px',display:'flex',alignItems:'center',gap:'12px'}}>
                <span style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',minWidth:'50px',fontFamily:'monospace'}}>{size}</span>
                <div style={{flex:1,height:'14px',borderRadius:'7px',background:'rgba(10,61,98,0.06)',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:'7px',
                    width:`${s.roi}%`,
                    background:size===inv?'#74BB65':'#0A3D62',
                    opacity:size===inv?1:0.6,
                    transition:'width 0.5s ease'}}/>
                </div>
                <span style={{fontSize:'13px',fontWeight:800,fontFamily:'monospace',
                  color:size===inv?'#74BB65':'#0A3D62',minWidth:'36px'}}>{s.roi}%</span>
                <span style={{fontSize:'10px',color:'#696969',minWidth:'80px'}}>{s.jobs.split('/')[0].trim()}</span>
              </div>
            ))}
          </div>

          <ReadOnlyOverlay feature="generate_report">
            <button style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px 24px',
              background:'#0A3D62',color:'white',border:'none',borderRadius:'10px',
              cursor:'pointer',fontSize:'14px',fontWeight:700}}>
              <FileText size={15}/> Generate Impact Analysis Report → PDF
            </button>
          </ReadOnlyOverlay>
        </>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────



export default function InvestmentAnalysisPage() {
  const [tab, setTab] = useState('overview');

  const TABS = [
    {id:'overview',  label:'Overview'},
    {id:'analysis',  label:'Global Investment Analysis'},
    {id:'benchmark', label:'Benchmark'},
    {id:'impact',    label:'Impact Analysis'},
  ];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <BarChart3 size={16} color="#74BB65"/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Investment Analysis</span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px',lineHeight:'1.15'}}>
                Global Investment Analysis
              </h1>
              <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
                Doing Business Indicators · Sector Intelligence · Investment Zones · Market Signals
              </p>
            </div>
            <div style={{display:'flex',gap:'20px'}}>
              {[['215','Economies'],['4','Score Layers'],['300+','Data Sources']].map(([v,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Tabs */}
          <div style={{display:'flex',gap:'0',overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{padding:'12px 20px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  whiteSpace:'nowrap',background:'transparent',
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                  color:tab===t.id?'white':'rgba(226,242,223,0.65)',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'24px'}}>
        {tab==='overview'  && <OverviewTab setTab={setTab}/>}
        {tab==='analysis'  && <AnalysisTab/>}
        {tab==='benchmark' && <BenchmarkTab/>}
        {tab==='impact'    && <ImpactTab/>}
      </div>
      <Footer/>
    </div>
  );
}
