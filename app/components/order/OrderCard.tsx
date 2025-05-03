import React, { useState } from 'react'
import { CalendarDays, Eye, MoreVertical, Package, Pen, Trash, Truck } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { apiRequest, formatearFechaLarga } from '@/utils/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from 'sonner'



const statusMap = {
    1: { label: "En proceso", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
    2: { label: "Separado", variant: "warning" as const, color: "bg-amber-100 text-amber-800" },
    3: { label: "Entregado", variant: "success" as const, color: "bg-green-100 text-green-800" },
  }
  
  const deliveryMethodMap = {
    1: {
      label: "Entrega en lugar público",
      icon: Truck,
      description: "Entrega en un punto acordado",
      color: "bg-purple-100 text-purple-800",
    },
    2: {
      label: "Delivery",
      icon: Package,
      description: "Entrega a domicilio",
      color: "bg-indigo-100 text-indigo-800",
    },
    3: {
      label: "Recojo en taller",
      icon: Package,
      description: "Cliente recoge en tienda",
      color: "bg-teal-100 text-teal-800",
    },
  }

export default function OrderCard({ order, mutate }: { order: OrderWithBasicRelations, mutate: () => void }) {
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    async function eliminar(id: number) {
        try {
          const res : DataResponse<Order> = await apiRequest({ url: `orders/${id}`, method: 'DELETE' })
          if (res.error){
            throw new Error(res.error)
          }
          console.log("Pedido eliminado:", res.data)
          toast.success("Pedido eliminado correctamente")
          mutate()
          setOpenDeleteModal(false)
        } catch (error) {
          console.error("Error eliminando el pedido:", error)
          toast.error("Error al eliminar el pedido, intentalo mas tarde")
        }
    }

    const status = statusMap[order.estado_pedido_id as 1 | 2 | 3]
  const deliveryMethod = deliveryMethodMap[order.metodo_entrega_id as 1 | 2 | 3]

    return (
        <Card
      key={order.id}
      className="relative overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-[0.99] sm:hover:scale-[1.01]"
    >
      {/* Status indicator strip */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          order.estado_pedido_id === 1 ? "bg-blue-500" : order.estado_pedido_id === 2 ? "bg-amber-500" : "bg-green-500"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

      {/* Actions menu */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <span className="sr-only">Abrir menú</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`pedidos/${order.id}/detalle`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                <span>Ver detalle</span>
              </DropdownMenuItem>
            </Link>
            <Link href={`pedidos/${order.id}/editar`}>
              <DropdownMenuItem>
                <Pen className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete confirmation modal */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle>¿Estás seguro de eliminar este pedido?</DialogTitle>
            <DialogDescription>
              El pedido será inhabilitado y no aparecerá en tu listado de pedidos, pero podrás restablecerlo en la
              sección Pedidos eliminados
            </DialogDescription>
            <div className="flex justify-end space-x-2 pt-2">
              <Button onClick={() => setOpenDeleteModal(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={() => eliminar(order.id)} variant="destructive">
                Eliminar
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">Orden N° {order.id}</CardTitle>
            <Badge variant={status.variant} className={`${status.color} w-fit text-sm px-3 py-1 font-medium`}>
              {status.label}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">Creado: {formatearFechaLarga(order.fecha_creacion ?? '')}</div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 pt-2">
        {/* Delivery Method */}
        <div className="rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground mb-2">Método de entrega:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center gap-2 rounded-full ${deliveryMethod.color} px-3 py-1.5 w-fit`}>
                      {React.createElement(deliveryMethod.icon, {
                        className: "h-4 w-4",
                      })}
                      <span className="font-medium text-sm">{deliveryMethod.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{deliveryMethod.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            
          </div>
        </div>

        {/* Dates */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <CalendarDays className="h-5 w-5 text-primary shrink-0" />
            <div className="grid gap-1">
              <p className="font-medium text-sm">Fecha de pedido</p>
              <p className="text-sm text-muted-foreground">{formatearFechaLarga(order.fecha_pedido)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <Truck className="h-5 w-5 text-primary shrink-0" />
            <div className="grid gap-1">
              <p className="font-medium text-sm">Fecha de entrega</p>
              <p className="text-sm text-muted-foreground">{formatearFechaLarga(order.fecha_entrega)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    )
}