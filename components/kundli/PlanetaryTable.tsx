import type { KundliResult } from "@/data/kundli";

export function PlanetaryTable({ kundli }: { kundli: KundliResult }) {
  return (
    <div>
      <h3
        className="mb-4"
        style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)" }}
      >
        Planetary Positions
      </h3>

      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(209, 168, 110, 0.25)" }}>
        <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-midnight)" }}>
              {["Planet", "Sign", "House", "Degree", "Nakshatra", "Pada", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-gold)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kundli.planets.map((p, i) => (
              <tr
                key={p.name}
                style={{
                  background: i % 2 === 0 ? "var(--color-ivory)" : "rgba(209, 168, 110, 0.05)",
                  borderBottom: "1px solid rgba(209, 168, 110, 0.08)",
                }}
              >
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-midnight)" }}>
                  <span className="mr-2">{p.symbol}</span>
                  {p.name}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--color-midnight)" }}>
                  {p.signSymbol} {p.sign}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--color-gold)", fontWeight: 700 }}>
                  H{p.house}
                </td>
                <td className="px-4 py-3" style={{ color: "rgba(45, 41, 38, 0.7)" }}>
                  {p.degree.toFixed(2)}°
                </td>
                <td className="px-4 py-3" style={{ color: "rgba(45, 41, 38, 0.7)" }}>
                  {p.nakshatra}
                </td>
                <td className="px-4 py-3 text-center" style={{ color: "rgba(45, 41, 38, 0.6)" }}>
                  {p.nakshatraPada}
                </td>
                <td className="px-4 py-3">
                  {p.isRetrograde ? (
                    <span
                      className="badge badge-maroon"
                      style={{ fontSize: "0.6rem" }}
                    >
                      Retrograde (R)
                    </span>
                  ) : (
                    <span
                      className="badge badge-gold"
                      style={{ fontSize: "0.6rem" }}
                    >
                      Direct
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ascendant row */}
      <div
        className="mt-3 flex items-center gap-4 px-4 py-3 rounded-xl"
        style={{ background: "rgba(209, 168, 110, 0.08)", border: "1px solid rgba(209, 168, 110, 0.2)" }}
      >
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)", fontWeight: 700 }}>
          {kundli.ascendantSymbol} Ascendant (Lagna)
        </span>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-midnight)" }}>
          {kundli.ascendant} — {kundli.ascendantDegree.toFixed(2)}°
        </span>
        <span className="ml-auto text-xs" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-mono)" }}>
          1st House
        </span>
      </div>
    </div>
  );
}
