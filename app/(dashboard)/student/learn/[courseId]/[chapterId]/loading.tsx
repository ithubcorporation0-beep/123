import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-80 border-r bg-card p-6 space-y-6 shrink-0">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="space-y-3 pt-4 border-t">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Main Video Area Skeleton */}
      <div className="flex-1 p-6 md:p-10 space-y-6 max-w-5xl">
        <Skeleton className="aspect-video w-full rounded-3xl" />
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-2/3 rounded-2xl" />
            <Skeleton className="h-4 w-1/3 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-36 rounded-2xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}
