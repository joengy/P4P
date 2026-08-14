import { useTranslation } from 'react-i18next';
import { setAppLanguage, type AppLang } from './index';

// Wraps react-i18next's language state as the { en, zh } toggle the design
// spec expects (app.jsx's `lang` state + Header's EN/中 pill).
export function useLang() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.startsWith('zh') ? 'zh' : 'en') as AppLang;
  const toggleLang = () => setAppLanguage(lang === 'en' ? 'zh' : 'en');
  const setLang = (next: AppLang) => setAppLanguage(next);
  return { lang, toggleLang, setLang };
}
