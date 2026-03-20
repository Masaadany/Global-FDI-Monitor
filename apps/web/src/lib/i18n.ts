/**
 * GFM Internationalisation — 40 languages
 * Active: English, Arabic
 * Coming: 38 more
 */

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  active: boolean;
  flag: string;
}

export const SUPPORTED_LOCALES: Locale[] = [
  { code:'en', name:'English',    nativeName:'English',   dir:'ltr', active:true,  flag:'🇬🇧' },
  { code:'ar', name:'Arabic',     nativeName:'العربية',   dir:'rtl', active:true,  flag:'🇦🇪' },
  { code:'fr', name:'French',     nativeName:'Français',  dir:'ltr', active:false, flag:'🇫🇷' },
  { code:'es', name:'Spanish',    nativeName:'Español',   dir:'ltr', active:false, flag:'🇪🇸' },
  { code:'zh', name:'Chinese',    nativeName:'中文',      dir:'ltr', active:false, flag:'🇨🇳' },
  { code:'de', name:'German',     nativeName:'Deutsch',   dir:'ltr', active:false, flag:'🇩🇪' },
  { code:'ja', name:'Japanese',   nativeName:'日本語',    dir:'ltr', active:false, flag:'🇯🇵' },
  { code:'ko', name:'Korean',     nativeName:'한국어',    dir:'ltr', active:false, flag:'🇰🇷' },
  { code:'pt', name:'Portuguese', nativeName:'Português', dir:'ltr', active:false, flag:'🇧🇷' },
  { code:'ru', name:'Russian',    nativeName:'Русский',   dir:'ltr', active:false, flag:'🇷🇺' },
  { code:'it', name:'Italian',    nativeName:'Italiano',  dir:'ltr', active:false, flag:'🇮🇹' },
  { code:'nl', name:'Dutch',      nativeName:'Nederlands',dir:'ltr', active:false, flag:'🇳🇱' },
  { code:'pl', name:'Polish',     nativeName:'Polski',    dir:'ltr', active:false, flag:'🇵🇱' },
  { code:'tr', name:'Turkish',    nativeName:'Türkçe',    dir:'ltr', active:false, flag:'🇹🇷' },
  { code:'hi', name:'Hindi',      nativeName:'हिन्दी',   dir:'ltr', active:false, flag:'🇮🇳' },
  { code:'id', name:'Indonesian', nativeName:'Bahasa',    dir:'ltr', active:false, flag:'🇮🇩' },
  { code:'vi', name:'Vietnamese', nativeName:'Tiếng Việt',dir:'ltr', active:false, flag:'🇻🇳' },
  { code:'th', name:'Thai',       nativeName:'ภาษาไทย',  dir:'ltr', active:false, flag:'🇹🇭' },
  { code:'ms', name:'Malay',      nativeName:'Bahasa Melayu',dir:'ltr',active:false,flag:'🇲🇾'},
  { code:'sw', name:'Swahili',    nativeName:'Kiswahili', dir:'ltr', active:false, flag:'🇰🇪' },
  { code:'bn', name:'Bengali',    nativeName:'বাংলা',    dir:'ltr', active:false, flag:'🇧🇩' },
  { code:'ur', name:'Urdu',       nativeName:'اردو',      dir:'rtl', active:false, flag:'🇵🇰' },
  { code:'fa', name:'Persian',    nativeName:'فارسی',     dir:'rtl', active:false, flag:'🇮🇷' },
  { code:'ha', name:'Hausa',      nativeName:'Hausa',     dir:'ltr', active:false, flag:'🇳🇬' },
  { code:'yo', name:'Yoruba',     nativeName:'Yorùbá',    dir:'ltr', active:false, flag:'🇳🇬' },
  { code:'am', name:'Amharic',    nativeName:'አማርኛ',    dir:'ltr', active:false, flag:'🇪🇹' },
  { code:'zu', name:'Zulu',       nativeName:'isiZulu',   dir:'ltr', active:false, flag:'🇿🇦' },
  { code:'sv', name:'Swedish',    nativeName:'Svenska',   dir:'ltr', active:false, flag:'🇸🇪' },
  { code:'da', name:'Danish',     nativeName:'Dansk',     dir:'ltr', active:false, flag:'🇩🇰' },
  { code:'no', name:'Norwegian',  nativeName:'Norsk',     dir:'ltr', active:false, flag:'🇳🇴' },
  { code:'fi', name:'Finnish',    nativeName:'Suomi',     dir:'ltr', active:false, flag:'🇫🇮' },
  { code:'he', name:'Hebrew',     nativeName:'עברית',     dir:'rtl', active:false, flag:'🇮🇱' },
  { code:'ro', name:'Romanian',   nativeName:'Română',    dir:'ltr', active:false, flag:'🇷🇴' },
  { code:'hu', name:'Hungarian',  nativeName:'Magyar',    dir:'ltr', active:false, flag:'🇭🇺' },
  { code:'cs', name:'Czech',      nativeName:'Čeština',   dir:'ltr', active:false, flag:'🇨🇿' },
  { code:'uk', name:'Ukrainian',  nativeName:'Українська',dir:'ltr', active:false, flag:'🇺🇦' },
  { code:'el', name:'Greek',      nativeName:'Ελληνικά',  dir:'ltr', active:false, flag:'🇬🇷' },
  { code:'bg', name:'Bulgarian',  nativeName:'Български', dir:'ltr', active:false, flag:'🇧🇬' },
  { code:'ca', name:'Catalan',    nativeName:'Català',    dir:'ltr', active:false, flag:'🏳️' },
  { code:'tl', name:'Filipino',   nativeName:'Filipino',  dir:'ltr', active:false, flag:'🇵🇭' },
];

export function getLocale(code: string): Locale {
  return SUPPORTED_LOCALES.find(l => l.code === code) || SUPPORTED_LOCALES[0];
}

export function getActiveLocales(): Locale[] {
  return SUPPORTED_LOCALES.filter(l => l.active);
}

export const LOCALE_PATHS: Record<string, string> = {
  en: '/',
  ar: '/ar',
};

export const DEFAULT_LOCALE = 'en';
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];
