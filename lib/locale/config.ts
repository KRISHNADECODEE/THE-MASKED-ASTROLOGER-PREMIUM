// ── Currencies ──────────────────────────────────────────────
// All prices in the app are stored in INR (the base). These rates convert the
// DISPLAY only. In production, refresh them from an FX API daily.
export type CurrencyCode = "INR" | "USD" | "EUR";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  /** Units of this currency per 1 INR. */
  rateFromINR: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN", rateFromINR: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US", rateFromINR: 0.012 },
  EUR: { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE", rateFromINR: 0.011 },
};

export const CURRENCY_ORDER: CurrencyCode[] = ["INR", "USD", "EUR"];

export function convertFromINR(amountINR: number, code: CurrencyCode): number {
  return amountINR * CURRENCIES[code].rateFromINR;
}

export function formatMoney(amountINR: number, code: CurrencyCode): string {
  const c = CURRENCIES[code];
  const value = convertFromINR(amountINR, code);
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
    maximumFractionDigits: code === "INR" ? 0 : value < 100 ? 2 : 0,
  }).format(value);
}

// ── Languages ───────────────────────────────────────────────
export type LanguageCode = "en" | "hi";

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  native: string;
}

export const LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  en: { code: "en", label: "English", native: "English" },
  hi: { code: "hi", label: "Hindi", native: "हिन्दी" },
};

export const LANGUAGE_ORDER: LanguageCode[] = ["en", "hi"];

/**
 * UI string dictionary. The architecture supports adding keys + locales freely;
 * any missing key falls back to English, then to the key itself.
 */
export const DICTIONARY: Record<string, Partial<Record<LanguageCode, string>>> = {
  "nav.kundli": { en: "Kundli", hi: "कुंडली" },
  "nav.store": { en: "Store", hi: "स्टोर" },
  "nav.consult": { en: "Consult", hi: "परामर्श" },
  "nav.courses": { en: "Courses", hi: "पाठ्यक्रम" },
  "nav.blog": { en: "Blog", hi: "ब्लॉग" },
  "nav.donate": { en: "Donate", hi: "दान करें" },
  "common.bookNow": { en: "Book Now", hi: "अभी बुक करें" },
  "common.addToCart": { en: "Add to Cart", hi: "कार्ट में डालें" },
  "common.signIn": { en: "Sign In", hi: "साइन इन" },
  "currency.billedINR": {
    en: "Prices shown in your currency; payments are billed in INR.",
    hi: "कीमतें आपकी मुद्रा में दिखाई गई हैं; भुगतान INR में लिया जाता है।",
  },
};

export function translate(key: string, lang: LanguageCode): string {
  const entry = DICTIONARY[key];
  return entry?.[lang] ?? entry?.en ?? key;
}

// ── Vedic glossary (terms kept authentic + English explanations) ──
export const VEDIC_GLOSSARY: Record<string, string> = {
  Panchang: "The Vedic almanac — the five limbs of the day (tithi, vara, nakshatra, yoga, karana) used to find auspicious timing.",
  Dosha: "An affliction or imbalance in a birth chart (e.g. Mangal Dosha) that may need remedies.",
  Muhurat: "An auspicious window of time chosen for an important event using the Panchang.",
  Dasha: "A planetary period in Vedic astrology that governs the themes of a span of your life (e.g. Vimshottari Dasha).",
  Lagna: "The Ascendant — the zodiac sign rising on the eastern horizon at your moment of birth.",
  Kundli: "A Vedic birth chart mapping the planets across 12 houses at the time of birth.",
  Navamsa: "The D9 divisional chart, used especially for marriage and deeper soul-level analysis.",
  Yoga: "A specific planetary combination in the chart that produces a defined result.",
  Nakshatra: "One of the 27 lunar mansions the Moon travels through; central to Vedic timing.",
  Gemstone: "A certified stone worn to strengthen a specific planet's influence in the chart.",
};
