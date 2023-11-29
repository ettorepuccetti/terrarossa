// from: https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.md

import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from "react";
import { createStore, type StoreApi } from "zustand";
import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import {
  calendarStoreCreator,
  type CalendarStore,
} from "./calendarStoreCreator";
import { profileStoreCreator, type ProfileStore } from "./profileStoreCreator";

type MergedStores = CalendarStore & ProfileStore;

const createMergedStore = () => {
  return createStore<MergedStores>()((...a) => ({
    ...calendarStoreCreator(...a),
    ...profileStoreCreator(...a),
  }));
};

const MergedStoreContext = createContext<StoreApi<MergedStores>>(null as never);

export type MergedStoreProviderProps = PropsWithChildren<Partial<MergedStores>>;

export const MergedStoreProvider = ({ children }: MergedStoreProviderProps) => {
  const calendarStoreRef = useRef(createMergedStore());
  return (
    <MergedStoreContext.Provider value={calendarStoreRef.current}>
      {children}
    </MergedStoreContext.Provider>
  );
};

export type UseMergedStoreContextSelector<T> = (store: MergedStores) => T;

export const useMergedStoreContext = <T,>(
  selector: UseMergedStoreContextSelector<T>,
): T => {
  const calendarStoreContext = useContext(MergedStoreContext);
  if (!calendarStoreContext) {
    throw new Error(
      "useCalendarStoreContext must be used within a CalendarStoreProvider",
    );
  }
  return useStoreWithEqualityFn(calendarStoreContext, selector, shallow);
};
