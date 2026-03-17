'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[GFM Global Error]', error);
  }, [error]);

  return (
    <html>
      <body style={{margin:0,fontFamily:'system-ui,sans-serif',background:'#F8FAFC',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
        <div style={{background:'white',border:'1px solid #E2E8F0',borderRadius:16,padding:'40px',maxWidth:440,width:'100%',textAlign:'center',boxShadow:'0 1px 3px rgba(0,0,0,.1)'}}>
          <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
          <h1 style={{color:'#0A2540',fontSize:24,fontWeight:800,margin:'0 0 8px'}}>Something went wrong</h1>
          <p style={{color:'#64748B',fontSize:14,margin:'0 0 24px',lineHeight:1.6}}>
            A critical error occurred. We apologise for the inconvenience.
          </p>
          {error.digest && (
            <code style={{display:'block',background:'#F8FAFC',color:'#94A3B8',padding:'8px 12px',borderRadius:8,fontSize:11,marginBottom:20,fontFamily:'monospace'}}>
              {error.digest}
            </code>
          )}
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button onClick={reset}
              style={{background:'#0A66C2',color:'white',border:'none',padding:'12px 24px',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:14}}>
              Try Again
            </button>
            <a href="/"
              style={{background:'white',color:'#0A2540',border:'2px solid #E2E8F0',padding:'12px 24px',borderRadius:10,fontWeight:700,textDecoration:'none',fontSize:14}}>
              Go Home
            </a>
          </div>
          <p style={{color:'#CBD5E1',fontSize:11,marginTop:20}}>© 2026 Global FDI Monitor</p>
        </div>
      </body>
    </html>
  );
}
