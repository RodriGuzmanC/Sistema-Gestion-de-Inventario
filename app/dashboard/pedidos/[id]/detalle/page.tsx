'use client'

import ErrorPage from "@/app/components/global/skeletons/ErrorPage"
import OrderCardSkeleton from "@/app/components/skeletons/OrderSkeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import OrderService from "@/features/orders/OrderService"
import { swrSettings } from "@/utils/swr/settings"
import { apiRequest, calcularStockTotal, calcularSubTotal, formatearFechaLarga } from "@/utils/utils"
import { useEffect, useState } from "react"
import useSWR from "swr"

type Param = {
    id: string
}

export default function OrderDetail({params} : {params: Param}) {


  // Hook SWR para obtener los estados de las órdenes
  const { data: order, error, isLoading } = useSWR<DataResponse<OrderWithFullRelations>>('order-detail', () => apiRequest({url: `orders/${params.id}`}), swrSettings)

    // Manejo de errores
    if (error) {
      return <ErrorPage />;
    }
  
    // Manejo de carga
    if (isLoading || !order) {
      return <OrderCardSkeleton key={1}/>
    }
  
  return (
    <div className="container max-w-2xl mx-auto p-0 space-y-6">
      {/* Encabezado del pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Pedido #{order.data.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Fecha de Pedido</p>
              <p className="font-medium">
                {formatearFechaLarga(order.data.fecha_pedido)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de Entrega</p>
              <p className="font-medium">
                {formatearFechaLarga(order.data.fecha_entrega)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles de los productos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Productos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {order.data.detalles_pedidos.map((detalleIndividual) => (
            <div key={detalleIndividual.id} className="space-y-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <img
                    src={detalleIndividual.variaciones.productos.url_imagen || '/images/product-placeholder.jpg'}
                    alt={detalleIndividual.variaciones.productos.nombre_producto}
                    className="object-cover rounded-lg"
                  ></img>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">
                    {detalleIndividual.variaciones.productos.nombre_producto}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {detalleIndividual.variaciones.variaciones_atributos.map((attr) => (
                      <span key={attr.id} className="mr-2">
                        {attr.atributos.tipos_atributos.nombre}:{" "}
                        {attr.atributos.valor}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      S/{detalleIndividual.precio_rebajado || detalleIndividual.precio}
                    </span>
                    {detalleIndividual.precio_rebajado != 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        S/{detalleIndividual.precio}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">Cantidad: {detalleIndividual.cantidad}</p>
                </div>
              </div>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cantidad:</span>
              <span>{calcularStockTotal(order.data.detalles_pedidos ?? [])}</span>
            </div>
            {/*pedidoActual.precio_rebajado && (
              <div className="flex justify-between text-sm text-primary">
                <span>Descuento</span>
                <span>
                  -$
                  {(
                    (pedidoActual.precio - pedidoActual.precio_rebajado) *
                    pedidoActual.cantidad
                  ).toFixed(2)}
                </span>
              </div>
            )*/}
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>
                S/{calcularSubTotal(order.data.detalles_pedidos ?? [])}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

