import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class ProductRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los productos
    async getProducts(pages: number, itemsPerPage: number): Promise<PaginatedResponse<ProductWithFullRelations>> {
        // Calcular los índices de paginación
        const startIndex = (pages - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;

        // Obtener los productos con sus relaciones
        const { data, error } = await this.client
            .from('productos')
            .select('*, galerias(*), estados_productos(*), variaciones(*, variaciones_atributos(*, atributos(*, tipos_atributos(*)))), categorias_productos(*, categorias(*)), publicaciones(*, redes(*))')
            .range(startIndex, endIndex); // Paginación


        // Obtener el total de items
        const { count: totalItems } = await this.client
            .from('productos')
            .select('*', { count: 'exact' }); // Esto obtiene solo el total sin traer los registros completos
        if (!totalItems){
            throw new Error('Products not found'); 
        }

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalItems / itemsPerPage);
        const paginatedData: PaginatedResponse<ProductWithFullRelations> = {
            data: data || [],
            paginacion: {
                pagina_actual: pages,
                total_items: totalItems,
                items_por_pagina: itemsPerPage,
                total_paginas: totalPaginas,
            },
        };

        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Unable to fetch products');
        }
        return paginatedData;
    }

    // Obtener todos los productos
    async getProductWithRelations(id: number): Promise<DataResponse<ProductWithFullRelations>> {
        const { data, error } = await this.client
            .from('productos')
            .select('*, galerias(*), estados_productos(*), variaciones(*, variaciones_atributos(*, atributos(*, tipos_atributos(*)))), categorias_productos(*, categorias(*)), publicaciones(*, redes(*))')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            throw new Error('Unable to fetch product');
        }

        // Lo envolvemos en un DataResponse
        const res: DataResponse<ProductWithFullRelations> = {
            data: data || null,
        }
        return res;
    }

    // Crear un nuevo producto
    async createProduct(product: Partial<Product>): Promise<DataResponse<Product>> {
        const { data, error } = await this.client
            .from('productos')
            .insert(product)
            .select();

        if (error) {
            console.error('Error creating product:', error);
            throw new Error('Unable to create product');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        const res: DataResponse<Product> = {
            data: data[0] || null,
        }
        return res;
    }

    // Actualizar un producto existente
    async updateProduct(id: number, updates: Partial<Product>): Promise<DataResponse<Product>> {
        const { data, error } = await this.client
            .from('productos')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating product:', error);
            throw new Error('Unable to update product');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        const res: DataResponse<Product> = {
            data: data[0] || null,
        }
        return res;
    }

    // Eliminar un producto por su ID
    async deleteProduct(id: number): Promise<DataResponse<Product>> {
        const { data, error } = await this.client
            .from('productos')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting product:', error);
            throw new Error('Unable to delete product');
        }
        const res: DataResponse<Product> = {
            data: data[0] || null,
        }
        return res;
    }
}
