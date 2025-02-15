import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';



export default new class VariationRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todas las variaciones de un producto
    async getVariationsByProduct(page: number, itemsPerPage: number, productId: number): Promise<PaginatedResponse<Variation[]>> {
        // Calcular los índices de paginación
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('variaciones')
            .select('*')
            .eq('producto_id', productId)
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching variations:', error);
            throw new Error('Unable to fetch variations');
        }
        
        return makePagination<Variation[]>(this.client, data, 'variaciones', page, itemsPerPage)

    }

    // Obtener una variación específica por su ID
    async getVariation(id: number): Promise<DataResponse<Variation>> {
        const { data, error } = await this.client
            .from('variaciones')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching variation:', error);
            throw new Error('Unable to fetch variation');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<Variation> = {
            data: data || null,
        }
        return res;
    }

    // Crear una nueva variación
    async createVariation(variation: Partial<Variation>): Promise<DataResponse<Variation>> {
        const { data, error } = await this.client
            .from('variaciones')
            .insert(variation)
            .select();

        if (error) {
            console.error('Error creating variation:', error);
            throw new Error('Unable to create variation');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Variation> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar una variación existente
    async updateVariation(id: number, updates: Partial<Variation>): Promise<DataResponse<Variation>> {
        const { data, error } = await this.client
            .from('variaciones')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating variation:', error);
            throw new Error('Unable to update variation');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Variation> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar una variación por su ID
    async deleteVariation(id: number): Promise<DataResponse<Variation>> {
        const { data, error } = await this.client
            .from('variaciones')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting variation:', error);
            throw new Error('Unable to delete variation');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Variation> = {
            data: data[0] || null,
        }
        return res;
    }
}
