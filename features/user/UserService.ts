import UserRepository from "@/data/respositories/UserRepository";
import { z } from "zod";

const baseSchema = {
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre es demasiado largo"),

    correo: z.string()
        .email("El correo debe tener un formato válido"),

    contraseña: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(255, "La contraseña es demasiado larga"),

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

export default new class UserService {
    // Obtener todos los usuarios
    async getAll(): Promise<User[]> {
        try {
            return await UserRepository.getUsers();
        } catch (error: any) {
            console.error('Error in UserService:', error.message);
            throw new Error('No se obtuvieron los usuarios, intenta más tarde.');
        }
    }

    // Obtener un usuario por ID
    async getOne(id: number): Promise<User | null> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            return await UserRepository.getUser(id);
        } catch (error: any) {
            console.error('Error in UserService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El usuario no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo usuario
    async create(user: Partial<User>): Promise<User> {
        try {
            // Validar los datos de entrada
            createSchema.parse({ ...user });

            return await UserRepository.createUser(user);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el usuario, intenta más tarde.');
        }
    }

    // Actualizar un usuario existente
    async update(id: number, updates: Partial<User>): Promise<User> {
        try {
            // Validar los datos de entrada
            updateSchema.parse({ id, ...updates });

            return await UserRepository.updateUser(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el usuario, intenta más tarde.');
        }
    }

    // Eliminar un usuario
    async delete(id: number): Promise<void> {
        try {
            // Validar el ID
            idValidateSchema.parse({ id });

            await UserRepository.deleteUser(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el usuario, intenta más tarde.');
        }
    }
}
