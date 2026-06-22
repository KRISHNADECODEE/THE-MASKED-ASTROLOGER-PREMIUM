"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MandalaBackground } from "@/components/MandalaBackground";
import { BLOG_POSTS } from "@/data/content";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogListingPage() {
  return (
    <Suspense fallback={null}>
      <BlogListingContent />
    </Suspense>
  );
}

function BlogListingContent() {
  const categories = ["all", ...Array.from(new Set(BLOG_POSTS.map((post) => post.category)))];

  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const initialCategory = catParam && categories.includes(catParam) ? catParam : "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState("");

  const filtered = BLOG_POSTS.filter(
    (post) =>
      (activeCategory === "all" || post.category === activeCategory) &&
      (post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  const featuredPost = BLOG_POSTS[0];
  const restPosts = filtered.filter((p) => p.id !== featuredPost.id || search !== "" || activeCategory !== "all");

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative pt-24 pb-14 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Cosmic Insights · Ancient Knowledge</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--color-parchment)",
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            The Astrology Blog
          </h1>
          <p
            className="max-w-xl mx-auto text-base"
            style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}
          >
            Articles on planetary transits, birth chart reading techniques, remedial solutions, and deep Vedic insights.
          </p>
        </div>
      </section>

      <div className="container-xl py-12">
        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(15,10,30,0.3)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="input-field pl-10 h-11"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat ? "var(--color-midnight)" : "var(--color-ivory)",
                  color: activeCategory === cat ? "var(--color-parchment)" : "var(--color-midnight-700)",
                  border: `1.5px solid ${activeCategory === cat ? "var(--color-midnight)" : "rgba(209,168,110,0.2)"}`,
                  fontFamily: "var(--font-body)",
                  textTransform: "capitalize",
                }}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post (Only show if not filtering) */}
        {activeCategory === "all" && search === "" && (
          <div
            className="rounded-3xl overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            style={{
              background: "var(--color-ivory)",
              border: "1px solid rgba(209,168,110,0.2)",
            }}
          >
            <div
              className="lg:col-span-7 aspect-[16/10] bg-cover bg-center"
              style={{ backgroundImage: `url(${featuredPost.image})` }}
            />
            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col gap-4">
              <span className="badge badge-gold self-start" style={{ textTransform: "capitalize" }}>
                {featuredPost.category}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  color: "var(--color-midnight)",
                  lineHeight: 1.15,
                }}
              >
                <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-midnight-700)", fontFamily: "var(--font-body)" }}>
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs mt-2" style={{ color: "rgba(15,10,30,0.45)" }}>
                <span className="flex items-center gap-1"><Calendar size={12} /> {featuredPost.publishedAt}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {featuredPost.readTime}</span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="btn-gold self-start mt-2 flex items-center gap-2 text-sm px-4 py-2">
                Read Article <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Grid listing */}
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "var(--color-midnight)",
              marginBottom: "1.5rem",
            }}
          >
            {activeCategory !== "all" || search !== "" ? "Search Results" : "Latest Articles"}
          </h3>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-ivory rounded-2xl border border-[rgba(209,168,110,0.15)]">
              <p className="text-lg font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>No articles match your query</p>
              <p className="text-sm mt-1" style={{ color: "rgba(15,10,30,0.5)", fontFamily: "var(--font-body)" }}>Try clearing filters or changing search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restPosts.map((post) => (
                <div
                  key={post.id}
                  className="card group flex flex-col"
                >
                  <div
                    className="aspect-video bg-cover bg-center overflow-hidden transition-all duration-300 group-hover:opacity-90"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="p-5 flex flex-col gap-3 flex-grow">
                    <span className="badge badge-gold self-start" style={{ textTransform: "capitalize" }}>
                      {post.category}
                    </span>
                    <h4
                      className="font-bold text-base leading-snug group-hover:underline flex-grow"
                      style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-xs leading-relaxed opacity-70" style={{ fontFamily: "var(--font-body)" }}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] pt-4 mt-2 border-t border-[rgba(209,168,110,0.12)]" style={{ color: "rgba(15,10,30,0.4)" }}>
                      <span className="flex items-center gap-1"><Calendar size={10} /> {post.publishedAt}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
