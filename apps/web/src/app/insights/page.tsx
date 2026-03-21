'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Globe, Zap, BarChart3, AlertTriangle } from 'lucide-react';

const INSIGHTS = [
  {id:1, type:'MACRO',     color:'var(--accent-green)', icon:'🌐', title:'ASEAN FDI inflows hit record $230B in 2025',         summary:'ASEAN collectively attracted $230 billion in FDI in 2025, a 14% increase year-over-year. Vietnam, Indonesia, and Malaysia accounted for 61% of flows. Electronics, data infrastructure, and EV supply chain drove the majority of commitments.',          impact:'HIGH', region:'Asia Pacific',   date:'Mar 2026', trending:true},
  {id:2, type:'POLICY',    color:'#ff4466', icon:'📋', title:'G20 FDI liberalisation framework endorsed',           summary:'G20 nations endorsed a multilateral framework for FDI liberalisation, reducing restrictions across 14 key sectors including AI infrastructure, clean energy, and semiconductor manufacturing. Framework takes effect Q3 2026.',                            impact:'HIGH', region:'Global',          date:'Mar 2026', trending:true},
  {id:3, type:'SECTOR',    color:'#ffd700', icon:'🔋', title:'EV battery investment surges — $45B committed in Q1', summary:'Q1 2026 saw unprecedented EV battery investment with $45B in commitments across Southeast Asia and Middle East. Vietnam, Thailand, and Indonesia lead with combined $28B. Chinese manufacturers dominating with 68% market share.',             impact:'HIGH', region:'Asia Pacific',   date:'Feb 2026', trending:true},
  {id:4, type:'RISK',      color:'#e67e22', icon:'⚠', title:'Middle East logistics disruption — Red Sea routes',   summary:'Red Sea shipping disruptions continue to add 18-23 days to EU-Asia transit times. Seaport investments in Malaysia (Port Klang), UAE (Jebel Ali), and Morocco (Tanger Med) accelerating to capture redirected trade flows.',                           impact:'MED',  region:'Middle East',     date:'Feb 2026', trending:false},
  {id:5, type:'SECTOR',    color:'#9b59b6', icon:'🤖', title:'AI data center investment: $180B committed globally', summary:'Global hyperscaler AI compute investment reached $180B in commitments for 2026-2028. UAE leads the Middle East with $10B+ committed (Microsoft $3.3B, AWS $2.1B, Google $1.8B). Malaysia emerging as Asian alternative to Singapore.',           impact:'HIGH', region:'Global',          date:'Mar 2026', trending:true},
  {id:6, type:'MACRO',     color:'var(--accent-blue)', icon:'💹', title:'USD strength reshaping FDI economics in Asia',        summary:'USD appreciation by 8% against major Asian currencies in 2025 has improved cost-of-investment metrics across ASEAN. Vietnamese dong down 6%, Malaysian ringgit down 5% — effectively reducing greenfield costs for USD-denominated investors.',impact:'MED',  region:'Asia Pacific',   date:'Feb 2026', trending:false},
  {id:7, type:'POLICY',    color:'var(--accent-green)', icon:'📜', title:'India Production Linked Incentive 2.0 launched',     summary:'India announces PLI 2.0 with expanded sector coverage and increased incentives. Electronics, semiconductors, and EV batteries receive 25-40% subsidy rates. Targets $100B in manufacturing investment by 2027.',                                   impact:'HIGH', region:'Asia Pacific',   date:'Mar 2026', trending:true},
  {id:8, type:'RISK',      color:'#ff4466', icon:'⚡', title:'Energy cost volatility impacting European FDI',       summary:'European energy prices remain 40% above pre-2022 levels, driving manufacturing FDI towards MENA and Southeast Asia. German industrial FDI outflow accelerating, with Malaysia, UAE, and Morocco primary beneficiaries.',                       impact:'MED',  region:'Europe',          date:'Jan 2026', trending:false},
];

const MARKET_METRICS = [
  {label:'Global FDI Flow',    v:'$2.8T',  chg:'+11%', c:'#2ECC71', sub:'2025 full year'},
  {label:'ASEAN Share',        v:'8.2%',   chg:'+1.4pp',c:'#3498DB', sub:'Of global FDI'},
  {label:'Middle East Growth', v:'+34%',   chg:'YoY',  c:'#ffd700', sub:'FDI inflows 2025'},
  {label:'EV Battery FDI',     v:'$45B',   chg:'+42%', c:'#9b59b6', sub:'Q1 2026 committed'},
  {label:'AI Infrastructure',  v:'$180B',  chg:'+55%', c:'#e67e22', sub:'2026-2028 pipeline'},
  {label:'Top Source: USA',    v:'$412B',  chg:'+8%',  c:'#2ECC71', sub:'Outbound FDI'},
];

const TYPE_STYLE: Record<string,{bg:string,c:string}> = {
  MACRO:  {bg:'rgba(0,180,216,0.1)', c:'#3498DB'},
  POLICY: {bg:'rgba(255,68,102,0.1)',c:'#ff4466'},
  SECTOR: {bg:'rgba(255,215,0,0.1)', c:'#ffd700'},
  RISK:   {bg:'rgba(230,126,34,0.1)',c:'#e67e22'},
};

export default function InsightsPage() {
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState<typeof INSIGHTS[0]|null>(null);

  const filtered = filter === 'ALL' ? INSIGHTS : INSIGHTS.filter(i => i.type === filter || i.region === filter);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:'var(--font-display)'}}>MARKET INSIGHTS</div>
          <h1 style={{fontSize:'26px',fontWeight:900,color:'var(--text-primary)',marginBottom:'4px'}}>Global FDI Market Intelligence</h1>
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>Macro trends · Policy shifts · Sector analysis · Risk monitoring</p>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>
        {/* Market metrics */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'10px',marginBottom:'18px'}}>
          {MARKET_METRICS.map(({label,v,chg,c,sub}) => (
            <div key={label} style={{padding:'14px',background:'white',border:'1px solid #ECF0F1,0.08)',borderRadius:'10px',borderTop:'2px solid '+c}}>
              <div style={{fontSize:'9px',color:'var(--text-light)',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{label}</div>
              <div style={{fontSize:'20px',fontWeight:900,color:c,fontFamily:'var(--font-mono)'}}>{v}</div>
              <div style={{display:'flex',gap:'5px',alignItems:'center',marginTop:'2px'}}>
                <span style={{fontSize:'10px',fontWeight:700,color:'var(--accent-green)'}}>{chg}</span>
                <span style={{fontSize:'9px',color:'var(--text-light)'}}>{sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
          {['ALL','MACRO','POLICY','SECTOR','RISK','Asia Pacific','Middle East','Europe','Global'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:'6px 14px',borderRadius:'20px',border:`1px solid ${filter===f?'rgba(46,204,113,0.5)':'rgba(255,255,255,0.07)'}`,background:filter===f?'rgba(46,204,113,0.08)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:'11px',fontWeight:filter===f?700:400,color:filter===f?'#2ECC71':'rgba(232,244,248,0.45)',fontFamily:'var(--font-ui)',transition:'all 150ms'}}>
              {f}
            </button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          {filtered.map(insight => {
            const ts = TYPE_STYLE[insight.type] || {bg:'rgba(255,255,255,0.06)',c:'rgba(232,244,248,0.5)'};
            const isSel = selected?.id === insight.id;
            return (
              <div key={insight.id}
                onClick={()=>setSelected(isSel?null:insight)}
                style={{background:isSel?'rgba(13,28,46,0.95)':'rgba(10,22,40,0.7)',border:`1px solid ${isSel?insight.color+'30':'rgba(0,180,216,0.1)'}`,borderRadius:'13px',padding:'18px 20px',cursor:'pointer',transition:'all 200ms ease',position:'relative',overflow:'hidden',boxShadow:isSel?`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${insight.color}15`:'none'}}
                onMouseEnter={e=>{if(!isSel){e.currentTarget.style.borderColor=insight.color+'20';e.currentTarget.style.transform='translateY(-2px)';}}}
                onMouseLeave={e=>{if(!isSel){e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';e.currentTarget.style.transform='none';}}}>
                <div style={{position:'absolute',top:0,right:0,width:'60px',height:'60px',background:`radial-gradient(circle at top right, ${insight.color}06, transparent)`,pointerEvents:'none'}}/>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}>
                  <span style={{fontSize:'22px',flexShrink:0}}>{insight.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'5px',flexWrap:'wrap'}}>
                      <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:ts.bg,color:ts.c,letterSpacing:'0.05em'}}>{insight.type}</span>
                      <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:insight.impact==='HIGH'?'rgba(255,68,102,0.1)':'rgba(255,215,0,0.1)',color:insight.impact==='HIGH'?'#ff4466':'#ffd700'}}>{insight.impact}</span>
                      <span style={{fontSize:'9px',color:'var(--text-light)'}}>{insight.region}</span>
                      {insight.trending && <span style={{fontSize:'9px',fontWeight:800,color:'var(--accent-green)',padding:'1px 6px',background:'rgba(46,204,113,0.08)',borderRadius:'8px',display:'flex',alignItems:'center',gap:'3px'}}><TrendingUp size={8}/>TRENDING</span>}
                    </div>
                    <div style={{fontSize:'14px',fontWeight:700,color:'rgba(232,244,248,0.9)',lineHeight:1.35,marginBottom:'6px'}}>{insight.title}</div>
                    <div style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:1.65}}>{isSel ? insight.summary : insight.summary.slice(0,110)+'...'}</div>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'10px',color:'var(--text-light)',fontFamily:'var(--font-mono)'}}>{insight.date}</span>
                  <span style={{fontSize:'10px',color:insight.color+'80',fontWeight:600}}>{isSel?'▲ Less':'▼ Read more'}</span>
                </div>
                {isSel && (
                  <div style={{marginTop:'12px',paddingTop:'12px',borderTop:'1px solid rgba(0,255,200,0.08)',display:'flex',gap:'8px'}}>
                    <Link href="/signals" onClick={e=>e.stopPropagation()} style={{padding:'6px 14px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'var(--accent-green)'}}>Related Signals</Link>
                    <Link href="/investment-analysis" onClick={e=>e.stopPropagation()} style={{padding:'6px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:600,color:'var(--text-secondary)'}}>Economy Analysis</Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
