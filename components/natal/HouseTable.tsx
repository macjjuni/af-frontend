import React from 'react';
import { View, Text } from 'react-native';
import { ZODIAC_SYMBOLS, ZODIAC_KO, ROMAN, formatDegree } from '@orrery/core';
import type { NatalHouse } from '@orrery/core';

interface HouseTableProps {
  houses: NatalHouse[];
}

export default function HouseTable({ houses }: HouseTableProps) {
  const left = houses.slice(0, 6);
  const right = houses.slice(6);

  return (
    <View>
      <Text className="text-sm font-medium text-gray-500 mb-2">Houses</Text>
      <View className="flex-row gap-4">
        {[left, right].map((col, ci) => (
          <View key={ci} className="flex-1 gap-0.5">
            {col.map((h) => (
              <View key={h.number} className="flex-row items-center border-b border-gray-50 py-1">
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#6b7280', width: 24, textAlign: 'right', marginRight: 4 }}>
                  {ROMAN[h.number - 1]}
                </Text>
                <Text style={{ fontSize: 12, marginRight: 4 }}>{ZODIAC_SYMBOLS[h.sign]}</Text>
                <Text style={{ fontSize: 12, color: '#4b5563', flex: 1 }}>{ZODIAC_KO[h.sign]}</Text>
                <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151' }}>
                  {formatDegree(h.cuspLongitude)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
