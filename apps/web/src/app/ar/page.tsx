'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Globe, TrendingUp, BarChart3, Zap, ArrowRight, Shield } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function ArabicPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div dir="rtl" lang="ar" style={{minHeight:'100vh',background:'#E2F2DF',fontFamily:"'Segoe UI',Tahoma,Geneva,sans-serif"}}>
      {/* Arabic NavBar */}
      <nav style={{background:'white',boxShadow:'0 2px 12px rgba(10,61,98,0.08)',position:'sticky',top:0,zIndex:50}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 24px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:'64px'}}>
            <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'baseline',gap:'2px'}}>
              <span style={{fontSize:'19px',fontWeight:900,color:'#0A3D62'}}>جلوبال</span>
              <span style={{fontSize:'19px',fontWeight:900,color:'#74BB65',margin:'0 4px'}}>إف دي آي</span>
              <span style={{fontSize:'19px',fontWeight:900,color:'#0A3D62'}}>مونيتور</span>
            </Link>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <Link href="/" style={{fontSize:'13px',fontWeight:600,color:'#0A3D62',textDecoration:'none',
                padding:'6px 14px',borderRadius:'7px',background:'rgba(10,61,98,0.06)'}}>
                English
              </Link>
              <Link href="/signals" style={{display:'flex',alignItems:'center',gap:'5px',
                padding:'5px 11px',borderRadius:'20px',background:'rgba(116,187,101,0.1)',
                border:'1px solid rgba(116,187,101,0.3)',textDecoration:'none'}}>
                <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',
                  animation:'livePulse 2s infinite',display:'inline-block'}}/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65'}}>مباشر</span>
              </Link>
              <Link href="/register" style={{fontSize:'13px',fontWeight:700,color:'white',
                background:'#74BB65',borderRadius:'7px',padding:'8px 18px',textDecoration:'none'}}>
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
        {/* Nav items */}
        <div style={{background:'#0A3D62'}}>
          <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 24px',display:'flex',gap:'0',overflowX:'auto'}}>
            {[
              {label:'الرئيسية',         href:'/'},
              {label:'لوحة التحكم',      href:'/dashboard'},
              {label:'تحليل الاستثمار', href:'/investment-analysis'},
              {label:'الإشارات الحية',  href:'/signals'},
              {label:'تخطيط البعثات',   href:'/pmp'},
              {label:'الموارد',          href:'/market-insights'},
              {label:'تواصل معنا',       href:'/contact'},
            ].map(item=>(
              <Link key={item.href} href={item.href}
                style={{padding:'12px 16px',fontSize:'13px',fontWeight:500,
                  color:'rgba(255,255,255,0.82)',textDecoration:'none',whiteSpace:'nowrap',display:'block',
                  borderBottom:'2px solid transparent',transition:'all 0.2s'}}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#061E30 0%,#0A3D62 45%,#0E4F7A 100%)',
        padding:'72px 40px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,
          backgroundImage:'linear-gradient(rgba(116,187,101,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(116,187,101,0.06) 1px,transparent 1px)',
          backgroundSize:'48px 48px'}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',
            background:'rgba(116,187,101,0.12)',border:'1px solid rgba(116,187,101,0.3)',
            padding:'6px 18px',borderRadius:'24px',marginBottom:'24px'}}>
            <Zap size={13} color="#74BB65"/>
            <span style={{fontSize:'12px',fontWeight:800,color:'#74BB65',letterSpacing:'0.05em'}}>
              مباشر · ٢١٨+ إشارة استثمار
            </span>
          </div>
          <h1 style={{fontSize:'clamp(30px,4.5vw,60px)',fontWeight:900,color:'white',
            lineHeight:'1.2',marginBottom:'20px'}}>
            منصة الاستخبارات الاستثمارية<br/>
            <span style={{color:'#74BB65'}}>الأكثر تطوراً في العالم</span>
          </h1>
          <p style={{fontSize:'17px',color:'rgba(226,242,223,0.85)',lineHeight:'1.8',
            marginBottom:'36px',maxWidth:'680px',margin:'0 auto 36px'}}>
            تحليل الاستثمار الأجنبي المباشر لـ ٢١٥ اقتصاداً، مع إشارات في الوقت الفعلي، 
            تقييم الجاهزية المستقبلية العالمية، وأدوات التحليل الاستثماري المتكاملة.
          </p>
          <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'15px 36px',background:'#74BB65',color:'white',borderRadius:'10px',
              textDecoration:'none',fontWeight:800,fontSize:'16px',
              boxShadow:'0 6px 24px rgba(116,187,101,0.4)'}}>
              ابدأ التجربة المجانية
              <ArrowRight size={16} style={{transform:'rotate(180deg)'}}/>
            </Link>
            <Link href="/contact" style={{display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'15px 28px',border:'1px solid rgba(255,255,255,0.25)',
              color:'rgba(226,242,223,0.9)',borderRadius:'10px',textDecoration:'none',fontWeight:600,fontSize:'16px'}}>
              طلب عرض توضيحي
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{background:'#0A3D62',padding:'40px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',
          gridTemplateColumns:'repeat(6,1fr)',gap:'20px',textAlign:'center'}}>
          {[
            {v:215,  s:'',  l:'اقتصاداً',     icon:Globe},
            {v:1400, s:'+', l:'منطقة حرة',    icon:TrendingUp},
            {v:218,  s:'+', l:'إشارة مباشرة', icon:Zap},
            {v:300,  s:'+', l:'مصدر بيانات',  icon:Shield},
            {v:107,  s:'',  l:'نقطة API',      icon:BarChart3},
            {v:30,   s:'+', l:'سنة بيانات',   icon:TrendingUp},
          ].map(({v,s,l,icon:Icon})=>(
            <div key={l}>
              <Icon size={20} color="#74BB65" style={{marginBottom:'8px'}}/>
              <div style={{fontSize:'clamp(20px,2.5vw,28px)',fontWeight:900,color:'white',fontFamily:'monospace',lineHeight:1}}>
                <AnimatedCounter value={v} suffix={s} duration={2500}/>
              </div>
              <div style={{fontSize:'11px',color:'rgba(226,242,223,0.6)',marginTop:'5px',fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{padding:'72px 40px',background:'#E2F2DF'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'48px'}}>
            <h2 style={{fontSize:'clamp(24px,3.5vw,38px)',fontWeight:900,color:'#0A3D62',marginBottom:'12px'}}>
              منصة متكاملة للاستخبارات الاستثمارية
            </h2>
            <p style={{fontSize:'15px',color:'#696969',maxWidth:'560px',margin:'0 auto',lineHeight:'1.75'}}>
              من الإشارات الفورية إلى التوقعات حتى عام ٢٠٥٠ — كل ما تحتاجه في مكان واحد
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px'}}>
            {[
              {icon:'⚡',title:'إشارات الاستثمار المباشر',link:'/signals',
               desc:'٢١٨+ إشارة مباشرة مُصنَّفة من بلاتينيوم إلى برونز. تحقق Z3 وبصمة SHA-256.'},
              {icon:'📊',title:'تحليل الاستثمار',link:'/investment-analysis',
               desc:'نقاط فرص الاستثمار العالمية لـ ٢١٥ اقتصاداً بـ ٤ طبقات تحليل متكاملة.'},
              {icon:'🎯',title:'تخطيط بعثات الترويج',link:'/pmp',
               desc:'تحديد الوجهات والشركات المستهدفة والجهات الحكومية لبعثات الترويج الاستثماري.'},
              {icon:'📈',title:'التوقعات حتى ٢٠٥٠',link:'/forecast',
               desc:'توقعات احتمالية للاستثمار الأجنبي المباشر بسيناريوهات متفائلة وأساسية ومتشائمة.'},
            ].map(f=>(
              <Link key={f.title} href={f.link} style={{textDecoration:'none'}}>
                <div style={{background:'white',borderRadius:'14px',padding:'24px',height:'100%',
                  boxShadow:'0 2px 12px rgba(10,61,98,0.07)',
                  border:'1px solid rgba(10,61,98,0.06)',cursor:'pointer',
                  display:'flex',flexDirection:'column',gap:'10px',transition:'all 0.2s'}}>
                  <span style={{fontSize:'36px'}}>{f.icon}</span>
                  <h3 style={{fontSize:'15px',fontWeight:700,color:'#0A3D62',margin:0}}>{f.title}</h3>
                  <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.65',margin:0,flex:1}}>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',
        padding:'72px 40px',textAlign:'center'}}>
        <div style={{maxWidth:'580px',margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(26px,3.5vw,40px)',fontWeight:900,color:'white',
            marginBottom:'14px',lineHeight:'1.2'}}>
            جاهز لاستكشاف استخبارات الاستثمار العالمية؟
          </h2>
          <p style={{color:'rgba(226,242,223,0.82)',marginBottom:'28px',fontSize:'16px',lineHeight:'1.75'}}>
            تجربة مجانية لـ ٧ أيام — لا بطاقة ائتمان مطلوبة — وصول كامل للمنصة
          </p>
          <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'14px 36px',background:'#74BB65',color:'white',
              borderRadius:'10px',textDecoration:'none',fontWeight:900,fontSize:'16px',
              boxShadow:'0 6px 24px rgba(116,187,101,0.35)'}}>
              ابدأ التجربة المجانية
            </Link>
            <Link href="/contact" style={{padding:'14px 24px',border:'1px solid rgba(226,242,223,0.35)',
              color:'rgba(226,242,223,0.9)',borderRadius:'10px',textDecoration:'none',
              fontWeight:600,fontSize:'16px'}}>
              اطلب عرضاً توضيحياً
            </Link>
          </div>
        </div>
      </section>

      {/* Arabic footer */}
      <footer style={{background:'#061E30',padding:'36px 40px',textAlign:'center'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'center',gap:'24px',marginBottom:'16px',flexWrap:'wrap'}}>
            {[['/','الرئيسية'],['/about','عن المنصة'],['/pricing','الأسعار'],['/contact','تواصل معنا'],
              ['/privacy','الخصوصية'],['/terms','الشروط']].map(([href,label])=>(
              <Link key={href} href={href} style={{fontSize:'12px',color:'rgba(226,242,223,0.55)',textDecoration:'none'}}>
                {label}
              </Link>
            ))}
          </div>
          <p style={{fontSize:'12px',color:'rgba(226,242,223,0.35)',margin:0}}>
            © ٢٠٢٦ جلوبال إف دي آي مونيتور · مركز دبي المالي العالمي، دبي، الإمارات
          </p>
        </div>
      </footer>
    </div>
  );
}
