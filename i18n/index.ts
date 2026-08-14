import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';

export const LANG_STORAGE_KEY = 'hoa_lang';
export type AppLang = 'en' | 'zh';

const deviceLang: AppLang = Localization.getLocales()[0]?.languageCode === 'zh' ? 'zh' : 'en';

export async function initI18n() {
  let storedLang: AppLang | null = null;
  try {
    storedLang = (await AsyncStorage.getItem(LANG_STORAGE_KEY)) as AppLang | null;
  } catch {
    // ignore — fall back to device language
  }

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: storedLang ?? deviceLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });

  return i18n;
}

export async function setAppLanguage(lang: AppLang) {
  await i18n.changeLanguage(lang);
  try {
    await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // best-effort persistence
  }
}

export default i18n;
