import { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAppStore from '@/store/useAppStore';
import { OnboardingScreen, PageIndicator } from '@/components';
import { ONBOARDING_PAGES } from '@/constants/onboarding';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Onboarding() {
  // region [hooks]
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  // endregion

  // region [Privates]
  const isLastPage = currentPage === ONBOARDING_PAGES.length - 1;
  // endregion

  // region [Events]
  function onPressSkip() {
    router.push('/consent');
  }

  function onPressNext() {
    if (isLastPage) {
      router.push('/consent');
    } else {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentPage(nextPage);
    }
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Skip button */}
      {!isLastPage && (
        <View
          className="absolute top-0 right-0 z-10 px-5"
          style={{ paddingTop: insets.top + 20 }}
        >
          <TouchableOpacity onPress={onPressSkip} activeOpacity={0.7}>
            <Text className="text-purple-600 dark:text-purple-400 text-base font-semibold">
              건너뛰기
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Onboarding pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        { ONBOARDING_PAGES.map((page) => (
          <View key={page.id} style={{ width: SCREEN_WIDTH }}>
            <OnboardingScreen page={page} />
          </View>
        ))}
      </ScrollView>

      {/* Bottom section */}
      <View
        className="bg-gray-50 dark:bg-gray-900"
        style={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
        }}
      >
        <PageIndicator currentPage={currentPage} totalPages={ONBOARDING_PAGES.length} />
        <TouchableOpacity
          onPress={onPressNext}
          className="flex-row justify-center items-center bg-purple-600 py-4 rounded-2xl mt-6"
          activeOpacity={0.85}
        >
          <Text className="text-lg text-white font-bold">
            {isLastPage ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
