import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ProductStatusRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los estados de productos
    async getProductStatuses(pages: number, itemsPerPage: number): Promise<PaginatedResponse<ProductStatus>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('estados_productos')
            .select('*')
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching product statuses:', error);
            throw new Error('Unable to fetch product statuses');
        }
        return makePagination<ProductStatus>(this.client, data, 'estados_productos', pages, itemsPerPage)
    }

    // Obtener un estado de producto específico por su ID
    async getProductStatus(id: number): Promise<DataResponse<ProductStatus>> {
        const { data, error } = await this.client
            .from('estados_productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product status:', error);
            throw new Error('Unable to fetch product status');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<ProductStatus> = {
            data: data || null,
        }
        return res;
    }

    // Crear un nuevo estado de producto
    async createProductStatus(productStatus: Partial<ProductStatus>): Promise<DataResponse<ProductStatus>> {
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
        // Lo envolvemos en un DataResponse
        const res: DataResponse<ProductStatus> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar un estado de producto existente
    async updateProductStatus(id: number, updates: Partial<ProductStatus>): Promise<DataResponse<ProductStatus>> {
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
        // Lo envolvemos en un DataResponse
        const res: DataResponse<ProductStatus> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar un estado de producto por su ID
    async deleteProductStatus(id: number): Promise<DataResponse<ProductStatus>> {
        const { data, error } = await this.client
            .from('estados_productos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting product status:', error);
            throw new Error('Unable to delete product status');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<ProductStatus> = {
            data: data[0] || null,
        }
        return res;
    }
}
