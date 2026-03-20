'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const STAGES = ['Prospecting','Qualified','Proposal','Negotiation','Committed','Active'];
const STAGE_C = ['#696969','#74BB65','#0A3D62','#74BB65','#22c55e','#0A66C2'];

const INIT_DEALS = [
  {id:1, company:'Microsoft',     eco:'UAE',          flag:'🇦🇪',sector:'💻 ICT',   capex:'$850M', grade:'PLATINUM', stage:'Negotiation',prob:82,cic:'GFM-USA-MSFT'},
  {id:2, company:'CATL',          eco:'Indonesia',    flag:'🇮🇩',sector:'🏭 Manuf', capex:'$3.2B', grade:'PLATINUM', stage:'Proposal',   prob:68,cic:'GFM-CHN-CATL'},
  {id:3, company:'ACWA Power',    eco:'Saudi Arabia', flag:'🇸🇦',sector:'⚡ Energy', capex:'$980M', grade:'GOLD',     stage:'Qualified',  prob:55,cic:'GFM-SAU-ACWA'},
  {id:4, company:'Samsung SDI',   eco:'Vietnam',      flag:'🇻🇳',sector:'🏭 Manuf', capex:'$2.1B', grade:'PLATINUM', stage:'Prospecting',prob:40,cic:'GFM-KOR-SAMS'},
  {id:5, company:'TotalEnergies', eco:'Egypt',        flag:'🇪🇬',sector:'⚡ Energy', capex:'$890M', grade:'GOLD',     stage:'Committed',  prob:91,cic:'GFM-FRA-TOTE'},
  {id:6, company:'Google Cloud',  eco:'Singapore',    flag:'🇸🇬',sector:'💻 ICT',   capex:'$620M', grade:'GOLD',     stage:'Active',     prob:99,cic:'GFM-USA-GOOG'},
  {id:7, company:'Siemens',       eco:'UAE',          flag:'🇦🇪',sector:'⚡ Energy', capex:'$340M', grade:'GOLD',     stage:'Qualified',  prob:52,cic:'GFM-DEU-SIEN'},
  {id:8, company:'BYD',           eco:'Saudi Arabia', flag:'🇸🇦',sector:'🏭 Manuf', capex:'$1.8B', grade:'GOLD',     stage:'Proposal',   prob:65,cic:'GFM-CHN-BYDO'},
];

const GRADE_C: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#696969'};

function capexNum(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g,''));
  return s.includes('B') ? n*1000 : n;
}

export default function PipelinePage() {
  const [deals,   setDeals]   = useState(INIT_DEALS);
  const [view,    setView]    = useState<'kanban'|'table'>('kanban');
  const [modal,   setModal]   = useState(false);
  const [newDeal, setNewDeal] = useState({company:'',eco:'',sector:'💻 ICT',capex:'',stage:'Prospecting',grade:'GOLD'});

  const totalCapex = deals.reduce((a,d)=>a+capexNum(d.capex),0);
  const committed  = deals.filter(d=>['Committed','Active'].includes(d.stage)).length;

  function advance(id:number) {
    setDeals(prev=>prev.map(d=>{
      if(d.id!==id) return d;
      const si=STAGES.indexOf(d.stage);
      return si<STAGES.length-1?{...d,stage:STAGES[si+1],prob:Math.min(d.prob+10,99)}:d;
    }));
  }

  function addDeal() {
    if(!newDeal.company||!newDeal.eco) return;
    setDeals(prev=>[...prev,{...newDeal,id:Date.now(),flag:'🌍',prob:30,cic:'GFM-NEW-'+Math.random().toString(36).slice(2,6).toUpperCase()}]);
    setNewDeal({company:'',eco:'',sector:'💻 ICT',capex:'',stage:'Prospecting',grade:'GOLD'});
    setModal(false);
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>CRM Intelligence</div>
            <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Investment Pipeline</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>Track deals through 6 stages · Kanban & table view · Add custom deals</p>
          </div>
          <div className="flex gap-5">
            {[[deals.length,'Total Deals'],[committed,'Committed/Active'],['$'+(totalCapex/1000).toFixed(1)+'B','Pipeline Value'],['6','Stages']].map(([v,l])=>(
              <div key={String(l)} className="text-center">
                <div className="text-2xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b px-6 py-2.5 flex items-center gap-3"
        style={{background:'rgba(240,248,238,0.96)',borderBottomColor:'rgba(10,61,98,0.15)',backdropFilter:'blur(10px)'}}>
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {(['kanban','table'] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)}
              className="px-4 py-1.5 text-xs font-bold capitalize transition-all"
              style={view===v?{background:'#74BB65',color:'#fff'}:{color:'#696969'}}>
              {v==='kanban'?'🗂 Kanban':'📋 Table'}
            </button>
          ))}
        </div>
        <button onClick={()=>setModal(true)} className="gfm-btn-primary text-xs py-1.5 px-4 ml-auto">+ Add Deal</button>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-4">
        {/* Add deal modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={()=>setModal(false)}>
            <div className="gfm-card p-6 max-w-md w-full animate-fadeIn" onClick={e=>e.stopPropagation()}>
              <div className="font-extrabold text-sm mb-4" style={{color:'#0A3D62'}}>Add New Deal</div>
              <div className="space-y-3">
                {[['Company','company'],['Economy','eco'],['CapEx ($M)','capex']].map(([l,k])=>(
                  <div key={k}>
                    <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>{l}</label>
                    <input value={(newDeal as any)[k]} onChange={e=>setNewDeal(p=>({...p,[k]:e.target.value}))}
                      className="w-full px-3 py-2 text-sm rounded-xl" placeholder={`Enter ${l.toLowerCase()}…`}/>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  {[['Stage','stage',STAGES],['Grade','grade',['PLATINUM','GOLD','SILVER','BRONZE']]].map(([l,k,opts])=>(
                    <div key={k}>
                      <label className="text-xs font-bold block mb-1" style={{color:'#696969'}}>{l}</label>
                      <select value={(newDeal as any)[k]} onChange={e=>setNewDeal(p=>({...p,[k]:e.target.value}))} className="w-full px-3 py-2 text-sm rounded-xl">
                        {(opts as string[]).map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={addDeal} className="gfm-btn-primary flex-1 py-2.5 text-sm">Add Deal</button>
                <button onClick={()=>setModal(false)} className="gfm-btn-outline px-4 py-2.5 text-sm" style={{color:'#696969'}}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* KANBAN */}
        {view === 'kanban' && (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {STAGES.map((stage,si)=>{
              const col = deals.filter(d=>d.stage===stage);
              const colCapex = col.reduce((a,d)=>a+capexNum(d.capex),0);
              return (
                <div key={stage} className="flex-shrink-0 w-52">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2 h-2 rounded-full" style={{background:STAGE_C[si]}}/>
                    <span className="text-xs font-extrabold uppercase tracking-wide" style={{color:STAGE_C[si]}}>{stage}</span>
                    <span className="text-xs ml-auto" style={{color:'#696969'}}>{col.length}</span>
                  </div>
                  {col.length > 0 && (
                    <div className="text-xs mb-2 text-right" style={{color:'#696969'}}>
                      ${(colCapex/1000).toFixed(1)}B
                    </div>
                  )}
                  <div className="space-y-2">
                    {col.map(deal=>(
                      <div key={deal.id} className="gfm-card p-3 cursor-default">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{deal.flag}</span>
                          <div>
                            <div className="font-bold text-xs" style={{color:'#0A3D62'}}>{deal.company}</div>
                            <div className="text-xs" style={{color:'#696969'}}>{deal.eco}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-extrabold font-data" style={{color:'#74BB65'}}>{deal.capex}</span>
                          <span className="text-xs font-extrabold" style={{color:GRADE_C[deal.grade]}}>{deal.grade.slice(0,2)}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span style={{color:'#696969'}}>Probability</span>
                            <span style={{color:'#22c55e'}}>{deal.prob}%</span>
                          </div>
                          <div className="gfm-progress h-1"><div className="gfm-progress-bar h-1" style={{width:`${deal.prob}%`}}/></div>
                        </div>
                        <div className="flex gap-1">
                          {si < STAGES.length-1 && (
                            <button onClick={()=>advance(deal.id)}
                              className="flex-1 text-xs py-1 rounded-lg font-bold transition-all"
                              style={{background:'rgba(116,187,101,0.1)',color:'#74BB65'}}>
                              → Advance
                            </button>
                          )}
                          <Link href={`/company-profiles`}
                            className="text-xs py-1 px-2 rounded-lg"
                            style={{background:'rgba(10,61,98,0.1)',color:'#696969'}}>
                            🔍
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TABLE */}
        {view === 'table' && (
          <div className="gfm-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="gfm-table">
                <thead><tr>
                  <th>Company</th><th>Economy</th><th>Sector</th><th>CapEx</th>
                  <th>Stage</th><th>Grade</th><th>Probability</th><th></th>
                </tr></thead>
                <tbody>
                  {deals.map(d=>{
                    const si=STAGES.indexOf(d.stage);
                    return (
                      <tr key={d.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span>{d.flag}</span>
                            <span className="font-bold" style={{color:'#0A3D62'}}>{d.company}</span>
                          </div>
                        </td>
                        <td style={{color:'#696969'}}>{d.eco}</td>
                        <td style={{color:'#696969'}}>{d.sector}</td>
                        <td className="font-extrabold font-data" style={{color:'#74BB65'}}>{d.capex}</td>
                        <td>
                          <span className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{background:`${STAGE_C[si]}20`,color:STAGE_C[si]}}>
                            {d.stage}
                          </span>
                        </td>
                        <td className="font-extrabold" style={{color:GRADE_C[d.grade]}}>{d.grade}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm" style={{color:'#22c55e'}}>{d.prob}%</span>
                            <div className="w-16 bg-white/5 rounded-full h-1">
                              <div className="h-1 rounded-full" style={{width:`${d.prob}%`,background:'#22c55e'}}/>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button onClick={()=>advance(d.id)}
                            className="text-xs px-2 py-1 rounded font-bold"
                            style={{color:'#74BB65',background:'rgba(116,187,101,0.1)'}}>
                            Advance →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
