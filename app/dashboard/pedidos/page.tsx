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
import SharedFormSkeleton from '@/app/components/global/skeletons/SharedFormSkeleton'
import ErrorPage from '@/app/components/global/skeletons/ErrorPage'
import useSWR from 'swr'



export default function OrdersList() {
  const [filteredOrders, setFilteredOrders] = useState<OrderWithBasicRelations[]>([])

  
  // Hook SWR para obtener pedidos
  const { data: orders, error: ordersError, isLoading: isLoadingOrders,  } = useSWR('pedidos', () => 
    OrderService.getAll(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  // Hook SWR para obtener los estados de las órdenes
  const { data: orderStatuses, error: orderStatusesError, isLoading: isLoadingOrderStatuses } = useSWR('pedidos/orderStatuses', () => OrderStatusService.getAll(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  // Hook SWR para obtener los métodos de entrega
  const { data: deliveryMethods, error: deliveryMethodsError, isLoading: isLoadingDeliveryMethods } = useSWR('pedidos/deliveryMethods', () => DeliveryService.getAll(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  // Manejo de errores
  if (ordersError || orderStatusesError || deliveryMethodsError) {
    return <ErrorPage />;
  }

  // Manejo de carga
  if (isLoadingOrders || isLoadingOrderStatuses || isLoadingDeliveryMethods || !orders || !orderStatuses || !deliveryMethods) {
    return <OrderCardSkeleton key={1}/>
  }


    
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Pedidos</h1>
      <OrderFilter orders={orders} setOrders={setFilteredOrders} deliveryMethods={deliveryMethods} orderStatuses={orderStatuses} ></OrderFilter>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Listado */}

        {filteredOrders.map((order) => (
          <OrderCard order={order}></OrderCard>
        ))}
      </div>
    </div>
  )
}

