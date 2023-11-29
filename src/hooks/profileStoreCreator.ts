import { type StateCreator } from "zustand";
import { type CalendarStore } from "./calendarStoreCreator";

export interface ProfileStore {
  profile: string | null;
  setProfile: (profile: string) => void;
}

export const profileStoreCreator: StateCreator<
  CalendarStore & ProfileStore,
  [],
  [],
  ProfileStore
> = (set, get) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
});
