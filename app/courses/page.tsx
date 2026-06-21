import Link from "next/link";
import { MandalaBackground } from "@/components/MandalaBackground";
import { COURSES } from "@/data/content";
import { Star, Play, Clock, Users, BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Astrology Courses",
  description: "Learn Vedic astrology from beginner to advanced. Video lessons, PDF notes, and lifetime access.",
};

export default function CoursesPage() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--color-midnight) 0%, var(--color-midnight-800) 100%)" }}
      >
        <MandalaBackground />
        <div className="container-xl relative z-10 text-center">
          <p className="section-eyebrow mb-4">Video · PDF · Lifetime Access</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,4rem)", color: "var(--color-parchment)", lineHeight: 1.05, marginBottom: "1rem" }}>
            Astrology Courses
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "rgba(250,245,237,0.55)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
            Learn Vedic astrology from scratch or deepen your knowledge with
            structured courses taught by a practicing Jyotish expert.
          </p>
        </div>
      </section>

      <div className="container-xl py-16">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16 max-w-xl mx-auto">
          {[
            { v: "3,200+", l: "Students" },
            { v: "138",    l: "Video Lessons" },
            { v: "4.8 ★",  l: "Average Rating" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-gold)" }}>{v}</p>
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="card flex flex-col overflow-hidden"
              style={{ background: "var(--color-ivory)" }}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden aspect-video">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-midnight/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                  <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center" style={{ background: "var(--color-gold)" }}>
                    <Play size={20} fill="#0F0A1E" color="#0F0A1E" style={{ marginLeft: 2 }} />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className="badge"
                    style={{
                      background: course.level === "Beginner" ? "rgba(76,175,80,0.85)"
                        : course.level === "Advanced" ? "rgba(212,78,78,0.85)"
                        : "rgba(201,162,39,0.85)",
                      color: "#fff",
                      border: "none",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--color-midnight)", lineHeight: 1.2 }}>
                  {course.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)", fontStyle: "italic" }}>
                  {course.tagline}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>
                  <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Play size={11} /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {course.students.toLocaleString()}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12}
                      fill={i < Math.round(course.rating) ? "var(--color-gold)" : "transparent"}
                      color={i < Math.round(course.rating) ? "var(--color-gold)" : "rgba(209,168,110,0.3)"} />
                  ))}
                  <span className="text-xs" style={{ color: "rgba(45,41,38,0.45)", fontFamily: "var(--font-body)" }}>
                    {course.rating} ({course.students.toLocaleString()} students)
                  </span>
                </div>

                {/* Topics */}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(45,41,38,0.4)" }}>What you'll learn</p>
                  <ul className="flex flex-col gap-1.5">
                    {course.topics.slice(0, 4).map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs" style={{ color: "rgba(45,41,38,0.6)", fontFamily: "var(--font-body)" }}>
                        <BookOpen size={10} style={{ color: "var(--color-gold)", marginTop: 1, flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                    {course.topics.length > 4 && (
                      <li className="text-xs" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
                        +{course.topics.length - 4} more topics
                      </li>
                    )}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div className="pt-4 flex items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(209,168,110,0.12)" }}>
                  <div>
                    <span className="font-bold text-lg" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                      {formatPrice(course.price)}
                    </span>
                    {course.originalPrice && (
                      <span className="ml-2 text-sm line-through" style={{ color: "rgba(45,41,38,0.35)", fontFamily: "var(--font-body)" }}>
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Link href={`/courses/${course.slug}`} className="btn-gold text-xs px-5 py-2">
                    Enrol Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust section */}
        <div
          className="mt-16 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ background: "var(--color-midnight)", border: "1px solid rgba(209,168,110,0.15)" }}
        >
          {[
            { emoji: "📹", title: "HD Video Lessons",  desc: "Clear, concise video modules" },
            { emoji: "📄", title: "PDF Notes",          desc: "Downloadable study material" },
            { emoji: "♾️", title: "Lifetime Access",    desc: "Study at your own pace" },
            { emoji: "🏆", title: "Certificate",        desc: "On successful completion" },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="text-center flex flex-col items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <p className="text-sm font-semibold" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>{title}</p>
              <p className="text-xs" style={{ color: "rgba(250,245,237,0.4)", fontFamily: "var(--font-body)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
