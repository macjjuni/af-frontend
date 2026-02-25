import React from 'react';
import { View, Text, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProfileForm } from '@/components';
import type { BirthForm } from '@/store/useAppStore';
import useProfileStore from '@/store/useProfileStore';
import useAppStore from '@/store/useAppStore';

export default function EditProfileScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const profiles = useProfileStore((s) => s.profiles);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const deleteProfile = useProfileStore((s) => s.deleteProfile);
  const setBirthForm = useAppStore((s) => s.setBirthForm);
  // endregion

  // region [Privates]
  const profile = profiles.find((p) => p.id === id);
  // endregion

  // region [Events]
  async function onSave(name: string | undefined, birthForm: BirthForm) {
    if (!id) return;
    await updateProfile(id, name, birthForm);
    router.back();
  }

  function onPressBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profiles');
    }
  }

  function onPressDelete() {
    Alert.alert(
      '프로필 삭제',
      '이 프로필을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            await deleteProfile(id);
            router.back();
          },
        },
      ]
    );
  }

  function onPressAnalyze() {
    if (!profile) return;
    setBirthForm(profile.birthForm);
    router.push('/result');
  }
  // endregion

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">프로필을 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={onPressBack} className="mt-4" activeOpacity={0.7}>
          <Text className="text-purple-600 dark:text-purple-400 font-semibold">뒤로가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">프로필 수정</Text>
        <TouchableOpacity onPress={onPressDelete} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={22} color={isDark ? '#f87171' : '#ef4444'} />
        </TouchableOpacity>
      </View>

      <ProfileForm
        initialName={profile.name}
        initialBirthForm={profile.birthForm}
        submitLabel="변경사항 저장"
        onSave={onSave}
      />

      {/* 분석하기 버튼 */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 16,
        paddingTop: 0,
        backgroundColor: isDark ? '#111827' : '#f9fafb',
      }}>
        <TouchableOpacity
          onPress={onPressAnalyze}
          className="flex-row justify-center items-center border border-purple-600 py-3.5 rounded-2xl"
          activeOpacity={0.85}
        >
          <Text className="text-lg text-purple-600 font-bold">이 프로필로 분석하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
