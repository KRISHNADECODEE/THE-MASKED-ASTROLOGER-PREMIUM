"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  LogOut,
  Calendar,
  ShoppingBag,
  BookOpen,
  FileText,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Booking, Order, OrderItem, Profile, SavedKundli } from "@/lib/supabase/types";

type OrderWithItems = Order & { order_items: OrderItem[] };
type Tab = "kundlis" | "orders" | "bookings" | "courses";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const paidLike = (s: Order["status"]) => ["paid", "processing", "shipped", "delivered"].includes(s);

export function AccountDashboard({
  profile,
  isAdmin = false,
  kundlis,
  orders,
  bookings,
}: {
  profile: Profile;
  isAdmin?: boolean;
  kundlis: SavedKundli[];
  orders: OrderWithItems[];
  bookings: Booking[];
}) {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("kundlis");

  const displayName = profile.full_name || profile.email?.split("@")[0] || "Cosmic Seeker";
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        {/* Header */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))",
            border: "1px solid rgba(209, 168, 110, 0.25)",
          }}
        >
          <div className="flex gap-4 items-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))", color: "var(--color-midnight)" }}
            >
              {initials}
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-parchment)" }}>
                {displayName}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "rgba(250, 245, 237, 0.6)", fontFamily: "var(--font-body)" }}>
                {profile.email}
                {profile.phone ? ` · ${profile.phone}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "rgba(209,168,110,0.18)", border: "1px solid var(--color-gold)", color: "var(--color-gold-light)", fontFamily: "var(--font-body)" }}
              >
                <ShieldCheck size={14} /> Admin Panel
              </Link>
            )}
            <button
              onClick={async () => {
                await signOut();
                toast.success("Logged out successfully");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-red-950/20"
              style={{ border: "1px solid rgba(250, 245, 237, 0.15)", color: "rgba(250, 245, 237, 0.6)", fontFamily: "var(--font-body)" }}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {([
              { id: "kundlis", label: "Saved Kundlis", icon: <FileText size={16} /> },
              { id: "orders", label: "Store Orders", icon: <ShoppingBag size={16} /> },
              { id: "bookings", label: "Consultations", icon: <Calendar size={16} /> },
              { id: "courses", label: "My Courses", icon: <BookOpen size={16} /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 w-full text-left"
                style={{
                  background: activeTab === tab.id ? "var(--color-midnight)" : "var(--color-ivory)",
                  color: activeTab === tab.id ? "var(--color-parchment)" : "rgba(45, 41, 38, 0.7)",
                  border: `1px solid ${activeTab === tab.id ? "var(--color-midnight)" : "rgba(209, 168, 110, 0.25)"}`,
                  fontFamily: "var(--font-body)",
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div
            className="lg:col-span-9 p-6 md:p-8 rounded-3xl"
            style={{ background: "var(--color-ivory)", border: "1px solid rgba(209, 168, 110, 0.2)" }}
          >
            {/* Saved Kundlis */}
            {activeTab === "kundlis" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)" }}>
                    Your Saved Charts
                  </h2>
                  <Link href="/kundli" className="btn-gold text-xs px-4 py-2">Create New Chart</Link>
                </div>
                {kundlis.length === 0 ? (
                  <EmptyState text="No saved charts yet. Generate your first kundli to see it here." cta={{ href: "/kundli", label: "Generate Kundli" }} />
                ) : (
                  <div className="flex flex-col gap-4">
                    {kundlis.map((k) => (
                      <div key={k.id} className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}>
                        <div style={{ fontFamily: "var(--font-body)" }}>
                          <p className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{k.name}</p>
                          <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                            {[k.dob, k.tob, k.pob].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <Link href="/kundli" className="text-xs font-bold flex items-center gap-1 hover:underline"
                          style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                          Open Chart <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Store Orders */}
            {activeTab === "orders" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "1.5rem" }}>
                  Order History
                </h2>
                {orders.length === 0 ? (
                  <EmptyState text="No orders yet. Explore the store for gemstones, yantras and remedies." cta={{ href: "/store", label: "Visit Store" }} />
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}>
                        <div style={{ fontFamily: "var(--font-body)" }}>
                          <div className="flex gap-2.5 items-center">
                            <span className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{order.order_number}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                              style={{
                                background: paidLike(order.status) ? "rgba(76, 175, 80, 0.1)" : "rgba(209, 168, 110, 0.1)",
                                color: paidLike(order.status) ? "#4CAF50" : "var(--color-gold)",
                              }}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                            Placed on {fmtDate(order.created_at)} · {order.order_items?.length ?? 0} item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                            {formatPrice(Number(order.total))}
                          </span>
                          <button onClick={() => toast.success("Invoice PDF download initiated")}
                            className="text-xs font-bold flex items-center gap-1 hover:underline"
                            style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                            Invoice <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Consultations */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)" }}>
                    Your Booked Sessions
                  </h2>
                  <Link href="/consultation" className="btn-gold text-xs px-4 py-2">Book Another Session</Link>
                </div>
                {bookings.length === 0 ? (
                  <EmptyState text="No consultations booked yet." cta={{ href: "/consultation", label: "Book a Session" }} />
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}>
                        <div style={{ fontFamily: "var(--font-body)" }}>
                          <div className="flex gap-2.5 items-center">
                            <span className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{b.service_title || b.service_id}</span>
                            <span className="text-[10px] font-semibold bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-0.5 rounded-full capitalize">
                              {b.status}
                            </span>
                          </div>
                          <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                            {b.slot_date} · {b.slot_time}
                          </p>
                        </div>
                        {b.zoom_link ? (
                          <a href={b.zoom_link} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-bold flex items-center gap-1 hover:underline"
                            style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                            Join Zoom Room <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(45,41,38,0.4)" }}>Link sent on confirmation</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Courses */}
            {activeTab === "courses" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "1.5rem" }}>
                  Your Enrolled Courses
                </h2>
                <EmptyState text="You haven't enrolled in any courses yet." cta={{ href: "/courses", label: "Browse Courses" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text, cta }: { text: string; cta: { href: string; label: string } }) {
  return (
    <div className="text-center py-16 rounded-xl" style={{ background: "var(--color-parchment)", border: "1px dashed rgba(209,168,110,0.3)" }}>
      <p className="text-sm mb-4" style={{ color: "rgba(45, 41, 38, 0.55)", fontFamily: "var(--font-body)" }}>{text}</p>
      <Link href={cta.href} className="btn-gold text-xs px-4 py-2">{cta.label}</Link>
    </div>
  );
}
