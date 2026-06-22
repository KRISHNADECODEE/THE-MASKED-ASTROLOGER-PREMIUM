import { createAdminClient } from "@/lib/supabase/admin";
import { MessagesTable } from "@/components/admin/MessagesTable";
import type { ContactMessage } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const db = createAdminClient();
  const { data } = await db.from("contact_messages").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>Messages</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        {data?.length ?? 0} enquiry message(s) from the Contact page.
      </p>
      <MessagesTable messages={(data as ContactMessage[]) ?? []} />
    </div>
  );
}
