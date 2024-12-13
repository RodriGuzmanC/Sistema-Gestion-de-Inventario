
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
}