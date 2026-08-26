import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesCatalogLoading() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 max-w-7xl">
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-3/4 mx-auto rounded-2xl" />
          <Skeleton className="h-4 w-5/6 mx-auto rounded-xl" />
        </div>

        {/* Search & Filter Skeleton */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl border bg-card overflow-hidden space-y-4 p-5">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
              </div>
              <div className="pt-4 border-t flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
