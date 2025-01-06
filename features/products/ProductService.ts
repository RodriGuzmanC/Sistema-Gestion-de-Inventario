import ProductRepository from "@/data/respositories/ProductRepository";
import { z } from "zod";


export default new class ProductService {
    // Función privada para cargar el stock total de un producto
    private cargarStockTotal(product: ProductWithFullRelations): number {
        let stockTotal = 0;
        // En caso no existan variaciones, el stock total es el stock del producto
        if (!product.variaciones || product.variaciones.length === 0) {
            return stockTotal;
        }
        // Sumar el stock de todas las variaciones  
        product.variaciones.forEach((variacion) => {
            stockTotal += variacion.stock;
        });
        return stockTotal;
    }

    async getAll(pages: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<ProductWithFullRelations>> {
        try {
            // Validar los parámetros de paginación
            if (pages <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }

            // Obtener todos los productos (sin paginación)
            const allProducts = await ProductRepository.getProducts(pages, itemsPerPage);

            // Cargar el stock total de los productos teniendo en cuenta sus variaciones
            allProducts.data.map((product) => {
                const stockTotal = this.cargarStockTotal(product);
                product.stock = stockTotal;

                // Coloca el placeholder en caso de que la URL de la imagen esté vacía
                if (product.url_imagen == null) {
                    product.url_imagen = '/images/product-placeholder.jpg';
                }
            });

            // Retornar la respuesta con la paginación
            return allProducts;
        } catch (error: any) {
            console.error('Error in ProductService:', error.message);
            throw new Error('No se obtuvieron los productos, intenta más tarde.');
        }
    }

    // Obtener un producto específico por su ID
    async getOne(id: number): Promise<DataResponse<ProductWithFullRelations> | null> {
        try {
            // Llama al repositorio para obtener un producto por su ID
            const res = await ProductRepository.getProductWithRelations(id);

            const product = res.data;
            // Cargar el stock total del producto teniendo en cuenta sus variaciones
            const stockTotal = this.cargarStockTotal(product)
            product.stock = stockTotal
            // Coloca el placeholder en caso de null
            if (product.url_imagen == null) {
                product.url_imagen = '/images/product-placeholder.jpg'
            }

            return res
        } catch (error: any) {
            console.error('Error in ProductService:', error.message);
            throw new Error('El producto no existe o no se pudo obtener.');
        }
    }



    // Crear un nuevo producto
    async create(product: Partial<Product>): Promise<DataResponse<Product>> {
        try {
            // Llama al repositorio para crear un nuevo producto
            const res = await ProductRepository.createProduct(product);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el producto, intenta más tarde.');
        }
    }

    // Actualizar un producto existente
    async update(id: number, updates: Partial<Product>): Promise<DataResponse<Product>> {
        try {

            // Llama al repositorio para actualizar el producto
            const res = await ProductRepository.updateProduct(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar el producto, intenta más tarde.');
        }
    }

    // Eliminar un producto
    async delete(id: number): Promise<DataResponse<Product>> {
        try {
            // Llama al repositorio para eliminar el producto
            const res = await ProductRepository.deleteProduct(id);
            return res;
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            throw new Error('Error al eliminar el producto, intenta más tarde.');
        }
    }
}
