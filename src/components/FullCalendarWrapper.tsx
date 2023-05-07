import FullCalendar from "@fullcalendar/react";
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import {
  type EventClickArg,
  type EventInput,
} from '@fullcalendar/core'
import { type ResourceInput } from "@fullcalendar/resource";

interface FullCalendarWrapperProps {
  events: EventInput[];
  courts: ResourceInput[];
  onEventClick: (eventClickInfo: EventClickArg) => void;
  onDateClick: (dateClickInfo: DateClickArg) => void;
}

export default function FullCalendarWrapper(props: FullCalendarWrapperProps) {

  return (
    <FullCalendar
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      plugins={[interactionPlugin, resourceTimeGridPlugin]}
      initialView="resourceTimeGridDay"
      navLinks={true}
      height="auto"
      headerToolbar={{
        left: 'prev,next today',
        right: 'title',
      }}
      events={props.events}
      resources={props.courts}
      eventClick={(eventClickInfo) => props.onEventClick(eventClickInfo)}
      dateClick={(info) => { props.onDateClick(info) }}
      selectable={false}
      validRange={function (currentDate) {
        const startDate = new Date(currentDate.valueOf());
        const endDate = new Date(currentDate.valueOf());
        // Adjust the start & end dates, respectively
        startDate.setDate(startDate.getDate() - 2); // Two days into the past
        endDate.setDate(endDate.getDate() + 7); // Seven days into the future
        return { start: startDate, end: endDate };
      }}
      slotMinTime="08:00:00"
      slotMaxTime="23:00:00"
      selectLongPressDelay={0}
      slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
      eventTimeFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
      allDaySlot={false}
    />
  )
}