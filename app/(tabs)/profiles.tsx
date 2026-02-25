import React, { useCallback } from 'react';
import { FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useProfileStore, { type Profile } from '@/store/useProfileStore';
import { TabHeader } from '@/components/layout';

export default function ProfilesScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const profiles = useProfileStore((s) => s.profiles);
  // endregion

  // region [Privates]
  function getProfileDisplayName(profile: Profile, index: number): string {
    return profile.name ?? `프로필 ${index + 1}`;
  }

  function formatBirthSummary(profile: Profile): string {
    const { year, month, day, hour, minute, unknownTime, gender, cityName } = profile.birthForm;
    const date = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    const time = unknownTime ? '-' : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const genderLabel = gender === 'M' ? '남성' : '여성';
    return `${date} ${time} / ${genderLabel} / ${cityName}`;
  }

  // endregion

  // region [Events]
  function onPressAddProfile() {
    router.push('/profiles/new');
  }

  function onPressProfileCard(profile: Profile) {
    router.push(`/profiles/${profile.id}`);
  }

  // endregion

  // region [Life Cycles]
  useFocusEffect(useCallback(() => {
    // 스토어는 이미 최신 상태이므로 포커스 시 리렌더링만 트리거
  }, []));
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TabHeader
        title="프로필 목록"
        rightAction={
          <TouchableOpacity onPress={onPressAddProfile} activeOpacity={0.7}>
            <Ionicons name="add" size={28} color={isDark ? '#c084fc' : '#7c3aed'}/>
          </TouchableOpacity>
        }
      />

      {profiles.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="people-outline" size={56} color={isDark ? '#4b5563' : '#d1d5db'}/>
          <Text className="text-lg font-semibold text-gray-400 dark:text-gray-500 mt-4 text-center">
            저장된 프로필이 없습니다
          </Text>
          <Text className="text-sm text-gray-400 dark:text-gray-600 mt-1 text-center">
            + 버튼으로 새 프로필을 추가하세요
          </Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
            gap: 12,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onPressProfileCard(item)}
              activeOpacity={0.85}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  {item.isSelf && (
                    <Ionicons name="checkmark-circle" size={18} color={isDark ? '#c084fc' : '#7c3aed'}/>
                  )}
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {getProfileDisplayName(item, index)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={isDark ? '#4b5563' : '#d1d5db'}/>
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatBirthSummary(item)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
