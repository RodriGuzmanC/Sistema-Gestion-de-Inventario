// GalleryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class InvoicesRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getInvoices(pages: number, itemsPerPage: number): Promise<PaginatedResponse<Invoice>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('boletas')
            .select('*')
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching invoices:', error);
            throw new Error('Unable to fetch invoices');
        }
        // Obtener el total de items
        const { count: totalItems } = await this.client
            .from('boletas')
            .select('*', { count: 'exact' }); // Esto obtiene solo el total sin traer los registros completos
        if (!totalItems){
            throw new Error('Invoices not found'); 
        }

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalItems / itemsPerPage);
        const paginatedData: PaginatedResponse<Invoice> = {
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

    async getInvoice(id: number): Promise<DataResponse<Invoice>> {
        const { data, error } = await this.client
            .from('boletas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching invoice:', error);
            throw new Error('Unable to fetch invoice');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<Invoice> = {
            data: data || null,
        }
        return res;
    }

    async createInvoice(invoice: Partial<Invoice>): Promise<DataResponse<Invoice>> {
        const { data, error } = await this.client
            .from('boletas')
            .insert(invoice)
            .select();

        if (error) {
            console.error('Error creating invoice:', error);
            throw new Error('Unable to create invoice');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<Invoice> = {
            data: data[0] || null,
        }
        return res;
    }

    async updateInvoice(id: number, updates: Partial<Invoice>): Promise<DataResponse<Invoice>> {
        const { data, error } = await this.client
            .from('boletas')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating invoice:', error);
            throw new Error('Unable to update invoice');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        // Lo envolvemos en un DataResponse
        const res: DataResponse<Invoice> = {
            data: data[0] || null,
        }
        return res;
    }

    async deleteInvoice(id: number): Promise<DataResponse<Invoice>> {
        const { data, error } = await this.client
            .from('boletas')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting invoice:', error);
            throw new Error('Unable to delete invoice');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<Invoice> = {
            data: data[0] || null,
        }
        return res;
    }

    async getInvoiceWithDetailsByClient(pages: number, itemsPerPage: number, clientId: number): Promise<PaginatedResponse<InvoiceWithFullRelations>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        const { data, error } = await this.client
            .from('boletas')
            .select(`*, 
                clientes(*),
                boletas_pedidos(*, 
                    pedidos(*, 
                        detalles_pedidos(*, 
                            variaciones(*, 
                                productos(*), 
                                variaciones_atributos(*, 
                                    atributos(*, 
                                        tipos_atributos(*)
                                    )
                                )
                            )
                        )
                    )
                )
                `)
            .eq('id', clientId)
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching invoice with details:', error);
            throw new Error('Unable to fetch invoice with details');
        }

        // Obtener el total de items
        const { count: totalItems } = await this.client
            .from('boletas')
            .select('*', { count: 'exact' }); // Esto obtiene solo el total sin traer los registros completos
        if (!totalItems){
            throw new Error('Invoices not found'); 
        }

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalItems / itemsPerPage);
        const paginatedData: PaginatedResponse<InvoiceWithFullRelations> = {
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
}