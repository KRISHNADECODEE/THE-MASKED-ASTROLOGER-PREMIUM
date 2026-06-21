"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, PRODUCTS } from "@/data/products";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/store/ProductCard";
import { ShoppingBag, Star, Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh", paddingTop: "4rem" }}>
      <div className="container-xl py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>
          <Link href="/store" className="flex items-center gap-1 hover:text-midnight transition-colors" style={{ color: "rgba(45,41,38,0.45)" }}>
            <ChevronLeft size={14} /> Store
          </Link>
          <span>/</span>
          <span style={{ textTransform: "capitalize" }}>{product.category}</span>
          <span>/</span>
          <span style={{ color: "var(--color-midnight)" }}>{product.name}</span>
        </div>

        {/* Main product */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">

          {/* Images */}
          <div className="flex flex-col gap-3">
            <div
              className="aspect-square rounded-2xl overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: `url(${product.images[activeImage]})`,
                border: "1px solid rgba(209,168,110,0.15)",
              }}
            />
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                   <button
                     key={i}
                     onClick={() => setActiveImage(i)}
                     className="w-16 h-16 rounded-lg overflow-hidden bg-cover bg-center transition-all"
                     style={{
                       backgroundImage: `url(${img})`,
                       border: `2px solid ${activeImage === i ? "var(--color-gold)" : "rgba(209,168,110,0.2)"}`,
                     }}
                   />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="badge badge-gold mb-3" style={{ textTransform: "capitalize" }}>
                {product.category}
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  color: "var(--color-midnight)",
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14}
                      fill={i < Math.round(product.rating) ? "var(--color-gold)" : "transparent"}
                      color={i < Math.round(product.rating) ? "var(--color-gold)" : "rgba(209,168,110,0.3)"} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                  {product.rating}
                </span>
                <span className="text-sm" style={{ color: "rgba(45,41,38,0.4)", fontFamily: "var(--font-body)" }}>
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
             <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--color-midnight)",
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg line-through" style={{ color: "rgba(45,41,38,0.35)", fontFamily: "var(--font-body)" }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge badge-saffron">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Benefit */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(209,168,110,0.08)", border: "1px solid rgba(209,168,110,0.2)" }}
            >
              <span className="text-xl">✨</span>
              <span className="text-sm font-semibold" style={{ color: "var(--color-gold-dark)", fontFamily: "var(--font-body)" }}>
                {product.benefit}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(45,41,38,0.65)", fontFamily: "var(--font-body)" }}>
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="badge badge-gold" style={{ fontSize: "0.65rem" }}>{tag}</span>
              ))}
            </div>

             {/* Quantity + Add to Cart */}
            <div className="flex gap-3">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{ border: "1.5px solid rgba(209,168,110,0.3)", background: "var(--color-ivory)" }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-6 h-6 rounded flex items-center justify-center font-bold text-lg transition-all hover:text-gold"
                  style={{ color: "var(--color-midnight)" }}
                >
                  −
                </button>
                <span className="w-6 text-center font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center font-bold text-lg transition-all hover:text-gold"
                  style={{ color: "var(--color-midnight)" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className="btn-gold flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2" style={{ borderTop: "1px solid rgba(209,168,110,0.12)" }}>
              {[
                { icon: "🔒", text: "Secure Payment" },
                { icon: "🚀", text: "Fast Delivery" },
                { icon: "↩️", text: "7-Day Returns" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-lg">{icon}</span>
                  <span className="text-xs" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
