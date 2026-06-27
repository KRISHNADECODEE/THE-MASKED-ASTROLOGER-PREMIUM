import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      phone?: string;
    };

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const finalMessage = phone?.trim()
      ? `📱 Phone/WhatsApp: ${phone.trim()}\n\n${message.trim()}`
      : message.trim();

    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject?.trim() || null,
      message: finalMessage,
      user_id: user?.id ?? null,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Message received" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact API error:", msg);
    return NextResponse.json({ error: "Could not send message: " + msg }, { status: 500 });
  }
}
