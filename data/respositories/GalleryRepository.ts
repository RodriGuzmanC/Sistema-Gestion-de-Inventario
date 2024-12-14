// GalleryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class GalleryRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getGalleries(): Promise<Gallery[]> {
        const { data, error } = await this.client
            .from('galerias')
            .select('*');

        if (error) {
            console.error('Error fetching galleries:', error);
            throw new Error('Unable to fetch galleries');
        }
        return data || [];
    }

    async getGallery(id: number): Promise<Gallery | null> {
        const { data, error } = await this.client
            .from('galerias')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching gallery:', error);
            throw new Error('Unable to fetch gallery');
        }
        return data || null;
    }

    async createGallery(gallery: Partial<Gallery>): Promise<Gallery> {
        const { data, error } = await this.client
            .from('galerias')
            .insert(gallery)
            .select();

        if (error) {
            console.error('Error creating gallery:', error);
            throw new Error('Unable to create gallery');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    async updateGallery(id: number, updates: Partial<Gallery>): Promise<Gallery> {
        const { data, error } = await this.client
            .from('galerias')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating gallery:', error);
            throw new Error('Unable to update gallery');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0];
    }

    async deleteGallery(id: number): Promise<void> {
        const { error } = await this.client
            .from('galerias')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting gallery:', error);
            throw new Error('Unable to delete gallery');
        }
    }
}