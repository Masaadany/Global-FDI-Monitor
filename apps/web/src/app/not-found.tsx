import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',background:'#E2F2DF',display:'flex',alignItems:'center',
      justifyContent:'center',padding:'24px',textAlign:'center'}}>
      <div style={{maxWidth:'540px'}}>
        <div style={{fontSize:'80px',marginBottom:'16px',lineHeight:1}}>🌍</div>
        <h1 style={{fontSize:'32px',fontWeight:900,color:'#0A3D62',marginBottom:'10px'}}>
          Page Not Found
        </h1>
        <p style={{fontSize:'15px',color:'#696969',lineHeight:'1.75',marginBottom:'28px'}}>
          The page you're looking for doesn't exist or has been moved. 
          Explore our investment intelligence platform instead.
        </p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/dashboard" style={{padding:'12px 24px',background:'#0A3D62',color:'white',
            borderRadius:'9px',textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
            Go to Dashboard
          </Link>
          <Link href="/investment-analysis" style={{padding:'12px 22px',background:'#74BB65',color:'white',
            borderRadius:'9px',textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
            Investment Analysis
          </Link>
          <Link href="/" style={{padding:'12px 18px',border:'1px solid rgba(10,61,98,0.15)',color:'#0A3D62',
            borderRadius:'9px',textDecoration:'none',fontWeight:600,fontSize:'14px'}}>
            Home
          </Link>
        </div>
        <div style={{marginTop:'24px',fontSize:'12px',color:'#696969'}}>
          GFR Assessment · Investment Analysis · FDI Signals · Mission Planning
        </div>
      </div>
    </div>
  );
}
