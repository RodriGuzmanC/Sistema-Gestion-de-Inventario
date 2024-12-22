import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ClientRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los clientes
    async getClients(): Promise<Client[]> {
        const { data, error } = await this.client
            .from('clientes')
            .select('*');

        if (error) {
            console.error('Error fetching client:', error);
            throw new Error('Unable to fetch client');
        }
        return data || [];
    }

    // Obtener un client específico por su ID
    async getClient(id: number): Promise<Client | null> {
        const { data, error } = await this.client
            .from('clientes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching client:', error);
            throw new Error('Unable to fetch client');
        }
        return data || null;
    }

    // Crear un nuevo cliente
    async createClient(client: Partial<Client>): Promise<Client> {
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
        return data[0]; 
    }

    // Actualizar un cliente existente
    async updateClient(id: number, updates: Partial<Client>): Promise<Client> {
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
        return data[0]; 
    }

    // Eliminar un cliente por su ID
    async deleteClient(id: number): Promise<void> {
        const { error } = await this.client
            .from('clientes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting client:', error);
            throw new Error('Unable to delete client');
        }
    }
}
