"use client";

import { BLOG_POSTS } from "@/data/content";
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { use } from "react";

export default function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center">
          <p className="text-xl font-bold">Article not found</p>
          <Link href="/blog" className="btn-gold mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80 transition-all"
          style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Article Header */}
        <div className="flex flex-col gap-4 mb-8">
          <span className="badge badge-gold self-start" style={{ textTransform: "capitalize" }}>
            {post.category}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              color: "var(--color-midnight)",
              lineHeight: 1.1,
            }}
          >
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-6 text-xs pt-4 border-t border-[rgba(209,168,110,0.2)]"
            style={{ color: "rgba(45,41,38,0.5)" }}
          >
            <span className="flex items-center gap-1.5">
              <User size={14} style={{ color: "var(--color-gold)" }} /> By {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} style={{ color: "var(--color-gold)" }} /> {post.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} style={{ color: "var(--color-gold)" }} /> {post.readTime}
            </span>
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 hover:underline cursor-pointer"
              style={{ color: "var(--color-gold)" }}
            >
              <Share2 size={14} /> Share Article
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div
          className="w-full aspect-[21/9] rounded-3xl bg-cover bg-center mb-10"
          style={{ backgroundImage: `url(${post.image})` }}
        />

        {/* Article Body Content */}
        <article
          className="prose max-w-none flex flex-col gap-6"
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(45,41,38,0.75)",
            fontSize: "1.05rem",
            lineHeight: 1.8,
          }}
        >
          <p className="text-lg font-semibold" style={{ color: "var(--color-midnight)" }}>
            As the cosmos shifts in {new Date().getFullYear()}, the planetary configurations exert a strong influence 
            on human consciousness, affecting general fields from career milestones to spiritual growth.
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "var(--color-midnight)",
              marginTop: "1.5rem",
            }}
          >
            The Cosmic Mechanics behind this Transit
          </h2>

          <p>
            Vedic astrology (Jyotish) approaches planetary alignments from a sidereal perspective. In this article, 
            we explore how these movements trigger changes inside houses. Every zodiac sign possesses a specific house placement 
            relative to the transit center, making the timing of events uniquely personal.
          </p>

          <div
            className="p-6 rounded-2xl my-4 italic border-l-4"
            style={{
              background: "var(--color-ivory)",
              borderColor: "var(--color-gold)",
              color: "var(--color-midnight)",
            }}
          >
            &ldquo;Planets do not compel; they merely impel. Understanding your birth chart allows you to navigate the 
            cosmic weather with grace, turning challenges into opportunities for growth.&rdquo;
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              color: "var(--color-midnight)",
              marginTop: "1rem",
            }}
          >
            Key Remedial Solutions to Pacify Afflictions
          </h3>

          <p>
            For those experiencing adverse placements during this cycle, Vedic texts offer several practical remedies:
          </p>

          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li>
              <strong>Mantra Chanting:</strong> Chanting the planetary seed mantra 108 times daily helps restore energetic balance.
            </li>
            <li>
              <strong>Charitable Acts:</strong> Donating specific food items or clothing on the day of the planet strengthens its positive aspects.
            </li>
            <li>
              <strong>Energized Yantras:</strong> Installing a ritually energized yantra in your meditation space acts as an energetic shield.
            </li>
          </ul>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "var(--color-midnight)",
              marginTop: "1.5rem",
            }}
          >
            Conclusion & Next Steps
          </h2>

          <p>
            Ultimately, transits act as trigger events for the karma stored in your natal chart. To get a precise understanding 
            of how this affects your specific chart, generate your free kundli on our platform or consult our senior astrologer.
          </p>
        </article>

        {/* Internal CTAs */}
        <div
          className="mt-12 p-6 md:p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{
            background: "linear-gradient(135deg, var(--color-midnight), var(--color-midnight-800))",
            border: "1px solid rgba(209,168,110,0.25)",
          }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-gold)" }}>
              Calculate Your Chart
            </p>
            <h4 className="text-lg font-bold mt-1 mb-2" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>
              Generate Free Kundli
            </h4>
            <p className="text-xs mb-4" style={{ color: "rgba(250,245,237,0.55)" }}>
              Find your exact planetary coordinates and Vimshottari dasha cycle within 2 minutes.
            </p>
            <Link href="/kundli" className="btn-gold text-xs px-4 py-2">
              Generate Now
            </Link>
          </div>

          <div style={{ borderLeft: "1px solid rgba(250,245,237,0.1)", paddingLeft: "1.5rem" }} className="hidden md:block">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-saffron)" }}>
              Shop Remedies
            </p>
            <h4 className="text-lg font-bold mt-1 mb-2" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>
              Certified Gemstones & Yantras
            </h4>
            <p className="text-xs mb-4" style={{ color: "rgba(250,245,237,0.55)" }}>
              Find authentic, lab-certified gems and energized pooja items for planetary remedies.
            </p>
            <Link href="/store" className="btn-gold text-xs px-4 py-2" style={{ background: "rgba(196,138,105,0.25)", border: "1.5px solid var(--color-saffron)", color: "var(--color-saffron)" }}>
              Browse Remedies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
