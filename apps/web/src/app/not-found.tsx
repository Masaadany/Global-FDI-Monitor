import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',background:'#0f1e2a',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <div style={{textAlign:'center',maxWidth:'500px'}}>
        <div style={{fontSize:'80px',fontWeight:900,color:'rgba(46,204,113,0.15)',fontFamily:"'JetBrains Mono',monospace",lineHeight:1,marginBottom:'4px'}}>404</div>
        <div style={{fontSize:'20px',fontWeight:800,color:'white',marginBottom:'10px'}}>Page not found</div>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)',lineHeight:'1.65',marginBottom:'28px'}}>
          The economy or page you are looking for doesn't exist in our database yet. We currently cover 215+ economies — try the Investment Analysis table.
        </p>
        <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/dashboard" style={{padding:'11px 24px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800}}>Go to Dashboard →</Link>
          <Link href="/investment-analysis" style={{padding:'11px 20px',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.7)',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:600}}>Investment Analysis</Link>
        </div>
      </div>
    </div>
  );
}
