/**
 * GLOBAL FDI MONITOR — i18n MVP CONFIGURATION
 * Launch languages: English + Arabic (RTL) only.
 * All 40-language packs remain in codebase — activate post-launch via ACTIVE_LOCALES.
 */

export type Locale = 'en' | 'ar';
export const DEFAULT_LOCALE: Locale = 'en';
export const ACTIVE_LOCALES: Locale[] = ['en', 'ar'];
export const RTL_LOCALES: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean { return RTL_LOCALES.includes(locale); }
export function getDir(locale: Locale): 'ltr' | 'rtl' { return isRTL(locale) ? 'rtl' : 'ltr'; }

const EN: Record<string, string> = {
  'nav.dashboard':'Dashboard','nav.signals':'Market Signals','nav.forecast':'Forecast & Outlook',
  'nav.gfr':'GFR Ranking','nav.reports':'Custom Reports','nav.pmp':'Mission Planning',
  'nav.publications':'Publications','nav.sources':'Data Sources','nav.pricing':'Pricing',
  'nav.analytics':'Analytics','nav.watchlists':'Watchlists','nav.alerts':'Alerts',
  'nav.benchmarking':'Benchmarking','nav.pipeline':'Investment Pipeline',
  'nav.sign_in':'Sign In','nav.sign_out':'Sign Out','nav.start_trial':'Start Free Trial',
  'signal.grade.PLATINUM':'Platinum','signal.grade.GOLD':'Gold',
  'signal.grade.SILVER':'Silver','signal.grade.BRONZE':'Bronze',
  'signal.sci_score':'SCI Score','signal.capex':'Investment Value',
  'signal.view_detail':'View Details','signal.fic_cost':'1 FIC to view',
  'fic.balance':'FIC Balance','fic.topup':'Top Up Credits',
  'fic.insufficient':'Insufficient FIC Credits','fic.annual_allowance':'Annual Allowance',
  'fic.topup.50':'50 Credits — $50','fic.topup.100':'100 Credits — $100','fic.topup.500':'500 Credits — $500',
  'sub.trial':'Free Trial','sub.professional':'Professional',
  'sub.enterprise':'Enterprise','sub.customised':'Customised',
  'sub.annual_only':'Annual billing only','sub.trial_days':'{{days}} day{{s}} remaining',
  'sub.trial_expired':'Trial ended — upgrade to continue','sub.upgrade':'Upgrade Plan',
  'sub.professional.price':'$9,588 / year','sub.enterprise.price':'$29,500 / year',
  'report.generate':'Generate Report','report.generating':'Generating report…',
  'report.ready':'Report Ready','report.download':'Download','report.reference':'Reference',
  'report.type.CEGP':'Country Economic & Geopolitical Profile',
  'report.type.MIB':'Market Intelligence Brief',
  'report.type.ICR':'Investment Climate Report',
  'report.type.SPOR':'Sector Potential & Opportunity Report',
  'report.type.TIR':'Trade Intelligence Report',
  'report.type.SBP':'Sector Benchmark Profile',
  'report.type.SER':'Sectoral Entry Report',
  'report.type.SIR':'Sector Intelligence Report',
  'report.type.RQBR':'Regulatory & Policy Brief',
  'report.type.FCGR':'Flagship Country & GFR Report',
  'gfr.title':'Global Future Readiness Ranking','gfr.composite':'Composite Score',
  'gfr.rank':'Global Rank','gfr.dimensions':'Six Dimensions',
  'gfr.dim.macro':'Macro Foundations','gfr.dim.policy':'Policy & Institutional',
  'gfr.dim.digital':'Digital Foundations','gfr.dim.human':'Human Capital',
  'gfr.dim.infra':'Infrastructure','gfr.dim.sustainability':'Sustainability',
  'common.loading':'Loading…','common.error':'An error occurred','common.retry':'Try again',
  'common.close':'Close','common.save':'Save','common.cancel':'Cancel',
  'common.search':'Search','common.filter':'Filter','common.export':'Export',
  'common.download':'Download','common.back':'Back','common.next':'Next',
  'common.submit':'Submit','common.confirm':'Confirm','common.delete':'Delete',
  'common.edit':'Edit','common.view':'View','common.all':'All',
  'auth.email':'Email address','auth.password':'Password','auth.sign_in':'Sign In',
  'auth.sign_out':'Sign Out','auth.forgot_password':'Forgot password?',
  'section.executive_summary':'Executive Summary','section.investment_climate':'Investment Climate',
  'section.key_risks':'Key Risks','section.gfr_profile':'GFR Profile',
  'section.sector_overview':'Sector Overview','section.policy_environment':'Policy Environment',
  'section.forecast_outlook':'Forecast & Outlook','section.recommendations':'Recommendations',
};

const AR: Record<string, string> = {
  'nav.dashboard':'لوحة التحكم','nav.signals':'إشارات السوق',
  'nav.forecast':'التوقعات والنظرة المستقبلية','nav.gfr':'تصنيف GFR',
  'nav.reports':'التقارير المخصصة','nav.pmp':'تخطيط البعثات الترويجية',
  'nav.publications':'المنشورات','nav.sources':'مصادر البيانات','nav.pricing':'الأسعار',
  'nav.analytics':'التحليلات','nav.watchlists':'قوائم المتابعة','nav.alerts':'التنبيهات',
  'nav.benchmarking':'المقارنة المعيارية','nav.pipeline':'خط أنابيب الاستثمار',
  'nav.sign_in':'تسجيل الدخول','nav.sign_out':'تسجيل الخروج',
  'nav.start_trial':'ابدأ التجربة المجانية',
  'signal.grade.PLATINUM':'بلاتيني','signal.grade.GOLD':'ذهبي',
  'signal.grade.SILVER':'فضي','signal.grade.BRONZE':'برونزي',
  'signal.sci_score':'نقاط SCI','signal.capex':'قيمة الاستثمار',
  'signal.view_detail':'عرض التفاصيل','signal.fic_cost':'رصيد FIC واحد للعرض',
  'fic.balance':'رصيد FIC','fic.topup':'شراء رصيد',
  'fic.insufficient':'رصيد FIC غير كافٍ','fic.annual_allowance':'الحصة السنوية',
  'fic.topup.50':'50 رصيد — 50 دولار','fic.topup.100':'100 رصيد — 100 دولار','fic.topup.500':'500 رصيد — 500 دولار',
  'sub.trial':'التجربة المجانية','sub.professional':'الاحترافي',
  'sub.enterprise':'المؤسسي','sub.customised':'المخصص',
  'sub.annual_only':'الفوترة السنوية فقط','sub.trial_days':'متبقٍ {{days}} يوم{{s}}',
  'sub.trial_expired':'انتهت التجربة — يرجى الترقية للمتابعة','sub.upgrade':'ترقية الخطة',
  'sub.professional.price':'9,588 دولار / سنة','sub.enterprise.price':'29,500 دولار / سنة',
  'report.generate':'إنشاء تقرير','report.generating':'...جاري إنشاء التقرير',
  'report.ready':'التقرير جاهز','report.download':'تنزيل','report.reference':'رقم المرجع',
  'report.type.CEGP':'الملف الاقتصادي والجيوسياسي للدولة',
  'report.type.MIB':'موجز استخباراتي للسوق',
  'report.type.ICR':'تقرير مناخ الاستثمار',
  'report.type.SPOR':'تقرير إمكانات القطاع وفرصه',
  'report.type.TIR':'تقرير استخباراتي للتجارة',
  'report.type.SBP':'ملف مقارنة القطاع','report.type.SER':'تقرير الدخول القطاعي',
  'report.type.SIR':'تقرير استخباراتي القطاع',
  'report.type.RQBR':'موجز تنظيمي وسياساتي',
  'report.type.FCGR':'تقرير الدولة الرائدة وتصنيف GFR',
  'gfr.title':'تصنيف الجاهزية المستقبلية العالمية','gfr.composite':'النقاط المركبة',
  'gfr.rank':'الترتيب العالمي','gfr.dimensions':'ستة أبعاد',
  'gfr.dim.macro':'الأسس الاقتصادية الكلية','gfr.dim.policy':'السياسات والمؤسسات',
  'gfr.dim.digital':'الأسس الرقمية','gfr.dim.human':'رأس المال البشري',
  'gfr.dim.infra':'البنية التحتية','gfr.dim.sustainability':'الاستدامة',
  'common.loading':'...جاري التحميل','common.error':'حدث خطأ',
  'common.retry':'حاول مرة أخرى','common.close':'إغلاق','common.save':'حفظ',
  'common.cancel':'إلغاء','common.search':'بحث','common.filter':'تصفية',
  'common.export':'تصدير','common.download':'تنزيل','common.back':'رجوع',
  'common.next':'التالي','common.submit':'إرسال','common.confirm':'تأكيد',
  'common.delete':'حذف','common.edit':'تعديل','common.view':'عرض','common.all':'الكل',
  'auth.email':'البريد الإلكتروني','auth.password':'كلمة المرور',
  'auth.sign_in':'تسجيل الدخول','auth.sign_out':'تسجيل الخروج',
  'auth.forgot_password':'نسيت كلمة المرور؟',
  'section.executive_summary':'الملخص التنفيذي',
  'section.investment_climate':'مناخ الاستثمار',
  'section.key_risks':'المخاطر الرئيسية','section.gfr_profile':'ملف GFR',
  'section.sector_overview':'نظرة عامة على القطاع',
  'section.policy_environment':'البيئة التنظيمية',
  'section.forecast_outlook':'التوقعات والنظرة المستقبلية',
  'section.recommendations':'التوصيات',
};

const PACKS: Record<Locale, Record<string, string>> = { en: EN, ar: AR };

export function t(key: string, locale: Locale = 'en', vars?: Record<string,string>): string {
  let text = PACKS[locale]?.[key] ?? PACKS.en[key] ?? key;
  if (vars) Object.entries(vars).forEach(([k,v]) => { text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`,'g'),v); });
  return text;
}

export function formatCurrency(amount: number, locale: Locale, currency = 'USD'): string {
  const lc = locale === 'ar' ? 'ar-AE' : 'en-US';
  try { return new Intl.NumberFormat(lc,{style:'currency',currency,notation:amount>=1e9?'compact':'standard',maximumFractionDigits:amount>=1e9?1:0}).format(amount); }
  catch { return `$${(amount/1e9).toFixed(1)}B`; }
}

export function formatDate(date: Date|string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const lc = locale === 'ar' ? 'ar-AE' : 'en-GB';
  try { return new Intl.DateTimeFormat(lc,{day:'numeric',month:'short',year:'numeric'}).format(d); }
  catch { return d.toLocaleDateString(); }
}
