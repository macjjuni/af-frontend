import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';

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

// 환경변수에서 API URL 가져오기 (빌드 시점에 주입됨)
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'https://af-fortune-api-301118051125.asia-northeast3.run.app';

console.log('[Templates API] API_URL:', API_URL);

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
