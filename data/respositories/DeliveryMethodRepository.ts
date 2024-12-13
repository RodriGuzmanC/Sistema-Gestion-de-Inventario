// DeliveryMethodRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class DeliveryMethodRepository {
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

    async createDeliveryMethod(deliveryMethod: DeliveryMethod): Promise<DeliveryMethod> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .insert(deliveryMethod)
            .single();

        if (error) {
            console.error('Error creating delivery method:', error);
            throw new Error('Unable to create delivery method');
        }
        return data;
    }

    async updateDeliveryMethod(id: number, updates: Partial<DeliveryMethod>): Promise<DeliveryMethod> {
        const { data, error } = await this.client
            .from('metodos_entregas')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating delivery method:', error);
            throw new Error('Unable to update delivery method');
        }
        return data;
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