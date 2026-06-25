"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/locale/LocaleProvider";
import { istSlotToLocal, timeZoneAbbr, isIST } from "@/lib/locale/timezone";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "06:00 PM", "07:00 PM",
];

interface Service { id: string; title: string; price: number; }

export function BookingForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service");
  const defaultServiceId =
    requestedService && services.some((s) => s.id === requestedService)
      ? requestedService
      : services[1]?.id || "";

  const [form, setForm] = useState({
    serviceId: defaultServiceId,
    name: "", email: "", phone: "",
    dob: "", tob: "", pob: "",
    slot: "", question: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { money, timezone } = useLocale();
  const tzAbbr = timeZoneAbbr(timezone);
  const userIsIST = isIST(timezone);

  const selectedService = services.find((s) => s.id === form.serviceId);
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slot) {
      toast.error("Please pick a preferred time slot.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/consultation/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          serviceId: form.serviceId,
          serviceTitle: selectedService?.title,
          // No date picker yet — default the slot to today; the chosen time is form.slot.
          slotDate: new Date().toISOString().slice(0, 10),
          slotTime: form.slot,
          birthDetails: { dob: form.dob, tob: form.tob, pob: form.pob, question: form.question },
          amount: selectedService?.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setDone(true);
      toast.success("Booking confirmed! You'll receive a WhatsApp confirmation shortly.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-12 rounded-2xl" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209, 168, 110, 0.25)" }}>
        <div className="text-5xl mb-4">🌟</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-midnight)" }}>Booking Confirmed!</h3>
        <p className="mt-3 mb-6 text-sm" style={{ color: "rgba(45, 41, 38, 0.55)", fontFamily: "var(--font-body)" }}>
          We'll send a WhatsApp confirmation to <strong>{form.phone}</strong> within 2 hours.
          Please also check your email at <strong>{form.email}</strong>.
        </p>
        <p className="text-xs" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
          Reference: #TMA-{Math.random().toString(36).slice(2, 8).toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(209, 168, 110, 0.25)" }}
    >
      <div className="p-8 flex flex-col gap-6">

        {/* Service selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
            Select Service
          </label>
          <div className="flex flex-col gap-2">
            {services.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: form.serviceId === s.id ? "rgba(209, 168, 110, 0.08)" : "var(--color-parchment)",
                  border: `1.5px solid ${form.serviceId === s.id ? "var(--color-gold)" : "rgba(209, 168, 110, 0.15)"}`,
                }}
              >
                <input type="radio" name="service" value={s.id} checked={form.serviceId === s.id}
                  onChange={() => update("serviceId", s.id)} className="accent-gold" style={{ accentColor: "var(--color-gold)" }} />
                <span className="flex-1 text-sm font-medium" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{s.title}</span>
                <span className="font-bold text-sm" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{money(s.price)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Personal details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "name",  label: "Full Name",     placeholder: "Your name",       icon: User,   type: "text" },
            { key: "email", label: "Email Address",  placeholder: "you@email.com",   icon: Mail,   type: "email" },
            { key: "phone", label: "WhatsApp Number",placeholder: "+91 98765 43210", icon: Phone,  type: "tel" },
            { key: "pob",   label: "Place of Birth", placeholder: "City, Country",   icon: null,   type: "text" },
          ].map(({ key, label, placeholder, icon: Icon, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>{label}</label>
              <div className="relative">
                {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45, 41, 38, 0.3)" }} />}
                <input type={type} required value={(form as Record<string, string>)[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className={`input-field ${Icon ? "pl-10" : ""}`} />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>Date of Birth</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45, 41, 38, 0.3)" }} />
              <input type="date" required value={form.dob} onChange={(e) => update("dob", e.target.value)}
                max={new Date().toISOString().split("T")[0]} className="input-field pl-10" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>Time of Birth</label>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(45, 41, 38, 0.3)" }} />
              <input type="time" value={form.tob} onChange={(e) => update("tob", e.target.value)} className="input-field pl-10" />
            </div>
          </div>
        </div>

        {/* Slot picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(45, 41, 38, 0.5)" }}>
            Preferred Time Slot
          </label>
          {!userIsIST && (
            <p className="text-[11px] mb-3" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
              Showing in your local time ({tzAbbr}) · Sessions are conducted in IST
            </p>
          )}
          {userIsIST && (
            <p className="text-[11px] mb-3" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
              All times in IST (Indian Standard Time)
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => {
              const localSlot = userIsIST ? slot : istSlotToLocal(slot, timezone);
              return (
                <button type="button" key={slot} onClick={() => update("slot", slot)}
                  className="flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: form.slot === slot ? "var(--color-midnight)" : "var(--color-parchment)",
                    color: form.slot === slot ? "var(--color-parchment)" : "rgba(45, 41, 38, 0.6)",
                    border: `1.5px solid ${form.slot === slot ? "var(--color-midnight)" : "rgba(209, 168, 110, 0.15)"}`,
                    fontFamily: "var(--font-body)",
                  }}>
                  <span>{localSlot}</span>
                  {!userIsIST && (
                    <span className="text-[10px] mt-0.5 opacity-60">{slot} IST</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45, 41, 38, 0.5)" }}>Your Question / Area of Focus</label>
          <div className="relative">
            <MessageSquare size={14} className="absolute left-3 top-3" style={{ color: "rgba(45, 41, 38, 0.3)" }} />
            <textarea value={form.question} onChange={(e) => update("question", e.target.value)}
              placeholder="e.g., I want to understand my career path and when I should expect a promotion..."
              rows={3} className="input-field pl-10 resize-none" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-2" style={{ borderTop: "1px solid rgba(209, 168, 110, 0.15)" }}>
          {selectedService && (
            <div className="flex justify-between text-sm">
              <span style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>Total</span>
              <span className="font-bold text-base" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>{money(selectedService.price)}</span>
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-gold w-full py-4 flex items-center justify-center gap-2">
            {loading ? (
              <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-midnight)", borderTopColor: "transparent" }} />
            ) : (
              <>Pay & Confirm Booking <ChevronRight size={16} /></>
            )}
          </button>
          <p className="text-xs text-center" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
            Secure payment via Razorpay · Instant WhatsApp confirmation
          </p>
        </div>
      </div>
    </form>
  );
}
