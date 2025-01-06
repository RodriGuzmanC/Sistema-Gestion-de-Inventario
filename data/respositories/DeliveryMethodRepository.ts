// DeliveryMethodRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class DeliveryMethodRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getDeliveryMethods(page: number, itemsPerPage: number): Promise<PaginatedResponse<DeliveryMethod>> {
        // Calcular los índices de paginación
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('metodos_entregas')
            .select('*')
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching delivery methods:', error);
            throw new Error('Unable to fetch delivery methods');
        }
        return makePagination<DeliveryMethod>(this.client, data, 'metodos_entregas', page, itemsPerPage)
    }

    async getDeliveryMethod(id: number): Promise<DataResponse<DeliveryMethod>> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching delivery method:', error);
            throw new Error('Unable to fetch delivery method');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<DeliveryMethod> = {
            data: data || null,
        }
        return res;
    }

    async createDeliveryMethod(deliveryMethod: Partial<DeliveryMethod>): Promise<DataResponse<DeliveryMethod>> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .insert(deliveryMethod)
            .select();

        if (error) {
            console.error('Error creating delivery method:', error);
            throw new Error('Unable to create delivery method');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<DeliveryMethod> = {
            data: data[0] || null,
        }
        return res;
    }

    async updateDeliveryMethod(id: number, updates: Partial<DeliveryMethod>): Promise<DataResponse<DeliveryMethod>> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating delivery method:', error);
            throw new Error('Unable to update delivery method');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<DeliveryMethod> = {
            data: data[0] || null,
        }
        return res;
    }

    async deleteDeliveryMethod(id: number): Promise<DataResponse<DeliveryMethod>> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting delivery method:', error);
            throw new Error('Unable to delete delivery method');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<DeliveryMethod> = {
            data: data[0] || null,
        }
        return res;
    }
}