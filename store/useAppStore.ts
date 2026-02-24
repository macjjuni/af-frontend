import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Gender } from '@orrery/core';

// region [types]
export interface BirthForm {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  unknownTime: boolean;
  latitude: number;
  longitude: number;
  cityName: string;
}

export interface FortuneResult {
  result: string;
  remainingQuota: number;
}

export interface GlobalLoadingState {
  visible: boolean;
  message?: string;
}

interface AppState {
  deviceId: string;
  birthForm: BirthForm;
  fortuneResult: FortuneResult | null;
  hasSeenOnboarding: boolean;
  isOnboardingChecked: boolean;
  globalLoading: GlobalLoadingState;
  initDeviceId: () => Promise<void>;
  setBirthForm: (form: Partial<BirthForm>) => void;
  resetBirthForm: () => void;
  setFortuneResult: (result: FortuneResult | null) => void;
  initOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
}
// endregion

// 서울 기본값
const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.9780;

function getDefaultBirthForm(): BirthForm {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: 12,
    minute: 0,
    gender: 'M',
    unknownTime: false,
    latitude: SEOUL_LAT,
    longitude: SEOUL_LON,
    cityName: '서울',
  };
}

const DEFAULT_BIRTH_FORM: BirthForm = getDefaultBirthForm();

// region [Privates]
const ONBOARDING_KEY = '@af_has_seen_onboarding';

async function getOrCreateDeviceId(): Promise<string> {
  // Android: getAndroidId는 기기+계정에 종속되어 재설치 후에도 유지됨
  if (Platform.OS === 'android') {
    const androidId = Application.getAndroidId();
    if (androidId) return `android-${androidId}`;
  }

  // iOS: Vendor ID는 동일 개발사 앱이 하나라도 설치되어 있으면 재설치 후에도 유지됨
  if (Platform.OS === 'ios') {
    const vendorId = await Application.getIosIdForVendorAsync();
    if (vendorId) return `ios-${vendorId}`;
  }

  return `device-${Platform.OS}-${Date.now()}`;
}

async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

async function saveOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (e) {
    console.error('Failed to save onboarding status', e);
  }
}
// endregion

const useAppStore = create<AppState>((set) => ({
  deviceId: '',
  birthForm: DEFAULT_BIRTH_FORM,
  fortuneResult: null,
  hasSeenOnboarding: false,
  isOnboardingChecked: false,
  globalLoading: { visible: false },

  // region [Events]
  initDeviceId: async () => {
    const deviceId = await getOrCreateDeviceId();
    set({ deviceId });
  },

  setBirthForm: (form) =>
    set((state) => ({ birthForm: { ...state.birthForm, ...form } })),

  resetBirthForm: () => set({ birthForm: getDefaultBirthForm() }),

  setFortuneResult: (result) => set({ fortuneResult: result }),

  initOnboarding: async () => {
    const hasSeenOnboarding = await checkOnboardingStatus();
    set({ hasSeenOnboarding, isOnboardingChecked: true });
  },

  completeOnboarding: async () => {
    await saveOnboardingComplete();
    set({ hasSeenOnboarding: true });
  },

  showGlobalLoading: (message) => set({ globalLoading: { visible: true, message } }),

  hideGlobalLoading: () => set({ globalLoading: { visible: false } }),
  // endregion
}));

export default useAppStore;
