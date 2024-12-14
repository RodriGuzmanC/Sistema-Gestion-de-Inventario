import OrderStatusRepository from "@/data/respositories/OrderStatusRepository";
import { z } from "zod";


const baseSchema = {
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre es demasiado largo"),
    
};
const updateSchema = z.object({
    id: z.number({ required_error: "ID es requerido" }).positive("ID debe ser un numero positivo"),
    ...baseSchema,
}).partial();

const idValidateSchema = z.object({
    id: z.number({ required_error: "ID es requerido" }).positive("ID debe ser un numero positivo"),
});

const createSchema = z.object({
    ...baseSchema,
})

export default new class OrderStatusService {
    // Obtener todos los estados de órdenes
    async getAll(): Promise<OrderStatus[]> {
        try {
            return await OrderStatusRepository.getOrderStatuses(); // Llama al repositorio para obtener todos los estados
        } catch (error: any) {
            console.error('Error in OrderStatusService:', error.message);
            throw new Error('No se obtuvieron los estados de la orden, intenta más tarde.');
        }
    }

    // Obtener un estado de orden específico por su ID
    async getOne(id: number): Promise<OrderStatus | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llama al repositorio para obtener un estado por su ID
            return await OrderStatusRepository.getOrderStatus(id);
        } catch (error: any) {
            console.error('Error in OrderStatusService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El estado de la orden no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo estado de orden
    async create(orderStatus: Partial<OrderStatus>): Promise<OrderStatus> {
        try {
            // Validar los datos de entrada con el esquema de creación
            createSchema.parse({ ...orderStatus });

            // Llama al repositorio para crear un nuevo estado
            const res = await OrderStatusRepository.createOrderStatus(orderStatus);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el estado de la orden, intenta más tarde.');
        }
    }

    // Actualizar un estado de orden existente
    async update(id: number, updates: Partial<OrderStatus>): Promise<OrderStatus> {
        try {
            // Validar los datos de entrada con el esquema de actualización
            updateSchema.parse({ id, ...updates });

            // Llama al repositorio para actualizar el estado
            const res = await OrderStatusRepository.updateOrderStatus(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el estado de la orden, intenta más tarde.');
        }
    }

    // Eliminar un estado de orden
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llama al repositorio para eliminar el estado
            await OrderStatusRepository.deleteOrderStatus(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el estado de la orden, intenta más tarde.');
        }
    }
}
