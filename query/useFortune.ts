import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import useAppStore from '@/store/useAppStore';

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
  const showGlobalLoading = useAppStore((s) => s.showGlobalLoading);
  const hideGlobalLoading = useAppStore((s) => s.hideGlobalLoading);
  const mutation = useMutation({
    mutationFn: fetchFortune,
    retry: 0, // 운세 분석은 쿼터 차감 API — 재시도 절대 불가
  });
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (mutation.isPending) {
      showGlobalLoading('AI 분석 중... (약 1분 소요)');
    } else {
      hideGlobalLoading();
    }
  }, [mutation.isPending, showGlobalLoading, hideGlobalLoading]);
  // endregion

  return mutation;
}
