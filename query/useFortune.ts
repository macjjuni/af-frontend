import { useMutation } from '@tanstack/react-query';
import Constants from 'expo-constants';

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

// 환경변수에서 API URL 가져오기 (빌드 시점에 주입됨)
// 우선순위: EXPO_PUBLIC_API_URL > Constants.extra.apiUrl > 폴백
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'https://af-fortune-api-301118051125.asia-northeast3.run.app';

console.log('[Fortune API] API_URL:', API_URL);

// region [Transactions]
async function fetchFortune(payload: FortunePayload): Promise<FortuneResponse> {
  const response = await fetch(`${API_URL}/api/v1/fortune`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error('일일 이용 한도(5회)를 초과했습니다.');
    throw new Error(`서버 오류 (${response.status})`);
  }

  return response.json();
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
