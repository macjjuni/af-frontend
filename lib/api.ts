import Constants from 'expo-constants';

/**
 * API 기본 URL
 * 우선순위: EXPO_PUBLIC_API_URL > Constants.extra.apiUrl > 폴백
 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'https://af-fortune-api-301118051125.asia-northeast3.run.app';

/**
 * API 공통 fetch 함수
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('일일 이용 한도(5회)를 초과했습니다.');
    }
    throw new Error(`서버 오류 (${response.status})`);
  }

  return response.json();
}
