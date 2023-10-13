import { type EventImpl } from "@fullcalendar/core/internal";
import { type DateClickArg } from "@fullcalendar/interaction";
import type FullCalendar from "@fullcalendar/react";
import dayjs, { type Dayjs } from "dayjs";
import { type RefObject } from "react";
import { type StateCreator } from "zustand";

export interface IStore {
  dateClick: DateClickArg | null;
  eventDetails: EventImpl | null;
  clubId: string | undefined;
  endDate: Dayjs | null;
  endDateError: boolean;
  recurrentEndDate: Dayjs | null;
  recurringEndDateError: boolean;
  deleteConfirmationOpen: boolean;
  calendarRef: RefObject<FullCalendar>;
  calendarIsLoading: boolean;
  setDateClick: (dateClick: DateClickArg | null) => void;
  setEventDetails: (eventDetails: EventImpl | null) => void;
  setClubId: (clubId: string) => void;
  setEndDate: (endDate: Dayjs | null) => void;
  setEndDateError: (endDateError: boolean) => void;
  setRecurrentEndDate: (recurrentEndDate: Dayjs | null) => void;
  setRecurringEndDateError: (recurringEndDateError: boolean) => void;
  setDeleteConfirmationOpen: (deleteConfirmationOpen: boolean) => void;
  setCalendarRef: (calendarRef: RefObject<FullCalendar>) => void;
  setCalendarIsLoading: (calendarIsLoading: boolean) => void;
  getClubId: () => string;
  getStartDate: () => Dayjs;
  //for testing only
  setSetEndDate: (stub: (endDate: Dayjs | null) => void) => void;
  setSetEndDateError: (stub: (endDate: boolean) => void) => void;
  setSetRecurrentEndDate: (stub: (endDate: Dayjs | null) => void) => void;
  setSetRecurringEndDateError: (stub: (endDate: boolean) => void) => void;
}

export const calendarStoreCreator: StateCreator<IStore> = (set, get) => ({
  dateClick: null,
  eventDetails: null,
  clubId: undefined,
  endDate: null,
  endDateError: false,
  recurrentEndDate: null,
  recurringEndDateError: false,
  deleteConfirmationOpen: false,
  calendarRef: { current: null },
  calendarIsLoading: false,
  // reservationAdd: ,
  setDateClick: (dateClick) => {
    set({ dateClick: dateClick });
    set({ endDate: dayjs(dateClick?.date).add(1, "h") });
  },
  setEventDetails: (setEventDetails) => set({ eventDetails: setEventDetails }),
  setClubId: (clubId) => set({ clubId: clubId }),
  setEndDate: (endDate) => set({ endDate: endDate }),
  setEndDateError: (endDateError) => set({ endDateError: endDateError }),
  setRecurrentEndDate: (recurrentEndDate) =>
    set({ recurrentEndDate: recurrentEndDate }),
  setRecurringEndDateError: (recurringEndDateError) =>
    set({ recurringEndDateError: recurringEndDateError }),
  setDeleteConfirmationOpen: (deleteConfirmationOpen) =>
    set({ deleteConfirmationOpen: deleteConfirmationOpen }),
  setCalendarRef: (calendarRef) => set({ calendarRef: calendarRef }),
  setCalendarIsLoading: (calendarIsLoading) =>
    set({ calendarIsLoading: calendarIsLoading }),
  getClubId: () => {
    const clubId = get().clubId;
    if (clubId === undefined) {
      throw new Error("clubId is undefined");
    }
    return clubId;
  },
  getStartDate: () => {
    const startDate = get().dateClick?.date;
    return dayjs(startDate);
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
});
