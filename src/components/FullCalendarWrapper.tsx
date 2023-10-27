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
import { Box } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useEffect, useRef, type RefObject } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { type AppRouter } from "~/server/api/root";
import { loggerInternal } from "~/utils/logger";
import {
  formatTimeString,
  isAdminOfTheClub,
  isSelectableSlot,
} from "~/utils/utils";
import CalendarEventCard from "./CalendarEventCard";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ReservationFromDb =
  RouterOutput["reservationQuery"]["getAllVisibleInCalendarByClubId"][0];
type CourtFromDb = RouterOutput["court"]["getAllByClubId"][0];

interface FullCalendarWrapperProps {
  reservationData: ReservationFromDb[];
  courtData: CourtFromDb[];
}

export default function FullCalendarWrapper(props: FullCalendarWrapperProps) {
  const logger = loggerInternal.child({ component: "FullCalendarWrapper" });
  const calendarRef: RefObject<FullCalendar> = useRef<FullCalendar>(null);
  const setCalendarRef = useCalendarStoreContext(
    (state) => state.setCalendarRef,
  );
  const clubData = useCalendarStoreContext((state) => state.getClubData());
  const setDateClick = useCalendarStoreContext((state) => state.setDateClick);
  const setEventDetails = useCalendarStoreContext(
    (state) => state.setEventDetails,
  );
  const { data: sessionData } = useSession();

  // to fix: https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
  useEffect(() => {
    setCalendarRef(calendarRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const openReservationDialog = (selectInfo: DateClickArg) => {
    logger.info("openReservationDialog", {
      selectedDate: selectInfo.dateStr,
      resourceId: selectInfo.resource?.id,
      resourceTitle: selectInfo.resource?.title,
    });

    if (
      !isSelectableSlot(
        selectInfo.date,
        clubData.clubSettings.lastBookableHour,
        clubData.clubSettings.lastBookableMinute,
      )
    ) {
      console.log("last slot is not selectable", "date: ", selectInfo.date);
      return;
    }
    setDateClick(selectInfo);
  };

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    eventClickInfo.jsEvent.preventDefault();
    //open eventDetail dialog only for the user who made the reservation or for the admin
    if (
      eventClickInfo.event.extendedProps.userId === sessionData?.user.id ||
      isAdminOfTheClub(sessionData, clubData.id)
    ) {
      logger.info("open event detail dialog", {
        reservationId: eventClickInfo.event.id,
        clubId: clubData.id,
        clubName: clubData.name,
        courtId: eventClickInfo.event.getResources()[0]?.id,
        courtName: eventClickInfo.event.getResources()[0]?.title,
        startDate: eventClickInfo.event.start,
        endDate: eventClickInfo.event.end,
        userId: eventClickInfo.event.extendedProps.userId as string,
        recurrentReservationId: eventClickInfo.event.extendedProps
          .recurrentId as string,
      });
      setEventDetails(eventClickInfo.event);
    }
  };

  return (
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
        eventClick={openEventDialog}
        dateClick={openReservationDialog}
        selectable={false}
        slotMinTime={formatTimeString(
          clubData.clubSettings.firstBookableHour,
          clubData.clubSettings.firstBookableMinute,
        )}
        slotMaxTime={formatTimeString(
          clubData.clubSettings.lastBookableHour + 1,
          clubData.clubSettings.lastBookableMinute,
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
        eventContent={(eventInfo: EventContentArg) => {
          return <CalendarEventCard eventInfo={eventInfo} />;
        }}
        titleFormat={{ month: "short", day: "numeric" }}
        locale={"it-it"}
        dayMinWidth={150}
      />
    </Box>
  );
}
