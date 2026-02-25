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

export interface GlobalLoadingState {
  visible: boolean;
  message?: string;
}

interface AppState {
  deviceId: string;
  hasSeenOnboarding: boolean;
  isOnboardingChecked: boolean;
  globalLoading: GlobalLoadingState;
  initDeviceId: () => Promise<void>;
  initOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
}
// endregion

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
  hasSeenOnboarding: false,
  isOnboardingChecked: false,
  globalLoading: { visible: false },

  // region [Events]
  initDeviceId: async () => {
    const deviceId = await getOrCreateDeviceId();
    set({ deviceId });
  },

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
