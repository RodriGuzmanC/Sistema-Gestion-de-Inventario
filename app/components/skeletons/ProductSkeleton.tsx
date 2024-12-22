import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="md:w-[240px] overflow-hidden group relative border rounded-lg shadow-sm p-4">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Título */}
      <div className="mt-4">
        <Skeleton className="h-6 w-3/4" />
      </div>

      {/* Descripción */}
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Precios */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4 mt-1" />
        </div>
        <div>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4 mt-1" />
        </div>
      </div>
    </div>
  );
};
