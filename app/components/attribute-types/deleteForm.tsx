"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { AlertTriangle } from 'lucide-react'
import { apiRequest } from "@/utils/utils"


interface DeleteAttributeTypeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attributeType: AttributeTypesWithAttributes
  onSuccess: () => void
}

export default function DeleteAttributeTypeForm({ 
  open, 
  onOpenChange,
  attributeType,
  onSuccess
}: DeleteAttributeTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)

    try {
      const response = await apiRequest({
        url: `products/attributes-types/${attributeType.id}`,
        method: "DELETE",
      })

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Éxito",
        description: "Tipo de atributo eliminado correctamente",
      })
      
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el tipo de atributo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasAttributes = attributeType?.atributos?.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar Tipo de Atributo
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar el tipo de atributo <strong>{attributeType?.nombre}</strong>?
            {hasAttributes && (
              <div className="mt-2 text-red-500">
                ¡Advertencia! Este tipo de atributo tiene {attributeType?.atributos?.length} atributos asociados que también serán eliminados.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
