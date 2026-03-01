import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,    // 30분 (기본 5분 → 상향)
      refetchOnWindowFocus: false, // RN은 window 개념 없음 (AppState로 별도 관리)
    },
    mutations: { retry: 0 },
  },
});

type QueryProviderProps = {
  children: ReactNode;
};

export default function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
