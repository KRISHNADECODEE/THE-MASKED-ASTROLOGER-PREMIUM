"use client";

import { useParams, useRouter } from "next/navigation";
import { COURSES } from "@/data/content";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, BookOpen, Clock, Play, Award, HelpCircle, Star, Users } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState, use } from "react";

export default function CourseDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const course = COURSES.find((c) => c.slug === params.slug);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center">
          <p className="text-xl font-bold">Course not found</p>
          <Link href="/courses" className="btn-gold mt-4 inline-block">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setIsProcessing(true);
    toast.loading("Initiating payment gateway...", { id: "enroll" });

    setTimeout(() => {
      toast.success("Payment Successful! Enrolled in course.", { id: "enroll" });
      router.push(`/courses/${course.slug}/learn`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80 transition-all"
          style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          {/* Main Info */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div>
              <span
                className="badge badge-gold"
                style={{ fontSize: "0.75rem", textTransform: "uppercase" }}
              >
                {course.level} Level
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "var(--color-midnight)",
                  lineHeight: 1.1,
                  marginTop: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                {course.title}
              </h1>
              <p className="text-lg italic" style={{ color: "rgba(45,41,38,0.7)", fontFamily: "var(--font-body)" }}>
                &ldquo;{course.tagline}&rdquo;
              </p>
            </div>

            {/* Course details banner */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl"
              style={{
                background: "var(--color-ivory)",
                border: "1px solid rgba(209,168,110,0.25)",
              }}
            >
              {[
                { icon: <Clock size={16} />, label: "Duration", val: course.duration },
                { icon: <BookOpen size={16} />, label: "Lessons", val: `${course.lessons} lectures` },
                { icon: <Users size={16} />, label: "Enrolled", val: `${course.students} students` },
                { icon: <Star size={16} />, label: "Rating", val: `${course.rating} / 5.0` },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>

            {/* What you will learn */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  color: "var(--color-midnight)",
                  marginBottom: "1rem",
                }}
              >
                Syllabus & Topics Covered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl flex gap-3 items-center"
                    style={{
                      background: "var(--color-ivory)",
                      border: "1px solid rgba(209,168,110,0.15)",
                    }}
                  >
                    <span className="text-sm font-bold" style={{ color: "var(--color-gold)" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Box & Checkout */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div
              className="p-6 md:p-8 rounded-3xl"
              style={{
                background: "var(--color-midnight)",
                border: "1px solid rgba(209,168,110,0.25)",
              }}
            >
              <div
                className="w-full aspect-video rounded-xl bg-cover bg-center mb-6"
                style={{ backgroundImage: `url(${course.thumbnail})` }}
              />

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold" style={{ color: "var(--color-gold)" }}>
                  {formatPrice(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-sm line-through" style={{ color: "rgba(250,245,237,0.4)" }}>
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs mb-6" style={{ color: "rgba(250,245,237,0.5)", fontFamily: "var(--font-body)" }}>
                Lifetime access. Includes downloadable PDF resource notes and verified course completion certificate.
              </p>

              <button
                onClick={handleEnroll}
                disabled={isProcessing}
                className="btn-gold w-full h-12 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play size={16} fill="#0F0A1E" /> {isProcessing ? "Processing Payment..." : "Enroll Now"}
              </button>

              <div className="flex flex-col gap-3 mt-8 pt-6 border-t" style={{ borderColor: "rgba(209,168,110,0.15)" }}>
                {[
                  { icon: <Award size={16} />, text: "Verified PDF Certificate" },
                  { icon: <Play size={16} />, text: "Full HD Video Lectures" },
                  { icon: <HelpCircle size={16} />, text: "Live Q&A support with Astrologer" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center text-xs" style={{ color: "rgba(250,245,237,0.6)" }}>
                    <span style={{ color: "var(--color-gold)" }}>{item.icon}</span>
                    <span style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
