// CategoryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class CategoryRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getCategories(): Promise<Category[]> {
        const { data, error } = await this.client
            .from('categorias')
            .select('*');

        if (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Unable to fetch categories');
        }
        return data || [];
    }

    async getCategory(id: number): Promise<Category | null> {
        const { data, error } = await this.client
            .from('categorias')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            throw new Error('Unable to fetch category');
        }
        return data || null;
    }

    async createCategory(category: Partial<Category>): Promise<Category> {
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
        return data[0]; 
    }

    async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
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
        return data[0];
    }

    async deleteCategory(id: number): Promise<void> {
        const { error } = await this.client
            .from('categorias')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            throw new Error('Unable to delete category');
        }
    }
}