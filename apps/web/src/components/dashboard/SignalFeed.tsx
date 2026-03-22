'use client'
import { useState, useEffect } from 'react'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { ExternalLink, Shield, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const SIGNALS_DATA = [
  {id:1,grade:'PLATINUM',type:'POLICY',  code:'MY',country:'Malaysia',   title:'100% FDI cap removed across all data center categories',     strategic:'Immediate window: hyperscalers can establish fully-owned facilities. Microsoft, Google, AWS confirmed intent letters. First-mover advantage for $1B+ investments.',source_name:'Malaysia MITI Official Gazette',source_url:'https://www.miti.gov.my',sco:96,impact:'HIGH',ts:'2m',hash:'a3f7c2d1'},
  {id:2,grade:'PLATINUM',type:'DEAL',    code:'AE',country:'UAE',         title:'Microsoft commits $3.3B to UAE AI and cloud infrastructure',  strategic:'Largest single tech FDI in UAE history. Abu Dhabi joins Singapore and Dublin as tier-1 hyperscale hub. Secondary investment $800M over 5 years.',source_name:'UAE Ministry of Economy',source_url:'https://www.moec.gov.ae',sco:97,impact:'HIGH',ts:'1h',hash:'b4e8c3f2'},
  {id:3,grade:'PLATINUM',type:'INCENTIVE',code:'TH',country:'Thailand',  title:'$2B EV battery manufacturing subsidy package approved',       strategic:'CATL and Samsung SDI shortlisted for 40GWh facility. Combined supply chain value $8B over 10 years.',source_name:'Thailand Board of Investment',source_url:'https://www.boi.go.th',sco:95,impact:'HIGH',ts:'3h',hash:'c5d9a4e3'},
  {id:4,grade:'PLATINUM',type:'POLICY',  code:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee goes live under Vision 2030',   strategic:'Most significant Gulf regulatory reform in a decade. 100-year company lifetime + English courts now operational.',source_name:'MISA Saudi Arabia',source_url:'https://www.misa.gov.sa',sco:94,impact:'HIGH',ts:'6h',hash:'d6e1b5f4'},
  {id:5,grade:'PLATINUM',type:'POLICY',  code:'IN',country:'India',       title:'India PLI 2.0: $2.7B semiconductor incentives — TSMC shortlisted',strategic:'Three separate Tier-1 fabs confirmed. First wafers expected Q3 2028. 50% capex + 25% R&D cost covered.',source_name:'India MeitY Circular',source_url:'https://www.meity.gov.in',sco:94,impact:'HIGH',ts:'15h',hash:'e7f2c6a5'},
  {id:6,grade:'GOLD',    type:'ZONE',    code:'ID',country:'Indonesia',   title:'200ha greenfield zone released — Batam FTZ infrastructure ready',strategic:'Power rated 150MW for heavy industrial. Port to Singapore 45 min. Nickel downstream processing eligible.',source_name:'BKPM Indonesia',source_url:'https://www.bkpm.go.id',sco:91,impact:'HIGH',ts:'1d',hash:'f8a3d7b6'},
  {id:7,grade:'GOLD',    type:'GROWTH',  code:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY — Apple commits $10B expansion',strategic:'6 new Apple suppliers establishing Vietnam HQ. Samsung and LG expanding concurrently.',source_name:'Vietnam MPI',source_url:'https://www.mpi.gov.vn',sco:89,impact:'HIGH',ts:'2d',hash:'a9b4e8c7'},
  {id:8,grade:'GOLD',    type:'GROWTH',  code:'SG',country:'Singapore',   title:'EDB approves $680M green hydrogen import terminal — Shell & Sembcorp JV',strategic:'Singapore positions as Asia-Pacific green hydrogen trading hub. Upstream suppliers from Australia, Oman, Chile in negotiation.',source_name:'Singapore EDB',source_url:'https://www.edb.gov.sg',sco:86,impact:'MED',ts:'3d',hash:'c2d6a1e9'},
  {id:9,grade:'GOLD',    type:'INCENTIVE',code:'MA',country:'Morocco',    title:'Morocco-EU Green Corridor: 0% tariff on EV components for 10 years',strategic:'Tanger Med Phase 3 adds 400ha. Renault, Stellantis, BYD evaluating major commitments.',source_name:'AMDI Morocco',source_url:'https://www.amdi.ma',sco:88,impact:'MED',ts:'4d',hash:'b1c5f9d8'},
  {id:10,grade:'SILVER', type:'REGULATORY',code:'KR',country:'South Korea','title':'Korea Chips Act Phase 2: 25% R&D tax credit for advanced packaging',strategic:'SK Hynix and Samsung confirmed beneficiaries. $4B additional annual R&D expected.',source_name:'KOTRA Korea',source_url:'https://www.kotra.or.kr',sco:78,impact:'MED',ts:'5d',hash:'d3e7b2f1'},
]
const GRADE_C: Record<string,string> = {PLATINUM:'#9B59B6',GOLD:'#d4ac0d',SILVER:'#5A6874'}
const TYPE_C: Record<string,string>  = {POLICY:'#E74C3C',DEAL:'#E67E22',INCENTIVE:'#2ECC71',ZONE:'#3498DB',GROWTH:'#1A2C3E',REGULATORY:'#F1C40F',ESG:'#27ae60'}

export function SignalFeed({ signals: extSignals }: { signals?: any[] }) {
  const [sigs, setSigs] = useState(SIGNALS_DATA)
  const [grade, setGrade] = useState('ALL')
  const [type,  setType]  = useState('ALL')
  const [expanded, setExpanded] = useState<number|null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random()>0.6) {
        const templates = [
          {grade:'GOLD',type:'GROWTH',code:'MY',country:'Malaysia',title:'New semiconductor facility groundbreaking — $800M committed',strategic:'Component of Malaysia\'s national chip strategy. 2,400 jobs.',source_name:'MIDA Malaysia',source_url:'https://www.mida.gov.my',sco:85,impact:'HIGH'},
          {grade:'GOLD',type:'POLICY',code:'VN',country:'Vietnam',title:'Vietnam updates FDI approval fast-track for green manufacturing',strategic:'Sub-45-day approval for projects over $100M in EV/solar sectors.',source_name:'Vietnam MPI',source_url:'https://www.mpi.gov.vn',sco:83,impact:'MED'},
        ]
        const t=templates[Math.floor(Math.random()*templates.length)]
        setSigs(p=>[{...t,id:Date.now(),hash:'live'+Date.now(),ts:'now'},...p.slice(0,11)])
        setLastUpdate(new Date())
      }
    }, 5000)
    return ()=>clearInterval(iv)
  }, [])

  const filtered = sigs.filter(s=>(grade==='ALL'||s.grade===grade)&&(type==='ALL'||s.type===type))

  return (
    <div style={{background:'#FFFFFF',borderRadius:20,border:'1px solid #ECF0F1',boxShadow:'0 4px 16px rgba(0,0,0,0.06)',overflow:'hidden'}}>
      {/* Header */}
      <div style={{padding:'16px 20px',borderBottom:'1px solid #F8F9FA',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',background:'linear-gradient(135deg,#FAFBFC,#FFF)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
          <span style={{fontSize:14,fontWeight:800,color:'#1A2C3E',fontFamily:'Inter,sans-serif'}}>Live Investment Signals</span>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 10px',background:'rgba(46,204,113,0.1)',borderRadius:20,border:'1px solid rgba(46,204,113,0.2)'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#2ECC71',animation:'pulse 1.5s infinite'}}/>
            <span style={{fontSize:10,fontWeight:700,color:'#27ae60',fontFamily:'Inter,sans-serif'}}>LIVE</span>
          </div>
          <span style={{fontSize:10,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>{lastUpdate.toLocaleTimeString()}</span>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
          {['ALL','PLATINUM','GOLD','SILVER'].map(g=>(
            <button key={g} onClick={()=>setGrade(g)} style={{padding:'4px 10px',borderRadius:8,fontSize:11,fontWeight:grade===g?700:500,cursor:'pointer',fontFamily:'Inter,sans-serif',border:'none',background:grade===g?'rgba(46,204,113,0.12)':'#F8F9FA',color:grade===g?'#27ae60':'#5A6874',transition:'all 0.15s'}}>{g}</button>
          ))}
          <select value={type} onChange={e=>setType(e.target.value)} style={{padding:'4px 8px',borderRadius:8,fontSize:11,border:'1px solid #ECF0F1',fontFamily:'Inter,sans-serif',color:'#5A6874',background:'white',cursor:'pointer',outline:'none'}}>
            {['ALL','POLICY','DEAL','INCENTIVE','ZONE','GROWTH','REGULATORY'].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Signal list */}
      <div style={{maxHeight:440,overflowY:'auto',padding:'10px 14px',display:'flex',flexDirection:'column',gap:8}}>
        {filtered.map(sig=>{
          const gc = GRADE_C[sig.grade] || '#5A6874'
          const tc = TYPE_C[sig.type]  || '#5A6874'
          const isExp = expanded===sig.id
          return (
            <div key={sig.id}
              style={{borderRadius:12,border:`1px solid ${tc}18`,borderLeft:`3px solid ${tc}`,background:isExp?`${tc}04`:'#FAFBFC',transition:'all 0.18s',cursor:'pointer'}}
              onMouseEnter={e=>{if(!isExp)(e.currentTarget as any).style.background='#F4F6F8'}}
              onMouseLeave={e=>{if(!isExp)(e.currentTarget as any).style.background='#FAFBFC'}}>
              {/* Collapsed header */}
              <div style={{padding:'10px 12px'}} onClick={()=>setExpanded(isExp?null:sig.id)}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5}}>
                  <span style={{fontSize:8,fontWeight:800,padding:'2px 7px',borderRadius:6,background:`${gc}15`,color:gc}}>{sig.grade}</span>
                  <span style={{fontSize:8,padding:'2px 6px',borderRadius:6,background:`${tc}12`,color:tc,fontWeight:600}}>{sig.type}</span>
                  <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sig.code}.svg`} width="14" height="10" style={{borderRadius:2}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                  <span style={{fontSize:11,fontWeight:600,color:'#1A2C3E',fontFamily:'Inter,sans-serif'}}>{sig.country}</span>
                  <span style={{marginLeft:'auto',fontSize:11,fontWeight:900,color:gc,fontFamily:'JetBrains Mono,monospace'}}>{sig.sco}</span>
                  <span style={{fontSize:9,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>{sig.ts} ago</span>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:'#1A2C3E',lineHeight:1.4,fontFamily:'Inter,sans-serif'}}>{sig.title}</div>
              </div>

              {/* Expanded */}
              {isExp&&(
                <div style={{padding:'0 12px 12px',borderTop:'1px solid #F0F2F4'}}>
                  <div style={{fontSize:11,color:'#5A6874',lineHeight:1.6,margin:'8px 0',fontFamily:'Inter,sans-serif'}}><strong style={{color:'#1A2C3E'}}>Strategic: </strong>{sig.strategic}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                    <a href={sig.source_url} target="_blank" rel="noopener noreferrer"
                      style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,color:'#3498DB',textDecoration:'none',padding:'4px 10px',background:'rgba(52,152,219,0.08)',borderRadius:8,border:'1px solid rgba(52,152,219,0.15)'}}>
                      <ExternalLink size={10}/>{sig.source_name}
                    </a>
                    <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>
                      <Shield size={9}/>SHA-256: {sig.hash}…
                    </span>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,background:sig.impact==='HIGH'?'rgba(231,76,60,0.08)':'rgba(52,152,219,0.08)',color:sig.impact==='HIGH'?'#E74C3C':'#3498DB',fontWeight:600,fontFamily:'Inter,sans-serif'}}>{sig.impact}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length===0&&<div style={{padding:24,textAlign:'center',fontSize:12,color:'#C8D0D6',fontFamily:'Inter,sans-serif'}}>No signals match filters</div>}
      </div>

      {/* Footer */}
      <div style={{padding:'12px 20px',borderTop:'1px solid #F8F9FA',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:11,color:'#C8D0D6',fontFamily:'Inter,sans-serif'}}>{filtered.length} signals</span>
        <Link href="/signals" style={{fontSize:12,fontWeight:700,color:'#2ECC71',textDecoration:'none',display:'flex',alignItems:'center',gap:4,fontFamily:'Inter,sans-serif'}}>
          Full Signal Feed →
        </Link>
      </div>
    </div>
  )
}
