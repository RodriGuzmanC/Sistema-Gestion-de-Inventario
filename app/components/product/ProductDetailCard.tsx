import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ProductDetailProps {
  product: ProductWithFullRelations
}

export function ProductDetailCard({ product }: ProductDetailProps) {
  return (
    <Card className="mb-8">
      <CardContent className="flex flex-col md:flex-row gap-6 p-6">
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
          <img
            src={product.url_imagen}
            alt={product.nombre_producto}
            className="object-cover"
            sizes="(max-width: 128px) 100vw, 128px"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">{product.nombre_producto}</h2>
          <p className="text-sm text-muted-foreground">{product.descripcion}</p>
          <p className="text-sm font-medium">Rango del precio: S/{product.precio_unitario} - S/{product.precio_mayorista}</p>
        </div>
      </CardContent>
    </Card>
  )
}

