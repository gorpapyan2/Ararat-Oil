import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Import translations directly
import hyTranslation from "./locales/hy/translation.json";

// We'll load translations asynchronously instead of importing them directly
// This comment is left to show what we're replacing
// import enTranslation from './locales/en/translation.json';
// import hyTranslation from './locales/hy/translation.json';

i18n
  // Removed Backend as we're now importing translations directly
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      hy: {
        translation: hyTranslation,
      },
    },
    fallbackLng: "hy",
    supportedLngs: ["hy"],
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: true, // Use React Suspense for loading translations
    },
  });

export default i18n;
