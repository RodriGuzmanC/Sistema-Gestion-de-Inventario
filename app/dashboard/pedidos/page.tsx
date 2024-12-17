'use client'
import { CalendarDays, Package, Truck } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import React, { useEffect, useState } from 'react'
import OrderService from '@/features/orders/OrderService'

interface Order {
  id: number
  quantity: number
  orderDate: string
  deliveryDate: string
  status: "en-proceso" | "entregado" | "cancelado"
  deliveryMethod: "delivery" | "pickup"
  createdAt: string
}

const orders: Order[] = [
  {
    id: 1561,
    quantity: 20,
    orderDate: "12 de marzo del 2024",
    deliveryDate: "16 de marzo del 2024",
    status: "en-proceso",
    deliveryMethod: "delivery",
    createdAt: "12/12/24",
  },
  {
    id: 1562,
    quantity: 15,
    orderDate: "13 de marzo del 2024",
    deliveryDate: "17 de marzo del 2024",
    status: "entregado",
    deliveryMethod: "pickup",
    createdAt: "12/12/24",
  },
]

const statusMap = {
  1: { label: "En proceso", variant: "default" as const },
  2: { label: "Separado", variant: "destructive" as const },
  3: { label: "Entregado", variant: "secondary" as const },
}

const deliveryMethodMap = {
  1: { label: "Entrega en lugar publico", icon: Truck },
  2: { label: "Delivery", icon: Package },
  3: { label: "Recogo en taller", icon: Package },
}

export default function OrdersList() {
    const [ordenes, setOrdenes] = useState<OrderWithBasicRelations[]>([])
    useEffect(()=>{
        async function cargar(){
            const ordenes = await OrderService.getAll()
            setOrdenes(ordenes)
        }
        cargar()
    }, [])
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ordenes.map((order) => (
          <Card key={order.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Orden N° {order.id}</CardTitle>
                <Badge variant={statusMap[order.estado_pedido_id as 1 | 2 | 3].variant}>
                  {statusMap[order.estado_pedido_id  as 1 | 2 | 3].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cantidad:</span>
                  <span className="font-medium">{order.id} unidades</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Método de entrega:
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          {React.createElement(deliveryMethodMap[order.metodo_entrega_id as 1 | 2 | 3].icon, {
                            className: "h-4 w-4",
                          })}
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
                <div className="space-y-2 rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Fecha de pedido
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.fecha_pedido}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Fecha de entrega
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.fecha_entrega}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Creado el {order.fecha_creacion}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

