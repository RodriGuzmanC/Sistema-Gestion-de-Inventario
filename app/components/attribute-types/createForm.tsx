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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { apiRequest } from "@/utils/utils"


interface CreateAttributeTypeFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export default function CreateAttributeTypeForm({
    open,
    onOpenChange,
    onSuccess
}: CreateAttributeTypeFormProps) {
    const [nombre, setNombre] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nombre.trim()) {
            toast({
                title: "Error",
                description: "El nombre del tipo de atributo es requerido",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const body: Omit<AttributeType, "id"> = {
                nombre: nombre,
            }
            
            const response = await apiRequest({
                url: "products/attributes-types",
                method: "POST",
                body: body,
            })

            if (response.error) {
                throw new Error(response.error)
            }

            toast({
                title: "Éxito",
                description: "Tipo de atributo creado correctamente",
            })

            setNombre("")
            onOpenChange(false)
            onSuccess()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al crear el tipo de atributo",
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
                    <DialogTitle>Crear Tipo de Atributo</DialogTitle>
                    <DialogDescription>
                        Ingrese el nombre para el nuevo tipo de atributo.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="col-span-3"
                                placeholder="Ej: Talla, Color, Material"
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
