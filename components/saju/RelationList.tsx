import React from 'react';
import { View, Text } from 'react-native';
import { ELEMENT_HANJA, PILLAR_NAMES } from '@orrery/core';
import type { AllRelations } from '@orrery/core';
import { formatRelation } from '@/utils/format';

// region [types]
interface RelationListProps {
  relations: AllRelations;
  pillars: string[];   // 간지 [시, 일, 월, 년]
}
// endregion

const PAIR_NAMES: Record<string, string> = {
  '0,1': '時-日', '0,2': '時-月', '0,3': '時-年',
  '1,2': '日-月', '1,3': '日-年', '2,3': '月-年',
};

export default function RelationList({ relations, pillars }: RelationListProps) {
  // region [Privates]
  const lines: { label: string; parts: string[] }[] = [];

  relations.pairs.forEach((rel, key) => {
    const [iStr, jStr] = key.split(',');
    const i = Number(iStr);
    const j = Number(jStr);
    const parts: string[] = [];

    for (const r of rel.stem) {
      const detail = r.detail && ELEMENT_HANJA[r.detail] ? ELEMENT_HANJA[r.detail] : '';
      parts.push(`${pillars[i][0]}${pillars[j][0]}${r.type}${detail}`);
    }
    for (const r of rel.branch) {
      const detail = r.detail && ELEMENT_HANJA[r.detail]
        ? ELEMENT_HANJA[r.detail]
        : r.detail ? `(${r.detail})` : '';
      parts.push(`${pillars[i][1]}${pillars[j][1]}${r.type}${detail}`);
    }

    if (parts.length > 0) {
      lines.push({ label: PAIR_NAMES[key] || key, parts });
    }
  });

  for (const rel of relations.triple) {
    const el = rel.detail && ELEMENT_HANJA[rel.detail] ? ELEMENT_HANJA[rel.detail] : '';
    lines.push({ label: '', parts: [`${rel.type}${el}局`] });
  }

  for (const rel of relations.directional) {
    const el = rel.detail && ELEMENT_HANJA[rel.detail] ? ELEMENT_HANJA[rel.detail] : '';
    lines.push({ label: '', parts: [`${rel.type}${el}`] });
  }

  if (lines.length === 0) return null;
  // endregion

  return (
    <View>
      <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">팔자관계</Text>
      <View className="gap-1">
        {lines.map((line, i) => (
          <View key={i} className="flex-row flex-wrap">
            {line.label ? (
              <Text className="text-md text-gray-400 dark:text-gray-500 mr-2">{line.label}:</Text>
            ) : null}
            <Text className="text-md text-gray-600 dark:text-gray-300">{line.parts.join(', ')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
