import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { ZiweiChart } from '@orrery/core';
import MingPanGrid from './MingPanGrid';
import SihuaSummary from './SihuaSummary';
import DaxianTable from './DaxianTable';
import LiunianView from './LiunianView';

interface ZiweiViewProps {
  chart: ZiweiChart;
  unknownTime?: boolean;
}

export default function ZiweiView({ chart, unknownTime }: ZiweiViewProps) {
  if (unknownTime) {
    return (
      <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
        <Text className="text-sm font-medium text-amber-800">자미두수는 출생 시간이 필수입니다.</Text>
        <Text className="text-sm text-amber-600 mt-1">시간에 따라 명반 전체 구조가 바뀝니다. 출생 시간을 입력해주세요.</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* 명반 그리드 */}
      <View className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
        <Text className="text-sm font-medium text-gray-700 px-4 pt-4 mb-3">紫微斗數 命盤</Text>
        <MingPanGrid chart={chart} />
      </View>

      {/* 사화 */}
      <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <SihuaSummary chart={chart} />
      </View>

      {/* 대한 */}
      <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <DaxianTable chart={chart} />
      </View>

      {/* 유년 */}
      <View className="bg-white rounded-xl border border-gray-200 p-4">
        <LiunianView chart={chart} />
      </View>
    </ScrollView>
  );
}
