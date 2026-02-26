import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components';
import { SettingCard } from '@/components/settings';
import type { SettingCardItem } from '@/components/settings';

export default function LegalScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // endregion

  // region [Privates]
  const legalItems: SettingCardItem[] = [
    {
      icon: 'document-text-outline',
      label: '이용약관',
      onPress: () => router.push('/legal/terms' as never)
    },
    {
      icon: 'shield-checkmark-outline',
      label: '개인정보 처리방침',
      onPress: () => router.push('/legal/privacy' as never)
    },
    {
      icon: 'information-circle-outline',
      label: 'AI 서비스 안내',
      onPress: () => router.push('/legal/ai-notice' as never)
    },
    {
      icon: 'code-slash-outline',
      label: '오픈소스 라이센스',
      onPress: () => Linking.openURL('https://github.com/macjjuni/af-frontend/blob/main/LICENSES.md')
    },
  ];
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScreenHeader title="약관 및 안내" centerTitle />

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <SettingCard items={legalItems} />
      </ScrollView>
    </View>
  );
}
