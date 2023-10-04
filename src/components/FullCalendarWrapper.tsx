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
import { useRef, type RefObject } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { type AppRouter } from "~/server/api/root";
import { defaultImg } from "~/utils/constants";
import {
  formatTimeString,
  isAdminOfTheClub,
  isSelectableSlot,
} from "~/utils/utils";
import { useClubQuery } from "./Calendar";
import CalendarEventCard from "./CalendarEventCard";
import { HorizonalDatePicker } from "./HorizontalDatePicker";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ReservationFromDb =
  RouterOutput["reservationQuery"]["getAllVisibleInCalendarByClubId"][0];
type CourtFromDb = RouterOutput["court"]["getAllByClubId"][0];

interface FullCalendarWrapperProps {
  clubData: RouterOutput["club"]["getByClubId"];
  reservationData: ReservationFromDb[];
  courtData: CourtFromDb[];
}

export default function FullCalendarWrapper(props: FullCalendarWrapperProps) {
  const calendarRef: RefObject<FullCalendar> = useRef<FullCalendar>(null);
  const clubId = useCalendarStoreContext((state) => state.clubId);
  const clubQuery = useClubQuery(clubId);
  const { data: sessionData } = useSession();
  const setDateClick = useCalendarStoreContext((state) => state.setDateClick);
  const setEventDetails = useCalendarStoreContext(
    (state) => state.setEventDetails
  );

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
    console.log(
      "selected date: ",
      selectInfo.dateStr,
      "resource: ",
      selectInfo.resource?.id
    );

    if (!clubQuery.data) {
      throw new Error("No club settings found"); // should never happen since I use this function only when clubQuery.data is defined
    }
    if (
      !isSelectableSlot(
        selectInfo.date,
        clubQuery.data.clubSettings.lastBookableHour,
        clubQuery.data.clubSettings.lastBookableMinute
      )
    ) {
      console.log("last slot is not selectable", "date: ", selectInfo.date);
      return;
    }
    setDateClick(selectInfo);
  };

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    if (!clubId) {
      throw new Error("ClubId not found");
    }
    eventClickInfo.jsEvent.preventDefault();
    //open eventDetail dialog only for the user who made the reservation or for the admin
    if (
      eventClickInfo.event.extendedProps.userId === sessionData?.user.id ||
      isAdminOfTheClub(sessionData, clubId)
    ) {
      setEventDetails(eventClickInfo.event);
    }
  };

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
          eventClick={openEventDialog}
          dateClick={openReservationDialog}
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
          eventContent={(eventInfo: EventContentArg) => {
            return <CalendarEventCard eventInfo={eventInfo} />;
          }}
          titleFormat={{ month: "short", day: "numeric" }}
          locale={"it-it"}
          dayMinWidth={150}
        />
      </Box>
    </Box>
  );
}
