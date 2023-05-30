import { type DateClickArg } from '@fullcalendar/interaction';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from "react";
import { z } from "zod";
import ReserveDialog from "~/components/ReserveDialog";
import { api } from "~/utils/api";

import {
  type EventClickArg
} from '@fullcalendar/core';
import { type EventImpl } from '@fullcalendar/core/internal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useSession } from 'next-auth/react';
import ErrorAlert from './ErrorAlert';
import EventDetailDialog from './EventDetailDialog';
import FullCalendarWrapper from "./FullCalendarWrapper";
import SpinnerPartial from './SpinnerPartial';

export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
  overwriteName: z.string().optional(),
});


export default function Calendar() {

  const { data: sessionData } = useSession();

  /**
   * -------------------------------------
   *      ----- trpc procedures -----
   * -------------------------------------
   */
  const reservationQuery = api.reservation.getAllVisibleInCalendar.useQuery(undefined, { refetchOnWindowFocus: false });
  const courtQuery = api.court.getAll.useQuery(undefined, { refetchOnWindowFocus: false });

  const reservationAdd = api.reservation.insertOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch()
    },
  })

  const reservationDelete = api.reservation.deleteOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch()
    },
  })

  /**
   * ---------- end of trpc procedures ----------------
   */

  const openReservationDialog = (selectInfo: DateClickArg) => {
    console.log("selected date: ", selectInfo.dateStr);
    console.log("resouce: ", selectInfo.resource?.title);

    if (selectInfo.resource === undefined) {
      throw new Error("No court selected");
    }
    setDateClick(selectInfo);
  }

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    setEventDetails(eventClickInfo.event)
  }

  const addEvent = (endDate: Date, overwrittenName?: string) => {
    setDateClick(undefined);
    setShowPotentialErrorOnAdd(true);

    if (dateClick?.resource === undefined || dateClick?.date === undefined) {
      throw new Error("No court or date selected");
    }
    reservationAdd.mutate({
      courtId: dateClick.resource.id,
      startDateTime: dateClick.date,
      endDateTime: endDate,
      overwriteName: overwrittenName,
    })
  };

  function deleteEvent(eventId: string): void {
    setEventDetails(undefined);
    setShowPotentialErrorOnDel(true);
    console.log("delete Event: ", eventId);
    reservationDelete.mutate(eventId);
  }

  const [eventDetails, setEventDetails] = useState<EventImpl>();
  const [dateClick, setDateClick] = useState<DateClickArg>();
  const [showPotentialErrorOnAdd, setShowPotentialErrorOnAdd] = useState(true);
  const [showPotentialErrorOnDel, setShowPotentialErrorOnDel] = useState(true);
  /**
   * -------------------------------------
   * ---------- Rendering ---------------
   * -------------------------------------
   */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      {(reservationAdd.error !== null && showPotentialErrorOnAdd) &&
        <ErrorAlert
          error={reservationAdd.error}
          onClose={() => setShowPotentialErrorOnAdd(false)}
        />}

      {(reservationDelete.error !== null && showPotentialErrorOnDel) &&
        <ErrorAlert
          error={reservationDelete.error}
          onClose={() => setShowPotentialErrorOnDel(false)}
        />}

      {<SpinnerPartial open={
        reservationQuery.isLoading ||
        courtQuery.isLoading ||
        reservationAdd.isLoading ||
        reservationDelete.isLoading
      }>
          <FullCalendarWrapper
            reservationData={reservationQuery.data ?? []}
            courtsData={courtQuery.data ?? []}
            onDateClick={openReservationDialog}
            onEventClick={openEventDialog}
          />
      </SpinnerPartial>
      }

      <ReserveDialog
        open={dateClick !== undefined}
        dateClick={dateClick}
        onDialogClose={() => setDateClick(undefined)}
        onConfirm={(endDate, overwrittenName?) => addEvent(endDate, overwrittenName)}
      />

      <EventDetailDialog
        open={eventDetails !== undefined}
        eventDetails={eventDetails}
        onDialogClose={() => setEventDetails(undefined)}
        sessionData={sessionData}
        onReservationDelete={(id) => deleteEvent(id)}
      />

    </LocalizationProvider>
  )
}