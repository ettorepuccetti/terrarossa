import {
  type EventClickArg,
  type EventContentArg,
  type EventInput,
} from '@fullcalendar/core';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from "@fullcalendar/react";
import { type ResourceInput } from "@fullcalendar/resource";
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Avatar, Box } from '@mui/material';
import { useRef } from 'react';

interface FullCalendarWrapperProps {
  events: EventInput[];
  courts: ResourceInput[];
  onEventClick: (eventClickInfo: EventClickArg) => void;
  onDateClick: (dateClickInfo: DateClickArg) => void;
}

export default function FullCalendarWrapper(props: FullCalendarWrapperProps) {
  
  const calendarRef = useRef<FullCalendar>(null);
  const calendarApi = calendarRef.current?.getApi();

  return (
    <FullCalendar
      ref={calendarRef}
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
      eventContent={renderEventContent}
      titleFormat={{ month: 'short', day: 'numeric' }}
      locale={'it-it'}
    />
  )
}


function renderEventContent(eventInfo: EventContentArg) {
  return (
    <Box display={'flex'} gap={1} className={'fc-event-main'} alignItems={'center'}>
      {eventInfo.event.extendedProps.userImg
        &&
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        <Avatar alt={eventInfo.event.title} src={eventInfo.event.extendedProps.userImg} />}
      <Box maxHeight={"100%"} overflow={'hidden'}>
        <Box className="fc-event-time">{eventInfo.timeText} </Box>
        <Box textOverflow={'ellipsis'} className="fc-event-title" lineHeight={"22px"}>{eventInfo.event.title} </Box>
      </Box>
    </Box>
  )
}