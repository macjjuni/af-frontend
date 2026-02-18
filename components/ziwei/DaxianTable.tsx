import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getDaxianList } from '@orrery/core';
import type { ZiweiChart } from '@orrery/core';
import { stemSolidStyle, branchSolidStyle } from '@/utils/format';

interface DaxianTableProps {
  chart: ZiweiChart;
}

function findActiveIndex(
  list: ReturnType<typeof getDaxianList>,
  birthYear: number
): number {
  const currentAge = new Date().getFullYear() - birthYear;
  for (let i = list.length - 1; i >= 0; i--) {
    if (currentAge >= list[i].ageStart) return i;
  }
  return -1;
}

export default function DaxianTable({ chart }: DaxianTableProps) {
  // region [hooks]
  const scrollRef = useRef<ScrollView>(null);
  // endregion

  // region [Privates]
  const daxianList = getDaxianList(chart);
  const activeIdx = findActiveIndex(daxianList, chart.solarYear);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (activeIdx >= 0 && scrollRef.current) {
      const itemWidth = 56;
      const reverseIdx = daxianList.length - 1 - activeIdx;
      scrollRef.current.scrollTo({ x: Math.max(0, reverseIdx * itemWidth - 80), animated: false });
    }
  }, [activeIdx]);
  // endregion

  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 mb-2">大限</Text>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row-reverse gap-1 py-1">
          {daxianList.map((dx, i) => {
            const isActive = i === activeIdx;
            const gan = dx.ganZhi[0];
            const zhi = dx.ganZhi[1];
            const stemStyle = stemSolidStyle(gan);
            const branchStyle = branchSolidStyle(zhi);

            return (
              <View
                key={i}
                style={isActive ? {
                  borderRadius: 8, paddingHorizontal: 2, paddingVertical: 4,
                  borderWidth: 2, borderColor: '#fbbf24', backgroundColor: '#fffbeb',
                } : { paddingHorizontal: 2, paddingVertical: 4 }}
              >
                <Text style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center' }}>
                  {dx.ageStart}-{dx.ageEnd}歲
                </Text>
                <Text style={{ fontSize: 10, color: '#4b5563', textAlign: 'center', marginBottom: 2 }}>
                  {dx.palaceName}
                </Text>
                <View style={{
                  width: 32, height: 32, borderRadius: 4, marginBottom: 2,
                  backgroundColor: stemStyle.bg, alignSelf: 'center',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: stemStyle.border ? 1 : 0, borderColor: stemStyle.border ?? 'transparent',
                }}>
                  <Text style={{ color: stemStyle.text, fontSize: 16, fontWeight: 'bold' }}>{gan}</Text>
                </View>
                <View style={{
                  width: 32, height: 32, borderRadius: 4, marginBottom: 2,
                  backgroundColor: branchStyle.bg, alignSelf: 'center',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: branchStyle.border ? 1 : 0, borderColor: branchStyle.border ?? 'transparent',
                }}>
                  <Text style={{ color: branchStyle.text, fontSize: 16, fontWeight: 'bold' }}>{zhi}</Text>
                </View>
                {dx.mainStars.length > 0 ? (
                  <View style={{ alignItems: 'center' }}>
                    {dx.mainStars.map((s) => (
                      <Text key={s} style={{ fontSize: 9, color: '#6b7280' }}>{s}</Text>
                    ))}
                  </View>
                ) : (
                  <Text style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center' }}>空宮</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
