"use client";

import { useState } from "react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { DONATION_ITEMS } from "@/data/content";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Heart, Sparkles, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface TransparencyLog {
  id: string;
  donorName: string;
  itemName: string;
  quantity: number;
  cost: number;
  status: "pending" | "collected" | "delivered";
  proofPhoto?: string;
  date: string;
}

const INITIAL_LOGS: TransparencyLog[] = [
  {
    id: "tx-001",
    donorName: "Ananya R.",
    itemName: "Dog Food Bag (5kg)",
    quantity: 2,
    cost: 700,
    status: "delivered",
    proofPhoto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
    date: "June 20, 2026",
  },
  {
    id: "tx-002",
    donorName: "Rahul K.",
    itemName: "Vaccination Kit",
    quantity: 1,
    cost: 800,
    status: "delivered",
    proofPhoto: "https://images.unsplash.com/photo-1581888227599-779811939961?w=600",
    date: "June 18, 2026",
  },
  {
    id: "tx-003",
    donorName: "Meera Sen",
    itemName: "Winter Blanket",
    quantity: 5,
    cost: 1000,
    status: "collected",
    date: "June 21, 2026",
  },
  {
    id: "tx-004",
    donorName: "Anonymous",
    itemName: "Anti-Tick Collar",
    quantity: 3,
    cost: 450,
    status: "pending",
    date: "June 21, 2026",
  },
];

export default function DonationPage() {
  const [logs, setLogs] = useState<TransparencyLog[]>(INITIAL_LOGS);
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({});
  const [donorName, setDonorName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQtyChange = (itemId: string, diff: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + diff);
      return { ...prev, [itemId]: next };
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((sum, [id, qty]) => {
      const item = DONATION_ITEMS.find((di) => di.id === id);
      return sum + (item ? item.cost * qty : 0);
    }, 0);
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = calculateTotal();

    if (totalCost === 0) {
      toast.error("Please select at least one item to donate");
      return;
    }

    const pledgedItems = Object.entries(selectedItems)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = DONATION_ITEMS.find((di) => di.id === id)!;
        return { id, name: item.name, quantity: qty, cost: item.cost * qty };
      });

    setIsProcessing(true);
    toast.loading("Initiating secure donation gate...", { id: "donate" });

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: pledgedItems, donorName, total: totalCost }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Donation failed");
      toast.success("Thank you for your generous donation!", { id: "donate" });

      // Create new transparency log entries for the items donated
      const newLogs: TransparencyLog[] = Object.entries(selectedItems)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty], idx) => {
          const item = DONATION_ITEMS.find((di) => di.id === id)!;
          return {
            id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
            donorName: donorName || "Anonymous",
            itemName: item.name,
            quantity: qty,
            cost: item.cost * qty,
            status: "pending",
            date: new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          };
        });

      setLogs((prev) => [...newLogs, ...prev]);
      setSelectedItems({});
      setDonorName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Donation failed", { id: "donate" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        {/* Header Hero Banner */}
        <section
          className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-12 text-center"
          style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}
        >
          <MandalaBackground />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="text-4xl animate-bounce">❤️</div>
            <p className="section-eyebrow" style={{ color: "#E87722" }}>
              100% Transparent · Item-Based Giving
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--color-parchment)",
                lineHeight: 1.1,
              }}
            >
              Give Food, Books &amp; Care
            </h1>
            <p className="text-sm" style={{ color: "rgba(253,233,207,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
              In Vedic culture, daan (selfless giving) — feeding street dogs, serving the hungry, and educating a
              child — is a powerful karmic practice. Choose exactly what you want to give. We maintain total
              transparency: we buy the items and post photos of every distribution.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Item Donation Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                color: "#0F0A1E",
              }}
            >
              Select Items to Donate
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DONATION_ITEMS.map((item) => {
                const qty = selectedItems[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all"
                    style={{
                      background: "var(--color-ivory)",
                      border: qty > 0 ? "1px solid var(--color-gold)" : "1px solid rgba(209,168,110,0.15)",
                    }}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="text-sm font-bold" style={{ color: "#0F0A1E", fontFamily: "var(--font-body)" }}>
                          {formatPrice(item.cost)}
                        </span>
                      </div>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-3" style={{ background: "rgba(209,168,110,0.14)", color: "var(--color-gold-dark)" }}>
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-sm mt-2" style={{ color: "#0F0A1E", fontFamily: "var(--font-body)" }}>
                        {item.name}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "rgba(15,10,30,0.5)", fontFamily: "var(--font-body)" }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Counter Buttons */}
                    <div className="flex items-center gap-3 self-end">
                      <button
                        onClick={() => handleQtyChange(item.id, -1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all border"
                        style={{ borderColor: "rgba(15,10,30,0.2)", color: "#0F0A1E" }}
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-bold" style={{ color: "#0F0A1E" }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item.id, 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all border"
                        style={{ borderColor: "rgba(15,10,30,0.2)", color: "#0F0A1E" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout / Contribution form */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div
              className="p-6 md:p-8 rounded-3xl"
              style={{
                background: "var(--color-midnight)",
                border: "1px solid rgba(209,168,110,0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Heart size={18} style={{ color: "#E87722" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>
                  Your Contribution
                </h3>
              </div>

              {/* Items listing summary */}
              <div className="flex flex-col gap-3 mb-6 max-h-40 overflow-y-auto pr-1">
                {Object.entries(selectedItems).map(([id, qty]) => {
                  if (qty === 0) return null;
                  const item = DONATION_ITEMS.find((di) => di.id === id)!;
                  return (
                    <div key={id} className="flex justify-between text-xs">
                      <span style={{ color: "rgba(253,233,207,0.6)" }}>
                        {item.name} x {qty}
                      </span>
                      <span className="font-semibold" style={{ color: "#C9A227" }}>
                        {formatPrice(item.cost * qty)}
                      </span>
                    </div>
                  );
                })}
                {calculateTotal() === 0 && (
                  <p className="text-xs italic" style={{ color: "rgba(253,233,207,0.4)" }}>
                    No donation items selected yet.
                  </p>
                )}
              </div>

              <form onSubmit={handleDonateSubmit} className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(253,233,207,0.5)" }}>
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Anonymous"
                    className="input-field w-full text-white bg-white/5 border-white/15 focus:border-[#C9A227]"
                  />
                </div>

                <div className="flex justify-between items-baseline mt-4">
                  <span className="text-sm font-semibold" style={{ color: "var(--color-parchment)" }}>Total Donation</span>
                  <span className="text-2xl font-bold" style={{ color: "var(--color-gold)" }}>
                    {formatPrice(calculateTotal())}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gold w-full mt-4 h-12 flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #E87722, #C9A227)", color: "#fff" }}
                >
                  <Sparkles size={16} /> {isProcessing ? "Processing Secure Gate..." : "Complete Donation"}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[10px]" style={{ color: "rgba(253,233,207,0.4)" }}>
                  <ShieldCheck size={12} style={{ color: "#E87722" }} />
                  <span>80G Tax Exemption Certificate receipt provided</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Public Transparency Log */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "#0F0A1E",
              marginBottom: "1.5rem",
            }}
          >
            Public Transparency Log
          </h2>

          <div
            className="rounded-3xl overflow-hidden border border-[rgba(209,168,110,0.2)]"
            style={{ background: "var(--color-ivory)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" style={{ fontFamily: "var(--font-body)" }}>
                <thead>
                  <tr style={{ background: "var(--color-midnight)", color: "var(--color-parchment)" }}>
                    <th className="px-6 py-4 font-semibold">Donor</th>
                    <th className="px-6 py-4 font-semibold">Donated Item</th>
                    <th className="px-6 py-4 font-semibold">Cost</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,162,39,0.12)]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-black/[0.02]">
                      <td className="px-6 py-4 font-bold" style={{ color: "#0F0A1E" }}>{log.donorName}</td>
                      <td className="px-6 py-4" style={{ color: "rgba(15,10,30,0.7)" }}>
                        {log.itemName} <span className="font-semibold">(x{log.quantity})</span>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: "#0F0A1E" }}>{formatPrice(log.cost)}</td>
                      <td className="px-6 py-4">
                        {log.status === "delivered" ? (
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="flex items-center gap-1 text-[#4CAF50] font-semibold text-xs bg-[#4CAF50]/10 px-2 py-0.5 rounded-full">
                              <CheckCircle size={12} /> Delivered
                            </span>
                            {log.proofPhoto && (
                              <a
                                href={log.proofPhoto}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] underline font-bold hover:text-[#0F0A1E]"
                                style={{ color: "#C9A227" }}
                              >
                                View Photo Proof
                              </a>
                            )}
                          </div>
                        ) : log.status === "collected" ? (
                          <span className="flex items-center gap-1 text-[#C9A227] font-semibold text-xs bg-[#C9A227]/10 px-2 py-0.5 rounded-full">
                            <Clock size={12} /> Collected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 font-semibold text-xs bg-gray-500/10 px-2 py-0.5 rounded-full">
                            <Clock size={12} /> Pending Purchase
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs" style={{ color: "rgba(15,10,30,0.5)" }}>{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
