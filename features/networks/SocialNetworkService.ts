// socialNetworkService.ts

import SocialNetworkRepository from "@/data/respositories/SocialNetworkRepository";

// Servicio
export default new class SocialNetworkService {
    // Obtener todas las redes sociales
    async getAll(pages: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<SocialNetwork>> {
        try {
            // Validar los parámetros de paginación
            if (pages <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }

            return await SocialNetworkRepository.getSocialNetworks(pages, itemsPerPage); // Llamamos al repositorio para obtener todas las redes sociales.
        } catch (error: any) {
            console.error('Error in SocialNetworkService:', error.message);
            throw new Error('No se obtuvieron las redes sociales, intenta más tarde.');
        }
    }

    // Obtener una red social específica por su ID
    async getOne(id: number): Promise<DataResponse<SocialNetwork>> {
        try {


            // Llamamos al repositorio para obtener la red social por su ID
            return await SocialNetworkRepository.getSocialNetwork(id);
        } catch (error: any) {
            console.error('Error in SocialNetworkService:', error.message);
            throw new Error('La red social no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva red social
    async create(socialNetwork: Partial<SocialNetwork>): Promise<DataResponse<SocialNetwork>> {
        try {

            // Llamamos al repositorio para crear la nueva red social
            const res = await SocialNetworkRepository.createSocialNetwork(socialNetwork);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear la red social, intenta más tarde.');
        }
    }

    // Actualizar una red social existente
    async update(id: number, updates: Partial<SocialNetwork>): Promise<DataResponse<SocialNetwork>> {
        try {

            // Llamamos al repositorio para actualizar la red social
            const res = await SocialNetworkRepository.updateSocialNetwork(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar la red social, intenta más tarde.');
        }
    }

    // Eliminar una red social
    async delete(id: number): Promise<DataResponse<SocialNetwork>> {
        try {
            // Llamamos al repositorio para eliminar la red social
            return await SocialNetworkRepository.deleteSocialNetwork(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            throw new Error('Error al eliminar la red social, intenta más tarde.');
        }
    }
}
