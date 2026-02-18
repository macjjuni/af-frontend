import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { KOREAN_CITIES, type City } from '@orrery/core';
import BottomSheet from '@/components/BottomSheet';

// region [types]
interface CityPickerProps {
  selectedCity: City;
  onChange: (city: City) => void;
}
// endregion

export default function CityPicker({ selectedCity, onChange }: CityPickerProps) {
  // region [hooks]
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // endregion

  // region [Privates]
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KOREAN_CITIES;
    return KOREAN_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q)
    );
  }, [query]);

  function formatCityLabel(city: City): string {
    if (city.country) return `${city.name} · ${city.country}`;
    return city.name;
  }
  // endregion

  // region [Events]
  function onSelect(city: City) {
    onChange(city);
    setQuery('');
    setOpen(false);
  }

  function onClose() {
    setQuery('');
    setOpen(false);
  }
  // endregion

  return (
    <>
      <View>
        <Text className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">출생 위치</Text>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          className="flex-row items-center justify-between py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
          activeOpacity={0.7}
        >
          <Text className="text-lg text-gray-800 dark:text-gray-100">{formatCityLabel(selectedCity)}</Text>
          <Text className="text-lg text-gray-400">▼</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={open} onClose={onClose} title="출생 위치 선택" maxHeight="60%">
        {/* 검색창 */}
        <View className="p-4">
          <TextInput
            className="h-12 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-lg text-gray-800 dark:text-gray-100"
            placeholder="도시명 검색 (예: 서울, 부산)"
            placeholderTextColor="#9CA3AF"
            style={{
              paddingTop: 0, // 상단 여백 제거
              paddingBottom: 0, // 하단 여백 제거 (하단 쏠림 방지)
              lineHeight: 22, // 폰트 크기(text-lg: 18px)에 맞춰 적절히 줄임
              includeFontPadding: false, // 안드로이드 상단 폰트 여백 제거
              textAlignVertical: 'center', // 안드로이드 수직 정렬
            }}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => `${item.name}-${item.lat}`}
          renderItem={({ item }) => {
            const isSelected = item.lat === selectedCity.lat && item.lon === selectedCity.lon;
            return (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className={`px-5 py-3 border-b border-gray-50 dark:border-gray-700 ${isSelected ? 'bg-purple-50 dark:bg-purple-900/30' : ''}`}
              >
                <Text className={`text-lg ${isSelected ? 'text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-800 dark:text-gray-100'}`}>
                  {item.name}
                </Text>
                {item.country && (
                  <Text className="text-sm text-gray-400 mt-0.5">
                    {item.country}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View className="py-10 items-center">
              <Text className="text-sm text-gray-400">검색 결과 없음</Text>
            </View>
          }
        />
      </BottomSheet>
    </>
  );
}
