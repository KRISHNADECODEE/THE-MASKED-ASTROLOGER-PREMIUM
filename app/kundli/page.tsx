"use client";

import { useState } from "react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { KundliForm } from "@/components/kundli/KundliForm";
import { VedicChart } from "@/components/kundli/VedicChart";
import { PlanetaryTable } from "@/components/kundli/PlanetaryTable";
import { DashaTimeline } from "@/components/kundli/DashaTimeline";
import { ZODIAC_SIGNS, type KundliResult } from "@/data/kundli";
import { motion } from "framer-motion";
import { computeKundli } from "@/lib/kundliEngine";
import { downloadKundliPdf } from "@/lib/kundliPdf";
import { KundliResultSkeleton } from "@/components/ui/Skeleton";
import { Download, Share2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { VedicTerm } from "@/components/VedicTerm";

export default function KundliPage() {
  const [kundli, setKundli]   = useState<KundliResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chart" | "planets" | "dasha" | "prediction">("chart");

  const getZodiacSymbol = (name: string) => {
    return ZODIAC_SIGNS.find((z) => z.name.toLowerCase() === name.toLowerCase())?.symbol || "✦";
  };

  const handleGenerate = async (formData: { name: string; dob: string; tob: string; pob: string; lat?: number; lng?: number; tzOffsetHours?: number }) => {
    setLoading(true);
    // Real sidereal (Lahiri) Vedic chart computed from the birth details + coordinates.
    await new Promise((r) => setTimeout(r, 1200));
    setKundli(computeKundli(formData));
    setLoading(false);
  };

  const handleDownloadPdf = () => {
    if (!kundli) return;
    try {
      downloadKundliPdf(kundli, "free");
      toast.success("Kundli PDF downloaded!");
    } catch {
      toast.error("Could not generate the PDF.");
    }
  };

  const TABS = [
    { id: "chart",      label: "Lagna Chart" },
    { id: "planets",    label: "Planets" },
    { id: "dasha",      label: "Dasha" },
    { id: "prediction", label: "Prediction" },
  ] as const;

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>

      {/* ── Page Hero ── */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Free · Instant · Accurate</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--color-parchment)",
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            Your Vedic Kundli
          </h1>
          <p
            className="max-w-xl mx-auto text-base"
            style={{ color: "rgba(250, 245, 237, 0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}
          >
            Enter your birth details to generate a complete birth chart with planetary
            positions, Vimshottari dasha, and personalized predictions — 100% free.
          </p>
        </div>
      </section>

      <div className="container-xl pt-16 pb-32">

        {/* ── Form (idle) ── */}
        {!kundli && !loading && (
          <div className="max-w-lg mx-auto">
            <KundliForm onGenerate={handleGenerate} loading={loading} />
          </div>
        )}

        {/* ── Loading skeleton (mirrors the result, no layout shift) ── */}
        {loading && (
          <div>
            <p className="text-center mb-8 text-sm flex items-center justify-center gap-2" style={{ color: "rgba(15,10,30,0.55)", fontFamily: "var(--font-body)" }}>
              <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-gold)" }} />
              Calculating your chart — positioning the 9 planets at your moment of birth…
            </p>
            <KundliResultSkeleton />
          </div>
        )}

        {/* ── Results ── */}
        {kundli && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {/* Result header */}
            <div
              className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))",
                border: "1px solid rgba(209,168,110,0.25)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    color: "var(--color-parchment)",
                  }}
                >
                  {kundli.name}&apos;s Kundli
                </h2>
                <p className="text-sm mt-1" style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}>
                  {kundli.dob} · {kundli.tob} · {kundli.pob}
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "Ascendant", term: "Lagna", value: `${kundli.ascendantSymbol} ${kundli.ascendant}` },
                    { label: "Moon Sign", term: "Rashi", value: `${getZodiacSymbol(kundli.moonSign)} ${kundli.moonSign}` },
                    { label: "Sun Sign",  term: "Surya", value: `${getZodiacSymbol(kundli.sunSign)} ${kundli.sunSign}` },
                  ].map(({ label, term, value }) => (
                    <div
                      key={label}
                      className="px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(209,168,110,0.1)", border: "1px solid rgba(209,168,110,0.2)" }}
                    >
                      <span className="text-xs" style={{ color: "rgba(250,245,237,0.4)", fontFamily: "var(--font-body)" }}><VedicTerm term={term}>{label}</VedicTerm>: </span>
                      <span className="text-xs font-bold" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={handleDownloadPdf} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
                  <Download size={14} /> Download PDF
                </button>
                <Link href="/kundli/pdf" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-white/10" style={{ border: "1px solid rgba(250,245,237,0.2)", color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}>
                  Premium Report
                </Link>
                <button
                  onClick={() => setKundli(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(250,245,237,0.2)", color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}
                >
                  <RefreshCcw size={14} /> New Chart
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(250,245,237,0.2)", color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="flex gap-1 p-1 rounded-xl mb-8"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.15)", width: "fit-content" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeTab === tab.id ? "var(--color-midnight)" : "transparent",
                    color: activeTab === tab.id ? "var(--color-parchment)" : "var(--color-midnight-700)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div
              className="rounded-2xl p-8"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.15)" }}
            >
              {activeTab === "chart" && (
                <div className="flex flex-col gap-10">
                  {/* Divisional charts: D1 · D9 · Moon */}
                  {kundli.charts && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <VedicChart chart={kundli.charts.d1} />
                      <VedicChart chart={kundli.charts.d9} />
                      <VedicChart chart={kundli.charts.moon} />
                    </div>
                  )}
                  {/* Panchang + Avakhada (Astrotalk-style) */}
                  {kundli.panchang && kundli.avakhada && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <DetailPanel title="Panchang" rows={[
                        ["Tithi", `${kundli.panchang.paksha} ${kundli.panchang.tithi}`],
                        ["Yoga", kundli.panchang.yoga],
                        ["Karana", kundli.panchang.karana],
                        ["Nakshatra", kundli.panchang.nakshatra],
                        ["Nakshatra Lord", kundli.panchang.nakshatraLord],
                        ["Ascendant", `${kundli.panchang.ascendant} · ${kundli.panchang.ascendantLord}`],
                        ["Sunrise", kundli.panchang.sunrise],
                        ["Sunset", kundli.panchang.sunset],
                      ]} />
                      <DetailPanel title="Avakhada Details" rows={[
                        ["Varna", kundli.avakhada.varna],
                        ["Vashya", kundli.avakhada.vashya],
                        ["Yoni", kundli.avakhada.yoni],
                        ["Gana", kundli.avakhada.gana],
                        ["Nadi", kundli.avakhada.nadi],
                        ["Sign", `${kundli.avakhada.sign} · ${kundli.avakhada.signLord}`],
                        ["Tatva", kundli.avakhada.tatva],
                        ["Charan (Pada)", String(kundli.avakhada.charan)],
                        ["Naamakshar", kundli.avakhada.nameAlphabet],
                        ["Paya", kundli.avakhada.paya],
                        ["Yunja", kundli.avakhada.yunja],
                      ]} />
                    </div>
                  )}
                  {/* Yogas */}
                  <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)", marginBottom: "1rem" }}>
                        Active Yogas
                      </h3>
                      <div className="flex flex-col gap-4">
                        {kundli.yogas.map((yoga) => (
                          <div
                            key={yoga.name}
                            className="rounded-xl p-4"
                            style={{
                              background: yoga.isPositive ? "rgba(209,168,110,0.06)" : "rgba(196,138,105,0.06)",
                              border: `1px solid ${yoga.isPositive ? "rgba(209,168,110,0.2)" : "rgba(196,138,105,0.2)"}`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span>{yoga.isPositive ? "✦" : "⚠"}</span>
                              <span className="font-semibold text-sm" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                                {yoga.name}
                              </span>
                              <span
                                className="ml-auto badge"
                                style={{
                                  background: yoga.isPositive ? "rgba(209,168,110,0.1)" : "rgba(196,138,105,0.1)",
                                  color: yoga.isPositive ? "var(--color-gold-dark)" : "var(--color-saffron)",
                                  border: yoga.isPositive ? "1px solid rgba(209,168,110,0.2)" : "1px solid rgba(196,138,105,0.2)",
                                  fontSize: "0.6rem",
                                }}
                              >
                                {yoga.isPositive ? "Positive" : "Challenging"}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>
                              {yoga.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(209,168,110,0.06)", border: "1px solid rgba(209,168,110,0.15)" }}>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-gold)" }}>
                          Want a detailed analysis?
                        </p>
                        <p className="text-xs mb-3" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
                          Get a 20+ page detailed PDF with full house-by-house analysis, remedy guide, and upcoming events.
                        </p>
                        <Link href="/kundli/pdf" className="btn-gold text-xs px-4 py-2">
                          Get Premium PDF Report →
                        </Link>
                      </div>
                    </div>

                  {/* Sacred Zodiac Reliefs */}
                  <div className="border-t border-[rgba(209,168,110,0.2)] pt-10">
                    <h3
                      className="text-center mb-8"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.6rem",
                        color: "var(--color-midnight)",
                      }}
                    >
                      Your Sacred Relief Alignments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        {
                          type: "Ascendant (Lagna)",
                          name: kundli.ascendant,
                          symbol: kundli.ascendantSymbol,
                          desc: "The mask you wear, your outer personality, physical body, and path of destiny in this lifetime.",
                        },
                        {
                          type: "Moon Sign (Rashi)",
                          name: kundli.moonSign,
                          symbol: getZodiacSymbol(kundli.moonSign),
                          desc: "Your emotional landscape, mind, subconscious patterns, and intuitive nature.",
                        },
                        {
                          type: "Sun Sign (Surya)",
                          name: kundli.sunSign,
                          symbol: getZodiacSymbol(kundli.sunSign),
                          desc: "Your core ego, soul's purpose, vitality, authority, and path of self-expression.",
                        },
                      ].map((z) => (
                        <div
                          key={z.type}
                          className="flex flex-col gap-4 p-5 rounded-2xl border"
                          style={{
                            background: "var(--color-cream)",
                            borderColor: "rgba(209,168,110,0.25)",
                          }}
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[rgba(209,168,110,0.15)] shadow-md">
                            <img
                              src={`/zodiacs/${z.name.toLowerCase()}.jpeg`}
                              alt={`${z.name} Relic Sculpture`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(209,168,110,0.25)] flex items-center justify-center text-sm shadow-sm">
                              {z.symbol}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#B78F56] font-bold">
                              {z.type}
                            </p>
                            <h4
                              className="text-base font-bold mt-1"
                              style={{
                                color: "var(--color-midnight)",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              {z.name}
                            </h4>
                            <p className="text-xs leading-relaxed mt-2" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>
                              {z.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "planets" && <PlanetaryTable kundli={kundli} />}
              {activeTab === "dasha"   && <DashaTimeline  kundli={kundli} />}

              {activeTab === "prediction" && (
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)", marginBottom: "1rem" }}>
                    AI-Powered Basic Predictions
                  </h3>
                  <div
                    className="rounded-xl p-6 leading-loose"
                    style={{ background: "var(--color-parchment)", border: "1px solid rgba(209,168,110,0.2)", color: "var(--color-midnight)", fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.8 }}
                  >
                    {kundli.basicPrediction}
                  </div>

                  <div
                    className="mt-6 rounded-xl p-5"
                    style={{ background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))", border: "1px solid rgba(209,168,110,0.2)" }}
                  >
                    <p className="font-semibold mb-2" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                      🤖 AI Astrologer — Coming Soon
                    </p>
                    <p className="text-sm mb-4" style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}>
                      Our upcoming AI model will use your saved kundli context to answer any question
                      about your specific chart — career, marriage, health, and more.
                    </p>
                    <Link href="/ai-chat" className="btn-gold text-xs px-4 py-2">
                      Join Waitlist →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Consultation CTA */}
            <div
              className="mt-3 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))",
                border: "1px solid rgba(209,168,110,0.2)",
              }}
            >
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-parchment)" }}>
                  Want a Professional Reading?
                </h3>
                <p className="mt-2 text-sm" style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}>
                  Book a 1:1 session with our astrologer for a detailed, personalised interpretation of your chart.
                </p>
              </div>
              <Link href="/consultation" className="btn-gold flex-shrink-0" style={{ color: "#FAF5ED", background: "var(--color-midnight)" }}>
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "var(--color-parchment)", border: "1px solid rgba(209,168,110,0.2)" }}>
      <h3 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--color-midnight)" }}>{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 py-1" style={{ borderBottom: "1px solid rgba(209,168,110,0.12)" }}>
            <span className="text-[11px] uppercase tracking-wide" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>{k}</span>
            <span className="text-sm font-semibold text-right" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
