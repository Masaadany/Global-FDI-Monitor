'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const ENQUIRY_TYPES = [
  {value:'sales',     label:'Sales / Pricing',         icon:'💳'},
  {value:'demo',      label:'Request a Demo',           icon:'📺'},
  {value:'technical', label:'Technical Support',        icon:'⚙️'},
  {value:'data',      label:'Data Partnership',         icon:'📊'},
  {value:'media',     label:'Media / Press',            icon:'📰'},
  {value:'other',     label:'Other',                    icon:'✉️'},
];

export default function ContactPage() {
  const [form,    setForm]    = useState({name:'',email:'',org:'',type:'sales',message:''});
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  function set(k: string, v: string) { setForm(f=>({...f,[k]:v})); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill all required fields.'); return; }
    setLoading(true); setError('');
    try {
      // In production this would call /api/v1/contact
      await new Promise(r => setTimeout(r, 800)); // simulate
      setSent(true);
    } catch {
      setError('Failed to send. Please email us directly at contact@fdimonitor.org');
    } finally { setLoading(false); }
  }

  if (sent) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-black text-2xl text-[#0A2540] mb-2">Message sent</h2>
        <p className="text-slate-500 text-sm">We typically respond within 4 business hours. You'll receive a confirmation at <strong>{form.email}</strong>.</p>
        <a href="/" className="inline-block mt-6 bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">Back to Home</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Get in touch</h1>
          <p className="text-blue-200">Questions about pricing, partnerships, or data? We respond within 4 hours.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-5 grid md:grid-cols-3 gap-8 py-12">
        {/* Contact info */}
        <div className="space-y-5">
          <div>
            <div className="font-black text-[#0A2540] mb-3">Forecasta</div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Global FDI Monitor is a product of Forecasta — an intelligence platform provider for investment promotion professionals.
            </p>
          </div>
          {[
            {icon:'✉️',label:'Email',     value:'contact@fdimonitor.org'},
            {icon:'🌐',label:'Platform',  value:'fdimonitor.org'},
            {icon:'⏱️',label:'Response',  value:'Within 4 business hours'},
            {icon:'🌍',label:'Coverage',  value:'215 economies, global team'},
          ].map(c=>(
            <div key={c.label} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{c.icon}</span>
              <div>
                <div className="text-xs text-slate-400 font-bold">{c.label}</div>
                <div className="text-sm text-[#0A2540] font-semibold">{c.value}</div>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-200">
            <div className="font-bold text-sm text-[#0A2540] mb-2">Quick Links</div>
            {[['Pricing Plans','/pricing'],['Start Free Trial','/register'],['GFR Rankings','/gfr'],['About GFM','/about']].map(([l,h])=>(
              <a key={l} href={h} className="block text-sm text-blue-600 hover:underline py-0.5">{l} →</a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <form onSubmit={submit} className="space-y-4">
              {/* Enquiry type */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Enquiry type</label>
                <div className="grid grid-cols-3 gap-2">
                  {ENQUIRY_TYPES.map(t=>(
                    <button key={t.value} type="button" onClick={()=>set('type',t.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        form.type===t.value?'border-blue-400 bg-blue-50 text-blue-700':'border-slate-200 text-slate-500 hover:border-blue-200'
                      }`}>
                      <span>{t.icon}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Your name *</label>
                  <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Full name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Work email *</label>
                  <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@org.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Organisation</label>
                <input value={form.org} onChange={e=>set('org',e.target.value)} placeholder="Your IPA or company"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"/>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Message *</label>
                <textarea value={form.message} onChange={e=>set('message',e.target.value)}
                  placeholder="Tell us about your FDI intelligence needs…"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none"/>
              </div>

              {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg font-semibold">{error}</p>}

              <button type="submit" disabled={loading}
                className={`w-full font-black py-3.5 rounded-xl transition-colors ${
                  loading?'bg-slate-300 text-slate-500 cursor-not-allowed':'bg-[#0A2540] text-white hover:bg-[#1D4ED8]'
                }`}>
                {loading?(
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Sending…
                  </span>
                ):'Send Message'}
              </button>
              <p className="text-xs text-slate-400 text-center">We respond within 4 business hours · No spam</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
