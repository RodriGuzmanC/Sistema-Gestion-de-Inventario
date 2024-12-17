'use client';
import { useLoading } from '@/app/components/LoadingContext';
import { toast } from 'sonner';

export const executeAsyncFunction = async (
  asyncFunction: () => Promise<any>
) => {
  const { setLoading } = useLoading();

  try {
    // Mostrar la pantalla de carga
    setLoading(true);

    // Ejecutar la función asincrónica
    const result = await asyncFunction();

    // Terminar la pantalla de carga
    setLoading(false);
    return result;
  } catch (error) {
    // Terminar la pantalla de carga
    setLoading(false);

    // Mostrar el error con Sonner
    toast.error(error instanceof Error ? error.message : 'Ha ocurrido un error');
  }
};
