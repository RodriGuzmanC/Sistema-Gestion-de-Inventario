import { Skeleton } from "@/components/ui/skeleton";

export default function SharedFormSkeleton() {
  return (
    <div className="space-y-6  min-w-[300px]">
      {/* Título del formulario */}
      <Skeleton className="h-6 w-1/3" />

      {/* Campos del formulario */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            {/* Etiqueta */}
            <Skeleton className="h-4 w-1/4" />
            {/* Input */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>

      {/* Botón de acción */}
      <Skeleton className="h-10 w-1/3 rounded-md" />
    </div>
  );
};

