import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProfileForm } from '@/components';
import type { BirthForm } from '@/store/useAppStore';
import useProfileStore from '@/store/useProfileStore';

const SEOUL_DEFAULT_BIRTH_FORM: BirthForm = (() => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: 12,
    minute: 0,
    gender: 'M',
    unknownTime: false,
    latitude: 37.5665,
    longitude: 126.9780,
    cityName: '서울',
  };
})();

export default function NewProfileScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const addProfile = useProfileStore((s) => s.addProfile);
  // endregion

  // region [Events]
  async function onSave(name: string | undefined, birthForm: BirthForm) {
    await addProfile(name, birthForm);
    router.back();
  }

  function onPressBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profiles');
    }
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="px-4 pb-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-row items-center"
      >
        <TouchableOpacity onPress={onPressBack} className="mr-3" activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">새 프로필 추가</Text>
      </View>

      <ProfileForm
        initialBirthForm={SEOUL_DEFAULT_BIRTH_FORM}
        submitLabel="프로필 저장"
        onSave={onSave}
      />
    </View>
  );
}
