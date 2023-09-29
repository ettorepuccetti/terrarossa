import { type EventImpl } from "@fullcalendar/core/internal";
import { type DateClickArg } from "@fullcalendar/interaction";
import { create } from "zustand";

interface IStore {
  dateClick: DateClickArg | null;
  eventDetails: EventImpl | null;
  setDateClick: (dateClick: DateClickArg | null) => void;
  setEventDetails: (eventDetails: EventImpl | null) => void;
}

export const useStore = create<IStore>()((set) => ({
  dateClick: null,
  eventDetails: null,
  setDateClick: (dateClick) => set({ dateClick: dateClick }),
  setEventDetails: (setEventDetails) => set({ eventDetails: setEventDetails }),
}));
