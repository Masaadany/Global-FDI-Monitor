'use client';
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const CREDIT_GUIDE = [
  {type:'Market Intelligence Brief',  code:'MIB',  credits:5,  icon:'📋'},
  {type:'Sector & Economy Report',    code:'SER',  credits:8,  icon:'📊'},
  {type:'Investment Climate Report',  code:'ICR',  credits:18, icon:'🌍'},
  {type:'Targeted Investment Report', code:'TIR',  credits:20, icon:'🎯'},
  {type:'Flagship GFR Report',        code:'FCGR', credits:25, icon:'🏆'},
  {type:'Mission Planning Dossier',   code:'PMP',  credits:30, icon:'🗺'},
  {type:'Custom Report',             code:'CRP',  credits:35, icon:'✏️'},
];

export default function FICSuccessPage() {
  const [credits, setCredits] = useState(200);
  const [pack,    setPack]    = useState('Professional');
  const [ref,     setRef]     = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gfm_credits_pack') || 'professional';
      const map: Record<string,number> = {starter:50,professional:200,enterprise:500};
      const nameMap: Record<string,string> = {starter:'Starter',professional:'Professional',enterprise:'Enterprise'};
      setCredits(map[stored] || 200);
      setPack(nameMap[stored] || 'Professional');
    } catch {}
    setRef('GFM-CRED-' + Math.random().toString(36).slice(2,10).toUpperCase());
  }, []);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Confirmation card */}
        <div className="gfm-card p-8 text-center mb-5">
          <div className="text-6xl mb-4">✅</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)'}}>
            <span className="text-2xl font-extrabold font-data" style={{color:'#22c55e'}}>{credits}</span>
            <span className="text-sm font-bold" style={{color:'#22c55e'}}>credits added — {pack} pack</span>
          </div>
          <h2 className="text-xl font-extrabold mb-2" style={{color:'#0A3D62'}}>Intelligence Credits Added</h2>
          <p className="text-sm mb-3" style={{color:'#696969'}}>
            Credits are ready to use on any report type. They never expire and carry over month to month.
          </p>
          {ref && (
            <div className="text-xs font-data px-3 py-1 rounded-full inline-block" style={{background:'rgba(116,187,101,0.1)',color:'#74BB65'}}>
              Reference: {ref}
            </div>
          )}
        </div>

        {/* Credit cost guide */}
        <div className="gfm-card overflow-hidden mb-5">
          <div className="px-5 py-3 border-b font-extrabold text-sm" style={{borderBottomColor:'rgba(10,61,98,0.1)',color:'#0A3D62'}}>
            How many reports can you generate?
          </div>
          <div className="divide-y" style={{borderColor:'rgba(10,61,98,0.06)'}}>
            {CREDIT_GUIDE.map(g=>(
              <div key={g.code} className="px-5 py-2.5 flex items-center gap-3">
                <span className="text-lg flex-shrink-0">{g.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-semibold" style={{color:'#0A3D62'}}>{g.type}</div>
                  <div className="text-xs" style={{color:'#696969'}}>{g.code} · {g.credits} credits each</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-extrabold font-data" style={{color:'#74BB65'}}>{Math.floor(credits / g.credits)}×</div>
                  <div className="text-xs" style={{color:'#696969'}}>reports</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/reports"      className="gfm-btn-primary py-3 text-center text-sm">Generate Report →</Link>
          <Link href="/fic/credits"  className="gfm-btn-outline py-3 text-center text-sm" style={{color:'#696969'}}>Buy More Credits</Link>
        </div>
        <p className="text-xs text-center mt-3" style={{color:'#696969'}}>
          Credits balance visible in <Link href="/settings" style={{color:'#74BB65'}}>Settings → Billing</Link>
        </p>
      </div>
    </div>
  );
}
