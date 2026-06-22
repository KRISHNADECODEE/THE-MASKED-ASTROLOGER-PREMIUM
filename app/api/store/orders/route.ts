import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import type { Json } from "@/lib/supabase/types";

interface IncomingItem {
  product_id: string;
  product_name: string;
  slug?: string | null;
  price: number;
  quantity: number;
}

interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shipping, paymentMethod, total, razorpay } = body as {
      items: IncomingItem[];
      shipping: Json;
      paymentMethod: string;
      total: number;
      razorpay?: RazorpayResult;
    };

    if (!items || items.length === 0 || !shipping || !paymentMethod) {
      return NextResponse.json({ error: "Invalid order parameters" }, { status: 400 });
    }

    // For online (Razorpay) payments, the signature MUST verify before we
    // record the order as paid. COD orders skip this.
    let paymentId: string | null = null;
    let status: "paid" | "pending" = paymentMethod === "cod" ? "pending" : "paid";

    if (paymentMethod === "razorpay") {
      if (!razorpay) {
        return NextResponse.json({ error: "Missing payment confirmation" }, { status: 400 });
      }
      const valid = verifyPaymentSignature({
        orderId: razorpay.razorpay_order_id,
        paymentId: razorpay.razorpay_payment_id,
        signature: razorpay.razorpay_signature,
      });
      if (!valid) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }
      paymentId = razorpay.razorpay_payment_id;
      status = "paid";
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        order_number: orderNumber,
        status,
        total,
        shipping,
        payment_method: paymentMethod,
        payment_id: paymentId,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      throw orderError ?? new Error("Failed to create order");
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.product_name,
        slug: i.slug ?? null,
        price: i.price,
        quantity: i.quantity,
      }))
    );

    if (itemsError) throw itemsError;

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: order.order_number,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Order creation API error:", message);
    return NextResponse.json({ error: "Failed to process order: " + message }, { status: 500 });
  }
}
