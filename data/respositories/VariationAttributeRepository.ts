import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';


export default new class VariationAttributeRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener una variación de atributo específica por su ID
    async getVariationAttribute(id: number): Promise<DataResponse<VariationAttribute>> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching variation attribute:', error);
            throw new Error('Unable to fetch variation attribute');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<VariationAttribute> = {
            data: data || null,
        }
        return res;
    }

    // Obtener variaciones de atributos por ID de variación
    async getVariationAttributesByVariationId(variationId: number, page: number, itemsPerPage: number): Promise<PaginatedResponse<VariationAttribute[]>> {
        // Calcular los índices de paginación
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('variaciones_atributos')
            .select('*')
            .eq('variacion_id', variationId)
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching variation attributes by variation ID:', error);
            throw new Error('Unable to fetch variation attributes by variation ID');
        }

        return makePagination<VariationAttribute[]>(this.client, data, 'variaciones_atributos', page, itemsPerPage, 'variacion_id', variationId)

    }

    // Crear una nueva variación de atributo
    async createVariationAttribute(variationAttribute: Partial<VariationAttribute>): Promise<DataResponse<VariationAttribute>> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .insert(variationAttribute)
            .select();

        if (error) {
            console.error('Error creating variation attribute:', error);
            throw new Error('Unable to create variation attribute');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<VariationAttribute> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar una variación de atributo existente
    async updateVariationAttribute(id: number, updates: Partial<VariationAttribute>): Promise<DataResponse<VariationAttribute>> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating variation attribute:', error);
            throw new Error('Unable to update variation attribute');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<VariationAttribute> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar una variación de atributo por su ID
    async deleteVariationAttribute(id: number): Promise<DataResponse<VariationAttribute>> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting variation attribute:', error);
            throw new Error('Unable to delete variation attribute');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<VariationAttribute> = {
            data: data[0] || null,
        }
        return res;
    }
}
