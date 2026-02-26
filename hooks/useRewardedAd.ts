import { useRewardedAdContext } from '@/providers'

/**
 * 리워드 광고 훅
 * RewardedAdProvider에서 전역으로 관리되는 광고 인스턴스를 사용합니다.
 */
export function useRewardedAd() {
  return useRewardedAdContext()
}
