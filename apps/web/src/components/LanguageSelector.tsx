'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  { code:'en', label:'English', dir:'ltr', path:'/'  },
  { code:'ar', label:'العربية', dir:'rtl', path:'/ar' },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const current = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar') ? 'ar' : 'en';
  const curr = LANGUAGES.find(l=>l.code===current) || LANGUAGES[0];

  function select(lang: typeof LANGUAGES[0]) {
    setOpen(false);
    router.push(lang.path);
  }

  return (
    <div className="relative">
      <button onClick={()=>setOpen(p=>!p)}
        aria-label="Select language" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/5"
        style={{color:'#696969'}}>
        🌐 {curr.label}
        <svg viewBox="0 0 10 6" width="8" height="8" fill="currentColor" style={{opacity:0.5}}>
          <path d="M0 0l5 6 5-6H0z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-lg"
             style={{background:'rgba(10,61,98,0.04)0.97)',border:'1px solid rgba(10,61,98,0.15)',minWidth:130}}>
          {LANGUAGES.map(lang=>(
            <button key={lang.code} onClick={()=>select(lang)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left transition-all hover:bg-white/5 ${lang.code===current?'text-radiance':''}`}
              style={{color:lang.code===current?'#74BB65':'#696969',direction:lang.dir as 'ltr'|'rtl'}}>
              {lang.label}
              {lang.code===current && <span className="ml-auto text-radiance">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
