import Link from 'next/link';

export default function NotFound(){
  return(
    <div style={{minHeight:'100vh',background:'#F8F9FA',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"'Inter','Helvetica Neue',sans-serif",position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
      <div style={{textAlign:'center',maxWidth:'520px',position:'relative'}}>
        <div style={{fontSize:'100px',fontWeight:900,color:'rgba(0,255,200,0.06)',fontFamily:"'Orbitron','JetBrains Mono',monospace",lineHeight:1,marginBottom:'8px',letterSpacing:'-4px'}}>404</div>
        <div style={{width:'60px',height:'2px',background:'linear-gradient(90deg,transparent,#00ffc8,transparent)',margin:'0 auto 24px'}}/>
        <h1 style={{fontSize:'22px',fontWeight:800,color:'#1A2C3E',marginBottom:'12px'}}>Economy not found</h1>
        <p style={{fontSize:'14px',color:'rgba(232,244,248,0.45)',lineHeight:1.75,marginBottom:'28px'}}>
          The page or economy you are looking for doesn't exist in our database yet. We currently cover 215+ economies — try the Investment Analysis table.
        </p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/dashboard" style={{padding:'11px 24px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800,boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>Go to Dashboard →</Link>
          <Link href="/investment-analysis" style={{padding:'11px 20px',border:'1px solid rgba(232,244,248,0.12)',color:'rgba(232,244,248,0.65)',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:600}}>Investment Analysis</Link>
        </div>
      </div>
    </div>
  );
}
