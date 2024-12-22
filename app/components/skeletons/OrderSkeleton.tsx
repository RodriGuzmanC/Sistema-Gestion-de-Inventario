import { Skeleton } from "@/components/ui/skeleton";

const OrderCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-200 sm:hover:scale-[1.02]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-32" /> {/* Title Skeleton */}
          <Skeleton className="h-6 w-20" /> {/* Badge Skeleton */}
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-4">
        {/* Main Info */}
        <div className="grid gap-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="grid gap-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="grid gap-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <Skeleton className="h-4 w-40 border-t pt-4" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
