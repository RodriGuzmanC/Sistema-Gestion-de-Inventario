import ProductStatusRepository from "@/data/respositories/ProductStatusRepository";
import { z } from "zod";


// Esquemas ZOD para validar
const baseSchema = {
    nombre: z.string()
        .min(1, "El nombre del estatus es requerido")
        .max(255, "El nombre del estatus es demasiado largo"),
    
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


export default new class ProductStatusService {
    // Obtener todos los estados de producto
    async getAll(): Promise<ProductStatus[]> {
        try {
            return await ProductStatusRepository.getProductStatuses();
        } catch (error: any) {
            console.error('Error in ProductStatusService:', error.message);
            throw new Error('No se obtuvieron los estados de producto, intenta más tarde.');
        }
    }

    // Obtener un estado de producto por ID
    async getOne(id: number): Promise<ProductStatus | null> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            return await ProductStatusRepository.getProductStatus(id);
        } catch (error: any) {
            console.error('Error in ProductStatusService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El estado del producto no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo estado de producto
    async create(productStatus: Partial<ProductStatus>): Promise<ProductStatus> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...productStatus });

            return await ProductStatusRepository.createProductStatus(productStatus);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el estado de producto, intenta más tarde.');
        }
    }

    // Actualizar un estado de producto existente
    async update(id: number, updates: Partial<ProductStatus>): Promise<ProductStatus> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            return await ProductStatusRepository.updateProductStatus(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el estado de producto, intenta más tarde.');
        }
    }

    // Eliminar un estado de producto
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            await ProductStatusRepository.deleteProductStatus(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el estado de producto, intenta más tarde.');
        }
    }
}
