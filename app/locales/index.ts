import CN from "./cn";
import EN from "./en";

import { merge } from "../utils/merge";

export type { LocaleType, RequiredLocaleType } from "./cn";

export const AllLangs = ["en", "cn"] as const;
export type Lang = (typeof AllLangs)[number];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  cn: "简体中文",
  en: "English",
};

const LANG_KEY = "lang";
const DEFAULT_LANG = "en";

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    console.log("[Lang] failed to detect user lang.");
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  for (const option of AllLangs) {
    if (lang.includes(option)) {
      return option;
    }
  }

  return DEFAULT_LANG;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

const fallbackLang = EN;
const targetLang = {
  en: EN,
  cn: CN,
}[getLang()] as typeof CN;

// if target lang missing some fields, it will use fallback lang string
merge(fallbackLang, targetLang);

export default fallbackLang as typeof CN;
