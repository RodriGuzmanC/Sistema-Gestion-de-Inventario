// DeliveryMethodRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class DeliveryMethodRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getDeliveryMethods(): Promise<DeliveryMethod[]> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .select('*');

        if (error) {
            console.error('Error fetching delivery methods:', error);
            throw new Error('Unable to fetch delivery methods');
        }
        return data || [];
    }

    async getDeliveryMethod(id: number): Promise<DeliveryMethod | null> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching delivery method:', error);
            throw new Error('Unable to fetch delivery method');
        }
        return data || null;
    }

    async createDeliveryMethod(deliveryMethod: Partial<DeliveryMethod>): Promise<DeliveryMethod> {
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
        return data[0]; 
    }

    async updateDeliveryMethod(id: number, updates: Partial<DeliveryMethod>): Promise<DeliveryMethod> {
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
        return data[0];
    }

    async deleteDeliveryMethod(id: number): Promise<void> {
        const { error } = await this.client
            .from('metodos_entregas')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting delivery method:', error);
            throw new Error('Unable to delete delivery method');
        }
    }
}