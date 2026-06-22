"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { productImageSrc } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, CreditCard, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { openRazorpayCheckout } from "@/lib/payments/razorpayCheckout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = totalPrice();
  const shippingCharge = subtotal >= 999 || subtotal === 0 ? 0 : 150;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shippingCharge + tax;

  useEffect(() => {
    // If cart is empty on mount, redirect to store
    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/store");
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address || !shipping.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    const orderItems = items.map((i) => ({
      product_id: i.product.id,
      product_name: i.product.name,
      slug: i.product.slug,
      price: i.product.price,
      quantity: i.quantity,
    }));

    try {
      // Cash on delivery → record the order directly (status: pending).
      if (paymentMethod === "cod") {
        toast.loading("Placing your order...", { id: "checkout" });
        const res = await fetch("/api/store/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: orderItems, shipping, paymentMethod: "cod", total }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Checkout failed");
        toast.success("Order placed! Pay on delivery.", { id: "checkout" });
        clearCart();
        router.push(`/store/checkout/success?orderId=${data.orderId}`);
        return;
      }

      // Online (UPI / card / netbanking / wallet) → Razorpay.
      toast.loading("Opening secure payment...", { id: "checkout" });
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, receipt: `store_${Date.now()}` }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not start payment");

      toast.dismiss("checkout");
      const result = await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amount: orderData.amount,
        name: "The Masked Astrologer",
        description: `${items.length} item(s) · Store order`,
        prefill: { name: shipping.name, email: shipping.email, contact: shipping.phone },
      });

      toast.loading("Confirming payment...", { id: "checkout" });
      const res = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems, shipping, paymentMethod: "razorpay", total, razorpay: result }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment verification failed");

      toast.success("Payment successful! Order placed.", { id: "checkout" });
      clearCart();
      router.push(`/store/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed", { id: "checkout" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80 transition-all"
          style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <h1
          className="mb-8"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--color-midnight)",
          }}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Delivery & Payment Forms */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Delivery Details */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(209,168,110,0.25)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <Truck size={20} style={{ color: "var(--color-gold)" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={shipping.name}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="e.g. Priyesh Shah"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={shipping.email}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="e.g. priyesh@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shipping.phone}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      Street Address *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={shipping.address}
                      onChange={handleInputChange}
                      className="input-field w-full py-2 resize-none"
                      placeholder="Flat/House No., Building Name, Street Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shipping.city}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={shipping.state}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(45,41,38,0.6)" }}>
                      Pincode / Postal Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={shipping.pincode}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "var(--color-ivory)",
                  border: "1px solid rgba(209,168,110,0.25)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <CreditCard size={20} style={{ color: "var(--color-gold)" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                    Payment Options
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { id: "upi", label: "Instant UPI (PhonePe / GPay / Paytm)", desc: "10% Faster checkout & automatic verification." },
                    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay & Amex accepted." },
                    { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay at your doorstep. Extra ₹50 handling charge applies." },
                  ].map(({ id, label, desc }) => (
                    <label
                      key={id}
                      className="flex gap-3 p-4 rounded-xl cursor-pointer transition-all border"
                      style={{
                        background: paymentMethod === id ? "rgba(209,168,110,0.06)" : "transparent",
                        borderColor: paymentMethod === id ? "var(--color-gold)" : "rgba(209,168,110,0.15)",
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id as any)}
                        className="mt-1 accent-gold"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: "var(--color-midnight)" }}>{label}</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(45,41,38,0.5)" }}>{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gold w-full mt-6 h-12 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? "Processing Secure Payment..." : `Pay ${formatPrice(total)}`}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: "rgba(45,41,38,0.5)" }}>
                  <ShieldCheck size={14} style={{ color: "var(--color-gold)" }} />
                  <span>Secure 256-bit SSL encrypted payments</span>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "var(--color-midnight)",
                border: "1px solid rgba(209,168,110,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart size={18} style={{ color: "var(--color-gold)" }} />
                <h2 className="text-lg font-bold" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>
                  Order Summary
                </h2>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4 max-h-60 overflow-y-auto mb-6 pr-2">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 justify-between items-start">
                    <div className="flex gap-3 min-w-0">
                      <div
                        className="w-12 h-12 rounded bg-cover bg-center bg-ivory flex-shrink-0"
                        style={{ backgroundImage: `url(${productImageSrc(product)})` }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-parchment)" }}>
                          {product.name}
                        </p>
                        <p className="text-xs" style={{ color: "rgba(250,245,237,0.5)" }}>
                          Qty: {quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--color-gold)" }}>
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="flex flex-col gap-3 pt-6 border-t" style={{ borderColor: "rgba(209,168,110,0.15)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "rgba(250,245,237,0.5)" }}>Subtotal</span>
                  <span style={{ color: "var(--color-parchment)" }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "rgba(250,245,237,0.5)" }}>Shipping</span>
                  <span style={{ color: "var(--color-parchment)" }}>
                    {shippingCharge === 0 ? (
                      <span className="text-[#4CAF50] font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingCharge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "rgba(250,245,237,0.5)" }}>Estimated GST (18%)</span>
                  <span style={{ color: "var(--color-parchment)" }}>{formatPrice(tax)}</span>
                </div>

                <div
                  className="flex justify-between items-center pt-4 mt-2 border-t"
                  style={{ borderColor: "rgba(209,168,110,0.3)" }}
                >
                  <span className="font-semibold" style={{ color: "var(--color-parchment)" }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: "var(--color-gold)" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Donation impact highlight */}
            <div
              className="p-5 rounded-2xl flex gap-4"
              style={{
                background: "rgba(232,119,34,0.1)",
                border: "1px solid rgba(232,119,34,0.2)",
              }}
            >
              <div className="text-2xl mt-1">🐾</div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#E87722", fontFamily: "var(--font-body)" }}>
                  Your Purchase Feeds a Street Dog
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(45,41,38,0.7)", fontFamily: "var(--font-body)" }}>
                  We donate 10% of our store profits to supply food, vaccination, and blankets to street dogs.
                  Track the transparency log on the <Link href="/donate" className="underline font-semibold hover:text-midnight">Donation page</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
