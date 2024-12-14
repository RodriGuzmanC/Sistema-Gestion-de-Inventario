import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';


export default new class SocialNetworkRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todas las redes sociales
    async getSocialNetworks(): Promise<SocialNetwork[]> {
        const { data, error } = await this.client
            .from('redes')
            .select('*');

        if (error) {
            console.error('Error fetching social networks:', error);
            throw new Error('Unable to fetch social networks');
        }
        return data || [];
    }

    // Obtener una red social específica por su ID
    async getSocialNetwork(id: number): Promise<SocialNetwork | null> {
        const { data, error } = await this.client
            .from('redes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching social network:', error);
            throw new Error('Unable to fetch social network');
        }
        return data || null;
    }

    // Crear una nueva red social
    async createSocialNetwork(socialNetwork: Partial<SocialNetwork>): Promise<SocialNetwork> {
        const { data, error } = await this.client
            .from('redes')
            .insert(socialNetwork)
            .select();

        if (error) {
            console.error('Error creating social network:', error);
            throw new Error('Unable to create social network');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar una red social existente
    async updateSocialNetwork(id: number, updates: Partial<SocialNetwork>): Promise<SocialNetwork> {
        const { data, error } = await this.client
            .from('redes')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating social network:', error);
            throw new Error('Unable to update social network');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Eliminar una red social por su ID
    async deleteSocialNetwork(id: number): Promise<void> {
        const { error } = await this.client
            .from('redes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting social network:', error);
            throw new Error('Unable to delete social network');
        }
    }
}
