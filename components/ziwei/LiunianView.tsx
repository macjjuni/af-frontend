import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { calculateLiunian, MAIN_STAR_NAMES } from '@orrery/core';
import type { ZiweiChart } from '@orrery/core';

interface LiunianViewProps {
  chart: ZiweiChart;
}

const SIHUA_COLORS: Record<string, string> = {
  '化祿': '#16a34a', '化權': '#ca8a04', '化科': '#2563eb', '化忌': '#dc2626',
};

const LUNAR_MONTH_NAMES = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '臘月',
];

function getMainStarsAtZhi(chart: ZiweiChart, zhi: string): string[] {
  for (const palace of Object.values(chart.palaces)) {
    if (palace.zhi === zhi) {
      return palace.stars.filter((s) => MAIN_STAR_NAMES.has(s.name)).map((s) => s.name);
    }
  }
  return [];
}

export default function LiunianView({ chart }: LiunianViewProps) {
  // region [hooks]
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  // endregion

  // region [Privates]
  const liunian = useMemo(() => calculateLiunian(chart, year), [chart, year]);
  // endregion

  // region [Events]
  function onChangeYear(delta: number) {
    setYear((y) => Math.max(chart.solarYear, Math.min(chart.solarYear + 100, y + delta)));
  }
  // endregion

  return (
    <View>
      {/* 헤더 - 연도 선택 */}
      <View className="flex-row items-center gap-2 mb-3">
        <Text className="text-sm font-medium text-gray-700">流年</Text>
        <TouchableOpacity
          onPress={() => onChangeYear(-1)}
          className="w-7 h-7 rounded border border-gray-300 items-center justify-center"
        >
          <Text className="text-gray-600">‹</Text>
        </TouchableOpacity>
        <Text className="text-sm font-medium text-gray-800 w-14 text-center">{year}年</Text>
        <TouchableOpacity
          onPress={() => onChangeYear(1)}
          className="w-7 h-7 rounded border border-gray-300 items-center justify-center"
        >
          <Text className="text-gray-600">›</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-400">{liunian.gan}{liunian.zhi}年</Text>
      </View>

      {/* 대한 정보 */}
      <View className="mb-2">
        <Text className="text-sm text-gray-600">
          <Text className="font-medium text-gray-700">大限</Text>
          {'  '}{liunian.daxianAgeStart}-{liunian.daxianAgeEnd}歲 {liunian.daxianPalaceName}
        </Text>
      </View>

      {/* 유년 명궁 */}
      <View className="mb-3">
        <Text className="text-sm text-gray-600">
          <Text className="font-medium text-gray-700">流年命宮</Text>
          {'  '}{liunian.mingGongZhi}宮 → 本命 {liunian.natalPalaceAtMing}
          {'  '}
          <Text className="text-gray-400 text-sm">
            ({getMainStarsAtZhi(chart, liunian.mingGongZhi).join(', ') || '空宮'})
          </Text>
        </Text>
      </View>

      {/* 유년 사화 */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-700 mb-1">流年四化</Text>
        <View className="gap-0.5">
          {(['化祿', '化權', '化科', '化忌'] as const).map((huaType) => {
            let starName = '';
            for (const [s, h] of Object.entries(liunian.siHua)) {
              if (h === huaType) { starName = s; break; }
            }
            const palaceName = liunian.siHuaPalaces[huaType] || '?';
            if (!starName) return null;
            return (
              <View key={huaType} className="flex-row items-center">
                <Text style={{ color: SIHUA_COLORS[huaType], fontSize: 13, width: 32 }}>{huaType}</Text>
                <Text className="text-gray-400 mx-1">:</Text>
                <Text className="text-sm text-gray-800 mr-1">{starName}</Text>
                <Text className="text-gray-400">→</Text>
                <Text className="text-sm text-gray-600 ml-1">{palaceName}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 유월 */}
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">流月運勢</Text>
        <View className="gap-0.5">
          {liunian.liuyue.map((ly) => {
            const stars = getMainStarsAtZhi(chart, ly.mingGongZhi);
            const hasMain = stars.length > 0;
            return (
              <View key={ly.month} className="flex-row items-center">
                <Text style={{ fontSize: 11, color: '#6b7280', width: 32 }}>
                  {LUNAR_MONTH_NAMES[ly.month - 1]}
                </Text>
                <Text style={{ fontSize: 10, color: '#9ca3af', width: 20 }}>({ly.mingGongZhi})</Text>
                <Text style={{ fontSize: 11, color: hasMain ? '#4b5563' : '#9ca3af', marginRight: 4 }}>
                  {ly.natalPalaceName}
                </Text>
                <Text style={{ fontSize: 10, color: '#9ca3af' }}>
                  {hasMain ? `- ${stars.join(', ')}` : '- (空宮)'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
