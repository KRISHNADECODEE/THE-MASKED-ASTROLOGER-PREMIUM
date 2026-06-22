import type { CSSProperties } from "react";

/** Base shimmer block. Size it with className (w-/h-) or style. */
export function Skeleton({
  className = "",
  style,
  dark = false,
}: {
  className?: string;
  style?: CSSProperties;
  dark?: boolean;
}) {
  return <div className={`${dark ? "skeleton-dark" : "skeleton"} ${className}`} style={style} aria-hidden="true" />;
}

/** A few text lines; the last one is shorter. */
export function SkeletonText({ lines = 3, dark = false }: { lines?: number; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} dark={dark} className="h-3" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

/** One product card placeholder (square image + info), matching ProductCard. */
export function ProductCardSkeleton() {
  return (
    <div className="card flex flex-col overflow-hidden">
      <Skeleton className="aspect-square w-full" style={{ borderRadius: 0 }} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <SkeletonText lines={2} />
        <Skeleton className="h-4 w-20 mt-2" />
      </div>
    </div>
  );
}

/** Responsive product grid skeleton, matching the store grid columns. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Stacked list-row skeletons (account orders, admin tables, etc.). */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl flex items-center justify-between gap-4"
          style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}
        >
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/** Full Kundli result skeleton — mirrors the generated chart layout so the
 *  page does not shift when the real result replaces it. */
export function KundliResultSkeleton() {
  return (
    <div aria-busy="true">
      {/* Header card */}
      <div
        className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))", border: "1px solid rgba(209,168,110,0.25)" }}
      >
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton dark className="h-7 w-56" />
          <Skeleton dark className="h-3 w-64 max-w-full" />
          <div className="flex flex-wrap gap-3 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} dark className="h-7 w-28 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} dark className="h-9 w-28 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-8" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.15)", width: "fit-content" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Content: chart + sidebar */}
      <div className="rounded-2xl p-8" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.15)" }}>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl p-4 flex flex-col gap-2" style={{ border: "1px solid rgba(209,168,110,0.2)" }}>
                <Skeleton className="h-4 w-32" />
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Card-grid skeleton (blog, courses, consultation services). */
export function CardGridSkeleton({ count = 6, cols = "lg:grid-cols-3" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden flex flex-col">
          <Skeleton className="h-44 w-full" style={{ borderRadius: 0 }} />
          <div className="p-5 flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-4/5" />
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}
