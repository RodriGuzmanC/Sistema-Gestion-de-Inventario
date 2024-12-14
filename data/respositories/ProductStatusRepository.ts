import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ProductStatusRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los estados de productos
    async getProductStatuses(): Promise<ProductStatus[]> {
        const { data, error } = await this.client
            .from('estados_productos')
            .select('*');

        if (error) {
            console.error('Error fetching product statuses:', error);
            throw new Error('Unable to fetch product statuses');
        }
        return data || [];
    }

    // Obtener un estado de producto específico por su ID
    async getProductStatus(id: number): Promise<ProductStatus | null> {
        const { data, error } = await this.client
            .from('estados_productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product status:', error);
            throw new Error('Unable to fetch product status');
        }
        return data || null;
    }

    // Crear un nuevo estado de producto
    async createProductStatus(productStatus: Partial<ProductStatus>): Promise<ProductStatus> {
        const { data, error } = await this.client
            .from('estados_productos')
            .insert(productStatus)
            .select();

        if (error) {
            console.error('Error creating product status:', error);
            throw new Error('Unable to create product status');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar un estado de producto existente
    async updateProductStatus(id: number, updates: Partial<ProductStatus>): Promise<ProductStatus> {
        const { data, error } = await this.client
            .from('estados_productos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating product status:', error);
            throw new Error('Unable to update product status');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Eliminar un estado de producto por su ID
    async deleteProductStatus(id: number): Promise<void> {
        const { error } = await this.client
            .from('estados_productos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product status:', error);
            throw new Error('Unable to delete product status');
        }
    }
}
