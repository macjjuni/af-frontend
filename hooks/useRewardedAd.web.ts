// Web용 더미 광고 훅 (네이티브 광고는 웹에서 지원하지 않음)
export function useRewardedAd() {
  return {
    adLoaded: false,
    adError: null,
    showAd: (onRewarded: () => void) => {
      // 웹에서는 광고 없이 바로 콜백 실행
      console.log('[useRewardedAd.web] 웹 플랫폼에서는 광고를 지원하지 않습니다. 광고 없이 진행합니다.')
      onRewarded()
    },
  }
}
