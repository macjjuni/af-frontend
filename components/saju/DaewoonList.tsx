import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, useColorScheme } from 'react-native';
import type { DaewoonItem } from '@orrery/core';
import { stemSolidStyle, branchSolidStyle, stemColor, branchColor } from '@/utils/format';

// region [types]
interface DaewoonListProps {
  daewoon: DaewoonItem[];
  unknownTime?: boolean;
}
// endregion

function findActiveIndex(daewoon: DaewoonItem[]): number {
  const now = new Date();
  let idx = -1;
  for (let i = 0; i < daewoon.length; i++) {
    if (daewoon[i].startDate <= now) idx = i;
  }
  return idx;
}

export default function DaewoonList({ daewoon, unknownTime }: DaewoonListProps) {
  // region [hooks]
  const scrollRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Privates]
  const activeIdx = findActiveIndex(daewoon);
  const secondaryTextColor = isDark ? '#9ca3af' : '#6b7280';
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (activeIdx >= 0 && scrollRef.current) {
      // 현재 대운으로 스크롤 (오른쪽→왼쪽 역순 배치이므로 역방향 계산)
      const itemWidth = 56;
      const reverseIdx = daewoon.length - 1 - activeIdx;
      scrollRef.current.scrollTo({ x: Math.max(0, reverseIdx * itemWidth - 80), animated: false });
    }
  }, [activeIdx]);
  // endregion

  if (daewoon.length === 0) {
    return (
      <View>
        <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">대운</Text>
        <Text className="text-sm text-gray-400">대운 데이터가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">대운</Text>
      {unknownTime && (
        <Text className="text-sm text-amber-600 mb-2">
          출생 시간 없이 정오(12:00) 기준으로 계산하여 대운 시작 시기에 수개월 오차가 있을 수 있습니다.
        </Text>
      )}
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}>
        {/* 역순으로 표시 (orrery 웹앱 flex-row-reverse 동일) */}
        <View className="flex-row-reverse gap-2 py-1">
          {daewoon.map((dw, i) => {
            const isActive = i === activeIdx;
            const stemStyle = stemSolidStyle(dw.ganzi[0], isDark);
            const branchStyle = branchSolidStyle(dw.ganzi[1], isDark);
            return (
              <View
                key={dw.index}
                style={isActive ? {
                  borderRadius: 8, padding: 4,
                  borderWidth: 2, borderColor: '#fbbf24',
                  backgroundColor: isDark ? '#292012' : '#fffbeb',
                } : { borderRadius: 8, padding: 4 }}
              >
                <Text style={{ fontSize: 10, color: secondaryTextColor, textAlign: 'center' }}>{dw.age}세</Text>
                <Text style={{ fontSize: 11, color: stemColor(dw.ganzi[0]), textAlign: 'center' }}>
                  {dw.stemSipsin}
                </Text>
                {/* 천간 박스 */}
                <View style={{
                  width: 32, height: 32, borderRadius: 4, marginVertical: 2,
                  backgroundColor: stemStyle.bg, alignItems: 'center', justifyContent: 'center',
                  borderWidth: stemStyle.border ? 1 : 0, borderColor: stemStyle.border ?? 'transparent',
                }}>
                  <Text style={{ color: stemStyle.text, fontSize: 16, fontWeight: 'bold' }}>
                    {dw.ganzi[0]}
                  </Text>
                </View>
                {/* 지지 박스 */}
                <View style={{
                  width: 32, height: 32, borderRadius: 4, marginBottom: 2,
                  backgroundColor: branchStyle.bg, alignItems: 'center', justifyContent: 'center',
                  borderWidth: branchStyle.border ? 1 : 0, borderColor: branchStyle.border ?? 'transparent',
                }}>
                  <Text style={{ color: branchStyle.text, fontSize: 16, fontWeight: 'bold' }}>
                    {dw.ganzi[1]}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: branchColor(dw.ganzi[1]), textAlign: 'center' }}>
                  {dw.branchSipsin}
                </Text>
                <Text style={{ fontSize: 10, color: secondaryTextColor, textAlign: 'center' }}>{dw.unseong}</Text>
                <Text style={{ fontSize: 10, color: secondaryTextColor, textAlign: 'center' }}>{dw.sinsal}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
