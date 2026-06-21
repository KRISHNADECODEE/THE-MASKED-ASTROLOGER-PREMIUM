"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { useEffect, useState, Suspense } from "react";

function SuccessCard() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("ORD-XXXXXX");

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  return (
    <div
      className="p-8 md:p-10 rounded-3xl text-center flex flex-col items-center gap-6"
      style={{
        background: "var(--color-ivory)",
        border: "1px solid rgba(209, 168, 110, 0.25)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Success Check Icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "rgba(76,175,80,0.15)", border: "2px solid #4CAF50" }}
      >
        <CheckCircle2 size={36} color="#4CAF50" />
      </div>

      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            color: "var(--color-midnight)",
            marginBottom: "0.5rem",
          }}
        >
          Order Placed Successfully!
        </h1>
        <p
          className="text-sm"
          style={{ color: "rgba(45, 41, 38, 0.7)", fontFamily: "var(--font-body)" }}
        >
          Your payment has been verified. A confirmation email with the invoice is on its way.
        </p>
      </div>

      {/* Order Details box */}
      <div
        className="w-full p-4 rounded-xl text-left flex flex-col gap-2"
        style={{
          background: "rgba(209, 168, 110, 0.05)",
          border: "1px solid rgba(209, 168, 110, 0.15)",
          fontFamily: "var(--font-body)",
        }}
      >
        <div className="flex justify-between text-xs">
          <span style={{ color: "rgba(45, 41, 38, 0.6)" }}>Order ID</span>
          <span className="font-semibold text-mono" style={{ color: "var(--color-gold)" }}>{orderId}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "rgba(45, 41, 38, 0.6)" }}>Status</span>
          <span className="font-semibold" style={{ color: "#4CAF50" }}>Paid / Confirmed</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "rgba(45, 41, 38, 0.6)" }}>Delivery Time</span>
          <span style={{ color: "var(--color-midnight)" }}>3–5 Business Days</span>
        </div>
      </div>

      {/* Donation Alert */}
      <div
        className="p-4 rounded-xl flex gap-3 text-left w-full"
        style={{
          background: "rgba(196, 138, 105, 0.1)",
          border: "1px solid rgba(196, 138, 105, 0.25)",
        }}
      >
        <span className="text-xl">🐾</span>
        <div style={{ fontFamily: "var(--font-body)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--color-saffron)" }}>
            Street Dog Fed!
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(45, 41, 38, 0.7)" }}>
            Thanks to your purchase, 10% of the profits will go directly to buying food/vaccinations.
            Track photo proof in the Donation module!
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
        <Link
          href="/store"
          className="btn-gold flex-1 flex items-center justify-center gap-2"
          style={{ padding: "0.75rem" }}
        >
          <ShoppingBag size={16} /> Store Home
        </Link>
        <Link
          href="/account"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:bg-midnight/5"
          style={{
            border: "1px solid rgba(209, 168, 110, 0.3)",
            color: "var(--color-midnight)",
            padding: "0.75rem",
          }}
        >
          Track Orders <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden"
      style={{ background: "var(--color-parchment)" }}
    >
      <MandalaBackground />

      <div className="container-xl relative z-10 max-w-lg px-6">
        <Suspense
          fallback={
            <div className="p-10 text-center text-midnight font-bold" style={{ color: "var(--color-midnight)" }}>
              Loading Order Details...
            </div>
          }
        >
          <SuccessCard />
        </Suspense>
      </div>
    </div>
  );
}
