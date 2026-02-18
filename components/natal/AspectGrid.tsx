import React from 'react';
import { View, Text } from 'react-native';
import { PLANET_SYMBOLS, PLANET_KO, ASPECT_SYMBOLS } from '@orrery/core';
import type { NatalAspect } from '@orrery/core';

interface AspectGridProps {
  aspects: NatalAspect[];
}

export default function AspectGrid({ aspects }: AspectGridProps) {
  const top = aspects.slice(0, 15);

  return (
    <View>
      <Text className="text-sm font-medium text-gray-500 mb-2">Major Aspects</Text>
      <View className="gap-0.5">
        {top.map((a, i) => (
          <View key={i} className="flex-row items-center py-0.5">
            <Text style={{ fontSize: 14, width: 22, textAlign: 'center' }}>{PLANET_SYMBOLS[a.planet1]}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', width: 52 }}>{PLANET_KO[a.planet1]}</Text>
            <Text style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{ASPECT_SYMBOLS[a.type]}</Text>
            <Text style={{ fontSize: 14, width: 22, textAlign: 'center' }}>{PLANET_SYMBOLS[a.planet2]}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', flex: 1 }}>{PLANET_KO[a.planet2]}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af' }}>
              orb {a.orb.toFixed(1)}°
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
