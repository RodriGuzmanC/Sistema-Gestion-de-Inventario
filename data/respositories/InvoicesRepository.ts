// GalleryRepository.ts
import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class InvoicesRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    async getInvoices(): Promise<Invoice[]> {
        const { data, error } = await this.client
            .from('boletas')
            .select('*');

        if (error) {
            console.error('Error fetching invoices:', error);
            throw new Error('Unable to fetch invoices');
        }
        return data || [];
    }

    async getInvoice(id: number): Promise<Invoice | null> {
        const { data, error } = await this.client
            .from('boletas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching invoice:', error);
            throw new Error('Unable to fetch invoice');
        }
        return data || null;
    }

    async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
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
        return data[0];
    }

    async updateInvoice(id: number, updates: Partial<Invoice>): Promise<Invoice> {
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
        return data[0];
    }

    async deleteInvoice(id: number): Promise<void> {
        const { error } = await this.client
            .from('boletas')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting invoice:', error);
            throw new Error('Unable to delete invoice');
        }
    }

    async getInvoiceWithDetailsByClient(clientId: number): Promise<InvoiceOrder[]> {
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
            .single();;

        if (error) {
            console.error('Error fetching invoice with details:', error);
            throw new Error('Unable to fetch invoice with details');
        }
        return data || [];
    }
}