"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function WaitlistForm() {
  const { user } = useAuth();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined]   = useState(false);

  // Pre-fill with the signed-in user's email.
  useEffect(() => {
    if (user?.email) setEmail((e) => e || user.email!);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "home_hero" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not join waitlist");
      setJoined(true);
      toast.success("You're on the waitlist! We'll notify you first. ✨");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join waitlist");
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <div
        className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl animate-fade-in"
        style={{ background: "rgba(209,168,110,0.1)", border: "1px solid rgba(209,168,110,0.3)" }}
      >
        <span className="text-3xl">🌟</span>
        <p className="font-semibold" style={{ color: "var(--color-gold-dark)", fontFamily: "var(--font-body)" }}>
          You're on the list!
        </p>
        <p className="text-sm text-center" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)" }}>
          We'll let you know when AI Astrologer goes live.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <div className="relative flex-1">
        <Mail
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "rgba(45,41,38,0.4)" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="input-field pl-10 h-12"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-gold h-12 px-6 flex-shrink-0 flex items-center gap-2"
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-midnight border-t-transparent animate-spin" style={{ borderTopColor: "transparent", borderColor: "var(--color-midnight)" }} />
        ) : (
          <>
            Join Waitlist <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}
