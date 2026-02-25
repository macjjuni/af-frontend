import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../common/BottomSheet';
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

// region [Helpers]
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

  // region [Events]
  function onPressProfile(profile: Profile) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(profile.id)) {
        next.delete(profile.id);
      } else {
        // 단일 선택: 1명만, 복수 선택: 최대 2명
        const maxSelection = multiple ? 2 : 1;
        if (next.size >= maxSelection) {
          // 단일 선택일 때는 기존 선택 해제하고 새로 선택
          if (!multiple) {
            next.clear();
            next.add(profile.id);
          }
          return next;
        }
        next.add(profile.id);
      }
      return next;
    });
  }

  function onPressConfirm() {
    const selected = profiles.filter((p) => selectedIds.has(p.id));

    if (multiple) {
      (onSelect as (profiles: Profile[]) => void)(selected);
    } else {
      (onSelect as (profile: Profile) => void)(selected[0]);
    }

    onClose();
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
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={multiple ? "프로필 2명 선택" : "프로필 선택 (1명)"}
      maxHeight="50%"
    >
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
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              gap: 10,
              paddingBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {profiles.map((profile, index) => {
              const isSelected = selectedIds.has(profile.id);
              const isDisabled = multiple && !isSelected && selectedIds.size >= 2;
              return (
                <TouchableOpacity
                  key={profile.id}
                  onPress={() => onPressProfile(profile)}
                  activeOpacity={isDisabled ? 1 : 0.85}
                  disabled={isDisabled}
                  className={`rounded-xl p-4 border ${
                    isSelected
                      ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-400 dark:border-violet-500'
                      : isDisabled
                      ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-lg font-bold ${
                      isDisabled
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {getProfileDisplayName(profile, index)}
                    </Text>
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={
                        isDisabled
                          ? (isDark ? '#4b5563' : '#d1d5db')
                          : isSelected
                          ? (isDark ? '#c084fc' : '#7c3aed')
                          : (isDark ? '#6b7280' : '#9ca3af')
                      }
                    />
                  </View>
                  <Text className={`text-sm mt-1 ${
                    isDisabled
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatBirthSummary(profile)}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {onAddProfile && (
              <TouchableOpacity
                onPress={onPressAdd}
                activeOpacity={0.7}
                className="flex-row items-center justify-center py-3"
              >
                <Ionicons name="add-circle-outline" size={20} color={isDark ? '#c084fc' : '#7c3aed'} />
                <Text className="text-md font-semibold text-violet-600 dark:text-violet-400 ml-1">
                  새 프로필 추가
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <View
            className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4"
            style={{ paddingTop: 12, paddingBottom: 12 }}
          >
            <TouchableOpacity
              onPress={onPressConfirm}
              activeOpacity={0.7}
              disabled={selectedIds.size === 0 || (multiple && selectedIds.size < 2)}
              className={`rounded-xl py-3.5 items-center ${
                (multiple && selectedIds.size === 2) || (!multiple && selectedIds.size === 1)
                  ? 'bg-violet-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Text className={`font-bold text-base ${
                (multiple && selectedIds.size === 2) || (!multiple && selectedIds.size === 1)
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {selectedIds.size === 0
                  ? multiple
                    ? '프로필을 선택하세요 (2명 필수)'
                    : '프로필을 선택하세요'
                  : multiple && selectedIds.size < 2
                  ? '1명 더 선택하세요 (2명 필수)'
                  : multiple
                  ? `분석하기 (${selectedIds.size}/2명)`
                  : '분석하기'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </BottomSheet>
  );
}
