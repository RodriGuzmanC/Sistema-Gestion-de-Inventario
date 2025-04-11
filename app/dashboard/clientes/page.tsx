"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { swrSettings } from "@/utils/swr/settings"

import { apiRequest } from "@/utils/utils"
import CreateClientForm from "@/app/components/clients/createForm"
import EditClientForm from "@/app/components/clients/editForm"
import DeleteClientForm from "@/app/components/clients/deleteForm"


export default function ClientsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    // Fetch clients using SWR
    const {
        data: categoriesResponse,
        error,
        isLoading,
    } = useSWR<PaginatedResponse<Client>>(
        "clients",
        async () => {
            const res: PaginatedResponse<Client> = await apiRequest({ url: "clients", method: "GET"})
            if (res.error) {
                throw new Error("API request failed")
            }
            return res
        },
        swrSettings,
    )

    const clients = categoriesResponse?.data || []

    // Open create modal
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true)
    }

    // Open edit modal
    const handleOpenEditModal = (clientId: number) => {
        const client = clients.find((cli) => cli.id === clientId) ?? null
        setSelectedClient(client)
        setIsEditModalOpen(true)
    }

    // Open delete dialog
    const handleOpenDeleteDialog = (clientId: number) => {
        const client = clients.find((cli) => cli.id === clientId) ?? null
        setSelectedClient(client)
        setIsDeleteDialogOpen(true)
    }

    if (isLoading) {
        return <div className="p-8 text-center">Cargando clientes...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error al cargar las clientes</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <Button onClick={handleOpenCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
            </div>

            {clients.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">No hay clientes disponibles</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.id}</TableCell>
                                <TableCell>{client.nombre}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(client.id)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleOpenDeleteDialog(client.id)}
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
            <CreateClientForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            {selectedClient && (
                <EditClientForm
                    key={selectedClient.id}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    client={selectedClient}
                />
            )}

            {selectedClient && (
                <DeleteClientForm
                    key={selectedClient.id}
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    client={selectedClient}
                />
            )}
        </div>
    )
}
