"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface Announcement {
  enabled: boolean;
  text: string;
  href: string;
}

/**
 * Site-wide announcement bar driven by the admin "Site Settings" page.
 * Renders nothing unless an admin has enabled it. Dismissible per-session.
 */
export function SiteAnnouncement() {
  const [data, setData] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((m) => {
        if (!active) return;
        const a = m?.announcement as Announcement | undefined;
        if (a?.enabled && a.text) {
          const seen = sessionStorage.getItem("tma_announce") === a.text;
          setData(a);
          setDismissed(seen);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!data || dismissed) return null;

  const close = () => {
    sessionStorage.setItem("tma_announce", data.text);
    setDismissed(true);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 px-4 py-2 text-xs font-semibold"
      style={{ background: "var(--color-midnight)", color: "var(--color-gold-light)", fontFamily: "var(--font-body)" }}
    >
      {data.href ? (
        <Link href={data.href} className="hover:underline">
          {data.text}
        </Link>
      ) : (
        <span>{data.text}</span>
      )}
      <button onClick={close} aria-label="Dismiss" className="absolute right-3 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
