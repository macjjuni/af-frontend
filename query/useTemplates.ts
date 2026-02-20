import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

// region [types]
export interface PromptTemplate {
  promptTemplateId: number;
  buttonText: string;
  template: string;
}

interface TemplateListResponse {
  templates: PromptTemplate[];
}
// endregion

// region [Transactions]
async function fetchTemplates(): Promise<TemplateListResponse> {
  return apiFetch<TemplateListResponse>('/api/v1/templates');
}
// endregion

export function useTemplates() {
  // region [hooks]
  const query = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    staleTime: 1000 * 60 * 10,
  });
  // endregion

  return query;
}
