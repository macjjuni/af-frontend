import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import type { NatalChart } from '@orrery/core';
import PlanetTable from './PlanetTable';
import HouseTable from './HouseTable';
import AspectGrid from './AspectGrid';

interface NatalViewProps {
  chart: NatalChart | null;
  loading: boolean;
  error: string | null;
  unknownTime?: boolean;
}

export default function NatalView({ chart, loading, error, unknownTime }: NatalViewProps) {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator color="#6b7280" size="large" />
        <Text className="text-sm text-gray-500 mt-3">Swiss Ephemeris 로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-red-50 border border-red-200 rounded-xl p-4 mt-2">
        <Text className="text-sm font-medium text-red-800">계산 오류</Text>
        <Text className="text-sm text-red-600 mt-1">{error}</Text>
      </View>
    );
  }

  if (!chart) return null;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* 시간 모름 안내 */}
      {unknownTime && (
        <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <Text className="text-sm font-medium text-amber-800">
            출생 시간 없이 정오(12:00) 기준으로 계산한 결과입니다.
          </Text>
          <Text className="text-sm text-amber-600 mt-1">
            달은 최대 ±6° 오차가 있을 수 있으며, ASC · 하우스 배치는 표시하지 않습니다.
          </Text>
        </View>
      )}

      {/* 행성 + 앵글 */}
      <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-3">Natal Chart</Text>
        <PlanetTable planets={chart.planets} angles={chart.angles} />
      </View>

      {/* 하우스 - 시간 있을 때만 */}
      {!unknownTime && chart.houses.length > 0 && (
        <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <HouseTable houses={chart.houses} />
        </View>
      )}

      {/* 어스펙트 */}
      {chart.aspects.length > 0 && (
        <View className="bg-white rounded-xl border border-gray-200 p-4">
          <AspectGrid aspects={chart.aspects} />
        </View>
      )}
    </ScrollView>
  );
}
