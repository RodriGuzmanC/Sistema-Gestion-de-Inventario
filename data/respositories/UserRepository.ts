import createSupabaseClient from '@/utils/dbClient';
import { SupabaseClient } from '@supabase/supabase-js';

export default new class UserRepository {
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
            .eq('correo', email)
            .single();

        if (error) {
            console.error('Error fetching user by email:', error);
            throw new Error('Unable to fetch user by email');
        }
        return data || null;
    }

    // Crear un nuevo usuario
    async createUser(user: Partial<User>): Promise<User> {
        const { data, error } = await this.client
            .from('usuarios')
            .insert(user)
            .select();

        if (error) {
            console.error('Error creating user:', error);
            throw new Error('Unable to create user');
        }
        if (data.length === 0) {
            console.error('No records found to create');
            throw new Error('No records found');
        }
        return data[0]; 
    }

    // Actualizar un usuario existente
    async updateUser(id: number, updates: Partial<User>): Promise<User> {
        const { data, error } = await this.client
            .from('usuarios')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating user:', error);
            throw new Error('Unable to update user');
        }
        if (data.length === 0) {
            console.error('No records found to update');
            throw new Error('No records found');
        }
        return data[0]; 
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
