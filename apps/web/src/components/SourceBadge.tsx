'use client';
import { useState } from 'react';

interface SourceBadgeProps {
  source: string;
  url?: string;
  date?: string;
  accessed?: string;
  refCode?: string;
  children: React.ReactNode;
}

export default function SourceBadge({ source, url, date, accessed, refCode, children }: SourceBadgeProps) {
  const [show, setShow] = useState(false);
  const ref = refCode || `GFM-SRC-${Math.floor(Math.random()*900000+100000)}`;
  const acc = accessed || '20 Mar 2026';

  return (
    <span className="source-badge-wrapper" style={{position:'relative',display:'inline-flex',alignItems:'center',gap:'2px'}}>
      {children}
      <button
        onClick={() => setShow(s=>!s)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="source-badge-btn"
        aria-label={`Source: ${source}`}
        style={{
          display:'inline-flex',alignItems:'center',justifyContent:'center',
          width:'14px',height:'14px',borderRadius:'50%',border:'1px solid rgba(10,61,98,0.3)',
          background:'rgba(116,187,101,0.1)',cursor:'pointer',fontSize:'9px',fontWeight:700,
          color:'#0A3D62',flexShrink:0,lineHeight:1,verticalAlign:'super',
        }}>
        ⓘ
      </button>
      {show && (
        <div style={{
          position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',
          background:'#0A3D62',color:'white',borderRadius:'8px',padding:'10px 12px',
          fontSize:'11px',lineHeight:'1.5',whiteSpace:'nowrap',zIndex:9999,
          boxShadow:'0 4px 20px rgba(10,61,98,0.25)',minWidth:'280px',maxWidth:'340px',
          pointerEvents:'none',
        }}>
          <div style={{fontWeight:700,marginBottom:'4px',color:'#74BB65'}}>Data Source</div>
          <div style={{marginBottom:'2px'}}>
            {url ? (
              <a href={url} target="_blank" rel="noopener" style={{color:'#E2F2DF',textDecoration:'underline'}}>{source}</a>
            ) : (
              <span style={{color:'#E2F2DF'}}>{source}</span>
            )}
          </div>
          {date    && <div style={{color:'rgba(226,242,223,0.7)'}}>Published: {date}</div>}
          <div style={{color:'rgba(226,242,223,0.7)'}}>Accessed: {acc}</div>
          <div style={{color:'rgba(226,242,223,0.5)',fontFamily:'monospace',fontSize:'10px',marginTop:'4px'}}>{ref}</div>
          <div style={{position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',
            borderLeft:'5px solid transparent',borderRight:'5px solid transparent',
            borderTop:'5px solid #0A3D62'}}/>
        </div>
      )}
    </span>
  );
}
