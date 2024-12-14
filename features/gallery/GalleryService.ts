// galleryService.ts

import GalleryRepository from "@/data/respositories/GalleryRepository";
import { z } from "zod";

// Esquemas ZOD para validar
const baseSchema = {
    producto_id: z.number()
        .int("El ID del producto debe ser un número entero")
        .positive("El ID del producto debe ser un número positivo"),

    url_imagen: z.string()
        .url("La URL de la imagen debe ser válida")
        .max(255, "La URL de la imagen es demasiado larga"),

    url_sin_fondo: z.string()
        .url("La URL sin fondo debe ser válida")
        .max(255, "La URL sin fondo es demasiado larga")
        .optional(),

    fecha_subida: z.string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "La fecha subida debe ser una fecha válida en formato datetime",
        })
        .optional()
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

export default new class GalleryService {
    // Obtener todas las galerías
    async getAll(): Promise<Gallery[]> {
        try {
            return await GalleryRepository.getGalleries(); // Llamamos al repositorio para obtener las galerías
        } catch (error: any) {
            console.error('Error in GalleryService:', error.message);
            throw new Error('No se obtuvieron las galerías, intenta más tarde.');
        }
    }

    // Obtener una galería específica por su ID
    async getOne(id: number): Promise<Gallery | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener la galería por su ID
            return await GalleryRepository.getGallery(id);
        } catch (error: any) {
            console.error('Error in GalleryService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La galería no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva galería
    async create(gallery: Partial<Gallery>): Promise<Gallery> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...gallery });

            // Llamamos al repositorio para crear la nueva galería
            const res = await GalleryRepository.createGallery(gallery);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la galería, intenta más tarde.');
        }
    }

    // Actualizar una galería existente
    async update(id: number, updates: Partial<Gallery>): Promise<Gallery> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar la galería
            const res = await GalleryRepository.updateGallery(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la galería, intenta más tarde.');
        }
    }

    // Eliminar una galería
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar la galería
            await GalleryRepository.deleteGallery(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la galería, intenta más tarde.');
        }
    }
}
