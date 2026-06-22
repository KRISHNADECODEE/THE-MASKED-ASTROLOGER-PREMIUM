import { Skeleton, ListSkeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="p-5 md:p-8 lg:p-10" style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-3 w-80 max-w-full mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.25)" }}>
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <ListSkeleton rows={3} />
    </div>
  );
}
