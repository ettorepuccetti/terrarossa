import { type StateCreator } from "zustand";
import { type RouterOutputs } from "~/utils/api";
import { getOrThrow } from "~/utils/utils";
import { type CalendarStore } from "./calendarStoreCreator";
import {
  type useGetSignedUrl,
  type useMyReservationsQuery,
  type useUpdateImageSrc,
  type useUpdateUsername,
  type useUserQuery,
} from "./profileTrpcHooks";

export interface ProfileStore {
  // trpc mutations and queries
  userData: RouterOutputs["user"]["getInfo"] | undefined;
  userQuery: ReturnType<typeof useUserQuery> | undefined;
  myReservationsQuery: ReturnType<typeof useMyReservationsQuery> | undefined;
  getSignedUrl: ReturnType<typeof useGetSignedUrl> | undefined;
  updateImageSrc: ReturnType<typeof useUpdateImageSrc> | undefined;
  updateUsername: ReturnType<typeof useUpdateUsername> | undefined;
  // getters
  getUserData: () => RouterOutputs["user"]["getInfo"];
  getMyReservationsQuery: () => ReturnType<typeof useMyReservationsQuery>;
  getGetSignedUrl: () => ReturnType<typeof useGetSignedUrl>;
  getUpdateImageSrc: () => ReturnType<typeof useUpdateImageSrc>;
  getUpdateUsername: () => ReturnType<typeof useUpdateUsername>;
  // setters
  setUserData: (userData: RouterOutputs["user"]["getInfo"] | undefined) => void;
  setUserQuery: (userQuery: ReturnType<typeof useUserQuery>) => void;
  setMyReservationsQuery: (
    myReservationsQuery: ReturnType<typeof useMyReservationsQuery>,
  ) => void;
  setGetSignedUrl: (getSignedUrl: ReturnType<typeof useGetSignedUrl>) => void;
  setUpdateImageSrc: (
    updateImageSrc: ReturnType<typeof useUpdateImageSrc>,
  ) => void;
  setUpdateUsername: (
    updateUsername: ReturnType<typeof useUpdateUsername>,
  ) => void;
}

export const profileStoreCreator: StateCreator<
  ProfileStore,
  [],
  [],
  ProfileStore
> = (set, get) => ({
  // trpc mutations and queries
  userData: undefined,
  userQuery: undefined,
  myReservationsQuery: undefined,
  getSignedUrl: undefined,
  updateImageSrc: undefined,
  updateUsername: undefined,
  // getters
  getUserData: () => {
    return getOrThrow(() => get().userData);
  },
  getMyReservationsQuery: () => {
    return getOrThrow(() => get().myReservationsQuery);
  },
  getGetSignedUrl: () => {
    return getOrThrow(() => get().getSignedUrl);
  },
  getUpdateImageSrc: () => {
    return getOrThrow(() => get().updateImageSrc);
  },
  getUpdateUsername: () => {
    return getOrThrow(() => get().updateUsername);
  },
  // setters
  setUserData: (userData) => set({ userData }),
  setMyReservationsQuery: (myReservationsQuery) => set({ myReservationsQuery }),
  setUserQuery: (userQuery) => set({ userQuery }),
  setGetSignedUrl: (getSignedUrl) => set({ getSignedUrl }),
  setUpdateImageSrc: (updateImageSrc) => set({ updateImageSrc }),
  setUpdateUsername: (updateUsername) => set({ updateUsername }),
});
