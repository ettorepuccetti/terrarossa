import { type DateClickArg } from '@fullcalendar/interaction';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import ReserveDialog from "~/components/ReserveDialog";
import { api } from "~/utils/api";

import {
  type EventClickArg,
  type EventInput,
} from '@fullcalendar/core';
import { type EventImpl } from '@fullcalendar/core/internal';
import { type ResourceInput } from "@fullcalendar/resource";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useSession } from 'next-auth/react';
import ErrorAlert from './ErrorAlert';
import EventDetailDialog from './EventDetailDialog';
import FullCalendarWrapper from "./FullCalendarWrapper";
import Spinner from './Spinner';

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
  const reservationQuery = api.reservation.getAllVisibleInCalendar.useQuery();
  const courtQuery = api.court.getAll.useQuery();

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


  /**
   * -------------------------------------
   *      ----- DB Queries -----
   * -------------------------------------
   */

  const getCourtsFromDb = useCallback(() => {
    if (courtQuery.error) {
      console.error("Error: ", courtQuery.error);
    }
    if (!courtQuery.data) {
      return;
    }
    setCourts(courtQuery.data.map((court) => {
      return {
        id: court.id,
        title: court.name,
      }
    }))
  }, [courtQuery.data, courtQuery.error])


  const getEventsFromDb = useCallback(() => {
    const reservationFromDb = reservationQuery.data;
    if (reservationFromDb) {
      setEvents(reservationFromDb.map((reservation) => {
        return {
          id: reservation.id.toString(),
          title: reservation.overwriteName? reservation.overwriteName : (reservation.user?.name || "[deleted user]"), //user.name can be null or user can be null
          start: reservation.startTime,
          end: reservation.endTime,
          resourceId: reservation.courtId,
          // color: reservation.user?.role === "ADMIN" ? "red" : "green",
          extendedProps: {
            userId: reservation.user?.id, 
            userImg: reservation.user?.image,
          }
        }
      }))
    }
  }, [reservationQuery.data])

  const [courts, setCourts] = useState<ResourceInput[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    getCourtsFromDb();
    getEventsFromDb();
  }, [getEventsFromDb, getCourtsFromDb])

  /**
   * ---------- end of DB Queries ----------------
   */


  const openReservationDialog = (selectInfo: DateClickArg) => {
    console.log("selected date: ", selectInfo.dateStr);
    console.log("resouce: ", selectInfo.resource?.title);

    if (selectInfo.date < new Date()) {
      console.warn("date is in the past");
      return;
    }

    if (selectInfo.resource === undefined) {
      throw new Error("No court selected");
    }
    setDateClick(selectInfo);
  }

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    console.log("eventClickInfo: ", eventClickInfo);
    setEventDetails(eventClickInfo.event)
  }

  const addEvent = (endDate: Date, overwrittenName?: string) => {
    setDateClick(undefined);
    setShowPotentialError(true);

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
    console.log("delete Event: ", eventId);
    reservationDelete.mutate(eventId);
    setEventDetails(undefined);
  }

  const [eventDetails, setEventDetails] = useState<EventImpl>();
  const [dateClick, setDateClick] = useState<DateClickArg>();
  const [showPotentialError, setShowPotentialError] = useState(true);
  /**
   * -------------------------------------
   * ---------- Rendering ---------------
   * -------------------------------------
   */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      {(reservationAdd.error !== null && showPotentialError) &&
        <ErrorAlert
          error={reservationAdd.error}
          onClose={() => setShowPotentialError(false)}
        />}

      <Spinner
        isLoading={reservationAdd.isLoading || reservationDelete.isLoading || courtQuery.isLoading || reservationQuery.isLoading}
      />

      <FullCalendarWrapper
        events={events}
        courts={courts}
        onDateClick={openReservationDialog}
        onEventClick={openEventDialog}
      />

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