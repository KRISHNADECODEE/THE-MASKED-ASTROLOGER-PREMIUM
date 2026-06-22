import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, donorName, total } = body as {
      items: { id: string; name: string; quantity: number; cost: number }[];
      donorName?: string;
      total?: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Invalid donation pledge parameters" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const donationNumber = `DN-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        user_id: user?.id ?? null,
        donation_number: donationNumber,
        donor_name: donorName || "Anonymous",
        items,
        total: total ?? null,
        status: "pledged",
      })
      .select("donation_number")
      .single();

    if (error || !donation) throw error ?? new Error("Failed to record donation");

    return NextResponse.json({
      success: true,
      message: "Donation processed successfully",
      donationId: donation.donation_number,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Donation processing API error:", message);
    return NextResponse.json({ error: "Failed to complete donation: " + message }, { status: 500 });
  }
}
