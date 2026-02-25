import { create } from 'zustand';

// region [types]
export interface FortuneResult {
  result: string;
  remainingQuota: number;
}

interface FortuneState {
  fortuneResult: FortuneResult | null;
  setFortuneResult: (result: FortuneResult | null) => void;
  clearFortuneResult: () => void;
}
// endregion

const useFortuneStore = create<FortuneState>((set) => ({
  fortuneResult: null,

  // region [Events]
  setFortuneResult: (result) => set({ fortuneResult: result }),
  clearFortuneResult: () => set({ fortuneResult: null }),
  // endregion
}));

export default useFortuneStore;