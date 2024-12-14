import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class PublicationRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todas las publicaciones
    async getPublications(): Promise<Publication[]> {
        const { data, error } = await this.client
            .from('publicaciones')
            .select('*');

        if (error) {
            console.error('Error fetching publications:', error);
            throw new Error('Unable to fetch publications');
        }
        return data || [];
    }

    // Obtener una publicación específica por su ID
    async getPublication(id: number): Promise<Publication | null> {
        const { data, error } = await this.client
            .from('publicaciones')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching publication:', error);
            throw new Error('Unable to fetch publication');
        }
        return data || null;
    }

    // Crear una nueva publicación
    async createPublication(publication: Partial<Publication>): Promise<Publication> {
        const { data, error } = await this.client
            .from('publicaciones')
            .insert(publication)
            .select();

        if (error) {
            console.error('Error creating publication:', error);
            throw new Error('Unable to create publication');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar una publicación existente
    async updatePublication(id: number, updates: Partial<Publication>): Promise<Publication> {
        const { data, error } = await this.client
            .from('publicaciones')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating publication:', error);
            throw new Error('Unable to update publication');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Eliminar una publicación por su ID
    async deletePublication(id: number): Promise<void> {
        const { error } = await this.client
            .from('publicaciones')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting publication:', error);
            throw new Error('Unable to delete publication');
        }
    }
}
