"use client"

import { useState } from "react"
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
  client: Client
}

export default function DeleteClientForm({ isOpen, onClose, client }: DeleteFormProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!client) return

    setIsDeleting(true)
    try {

      const { error } = await apiRequest({ url: `clients/${client.id}`, method: "DELETE" })

      if (error) {
        throw new Error("Error al eliminar la cliente")
      }

      // Revalidate clients data
      mutate("clients")
      onClose()
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("Error al eliminar la cliente")
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
              <div>
                Esta acción eliminará permanentemente al cliente <strong>{client.nombre}</strong>. Esta acción no se
                puede deshacer.
              </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
