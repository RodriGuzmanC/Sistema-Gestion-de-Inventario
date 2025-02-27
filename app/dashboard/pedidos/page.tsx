'use client'
import React, { useEffect, useState } from 'react'
import OrderFilter from '@/app/components/order/FilterOrders'
import OrderCard from '@/app/components/order/OrderCard'
import OrderCardSkeleton from '@/app/components/skeletons/OrderSkeleton'
import ErrorPage from '@/app/components/global/skeletons/ErrorPage'
import useSWR from 'swr'
import { swrSettings } from '@/utils/swr/settings'
import { apiRequest } from '@/utils/utils'



export default function OrdersList() {
  const [filteredOrders, setFilteredOrders] = useState<OrderWithBasicRelations[]>([])

  
  // Hook SWR para obtener pedidos
  const { data: orders, error: ordersError, isLoading: isLoadingOrders,  } = useSWR<PaginatedResponse<OrderWithFullRelations>>('orders', () => apiRequest({url: 'orders'}), swrSettings)

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders.data);
    }
  }, [orders]);

  // Hook SWR para obtener los estados de las órdenes
  const { data: orderStatuses, error: orderStatusesError, isLoading: isLoadingOrderStatuses } = useSWR<PaginatedResponse<OrderStatus>>('order-statuses', () => apiRequest({url: 'orders/order-statuses/'}), swrSettings)

  // Hook SWR para obtener los métodos de entrega
  const { data: deliveryMethods, error: deliveryMethodsError, isLoading: isLoadingDeliveryMethods } = useSWR<PaginatedResponse<DeliveryMethod>>('delivery-methods', () => apiRequest({url: 'orders/delivery-methods/'}), swrSettings)

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
      <OrderFilter orders={orders.data} setOrders={setFilteredOrders} deliveryMethods={deliveryMethods.data} orderStatuses={orderStatuses.data} ></OrderFilter>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Listado */}

        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order}></OrderCard>
        ))}
      </div>
    </div>
  )
}

