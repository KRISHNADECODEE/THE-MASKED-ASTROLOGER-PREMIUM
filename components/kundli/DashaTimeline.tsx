import type { KundliResult } from "@/data/kundli";
import { VedicTerm } from "@/components/VedicTerm";

const DASHA_YEARS: Record<string, number> = {
  Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16,
  Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};

const DASHA_COLORS: Record<string, string> = {
  Sun: "#E87722", Moon: "#C9A227", Mars: "#D44E4E",
  Mercury: "#4CAF50", Jupiter: "#E8BF4D", Venus: "#E91E8C",
  Saturn: "#8B8BC8", Rahu: "#AAAAAA", Ketu: "#AAAAAA",
};

export function DashaTimeline({ kundli }: { kundli: KundliResult }) {
  const total = kundli.dashas.reduce((s, d) => s + d.years, 0);

  return (
    <div>
      <h3
        className="mb-2"
        style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)" }}
      >
        <VedicTerm term="Vimshottari">Vimshottari</VedicTerm> <VedicTerm term="Mahadasha">Dasha</VedicTerm> Timeline
      </h3>
      <p className="text-xs mb-6" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
        Planetary ruling periods that govern different phases of life.
      </p>

      {/* Timeline bar */}
      <div className="flex rounded-lg overflow-hidden mb-6 h-8" style={{ border: "1px solid rgba(209, 168, 110, 0.15)" }}>
        {kundli.dashas.map((d) => (
          <div
            key={d.planet}
            title={`${d.planet}: ${d.startDate.slice(0,4)}–${d.endDate.slice(0,4)}`}
            style={{
              width: `${(d.years / total) * 100}%`,
              background: DASHA_COLORS[d.planet] || "#888",
              opacity: d.isCurrent ? 1 : 0.35,
              position: "relative",
              cursor: "default",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = d.isCurrent ? "1" : "0.35"; }}
          />
        ))}
      </div>

      {/* Dasha cards */}
      <div className="flex flex-col gap-3">
        {kundli.dashas.map((d) => {
          const color = DASHA_COLORS[d.planet] || "#888";
          const widthPct = (d.years / total) * 100;

          return (
            <div
              key={d.planet}
              className="rounded-xl overflow-hidden"
              style={{
                border: d.isCurrent
                  ? `1.5px solid ${color}`
                  : "1px solid rgba(209, 168, 110, 0.15)",
                background: d.isCurrent ? `${color}10` : "var(--color-parchment)",
              }}
            >
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: color, opacity: d.isCurrent ? 1 : 0.4 }}
                />

                {/* Planet + period */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: d.isCurrent ? color : "var(--color-midnight)", fontFamily: "var(--font-body)" }}
                    >
                      {d.planet} <VedicTerm term="Mahadasha">Mahadasha</VedicTerm>
                    </span>
                    {d.isCurrent && (
                      <span
                        className="badge"
                        style={{
                          background: `${color}15`,
                          color,
                          border: `1px solid ${color}40`,
                          fontSize: "0.6rem",
                        }}
                      >
                        ● Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-mono)" }}>
                    {d.startDate.slice(0, 4)} — {d.endDate.slice(0, 4)} · {d.years} years
                  </p>
                </div>

                {/* Width indicator */}
                <span
                  className="text-xs font-semibold flex-shrink-0"
                  style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-mono)" }}
                >
                  {widthPct.toFixed(0)}%
                </span>
              </div>

              {/* Progress bar */}
              {d.isCurrent && (
                <div style={{ height: "3px", background: "rgba(209, 168, 110, 0.1)" }}>
                  <div
                    style={{
                      height: "100%",
                      background: color,
                      width: "42%",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <p className="mt-6 text-xs" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
        * Vimshottari Dasha system. Dasha lord changes based on Moon's nakshatra at birth.
        Each planet rules for a fixed number of years: Sun (6), Moon (10), Mars (7),
        Rahu (18), Jupiter (16), Saturn (19), Mercury (17), Ketu (7), Venus (20).
      </p>
    </div>
  );
}
