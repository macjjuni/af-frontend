import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS ?? TestIds.REWARDED,
      android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID ?? TestIds.REWARDED,
    }) ?? TestIds.REWARDED

export function useRewardedAd() {

  // region [hooks]
  const adRef = useRef<RewardedAd>(RewardedAd.createForAdRequest(adUnitId, { requestNonPersonalizedAdsOnly: true }))
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState<Error | null>(null)
  const onRewardedRef = useRef<(() => void) | null>(null)
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
      adRef.current.show()
    } else {
      loadAd()
    }
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    const unsubscribeLoaded = adRef.current.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true)
      setAdError(null)
    })

    const unsubscribeEarned = adRef.current.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      onRewardedRef.current?.()
      onRewardedRef.current = null
    })

    const unsubscribeClosed = adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
      setAdLoaded(false)
      loadAd()
    })

    const unsubscribeError = adRef.current.addAdEventListener(AdEventType.ERROR, (error: Error) => {
      setAdError(error)
      setAdLoaded(false)
    })

    loadAd()

    return () => {
      unsubscribeLoaded()
      unsubscribeEarned()
      unsubscribeClosed()
      unsubscribeError()
    }
  }, [])

  useEffect(() => {
    if (adLoaded && onRewardedRef.current !== null) {
      adRef.current.show()
    }
  }, [adLoaded])
  // endregion

  return { adLoaded, adError, showAd }
}
