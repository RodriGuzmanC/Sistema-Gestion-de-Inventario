// galleryService.ts

import GalleryRepository from "@/data/respositories/GalleryRepository";


// Servicio

export default new class GalleryService {
    // Obtener todas las galerías
    async getAll(): Promise<Gallery[]> {
        try {
            return await GalleryRepository.getGalleries(); // Llamamos al repositorio para obtener las galerías
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in GalleryService:', error.message);
            }
            throw new Error('No se obtuvieron las galerías, intenta más tarde.');
        }
    }

    // Obtener una galería específica por su ID
    async getOne(id: number): Promise<Gallery | null> {
        try {

            // Llamamos al repositorio para obtener la galería por su ID
            return await GalleryRepository.getGallery(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in GalleryService:', error.message);
            }
            throw new Error('La galería no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva galería
    async create(gallery: Partial<Gallery>): Promise<Gallery> {
        try {

            // Llamamos al repositorio para crear la nueva galería
            const res = await GalleryRepository.createGallery(gallery);
            return res;
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in GalleryService:', error.message);
            }
            throw new Error('Error al crear la galería, intenta más tarde.');
        }
    }

    // Actualizar una galería existente
    async update(id: number, updates: Partial<Gallery>): Promise<Gallery> {
        try {

            // Llamamos al repositorio para actualizar la galería
            const res = await GalleryRepository.updateGallery(id, updates);
            return res;
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in GalleryService:', error.message);
            }
            throw new Error('Error al actualizar la galería, intenta más tarde.');
        }
    }

    // Eliminar una galería
    async delete(id: number): Promise<void> {
        try {

            // Llamamos al repositorio para eliminar la galería
            await GalleryRepository.deleteGallery(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in GalleryService:', error.message);
            }
            throw new Error('Error al eliminar la galería, intenta más tarde.');
        }
    }
}
