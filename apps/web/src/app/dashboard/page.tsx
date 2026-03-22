'use client'
import { useState, useEffect } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { FilterPanel } from '@/components/dashboard/FilterPanel'
import { AnalysisPanel } from '@/components/dashboard/AnalysisPanel'
import { SignalFeed } from '@/components/dashboard/SignalFeed'
import { LollipopChart } from '@/components/charts/LollipopChart'
import { BulletChart } from '@/components/charts/BulletChart'
import { RadarChart } from '@/components/charts/RadarChart'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { RefreshCw, Download, Filter, Zap, Globe, BarChart3, Shield, Target, Activity, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Globe3DWidget = dynamic(() => import('@/components/hero/Globe3D').then(m => ({ default: m.Globe3D })), { ssr: false, loading: () => <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#F8F9FA',borderRadius:16}}><div style={{width:40,height:40,border:'2px solid rgba(46,204,113,0.4)',borderRadius:'50%',borderTopColor:'transparent',animation:'spin 0.9s linear infinite'}}/></div> })

const ECONOMIES = [
  {id:'SGP',code:'SG',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B', category:'TOP',  region:'Asia & Pacific'},
  {id:'DNK',code:'DK',name:'Denmark',      gosa:85.3,trend:+0.3,fdi:'$22B', category:'TOP',  region:'Western Europe'},
  {id:'KOR',code:'KR',name:'South Korea',  gosa:84.1,trend:+0.1,fdi:'$17B', category:'TOP',  region:'Asia & Pacific'},
  {id:'USA',code:'US',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',category:'TOP',  region:'North America'},
  {id:'GBR',code:'GB',name:'United Kingdom',gosa:82.5,trend:-0.1,fdi:'$50B',category:'TOP',  region:'Western Europe'},
  {id:'ARE',code:'AE',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B', category:'TOP',  region:'North Africa & Middle East'},
  {id:'MYS',code:'MY',name:'Malaysia',     gosa:81.2,trend:+0.4,fdi:'$22B', category:'TOP',  region:'Asia & Pacific'},
  {id:'THA',code:'TH',name:'Thailand',     gosa:80.7,trend:+0.2,fdi:'$14B', category:'HIGH', region:'Asia & Pacific'},
  {id:'VNM',code:'VN',name:'Vietnam',      gosa:79.4,trend:+0.5,fdi:'$24B', category:'HIGH', region:'Asia & Pacific'},
  {id:'SAU',code:'SA',name:'Saudi Arabia', gosa:79.1,trend:+2.1,fdi:'$36B', category:'HIGH', region:'North Africa & Middle East'},
  {id:'IDN',code:'ID',name:'Indonesia',    gosa:77.8,trend:+0.1,fdi:'$22B', category:'HIGH', region:'Asia & Pacific'},
  {id:'IND',code:'IN',name:'India',        gosa:73.2,trend:+0.8,fdi:'$71B', category:'HIGH', region:'Asia & Pacific'},
  {id:'BRA',code:'BR',name:'Brazil',       gosa:71.3,trend:+0.4,fdi:'$74B', category:'HIGH', region:'Latin America'},
  {id:'MAR',code:'MA',name:'Morocco',      gosa:66.8,trend:+0.6,fdi:'$4B',  category:'HIGH', region:'North Africa & Middle East'},
  {id:'CHN',code:'CN',name:'China',        gosa:64.2,trend:-0.4,fdi:'$163B',category:'HIGH', region:'Asia & Pacific'},
]
const SECTOR_RADAR = [
  {scores:[88,92,76,84,90],color:'#2ECC71',label:'EV Battery'},
  {scores:[84,88,92,86,78],color:'#3498DB',label:'Data Centers'},
  {scores:[82,76,88,72,94],color:'#F1C40F',label:'Renewables'},
]
const POLICIES_DATA = [
  {code:'MY',country:'Malaysia',   policy:'100% FDI in data centers',          status:'NEW',   date:'Mar 2026'},
  {code:'AE',country:'UAE',        policy:'100% mainland foreign ownership',    status:'ACTIVE',date:'Feb 2026'},
  {code:'TH',country:'Thailand',   policy:'$2B EV battery incentive package',   status:'NEW',   date:'Mar 2026'},
  {code:'VN',country:'Vietnam',    policy:'50% CIT reduction EV manufacturing', status:'ACTIVE',date:'Jan 2026'},
  {code:'SA',country:'Saudi Arabia','policy':'30-day FDI license guarantee',     status:'NEW',   date:'Mar 2026'},
  {code:'IN',country:'India',      policy:'PLI Scheme 2.0 — $2.7B incentives',  status:'NEW',   date:'Mar 2026'},
]
const ZONES_DATA = [
  {name:'Jurong Island, SG', code:'SG',avail:18,color:'#E74C3C',status:'TIGHT'},
  {name:'Jebel Ali FZ, UAE', code:'AE',avail:14,color:'#E74C3C',status:'TIGHT'},
  {name:'VSIP Binh Duong, VN',code:'VN',avail:47,color:'#2ECC71',status:'AVAIL'},
  {name:'Tanger Med, Morocco',code:'MA',avail:62,color:'#2ECC71',status:'EXPANDING'},
  {name:'EEC Rayong, Thailand',code:'TH',avail:58,color:'#2ECC71',status:'AVAIL'},
  {name:'NEOM Industrial, SA',code:'SA',avail:78,color:'#2ECC71',status:'NEW'},
]
const sc = (v:number)=>v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'

const SIGNALS = [
  {id:1,grade:'PLATINUM',type:'POLICY',code:'MY',country:'Malaysia',title:'FDI cap in data centers raised to 100%',sco:96,impact:'HIGH',ts:'2m',strategic:'Microsoft, Google, AWS confirmed intent.',source_name:'MITI Malaysia',source_url:'https://www.miti.gov.my',hash:'a3f7c2'},
  {id:2,grade:'PLATINUM',type:'DEAL',code:'AE',country:'UAE',title:'Microsoft $3.3B AI infrastructure commitment',sco:97,impact:'HIGH',ts:'1h',strategic:'Largest tech FDI in UAE history.',source_name:'UAE MoE',source_url:'https://www.moec.gov.ae',hash:'b4e8c3'},
  {id:3,grade:'PLATINUM',type:'INCENTIVE',code:'TH',country:'Thailand',title:'$2B EV battery subsidy approved',sco:95,impact:'HIGH',ts:'3h',strategic:'CATL and Samsung SDI shortlisted.',source_name:'BOI Thailand',source_url:'https://www.boi.go.th',hash:'c5d9a4'},
]

function Card({children,style={}}:{children:any;style?:any}) {
  return <div style={{background:'#FFFFFF',borderRadius:20,border:'1px solid #ECF0F1',boxShadow:'0 4px 16px rgba(0,0,0,0.06)',overflow:'hidden',...style}}>{children}</div>
}
function CardHeader({icon,title,badge,extra}:{icon:any;title:string;badge?:string;extra?:any}) {
  return (
    <div style={{padding:'13px 16px',borderBottom:'1px solid #F8F9FA',display:'flex',alignItems:'center',gap:8,background:'#FAFBFC',flexShrink:0}}>
      <span style={{color:'#2ECC71',display:'flex'}}>{icon}</span>
      <span style={{fontSize:12,fontWeight:800,color:'#1A2C3E',letterSpacing:'0.06em',textTransform:'uppercase',flex:1,fontFamily:'Inter,sans-serif'}}>{title}</span>
      {badge&&<span style={{fontSize:9,fontWeight:800,padding:'2px 8px',borderRadius:20,background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.2)',letterSpacing:'0.05em'}}>{badge}</span>}
      {extra}
    </div>
  )
}

export default function Dashboard() {
  const { filters, setFilter } = useDashboardStore()
  const [selId, setSelId]   = useState<string|null>('SGP')
  const [selEntity, setSelEntity] = useState<any|null>(null)
  const [time, setTime]     = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(()=>{const iv=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(iv)},[])

  const filteredEcos = ECONOMIES.filter(e => {
    if (filters.region !== 'All' && e.region !== filters.region) return false
    if (filters.country && !e.name.toLowerCase().includes(filters.country.toLowerCase())) return false
    if (filters.futureReadiness === 'Top Performance (80–100)' && e.gosa < 80) return false
    if (filters.futureReadiness === 'Medium Performance (60–79)' && (e.gosa < 60 || e.gosa >= 80)) return false
    if (filters.futureReadiness === 'Developing Performance (<60)' && e.gosa >= 60) return false
    return true
  })
  const selEco = ECONOMIES.find(e=>e.id===selId)||ECONOMIES[0]

  const handleSelect = (eco: typeof ECONOMIES[0]) => {
    setSelId(eco.id)
    setSelEntity(eco)
  }

  return (
    <div style={{minHeight:'100vh',background:'#F0F2F5',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <BackgroundVideo/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes slideUpFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

      {/* ── TOP BAR ── */}
      <div style={{background:'#FFFFFF',borderBottom:'1px solid #ECF0F1',padding:'10px 20px',position:'sticky',top:'64px',zIndex:200,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <div style={{maxWidth:1920,margin:'0 auto',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{padding:'6px 10px',background:sidebarOpen?'rgba(46,204,113,0.1)':'#F8F9FA',border:`1px solid ${sidebarOpen?'rgba(46,204,113,0.2)':'#ECF0F1'}`,borderRadius:9,cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,color:sidebarOpen?'#27ae60':'#5A6874',transition:'all 0.15s'}}>
            <Filter size={13}/>{sidebarOpen?'Hide':'Show'} Filters
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:700,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.1em'}}>Intelligence Dashboard</div>
            <div style={{fontSize:17,fontWeight:900,color:'#1A2C3E',lineHeight:1.1}}>Global FDI Monitor — Live Operations</div>
          </div>
          {[[`${filteredEcos.length} Economies`,'#2ECC71'],[`${SIGNALS.length} Signals`,'#3498DB'],['3 Agents LIVE','#F1C40F']].map(([l,c])=>(
            <div key={String(l)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',background:`${c}10`,border:`1px solid ${c}20`,borderRadius:20,fontSize:11,fontWeight:700,color:String(c)}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:String(c),animation:'pulse 1.5s infinite'}}/>
              {l}
            </div>
          ))}
          <div style={{padding:'6px 12px',background:'#F8F9FA',borderRadius:10,border:'1px solid #ECF0F1',textAlign:'center'}}>
            <div style={{fontSize:14,fontWeight:800,color:'#1A2C3E',fontFamily:'JetBrains Mono,monospace'}}>{time.toLocaleTimeString()}</div>
            <div style={{fontSize:9,color:'#C8D0D6',marginTop:1}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}).toUpperCase()}</div>
          </div>
          <Link href="/pipeline-report" style={{display:'flex',alignItems:'center',gap:5,padding:'7px 13px',background:'linear-gradient(135deg,#2ECC71,#27ae60)',color:'white',borderRadius:20,textDecoration:'none',fontSize:11,fontWeight:800,boxShadow:'0 3px 10px rgba(46,204,113,0.3)'}}>
            <BarChart3 size={11}/> Agent Report
          </Link>
        </div>
      </div>

      {/* ── MAIN LAYOUT: Filter | Center | Right ── */}
      <div style={{maxWidth:1920,margin:'0 auto',padding:'14px 16px',display:'grid',gap:12,alignItems:'start',gridTemplateColumns:sidebarOpen?'280px 1fr 300px':'1fr 300px'}}>

        {/* ── LEFT: FilterPanel ── */}
        {sidebarOpen && (
          <div style={{position:'sticky',top:130}}>
            <FilterPanel/>
          </div>
        )}

        {/* ── CENTER: Visualizations ── */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>

          {/* W1: Globe */}
          <Card>
            <CardHeader icon={<Globe size={14}/>} title="Global Opportunity Map" badge={`${filteredEcos.length} ECONOMIES`}
              extra={<Link href="/pipeline-report" style={{fontSize:9,fontWeight:700,padding:'3px 8px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:8,textDecoration:'none',color:'#27ae60'}}>Agent Report</Link>}/>
            <div style={{padding:'14px 16px 16px'}}>
              <div style={{background:'linear-gradient(180deg,#EBF5FF 0%,#F0F7FF 100%)',borderRadius:14,overflow:'hidden',border:'1px solid #DCE9F3',height:320}}>
                <Globe3DWidget onSelect={code=>{const eco=ECONOMIES.find(e=>e.code===code);if(eco){setSelId(eco.id);setSelEntity(eco)}}}/>
              </div>
              <div style={{display:'flex',gap:14,marginTop:8,justifyContent:'center'}}>
                {[['#2ECC71','TOP (≥80)'],['#3498DB','HIGH (60-79)'],['#F1C40F','DEV (<60)']].map(([c,l])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#5A6874',fontWeight:600}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:c as string}}/>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* W2+W3: Lollipop + Bullet */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Card>
              <CardHeader icon={<BarChart3 size={13}/>} title="Investment Analysis" badge="GOSA"/>
              <div style={{padding:'10px 12px',maxHeight:340,overflowY:'auto'}}>
                <LollipopChart economies={filteredEcos} selected={selId} onSelect={id=>{const e=ECONOMIES.find(x=>x.id===id);if(e){setSelId(e.id);setSelEntity(e)}}}/>
              </div>
              <div style={{padding:'8px 12px',borderTop:'1px solid #F8F9FA'}}>
                <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'7px',background:'rgba(46,204,113,0.06)',borderRadius:8,textDecoration:'none',fontSize:11,fontWeight:700,color:'#27ae60',border:'1px solid rgba(46,204,113,0.15)'}}>Full Analysis →</Link>
              </div>
            </Card>
            <Card>
              <CardHeader icon={<Shield size={13}/>} title="Doing Business Indicators" badge="L1"/>
              <div style={{padding:'12px 14px'}}><BulletChart/></div>
            </Card>
          </div>

          {/* W4: Sector Radar */}
          <Card>
            <CardHeader icon={<Target size={13}/>} title="Sector Attractiveness Matrix" badge="L2"/>
            <div style={{padding:'12px 14px',display:'flex',gap:16,alignItems:'flex-start'}}>
              <RadarChart datasets={SECTOR_RADAR.map(s=>({scores:s.scores,color:s.color}))} labels={['Regs','Incentives','Labor','Infra','Export']} />
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
                {SECTOR_RADAR.map(sec=>(
                  <div key={sec.label} style={{padding:'9px 12px',background:'#FAFBFC',borderRadius:10,border:'1px solid #F0F2F4'}}>
                    <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
                      <div style={{width:10,height:3,borderRadius:2,background:sec.color}}/>
                      <span style={{fontSize:11,fontWeight:700,color:'#1A2C3E',flex:1}}>{sec.label}</span>
                      <span style={{fontSize:14,fontWeight:900,color:sec.color,fontFamily:'JetBrains Mono,monospace'}}>{Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)}</span>
                    </div>
                    <div style={{height:4,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',width:Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)+'%',background:sec.color,borderRadius:2}}/>
                    </div>
                  </div>
                ))}
                <Link href="/sectors" style={{display:'block',textAlign:'center',padding:'7px',background:'#F8F9FA',borderRadius:8,textDecoration:'none',fontSize:10,fontWeight:700,color:'#1A2C3E',border:'1px solid #ECF0F1',marginTop:4}}>Sector Monitor →</Link>
              </div>
            </div>
          </Card>

          {/* W5: Investment Zones */}
          <Card>
            <CardHeader icon={<Globe size={13}/>} title="Special Investment Zones" badge="L3"/>
            <div style={{padding:'12px 14px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {ZONES_DATA.map(z=>(
                <div key={z.name} style={{padding:'11px 12px',background:'#FAFBFC',borderRadius:11,border:'1px solid #F0F2F4',cursor:'pointer',transition:'all 0.15s'}}
                  onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='#2ECC71';(e.currentTarget as any).style.transform='translateY(-2px)';(e.currentTarget as any).style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'}}
                  onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='#F0F2F4';(e.currentTarget as any).style.transform='none';(e.currentTarget as any).style.boxShadow='none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:7}}>
                    <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${z.code}.svg`} width="18" height="12" style={{borderRadius:2}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                    <span style={{fontSize:10,fontWeight:700,color:'#1A2C3E',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{z.name.split(',')[0]}</span>
                    <span style={{fontSize:8,fontWeight:800,padding:'2px 6px',borderRadius:8,background:`${z.color}12`,color:z.color,border:`1px solid ${z.color}20`}}>{z.status}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:9,color:'#C8D0D6'}}>Available</span>
                    <span style={{fontSize:16,fontWeight:900,color:z.color,fontFamily:'JetBrains Mono,monospace'}}>{z.avail}%</span>
                  </div>
                  <div style={{height:5,background:'#F0F2F4',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:z.avail+'%',background:z.color,borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* W6: Policy Monitor */}
          <Card>
            <CardHeader icon={<Activity size={13}/>} title="Policy & Incentives Monitor" badge="LIVE"/>
            <div style={{padding:'12px 14px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {POLICIES_DATA.map(p=>(
                <div key={p.country} style={{padding:'11px 12px',background:'#FAFBFC',borderRadius:11,border:'1px solid #F0F2F4',cursor:'pointer',transition:'all 0.15s'}}
                  onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-2px)';(e.currentTarget as any).style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'}}
                  onMouseLeave={e=>{(e.currentTarget as any).style.transform='none';(e.currentTarget as any).style.boxShadow='none'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                    <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${p.code}.svg`} width="22" height="15" style={{borderRadius:3}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                    <span style={{fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:10,...(p.status==='NEW'?{background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.2)'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9',border:'1px solid rgba(52,152,219,0.2)'})}}>{p.status}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:'#1A2C3E',marginBottom:3}}>{p.country}</div>
                  <div style={{fontSize:10,color:'#5A6874',lineHeight:1.4,marginBottom:4}}>{p.policy}</div>
                  <div style={{fontSize:9,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>{p.date}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analysis Panel */}
          {selEntity && (
            <AnalysisPanel entity={selEntity} signals={SIGNALS} onClose={()=>setSelEntity(null)}/>
          )}
        </div>

        {/* ── RIGHT: Selected Country + Signals ── */}
        <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:130}}>

          {/* Country Detail */}
          <Card>
            <CardHeader icon={<BarChart3 size={13}/>} title={selEco.name} badge="GOSA"/>
            <div style={{padding:'14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px',background:'#F8F9FA',borderRadius:12,marginBottom:12}}>
                <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${selEco.code}.svg`} width="40" height="27" style={{borderRadius:4,boxShadow:'0 2px 6px rgba(0,0,0,0.1)',flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:'#5A6874'}}>{selEco.region}</div>
                  <span style={{fontSize:10,fontWeight:800,padding:'2px 7px',borderRadius:10,display:'inline-block',marginTop:2,...(selEco.category==='TOP'?{background:'rgba(46,204,113,0.1)',color:'#27ae60'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9'})}}>{selEco.category}</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:32,fontWeight:900,color:sc(selEco.gosa),fontFamily:'JetBrains Mono,monospace',lineHeight:1}}>{selEco.gosa}</div>
                  <div style={{fontSize:11,fontWeight:700,color:selEco.trend>0?'#27ae60':'#E74C3C',display:'flex',alignItems:'center',gap:3,justifyContent:'flex-end'}}>
                    {selEco.trend>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{selEco.trend>0?'+':''}{selEco.trend}
                  </div>
                </div>
              </div>
              {[['L1 Doing Business',selEco.gosa*1.04,'#2ECC71'],['L2 Sector',selEco.gosa*0.97,'#3498DB'],['L3 Zones',selEco.gosa*1.01,'#F1C40F'],['L4 Intelligence',selEco.gosa*0.99,'#9B59B6']].map(([l,v,c])=>(
                <div key={String(l)} style={{marginBottom:7}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <span style={{fontSize:10,color:'#5A6874'}}>{l}</span>
                    <span style={{fontSize:11,fontWeight:800,color:String(c),fontFamily:'JetBrains Mono,monospace'}}>{Math.min(100,Math.round(v as number))}</span>
                  </div>
                  <div style={{height:4,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:Math.min(100,v as number)+'%',background:String(c),borderRadius:2}}/>
                  </div>
                </div>
              ))}
              <button onClick={()=>setSelEntity(selEco)} style={{width:'100%',marginTop:10,padding:'9px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:10,cursor:'pointer',fontSize:11,fontWeight:700,color:'#27ae60',fontFamily:'Inter,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',gap:5,transition:'all 0.15s'}}
                onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(46,204,113,0.14)'}}
                onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(46,204,113,0.08)'}}>
                View Full Analysis <ChevronRight size={12}/>
              </button>
              <div style={{display:'flex',gap:6,marginTop:6}}>
                <Link href={'/country/'+selEco.id} style={{flex:1,padding:'7px',textAlign:'center',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:9,textDecoration:'none',fontSize:10,fontWeight:700,color:'#1A2C3E'}}>Profile</Link>
                <Link href="/reports" style={{flex:1,padding:'7px',textAlign:'center',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:9,textDecoration:'none',fontSize:10,fontWeight:700,color:'#1A2C3E'}}>Export Report</Link>
              </div>
            </div>
          </Card>

          {/* Economy selector */}
          <Card>
            <CardHeader icon={<Globe size={13}/>} title="Economies" badge={`${filteredEcos.length}`}/>
            <div style={{padding:'6px 8px',maxHeight:280,overflowY:'auto'}}>
              {filteredEcos.slice(0,12).map((eco,i)=>(
                <div key={eco.id} onClick={()=>handleSelect(eco)}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'6px 7px',borderRadius:8,cursor:'pointer',transition:'all 0.12s',background:selId===eco.id?'rgba(46,204,113,0.06)':'transparent',border:selId===eco.id?'1px solid rgba(46,204,113,0.15)':'1px solid transparent',marginBottom:2}}
                  onMouseEnter={e=>{if(selId!==eco.id)(e.currentTarget as any).style.background='#F8F9FA'}}
                  onMouseLeave={e=>{if(selId!==eco.id)(e.currentTarget as any).style.background='transparent'}}>
                  <span style={{fontSize:9,fontWeight:700,color:'#C8D0D6',minWidth:16,fontFamily:'JetBrains Mono,monospace'}}>#{i+1}</span>
                  <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="18" height="12" style={{borderRadius:2,flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                  <span style={{fontSize:11,fontWeight:selId===eco.id?700:400,color:selId===eco.id?'#1A2C3E':'#5A6874',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{eco.name}</span>
                  <div style={{width:36,height:4,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:eco.gosa+'%',background:sc(eco.gosa),borderRadius:2}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:900,color:sc(eco.gosa),fontFamily:'JetBrains Mono,monospace',minWidth:30,textAlign:'right'}}>{eco.gosa}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform quick nav */}
          <Card>
            <CardHeader icon={<ChevronRight size={13}/>} title="Platform"/>
            <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:5}}>
              {[{href:'/gfr',icon:'🏆',l:'GFR Ranking',d:'25 economies'},{href:'/corridors',icon:'🔀',l:'Corridors',d:'12 bilateral'},{href:'/pipeline',icon:'📋',l:'Pipeline',d:'Deal board'},{href:'/scenario-planner',icon:'🔬',l:'Scenario',d:'IRR/NPV'},{href:'/pipeline-report',icon:'📊',l:'Agent Report',d:'Pipeline'},{href:'/sources',icon:'📡',l:'Sources',d:'1000+'}].map(({href,icon,l,d})=>(
                <Link key={href} href={href} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',background:'#FAFBFC',border:'1px solid #F0F2F4',borderRadius:9,textDecoration:'none',transition:'all 0.15s'}}
                  onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='#2ECC71';(e.currentTarget as any).style.background='#F8FFF9'}}
                  onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='#F0F2F4';(e.currentTarget as any).style.background='#FAFBFC'}}>
                  <span style={{fontSize:16}}>{icon}</span>
                  <div><div style={{fontSize:11,fontWeight:700,color:'#1A2C3E'}}>{l}</div><div style={{fontSize:9,color:'#C8D0D6'}}>{d}</div></div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── BOTTOM: Signal Feed full width ── */}
      <div style={{maxWidth:1920,margin:'0 auto',padding:'0 16px 20px'}}>
        <SignalFeed/>
      </div>
    </div>
  )
}
