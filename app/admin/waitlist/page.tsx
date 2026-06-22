import { createAdminClient } from "@/lib/supabase/admin";
import type { WaitlistEntry } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  const db = createAdminClient();
  const { data } = await db.from("waitlist").select("*").order("created_at", { ascending: false });
  const rows = (data as WaitlistEntry[]) ?? [];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>AI Astrologer Waitlist</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        {rows.length} signup(s) waiting for early access.
      </p>

      {rows.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ background: "var(--color-ivory)", border: "1px dashed rgba(209,168,110,0.3)" }}>
          <p className="text-sm" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>No signups yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(209,168,110,0.2)" }}>
          {rows.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
              style={{ background: i % 2 ? "var(--color-parchment)" : "var(--color-ivory)", fontFamily: "var(--font-body)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--color-midnight)" }}>{r.email}</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(124,92,191,0.12)", color: "#7C5CBF" }}>
                  {r.source}
                </span>
                <span className="text-[11px]" style={{ color: "rgba(45,41,38,0.4)" }}>
                  {new Date(r.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
