"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MandalaBackground } from "@/components/MandalaBackground";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS, CATEGORIES, getProductsByCategory, type ProductCategory } from "@/data/products";
import { Search } from "lucide-react";

export default function StorePage() {
  return (
    <Suspense fallback={null}>
      <StoreContent />
    </Suspense>
  );
}

function StoreContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const initialCategory: ProductCategory | "all" = CATEGORIES.some((c) => c.value === catParam)
    ? (catParam as ProductCategory)
    : "all";

  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(initialCategory);
  const [search, setSearch] = useState("");

  const filtered = getProductsByCategory(activeCategory).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>

      {/* Hero */}
      <section
        className="relative pt-24 pb-14 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Certified · Energized · Authentic</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--color-parchment)",
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            Astrology Store
          </h1>
          <p
            className="max-w-xl mx-auto text-base"
            style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}
          >
            Certified gemstones, energized yantras, pooja items, remedies, and books.
            Every product is carefully sourced and verified for quality.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            {[
              { v: `${PRODUCTS.length}+`, l: "Products" },
              { v: "GII Certified",        l: "Gemstones" },
              { v: "Free Shipping",        l: "Over ₹999" },
              { v: "7-Day",               l: "Returns" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="text-sm font-bold" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{v}</div>
                <div className="text-xs" style={{ color: "rgba(250,245,237,0.4)", fontFamily: "var(--font-body)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <div className="container-xl py-12">

        {/* Search + Category filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(15,10,30,0.3)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-10 h-11"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat.value ? "var(--color-midnight)" : "var(--color-ivory)",
                  color: activeCategory === cat.value ? "var(--color-parchment)" : "var(--color-midnight-700)",
                  border: `1.5px solid ${activeCategory === cat.value ? "var(--color-midnight)" : "rgba(209,168,110,0.2)"}`,
                  fontFamily: "var(--font-body)",
                }}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="mb-6 text-sm" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>
          Showing <strong style={{ color: "var(--color-midnight)" }}>{filtered.length}</strong> products
          {search && ` for "${search}"`}
        </p>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-30">🔍</div>
            <p className="font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>No products found</p>
            <p className="text-sm mt-2" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Trust strip */}
      <div
        className="py-8"
        style={{ background: "var(--color-midnight)", borderTop: "1px solid rgba(209,168,110,0.12)" }}
      >
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { emoji: "💎", title: "Lab Certified", desc: "GII & IGI certified gemstones" },
              { emoji: "🪔", title: "Energized",     desc: "Ritually energized yantras & items" },
              { emoji: "🚀", title: "Fast Shipping", desc: "Delivered pan-India in 3–5 days" },
              { emoji: "🛡️", title: "7-Day Returns", desc: "No questions asked return policy" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <p className="text-sm font-semibold" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>{title}</p>
                <p className="text-xs" style={{ color: "rgba(250,245,237,0.4)", fontFamily: "var(--font-body)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
