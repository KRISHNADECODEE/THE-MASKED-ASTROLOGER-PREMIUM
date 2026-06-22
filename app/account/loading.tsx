import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }} className="pt-24 pb-16">
      <div className="container-xl">
        {/* Header card */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-10 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, var(--color-cosmic), var(--color-cosmic-800))", border: "1px solid rgba(209,168,110,0.25)" }}
        >
          <Skeleton dark className="w-14 h-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton dark className="h-6 w-48" />
            <Skeleton dark className="h-3 w-64 max-w-full" />
          </div>
        </div>

        {/* Tabs + panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-9 p-6 md:p-8 rounded-3xl" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
            <Skeleton className="h-6 w-48 mb-6" />
            <ListSkeleton rows={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
