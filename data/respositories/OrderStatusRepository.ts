import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class OrderStatusRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los estados de pedido
    async getOrderStatuses(): Promise<OrderStatus[]> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .select('*');

        if (error) {
            console.error('Error fetching order statuses:', error);
            throw new Error('Unable to fetch order statuses');
        }
        return data || [];
    }

    // Obtener un estado de pedido específico por su ID
    async getOrderStatus(id: number): Promise<OrderStatus | null> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order status:', error);
            throw new Error('Unable to fetch order status');
        }
        return data || null;
    }

    // Crear un nuevo estado de pedido
    async createOrderStatus(orderStatus: OrderStatus): Promise<OrderStatus> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .insert(orderStatus)
            .single();

        if (error) {
            console.error('Error creating order status:', error);
            throw new Error('Unable to create order status');
        }
        return data;
    }

    // Actualizar un estado de pedido existente
    async updateOrderStatus(id: number, updates: Partial<OrderStatus>): Promise<OrderStatus> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating order status:', error);
            throw new Error('Unable to update order status');
        }
        return data;
    }

    // Eliminar un estado de pedido por su ID
    async deleteOrderStatus(id: number): Promise<void> {
        const { error } = await this.client
            .from('estados_pedidos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting order status:', error);
            throw new Error('Unable to delete order status');
        }
    }
}
