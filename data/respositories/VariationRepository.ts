import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';



export default class VariationRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todas las variaciones
    async getVariations(): Promise<Variation[]> {
        const { data, error } = await this.client
            .from('variaciones')
            .select('*');

        if (error) {
            console.error('Error fetching variations:', error);
            throw new Error('Unable to fetch variations');
        }
        return data || [];
    }

    // Obtener una variación específica por su ID
    async getVariation(id: number): Promise<Variation | null> {
        const { data, error } = await this.client
            .from('variaciones')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching variation:', error);
            throw new Error('Unable to fetch variation');
        }
        return data || null;
    }

    // Obtener variaciones por ID de producto
    async getVariationsByProductId(productId: number): Promise<Variation[]> {
        const { data, error } = await this.client
            .from('variaciones')
            .select('*')
            .eq('productId', productId);

        if (error) {
            console.error('Error fetching variations by product ID:', error);
            throw new Error('Unable to fetch variations by product ID');
        }
        return data || [];
    }

    // Crear una nueva variación
    async createVariation(variation: Variation): Promise<Variation> {
        const { data, error } = await this.client
            .from('variaciones')
            .insert(variation)
            .single();

        if (error) {
            console.error('Error creating variation:', error);
            throw new Error('Unable to create variation');
        }
        return data;
    }

    // Actualizar una variación existente
    async updateVariation(id: number, updates: Partial<Variation>): Promise<Variation> {
        const { data, error } = await this.client
            .from('variaciones')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating variation:', error);
            throw new Error('Unable to update variation');
        }
        return data;
    }

    // Eliminar una variación por su ID
    async deleteVariation(id: number): Promise<void> {
        const { error } = await this.client
            .from('variaciones')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting variation:', error);
            throw new Error('Unable to delete variation');
        }
    }
}
