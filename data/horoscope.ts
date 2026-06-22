import { ZODIAC_SIGNS } from "./kundli";

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

const MOODS = ["Energetic", "Reflective", "Optimistic", "Calm", "Driven", "Romantic", "Focused", "Adventurous", "Grounded", "Inspired"];
const COLORS = ["Saffron", "Gold", "Crimson", "Emerald", "Sapphire Blue", "Ivory", "Maroon", "Turquoise", "Royal Purple", "Sandalwood"];

const OPENERS = [
  "The Moon favours your sign today — trust your intuition over noise.",
  "Jupiter lends you clarity; a long-pending matter finally moves forward.",
  "Saturn asks for patience; steady effort now pays off within the week.",
  "Venus softens your interactions — a good day to mend a relationship.",
  "Mars sharpens your drive; channel it into one decisive action.",
  "Mercury aids communication; speak your truth with confidence.",
];
const CAREER = [
  "A senior may notice your work — keep your commitments visible.",
  "Avoid impulsive financial decisions; review the details twice.",
  "Collaboration brings an unexpected opportunity by evening.",
  "Your discipline is your edge today; finish what you start.",
];
const LOVE = [
  "Express appreciation openly; warmth will be reciprocated.",
  "Single? A meaningful connection may surface through a friend.",
  "Give your partner space to be heard before responding.",
  "An honest conversation clears lingering misunderstanding.",
];
const REMEDY = [
  "Offer water to the rising Sun for added vitality.",
  "Light a ghee diya at dusk to settle the mind.",
  "Chant your ruling planet's beej mantra 11 times.",
  "Donate something yellow on this auspicious day.",
];

function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function getDailyHoroscope(signName: string, date = new Date()): DailyHoroscope {
  const z = ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === signName.toLowerCase()) ?? ZODIAC_SIGNS[0];
  const day = date.toISOString().slice(0, 10);
  const s = seed(`${z.name}-${day}`);
  const pick = <T,>(arr: T[], salt: number) => arr[(s + salt) % arr.length];
  const rating = (salt: number) => 3 + ((Math.floor(s / (salt + 1))) % 3); // 3–5

  return {
    sign: z.name,
    symbol: z.symbol,
    ruling: z.ruling,
    date: date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    mood: pick(MOODS, 1),
    luckyColor: pick(COLORS, 2),
    luckyNumber: 1 + (s % 9),
    love: rating(2),
    career: rating(5),
    health: rating(8),
    text: `${pick(OPENERS, 3)} ${pick(CAREER, 7)} ${pick(LOVE, 11)} Remedy: ${pick(REMEDY, 13)}`,
  };
}

export function getAllDailyHoroscopes(date = new Date()): DailyHoroscope[] {
  return ZODIAC_SIGNS.map((z) => getDailyHoroscope(z.name, date));
}
