import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calcularStockTotal, calcularSubTotal } from "@/utils/utils"
import SelectedOrderItemCard from "./SelectedOrderItemCard"

interface OrderDetailsProps {
  orderItems: Partial<PrepareOrderDetail>[]
  setOrderItems: (orderItems: Partial<PrepareOrderDetail>[]) => any
  updatePrice: (id: number, price: number, isDiscounted: boolean) => void
  updateQuantity: (id: number, increment: boolean) => void
  handleSubmit: () => void
}

export default function OrderDetailsColumn({
  orderItems,
  setOrderItems,
  updatePrice,
  updateQuantity,
  handleSubmit
}: OrderDetailsProps) {
  const stockTotal = calcularStockTotal(orderItems)
  const subTotal = calcularSubTotal(orderItems)

    function quitarItemDeOrden(id: number){
        const items = orderItems.filter((item) => item.id !== id);
        setOrderItems(items)
    }

  return (
    <Card className="flex h-full min-h-[500px] max-h-[900px] flex-col">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 mb-3 text-xl">
          <ShoppingCart className="h-5 w-5" />
          Detalles del pedido
        </CardTitle>
        <Alert variant="default" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs text-muted-foreground">
            Puedes cambiar el precio en el detalle del pedido, esto no afectará el precio del producto.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="flex-1 px-3">
        <ScrollArea className="h-full pr-4">
          <div className="grid gap-3">
            {orderItems.map((item) => (
              <SelectedOrderItemCard
                key={item.id}
                item={item}
                updatePrice={updatePrice}
                updateQuantity={updateQuantity}
                quitarItemFun={quitarItemDeOrden}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col border-t bg-muted/30 p-6">
        <div className="mb-6 grid w-full gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cantidad total:</span>
            <span className="font-medium">{stockTotal} unidades</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">S/</span>
              <span className="text-lg font-semibold">{subTotal}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full gap-2 text-base"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4" />
          Crear pedido
        </Button>
      </CardFooter>
    </Card>
  )
}

