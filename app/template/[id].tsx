import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories, useTemplates, useFortune, useShouldShowAds } from '@/query';
import { useRewardedAd } from '@/hooks';
import useAppStore from '@/store/useAppStore';
import useFortuneStore from '@/store/useFortuneStore';
import { ProfileSelectSheet, ScreenHeader } from '@/components';
import type { Profile } from '@/store/useProfileStore';
import { buildChartData } from '@/utils/buildChartData';


export default function TemplateDetailScreen() {
  // region [hooks]
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { deviceId } = useAppStore();
  const setFortuneResult = useFortuneStore((s) => s.setFortuneResult);
  const { data: categoriesData } = useCategories();
  const { data: templatesData, isLoading: templatesLoading, isError: templatesError } = useTemplates(id);
  const fortune = useFortune();
  const shouldShowAds = useShouldShowAds();
  const { showAd } = useRewardedAd();
  const [profileSheetVisible, setProfileSheetVisible] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  // endregion

  // region [Privates]
  const currentCategory = categoriesData?.categories.find((cat) => cat.id === id);
  const categoryTitle = currentCategory?.title || '카테고리'
  // endregion

  // region [Events]
  function onPressTemplate(templateId: number, isSolo: boolean) {
    setSelectedTemplateId(templateId);
    setIsMultipleSelect(!isSolo); // isSolo가 false면 다중 선택
    setProfileSheetVisible(true);
  }

  function handleSingleProfile(profile: Profile) {
    if (!selectedTemplateId) return;

    // shouldShowAds API 로딩 중이면 대기
    if (shouldShowAds.isLoading) return;

    const showAds = shouldShowAds.data?.isShowAds ?? false;

    const executeFortuneAnalysis = async () => {

      const chartData = await buildChartData(profile.birthForm);

      if (__DEV__) {
        console.log('--------------------------------------')
        console.log('chartData \n\n', chartData)
        console.log('--------------------------------------')
      }

      fortune.mutate({
        chartData,
        deviceID: deviceId,
        promptTemplateId: selectedTemplateId,
      });
    };

    if (showAds) {
      showAd(executeFortuneAnalysis);
    } else {
      executeFortuneAnalysis().then();
    }
  }

  function handleMultipleProfiles(profiles: Profile[]) {
    if (!selectedTemplateId) return;

    // shouldShowAds API 로딩 중이면 대기
    if (shouldShowAds.isLoading) return;

    const showAds = shouldShowAds.data?.isShowAds ?? false;

    const executeFortuneAnalysis = async () => {

      const [chartDataA, chartDataB] = await Promise.all([
        buildChartData(profiles[0].birthForm),
        buildChartData(profiles[1].birthForm),
      ]);

      const chartData = chartDataA + '\n\n' + chartDataB;

      if (__DEV__) {
        console.log('--------------------------------------')
        console.log('chartData \n\n', chartData)
        console.log('--------------------------------------')
      }

      fortune.mutate({
        chartData,
        deviceID: deviceId,
        promptTemplateId: selectedTemplateId,
      });
    };

    if (showAds) {
      showAd(executeFortuneAnalysis);
    } else {
      executeFortuneAnalysis();
    }
  }

  function onSelectProfile(profile: Profile | Profile[]) {
    setProfileSheetVisible(false);

    if (Array.isArray(profile)) {
      handleMultipleProfiles(profile);
    } else {
      handleSingleProfile(profile);
    }
  }

  function onAddProfile() {
    router.push('/profiles/new');
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (fortune.isSuccess) {
      setFortuneResult(fortune.data);
      router.push('/fortune');
    }
  }, [fortune.isSuccess]);

  useFocusEffect(useCallback(() => {
    fortune.reset();
  }, []));
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScreenHeader title={categoryTitle} />

      {/* 템플릿 리스트 */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingBottom: insets.bottom + 20,
          gap: 12,
        }}
      >
        {/* 운세 분석 에러 */}
        {fortune.isError && (
          <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 mb-2">
            <Text className="text-red-600 dark:text-red-400 text-sm">
              {fortune.error instanceof Error ? fortune.error.message : '오류가 발생했습니다.'}
            </Text>
          </View>
        )}

        {templatesLoading ? (
          <View className="flex-1 justify-center items-center pb-24">
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        ) : templatesError ? (
          <View className="py-12 items-center">
            <Text className="text-red-500 dark:text-red-400">템플릿을 불러오는데 실패했습니다.</Text>
          </View>
        ) : templatesData?.templates.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-gray-500 dark:text-gray-400">등록된 템플릿이 없습니다.</Text>
          </View>
        ) : (
          templatesData?.templates.map(({title, description, promptTemplateId, isSolo}) => (
            <TouchableOpacity
              key={promptTemplateId}
              onPress={() => onPressTemplate(promptTemplateId, isSolo)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 justify-center"
              style={{
                height: 100,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 gap-1 pr-3">
                  <Text className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</Text>
                  <Text className="text-md font-semibold text-gray-400 dark:text-gray-400">{description}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={isDark ? '#9ca3af' : '#d1d5db'}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 프로필 선택 시트 */}
      <ProfileSelectSheet
        visible={profileSheetVisible}
        onClose={() => setProfileSheetVisible(false)}
        onSelect={onSelectProfile as any}
        onAddProfile={onAddProfile}
        multiple={isMultipleSelect}
      />
    </View>
  );
}
