// Vedic (Jyotish) reference data. The site leads with authentic Sanskrit terms
// and keeps the Western equivalent only as a quiet aid for global users.

export type Tatva = "Agni" | "Prithvi" | "Vayu" | "Jala"; // Fire, Earth, Air, Water

export interface Rashi {
  id: string;            // lowercase western key (matches /zodiacs/<id>.jpeg)
  sanskrit: string;      // e.g. "Mesha"
  devanagari: string;    // e.g. "मेष"
  western: string;       // e.g. "Aries" (shown subtly)
  lord: string;          // ruling Graha, e.g. "Mangal"
  tatva: Tatva;
  symbol: string;        // visual emblem (Vedic descriptor)
  traits: string;
}

export const TATVA_LABEL: Record<Tatva, string> = {
  Agni: "Agni · Fire",
  Prithvi: "Prithvi · Earth",
  Vayu: "Vayu · Air",
  Jala: "Jala · Water",
};

export const RASHIS: Rashi[] = [
  { id: "aries",       sanskrit: "Mesha",      devanagari: "मेष",   western: "Aries",       lord: "Mangal",  tatva: "Agni",    symbol: "Ram",          traits: "Courage · Leadership · Energy" },
  { id: "taurus",      sanskrit: "Vrishabha",  devanagari: "वृषभ",  western: "Taurus",      lord: "Shukra",  tatva: "Prithvi", symbol: "Bull",         traits: "Stability · Patience · Comfort" },
  { id: "gemini",      sanskrit: "Mithuna",    devanagari: "मिथुन", western: "Gemini",      lord: "Budha",   tatva: "Vayu",    symbol: "Twins",        traits: "Intellect · Communication · Wit" },
  { id: "cancer",      sanskrit: "Karka",      devanagari: "कर्क",  western: "Cancer",      lord: "Chandra", tatva: "Jala",    symbol: "Crab",         traits: "Emotion · Protection · Intuition" },
  { id: "leo",         sanskrit: "Simha",      devanagari: "सिंह",  western: "Leo",         lord: "Surya",   tatva: "Agni",    symbol: "Lion",         traits: "Radiance · Confidence · Generosity" },
  { id: "virgo",       sanskrit: "Kanya",      devanagari: "कन्या", western: "Virgo",       lord: "Budha",   tatva: "Prithvi", symbol: "Maiden",       traits: "Analysis · Service · Purity" },
  { id: "libra",       sanskrit: "Tula",       devanagari: "तुला",  western: "Libra",       lord: "Shukra",  tatva: "Vayu",    symbol: "Scales",       traits: "Balance · Justice · Beauty" },
  { id: "scorpio",     sanskrit: "Vrishchika", devanagari: "वृश्चिक", western: "Scorpio",   lord: "Mangal",  tatva: "Jala",    symbol: "Scorpion",     traits: "Intensity · Mystery · Transformation" },
  { id: "sagittarius", sanskrit: "Dhanu",      devanagari: "धनु",   western: "Sagittarius", lord: "Guru",    tatva: "Agni",    symbol: "Archer",       traits: "Wisdom · Dharma · Freedom" },
  { id: "capricorn",   sanskrit: "Makara",     devanagari: "मकर",   western: "Capricorn",   lord: "Shani",   tatva: "Prithvi", symbol: "Sea-goat",     traits: "Ambition · Discipline · Resilience" },
  { id: "aquarius",    sanskrit: "Kumbha",     devanagari: "कुम्भ", western: "Aquarius",    lord: "Shani",   tatva: "Vayu",    symbol: "Water-bearer", traits: "Innovation · Humanity · Individuality" },
  { id: "pisces",      sanskrit: "Meena",      devanagari: "मीन",   western: "Pisces",      lord: "Guru",    tatva: "Jala",    symbol: "Fishes",       traits: "Compassion · Intuition · Spirituality" },
];

export function getRashi(id: string): Rashi | undefined {
  const key = id.toLowerCase();
  return RASHIS.find((r) => r.id === key || r.sanskrit.toLowerCase() === key || r.western.toLowerCase() === key);
}

// The 9 Grahas (planets) of Jyotish — no Western "Uranus/Neptune/Pluto".
export interface Graha {
  sanskrit: string;
  devanagari: string;
  western: string;
  symbol: string;
  color: string;
}

export const GRAHAS: Graha[] = [
  { sanskrit: "Surya",   devanagari: "सूर्य",   western: "Sun",     symbol: "☉", color: "#E8A33D" },
  { sanskrit: "Chandra", devanagari: "चंद्र",   western: "Moon",    symbol: "☽", color: "#C9A227" },
  { sanskrit: "Mangal",  devanagari: "मंगल",    western: "Mars",    symbol: "♂", color: "#D44E4E" },
  { sanskrit: "Budha",   devanagari: "बुध",     western: "Mercury", symbol: "☿", color: "#4CAF50" },
  { sanskrit: "Guru",    devanagari: "गुरु",    western: "Jupiter", symbol: "♃", color: "#E0B24C" },
  { sanskrit: "Shukra",  devanagari: "शुक्र",   western: "Venus",   symbol: "♀", color: "#E6B3C8" },
  { sanskrit: "Shani",   devanagari: "शनि",     western: "Saturn",  symbol: "♄", color: "#5B6B8C" },
  { sanskrit: "Rahu",    devanagari: "राहु",    western: "N. Node", symbol: "☊", color: "#7C5CBF" },
  { sanskrit: "Ketu",    devanagari: "केतु",    western: "S. Node", symbol: "☋", color: "#8C6B5B" },
];
