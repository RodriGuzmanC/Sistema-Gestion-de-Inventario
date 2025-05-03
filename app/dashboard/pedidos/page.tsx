'use client'
import React, { useEffect, useState } from 'react'
import OrderFilter from '@/app/components/order/FilterOrders'
import OrderCard from '@/app/components/order/OrderCard'
import OrderCardSkeleton from '@/app/components/skeletons/OrderSkeleton'
import ErrorPage from '@/app/components/global/skeletons/ErrorPage'
import useSWR from 'swr'
import { swrSettings } from '@/utils/swr/settings'
import { apiRequest } from '@/utils/utils'
import NotFound from '@/app/components/global/skeletons/NotFound'
import { FolderPlus } from 'lucide-react'



export default function OrderList() {
  const [filteredOrders, setFilteredOrders] = useState<OrderWithBasicRelations[]>([])

    // Hook SWR para obtener todas las solicitudes en paralelo
    const { data, error, isLoading, mutate } = useSWR(
        ['orders', 'order-statuses', 'delivery-methods'],
        async () => {
            const ordersPromise = apiRequest({ url: 'orders?category=entrada' });
            const statusesPromise = apiRequest({ url: 'orders/order-statuses/' });
            const deliveryMethodsPromise = apiRequest({ url: 'orders/delivery-methods/' });

            const [orders, statuses, deliveryMethods] = await Promise.all([ordersPromise, statusesPromise, deliveryMethodsPromise]);

            return { 
                orders: orders as PaginatedResponse<OrderWithBasicRelations>,
                statuses: statuses as PaginatedResponse<OrderStatus>,
                deliveryMethods: deliveryMethods as PaginatedResponse<DeliveryMethod>
             };
        },
        swrSettings
    );

    useEffect(() => {
        if (data && data.orders) {
            setFilteredOrders(data.orders.data);
        }
    }, [data]);

    // Manejo de errores
    if (error || data?.deliveryMethods.error || data?.orders.error || data?.statuses.error) {
        return <ErrorPage />;
    }

    // Manejo de carga
    if (isLoading || !data) {
        return <OrderCardSkeleton />;
    }

    if (data.orders.data?.length === 0) {
        return <NotFound itemName='Ordenes' description='Parece que aun no haz creado ninguna orden' createLink='/dashboard/pedidos/crear'></NotFound>
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-2">Aqui se encuentran los pedidos para producir prendas</h1>
            <OrderFilter
                orders={data.orders.data}
                setOrders={setFilteredOrders}
                deliveryMethods={data.deliveryMethods.data}
                orderStatuses={data.statuses.data}
                createLink='pedidos/crear'
            />
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {filteredOrders.length === 0 ? (
                    <p className="text-center text-gray-500">No se encontraron pedidos que coincidan con tu búsqueda.</p>
                ) : (
                    filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} mutate={mutate}/>
                    ))
                )}
            </div>
        </div>
    );
}

