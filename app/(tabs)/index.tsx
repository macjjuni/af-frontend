import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '@/store/useAppStore';
import { useCategories } from '@/query';
import { TabHeader } from '@/components/layout';

export default function HomeScreen() {
  // region [hooks]
  const router = useRouter();
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);
  const isOnboardingChecked = useAppStore((s) => s.isOnboardingChecked);
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  // endregion

  // region [Privates]
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 40 - 24) / 2; // padding 40 (20*2) + gap 12
  // endregion

  // region [Events]
  function onPressCategory(categoryId: string) {
    router.push(`/template/${categoryId}`);
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (isOnboardingChecked && !hasSeenOnboarding) {
      router.replace('/onboarding');
    }
  }, [isOnboardingChecked, hasSeenOnboarding]);
  // endregion

  // 온보딩 체크 중이거나 온보딩 미완료 시 아무것도 렌더링하지 않음
  if (!isOnboardingChecked || !hasSeenOnboarding) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TabHeader title="🔮 궁금한 주제를 선택하세요!" />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {/* 카테고리 그리드 */}
        {categoriesLoading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        ) : categoriesError ? (
          <View className="py-12 items-center">
            <Text className="text-red-500 dark:text-red-400">카테고리를 불러오는데 실패했습니다.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-6">
            {categoriesData?.categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => onPressCategory(category.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 items-center justify-center py-7"
                style={{
                  width: cardWidth,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
                activeOpacity={0.8}
              >
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mb-3"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={24} color={category.color} />
                </View>
                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center">
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
