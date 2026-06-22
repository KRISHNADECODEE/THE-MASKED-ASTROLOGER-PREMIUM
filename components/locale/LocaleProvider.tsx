"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type CurrencyCode,
  type LanguageCode,
  CURRENCIES,
  formatMoney,
  translate,
} from "@/lib/locale/config";
import { getUserTimeZone } from "@/lib/locale/timezone";

interface LocaleContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  timezone: string;
  /** Format an INR amount in the selected currency. */
  money: (amountINR: number) => string;
  /** Translate a UI string key. */
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const CUR_KEY = "tma_currency";
const LANG_KEY = "tma_lang";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Hydrate saved preferences + auto-detect timezone (and a sensible default
  // currency for non-Indian visitors) on the client after mount.
  useEffect(() => {
    const tz = getUserTimeZone();
    setTimezone(tz);

    const savedCur = (typeof window !== "undefined" && localStorage.getItem(CUR_KEY)) as CurrencyCode | null;
    const savedLang = (typeof window !== "undefined" && localStorage.getItem(LANG_KEY)) as LanguageCode | null;

    if (savedCur && CURRENCIES[savedCur]) {
      setCurrencyState(savedCur);
    } else if (!tz.startsWith("Asia/")) {
      // First-time non-Asian visitor → default to USD for friendliness.
      setCurrencyState(tz.startsWith("Europe/") ? "EUR" : "USD");
    }
    if (savedLang) setLangState(savedLang);
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(CUR_KEY, c); } catch {}
  };
  const setLang = (l: LanguageCode) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      currency,
      setCurrency,
      lang,
      setLang,
      timezone,
      money: (amountINR: number) => formatMoney(amountINR, currency),
      t: (key: string) => translate(key, lang),
    }),
    [currency, lang, timezone]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}
