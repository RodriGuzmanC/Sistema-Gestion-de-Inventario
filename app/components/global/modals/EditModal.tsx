"use client"

import { useState, useEffect } from "react"
import { useModal } from "@/utils/others/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const EditModal = () => {
  const { isOpen, type, onClose, data, entityType } = useModal()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    valor: "",
    url_base: ""
  })

  useEffect(() => {
    if (data) {
      setFormData({
        nombre: data.nombre || "",
        valor: data.valor || "",
        url_base: data.url_base || ""
      })
    }
  }, [data])

  if (!entityType) {
    return null
  }
  
  const isModalOpen = isOpen && type === "edit"

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Aquí iría la lógica para editar el elemento según entityType
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
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {entityType === "socialNetwork" && (
            <>
              <div>
                <Label>Nombre</Label>
                <Input
                  disabled={loading}
                  placeholder="Nombre de la red social"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label>URL Base</Label>
                <Input
                  disabled={loading}
                  placeholder="URL base"
                  value={formData.url_base}
                  onChange={(e) => setFormData({ ...formData, url_base: e.target.value })}
                />
              </div>
            </>
          )}
          {(entityType === "deliveryMethod" || entityType === "productStatus" || entityType === "attributeType") && (
            <div>
              <Label>Nombre</Label>
              <Input
                disabled={loading}
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
          )}
          {entityType === "attribute" && (
            <div>
              <Label>Valor</Label>
              <Input
                disabled={loading}
                placeholder="Valor del atributo"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

