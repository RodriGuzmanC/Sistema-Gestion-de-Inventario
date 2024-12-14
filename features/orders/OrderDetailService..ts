// orderDetailService.ts

import OrderDetailRepository from "@/data/respositories/OrderDetailRepository";
import { z } from "zod";

const baseSchema = {
    pedido_id: z.number()
        .int("El ID del pedido debe ser un número entero")
        .positive("El ID del pedido debe ser un número positivo"),

    variacion_id: z.number()
        .int("El ID de la variación debe ser un número entero")
        .positive("El ID de la variación debe ser un número positivo"),

    cantidad: z.number()
        .int("La cantidad debe ser un número entero")
        .positive("La cantidad debe ser un número positivo"),

    precio: z.number()
        .min(0, "El precio no puede ser menor a 0")
        .refine((val) => !isNaN(val), {
            message: "El precio debe ser un número válido",
        }),

    precio_rebajado: z.number()
        .min(0, "El precio rebajado no puede ser menor a 0")
        .refine((val) => !isNaN(val), {
            message: "El precio rebajado debe ser un número válido",
        }),
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

export default new class OrderDetailService {
    // Obtener todos los detalles de una orden
    async getAll(orderId: number): Promise<OrderDetail[]> {
        try {
            // Validar el ID de la orden
            idValidateSchema.parse({ id: orderId });

            return await OrderDetailRepository.getOrderDetails(orderId); // Llamamos al repositorio para obtener todos los detalles de la orden.
        } catch (error: any) {
            console.error('Error in OrderDetailService:', error.message);
            throw new Error('No se obtuvieron los detalles de la orden, intenta más tarde.');
        }
    }

    // Obtener un detalle de orden específico por su ID
    async getOne(id: number): Promise<OrderDetail | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener el detalle de la orden por su ID
            return await OrderDetailRepository.getOrderDetail(id);
        } catch (error: any) {
            console.error('Error in OrderDetailService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El detalle de la orden no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo detalle de orden
    async create(orderDetail: Partial<OrderDetail>): Promise<OrderDetail> {
        try {
            // Validar los datos de entrada con el esquema de creación
            createSchema.parse({ ...orderDetail });

            // Llamamos al repositorio para crear el nuevo detalle de la orden
            const res = await OrderDetailRepository.createOrderDetail(orderDetail);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el detalle de la orden, intenta más tarde.');
        }
    }

    // Actualizar un detalle de orden existente
    async update(id: number, updates: Partial<OrderDetail>): Promise<OrderDetail> {
        try {
            // Validar los datos de entrada con el esquema de actualización
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar el detalle de la orden
            const res = await OrderDetailRepository.updateOrderDetail(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el detalle de la orden, intenta más tarde.');
        }
    }

    // Eliminar un detalle de orden
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar el detalle de la orden
            await OrderDetailRepository.deleteOrderDetail(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el detalle de la orden, intenta más tarde.');
        }
    }
}
