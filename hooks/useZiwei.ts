import { useMemo } from 'react';
import { createChart } from '@orrery/core';
import type { ZiweiChart } from '@orrery/core';
import type { BirthForm } from '@/store/useAppStore';

interface UseZiweiResult {
  chart: ZiweiChart | null;
  error: string | null;
}

export function useZiwei(form: BirthForm | null): UseZiweiResult {
  // region [Privates]
  const result = useMemo<UseZiweiResult>(() => {
    if (!form) return { chart: null, error: null };
    try {
      const chart = createChart(
        form.year, form.month, form.day,
        form.unknownTime ? 12 : form.hour,
        form.unknownTime ? 0 : form.minute,
        form.gender === 'M'
      );
      return { chart, error: null };
    } catch (e) {
      return { chart: null, error: e instanceof Error ? e.message : '자미두수 계산 오류' };
    }
  }, [form]);
  // endregion

  return result;
}
