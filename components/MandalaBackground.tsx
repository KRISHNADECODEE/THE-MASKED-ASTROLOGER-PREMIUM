"use client";

export function MandalaBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Outer spinning ring */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(140vw, 1000px)",
          height: "min(140vw, 1000px)",
        }}
      >
        <svg
          className="mandala-spin opacity-[0.07] w-full h-full"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric circles */}
          <circle cx="400" cy="400" r="390" stroke="var(--color-gold)" strokeWidth="1" />
          <circle cx="400" cy="400" r="360" stroke="var(--color-gold)" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="300" stroke="var(--color-gold)" strokeWidth="1" />
          <circle cx="400" cy="400" r="240" stroke="var(--color-gold)" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="180" stroke="var(--color-gold)" strokeWidth="1" />
          <circle cx="400" cy="400" r="120" stroke="var(--color-gold)" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="60"  stroke="var(--color-gold)" strokeWidth="1" />

          {/* 12 sector lines (30° each) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 400 + 60  * Math.cos(angle);
            const y1 = 400 + 60  * Math.sin(angle);
            const x2 = 400 + 390 * Math.cos(angle);
            const y2 = 400 + 390 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--color-gold)" strokeWidth="0.6" />
            );
          })}

          {/* 12 zodiac symbols on the outer ring (r=375) */}
          {["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"].map((sym, i) => {
            const angle = (i * 30 - 75) * (Math.PI / 180);
            const x = 400 + 375 * Math.cos(angle);
            const y = 400 + 375 * Math.sin(angle);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                fontSize="18" fill="var(--color-gold)" opacity="0.8">
                {sym}
              </text>
            );
          })}

          {/* Star of David / hexagram in center */}
          <polygon
            points="400,260 460,360 540,360 500,440 460,540 400,480 340,540 300,440 260,360 340,360"
            stroke="var(--color-gold)" strokeWidth="0.6" fill="none" opacity="0.5"
          />

          {/* 8-pointed star */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a1 = (i * 45 * Math.PI) / 180;
            const a2 = ((i * 45 + 22.5) * Math.PI) / 180;
            const x1 = 400 + 180 * Math.cos(a1);
            const y1 = 400 + 180 * Math.sin(a1);
            const x2 = 400 + 120 * Math.cos(a2);
            const y2 = 400 + 120 * Math.sin(a2);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.6" />;
          })}

          {/* Planetary dots at 240r */}
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i * 40 * Math.PI) / 180;
            const x = 400 + 240 * Math.cos(angle);
            const y = 400 + 240 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="4" fill="var(--color-gold)" opacity="0.5" />;
          })}

          {/* Central lotus petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const cx = 400 + 40 * Math.cos(angle);
            const cy = 400 + 40 * Math.sin(angle);
            return <ellipse key={i} cx={cx} cy={cy} rx="12" ry="22"
              transform={`rotate(${i * 45}, ${cx}, ${cy})`}
              fill="var(--color-gold)" opacity="0.3" />;
          })}

          {/* Center dot */}
          <circle cx="400" cy="400" r="8" fill="var(--color-gold)" opacity="0.5" />
        </svg>
      </div>

      {/* Counter-rotating inner ring */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(60vw, 400px)",
          height: "min(60vw, 400px)",
        }}
      >
        <svg
          className="mandala-counter opacity-[0.06] w-full h-full"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="190" stroke="var(--color-gold-light)" strokeWidth="1.5" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i * 60 * Math.PI) / 180;
            return (
              <line key={i}
                x1={200 + 10 * Math.cos(a)} y1={200 + 10 * Math.sin(a)}
                x2={200 + 190 * Math.cos(a)} y2={200 + 190 * Math.sin(a)}
                stroke="var(--color-gold-light)" strokeWidth="0.8" />
            );
          })}
          <polygon
            points="200,80 280,180 200,280 120,180"
            stroke="var(--color-gold-light)" strokeWidth="1" fill="none" />
          <polygon
            points="200,120 260,200 200,240 140,200"
            stroke="var(--color-gold-light)" strokeWidth="0.5" fill="none" opacity="0.7" />
        </svg>
      </div>

      {/* Floating star particles */}
      {[
        { x: "15%",  y: "20%", delay: "0s",   dur: "3s"   },
        { x: "85%",  y: "15%", delay: "1s",   dur: "4s"   },
        { x: "72%",  y: "75%", delay: "0.5s", dur: "3.5s" },
        { x: "25%",  y: "80%", delay: "2s",   dur: "5s"   },
        { x: "60%",  y: "10%", delay: "1.5s", dur: "4.5s" },
        { x: "8%",   y: "55%", delay: "3s",   dur: "3s"   },
        { x: "92%",  y: "45%", delay: "0.8s", dur: "6s"   },
        { x: "45%",  y: "88%", delay: "2.5s", dur: "4s"   },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute twinkle text-gold-light"
          style={{
            left: star.x,
            top: star.y,
            animationDelay: star.delay,
            animationDuration: star.dur,
            fontSize: i % 3 === 0 ? "10px" : "7px",
            color: "var(--color-gold-light)",
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
