import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

// region [types]
interface FortunePayload {
  chartData: string;
  deviceID: string;
  promptTemplateId: number;
}

interface FortuneResponse {
  result: string;
  remainingQuota: number;
}
// endregion

// region [Transactions]
async function fetchFortune(payload: FortunePayload): Promise<FortuneResponse> {
  return apiFetch<FortuneResponse>('/api/v1/fortune', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeout: 180000, // 3분 (LLM 응답 대기)
  });
}
// endregion

export function useFortune() {
  // region [hooks]
  const mutation = useMutation({
    mutationFn: fetchFortune,
  });
  // endregion

  return mutation;
}
