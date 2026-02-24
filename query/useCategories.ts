import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import useAppStore from '@/store/useAppStore';

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
  // region [hooks]
  const showGlobalLoading = useAppStore((s) => s.showGlobalLoading);
  const hideGlobalLoading = useAppStore((s) => s.hideGlobalLoading);
  const query = useQuery({
    queryKey: ['fortune', 'categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30분 (카테고리는 자주 변경되지 않음)
  });
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (query.isLoading) {
      showGlobalLoading('카테고리를 불러오는 중...');
    } else {
      hideGlobalLoading();
    }
  }, [query.isLoading, showGlobalLoading, hideGlobalLoading]);
  // endregion

  return query;
}
