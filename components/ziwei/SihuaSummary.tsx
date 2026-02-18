import React from 'react';
import { View, Text } from 'react-native';
import type { ZiweiChart } from '@orrery/core';

interface SihuaSummaryProps {
  chart: ZiweiChart;
}

const SIHUA_COLORS: Record<string, string> = {
  '化祿': '#16a34a',
  '化權': '#ca8a04',
  '化科': '#2563eb',
  '化忌': '#dc2626',
};

export default function SihuaSummary({ chart }: SihuaSummaryProps) {
  // region [Privates]
  const siHuaInfo: Record<string, { star: string; palace: string } | null> = {
    '化祿': null, '化權': null, '化科': null, '化忌': null,
  };

  for (const palace of Object.values(chart.palaces)) {
    for (const star of palace.stars) {
      if (star.siHua) {
        siHuaInfo[star.siHua] = { star: star.name, palace: palace.name };
      }
    }
  }
  // endregion

  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 mb-2">四化</Text>
      <View className="gap-1">
        {Object.entries(siHuaInfo).map(([huaType, info]) => {
          if (!info) return null;
          return (
            <View key={huaType} className="flex-row items-center">
              <Text style={{ color: SIHUA_COLORS[huaType] ?? '#374151', fontSize: 13, width: 32 }}>
                {huaType}
              </Text>
              <Text className="text-gray-400 mx-1 text-sm">:</Text>
              <Text className="text-sm text-gray-800 mr-1">{info.star}</Text>
              <Text className="text-gray-400 text-sm">在</Text>
              <Text className="text-sm text-gray-600 ml-1">{info.palace}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
