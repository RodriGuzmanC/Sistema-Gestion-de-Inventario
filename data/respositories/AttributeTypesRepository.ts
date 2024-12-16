
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class AttributeTypesRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getAttributeTypes(): Promise<AttributeType[]> {
        const { data, error } = await this.client
            .from('tipos_atributos')
            .select('*');

        if (error) {
            console.error('Error fetching attributes types:', error);
            throw new Error('Unable to fetch attributes types');
        }
        return data || [];
    }

    async getAttributeTypesWithAttributes(): Promise<AttributeTypesWithAttributes[]> {
        const { data, error } = await this.client
            .from('tipos_atributos')
            .select('*, atributos(*)');

        if (error) {
            console.error('Error fetching attributes types with attributes:', error);
            throw new Error('Unable to fetch attributes types with attributes');
        }
        return data || [];
    }


    async getAttributeType(id: number): Promise<AttributeType | null> {
        const { data, error } = await this.client
            .from('tipos_atributos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching attributes types:', error);
            throw new Error('Unable to fetch attributes types');
        }
        return data || null;
    }

    async createAttributeType(attributeType: Partial<AttributeType>): Promise<AttributeType> {
        const { data, error } = await this.client
            .from('tipos_atributos')
            .insert(attributeType)
            .select();

        if (error) {
            console.error('Error creating attributes types:', error);
            throw new Error('Unable to create attributes types');
        }
        console.log(`Desde repository: ${JSON.stringify(data[0])}`);
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0];
    }

    async updateAttributeType(id: number, updates: Partial<AttributeType>): Promise<AttributeType> {
        const { data, error } = await this.client
            .from('tipos_atributos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating attributes types:', error);
            throw new Error('Unable to update attributes types');
        }
        console.log(`Desde repository: ${JSON.stringify(data[0])}`);
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    async deleteAttributeType(id: number): Promise<void> {
        const { error } = await this.client
            .from('tipos_atributos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting attributes types:', error);
            throw new Error('Unable to delete attributes types');
        }
    }
}

