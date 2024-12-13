import { z } from 'zod';

export const productSchema = z.object({
    nombre_producto: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().min(1, "La descripción es obligatoria"),
    precio_unitario: z.string().transform((val) => parseFloat(val)).refine(val => !isNaN(val), {
        message: "Precio mínimo debe ser un número",
    }),
    precio_mayorista: z.string().transform((val) => parseFloat(val)).refine(val => !isNaN(val), {
        message: "Precio máximo debe ser un número",
    }),
    estado_producto_id: z.string().min(1, "El estado es obligatorio"),
});

export const variationSchema = z.object({
    producto_id: z.string().min(1, "El id es obligatorio"),
    precio_unitario: z.string().transform((val) => parseFloat(val)).refine(val => !isNaN(val), {
        message: "Precio mínimo debe ser un número",
    }),
    precio_mayorista: z.string().transform((val) => parseFloat(val)).refine(val => !isNaN(val), {
        message: "Precio máximo debe ser un número",
    }),
    stock: z.string().min(1, "El stock es obligatorio"),
});