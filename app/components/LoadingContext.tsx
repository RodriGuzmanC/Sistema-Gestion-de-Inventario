'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definir el tipo de nuestro contexto
interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Valor por defecto para el contexto
const defaultContextValue: LoadingContextType = {
  loading: false,
  setLoading: () => {}, // Placeholder, ya que el setLoading será proporcionado por el provider
};

// Crear el contexto de carga
const LoadingContext = createContext<LoadingContextType>(defaultContextValue);

// Hook para usar el contexto
export const useLoading = () => useContext(LoadingContext);

// Proveedor de carga
interface LoadingProviderProps {
  children: ReactNode;
}


export default function LoadingProvider({children} : LoadingProviderProps) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
      <LoadingContext.Provider value={{ loading, setLoading }}>
        {children}
      </LoadingContext.Provider>
    );
}
