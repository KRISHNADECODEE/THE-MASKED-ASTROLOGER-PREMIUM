import { Origin, Horoscope } from "circular-natal-horoscope-js";
import { ZODIAC_SIGNS, type KundliResult, type DashaPeriod, type PlanetData, type VedicChartData, type Avakhada, type Panchang } from "@/data/kundli";

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

// ── Panchang / Avakhada reference tables ─────────────────────────────
const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const VARNA_NAMES = ["Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin"];
const VASHYA_NAMES = ["Chatushpada", "Chatushpada", "Nara", "Jalachara", "Vanachara", "Nara", "Nara", "Keeta", "Nara", "Jalachara", "Nara", "Jalachara"];
const TATVA_NAMES = ["Fire", "Earth", "Air", "Water"];
const PAYA_NAMES = ["Gold", "Silver", "Copper", "Iron"];
const YUNJA_NAMES = ["Purva", "Madhya", "Uttara"];
const NADI_NAMES = ["Aadi", "Madhya", "Antya"];
const VIM_LORD = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const YONI_BY_NAK = ["Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat", "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer", "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"];
const GANA_BY_NAK = ["Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"];
const NAK_SYLLABLE = ["Chu Che Cho La", "Lee Lu Le Lo", "A Ee U Ay", "O Va Vi Vu", "Ve Vo Ka Ki", "Ku Gha Ng Chha", "Ke Ko Ha Hi", "Hu He Ho Da", "Di Du De Do", "Ma Mi Mu Me", "Mo Ta Ti Tu", "Te To Pa Pi", "Pu Sha Na Tha", "Pe Po Ra Ri", "Ru Re Ro Ta", "Ti Tu Te To", "Na Ni Nu Ne", "No Ya Yi Yu", "Ye Yo Bha Bhi", "Bhu Dha Pha Dha", "Bhe Bho Ja Ji", "Ju Je Jo Gha", "Ga Gi Gu Ge", "Go Sa Si Su", "Se So Da Di", "Du Tha Jha Da", "De Do Cha Chi"];
const TITHI_NAMES = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi"];
const YOGA_NAMES = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
const KARANA_MOVABLE = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
const nadiName = (n: number) => NADI_NAMES[[0, 1, 2, 2, 1, 0][n % 6]];

function buildChart(title: string, ascSignIdx: number, planets: { name: string; symbol: string; signIdx: number; retro: boolean }[]): VedicChartData {
  return {
    title,
    ascendant: SIGN(ascSignIdx).name,
    ascendantSymbol: SIGN(ascSignIdx).symbol,
    planets: planets.map((p) => ({
      name: p.name, symbol: p.symbol, sign: SIGN(p.signIdx).name, isRetrograde: p.retro,
      house: ((p.signIdx - ascSignIdx + 12) % 12) + 1,
    })),
  };
}

// Classic NOAA-style sunrise/sunset; returns local "HH:MM:SS".
function sunTimes(date: Date, lat: number, lng: number, tz: number): { sunrise: string; sunset: string } {
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const N = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000);
  const calc = (rise: boolean): string => {
    const lngHour = lng / 15;
    const t = N + ((rise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    let L = M + 1.916 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 282.634; L = ((L % 360) + 360) % 360;
    let RA = deg * Math.atan(0.91764 * Math.tan(L * rad)); RA = ((RA % 360) + 360) % 360;
    RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
    const sinDec = 0.39782 * Math.sin(L * rad), cosDec = Math.cos(Math.asin(sinDec));
    const cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(lat * rad)) / (cosDec * Math.cos(lat * rad));
    if (cosH > 1 || cosH < -1) return "—";
    let H = (rise ? 360 - deg * Math.acos(cosH) : deg * Math.acos(cosH)) / 15;
    let local = (H + RA - 0.06571 * t - 6.622) - lngHour + tz; local = ((local % 24) + 24) % 24;
    const h = Math.floor(local), m = Math.floor((local - h) * 60), s = Math.floor(((local - h) * 60 - m) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  return { sunrise: calc(true), sunset: calc(false) };
}

function computePanchang(sunLong: number, moonLong: number, ascIdx: number, moonNak: ReturnType<typeof nakshatraOf>, lat: number, lng: number, tz: number, date: Date): Panchang {
  const diff = norm360(moonLong - sunLong);
  const tn = Math.floor(diff / 12) + 1; // 1..30
  const tithi = tn === 15 ? "Purnima" : tn === 30 ? "Amavasya" : TITHI_NAMES[(tn - 1) % 15];
  const ki = Math.floor(diff / 6);
  const karana = ki === 0 ? "Kimstughna" : ki <= 56 ? KARANA_MOVABLE[(ki - 1) % 7] : ["Shakuni", "Chatushpada", "Naga"][ki - 57];
  const st = sunTimes(date, lat, lng, tz);
  return {
    tithi, paksha: tn <= 15 ? "Shukla" : "Krishna",
    yoga: YOGA_NAMES[Math.floor(norm360(sunLong + moonLong) / (360 / 27)) % 27],
    karana, nakshatra: moonNak.name, nakshatraLord: VIM_LORD[moonNak.index % 9],
    ascendant: SIGN(ascIdx).name, ascendantLord: RASHI_LORD[ascIdx],
    sunrise: st.sunrise, sunset: st.sunset,
  };
}

function computeAvakhada(moonLong: number, moonNak: ReturnType<typeof nakshatraOf>, tithi: string): Avakhada {
  const r = Math.floor(moonLong / 30);
  return {
    varna: VARNA_NAMES[r], vashya: VASHYA_NAMES[r], yoni: YONI_BY_NAK[moonNak.index],
    gana: GANA_BY_NAK[moonNak.index], nadi: nadiName(moonNak.index),
    sign: SIGN(r).name, signLord: RASHI_LORD[r], nakshatra: moonNak.name, charan: moonNak.pada,
    tatva: TATVA_NAMES[r % 4], nameAlphabet: (NAK_SYLLABLE[moonNak.index].split(" ")[moonNak.pada - 1] || ""),
    paya: PAYA_NAMES[moonNak.index % 4], tithi, yunja: YUNJA_NAMES[Math.floor(moonNak.index / 9)],
  };
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

    // Raw sidereal longitudes for all 9 grahas (drives every divisional chart).
    const rahu = meanLunarNodeSidereal(jd);
    const rawLongs: { name: string; symbol: string; long: number; retro: boolean }[] = [
      ...order.map((n) => {
        const b = h.CelestialBodies[key[n]];
        return { name: n, symbol: PLANET_SYMBOL[n], long: norm360(b.ChartPosition.Ecliptic.DecimalDegrees as number), retro: !!b.isRetrograde };
      }),
      { name: "Rahu", symbol: PLANET_SYMBOL.Rahu, long: rahu, retro: true },
      { name: "Ketu", symbol: PLANET_SYMBOL.Ketu, long: norm360(rahu + 180), retro: true },
    ];

    const planets: PlanetData[] = rawLongs.map((r) => mkPlanet(r.name, r.long, r.retro));
    const byName: Record<string, PlanetData> = Object.fromEntries(planets.map((p) => [p.name, p]));
    const moonLong = rawLongs.find((r) => r.name === "Moon")!.long;
    const sunLong = rawLongs.find((r) => r.name === "Sun")!.long;
    const dateUTC = new Date(Date.UTC(y, (mo || 1) - 1, da || 1));
    const dashas = buildDashas(moonLong, dateUTC);
    const current = dashas.find((d) => d.isCurrent);
    const moonNak = nakshatraOf(moonLong);

    // Divisional charts: D-1 (Lagna), D-9 (Navamsa), and the Moon chart.
    const navSign = (L: number) => Math.floor(L / (30 / 9)) % 12;
    const d1: VedicChartData = buildChart("Lagna (D1)", ascIdx, rawLongs.map((r) => ({ name: r.name, symbol: r.symbol, signIdx: Math.floor(r.long / 30), retro: r.retro })));
    const d9: VedicChartData = buildChart("Navamsa (D9)", navSign(norm360(ascLong)), rawLongs.map((r) => ({ name: r.name, symbol: r.symbol, signIdx: navSign(r.long), retro: r.retro })));
    const moonChart: VedicChartData = buildChart("Moon (Chandra)", Math.floor(moonLong / 30), rawLongs.map((r) => ({ name: r.name, symbol: r.symbol, signIdx: Math.floor(r.long / 30), retro: r.retro })));
    const panchang: Panchang = computePanchang(sunLong, moonLong, ascIdx, moonNak, lat, lng, tz, dateUTC);
    const avakhada: Avakhada = computeAvakhada(moonLong, moonNak, panchang.tithi);

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
      charts: { d1, d9, moon: moonChart },
      avakhada,
      panchang,
      coords: { lat, lng, tzOffset: tz },
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
