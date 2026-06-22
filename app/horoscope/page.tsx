"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MandalaBackground } from "@/components/MandalaBackground";
import { RASHIS, TATVA_LABEL, getRashi } from "@/data/rashi";
import { getDailyHoroscope } from "@/data/horoscope";
import { Heart, Briefcase, Activity, Sparkles, ChevronRight, Moon } from "lucide-react";

const DATE_RANGES: Record<string, string> = {
  aries: "Mar 21 – Apr 19", taurus: "Apr 20 – May 20", gemini: "May 21 – Jun 20",
  cancer: "Jun 21 – Jul 22", leo: "Jul 23 – Aug 22", virgo: "Aug 23 – Sep 22",
  libra: "Sep 23 – Oct 22", scorpio: "Oct 23 – Nov 21", sagittarius: "Nov 22 – Dec 21",
  capricorn: "Dec 22 – Jan 19", aquarius: "Jan 20 – Feb 18", pisces: "Feb 19 – Mar 20",
};

function Rating({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} style={{ color: "var(--color-gold)" }} />
      <span className="text-xs w-16" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)" }}>{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="w-4 h-1.5 rounded-full" style={{ background: i < value ? "var(--color-gold)" : "rgba(209,168,110,0.2)" }} />
        ))}
      </div>
    </div>
  );
}

export default function RashifalPage() {
  const [rashiId, setRashiId] = useState("aries");
  const rashi = getRashi(rashiId)!;
  const horo = useMemo(() => getDailyHoroscope(rashiId), [rashiId]);

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="relative pt-24 pb-14 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Daily Rashifal · Updated Every Day</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "var(--color-parchment)", lineHeight: 1.05, marginBottom: "0.75rem" }}>
            Daily Rashifal
          </h1>
          <p className="text-sm max-w-xl mx-auto flex items-center justify-center gap-2" style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)" }}>
            <Moon size={14} /> Vedic predictions based on your <strong className="mx-1" style={{ color: "var(--color-gold)" }}>Chandra Rashi</strong> (Moon sign) · {horo.date}
          </p>
        </div>
      </section>

      <div className="container-xl py-12">
        {/* Rashi selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {RASHIS.map((r) => {
            const active = r.id === rashiId;
            return (
              <button
                key={r.id}
                onClick={() => setRashiId(r.id)}
                className="flex flex-col items-center gap-0.5 p-3 rounded-xl transition-all"
                style={{ background: active ? "var(--color-cosmic)" : "var(--color-ivory)", border: `1.5px solid ${active ? "var(--color-gold)" : "rgba(209,168,110,0.2)"}` }}
              >
                <span className="text-base font-bold" style={{ color: active ? "var(--color-gold)" : "var(--color-midnight)", fontFamily: "var(--font-display)" }}>{r.sanskrit}</span>
                <span className="text-[10px]" style={{ color: active ? "rgba(250,245,237,0.5)" : "rgba(45,41,38,0.45)" }}>{r.western}</span>
              </button>
            );
          })}
        </div>

        {/* Reading */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-8" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(209,168,110,0.25)" }}>
                <img src={`/zodiacs/${rashi.id}.jpeg`} alt={rashi.sanskrit} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-midnight)" }}>{rashi.sanskrit} <span style={{ color: "rgba(45,41,38,0.45)", fontSize: "1.1rem" }}>({rashi.western})</span></h2>
                <p className="text-xs" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
                  Ruling planet: {rashi.lord} · {TATVA_LABEL[rashi.tatva]} · {DATE_RANGES[rashi.id]}
                </p>
              </div>
            </div>
            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(45,41,38,0.8)", fontFamily: "var(--font-body)", lineHeight: 1.9 }}>{horo.text}</p>
            <div className="flex flex-col gap-3 pt-6" style={{ borderTop: "1px solid rgba(209,168,110,0.15)" }}>
              <Rating icon={Heart} label="Love" value={horo.love} />
              <Rating icon={Briefcase} label="Career" value={horo.career} />
              <Rating icon={Activity} label="Health" value={horo.health} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6 grid grid-cols-3 gap-3 text-center" style={{ background: "linear-gradient(135deg, var(--color-cosmic), var(--color-midnight-800))", border: "1px solid rgba(209,168,110,0.25)" }}>
              {[
                { k: "Mood", v: horo.mood },
                { k: "Lucky Color", v: horo.luckyColor },
                { k: "Lucky Number", v: String(horo.luckyNumber) },
              ].map(({ k, v }) => (
                <div key={k}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(250,245,237,0.4)" }}>{k}</p>
                  <p className="text-sm font-bold" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{v}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-6" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
              <p className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                <Sparkles size={15} style={{ color: "var(--color-gold)" }} /> Don&apos;t know your Rashi?
              </p>
              <p className="text-xs mb-4" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
                Your Rashi is your Moon sign at birth. Generate your free Janm Kundli to find it, or book a 1:1 reading.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/kundli" className="btn-gold text-xs px-4 py-2 text-center">Free Janm Kundli</Link>
                <Link href="/consultation" className="text-xs px-4 py-2 text-center rounded-lg flex items-center justify-center gap-1" style={{ border: "1.5px solid var(--color-saffron)", color: "var(--color-saffron)" }}>
                  Book Consultation <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
