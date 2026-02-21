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
    staleTime: 1000 * 60 * 5, // 5분 캐싱 (자주 변하지 않음)
  });
  // endregion

  return query;
}
