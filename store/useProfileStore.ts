import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BirthForm } from '@/store/useAppStore';

// region [types]
export interface Profile {
  id: string;
  name?: string;
  birthForm: BirthForm;
  createdAt: number;
  updatedAt: number;
}

interface ProfileState {
  profiles: Profile[];
  loadProfiles: () => Promise<void>;
  addProfile: (name: string | undefined, birthForm: BirthForm) => Promise<void>;
  updateProfile: (id: string, name: string | undefined, birthForm: BirthForm) => Promise<void>;
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

  addProfile: async (name, birthForm) => {
    const now = Date.now();
    const newProfile: Profile = {
      id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      birthForm,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...get().profiles, newProfile];
    set({ profiles: updated });
    await saveProfiles(updated);
  },

  updateProfile: async (id, name, birthForm) => {
    const updated = get().profiles.map((p) =>
      p.id === id ? { ...p, name, birthForm, updatedAt: Date.now() } : p
    );
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
