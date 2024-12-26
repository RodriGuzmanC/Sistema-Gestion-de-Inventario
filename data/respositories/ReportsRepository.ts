import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ReportsRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getLastOrdersByMonthRepository(): Promise<ReportLastOrdersByMonth[]> {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const { data, error } = await this.client
            .from('pedidos')
            .select('*, clientes(*), estados_pedidos(*), metodos_entregas(*), detalles_pedidos(*)')
            .gte('fecha_pedido', `${currentYear}-${currentMonth}-01`)
            .lte('fecha_pedido', `${currentYear}-${currentMonth}-31`)
            .order('fecha_pedido', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Unable to fetch orders');
        }

        return data || [];
    }

    // Obtener una publicación específica por su ID
    async getMostOrderedVariationsRepository(): Promise<OrderWithFullRelations[]> {
        const { data, error } = await this.client
            .from('pedidos')
            .select(`
                    *,
                    detalles_pedidos (
                        *,
                        variaciones (
                            *,
                            variaciones_atributos (
                                *,
                                atributos (
                                    *,
                                    tipos_atributos (*)
                                )
                            )
                        ),
                        productos(*)
                    )
                `)
            .order('fecha_pedido', { ascending: false });

        if (error) {
            console.error('Error fetching most ordered variations:', error);
            throw new Error('Unable to fetch most ordered variations');
        }

        return data || [];
    }


    // Crear una nueva publicación
    async createPublication(publication: Partial<Publication>): Promise<Publication> {
        const { data, error } = await this.client
            .from('publicaciones')
            .insert(publication)
            .select();

        if (error) {
            console.error('Error creating publication:', error);
            throw new Error('Unable to create publication');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0];
    }

    // Actualizar una publicación existente
    async updatePublication(id: number, updates: Partial<Publication>): Promise<Publication> {
        const { data, error } = await this.client
            .from('publicaciones')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating publication:', error);
            throw new Error('Unable to update publication');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0];
    }

    // Eliminar una publicación por su ID
    async deletePublication(id: number): Promise<void> {
        const { error } = await this.client
            .from('publicaciones')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting publication:', error);
            throw new Error('Unable to delete publication');
        }
    }
}
