import Link from "next/link";
import { BadgeCheck, Star, Quote } from "lucide-react";
import { CONSULTATION_SERVICES, TESTIMONIALS } from "@/data/content";
import { formatPrice } from "@/lib/utils";

const CREDENTIALS = [
  { value: "10+", label: "Years of practice" },
  { value: "1,00,000+", label: "Charts analysed" },
  { value: "4.9★", label: "Avg. client rating" },
  { value: "5,000+", label: "Consultations" },
];

const CERTS = ["Vedic Jyotish", "Lal Kitab", "Nadi Astrology", "KP System"];

// Map each service to a connect mode so pricing reads clearly.
const MODE: Record<string, string> = {
  "cs-1": "📞 Voice / Call",
  "cs-2": "💬 Chat / Written",
  "cs-3": "📹 Live Video",
};

export function AstrologerProfile() {
  const testimonials = TESTIMONIALS.slice(0, 3);

  return (
    <div className="mt-16">
      {/* Profile header */}
      <div
        className="rounded-3xl p-8 md:p-10"
        style={{ background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))", border: "1px solid rgba(209,168,110,0.25)" }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <img
              src="/brand/logo.png"
              alt="The Masked Astrologer"
              width={104}
              height={104}
              loading="lazy"
              decoding="async"
              className="w-[104px] h-[104px] rounded-full object-cover"
              style={{ width: 104, height: 104, border: "3px solid var(--color-gold)" }}
            />
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(76,175,80,0.12)", color: "#7BD389", border: "1px solid rgba(76,175,80,0.3)" }}>
              <BadgeCheck size={13} /> Verified Astrologer
            </span>
          </div>

          <div className="flex-1">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-parchment)" }}>
              The Masked Astrologer
            </h2>
            <p className="text-sm mt-1 mb-5" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
              Senior Vedic Astrologer · Predictive Jyotish &amp; Practical Remedies
            </p>
            <p className="text-sm leading-relaxed mb-6 max-w-2xl" style={{ color: "rgba(250,245,237,0.65)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
              Trained in classical Vedic astrology with deep specialisation across Lal Kitab,
              Nadi, and the KP system. Known for honest, no-sugar-coating readings and
              practical remedies that clients can actually follow — career, marriage,
              health, finance, and spiritual growth.
            </p>

            {/* Credentials */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {CREDENTIALS.map((c) => (
                <div key={c.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(209,168,110,0.08)", border: "1px solid rgba(209,168,110,0.2)" }}>
                  <p className="text-lg font-bold" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{c.value}</p>
                  <p className="text-[11px]" style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}>{c.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {CERTS.map((cert) => (
                <span key={cert} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(250,245,237,0.06)", color: "rgba(250,245,237,0.7)", border: "1px solid rgba(209,168,110,0.2)" }}>{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clear pricing */}
      <div className="mt-8">
        <h3 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-midnight)" }}>Transparent Pricing</h3>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(209,168,110,0.2)" }}>
          {CONSULTATION_SERVICES.map((svc, i) => (
            <div
              key={svc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5"
              style={{ background: i % 2 ? "var(--color-parchment)" : "var(--color-ivory)" }}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{svc.title}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: "rgba(209,168,110,0.12)", color: "var(--color-gold-dark)" }}>{MODE[svc.id] ?? svc.subtitle}</span>
                  {svc.popular && <span className="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: "var(--color-saffron)", color: "#fff" }}>Most Popular</span>}
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>{svc.subtitle} · {svc.duration}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)", fontSize: "1.1rem" }}>{formatPrice(svc.price)}</span>
                <Link href={`?service=${svc.id}#book`} className="btn-gold text-xs px-4 py-2">Book</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-10">
        <h3 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-midnight)" }}>What Clients Say</h3>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
              <Quote size={20} style={{ color: "var(--color-gold)", opacity: 0.5 }} />
              <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(45,41,38,0.75)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>“{t.text}”</p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < t.rating ? "var(--color-gold)" : "transparent"} color={i < t.rating ? "var(--color-gold)" : "rgba(209,168,110,0.3)"} />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(209,168,110,0.15)" }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))", color: "var(--color-midnight)" }}>{t.avatar}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{t.name}</p>
                  <p className="text-[11px]" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>{t.location} · {t.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
