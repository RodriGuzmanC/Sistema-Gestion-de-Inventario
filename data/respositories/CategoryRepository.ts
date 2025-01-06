// CategoryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class CategoryRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    

    async getCategories(pages: number, itemsPerPage: number): Promise<PaginatedResponse<Category>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('categorias')
            .select('*')
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Unable to fetch categories');
        }

        return makePagination<Category>(this.client, data, 'categorias', pages, itemsPerPage)
    }

    async getCategory(id: number): Promise<DataResponse<Category>> {
        const { data, error } = await this.client
            .from('categorias')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            throw new Error('Unable to fetch category');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Category> = {
            data: data || null,
        }
        return res;
    }

    async createCategory(category: Partial<Category>): Promise<DataResponse<Category>> {
        const { data, error } = await this.client
            .from('categorias')
            .insert(category)
            .select();

        if (error) {
            console.error('Error creating category:', error);
            throw new Error('Unable to create category');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Category> = {
            data: data[0] || null,
        }
        return res;
    }

    async updateCategory(id: number, updates: Partial<Category>): Promise<DataResponse<Category>> {
        const { data, error } = await this.client
            .from('categorias')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating category:', error);
            throw new Error('Unable to update category');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Category> = {
            data: data[0] || null,
        }
        return res;
    }

    async deleteCategory(id: number): Promise<DataResponse<Category>> {
        const { data, error } = await this.client
            .from('categorias')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting category:', error);
            throw new Error('Unable to delete category');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Category> = {
            data: data[0] || null,
        }
        return res;

    }

    
}