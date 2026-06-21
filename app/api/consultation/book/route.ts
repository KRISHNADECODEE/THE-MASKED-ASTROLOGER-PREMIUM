import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceId, slotDate, slotTime, birthDetails } = body;

    if (!name || !email || !serviceId || !slotDate || !slotTime) {
      return NextResponse.json(
        { error: "Missing required booking details" },
        { status: 400 }
      );
    }

    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully",
      bookingId,
      zoomLink: "https://zoom.us/j/mockzoomlinkid12345",
    });
  } catch (error: any) {
    console.error("Consultation booking API error:", error);
    return NextResponse.json(
      { error: "Failed to book session: " + error.message },
      { status: 500 }
    );
  }
}
