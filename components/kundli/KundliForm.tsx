"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, User, ChevronRight } from "lucide-react";

interface FormData {
  name: string;
  gender: "male" | "female" | "other";
  dob: string;
  tob: string;
  pob: string;
  lat: number;
  lng: number;
}

interface Props {
  onGenerate: (data: FormData) => void;
  loading: boolean;
}

const CITIES = [
  { name: "New Delhi",  lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai",     lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore",  lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad",  lat: 17.3850, lng: 78.4867 },
  { name: "Chennai",    lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata",    lat: 22.5726, lng: 88.3639 },
  { name: "Pune",       lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad",  lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur",     lat: 26.9124, lng: 75.7873 },
  { name: "Surat",      lat: 21.1702, lng: 72.8311 },
  { name: "Lucknow",    lat: 26.8467, lng: 80.9462 },
  { name: "Bhopal",     lat: 23.2599, lng: 77.4126 },
  { name: "Varanasi",   lat: 25.3176, lng: 82.9739 },
  { name: "Amritsar",   lat: 31.6340, lng: 74.8723 },
  { name: "Dehradun",   lat: 30.3165, lng: 78.0322 },
];

export function KundliForm({ onGenerate, loading }: Props) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState<FormData>({
    name: "", gender: "male", dob: "", tob: "", pob: "", lat: 28.6139, lng: 77.2090,
  });
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const update = (field: keyof FormData, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const canProceed1 = form.name.trim().length > 1;
  const canProceed2 = form.dob && form.tob;
  const canProceed3 = form.pob;

  const STEPS = [
    { num: 1, label: "Identity", icon: User },
    { num: 2, label: "Birth Time", icon: Calendar },
    { num: 3, label: "Birth Place", icon: MapPin },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(209, 168, 110, 0.25)" }}
    >
      {/* Step indicator */}
      <div
        className="flex"
        style={{ borderBottom: "1px solid rgba(209, 168, 110, 0.15)", background: "var(--color-parchment)" }}
      >
        {STEPS.map((s) => {
          const Icon = s.icon;
          const active = step === s.num;
          const done   = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => done && setStep(s.num)}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all"
              style={{
                color: active ? "var(--color-midnight)" : done ? "var(--color-gold)" : "rgba(45, 41, 38, 0.4)",
                background: active ? "var(--color-ivory)" : "transparent",
                borderBottom: active ? "2px solid var(--color-gold)" : "2px solid transparent",
                cursor: done ? "pointer" : "default",
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: active ? "var(--color-gold)" : done ? "rgba(209, 168, 110, 0.15)" : "rgba(45, 41, 38, 0.08)",
                  color: active ? "var(--color-midnight)" : done ? "var(--color-gold)" : "rgba(45, 41, 38, 0.3)",
                }}
              >
                {done ? "✓" : s.num}
              </div>
              <span className="hidden sm:block">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-8">

        {/* ── STEP 1: Identity ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "0.25rem" }}>
                Who are we reading for?
              </h3>
              <p className="text-sm" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
                Enter the name exactly as you'd like it on the chart.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                Full Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g., Priya Sharma"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                Gender
              </label>
              <div className="flex gap-3">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => update("gender", g)}
                    className="flex-1 py-3 rounded-lg text-sm font-medium capitalize transition-all"
                    style={{
                      background: form.gender === g ? "var(--color-midnight)" : "transparent",
                      color: form.gender === g ? "var(--color-parchment)" : "rgba(45, 41, 38, 0.5)",
                      border: `1.5px solid ${form.gender === g ? "var(--color-midnight)" : "rgba(45, 41, 38, 0.15)"}`,
                    }}
                  >
                    {g === "male" ? "👨 Male" : g === "female" ? "👩 Female" : "🧑 Other"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => canProceed1 && setStep(2)}
              disabled={!canProceed1}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2"
              style={{ opacity: canProceed1 ? 1 : 0.5 }}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Birth Time ── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "0.25rem" }}>
                When were you born?
              </h3>
              <p className="text-sm" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
                The exact birth time determines your Lagna (ascendant) and house placements.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                Date of Birth *
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45, 41, 38, 0.3)" }} />
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                Time of Birth *
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45, 41, 38, 0.3)" }} />
                <input
                  type="time"
                  value={form.tob}
                  onChange={(e) => update("tob", e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
                💡 Check your birth certificate for accurate time. Even 5 minutes matter.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1" style={{ color: "var(--color-midnight)", borderColor: "rgba(45, 41, 38, 0.2)" }}>
                Back
              </button>
              <button
                onClick={() => canProceed2 && setStep(3)}
                disabled={!canProceed2}
                className="btn-gold flex-1 flex items-center justify-center gap-2"
                style={{ opacity: canProceed2 ? 1 : 0.5 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Birth Place ── */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "0.25rem" }}>
                Where were you born?
              </h3>
              <p className="text-sm" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
                The birth location determines the exact planetary positions for your time zone.
              </p>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                City of Birth *
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45, 41, 38, 0.3)" }} />
                <input
                  type="text"
                  value={citySearch || form.pob}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    update("pob", e.target.value);
                    setShowCities(true);
                  }}
                  onFocus={() => setShowCities(true)}
                  placeholder="Search city... (e.g., Mumbai)"
                  className="input-field pl-10"
                />
              </div>

              {showCities && filteredCities.length > 0 && (
                <div
                  className="absolute z-10 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl"
                  style={{ background: "var(--color-ivory)", border: "1px solid rgba(209, 168, 110, 0.2)" }}
                >
                  {filteredCities.slice(0, 6).map((city) => (
                    <button
                      key={city.name}
                      className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-all hover:bg-parchment"
                      style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-parchment)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                      onClick={() => {
                        update("pob", city.name);
                        update("lat", city.lat);
                        update("lng", city.lng);
                        setCitySearch("");
                        setShowCities(false);
                      }}
                    >
                      <MapPin size={12} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                      <span>{city.name}</span>
                      <span className="ml-auto text-xs" style={{ color: "rgba(45, 41, 38, 0.35)" }}>
                        {city.lat.toFixed(2)}°N
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {form.pob && (
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: "rgba(209, 168, 110, 0.08)", border: "1px solid rgba(209, 168, 110, 0.15)" }}
              >
                <span style={{ color: "var(--color-gold)" }}>📍</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{form.pob}</p>
                  <p className="text-xs" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-mono)" }}>
                    {form.lat.toFixed(4)}°N · {form.lng.toFixed(4)}°E
                  </p>
                </div>
              </div>
            )}

            {/* Summary */}
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}
            >
              <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: "rgba(45, 41, 38, 0.4)" }}>
                Chart Summary
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span style={{ color: "rgba(45, 41, 38, 0.4)" }}>Name:</span> <strong style={{ color: "var(--color-midnight)" }}>{form.name}</strong></div>
                <div><span style={{ color: "rgba(45, 41, 38, 0.4)" }}>Gender:</span> <strong style={{ color: "var(--color-midnight)", textTransform: "capitalize" }}>{form.gender}</strong></div>
                <div><span style={{ color: "rgba(45, 41, 38, 0.4)" }}>Date:</span> <strong style={{ color: "var(--color-midnight)" }}>{form.dob || "—"}</strong></div>
                <div><span style={{ color: "rgba(45, 41, 38, 0.4)" }}>Time:</span> <strong style={{ color: "var(--color-midnight)" }}>{form.tob || "—"}</strong></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex-1" style={{ color: "var(--color-midnight)", borderColor: "rgba(45, 41, 38, 0.2)" }}>
                Back
              </button>
              <button
                onClick={() => canProceed3 && onGenerate(form)}
                disabled={!canProceed3 || loading}
                className="btn-gold flex-1 flex items-center justify-center gap-2"
                style={{ opacity: canProceed3 && !loading ? 1 : 0.6 }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "var(--color-midnight)", borderTopColor: "transparent" }} />
                    Calculating...
                  </>
                ) : (
                  <>🔯 Generate Kundli</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
