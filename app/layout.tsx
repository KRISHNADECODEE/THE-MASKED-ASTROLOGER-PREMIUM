import type { Metadata } from "next";
import { Fondamento, Jost, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteAnnouncement } from "@/components/SiteAnnouncement";

const fondamento = Fondamento({
  variable: "--font-fondamento",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Masked Astrologer — Vedic Astrology, Kundli & Cosmic Guidance",
    template: "%s | The Masked Astrologer",
  },
  description:
    "India's premium Vedic astrology platform. Generate your free kundli, book expert consultations, shop gemstones & remedies, and discover your cosmic path.",
  keywords: [
    "vedic astrology",
    "kundli generator",
    "kundli online free",
    "janm kundli",
    "astrology consultation online",
    "gemstones online",
    "yantra online",
    "astrology courses",
    "birth chart",
    "masked astrologer",
  ],
  openGraph: {
    title: "The Masked Astrologer",
    description:
      "Premium Vedic astrology platform — kundli, consultation, store & courses",
    url: "https://maskedastrologer.com",
    siteName: "The Masked Astrologer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Masked Astrologer",
    description:
      "Premium Vedic astrology platform — kundli, consultation, store & courses",
  },
  metadataBase: new URL("https://maskedastrologer.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fondamento.variable} ${jost.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <SiteAnnouncement />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1A1030",
              color: "#FDE9CF",
              border: "1px solid rgba(201,162,39,0.4)",
              fontFamily: "var(--font-body)",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
