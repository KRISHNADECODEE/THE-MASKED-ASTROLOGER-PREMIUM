import type { VedicChartData } from "@/data/kundli";

const HOUSE_POSITIONS: Record<number, { type: "rect"; x: number; y: number; w: number; h: number } | { type: "poly"; points: string }> = {
  1: { type: "rect", x: 100, y: 0, w: 100, h: 100 },
  2: { type: "rect", x: 200, y: 0, w: 100, h: 100 },
  3: { type: "poly", points: "200,100 200,200 150,150" },
  4: { type: "rect", x: 200, y: 100, w: 100, h: 100 },
  5: { type: "rect", x: 200, y: 200, w: 100, h: 100 },
  6: { type: "poly", points: "100,200 200,200 150,150" },
  7: { type: "rect", x: 100, y: 200, w: 100, h: 100 },
  8: { type: "rect", x: 0, y: 200, w: 100, h: 100 },
  9: { type: "poly", points: "100,100 100,200 150,150" },
  10: { type: "rect", x: 0, y: 100, w: 100, h: 100 },
  11: { type: "rect", x: 0, y: 0, w: 100, h: 100 },
  12: { type: "poly", points: "100,100 200,100 150,150" },
};

const LBL: Record<number, { x: number; y: number }> = {
  1: { x: 150, y: 40 }, 2: { x: 250, y: 50 }, 3: { x: 215, y: 150 }, 4: { x: 250, y: 200 },
  5: { x: 250, y: 250 }, 6: { x: 150, y: 215 }, 7: { x: 150, y: 260 }, 8: { x: 50, y: 250 },
  9: { x: 87, y: 150 }, 10: { x: 50, y: 150 }, 11: { x: 50, y: 50 }, 12: { x: 150, y: 86 },
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "#E87722", Moon: "#C9A227", Mars: "#D44E4E", Mercury: "#4CAF50",
  Jupiter: "#E8BF4D", Venus: "#E91E8C", Saturn: "#8B8BC8", Rahu: "#9C8BC8", Ketu: "#A88B7A",
};
// Short planet tokens that render reliably (astro glyphs are inconsistent in SVG text).
const SHORT: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
  Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
};

export function VedicChart({ chart }: { chart: VedicChartData }) {
  const byHouse: Record<number, VedicChartData["planets"]> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  chart.planets.forEach((p) => byHouse[p.house]?.push(p));

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-midnight)" }}>{chart.title}</h4>
      <p className="text-[11px] mb-3" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
        Asc: <strong style={{ color: "var(--color-gold-dark)" }}>{chart.ascendant}</strong>
      </p>
      <div style={{ maxWidth: 260, width: "100%" }}>
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
          <rect x="0" y="0" width="300" height="300" fill="var(--color-ivory)" rx="4" />
          {Object.entries(HOUSE_POSITIONS).map(([hs, pos]) => {
            const house = parseInt(hs);
            const isAsc = house === 1;
            const lp = LBL[house];
            return (
              <g key={house}>
                {pos.type === "rect" ? (
                  <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} fill={isAsc ? "rgba(209,168,110,0.1)" : "transparent"} stroke="var(--color-gold)" strokeWidth="0.8" strokeOpacity="0.55" />
                ) : (
                  <polygon points={pos.points} fill="transparent" stroke="var(--color-gold)" strokeWidth="0.8" strokeOpacity="0.55" />
                )}
                <text x={lp.x} y={lp.y - 13} textAnchor="middle" fontSize="6.5" fill="rgba(45,41,38,0.35)" fontFamily="monospace">{house}</text>
                {byHouse[house].map((p, i) => {
                  const col = i % 2, row = Math.floor(i / 2);
                  return (
                    <text key={p.name} x={lp.x + (col === 0 ? -11 : 11)} y={lp.y + 2 + row * 13} textAnchor="middle" fontSize="10" fontWeight="bold" fill={PLANET_COLORS[p.name] || "var(--color-gold)"} fontFamily="var(--font-body), sans-serif">
                      {SHORT[p.name] || p.name.slice(0, 2)}{p.isRetrograde ? "ᴿ" : ""}
                    </text>
                  );
                })}
              </g>
            );
          })}
          <circle cx="150" cy="150" r="7" fill="var(--color-gold)" opacity="0.18" />
        </svg>
      </div>
    </div>
  );
}
