"use client";

import { X, Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useLocale } from "@/components/locale/LocaleProvider";
import { productImageSrc } from "@/data/products";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();
  const { money } = useLocale();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-[420px] flex flex-col"
        style={{
          background: "var(--color-midnight)",
          borderLeft: "1px solid rgba(209, 168, 110, 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(209, 168, 110, 0.15)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: "var(--color-gold)" }} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-parchment)",
                fontSize: "1.1rem",
              }}
            >
              Your Cart
            </span>
            {items.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "var(--color-saffron)", color: "#fff" }}
              >
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-md transition-all hover:bg-white/10"
            style={{ color: "rgba(250,245,237,0.6)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="text-5xl opacity-30">🛒</div>
              <p style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}>
                Your cart is empty
              </p>
              <Link href="/store" onClick={closeCart} className="btn-gold text-sm px-4 py-2">
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 rounded-xl"
                  style={{
                    background: "rgba(76, 72, 69, 0.2)",
                    border: "1px solid rgba(209, 168, 110, 0.12)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${productImageSrc(product)})`,
                      minWidth: "4rem",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}
                    >
                      {product.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-gold)" }}>
                      {money(product.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
                        style={{
                          border: "1px solid rgba(209, 168, 110, 0.25)",
                          color: "var(--color-gold)",
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="w-6 text-center text-sm font-bold"
                        style={{ color: "var(--color-parchment)" }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
                        style={{
                          border: "1px solid rgba(209, 168, 110, 0.25)",
                          color: "var(--color-gold)",
                        }}
                      >
                        <Plus size={12} />
                      </button>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="ml-auto p-1.5 rounded-md transition-all hover:bg-red-900/30"
                        style={{ color: "rgba(250,245,237,0.4)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-5"
            style={{ borderTop: "1px solid rgba(209, 168, 110, 0.15)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: "rgba(250,245,237,0.6)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                Total
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}
              >
                {money(totalPrice())}
              </span>
            </div>
            <Link
              href="/store/checkout"
              onClick={closeCart}
              className="btn-gold w-full text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/store"
              onClick={closeCart}
              className="mt-3 block text-center text-sm transition-all"
              style={{ color: "rgba(250,245,237,0.5)" }}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
