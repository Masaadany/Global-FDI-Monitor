'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', org:'', message:'', type:'demo' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to API or Formspree
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-black mb-3">Contact Us</h1>
        <p className="text-blue-200 max-w-lg mx-auto">Request a demo, ask about enterprise pricing, or get help with your account.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Contact options */}
        <div className="space-y-6">
          {[
            { icon:'🎯', title:'Request a Demo', desc:'See the platform live with a member of our team. 30-minute walkthrough tailored to your use case.', email:'demo@fdimonitor.org' },
            { icon:'🏢', title:'Enterprise Sales', desc:'10+ users, white-label, custom data integrations, SLA. Contact our enterprise team for a tailored quote.', email:'enterprise@fdimonitor.org' },
            { icon:'🛠', title:'Technical Support', desc:'API issues, billing questions, account access. We respond within 4 business hours.', email:'support@fdimonitor.org' },
            { icon:'📰', title:'Press & Media', desc:'Coverage, interviews, data requests for research publications.', email:'press@fdimonitor.org' },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-[#0A2540] mb-1">{c.title}</div>
              <p className="text-slate-500 text-sm mb-2">{c.desc}</p>
              <a href={`mailto:${c.email}`} className="text-blue-600 text-sm font-semibold hover:underline">{c.email}</a>
            </div>
          ))}
        </div>

        {/* Contact form */}
        {sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">✅</div>
            <div className="font-black text-xl text-[#0A2540] mb-2">Message sent!</div>
            <p className="text-slate-500 text-sm">We&apos;ll get back to you within 1 business day.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <div className="font-black text-lg text-[#0A2540] mb-5">Send us a message</div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Enquiry type</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  value={form.type} onChange={e => setForm(f => ({...f, type:e.target.value}))}>
                  <option value="demo">Request a demo</option>
                  <option value="enterprise">Enterprise pricing</option>
                  <option value="support">Technical support</option>
                  <option value="press">Press / media</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {[
                { key:'name',    label:'Full name',         placeholder:'Your name' },
                { key:'email',   label:'Work email',        placeholder:'you@organisation.com' },
                { key:'org',     label:'Organisation',      placeholder:'Your IPA or company' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">{f.label}</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}/>
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Message</label>
                <textarea rows={4} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                  placeholder="Tell us about your use case..."
                  value={form.message} onChange={e => setForm(f => ({...f, message:e.target.value}))}/>
              </div>
              <button type="submit"
                className="w-full bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
