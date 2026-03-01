import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

// region [types]
export interface PromptTemplate {
  promptTemplateId: number;
  isSolo: boolean;
  title: string;
  description: string;
  parentId: string;
}

interface TemplateListResponse {
  templates: PromptTemplate[];
}
// endregion

// region [Transactions]
async function fetchTemplates(categoryId?: string): Promise<TemplateListResponse> {
  const url = categoryId ? `/api/v1/fortune/templates?c=${categoryId}` : '/fortune/templates';
  return apiFetch<TemplateListResponse>(url);
}
// endregion

export function useTemplates(categoryId?: string) {
  return useQuery({
    queryKey: ['fortune', 'templates', categoryId],
    queryFn: () => fetchTemplates(categoryId),
    staleTime: 1000 * 60 * 30,    // 30분
    gcTime: 1000 * 60 * 60,      // 1시간 (카테고리 간 이동 시 캐시 유지)
  });
}
