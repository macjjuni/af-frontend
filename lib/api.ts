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
 * @param timeout - 타임아웃 시간 (밀리초, 기본값: 30초)
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { timeout?: number },
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('일일 이용 한도(10회)를 초과했습니다.');
      }
      throw new Error(`서버 오류 (${response.status})`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }
    throw error;
  }
}
