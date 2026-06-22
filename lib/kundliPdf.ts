import { jsPDF } from "jspdf";
import type { KundliResult } from "@/data/kundli";

// Brand colours (RGB)
const GOLD: [number, number, number] = [201, 162, 39];
const COSMIC: [number, number, number] = [27, 22, 64];
const INK: [number, number, number] = [45, 41, 38];
const MUTED: [number, number, number] = [120, 110, 100];
const LIGHT: [number, number, number] = [244, 239, 230];

const REMEDIES = [
  "Recite the beej mantra of your Lagna lord daily at sunrise (11 or 108 times).",
  "Offer water (arghya) to Surya every morning for vitality and confidence.",
  "Light a pure ghee diya at dusk on the weekday of your current Mahadasha lord.",
  "Donate items linked to a weak Graha on its day (e.g. black sesame for Shani on Saturday).",
  "Wear the recommended energised gemstone only after consulting our astrologer.",
];

export function downloadKundliPdf(k: KundliResult, tier: "free" | "premium" = "premium") {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 15; // margin
  const CW = W - M * 2;
  let y = 0;
  let page = 1;

  const footer = () => {
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("The Masked Astrologer · Janm Kundli Report · For guidance only", M, 290);
    doc.text(`Page ${page}`, W - M, 290, { align: "right" });
  };

  const ensure = (need: number) => {
    if (y + need > 278) {
      footer();
      doc.addPage();
      page += 1;
      y = M;
    }
  };

  const header = () => {
    doc.setFillColor(...COSMIC);
    doc.rect(0, 0, W, 32, "F");
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("THE MASKED ASTROLOGER", M, 15);
    doc.setTextColor(245, 240, 230);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Janm Kundli — Vedic Birth Chart Report", M, 23);
    y = 42;
  };

  const sectionTitle = (t: string) => {
    ensure(14);
    doc.setFillColor(...GOLD);
    doc.rect(M, y - 4, 3, 6, "F");
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(t, M + 6, y);
    y += 8;
  };

  const paragraph = (t: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 55, 50);
    const lines = doc.splitTextToSize(t, CW) as string[];
    lines.forEach((ln) => {
      ensure(6);
      doc.text(ln, M, y);
      y += 5.2;
    });
    y += 3;
  };

  const table = (cols: { label: string; w: number }[], rows: string[][]) => {
    const rowH = 7;
    // header
    ensure(rowH);
    doc.setFillColor(...COSMIC);
    doc.rect(M, y - 5, CW, rowH, "F");
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    let x = M + 2;
    cols.forEach((c) => { doc.text(c.label, x, y); x += c.w; });
    y += rowH - 1;
    // rows
    doc.setFont("helvetica", "normal");
    rows.forEach((r, i) => {
      ensure(rowH);
      if (i % 2 === 0) { doc.setFillColor(...LIGHT); doc.rect(M, y - 5, CW, rowH, "F"); }
      doc.setTextColor(...INK);
      doc.setFontSize(9);
      x = M + 2;
      r.forEach((cell, ci) => { doc.text(String(cell), x, y); x += cols[ci].w; });
      y += rowH;
    });
    y += 4;
  };

  // ── Build ───────────────────────────────────────────────
  header();

  // Native / birth details box
  doc.setFillColor(...LIGHT);
  doc.roundedRect(M, y - 4, CW, 26, 2, 2, "F");
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(k.name, M + 4, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(70, 65, 60);
  doc.text(`Date of Birth:  ${k.dob}`, M + 4, y + 11);
  doc.text(`Time of Birth:  ${k.tob}`, M + 4, y + 16);
  doc.text(`Place of Birth: ${k.pob}`, M + 100, y + 11);
  doc.text(`Report tier:    ${tier === "premium" ? "Premium" : "Free Basic"}`, M + 100, y + 16);
  y += 30;

  // Core summary
  sectionTitle("Core Chart Summary");
  const cur = k.dashas.find((d) => d.isCurrent);
  table(
    [{ label: "Attribute", w: 60 }, { label: "Value", w: 120 }],
    [
      ["Lagna (Ascendant)", `${k.ascendant} (${k.ascendantDegree.toFixed(2)}°)`],
      ["Chandra Rashi (Moon Sign)", k.moonSign],
      ["Surya Rashi (Sun Sign)", k.sunSign],
      ["Current Mahadasha", cur ? `${cur.planet} (until ${cur.endDate.slice(0, 4)})` : "—"],
    ]
  );

  // Yogas
  sectionTitle("Active Yogas");
  k.yogas.forEach((yg) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    ensure(6);
    doc.text(`• ${yg.name}`, M, y); y += 5;
    paragraph(yg.description);
  });

  // Planetary positions
  sectionTitle("Graha Positions (Planetary Table)");
  table(
    [
      { label: "Graha", w: 32 }, { label: "Rashi", w: 34 }, { label: "House", w: 20 },
      { label: "Degree", w: 24 }, { label: "Nakshatra", w: 40 }, { label: "Motion", w: 28 },
    ],
    k.planets.map((p) => [
      p.name, p.sign, String(p.house), `${p.degree.toFixed(2)}°`, `${p.nakshatra} (${p.nakshatraPada})`, p.isRetrograde ? "Retrograde" : "Direct",
    ])
  );

  // Vimshottari Dasha
  sectionTitle("Vimshottari Mahadasha Timeline");
  table(
    [{ label: "Mahadasha", w: 50 }, { label: "From", w: 45 }, { label: "To", w: 45 }, { label: "Years", w: 30 }],
    k.dashas.map((d) => [
      d.planet + (d.isCurrent ? "  (current)" : ""), d.startDate.slice(0, 4), d.endDate.slice(0, 4), String(d.years),
    ])
  );

  // Prediction
  sectionTitle("Predictive Overview");
  paragraph(k.basicPrediction);

  // Premium-only sections
  if (tier === "premium") {
    sectionTitle("Personalised Vedic Remedies");
    REMEDIES.forEach((r) => { paragraph(`• ${r}`); });

    sectionTitle("Note");
    paragraph(
      "This report is generated from your birth details for guidance and self-reflection. For a detailed house-by-house analysis, divisional charts (Navamsa D-9, Dashamsa D-10) and personalised remedies, book a 1:1 consultation with The Masked Astrologer."
    );
  }

  footer();

  const safe = (k.name || "kundli").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`kundli-${safe}-${tier}.pdf`);
}
