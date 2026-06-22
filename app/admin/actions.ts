"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  BookingStatus,
  ContactStatus,
  DonationStatus,
  Json,
  OrderStatus,
} from "@/lib/supabase/types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("orders").update({ status }).eq("id", orderId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateBooking(
  bookingId: string,
  fields: { status?: BookingStatus; zoom_link?: string | null }
) {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("bookings").update(fields).eq("id", bookingId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/bookings");
  return { ok: true };
}

export async function updateDonation(
  donationId: string,
  fields: { status?: DonationStatus; proof_photo_url?: string | null }
) {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("donations").update(fields).eq("id", donationId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/donations");
  return { ok: true };
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("contact_messages").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveSetting(key: string, value: Json) {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/settings", "page");
  revalidatePath("/", "layout");
  return { ok: true };
}
