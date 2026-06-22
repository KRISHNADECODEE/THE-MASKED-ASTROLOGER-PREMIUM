"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Heart,
  Mail,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/bookings", label: "Consultations", icon: Calendar },
  { href: "/admin/donations", label: "Donations", icon: Heart },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/waitlist", label: "Waitlist", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="w-full lg:w-64 lg:min-h-screen flex-shrink-0 p-4 lg:p-6 flex flex-col gap-1"
      style={{ background: "var(--color-midnight)", borderRight: "1px solid rgba(209,168,110,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-6 px-2">
        <img src="/brand/logo.png" alt="" className="w-8 h-8 rounded-full object-cover border" style={{ borderColor: "var(--color-gold)" }} />
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)" }}>Admin</p>
          <p className="text-[10px]" style={{ color: "rgba(250,245,237,0.45)" }}>{email}</p>
        </div>
      </div>

      <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {LINKS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0"
            style={{
              background: isActive(href, exact) ? "rgba(209,168,110,0.15)" : "transparent",
              color: isActive(href, exact) ? "var(--color-gold)" : "rgba(250,245,237,0.7)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Icon size={16} /> <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 hidden lg:flex flex-col gap-1" style={{ borderTop: "1px solid rgba(250,245,237,0.1)" }}>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: "rgba(250,245,237,0.7)", fontFamily: "var(--font-body)" }}
        >
          <ExternalLink size={16} /> <span>View Site</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
          style={{ color: "rgba(250,245,237,0.7)", fontFamily: "var(--font-body)" }}
        >
          <LogOut size={16} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
