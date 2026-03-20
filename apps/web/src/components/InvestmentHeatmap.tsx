'use client';
import Link from 'next/link';

const HEATMAP_DATA = [
  {iso3:'ARE',name:'UAE',          val:80,  fdi:25.3, flag:'🇦🇪', c:'#74BB65'},
  {iso3:'SGP',name:'Singapore',   val:88,  fdi:18.5, flag:'🇸🇬', c:'#0A3D62'},
  {iso3:'SAU',name:'Saudi Arabia',val:72,  fdi:18.2, flag:'🇸🇦', c:'#74BB65'},
  {iso3:'IND',name:'India',        val:58,  fdi:12.3, flag:'🇮🇳', c:'#696969'},
  {iso3:'USA',name:'USA',          val:85,  fdi:182,  flag:'🇺🇸', c:'#0A3D62'},
  {iso3:'DEU',name:'Germany',      val:78,  fdi:12.8, flag:'🇩🇪', c:'#74BB65'},
  {iso3:'GBR',name:'UK',           val:79,  fdi:14.8, flag:'🇬🇧', c:'#74BB65'},
  {iso3:'VNM',name:'Vietnam',      val:56,  fdi:8.9,  flag:'🇻🇳', c:'#696969'},
  {iso3:'IDN',name:'Indonesia',    val:54,  fdi:11.2, flag:'🇮🇩', c:'#696969'},
  {iso3:'AUS',name:'Australia',    val:82,  fdi:14.2, flag:'🇦🇺', c:'#0A3D62'},
  {iso3:'CHN',name:'China',        val:62,  fdi:42.8, flag:'🇨🇳', c:'#696969'},
  {iso3:'BRA',name:'Brazil',       val:52,  fdi:14.8, flag:'🇧🇷', c:'#696969'},
];

export default function InvestmentHeatmap() {
  const maxFdi = Math.max(...HEATMAP_DATA.map(d=>d.fdi));

  return (
    <div role="region" aria-label="Investment heatmap" className="gfm-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-extrabold text-sm" style={{color:'#0A3D62'}}>🌡️ FDI Attractiveness Heatmap</div>
        <Link href="/gfr" className="text-xs font-bold" style={{color:'#74BB65'}}>Full Assessment →</Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {HEATMAP_DATA.map(d=>(
          <Link key={d.iso3} href={`/country/${d.iso3}`}
            className="p-2 rounded-xl flex flex-col items-center gap-1 hover:-translate-y-0.5 transition-transform"
            style={{background:`${d.c}15`,border:`1px solid ${d.c}25`}}>
            <span className="text-xl">{d.flag}</span>
            <span className="text-xs font-bold" style={{color:'#0A3D62'}}>{d.iso3}</span>
            <span className="text-xs font-extrabold font-data" style={{color:d.c}}>{d.val}</span>
            <div className="w-full bg-white/5 rounded-full h-1">
              <div className="h-1 rounded-full" style={{width:`${(d.fdi/maxFdi)*100}%`,background:d.c}}/>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs" style={{color:'#696969'}}>
        <span>GFR Score (0–100)</span>
        <div className="flex gap-3">
          {[['#0A3D62','FRONTIER (75+)'],['#74BB65','HIGH (60–74)'],['#696969','MEDIUM']].map(([c,l])=>(
            <span key={l} className="flex items-center gap-1"><span style={{color:c as string}}>■</span>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
