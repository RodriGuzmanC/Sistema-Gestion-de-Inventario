// categoryService.ts

import CategoryRepository from "@/data/respositories/CategoryRepository";
import { z } from "zod"; 

// Esquemas ZOD para validar
const baseSchema = {
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre es demasiado largo"),

    descripcion: z.string()
        .min(1, "La descripcion es requerida")
        .max(500, "La descripcion es demasiado larga"),
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
export default new class CategoryService {
    // Obtener todas las categorías
    async getAll(): Promise<Category[]> {
        try {
            return await CategoryRepository.getCategories(); // Llamamos al repositorio para obtener las categorías
        } catch (error: any) {
            console.error('Error in CategoryService:', error.message);
            throw new Error('No se obtuvieron las categorías, intenta más tarde.');
        }
    }

    // Obtener una categoría específica por su ID
    async getOne(id: number): Promise<Category | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener la categoría por su ID
            return await CategoryRepository.getCategory(id);
        } catch (error: any) {
            console.error('Error in CategoryService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La categoría no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva categoría
    async create(category: Partial<Category>): Promise<Category> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...category });

            // Llamamos al repositorio para crear la nueva categoría
            const res = await CategoryRepository.createCategory(category);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la categoría, intenta más tarde.');
        }
    }

    // Actualizar una categoría existente
    async update(id: number, updates: Partial<Category>): Promise<Category> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar la categoría
            const res = await CategoryRepository.updateCategory(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la categoría, intenta más tarde.');
        }
    }

    // Eliminar una categoría
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar la categoría
            await CategoryRepository.deleteCategory(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la categoría, intenta más tarde.');
        }
    }
}
