"use client";

/**
 * Client helper that lazy-loads the Razorpay Checkout script and opens the
 * payment modal. Resolves with the success payload (order/payment/signature)
 * or rejects if the user dismisses or the payment fails.
 */

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CheckoutParams {
  keyId: string;
  orderId: string;
  amount: number; // paise
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  themeColor?: string;
}

export async function openRazorpayCheckout(params: CheckoutParams): Promise<RazorpaySuccess> {
  const ok = await loadScript();
  if (!ok || !window.Razorpay) {
    throw new Error("Could not load Razorpay. Check your connection and try again.");
  }

  return new Promise<RazorpaySuccess>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: params.keyId,
      order_id: params.orderId,
      amount: params.amount,
      currency: "INR",
      name: params.name,
      description: params.description,
      image: "/brand/logo.png",
      prefill: params.prefill,
      notes: params.notes,
      theme: { color: params.themeColor || "#C9A227" },
      handler: (response: RazorpaySuccess) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    rzp.open();
  });
}
