import { useQuery } from '@tanstack/react-query';

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

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

// region [Transactions]
async function fetchTemplates(): Promise<TemplateListResponse> {
  const response = await fetch(`${API_URL}/api/v1/templates`);
  if (!response.ok) throw new Error(`서버 오류 (${response.status})`);
  return response.json();
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
