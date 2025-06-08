import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations directly
import hyTranslation from "./locales/hy/translation.json";
import enTranslation from "./locales/en/translation.json";

// Export API translation helpers
export * from "./api-translations";

i18n
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
      en: {
        translation: enTranslation,
      },
    },
    lng: "hy", // Set Armenian as the default language
    fallbackLng: "hy",
    supportedLngs: ["hy", "en"],
    load: "currentOnly",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ["localStorage", "htmlTag", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    react: {
      useSuspense: false, // Disable suspense to prevent loading issues
    },
    returnObjects: false, // Disable returning objects to ensure strings are returned for React children
  });

// Ensure default language is set to Armenian
if (!localStorage.getItem("i18nextLng")) {
  localStorage.setItem("i18nextLng", "hy");
}

export default i18n;
