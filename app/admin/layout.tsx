import { requireAdmin } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-16" style={{ background: "var(--color-parchment)" }}>
      <AdminNav email={user.email ?? null} />
      <main className="flex-1 p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
