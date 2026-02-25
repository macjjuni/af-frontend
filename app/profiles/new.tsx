import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileForm, ScreenHeader } from '@/components';
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
  const addProfile = useProfileStore((s) => s.addProfile);
  // endregion

  // region [Events]
  async function onSave(name: string | undefined, birthForm: BirthForm) {
    await addProfile(name, birthForm);
    router.back();
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScreenHeader
        title="새 프로필 추가"
        onBack={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profiles')}
      />

      <ProfileForm
        initialBirthForm={SEOUL_DEFAULT_BIRTH_FORM}
        submitLabel="프로필 저장"
        onSave={onSave}
      />
    </View>
  );
}
