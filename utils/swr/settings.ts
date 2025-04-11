import { SWRConfiguration } from 'swr';

export const swrSettings: SWRConfiguration = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
};