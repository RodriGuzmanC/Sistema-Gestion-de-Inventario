// GalleryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class GalleryRepository {
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

    async createGallery(gallery: Gallery): Promise<Gallery> {
        const { data, error } = await this.client
            .from('galerias')
            .insert(gallery)
            .single();

        if (error) {
            console.error('Error creating gallery:', error);
            throw new Error('Unable to create gallery');
        }
        return data;
    }

    async updateGallery(id: number, updates: Partial<Gallery>): Promise<Gallery> {
        const { data, error } = await this.client
            .from('galerias')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating gallery:', error);
            throw new Error('Unable to update gallery');
        }
        return data;
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