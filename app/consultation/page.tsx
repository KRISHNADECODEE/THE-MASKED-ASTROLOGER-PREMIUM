import { Suspense } from "react";
import Link from "next/link";
import { MandalaBackground } from "@/components/MandalaBackground";
import { CONSULTATION_SERVICES } from "@/data/content";
import { BookingForm } from "@/components/consultation/BookingForm";
import { AstrologerProfile } from "@/components/AstrologerProfile";
import { Money } from "@/components/locale/Money";
import { Check } from "lucide-react";

export const metadata = {
  title: "Book Astrology Consultation",
  description: "Book a personalised Vedic astrology consultation — voice note, written Q&A, or live 1:1 Zoom session with our expert astrologer.",
};

export default function ConsultationPage() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Expert Vedic Guidance</p>
          <h1
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--color-parchment)", lineHeight: 1.05, marginBottom: "1rem" }}
          >
            Book a Consultation
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
            Get a personalised reading of your Vedic kundli — career, marriage,
            health, finance, and spiritual growth — by a trained Jyotish practitioner.
          </p>
        </div>
      </section>

      <div className="container-xl py-16">

        {/* 6 Systems + Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">

          {/* Systems I use */}
          <div className="rounded-2xl p-7" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>My Approach</p>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--color-midnight)" }}>
              I use 6 different systems
            </h3>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
              More than 90% of astrologers rely on one primary method. I study your chart through multiple systems for a much deeper and more accurate analysis.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { n: "Vedic", sub: "Classical Jyotish" },
                { n: "Bhrigu Nandi Nadi", sub: "Ancient nadi system" },
                { n: "Jaimini", sub: "Chara dasha & karakas" },
                { n: "Parashari", sub: "Vimshottari dasha" },
                { n: "Numerology", sub: "Name & date analysis" },
                { n: "Tarot", sub: "If needed" },
              ].map(({ n, sub }) => (
                <li key={n} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: "rgba(209,168,110,0.15)", color: "var(--color-gold-dark)" }}>✦</span>
                  <span>
                    <span className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{n}</span>
                    <span className="text-xs ml-2" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div className="rounded-2xl p-7" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>You Can Ask About</p>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--color-midnight)" }}>
              Any area of your life
            </h3>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
              No topic is off-limits. Ask whatever is weighing on your mind and get honest, clear answers.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Love & relationships",
                "Marriage & future spouse",
                "Career, business & finances",
                "Friendships & social circle",
                "Court cases & disputes",
                "Major life events & timings",
                "Current phase & future predictions",
                "Remedies & personal guidance",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: "rgba(209,168,110,0.15)", color: "var(--color-gold-dark)" }}>✦</span>
                  <span className="text-sm" style={{ color: "rgba(45,41,38,0.75)", fontFamily: "var(--font-body)" }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service card */}
        <h2 className="section-title text-center mb-10">Book a Consultation</h2>

        <div className="max-w-lg mx-auto mb-16">
          {CONSULTATION_SERVICES.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--color-midnight)", border: "2px solid var(--color-gold)", position: "relative" }}
            >
              <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-bold uppercase tracking-widest" style={{ background: "var(--color-gold)", color: "var(--color-midnight)" }}>
                1 Hour Personal Consultation
              </div>

              <div className="p-7 pt-12 flex flex-col gap-4">
                <div className="text-3xl">{svc.icon}</div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-parchment)" }}>
                    {svc.title}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}>
                    {svc.subtitle}
                  </p>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}>
                  {svc.description}
                </p>

                <ul className="flex flex-col gap-2">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} style={{ color: "var(--color-gold)", marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ color: "rgba(250,245,237,0.7)", fontFamily: "var(--font-body)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 mt-auto" style={{ borderTop: "1px solid rgba(209,168,110,0.2)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "2rem", fontWeight: 800, color: "var(--color-gold)" }}>
                    {svc.priceDisplay ?? <Money inr={svc.price} />}
                  </p>
                  <p className="text-xs mb-3" style={{ color: "rgba(250,245,237,0.35)", fontFamily: "var(--font-body)" }}>
                    or equivalent in your local currency
                  </p>
                  <Link href={`?service=${svc.id}#book`} className="btn-gold w-full text-center block">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking form */}
        <div id="book" className="max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-2">Book Your Session</h2>
          <p className="text-center mb-10" style={{ color: "rgba(15,10,30,0.5)", fontFamily: "var(--font-body)" }}>
            Fill in your details and we'll confirm your slot within 2 hours.
          </p>
          <Suspense fallback={null}>
            <BookingForm services={CONSULTATION_SERVICES} />
          </Suspense>
        </div>

        {/* About the Astrologer — credentials, pricing & testimonials */}
        <AstrologerProfile />
      </div>
    </div>
  );
}
