import UserRepository from "@/data/respositories/UserRepository";

export default new class UserService {
    // Obtener todos los usuarios
    async getAll(): Promise<User[]> {
        try {
            return await UserRepository.getUsers();
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in UserService:', error.message);
            }
            throw new Error('No se obtuvieron los usuarios, intenta más tarde.');
        }
    }

    // Obtener un usuario por ID
    async getOne(id: number): Promise<User | null> {
        try {

            return await UserRepository.getUser(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in UserService:', error.message);
            }
            throw new Error('El usuario no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo usuario
    async create(user: Partial<User>): Promise<User> {
        try {

            return await UserRepository.createUser(user);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in UserService:', error.message);
            }
            throw new Error('Error al crear el usuario, intenta más tarde.');
        }
    }

    // Actualizar un usuario existente
    async update(id: number, updates: Partial<User>): Promise<User> {
        try {

            return await UserRepository.updateUser(id, updates);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in UserService:', error.message);
            }
            throw new Error('Error al actualizar el usuario, intenta más tarde.');
        }
    }

    // Eliminar un usuario
    async delete(id: number): Promise<void> {
        try {

            await UserRepository.deleteUser(id);
        } catch (error) {
            if(error instanceof Error) {
                console.error('Error in UserService:', error.message);
            }
            throw new Error('Error al eliminar el usuario, intenta más tarde.');
        }
    }
}
