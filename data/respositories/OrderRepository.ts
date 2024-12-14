import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';


export default new class OrderRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los pedidos
    async getOrders(): Promise<Order[]> {
        const { data, error } = await this.client
            .from('pedidos')
            .select('*');

        if (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Unable to fetch orders');
        }
        return data || [];
    }

    // Obtener un pedido específico por su ID
    async getOrder(id: number): Promise<Order | null> {
        const { data, error } = await this.client
            .from('pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order:', error);
            throw new Error('Unable to fetch order');
        }
        return data || null;
    }

    // Crear un nuevo pedido
    async createOrder(order: Partial<Order>): Promise<Order> {
        const { data, error } = await this.client
            .from('pedidos')
            .insert(order)
            .select();

        if (error) {
            console.error('Error creating order:', error);
            throw new Error('Unable to create order');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar un pedido existente
    async updateOrder(id: number, updates: Partial<Order>): Promise<Order> {
        const { data, error } = await this.client
            .from('pedidos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating order:', error);
            throw new Error('Unable to update order');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0];
    }

    // Eliminar un pedido por su ID
    async deleteOrder(id: number): Promise<void> {
        const { error } = await this.client
            .from('pedidos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting order:', error);
            throw new Error('Unable to delete order');
        }
    }
}
