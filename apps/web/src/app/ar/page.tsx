import Link from 'next/link';
export const metadata = {
  title:'المراقب العالمي للاستثمار الأجنبي المباشر',
  description:'أول منصة استخباراتية متكاملة للاستثمار الأجنبي المباشر في العالم. 215 اقتصاداً.',
};
export default function ArabicPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <section className="bg-[#0A2540] text-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14 text-right">
          <div className="inline-flex items-center gap-2 bg-blue-900 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300 mb-5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>مباشر · 215 اقتصاداً
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
            أول منصة استخباراتية متكاملة لـ<span className="text-[#1D4ED8]">الاستثمار الأجنبي المباشر</span> في العالم
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            إشارات استثمارية فورية، تصنيفات الجاهزية المستقبلية العالمية، تقارير مخصصة مدعومة بالذكاء الاصطناعي عبر <strong className="text-white">215 اقتصاداً</strong>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-7 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">ابدأ التجربة المجانية — بدون بطاقة</Link>
            <Link href="/"         className="border border-blue-400 text-blue-200 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/5">English</Link>
          </div>
        </div>
      </section>
      <section className="bg-[#060f1a] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['215','اقتصاد مُتتبَّع'],['50','وكيل ذكاء اصطناعي'],['14','مصدر بيانات موثوق'],['2ث','تحديث الإشارات']].map(([v,l])=>(
            <div key={l}><div className="text-3xl font-black text-white">{v}</div><div className="text-blue-400 text-sm mt-1">{l}</div></div>
          ))}
        </div>
      </section>
      <section className="py-14 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-[#0A2540] mb-10 text-center">مميزات المنصة</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {icon:'📡',t:'إشارات الاستثمار الفوري',d:'اكتشاف الاستثمارات الجديدة والتوسعات عبر 215 اقتصاداً بتحديث كل ثانيتين. تصنيف ذهبي حتى بلاتيني.'},
              {icon:'🏆',t:'تصنيفات الجاهزية المستقبلية',d:'215 اقتصاداً مصنفاً عبر 6 أبعاد: الاقتصاد الكلي، السياسة، الرقمنة، رأس المال البشري، البنية التحتية، الاستدامة.'},
              {icon:'📋',t:'تقارير مخصصة بالذكاء الاصطناعي',d:'10 أنواع من التقارير المولدة في دقائق. كل ادعاء موثق ومحقق بتشفير SHA-256.'},
              {icon:'🎯',t:'تخطيط مهام الترويج للاستثمار',d:'الذكاء الاصطناعي يحدد أفضل الشركات المستهدفة بدرجة دوافع الاستثمار. ملف استخباراتي كامل.'},
            ].map(f=>(
              <div key={f.t} className="bg-white rounded-2xl border border-slate-100 p-6 text-right hover:shadow-sm transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black text-[#0A2540] mb-2">{f.t}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 px-6 bg-[#0A2540] text-white text-center">
        <h2 className="text-2xl font-black mb-3">جاهز للبدء؟</h2>
        <p className="text-blue-200 mb-6">الخطة المهنية من <strong className="text-white">$899/شهر</strong>. ابدأ بتجربة مجانية لمدة 3 أيام.</p>
        <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors">ابدأ التجربة المجانية</Link>
      </section>
      <footer className="bg-[#060f1a] text-blue-400 py-6 px-6 text-center text-xs">
        <p className="font-black text-white text-sm mb-1">المراقب العالمي للاستثمار الأجنبي المباشر</p>
        <p>© 2026 Global FDI Monitor. جميع الحقوق محفوظة.</p>
        <p className="mt-2 flex justify-center gap-4">
          <Link href="/" className="hover:text-white">English</Link>
          <Link href="/pricing" className="hover:text-white">الأسعار</Link>
          <Link href="/contact" className="hover:text-white">تواصل معنا</Link>
        </p>
      </footer>
    </div>
  );
}
