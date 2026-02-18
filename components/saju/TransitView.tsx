import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { findTransits } from '@orrery/core';
import { formatRelation } from '@/utils/format';

// region [types]
interface TransitViewProps {
  natalPillars: string[];   // [시주, 일주, 월주, 년주]
}
// endregion

const MONTH_OPTIONS = [1, 3, 6] as const;

export default function TransitView({ natalPillars }: TransitViewProps) {
  // region [hooks]
  const [months, setMonths] = useState<1 | 3 | 6>(1);
  const [backward, setBackward] = useState(false);
  // endregion

  // region [Privates]
  const transits = useMemo(
    () => findTransits(natalPillars, months, backward),
    [natalPillars, months, backward]
  );

  function formatDate(date: Date): string {
    const m = String(date.getMonth() + 1).padStart(2, ' ');
    const d = String(date.getDate()).padStart(2, ' ');
    return `${m}월 ${d}일`;
  }
  // endregion

  return (
    <View>
      {/* 헤더 */}
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-md font-semibold text-gray-700">운세</Text>
        <View className="flex-row gap-1">
          {MONTH_OPTIONS.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMonths(m)}
              className={`px-2 py-0.5 rounded border ${
                months === m ? 'bg-gray-700 border-gray-700' : 'border-gray-300'
              }`}
            >
              <Text style={{ fontSize: 11, color: months === m ? '#fff' : '#6b7280' }}>
                {m}개월
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setBackward(!backward)}
          className={`px-2 py-0.5 rounded border ${
            backward ? 'bg-gray-100 border-gray-400' : 'border-gray-300'
          }`}
        >
          <Text style={{ fontSize: 11, color: '#6b7280' }}>{backward ? '과거' : '미래'}</Text>
        </TouchableOpacity>
      </View>

      {/* 트랜짓 목록 */}
      {transits.length === 0 ? (
        <Text className="text-sm text-gray-400">
          ({backward ? '과거' : '향후'} {months}개월간 특별한 관계 없음)
        </Text>
      ) : (
        <View className="gap-0.5">
          {transits.map((tr, i) => {
            const relStrs = tr.relations.map((r) => `${r.prefix}${formatRelation(r.relation)}`);
            return (
              <View key={i} className="flex-row items-center gap-1">
                <Text style={{ fontSize: 11, color: '#9ca3af', width: 60 }}>
                  {formatDate(tr.date)}
                </Text>
                <Text style={{
                  fontSize: 11, width: 28,
                  color: tr.type === '月運' ? '#2563eb' : '#6b7280',
                }}>
                  {tr.type}
                </Text>
                <Text style={{ fontSize: 12, width: 20, color: '#374151' }}>{tr.transit}</Text>
                <Text style={{ fontSize: 11, color: '#9ca3af' }}>↔</Text>
                <Text style={{ fontSize: 11, width: 28, color: '#6b7280' }}>{tr.natalName}</Text>
                <Text style={{ fontSize: 11, color: '#374151', flex: 1 }}>
                  {relStrs.join(', ')}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
