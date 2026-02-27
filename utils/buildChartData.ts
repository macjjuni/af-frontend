import { calculateSaju, createChart, calculateNatal } from '@orrery/core';
import type { BirthForm } from '@/store/useAppStore';
import { sajuToText, ziweiToText, natalToText } from './textExport';
import { getCompressedFortuneText } from '@/utils/fortune-compression.ts'

/**
 * BirthForm 데이터를 받아서 사주/자미/네이탈 차트 데이터를 텍스트로 생성
 * @param birthForm - 생년월일시 정보
 * @returns 차트 데이터 텍스트
 */
export async function buildChartData(birthForm: BirthForm): Promise<string> {
  // 1. 데이터 생성
  const sajuRaw = sajuToText(calculateSaju(birthForm));

  let ziweiRaw = '';
  if (!birthForm.unknownTime) {
    const chart = createChart(
      birthForm.year, birthForm.month, birthForm.day,
      birthForm.hour, birthForm.minute, birthForm.gender === 'M'
    );
    ziweiRaw = ziweiToText(chart);
  }

  const natalRaw = natalToText(await calculateNatal(birthForm));

  // 2. 압축 함수 호출 (Transactions 영역 함수 사용)
  const compressedResult = getCompressedFortuneText(sajuRaw, ziweiRaw, natalRaw);
  // 성별 태그가 필요하다면 붙여서 반환
  const prefix = birthForm.gender === 'M' ? '# 남성' : '# 여성';

  return `${prefix}\n${compressedResult}`;
}
