import PublicationRepository from "@/data/respositories/PublicationRepository";

export default new class PublicationService {
    // Obtener todas las publicaciones
    async getAll(): Promise<Publication[]> {
        try {
            return await PublicationRepository.getPublications();
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in PublicationService:', error.message);
            }
            throw new Error('No se obtuvieron las publicaciones, intenta más tarde.');
        }
    }

    // Obtener una publicación por ID
    async getOne(id: number): Promise<Publication | null> {
        try {
            return await PublicationRepository.getPublication(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in PublicationService:', error.message);
            }
            
            throw new Error('La publicación no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva publicación
    async create(publication: Partial<Publication>): Promise<Publication> {
        try {

            return await PublicationRepository.createPublication(publication);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in PublicationService:', error.message);
            }
            throw new Error('Error al crear la publicación, intenta más tarde.');
        }
    }

    // Actualizar una publicación existente
    async update(id: number, updates: Partial<Publication>): Promise<Publication> {
        try {

            return await PublicationRepository.updatePublication(id, updates);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in PublicationService:', error.message);
            }
            throw new Error('Error al actualizar la publicación, intenta más tarde.');
        }
    }

    // Eliminar una publicación
    async delete(id: number): Promise<void> {
        try {

            await PublicationRepository.deletePublication(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in PublicationService:', error.message);
            }
            throw new Error('Error al eliminar la publicación, intenta más tarde.');
        }
    }
}
