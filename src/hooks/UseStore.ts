import { type EventImpl } from "@fullcalendar/core/internal";
import { type DateClickArg } from "@fullcalendar/interaction";
import { create } from "zustand";

interface IStore {
  dateClick: DateClickArg | null;
  eventDetails: EventImpl | null;
  clubId: string | undefined;
  setDateClick: (dateClick: DateClickArg | null) => void;
  setEventDetails: (eventDetails: EventImpl | null) => void;
  setClubId: (clubId: string) => void;
  getClubId: () => string;
}

export const useStore = create<IStore>()((set, get) => ({
  dateClick: null,
  eventDetails: null,
  clubId: undefined,
  setDateClick: (dateClick) => set({ dateClick: dateClick }),
  setEventDetails: (setEventDetails) => set({ eventDetails: setEventDetails }),
  setClubId: (clubId) => set({ clubId: clubId }),
  getClubId: () => {
    const clubId = get().clubId;
    if (clubId === undefined) {
      throw new Error("clubId is undefined");
    }
    return clubId;
  },
}));
