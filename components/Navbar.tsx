"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Star, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { CartDrawer } from "@/components/store/CartDrawer";

const NAV_LINKS = [
  { href: "/kundli",       label: "Kundli",       emoji: "🔯" },
  { href: "/store",        label: "Store",        emoji: "🛍️" },
  { href: "/consultation", label: "Consult",      emoji: "🎙️" },
  { href: "/courses",      label: "Courses",      emoji: "📚" },
  { href: "/blog",         label: "Blog",         emoji: "✍️" },
  { href: "/donate",       label: "Donate 🐾",    emoji: "" },
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCartStore();
  const cartCount = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobile(false); }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(244, 239, 230, 0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(209, 168, 110, 0.2)"
            : "none",
        }}
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/brand/logo.png"
                alt="The Masked Astrologer Logo"
                className="w-8 h-8 rounded-full object-cover border"
                style={{ borderColor: "var(--color-gold)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "var(--color-midnight)",
                  lineHeight: 1,
                }}
              >
                The Masked Astrologer
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isActive(link.href) ? "var(--color-gold)" : "rgba(45, 41, 38, 0.75)",
                    background: isActive(link.href)
                      ? "rgba(209, 168, 110, 0.08)"
                      : "transparent",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) {
                      (e.target as HTMLElement).style.color = "var(--color-gold)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      (e.target as HTMLElement).style.color = "rgba(45, 41, 38, 0.75)";
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* AI Chat CTA */}
              <Link
                href="/ai-chat"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                style={{
                  background: "rgba(196, 138, 105, 0.12)",
                  color: "var(--color-saffron)",
                  border: "1px solid rgba(196, 138, 105, 0.25)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <span className="animate-pulse">●</span> AI Astrologer
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-md transition-all hover:bg-black/5"
                style={{ color: "var(--color-midnight)" }}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ background: "var(--color-saffron)", color: "#fff", fontSize: "0.6rem" }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 rounded-md transition-all hover:bg-black/5"
                style={{ color: "rgba(45, 41, 38, 0.7)" }}
              >
                <User size={20} />
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobile(!mobileOpen)}
                className="lg:hidden p-2 rounded-md transition-all hover:bg-black/5"
                style={{ color: "var(--color-midnight)" }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{
              background: "rgba(244, 239, 230, 0.98)",
              borderColor: "rgba(209, 168, 110, 0.2)",
            }}
          >
            <div className="container-xl py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive(link.href) ? "var(--color-gold)" : "rgba(45, 41, 38, 0.8)",
                    background: isActive(link.href)
                      ? "rgba(209, 168, 110, 0.08)"
                      : "transparent",
                  }}
                >
                  <span>{link.emoji}</span>
                  {link.label}
                </Link>
              ))}
              <Link
                href="/ai-chat"
                className="mt-2 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold"
                style={{
                  background: "rgba(196, 138, 105, 0.12)",
                  color: "var(--color-saffron)",
                  border: "1px solid rgba(196, 138, 105, 0.25)",
                }}
              >
                <span className="animate-pulse">●</span> AI Astrologer — Coming Soon
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
