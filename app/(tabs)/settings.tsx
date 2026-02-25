import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useProfileStore from '@/store/useProfileStore';

type SettingItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  url?: string;
};

const SETTING_ITEMS: SettingItem[] = [
  { id: 'terms', label: '이용약관', icon: 'document-text-outline', route: '/terms' },
  { id: 'privacy', label: '개인정보 처리방침', icon: 'shield-checkmark-outline', route: '/privacy' },
  { id: 'ai-notice', label: 'AI 서비스 안내', icon: 'information-circle-outline', route: '/ai-notice' },
];

export default function SettingsScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const clearProfiles = useProfileStore((s) => s.clearProfiles);
  // endregion

  // region [Events]
  function onPressSetting(item: SettingItem) {
    if (item.route) {
      router.push(item.route as never);
    } else if (item.url) {
      Linking.openURL(item.url);
    }
  }

  function onPressClearProfiles() {
    Alert.alert(
      '프로필 전체 삭제',
      '저장된 모든 프로필이 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전체 삭제',
          style: 'destructive',
          onPress: () => clearProfiles(),
        },
      ]
    );
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* 헤더 */}
        <View className="mb-6 py-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">설정</Text>
        </View>

        {/* 데이터 관리 */}
        <Text className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-3 px-1">데이터 관리</Text>
        <View
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={onPressClearProfiles}
            activeOpacity={0.7}
            className="flex-row items-center px-4 py-4"
          >
            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-red-100 dark:bg-red-900/30">
              <Ionicons
                name="trash-outline"
                size={20}
                color={isDark ? '#f87171' : '#ef4444'}
              />
            </View>
            <Text className="flex-1 text-base font-medium text-red-600 dark:text-red-400">
              프로필 전체 초기화
            </Text>
          </TouchableOpacity>
        </View>

        {/* 개선 및 피드백 */}
        <Text className="text-sm font-semibold text-gray-400 dark:text-gray-500 mt-8 mb-3 px-1">개선 및 피드백</Text>
        <View
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:macjjuni@gmail.com')}
            activeOpacity={0.7}
            className="flex-row items-center px-4 py-4"
          >
            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-purple-100 dark:bg-purple-900">
              <Ionicons
                name="mail-outline"
                size={20}
                color={isDark ? '#c084fc' : '#7c3aed'}
              />
            </View>
            <Text className="flex-1 text-base font-medium text-gray-800 dark:text-gray-100">
              피드백 보내기
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isDark ? '#4b5563' : '#d1d5db'}
            />
          </TouchableOpacity>
        </View>

        {/* 약관 및 안내 */}
        <Text className="text-sm font-semibold text-gray-400 dark:text-gray-500 mt-8 mb-3 px-1">약관 및 안내</Text>
        <View
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {SETTING_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onPressSetting(item)}
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-4 ${
                index < SETTING_ITEMS.length - 1
                  ? 'border-b border-gray-100 dark:border-gray-700'
                  : ''
              }`}
            >
              <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-purple-100 dark:bg-purple-900">
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isDark ? '#c084fc' : '#7c3aed'}
                />
              </View>
              <Text className="flex-1 text-base font-medium text-gray-800 dark:text-gray-100">
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={isDark ? '#4b5563' : '#d1d5db'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
