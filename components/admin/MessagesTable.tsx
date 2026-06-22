"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { updateContactStatus } from "@/app/admin/actions";
import { StatusSelect, Empty } from "@/components/admin/OrdersTable";
import type { ContactMessage, ContactStatus } from "@/lib/supabase/types";

const STATUSES: ContactStatus[] = ["new", "read", "replied", "archived"];

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) return <Empty label="No messages yet." />;
  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <MessageCard key={m.id} msg={m} />
      ))}
    </div>
  );
}

function MessageCard({ msg }: { msg: ContactMessage }) {
  const [status, setStatus] = useState<ContactStatus>(msg.status);
  const [pending, start] = useTransition();

  const onChange = (next: ContactStatus) => {
    const prev = status;
    setStatus(next);
    start(async () => {
      const res = await updateContactStatus(msg.id, next);
      if (!res.ok) { setStatus(prev); toast.error(res.error || "Update failed"); }
      else toast.success(`Marked ${next}`);
    });
  };

  return (
    <div className="p-5 rounded-xl flex flex-col gap-3" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div style={{ fontFamily: "var(--font-body)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm" style={{ color: "var(--color-midnight)" }}>{msg.name}</span>
            {status === "new" && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(76,175,80,0.12)", color: "#4CAF50" }}>NEW</span>}
            {msg.subject && <span className="text-xs" style={{ color: "var(--color-gold-dark)" }}>· {msg.subject}</span>}
          </div>
          <a href={`mailto:${msg.email}`} className="text-xs hover:underline" style={{ color: "rgba(45,41,38,0.55)" }}>{msg.email}</a>
          <span className="text-[11px] ml-2" style={{ color: "rgba(45,41,38,0.4)" }}>{new Date(msg.created_at).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusSelect value={status} options={STATUSES} disabled={pending} onChange={onChange} />
          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your enquiry")}`} className="btn-gold text-xs px-3 py-2">Reply</a>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(45,41,38,0.75)", fontFamily: "var(--font-body)", lineHeight: 1.7, background: "var(--color-parchment)", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>{msg.message}</p>
    </div>
  );
}
