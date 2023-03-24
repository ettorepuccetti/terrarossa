import { type User, type Item } from "@prisma/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { api } from "~/utils/api";
import { z } from "zod";
import React, { useCallback, useEffect, useState } from "react";

import {
  type DateSelectArg,
  type EventClickArg,
  type EventInput,
} from '@fullcalendar/core'

export const ItemInputSchema = z.object({
  name: z.string(),
  property: z.boolean(),
  date: z.date(),
});

type ItemSchemaType = z.infer<typeof ItemInputSchema>;

let nextAvailableId = 0;
function getNextAvailableId() {
  nextAvailableId += 1;
  return nextAvailableId.toString();
}

export default function Calendar() {

  const [events, setEvents] = useState<EventInput[]>([]);

  //trpc procedures
  const utils = api.useContext();
  const itemQuery = api.items.getAll.useQuery();
  const itemMutationAdd = api.items.insertOne.useMutation({
    async onSuccess() {
      await utils.items.invalidate() // Do I need this?
    },
  })
  const itemMutationDelete = api.items.deleteOne.useMutation({
    async onSuccess() {
      await utils.items.invalidate() // Do I need this?
    },
  })

  const getEventsFromDb = useCallback(() => {
    const itemFromDb = itemQuery.data;
    if (itemFromDb) {
      //get max id of items in db
      const maxId = itemFromDb.length !== 0 ? Math.max(...itemFromDb.map((item) => item.id)) : 0;
      nextAvailableId = maxId;
      setEvents(itemFromDb.map((item) => {
        return {
          id: item.id.toString(),
          title: item.name,
          start: item.date,
          end: new Date(item.date.getTime() + 1000 * 60 * 60),
          allDay: false,
        }
      }))
    }
  }, [itemQuery.data])

  useEffect(() => {
    getEventsFromDb();
  },[getEventsFromDb])


  const addEvent = (selectInfo: DateSelectArg) => {
    const title = "Title"
    console.log(selectInfo.startStr);
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: getNextAvailableId(), // useless actually. It is overwritten by the id of the item in the db
        title: title,
        start: selectInfo.startStr,
        end: new Date(selectInfo.startStr).setHours(new Date(selectInfo.startStr).getHours() + 1),
        allDay: selectInfo.allDay
      })
    }

    itemMutationAdd.mutate({ name: title, property: false, date: new Date(selectInfo.startStr) })
  }

  function deleteEvent(eventClickInfo: EventClickArg): void {

    const calendarApi = eventClickInfo.view.calendar;
    const event = calendarApi.getEventById(eventClickInfo.event.id);
    if (!event) {
      console.log("Event not found, id: ", eventClickInfo.event.id);
      return;
    }
    event.remove();
    console.log("deleteItem: ", +eventClickInfo.event.id);
    itemMutationDelete.mutate(+eventClickInfo.event.id);
  }

  return (
    <div style={{ padding: '10px' }}>
      <FullCalendar
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
        initialView="timeGridWeek"
        navLinks={true}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,resourceTimeGridDay'
        }}
        events={events}
        eventsSet={(events) => console.log("eventsSet: ", events)}
        resources={[
          { id: 'a', title: 'Auditorium A' },
          { id: 'b', title: 'Auditorium B', eventColor: 'green' },
        ]}
        selectable={true}
        select={(selectInfo) => addEvent(selectInfo)}
        // editable={true}
        eventClick={(eventClickInfo) => deleteEvent(eventClickInfo)}
      />
    </div>
  )
}
