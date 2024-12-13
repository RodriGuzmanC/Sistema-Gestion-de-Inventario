import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default class UserRepository {
    private client: SupabaseClient;

    constructor() {
        this.client = createSupabaseClient();
    }

    // Obtener todos los usuarios
    async getUsers(): Promise<User[]> {
        const { data, error } = await this.client
            .from('usuarios')
            .select('*');

        if (error) {
            console.error('Error fetching users:', error);
            throw new Error('Unable to fetch users');
        }
        return data || [];
    }

    // Obtener un usuario específico por su ID
    async getUser(id: number): Promise<User | null> {
        const { data, error } = await this.client
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            throw new Error('Unable to fetch user');
        }
        return data || null;
    }

    // Obtener un usuario por su email
    async getUserByEmail(email: string): Promise<User | null> {
        const { data, error } = await this.client
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error fetching user by email:', error);
            throw new Error('Unable to fetch user by email');
        }
        return data || null;
    }

    // Crear un nuevo usuario
    async createUser(user: User): Promise<User> {
        const { data, error } = await this.client
            .from('usuarios')
            .insert(user)
            .single();

        if (error) {
            console.error('Error creating user:', error);
            throw new Error('Unable to create user');
        }
        return data;
    }

    // Actualizar un usuario existente
    async updateUser(id: number, updates: Partial<User>): Promise<User> {
        const { data, error } = await this.client
            .from('usuarios')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error updating user:', error);
            throw new Error('Unable to update user');
        }
        return data;
    }

    // Eliminar un usuario por su ID
    async deleteUser(id: number): Promise<void> {
        const { error } = await this.client
            .from('usuarios')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting user:', error);
            throw new Error('Unable to delete user');
        }
    }
}
