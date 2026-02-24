import { Ionicons } from '@expo/vector-icons';

export interface OnboardingPage {
  id: number;
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  lottieSource?: any;
}

export const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    id: 1,
    title: 'AI가 읽어주는 나의 운명',
    description: '사주·자미두수·점성술을 통합 분석하여 \n AI가 당신의 미래를 입체적으로 읽어드립니다.',
    lottieSource: require('@/assets/lotties/ai.json'),
  },
  {
    id: 2,
    title: '더 정교한 분석의 시작',
    description: '정확한 생년월일시와 출생지는 AI가 당신의 운명을 더 세밀하게 파악하는 단서가 됩니다.',
    iconName: 'calendar',
    iconColor: '#7c3aed',
  },
  {
    id: 3,
    title: '개인정보 보호',
    description: '입력한 정보는 오직 분석 목적으로만 사용되며\n안전하게 관리됩니다.',
    iconName: 'shield-checkmark',
    iconColor: '#7c3aed',
  },
];
