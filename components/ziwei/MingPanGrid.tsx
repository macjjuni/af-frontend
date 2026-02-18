import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { MAIN_STAR_NAMES, LUCKY_STAR_NAMES, SHA_STAR_NAMES, getDaxianList } from '@orrery/core';
import type { ZiweiChart, ZiweiPalace } from '@orrery/core';

// region [types]
interface MingPanGridProps {
  chart: ZiweiChart;
}
// endregion

/** 지지 → 그리드 위치 (1-based row, col) — orrery 웹앱 동일 */
const ZHI_GRID: Record<string, [number, number]> = {
  '巳': [1, 1], '午': [1, 2], '未': [1, 3], '申': [1, 4],
  '辰': [2, 1],                               '酉': [2, 4],
  '卯': [3, 1],                               '戌': [3, 4],
  '寅': [4, 1], '丑': [4, 2], '子': [4, 3], '亥': [4, 4],
};

const DI_ZHI_LIST = ['巳', '午', '未', '申', '辰', '酉', '卯', '戌', '寅', '丑', '子', '亥'];

function siHuaColor(siHua: string): string {
  switch (siHua) {
    case '化祿': return '#16a34a';
    case '化權': return '#ca8a04';
    case '化科': return '#2563eb';
    case '化忌': return '#dc2626';
    default: return '#374151';
  }
}

function brightnessColor(b: string): string {
  if (b === '廟' || b === '旺') return '#16a34a';
  if (b === '陷') return '#ef4444';
  return '#6b7280';
}

function getPalaceByZhi(chart: ZiweiChart, zhi: string): ZiweiPalace | undefined {
  return Object.values(chart.palaces).find((p) => p.zhi === zhi);
}

export default function MingPanGrid({ chart }: MingPanGridProps) {
  // region [Privates]
  const { width } = useWindowDimensions();
  const gridWidth = width - 32;
  const cellSize = Math.floor(gridWidth / 4);

  const daxianList = getDaxianList(chart);
  const daxianByZhi = new Map<string, string>();
  for (const dx of daxianList) {
    const palace = chart.palaces[dx.palaceName];
    if (palace) daxianByZhi.set(palace.zhi, `${dx.ageStart}-${dx.ageEnd}歲`);
  }

  let shenPalaceName = '';
  for (const p of Object.values(chart.palaces)) {
    if (p.isShenGong) { shenPalaceName = p.name; break; }
  }
  // endregion

  return (
    <View style={{ width: gridWidth, height: cellSize * 4, position: 'relative' }}>
      {/* 12 궁 — 각자 절대 위치 */}
      {DI_ZHI_LIST.map((zhi) => {
        const pos = ZHI_GRID[zhi];
        const left = (pos[1] - 1) * cellSize;
        const top = (pos[0] - 1) * cellSize;
        const palace = getPalaceByZhi(chart, zhi);
        if (!palace) return null;

        const mainStars = palace.stars.filter((s) => MAIN_STAR_NAMES.has(s.name));
        const luckyStars = palace.stars.filter((s) => LUCKY_STAR_NAMES.has(s.name));
        const shaStars = palace.stars.filter((s) => SHA_STAR_NAMES.has(s.name));
        const daxianRange = daxianByZhi.get(palace.zhi);

        return (
          <View
            key={zhi}
            style={{
              position: 'absolute',
              left,
              top,
              width: cellSize,
              height: cellSize,
              borderWidth: 1,
              borderColor: '#d1d5db',
              padding: 4,
              overflow: 'hidden',
            }}
          >
            {/* 궁명 + 간지 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#374151' }}>
                {palace.name}
                {palace.isShenGong ? (
                  <Text style={{ color: '#7c3aed' }}>·身</Text>
                ) : null}
              </Text>
              <Text style={{ fontSize: 8, color: '#9ca3af' }}>{palace.ganZhi}</Text>
            </View>

            {/* 주성 */}
            {mainStars.length > 0 ? (
              mainStars.map((s) => (
                <View key={s.name} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 10, color: '#1f2937' }}>{s.name}</Text>
                  {s.brightness ? (
                    <Text style={{ fontSize: 9, color: brightnessColor(s.brightness) }}>
                      {s.brightness}
                    </Text>
                  ) : null}
                  {s.siHua ? (
                    <Text style={{ fontSize: 9, color: siHuaColor(s.siHua) }}>{s.siHua}</Text>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 10, color: '#9ca3af' }}>(空宮)</Text>
            )}

            {/* 보성/살성 */}
            {luckyStars.length > 0 && (
              <Text style={{ fontSize: 9, color: '#16a34a' }} numberOfLines={1}>
                {luckyStars.map((s) => s.name).join(' ')}
              </Text>
            )}
            {shaStars.length > 0 && (
              <Text style={{ fontSize: 9, color: '#ef4444' }} numberOfLines={1}>
                {shaStars.map((s) => s.name).join(' ')}
              </Text>
            )}

            {/* 대한 나이 */}
            {daxianRange && (
              <Text style={{ fontSize: 9, color: '#9ca3af', textAlign: 'right', marginTop: 2 }}>
                {daxianRange}
              </Text>
            )}
          </View>
        );
      })}

      {/* 중앙 2×2 정보 패널 */}
      <View
        style={{
          position: 'absolute',
          left: cellSize,
          top: cellSize,
          width: cellSize * 2,
          height: cellSize * 2,
          borderWidth: 1,
          borderColor: '#d1d5db',
          padding: 8,
          justifyContent: 'center',
        }}
      >
        <InfoRow label="陽曆" value={`${chart.solarYear}年 ${chart.solarMonth}月 ${chart.solarDay}日 ${chart.hour}時`} />
        <InfoRow label="陰曆" value={`${chart.lunarYear}年 ${chart.lunarMonth}月 ${chart.lunarDay}日${chart.isLeapMonth ? ' (閏)' : ''}`} />
        <InfoRow label="性別" value={chart.isMale ? '男' : '女'} />
        <InfoRow label="年柱" value={`${chart.yearGan}${chart.yearZhi}`} />
        <InfoRow label="命宮" value={chart.palaces['命宮']?.ganZhi ?? ''} />
        <InfoRow label="身宮" value={`${shenPalaceName}(${chart.shenGongZhi})`} />
        <InfoRow label="五行局" value={chart.wuXingJu.name} />
        <InfoRow label="大限" value={`${chart.daXianStartAge}歲~`} />
      </View>
    </View>
  );
}

// region [Sub Component - InfoRow]
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 1 }}>
      <Text style={{ fontSize: 9, color: '#9ca3af', width: 28 }}>{label}:</Text>
      <Text style={{ fontSize: 9, color: '#4b5563', flex: 1 }}>{value}</Text>
    </View>
  );
}
// endregion
