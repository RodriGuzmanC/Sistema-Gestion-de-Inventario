// categoryService.ts

import InvoicesRepository from "@/data/respositories/InvoicesRepository";


// Servicio
export default new class InvoiceService {
    // Obtener todas las facturas
    async getAll(pages: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<Invoice>> {
        try {
            // Validar los parámetros de paginación
            if (pages <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }
            return await InvoicesRepository.getInvoices(pages, itemsPerPage); // Llamamos al repositorio para obtener las facturas
        } catch (error: any) {
            console.error('Error in InvoiceService:', error.message);
            throw new Error('No se obtuvieron las facturas, intenta más tarde.');
        }
    }

    // Obtener una factura específica por su ID
    async getOne(id: number): Promise<DataResponse<Invoice>> {
        try {
            // Llamamos al repositorio para obtener la factura por su ID
            return await InvoicesRepository.getInvoice(id);
        } catch (error: any) {
            console.error('Error in InvoiceService:', error.message);

            throw new Error('La factura no existe o no se pudo obtener.');
        }
    }

    // Crear una nueva factura
    async create(invoice: Partial<Invoice>): Promise<DataResponse<Invoice>> {
        try {
            // Llamamos al repositorio para crear la nueva factura
            const res = await InvoicesRepository.createInvoice(invoice);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear la factura, intenta más tarde.');
        }
    }

    // Actualizar una factura existente
    async update(id: number, updates: Partial<Invoice>): Promise<DataResponse<Invoice>> {
        try {
            // Llamamos al repositorio para actualizar la factura
            const res = await InvoicesRepository.updateInvoice(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar la factura, intenta más tarde.');
        }
    }

    // Eliminar una factura
    async delete(id: number): Promise<DataResponse<Invoice>> {
        try {
            // Llamamos al repositorio para eliminar la factura
            const res = await InvoicesRepository.deleteInvoice(id);
            return res;
        } catch (error: any) {
            console.error('Error in delete:', error);
            throw new Error('Error al eliminar la factura, intenta más tarde.');
        }
    }
}
