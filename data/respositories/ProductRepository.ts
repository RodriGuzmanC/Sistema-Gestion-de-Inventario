import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ProductRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los productos
    async getProducts(): Promise<ProductWithBasicRelations[]> {
        const { data, error } = await this.client
            .from('productos')
            .select('*, galerias(*), categorias_productos(*, categorias(*)), variaciones(*), estados_productos(*)');

        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Unable to fetch products');
        }
        return data || [];
    }

    // Obtener todos los productos
    async getProductWithRelations(id: number): Promise<ProductWithFullRelations> {
        const { data, error } = await this.client
            .from('productos')
            .select('*, galerias(*), estados_productos(*), variaciones(*, variaciones_atributos(*, atributos(*, tipos_atributos(*)))), categorias_productos(*, categorias(*)), publicaciones(*, redes(*))')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Unable to fetch products');
        }
        return data || [];
    }

    // Crear un nuevo producto
    async createProduct(product: Partial<Product>): Promise<Product> {
        const { data, error } = await this.client
            .from('productos')
            .insert(product)
            .select();

        if (error) {
            console.error('Error creating product:', error);
            throw new Error('Unable to create product');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar un producto existente
    async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
        const { data, error } = await this.client
            .from('productos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating product:', error);
            throw new Error('Unable to update product');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0]; 
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
