import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function StoreLoading() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="pt-24 pb-14" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <div className="container-xl flex flex-col items-center gap-4">
          <Skeleton dark className="h-12 w-72" />
          <Skeleton dark className="h-3 w-96 max-w-full" />
        </div>
      </section>
      <div className="container-xl py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
