"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { swrSettings } from "@/utils/swr/settings"
import CreateCategoryForm from "@/app/components/categories/createForm"
import EditCategoryForm from "@/app/components/categories/editForm"
import DeleteCategoryForm from "@/app/components/categories/deleteForm"
import { apiRequest } from "@/utils/utils"


export default function CategoriesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // Fetch categories using SWR
    const {
        data: categoriesResponse,
        error,
        isLoading,
    } = useSWR<PaginatedResponse<Category>>(
        "categories",
        async () => {
            const res: PaginatedResponse<Category> = await apiRequest({ url: "categories", method: "GET"})
            if (res.error) {
                throw new Error("API request failed")
            }
            return res
        },
        swrSettings,
    )

    const categories = categoriesResponse?.data || []

    // Open create modal
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true)
    }

    // Open edit modal
    const handleOpenEditModal = (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId) ?? null
        setSelectedCategory(category)
        setIsEditModalOpen(true)
    }

    // Open delete dialog
    const handleOpenDeleteDialog = (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId) ?? null
        setSelectedCategory(category)
        setIsDeleteDialogOpen(true)
    }

    if (isLoading) {
        return <div className="p-8 text-center">Cargando categorías...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error al cargar las categorías</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categorías</h1>
                <Button onClick={handleOpenCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
                </Button>
            </div>

            {categories.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">No hay categorías disponibles</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.nombre}</TableCell>
                                <TableCell>{category.descripcion || "-"}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(category.id)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleOpenDeleteDialog(category.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Form Components */}
            <CreateCategoryForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            {selectedCategory && (
                <EditCategoryForm
                    key={selectedCategory.id}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    category={selectedCategory}
                />
            )}

            {selectedCategory && (
                <DeleteCategoryForm
                    key={selectedCategory.id}
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    category={selectedCategory}
                />
            )}
        </div>
    )
}
