import { useMemo } from 'react';
import { calculateSaju } from '@orrery/core';
import type { SajuResult, BirthInput } from '@orrery/core';
import type { BirthForm } from '@/store/useAppStore';

// region [types]
interface UseSajuResult {
  saju: SajuResult | null;
  error: string | null;
}
// endregion

export function useSaju(form: BirthForm | null): UseSajuResult {
  // region [Privates]
  const result = useMemo<UseSajuResult>(() => {
    if (!form) return { saju: null, error: null };

    try {
      const input: BirthInput = {
        year: form.year,
        month: form.month,
        day: form.day,
        hour: form.unknownTime ? 12 : form.hour,
        minute: form.unknownTime ? 0 : form.minute,
        gender: form.gender,
        unknownTime: form.unknownTime,
        latitude: form.latitude,
        longitude: form.longitude,
      };
      return { saju: calculateSaju(input), error: null };
    } catch (e) {
      return { saju: null, error: e instanceof Error ? e.message : '사주 계산 오류' };
    }
  }, [form]);
  // endregion

  return result;
}
