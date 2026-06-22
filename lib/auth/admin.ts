import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

function emailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns the current user if they are an admin, otherwise null.
 * Admin = email in ADMIN_EMAILS env  OR  profiles.is_admin = true.
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (user.email && emailAllowlist().includes(user.email.toLowerCase())) {
    return user;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.is_admin ? user : null;
}

/**
 * Guard for admin pages/actions. Redirects to /login (if signed out) or to the
 * homepage (if signed in but not an admin). Returns the admin user otherwise.
 */
export async function requireAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const isAllowlisted =
    user.email && emailAllowlist().includes(user.email.toLowerCase());

  if (!isAllowlisted) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.is_admin) redirect("/");
  }

  return user;
}
