'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Flag from '@/components/Flag';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { Zap, TrendingUp } from 'lucide-react';

const SIGNAL_TYPES = [{id:'ALL',label:'All Types'},{id:'POLICY',label:'Policy Change'},{id:'INCENTIVE',label:'Incentive'},{id:'DEAL',label:'New Deal'},{id:'GROWTH',label:'Sector Growth'},{id:'ZONE',label:'Zone Available'}];
const INITIAL = [
  {id:1,grade:'PLATINUM',type:'POLICY',  flag:'MY',name:'Malaysia',   title:'100% FDI cap in data centers raised',   sco:96,impact:'HIGH',ts:'2m',  body:'Malaysian Investment Development Authority confirms 100% foreign ownership for data center investments above $50M. Effective immediately.'},
  {id:2,grade:'PLATINUM',type:'DEAL',    flag:'AE',name:'UAE',        title:'Microsoft $3.3B AI data center',        sco:97,impact:'HIGH',ts:'2h',  body:'Microsoft commits $3.3B to UAE AI infrastructure over 3 years. DIFC and JAFZA zones shortlisted. 5,000 jobs expected.'},
  {id:3,grade:'PLATINUM',type:'INCENTIVE',flag:'TH',name:'Thailand',  title:'$2B EV battery subsidy package',        sco:95,impact:'HIGH',ts:'1d',  body:'Thailand BOI approves comprehensive EV battery investment package including 50% CIT reduction for 5 years and 100% import duty exemption on machinery.'},
  {id:4,grade:'PLATINUM',type:'POLICY',  flag:'SA',name:'Saudi Arabia','title':'30-day FDI license guarantee',      sco:94,impact:'HIGH',ts:'2d',  body:'Saudi MISA announces 30-day maximum processing guarantee for FDI licenses across all sectors. Backed by digital processing overhaul.'},
  {id:5,grade:'GOLD',    type:'GROWTH',  flag:'VN',name:'Vietnam',    title:'Electronics exports surge 34% YoY',    sco:92,impact:'MED', ts:'3h',  body:'Vietnam General Statistics Office reports electronics and computer exports reached $38B in Q1 2026, up 34% YoY. HCMC and Binh Duong leading zones.'},
  {id:6,grade:'GOLD',    type:'ZONE',    flag:'ID',name:'Indonesia',  title:'New Batam FTZ — 200ha available',       sco:91,impact:'MED', ts:'5h',  body:'Batam Industrial Development Authority opens Phase 4 with 200ha of greenfield industrial land. EV battery manufacturing incentives available.'},
  {id:7,grade:'GOLD',    type:'DEAL',    flag:'IN',name:'India',      title:'Apple $10B manufacturing commitment',  sco:89,impact:'HIGH',ts:'4d',  body:'Apple confirms $10B manufacturing expansion in India over 3 years. Tamil Nadu and Karnataka competing for primary sites.'},
  {id:8,grade:'GOLD',    type:'INCENTIVE',flag:'MY',name:'Malaysia',  title:'Johor-Singapore SEZ: zero CIT years',  sco:88,impact:'HIGH',ts:'5d',  body:'JS-SEZ launched with unprecedented incentives: 0% CIT for 15 years on qualifying investments. 7 strategic sectors covered.'},
  {id:9,grade:'SILVER',  type:'GROWTH',  flag:'MA',name:'Morocco',   title:'Tanger Med hits 7M TEU capacity',      sco:84,impact:'MED', ts:'6d',  body:'Port of Tanger Med achieves record 7M TEU throughput. Phase III expansion adds 3M TEU capacity by 2028.'},
  {id:10,grade:'SILVER', type:'POLICY',  flag:'KR',name:'South Korea','title':'Semiconductor K-Chips Act extended', sco:82,impact:'MED', ts:'1w',  body:'South Korea extends K-Chips investment tax credit to 2030. Samsung and SK Hynix eligible for 15-25% R&D credit on advanced fab investment.'},
];

const gradeCol=(g:string)=>g==='PLATINUM'?'#9B59B6':g==='GOLD'?'#D4AC0D':'#7F8C8D';
const typeCol =(t:string)=>({POLICY:'#E74C3C',INCENTIVE:'#2ECC71',DEAL:'#E67E22',GROWTH:'#3498DB',ZONE:'#9B59B6'} as any)[t]||'#7F8C8D';

export default function SignalsPage() {
  const [signals, setSignals] = useState(INITIAL);
  const [filterType, setFilterType]   = useState('ALL');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterImpact,setFilterImpact]= useState('ALL');
  const [filterRegion,setFilterRegion]= useState('ALL');
  const [expanded, setExpanded] = useState<number|null>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      const eco = INITIAL[Math.floor(Math.random()*4)];
      setSignals(p=>[{...eco,id:Date.now(),ts:'now',grade:Math.random()>0.5?'PLATINUM':'GOLD',sco:70+Math.floor(Math.random()*26)},...p.slice(0,11)]);
    },5000);
    return ()=>clearInterval(iv);
  },[]);

  const filtered = signals.filter(s=>{
    if(filterType!=='ALL'&&s.type!==filterType)return false;
    if(filterGrade!=='ALL'&&s.grade!==filterGrade)return false;
    if(filterImpact!=='ALL'&&s.impact!==filterImpact)return false;
    return true;
  });

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:'var(--font-ui)'}}>
      <NavBar/>
      <div style={{background:'white',borderBottom:'1px solid var(--border)',padding:'20px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'var(--accent-green)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'6px',fontFamily:'var(--font-mono)'}}>LIVE INTELLIGENCE</div>
          <h1 style={{fontSize:'26px',fontWeight:900,color:'var(--text-primary)',fontFamily:'var(--font-display)',marginBottom:'16px'}}>Investment Signals Feed</h1>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'flex-end'}}>
            <ScrollableSelect value={filterType}  onChange={setFilterType}  width="150px" options={SIGNAL_TYPES.map(t=>({value:t.id,label:t.label}))}/>
            <ScrollableSelect value={filterGrade} onChange={setFilterGrade} width="130px" options={[{value:'ALL',label:'All Grades'},{value:'PLATINUM',label:'PLATINUM'},{value:'GOLD',label:'GOLD'},{value:'SILVER',label:'SILVER'}]}/>
            <ScrollableSelect value={filterImpact} onChange={setFilterImpact} width="130px" options={[{value:'ALL',label:'All Impact'},{value:'HIGH',label:'HIGH'},{value:'MED',label:'MED'},{value:'LOW',label:'LOW'}]}/>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginLeft:'auto',padding:'5px 14px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'20px'}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--accent-green)',animation:'pulse 2s infinite'}}/>
              <span style={{fontSize:'11px',fontWeight:700,color:'var(--accent-green)',fontFamily:'var(--font-mono)'}}>{filtered.length} LIVE SIGNALS</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'10px'}}>
        {filtered.map((s,i)=>(
          <div key={s.id} style={{background:'white',borderRadius:'14px',border:`1px solid ${typeCol(s.type)}25`,borderLeft:`4px solid ${typeCol(s.type)}`,boxShadow:'0 2px 10px rgba(26,44,62,0.05)',cursor:'pointer',animation:i===0?'slideRight 0.35s ease':'none',overflow:'hidden'}}
            onClick={()=>setExpanded(expanded===s.id?null:s.id)}>
            <div style={{padding:'14px 18px'}}>
              <div style={{display:'flex',gap:'7px',alignItems:'center',marginBottom:'8px',flexWrap:'wrap'}}>
                <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'10px',background:`${gradeCol(s.grade)}15`,color:gradeCol(s.grade)}}>{s.grade}</span>
                <span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',background:`${typeCol(s.type)}15`,color:typeCol(s.type),borderRadius:'10px'}}>{s.type}</span>
                <span style={{fontSize:'9px',fontWeight:700,padding:'2px 7px',background:s.impact==='HIGH'?'rgba(231,76,60,0.1)':'rgba(241,196,15,0.1)',color:s.impact==='HIGH'?'#E74C3C':'#D4AC0D',borderRadius:'10px'}}>{s.impact}</span>
              </div>
              <div style={{fontSize:'14px',fontWeight:700,color:'var(--text-primary)',marginBottom:'8px',lineHeight:1.35}}>{s.title}</div>
              {expanded===s.id && <div style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.75,marginBottom:'10px'}}>{s.body}</div>}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}><Flag country={s.flag} size="sm"/><span style={{fontSize:'12px',fontWeight:600,color:'var(--text-secondary)'}}>{s.name}</span></div>
                <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                  <span style={{fontSize:'14px',fontWeight:900,color:'#9B59B6',fontFamily:'var(--font-mono)'}}>{s.sco}</span>
                  <span style={{fontSize:'10px',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{s.ts} ago</span>
                  <span style={{fontSize:'10px',color:typeCol(s.type),fontWeight:600}}>{expanded===s.id?'▲ Less':'▼ More'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
      `}</style>
    </div>
  );
}
