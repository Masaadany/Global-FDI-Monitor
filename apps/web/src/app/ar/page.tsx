import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'مراقب الاستثمار الأجنبي المباشر — FDI Monitor',
  description: 'منصة ذكاء الاستثمار الأجنبي المباشر العالمية. تصنيفات 215 اقتصاداً وإشارات في الوقت الفعلي وتقارير ذكاء اصطناعي.',
};

const FEATURES = [
  { icon:'📡', ar:'إشارات الاستثمار المباشر الفوري',    en:'Live FDI Signal Intelligence',         desc:'218 إشارة مصنفة من PLATINUM إلى BRONZE · مؤشر SCI · التحقق Z3' },
  { icon:'🏆', ar:'تصنيف الجاهزية للمستقبل العالمي',   en:'Global Future Readiness (GFR)',         desc:'215 اقتصاداً · 6 أبعاد · 38 مؤشراً · ربع سنوي' },
  { icon:'📈', ar:'التنبؤ والتخطيط السيناريوهاتي',      en:'Forecast & Scenario Planning',         desc:'توقعات الاستثمار حتى 2050 · نماذج التفاؤل والضغط والقاعدة' },
  { icon:'📋', ar:'التقارير الذكية بالذكاء الاصطناعي',  en:'AI-Powered Intelligence Reports',       desc:'10 أنواع من التقارير · PDF فقط · علامة مائية SHA-256' },
  { icon:'🎯', ar:'مركز تخطيط المهمات',                 en:'Mission Planning Command Centre',       desc:'مطابقة الاقتصادات المستهدفة · ذكاء الممرات الاستثمارية' },
  { icon:'🌐', ar:'ذكاء الممرات الاستثمارية',           en:'Investment Corridor Intelligence',      desc:'أعلى 10 ممرات استثمارية · تحليل ثنائي · الرسوم البيانية القطاعية' },
];

const STATS = [
  { v:'215', l:'اقتصاداً مصنفاً' },
  { v:'218', l:'إشارة حية' },
  { v:'300+', l:'مصدر بيانات موثق' },
  { v:'10', l:'أنواع التقارير' },
  { v:'Z3', l:'التحقق الرسمي' },
  { v:'2026', l:'إطلاق المنصة' },
];

export default function ArabicPage() {
  return (
    <div className="min-h-screen" dir="rtl" lang="ar" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section className="gfm-hero px-6 py-14 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{color:'#74BB65',direction:'ltr'}}>GLOBAL INTELLIGENCE</div>
          <h1 className="text-4xl font-extrabold mb-3 leading-tight" style={{color:'#0A3D62',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>
            مراقب الاستثمار الأجنبي المباشر
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{color:'#696969',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>
            المنصة العالمية لذكاء الاستثمار الأجنبي المباشر. نوفر إشارات في الوقت الفعلي وتصنيفات 215 اقتصاداً وتقارير ذكاء اصطناعي ونماذج التنبؤ حتى عام 2050.
          </p>
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {STATS.map(s=>(
              <div key={s.l} className="text-center">
                <div className="text-2xl font-extrabold font-data" style={{color:'#74BB65',direction:'ltr'}}>{s.v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/dashboard" className="gfm-btn-primary px-8 py-3 text-sm">
              ابدأ التجربة المجانية ← 
            </Link>
            <Link href="/pricing" className="gfm-btn-outline px-8 py-3 text-sm" style={{color:'#696969'}}>
              عرض الأسعار
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold" style={{color:'#0A3D62',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>قدرات المنصة</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {FEATURES.map(f=>(
            <div key={f.en} className="gfm-card p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-extrabold text-sm mb-1" style={{color:'#74BB65',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>{f.ar}</div>
              <div className="text-xs mb-2" style={{color:'#696969',direction:'ltr'}}>{f.en}</div>
              <p className="text-xs leading-relaxed" style={{color:'#696969',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Subscription section */}
        <div className="gfm-card p-8 text-center">
          <h2 className="text-2xl font-extrabold mb-3" style={{color:'#0A3D62',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>
            ابدأ اليوم مجاناً
          </h2>
          <p className="text-sm mb-6" style={{color:'#696969',fontFamily:"Cairo,Noto Naskh Arabic,sans-serif"}}>
            تجربة مجانية لمدة 7 أيام · لا يلزم بطاقة ائتمانية · وصول كامل للوحة التحكم والإشارات وتصنيفات GFR
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="gfm-btn-primary px-8 py-3">
              إنشاء حساب مجاني →
            </Link>
            <Link href="/contact" className="gfm-btn-outline px-8 py-3" style={{color:'#696969'}}>
              تواصل معنا
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs" style={{color:'#696969'}}>
          © 2026 FDI Monitor · مركز دبي المالي العالمي · دبي · الإمارات العربية المتحدة
        </div>
      </div>
    </div>
  );
}
