// orderDetailService.ts

import OrderDetailRepository from "@/data/respositories/OrderDetailRepository";

export default new class OrderDetailService {
    // Obtener todos los detalles de una orden
    async getAll(orderId: number, page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<OrderDetail>> {
        try {

            return await OrderDetailRepository.getOrdersDetailsByOrder(orderId, page, itemsPerPage); // Llamamos al repositorio para obtener todos los detalles de la orden.
        } catch (error: any) {
            console.error('Error in OrderDetailService:', error.message);
            throw new Error('No se obtuvieron los detalles de la orden, intenta más tarde.');
        }
    }

    // Obtener un detalle de orden específico por su ID
    async getOne(id: number): Promise<DataResponse<OrderDetail>> {
        try {

            // Llamamos al repositorio para obtener el detalle de la orden por su ID
            return await OrderDetailRepository.getOrderDetail(id);
        } catch (error: any) {
            console.error('Error in OrderDetailService:', error.message);

            throw new Error('El detalle de la orden no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo detalle de orden
    async create(orderDetail: Partial<OrderDetail>): Promise<DataResponse<OrderDetail>> {
        try {

            // Llamamos al repositorio para crear el nuevo detalle de la orden
            const res = await OrderDetailRepository.createOrderDetail(orderDetail);
            return res;
        } catch (error) {
            console.error('Error in create:', error);

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
            console.error('Error in update:', error);

            throw new Error('Error al actualizar el detalle de la orden, intenta más tarde.');
        }
    }

    // Eliminar un detalle de orden
    async delete(id: number): Promise<DataResponse<OrderDetail>> {
        try {

            // Llamamos al repositorio para eliminar el detalle de la orden
            return await OrderDetailRepository.deleteOrderDetail(id);
        } catch (error: any) {
            console.error('Error in delete:', error);

            throw new Error('Error al eliminar el detalle de la orden, intenta más tarde.');
        }
    }
}
