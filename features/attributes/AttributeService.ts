import AttributeRepository from "@/data/respositories/AttributeRepository";
import { z } from "zod";

// Esquemas ZOD para validar
const baseSchema = {
    valor: z.string().min(1, "El valor es requerido").max(255, "El valor es demasiado largo"),
    tipo_atributo_id: z.number({ required_error: "Id del tipo de atributo es requerido" }).positive("Id del tipo de atributo debe ser un numero positivo"),

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
});


// Servicio
export default new class AttributeService {
    // Obtener todos los atributos
    async getAll(): Promise<Attribute[]> {
        try {
            return await AttributeRepository.getAttributes(); // Llamamos al repositorio para obtener los atributos
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('No se obtuvieron los atributos, intentalo más tarde.');
        }
    }

    // Obtener un atributo específico por su ID
    async getOne(id: number): Promise<Attribute | null> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para obtener el atributo por su ID
            return await AttributeRepository.getAttribute(id);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El atributo no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo atributo
    async create(attribute: Partial<Attribute>): Promise<Attribute> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...attribute });

            // Llamamos al repositorio para crear el nuevo atributo
            const res = await AttributeRepository.createAttribute(attribute);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el atributo, intenta más tarde.');
        }
    }

    // Actualizar un atributo existente
    async update(id: number, updates: Partial<Attribute>): Promise<Attribute> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            // Llamamos al repositorio para actualizar el atributo
            const res = await AttributeRepository.updateAttribute(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el atributo, intenta más tarde.');
        }
    }

    // Eliminar un atributo
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID de entrada
            idValidateSchema.parse({ id });

            // Llamamos al repositorio para eliminar el atributo
            await AttributeRepository.deleteAttribute(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el atributo, intenta más tarde.');
        }
    }
}
