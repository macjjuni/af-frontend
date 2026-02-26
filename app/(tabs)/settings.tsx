import React from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import useProfileStore from '@/store/useProfileStore';
import { TabHeader } from '@/components/layout';
import { SettingSectionTitle, SettingCard } from '@/components/settings';
import type { SettingCardItem } from '@/components/settings';

export default function SettingsScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clearProfiles = useProfileStore((s) => s.clearProfiles);
  // endregion

  // region [Events]
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

  // region [Privates]
  const dataItems: SettingCardItem[] = [
    {
      icon: 'trash-outline',
      label: '프로필 전체 초기화',
      onPress: onPressClearProfiles,
      showArrow: false,
      iconBgClassName: 'bg-red-100 dark:bg-red-900/30',
      iconColor: { light: '#ef4444', dark: '#f87171' },
      labelClassName: 'text-red-600 dark:text-red-400',
    },
  ];

  const feedbackItems: SettingCardItem[] = [
    {
      icon: 'mail-outline',
      label: '피드백 보내기',
      onPress: () => Linking.openURL('mailto:macjjuni@gmail.com'),
    },
  ];

  const legalItems: SettingCardItem[] = [
    { icon: 'document-text-outline', label: '이용약관', onPress: () => router.push('/legal/terms' as never) },
    { icon: 'shield-checkmark-outline', label: '개인정보 처리방침', onPress: () => router.push('/legal/privacy' as never) },
    { icon: 'information-circle-outline', label: 'AI 서비스 안내', onPress: () => router.push('/legal/ai-notice' as never) },
  ];
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TabHeader title="설정" />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* 데이터 관리 */}
        <SettingSectionTitle title="데이터 관리" isFirst />
        <SettingCard items={dataItems} />

        {/* 개선 및 피드백 */}
        <SettingSectionTitle title="개선 및 피드백" />
        <SettingCard items={feedbackItems} />

        {/* 약관 및 안내 */}
        <SettingSectionTitle title="약관 및 안내" />
        <SettingCard items={legalItems} />
      </ScrollView>
    </View>
  );
}
