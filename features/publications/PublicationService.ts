import PublicationRepository from "@/data/respositories/PublicationRepository";
import { z } from "zod";

// Esquemas ZOD para validar
const baseSchema = {
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre es demasiado largo"),

    contenido: z.string()
        .min(1, "El contenido es requerido")
        .max(1000, "El contenido es demasiado largo"),

    hashtags: z.string()
        .max(255, "Los hashtags son demasiado largos").optional(),

    red_id: z.number()
        .int("El ID de la red debe ser un número entero")
        .positive("El ID de la red debe ser un número positivo"),

    producto_id: z.number()
        .int("El ID del producto debe ser un número entero")
        .positive("El ID del producto debe ser un número positivo"),

    usuario_id: z.number()
        .int("El ID del usuario debe ser un número entero")
        .positive("El ID del usuario debe ser un número positivo"),

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


export default new class PublicationService {
    // Obtener todas las publicaciones
    async getAll(): Promise<Publication[]> {
        try {
            return await PublicationRepository.getPublications();
        } catch (error: any) {
            console.error('Error in PublicationService:', error.message);
            throw new Error('No se obtuvieron las publicaciones, intenta más tarde.');
        }
    }

    // Obtener una publicación por ID
    async getOne(id: number): Promise<Publication | null> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            return await PublicationRepository.getPublication(id);
        } catch (error: any) {
            console.error('Error in PublicationService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La publicación no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva publicación
    async create(publication: Partial<Publication>): Promise<Publication> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...publication });

            return await PublicationRepository.createPublication(publication);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la publicación, intenta más tarde.');
        }
    }

    // Actualizar una publicación existente
    async update(id: number, updates: Partial<Publication>): Promise<Publication> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            return await PublicationRepository.updatePublication(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la publicación, intenta más tarde.');
        }
    }

    // Eliminar una publicación
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            await PublicationRepository.deletePublication(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la publicación, intenta más tarde.');
        }
    }
}
