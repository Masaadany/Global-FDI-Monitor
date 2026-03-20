'use client';
import { useState } from 'react';
import { Target, Plus, ArrowRight, TrendingUp, Globe, DollarSign, Clock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

type Stage = 'screening'|'due_diligence'|'negotiation'|'approval'|'closed_won'|'closed_lost';

const STAGES: {id:Stage,label:string,color:string}[] = [
  {id:'screening',      label:'Screening',       color:'#696969'},
  {id:'due_diligence',  label:'Due Diligence',   color:'#1B6CA8'},
  {id:'negotiation',    label:'Negotiation',     color:'#FFB347'},
  {id:'approval',       label:'Approval',        color:'#0A3D62'},
  {id:'closed_won',     label:'Closed Won',      color:'#74BB65'},
  {id:'closed_lost',    label:'Closed Lost',     color:'#E57373'},
];

const DEFAULT_DEALS = [
  {id:'D001',company:'Microsoft',    sector:'Technology',    amount:'$5.2B', eco:'🇦🇪 UAE',        stage:'screening'     as Stage,daysIn:3},
  {id:'D002',company:'CATL',         sector:'Manufacturing', amount:'$3.2B', eco:'🇮🇩 Indonesia',  stage:'due_diligence' as Stage,daysIn:12},
  {id:'D003',company:'Amazon AWS',   sector:'Technology',    amount:'$5.4B', eco:'🇸🇦 S. Arabia',  stage:'negotiation'  as Stage,daysIn:28},
  {id:'D004',company:'Hyundai Motor',sector:'Manufacturing', amount:'$1.8B', eco:'🇮🇩 Indonesia',  stage:'approval'     as Stage,daysIn:45},
  {id:'D005',company:'Google',       sector:'Technology',    amount:'$2.1B', eco:'🇸🇬 Singapore',  stage:'closed_won'   as Stage,daysIn:60},
  {id:'D006',company:'Siemens',      sector:'Energy',        amount:'$800M', eco:'🇩🇪 Germany',    stage:'screening'    as Stage,daysIn:5},
  {id:'D007',company:'TSMC',         sector:'Technology',    amount:'$10B',  eco:'🇯🇵 Japan',      stage:'due_diligence' as Stage,daysIn:20},
  {id:'D008',company:'BYD',          sector:'Manufacturing', amount:'$1.5B', eco:'🇹🇭 Thailand',   stage:'negotiation'  as Stage,daysIn:35},
];

export default function InvestmentPipelinePage() {
  const [deals, setDeals] = useState(DEFAULT_DEALS);
  const [view,  setView]  = useState<'kanban'|'table'>('kanban');

  function moveStage(id:string, s:Stage) {
    setDeals(d=>d.map(x=>x.id===id?{...x,stage:s}:x));
  }

  const totalValue = deals.filter(d=>d.stage!=='closed_lost').length * 3.1;

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px'}}>
        <div style={{maxWidth:'1600px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
              <Target size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Investment Pipeline</span>
            </div>
            <h1 style={{fontSize:'22px',fontWeight:800,color:'white',margin:0}}>Deal Pipeline Tracker</h1>
          </div>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <div style={{display:'flex',gap:'0',background:'rgba(255,255,255,0.1)',borderRadius:'8px',padding:'3px'}}>
              {[{v:'kanban',l:'Kanban'},{v:'table',l:'Table'}].map(({v,l})=>(
                <button key={v} onClick={()=>setView(v as any)}
                  style={{padding:'6px 14px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,
                    background:view===v?'white':'transparent',color:view===v?'#0A3D62':'rgba(226,242,223,0.75)'}}>
                  {l}
                </button>
              ))}
            </div>
            <button style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',
              background:'#74BB65',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>
              <Plus size={13}/> Add Deal
            </button>
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1600px',margin:'0 auto',padding:'20px 24px'}}>
        {/* Stats row */}
        <div style={{display:'flex',gap:'14px',marginBottom:'18px',flexWrap:'wrap'}}>
          {[{icon:DollarSign,label:'Pipeline Value',v:`~$${totalValue.toFixed(1)}B`},
            {icon:Target,    label:'Active Deals',   v:String(deals.filter(d=>!['closed_won','closed_lost'].includes(d.stage)).length)},
            {icon:TrendingUp,label:'Won This Quarter',v:String(deals.filter(d=>d.stage==='closed_won').length)},
            {icon:Clock,     label:'Avg Days in Pipeline',v:'28d'},
          ].map(({icon:Icon,label,v})=>(
            <div key={label} className="gfm-card" style={{padding:'14px 20px',flex:1,minWidth:'160px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'5px'}}>
                <Icon size={13} color="#74BB65"/>
                <span style={{fontSize:'11px',color:'#696969'}}>{label}</span>
              </div>
              <div style={{fontSize:'20px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{v}</div>
            </div>
          ))}
        </div>

        <PreviewGate feature="pipeline">
          {view==='kanban' ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'12px',overflowX:'auto'}}>
              {STAGES.map(stage=>{
                const stageDeals = deals.filter(d=>d.stage===stage.id);
                return (
                  <div key={stage.id} style={{minWidth:'200px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                      padding:'10px 14px',borderRadius:'9px 9px 0 0',background:stage.color,marginBottom:'8px'}}>
                      <span style={{fontSize:'11px',fontWeight:800,color:'white'}}>{stage.label}</span>
                      <span style={{fontSize:'11px',fontWeight:700,background:'rgba(255,255,255,0.2)',
                        color:'white',padding:'1px 7px',borderRadius:'8px'}}>{stageDeals.length}</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px',minHeight:'200px',
                      padding:'2px',background:'rgba(10,61,98,0.02)',borderRadius:'0 0 9px 9px',
                      border:'1px solid rgba(10,61,98,0.07)',borderTop:'none'}}>
                      {stageDeals.map(deal=>(
                        <div key={deal.id} style={{background:'white',borderRadius:'8px',padding:'12px',
                          boxShadow:'0 1px 6px rgba(10,61,98,0.07)',cursor:'grab',
                          border:'1px solid rgba(10,61,98,0.06)'}}>
                          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'4px',lineHeight:'1.3'}}>{deal.company}</div>
                          <div style={{fontSize:'11px',color:'#696969',marginBottom:'6px'}}>{deal.eco} · {deal.sector}</div>
                          <div style={{fontSize:'14px',fontWeight:800,color:'#74BB65',fontFamily:'monospace',marginBottom:'6px'}}>{deal.amount}</div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <span style={{fontSize:'10px',color:'#696969',display:'flex',alignItems:'center',gap:'3px'}}>
                              <Clock size={9}/>{deal.daysIn}d
                            </span>
                            <select value={deal.stage} onChange={e=>moveStage(deal.id,e.target.value as Stage)}
                              onClick={e=>e.stopPropagation()}
                              style={{fontSize:'10px',border:'none',background:'transparent',color:'#696969',cursor:'pointer'}}>
                              {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="gfm-card" style={{overflow:'hidden'}}>
              <table className="gfm-table">
                <thead>
                  <tr>
                    {['Company','Economy','Sector','Amount','Stage','Days','Actions'].map(h=>(
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map(deal=>{
                    const stage = STAGES.find(s=>s.id===deal.stage);
                    return (
                      <tr key={deal.id}>
                        <td style={{fontWeight:700}}>{deal.company}</td>
                        <td>{deal.eco}</td>
                        <td>{deal.sector}</td>
                        <td style={{fontFamily:'monospace',fontWeight:700,color:'#74BB65'}}>{deal.amount}</td>
                        <td>
                          <span style={{fontSize:'11px',fontWeight:700,padding:'3px 9px',borderRadius:'8px',
                            background:`${stage?.color}15`,color:stage?.color}}>{stage?.label}</span>
                        </td>
                        <td style={{fontFamily:'monospace'}}>{deal.daysIn}d</td>
                        <td>
                          <select value={deal.stage} onChange={e=>moveStage(deal.id,e.target.value as Stage)}
                            style={{fontSize:'11px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'6px',
                              padding:'4px 8px',color:'#0A3D62',background:'white',cursor:'pointer'}}>
                            {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </PreviewGate>
      </div>
      <Footer/>
    </div>
  );
}
