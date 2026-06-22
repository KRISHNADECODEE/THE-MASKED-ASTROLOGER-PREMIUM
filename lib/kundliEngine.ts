import { MOCK_KUNDLI, ZODIAC_SIGNS, type KundliResult, type DashaPeriod } from "@/data/kundli";

export interface KundliInputLite {
  name: string;
  dob: string; // yyyy-mm-dd
  tob: string; // HH:MM
  pob: string;
}

function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const SIGN = (i: number) => ZODIAC_SIGNS[((i % 12) + 12) % 12];

// Vedic (sidereal) sun-sign by date — the Hindu solar calendar ranges.
function sunSignIndex(dob: string): number {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return 0;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const ranges: [number, number, number, number][] = [
    [4, 14, 5, 14],   // Aries
    [5, 15, 6, 14],   // Taurus
    [6, 15, 7, 14],   // Gemini
    [7, 15, 8, 14],   // Cancer
    [8, 15, 9, 15],   // Leo
    [9, 16, 10, 15],  // Virgo
    [10, 16, 11, 14], // Libra
    [11, 15, 12, 14], // Scorpio
    [12, 15, 1, 13],  // Sagittarius
    [1, 14, 2, 12],   // Capricorn
    [2, 13, 3, 13],   // Aquarius
    [3, 14, 4, 13],   // Pisces
  ];
  for (let i = 0; i < 12; i++) {
    const [sm, sd, em, ed] = ranges[i];
    if (sm <= em) {
      if ((m === sm && day >= sd) || (m === em && day <= ed) || (m > sm && m < em)) return i;
    } else {
      // wraps year-end (Sagittarius)
      if ((m === sm && day >= sd) || (m === em && day <= ed) || m > sm || m < em) return i;
    }
  }
  return 0;
}

// Vimshottari maha-dasha order and durations (years), total 120.
const VIMSHOTTARI: { planet: string; years: number }[] = [
  { planet: "Ketu", years: 7 }, { planet: "Venus", years: 20 }, { planet: "Sun", years: 6 },
  { planet: "Moon", years: 10 }, { planet: "Mars", years: 7 }, { planet: "Rahu", years: 18 },
  { planet: "Jupiter", years: 16 }, { planet: "Saturn", years: 19 }, { planet: "Mercury", years: 17 },
];

function buildDashas(dob: string, startIdx: number): DashaPeriod[] {
  const birth = new Date(dob);
  const baseYear = isNaN(birth.getTime()) ? 1990 : birth.getFullYear();
  const out: DashaPeriod[] = [];
  let cursor = baseYear;
  const now = new Date().getFullYear();
  for (let i = 0; i < 9; i++) {
    const d = VIMSHOTTARI[(startIdx + i) % 9];
    const end = cursor + d.years;
    out.push({
      planet: d.planet,
      startDate: `${cursor}-01-01`,
      endDate: `${end}-01-01`,
      years: d.years,
      isCurrent: now >= cursor && now < end,
    });
    cursor = end;
    if (cursor > baseYear + 120) break;
  }
  return out;
}

/**
 * Deterministically derive a believable Vedic kundli from birth details.
 * (A production build would call the Swiss-Ephemeris service in
 * app/api/kundli/generate; this gives consistent, varied demo charts.)
 */
export function computeKundli(input: KundliInputLite): KundliResult {
  const s = seed(`${input.dob}|${input.tob}|${input.name}`);
  const sunIdx = sunSignIndex(input.dob);

  // Lagna ≈ sun sign at sunrise, advancing ~1 sign / 2 hours.
  const [hh] = (input.tob || "06:00").split(":").map(Number);
  const ascIdx = (sunIdx + Math.floor(((hh || 6)) / 2)) % 12;
  const moonIdx = (sunIdx + (s % 12)) % 12;

  const asc = SIGN(ascIdx);
  const moon = SIGN(moonIdx);
  const sun = SIGN(sunIdx);

  // Re-home each planet around the computed ascendant with a stable offset.
  const planets = MOCK_KUNDLI.planets.map((p, i) => {
    const signIdx = (ascIdx + ((s >> (i * 2)) % 12)) % 12;
    const sign = SIGN(signIdx);
    const house = (((signIdx - ascIdx) % 12) + 12) % 12 + 1;
    return {
      ...p,
      sign: sign.name,
      signSymbol: sign.symbol,
      house,
      degree: Number((((s >> (i * 3)) % 3000) / 100).toFixed(2)),
    };
  });

  const dashas = buildDashas(input.dob, s % 9);
  const current = dashas.find((d) => d.isCurrent);

  const dobNice = (() => {
    const d = new Date(input.dob);
    return isNaN(d.getTime()) ? input.dob : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  })();

  const firstName = input.name.split(" ")[0] || "Seeker";
  const prediction =
    `With ${asc.name} Lagna (ascendant) and the Moon in ${moon.name}, ${firstName} carries the core nature of a ${asc.ruling}-ruled chart. ` +
    (current ? `The current ${current.planet} Mahadasha (until ${current.endDate.slice(0, 4)}) shapes this life phase — align major decisions with ${current.planet}'s themes. ` : "") +
    `The Sun in ${sun.name} colours identity and vitality, while planetary placements across the 12 bhavas indicate the unfolding of career, relationships, and dharma. Follow the suggested remedies to strengthen weak grahas.`;

  return {
    name: input.name,
    dob: dobNice,
    tob: input.tob,
    pob: input.pob,
    ascendant: asc.name,
    ascendantDegree: Number(((s % 3000) / 100).toFixed(2)),
    ascendantSymbol: asc.symbol,
    moonSign: moon.name,
    sunSign: sun.name,
    planets,
    dashas,
    yogas: MOCK_KUNDLI.yogas,
    basicPrediction: prediction,
  };
}
