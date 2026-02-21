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
  // region [hooks]
  const query = useQuery({
    queryKey: ['ads', 'should-show'],
    queryFn: fetchShouldShowAds,
    staleTime: 0, // 캐싱 없이 항상 최신 상태 확인 (광고는 수익에 직결)
  });
  // endregion

  return query;
}
