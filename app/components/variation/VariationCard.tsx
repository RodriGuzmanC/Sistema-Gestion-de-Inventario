import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Pencil, Trash } from 'lucide-react'
import { EditVariationModal } from "./EditVariationModal"
import { useState } from "react"

interface VariationProps {
  variation: VariationWithRelations
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function VariationCard({
  variation,
  onEdit,
  onDelete,
}: VariationProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="relative">
      <CardContent className="p-6">
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
              <DropdownMenuItem >
                <Pencil className="mr-2 h-4 w-4" />
                Es
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(variation.id.toString())}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
              {variation.variaciones_atributos.map((variacion_atributo)=>(
                <Badge variant="outline" className="capitalize">
                  <div>{variacion_atributo.atributos.valor}</div>
                </Badge>
              ))}
            
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio unitario:</span>
              <span className="font-medium">${variation.precio_unitario.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio mayorista:</span>
              <span className="font-medium">${variation.precio_mayorista.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stock:</span>
              <span className="font-medium">{variation.stock} Unidades</span>
            </div>
            <EditVariationModal variationObj={variation}></EditVariationModal>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

