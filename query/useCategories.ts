import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

// region [types]
export interface FortuneCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface CategoryListResponse {
  categories: FortuneCategory[];
}
// endregion

// region [Transactions]
async function fetchCategories(): Promise<CategoryListResponse> {
  return apiFetch<CategoryListResponse>('/api/v1/fortune/categories');
}
// endregion

export function useCategories() {
  return useQuery({
    queryKey: ['fortune', 'categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,       // 1시간 (정적 데이터)
    gcTime: 1000 * 60 * 60 * 24,    // 24시간
    retry: 2,
  });
}
