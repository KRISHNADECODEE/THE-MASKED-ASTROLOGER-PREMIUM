"use client";

import { useState } from "react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { formatPrice } from "@/lib/utils";
import {
  User,
  LogOut,
  Calendar,
  ShoppingBag,
  BookOpen,
  FileText,
  Key,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Priyesh Shah",
    email: "priyesh@gmail.com",
    phone: "+91 98765 43210",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"kundlis" | "orders" | "bookings" | "courses">("kundlis");

  const mockSavedKundlis = [
    { id: "k-1", name: "Priyesh Shah", dob: "15 Aug 1995", tob: "14:30", pob: "Mumbai, India" },
    { id: "k-2", name: "Ananya Shah (Partner)", dob: "22 Nov 1997", tob: "08:15", pob: "Pune, India" },
  ];

  const mockOrders = [
    { id: "ORD-984312", date: "June 21, 2026", total: 14750, status: "Paid / Processing" },
    { id: "ORD-431872", date: "May 10, 2026", total: 3200, status: "Delivered" },
  ];

  const mockBookings = [
    { id: "b-1", service: "Live 1:1 Session (60m)", date: "June 25, 2026", slot: "04:00 PM - 05:00 PM", status: "Scheduled" },
  ];

  const mockCourses = [
    { id: "c-1", title: "Vedic Astrology Foundations", progress: 65, slug: "vedic-astrology-foundations" },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    if (!otpSent) {
      toast.loading("Sending 6-digit OTP code...", { id: "otp" });
      setTimeout(() => {
        toast.success("OTP sent to your email!", { id: "otp" });
        setOtpSent(true);
      }, 1500);
    } else {
      if (otpCode.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }
      toast.loading("Authenticating credentials...", { id: "auth" });
      setTimeout(() => {
        toast.success("Welcome back!", { id: "auth" });
        setIsLoggedIn(true);
        setProfile({
          name: loginEmail.split("@")[0],
          email: loginEmail,
          phone: "+91 99999 88888",
        });
        setOtpSent(false);
        setOtpCode("");
      }, 1500);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  if (!isLoggedIn) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-parchment) 0%, var(--color-ivory) 100%)" }}
      >
        <MandalaBackground />

        <div className="container-xl relative z-10 max-w-md px-6">
          <div
            className="p-8 md:p-10 rounded-3xl"
            style={{
              background: "rgba(244, 239, 230, 0.8)",
              border: "1px solid rgba(209, 168, 110, 0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="text-center mb-8 flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(209, 168, 110, 0.15)", border: "1px solid rgba(209, 168, 110, 0.25)" }}
              >
                <Key size={20} style={{ color: "var(--color-gold)" }} />
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  color: "var(--color-midnight)",
                }}
              >
                Access Your Cosmic Portal
              </h1>
              <p
                className="text-xs mt-2"
                style={{ color: "rgba(45, 41, 38, 0.6)", fontFamily: "var(--font-body)" }}
              >
                Enter your email address to receive a secure one-time password (OTP) code.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45, 41, 38, 0.6)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled={otpSent}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="input-field w-full text-[var(--color-midnight)] bg-white/50 border-black/10 focus:border-[var(--color-gold)] disabled:opacity-50"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45, 41, 38, 0.6)" }}>
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="input-field w-full text-center text-[var(--color-midnight)] bg-white/50 border-black/10 focus:border-[var(--color-gold)] font-mono tracking-widest text-lg"
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn-gold w-full mt-2 h-11 flex items-center justify-center gap-2"
              >
                {otpSent ? "Verify OTP & Login" : "Send Login Link"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-center hover:underline mt-2 cursor-pointer"
                  style={{ color: "rgba(45, 41, 38, 0.5)" }}
                >
                  Change Email Address
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        {/* Header Profile Dashboard info */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, var(--color-midnight), var(--color-midnight-800))",
            border: "1px solid rgba(209, 168, 110, 0.25)",
          }}
        >
          <div className="flex gap-4 items-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))", color: "var(--color-midnight)" }}
            >
              PS
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  color: "var(--color-parchment)",
                }}
              >
                {profile.name}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "rgba(250, 245, 237, 0.6)", fontFamily: "var(--font-body)" }}>
                {profile.email} · {profile.phone}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-red-950/20"
            style={{ border: "1px solid rgba(250, 245, 237, 0.15)", color: "rgba(250, 245, 237, 0.6)", fontFamily: "var(--font-body)" }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {[
              { id: "kundlis",  label: "Saved Kundlis",  icon: <FileText size={16} /> },
              { id: "orders",   label: "Store Orders",   icon: <ShoppingBag size={16} /> },
              { id: "bookings", label: "Consultations",  icon: <Calendar size={16} /> },
              { id: "courses",  label: "My Courses",     icon: <BookOpen size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

          {/* Tab Panel */}
          <div
            className="lg:col-span-9 p-6 md:p-8 rounded-3xl"
            style={{
              background: "var(--color-ivory)",
              border: "1px solid rgba(209, 168, 110, 0.2)",
            }}
          >
            {/* Saved Kundlis */}
            {activeTab === "kundlis" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)" }}>
                    Your Saved Charts
                  </h2>
                  <Link href="/kundli" className="btn-gold text-xs px-4 py-2">
                    Create New Chart
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {mockSavedKundlis.map((k) => (
                    <div
                      key={k.id}
                      className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}
                    >
                      <div style={{ fontFamily: "var(--font-body)" }}>
                        <p className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{k.name}</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                          {k.dob} · {k.tob} · {k.pob}
                        </p>
                      </div>
                      <Link
                        href="/kundli"
                        className="text-xs font-bold flex items-center gap-1 hover:underline"
                        style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}
                      >
                        Open Chart <ChevronRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Store Orders */}
            {activeTab === "orders" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "1.5rem" }}>
                  Order History
                </h2>

                <div className="flex flex-col gap-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}
                    >
                      <div style={{ fontFamily: "var(--font-body)" }}>
                        <div className="flex gap-2.5 items-center">
                          <span className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{order.id}</span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: order.status.includes("Paid") ? "rgba(76, 175, 80, 0.1)" : "rgba(209, 168, 110, 0.1)",
                              color: order.status.includes("Paid") ? "#4CAF50" : "var(--color-gold)",
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                          Placed on {order.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                          {formatPrice(order.total)}
                        </span>
                        <button
                          onClick={() => toast.success("Invoice PDF download initiated")}
                          className="text-xs font-bold flex items-center gap-1 hover:underline"
                          style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}
                        >
                          Invoice <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consultations */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)" }}>
                    Your Booked Sessions
                  </h2>
                  <Link href="/consultation" className="btn-gold text-xs px-4 py-2">
                    Book Another Session
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {mockBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}
                    >
                      <div style={{ fontFamily: "var(--font-body)" }}>
                        <div className="flex gap-2.5 items-center">
                          <span className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{b.service}</span>
                          <span className="text-[10px] font-semibold bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-0.5 rounded-full">
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                          {b.date} · {b.slot}
                        </p>
                      </div>
                      <button
                        onClick={() => toast.success("Launching virtual consultation slot...")}
                        className="text-xs font-bold flex items-center gap-1 hover:underline"
                        style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}
                      >
                        Join Zoom Room <ExternalLink size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Courses */}
            {activeTab === "courses" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)", marginBottom: "1.5rem" }}>
                  Your Enrolled Courses
                </h2>

                <div className="flex flex-col gap-4">
                  {mockCourses.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      style={{ background: "var(--color-parchment)", border: "1px solid rgba(209, 168, 110, 0.15)" }}
                    >
                      <div className="flex-1" style={{ fontFamily: "var(--font-body)" }}>
                        <p className="font-semibold text-sm" style={{ color: "var(--color-midnight)" }}>{c.title}</p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 mt-2 max-w-xs">
                          <div className="flex-1 bg-black/10 h-1 rounded-full overflow-hidden">
                            <div className="bg-[var(--color-gold)] h-full" style={{ width: `${c.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                            {c.progress}% completed
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/courses/${c.slug}/learn`}
                        className="btn-gold text-xs px-4 py-2 shrink-0 flex items-center gap-1"
                      >
                        Resume Lectures <ChevronRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
