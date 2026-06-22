import { Origin, Horoscope } from "circular-natal-horoscope-js";
import { ZODIAC_SIGNS, type KundliResult, type DashaPeriod, type PlanetData } from "@/data/kundli";

export interface KundliInputLite {
  name: string;
  dob: string; // yyyy-mm-dd
  tob: string; // HH:MM (local clock time at the birth place)
  pob: string;
  lat?: number;
  lng?: number;
  tzOffsetHours?: number; // birth-place timezone offset; default IST (+5.5)
}

// ── Vedic reference data ────────────────────────────────────
const PLANET_SYMBOL: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
];

// Vimshottari maha-dasha lords (Ashwini → Ketu) and their durations (years).
const DASHA_SEQ: { planet: string; years: number }[] = [
  { planet: "Ketu", years: 7 }, { planet: "Venus", years: 20 }, { planet: "Sun", years: 6 },
  { planet: "Moon", years: 10 }, { planet: "Mars", years: 7 }, { planet: "Rahu", years: 18 },
  { planet: "Jupiter", years: 16 }, { planet: "Saturn", years: 19 }, { planet: "Mercury", years: 17 },
];

const SIGN = (i: number) => ZODIAC_SIGNS[((i % 12) + 12) % 12];
const norm360 = (x: number) => ((x % 360) + 360) % 360;

function nakshatraOf(siderealLong: number): { name: string; pada: number; index: number; frac: number } {
  const span = 360 / 27; // 13.3333°
  const index = Math.floor(siderealLong / span) % 27;
  const within = siderealLong - index * span;
  const pada = Math.floor(within / (span / 4)) + 1;
  return { name: NAKSHATRAS[index], pada, index, frac: within / span };
}

// Lahiri ayanamsa (deg) for a given Julian Day — used only for Rahu/Ketu nodes.
function lahiriAyanamsa(jd: number): number {
  const yearsFromJ2000 = (jd - 2451545.0) / 365.25;
  return 23.8531 + 0.0139689 * yearsFromJ2000;
}

function meanLunarNodeSidereal(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000; // tropical
  return norm360(norm360(omega) - lahiriAyanamsa(jd));
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addYears(d: Date, years: number): Date {
  return new Date(d.getTime() + years * 365.2425 * 86400000);
}

function buildDashas(moonLong: number, birth: Date): DashaPeriod[] {
  const nak = nakshatraOf(moonLong);
  const startIdx = nak.index % 9;
  const out: DashaPeriod[] = [];
  let cursor = new Date(birth.getTime());
  const now = Date.now();
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_SEQ[(startIdx + i) % 9];
    // First period is the *balance* of the running dasha at birth.
    const years = i === 0 ? lord.years * (1 - nak.frac) : lord.years;
    const end = addYears(cursor, years);
    out.push({
      planet: lord.planet,
      startDate: isoDate(cursor),
      endDate: isoDate(end),
      years: Math.round(years * 10) / 10,
      isCurrent: now >= cursor.getTime() && now < end.getTime(),
    });
    cursor = end;
  }
  return out;
}

function computeYogas(byName: Record<string, PlanetData>, ascIdx: number) {
  const yogas: { name: string; description: string; isPositive: boolean }[] = [];
  const sign = (p?: PlanetData) => (p ? ZODIAC_SIGNS.findIndex((z) => z.name === p.sign) : -1);
  const sun = byName.Sun, moon = byName.Moon, mer = byName.Mercury, jup = byName.Jupiter, mars = byName.Mars;

  if (sun && mer && sign(sun) === sign(mer)) {
    yogas.push({ name: "Budha-Aditya Yoga", description: "Sun and Mercury together grant sharp intellect, communication skill and success in study and trade.", isPositive: true });
  }
  if (moon && jup) {
    const diff = ((sign(jup) - sign(moon) + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(diff)) {
      yogas.push({ name: "Gajakesari Yoga", description: "Jupiter in a kendra from the Moon bestows wisdom, reputation and steady prosperity.", isPositive: true });
    }
  }
  if (moon && mars && sign(moon) === sign(mars)) {
    yogas.push({ name: "Chandra-Mangal Yoga", description: "Moon with Mars drives ambition and the capacity to generate wealth through enterprise.", isPositive: true });
  }
  if (yogas.length === 0) {
    yogas.push({ name: `${SIGN(ascIdx).name} Lagna`, description: `A ${SIGN(ascIdx).ruling}-ruled ascendant shapes the core temperament and life path of the chart.`, isPositive: true });
  }
  return yogas;
}

// ── Shared ephemeris helpers (used by Gun Milan & Rashifal) ──────────────
// Geocentric sidereal longitudes are location-independent, so we pass lat/lng 0
// and feed the true UTC instant directly (library UTC = input − lng/15 = input).
function siderealBodies(utcMs: number, keys: string[]): Record<string, number> {
  const d = new Date(utcMs);
  const origin = new Origin({
    year: d.getUTCFullYear(), month: d.getUTCMonth(), date: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(), latitude: 0, longitude: 0,
  });
  const h = new Horoscope({ origin, houseSystem: "whole-sign", zodiac: "sidereal", aspectPoints: [], aspectWithPoints: [], language: "en" });
  const out: Record<string, number> = {};
  for (const k of keys) out[k] = norm360(h.CelestialBodies[k].ChartPosition.Ecliptic.DecimalDegrees as number);
  return out;
}

export interface MoonInfo {
  rashiIndex: number;   // 0 = Mesha/Aries
  nakshatraIndex: number; // 0 = Ashwini
  nakshatra: string;
  pada: number;
  longitude: number;    // sidereal
}

/** The Moon's sidereal Rashi + Nakshatra at birth — the basis of Gun Milan. */
export function moonRashiNakshatra(dob: string, tob: string, tzOffsetHours = 5.5): MoonInfo {
  const [y, mo, da] = dob.split("-").map(Number);
  const [hh, mm] = (tob || "12:00").split(":").map(Number);
  const utc = Date.UTC(y, (mo || 1) - 1, da || 1, hh || 0, mm || 0) - tzOffsetHours * 3600000;
  const moon = siderealBodies(utc, ["moon"]).moon;
  const nak = nakshatraOf(moon);
  return { rashiIndex: Math.floor(moon / 30), nakshatraIndex: nak.index, nakshatra: nak.name, pada: nak.pada, longitude: moon };
}

/** Today's transiting sidereal positions (Gochara) — basis of the Rashifal. */
export function getGochara(date: Date = new Date()): Record<string, { sign: number; long: number }> {
  const bodies = siderealBodies(date.getTime(), ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"]);
  const out: Record<string, { sign: number; long: number }> = {};
  for (const [k, v] of Object.entries(bodies)) out[k] = { sign: Math.floor(v / 30), long: v };
  return out;
}

function niceDob(dob: string): string {
  const d = new Date(dob);
  return isNaN(d.getTime()) ? dob : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Compute a real Vedic (sidereal / Lahiri) birth chart from birth details.
 * Uses an ephemeris (circular-natal-horoscope-js) for planet & ascendant
 * positions; nakshatras, Rahu/Ketu and the Vimshottari dasha are derived here.
 */
export function computeKundli(input: KundliInputLite): KundliResult {
  const lat = input.lat ?? 28.6139; // default New Delhi
  const lng = input.lng ?? 77.209;
  const tz = input.tzOffsetHours ?? 5.5; // default IST

  try {
    const [y, mo, da] = input.dob.split("-").map(Number);
    const [hh, mm] = (input.tob || "12:00").split(":").map(Number);

    // True UTC instant of birth, then express it as local-mean-time at the
    // birth longitude (the form the library expects: UTC = input − lng/15).
    const trueUtcMs = Date.UTC(y, (mo || 1) - 1, da || 1, hh || 0, mm || 0) - tz * 3600000;
    const libMs = trueUtcMs + (lng / 15) * 3600000;
    const L = new Date(libMs);

    const origin = new Origin({
      year: L.getUTCFullYear(), month: L.getUTCMonth(), date: L.getUTCDate(),
      hour: L.getUTCHours(), minute: L.getUTCMinutes(), latitude: lat, longitude: lng,
    });
    const h = new Horoscope({ origin, houseSystem: "whole-sign", zodiac: "sidereal", aspectPoints: [], aspectWithPoints: [], language: "en" });

    const jd = trueUtcMs / 86400000 + 2440587.5;
    const ascLong = h.Ascendant.ChartPosition.Ecliptic.DecimalDegrees as number;
    const ascIdx = Math.floor(norm360(ascLong) / 30);

    const order = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const key: Record<string, string> = { Sun: "sun", Moon: "moon", Mars: "mars", Mercury: "mercury", Jupiter: "jupiter", Venus: "venus", Saturn: "saturn" };

    const mkPlanet = (name: string, long: number, retro: boolean): PlanetData => {
      const sLong = norm360(long);
      const sIdx = Math.floor(sLong / 30);
      const nak = nakshatraOf(sLong);
      return {
        name, symbol: PLANET_SYMBOL[name], house: ((sIdx - ascIdx + 12) % 12) + 1,
        sign: SIGN(sIdx).name, signSymbol: SIGN(sIdx).symbol, degree: Math.round((sLong % 30) * 100) / 100,
        isRetrograde: !!retro, nakshatra: nak.name, nakshatraPada: nak.pada,
      };
    };

    const planets: PlanetData[] = order.map((n) => {
      const b = h.CelestialBodies[key[n]];
      return mkPlanet(n, b.ChartPosition.Ecliptic.DecimalDegrees as number, !!b.isRetrograde);
    });
    // Rahu / Ketu (mean lunar node) — always retrograde.
    const rahu = meanLunarNodeSidereal(jd);
    planets.push(mkPlanet("Rahu", rahu, true));
    planets.push(mkPlanet("Ketu", norm360(rahu + 180), true));

    const byName: Record<string, PlanetData> = Object.fromEntries(planets.map((p) => [p.name, p]));
    const moonLong = norm360(h.CelestialBodies.moon.ChartPosition.Ecliptic.DecimalDegrees as number);
    const dashas = buildDashas(moonLong, new Date(Date.UTC(y, (mo || 1) - 1, da || 1)));
    const current = dashas.find((d) => d.isCurrent);
    const moonNak = nakshatraOf(moonLong);

    const firstName = input.name.split(" ")[0] || "Seeker";
    const prediction =
      `${firstName} is born with ${SIGN(ascIdx).name} Lagna (ascendant), ruled by ${SIGN(ascIdx).ruling}, with the Moon in ${byName.Moon.sign} (${moonNak.name} nakshatra). ` +
      (current ? `The current ${current.planet} Mahadasha (until ${current.endDate.slice(0, 4)}) sets the dominant theme of this life phase — align key decisions with ${current.planet}'s significations. ` : "") +
      `The Sun in ${byName.Sun.sign} shapes vitality and self-expression. Study the house placements of the nine grahas below for career, relationships and dharma, and apply the suggested remedies for any afflicted planet.`;

    return {
      name: input.name,
      dob: niceDob(input.dob),
      tob: input.tob,
      pob: input.pob,
      ascendant: SIGN(ascIdx).name,
      ascendantDegree: Math.round((norm360(ascLong) % 30) * 100) / 100,
      ascendantSymbol: SIGN(ascIdx).symbol,
      moonSign: byName.Moon.sign,
      sunSign: byName.Sun.sign,
      planets,
      dashas,
      yogas: computeYogas(byName, ascIdx),
      basicPrediction: prediction,
    };
  } catch {
    // Never break the UI — fall back to a minimal chart if computation fails.
    return {
      name: input.name, dob: niceDob(input.dob), tob: input.tob, pob: input.pob,
      ascendant: "Aries", ascendantDegree: 0, ascendantSymbol: "♈", moonSign: "Aries", sunSign: "Aries",
      planets: [], dashas: [], yogas: [], basicPrediction: "Could not compute the chart — please re-check the birth date, time and place.",
    };
  }
}
