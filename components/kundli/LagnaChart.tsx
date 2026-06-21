import type { KundliResult } from "@/data/kundli";

interface Props {
  kundli: KundliResult;
}

/* North Indian chart layout:
   Grid positions (row, col):
   Corners:  H2=(0,2) H5=(2,2) H8=(2,0) H11=(0,0)
   Edges:    H1=(0,1) H4=(1,2) H7=(2,1) H10=(1,0)
   Center triangles (inside middle cell, 100,100 -> 200,200):
     top=H12  right=H3  bottom=H6  left=H9
*/

const HOUSE_POSITIONS: Record<number, { type: "rect"; x: number; y: number; w: number; h: number } | { type: "poly"; points: string }> = {
  1:  { type: "rect",  x: 100, y: 0,   w: 100, h: 100 },
  2:  { type: "rect",  x: 200, y: 0,   w: 100, h: 100 },
  3:  { type: "poly",  points: "200,100 200,200 150,150" },
  4:  { type: "rect",  x: 200, y: 100, w: 100, h: 100 },
  5:  { type: "rect",  x: 200, y: 200, w: 100, h: 100 },
  6:  { type: "poly",  points: "100,200 200,200 150,150" },
  7:  { type: "rect",  x: 100, y: 200, w: 100, h: 100 },
  8:  { type: "rect",  x: 0,   y: 200, w: 100, h: 100 },
  9:  { type: "poly",  points: "100,100 100,200 150,150" },
  10: { type: "rect",  x: 0,   y: 100, w: 100, h: 100 },
  11: { type: "rect",  x: 0,   y: 0,   w: 100, h: 100 },
  12: { type: "poly",  points: "100,100 200,100 150,150" },
};

const HOUSE_LABEL_POS: Record<number, { x: number; y: number }> = {
  1:  { x: 150, y: 40  },
  2:  { x: 250, y: 50  },
  3:  { x: 215, y: 150 },
  4:  { x: 250, y: 200 },
  5:  { x: 250, y: 250 },
  6:  { x: 150, y: 215 },
  7:  { x: 150, y: 260 },
  8:  { x: 50,  y: 250 },
  9:  { x: 87,  y: 150 },
  10: { x: 50,  y: 150 },
  11: { x: 50,  y: 50  },
  12: { x: 150, y: 86  },
};

const PLANET_COLORS: Record<string, string> = {
  Sun:     "#E87722",
  Moon:    "#C9A227",
  Mars:    "#D44E4E",
  Mercury: "#4CAF50",
  Jupiter: "#E8BF4D",
  Venus:   "#E91E8C",
  Saturn:  "#8B8BC8",
  Rahu:    "#AAAAAA",
  Ketu:    "#AAAAAA",
};

export function LagnaChart({ kundli }: Props) {
  // Group planets by house
  const planetsByHouse: Record<number, { symbol: string; name: string; isRetrograde: boolean }[]> = {};
  for (let h = 1; h <= 12; h++) planetsByHouse[h] = [];
  kundli.planets.forEach((p) => {
    planetsByHouse[p.house]?.push({ symbol: p.symbol, name: p.name, isRetrograde: p.isRetrograde });
  });

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)" }}>
          Lagna Chart (D1)
        </h3>
        <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
          Ascendant: <span style={{ color: "var(--color-gold-dark)", fontWeight: 700 }}>{kundli.ascendantSymbol} {kundli.ascendant} ({kundli.ascendantDegree.toFixed(2)}°)</span>
        </p>
      </div>

      {/* Chart SVG */}
      <div style={{ maxWidth: 320, width: "100%" }}>
        <svg
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto" }}
        >
          {/* Background */}
          <rect x="0" y="0" width="300" height="300" fill="var(--color-ivory)" rx="4" />

          {/* Render each house */}
          {Object.entries(HOUSE_POSITIONS).map(([houseStr, pos]) => {
            const house = parseInt(houseStr);
            const planets = planetsByHouse[house];
            const isAsc = house === 1;
            const labelPos = HOUSE_LABEL_POS[house];

            return (
              <g key={house}>
                {/* House shape */}
                {pos.type === "rect" ? (
                  <rect
                    x={pos.x} y={pos.y} width={pos.w} height={pos.h}
                    fill={isAsc ? "rgba(209,168,110,0.08)" : "transparent"}
                    stroke="var(--color-gold)"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                ) : (
                  <polygon
                    points={pos.points}
                    fill="transparent"
                    stroke="var(--color-gold)"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                )}

                {/* House number */}
                <text
                  x={labelPos.x}
                  y={labelPos.y - 12}
                  textAnchor="middle"
                  fontSize="7"
                  fill="rgba(45, 41, 38, 0.4)"
                  fontFamily="monospace"
                >
                  H{house}
                </text>

                {/* Ascendant label */}
                {isAsc && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 2}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--color-gold-dark)"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {kundli.ascendantSymbol}
                  </text>
                )}

                {/* Planet symbols */}
                {planets.map((p, i) => {
                  const col = i % 2;
                  const row = Math.floor(i / 2);
                  const px = labelPos.x + (col === 0 ? -12 : 12);
                  const py = labelPos.y + 14 + row * 14;
                  return (
                    <g key={p.name}>
                      <text
                        x={px}
                        y={py}
                        textAnchor="middle"
                        fontSize="12"
                        fill={PLANET_COLORS[p.name] || "var(--color-gold)"}
                        fontFamily="monospace"
                      >
                        {p.symbol}
                        {p.isRetrograde ? "ᴿ" : ""}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Center decoration */}
          <circle cx="150" cy="150" r="8" fill="var(--color-gold)" opacity="0.2" />
          <circle cx="150" cy="150" r="3" fill="var(--color-gold)" opacity="0.5" />
        </svg>
      </div>

      {/* Planet color legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {kundli.planets.map((p) => (
          <div key={p.name} className="flex items-center gap-1.5">
            <span style={{ color: PLANET_COLORS[p.name], fontSize: "1rem", lineHeight: 1 }}>{p.symbol}</span>
            <span className="text-xs" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
              {p.name}{p.isRetrograde ? " (R)" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
