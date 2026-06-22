import Link from "next/link";
import { ShoppingBag, Calendar, Heart, Mail, MessageSquare, Users, IndianRupee } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = createAdminClient();

  const countOf = async (table: string) => {
    const { count } = await db.from(table).select("*", { count: "exact", head: true });
    return count ?? 0;
  };

  const [orders, bookings, donations, waitlist, messages, users, paidOrders] = await Promise.all([
    countOf("orders"),
    countOf("bookings"),
    countOf("donations"),
    countOf("waitlist"),
    countOf("contact_messages"),
    countOf("profiles"),
    db.from("orders").select("total, status"),
  ]);

  const revenue = (paidOrders.data ?? [])
    .filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status as string))
    .reduce((sum, o) => sum + Number(o.total), 0);

  return { orders, bookings, donations, waitlist, messages, users, revenue };
}

export default async function AdminDashboard() {
  const s = await getStats();

  const cards = [
    { label: "Revenue", value: formatPrice(s.revenue), icon: IndianRupee, href: "/admin/orders", accent: "#4CAF50" },
    { label: "Orders", value: s.orders, icon: ShoppingBag, href: "/admin/orders", accent: "var(--color-gold)" },
    { label: "Consultations", value: s.bookings, icon: Calendar, href: "/admin/bookings", accent: "var(--color-saffron)" },
    { label: "Donations", value: s.donations, icon: Heart, href: "/admin/donations", accent: "#6B1F2A" },
    { label: "Messages", value: s.messages, icon: MessageSquare, href: "/admin/messages", accent: "#4C7DB5" },
    { label: "Waitlist", value: s.waitlist, icon: Mail, href: "/admin/waitlist", accent: "#7C5CBF" },
    { label: "Registered Users", value: s.users, icon: Users, href: "/admin", accent: "var(--color-midnight)" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-midnight)" }}>
        Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: "rgba(45,41,38,0.55)", fontFamily: "var(--font-body)" }}>
        Live overview of your store, consultations, donations, and audience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon, href, accent }) => (
          <Link
            key={label}
            href={href}
            className="p-6 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.25)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(209,168,110,0.12)", color: accent }}
              >
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
              {value}
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
