import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import type { Booking, Order, OrderItem, Profile, SavedKundli } from "@/lib/supabase/types";

export const metadata = { title: "My Account" };

// Reads the logged-in user's data fresh on every request.
export const dynamic = "force-dynamic";

type OrderWithItems = Order & { order_items: OrderItem[] };

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards /account, but guard here too for safety.
  if (!user) redirect("/login?next=/account");

  const adminUser = await getAdminUser();

  const [profileRes, kundlisRes, ordersRes, bookingsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("saved_kundlis").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
  ]);

  const profile: Profile = profileRes.data ?? {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) ?? null,
    email: user.email ?? null,
    phone: null,
    avatar_url: null,
    is_admin: false,
    created_at: user.created_at,
    updated_at: user.created_at,
  };

  return (
    <AccountDashboard
      profile={profile}
      isAdmin={!!adminUser}
      kundlis={(kundlisRes.data as SavedKundli[]) ?? []}
      orders={(ordersRes.data as OrderWithItems[]) ?? []}
      bookings={(bookingsRes.data as Booking[]) ?? []}
    />
  );
}
