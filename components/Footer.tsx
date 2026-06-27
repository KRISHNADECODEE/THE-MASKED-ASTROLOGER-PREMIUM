"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/kundli",       label: "Free Kundli" },
    { href: "/kundli/pdf",   label: "Kundli PDF Report" },
    { href: "/consultation", label: "Book Consultation" },
    { href: "/courses",      label: "Astrology Courses" },
  ],
  Shop: [
    { href: "/store?cat=gemstones", label: "Gemstones" },
    { href: "/store?cat=yantras",   label: "Yantras" },
    { href: "/store?cat=pooja",     label: "Pooja Items" },
    { href: "/store?cat=remedies",  label: "Remedies" },
    { href: "/store?cat=books",     label: "Books" },
  ],
  Learn: [
    { href: "/blog",                                  label: "Astrology Blog" },
    { href: "/blog?cat=Planetary%20Transits",         label: "Planetary Transits" },
    { href: "/blog?cat=Doshas",                       label: "Doshas & Remedies" },
    { href: "/blog?cat=Yogas",                        label: "Powerful Yogas" },
  ],
  Company: [
    { href: "/about",   label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/donate",  label: "Donate & Give Back" },
    { href: "/ai-chat", label: "AI Astrologer (Soon)" },
    { href: "/account", label: "My Account" },
  ],
};

export function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-cosmic-deep) 100%)",
        borderTop: "1px solid rgba(209, 168, 110, 0.18)",
      }}
    >
      {/* Main footer */}
      <div className="container-xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Nav columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                    className="text-sm transition-colors"
                    style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "var(--color-parchment)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "rgba(250,245,237,0.5)";
                    }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="divider-gold" />

      {/* Bottom bar */}
      <div className="container-xl py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{ color: "rgba(250,245,237,0.3)", fontFamily: "var(--font-body)" }}
          >
            © {new Date().getFullYear()} The Masked Astrologer. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { t: "Privacy Policy", href: "/privacy" },
              { t: "Terms of Service", href: "/terms" },
              { t: "Refund Policy", href: "/refund" },
            ].map(({ t, href }) => (
              <Link
                key={t}
                href={href}
                className="text-xs transition-colors"
                style={{ color: "rgba(250,245,237,0.3)", fontFamily: "var(--font-body)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(250,245,237,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(250,245,237,0.3)";
                }}
              >
                {t}
              </Link>
            ))}
          </div>
          <p
            className="text-xs"
            style={{ color: "rgba(250,245,237,0.25)", fontFamily: "var(--font-body)" }}
          >
            🕉️ Rooted in Vedic tradition · Serving seekers worldwide
          </p>
        </div>

        {/* Agency credit */}
        <div className="mt-4 pt-4 text-center" style={{ borderTop: "1px solid rgba(209,168,110,0.08)" }}>
          <p className="text-[11px] tracking-wide" style={{ color: "rgba(250,245,237,0.28)", fontFamily: "var(--font-body)" }}>
            Managed by{" "}
            <a
              href="https://twotabstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:text-[var(--color-gold)]"
              style={{ color: "rgba(250,245,237,0.45)", letterSpacing: "0.08em" }}
            >
              TWO TAB STUDIO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
