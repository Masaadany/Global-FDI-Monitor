export default function Loading() {
  return (
    <div style={{minHeight:'100vh',background:'#F8F9FA',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}>
        <div style={{width:'48px',height:'48px',border:'3px solid rgba(0,255,200,0.15)',borderTop:'3px solid #2ECC71',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
        <div style={{fontSize:'12px',color:'rgba(0,255,200,0.5)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.1em'}}>LOADING...</div>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
