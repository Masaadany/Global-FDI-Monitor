/**
 * GFM i18n System — 40 languages
 * EN active full, AR active partial, others ready
 */

export const SUPPORTED_LOCALES = [
  // Tier 1: Full translation
  {code:'en', name:'English',       dir:'ltr', active:true,  tier:1},
  {code:'ar', name:'عربي',         dir:'rtl', active:true,  tier:1},
  // Tier 2: Partial translation (key pages)
  {code:'fr', name:'Français',      dir:'ltr', active:false, tier:2},
  {code:'de', name:'Deutsch',       dir:'ltr', active:false, tier:2},
  {code:'es', name:'Español',       dir:'ltr', active:false, tier:2},
  {code:'pt', name:'Português',     dir:'ltr', active:false, tier:2},
  {code:'ru', name:'Русский',       dir:'ltr', active:false, tier:2},
  {code:'zh', name:'中文',          dir:'ltr', active:false, tier:2},
  {code:'ja', name:'日本語',        dir:'ltr', active:false, tier:2},
  {code:'ko', name:'한국어',        dir:'ltr', active:false, tier:2},
  // Tier 3: Framework ready
  {code:'hi', name:'हिन्दी',      dir:'ltr', active:false, tier:3},
  {code:'id', name:'Indonesia',     dir:'ltr', active:false, tier:3},
  {code:'ms', name:'Melayu',        dir:'ltr', active:false, tier:3},
  {code:'th', name:'ไทย',          dir:'ltr', active:false, tier:3},
  {code:'vi', name:'Tiếng Việt',   dir:'ltr', active:false, tier:3},
  {code:'tr', name:'Türkçe',        dir:'ltr', active:false, tier:3},
  {code:'pl', name:'Polski',        dir:'ltr', active:false, tier:3},
  {code:'uk', name:'Українська',    dir:'ltr', active:false, tier:3},
  {code:'nl', name:'Nederlands',    dir:'ltr', active:false, tier:3},
  {code:'it', name:'Italiano',      dir:'ltr', active:false, tier:3},
  {code:'sv', name:'Svenska',       dir:'ltr', active:false, tier:3},
  {code:'no', name:'Norsk',         dir:'ltr', active:false, tier:3},
  {code:'da', name:'Dansk',         dir:'ltr', active:false, tier:3},
  {code:'fi', name:'Suomi',         dir:'ltr', active:false, tier:3},
  {code:'ro', name:'Română',        dir:'ltr', active:false, tier:3},
  {code:'cs', name:'Čeština',       dir:'ltr', active:false, tier:3},
  {code:'hu', name:'Magyar',        dir:'ltr', active:false, tier:3},
  {code:'el', name:'Ελληνικά',     dir:'ltr', active:false, tier:3},
  {code:'he', name:'עברית',        dir:'rtl', active:false, tier:3},
  {code:'fa', name:'فارسی',        dir:'rtl', active:false, tier:3},
  {code:'ur', name:'اردو',          dir:'rtl', active:false, tier:3},
  {code:'bn', name:'বাংলা',        dir:'ltr', active:false, tier:3},
  {code:'sw', name:'Kiswahili',     dir:'ltr', active:false, tier:3},
  {code:'am', name:'አማርኛ',        dir:'ltr', active:false, tier:3},
  {code:'yo', name:'Yorùbá',        dir:'ltr', active:false, tier:3},
  {code:'ha', name:'Hausa',         dir:'ltr', active:false, tier:3},
  {code:'tl', name:'Filipino',      dir:'ltr', active:false, tier:3},
  {code:'uk', name:'Українська',    dir:'ltr', active:false, tier:3},
  {code:'sr', name:'Српски',        dir:'ltr', active:false, tier:3},
  {code:'bg', name:'Български',     dir:'ltr', active:false, tier:3},
];

// Core translations — EN + AR (full), others stub ready
export const TRANSLATIONS: Record<string, Record<string,string>> = {
  en: {
    'nav.dashboard':   'Dashboard',
    'nav.signals':     'Signals',
    'nav.gfr':         'GFR Rankings',
    'nav.analytics':   'Analytics',
    'nav.reports':     'Reports',
    'nav.pricing':     'Pricing',
    'nav.free_trial':  'Free Trial',
    'nav.sign_in':     'Sign In',
    'hero.title':      "World's First Fully Integrated Global FDI Intelligence Platform",
    'hero.subtitle':   'Live signals, GFR rankings, AI reports across 215 economies',
    'hero.cta':        'Start Free Trial — No Card',
    'hero.sub_cta':    '3 days free · 5 FIC credits · No credit card required',
    'stats.economies': 'Economies Tracked',
    'stats.agents':    'AI Agents Active',
    'stats.sources':   'Data Sources',
    'stats.speed':     'Signal Update Speed',
    'tier.frontier':   'FRONTIER',
    'tier.high':       'HIGH',
    'tier.medium':     'MEDIUM',
    'tier.emerging':   'EMERGING',
    'tier.developing': 'DEVELOPING',
    'grade.platinum':  'PLATINUM',
    'grade.gold':      'GOLD',
    'grade.silver':    'SILVER',
    'grade.bronze':    'BRONZE',
    'fic.buy':         'Buy FIC Credits',
    'fic.balance':     'FIC Balance',
    'report.generate': 'Generate Report',
    'signal.live':     'Live',
    'footer.privacy':  'Privacy Policy',
    'footer.terms':    'Terms of Service',
    'footer.contact':  'Contact Us',
  },
  ar: {
    'nav.dashboard':   'لوحة التحكم',
    'nav.signals':     'الإشارات',
    'nav.gfr':         'تصنيفات GFR',
    'nav.analytics':   'التحليلات',
    'nav.reports':     'التقارير',
    'nav.pricing':     'الأسعار',
    'nav.free_trial':  'ابدأ مجاناً',
    'nav.sign_in':     'تسجيل الدخول',
    'hero.title':      'أول منصة استخباراتية متكاملة للاستثمار الأجنبي المباشر في العالم',
    'hero.subtitle':   'إشارات فورية، تصنيفات GFR، تقارير بالذكاء الاصطناعي عبر 215 اقتصاداً',
    'hero.cta':        'ابدأ التجربة المجانية — بدون بطاقة',
    'hero.sub_cta':    '3 أيام مجانية · 5 رصيد FIC · لا يلزم بطاقة ائتمان',
    'stats.economies': 'اقتصاد مُتتبَّع',
    'stats.agents':    'وكيل ذكاء اصطناعي',
    'stats.sources':   'مصدر بيانات موثوق',
    'stats.speed':     'سرعة تحديث الإشارات',
    'tier.frontier':   'الحدودية',
    'tier.high':       'مرتفعة',
    'tier.medium':     'متوسطة',
    'tier.emerging':   'ناشئة',
    'tier.developing': 'نامية',
    'grade.platinum':  'بلاتيني',
    'grade.gold':      'ذهبي',
    'grade.silver':    'فضي',
    'grade.bronze':    'برونزي',
    'fic.buy':         'شراء رصيد FIC',
    'fic.balance':     'رصيد FIC',
    'report.generate': 'إنشاء تقرير',
    'signal.live':     'مباشر',
    'footer.privacy':  'سياسة الخصوصية',
    'footer.terms':    'شروط الخدمة',
    'footer.contact':  'تواصل معنا',
  },
};

export type Locale = typeof SUPPORTED_LOCALES[number]['code'];

export function t(key: string, locale: string = 'en'): string {
  return TRANSLATIONS[locale]?.[key] || TRANSLATIONS.en[key] || key;
}

export function getLocaleDir(code: string): 'ltr' | 'rtl' {
  return SUPPORTED_LOCALES.find(l=>l.code===code)?.dir as 'ltr'|'rtl' || 'ltr';
}

export const ACTIVE_LOCALES = SUPPORTED_LOCALES.filter(l=>l.active).map(l=>l.code);
export const RTL_LOCALES     = SUPPORTED_LOCALES.filter(l=>l.dir==='rtl').map(l=>l.code);
