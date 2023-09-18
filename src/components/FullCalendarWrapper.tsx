import {
  type EventClickArg,
  type EventContentArg,
  type EventInput,
} from "@fullcalendar/core";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { type ResourceInput } from "@fullcalendar/resource";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import ScrollGrid from "@fullcalendar/scrollgrid";
import { Avatar, Box } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { useRef, type RefObject } from "react";
import { type AppRouter } from "~/server/api/root";
import { defaultImg } from "~/utils/constants";
import { formatTimeString } from "~/utils/utils";
import { HorizonalDatePicker } from "./HorizontalDatePicker";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ReservationFromDb =
  RouterOutput["reservationQuery"]["getAllVisibleInCalendarByClubId"][0];
type CourtFromDb = RouterOutput["court"]["getAllByClubId"][0];

interface FullCalendarWrapperProps {
  clubData: RouterOutput["club"]["getByClubId"];
  reservationData: ReservationFromDb[];
  courtData: CourtFromDb[];
  onEventClick: (eventClickInfo: EventClickArg) => void;
  onDateClick: (dateClickInfo: DateClickArg) => void;
}

export default function FullCalendarWrapper(props: FullCalendarWrapperProps) {
  const calendarRef: RefObject<FullCalendar> = useRef<FullCalendar>(null);

  const reservationToEvent = (reservation: ReservationFromDb): EventInput => {
    return {
      id: reservation.id.toString(),
      title: reservation.overwriteName
        ? reservation.overwriteName
        : reservation.user?.name || "[deleted user]", //user.name can be null or user can be null TODO: move this logic to backend
      start: reservation.startTime,
      end: reservation.endTime,
      resourceId: reservation.courtId,
      // color: reservation.user?.role === "ADMIN" ? "red" : "green",
      extendedProps: {
        userId: reservation.user?.id,
        userImg: reservation.user?.image,
        recurrentId: reservation.recurrentReservationId,
      },
    };
  };

  const courtToResource = (court: CourtFromDb): ResourceInput => {
    return {
      id: court.id,
      title: court.name,
    };
  };

  /**
   * Render the calendar event containing the reservation
   * @param eventInfo
   * @returns
   */
  function renderEventContent(eventInfo: EventContentArg) {
    return (
      <Box
        display={"flex"}
        gap={1}
        className={"fc-event-main"}
        alignItems={"center"}
        data-test="calendar-event"
      >
        {eventInfo.event.extendedProps.userImg && (
          <Avatar
            alt={eventInfo.event.title}
            src={eventInfo.event.extendedProps.userImg as string}
          />
        )}
        <Box maxHeight={"100%"} overflow={"hidden"}>
          <Box className="fc-event-time">{eventInfo.timeText} </Box>
          <Box
            textOverflow={"ellipsis"}
            className="fc-event-title"
            lineHeight={"22px"}
          >
            {eventInfo.event.title}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"}>
      <HorizonalDatePicker
        calendarRef={calendarRef}
        clubImg={props.clubData.imageSrc ?? defaultImg}
        daysInThePastVisible={props.clubData.clubSettings.daysInThePastVisible}
        daysInTheFutureVisible={props.clubData.clubSettings.daysInFutureVisible}
      />
      <Box padding={"0.5rem"}>
        <FullCalendar
          ref={calendarRef}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[interactionPlugin, resourceTimeGridPlugin, ScrollGrid]}
          initialView="resourceTimeGridDay"
          navLinks={true}
          height="auto"
          headerToolbar={false}
          events={props.reservationData.map(reservationToEvent)}
          resources={props.courtData.map(courtToResource)}
          eventClick={(eventClickInfo) => props.onEventClick(eventClickInfo)}
          dateClick={(info) => {
            props.onDateClick(info);
          }}
          selectable={false}
          slotMinTime={formatTimeString(
            props.clubData.clubSettings.firstBookableHour,
            props.clubData.clubSettings.firstBookableMinute
          )}
          slotMaxTime={formatTimeString(
            props.clubData.clubSettings.lastBookableHour + 1,
            props.clubData.clubSettings.lastBookableMinute
          )}
          selectLongPressDelay={0}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          }}
          allDaySlot={false}
          eventContent={renderEventContent}
          titleFormat={{ month: "short", day: "numeric" }}
          locale={"it-it"}
          dayMinWidth={150}
        />
      </Box>
    </Box>
  );
}
