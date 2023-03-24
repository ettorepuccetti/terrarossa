import FullCalendar from "@fullcalendar/react";
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { api } from "~/utils/api";
import { z } from "zod";
import React, { useCallback, useEffect, useState } from "react";

import {
  type DateSelectArg,
  type EventClickArg,
  type EventInput,
} from '@fullcalendar/core'
import { type ResourceInput } from "@fullcalendar/resource";

export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
});

// type ItemSchemaType = z.infer<typeof ReservationInputSchema>;

export default function Calendar() {


  /**
   * -------------------------------------
   *      ----- trpc procedures -----
   * -------------------------------------
   */

  const utils = api.useContext();

  const reservationQuery = api.reservation.getAll.useQuery();
  const courtQuery = api.court.getAll.useQuery();

  const reservationAdd = api.reservation.insertOne.useMutation({
    async onSuccess() {
      await utils.reservation.invalidate() // Do I need this?
    },
  })
  const reservationDelete = api.reservation.deleteOne.useMutation({
    async onSuccess() {
      await utils.reservation.invalidate() // Do I need this?
    },
  })

  /**
   * ---------- end of trpc procedures ----------------
   */

  function getCourts(): ResourceInput[] {
    if (courtQuery.error) {
      console.log("Error: ", courtQuery.error);
    }
    if (!courtQuery.data) {
      console.log("No data");
      return [];
    }
    return courtQuery.data.map((court) => {
      return {
        id: court.id,
        title: court.name,
      }
    })
  }

  const [events, setEvents] = useState<EventInput[]>([]);

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
        }
      }))
    }
  }, [reservationQuery.data])

  useEffect(() => {
    getEventsFromDb();
  }, [getEventsFromDb])


  const addEvent = (selectInfo: DateSelectArg) => {
    console.log(selectInfo.startStr, selectInfo.endStr);
    console.log("resouceId: ", selectInfo.resource?.id);
    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection

    if (selectInfo.resource === undefined) {
      throw new Error("No court selected");
    }

    calendarApi.addEvent({
      id: "???", // will be overwritten by the id of the reservation in the db
      title: "", // will be overwritten by the name of the user get from the session
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      resourceId: selectInfo.resource?.id,
    })

    reservationAdd.mutate({
      courtId: selectInfo.resource.id,
      startDateTime: new Date(selectInfo.startStr),
      endDateTime: new Date(selectInfo.endStr)
    })
  }

  function deleteEvent(eventClickInfo: EventClickArg): void {

    const calendarApi = eventClickInfo.view.calendar;
    const event = calendarApi.getEventById(eventClickInfo.event.id);
    if (!event) {
      console.log("Event not found, id: ", eventClickInfo.event.id);
      return;
    }
    event.remove();
    console.log("deleteItem: ", eventClickInfo.event.id);
    reservationDelete.mutate(eventClickInfo.event.id);
  }

  return (
    <div style={{ padding: '10px' }}>
      <FullCalendar
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[interactionPlugin, resourceTimeGridPlugin]}
        initialView="resourceTimeGridDay"
        slotLabelFormat= {{hour: 'numeric', minute: '2-digit', hour12: false}}
        navLinks={true}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          right: 'title',
        }}
        events={events}
        resources={getCourts()}
        selectable={true}
        select={(selectInfo) => addEvent(selectInfo)}
        eventClick={(eventClickInfo) => deleteEvent(eventClickInfo)}
        validRange={function (currentDate) {
          const startDate = new Date(currentDate.valueOf());
          const endDate = new Date(currentDate.valueOf());
          // Adjust the start & end dates, respectively
          endDate.setDate(endDate.getDate() + 7); // Seven days into the future
          return { start: startDate, end: endDate };
        }}
        slotMinTime="08:00:00"
        slotMaxTime="23:30:00"
        longPressDelay={0}
      />
    </div>
  )
}
