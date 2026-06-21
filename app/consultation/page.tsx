import Link from "next/link";
import { MandalaBackground } from "@/components/MandalaBackground";
import { CONSULTATION_SERVICES } from "@/data/content";
import { BookingForm } from "@/components/consultation/BookingForm";
import { formatPrice } from "@/lib/utils";
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
        style={{ background: "linear-gradient(180deg, var(--color-midnight) 0%, var(--color-midnight-800) 100%)" }}
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

        {/* Service cards */}
        <h2 className="section-title text-center mb-12">Choose Your Reading</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CONSULTATION_SERVICES.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: svc.popular ? "var(--color-midnight)" : "var(--color-ivory)",
                border: svc.popular ? "2px solid var(--color-gold)" : "1px solid rgba(209,168,110,0.2)",
                position: "relative",
              }}
            >
              {svc.popular && (
                <div
                  className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-bold uppercase tracking-widest"
                  style={{ background: "var(--color-gold)", color: "var(--color-midnight)" }}
                >
                  Most Popular
                </div>
              )}

              <div className={`p-7 flex flex-col gap-4 ${svc.popular ? "pt-12" : ""}`}>
                <div className="text-3xl">{svc.icon}</div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: svc.popular ? "var(--color-parchment)" : "var(--color-midnight)" }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: svc.popular ? "rgba(250,245,237,0.5)" : "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>
                    {svc.subtitle}
                  </p>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: svc.popular ? "rgba(250,245,237,0.6)" : "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
                  {svc.description}
                </p>

                <ul className="flex flex-col gap-2">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} style={{ color: "var(--color-gold)", marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ color: svc.popular ? "rgba(250,245,237,0.7)" : "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 mt-auto" style={{ borderTop: `1px solid ${svc.popular ? "rgba(209,168,110,0.2)" : "rgba(209,168,110,0.12)"}` }}>
                  <p
                    style={{ fontFamily: "var(--font-body)", fontSize: "1.6rem", fontWeight: 800, color: svc.popular ? "var(--color-gold)" : "var(--color-midnight)" }}
                  >
                    {formatPrice(svc.price)}
                  </p>
                  <Link
                    href={`#book?service=${svc.id}`}
                    className={svc.popular ? "btn-gold w-full text-center mt-3 block" : "btn-saffron w-full text-center mt-3 block"}
                  >
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
          <BookingForm services={CONSULTATION_SERVICES} />
        </div>

        {/* Astrologer info */}
        <div
          className="mt-16 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center"
          style={{ background: "linear-gradient(135deg, var(--color-midnight), var(--color-midnight-800))", border: "1px solid rgba(209,168,110,0.2)" }}
        >
          <div
            className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-4xl"
            style={{ background: "rgba(209,168,110,0.1)", border: "2px solid rgba(209,168,110,0.3)" }}
          >
            🔯
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-parchment)" }}>
              The Masked Astrologer
            </h3>
            <p className="text-sm mt-1 mb-4" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
              10+ years of practice · Vedic Jyotish · Lal Kitab · Nadi Astrology
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)" }}>
              Trained in classical Vedic astrology with a focus on practical remedies
              and predictive accuracy. Has analyzed 5,000+ charts across career,
              relationships, health, and spiritual growth consultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
