import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DeviceState = {
  /** Pairing code shown on the headset and typed into the phone once. */
  code: string | null;
  setCode: (code: string | null) => void;
};

// Which VR headset this phone is paired to. The Quest game generates a 6-char
// code, shows it on its menu panel, and the player types it in once (headset →
// phone, because typing in VR is miserable). Everything the app queues or reads
// back is scoped by this string — see supabase/migrations/0004.
//
// Same zustand + AsyncStorage shape as store/saved.ts.
export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      code: null,
      setCode: (code) => set({ code: code ? code.trim().toUpperCase() : null }),
    }),
    {
      name: 'hoa_device',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
