import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

/**
 * Creates a Razorpay order. Called by the client right before opening the
 * Razorpay Checkout modal. `amount` is in rupees; Razorpay expects paise.
 */
export async function POST(request: Request) {
  try {
    const { amount, receipt, notes } = (await request.json()) as {
      amount: number;
      receipt?: string;
      notes?: Record<string, string>;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Razorpay order error:", message);
    return NextResponse.json({ error: "Could not create payment order: " + message }, { status: 500 });
  }
}
