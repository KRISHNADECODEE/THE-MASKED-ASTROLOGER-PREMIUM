import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Server-side Razorpay client. Uses the secret key — never import in a Client
 * Component. Key ID is public (NEXT_PUBLIC_), secret stays server-only.
 */
export function getRazorpay() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are not configured (.env.local).");
  }
  return new Razorpay({ key_id, key_secret });
}

/**
 * Verify the signature Razorpay returns after a successful checkout.
 * signature = HMAC_SHA256(`${order_id}|${payment_id}`, key_secret).
 * Returns true only if it matches — protects against forged payment callbacks.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  // Constant-time comparison.
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(params.signature)
    );
  } catch {
    return false;
  }
}
