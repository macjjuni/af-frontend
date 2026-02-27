import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, useColorScheme, Switch } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { City, Gender } from '@orrery/core';
import SelectPicker from '../common/SelectPicker';
import CityPicker from './CityPicker';
import type { SelectOption } from '../common/SelectPicker';
import type { BirthForm } from '@/store/useAppStore';

// region [types]
interface ProfileFormProps {
  initialName?: string;
  initialBirthForm: BirthForm;
  submitLabel: string;
  onSave: (name: string | undefined, birthForm: BirthForm) => void;
}
// endregion

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

export default function ProfileForm({ initialName, initialBirthForm, submitLabel, onSave }: ProfileFormProps) {
  // region [hooks]
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState(initialName ?? '');
  const [birthForm, setBirthForm] = useState<BirthForm>(initialBirthForm);
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

  function updateBirthForm(partial: Partial<BirthForm>) {
    setBirthForm((prev) => ({ ...prev, ...partial }));
  }
  // endregion

  // region [Events]
  function onChangeYear(y: number) {
    const maxDay = getDaysInMonth(y, birthForm.month);
    updateBirthForm({ year: y, day: Math.min(birthForm.day, maxDay) });
  }

  function onChangeMonth(m: number) {
    const maxDay = getDaysInMonth(birthForm.year, m);
    updateBirthForm({ month: m, day: Math.min(birthForm.day, maxDay) });
  }

  function onSelectCity(city: City) {
    updateBirthForm({ latitude: city.lat, longitude: city.lon, cityName: city.name });
  }

  function onPressSave() {
    const trimmedName = name.trim();
    onSave(trimmedName.length > 0 ? trimmedName : undefined, birthForm);
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 0 }}>

        {/* 이름 (선택) */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View style={{ width: 6, height: 6, backgroundColor: '#7c3aed', borderRadius: 3, marginRight: 8 }} />
            <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">이름 (선택)</Text>
          </View>
          <TextInput
            className="h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg text-gray-800 dark:text-gray-100"
            placeholder="예: 본인, 배우자, 자녀 등"
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            value={name}
            onChangeText={setName}
            maxLength={16}
            returnKeyType="done"
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              lineHeight: 18,
              includeFontPadding: false,
              textAlignVertical: 'center',
            }}
          />
        </View>

        {/* 생년월일 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View style={{ width: 6, height: 6, backgroundColor: '#7c3aed', borderRadius: 3, marginRight: 8 }} />
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
              onChange={(d) => updateBirthForm({ day: d })}
            />
          </View>
        </View>

        {/* 태어난 시간 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View style={{ width: 6, height: 6, backgroundColor: '#7c3aed', borderRadius: 3, marginRight: 8 }} />
              <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">태어난 시간</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-md text-gray-500 dark:text-gray-400">모름</Text>
              <Switch
                value={birthForm.unknownTime}
                onValueChange={(v) => updateBirthForm({ unknownTime: v })}
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
              onChange={(h) => updateBirthForm({ hour: h })}
              disabled={birthForm.unknownTime}
            />
            <SelectPicker
              label="분"
              value={birthForm.minute}
              options={MINUTE_OPTIONS}
              onChange={(m) => updateBirthForm({ minute: m })}
              disabled={birthForm.unknownTime}
            />
          </View>
        </View>

        {/* 성별 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View style={{ width: 6, height: 6, backgroundColor: '#7c3aed', borderRadius: 3, marginRight: 8 }} />
            <Text className="text-lg font-bold text-gray-700 dark:text-gray-200">성별</Text>
          </View>
          <View className="flex-row gap-3">
            {([['M', '남성'], ['F', '여성']] as [Gender, string][]).map(([val, label]) => (
              <TouchableOpacity
                key={val}
                onPress={() => updateBirthForm({ gender: val })}
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

      {/* 저장 버튼 - 하단 고정 */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 16,
        paddingTop: 12,
        backgroundColor: isDark ? '#111827' : '#f9fafb',
      }}>
        <TouchableOpacity
          onPress={onPressSave}
          className="flex-row justify-center items-center bg-purple-600 py-4 rounded-2xl"
          activeOpacity={0.85}
        >
          <Text className="text-lg text-white font-bold">{submitLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
