import createSupabaseClient from '@/utils/dbClient';
import { makePagination } from '@/utils/serverUtils';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class OrderDetailRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient;
    }

    // Obtener todos los detalles de pedido
    async getOrdersDetailsByOrder(orderId: number, page: number, itemsPerPage: number): Promise<PaginatedResponse<OrderDetail>> {
        // Calcular los índices de paginación
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('detalles_pedidos')
            .select('*')
            .eq('pedido_id', orderId)
            .range(startIndex, endIndex);


        if (error) {
            console.error('Error fetching order details:', error);
            throw new Error('Unable to fetch order details');
        }
        return makePagination<OrderDetail>(this.client, data, 'detalles_pedidos', page, itemsPerPage, 'pedido_id', orderId);
    }

    // Obtener un detalle de pedido específico por su ID
    async getOrderDetail(id: number): Promise<DataResponse<OrderDetail>> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order detail:', error);
            throw new Error('Unable to fetch order detail');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<OrderDetail> = {
            data: data || null,
        }
        return res;
    }

    // Crear un nuevo detalle de pedido
    async createOrderDetail(orderDetail: Partial<OrderDetail>): Promise<DataResponse<OrderDetail>> {
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
        // Lo envolvemos en un DataResponse
        const res: DataResponse<OrderDetail> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar un detalle de pedido existente
    async updateOrderDetail(id: number, updates: Partial<OrderDetail>): Promise<DataResponse<OrderDetail>> {
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
        // Lo envolvemos en un DataResponse
        const res: DataResponse<OrderDetail> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar un detalle de pedido por su ID
    async deleteOrderDetail(id: number): Promise<DataResponse<OrderDetail>> {
        const { data, error } = await this.client
            .from('detalles_pedidos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting order detail:', error);
            throw new Error('Unable to delete order detail');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<OrderDetail> = {
            data: data[0] || null,
        }
        return res;
    }
}
