import React, { useRef } from 'react';
import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { HGANJI, getRelation, getJeonggi, getTwelveMeteor, getTwelveSpirit } from '@orrery/core';
import type { DaewoonItem } from '@orrery/core';
import { stemSolidStyle, branchSolidStyle, stemColor, branchColor } from '@/utils/format';

// region [types]
interface SewoonListProps {
  birthYear: number;
  daewoon: DaewoonItem[];
  dayStem: string;
  yearBranch: string;
}

interface SewoonGroup {
  daewoonIdx: number;  // -1 = 대운 이전
  daewoonGanzi: string;
  years: number[];
}
// endregion

// 레이아웃 상수
const ITEM_W = 40;    // 아이템 너비 (패딩 포함: 32 content + 4+4)
const ITEM_GAP = 4;   // 아이템 간격
const GROUP_GAP = 8;  // 그룹 간격
const BORDER_PAD = 9; // borderLeftWidth(1) + paddingLeft(8)

function getYearGanzi(year: number): string {
  return HGANJI[((year - 1984) % 60 + 60) % 60];
}

function getSipsin(dayStem: string, stem: string): string {
  const rel = getRelation(dayStem, stem);
  return rel ? rel.hanja : '?';
}

function findDaewoonIndex(year: number, daewoon: DaewoonItem[]): number {
  let idx = -1;
  for (let i = 0; i < daewoon.length; i++) {
    if (daewoon[i].startDate.getFullYear() <= year) idx = i;
  }
  return idx;
}

function buildSewoonGroups(birthYear: number, daewoon: DaewoonItem[]): SewoonGroup[] {
  const groups: SewoonGroup[] = [];
  let current: SewoonGroup | null = null;

  for (let y = birthYear; y < birthYear + 100; y++) {
    const dwIdx = findDaewoonIndex(y, daewoon);
    const dwGanzi = dwIdx >= 0 ? daewoon[dwIdx].ganzi : '';

    if (!current || current.daewoonIdx !== dwIdx) {
      if (current) groups.push(current);
      current = { daewoonIdx: dwIdx, daewoonGanzi: dwGanzi, years: [y] };
    } else {
      current.years.push(y);
    }
  }
  if (current) groups.push(current);

  return groups;
}

/**
 * 역순 렌더링 기준으로 currentYear 아이템의 x 좌표를 계산
 * 그룹 경계(border + padding)와 gap을 모두 반영
 */
function calcActiveOffset(groups: SewoonGroup[], currentYear: number): number {
  const reversed = [...groups].reverse();
  const lastGi = reversed.length - 1;
  let xGroupStart = 0;

  for (let gi = 0; gi <= lastGi; gi++) {
    const group = reversed[gi];
    const extra = gi < lastGi ? BORDER_PAD : 0;
    const n = group.years.length;
    const groupContentW = n * ITEM_W + (n - 1) * ITEM_GAP;

    if (group.years.includes(currentYear)) {
      const yearIdx = [...group.years].reverse().indexOf(currentYear);
      return xGroupStart + extra + yearIdx * (ITEM_W + ITEM_GAP);
    }

    xGroupStart += extra + groupContentW + GROUP_GAP;
  }

  return -1;
}

export default function SewoonList({ birthYear, daewoon, dayStem, yearBranch }: SewoonListProps) {
  // region [hooks]
  const scrollRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Privates]
  const currentYear = new Date().getFullYear();
  const groups = buildSewoonGroups(birthYear, daewoon);
  const activeOffset = calcActiveOffset(groups, currentYear);
  const secondaryTextColor = isDark ? '#9ca3af' : '#6b7280';
  const groupBorderColor = isDark ? '#4b5563' : '#99a1af';
  // endregion

  // region [Events]
  function handleContentSizeChange() {
    if (activeOffset >= 0) {
      scrollRef.current?.scrollTo({ x: Math.max(0, activeOffset - 80), animated: false });
    }
  }
  // endregion

  return (
    <View>
      <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">세운</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={handleContentSizeChange}
      >
        <View style={{ flexDirection: 'row', gap: GROUP_GAP, paddingVertical: 4 }}>
          {[...groups].reverse().map((group, gi) => (
            <View
              key={gi}
              style={{
                borderLeftWidth: gi < groups.length - 1 ? 1 : 0,
                borderLeftColor: groupBorderColor,
                paddingLeft: gi < groups.length - 1 ? 8 : 0,
              }}
            >
              {/* 대운 구간 레이블 */}
              <Text style={{
                fontSize: 10,
                color: '#9ca3af',
                textAlign: 'center',
                marginBottom: 4,
                fontWeight: '600',
              }}>
                {group.daewoonGanzi || '대운 전'}
              </Text>

              {/* 해당 구간의 세운 목록 */}
              <View style={{ flexDirection: 'row', gap: ITEM_GAP }}>
                {[...group.years].reverse().map((year) => {
                  const ganzi = getYearGanzi(year);
                  const stem = ganzi[0];
                  const branch = ganzi[1];
                  const stemSipsin = getSipsin(dayStem, stem);
                  const branchSipsin = getSipsin(dayStem, getJeonggi(branch));
                  const unseong = getTwelveMeteor(dayStem, branch);
                  const sinsal = getTwelveSpirit(yearBranch, branch);
                  const age = year - birthYear;
                  const isActive = year === currentYear;
                  const stemStyle = stemSolidStyle(stem, isDark);
                  const branchStyle = branchSolidStyle(branch, isDark);

                  return (
                    <View
                      key={year}
                      style={isActive ? {
                        borderRadius: 8, padding: 4,
                        borderWidth: 2, borderColor: '#fbbf24',
                        backgroundColor: isDark ? '#292012' : '#fffbeb',
                      } : { borderRadius: 8, padding: 4 }}
                    >
                      <Text style={{ fontSize: 10, color: secondaryTextColor, textAlign: 'center' }}>{age}세</Text>
                      <Text style={{ fontSize: 11, color: stemColor(stem), textAlign: 'center' }}>
                        {stemSipsin}
                      </Text>
                      {/* 천간 박스 */}
                      <View style={{
                        width: 32, height: 32, borderRadius: 4, marginVertical: 2,
                        backgroundColor: stemStyle.bg, alignItems: 'center', justifyContent: 'center',
                        borderWidth: stemStyle.border ? 1 : 0, borderColor: stemStyle.border ?? 'transparent',
                      }}>
                        <Text style={{ color: stemStyle.text, fontSize: 16, fontWeight: 'bold' }}>
                          {stem}
                        </Text>
                      </View>
                      {/* 지지 박스 */}
                      <View style={{
                        width: 32, height: 32, borderRadius: 4, marginBottom: 2,
                        backgroundColor: branchStyle.bg, alignItems: 'center', justifyContent: 'center',
                        borderWidth: branchStyle.border ? 1 : 0, borderColor: branchStyle.border ?? 'transparent',
                      }}>
                        <Text style={{ color: branchStyle.text, fontSize: 16, fontWeight: 'bold' }}>
                          {branch}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 11, color: branchColor(branch), textAlign: 'center' }}>
                        {branchSipsin}
                      </Text>
                      <Text style={{ fontSize: 10, color: secondaryTextColor, textAlign: 'center' }}>{unseong}</Text>
                      <Text style={{ fontSize: 10, color: secondaryTextColor, textAlign: 'center' }}>{sinsal}</Text>
                      <Text style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center' }}>{year}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
