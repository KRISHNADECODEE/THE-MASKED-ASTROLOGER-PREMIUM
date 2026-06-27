"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MandalaBackground } from "@/components/MandalaBackground";
import { calculateGunMilan, type GunMilanResult, type PartnerInput } from "@/lib/gunMilan";
import { Heart, RefreshCcw, User, Sparkles, ChevronRight, MapPin } from "lucide-react";

const EMPTY: PartnerInput = { name: "", dob: "", tob: "", pob: "", lat: 28.6139, lng: 77.209, tzOffsetHours: 5.5 };

const roundHalf = (n: number) => Math.round(n * 2) / 2;

interface Place { name: string; lat: number; lng: number; tz: number }

function PlaceSearch({ value, onChange }: { value: PartnerInput; onChange: (v: PartnerInput) => void }) {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) { setPlaces([]); return; }
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(async () => {
      try {
        setBusy(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`,
          { headers: { Accept: "application/json" } }
        );
        const data = (await res.json()) as { lat: string; lon: string; display_name: string; address?: { country_code?: string } }[];
        setPlaces(data.map((d) => {
          const lng = parseFloat(d.lon);
          return { name: d.display_name, lat: parseFloat(d.lat), lng, tz: d.address?.country_code === "in" ? 5.5 : roundHalf(lng / 15) };
        }));
      } catch { setPlaces([]); } finally { setBusy(false); }
    }, 450);
  }, [query]);

  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>Place of Birth *</label>
      <div className="relative">
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45,41,38,0.3)" }} />
          <input
            type="text"
            value={query || value.pob}
            onChange={(e) => { setQuery(e.target.value); onChange({ ...value, pob: e.target.value }); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search city…"
            className="input-field w-full pl-9"
          />
        </div>
        {open && query.trim().length >= 3 && (
          <div className="absolute z-20 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl max-h-60 overflow-y-auto" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
            {busy && <div className="px-3 py-2 text-xs" style={{ color: "rgba(45,41,38,0.45)" }}>Searching…</div>}
            {!busy && places.length === 0 && <div className="px-3 py-2 text-xs" style={{ color: "rgba(45,41,38,0.45)" }}>No matches — try full city name.</div>}
            {places.map((p, i) => (
              <button key={i} type="button" className="w-full text-left px-3 py-2.5 text-xs flex items-start gap-2 transition-all"
                style={{ color: "var(--color-midnight)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-parchment)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                onClick={() => { onChange({ ...value, pob: p.name, lat: p.lat, lng: p.lng, tzOffsetHours: p.tz }); setQuery(""); setOpen(false); }}
              >
                <MapPin size={11} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: 2 }} />
                <span className="leading-snug">{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {value.pob && !query && (
        <p className="text-[10px] mt-1" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-mono)" }}>
          {value.lat?.toFixed(3)}°, {value.lng?.toFixed(3)}° · GMT{(value.tzOffsetHours ?? 5.5) >= 0 ? "+" : ""}{value.tzOffsetHours ?? 5.5}
        </p>
      )}
    </div>
  );
}

function PartnerForm({
  label, accent, value, onChange,
}: { label: string; accent: string; value: PartnerInput; onChange: (v: PartnerInput) => void }) {
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--color-ivory)", border: `1.5px solid ${accent}` }}>
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${accent}22`, color: accent }}><User size={16} /></span>
        <h3 className="font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>{label}</h3>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>Full Name *</label>
        <input type="text" required value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Name" className="input-field w-full" />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>Date of Birth *</label>
        <input type="date" required value={value.dob} onChange={(e) => onChange({ ...value, dob: e.target.value })} max={new Date().toISOString().split("T")[0]} className="input-field w-full" />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>Time of Birth *</label>
        <input type="time" required value={value.tob} onChange={(e) => onChange({ ...value, tob: e.target.value })} className="input-field w-full" />
      </div>
      <PlaceSearch value={value} onChange={onChange} />
    </div>
  );
}

export default function MatchmakingPage() {
  const [boy, setBoy] = useState<PartnerInput>(EMPTY);
  const [girl, setGirl] = useState<PartnerInput>(EMPTY);
  const [result, setResult] = useState<GunMilanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setResult(calculateGunMilan(boy, girl));
    setLoading(false);
    if (typeof window !== "undefined") setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const percent = result ? Math.round((result.total / result.max) * 100) : 0;

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="relative pt-24 pb-14 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Ashtakoot · 36 Guna Milan</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "var(--color-parchment)", lineHeight: 1.05, marginBottom: "1rem" }}>
            Kundli Matchmaking
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
            Check marriage compatibility the traditional Vedic way — across all 8 kootas
            (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot &amp; Nadi).
            Birth location is used for accurate Moon sign placement.
          </p>
        </div>
      </section>

      <div className="container-xl py-12">
        <form onSubmit={handleMatch}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <PartnerForm label="Groom / Partner 1" accent="#4C7DB5" value={boy} onChange={setBoy} />
            <PartnerForm label="Bride / Partner 2" accent="#C48A69" value={girl} onChange={setGirl} />
          </div>
          <div className="flex justify-center">
            <button type="submit" disabled={loading} className="btn-gold glow-pulse px-8 py-4 flex items-center gap-2 disabled:opacity-60">
              {loading ? "Matching the stars…" : (<><Heart size={18} /> Check Compatibility</>)}
            </button>
          </div>
        </form>

        {result && (
          <motion.div id="result" className="mt-14" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {/* Score header */}
            <motion.div
              className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 mb-8"
              style={{ background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))", border: "1px solid rgba(209,168,110,0.25)" }}
              initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <div className="relative flex-shrink-0 w-36 h-36 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(var(--color-gold) ${percent}%, rgba(250,245,237,0.1) ${percent}%)` }}>
                <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center" style={{ background: "var(--color-midnight)" }}>
                  <span className="text-3xl font-bold" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{result.total}</span>
                  <span className="text-xs" style={{ color: "rgba(250,245,237,0.5)" }}>out of {result.max}</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <span className="badge mb-2 inline-block" style={{ background: "rgba(209,168,110,0.15)", color: result.verdictColor, border: `1px solid ${result.verdictColor}`, fontSize: "0.7rem" }}>{result.verdict}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-parchment)", marginBottom: "0.5rem" }}>
                  {boy.name || "Partner 1"} &amp; {girl.name || "Partner 2"}
                </h2>
                <p className="text-sm" style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>{result.summary}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs" style={{ color: "rgba(250,245,237,0.4)", fontFamily: "var(--font-mono)" }}>
                  {boy.pob && <span>📍 {boy.name}: {boy.pob.split(",")[0]}</span>}
                  {girl.pob && <span>📍 {girl.name}: {girl.pob.split(",")[0]}</span>}
                </div>
              </div>
            </motion.div>

            {/* Moon nakshatra detail (verify input) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {([
                { label: boy.name || "Groom", info: result.boyInfo },
                { label: girl.name || "Bride", info: result.girlInfo },
              ] as { label: string; info: typeof result.boyInfo }[]).map(({ label, info }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.18)" }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                    {label} — Moon Details
                  </p>
                  {[
                    ["Nakshatra", `${info.nakshatra} (Pada ${info.nakshatra_pada})`],
                    ["Rashi (Moon sign)", info.rashi],
                    ["Gana", info.gana],
                    ["Nadi", info.nadi],
                    ["Yoni", info.yoni],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 text-xs" style={{ borderBottom: "1px solid rgba(209,168,110,0.1)" }}>
                      <span style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>{k}</span>
                      <span className="font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Koota breakdown */}
            <div className="rounded-2xl p-8 mb-8" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
              <h3 className="mb-6" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)" }}>The 8 Kootas</h3>
              <div className="flex flex-col gap-5">
                {result.kootas.map((k, i) => (
                  <div key={k.name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                        {k.name} <span className="font-normal text-xs" style={{ color: "rgba(45,41,38,0.5)" }}>· {k.meaning}</span>
                      </span>
                      <span className="text-sm font-bold" style={{ color: "var(--color-gold-dark)", fontFamily: "var(--font-body)" }}>{k.score}/{k.max}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(209,168,110,0.15)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${(k.score / k.max) * 100}%` }}
                        transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: "rgba(209,168,110,0.08)", border: "1px solid rgba(209,168,110,0.25)" }}>
              <div className="flex items-center gap-3">
                <Sparkles size={22} style={{ color: "var(--color-gold)" }} />
                <p className="text-sm" style={{ color: "rgba(45,41,38,0.75)", fontFamily: "var(--font-body)" }}>
                  Want a full written compatibility report with remedies for low-scoring kootas?
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/consultation" className="btn-gold text-sm px-5 py-2.5 flex items-center gap-1">Book Consultation <ChevronRight size={15} /></Link>
                <button onClick={() => setResult(null)} className="text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5" style={{ border: "1px solid rgba(45,41,38,0.2)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                  <RefreshCcw size={14} /> New Match
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
