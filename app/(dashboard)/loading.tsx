import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 rounded-2xl" />
        <Skeleton className="h-4 w-96 rounded-xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl border bg-card space-y-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="p-6 rounded-3xl border bg-card space-y-4">
        <Skeleton className="h-6 w-48 rounded-xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
