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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"

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
            {variation.variaciones_atributos.map((variacion_atributo) => (
              <Badge variant="outline" className="capitalize">
                <div>{variacion_atributo.atributos.valor}</div>
              </Badge>
            ))}

          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio unitario:</span>
              <span className="font-medium">S/{variation.precio_unitario.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio mayorista:</span>
              <span className="font-medium">S/{variation.precio_mayorista.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stock:</span>
              <span className="font-medium">{variation.stock} Unidades</span>
            </div>
            <EditVariationModal variationObj={variation}></EditVariationModal>
            <Dialog>
              <ContextMenu>
                <ContextMenuTrigger>Right click</ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Open</ContextMenuItem>
                  <ContextMenuItem>Download</ContextMenuItem>
                  <DialogTrigger asChild>
                    <ContextMenuItem>
                      <span>Delete</span>
                    </ContextMenuItem>
                  </DialogTrigger>
                </ContextMenuContent>
              </ContextMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Are you sure you want to permanently
                    delete this file from our servers?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="submit">Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

