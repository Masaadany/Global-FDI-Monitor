'use client';
import { useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || '';
const ENQUIRY_TYPES = [
  {value:'sales',label:'Sales / Pricing',icon:'💰'},
  {value:'demo', label:'Request Demo',   icon:'📺'},
  {value:'tech', label:'Tech Support',   icon:'⚙️'},
  {value:'data', label:'Data Partnership',icon:'📊'},
  {value:'media',label:'Media / Press',  icon:'📰'},
  {value:'other',label:'Other',          icon:'✉️'},
];
export default function ContactPage() {
  const [form,   setForm]   = useState({name:'',email:'',org:'',type:'sales',message:''});
  const [loading,setLoading]= useState(false);
  const [sent,   setSent]   = useState(false);
  const [error,  setError]  = useState('');
  function set(k:string,v:string){setForm(f=>({...f,[k]:v}));}
  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(!form.name||!form.email||!form.message){setError('Please fill all required fields.');return;}
    setLoading(true);setError('');
    try{
      const res=await fetch(`${API}/api/v1/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d=await res.json();
      if(d.success)setSent(true); else setError(d.error?.message||'Failed. Email contact@fdimonitor.org');
    }catch{setSent(true);}
    finally{setLoading(false);}
  }
  if(sent) return(
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-extrabold text-2xl text-deep mb-2">Message sent</h2>
        <p className="text-slate-500 text-sm">We respond within 4 business hours. You'll hear from us at <strong>{form.email}</strong>.</p>
        <a href="/" className="gfm-btn-primary mt-6 inline-flex">Back to Home</a>
      </div>
    </div>
  );
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-16">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl font-extrabold mb-3">Get in Touch</h1>
          <p className="text-white/70">Questions about pricing, partnerships, or data? We respond within 4 hours.</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-3 gap-8 py-12">
        <div className="space-y-5">
          <div className="font-extrabold text-deep">Forecasta Ltd</div>
          <p className="text-slate-500 text-sm leading-relaxed">Global FDI Monitor is a product of Forecasta — intelligence for investment promotion professionals.</p>
          {[['✉️','info@fdimonitor.org'],['📞','+971 50 286 7070'],['🌐','fdimonitor.org'],['⏱️','4h response time']].map(([i,v])=>(
            <div key={String(v)} className="flex items-center gap-3 text-sm text-deep"><span className="text-lg">{i}</span>{v}</div>
          ))}
          <div className="pt-4 border-t border-slate-200">
            {[['Pricing','/pricing'],['Free Trial','/register'],['GFR Rankings','/gfr'],['Demo','/demo']].map(([l,h])=>(
              <a key={l} href={h} className="block text-sm text-primary hover:underline py-0.5">{l} →</a>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 gfm-card p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {ENQUIRY_TYPES.map(t=>(
                <button key={t.value} type="button" onClick={()=>set('type',t.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${form.type===t.value?'border-primary bg-primary-light text-primary':'border-slate-200 text-slate-500 hover:border-primary'}`}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Your name *</label>
                <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Full name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/></div>
              <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Work email *</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@org.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/></div>
            </div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation</label>
              <input value={form.org} onChange={e=>set('org',e.target.value)} placeholder="Your IPA or company"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"/></div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1.5">Message *</label>
              <textarea value={form.message} onChange={e=>set('message',e.target.value)} rows={4} placeholder="Tell us about your FDI intelligence needs…"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"/></div>
            {error&&<p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg font-semibold">{error}</p>}
            <button type="submit" disabled={loading}
              className={`w-full gfm-btn-primary py-3.5 rounded-xl text-sm ${loading?'opacity-50 cursor-not-allowed':''}`}>
              {loading?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</span>:'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
