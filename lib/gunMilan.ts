import { moonRashiNakshatra } from "@/lib/kundliEngine";

// Authentic Ashtakoot Gun Milan (36 points) computed from each partner's real
// Moon Nakshatra & Rashi (sidereal). No name hashing — birth date/time drive it.

export interface PartnerInput {
  name: string;
  dob: string; // yyyy-mm-dd
  tob: string;
  pob: string;
}

export interface Koota {
  name: string;
  score: number;
  max: number;
  meaning: string;
}

export interface GunMilanResult {
  kootas: Koota[];
  total: number;
  max: number;
  verdict: string;
  verdictColor: string;
  summary: string;
}

// ── Classical lookup tables (per Nakshatra, 0 = Ashwini) ──────────────
// Yoni (animal) index per nakshatra.
const YONI = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
//            Horse,Eleph,Sheep,Snake,Snake,Dog,Cat,Sheep,Cat,Rat,Rat,Cow,Buff,Tiger,Buff,Tiger,Deer,Deer,Dog,Monkey,Mongoose,Monkey,Lion,Horse,Lion,Cow,Elephant
// Mutual enemy yoni pairs (bitter enemies → 0).
const YONI_ENEMIES: Record<number, number> = { 6: 5, 5: 6 /*cat-rat*/, 4: 10, 10: 4 /*dog-deer*/, 3: 12, 12: 3 /*snake-mongoose*/, 13: 1, 1: 13 /*lion-elephant*/, 0: 8, 8: 0 /*horse-buffalo*/, 11: 2, 2: 11 /*monkey-sheep*/, 9: 7, 7: 9 /*tiger-cow*/ };

// Gana: 0 Deva, 1 Manushya, 2 Rakshasa.
const GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];

// Nadi: 0 Aadi, 1 Madhya, 2 Antya — zigzag pattern A,M,An,An,M,A.
const nadiOf = (n: number) => [0, 1, 2, 2, 1, 0][n % 6];

// Rashi lords (0 Aries) → planet key for Graha Maitri.
const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
// Natural planetary relationships (F friend / N neutral / E enemy).
const REL: Record<string, { F: string[]; E: string[] }> = {
  Sun: { F: ["Moon", "Mars", "Jupiter"], E: ["Venus", "Saturn"] },
  Moon: { F: ["Sun", "Mercury"], E: [] },
  Mars: { F: ["Sun", "Moon", "Jupiter"], E: ["Mercury"] },
  Mercury: { F: ["Sun", "Venus"], E: ["Moon"] },
  Jupiter: { F: ["Sun", "Moon", "Mars"], E: ["Mercury", "Venus"] },
  Venus: { F: ["Mercury", "Saturn"], E: ["Sun", "Moon"] },
  Saturn: { F: ["Mercury", "Venus"], E: ["Sun", "Moon", "Mars"] },
};
const relOf = (a: string, b: string) => (a === b ? 1 : REL[a].F.includes(b) ? 1 : REL[a].E.includes(b) ? -1 : 0);

// Varna by Rashi (0 Aries): 4 Brahmin > 3 Kshatriya > 2 Vaishya > 1 Shudra.
const VARNA = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]; // fire=Ksh, earth=Vai, air=Shu, water=Brah
// Vashya group by Rashi: 0 Chatushpada, 1 Nara, 2 Jalachara, 3 Vanachara, 4 Keeta.
const VASHYA = [0, 0, 1, 2, 3, 1, 1, 4, 1, 2, 1, 2];

function varnaKoota(boyR: number, girlR: number): number {
  return VARNA[boyR] >= VARNA[girlR] ? 1 : 0;
}
function vashyaKoota(boyR: number, girlR: number): number {
  if (VASHYA[boyR] === VASHYA[girlR]) return 2;
  // Nara (1) gets along with most; Vanachara(3) vs Nara is poor.
  if ((VASHYA[boyR] === 3 && VASHYA[girlR] === 1) || (VASHYA[boyR] === 1 && VASHYA[girlR] === 3)) return 0;
  return 1;
}
function taraKoota(boyN: number, girlN: number): number {
  const r1 = ((((girlN - boyN + 27) % 27) + 1) % 9);
  const r2 = ((((boyN - girlN + 27) % 27) + 1) % 9);
  const bad = (r: number) => [3, 5, 7].includes(r);
  return (bad(r1) ? 0 : 1.5) + (bad(r2) ? 0 : 1.5);
}
function yoniKoota(boyN: number, girlN: number): number {
  const a = YONI[boyN], b = YONI[girlN];
  if (a === b) return 4;
  if (YONI_ENEMIES[a] === b) return 0;
  return 2;
}
function grahaMaitriKoota(boyR: number, girlR: number): number {
  const la = RASHI_LORD[boyR], lb = RASHI_LORD[girlR];
  const s = relOf(la, lb) + relOf(lb, la);
  return s >= 2 ? 5 : s === 1 ? 4 : s === 0 ? 3 : s === -1 ? 1 : 0;
}
function ganaKoota(boyN: number, girlN: number): number {
  const a = GANA[boyN], b = GANA[girlN];
  if (a === b) return 6;
  const pair = [a, b].sort().join("");
  if (pair === "01") return 5; // Deva-Manushya
  if (pair === "02") return 1; // Deva-Rakshasa
  return 0; // Manushya-Rakshasa
}
function bhakootKoota(boyR: number, girlR: number): number {
  const d1 = ((girlR - boyR + 12) % 12) + 1;
  const d2 = ((boyR - girlR + 12) % 12) + 1;
  const set = [d1, d2].sort((x, y) => x - y).join("-");
  return set === "6-8" || set === "2-12" || set === "5-9" ? 0 : 7;
}
function nadiKoota(boyN: number, girlN: number): number {
  return nadiOf(boyN) === nadiOf(girlN) ? 0 : 8;
}

export function calculateGunMilan(boy: PartnerInput, girl: PartnerInput): GunMilanResult {
  const b = moonRashiNakshatra(boy.dob, boy.tob);
  const g = moonRashiNakshatra(girl.dob, girl.tob);
  const bN = b.nakshatraIndex, gN = g.nakshatraIndex, bR = b.rashiIndex, gR = g.rashiIndex;

  const kootas: Koota[] = [
    { name: "Varna", max: 1, meaning: "Spiritual compatibility & ego balance", score: varnaKoota(bR, gR) },
    { name: "Vashya", max: 2, meaning: "Mutual attraction & influence", score: vashyaKoota(bR, gR) },
    { name: "Tara", max: 3, meaning: "Health, destiny & well-being", score: taraKoota(bN, gN) },
    { name: "Yoni", max: 4, meaning: "Physical & intimate compatibility", score: yoniKoota(bN, gN) },
    { name: "Graha Maitri", max: 5, meaning: "Mental & intellectual bonding", score: grahaMaitriKoota(bR, gR) },
    { name: "Gana", max: 6, meaning: "Temperament & nature", score: ganaKoota(bN, gN) },
    { name: "Bhakoot", max: 7, meaning: "Love, finances & family welfare", score: bhakootKoota(bR, gR) },
    { name: "Nadi", max: 8, meaning: "Health & progeny (most important)", score: nadiKoota(bN, gN) },
  ];

  const total = Math.round(kootas.reduce((s, k) => s + k.score, 0) * 10) / 10;
  const max = 36;

  let verdict: string, verdictColor: string, summary: string;
  const nadiDosha = kootas[7].score === 0;
  const bhakootDosha = kootas[6].score === 0;
  if (total >= 32) { verdict = "Excellent Match"; verdictColor = "#2E7D32"; summary = `A highly auspicious union — ${b.nakshatra} & ${g.nakshatra} nakshatras align strongly across mind, body and destiny.`; }
  else if (total >= 25) { verdict = "Very Good Match"; verdictColor = "#4CAF50"; summary = "A genuinely compatible pairing; minor differences are easily balanced with understanding."; }
  else if (total >= 18) { verdict = "Acceptable Match"; verdictColor = "var(--color-gold-dark)"; summary = "A workable match — a detailed reading can suggest remedies to strengthen the lower-scoring kootas."; }
  else { verdict = "Needs Guidance"; verdictColor = "var(--color-saffron)"; summary = "Several kootas score low. A personalised consultation is recommended before proceeding."; }
  if (nadiDosha) summary += " Note: Nadi dosha is present (same Nadi) — remedies are advised.";
  else if (bhakootDosha) summary += " Note: Bhakoot dosha is present — consult an astrologer for remedies.";

  return { kootas, total, max, verdict, verdictColor, summary };
}
