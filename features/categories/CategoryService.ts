// categoryService.ts

import CategoryRepository from "@/data/respositories/CategoryRepository";


// Servicio
export default new class CategoryService {
    // Obtener todas las categorías
    async getAll(pages: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<Category>> {
        try {
            // Validar los parámetros de paginación
            if (pages <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }
            return await CategoryRepository.getCategories(pages, itemsPerPage); // Llamamos al repositorio para obtener las categorías
        } catch (error: any) {
            console.error('Error in CategoryService:', error.message);
            throw new Error('No se obtuvieron las categorías, intenta más tarde.');
        }
    }

    // Obtener una categoría específica por su ID
    async getOne(id: number): Promise<DataResponse<Category>> {
        try {
            // Llamamos al repositorio para obtener la categoría por su ID
            return await CategoryRepository.getCategory(id);
        } catch (error: any) {
            console.error('Error in CategoryService:', error.message);

            throw new Error('La categoría no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva categoría
    async create(category: Partial<Category>): Promise<DataResponse<Category>> {
        try {
            // Llamamos al repositorio para crear la nueva categoría
            const res = await CategoryRepository.createCategory(category);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear la categoría, intenta más tarde.');
        }
    }

    // Actualizar una categoría existente
    async update(id: number, updates: Partial<Category>): Promise<DataResponse<Category>> {
        try {
            // Llamamos al repositorio para actualizar la categoría
            const res = await CategoryRepository.updateCategory(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar la categoría, intenta más tarde.');
        }
    }

    // Eliminar una categoría
    async delete(id: number): Promise<DataResponse<Category>> {
        try {
            // Llamamos al repositorio para eliminar la categoría
            const res = await CategoryRepository.deleteCategory(id);
            return res;
        } catch (error: any) {
            console.error('Error in delete:', error);
            throw new Error('Error al eliminar la categoría, intenta más tarde.');
        }
    }
}
