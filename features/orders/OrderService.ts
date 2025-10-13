// socialNetworkService.ts

import OrderRepository from "@/data/respositories/OrderRepository";


export default new class OrderService {
    // Obtener todas las órdenes
    async getAll(pages: number = 1, itemsPerPage: number = 10, category: string): Promise<PaginatedResponse<OrderWithFullRelations>> {
        // Validar los parámetros de paginación
        if (pages <= 0 || itemsPerPage <= 0) {
            throw new Error("Parámetros de paginación inválidos");
        }

        try {
            return await OrderRepository.getOrders(pages, itemsPerPage, category); // Llamamos al repositorio para obtener todas las órdenes.
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in OrderService:', error.message);
            }
            throw new Error('No se obtuvieron las órdenes, intenta más tarde.');
        }
    }

    // Obtener una orden específica por su ID
    async getOne(id: number): Promise<DataResponse<OrderWithFullRelations>> {
        try {

            // Llamamos al repositorio para obtener la orden por su ID
            return await OrderRepository.getOrderWithAll(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in OrderService:', error.message);
            }
            throw new Error('La orden no existe o no se pudo obtener.');
        }
    }

    async getAllByDateAndClient(stateId: OrderStatus['id'], startDate: string, endDate: string, orderCategory: string, clientId: number): Promise<DataResponse<OrderWithFullRelations[]>> {
        try {
            // Llamamos al repositorio para obtener la orden por su ID
            return await OrderRepository.getOrdersByDateRangeAndClient(stateId, startDate, endDate, orderCategory, clientId);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in OrderService:', error.message);
            }
            throw new Error('La orden no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva orden
    async create(order: Partial<Order>): Promise<DataResponse<Order>> {
        try {
            // Llamamos al repositorio para crear la nueva orden
            const res = await OrderRepository.createOrder(order);
            return res;
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in OrderService:', error.message);
            }
            throw new Error('Error al crear la orden, intenta más tarde.');
        }
    }

    // Actualizar una orden existente
    async update(id: number, updates: Partial<Order>): Promise<DataResponse<Order>> {
        try {
            // Llamamos al repositorio para actualizar la orden
            const res = await OrderRepository.updateOrder(id, updates);
            return res;
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in OrderService:', error.message);
            }
            throw new Error('Error al actualizar la orden, intenta más tarde.');
        }
    }

    // Eliminar una orden
    async delete(id: number): Promise<DataResponse<Order>> {
        try {
            // Llamamos al repositorio para eliminar la orden
            const res = await OrderRepository.deleteOrder(id);
            return res
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in OrderService:', error.message);
            }
            throw new Error('Error al eliminar la orden, intenta más tarde.');
        }
    }
}
