import { SWRConfiguration } from 'swr';

export const swrSettings: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
};