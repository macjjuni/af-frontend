import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import useProfileStore, { type Profile } from '@/store/useProfileStore';

interface SingleSelectProps {
  multiple?: false;
  onSelect: (profile: Profile) => void;
}

interface MultiSelectProps {
  multiple: true;
  onSelect: (profiles: Profile[]) => void;
}

type ProfileSelectSheetProps = {
  visible: boolean;
  onClose: () => void;
  onAddProfile?: () => void;
} & (SingleSelectProps | MultiSelectProps);

export default function ProfileSelectSheet({
  visible,
  onClose,
  onSelect,
  onAddProfile,
  multiple = false,
}: ProfileSelectSheetProps) {
  // region [hooks]
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const profiles = useProfileStore((s) => s.profiles);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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
  function onPressProfile(profile: Profile) {
    if (multiple) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(profile.id)) {
          next.delete(profile.id);
        } else {
          next.add(profile.id);
        }
        return next;
      });
    } else {
      (onSelect as SingleSelectProps['onSelect'])(profile);
    }
  }

  function onPressConfirm() {
    const selected = profiles.filter((p) => selectedIds.has(p.id));
    (onSelect as MultiSelectProps['onSelect'])(selected);
  }

  function onPressAdd() {
    onClose();
    onAddProfile?.();
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (visible) {
      setSelectedIds(new Set());
    }
  }, [visible]);
  // endregion

  return (
    <BottomSheet visible={visible} onClose={onClose} title="프로필 선택" maxHeight="50%">
      {profiles.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8 py-10">
          <Ionicons name="people-outline" size={48} color={isDark ? '#4b5563' : '#d1d5db'} />
          <Text className="text-base font-semibold text-gray-400 dark:text-gray-500 mt-3 text-center">
            저장된 프로필이 없습니다
          </Text>
          {onAddProfile && (
            <TouchableOpacity
              onPress={onPressAdd}
              activeOpacity={0.7}
              className="mt-4 bg-violet-600 rounded-xl px-6 py-3"
            >
              <Text className="text-white font-semibold text-sm">프로필 추가하기</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {profiles.map((profile, index) => {
            const isSelected = selectedIds.has(profile.id);
            return (
              <TouchableOpacity
                key={profile.id}
                onPress={() => onPressProfile(profile)}
                activeOpacity={0.85}
                className={`rounded-xl p-4 border ${
                  multiple && isSelected
                    ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-400 dark:border-violet-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-bold text-gray-900 dark:text-white">
                    {getProfileDisplayName(profile, index)}
                  </Text>
                  {multiple ? (
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? (isDark ? '#c084fc' : '#7c3aed') : (isDark ? '#6b7280' : '#9ca3af')}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
                  )}
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatBirthSummary(profile)}
                </Text>
              </TouchableOpacity>
            );
          })}

          {onAddProfile && (
            <TouchableOpacity
              onPress={onPressAdd}
              activeOpacity={0.7}
              className="flex-row items-center justify-center py-3 mb-4"
            >
              <Ionicons name="add-circle-outline" size={20} color={isDark ? '#c084fc' : '#7c3aed'} />
              <Text className="text-md font-semibold text-violet-600 dark:text-violet-400 ml-1">
                새 프로필 추가
              </Text>
            </TouchableOpacity>
          )}

          {multiple && (
            <TouchableOpacity
              onPress={onPressConfirm}
              activeOpacity={0.7}
              disabled={selectedIds.size === 0}
              className={`rounded-xl py-3.5 items-center mb-4 ${
                selectedIds.size > 0
                  ? 'bg-violet-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Text className={`font-bold text-base ${
                selectedIds.size > 0
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {selectedIds.size > 0 ? `선택 완료 (${selectedIds.size})` : '프로필을 선택하세요'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </BottomSheet>
  );
}
