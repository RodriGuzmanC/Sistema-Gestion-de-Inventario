import AttributeTypesRepository from "@/data/respositories/AttributeTypesRepository";
import { z } from "zod";


const baseSchema = {
    nombre: z.string().min(1, "Nombre es requerido").max(255, "Nombre es demasiado largo"),
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

export default new class AttibuteTypesService {
    async getAll(): Promise<AttributeType[]> {
        try {
            return await AttributeTypesRepository.getAttributeTypes();
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('No se obtuvieron los registros, intentalo mas tarde.');
        }
    }

    async getOne(id: number): Promise<AttributeType | null> {
        try {
            // Validacion de los datos
            idValidateSchema.parse({ id });

            return await AttributeTypesRepository.getAttributeType(id);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El tipo de atributo no existe.');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            // Validacion de los datos
            idValidateSchema.parse({ id });

            // Llamada al repositorio y logica de negocio
            return await AttributeTypesRepository.deleteAttributeType(id);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar, intentalo mas tarde.');
        }
    }

    async update(id: number, updates: Partial<AttributeType>): Promise<AttributeType> {
        try {
            // Validacion de los datos
            updateSchema.parse({ id, ...updates });

            // Llamada al repositorio y logica de negocio
            const res = await AttributeTypesRepository.updateAttributeType(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar, intentalo mas tarde.');
        }
    }

    async create(attributeType: Partial<AttributeType>): Promise<AttributeType> {
        try {
            // Validacion de los datos
            createSchema.parse({ ...attributeType });

            // Llamada al repositorio y logica de negocio
            const res = await AttributeTypesRepository.createAttributeType(attributeType);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear, intentalo mas tarde.');
        }
    }

    // Otros métodos...
}

