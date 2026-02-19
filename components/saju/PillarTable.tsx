import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import type { PillarDetail } from '@orrery/core';
import { stemColor, branchColor, stemSolidStyle, branchSolidStyle, elementSolidStyle, stemElement } from '@/utils/format';

// region [types]
interface PillarTableProps {
  pillars: PillarDetail[];   // [시, 일, 월, 년]
  unknownTime?: boolean;
}
// endregion

const LABELS = ['시주', '일주', '월주', '년주'];

export default function PillarTable({ pillars, unknownTime }: PillarTableProps) {
  // region [hooks]
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Privates]
  function isHidden(i: number) { return i === 0 && unknownTime; }
  // endregion

  return (
    <View>
      {/* 헤더 행 */}
      <View className="flex-row mb-1">
        <View className="w-14" />
        {LABELS.map((label) => (
          <View key={label} className="flex-1 items-center">
            <Text className="text-lg mb-2 text-gray-500 dark:text-gray-400">{label}</Text>
          </View>
        ))}
      </View>

      {/* 천간 십신 */}
      <View className="flex-row mb-3">
        <RowLabel>십신</RowLabel>
        {pillars.map((p, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-lg" style={{ color: isHidden(i) ? '#d1d5db' : stemColor(p.pillar.stem) }}>
              {isHidden(i) ? '?' : p.stemSipsin}
            </Text>
          </View>
        ))}
      </View>

      {/* 천간 */}
      <View className="flex-row mb-2">
        <RowLabel>천간</RowLabel>
        {pillars.map((p, i) => {
          const style = stemSolidStyle(p.pillar.stem, isDark);
          return (
            <View key={i} className="flex-1 items-center">
              {isHidden(i) ? (
                <HanjaBox char="?" bg={isDark ? '#374151' : '#f3f4f6'} color="#d1d5db" />
              ) : (
                <HanjaBox char={p.pillar.stem} bg={style.bg} color={style.text} border={style.border} />
              )}
            </View>
          );
        })}
      </View>

      {/* 지지 */}
      <View className="flex-row mb-2">
        <RowLabel>지지</RowLabel>
        {pillars.map((p, i) => {
          const style = branchSolidStyle(p.pillar.branch, isDark);
          return (
            <View key={i} className="flex-1 items-center">
              {isHidden(i) ? (
                <HanjaBox char="?" bg={isDark ? '#374151' : '#f3f4f6'} color="#d1d5db" />
              ) : (
                <HanjaBox char={p.pillar.branch} bg={style.bg} color={style.text} border={style.border} />
              )}
            </View>
          );
        })}
      </View>

      {/* 지지 십신 */}
      <View className="flex-row">
        <RowLabel>십신</RowLabel>
        {pillars.map((p, i) => (
          <View key={i} className="flex-1 items-center mt-1">
            <Text className="text-lg" style={{ color: isHidden(i) ? '#d1d5db' : branchColor(p.pillar.branch) }}>
              {isHidden(i) ? '?' : p.branchSipsin}
            </Text>
          </View>
        ))}
      </View>

      {/* 구분선 */}
      <View className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* 운성 */}
      <View className="flex-row mb-2">
        <RowLabel>운성</RowLabel>
        {pillars.map((p, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-lg" style={{ color: isHidden(i) ? '#d1d5db' : (isDark ? '#9ca3af' : '#4b5563')}}>
              {isHidden(i) ? '?' : p.unseong}
            </Text>
          </View>
        ))}
      </View>

      {/* 신살 */}
      <View className="flex-row mb-1.5">
        <RowLabel>신살</RowLabel>
        {pillars.map((p, i) => (
          <View key={i} className="flex-1 items-center text-lg">
            <Text className="text-lg" style={{ color: isHidden(i) ? '#d1d5db' : (isDark ? '#9ca3af' : '#4b5563')}}>
              {isHidden(i) ? '?' : p.sinsal}
            </Text>
          </View>
        ))}
      </View>

      {/* 지장간 */}
      <View className="flex-row">
        <RowLabel>지장간</RowLabel>
        {pillars.map((p, i) => (
          <View key={i} className="flex-1 items-center flex-row justify-center gap-0.5">
            {isHidden(i) ? (
              <Text style={{ color: '#d1d5db', fontSize: 14 }}>?</Text>
            ) : (
              [...p.jigang].map((ch, j) => {
                if (ch === ' ') return null;
                const el = stemElement(ch);
                const s = elementSolidStyle(el, isDark);
                return (
                  <View
                    key={j}
                    style={{
                      width: 20, height: 20,
                      backgroundColor: s.bg,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: s.border ? 1 : 0,
                      borderColor: s.border ?? 'transparent',
                    }}
                  >
                    <Text className="text-md" style={{ color: s.text}}>{ch}</Text>
                  </View>
                );
              })
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// region [Sub Components]
function RowLabel({ children }: { children: string }) {
  return (
    <View className="w-14 items-center justify-center pr-1">
      <Text className="text-lg text-gray-400 dark:text-gray-500">{children}</Text>
    </View>
  );
}

function HanjaBox({ char, bg, color, border }: { char: string; bg: string; color: string; border?: string }) {
  return (
    <View
      style={{
        width: 48, height: 48,
        backgroundColor: bg,
        borderRadius: 6,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: border ? 1 : 0,
        borderColor: border ?? 'transparent',
      }}
    >
      <Text style={{ color, fontSize: 28, fontWeight: 'bold', lineHeight: 30 }}>{char}</Text>
    </View>
  );
}
// endregion
