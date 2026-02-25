import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BirthForm } from '@/store/useAppStore';

// region [types]
export interface Profile {
  id: string;
  name?: string;
  birthForm: BirthForm;
  isSelf: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ProfileState {
  profiles: Profile[];
  loadProfiles: () => Promise<void>;
  addProfile: (name: string | undefined, birthForm: BirthForm, isSelf: boolean) => Promise<void>;
  updateProfile: (id: string, name: string | undefined, birthForm: BirthForm, isSelf: boolean) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  clearProfiles: () => Promise<void>;
}
// endregion

// region [Privates]
const PROFILES_KEY = '@af_profiles';

async function saveProfiles(profiles: Profile[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles', e);
  }
}
// endregion

const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],

  // region [Events]
  loadProfiles: async () => {
    try {
      const raw = await AsyncStorage.getItem(PROFILES_KEY);
      if (raw) {
        const profiles: Profile[] = JSON.parse(raw);
        set({ profiles });
      }
    } catch (e) {
      console.error('Failed to load profiles', e);
    }
  },

  addProfile: async (name, birthForm, isSelf) => {
    const now = Date.now();
    const newProfile: Profile = {
      id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      birthForm,
      isSelf,
      createdAt: now,
      updatedAt: now,
    };
    // isSelf가 true면 기존 프로필들의 isSelf를 false로 변경
    const existingProfiles = isSelf
      ? get().profiles.map((p) => ({ ...p, isSelf: false }))
      : get().profiles;
    const updated = [...existingProfiles, newProfile];
    set({ profiles: updated });
    await saveProfiles(updated);
  },

  updateProfile: async (id, name, birthForm, isSelf) => {
    const updated = get().profiles.map((p) => {
      if (p.id === id) {
        return { ...p, name, birthForm, isSelf, updatedAt: Date.now() };
      }
      // 현재 프로필을 본인으로 설정하면 다른 프로필들은 false로
      return isSelf ? { ...p, isSelf: false } : p;
    });
    set({ profiles: updated });
    await saveProfiles(updated);
  },

  deleteProfile: async (id) => {
    const updated = get().profiles.filter((p) => p.id !== id);
    set({ profiles: updated });
    await saveProfiles(updated);
  },

  clearProfiles: async () => {
    set({ profiles: [] });
    await saveProfiles([]);
  },
  // endregion
}));

export default useProfileStore;
