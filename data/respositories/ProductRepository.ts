import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class ProductRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los productos
    async getProducts(): Promise<Product[]> {
        const { data, error } = await this.client
            .from('productos')
            .select('*');

        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Unable to fetch products');
        }
        return data || [];
    }

    // Obtener un producto específico por su ID
    async getProduct(id: number): Promise<Product | null> {
        const { data, error } = await this.client
            .from('productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            throw new Error('Unable to fetch product');
        }
        return data || null;
    }

    // Crear un nuevo producto
    async createProduct(product: Product): Promise<Product> {
        const { data, error } = await this.client
            .from('productos')
            .insert(product)
            .single();

        if (error) {
            console.error('Error creating product:', error);
            throw new Error('Unable to create product');
        }
        return data;
    }

    // Actualizar un producto existente
    async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
        const { data, error } = await this.client
            .from('productos')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating product:', error);
            throw new Error('Unable to update product');
        }
        return data;
    }

    // Eliminar un producto por su ID
    async deleteProduct(id: number): Promise<void> {
        const { error } = await this.client
            .from('productos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            throw new Error('Unable to delete product');
        }
    }
}
