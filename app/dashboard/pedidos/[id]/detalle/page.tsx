'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import OrderService from "@/features/orders/OrderService"
import { calcularStockTotal, calcularSubTotal } from "@/utils/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import { useEffect, useState } from "react"

type Param = {
    id: string
}

export default function OrderDetail({params} : {params: Param}) {

  // Fechas de prueba
  const fechaPedido = new Date(2024, 0, 15)
  const fechaEntrega = new Date(2024, 0, 20)

  const [pedidoActual, setPedidoActual] = useState<OrderWithFullRelations>()
  useEffect(()=>{
    async function cargarPedido(){
        const pedido = await OrderService.getOne(parseInt(params.id))
        console.log("PedidoActual")
        console.log(pedido)
        if (!pedido) {
            console.error("Pedido no encontrado");
            return;
          }
        setPedidoActual(pedido)
    }
    cargarPedido()
  }, [])

  if (!pedidoActual) return <div>Pedido no se ha cargado</div>;
      if (!params?.id) {
        return <div>Parámetro ID no encontrado</div>;
      }
  return (
    <div className="container max-w-2xl mx-auto space-y-6">
      {/* Encabezado del pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Pedido #{pedidoActual?.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Fecha de Pedido</p>
              <p className="font-medium">
                {format(fechaPedido, "PPP", { locale: es })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de Entrega</p>
              <p className="font-medium">
                {format(fechaEntrega, "PPP", { locale: es })}
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
          {pedidoActual?.detalles_pedidos.map((detalleIndividual) => (
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
                    {detalleIndividual.precio_rebajado && (
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
              <span>{calcularStockTotal(pedidoActual?.detalles_pedidos ?? [])}</span>
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
                S/{calcularSubTotal(pedidoActual?.detalles_pedidos ?? [])}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

