import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      serviceId,
      serviceTitle,
      slotDate,
      slotTime,
      birthDetails,
      amount,
    } = body;

    if (!name || !email || !serviceId || !slotDate || !slotTime) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const bookingNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const zoomLink = "https://zoom.us/j/mockzoomlinkid12345";

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user?.id ?? null,
        booking_number: bookingNumber,
        service_id: serviceId,
        service_title: serviceTitle ?? null,
        name,
        email,
        phone: phone ?? null,
        slot_date: slotDate,
        slot_time: slotTime,
        birth_details: birthDetails ?? null,
        status: "scheduled",
        zoom_link: zoomLink,
        amount: amount ?? null,
      })
      .select("booking_number")
      .single();

    if (error || !booking) throw error ?? new Error("Failed to create booking");

    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully",
      bookingId: booking.booking_number,
      zoomLink,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Consultation booking API error:", message);
    return NextResponse.json({ error: "Failed to book session: " + message }, { status: 500 });
  }
}
