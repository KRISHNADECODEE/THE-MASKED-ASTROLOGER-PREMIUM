import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SiteSetting } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export interface AnnouncementValue { enabled: boolean; text: string; href: string }
export interface SupportValue { email: string; phone: string }
export interface HeroValue { headline: string; subheadline: string }

export default async function AdminSettingsPage() {
  const db = createAdminClient();
  const { data } = await db.from("site_settings").select("*");
  const map = Object.fromEntries(((data as SiteSetting[]) ?? []).map((s) => [s.key, s.value])) as Record<string, unknown>;

  const announcement = (map.announcement as AnnouncementValue) ?? { enabled: false, text: "", href: "" };
  const support = (map.support as SupportValue) ?? { email: "", phone: "" };
  const hero = (map.hero as HeroValue) ?? { headline: "", subheadline: "" };

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>Site Settings</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        Customize site-wide content. Changes go live immediately.
      </p>
      <SettingsForm announcement={announcement} support={support} hero={hero} />
    </div>
  );
}
