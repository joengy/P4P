import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SavedState = {
  saved: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
};

// Ports app.jsx's `saved` array + `toggleSaved(id)`, persisted to
// localStorage under `hoa_saved` in the prototype. Phase 3 replaces the
// AsyncStorage-persist middleware with a Supabase `saved_items` table sync,
// but the store's public API (saved / toggleSaved / isSaved) stays the same.
export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggleSaved: (id) =>
        set((s) => ({
          saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
        })),
      isSaved: (id) => get().saved.includes(id),
    }),
    {
      name: 'hoa_saved',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
