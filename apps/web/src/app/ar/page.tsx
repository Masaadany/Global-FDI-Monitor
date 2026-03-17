import Link from 'next/link';
export default function ARPage() {
  return (
    <div className="min-h-screen bg-deep text-white flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-2xl text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-deep text-2xl mx-auto mb-6 bg-white">G</div>
        <h1 className="text-4xl font-extrabold mb-4">مرصد الاستثمار الأجنبي المباشر العالمي</h1>
        <p className="text-white/70 text-lg mb-8 leading-relaxed">منصة الاستخبارات الاستثمارية الأكثر شمولاً في العالم. تتابع 215 اقتصاداً بإشارات في الوقت الفعلي، وتصنيفات الجاهزية العالمية، وتقارير مدعومة بالذكاء الاصطناعي.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="gfm-btn-primary px-8 py-3.5 rounded-xl text-base">ابدأ التجربة المجانية</Link>
          <Link href="/gfr"     className="gfm-btn-outline px-8 py-3.5 rounded-xl text-base" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>تصنيفات الجاهزية</Link>
        </div>
        <p className="text-white/40 text-xs mt-6">اللغة العربية — المزيد من اللغات قريباً</p>
        <Link href="/" className="block text-white/40 hover:text-white text-xs mt-2 transition-colors">العودة إلى الإنجليزية →</Link>
      </div>
    </div>
  );
}
