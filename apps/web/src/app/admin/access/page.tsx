'use client';
import { useEffect, useState } from 'react';

export default function AdminAccessPage() {
  const [status, setStatus] = useState('Setting admin access...');

  useEffect(() => {
    // Set the admin cookie directly in browser
    document.cookie = 'gfm_admin_access=gfm_admin_2026_secure; max-age=604800; path=/; samesite=lax';
    setStatus('✅ Admin access granted — redirecting to dashboard...');
    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#0A3D62',display:'flex',alignItems:'center',
      justifyContent:'center',color:'white',fontFamily:'monospace',fontSize:'16px',textAlign:'center'}}>
      <div>
        <div style={{fontSize:'32px',marginBottom:'16px'}}>🔐</div>
        <div>{status}</div>
        <div style={{fontSize:'12px',opacity:0.6,marginTop:'12px'}}>
          Cookie: gfm_admin_access=gfm_admin_2026_secure
        </div>
        <div style={{marginTop:'20px',fontSize:'12px',opacity:0.5}}>
          Bookmark this URL to re-activate admin access anytime.
        </div>
      </div>
    </div>
  );
}
