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


// Funcion para calcular el total teniendo en cuenta el precio y cantidad del pedido
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

// Funcion para calcular el stock total de una orden
export function calcularStockTotal(orderItems: Partial<OrderDetail>[]) {
  let stockTotal = 0;
  orderItems.map((order) => {
    stockTotal = stockTotal + (order.cantidad ?? 0)
  })
  return stockTotal
}


// Función para convertir el número del mes en su nombre correspondiente
const obtenerNombreMes = (mes: number): string => {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return meses[mes];
};

// Función para transformar la fecha al formato "19 de noviembre del 2024"
export const formatearFechaLarga = (fecha: string): string => {
  try {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = obtenerNombreMes(fechaObj.getMonth());
    const anio = fechaObj.getFullYear();

    return `${dia} de ${mes} del ${anio}`;
  } catch (error) {
    return ''
  }
};

// Función para transformar la fecha al formato "19/12/2024"
export const formatearFechaCorta = (fecha: string): string => {
  try {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();

    return `${dia}/${mes}/${anio}`;
  } catch (error) {
    return ''
  }
};



export const enlazarNombreDeProductoConAtributos = (item: OrderDetailWithFullRelations) => {
  let nombre = item.variaciones.productos.nombre_producto ?? ""
  item.variaciones.variaciones_atributos.map((variacionAtributo) => {
    nombre += " | " + variacionAtributo.atributos.tipos_atributos.nombre + " " + variacionAtributo.atributos.valor
  })
  return nombre
}




export async function apiRequest (
  {url, method = 'GET', body = null, headers = {}} : 
  {url: string, method?: string, body?: any, headers?: any}) {
  // Configuración de cabeceras por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,  // Permite sobrescribir cabeceras por defecto
  };

  try {
    // Preparar el cuerpo de la solicitud dependiendo del método
    let requestBody: any = undefined;

    switch (method) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        // Para POST, PUT o PATCH, agregamos el body
        if (body) {
          requestBody = JSON.stringify(body);
        }
        break;
      case 'DELETE':
        // Eliminar el cuerpo para DELETE
        requestBody = undefined;
        break;
      default:
        // Para otros métodos como GET, no necesitamos cuerpo
        requestBody = undefined;
        break;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
    // Realizamos la solicitud fetch
    const res = await fetch(`${API_URL}/api/${url}`, {
      method,           // Método de la petición (GET, POST, DELETE, etc.)
      headers: defaultHeaders,  // Cabeceras de la solicitud
      body: requestBody,        // Cuerpo solo si es necesario (POST, PUT, PATCH)
    });

    // Manejar errores si la respuesta no es exitosa
    if (!res.ok) {
      const errorMessage = await res.text();  // Obtener el mensaje de error si existe
      throw new Error(`Error: ${res.status} - ${errorMessage}`);
    }

    // Procesar la respuesta dependiendo del método
    switch (method) {
      case 'GET':
        // Si es GET, retornamos los datos en formato JSON
        const data = await res.json();
        return data;

      case 'DELETE':
        // Si es DELETE, retornamos un mensaje indicando éxito sin contenido
        return res.status === 204 ? { message: 'Success, no content' } : {};

      default:
        // Para POST, PUT, PATCH, o cualquier otro método con respuesta en JSON
        return await res.json();
    }
  } catch (error) {
    // Manejo de errores: si ocurre un error, retornamos un objeto con el error
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return { errorMsg };
  }
};
