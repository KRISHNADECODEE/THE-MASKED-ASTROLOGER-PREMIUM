import Link from "next/link";
import { MandalaBackground } from "@/components/MandalaBackground";
import { Sparkles, Heart, ShieldCheck, BookOpen } from "lucide-react";

export const metadata = {
  title: "About · The Masked Astrologer",
  description:
    "The story behind The Masked Astrologer — anonymous Vedic guidance, honest readings, and a mission to feed street dogs through transparent, item-based donations.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Anonymous by design",
    desc: "The mask removes ego and bias. You get guidance based on your chart — not on who you are or what you can pay.",
  },
  {
    icon: BookOpen,
    title: "Rooted in Vedic tradition",
    desc: "Every reading draws on classical Jyotish — planetary positions, dashas, yogas, and doshas — explained in plain language.",
  },
  {
    icon: Heart,
    title: "Compassion in action",
    desc: "A share of everything we do funds food and care for street dogs, logged transparently with photo proof.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Our Story</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--color-parchment)",
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            The Masked Astrologer
          </h1>
          <p
            className="max-w-2xl mx-auto text-base"
            style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}
          >
            Honest Vedic astrology, delivered without a face or an ego — so the only thing
            that matters is your chart. Every consultation, course, and product also helps
            feed the street dogs who have no one else.
          </p>
        </div>
      </section>

      {/* Mission */}
      <div className="container-xl py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Sparkles size={28} className="mx-auto mb-4" style={{ color: "var(--color-gold)" }} />
          <h2 className="section-title mb-4">Why the mask?</h2>
          <p
            className="text-base"
            style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)", lineHeight: 1.9 }}
          >
            Astrology should guide, not flatter. By staying anonymous, our astrologer can give
            you the reading you need to hear rather than the one that sells. No celebrity worship,
            no inflated promises — just careful chart analysis grounded in classical Jyotish, and a
            promise that part of what you spend goes straight to feeding street dogs.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-8"
              style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.25)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(209,168,110,0.12)", border: "1px solid rgba(209,168,110,0.25)" }}
              >
                <Icon size={22} style={{ color: "var(--color-gold)" }} />
              </div>
              <h3
                className="mb-2"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--color-midnight)" }}
              >
                {title}
              </h3>
              <p className="text-sm" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16" style={{ background: "var(--color-midnight)", borderTop: "1px solid rgba(209,168,110,0.12)" }}>
        <div className="container-xl text-center">
          <h2
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "var(--color-parchment)", marginBottom: "0.75rem" }}
          >
            Begin your reading
          </h2>
          <p
            className="max-w-lg mx-auto mb-8 text-sm"
            style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}
          >
            Generate your free Kundli, book a 1:1 session, or help a street dog eat today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/kundli" className="btn-gold px-6 py-3">
              Free Kundli
            </Link>
            <Link
              href="/donate"
              className="px-6 py-3 rounded-full font-semibold text-sm"
              style={{ background: "rgba(196,138,105,0.25)", border: "1.5px solid var(--color-saffron)", color: "var(--color-saffron)" }}
            >
              Donate to Street Dogs 🐾
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
