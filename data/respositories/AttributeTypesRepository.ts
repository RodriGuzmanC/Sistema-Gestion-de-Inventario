
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class AttributeTypesRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getAttributes(): Promise<any[]> {
        const { data, error } = await this.client
            .from('tipos_atributos')
            .select('*');

        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Unable to fetch products');
        }
        return data || [];
    }
}

