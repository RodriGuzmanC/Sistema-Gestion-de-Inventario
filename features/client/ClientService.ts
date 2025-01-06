import ClientRepository from "@/data/respositories/ClientRepository";


export default new class ClientService {
    // Obtener todos los usuarios
    async getAll(pages: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<Client>> {
        try {
            // Validar los parámetros de paginación
            if (pages <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }
            return await ClientRepository.getClients(pages, itemsPerPage);
        } catch (error: any) {
            console.error('Error in ClientService:', error.message);
            throw new Error('No se obtuvieron los usuarios, intenta más tarde.');
        }
    }

    // Obtener un usuario por ID
    async getOne(id: number): Promise<DataResponse<Client>> {
        try {

            return await ClientRepository.getClient(id);
        } catch (error: any) {
            console.error('Error in ClientService:', error.message);
            throw new Error('El usuario no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo usuario
    async create(Client: Partial<Client>): Promise<DataResponse<Client>> {
        try {


            return await ClientRepository.createClient(Client);
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el cliente, intenta más tarde.');
        }
    }

    // Actualizar un usuario existente
    async update(id: number, updates: Partial<Client>): Promise<DataResponse<Client>> {
        try {
            return await ClientRepository.updateClient(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar el cliente, intenta más tarde.');
        }
    }

    // Eliminar un usuario
    async delete(id: number): Promise<DataResponse<Client>> {
        try {

            return await ClientRepository.deleteClient(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            throw new Error('Error al eliminar el cliente, intenta más tarde.');
        }
    }
}
