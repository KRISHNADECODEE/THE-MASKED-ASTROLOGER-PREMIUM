import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body as { email?: string; source?: string };

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("waitlist").insert({
      email: email.toLowerCase().trim(),
      source: source || "unknown",
      user_id: user?.id ?? null,
    });

    // 23505 = unique_violation → already on the list, treat as success.
    if (error && error.code !== "23505") throw error;

    return NextResponse.json({
      success: true,
      message: error?.code === "23505" ? "You're already on the list!" : "Added to the waitlist",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Waitlist API error:", message);
    return NextResponse.json({ error: "Failed to join waitlist: " + message }, { status: 500 });
  }
}
