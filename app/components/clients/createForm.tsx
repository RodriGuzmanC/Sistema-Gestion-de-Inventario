"use client"

import { useState } from "react"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRequest } from "@/utils/utils"

interface CreateFormProps {
    isOpen: boolean
    onClose: () => void
}


export default function CreateClientForm({ isOpen, onClose }: CreateFormProps) {
    const [formData, setFormData] = useState<Omit<Client, "id" | "fecha_creacion">>({
        nombre: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.nombre.trim()) {
            alert("El nombre del cliente es obligatorio")
            return
        }

        setIsSubmitting(true)
        try {
            const { error } = await apiRequest({ url: `clients/`, method: "POST", body: formData })


            if (error) {
                throw new Error("Error al crear el cliente")
            }

            // Revalidate clients data
            mutate("clients")
            handleClose()
        } catch (error) {
            console.error("Error creating client:", error)
            alert("Error al crear el cliente")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setFormData({ nombre: ""})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Nombre del cliente"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Creando..." : "Crear"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
