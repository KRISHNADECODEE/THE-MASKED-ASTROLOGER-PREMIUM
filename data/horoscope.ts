import { ZODIAC_SIGNS } from "./kundli";
import { getGochara } from "@/lib/kundliEngine";

export interface DailyHoroscope {
  sign: string;
  symbol: string;
  ruling: string;
  date: string;
  mood: string;
  luckyColor: string;
  luckyNumber: number;
  love: number; // 1–5
  career: number; // 1–5
  health: number; // 1–5
  text: string;
}

// Lucky color/number + mood follow the weekday's ruling planet (vaar).
const VAAR = [
  { lord: "Sun", color: "Saffron Gold", num: 1, mood: "Confident" },
  { lord: "Moon", color: "Pearl White", num: 2, mood: "Reflective" },
  { lord: "Mars", color: "Coral Red", num: 9, mood: "Driven" },
  { lord: "Mercury", color: "Emerald Green", num: 5, mood: "Curious" },
  { lord: "Jupiter", color: "Golden Yellow", num: 3, mood: "Optimistic" },
  { lord: "Venus", color: "Rose & Silver", num: 6, mood: "Romantic" },
  { lord: "Saturn", color: "Deep Indigo", num: 8, mood: "Grounded" },
];

const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const clamp = (n: number) => Math.max(1, Math.min(5, n));
const houseFrom = (transitSign: number, natalSign: number) => ((transitSign - natalSign + 12) % 12) + 1;

// Caches today's transit chart so all 12 signs share one computation.
let cache: { key: string; gochara: ReturnType<typeof getGochara> } | null = null;
function transitsForToday(date: Date) {
  const key = date.toISOString().slice(0, 10);
  if (!cache || cache.key !== key) cache = { key, gochara: getGochara(date) };
  return cache.gochara;
}

export function getDailyHoroscope(signName: string, date = new Date()): DailyHoroscope {
  const idx = Math.max(0, ZODIAC_SIGNS.findIndex((s) => s.name.toLowerCase() === signName.toLowerCase()));
  const z = ZODIAC_SIGNS[idx];
  const vaar = VAAR[date.getDay()];

  let love = 3, career = 3, health = 4;
  let text: string;

  try {
    const g = transitsForToday(date);
    const moonH = houseFrom(g.moon.sign, idx);
    const sunH = houseFrom(g.sun.sign, idx);
    const jupH = houseFrom(g.jupiter.sign, idx);
    const satH = houseFrom(g.saturn.sign, idx);
    const venH = houseFrom(g.venus.sign, idx);

    // Chandra Gochara: favourable Moon transit houses from the Moon sign.
    const moonFav = [1, 3, 6, 7, 10, 11].includes(moonH);
    const sadeSati = [12, 1, 2].includes(satH);

    love = clamp(3 + ([5, 7, 11].includes(venH) ? 1 : 0) + ([1, 7, 11].includes(moonH) ? 1 : 0) - (moonH === 8 ? 1 : 0));
    career = clamp(3 + ([2, 5, 9, 11].includes(jupH) ? 1 : 0) + ([3, 6, 10, 11].includes(sunH) ? 1 : 0) - (sadeSati ? 1 : 0));
    health = clamp(4 - ([4, 8, 12].includes(moonH) ? 1 : 0) - ([1, 8].includes(satH) ? 1 : 0) + ([1, 5, 9].includes(jupH) ? 1 : 0));

    const moonTone = moonH === 8
      ? "an emotionally sensitive Chandra-Ashtama phase — pace yourself and avoid confrontation"
      : moonFav
      ? "supportive momentum and a clear mind for the day's tasks"
      : "a quieter, inward mood — handle routine matters before big moves";

    const careerLine = [2, 5, 9, 11].includes(jupH)
      ? `Jupiter transiting your ${ORD[jupH]} house favours growth in work and finances.`
      : sadeSati
      ? `Saturn is transiting your ${ORD[satH]} house (a Sade-Sati phase) — be patient and methodical with career matters.`
      : `Steady effort serves you better than haste in professional matters today.`;

    const loveLine = [5, 7, 11].includes(venH)
      ? `Venus in your ${ORD[venH]} house warms relationships — a good day to connect.`
      : `Express appreciation openly; small gestures land well.`;

    text = `The Moon transits your ${ORD[moonH]} house, bringing ${moonTone}. ${careerLine} ${loveLine} Remedy: honour ${vaar.lord} today — its weekday energy is strongest now.`;
  } catch {
    text = `Trust your intuition and keep your commitments visible today. ${vaar.lord}'s weekday energy favours steady, sincere effort. Remedy: light a diya at dusk.`;
  }

  return {
    sign: z.name,
    symbol: z.symbol,
    ruling: z.ruling,
    date: date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    mood: vaar.mood,
    luckyColor: vaar.color,
    luckyNumber: vaar.num,
    love, career, health,
    text,
  };
}

export function getAllDailyHoroscopes(date = new Date()): DailyHoroscope[] {
  return ZODIAC_SIGNS.map((z) => getDailyHoroscope(z.name, date));
}
