import { type StateCreator } from "zustand";
import { getOrThrow } from "~/utils/utils";
import { type useClubQuery } from "./calendarTrpcHooks";

export interface SearchStore {
  // trpc mutations and queries
  clubQuery: ReturnType<typeof useClubQuery> | undefined;
  // getters
  getClubQuery: () => ReturnType<typeof useClubQuery>;
  // setters
  setClubQuery: (clubQuery: ReturnType<typeof useClubQuery>) => void;
}

export const searchStoreCreator: StateCreator<
  SearchStore /* `& CalendarStore & ProfileStore` <- not needed anymore? */,
  [],
  [],
  SearchStore
> = (set, get) => ({
  // trpc mutations and queries
  clubQuery: undefined,
  // getters
  getClubQuery: () => {
    return getOrThrow(() => get().clubQuery);
  },
  // setters
  setClubQuery: (clubQuery: ReturnType<typeof useClubQuery>) => {
    set(() => ({ clubQuery }));
  },
});
