// socialNetworkService.ts

import OrderRepository from "@/data/respositories/OrderRepository";
import SocialNetworkRepository from "@/data/respositories/SocialNetworkRepository";
import { z } from "zod";

// Esquemas ZOD para validar
const baseSchema = {
    fecha_pedido: z.string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "La fecha de pedido debe ser una fecha válida en formato datetime",
        }),

    fecha_entrega: z.string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "La fecha de entrega debe ser una fecha válida en formato datetime",
        }),

    usuario_id: z.number()
        .int("El ID del usuario debe ser un número entero")
        .positive("El ID del usuario debe ser un número positivo"),

    estado_pedido_id: z.number()
        .int("El ID del estado del pedido debe ser un número entero")
        .positive("El ID del estado del pedido debe ser un número positivo"),

    metodo_entrega_id: z.number()
        .int("El ID del método de entrega debe ser un número entero")
        .positive("El ID del método de entrega debe ser un número positivo"),

    tipo_pedido: z.boolean(),


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

export default new class OrderService {
    // Obtener todas las órdenes
    async getAll(): Promise<Order[]> {
        try {
            return await OrderRepository.getOrders(); // Llamamos al repositorio para obtener todas las órdenes.
        } catch (error: any) {
            console.error('Error in OrderService:', error.message);
            throw new Error('No se obtuvieron las órdenes, intenta más tarde.');
        }
    }

    // Obtener una orden específica por su ID
    async getOne(id: number): Promise<Order | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener la orden por su ID
            return await OrderRepository.getOrder(id);
        } catch (error: any) {
            console.error('Error in OrderService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La orden no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva orden
    async create(order: Partial<Order>): Promise<Order> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...order });

            // Llamamos al repositorio para crear la nueva orden
            const res = await OrderRepository.createOrder(order);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la orden, intenta más tarde.');
        }
    }

    // Actualizar una orden existente
    async update(id: number, updates: Partial<Order>): Promise<Order> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar la orden
            const res = await OrderRepository.updateOrder(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la orden, intenta más tarde.');
        }
    }

    // Eliminar una orden
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar la orden
            await OrderRepository.deleteOrder(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la orden, intenta más tarde.');
        }
    }
}
