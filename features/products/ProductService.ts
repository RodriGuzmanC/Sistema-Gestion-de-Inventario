import ProductRepository from "@/data/respositories/ProductRepository";
import { z } from "zod";


export default new class ProductService {
    // Obtener todos los productos
    private cargarStockTotal(product: ProductWithBasicRelations): number {
        let stockTotal = 0;
        product.variaciones.forEach((variacion) => {
            stockTotal += variacion.stock;
        });
        return stockTotal;
    }

    async getAll(pagina: number = 1, itemsPorPagina: number = 10): Promise<PaginatedResponse<ProductWithBasicRelations>> {
        try {
            // Validar los parámetros de paginación
            if (pagina <= 0 || itemsPorPagina <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }

            // Obtener todos los productos (sin paginación)
            const allProducts = await ProductRepository.getProducts();

            // Cargar el stock total de los productos teniendo en cuenta sus variaciones
            allProducts.map((product) => {
                const stockTotal = this.cargarStockTotal(product);
                product.stock = stockTotal;

                // Coloca el placeholder en caso de que la URL de la imagen esté vacía
                if (product.url_imagen == null) {
                    product.url_imagen = '/images/product-placeholder.jpg';
                }
            });

            // Calcular el total de productos
            const totalItems = allProducts.length;

            // Calcular el total de páginas
            const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

            // Calcular los productos para la página solicitada
            const startIndex = (pagina - 1) * itemsPorPagina;
            const endIndex = startIndex + itemsPorPagina;
            const productsOnPage = allProducts.slice(startIndex, endIndex);

            const paginacion: PaginatedResponse<ProductWithBasicRelations> = {
                data: productsOnPage,
                paginacion: {
                    pagina_actual: pagina,
                    total_items: totalItems,
                    items_por_pagina: itemsPorPagina,
                    total_paginas: totalPaginas,
                },
            }
            // Retornar la respuesta con la paginación
            return paginacion;
        } catch (error: any) {
            console.error('Error in ProductService:', error.message);
            throw new Error('No se obtuvieron los productos, intenta más tarde.');
        }
    }

    // Obtener un producto específico por su ID
    async getOne(id: number): Promise<ProductWithFullRelations | null> {
        try {

            // Llama al repositorio para obtener un producto por su ID
            const product = await ProductRepository.getProductWithRelations(id);
            // Cargar el stock total del producto teniendo en cuenta sus variaciones
            const stockTotal = this.cargarStockTotal(product)
            product.stock = stockTotal
            // Coloca el placeholder en caso de null
            if (product.url_imagen == null) {
                product.url_imagen = '/images/product-placeholder.jpg'
            }

            return product
        } catch (error: any) {
            console.error('Error in ProductService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El producto no existe o no se pudo obtener.');
        }
    }



    // Crear un nuevo producto
    async create(product: Partial<Product>): Promise<Product> {
        try {

            // Llama al repositorio para crear un nuevo producto
            const res = await ProductRepository.createProduct(product);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el producto, intenta más tarde.');
        }
    }

    // Actualizar un producto existente
    async update(id: number, updates: Partial<Product>): Promise<Product> {
        try {
            // Validar los datos de entrada con el esquema de actualización
            //updateSchema.parse({ id, ...updates });

            // Llama al repositorio para actualizar el producto
            const res = await ProductRepository.updateProduct(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el producto, intenta más tarde.');
        }
    }

    // Eliminar un producto
    async delete(id: number): Promise<void> {
        try {

            // Llama al repositorio para eliminar el producto
            await ProductRepository.deleteProduct(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el producto, intenta más tarde.');
        }
    }
}
