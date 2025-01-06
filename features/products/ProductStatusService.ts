import ProductStatusRepository from "@/data/respositories/ProductStatusRepository";

export default new class ProductStatusService {
    // Obtener todos los estados de producto
    async getAll(page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<ProductStatus>> {
        try {
            return await ProductStatusRepository.getProductStatuses(page, itemsPerPage);
        } catch (error: any) {
            console.error('Error in ProductStatusService:', error.message);
            throw new Error('No se obtuvieron los estados de producto, intenta más tarde.');
        }
    }

    // Obtener un estado de producto por ID
    async getOne(id: number): Promise<DataResponse<ProductStatus>> {
        try {
            return await ProductStatusRepository.getProductStatus(id);
        } catch (error: any) {
            console.error('Error in ProductStatusService:', error.message);
            throw new Error('El estado del producto no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo estado de producto
    async create(productStatus: Partial<ProductStatus>): Promise<DataResponse<ProductStatus>> {
        try {

            return await ProductStatusRepository.createProductStatus(productStatus);
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el estado de producto, intenta más tarde.');
        }
    }

    // Actualizar un estado de producto existente
    async update(id: number, updates: Partial<ProductStatus>): Promise<DataResponse<ProductStatus>> {
        try {
            return await ProductStatusRepository.updateProductStatus(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar el estado de producto, intenta más tarde.');
        }
    }

    // Eliminar un estado de producto
    async delete(id: number): Promise<DataResponse<ProductStatus>> {
        try {

            return await ProductStatusRepository.deleteProductStatus(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            throw new Error('Error al eliminar el estado de producto, intenta más tarde.');
        }
    }
}
