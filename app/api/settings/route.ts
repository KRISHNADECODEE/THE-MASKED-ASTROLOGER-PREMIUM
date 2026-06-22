import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Public, read-only site settings (announcement, support contact, hero copy).
 * RLS allows anyone to SELECT site_settings, so the anon session is enough.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({});
  }
}
