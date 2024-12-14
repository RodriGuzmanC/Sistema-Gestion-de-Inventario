import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class OrderDetailRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los detalles de pedido
    async getOrderDetails(orderId: number): Promise<OrderDetail[]> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .select('*')
            .eq('pedido_id', orderId);

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
    async createOrderDetail(orderDetail: Partial<OrderDetail>): Promise<OrderDetail> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .insert(orderDetail)
            .select();

        if (error) {
            console.error('Error creating order detail:', error);
            throw new Error('Unable to create order detail');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar un detalle de pedido existente
    async updateOrderDetail(id: number, updates: Partial<OrderDetail>): Promise<OrderDetail> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating order detail:', error);
            throw new Error('Unable to update order detail');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0];
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
