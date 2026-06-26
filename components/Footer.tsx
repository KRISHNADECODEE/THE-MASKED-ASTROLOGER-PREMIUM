"use client";

import Link from "next/link";
import { Star, Mail, Phone, MapPin } from "lucide-react";

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

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
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/brand/logo.png"
                alt="The Masked Astrologer Logo"
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="w-9 h-9 rounded-full object-cover border"
                style={{ borderColor: "var(--color-gold)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  color: "var(--color-parchment)",
                  lineHeight: 1,
                }}
              >
                The Masked Astrologer
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)", maxWidth: "300px" }}
            >
              India&apos;s most trusted Vedic astrology platform — generate your birth chart,
              check marriage compatibility, read your daily horoscope, and consult an
              expert for authentic guidance and remedies.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-1.5 mb-5 text-sm" style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)" }}>
              <a href="mailto:support@maskedastrologer.com" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2">
                <Mail size={14} /> support@maskedastrologer.com
              </a>
              <a href="tel:+919000000000" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-2">
                <Phone size={14} /> +91 90000 00000
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> New Delhi, India
              </span>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, href: "https://instagram.com/the_masked_astrologer", label: "Instagram" },
                { icon: YoutubeIcon,   href: "https://youtube.com/@maskedastrologer", label: "YouTube" },
                { icon: Mail,          href: "mailto:support@maskedastrologer.com", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-md flex items-center justify-center transition-all hover:border-gold"
                  style={{
                    border: "1px solid rgba(209,168,110,0.2)",
                    color: "rgba(250,245,237,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gold)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(209,168,110,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(250,245,237,0.5)";
                  }}
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

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
