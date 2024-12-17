import CategoryProductRepository from "@/data/respositories/CategoryProductRepository";
import { z } from "zod";



// Esquemas ZOD para validar
const baseSchema = {
    producto_id: z.number()
        .int("El ID del producto debe ser un número entero")
        .positive("El ID del producto debe ser un número positivo"),

    categoria_id: z.number()
        .int("El ID de la categoría debe ser un número entero")
        .positive("El ID de la categoría debe ser un número positivo"),
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


export default new class CategoryProductService {
    // Obtener todas las relaciones categoría-producto
    async getAllCategoriesProduct(productId: number): Promise<CategoryProduct[]> {

        try {
            return await CategoryProductRepository.getProductCategories(productId);
        } catch (error: any) {
            console.error('Error in CategoryProductService:', error.message);
            throw new Error('No se obtuvieron las relaciones categoría-producto, intenta más tarde.');
        }
    }

    // Obtener una relación categoría-producto por ID
    async getOne(id: number): Promise<CategoryProduct | null> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            return await CategoryProductRepository.getProductCategory(id);
        } catch (error: any) {
            console.error('Error in CategoryProductService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('La relación categoría-producto no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva relación categoría-producto
    async createMultiple(categoriesProduct: Partial<CategoryProduct>[]): Promise<CategoryProduct[]> {
        try {
            // Validar los datos de entrada
            //createSchema.parse({ ...categoryProduct });
            //categoriesProduct.forEach((cp) => createSchema.parse(cp));
            return await CategoryProductRepository.createProductCategories(categoriesProduct);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la relación categoría-producto, intenta más tarde.');
        }
    }


    // Crear una nueva relación categoría-producto
    async create(categoryProduct: Partial<CategoryProduct>): Promise<CategoryProduct> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...categoryProduct });

            return await CategoryProductRepository.createProductCategory(categoryProduct);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear la relación categoría-producto, intenta más tarde.');
        }
    }

    // Actualizar una relación categoría-producto existente
    async update(id: number, updates: Partial<CategoryProduct>): Promise<CategoryProduct> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            return await CategoryProductRepository.updateProductCategory(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar la relación categoría-producto, intenta más tarde.');
        }
    }

    // Eliminar una relación categoría-producto
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            await CategoryProductRepository.deleteProductCategory(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar la relación categoría-producto, intenta más tarde.');
        }
    }


    async deleteMultiple(ids: number[]): Promise<void> {
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
    }
}
