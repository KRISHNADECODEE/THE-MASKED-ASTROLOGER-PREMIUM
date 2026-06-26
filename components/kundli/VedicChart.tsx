import type { VedicChartData } from "@/data/kundli";

// Zodiac sign list for computing sign-in-house from lagna
const ZODIAC_FULL = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const ZODIAC_ABBR = ["Ar","Ta","Ge","Ca","Le","Vi","Li","Sc","Sa","Cp","Aq","Pi"];

const PLANET_CLR: Record<string, string> = {
  Sun: "#E8A020", Moon: "#7090B8", Mars: "#C84040",
  Mercury: "#2C9E50", Jupiter: "#B89000", Venus: "#C02080",
  Saturn: "#6868B8", Rahu: "#888888", Ketu: "#9B6850",
};

/*
  North Indian kundali — 300×300 SVG, 3×3 grid of 100×100 cells.

  Outer cells (full rects):
    H11 (0,0)  H1 (0,1)  H2 (0,2)
    H10 (1,0)  [center]  H4 (1,2)
     H8 (2,0)  H7 (2,1)  H5 (2,2)

  Centre cell (100–200, 100–200) split by its two diagonals into 4 triangles:
    H12 — top    : (100,100)→(200,100)→(150,150)
    H3  — right  : (200,100)→(200,200)→(150,150)
    H6  — bottom : (200,200)→(100,200)→(150,150)
    H9  — left   : (100,200)→(100,100)→(150,150)

  In the North Indian system HOUSES are fixed; SIGNS rotate.
  signInHouse(h) = (lagnaIdx + h − 1) % 12  (0-based Aries=0)
*/

type RectCell = { type: "rect"; x: number; y: number; w: number; h: number };
type PolyCell = { type: "poly"; points: string };
type HouseCell = RectCell | PolyCell;

const HOUSE_CELL: Record<number, HouseCell> = {
  1:  { type:"rect",  x:100, y:0,   w:100, h:100 },
  2:  { type:"rect",  x:200, y:0,   w:100, h:100 },
  3:  { type:"poly",  points:"200,100 200,200 150,150" },
  4:  { type:"rect",  x:200, y:100, w:100, h:100 },
  5:  { type:"rect",  x:200, y:200, w:100, h:100 },
  6:  { type:"poly",  points:"200,200 100,200 150,150" },
  7:  { type:"rect",  x:100, y:200, w:100, h:100 },
  8:  { type:"rect",  x:0,   y:200, w:100, h:100 },
  9:  { type:"poly",  points:"100,200 100,100 150,150" },
  10: { type:"rect",  x:0,   y:100, w:100, h:100 },
  11: { type:"rect",  x:0,   y:0,   w:100, h:100 },
  12: { type:"poly",  points:"100,100 200,100 150,150" },
};

// Visual centroid for each cell (content anchor point)
const HOUSE_CTR: Record<number, { x: number; y: number; tri?: boolean }> = {
  1:  { x:150, y:50  },
  2:  { x:250, y:50  },
  3:  { x:183, y:150, tri:true },
  4:  { x:250, y:150 },
  5:  { x:250, y:250 },
  6:  { x:150, y:183, tri:true },
  7:  { x:150, y:250 },
  8:  { x:50,  y:250 },
  9:  { x:117, y:150, tri:true },
  10: { x:50,  y:150 },
  11: { x:50,  y:50  },
  12: { x:150, y:117, tri:true },
};

export function VedicChart({ chart }: { chart: VedicChartData }) {
  const lagnaIdx = Math.max(0, ZODIAC_FULL.indexOf(chart.ascendant));

  const signNum  = (h: number) => ((lagnaIdx + h - 1) % 12) + 1;
  const signAbbr = (h: number) => ZODIAC_ABBR[(lagnaIdx + h - 1 + 12) % 12];

  const byHouse: Record<number, typeof chart.planets> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  chart.planets.forEach((p) => { byHouse[p.house]?.push(p); });

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
      {/* Title */}
      <div style={{ textAlign:"center" }}>
        <h4 style={{ fontFamily:"var(--font-display)", fontSize:"0.95rem", color:"var(--color-midnight)", margin:0 }}>
          {chart.title}
        </h4>
        <p style={{ fontSize:"0.68rem", color:"rgba(45,41,38,0.45)", fontFamily:"var(--font-body)", margin:"2px 0 0" }}>
          Lagna: <strong style={{ color:"var(--color-gold-dark)" }}>{chart.ascendant}</strong>
          {" · "}{chart.ascendantSymbol}
        </p>
      </div>

      {/* SVG chart */}
      <svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width:"100%", maxWidth:290, height:"auto" }}
        aria-label={`${chart.title} — North Indian Kundali chart with lagna in ${chart.ascendant}`}
      >
        {/* Parchment background */}
        <rect x="0" y="0" width="300" height="300" fill="#FBF8F2" rx="6" />

        {/* ── Grid lines ── */}
        {/* Horizontal */}
        <line x1="0" y1="100" x2="300" y2="100" stroke="#D1A86E" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="0" y1="200" x2="300" y2="200" stroke="#D1A86E" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Vertical */}
        <line x1="100" y1="0" x2="100" y2="300" stroke="#D1A86E" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#D1A86E" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Centre diagonals */}
        <line x1="100" y1="100" x2="200" y2="200" stroke="#D1A86E" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="200" y1="100" x2="100" y2="200" stroke="#D1A86E" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Outer border */}
        <rect x="0.75" y="0.75" width="298.5" height="298.5" fill="none" stroke="#D1A86E" strokeWidth="1.5" strokeOpacity="0.7" rx="5.5" />

        {/* ── Houses ── */}
        {Object.entries(HOUSE_CELL).map(([hs, cell]) => {
          const house   = parseInt(hs);
          const isLagna = house === 1;
          const ctr     = HOUSE_CTR[house];
          const isTri   = !!ctr.tri;
          const planets = byHouse[house] || [];

          // font sizes scale down for triangles
          const snSize  = isTri ? 9.5 : 12;
          const saSize  = isTri ? 7   : 8.5;
          const plSize  = isTri ? 8.5 : 10;
          const plGap   = isTri ? 12  : 13;

          // vertical layout inside cell
          const snY  = ctr.y - (planets.length ? 12 : 5);
          const saY  = snY + snSize + 1;
          const plY0 = saY + plSize + 3;

          return (
            <g key={house}>
              {/* Lagna house highlight */}
              {isLagna && cell.type === "rect" && (
                <rect
                  x={cell.x} y={cell.y} width={cell.w} height={cell.h}
                  fill="rgba(209,168,110,0.14)"
                />
              )}

              {/* House shape — invisible fill so events still work */}
              {cell.type === "rect" ? (
                <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill="none" />
              ) : (
                <polygon points={cell.points} fill="none" />
              )}

              {/* Lagna label */}
              {isLagna && (
                <text
                  x={ctr.x} y={snY - 8}
                  textAnchor="middle" fontSize="7" fontWeight="bold"
                  fill="#D1A86E" fontFamily="monospace"
                >
                  Lagna
                </text>
              )}

              {/* Sign number */}
              <text
                x={ctr.x} y={snY}
                textAnchor="middle" fontSize={snSize} fontWeight="bold"
                fill="rgba(45,41,38,0.72)" fontFamily="monospace"
              >
                {signNum(house)}
              </text>

              {/* Sign abbreviation */}
              <text
                x={ctr.x} y={saY}
                textAnchor="middle" fontSize={saSize}
                fill="rgba(45,41,38,0.38)" fontFamily="monospace"
              >
                {signAbbr(house)}
              </text>

              {/* Planets */}
              {planets.map((p, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const px  = ctr.x + (col === 0 ? -12 : 12);
                const py  = plY0 + row * plGap;
                return (
                  <text
                    key={p.name}
                    x={px} y={py}
                    textAnchor="middle" fontSize={plSize} fontWeight="bold"
                    fill={PLANET_CLR[p.name] || "#888"}
                    fontFamily="sans-serif"
                  >
                    {p.symbol || p.name.slice(0, 2)}
                    {p.isRetrograde ? "ᴿ" : ""}
                  </text>
                );
              })}
            </g>
          );
        })}

        {/* Centre dot */}
        <circle cx="150" cy="150" r="4" fill="#D1A86E" opacity="0.22" />
        <circle cx="150" cy="150" r="1.5" fill="#D1A86E" opacity="0.55" />
      </svg>

      {/* Planet legend */}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px 10px" }}>
        {chart.planets.map((p) => (
          <span
            key={p.name}
            style={{ fontSize:"0.6rem", fontFamily:"var(--font-body)", color:"rgba(45,41,38,0.5)", display:"flex", alignItems:"center", gap:"3px" }}
          >
            <span style={{ color: PLANET_CLR[p.name] || "#888", fontWeight:700, fontSize:"0.65rem" }}>
              {p.symbol}
            </span>
            {p.name}
            {p.isRetrograde ? " (R)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
