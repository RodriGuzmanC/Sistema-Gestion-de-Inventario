// CategoryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class CategoryProductRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getProductCategories(productId: number, pages: number, itemsPerPage: number) : Promise<PaginatedResponse<CategoryProduct>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('categorias_productos')
            .select('*')
            .eq('producto_id', productId)
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching product categories:', error);
            throw new Error('Unable to fetch product categories');
        }
        
        return makePagination<CategoryProduct>(this.client, data, 'categorias_productos', pages, itemsPerPage, 'producto_id', productId)
        
    }

    async getProductCategory(id: number): Promise<DataResponse<CategoryProduct>> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product category:', error);
            throw new Error('Unable to fetch product category');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<CategoryProduct> = {
            data: data || null,
        }
        return res;
    }

    async createProductCategory(productCategory: Partial<CategoryProduct>): Promise<DataResponse<CategoryProduct>> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .insert(productCategory)
            .select();

        if (error) {
            console.error('Error creating product category:', error);
            throw new Error('Unable to create product category');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<CategoryProduct> = {
            data: data[0] || null,
        }
        return res;
    }

    /*async createProductCategories(productCategories: Partial<CategoryProduct>[]): Promise<CategoryProduct[]> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .insert(productCategories)
            .select();

        if (error) {
            console.error('Error creating product categories:', error);
            throw new Error('Unable to create product categories');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }*/

    async updateProductCategory(id: number, updates: Partial<CategoryProduct>): Promise<DataResponse<CategoryProduct>> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating product category:', error);
            throw new Error('Unable to update product category');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<CategoryProduct> = {
            data: data[0] || null,
        }
        return res;
    }

    async deleteProductCategory(id: number): Promise<DataResponse<CategoryProduct>> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting product category:', error);
            throw new Error('Unable to delete product category');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<CategoryProduct> = {
            data: data[0] || null,
        }
        return res;
    }

    /*async deleteProductCategories(ids: number[]): Promise<void> {

        const { data, error } = await this.client
            .from('categorias_productos')
            .delete()
            .in('id', ids) // Añadimos las condiciones OR dinámicamente
            .select();

        if (error) {
            console.error('Error deleting product category:', error);
            throw new Error('Unable to delete product category');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<Category> = {
            data: data[0] || null,
        }
        return res;
    }*/
}