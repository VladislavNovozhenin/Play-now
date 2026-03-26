import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';

type QueryProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
