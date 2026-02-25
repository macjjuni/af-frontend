import { calculateSaju, createChart, calculateNatal } from '@orrery/core';
import type { BirthForm } from '@/store/useAppStore';
import { sajuToText, ziweiToText, natalToText } from './textExport';

/**
 * BirthForm 데이터를 받아서 사주/자미/네이탈 차트 데이터를 텍스트로 생성
 * @param birthForm - 생년월일시 정보
 * @returns 차트 데이터 텍스트
 */
export async function buildChartData(birthForm: BirthForm): Promise<string> {
  const sajuData = calculateSaju(birthForm);
  const parts = [sajuToText(sajuData)];

  // 시간을 아는 경우에만 자미두수 계산
  if (!birthForm.unknownTime) {
    const chart = createChart(
      birthForm.year,
      birthForm.month,
      birthForm.day,
      birthForm.hour,
      birthForm.minute,
      birthForm.gender === 'M'
    );
    parts.push(ziweiToText(chart));
  }

  // 서양 점성술 네이탈 차트 계산
  const natal = await calculateNatal(birthForm);
  parts.push(natalToText(natal));

  return parts.join('\n\n');
}
