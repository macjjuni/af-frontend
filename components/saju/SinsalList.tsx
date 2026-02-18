import React from 'react';
import { View, Text } from 'react-native';
import { PILLAR_NAMES } from '@orrery/core';
import type { SpecialSals } from '@orrery/core';

interface SinsalListProps {
  sals: SpecialSals;
}

export default function SinsalList({ sals }: SinsalListProps) {
  // region [Privates]
  const items: string[] = [];

  if (sals.yangin.length > 0) {
    const positions = sals.yangin.map((i) => PILLAR_NAMES[i]).join(', ');
    items.push(`양인살(${positions})`);
  }
  if (sals.baekho) items.push('백호살');
  if (sals.goegang) items.push('괴강살');

  if (items.length === 0) return null;
  // endregion

  return (
    <View>
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">신살</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300">{items.join(' · ')}</Text>
    </View>
  );
}
