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
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import OrderFilter from '@/app/components/order/FilterOrders'
import OrderStatusService from '@/features/orders/OrderStatusService'
import DeliveryService from '@/features/delivery/DeliveryService'
import OrderCard from '@/app/components/order/OrderCard'
import { CustomLoader } from '@/app/components/Loader'
import OrderCardSkeleton from '@/app/components/skeletons/OrderSkeleton'

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



export default function OrdersList() {
    const [ordenes, setOrdenes] = useState<OrderWithBasicRelations[]>([])
    const [filteredOrders, setFilteredOrders] = useState<OrderWithBasicRelations[]>([])
    const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
    const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([])

    const [loading, setLoading] = useState<boolean>(true)
    useEffect(()=>{
        async function cargar(){
            const ordenes = await OrderService.getAll()
            setOrdenes(ordenes)
            setFilteredOrders(ordenes)
        }
        async function cargarEstadosyMetodos(){
          const orderStatuses = await OrderStatusService.getAll()
          setOrderStatuses(orderStatuses)
          const deliveryMethods = await DeliveryService.getAll()
          setDeliveryMethods(deliveryMethods)
        }
        cargar()
        cargarEstadosyMetodos()
        setLoading(false)
    }, [])
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Pedidos</h1>
      <OrderFilter orders={ordenes} setOrders={setFilteredOrders} deliveryMethods={deliveryMethods} orderStatuses={orderStatuses} ></OrderFilter>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Listado */}

        <CustomLoader loading={loading} fallback={Array.from({ length: 8 }).map((_, i) => <OrderCardSkeleton key={i} />)}>
        {filteredOrders.map((order) => (
          <OrderCard order={order}></OrderCard>
        ))}
        </CustomLoader>
      </div>
    </div>
  )
}

