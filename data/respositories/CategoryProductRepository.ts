// CategoryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class CategoryProductRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getProductCategories(productId: number): Promise<CategoryProduct[]> {
        const { data, error } = await this.client
            .from('categorias_productos')
            .select('*')
            .eq('producto_id', productId);

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

    async createProductCategory(productCategory: Partial<CategoryProduct>): Promise<CategoryProduct> {
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
        return data[0]; 
    }

    async createProductCategories(productCategories: Partial<CategoryProduct>[]): Promise<CategoryProduct[]> {
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
    }

    async updateProductCategory(id: number, updates: Partial<CategoryProduct>): Promise<CategoryProduct> {
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
        return data[0];
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

    async deleteProductCategories(ids: number[]): Promise<void> {

        const { data, error } = await this.client
            .from('categorias_productos')
            .delete()
            .in('id', ids) // Añadimos las condiciones OR dinámicamente
            .select();

        if (error) {
            console.error('Error deleting product category:', error);
            throw new Error('Unable to delete product category');
        }
    }
}