import VariationAttributeRepository from "@/data/respositories/VariationAttributeRepository";
import { z } from "zod";

// Esquemas ZOD para validar
const baseSchema = {
    variacion_id: z.number()
        .int("El ID de la variación debe ser un número entero")
        .positive("El ID de la variación debe ser un número positivo"),

    atributo_id: z.number()
        .int("El ID del atributo debe ser un número entero")
        .positive("El ID del atributo debe ser un número positivo"),
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


export default new class VariationAttributeService {
    // Obtener todos los atributos de variación
    async getAll(): Promise<VariationAttribute[]> {
        try {
            return await VariationAttributeRepository.getVariationAttributes();
        } catch (error: any) {
            console.error('Error in VariationAttributeService:', error.message);
            throw new Error('No se obtuvieron los atributos de variación, intenta más tarde.');
        }
    }

    // Obtener un atributo de variación por ID
    async getOne(id: number): Promise<VariationAttribute | null> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            return await VariationAttributeRepository.getVariationAttribute(id);
        } catch (error: any) {
            console.error('Error in VariationAttributeService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El atributo de variación no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo atributo de variación
    async create(variationAttribute: Partial<VariationAttribute>): Promise<VariationAttribute> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...variationAttribute });

            return await VariationAttributeRepository.createVariationAttribute(variationAttribute);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el atributo de variación, intenta más tarde.');
        }
    }

    // Actualizar un atributo de variación existente
    async update(id: number, updates: Partial<VariationAttribute>): Promise<VariationAttribute> {
        try {
            // Validar los datos de entrada
            //updateSchema.parse({ id, ...updates });

            return await VariationAttributeRepository.updateVariationAttribute(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el atributo de variación, intenta más tarde.');
        }
    }

    // Eliminar un atributo de variación
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            await VariationAttributeRepository.deleteVariationAttribute(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el atributo de variación, intenta más tarde.');
        }
    }
}
