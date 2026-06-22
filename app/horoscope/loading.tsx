import { Skeleton } from "@/components/ui/Skeleton";

export default function HoroscopeLoading() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="pt-24 pb-14" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <div className="container-xl flex flex-col items-center gap-3">
          <Skeleton dark className="h-12 w-72" />
          <Skeleton dark className="h-3 w-56" />
        </div>
      </section>
      <div className="container-xl py-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
