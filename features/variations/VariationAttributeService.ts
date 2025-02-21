import VariationAttributeRepository from "@/data/respositories/VariationAttributeRepository";

export default new class VariationAttributeService {
    // Obtener todos los atributos de variación
    async getAllByVariation(variationId: number, page: number, itemsPerPage: number): Promise<PaginatedResponse<VariationAttribute[]>> {
        try {

            return await VariationAttributeRepository.getVariationAttributesByVariationId(variationId, page, itemsPerPage);
        } catch (error: any) {
            console.error('Error in VariationAttributeService:', error.message);
            throw new Error('No se obtuvieron los atributos de variación, intenta más tarde.');
        }
    }

    // Obtener un atributo de variación por ID
    async getOne(id: number): Promise<DataResponse<VariationAttribute>> {
        try {

            return await VariationAttributeRepository.getVariationAttribute(id);
        } catch (error: any) {
            console.error('Error in VariationAttributeService:', error.message);
            throw new Error('El atributo de variación no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo atributo de variación
    async create(variationAttribute: Partial<VariationAttribute>): Promise<DataResponse<VariationAttribute>> {
        try {

            return await VariationAttributeRepository.createVariationAttribute(variationAttribute);
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el atributo de variación, intenta más tarde.');
        }
    }

    // Actualizar un atributo de variación existente
    async update(id: number, updates: Partial<VariationAttribute>): Promise<DataResponse<VariationAttribute>> {
        try {

            return await VariationAttributeRepository.updateVariationAttribute(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar el atributo de variación, intenta más tarde.');
        }
    }

    // Eliminar un atributo de variación
    async delete(id: number): Promise<DataResponse<VariationAttribute>> {
        try {

            return await VariationAttributeRepository.deleteVariationAttribute(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            
            throw new Error('Error al eliminar el atributo de variación, intenta más tarde.');
        }
    }
}
