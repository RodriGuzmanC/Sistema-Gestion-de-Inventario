import ProductRepository from "@/data/respositories/ProductRepository";
import { z } from "zod";



// Esquemas ZOD para validar
const baseSchema = {
    nombre_producto: z.string()
        .min(1, "El nombre del producto es requerido")
        .max(255, "El nombre del producto es demasiado largo"),

    descripcion: z.string()
        .max(500, "La descripción es demasiado larga").optional(),

    url_imagen: z.string()
        .url("La URL de la imagen debe ser válida")
        .max(255, "La URL de la imagen es demasiado larga").optional(),

    precio_unitario: z.number()
        .min(0, "El precio unitario no puede ser menor a 0")
        .refine((val) => !isNaN(val), {
            message: "El precio unitario debe ser un número válido",
        }),

    precio_mayorista: z.number()
        .min(0, "El precio mayorista no puede ser menor a 0")
        .refine((val) => !isNaN(val), {
            message: "El precio mayorista debe ser un número válido",
        }),

    estado_producto_id: z.number()
        .int("El ID del estado del producto debe ser un número entero")
        .positive("El ID del estado del producto debe ser un número positivo"),

};
const updateSchema = z.object({
    id: z.number({ required_error: "ID es requerido" }).positive("ID debe ser un numero positivo"),
    ...baseSchema,
}).partial();

const idValidateSchema = z.object({
    id: z.number({ required_error: "ID es requerido" }).positive("ID debe ser un numero positivo"),
});

const createSchema = z.object({
    ...baseSchema,
})


export default new class ProductService {
    // Obtener todos los productos
    async getAll(): Promise<Product[]> {
        try {
            return await ProductRepository.getProducts(); // Llama al repositorio para obtener todos los productos
        } catch (error: any) {
            console.error('Error in ProductService:', error.message);
            throw new Error('No se obtuvieron los productos, intenta más tarde.');
        }
    }

    // Obtener un producto específico por su ID
    async getOne(id: number): Promise<Product | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llama al repositorio para obtener un producto por su ID
            return await ProductRepository.getProduct(id);
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
            // Validar los datos de entrada con el esquema de creación
            createSchema.parse({ ...product });

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
            updateSchema.parse({ id, ...updates });

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
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

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
