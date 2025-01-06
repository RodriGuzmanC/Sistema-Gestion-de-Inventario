import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';


export default new class SocialNetworkRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todas las redes sociales
    async getSocialNetworks(pages: number, itemsPerPage: number): Promise<PaginatedResponse<SocialNetwork>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('redes')
            .select('*')
            .range(startIndex, endIndex);


        if (error) {
            console.error('Error fetching social networks:', error);
            throw new Error('Unable to fetch social networks');
        }
        return makePagination<SocialNetwork>(this.client, data, 'redes', pages, itemsPerPage)
    }

    // Obtener una red social específica por su ID
    async getSocialNetwork(id: number): Promise<DataResponse<SocialNetwork>> {
        const { data, error } = await this.client
            .from('redes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching social network:', error);
            throw new Error('Unable to fetch social network');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<SocialNetwork> = {
            data: data || null,
        }
        return res;
    }

    // Crear una nueva red social
    async createSocialNetwork(socialNetwork: Partial<SocialNetwork>): Promise<DataResponse<SocialNetwork>> {
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
        // Lo envolvemos en un DataResponse
        const res: DataResponse<SocialNetwork> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar una red social existente
    async updateSocialNetwork(id: number, updates: Partial<SocialNetwork>): Promise<DataResponse<SocialNetwork>> {
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
        // Lo envolvemos en un DataResponse
        const res: DataResponse<SocialNetwork> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar una red social por su ID
    async deleteSocialNetwork(id: number): Promise<DataResponse<SocialNetwork>> {
        const { data, error } = await this.client
            .from('redes')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting social network:', error);
            throw new Error('Unable to delete social network');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<SocialNetwork> = {
            data: data[0] || null,
        }
        return res;
    }
}
