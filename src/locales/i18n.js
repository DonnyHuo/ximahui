import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEN from "./en.json";
import translationJA from "./ja.json";
import translationKO from "./ko.json";
import translationZH from "./zh.json";

const resources = {
  en: {
    translation: translationEN
  },
  "zh-CN": {
    translation: translationZH
  },
  zh: {
    translation: translationZH
  },
  ja: {
    translation: translationJA
  },
  ko: {
    translation: translationKO
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    returnObjects: true,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;
