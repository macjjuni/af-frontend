import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

// region [types]
interface ShouldShowAdsResponse {
  isShowAds: boolean;
}
// endregion

// region [Transactions]
async function fetchShouldShowAds(): Promise<ShouldShowAdsResponse> {
  return apiFetch<ShouldShowAdsResponse>('/api/v1/ads/should-show');
}
// endregion

export function useShouldShowAds() {
  return useQuery({
    queryKey: ['ads', 'should-show'],
    queryFn: fetchShouldShowAds,
    enabled: false, // 자동 호출 방지 (수동으로 refetch 호출 시에만 실행)
    staleTime: 0, // 캐싱 없이 항상 최신 상태 확인 (광고는 수익에 직결)
  });
}
