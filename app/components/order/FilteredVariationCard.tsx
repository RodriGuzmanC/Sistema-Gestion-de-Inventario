import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, Users } from 'lucide-react'

interface VariationCardProps {
  variation: VariationWithRelations // Reemplazar con el tipo correcto
  addToOrder: (variation: VariationWithRelations) => void
}

export default function FilteredVariationCard({ variation, addToOrder }: VariationCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="grid gap-4">
          {/* Atributos */}
          <div className="flex flex-wrap items-center gap-3">
            {variation.variaciones_atributos.map((variacionAtributo: any) => (
              <div 
                key={variacionAtributo.id} 
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-xs text-muted-foreground">
                  {variacionAtributo.atributos.tipos_atributos.nombre}
                </span>
                <Badge 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium bg-primary/10 hover:bg-primary/15"
                >
                  {variacionAtributo.atributos.valor}
                </Badge>
              </div>
            ))}
          </div>

          {/* Información y Precios */}
          <div className="grid gap-3 rounded-lg bg-muted/50 p-3">
            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Stock:</span>
              <span className="font-medium">{variation.stock} unidades</span>
            </div>

            {/* Precios */}
            <div className="grid gap-2 sm:grid-cols-2">
              {/* Precio Unitario */}
              <div className="flex items-center gap-3 rounded-md bg-background p-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Precio unitario</p>
                  <p className="font-semibold">
                    S/ {variation.precio_unitario}
                  </p>
                </div>
              </div>

              {/* Precio Mayorista */}
              <div className="flex items-center gap-3 rounded-md bg-background p-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Precio mayorista</p>
                  <p className="font-semibold">
                    S/ {variation.precio_mayorista}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          <Button 
            onClick={() => addToOrder(variation)}
            className="w-full sm:w-auto"
          >
            Seleccionar variación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

