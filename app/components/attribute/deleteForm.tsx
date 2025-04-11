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
import { AlertTriangle } from "lucide-react"
import { apiRequest } from "@/utils/utils"


interface Attribute {
  id: number
  tipo_atributo_id: number
  valor: string
}

interface DeleteAttributeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attribute: Attribute
  attributeTypeName: string
  onSuccess: () => void
}

export default function DeleteAttributeForm({
  open,
  onOpenChange,
  attribute,
  attributeTypeName,
  onSuccess,
}: DeleteAttributeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)

    try {
      const response = await apiRequest({
        url: `products/attributes-types/attributes/${attribute.id}`,
        method: "DELETE",
      })

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Éxito",
        description: "Atributo eliminado correctamente",
      })

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el atributo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar Atributo
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar el atributo <strong>{attribute?.valor}</strong> del tipo{" "}
            <strong>{attributeTypeName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
