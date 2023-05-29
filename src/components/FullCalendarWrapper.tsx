import {
  type EventClickArg,
  type EventContentArg,
  type EventInput
} from '@fullcalendar/core';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from "@fullcalendar/react";
import { type ResourceInput } from '@fullcalendar/resource';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Avatar, Box } from '@mui/material';
import { type inferRouterOutputs } from '@trpc/server';
import { useRef } from 'react';
import { type AppRouter } from '~/server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ReservationFromDb = RouterOutput['reservation']['getAllVisibleInCalendar'][0];
type CourtFromDb = RouterOutput['court']['getAll'][0];

interface FullCalendarWrapperProps {
  reservationData: ReservationFromDb[];
  courtsData: CourtFromDb[];
  onEventClick: (eventClickInfo: EventClickArg) => void;
  onDateClick: (dateClickInfo: DateClickArg) => void;
}

export default function FullCalendarWrapper(props: FullCalendarWrapperProps) {

  const calendarRef = useRef<FullCalendar>(null);
  // const calendarApi = calendarRef.current?.getApi();

  const reservationToEvent = (reservation: ReservationFromDb): EventInput => {
    return {
      id: reservation.id.toString(),
      title: reservation.overwriteName ? reservation.overwriteName : (reservation.user?.name || "[deleted user]"), //user.name can be null or user can be null
      start: reservation.startTime,
      end: reservation.endTime,
      resourceId: reservation.courtId,
      // color: reservation.user?.role === "ADMIN" ? "red" : "green",
      extendedProps: {
        userId: reservation.user?.id,
        userImg: reservation.user?.image,
      }
    }
  }

  const courtToResource = (court: CourtFromDb): ResourceInput  => {
    return {
      id: court.id,
      title: court.name,
    }
  }


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
      events={props.reservationData.map(reservationToEvent)}
      resources={props.courtsData.map(courtToResource)}
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