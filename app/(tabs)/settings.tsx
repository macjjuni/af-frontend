import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  // endregion

  // region [Events]
  function onPressSetting(item: SettingItem) {
    if (item.route) {
      router.push(item.route as never);
    } else if (item.url) {
      Linking.openURL(item.url);
    }
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

        {/* 설정 목록 */}
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
