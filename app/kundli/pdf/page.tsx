"use client";

import { useState, useEffect } from "react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, Download, FileText, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function KundliPdfPage() {
  const [tier, setTier] = useState<"free" | "premium">("premium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Aarav",
    dob: "1995-08-15",
    tob: "14:30",
    pob: "Mumbai, India",
  });

  const price = 499; // Premium report price in INR

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();

    if (tier === "free") {
      toast.loading("Generating your free Kundli PDF...", { id: "pdf" });
      setTimeout(() => {
        toast.success("Free PDF ready! Downloading...", { id: "pdf" });
        // Trigger simulated PDF download
        const link = document.createElement("a");
        link.href = "#";
        link.setAttribute("download", `kundli-${formData.name}-free.pdf`);
        // Simulate download behavior
        toast.success("Download started.");
      }, 2000);
    } else {
      setIsProcessing(true);
      toast.loading("Initiating secure payment...", { id: "payment" });
      
      setTimeout(() => {
        toast.success("Payment Successful! Generating Premium PDF...", { id: "payment" });
        
        setTimeout(() => {
          toast.success("Premium 25-page Kundli PDF generated! Downloading...", { id: "pdf-premium" });
          setIsProcessing(false);
        }, 2000);
      }, 2000);
    }
  };

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        <Link
          href="/kundli"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80 transition-all"
          style={{ color: "#0F0A1E", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={16} /> Back to Generator
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form & Selection */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <p className="section-eyebrow mb-2">Download Report</p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#0F0A1E",
                }}
              >
                Vedic Horoscope PDF
              </h1>
              <p className="text-sm mt-2" style={{ color: "rgba(15,10,30,0.6)", fontFamily: "var(--font-body)" }}>
                Generate a professionally typeset PDF copy of your horoscope. Keep it on your device or print it.
              </p>
            </div>

            <form onSubmit={handleDownload} className="flex flex-col gap-6">
              {/* Form details confirmation */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(209,168,110,0.2)",
                }}
              >
                <h3 className="text-sm font-bold mb-4" style={{ color: "#0F0A1E", fontFamily: "var(--font-body)" }}>
                  Confirm Birth Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(15,10,30,0.5)" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(15,10,30,0.5)" }}>
                      Birth Place
                    </label>
                    <input
                      type="text"
                      name="pob"
                      value={formData.pob}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(15,10,30,0.5)" }}>
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(15,10,30,0.5)" }}>
                      Birth Time
                    </label>
                    <input
                      type="time"
                      name="tob"
                      value={formData.tob}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Tier Selection */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: "free",
                    title: "Free Chart",
                    priceLabel: "₹0",
                    desc: "D-1 Chart & Planetary info.",
                  },
                  {
                    id: "premium",
                    title: "Premium Report",
                    priceLabel: "₹499",
                    desc: "25+ Pages interpretation.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTier(item.id as any)}
                    className="p-4 rounded-2xl cursor-pointer text-left transition-all border flex flex-col justify-between"
                    style={{
                      background: tier === item.id ? "var(--color-midnight)" : "var(--color-ivory)",
                      color: tier === item.id ? "var(--color-parchment)" : "var(--color-midnight)",
                      borderColor: tier === item.id ? "var(--color-midnight)" : "rgba(209,168,110,0.25)",
                    }}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60">{item.title}</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: tier === item.id ? "#C9A227" : "#0F0A1E" }}>
                        {item.priceLabel}
                      </p>
                    </div>
                    <p className="text-xs mt-4 opacity-75">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Download / Pay CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-gold w-full h-12 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {tier === "free" ? (
                  <>
                    <Download size={18} /> Download Free PDF
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {isProcessing ? "Processing Secure Checkout..." : `Buy Premium Report — ${formatPrice(price)}`}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Features Comparison */}
          <div className="lg:col-span-6">
            <div
              className="p-6 md:p-8 rounded-3xl"
              style={{
                background: "var(--color-midnight)",
                border: "1px solid rgba(209,168,110,0.2)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  color: "var(--color-parchment)",
                  marginBottom: "1.5rem",
                }}
              >
                What is in the Premium PDF?
              </h2>

              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "20+ Pages of Detailed Astrological Readings",
                    desc: "An exhaustive house-by-house analysis detailing your health, wealth, relationships, family, and destiny.",
                  },
                  {
                    title: "Timing of Major Life Events (Vimshottari Dasha)",
                    desc: "Precise breakdown of your planetary periods with predictions on career shifts, financial cycles, and relationship milestones.",
                  },
                  {
                    title: "Personalized Vedic Remedy & Gemstone Guide",
                    desc: "Authentic, actionable remedies for planetary doshas including specific mantras, charity, and suitable energized gemstones.",
                  },
                  {
                    title: "Divisional Charts (Navamsa, Dashamsa, etc.)",
                    desc: "D-9 (marriage & partner characteristics) and D-10 (career & professional status) divisional charts calculated with precision.",
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.25)" }}
                    >
                      <Check size={14} style={{ color: "#C9A227" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-parchment)" }}>
                        {feature.title}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(253,233,207,0.5)" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PDF Preview Badge */}
              <div
                className="mt-8 p-4 rounded-xl flex items-center justify-between"
                style={{
                  background: "rgba(253,233,207,0.04)",
                  border: "1px solid rgba(253,233,207,0.1)",
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText size={24} style={{ color: "#C9A227" }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: "var(--color-parchment)" }}>
                      Interactive Sample PDF
                    </p>
                    <p className="text-[10px]" style={{ color: "rgba(253,233,207,0.4)" }}>
                      24.8 MB · 28 Pages · Standard Vedic Format
                    </p>
                  </div>
                </div>
                <button
                  className="text-xs font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: "#C9A227" }}
                  onClick={() => toast.success("Sample PDF downloaded successfully!")}
                >
                  View Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
