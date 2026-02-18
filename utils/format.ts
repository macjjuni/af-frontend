import { STEM_INFO, BRANCH_ELEMENT, ELEMENT_HANJA, type Element, type RelationResult } from '@orrery/core';

// 오행 색상 (orrery index.css 기준)
export const ELEMENT_COLOR: Record<Element, string> = {
  tree:  '#22c55e',
  fire:  '#ef4444',
  earth: '#eab308',
  metal: '#9ca3af',
  water: '#1a1a1a',
};

// solid 배경색 (천간/지지 박스)
export const ELEMENT_SOLID_BG: Record<Element, { bg: string; text: string; border?: string }> = {
  tree:  { bg: '#22c55e', text: '#fff' },
  fire:  { bg: '#ef4444', text: '#fff' },
  earth: { bg: '#eab308', text: '#1a1a1a' },
  metal: { bg: '#fff',    text: '#000', border: '#d1d5db' },
  water: { bg: '#1a1a1a', text: '#fff' },
};

// 다크모드 solid 배경색 (金만 다름)
export const ELEMENT_SOLID_BG_DARK: Record<Element, { bg: string; text: string; border?: string }> = {
  tree:  { bg: '#22c55e', text: '#fff' },
  fire:  { bg: '#ef4444', text: '#fff' },
  earth: { bg: '#eab308', text: '#1a1a1a' },
  metal: { bg: '#374151', text: '#f9fafb', border: '#6b7280' },
  water: { bg: '#1a1a1a', text: '#fff' },
};

// 15% 투명도 배경색
export const ELEMENT_LIGHT_BG: Record<Element, string> = {
  tree:  'rgba(34,197,94,0.15)',
  fire:  'rgba(239,68,68,0.15)',
  earth: 'rgba(234,179,8,0.15)',
  metal: 'rgba(156,163,175,0.15)',
  water: 'rgba(26,26,26,0.12)',
};

export function stemElement(stem: string): Element | undefined {
  return STEM_INFO[stem]?.element;
}

export function branchElement(branch: string): Element | undefined {
  return BRANCH_ELEMENT[branch];
}

export function stemColor(stem: string): string {
  const el = stemElement(stem);
  return el ? ELEMENT_COLOR[el] : '#374151';
}

export function branchColor(branch: string): string {
  const el = branchElement(branch);
  return el ? ELEMENT_COLOR[el] : '#374151';
}

export function stemSolidStyle(stem: string, isDark = false) {
  const el = stemElement(stem);
  const map = isDark ? ELEMENT_SOLID_BG_DARK : ELEMENT_SOLID_BG;
  return el ? map[el] : (isDark ? { bg: '#374151', text: '#d1d5db' } : { bg: '#f3f4f6', text: '#374151' });
}

export function branchSolidStyle(branch: string, isDark = false) {
  const el = branchElement(branch);
  const map = isDark ? ELEMENT_SOLID_BG_DARK : ELEMENT_SOLID_BG;
  return el ? map[el] : (isDark ? { bg: '#374151', text: '#d1d5db' } : { bg: '#f3f4f6', text: '#374151' });
}

export function elementSolidStyle(element: Element | undefined, isDark = false) {
  const map = isDark ? ELEMENT_SOLID_BG_DARK : ELEMENT_SOLID_BG;
  return element ? map[element] : (isDark ? { bg: '#374151', text: '#d1d5db' } : { bg: '#f3f4f6', text: '#374151' });
}

/** 2글자 한자 포맷 (1글자면 앞에 공백) */
export function fmt2(s: string): string {
  if (s.length === 1) return ` ${s} `;
  return s;
}

export function formatRelation(rel: RelationResult): string {
  if (rel.detail === null) return rel.type;
  if (ELEMENT_HANJA[rel.detail]) return `${rel.type}${ELEMENT_HANJA[rel.detail]}`;
  return `${rel.type}(${rel.detail})`;
}
