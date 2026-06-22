"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Heart, Briefcase, Activity, Sparkles, ChevronRight } from "lucide-react";
import { getDailyHoroscope } from "@/data/horoscope";
import { getRashi } from "@/data/rashi";

function Rating({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} style={{ color: "var(--color-gold)" }} />
      <span className="text-xs w-14" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)" }}>{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="w-4 h-1.5 rounded-full" style={{ background: i < value ? "var(--color-gold)" : "rgba(209,168,110,0.2)" }} />
        ))}
      </div>
    </div>
  );
}

export function HoroscopeModal({ sign, onClose }: { sign: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!sign) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sign, onClose]);

  if (!sign) return null;

  const horo = getDailyHoroscope(sign);
  const rashi = getRashi(sign);
  const name = rashi ? rashi.sanskrit : sign.charAt(0).toUpperCase() + sign.slice(1);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(15,10,30,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} daily horoscope`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--color-parchment)", border: "1px solid rgba(209,168,110,0.3)" }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-black/10"
          style={{ background: "rgba(244,239,230,0.85)", color: "var(--color-midnight)" }}
        >
          <X size={18} />
        </button>

        {/* Header with relief image */}
        <div className="relative h-44">
          <img src={`/zodiacs/${sign}.jpeg`} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-end p-5" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.9) 0%, rgba(15,10,30,0.1) 70%)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", color: "var(--color-parchment)" }}>{name}</h2>
            <p className="text-xs" style={{ color: "rgba(250,245,237,0.7)", fontFamily: "var(--font-body)" }}>
              {rashi ? `${rashi.western} · Swami ${rashi.lord} · ` : ""}{horo.date}
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Quick facts */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: "Mood", v: horo.mood },
              { k: "Lucky Color", v: horo.luckyColor },
              { k: "Lucky No.", v: String(horo.luckyNumber) },
            ].map(({ k, v }) => (
              <div key={k} className="rounded-xl p-2.5" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(45,41,38,0.45)" }}>{k}</p>
                <p className="text-xs font-bold" style={{ color: "var(--color-gold-dark)", fontFamily: "var(--font-body)" }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Reading */}
          <p className="text-sm leading-relaxed" style={{ color: "rgba(45,41,38,0.8)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>{horo.text}</p>

          {/* Ratings */}
          <div className="flex flex-col gap-2.5 pt-4" style={{ borderTop: "1px solid rgba(209,168,110,0.15)" }}>
            <Rating icon={Heart} label="Love" value={horo.love} />
            <Rating icon={Briefcase} label="Career" value={horo.career} />
            <Rating icon={Activity} label="Health" value={horo.health} />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Link href="/horoscope" className="btn-gold text-xs px-4 py-2.5 flex-1 text-center flex items-center justify-center gap-1">
              <Sparkles size={13} /> All Signs
            </Link>
            <Link href="/kundli" className="text-xs px-4 py-2.5 flex-1 text-center rounded-lg flex items-center justify-center gap-1" style={{ border: "1.5px solid var(--color-midnight)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
              Free Kundli <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
