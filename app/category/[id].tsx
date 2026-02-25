import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategories, useTemplates } from '@/query';
import { ProfileSelectSheet } from '@/components';
import type { Profile } from '@/store/useProfileStore';

export default function CategoryDetailScreen() {
  // region [hooks]
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: categoriesData } = useCategories();
  const { data: templatesData, isLoading: templatesLoading, isError: templatesError } = useTemplates(id);
  const [profileSheetVisible, setProfileSheetVisible] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  // endregion

  // region [Privates]
  const currentCategory = categoriesData?.categories.find((cat) => cat.id === id);
  const categoryTitle = currentCategory?.title || '카테고리';
  // endregion

  // region [Events]
  function onPressBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  function onPressTemplate(templateId: number) {
    setSelectedTemplateId(templateId);
    setProfileSheetVisible(true);
  }

  function onSelectProfile(profile: Profile) {
    setProfileSheetVisible(false);
    // TODO: 선택된 프로필(profile)과 템플릿(selectedTemplateId)으로 운세 분석 플로우 진행
    console.log('Selected profile:', profile.id, 'template:', selectedTemplateId);
  }

  function onAddProfile() {
    router.push('/profiles/new');
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900" style={{ paddingTop: insets.top }}>
      {/* 헤더 */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={onPressBack} className="mr-3" activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">
          {categoryTitle}
        </Text>
      </View>

      {/* 템플릿 리스트 */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
          gap: 12,
        }}
      >
        {templatesLoading ? (
          <View className="py-12 items-center">
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
          templatesData?.templates.map((template) => (
            <TouchableOpacity
              key={template.promptTemplateId}
              onPress={() => onPressTemplate(template.promptTemplateId)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 justify-center"
              style={{
                height: 100,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
              activeOpacity={0.8}
            >
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {template.title}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 프로필 선택 시트 */}
      <ProfileSelectSheet
        visible={profileSheetVisible}
        onClose={() => setProfileSheetVisible(false)}
        onSelect={onSelectProfile}
        onAddProfile={onAddProfile}
      />
    </View>
  );
}
