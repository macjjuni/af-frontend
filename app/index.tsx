import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { City, Gender } from '@orrery/core';
import { SelectPicker, CityPicker } from '@/components'
import type { SelectOption } from '@/components';
import useAppStore from '@/store/useAppStore';

// region [Privates - 상수]
const CURRENT_YEAR = new Date().getFullYear();

const YEAR_OPTIONS: SelectOption<number>[] = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, i) => {
    const y = CURRENT_YEAR - i;
    return { label: `${y}년`, value: y };
  }
);
const MONTH_OPTIONS: SelectOption<number>[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1,
}));
const HOUR_OPTIONS: SelectOption<number>[] = Array.from({ length: 24 }, (_, i) => ({
  label: `${String(i).padStart(2, '0')}시`,
  value: i,
}));
const MINUTE_OPTIONS: SelectOption<number>[] = Array.from({ length: 60 }, (_, i) => ({
  label: `${String(i).padStart(2, '0')}분`,
  value: i,
}));

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
// endregion

export default function BirthInputScreen() {
  // region [hooks]
  const router = useRouter();
  const { birthForm, setBirthForm } = useAppStore();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Privates]
  const dayOptions: SelectOption<number>[] = useMemo(
    () =>
      Array.from({ length: getDaysInMonth(birthForm.year, birthForm.month) }, (_, i) => ({
        label: `${i + 1}일`,
        value: i + 1,
      })),
    [birthForm.year, birthForm.month]
  );
  // endregion

  // region [Events]
  function onChangeYear(y: number) {
    const maxDay = getDaysInMonth(y, birthForm.month);
    setBirthForm({ year: y, day: Math.min(birthForm.day, maxDay) });
  }

  function onChangeMonth(m: number) {
    const maxDay = getDaysInMonth(birthForm.year, m);
    setBirthForm({ month: m, day: Math.min(birthForm.day, maxDay) });
  }

  function onSelectCity(city: City) {
    setBirthForm({ latitude: city.lat, longitude: city.lon, cityName: city.name });
  }

  function onPressAnalyze() {
    router.push('/result');
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 8, paddingBottom: 16 }}>

        {/* 헤더 */}
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">AI 운세 분석</Text>
            <Text className="text-md text-gray-400 dark:text-gray-500 mt-1">생년월일시와 성별을 입력하세요</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/privacy')}
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle-outline" size={28} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* 생년월일 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View style={{ width: 4, height: 4, backgroundColor: '#7c3aed', borderRadius: 2, marginRight: 6 }} />
            <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">생년월일 (양력)</Text>
          </View>
          <View className="flex-row gap-2">
            <SelectPicker
              label="년도"
              value={birthForm.year}
              options={YEAR_OPTIONS}
              onChange={onChangeYear}
            />
            <SelectPicker
              label="월"
              value={birthForm.month}
              options={MONTH_OPTIONS}
              onChange={onChangeMonth}
            />
            <SelectPicker
              label="일"
              value={birthForm.day}
              options={dayOptions}
              onChange={(d) => setBirthForm({ day: d })}
            />
          </View>
        </View>

        {/* 태어난 시간 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View style={{ width: 4, height: 4, backgroundColor: '#7c3aed', borderRadius: 2, marginRight: 6 }} />
              <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">태어난 시간</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-md text-gray-500 dark:text-gray-400">모름</Text>
              <Switch
                value={birthForm.unknownTime}
                onValueChange={(v) => setBirthForm({ unknownTime: v })}
                trackColor={{ true: '#7c3aed' }}
                thumbColor="#fff"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <SelectPicker
              label="시"
              value={birthForm.hour}
              options={HOUR_OPTIONS}
              onChange={(h) => setBirthForm({ hour: h })}
              disabled={birthForm.unknownTime}
            />
            <SelectPicker
              label="분"
              value={birthForm.minute}
              options={MINUTE_OPTIONS}
              onChange={(m) => setBirthForm({ minute: m })}
              disabled={birthForm.unknownTime}
            />
          </View>
        </View>

        {/* 성별 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View style={{ width: 4, height: 4, backgroundColor: '#7c3aed', borderRadius: 2, marginRight: 6 }} />
            <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">성별</Text>
          </View>
          <View className="flex-row gap-3">
            {([['M', '남성'], ['F', '여성']] as [Gender, string][]).map(([val, label]) => (
              <TouchableOpacity
                key={val}
                onPress={() => setBirthForm({ gender: val })}
                className={`flex-1 flex-row justify-center items-center gap-2 py-3 rounded-xl border ${
                  birthForm.gender === val
                    ? 'bg-purple-600 border-purple-600'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
                activeOpacity={0.8}
              >
                <Text className={`text-md font-bold ${birthForm.gender === val ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 출생 위치 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <CityPicker
            selectedCity={{ name: birthForm.cityName, lat: birthForm.latitude, lon: birthForm.longitude }}
            onChange={onSelectCity}
          />
        </View>

      </ScrollView>

      {/* 분석 버튼 - 하단 고정 */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 16,
        paddingTop: 12,
        backgroundColor: isDark ? '#111827' : '#f9fafb',
      }}>
        <TouchableOpacity
          onPress={onPressAnalyze}
          className="flex-row justify-center items-center bg-purple-600 py-4 rounded-2xl"
          activeOpacity={0.85}
        >
          <Text className="text-lg text-white font-bold">만세력 확인하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
