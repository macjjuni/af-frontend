import { useState, useEffect } from 'react';
import { calculateNatal } from '@orrery/core';
import type { NatalChart, BirthInput } from '@orrery/core';
import type { BirthForm } from '@/store/useAppStore';

interface UseNatalResult {
  chart: NatalChart | null;
  loading: boolean;
  error: string | null;
}

export function useNatal(form: BirthForm | null): UseNatalResult {
  // region [hooks]
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (!form) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

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

    calculateNatal(input, 'P')
      .then((result) => {
        if (!cancelled) {
          setChart(result);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '출생차트 계산 오류');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [form]);
  // endregion

  return { chart, loading, error };
}
