import { MandalaBackground } from "@/components/MandalaBackground";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="relative pt-24 pb-12 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.25rem)", color: "var(--color-parchment)", lineHeight: 1.1 }}>
            {title}
          </h1>
          <p className="text-xs mt-3" style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}>Last updated: {updated}</p>
        </div>
      </section>

      <div className="container-xl py-12 max-w-3xl mx-auto">
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(45,41,38,0.7)", fontFamily: "var(--font-body)", lineHeight: 1.9 }}>{intro}</p>

        <div className="flex flex-col gap-8">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="mb-3" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-midnight)" }}>
                {i + 1}. {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed mb-2" style={{ color: "rgba(45,41,38,0.7)", fontFamily: "var(--font-body)", lineHeight: 1.85 }}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        <p className="text-xs mt-12 pt-6" style={{ borderTop: "1px solid rgba(209,168,110,0.2)", color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
          Questions? Email <a href="mailto:support@maskedastrologer.com" className="font-semibold" style={{ color: "var(--color-gold-dark)" }}>support@maskedastrologer.com</a>.
          This is a general template and not legal advice — please have it reviewed before launch.
        </p>
      </div>
    </div>
  );
}
