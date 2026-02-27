import { create } from 'zustand';

// region [types]
export interface FortuneResult {
  result: string;
  remainingQuota: number;
}

interface FortuneState {
  fortuneResult: FortuneResult | null;
  isLoading: boolean;
  error: string | null;
  setFortuneResult: (result: FortuneResult | null) => void;
  setFortuneLoading: (loading: boolean) => void;
  setFortuneError: (error: string | null) => void;
  clearFortuneResult: () => void;
}
// endregion

const useFortuneStore = create<FortuneState>((set) => ({
  fortuneResult: null,
  isLoading: false,
  error: null,

  // region [Events]
  setFortuneResult: (result) => set({ fortuneResult: result }),
  setFortuneLoading: (loading) => set({ isLoading: loading }),
  setFortuneError: (error) => set({ error }),
  clearFortuneResult: () => set({ fortuneResult: null, error: null }),
  // endregion
}));

export default useFortuneStore;