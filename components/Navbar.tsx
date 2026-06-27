"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Star, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { CartDrawer } from "@/components/store/CartDrawer";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/locale/LocaleProvider";
import { CURRENCIES, CURRENCY_ORDER } from "@/lib/locale/config";

const NAV_LINKS = [
  { href: "/kundli",       label: "Kundli",        emoji: "🔯" },
  { href: "/matchmaking",  label: "Matching",      emoji: "💞" },
  { href: "/ai-chat",      label: "AI Astrologer", emoji: "✨", pulse: true },
  { href: "/consultation", label: "Consult",       emoji: "🎙️" },
  { href: "/store",        label: "Store",         emoji: "🛍️" },
  { href: "/courses",      label: "Courses",       emoji: "📚" },
  { href: "/donate",       label: "Donate",        emoji: "" },
  { href: "/blog",         label: "Blog",          emoji: "✍️" },
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCartStore();
  const cartCount = totalItems();
  const { user } = useAuth();
  const { currency, setCurrency } = useLocale();

  const initials = (() => {
    const name =
      (user?.user_metadata?.full_name as string) || user?.email || "";
    return name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");
  })();

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
          // Always keep a light, blurred bar so the dark logo/links stay
          // readable over both light and dark (cosmic) hero sections.
          background: scrolled ? "rgba(244, 239, 230, 0.97)" : "rgba(244, 239, 230, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(209, 168, 110, 0.2)",
          boxShadow: scrolled ? "0 4px 20px rgba(15,10,30,0.06)" : "none",
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
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isActive(link.href) ? "var(--color-gold)" : link.pulse ? "var(--color-saffron)" : "rgba(45, 41, 38, 0.75)",
                    background: isActive(link.href)
                      ? "rgba(209, 168, 110, 0.08)"
                      : link.pulse ? "rgba(196, 138, 105, 0.08)" : "transparent",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLElement).style.color = "var(--color-gold)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLElement).style.color = link.pulse ? "var(--color-saffron)" : "rgba(45, 41, 38, 0.75)";
                    }
                  }}
                >
                  {link.pulse && <span className="animate-pulse text-[8px]">●</span>}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Currency switcher */}
              <div
                className="hidden md:flex items-center gap-0.5 rounded-lg p-0.5"
                style={{ background: "rgba(209,168,110,0.1)", border: "1px solid rgba(209,168,110,0.15)" }}
              >
                {CURRENCY_ORDER.map((code) => (
                  <button
                    key={code}
                    onClick={() => setCurrency(code)}
                    className="px-2 py-1 rounded-md text-[11px] font-bold transition-all"
                    style={{
                      background: currency === code ? "var(--color-gold)" : "transparent",
                      color: currency === code ? "var(--color-midnight)" : "rgba(45,41,38,0.5)",
                    }}
                  >
                    {CURRENCIES[code].symbol}
                  </button>
                ))}
              </div>

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
                href={user ? "/account" : "/login"}
                aria-label={user ? "My account" : "Sign in"}
                className="p-1.5 rounded-md transition-all hover:bg-black/5 flex items-center"
                style={{ color: "rgba(45, 41, 38, 0.7)" }}
              >
                {user ? (
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))", color: "var(--color-midnight)" }}
                  >
                    {initials || <User size={16} />}
                  </span>
                ) : (
                  <User size={20} />
                )}
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
        <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden border-t overflow-hidden"
            style={{
              background: "rgba(244, 239, 230, 0.98)",
              borderColor: "rgba(209, 168, 110, 0.2)",
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="container-xl py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive(link.href) ? "var(--color-gold)" : link.pulse ? "var(--color-saffron)" : "rgba(45, 41, 38, 0.8)",
                    background: isActive(link.href)
                      ? "rgba(209, 168, 110, 0.08)"
                      : link.pulse ? "rgba(196, 138, 105, 0.07)" : "transparent",
                    border: link.pulse ? "1px solid rgba(196, 138, 105, 0.2)" : "1px solid transparent",
                  }}
                >
                  <span>{link.pulse ? <span className="animate-pulse">●</span> : link.emoji}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
