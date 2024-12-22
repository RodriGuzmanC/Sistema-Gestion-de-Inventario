import VariationRepository from "@/data/respositories/VariationRepository";
import { z } from "zod";

// Esquemas ZOD para validar
const baseSchema = {
    producto_id: z.number()
        .int("El ID del producto debe ser un número entero")
        .positive("El ID del producto debe ser un número positivo"),

    precio_unitario: z.number()
        .min(0, "El precio unitario no puede ser menor a 0")
        .refine((val) => !isNaN(val), {
            message: "El precio unitario debe ser un número válido",
        }),

    precio_mayorista: z.number()
        .min(0, "El precio mayorista no puede ser menor a 0")
        .refine((val) => !isNaN(val), {
            message: "El precio mayorista debe ser un número válido",
        }),

    stock: z.number()
        .int("El stock debe ser un número entero")
        .nonnegative("El stock no puede ser negativo")
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

export default new class VariationService {
    // Obtener todas las variaciones
    async getAll(): Promise<Variation[]> {
        try {
            return await VariationRepository.getVariations();
        } catch (error: any) {
            console.error('Error in VariationService:', error.message);
            throw new Error('No se obtuvieron las variaciones, intenta más tarde.');
        }
    }

    // Obtener una variación por ID
    async getOne(id: number): Promise<Variation | null> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            return await VariationRepository.getVariation(id);
        } catch (error: any) {
            console.error('Error in VariationService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La variación no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva variación
    async create(variation: Partial<Variation>): Promise<Variation> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...variation });

            return await VariationRepository.createVariation(variation);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la variación, intenta más tarde.');
        }
    }

    // Actualizar una variación existente
    async update(id: number, updates: Partial<Variation>): Promise<Variation> {
        try {
            // Validar los datos de entrada
            //updateSchema.parse({ id, ...updates });

            return await VariationRepository.updateVariation(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la variación, intenta más tarde.');
        }
    }

    // Eliminar una variación
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            await VariationRepository.deleteVariation(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la variación, intenta más tarde.');
        }
    }
}
