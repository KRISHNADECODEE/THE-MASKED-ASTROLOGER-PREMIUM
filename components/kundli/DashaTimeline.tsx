"use client";

import { useState } from "react";
import type { KundliResult } from "@/data/kundli";
import { VedicTerm } from "@/components/VedicTerm";
import { ChevronDown } from "lucide-react";

const DASHA_SEQ: { planet: string; years: number }[] = [
  { planet: "Ketu",    years: 7  },
  { planet: "Venus",   years: 20 },
  { planet: "Sun",     years: 6  },
  { planet: "Moon",    years: 10 },
  { planet: "Mars",    years: 7  },
  { planet: "Rahu",    years: 18 },
  { planet: "Jupiter", years: 16 },
  { planet: "Saturn",  years: 19 },
  { planet: "Mercury", years: 17 },
];

const DASHA_COLORS: Record<string, string> = {
  Sun: "#E87722", Moon: "#C9A227", Mars: "#D44E4E",
  Mercury: "#4CAF50", Jupiter: "#E8BF4D", Venus: "#E91E8C",
  Saturn: "#8B8BC8", Rahu: "#AAAAAA", Ketu: "#C8955A",
};

function addYearsFrac(dateStr: string, years: number): string {
  const d = new Date(dateStr);
  const ms = years * 365.25 * 24 * 60 * 60 * 1000;
  return new Date(d.getTime() + ms).toISOString().slice(0, 10);
}

interface Antardasha {
  planet: string;
  startDate: string;
  endDate: string;
  months: number;
  isCurrent: boolean;
}

function computeAntardasha(mahaStart: string, mahaPlanet: string, mahaYears: number): Antardasha[] {
  const startIdx = DASHA_SEQ.findIndex((d) => d.planet === mahaPlanet);
  if (startIdx === -1) return [];
  const today = new Date();
  const result: Antardasha[] = [];
  let cursor = mahaStart;

  for (let i = 0; i < 9; i++) {
    const { planet, years } = DASHA_SEQ[(startIdx + i) % 9];
    const duration = (years * mahaYears) / 120; // in years
    const end = addYearsFrac(cursor, duration);
    const start = new Date(cursor);
    const endDate = new Date(end);
    result.push({
      planet,
      startDate: cursor,
      endDate: end,
      months: Math.round(duration * 12),
      isCurrent: today >= start && today < endDate,
    });
    cursor = end;
  }
  return result;
}

export function DashaTimeline({ kundli }: { kundli: KundliResult }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const total = kundli.dashas.reduce((s, d) => s + d.years, 0);

  return (
    <div>
      <h3 className="mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)" }}>
        <VedicTerm term="Vimshottari">Vimshottari</VedicTerm>{" "}
        <VedicTerm term="Mahadasha">Dasha</VedicTerm> Timeline
      </h3>
      <p className="text-xs mb-6" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
        Tap any dasha period to expand its Antardasha (sub-periods).
      </p>

      {/* Timeline bar */}
      <div className="flex rounded-lg overflow-hidden mb-6 h-8" style={{ border: "1px solid rgba(209,168,110,0.15)" }}>
        {kundli.dashas.map((d) => (
          <div
            key={d.planet}
            title={`${d.planet}: ${d.startDate.slice(0, 4)}–${d.endDate.slice(0, 4)}`}
            onClick={() => setExpanded(expanded === d.planet ? null : d.planet)}
            style={{
              width: `${(d.years / total) * 100}%`,
              background: DASHA_COLORS[d.planet] || "#888",
              opacity: d.isCurrent ? 1 : 0.35,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = d.isCurrent ? "1" : "0.35"; }}
          />
        ))}
      </div>

      {/* Dasha cards */}
      <div className="flex flex-col gap-2">
        {kundli.dashas.map((d) => {
          const color = DASHA_COLORS[d.planet] || "#888";
          const isOpen = expanded === d.planet;
          const antardashas = isOpen ? computeAntardasha(d.startDate, d.planet, d.years) : [];

          return (
            <div
              key={d.planet}
              className="rounded-xl overflow-hidden"
              style={{
                border: d.isCurrent ? `1.5px solid ${color}` : "1px solid rgba(209,168,110,0.15)",
                background: d.isCurrent ? `${color}10` : "var(--color-parchment)",
              }}
            >
              {/* Header row — clickable */}
              <button
                onClick={() => setExpanded(isOpen ? null : d.planet)}
                className="w-full flex items-center gap-4 px-4 py-3 text-left"
                style={{ background: "transparent" }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color, opacity: d.isCurrent ? 1 : 0.4 }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: d.isCurrent ? color : "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                      {d.planet} <VedicTerm term="Mahadasha">Mahadasha</VedicTerm>
                    </span>
                    {d.isCurrent && (
                      <span className="badge" style={{ background: `${color}15`, color, border: `1px solid ${color}40`, fontSize: "0.6rem" }}>
                        ● Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-mono)" }}>
                    {d.startDate.slice(0, 4)} — {d.endDate.slice(0, 4)} · {d.years} yrs
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  style={{
                    color: "rgba(45,41,38,0.4)",
                    flexShrink: 0,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>

              {/* Active progress bar */}
              {d.isCurrent && (
                <div style={{ height: "3px", background: "rgba(209,168,110,0.1)" }}>
                  <div style={{ height: "100%", background: color, width: "42%", borderRadius: "0 2px 2px 0" }} />
                </div>
              )}

              {/* Antardasha expand */}
              {isOpen && (
                <div className="border-t" style={{ borderColor: "rgba(209,168,110,0.15)" }}>
                  <p className="text-[10px] uppercase tracking-widest px-4 pt-3 pb-1.5 font-bold" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                    Antardasha (Sub-periods)
                  </p>
                  <div className="flex flex-col">
                    {antardashas.map((ad, i) => {
                      const adColor = DASHA_COLORS[ad.planet] || "#888";
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-2"
                          style={{
                            background: ad.isCurrent ? `${adColor}12` : "transparent",
                            borderLeft: ad.isCurrent ? `3px solid ${adColor}` : "3px solid transparent",
                          }}
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: adColor }} />
                          <span className="text-xs font-semibold w-20 flex-shrink-0" style={{ color: ad.isCurrent ? adColor : "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                            {d.planet.slice(0, 2)}–{ad.planet.slice(0, 2)}
                          </span>
                          <span className="text-xs flex-1" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>
                            {ad.planet}
                          </span>
                          <span className="text-[10px] flex-shrink-0" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-mono)" }}>
                            {ad.startDate.slice(0, 7)} – {ad.endDate.slice(0, 7)}
                          </span>
                          <span className="text-[10px] flex-shrink-0 w-12 text-right" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-mono)" }}>
                            {ad.months}m
                          </span>
                          {ad.isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${adColor}20`, color: adColor }}>
                              NOW
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-body)" }}>
        * Vimshottari Dasha system. Dasha lord changes based on Moon's nakshatra at birth.
        Total cycle = 120 years: Sun (6), Moon (10), Mars (7), Rahu (18), Jupiter (16), Saturn (19), Mercury (17), Ketu (7), Venus (20).
      </p>
    </div>
  );
}
