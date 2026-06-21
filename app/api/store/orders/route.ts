import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shipping, paymentMethod, total } = body;

    if (!items || items.length === 0 || !shipping || !paymentMethod) {
      return NextResponse.json(
        { error: "Invalid order parameters" },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId,
    });
  } catch (error: any) {
    console.error("Order creation API error:", error);
    return NextResponse.json(
      { error: "Failed to process order: " + error.message },
      { status: 500 }
    );
  }
}
