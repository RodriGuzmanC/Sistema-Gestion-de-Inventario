// socialNetworkService.ts

import SocialNetworkRepository from "@/data/respositories/SocialNetworkRepository";
import { z } from "zod";
// Esquemas ZOD para validar
const baseSchema = {
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre es demasiado largo"),

    url_base: z.string()
        .url("La URL base debe ser válida")
        .max(255, "La URL base es demasiado larga"),
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
export default new class SocialNetworkService {
    // Obtener todas las redes sociales
    async getAll(): Promise<SocialNetwork[]> {
        try {
            return await SocialNetworkRepository.getSocialNetworks(); // Llamamos al repositorio para obtener todas las redes sociales.
        } catch (error: any) {
            console.error('Error in SocialNetworkService:', error.message);
            throw new Error('No se obtuvieron las redes sociales, intenta más tarde.');
        }
    }

    // Obtener una red social específica por su ID
    async getOne(id: number): Promise<SocialNetwork | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener la red social por su ID
            return await SocialNetworkRepository.getSocialNetwork(id);
        } catch (error: any) {
            console.error('Error in SocialNetworkService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La red social no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva red social
    async create(socialNetwork: Partial<SocialNetwork>): Promise<SocialNetwork> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...socialNetwork });

            // Llamamos al repositorio para crear la nueva red social
            const res = await SocialNetworkRepository.createSocialNetwork(socialNetwork);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la red social, intenta más tarde.');
        }
    }

    // Actualizar una red social existente
    async update(id: number, updates: Partial<SocialNetwork>): Promise<SocialNetwork> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar la red social
            const res = await SocialNetworkRepository.updateSocialNetwork(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la red social, intenta más tarde.');
        }
    }

    // Eliminar una red social
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar la red social
            await SocialNetworkRepository.deleteSocialNetwork(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la red social, intenta más tarde.');
        }
    }
}
