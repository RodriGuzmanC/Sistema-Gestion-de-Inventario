// deliveryService.ts

import DeliveryMethodRepository from "@/data/respositories/DeliveryMethodRepository";
import { z } from "zod";

// Esquemas ZOD para validar
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

// Servicio
export default new class DeliveryService {
    // Obtener todos los métodos de entrega
    async getAll(): Promise<DeliveryMethod[]> {
        try {
            return await DeliveryMethodRepository.getDeliveryMethods(); // Llamamos al repositorio para obtener los métodos de entrega
        } catch (error: any) {
            console.error('Error in DeliveryService:', error.message);
            throw new Error('No se obtuvieron los métodos de entrega, intenta más tarde.');
        }
    }

    // Obtener un método de entrega específico por su ID
    async getOne(id: number): Promise<DeliveryMethod | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener el método de entrega por su ID
            return await DeliveryMethodRepository.getDeliveryMethod(id);
        } catch (error: any) {
            console.error('Error in DeliveryService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El método de entrega no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo método de entrega
    async create(deliveryMethod: Partial<DeliveryMethod>): Promise<DeliveryMethod> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...deliveryMethod });

            // Llamamos al repositorio para crear el nuevo método de entrega
            const res = await DeliveryMethodRepository.createDeliveryMethod(deliveryMethod);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el método de entrega, intenta más tarde.');
        }
    }

    // Actualizar un método de entrega existente
    async update(id: number, updates: Partial<DeliveryMethod>): Promise<DeliveryMethod> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar el método de entrega
            const res = await DeliveryMethodRepository.updateDeliveryMethod(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el método de entrega, intenta más tarde.');
        }
    }

    // Eliminar un método de entrega
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar el método de entrega
            await DeliveryMethodRepository.deleteDeliveryMethod(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el método de entrega, intenta más tarde.');
        }
    }
}
