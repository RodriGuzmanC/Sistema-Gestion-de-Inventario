// deliveryService.ts

import DeliveryMethodRepository from "@/data/respositories/DeliveryMethodRepository";

// Servicio
export default new class DeliveryService {
    // Obtener todos los métodos de entrega
    async getAll(page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<DeliveryMethod>> {
        try {
            return await DeliveryMethodRepository.getDeliveryMethods(page, itemsPerPage); // Llamamos al repositorio para obtener los métodos de entrega
        } catch (error: any) {
            console.error('Error in DeliveryService:', error.message);
            throw new Error('No se obtuvieron los métodos de entrega, intenta más tarde.');
        }
    }

    // Obtener un método de entrega específico por su ID
    async getOne(id: number): Promise<DataResponse<DeliveryMethod>> {
        try {

            // Llamamos al repositorio para obtener el método de entrega por su ID
            return await DeliveryMethodRepository.getDeliveryMethod(id);
        } catch (error: any) {
            console.error('Error in DeliveryService:', error.message);
            throw new Error('El método de entrega no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo método de entrega
    async create(deliveryMethod: Partial<DeliveryMethod>): Promise<DataResponse<DeliveryMethod>> {
        try {

            // Llamamos al repositorio para crear el nuevo método de entrega
            const res = await DeliveryMethodRepository.createDeliveryMethod(deliveryMethod);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el método de entrega, intenta más tarde.');
        }
    }

    // Actualizar un método de entrega existente
    async update(id: number, updates: Partial<DeliveryMethod>): Promise<DataResponse<DeliveryMethod>> {
        try {

            // Llamamos al repositorio para actualizar el método de entrega
            const res = await DeliveryMethodRepository.updateDeliveryMethod(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);

            throw new Error('Error al actualizar el método de entrega, intenta más tarde.');
        }
    }

    // Eliminar un método de entrega
    async delete(id: number): Promise<DataResponse<DeliveryMethod>> {
        try {
            // Llamamos al repositorio para eliminar el método de entrega
            return await DeliveryMethodRepository.deleteDeliveryMethod(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            throw new Error('Error al eliminar el método de entrega, intenta más tarde.');
        }
    }
}
