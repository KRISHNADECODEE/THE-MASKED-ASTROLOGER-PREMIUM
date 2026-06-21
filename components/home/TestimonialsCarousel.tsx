"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/data/content";

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const visible = [
    testimonials[(current) % total],
    testimonials[(current + 1) % total],
    testimonials[(current + 2) % total],
  ];

  return (
    <div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {visible.map((t, i) => (
          <div
            key={t.id}
            className="card p-6 flex flex-col gap-4"
            style={{
              background: "var(--color-ivory)",
              opacity: i === 0 ? 1 : 0.75,
              transform: i === 0 ? "scale(1)" : "scale(0.97)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star
                  key={si}
                  size={14}
                  fill={si < t.rating ? "var(--color-gold)" : "transparent"}
                  color={si < t.rating ? "var(--color-gold)" : "rgba(209,168,110,0.25)"}
                />
              ))}
            </div>

            {/* Text */}
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ color: "rgba(45,41,38,0.7)", fontFamily: "var(--font-body)", fontStyle: "italic" }}
            >
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(209,168,110,0.15)" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--color-midnight), var(--color-midnight-800))",
                  color: "var(--color-gold)",
                }}
              >
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
                  {t.location} · {t.service}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ border: "1.5px solid rgba(209,168,110,0.4)", color: "var(--color-gold)" }}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                background: i === current ? "var(--color-gold)" : "rgba(209,168,110,0.25)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ border: "1.5px solid rgba(209,168,110,0.4)", color: "var(--color-gold)" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
