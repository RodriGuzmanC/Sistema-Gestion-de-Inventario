import React, { useState } from 'react'
import { CalendarDays, Edit, Eye, Layers, MoreVertical, Package, Trash, Truck } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { calcularStockTotal, formatearFechaLarga } from '@/utils/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"



const statusMap = {
    1: { label: "En proceso", variant: "default" as const },
    2: { label: "Separado", variant: "warning" as const },
    3: { label: "Entregado", variant: "success" as const },
}

const deliveryMethodMap = {
    1: { label: "Entrega en lugar publico", icon: Truck },
    2: { label: "Delivery", icon: Package },
    3: { label: "Recogo en taller", icon: Package },
}

export default function OrderCard({ order }: { order: OrderWithBasicRelations }) {
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    function eliminar(id: number) {
        console.log("Eliminando a:", id)
    }
    return (
        <Card
            key={order.id}
            className="relative overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-[0.99] sm:hover:scale-[1.02]"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="absolute bottom-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <Link href={`pedidos/${order.id}/detalle`}>
                            <DropdownMenuItem>

                                <Eye className="mr-2 h-4 w-4" />
                                <span>Ver detalle</span>
                            </DropdownMenuItem>

                        </Link>
                        <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                        </DropdownMenuItem>
                        

                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Modal Eliminar */}
                <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                    <DialogContent >
                        <DialogHeader className="space-y-4" >
                            <DialogTitle >¿Estás seguro de eliminar este producto?</DialogTitle>
                            <DialogDescription>
                                El producto sera inhabilitado y no aparecera en tu listado de productos, pero podras restablecerlo en la seccion "Productos eliminados"
                            </DialogDescription>
                            <div className="flex justify-end space-x-2">
                                <Button onClick={() => setOpenDeleteModal(false)} variant="outline">
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => {
                                        eliminar(order.id)
                                    }}
                                    variant="destructive"
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl font-bold">
                        Orden N° {order.id}
                    </CardTitle>
                    <Badge
                        variant={statusMap[order.estado_pedido_id as 1 | 2 | 3].variant}
                        className="w-fit text-sm px-3 py-1 font-medium"
                    >
                        {statusMap[order.estado_pedido_id as 1 | 2 | 3].label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="grid gap-6">
                {/* Información Principal */}
                <div className="grid gap-4 rounded-lg bg-muted/50 p-4">
                    

                    <div className="flex flex-col items-start gap-3 justify-between">
                        <span className="text-base text-muted-foreground">
                            Método de entrega:
                        </span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 shadow-sm">
                                        {React.createElement(
                                            deliveryMethodMap[order.metodo_entrega_id as 1 | 2 | 3].icon,
                                            {
                                                className: "h-5 w-5 text-primary",
                                            }
                                        )}
                                        <span className="font-medium">
                                            {deliveryMethodMap[order.metodo_entrega_id as 1 | 2 | 3].label}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Método de entrega seleccionado</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <div className="grid gap-1">
                            <p className="font-medium">
                                Fecha de pedido
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatearFechaLarga(order.fecha_pedido)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                        <Truck className="h-5 w-5 text-primary" />
                        <div className="grid gap-1">
                            <p className="font-medium">
                                Fecha de entrega
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatearFechaLarga(order.fecha_entrega)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-muted-foreground border-t pt-4">
                    Creado el {order.fecha_creacion}
                </div>
            </CardContent>
        </Card>
    )
}