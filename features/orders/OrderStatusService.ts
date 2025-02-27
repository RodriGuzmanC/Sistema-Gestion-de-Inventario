import OrderStatusRepository from "@/data/respositories/OrderStatusRepository";


export default new class OrderStatusService {
    // Obtener todos los estados de órdenes
    async getAll(page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<OrderStatus[]>> {
        try {
            return await OrderStatusRepository.getOrderStatuses(page, itemsPerPage); // Llama al repositorio para obtener todos los estados
        } catch (error: any) {
            console.error('Error in OrderStatusService:', error.message);
            throw new Error('No se obtuvieron los estados de la orden, intenta más tarde.');
        }
    }

    // Obtener un estado de orden específico por su ID
    async getOne(id: number): Promise<DataResponse<OrderStatus>> {
        try {

            // Llama al repositorio para obtener un estado por su ID
            return await OrderStatusRepository.getOrderStatus(id);
        } catch (error: any) {
            console.error('Error in OrderStatusService:', error.message);
            throw new Error('El estado de la orden no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo estado de orden
    async create(orderStatus: Partial<OrderStatus>): Promise<DataResponse<OrderStatus>> {
        try {

            // Llama al repositorio para crear un nuevo estado
            const res = await OrderStatusRepository.createOrderStatus(orderStatus);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el estado de la orden, intenta más tarde.');
        }
    }

    // Actualizar un estado de orden existente
    async update(id: number, updates: Partial<OrderStatus>): Promise<DataResponse<OrderStatus>> {
        try {

            // Llama al repositorio para actualizar el estado
            const res = await OrderStatusRepository.updateOrderStatus(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar el estado de la orden, intenta más tarde.');
        }
    }

    // Eliminar un estado de orden
    async delete(id: number): Promise<DataResponse<OrderStatus>> {
        try {
            // Llama al repositorio para eliminar el estado
            return await OrderStatusRepository.deleteOrderStatus(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            throw new Error('Error al eliminar el estado de la orden, intenta más tarde.');
        }
    }
}
