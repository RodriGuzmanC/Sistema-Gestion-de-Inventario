import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class OrderDetailRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los detalles de pedido
    async getOrderDetails(): Promise<OrderDetail[]> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .select('*');

        if (error) {
            console.error('Error fetching order details:', error);
            throw new Error('Unable to fetch order details');
        }
        return data || [];
    }

    // Obtener un detalle de pedido específico por su ID
    async getOrderDetail(id: number): Promise<OrderDetail | null> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order detail:', error);
            throw new Error('Unable to fetch order detail');
        }
        return data || null;
    }

    // Crear un nuevo detalle de pedido
    async createOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .insert(orderDetail)
            .single();

        if (error) {
            console.error('Error creating order detail:', error);
            throw new Error('Unable to create order detail');
        }
        return data;
    }

    // Actualizar un detalle de pedido existente
    async updateOrderDetail(id: number, updates: Partial<OrderDetail>): Promise<OrderDetail> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating order detail:', error);
            throw new Error('Unable to update order detail');
        }
        return data;
    }

    // Eliminar un detalle de pedido por su ID
    async deleteOrderDetail(id: number): Promise<void> {
        const { error } = await this.client
            .from('detalles_pedidos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting order detail:', error);
            throw new Error('Unable to delete order detail');
        }
    }
}
