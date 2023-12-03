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
import { Box, useTheme, type PaletteColor } from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useEffect, useRef, type RefObject } from "react";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import { type AppRouter } from "~/server/api/root";
import { useLogger } from "~/utils/logger";
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
  const theme = useTheme();
  const { data: sessionData } = useSession();
  const logger = useLogger({
    component: "FullCalendarWrapper",
  });
  const calendarRef: RefObject<FullCalendar> = useRef<FullCalendar>(null);
  const setCalendarRef = useMergedStoreContext((state) => state.setCalendarRef);
  const clubData = useMergedStoreContext((state) => state.getClubData());
  const setDateClick = useMergedStoreContext((state) => state.setDateClick);
  const setEventDetails = useMergedStoreContext(
    (state) => state.setEventDetails,
  );

  // to fix: https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
  useEffect(() => {
    setCalendarRef(calendarRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reservationToEventMapper = (
    reservation: ReservationFromDb,
  ): EventInput => {
    const getColors = (): PaletteColor => {
      if (reservation.recurrentReservationId) {
        return theme.palette.orange;
      }
      if (reservation.user?.role === "ADMIN") {
        return theme.palette.yellow;
      }
      if (reservation.user?.id === sessionData?.user.id) {
        return theme.palette.blue;
      }
      return theme.palette.lightBlue;
    };

    const paletteColor = getColors();

    return {
      id: reservation.id.toString(),
      title:
        (reservation.overwriteName
          ? reservation.overwriteName
          : reservation.user?.name) ?? undefined,
      start: reservation.startTime,
      end: reservation.endTime,
      resourceId: reservation.courtId,
      color: paletteColor.main,
      borderColor: paletteColor.dark,
      textColor: paletteColor.contrastText,
      extendedProps: {
        userId: reservation.user?.id,
        userImg: reservation.user?.image,
        recurrentId: reservation.recurrentReservationId,
      },
    };
  };

  const courtToResourceMapper = (court: CourtFromDb): ResourceInput => {
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
      logger.info({ date: selectInfo.date }, "last slot is not selectable");
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
        events={props.reservationData.map(reservationToEventMapper)}
        resources={props.courtData.map(courtToResourceMapper)}
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
