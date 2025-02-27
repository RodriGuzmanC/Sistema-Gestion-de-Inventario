import page from '@/app/dashboard/page';
import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class OrderStatusRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los estados de pedido
    async getOrderStatuses(page: number, itemsPerPage: number): Promise<PaginatedResponse<OrderStatus[]>> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .select('*');

        if (error) {
            console.error('Error fetching order statuses:', error);
            throw new Error('Unable to fetch order statuses');
        }
        return makePagination<OrderStatus[]>(this.client, data, 'estados_pedidos', page, itemsPerPage);
    }

    // Obtener un estado de pedido específico por su ID
    async getOrderStatus(id: number): Promise<DataResponse<OrderStatus>> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order status:', error);
            throw new Error('Unable to fetch order status');
        }
        const res: DataResponse<OrderStatus> = {
            data: data
        }
        return res
    }

    // Crear un nuevo estado de pedido
    async createOrderStatus(orderStatus: Partial<OrderStatus>): Promise<DataResponse<OrderStatus>> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .insert(orderStatus)
            .select();

        if (error) {
            console.error('Error creating order status:', error);
            throw new Error('Unable to create order status');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        const res: DataResponse<OrderStatus> = {
            data: data[0]
        }
        return res
    }

    // Actualizar un estado de pedido existente
    async updateOrderStatus(id: number, updates: Partial<OrderStatus>): Promise<DataResponse<OrderStatus>> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating order status:', error);
            throw new Error('Unable to update order status');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        const res: DataResponse<OrderStatus> = {
            data: data[0]
        }
        return res
    }

    // Eliminar un estado de pedido por su ID
    async deleteOrderStatus(id: number): Promise<DataResponse<OrderStatus>> {
        const { data, error } = await this.client
            .from('estados_pedidos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting order status:', error);
            throw new Error('Unable to delete order status');
        }

        const res: DataResponse<OrderStatus> = {
            data: data[0]
        }
        return res
    }
}
