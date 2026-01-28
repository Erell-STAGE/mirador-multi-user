import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/en";
import "dayjs/locale/fr";
import "dayjs/locale/es";
import { updateProjetTermsLang } from "../../../customAssets/TermsFooter";

dayjs.extend(localizedFormat);

// 🟢 Initialize i18next
i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng:
    localStorage.getItem("i18nextLng") ||
    navigator.language.split("-")[0] ||
    "en",
  interpolation: { escapeValue: false },
  resources: {
    en: { translation: en },
  },
});

const loadLanguage = async (lng: string): Promise<void> => {
  if (!i18n.hasResourceBundle(lng, "translation")) {
    try {
      const translations = await import(`./${lng}/translation.json`);
      i18n.addResourceBundle(
        lng,
        "translation",
        translations.default || translations,
      );
    } catch (error) {
      console.error(`❌ Error loading translations for ${lng}:`, error);
    }
  }

  const localeToSet = getAvailableLanguage(lng);

  dayjs.locale(localeToSet);
  console.log(`✅ Day.js locale set to: ${dayjs.locale()}`);

  await i18n.changeLanguage(localeToSet);

  updateProjetTermsLang(localeToSet);
};

const detectedLng =
  localStorage.getItem("i18nextLng") ||
  navigator.language.split("-")[0] ||
  "en";

loadLanguage(detectedLng);

export enum availableLanguages {
  en = "English",
  fr = "Français"
}

export function getAvailableLanguage(lng: string) {
  return Object.keys(availableLanguages).includes(lng) ? lng : "en";
}

export function getPreferredLanguageFromBrowser() {
  return getAvailableLanguage(detectedLng);
}

export { loadLanguage };
export default i18n;
