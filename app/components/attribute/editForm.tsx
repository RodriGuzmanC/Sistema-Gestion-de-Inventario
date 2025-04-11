"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { apiRequest } from "@/utils/utils"


interface Attribute {
  id: number
  tipo_atributo_id: number
  valor: string
}

interface EditAttributeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attribute: Attribute
  attributeTypeName: string
  onSuccess: () => void
}

export default function EditAttributeForm({
  open,
  onOpenChange,
  attribute,
  attributeTypeName,
  onSuccess,
}: EditAttributeFormProps) {
  const [valor, setValor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (attribute) {
      setValor(attribute.valor)
    }
  }, [attribute])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!valor.trim()) {
      toast({
        title: "Error",
        description: "El valor del atributo es requerido",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const body: Omit<Attribute, "id"> = {
        tipo_atributo_id: attribute.tipo_atributo_id,
        valor: valor,
      }
      const response = await apiRequest({
        url: `products/attributes-types/attributes/${attribute.id}`,
        method: "PUT",
        body: body
      })

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Éxito",
        description: "Atributo actualizado correctamente",
      })

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el atributo",
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
          <DialogTitle>Editar Atributo</DialogTitle>
          <DialogDescription>
            Modifique el valor del atributo de tipo <strong>{attributeTypeName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input id="valor" value={valor} onChange={(e) => setValor(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
