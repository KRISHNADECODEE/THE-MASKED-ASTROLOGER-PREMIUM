// Ashtakoot Gun Milan — the classical 8-fold Vedic compatibility system (36
// total points). This produces a deterministic, illustrative result from the
// two partners' details. A production build would derive each koota from the
// Moon's nakshatra/rashi via an ephemeris service.

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

const KOOTA_DEFS: { name: string; max: number; meaning: string }[] = [
  { name: "Varna", max: 1, meaning: "Spiritual compatibility & ego balance" },
  { name: "Vashya", max: 2, meaning: "Mutual attraction & control" },
  { name: "Tara", max: 3, meaning: "Health & well-being / destiny" },
  { name: "Yoni", max: 4, meaning: "Physical & sexual compatibility" },
  { name: "Graha Maitri", max: 5, meaning: "Mental & intellectual bonding" },
  { name: "Gana", max: 6, meaning: "Temperament & behaviour" },
  { name: "Bhakoot", max: 7, meaning: "Love, finance & family welfare" },
  { name: "Nadi", max: 8, meaning: "Health & progeny (most important)" },
];

function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateGunMilan(boy: PartnerInput, girl: PartnerInput): GunMilanResult {
  const base = seed(`${boy.name}|${boy.dob}|${girl.name}|${girl.dob}`);

  const kootas: Koota[] = KOOTA_DEFS.map((def, i) => {
    // Deterministic per-koota score in [0, max], biased toward the higher end.
    const r = (base >> (i * 3)) % (def.max + 1);
    const r2 = (base >> (i * 2 + 1)) % (def.max + 1);
    const score = Math.max(r, r2); // gentle upward bias
    return { name: def.name, score, max: def.max, meaning: def.meaning };
  });

  const total = kootas.reduce((s, k) => s + k.score, 0);
  const max = 36;

  let verdict: string, verdictColor: string, summary: string;
  if (total >= 32) {
    verdict = "Excellent Match";
    verdictColor = "#2E7D32";
    summary = "A highly auspicious union with strong harmony across mind, body and destiny. The stars strongly favour this match.";
  } else if (total >= 25) {
    verdict = "Very Good Match";
    verdictColor = "#4CAF50";
    summary = "A genuinely compatible pairing. Minor differences are easily balanced with mutual understanding.";
  } else if (total >= 18) {
    verdict = "Acceptable Match";
    verdictColor = "var(--color-gold-dark)";
    summary = "A workable match. A few kootas score lower — a detailed reading can suggest remedies to strengthen the bond.";
  } else {
    verdict = "Needs Guidance";
    verdictColor = "var(--color-saffron)";
    summary = "Several kootas score low. We recommend a personalised consultation to understand the doshas and possible remedies before proceeding.";
  }

  return { kootas, total, max, verdict, verdictColor, summary };
}
