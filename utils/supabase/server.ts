import { createServerClient, type CookieOptions  } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js"; // Importar desde @supabase/supabase-js
import { cookies } from "next/headers";

// Métodos para interactuar con la base de datos


export const createVariation = async (client: SupabaseClient, variationData: Object) => {
  const { data, error } = await client
    .from('variaciones')
    .insert([variationData]); // Inserta un nuevo producto

  if (error) {
    console.error("Error al crear la variacion:", error.message, error.details, error.hint);
    throw new Error(`No es posible crear la variacion: ${error.message}`);
  }

  return data;
};




/** Atributos */

export const getAttributes = async (client: SupabaseClient) => {
  const { data, error } = await client
    .from('atributos')
    .select('*');

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Unable to fetch products");
  }
  
  return data;
};

export const getValueAttributes = async (client: SupabaseClient, atributteId: number) => {
  const { data, error } = await client
    .from('valores_atributos')
    .select('*')
    .eq('atributo_id', atributteId);
  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Unable to fetch products");
  }
  
  return data;
};