import { Skeleton } from "@/components/ui/Skeleton";

export default function MatchmakingLoading() {
  return (
    <div style={{ background: "var(--color-parchment)", minHeight: "100vh" }}>
      <section className="pt-24 pb-14" style={{ background: "linear-gradient(180deg, var(--color-cosmic) 0%, var(--color-midnight-800) 100%)" }}>
        <div className="container-xl flex flex-col items-center gap-3">
          <Skeleton dark className="h-12 w-80 max-w-full" />
          <Skeleton dark className="h-3 w-96 max-w-full" />
        </div>
      </section>
      <div className="container-xl py-12 grid md:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
