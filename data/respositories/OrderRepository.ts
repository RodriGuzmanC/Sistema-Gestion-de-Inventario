import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';


export default new class OrderRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los pedidos
    async getOrders(pages: number, itemsPerPage: number): Promise<PaginatedResponse<OrderWithFullRelations>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('pedidos')
            .select(`*, 
                detalles_pedidos(*, 
                    variaciones(*, 
                        productos(*), 
                        variaciones_atributos(*, 
                            atributos(*, 
                                tipos_atributos(*)
                            )
                        )
                    )
                ),
                clientes(*), 
                estados_pedidos(*), 
                metodos_entregas(*)`)
            .range(startIndex, endIndex); // Paginación


        if (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Unable to fetch orders');
        }

        // Obtener el total de items
        const { count: totalItems } = await this.client
            .from('pedidos')
            .select('*', { count: 'exact' }); // Esto obtiene solo el total sin traer los registros completos
        if (!totalItems){
            throw new Error('Orders not found'); 
        }

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalItems / itemsPerPage);
        const paginatedData: PaginatedResponse<OrderWithFullRelations> = {
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

    // Obtener un pedido específico por su ID
    async getOrderWithAll(id: number): Promise<DataResponse<OrderWithFullRelations>> {
        const { data, error } = await this.client
            .from('pedidos')
            .select(`*, 
                detalles_pedidos(*, 
                    variaciones(*, 
                        productos(*), 
                        variaciones_atributos(*, 
                            atributos(*, 
                                tipos_atributos(*)
                            )
                        )
                    )
                ),
                clientes(*), 
                estados_pedidos(*), 
                metodos_entregas(*)`)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order:', error);
            throw new Error('Unable to fetch order');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<OrderWithFullRelations> = {
            data: data || null,
        }
        return res;
    }

    async getOrdersByDateRangeAndClient(startDate: string, endDate: string, clientId: number): Promise<OrderWithBasicRelations[]> {
        const { data, error } = await this.client
            .from('pedidos')
            .select('*, estados_pedidos(*), metodos_entregas(*), clientes(*)')
            .gte('fecha_entrega', startDate)
            .lte('fecha_entrega', endDate)
            .eq('cliente_id', clientId);
    
        if (error) {
            console.error('Error fetching orders by date range:', error);
            throw new Error('Unable to fetch orders by date range');
        }
        return data || [];
    }

    // Crear un nuevo pedido
    async createOrder(order: Partial<Order>): Promise<DataResponse<Order>> {
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
        const res: DataResponse<Order> = {
            data: data[0] || null,
        }
        return res; 
    }

    // Actualizar un pedido existente
    async updateOrder(id: number, updates: Partial<Order>): Promise<DataResponse<Order>> {
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
        const res: DataResponse<Order> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar un pedido por su ID
    async deleteOrder(id: number): Promise<DataResponse<Order>> {
        const { data, error } = await this.client
            .from('pedidos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting order:', error);
            throw new Error('Unable to delete order');
        }
        const res: DataResponse<Order> = {
            data: data[0] || null,
        }
        return res;
    }
}
