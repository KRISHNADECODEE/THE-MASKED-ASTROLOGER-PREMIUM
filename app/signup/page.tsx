"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { MandalaBackground } from "@/components/MandalaBackground";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Mail, Lock, User as UserIcon } from "lucide-react";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    // If email confirmation is enabled there is no active session yet.
    if (data.session) {
      toast.success("Account created!");
      router.push(next);
      router.refresh();
    } else {
      toast.success("Check your email to confirm your account.");
      router.push("/login");
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) toast.error(error.message);
  };

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
              <UserPlus size={20} style={{ color: "var(--color-gold)" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-midnight)" }}>
              Begin Your Cosmic Journey
            </h1>
            <p className="text-xs mt-2" style={{ color: "rgba(45, 41, 38, 0.6)", fontFamily: "var(--font-body)" }}>
              Create an account to save kundlis, track orders, and book sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold mb-5 transition-all hover:bg-white"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(45,41,38,0.15)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "rgba(45,41,38,0.12)" }} />
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(45,41,38,0.4)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(45,41,38,0.12)" }} />
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45, 41, 38, 0.6)" }}>Full Name</label>
              <div className="relative">
                <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45,41,38,0.3)" }} />
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name" className="input-field w-full pl-9 text-[var(--color-midnight)] bg-white/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45, 41, 38, 0.6)" }}>Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45,41,38,0.3)" }} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com" className="input-field w-full pl-9 text-[var(--color-midnight)] bg-white/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45, 41, 38, 0.6)" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45,41,38,0.3)" }} />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters" className="input-field w-full pl-9 text-[var(--color-midnight)] bg-white/50" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 h-11 flex items-center justify-center gap-2">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: "rgba(45, 41, 38, 0.55)", fontFamily: "var(--font-body)" }}>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold hover:underline" style={{ color: "var(--color-gold)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.39 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z" />
    </svg>
  );
}
