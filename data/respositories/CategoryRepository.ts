// CategoryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class CategoryRepository {
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

    async createCategory(category: Category): Promise<Category> {
        const { data, error } = await this.client
            .from('categorias')
            .insert(category)
            .single();

        if (error) {
            console.error('Error creating category:', error);
            throw new Error('Unable to create category');
        }
        return data;
    }

    async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
        const { data, error } = await this.client
            .from('categorias')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating category:', error);
            throw new Error('Unable to update category');
        }
        return data;
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