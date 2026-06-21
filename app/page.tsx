"use client";

import Link from "next/link";
import { Star, ArrowRight, Zap } from "lucide-react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { FEATURED_PRODUCTS } from "@/data/products";
import { TESTIMONIALS, BLOG_POSTS } from "@/data/content";
import { ProductCard } from "@/components/store/ProductCard";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { WaitlistForm } from "@/components/home/WaitlistForm";

const MODULES = [
  { href: "/kundli",       title: "Kundli Generator",        emoji: "🔯", desc: "Free birth chart with planetary positions, dashas & predictions",            badge: "Free",    color: "#C9A227" },
  { href: "/kundli/pdf",   title: "Kundli PDF Report",       emoji: "📄", desc: "Downloadable branded kundli report — free basic, paid detailed version",    badge: "New",     color: "#E87722" },
  { href: "/ai-chat",      title: "AI Astrologer",           emoji: "🤖", desc: "Personalized AI trained on 1,00,000+ charts — coming soon to early birds",  badge: "Soon",    color: "#7C5CBF" },
  { href: "/consultation", title: "1:1 Consultation",        emoji: "🎙️", desc: "Book a live or voice-note session with our expert astrologer",               badge: null,      color: "#C9A227" },
  { href: "/courses",      title: "Astrology Courses",       emoji: "📚", desc: "Learn Vedic astrology from beginner to advanced level — video + PDF",       badge: null,      color: "#E87722" },
  { href: "/store",        title: "Gemstones & Remedies",    emoji: "💎", desc: "Shop certified gemstones, yantras, books, and pooja items",                  badge: null,      color: "#C9A227" },
  { href: "/blog",         title: "Astrology Blog",          emoji: "✍️", desc: "Deep-dive articles on transits, yogas, doshas, and chart reading",           badge: null,      color: "#E87722" },
  { href: "/donate",       title: "Street Dog Donation",     emoji: "🐾", desc: "Item-based transparent donation to street dogs — with photo proof",          badge: "❤️",      color: "#6B1F2A" },
];

const STATS = [
  { value: "52,000+", label: "Kundlis Generated" },
  { value: "1,800+",  label: "Consultations Done" },
  { value: "3,200+",  label: "Students Enrolled" },
  { value: "4.9 ★",   label: "Average Rating" },
];

const AI_FEATURES = [
  "Trained on 1,00,000+ modern charts",
  "Based on knowledge of top 50 astrologers of India",
  "Covers courses, research, and personal analysis",
  "Future: answers using your own saved kundli",
];

const PROMPT_CHIPS = [
  "What does my Saturn return mean?",
  "When will I get married?",
  "Is this a good time to start a business?",
  "What career suits my chart?",
  "How to reduce Sade Sati effects?",
];

const ZODIACS_LIST = [
  { id: "aries",       symbol: "♈", traits: "Courage · Leadership · Passion" },
  { id: "taurus",      symbol: "♉", traits: "Strength · Stability · Determination" },
  { id: "gemini",      symbol: "♊", traits: "Intelligence · Adaptability · Communication" },
  { id: "cancer",      symbol: "♋", traits: "Intuition · Protection · Emotional Depth" },
  { id: "leo",         symbol: "♌", traits: "Confidence · Creativity · Generosity" },
  { id: "virgo",       symbol: "♍", traits: "Analytical · Practical · Dedicated" },
  { id: "libra",       symbol: "♎", traits: "Balance · Harmony · Diplomacy" },
  { id: "scorpio",     symbol: "♏", traits: "Passion · Mystery · Transformation" },
  { id: "sagittarius", symbol: "♐", traits: "Adventure · Wisdom · Freedom" },
  { id: "capricorn",   symbol: "♑", traits: "Ambition · Discipline · Resilience" },
  { id: "aquarius",    symbol: "♒", traits: "Innovation · Humanity · Individuality" },
  { id: "pisces",      symbol: "♓", traits: "Compassion · Intuition · Spirituality" },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--color-parchment)" }}>
      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--color-cream) 0%, var(--color-parchment) 100%)",
        }}
      >
        <MandalaBackground />

        <div className="container-xl relative z-10 text-center py-20">
          
          {/* Brand Logo Illustration */}
          <div className="flex justify-center mb-6">
            <img
              src="/brand/logo.png"
              alt="The Masked Astrologer Brand Relief"
              className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover shadow-2xl border-4"
              style={{
                borderColor: "var(--color-gold)",
                boxShadow: "0 10px 45px rgba(209,168,110,0.35)"
              }}
            />
          </div>

          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(201,162,39,0.12)",
              border: "1px solid rgba(201,162,39,0.25)",
              color: "var(--color-gold-dark)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse inline-block" style={{ background: "var(--color-gold)" }} />
            Ancient Wisdom · Modern Science · Digital Delivery
          </div>

          {/* Headline */}
          <h1
            className="mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
              lineHeight: 1.05,
              color: "var(--color-midnight)",
              textShadow: "0 2px 20px rgba(209,168,110,0.15)",
            }}
          >
            Born Under the Stars.
            <br />
            <span style={{ color: "var(--color-gold)" }}>Decoded by the Cosmos.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-2xl mx-auto mb-10 text-lg"
            style={{
              color: "rgba(45,41,38,0.75)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.7,
            }}
          >
            India&apos;s most modern Vedic astrology platform. Generate your free kundli,
            get personalized expert consultations, shop authentic remedies, and
            understand your unique cosmic blueprint.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/kundli" className="btn-gold glow-pulse text-base px-8 py-4">
              🔯 Generate Free Kundli
            </Link>
            <Link
              href="/consultation"
              className="btn-outline text-base px-8 py-4"
              style={{
                borderColor: "rgba(45,41,38,0.4)",
                color: "var(--color-midnight)",
              }}
            >
              🎙️ Book Consultation
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex -space-x-2">
              {["PS", "AM", "KN", "RG", "SR"].map((initials) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-[#FAF5ED]"
                  style={{
                    background: "linear-gradient(135deg, var(--color-ivory), var(--color-parchment))",
                    color: "var(--color-gold-dark)",
                    border: "1px solid rgba(209,168,110,0.25)",
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>52,000+</span> people already discovered their chart
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill="var(--color-gold)" color="var(--color-gold)" />
              ))}
              <span className="text-sm ml-1" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)" }}>
                4.9 (1,800+ reviews)
              </span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 float-anim">
            <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-body)" }}>
              Scroll
            </span>
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(45,41,38,0.25), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--color-ivory)",
          borderTop: "1px solid rgba(209,168,110,0.18)",
          borderBottom: "1px solid rgba(209,168,110,0.18)",
        }}
      >
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(209,168,110,0.15)]">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-10 px-4 text-center" style={{ borderColor: "rgba(209,168,110,0.15)" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    color: "var(--color-gold)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {value}
                </span>
                <span className="text-sm uppercase tracking-widest" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)", fontSize: "0.7rem" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MODULES GRID
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "var(--color-parchment)" }}>
        <div className="container-xl">
          <div className="text-center mb-16">
            <p className="section-eyebrow mb-3">Everything you need</p>
            <h2 className="section-title">One Platform. Every Cosmic Need.</h2>
            <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
              From kundli to consultation, courses to commerce — The Masked Astrologer
              brings the entire Vedic astrology universe under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MODULES.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="card group p-6 flex flex-col gap-3"
                style={{ background: "var(--color-ivory)", textDecoration: "none" }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{mod.emoji}</span>
                  {mod.badge && (
                    <span
                      className="badge"
                      style={{
                        background: `${mod.color}15`,
                        color: mod.color,
                        border: `1px solid ${mod.color}35`,
                      }}
                    >
                      {mod.badge}
                    </span>
                  )}
                </div>
                <h3
                  className="font-semibold text-base leading-tight"
                  style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
                >
                  {mod.title}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}
                >
                  {mod.desc}
                </p>
                <div
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mt-1 transition-all group-hover:gap-2"
                  style={{ color: mod.color }}
                >
                  Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          KUNDLI CTA SECTION
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "var(--color-cream)",
          borderTop: "1px solid rgba(209,168,110,0.15)",
          borderBottom: "1px solid rgba(209,168,110,0.15)",
        }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow mb-4">Free · Instant · Accurate</p>
              <h2 className="section-title mb-6">
                Your Birth Chart,<br />
                <em style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Unveiled in Seconds</em>
              </h2>
              <p className="mb-8 text-base leading-relaxed" style={{ color: "rgba(45,41,38,0.7)", fontFamily: "var(--font-body)" }}>
                Enter your birth details and get a complete Vedic kundli instantly —
                with Lagna chart, Navamsa, planetary positions, Vimshottari dasha
                timeline, and AI-powered basic predictions. Free. No sign-up required.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Lagna (D1) + Navamsa (D9) chart",
                  "9 planetary positions with degrees & nakshatras",
                  "Complete Vimshottari dasha timeline",
                  "Basic predictions & active yogas",
                  "Download as branded PDF",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span style={{ color: "var(--color-gold)" }}>✦</span>
                    <span className="text-sm" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex gap-4">
                <Link href="/kundli" className="btn-gold">
                  Generate My Kundli →
                </Link>
              </div>
            </div>

            {/* Preview card */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "var(--color-ivory)",
                border: "1px solid rgba(209,168,110,0.25)",
                boxShadow: "0 10px 40px rgba(15,10,30,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#E87722" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "var(--color-gold)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#4CAF50" }} />
                <span className="ml-2 text-xs" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-mono)" }}>
                  kundli_preview.chart
                </span>
              </div>

              {/* Mini chart grid */}
              <div
                className="aspect-square max-w-[200px] mx-auto rounded-lg border mb-4"
                style={{ borderColor: "rgba(209,168,110,0.35)" }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <rect x="2" y="2" width="196" height="196" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.6" />
                  <line x1="68" y1="2" x2="68" y2="198" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
                  <line x1="133" y1="2" x2="133" y2="198" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
                  <line x1="2" y1="68" x2="198" y2="68" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
                  <line x1="2" y1="133" x2="198" y2="133" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
                  <line x1="68" y1="68" x2="133" y2="133" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
                  <line x1="133" y1="68" x2="68" y2="133" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
                  <text x="100" y="35" textAnchor="middle" fontSize="11" fill="#E87722" fontFamily="monospace">☉ ♂</text>
                  <text x="165" y="100" textAnchor="middle" fontSize="11" fill="#4CAF50" fontFamily="monospace">♃</text>
                  <text x="35" y="100" textAnchor="middle" fontSize="11" fill="#6B6B9E" fontFamily="monospace">♄</text>
                  <text x="100" y="165" textAnchor="middle" fontSize="11" fill="var(--color-gold)" fontFamily="monospace">☽</text>
                  <text x="35" y="165" textAnchor="middle" fontSize="11" fill="#888" fontFamily="monospace">☊</text>
                  <text x="165" y="35" textAnchor="middle" fontSize="11" fill="#E91E8C" fontFamily="monospace">♀</text>
                  <text x="100" y="95" textAnchor="middle" fontSize="8" fill="var(--color-midnight)" opacity="0.6" fontFamily="monospace">Asc</text>
                  <text x="100" y="108" textAnchor="middle" fontSize="10" fill="var(--color-midnight)" fontFamily="monospace">♈</text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Ascendant", value: "Aries ♈" },
                  { label: "Moon Sign", value: "Scorpio ♏" },
                  { label: "Sun Sign",  value: "Aries ♈" },
                  { label: "Current Dasha", value: "Mercury" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg px-3 py-2"
                    style={{ background: "rgba(209,168,110,0.06)", border: "1px solid rgba(209,168,110,0.15)" }}
                  >
                    <p className="text-xs" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-mono)" }}>{label}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "var(--color-ivory)" }}>
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-eyebrow mb-3">Certified & Energized</p>
              <h2 className="section-title">Premium Astrology Store</h2>
            </div>
            <Link
              href="/store"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
              style={{ color: "var(--color-gold)" }}
            >
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          AI CHATBOT TEASER
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "var(--color-cream)",
          borderTop: "1px solid rgba(209,168,110,0.15)",
          borderBottom: "1px solid rgba(209,168,110,0.15)",
        }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                background: "rgba(196,138,105,0.12)",
                border: "1px solid rgba(196,138,105,0.3)",
              }}
            >
              <Zap size={12} style={{ color: "var(--color-saffron)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-saffron-dark)" }}>
                Early Access — Waitlist Open
              </span>
            </div>

            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                color: "var(--color-midnight)",
                lineHeight: 1.1,
              }}
            >
              AI Astrologer That Knows{" "}
              <span
                style={{
                  color: "var(--color-saffron)",
                }}
              >
                Your Chart
              </span>
            </h2>

            <p className="mb-10 text-base leading-relaxed" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>
              An AI trained on 1,00,000+ real charts — not generic astrology content.
              Ask anything and get answers grounded in your personal kundli.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {AI_FEATURES.map((f) => (
                <div
                  key={f}
                  className="px-4 py-2 rounded-full text-sm"
                  style={{
                    background: "rgba(196,138,105,0.06)",
                    border: "1px solid rgba(196,138,105,0.2)",
                    color: "rgba(45,41,38,0.7)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ✦ {f}
                </div>
              ))}
            </div>

            {/* Prompt chips */}
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-body)" }}>
              Ask things like —
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {PROMPT_CHIPS.map((chip) => (
                <div
                  key={chip}
                  className="px-4 py-2 rounded-full text-sm cursor-default"
                  style={{
                    background: "rgba(209,168,110,0.06)",
                    border: "1px solid rgba(209,168,110,0.15)",
                    color: "rgba(45,41,38,0.6)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  &ldquo;{chip}&rdquo;
                </div>
              ))}
            </div>

            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ZODIAC GALLERY RELIC SCULPTURES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "var(--color-parchment-dark)" }}>
        <div className="container-xl">
          <div className="text-center mb-16">
            <p className="section-eyebrow mb-3">Vedic Relic Sculptures</p>
            <h2 className="section-title">The 12 Sacred Signs</h2>
            <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
              Ancient sidereal alignments mapped onto classical clay relief sculptures. Hover over each card to discover its core cosmic traits.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ZODIACS_LIST.map((z) => (
              <div
                key={z.id}
                className="group relative overflow-hidden rounded-2xl border aspect-square cursor-pointer transition-all duration-300 hover:scale-103"
                style={{
                  borderColor: "rgba(209,168,110,0.25)",
                  boxShadow: "0 4px 20px rgba(15,10,30,0.04)"
                }}
              >
                {/* Zodiac Image background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-108"
                  style={{ backgroundImage: `url(/zodiacs/${z.id}.jpeg)` }}
                />
                {/* Gradient overlay on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4"
                  style={{
                    background: "linear-gradient(to top, rgba(45,41,38,0.92) 0%, rgba(45,41,38,0.4) 60%, transparent 100%)",
                  }}
                >
                  <p className="text-xs uppercase tracking-widest text-[#D1A86E] font-bold">
                    {z.symbol} {z.id}
                  </p>
                  <p className="text-[10px] mt-1 text-[#FAF5ED] leading-relaxed font-semibold">
                    {z.traits}
                  </p>
                </div>
                {/* Label (always visible bottom strip) */}
                <div
                  className="absolute bottom-0 left-0 right-0 py-2.5 px-4 text-center group-hover:opacity-0 transition-opacity duration-200"
                  style={{
                    background: "rgba(244,239,230,0.85)",
                    backdropFilter: "blur(4px)",
                    borderTop: "1px solid rgba(209,168,110,0.15)",
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D2926]">
                    {z.symbol} {z.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "var(--color-parchment)" }}>
        <div className="container-xl">
          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3">1,800+ Reviews</p>
            <h2 className="section-title">What Our Community Says</h2>
          </div>
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BLOG TEASERS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "var(--color-ivory)" }}>
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-eyebrow mb-3">Astrology Insights</p>
              <h2 className="section-title">Deep-Dive Articles</h2>
            </div>
            <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--color-gold)" }}>
              All Articles <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card group overflow-hidden"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-gold">{post.category}</span>
                    <span className="text-xs" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-body)" }}>{post.readTime}</span>
                  </div>
                  <h3
                    className="font-semibold text-base leading-snug mb-2 transition-colors group-hover:text-saffron"
                    style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
                    {post.excerpt.slice(0, 120)}...
                  </p>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: "#E87722" }}>
                    Read More <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DONATION BANNER
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-ivory) 0%, var(--color-parchment) 100%)", borderTop: "1px solid rgba(209,168,110,0.15)" }}
      >
        {/* Paw print decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {["10%", "85%", "30%", "70%", "50%"].map((x, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-10"
              style={{ left: x, top: `${20 + i * 15}%`, transform: `rotate(${i * 25}deg)` }}
            >
              🐾
            </span>
          ))}
        </div>

        <div className="container-xl relative z-10 text-center">
          <div className="text-5xl mb-6">🐾</div>
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--color-midnight)",
            }}
          >
            Give Back. One Bowl at a Time.
          </h2>
          <p
            className="max-w-xl mx-auto mb-8 text-base leading-relaxed"
            style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}
          >
            We believe in karma — not just in charts, but in action. Donate dog food,
            blankets, and vet kits to street dogs in your city. We share photo proof
            of every single donation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/donate" className="btn-gold">
              🐾 Donate an Item
            </Link>
            <Link
              href="/donate"
              className="btn-outline"
              style={{
                borderColor: "rgba(45,41,38,0.4)",
                color: "var(--color-midnight)",
              }}
            >
              View Transparency Log
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
