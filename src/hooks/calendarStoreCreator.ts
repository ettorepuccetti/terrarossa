import { type EventImpl } from "@fullcalendar/core/internal";
import { type DateClickArg } from "@fullcalendar/interaction";
import type FullCalendar from "@fullcalendar/react";
import dayjs, { type Dayjs } from "dayjs";
import { type RefObject } from "react";
import { type StateCreator } from "zustand";

import { type RouterOutputs } from "~/utils/api";
import { getOrThrow } from "~/utils/utils";
import {
  type useRecurrentReservationAdd,
  type useRecurrentReservationDelete,
  type useReservationAdd,
  type useReservationDelete,
  type useReservationQuery,
} from "./calendarTrpcHooks";

export interface CalendarStore {
  dateClick: DateClickArg | null;
  eventDetails: EventImpl | null;
  endDate: Dayjs | null;
  endDateError: boolean;
  recurrentEndDate: Dayjs | null;
  recurringEndDateError: boolean;
  deleteConfirmationOpen: boolean;
  calendarRef: RefObject<FullCalendar>;
  calendarIsLoading: boolean;
  reservationAdd: ReturnType<typeof useReservationAdd> | undefined;
  recurrentReservationAdd:
    | ReturnType<typeof useRecurrentReservationAdd>
    | undefined;
  reservationDelete: ReturnType<typeof useReservationDelete> | undefined;
  recurrentReservationDelete:
    | ReturnType<typeof useRecurrentReservationDelete>
    | undefined;
  reservationQuery: ReturnType<typeof useReservationQuery> | undefined;
  clubData: RouterOutputs["club"]["getByClubId"] | undefined;
  selectedDate: Dayjs;
  customDateSelected: boolean;
  openReserveSuccess: boolean;
  setDateClick: (dateClick: DateClickArg | null) => void;
  setEventDetails: (eventDetails: EventImpl | null) => void;
  setEndDate: (endDate: Dayjs | null) => void;
  setEndDateError: (endDateError: boolean) => void;
  setRecurrentEndDate: (recurrentEndDate: Dayjs | null) => void;
  setRecurringEndDateError: (recurringEndDateError: boolean) => void;
  setDeleteConfirmationOpen: (deleteConfirmationOpen: boolean) => void;
  setCalendarRef: (calendarRef: RefObject<FullCalendar>) => void;
  setSelectedDate: (selectedDate: Dayjs) => void;
  setCustomDateSelected: (customDateSelected: boolean) => void;
  setOpenReserveSuccess: (openReserveSuccess: boolean) => void;
  // trpc mutations and queries
  setReservationAdd: (
    reservationAdd: ReturnType<typeof useReservationAdd>,
  ) => void;
  setRecurrentReservationAdd: (
    reservationAdd: ReturnType<typeof useRecurrentReservationAdd>,
  ) => void;
  setReservationDelete: (
    reservationDelete: ReturnType<typeof useReservationDelete>,
  ) => void;
  setRecurrentReservationDelete: (
    recurrentReservationDelete: ReturnType<
      typeof useRecurrentReservationDelete
    >,
  ) => void;
  setReservationQuery: (
    reservationQuery: ReturnType<typeof useReservationQuery>,
  ) => void;
  setClubData: (
    clubData: RouterOutputs["club"]["getByClubId"] | undefined,
  ) => void;

  //getter
  getStartDate: () => Dayjs;
  getClubData: () => RouterOutputs["club"]["getByClubId"];
  getReservationAdd: () => ReturnType<typeof useReservationAdd>;
  getRecurrentReservationAdd: () => ReturnType<
    typeof useRecurrentReservationAdd
  >;
  getReservationDelete: () => ReturnType<typeof useReservationDelete>;
  getRecurrentReservationDelete: () => ReturnType<
    typeof useRecurrentReservationDelete
  >;
  getReservationQuery: () => ReturnType<typeof useReservationQuery>;

  //for testing only
  setSetEndDate: (stub: (endDate: Dayjs | null) => void) => void;
  setSetEndDateError: (stub: (endDate: boolean) => void) => void;
  setSetRecurrentEndDate: (stub: (endDate: Dayjs | null) => void) => void;
  setSetRecurringEndDateError: (stub: (endDate: boolean) => void) => void;
  setSetSelectedDate: (stub: (selectedDate: Dayjs) => void) => void;
}

export const calendarStoreCreator: StateCreator<
  CalendarStore,
  [],
  [],
  CalendarStore
> = (set, get) => ({
  dateClick: null,
  eventDetails: null,
  endDate: null,
  endDateError: false,
  recurrentEndDate: null,
  recurringEndDateError: false,
  deleteConfirmationOpen: false,
  calendarRef: { current: null },
  calendarIsLoading: false,
  reservationAdd: undefined,
  recurrentReservationAdd: undefined,
  reservationDelete: undefined,
  recurrentReservationDelete: undefined,
  reservationQuery: undefined,
  clubData: undefined,
  selectedDate: dayjs().startOf("day"),
  customDateSelected: false,
  openReserveSuccess: false,
  setDateClick: (dateClick) => {
    set({ dateClick: dateClick });
    set({ endDate: dayjs(dateClick?.date).add(1, "h") });
  },
  setEventDetails: (setEventDetails) => set({ eventDetails: setEventDetails }),
  setEndDate: (endDate) => set({ endDate: endDate }),
  setEndDateError: (endDateError) => set({ endDateError: endDateError }),
  setRecurrentEndDate: (recurrentEndDate) =>
    set({ recurrentEndDate: recurrentEndDate }),
  setRecurringEndDateError: (recurringEndDateError) =>
    set({ recurringEndDateError: recurringEndDateError }),
  setDeleteConfirmationOpen: (deleteConfirmationOpen) =>
    set({ deleteConfirmationOpen: deleteConfirmationOpen }),
  setCalendarRef: (calendarRef) => set({ calendarRef: calendarRef }),
  setSelectedDate: (selectedDate) => set({ selectedDate: selectedDate }),
  setCustomDateSelected: (customDateSelected) =>
    set({ customDateSelected: customDateSelected }),
  setOpenReserveSuccess: (openReserveSuccess) =>
    set({ openReserveSuccess: openReserveSuccess }),

  // trpc mutations and queries
  setReservationAdd: (reservationAdd) =>
    set({ reservationAdd: reservationAdd }),
  setRecurrentReservationAdd: (recurrentReservationAdd) =>
    set({ recurrentReservationAdd: recurrentReservationAdd }),
  setReservationDelete: (reservationDelete) =>
    set({ reservationDelete: reservationDelete }),
  setRecurrentReservationDelete: (recurrentReservationDelete) =>
    set({ recurrentReservationDelete: recurrentReservationDelete }),
  setReservationQuery: (reservationQuery) =>
    set({ reservationQuery: reservationQuery }),
  setClubData: (clubData) => {
    set({ clubData: clubData });
  },

  //getters
  getStartDate: () => {
    const startDate = get().dateClick?.date;
    return dayjs(startDate);
  },

  getClubData: () => {
    return getOrThrow(() => get().clubData);
  },

  getReservationAdd: () => {
    return getOrThrow(() => get().reservationAdd);
  },

  getRecurrentReservationAdd: () => {
    return getOrThrow(() => get().recurrentReservationAdd);
  },
  getReservationDelete: () => {
    return getOrThrow(() => get().reservationDelete);
  },
  getRecurrentReservationDelete: () => {
    return getOrThrow(() => get().recurrentReservationDelete);
  },
  getReservationQuery: () => {
    return getOrThrow(() => get().reservationQuery);
  },

  //for testing only
  setSetEndDate: (stub: (endDate: Dayjs | null) => void) =>
    set({ setEndDate: stub }),
  setSetEndDateError: (stub: (endDateError: boolean) => void) =>
    set({ setEndDateError: stub }),
  setSetRecurrentEndDate: (stub: (endDate: Dayjs | null) => void) =>
    set({ setRecurrentEndDate: stub }),
  setSetRecurringEndDateError: (stub: (endDateError: boolean) => void) =>
    set({ setRecurringEndDateError: stub }),
  setSetSelectedDate: (stub: (selectedDate: Dayjs) => void) =>
    set({ setSelectedDate: stub }),
});
