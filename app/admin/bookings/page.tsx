import { createAdminClient } from "@/lib/supabase/admin";
import { BookingsTable } from "@/components/admin/BookingsTable";
import type { Booking } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const db = createAdminClient();
  const { data } = await db.from("bookings").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>Consultations</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        {data?.length ?? 0} booking(s). Set status and attach the meeting link.
      </p>
      <BookingsTable bookings={(data as Booking[]) ?? []} />
    </div>
  );
}
