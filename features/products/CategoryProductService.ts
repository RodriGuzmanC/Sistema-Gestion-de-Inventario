import CategoryProductRepository from "@/data/respositories/CategoryProductRepository";


export default new class CategoryProductService {
    // Obtener todas las relaciones categoría-producto
    async getAllCategoriesProduct(productId: number, page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<CategoryProduct>> {

        try {
            return await CategoryProductRepository.getProductCategories(productId, page, itemsPerPage);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in CategoryProductService:', error.message);
            }
            throw new Error('No se obtuvieron las relaciones categoría-producto, intenta más tarde.');
        }
    }

    // Obtener una relación categoría-producto por ID
    async getOne(id: number): Promise<DataResponse<CategoryProduct>> {
        try {

            return await CategoryProductRepository.getProductCategory(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in CategoryProductService:', error.message);
            }
            throw new Error('La relación categoría-producto no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva relación categoría-producto
    /*async createMultiple(categoriesProduct: Partial<CategoryProduct>[]): Promise<DataResponse<CategoryProduct>> {
        try {

            return await CategoryProductRepository.createProductCategories(categoriesProduct);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la relación categoría-producto, intenta más tarde.');
        }
    }*/


    // Crear una nueva relación categoría-producto
    async create(categoryProduct: Partial<CategoryProduct>): Promise<DataResponse<CategoryProduct>> {
        try {

            return await CategoryProductRepository.createProductCategory(categoryProduct);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in CategoryProductService:', error.message);
            }
            throw new Error('Error al crear la relación categoría-producto, intenta más tarde.');
        }
    }

    // Actualizar una relación categoría-producto existente
    async update(id: number, updates: Partial<CategoryProduct>): Promise<DataResponse<CategoryProduct>> {
        try {

            return await CategoryProductRepository.updateProductCategory(id, updates);
        } catch (error) {
            console.error('Error in update:', error);

            throw new Error('Error al actualizar la relación categoría-producto, intenta más tarde.');
        }
    }

    // Eliminar una relación categoría-producto
    async delete(id: number): Promise<DataResponse<CategoryProduct>> {
        try {

            return await CategoryProductRepository.deleteProductCategory(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in CategoryProductService:', error.message);
            }
            throw new Error('Error al eliminar la relación categoría-producto, intenta más tarde.');
        }
    }


    /*async deleteMultiple(ids: number[]): Promise<void> {
        try {
            // Validar el ID
            //idValidateSchema.parse({ id });

            await CategoryProductRepository.deleteProductCategories(ids);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la relación categoría-producto, intenta más tarde.');
        }
    }*/
}
