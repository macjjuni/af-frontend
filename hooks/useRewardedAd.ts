import { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS ?? TestIds.REWARDED,
      android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID ?? TestIds.REWARDED,
    }) ?? TestIds.REWARDED

/**
 * 리워드 광고 훅
 * 컴포넌트별로 독립적인 광고 인스턴스를 관리합니다.
 */
export function useRewardedAd() {
  // region [hooks]
  const adRef = useRef<RewardedAd | null>(null)
  const [adLoaded, setAdLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const callbackRef = useRef<(() => void) | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    console.log('[useRewardedAd] 광고 인스턴스 생성', { adUnitId, __DEV__ })

    // 광고 인스턴스 생성
    adRef.current = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })

    // LOADED 이벤트
    const unsubscribeLoaded = adRef.current.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('[useRewardedAd] 광고 로드 완료', {
        timestamp: Date.now(),
        hasCallback: !!callbackRef.current,
      })
      setAdLoaded(true)
      setIsLoading(false)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // 로드 완료 후 콜백이 있으면 즉시 표시
      if (callbackRef.current) {
        console.log('[useRewardedAd] 광고 표시')
        adRef.current?.show()
      }
    })

    // EARNED_REWARD 이벤트
    const unsubscribeEarned = adRef.current.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      console.log('[useRewardedAd] 보상 획득', {
        timestamp: Date.now(),
        hasCallback: !!callbackRef.current,
      })

      if (callbackRef.current) {
        console.log('[useRewardedAd] 콜백 실행 시작')
        callbackRef.current()
        console.log('[useRewardedAd] 콜백 실행 완료')
      }

      callbackRef.current = null
    })

    // CLOSED 이벤트
    const unsubscribeClosed = adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[useRewardedAd] 광고 닫힘', {
        timestamp: Date.now(),
        hadCallback: !!callbackRef.current,
      })

      setAdLoaded(false)
      setIsLoading(false)
      callbackRef.current = null // 자동 재표시 방지

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    })

    // ERROR 이벤트
    const unsubscribeError = adRef.current.addAdEventListener(AdEventType.ERROR, (error: Error) => {
      console.error('[useRewardedAd] 광고 에러', {
        message: error.message,
        timestamp: Date.now(),
      })

      setAdLoaded(false)
      setIsLoading(false)

      // 에러 발생 시 광고 없이 콜백 실행
      if (callbackRef.current) {
        console.warn('[useRewardedAd] 광고 에러, 광고 없이 진행')
        callbackRef.current()
        callbackRef.current = null
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    })

    return () => {
      unsubscribeLoaded()
      unsubscribeEarned()
      unsubscribeClosed()
      unsubscribeError()

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  // endregion

  // region [Events]
  function showAd(onRewarded: () => void) {
    console.log('[useRewardedAd] showAd 호출', {
      adLoaded,
      isLoading,
      timestamp: Date.now(),
    })

    callbackRef.current = onRewarded

    if (adLoaded) {
      console.log('[useRewardedAd] 광고 표시 시도')
      adRef.current?.show()
    } else if (!isLoading) {
      console.log('[useRewardedAd] 광고 로딩 시작')
      setIsLoading(true)
      adRef.current?.load()

      // 5초 타임아웃
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        if (!adLoaded && callbackRef.current) {
          console.warn('[useRewardedAd] 광고 로드 타임아웃, 광고 없이 진행')
          callbackRef.current()
          callbackRef.current = null
          setIsLoading(false)
        }
      }, 5000)
    }
  }
  // endregion

  return { showAd, adLoaded }
}
