import { createAdminClient } from "@/lib/supabase/admin";
import { DonationsTable } from "@/components/admin/DonationsTable";
import type { Donation } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminDonationsPage() {
  const db = createAdminClient();
  const { data } = await db.from("donations").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>Donations</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        {data?.length ?? 0} pledge(s). Update status and attach proof photos for the transparency log.
      </p>
      <DonationsTable donations={(data as Donation[]) ?? []} />
    </div>
  );
}
