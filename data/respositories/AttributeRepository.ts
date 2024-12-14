
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class AttributeRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getAttributes(): Promise<Attribute[]> {
        const { data, error } = await this.client
            .from('atributos')
            .select('*');

        if (error) {
            console.error('Error fetching attributes:', error);
            throw new Error('Unable to fetch attributes');
        }
        return data || [];
    }

    async getAttribute(id: number): Promise<Attribute | null> {
        const { data, error } = await this.client
            .from('atributos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching attributes:', error);
            throw new Error('Unable to fetch attributes');
        }
        return data || null;
    }

    async createAttribute(attribute: Partial<Attribute>): Promise<Attribute> {
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
        return data[0]; 
    }

    async updateAttribute(id: number, updates: Partial<Attribute>): Promise<Attribute> {
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
        return data[0];
    }

    async deleteAttribute(id: number): Promise<void> {
        const { error } = await this.client
            .from('atributos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting attributes:', error);
            throw new Error('Unable to delete attributes');
        }
    }
}