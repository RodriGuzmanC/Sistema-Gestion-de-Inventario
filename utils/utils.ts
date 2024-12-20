'use client';
import { useLoading } from '@/app/components/LoadingContext';
import { toast } from 'sonner';

export const executeAsyncFunction = async (
  asyncFunction: () => Promise<any>
) => {
  const { setLoading } = useLoading();

  try {
    // Mostrar la pantalla de carga
    setLoading(true);

    // Ejecutar la función asincrónica
    const result = await asyncFunction();

    // Terminar la pantalla de carga
    setLoading(false);
    return result;
  } catch (error) {
    // Terminar la pantalla de carga
    setLoading(false);

    // Mostrar el error con Sonner
    toast.error(error instanceof Error ? error.message : 'Ha ocurrido un error');
  }
};



// Carga el stock total haciendo un conteo del stock de las variaciones de un producto
export function cargarStockTotal(product: ProductWithBasicRelations) {
  let stockTotal = 0;
  product.variaciones.map((variacion) => {
      stockTotal = stockTotal + variacion.stock
  })
  return stockTotal
}


// Funcion para calcular el subtotal de los detalles de pedido pasado
export function calcularSubTotal(orderItems: Partial<OrderDetail>[]): number {
  let subTotal = 0;

  orderItems.forEach((order) => {
      // Verificar si hay un precio rebajado válido, de lo contrario usar el precio normal
      const precio = (order.precio_rebajado !== 0 && order.precio_rebajado !== undefined)
          ? order.precio_rebajado
          : (order.precio ?? 0);

      // Sumar el total del producto al subtotal
      subTotal += precio * (order.cantidad ?? 0);
  });

  return subTotal;
}


export function calcularStockTotal(orderItems: Partial<OrderDetail>[]) {
  let stockTotal = 0;
  orderItems.map((order) => {
      stockTotal = stockTotal + (order.cantidad ?? 0)
  })
  return stockTotal
}