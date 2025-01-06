import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ClientRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los clientes
    async getClients(pages: number, itemsPerPage: number): Promise<PaginatedResponse<Client>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('clientes')
            .select('*')
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching client:', error);
            throw new Error('Unable to fetch client');
        }
        
        // Obtener el total de items
        const { count: totalItems } = await this.client
            .from('clientes')
            .select('*', { count: 'exact' }); // Esto obtiene solo el total sin traer los registros completos
        if (!totalItems){
            throw new Error('Clients not found'); 
        }

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalItems / itemsPerPage);
        const paginatedData: PaginatedResponse<Client> = {
            data: data || [],
            paginacion: {
                pagina_actual: pages,
                total_items: totalItems,
                items_por_pagina: itemsPerPage,
                total_paginas: totalPaginas,
            },
        };

        return paginatedData;

    }

    // Obtener un client específico por su ID
    async getClient(id: number): Promise<DataResponse<Client>> {
        const { data, error } = await this.client
            .from('clientes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching client:', error);
            throw new Error('Unable to fetch client');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<Client> = {
            data: data || null,
        }
        return res;
    }

    // Crear un nuevo cliente
    async createClient(client: Partial<Client>): Promise<DataResponse<Client>> {
        const { data, error } = await this.client
            .from('clientes')
            .insert(client)
            .select();

        if (error) {
            console.error('Error creating client:', error);
            throw new Error('Unable to create client');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Client> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar un cliente existente
    async updateClient(id: number, updates: Partial<Client>): Promise<DataResponse<Client>> {
        const { data, error } = await this.client
            .from('clientes')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating client:', error);
            throw new Error('Unable to update client');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Client> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar un cliente por su ID
    async deleteClient(id: number): Promise<DataResponse<Client>> {
        const { data, error } = await this.client
            .from('clientes')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting client:', error);
            throw new Error('Unable to delete client');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Client> = {
            data: data[0] || null,
        }
        return res;
    }
}
