"use client";

import { useParams, useRouter } from "next/navigation";
import { COURSES } from "@/data/content";
import { ArrowLeft, PlayCircle, CheckCircle, FileText, Award, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";
import toast from "react-hot-toast";

const SAMPLE_LECTURES = [
  { id: "lec-1", title: "Introduction to Vedic Astrological Systems", duration: "18:42", completed: true },
  { id: "lec-2", title: "Understanding the 12 Bhavas (Houses) in detail", duration: "24:15", completed: true },
  { id: "lec-3", title: "Planets & Significations (Sun, Moon, Mars)", duration: "32:10", completed: false },
  { id: "lec-4", title: "The Outer Planets & Lunar Nodes (Rahu/Ketu)", duration: "21:05", completed: false },
  { id: "lec-5", title: "D-9 divisional chart (Navamsa) foundation", duration: "28:50", completed: false },
  { id: "lec-6", title: "Timing events with Vimshottari Mahadasha", duration: "35:12", completed: false },
];

export default function CourseLearnPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const course = COURSES.find((c) => c.slug === params.slug);
  
  const [activeLecture, setActiveLecture] = useState(SAMPLE_LECTURES[2]); // Default to lesson 3
  const [lectures, setLectures] = useState(SAMPLE_LECTURES);

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

  const toggleCompleted = (id: string) => {
    setLectures(
      lectures.map((l) => (l.id === id ? { ...l, completed: !l.completed } : l))
    );
    toast.success("Progress updated!");
  };

  return (
    <div style={{ background: "var(--color-midnight)", minHeight: "100vh" }} className="pt-20 pb-12">
      <div className="container-xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-all"
            style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft size={16} /> Course Overview
          </Link>
          <span className="text-xs" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>
            Course Player · {course.title}
          </span>
        </div>

        {/* Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Video Player */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Styled Video Container */}
            <div
              className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10 flex items-center justify-center bg-black/60"
            >
              {/* Dummy video background gradient & text */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-sm scale-105"
                style={{ backgroundImage: `url(${course.thumbnail})` }}
              />
              
              <div className="relative z-10 flex flex-col items-center text-center px-6">
                <PlayCircle size={64} className="text-gold animate-pulse cursor-pointer hover:scale-105 transition-all" />
                <h3 className="text-lg font-bold mt-4" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>
                  {activeLecture.title}
                </h3>
                <p className="text-xs mt-1" style={{ color: "rgba(250,245,237,0.5)" }}>
                  Press play to stream this lesson ({activeLecture.duration})
                </p>
              </div>

              {/* Player UI mockup controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
                <div className="w-full bg-white/20 h-1 rounded overflow-hidden mr-4">
                  <div className="bg-gold h-full" style={{ width: "35%" }} />
                </div>
                <span className="text-xs text-white shrink-0">12:15 / {activeLecture.duration}</span>
              </div>
            </div>

            {/* Description & Resources */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  color: "var(--color-parchment)",
                  marginBottom: "1rem",
                }}
              >
                About this lesson
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(250,245,237,0.65)", fontFamily: "var(--font-body)" }}>
                In this segment of the course, we cover the essential meanings, configurations, and core predictions 
                associated with this celestial model. Download the companion worksheet below to complete the mapping exercise.
              </p>

              {/* Resource Download block */}
              <div
                className="mt-6 p-4 rounded-xl flex items-center justify-between"
                style={{
                  background: "rgba(209,168,110,0.06)",
                  border: "1px solid rgba(209,168,110,0.25)",
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} style={{ color: "var(--color-gold)" }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: "var(--color-parchment)" }}>
                      Handout Worksheet.pdf
                    </p>
                    <p className="text-[10px]" style={{ color: "rgba(250,245,237,0.4)" }}>
                      2.4 MB · Study Guide Notes
                    </p>
                  </div>
                </div>
                <button
                  className="text-xs font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: "var(--color-gold)" }}
                  onClick={() => toast.success("Resource sheet downloaded!")}
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Right: Lectures List Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}>
                Course Content
              </h3>

              <div className="flex flex-col gap-3">
                {lectures.map((lec) => (
                  <div
                    key={lec.id}
                    className="p-3 rounded-xl flex gap-3 items-center justify-between transition-all cursor-pointer border"
                    style={{
                      background: activeLecture.id === lec.id ? "rgba(209,168,110,0.08)" : "transparent",
                      borderColor: activeLecture.id === lec.id ? "var(--color-gold)" : "rgba(250,245,237,0.1)",
                    }}
                    onClick={() => setActiveLecture(lec)}
                  >
                    <div className="flex gap-2.5 items-center min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompleted(lec.id);
                        }}
                        className="transition-all"
                        style={{ color: lec.completed ? "#4CAF50" : "rgba(250,245,237,0.4)" }}
                      >
                        <CheckCircle size={16} fill={lec.completed ? "#4CAF50" : "transparent"} color={lec.completed ? "var(--color-midnight)" : "currentColor"} />
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--color-parchment)" }}>
                          {lec.title}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(250,245,237,0.4)" }}>
                          {lec.duration}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: "rgba(250,245,237,0.3)" }} />
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
