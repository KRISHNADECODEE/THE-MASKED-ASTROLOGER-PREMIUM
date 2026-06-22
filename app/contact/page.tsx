"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MandalaBackground } from "@/components/MandalaBackground";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, Phone, MapPin, User, MessageSquare, Send, CheckCircle2 } from "lucide-react";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email! }));
  }, [user]);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "Message must be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send message");
      setSent(true);
      toast.success("Message sent! We'll reply within 24 hours.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError?: string) =>
    `input-field w-full ${hasError ? "" : ""}`;

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="relative pt-24 pb-14 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Get in Touch · We&apos;re Here to Help</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "var(--color-parchment)", lineHeight: 1.05, marginBottom: "0.75rem" }}>
            Contact Us
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
            Questions about a reading, an order, or a booking? Send us a message and our team will respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="container-xl py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Mail, label: "Email", value: "support@maskedastrologer.com", href: "mailto:support@maskedastrologer.com" },
              { icon: Phone, label: "Phone / WhatsApp", value: "+91 90000 00000", href: "tel:+919000000000" },
              { icon: MapPin, label: "Location", value: "New Delhi, India", href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-2xl p-5 flex items-start gap-3" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(209,168,110,0.12)", color: "var(--color-gold-dark)" }}><Icon size={18} /></span>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-semibold hover:underline" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{value}</a>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form / success */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="rounded-2xl p-10 text-center flex flex-col items-center gap-4" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.25)" }}>
                <CheckCircle2 size={48} style={{ color: "#4CAF50" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--color-midnight)" }}>Message Sent!</h2>
                <p className="text-sm max-w-md" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
                  Thank you, {form.name.split(" ")[0]}. We&apos;ve received your message and will reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: user?.email ?? "", subject: "", message: "" }); }} className="btn-gold text-xs px-5 py-2.5 mt-2">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="rounded-2xl p-6 md:p-8 flex flex-col gap-5" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.25)" }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Your Name" icon={User} error={errors.name}>
                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputStyle(errors.name)} style={errors.name ? { borderColor: "#D44E4E" } : undefined} />
                  </Field>
                  <Field label="Email Address" icon={Mail} error={errors.email}>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className={inputStyle(errors.email)} style={errors.email ? { borderColor: "#D44E4E" } : undefined} />
                  </Field>
                </div>

                <Field label="Subject (optional)">
                  <input type="text" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="What's this about?" className="input-field w-full" />
                </Field>

                <Field label="Message" icon={MessageSquare} error={errors.message}>
                  <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="How can we help you?" rows={5} className="input-field w-full resize-none" style={errors.message ? { borderColor: "#D44E4E" } : undefined} />
                </Field>

                <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? (
                    <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-midnight)", borderTopColor: "transparent" }} />
                  ) : (
                    <>Send Message <Send size={15} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, error, children }: { label: string; icon?: typeof User; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: "rgba(45,41,38,0.6)" }}>
        {Icon && <Icon size={13} />} {label}
      </label>
      {children}
      {error && <p className="text-xs mt-1.5" style={{ color: "#D44E4E", fontFamily: "var(--font-body)" }}>{error}</p>}
    </div>
  );
}
