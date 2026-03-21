'use client'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { Download, ExternalLink } from 'lucide-react'

const PUBS=[
  {issue:47,date:'March 24, 2026',title:'ASEAN EV Corridor: $25B Supply Chain Investment',summary:'Vietnam, Thailand, Malaysia form landmark EV supply chain agreement. Samsung SDI, CATL, and LG Energy Solution confirm combined $12B commitment.',cover:'EV'},
  {issue:46,date:'March 17, 2026',title:"Malaysia's Data Center Boom: $5B+ Investment Expected",summary:'100% FDI cap removal opens immediate hyperscaler opportunities. Microsoft, AWS, and Google in advanced negotiations.',cover:'DC'},
  {issue:45,date:'March 10, 2026',title:'Vietnam Electronics Surge: 34% Export Growth',summary:'Electronics exports surge driven by semiconductor demand. Apple, Samsung supplier base expanding rapidly.',cover:'VN'},
  {issue:44,date:'March 3, 2026',title:'Saudi Arabia FDI Reform: 30-Day License Guarantee',summary:"Kingdom's fastest FDI approval process goes live. NEOM Phase 2 construction contracts issued worth $1.8B.",cover:'SA'},
  {issue:43,date:'February 24, 2026',title:'UAE AI Infrastructure: Microsoft $3.3B Commitment',summary:'UAE positions as global AI data center hub. Masdar City expansion adds 500MW renewable capacity.',cover:'AE'},
  {issue:42,date:'February 17, 2026',title:'India PLI 2.0: $2.7B Semiconductor Incentive Package',summary:'India Semiconductor Mission Phase 2 announced. Micron, Samsung, TSMC each commit to separate facilities.',cover:'IN'},
]

const COVER_COLORS:Record<string,string>={EV:'#2ECC71',DC:'#3498DB',VN:'#9B59B6',SA:'#E74C3C',AE:'#F1C40F',IN:'#E67E22'}

export default function PublicationsPage() {
  const latest=PUBS[0]
  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>
      <div className="max-w-[1540px] mx-auto px-6 py-10">
        <div className="section-label">Weekly Intelligence</div>
        <h1 className="page-title">Publications</h1>
        <p className="page-sub">Weekly Intelligence Briefs — Strategic investment intelligence delivered every Monday</p>

        {/* Latest issue */}
        <div className="floating-card mb-10">
          <div className="grid grid-cols-[280px_1fr] gap-8">
            <div className="rounded-2xl h-56 flex items-center justify-center text-white text-6xl"
              style={{background:`linear-gradient(135deg,${COVER_COLORS[latest.cover]},${COVER_COLORS[latest.cover]}90)`}}>
              📊
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="section-label !mb-0">Issue #{latest.issue}</span>
                <span className="text-sm text-text-secondary">{latest.date}</span>
                <span className="badge-new">LATEST</span>
              </div>
              <h2 className="text-2xl font-black text-primary-dark mb-3">{latest.title}</h2>
              <p className="text-text-secondary leading-relaxed mb-5">{latest.summary}</p>
              <div className="flex gap-3">
                <button className="btn-primary flex items-center gap-2"><Download size={14}/> Download PDF</button>
                <button className="btn-outline flex items-center gap-2"><ExternalLink size={14}/> Read Summary</button>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-black text-primary-dark mb-5">Archive</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {PUBS.slice(1).map(pub=>(
            <div key={pub.issue} className="floating-card !p-5">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0"
                  style={{background:`linear-gradient(135deg,${COVER_COLORS[pub.cover]},${COVER_COLORS[pub.cover]}90)`}}>
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary-teal">Issue #{pub.issue}</span>
                    <span className="text-[10px] text-text-light">{pub.date}</span>
                  </div>
                  <h3 className="font-bold text-primary-dark text-sm leading-snug mb-2">{pub.title}</h3>
                  <button className="text-primary-teal text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Download PDF <Download size={11}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-10 p-8 rounded-3xl text-center" style={{background:'linear-gradient(135deg,#1A2C3E,#243d56)'}}>
          <h3 className="text-xl font-black text-white mb-2">Never miss an Intelligence Brief</h3>
          <p className="text-white/55 text-sm mb-5">12,847 investment professionals subscribe. Delivered every Monday 09:00 GMT.</p>
          <div className="flex justify-center gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-teal border-2 border-transparent"/>
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}
