

import { SupabaseClient } from '@supabase/supabase-js';

class ProductRepository {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getProducts(): Promise<any[]> {
    const { data, error } = await this.client
      .from('productos')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Unable to fetch products');
    }

    return data || [];
  }

  async getProductById(productId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('productos')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error(`Unable to fetch product with ID ${productId}`);
    }

    return data;
  }

  async createProduct(productData: Record<string, any>): Promise<any> {
    const { data, error } = await this.client
      .from('productos')
      .insert([productData])
      .select(); // Devuelve el producto creado

    if (error) {
      console.error('Error creating product:', error.message, error.details, error.hint);
      throw new Error(`Unable to create product: ${error.message}`);
    }

    return data[0]; // Retorna el primer producto creado
  }

  async updateProduct(productId: string, productData: Record<string, any>): Promise<any> {
    const { data, error } = await this.client
      .from('productos')
      .update(productData)
      .eq('id', productId)
      .select(); // Devuelve el producto actualizado

    if (error) {
      console.error('Error updating product:', error);
      throw new Error(`Unable to update product with ID ${productId}`);
    }

    return data[0]; // Retorna el producto actualizado
  }

  async deleteProduct(productId: string): Promise<any> {
    const { data, error } = await this.client
      .from('productos')
      .delete()
      .eq('id', productId)
      .select(); // Devuelve el producto eliminado

    if (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Unable to delete product with ID ${productId}`);
    }

    return data[0]; // Retorna el producto eliminado
  }
}

export default ProductRepository;
