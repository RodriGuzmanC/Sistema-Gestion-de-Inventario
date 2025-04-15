"use client"

import { useState } from "react"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRequest } from "@/utils/utils"

interface EditFormProps {
    isOpen: boolean
    onClose: () => void
    client: Client
}


export default function EditClientForm({ isOpen, onClose, client }: EditFormProps) {
    const [formData, setFormData] = useState<Omit<Client, "id" | "fecha_creacion">>(client)
    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!client) return
        if (!formData.nombre.trim()) {
            alert("El nombre de la cliente es obligatorio")
            return
        }

        setIsSubmitting(true)
        try {
            const { error } = await apiRequest({ url: `clients/${client.id}`, method: "PUT", body: formData })

            if (error) {
                throw new Error("Error al actualizar la cliente")
            }

            // Revalidate clients data
            mutate("clients")
            onClose()
        } catch (error) {
            console.error("Error updating client:", error)
            alert("Error al actualizar la cliente")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                </DialogHeader>
                
                    <div>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-nombre">Nombre</Label>
                                <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre de la cliente"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
