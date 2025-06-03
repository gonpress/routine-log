import * as Localization from "expo-localization";
import type { InitOptions } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ko from "./translations/ko.json";

const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
} as const;

type ResourceKey = keyof typeof resources;

const getDeviceLanguage = (): ResourceKey => {
  try {
    const locale = Localization.locale || "en";
    const languageCode = locale.split("-")[0] as ResourceKey;
    return resources[languageCode] ? languageCode : "en";
  } catch (error) {
    return "en";
  }
};

const i18nConfig: InitOptions = {
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};

i18n.use(initReactI18next).init(i18nConfig);

export default i18n;
