
import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class AttributeRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getAttributes(page: number, itemsPerPage: number): Promise<PaginatedResponse<Attribute>> {
        // Calcular los índices de paginación
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('atributos')
            .select('*')
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching attributes:', error);
            throw new Error('Unable to fetch attributes');
        }
        
        return makePagination<Attribute>(this.client, data, 'atributos', page, itemsPerPage)
    }

    async getAttribute(id: number): Promise<DataResponse<Attribute>> {
        const { data, error } = await this.client
            .from('atributos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching attributes:', error);
            throw new Error('Unable to fetch attributes');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Attribute> = {
            data: data || null,
        }
        return res;
    }

    async createAttribute(attribute: Partial<Attribute>): Promise<DataResponse<Attribute>> {
        const { data, error } = await this.client
            .from('atributos')
            .insert(attribute)
            .select();

        if (error) {
            console.error('Error creating attributes:', error);
            throw new Error('Unable to create attributes');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Attribute> = {
            data: data[0] || null,
        }
        return res;
    }

    async updateAttribute(id: number, updates: Partial<Attribute>): Promise<DataResponse<Attribute>> {
        const { data, error } = await this.client
            .from('atributos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating attributes:', error);
            throw new Error('Unable to update attributes');
        }
        console.log(`Desde repository: ${JSON.stringify(data[0])}`);
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Attribute> = {
            data: data[0] || null,
        }
        return res;
    }

    async deleteAttribute(id: number): Promise<DataResponse<Attribute>> {
        const { data, error } = await this.client
            .from('atributos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting attributes:', error);
            throw new Error('Unable to delete attributes');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Attribute> = {
            data: data[0] || null,
        }
        return res;
    }
}