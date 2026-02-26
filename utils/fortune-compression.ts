// region [Privates]
/**
 * 원본 텍스트 전처리 함수
 *
 * 처리 내용:
 * - 각 줄의 앞뒤 공백 제거 (trim)
 * - 빈 줄 삭제
 * - 장식용 구분선(─, ═) 제거
 *
 * @param text - 정제할 원본 텍스트
 * @returns 정제된 텍스트 (줄바꿈 유지)
 */
const cleanRawText = (text: string): string => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.includes('──') && !line.includes('══'))
    .join('\n');
};

/**
 * 사주 명식 데이터 압축
 *
 * 압축 전략:
 * - 한자 용어를 단축어로 변환: 십신→신, 천간→천, 지지→지, 운성→운, 장간→장
 * - 연속된 공백을 단일 공백으로 통합
 * - 표 구조와 모든 한자 데이터는 100% 유지
 *
 * @param text - 사주 원본 텍스트 (orrery 출력 형식)
 * @returns 압축된 사주 텍스트
 */
const compressSajuRaw = (text: string): string => {
  if (!text) return '';
  return cleanRawText(text)
    .replace(/십신/g, '신').replace(/천간/g, '천').replace(/지지/g, '지')
    .replace(/운성/g, '운').replace(/장간/g, '장')
    .replace(/\s{2,}/g, ' ');
};

/**
 * 자미두수 명반 데이터 압축
 *
 * 압축 전략:
 * - 불필요한 헤더 제거: 十二宮(십이궁), 四化(사화), 大限(대한)
 * - 12궁의 모든 별(星) 데이터와 사화 정보는 100% 유지
 * - 연속 공백 단일화
 *
 * @param text - 자미두수 원본 텍스트 (orrery 출력 형식)
 * @returns 압축된 자미두수 텍스트
 */
const compressZiweiRaw = (text: string): string => {
  if (!text) return '';
  return cleanRawText(text)
    .replace(/十二宮|四化|大限/g, '')
    .replace(/\s{2,}/g, ' ');
};

/**
 * 서양 점성술 네이탈 차트 데이터 압축
 *
 * 압축 전략:
 * - 별자리 이름을 3글자 약어로 변환 (Sagittarius→Sag, Capricorn→Cap 등)
 * - 불필요한 섹션 헤더 제거: Major Aspects, Planets, Houses, Angles
 * - orb 키워드를 @로 대체하여 토큰 절약
 * - 모든 천체 위치(도수), 하우스, 애스펙트 각도는 100% 보존
 *
 * @param text - 네이탈 차트 원본 텍스트 (orrery 출력 형식)
 * @returns 압축된 네이탈 차트 텍스트
 */
const compressNatalRaw = (text: string): string => {
  if (!text) return '';
  const zodiacs: Record<string, string> = {
    Sagittarius: 'Sag', Capricorn: 'Cap', Aquarius: 'Aqu', Pisces: 'Pis',
    Aries: 'Ari', Taurus: 'Tau', Gemini: 'Gem', Cancer: 'Can',
    Leo: 'Leo', Virgo: 'Vir', Libra: 'Lib', Scorpio: 'Sco'
  };

  let cleaned = cleanRawText(text);
  Object.entries(zodiacs).forEach(([full, short]) => {
    cleaned = cleaned.replace(new RegExp(full, 'g'), short);
  });

  return cleaned.replace(/Major Aspects|Planets|Houses|Angles/g, '')
    .replace(/orb\s+/g, '@')
    .replace(/\s{2,}/g, ' ');
};
// endregion

// region [Transactions]
/**
 * 사주/자미두수/서양점성술 데이터를 통합 압축
 *
 * 특징:
 * - 각 시스템의 압축 함수를 호출하여 개별 처리
 * - 섹션별 명확한 구분자 적용: [SAJU], [ZWDS], [NATAL]
 * - 데이터 손실 없이 토큰 사용량만 최적화
 * - 빈 섹션은 자동으로 제외
 *
 * @param saju - 사주 원본 텍스트
 * @param ziwei - 자미두수 원본 텍스트
 * @param natal - 네이탈 차트 원본 텍스트
 * @returns 통합 압축된 운세 데이터 (섹션별 \n\n 구분)
 */
export const getCompressedFortuneText = (saju: string, ziwei: string, natal: string): string => {
  const sajuPart = compressSajuRaw(saju);
  const ziweiPart = compressZiweiRaw(ziwei);
  const natalPart = compressNatalRaw(natal);

  return [
    sajuPart ? `[SAJU]\n${sajuPart}` : '',
    ziweiPart ? `[ZWDS]\n${ziweiPart}` : '',
    natalPart ? `[NATAL]\n${natalPart}` : ''
  ].filter(Boolean).join('\n\n');
};
// endregion