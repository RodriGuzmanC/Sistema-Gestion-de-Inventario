// CategoryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class CategoryProductRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getProductCategories(): Promise<CategoryProduct[]> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .select('*');

        if (error) {
            console.error('Error fetching product categories:', error);
            throw new Error('Unable to fetch product categories');
        }
        return data || [];
    }

    async getProductCategory(id: number): Promise<CategoryProduct | null> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product category:', error);
            throw new Error('Unable to fetch product category');
        }
        return data || null;
    }

    async createProductCategory(productCategory: CategoryProduct): Promise<CategoryProduct> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .insert(productCategory)
            .single();

        if (error) {
            console.error('Error creating product category:', error);
            throw new Error('Unable to create product category');
        }
        return data;
    }

    async updateProductCategory(id: number, updates: Partial<CategoryProduct>): Promise<CategoryProduct> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating product category:', error);
            throw new Error('Unable to update product category');
        }
        return data;
    }

    async deleteProductCategory(id: number): Promise<void> {
        const { error } = await this.client
            .from('categorias_productos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product category:', error);
            throw new Error('Unable to delete product category');
        }
    }
}