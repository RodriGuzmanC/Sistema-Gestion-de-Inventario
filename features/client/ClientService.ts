import ClientRepository from "@/data/respositories/ClientRepository";
import { z } from "zod";


export default new class ClientService {
    // Obtener todos los usuarios
    async getAll(): Promise<Client[]> {
        try {
            return await ClientRepository.getClients();
        } catch (error: any) {
            console.error('Error in ClientService:', error.message);
            throw new Error('No se obtuvieron los usuarios, intenta más tarde.');
        }
    }

    // Obtener un usuario por ID
    async getOne(id: number): Promise<Client | null> {
        try {

            return await ClientRepository.getClient(id);
        } catch (error: any) {
            console.error('Error in ClientService:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('El usuario no existe o no se pudo obtener.');
        }
    }

    // Crear un nuevo usuario
    async create(Client: Partial<Client>): Promise<Client> {
        try {


            return await ClientRepository.createClient(Client);
        } catch (error) {
            console.error('Error in create:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al crear el cliente, intenta más tarde.');
        }
    }

    // Actualizar un usuario existente
    async update(id: number, updates: Partial<Client>): Promise<Client> {
        try {


            return await ClientRepository.updateClient(id, updates);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al actualizar el cliente, intenta más tarde.');
        }
    }

    // Eliminar un usuario
    async delete(id: number): Promise<void> {
        try {

            await ClientRepository.deleteClient(id);
        } catch (error: any) {
            console.error('Error in delete:', error.message);
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error('Error al eliminar el cliente, intenta más tarde.');
        }
    }
}
