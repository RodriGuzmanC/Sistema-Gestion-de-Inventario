// orderDetailService.ts

import OrderDetailRepository from "@/data/respositories/OrderDetailRepository";
import VariationService from "../variations/VariationService";

export default new class OrderDetailService {
    // Obtener todos los detalles de una orden
    async getAll(orderId: number, page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<OrderDetail>> {
        try {

            return await OrderDetailRepository.getOrdersDetailsByOrder(orderId, page, itemsPerPage); // Llamamos al repositorio para obtener todos los detalles de la orden.
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in OrderDetailService:', error.message);
            }
            throw new Error('No se obtuvieron los detalles de la orden, intenta más tarde.');
        }
    }

    // Obtener un detalle de orden específico por su ID
    async getOne(id: number): Promise<DataResponse<OrderDetail>> {
        try {

            // Llamamos al repositorio para obtener el detalle de la orden por su ID
            return await OrderDetailRepository.getOrderDetail(id);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in OrderDetailService:', error.message);
            }
            throw new Error('El detalle de la orden no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo detalle de orden
    async create(orderDetail: Partial<OrderDetail>, orderCategory: Order['categoria_pedido']): Promise<DataResponse<OrderDetail>> {
        try {
            console.log(orderDetail)

            // Manejo de errores
            if (!orderDetail.variacion_id)
                throw new Error('Falta el ID de la variación');

            if (!orderDetail.cantidad || orderDetail.cantidad <= 0)
                throw new Error('La cantidad debe ser mayor que 0');

            // Validacion de stock
            const productVariation = await VariationService.getOne(orderDetail.variacion_id)

            const stockActual = Number(productVariation.data.stock ?? 0);
            if (orderCategory === 'salida' && orderDetail.cantidad > stockActual)
                throw new Error('Cantidad solicitada mayor al stock disponible.');

            // Llamamos al repositorio para crear el nuevo detalle de la orden
            const res = await OrderDetailRepository.createOrderDetail(orderDetail);

            //  Modificacion del stock de la variacion

            // Si es de corte
            let stockFinal = stockActual

            if (orderCategory == 'entrada') {
                stockFinal = stockFinal + Number(orderDetail.cantidad)
            }
            if (orderCategory == 'salida') {
                stockFinal = stockFinal - Number(orderDetail.cantidad)

            }
            await VariationService.update(orderDetail.variacion_id, {
                stock: stockFinal
            })

            // Retorna el objeto de pedido creado
            return res;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in OrderDetailService:', error.message);
            }
            throw new Error('Error al crear el detalle de la orden, intenta más tarde.');
        }
    }

    // Actualizar un detalle de orden existente
    async update(id: number, updates: Partial<OrderDetail>): Promise<DataResponse<OrderDetail>> {
        try {

            // Llamamos al repositorio para actualizar el detalle de la orden
            const res = await OrderDetailRepository.updateOrderDetail(id, updates);
            return res;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in OrderDetailService:', error.message);
            }
            throw new Error('Error al actualizar el detalle de la orden, intenta más tarde.');
        }
    }

    // Eliminar un detalle de orden
    async delete(id: number): Promise<DataResponse<OrderDetail>> {
        try {

            // Llamamos al repositorio para eliminar el detalle de la orden
            return await OrderDetailRepository.deleteOrderDetail(id);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in OrderDetailService:', error.message);
            }
            throw new Error('Error al eliminar el detalle de la orden, intenta más tarde.');
        }
    }
}
