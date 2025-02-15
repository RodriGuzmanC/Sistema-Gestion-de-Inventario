import VariationRepository from "@/data/respositories/VariationRepository";

export default new class VariationService {
    // Obtener todas las variaciones de un producto
    async getAllVariationsByProduct(productId: number, page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<Variation[]>> {
        try {
            return await VariationRepository.getVariationsByProduct(page, itemsPerPage, productId);
        } catch (error: any) {
            console.error('Error in VariationService:', error.message);
            throw new Error('No se obtuvieron las variaciones, intenta más tarde.');
        }
    }

    // Obtener una variación por ID
    async getOne(id: number): Promise<DataResponse<Variation>> {
        try {

            return await VariationRepository.getVariation(id);
        } catch (error: any) {
            console.error('Error in VariationService:', error.message);
            throw new Error('La variación no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva variación
    async create(variation: Partial<Variation>): Promise<DataResponse<Variation>> {
        try {

            return await VariationRepository.createVariation(variation);
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear la variación, intenta más tarde.');
        }
    }

    // Actualizar una variación existente
    async update(id: number, updates: Partial<Variation>): Promise<DataResponse<Variation>> {
        try {
            return await VariationRepository.updateVariation(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar la variación, intenta más tarde.');
        }
    }

    // Eliminar una variación
    async delete(id: number): Promise<DataResponse<Variation>> {
        try {

            return await VariationRepository.deleteVariation(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            throw new Error('Error al eliminar la variación, intenta más tarde.');
        }
    }
}
