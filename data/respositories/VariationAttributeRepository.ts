import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';


export default class VariationAttributeRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todas las variaciones de atributos
    async getVariationAttributes(): Promise<VariationAttribute[]> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .select('*');

        if (error) {
            console.error('Error fetching variation attributes:', error);
            throw new Error('Unable to fetch variation attributes');
        }
        return data || [];
    }

    // Obtener una variación de atributo específica por su ID
    async getVariationAttribute(id: number): Promise<VariationAttribute | null> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching variation attribute:', error);
            throw new Error('Unable to fetch variation attribute');
        }
        return data || null;
    }

    // Obtener variaciones de atributos por ID de variación
    async getVariationAttributesByVariationId(variationId: number): Promise<VariationAttribute[]> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .select('*')
            .eq('variationId', variationId);

        if (error) {
            console.error('Error fetching variation attributes by variation ID:', error);
            throw new Error('Unable to fetch variation attributes by variation ID');
        }
        return data || [];
    }

    // Crear una nueva variación de atributo
    async createVariationAttribute(variationAttribute: VariationAttribute): Promise<VariationAttribute> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .insert(variationAttribute)
            .single();

        if (error) {
            console.error('Error creating variation attribute:', error);
            throw new Error('Unable to create variation attribute');
        }
        return data;
    }

    // Actualizar una variación de atributo existente
    async updateVariationAttribute(id: number, updates: Partial<VariationAttribute>): Promise<VariationAttribute> {
        const { data, error } = await this.client
            .from('variaciones_atributos')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating variation attribute:', error);
            throw new Error('Unable to update variation attribute');
        }
        return data;
    }

    // Eliminar una variación de atributo por su ID
    async deleteVariationAttribute(id: number): Promise<void> {
        const { error } = await this.client
            .from('variaciones_atributos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting variation attribute:', error);
            throw new Error('Unable to delete variation attribute');
        }
    }
}
