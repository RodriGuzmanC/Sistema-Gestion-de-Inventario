"use client"

import { useState, useEffect } from "react"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiRequest } from "@/utils/utils"

interface EditFormProps {
    isOpen: boolean
    onClose: () => void
    category: Category
}


export default function EditCategoryForm({ isOpen, onClose, category }: EditFormProps) {
    const [formData, setFormData] = useState<Omit<Category, "id">>(category)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!category) return
        if (!formData.nombre.trim()) {
            alert("El nombre de la categoría es obligatorio")
            return
        }

        setIsSubmitting(true)
        try {
            const { data, error } = await apiRequest({ url: `/categories/${category.id}`, method: "PUT", body: formData })

            if (error) {
                throw new Error("Error al actualizar la categoría")
            }

            // Revalidate categories data
            mutate("categories")
            onClose()
        } catch (error) {
            console.error("Error updating category:", error)
            alert("Error al actualizar la categoría")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Categoría</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="py-8 text-center">Cargando datos...</div>
                ) : (
                    <>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-nombre">Nombre</Label>
                                <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre de la categoría"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-descripcion">Descripción</Label>
                                <Textarea
                                    id="edit-descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Descripción de la categoría (opcional)"
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
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
