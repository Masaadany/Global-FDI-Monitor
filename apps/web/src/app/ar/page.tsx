import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'رصد الاستثمار الأجنبي المباشر العالمي',
  description: 'منصة الاستخبارات الاستثمارية الأولى عالمياً. 215 اقتصاداً، إشارات في الوقت الفعلي، تقارير GFR.',
};

export default function ARPage() {
  return (
    <div className="min-h-screen bg-deep text-white" dir="rtl">
      <section className="gfm-hero px-6 py-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">رصد الاستثمار الأجنبي المباشر العالمي</div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            استخبارات الاستثمار الأجنبي<br/>
            <span style={{background:'linear-gradient(90deg,#60A5FA,#A78BFA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              في الوقت الفعلي
            </span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            أول منصة متكاملة لاستخبارات الاستثمار الأجنبي المباشر. 215 اقتصاداً، 218+ إشارة مباشرة، تصنيفات الجاهزية المستقبلية العالمية.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {[
              ['215', 'اقتصاداً'],
              ['50', 'وكيل ذكاء اصطناعي'],
              ['218+', 'إشارة مباشرة'],
              ['1,400+', 'منطقة حرة'],
            ].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-2xl px-6 py-4 text-center border border-white/20">
                <div className="text-3xl font-extrabold text-white font-mono">{v}</div>
                <div className="text-white/60 text-sm mt-1">{l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="gfm-btn-primary px-8 py-3.5 rounded-xl text-base font-bold">
              ابدأ التجربة المجانية
            </a>
            <a href="/demo" className="gfm-btn-outline px-8 py-3.5 rounded-xl text-base font-bold text-white border-white/40">
              عرض تجريبي مباشر
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white/5 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-2">منصة كاملة للاستخبارات الاستثمارية</h2>
          <p className="text-white/60 text-center mb-10">كل ما تحتاجه لاتخاذ قرارات الاستثمار الأجنبي</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📡', title: 'إشارات مباشرة', desc: 'رصد 218+ إشارة استثمار أجنبي مباشر في الوقت الفعلي عبر 215 اقتصاداً. تصنيفات من PLATINUM إلى BRONZE.' },
              { icon: '🏆', title: 'تصنيفات GFR', desc: 'ترتيب الجاهزية المستقبلية العالمية لـ 215 اقتصاداً عبر 6 أبعاد و6 عوامل خاصة.' },
              { icon: '📋', title: 'تقارير ذكية', desc: '10 أنواع من التقارير المُنشأة بالذكاء الاصطناعي. من الموجز التنفيذي إلى التقرير الشامل.' },
              { icon: '🗺', title: 'تخطيط المهمات', desc: 'خريطة استثمارية بنمط FlightRadar مع تسجيل نتائج جدوى المهمة للشركات المستهدفة.' },
              { icon: '🔮', title: 'التنبؤ والسيناريوهات', desc: 'توقعات الاستثمار الأجنبي حتى 2030 مع محاكاة مونتي كارلو للسيناريوهات.' },
              { icon: '🤖', title: '50 وكيل ذكاء اصطناعي', desc: 'وكلاء متخصصون لكل مهمة: التحقق، الإثراء، الترجمة، الامتثال، والمزيد.' },
            ].map(f => (
              <div key={f.title} className="bg-white/8 border border-white/15 rounded-2xl p-5">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-bold text-lg text-white mb-2">{f.title}</div>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">خطط الاشتراك</h2>
          <p className="text-white/60 mb-8">ابدأ مجاناً لمدة 3 أيام مع 5 رصيد استخبارات</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'احترافي', price: '$899', period: '/شهر', fic: '4,800', color: '#0A66C2',
                features: ['215 اقتصاداً كاملاً','جميع القطاعات','10 أنواع تقارير','3 مقاعد','دعم 24/7'] },
              { name: 'مؤسسي', price: 'تواصل معنا', period: '', fic: 'مخصص', color: '#0A2540',
                features: ['كل مزايا الاحترافي','بيانات دون المستوى الوطني','API مباشر','علامة بيضاء','SLA مخصص'] },
            ].map(p => (
              <div key={p.name} className="rounded-2xl p-6 text-right border border-white/20" style={{background:`${p.color}30`}}>
                <div className="text-xl font-extrabold text-white mb-1">{p.name}</div>
                <div className="text-4xl font-extrabold mb-1" style={{color:'#60A5FA'}}>{p.price}<span className="text-lg text-white/50">{p.period}</span></div>
                <div className="text-sm text-white/50 mb-4">{p.fic} رصيد استخبارات/سنة</div>
                <ul className="space-y-2 text-sm text-white/70">
                  {p.features.map(f => <li key={f} className="flex items-center gap-2 justify-end"><span>{f}</span><span className="text-emerald-400">✓</span></li>)}
                </ul>
                <a href="/register" className="block mt-5 py-3 rounded-xl font-bold text-center text-white transition-all hover:opacity-90"
                  style={{background: p.color}}>
                  {p.price === 'تواصل معنا' ? 'طلب عرض' : 'ابدأ الآن'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-white/40 text-sm">© 2026 رصد الاستثمار الأجنبي المباشر العالمي · Forecasta Ltd · دبي، الإمارات العربية المتحدة</p>
        <div className="flex gap-4 justify-center mt-3">
          {[['/', 'English'],['#','العربية'],].map(([h,l]) =>
            <a key={l} href={h} className="text-white/40 hover:text-white text-sm transition-colors">{l}</a>
          )}
        </div>
      </footer>
    </div>
  );
}
