import React from 'react';
import { View, Text } from 'react-native';
import { PLANET_SYMBOLS, PLANET_KO, ZODIAC_SYMBOLS, ZODIAC_KO, ROMAN, formatDegree } from '@orrery/core';
import type { PlanetPosition, NatalAngles } from '@orrery/core';

interface PlanetTableProps {
  planets: PlanetPosition[];
  angles: NatalAngles | null;
}

export default function PlanetTable({ planets, angles }: PlanetTableProps) {
  // region [Privates]
  const showHouse = planets.some((p) => p.house != null);
  // endregion

  return (
    <View>
      <Text className="text-sm font-medium text-gray-500 mb-2">Planets</Text>

      {/* 헤더 */}
      <View className="flex-row border-b border-gray-100 pb-1 mb-1">
        <Text style={{ fontSize: 11, color: '#9ca3af', width: 100 }}>행성</Text>
        <Text style={{ fontSize: 11, color: '#9ca3af', flex: 1 }}>별자리</Text>
        <Text style={{ fontSize: 11, color: '#9ca3af', width: 70, textAlign: 'right' }}>도수</Text>
        <Text style={{ fontSize: 11, color: '#9ca3af', width: 20, textAlign: 'center' }}>Rx</Text>
        {showHouse && (
          <Text style={{ fontSize: 11, color: '#9ca3af', width: 24, textAlign: 'center' }}>H</Text>
        )}
      </View>

      {planets.map((p) => (
        <View key={p.id} className="flex-row items-center py-1.5 border-b border-gray-50">
          <View style={{ width: 100, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, width: 20 }}>{PLANET_SYMBOLS[p.id]}</Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>{PLANET_KO[p.id]}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, marginRight: 4 }}>{ZODIAC_SYMBOLS[p.sign]}</Text>
            <Text style={{ fontSize: 12, color: '#4b5563' }}>{ZODIAC_KO[p.sign]}</Text>
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', width: 70, textAlign: 'right' }}>
            {formatDegree(p.longitude)}
          </Text>
          <Text style={{ fontSize: 11, color: '#ef4444', width: 20, textAlign: 'center' }}>
            {p.isRetrograde ? 'R' : ''}
          </Text>
          {showHouse && (
            <Text style={{ fontSize: 11, color: '#4b5563', width: 24, textAlign: 'center' }}>
              {p.house != null ? ROMAN[p.house - 1] : ''}
            </Text>
          )}
        </View>
      ))}

      {/* Angles */}
      {angles && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-sm font-medium text-gray-500 mb-2">Angles</Text>
          <View className="gap-1">
            {(
              [
                ['ASC', angles.asc],
                ['MC',  angles.mc],
                ['DESC', angles.desc],
                ['IC',  angles.ic],
              ] as const
            ).map(([label, a]) => (
              <View key={label} className="flex-row items-center gap-2">
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', width: 40 }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 13 }}>{ZODIAC_SYMBOLS[a.sign]}</Text>
                <Text style={{ fontSize: 12, color: '#4b5563', flex: 1 }}>{ZODIAC_KO[a.sign]}</Text>
                <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151' }}>
                  {formatDegree(a.longitude)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
