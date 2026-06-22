"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { saveSetting } from "@/app/admin/actions";
import type { Json } from "@/lib/supabase/types";
import type { AnnouncementValue, SupportValue, HeroValue } from "@/app/admin/settings/page";

export function SettingsForm({
  announcement: a0,
  support: s0,
  hero: h0,
}: {
  announcement: AnnouncementValue;
  support: SupportValue;
  hero: HeroValue;
}) {
  const [announcement, setAnnouncement] = useState(a0);
  const [support, setSupport] = useState(s0);
  const [hero, setHero] = useState(h0);
  const [pending, start] = useTransition();

  const save = (key: string, value: Json, label: string) =>
    start(async () => {
      const res = await saveSetting(key, value);
      if (!res.ok) toast.error(res.error || "Save failed");
      else toast.success(`${label} saved ✓`);
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Announcement banner */}
      <Section title="Announcement Banner" desc="A dismissible bar shown at the very top of every page.">
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--color-midnight)" }}>
          <input
            type="checkbox"
            checked={announcement.enabled}
            onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
            style={{ accentColor: "var(--color-gold)" }}
          />
          Show banner
        </label>
        <Field label="Banner text" value={announcement.text} onChange={(v) => setAnnouncement({ ...announcement, text: v })} placeholder="🎉 Diwali Sale — 20% off all gemstones!" />
        <Field label="Link (optional)" value={announcement.href} onChange={(v) => setAnnouncement({ ...announcement, href: v })} placeholder="/store" />
        <SaveBtn pending={pending} onClick={() => save("announcement", announcement as unknown as Json, "Announcement")} />
      </Section>

      {/* Support contact */}
      <Section title="Support Contact" desc="Shown in the footer and on support pages.">
        <Field label="Email" value={support.email} onChange={(v) => setSupport({ ...support, email: v })} placeholder="hello@maskedastrologer.com" />
        <Field label="Phone" value={support.phone} onChange={(v) => setSupport({ ...support, phone: v })} placeholder="+91 98765 43210" />
        <SaveBtn pending={pending} onClick={() => save("support", support as unknown as Json, "Support contact")} />
      </Section>

      {/* Hero copy */}
      <Section title="Homepage Hero" desc="The big headline at the top of the homepage.">
        <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} placeholder="Born Under the Stars." />
        <Field label="Sub-headline" value={hero.subheadline} onChange={(v) => setHero({ ...hero, subheadline: v })} placeholder="Decoded by the Cosmos." />
        <SaveBtn pending={pending} onClick={() => save("hero", hero as unknown as Json, "Hero copy")} />
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl flex flex-col gap-3" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.25)" }}>
      <div>
        <h2 className="text-base font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-display)" }}>{title}</h2>
        <p className="text-xs" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-lg px-3 py-2"
        style={{ background: "var(--color-parchment)", border: "1px solid rgba(209,168,110,0.25)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}

function SaveBtn({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={pending} className="btn-gold text-xs px-5 py-2 self-start disabled:opacity-50">
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
