import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// We'll load translations asynchronously instead of importing them directly
// This comment is left to show what we're replacing
// import enTranslation from './locales/en/translation.json';
// import hyTranslation from './locales/hy/translation.json';

i18n
  // Load translations from backend
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    // Removed static resources object since we're loading dynamically
    fallbackLng: 'hy',
    supportedLngs: ['hy'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    backend: {
      // Path to load translations from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true, // Use React Suspense for loading translations
    },
  });

export default i18n; 