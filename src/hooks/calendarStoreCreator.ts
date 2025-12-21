import { type EventImpl } from "@fullcalendar/core/internal";
import { type DateClickArg } from "@fullcalendar/interaction";
import type FullCalendar from "@fullcalendar/react";
import dayjs, { type Dayjs } from "dayjs";
import { type RefObject } from "react";
import { type StateCreator } from "zustand";

import { type RouterOutputs } from "~/utils/api";
import { getOrThrow } from "~/utils/utils";

export interface CalendarStore {
  dateClick: DateClickArg | null;
  eventDetails: EventImpl | null;
  endDate: Dayjs | null;
  endDateError: boolean;
  recurrentEndDate: Dayjs | null;
  recurrentEndDateError: boolean;
  deleteConfirmationOpen: boolean;
  calendarRef: RefObject<FullCalendar>;
  calendarIsLoading: boolean;
  clubData: RouterOutputs["club"]["getByClubId"] | undefined;
  selectedDate: Dayjs;
  customDateSelected: boolean;
  openReserveSuccess: boolean;
  setDateClick: (dateClick: DateClickArg | null) => void;
  setEventDetails: (eventDetails: EventImpl | null) => void;
  setEndDate: (endDate: Dayjs | null) => void;
  setEndDateError: (endDateError: boolean) => void;
  setRecurrentEndDate: (recurrentEndDate: Dayjs | null) => void;
  setRecurrentEndDateError: (recurringEndDateError: boolean) => void;
  setDeleteConfirmationOpen: (deleteConfirmationOpen: boolean) => void;
  setCalendarRef: (calendarRef: RefObject<FullCalendar>) => void;
  setSelectedDate: (selectedDate: Dayjs) => void;
  setCustomDateSelected: (customDateSelected: boolean) => void;
  setOpenReserveSuccess: (openReserveSuccess: boolean) => void;
  setClubData: (
    clubData: RouterOutputs["club"]["getByClubId"] | undefined,
  ) => void;

  //getter
  getStartDate: () => Dayjs;
  getClubData: () => RouterOutputs["club"]["getByClubId"];

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
  recurrentEndDateError: false,
  deleteConfirmationOpen: false,
  calendarRef: { current: null },
  calendarIsLoading: false,
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
  setRecurrentEndDateError: (recurrentEndDateError) =>
    set({ recurrentEndDateError: recurrentEndDateError }),
  setDeleteConfirmationOpen: (deleteConfirmationOpen) =>
    set({ deleteConfirmationOpen: deleteConfirmationOpen }),
  setCalendarRef: (calendarRef) => set({ calendarRef: calendarRef }),
  setSelectedDate: (selectedDate) => set({ selectedDate: selectedDate }),
  setCustomDateSelected: (customDateSelected) =>
    set({ customDateSelected: customDateSelected }),
  setOpenReserveSuccess: (openReserveSuccess) =>
    set({ openReserveSuccess: openReserveSuccess }),

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

  //for testing only
  setSetEndDate: (stub: (endDate: Dayjs | null) => void) =>
    set({ setEndDate: stub }),
  setSetEndDateError: (stub: (endDateError: boolean) => void) =>
    set({ setEndDateError: stub }),
  setSetRecurrentEndDate: (stub: (endDate: Dayjs | null) => void) =>
    set({ setRecurrentEndDate: stub }),
  setSetRecurringEndDateError: (stub: (endDateError: boolean) => void) =>
    set({ setRecurrentEndDateError: stub }),
  setSetSelectedDate: (stub: (selectedDate: Dayjs) => void) =>
    set({ setSelectedDate: stub }),
});
