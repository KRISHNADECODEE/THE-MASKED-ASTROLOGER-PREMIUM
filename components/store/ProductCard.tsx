"use client";

import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useLocale } from "@/components/locale/LocaleProvider";
import { type Product, productImageSrc, hasPromoImage } from "@/data/products";
import toast from "react-hot-toast";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { money } = useLocale();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const fallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = "/products/placeholder.svg";
  };

  // Quick-add overlay shared by both card styles.
  const AddOverlay = (
    <button
      onClick={handleAdd}
      className="absolute bottom-3 left-3 right-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0
                 flex items-center justify-center gap-2 cursor-pointer"
      style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))", color: "var(--color-midnight)" }}
    >
      <ShoppingBag size={12} /> Add to Cart
    </button>
  );

  // Products with a self-contained promo image (name/price/badge baked in) are
  // shown full-bleed — no duplicated chrome.
  if (hasPromoImage(product)) {
    return (
      <Link href={`/store/${product.slug}`} className="card group flex flex-col self-start" style={{ textDecoration: "none" }}>
        <div className="relative overflow-hidden aspect-square bg-ivory">
          <img
            src={productImageSrc(product)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={fallback}
          />
          {AddOverlay}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/store/${product.slug}`} className="card group flex flex-col self-start" style={{ textDecoration: "none" }}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-ivory">
        <img
          src={productImageSrc(product)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          onError={fallback}
        />
        {product.originalPrice && (
          <div className="absolute top-3 left-3 badge badge-saffron" style={{ fontSize: "0.65rem" }}>
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        {AddOverlay}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="badge badge-gold self-start" style={{ fontSize: "0.6rem", textTransform: "capitalize" }}>
          {product.category}
        </span>

        <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
          {product.name}
        </h3>

        <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(45, 41, 38, 0.6)", fontFamily: "var(--font-body)" }}>
          {product.shortDesc}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < Math.round(product.rating) ? "var(--color-gold)" : "transparent"}
                color={i < Math.round(product.rating) ? "var(--color-gold)" : "rgba(209, 168, 110, 0.3)"}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: "rgba(45, 41, 38, 0.5)", fontFamily: "var(--font-body)" }}>
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1 pt-2" style={{ borderTop: "1px solid rgba(209, 168, 110, 0.15)" }}>
          <span className="font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)", fontSize: "1rem" }}>
            {money(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: "rgba(45, 41, 38, 0.4)", fontFamily: "var(--font-body)" }}>
              {money(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
