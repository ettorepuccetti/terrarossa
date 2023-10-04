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
import { calendarStoreCreator, type IStore } from "./UseCalendarStore";

export const createCalandarStore = () => {
  return createStore<IStore>(calendarStoreCreator);
};

export const CalendarStoreContext = createContext<StoreApi<IStore>>(
  null as never
);

export type CalendarStoreProviderProps = PropsWithChildren<Partial<IStore>>;

export const CalendarStoreProvider = ({
  children,
}: CalendarStoreProviderProps) => {
  const calendarStoreRef = useRef(createCalandarStore());
  return (
    <CalendarStoreContext.Provider value={calendarStoreRef.current}>
      {children}
    </CalendarStoreContext.Provider>
  );
};

export type UseCalendarStoreContextSelector<T> = (store: IStore) => T;

export const useCalendarStoreContext = <T,>(
  selector: UseCalendarStoreContextSelector<T>
): T => {
  const calendarStoreContext = useContext(CalendarStoreContext);
  if (!calendarStoreContext) {
    throw new Error(
      "useCalendarStoreContext must be used within a CalendarStoreProvider"
    );
  }
  return useStoreWithEqualityFn(calendarStoreContext, selector, shallow);
};
