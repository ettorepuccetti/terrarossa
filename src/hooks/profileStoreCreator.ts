import { type StateCreator } from "zustand";
import { type CalendarStore } from "./calendarStoreCreator";
import {
  type useGetSignedUrl,
  type useMyReservationsQuery,
  type useUpdateImageSrc,
  type useUserQuery,
} from "./profileTrpcHooks";

export interface ProfileStore {
  userQuery: ReturnType<typeof useUserQuery> | undefined;
  myReservationsQuery: ReturnType<typeof useMyReservationsQuery> | undefined;
  getSignedUrl: ReturnType<typeof useGetSignedUrl> | undefined;
  updateImageSrc: ReturnType<typeof useUpdateImageSrc> | undefined;
  setUserQuery: (userQuery: ReturnType<typeof useUserQuery>) => void;
  setMyReservationsQuery: (
    myReservationsQuery: ReturnType<typeof useMyReservationsQuery>,
  ) => void;
  setGetSignedUrl: (getSignedUrl: ReturnType<typeof useGetSignedUrl>) => void;
  setUpdateImageSrc: (
    updateImageSrc: ReturnType<typeof useUpdateImageSrc>,
  ) => void;
}

export const profileStoreCreator: StateCreator<
  CalendarStore & ProfileStore,
  [],
  [],
  ProfileStore
> = (set) => ({
  userQuery: undefined,
  myReservationsQuery: undefined,
  getSignedUrl: undefined,
  updateImageSrc: undefined,
  setMyReservationsQuery: (myReservationsQuery) => set({ myReservationsQuery }),
  setUserQuery: (userQuery) => set({ userQuery }),
  setGetSignedUrl: (getSignedUrl) => set({ getSignedUrl }),
  setUpdateImageSrc: (updateImageSrc) => set({ updateImageSrc }),
});
