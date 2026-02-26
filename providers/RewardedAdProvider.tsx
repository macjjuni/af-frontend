import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS ?? TestIds.REWARDED,
      android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID ?? TestIds.REWARDED,
    }) ?? TestIds.REWARDED

interface RewardedAdContextValue {
  adLoaded: boolean
  adError: Error | null
  showAd: (onRewarded: () => void) => void
}

const RewardedAdContext = createContext<RewardedAdContextValue | null>(null)

export function RewardedAdProvider({ children }: { children: React.ReactNode }) {
  // region [hooks]
  const adRef = useRef<RewardedAd>(RewardedAd.createForAdRequest(adUnitId, { requestNonPersonalizedAdsOnly: true }))
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState<Error | null>(null)
  const onRewardedRef = useRef<(() => void) | null>(null)
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // endregion

  // region [Privates]
  function loadAd() {
    setAdLoaded(false)
    setAdError(null)
    adRef.current.load()
  }
  // endregion

  // region [Events]
  function showAd(onRewarded: () => void) {
    onRewardedRef.current = onRewarded

    if (adLoaded) {
      console.log('[RewardedAdProvider] 광고 표시')
      adRef.current.show()
    } else if (adError) {
      // 광고 로드 실패 시에도 콜백 실행 (광고 없이 기능 작동)
      console.warn('[RewardedAdProvider] 광고 로드 실패, 광고 없이 진행:', adError.message)
      onRewarded()
      onRewardedRef.current = null
    } else {
      console.log('[RewardedAdProvider] 광고 로딩 시작')
      loadAd()

      // 5초 타임아웃: 광고 로드가 너무 오래 걸리면 광고 없이 진행
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = setTimeout(() => {
        if (!adLoaded && onRewardedRef.current) {
          console.warn('[RewardedAdProvider] 광고 로드 타임아웃, 광고 없이 진행')
          onRewardedRef.current()
          onRewardedRef.current = null
        }
      }, 5000)
    }
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    const unsubscribeLoaded = adRef.current.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('[RewardedAdProvider] 광고 로드 완료')
      setAdLoaded(true)
      setAdError(null)
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    })

    const unsubscribeEarned = adRef.current.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      console.log('[RewardedAdProvider] 보상 획득')
      onRewardedRef.current?.()
      onRewardedRef.current = null
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    })

    const unsubscribeClosed = adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[RewardedAdProvider] 광고 닫힘, 재로딩')
      setAdLoaded(false)
      loadAd()
    })

    const unsubscribeError = adRef.current.addAdEventListener(AdEventType.ERROR, (error: Error) => {
      console.error('[RewardedAdProvider] 광고 에러:', error.message)
      setAdError(error)
      setAdLoaded(false)
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    })

    console.log('[RewardedAdProvider] 초기 광고 로드')
    loadAd()

    return () => {
      unsubscribeLoaded()
      unsubscribeEarned()
      unsubscribeClosed()
      unsubscribeError()
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (adLoaded && onRewardedRef.current !== null) {
      console.log('[RewardedAdProvider] 광고 로드 완료 후 자동 표시')
      adRef.current.show()
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    }
  }, [adLoaded])
  // endregion

  return (
    <RewardedAdContext.Provider value={{ adLoaded, adError, showAd }}>
      {children}
    </RewardedAdContext.Provider>
  )
}

export function useRewardedAdContext() {
  const context = useContext(RewardedAdContext)
  if (!context) {
    throw new Error('useRewardedAdContext must be used within RewardedAdProvider')
  }
  return context
}
