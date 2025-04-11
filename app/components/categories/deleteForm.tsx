"use client"

import { useState, useEffect } from "react"
import { mutate } from "swr"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiRequest } from "@/utils/utils"

interface DeleteFormProps {
  isOpen: boolean
  onClose: () => void
  category: Category
}

export default function DeleteCategoryForm({ isOpen, onClose, category }: DeleteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!category) return

    setIsDeleting(true)
    try {

      const { data, error } = await apiRequest({ url: `/categories/${category.id}`, method: "DELETE" })

      if (error) {
        throw new Error("Error al eliminar la categoría")
      }

      // Revalidate categories data
      mutate("categories")
      onClose()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error al eliminar la categoría")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading ? (
              "Cargando información..."
            ) : (
              <>
                Esta acción eliminará permanentemente la categoría <strong>"{category.nombre}"</strong>. Esta acción no se
                puede deshacer.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isDeleting || isLoading}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
