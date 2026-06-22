import { createAdminClient } from "@/lib/supabase/admin";
import { OrdersTable } from "@/components/admin/OrdersTable";
import type { Order, OrderItem } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const db = createAdminClient();
  const { data } = await db
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>Orders</h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        {data?.length ?? 0} order(s). Update fulfilment status inline.
      </p>
      <OrdersTable orders={(data as (Order & { order_items: OrderItem[] })[]) ?? []} />
    </div>
  );
}
