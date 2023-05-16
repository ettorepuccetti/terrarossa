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
import EventDetailDialog from './EventDetailDialog';
import FullCalendarWrapper from "./FullCalendarWrapper";
import { Backdrop, CircularProgress } from '@mui/material';

export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
});


export default function Calendar() {

  const { data: sessionData } = useSession();

  /**
   * -------------------------------------
   *      ----- trpc procedures -----
   * -------------------------------------
   */
  const reservationQuery = api.reservation.getAll.useQuery();
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
          title: reservation.user.name || "", //user.name can be null
          start: reservation.startTime,
          end: reservation.endTime,
          allDay: false,
          resourceId: reservation.courtId,
          extendedProps: {
            userId: reservation.user.id,
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
    console.log(selectInfo.dateStr);
    console.log("resouceId: ", selectInfo.resource?.id);

    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection

    if (selectInfo.resource === undefined) {
      throw new Error("No court selected");
    }
    setDateClick(selectInfo);
  }

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    console.log("eventClickInfo: ", eventClickInfo);
    setEventDetails(eventClickInfo.event)
  }

  const addEvent = (endDate: Date) => {
    setDateClick(undefined);

    if (dateClick?.resource === undefined || dateClick?.date === undefined) {
      throw new Error("No court or date selected");
    }

    reservationAdd.mutate({
      courtId: dateClick.resource.id,
      startDateTime: dateClick.date,
      endDateTime: endDate
    })
  };

  function deleteEvent(eventId: string): void {
    console.log("delete Event: ", eventId);
    reservationDelete.mutate(eventId);
    setEventDetails(undefined);
  }

  const [eventDetails, setEventDetails] = useState<EventImpl>();
  const [dateClick, setDateClick] = useState<DateClickArg>();


  /**
   * -------------------------------------
   * ---------- Rendering ---------------
   * -------------------------------------
   */

  // if (courtQuery.isLoading || reservationQuery.isLoading) {
  //   return <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}></Backdrop>
  // }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Backdrop
        open={reservationAdd.isLoading || reservationDelete.isLoading || courtQuery.isLoading || reservationQuery.isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
        onDurationSelected={(endDate) => addEvent(endDate)}
        sessionData={sessionData}
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