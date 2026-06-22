"use client";

import { useEffect, useState } from "react";
import { MandalaBackground } from "@/components/MandalaBackground";
import { Sparkles, MessageSquare, Send, BellRing, Lock, User, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth/AuthProvider";

const SUGGESTED_PROMPTS = [
  "What does my Saturn return in Aquarius mean?",
  "How will the Jupiter transit affect my career?",
  "Is there any Kaal Sarp Dosh in my chart?",
  "Which gemstone is best for my Aries Ascendant?",
];

const CREDIBILITY_ITEMS = [
  "Trained on 1,00,000+ modern charts.",
  "Based on teachings from top 50 astrologers of India.",
  "Includes courses, research, and personal analysis database.",
  "Future versions will answer using your saved birth kundli details.",
];

export default function AiChatPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail((e) => e || user.email!);
  }, [user]);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Namaste! I am the AI Astrologer. I am currently in private beta testing. Once launched, I can analyze your birth chart in real-time. Join the waitlist to get early access!",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast.loading("Securing your spot...", { id: "waitlist" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "ai_chat" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not join waitlist");
      toast.success(data.message || "Welcome aboard! You have joined the waitlist.", { id: "waitlist" });
      setIsJoined(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join waitlist", { id: "waitlist" });
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputText("");

    // Simulate bot response after a brief pause
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "To unlock personalized chart predictions and ask unlimited questions, please secure your spot on the waitlist above. We are rolling out access in batches!",
        },
      ]);
    }, 1000);
  };

  return (
    <div
      style={{ background: "var(--color-parchment)", minHeight: "100vh" }}
      className="pt-24 pb-16 flex items-center"
    >
      <MandalaBackground />

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Waitlist Pitch */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="badge badge-saffron">
                🔮 AI ASTROLOGER BETA
              </span>
              <h1
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                  color: "var(--color-midnight)",
                  lineHeight: 1.05,
                }}
              >
                Unlock Your Personal Cosmic AI
              </h1>
              <p
                className="text-sm mt-3 leading-relaxed"
                style={{ color: "rgba(45, 41, 38, 0.7)", fontFamily: "var(--font-body)" }}
              >
                Instant, highly personalized Vedic interpretations powered by machine learning and India&apos;s finest classical wisdom.
              </p>
            </div>

            {/* Credibility Chips list */}
            <div className="flex flex-col gap-3">
              {CREDIBILITY_ITEMS.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center text-xs" style={{ color: "rgba(45, 41, 38, 0.8)" }}>
                  <span className="text-[var(--color-gold)]">✦</span>
                  <span style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Waitlist Form card */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                background: "var(--color-ivory)",
                borderColor: "rgba(209, 168, 110, 0.25)",
              }}
            >
              {!isJoined ? (
                <form onSubmit={handleJoinWaitlist} className="flex flex-col gap-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-gold)] flex items-center gap-1.5">
                    <BellRing size={12} className="animate-bounce" /> Join the Batched Waitlist
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="input-field flex-1"
                    />
                    <button type="submit" className="btn-gold shrink-0 px-5 text-xs py-2">
                      Join Waitlist
                    </button>
                  </div>
                  <p className="text-[10px]" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                    No spam. Get notified the instant your chart prediction module becomes ready.
                  </p>
                </form>
              ) : (
                <div className="flex items-center gap-3 text-sm font-semibold text-[#4CAF50] py-2">
                  <UserCheck size={20} />
                  <span>You are on the waitlist! We will contact you soon.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Interactive Chat Console Mock */}
          <div className="lg:col-span-6">
            <div
              className="rounded-3xl border overflow-hidden flex flex-col h-[480px]"
              style={{
                background: "var(--color-ivory)",
                borderColor: "rgba(209, 168, 110, 0.25)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Console Header */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: "rgba(209, 168, 110, 0.15)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-saffron)] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-midnight)" }}>
                    AI Astrologer Mockup
                  </span>
                </div>
                <Lock size={12} style={{ color: "rgba(45, 41, 38, 0.4)" }} />
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === "user" ? "self-end" : "self-start"
                    }`}
                    style={{
                      background: msg.sender === "user" ? "var(--color-gold)" : "var(--color-parchment)",
                      color: msg.sender === "user" ? "var(--color-midnight)" : "var(--color-midnight)",
                      border: msg.sender === "user" ? "none" : "1px solid rgba(209, 168, 110, 0.15)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="px-6 pb-2">
                <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
                  Suggested Prompts
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-3 py-1.5 rounded-full text-[10px] transition-all hover:bg-black/5"
                      style={{
                        background: "var(--color-parchment)",
                        border: "1px solid rgba(209, 168, 110, 0.15)",
                        color: "rgba(45, 41, 38, 0.8)",
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div
                className="p-4 flex gap-2 border-t"
                style={{ borderColor: "rgba(209, 168, 110, 0.15)" }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a cosmic question..."
                  className="input-field flex-1 text-xs h-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                />
                <button
                  onClick={() => handleSendMessage(inputText)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all hover:bg-[var(--color-gold)]"
                  style={{ background: "rgba(209, 168, 110, 0.15)", color: "var(--color-gold)" }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
