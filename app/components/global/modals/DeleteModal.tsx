"use client"

import { useState } from "react"
import { useModal } from "@/utils/others/use-modal-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const DeleteModal = () => {
  const { isOpen, type, onClose, data, entityType } = useModal()
  const [loading, setLoading] = useState(false)

  if (!entityType) {
    return null
  }
  
  const isModalOpen = isOpen && type === "delete"

  const onDelete = async () => {
    try {
      setLoading(true)
      // Aquí iría la lógica para eliminar el elemento según entityType
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const title = {
    attribute: "Crear Atributo",
    attributeType: "Crear Tipo de Atributo",
    deliveryMethod: "Crear Método de Entrega",
    productStatus: "Crear Estado de Producto",
    socialNetwork: "Crear Red Social"
  }[entityType]

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={loading}
          >
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

