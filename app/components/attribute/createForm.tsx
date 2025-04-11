"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { apiRequest } from "@/utils/utils"


interface CreateAttributeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attributeTypeId: number
  attributeTypeName: string
  onSuccess: () => void
}

export default function CreateAttributeForm({
  open,
  onOpenChange,
  attributeTypeId,
  attributeTypeName,
  onSuccess,
}: CreateAttributeFormProps) {
  const [valor, setValor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        tipo_atributo_id: attributeTypeId,
        valor: valor
      }
      const response = await apiRequest({
        url: "products/attributes-types/attributes",
        method: "POST",
        body: body
      })

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Éxito",
        description: "Atributo creado correctamente",
      })

      setValor("")
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el atributo",
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
          <DialogTitle>Crear Atributo</DialogTitle>
          <DialogDescription>
            Ingrese el valor para el nuevo atributo de tipo <strong>{attributeTypeName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="col-span-3"
                placeholder="Ej: S, M, L, XL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
