import { type DateClickArg } from "@fullcalendar/interaction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { z } from "zod";
import ReserveDialog from "~/components/ReserveDialog";
import { api } from "~/utils/api";

import { type EventClickArg } from "@fullcalendar/core";
import { type EventImpl } from "@fullcalendar/core/internal";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { isSelectableSlot } from "~/utils/utils";
import ErrorAlert from "./ErrorAlert";
import EventDetailDialog from "./EventDetailDialog";
import FullCalendarWrapper from "./FullCalendarWrapper";
import Header from "./Header";
import Spinner from "./Spinner";
import SpinnerPartial from "./SpinnerPartial";

export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
  overwriteName: z.string().optional(),
  clubId: z.string(),
});

export const ReservationDeleteInputSchema = z.object({
  reservationId: z.string(),
  clubId: z.string(),
});

export const ClubIdInputSchema = z.object({
  clubId: z.union([z.string(), z.string().array(), z.undefined()]), //router param can also be undefined or array of strings
});

export default function Calendar() {
  const { data: sessionData } = useSession();
  const [clubId, setClubId] = useState<string | undefined>(undefined);

  //get the club id from the router when is available
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      setClubId(router.query.clubId as string);
    }
  }, [router.isReady, router.query.clubId]);

  /**
   * -------------------------------------
   *      ----- trpc procedures -----
   * -------------------------------------
   */

  const clubQuery = api.club.getByClubId.useQuery(
    { clubId: clubId },
    { refetchOnWindowFocus: false, enabled: clubId !== undefined }
  );

  const courtQuery = api.court.getAllByClubId.useQuery(
    { clubId: clubId },
    { refetchOnWindowFocus: false, enabled: clubId !== undefined }
  );

  const reservationQuery =
    api.reservationQuery.getAllVisibleInCalendarByClubId.useQuery(
      { clubId: clubId },
      { refetchOnWindowFocus: false, enabled: clubId !== undefined }
    );

  const reservationAdd = api.reservationMutation.insertOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });

  const reservationDelete = api.reservationMutation.deleteOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });

  /**
   * ---------- end of trpc procedures ----------------
   */

  const openReservationDialog = (selectInfo: DateClickArg) => {
    console.log("selected date: ", selectInfo.dateStr);
    console.log("resouce: ", selectInfo.resource?.title);

    if (!selectInfo.resource) {
      throw new Error("No court selected");
    }
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
      console.log("last slot is not selectable");
      return;
    }
    setDateClick(selectInfo);
  };

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    eventClickInfo.jsEvent.preventDefault();
    if (eventClickInfo.event.extendedProps.userId === sessionData?.user.id) {
      setEventDetails(eventClickInfo.event);
    }
  };

  const addEvent = (endDate: Date, overwrittenName: string | undefined) => {
    setDateClick(undefined);
    if (dateClick?.resource === undefined || dateClick?.date === undefined) {
      throw new Error("No court or date selected");
    }
    if (!clubId) {
      throw new Error("ClubId not found");
    }
    reservationAdd.mutate({
      courtId: dateClick.resource.id,
      startDateTime: dateClick.date,
      endDateTime: endDate,
      overwriteName: overwrittenName,
      clubId: clubId,
    });
  };

  function deleteEvent(eventId: string): void {
    if (!clubId) {
      throw new Error("ClubId not found");
    }
    setEventDetails(undefined);
    console.log("delete Event: ", eventId);
    reservationDelete.mutate({ reservationId: eventId, clubId: clubId });
  }

  const [eventDetails, setEventDetails] = useState<EventImpl>();
  const [dateClick, setDateClick] = useState<DateClickArg>();

  /**
   * -------------------------------------
   * ---------- Rendering ---------------
   * -------------------------------------
   */

  if (clubQuery.error || courtQuery.error || reservationQuery.error) {
    return (
      <ErrorAlert
        error={clubQuery.error ?? courtQuery.error ?? reservationQuery.error}
        onClose={() => {
          clubQuery.error && void clubQuery.refetch();
          courtQuery.error && void courtQuery.refetch();
          reservationQuery.error && void reservationQuery.refetch();
        }}
      />
    );
  }

  if (clubQuery.isLoading || !clubId) {
    return <Spinner isLoading={true} />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {reservationAdd.error && (
        <ErrorAlert
          error={reservationAdd.error}
          onClose={() => {
            reservationAdd.reset();
            void reservationQuery.refetch();
          }}
        />
      )}

      {reservationDelete.error && (
        <ErrorAlert
          error={reservationDelete.error}
          onClose={() => {
            reservationDelete.reset();
            void reservationQuery.refetch();
          }}
        />
      )}

      <SpinnerPartial
        open={
          reservationQuery.isLoading ||
          reservationQuery.isRefetching ||
          reservationAdd.isLoading ||
          reservationDelete.isLoading
        }
      >
        <Header
          headerName={clubQuery.data.name}
          logoSrc={clubQuery.data.logoSrc}
        />
        <FullCalendarWrapper
          clubData={clubQuery.data}
          courtData={courtQuery.data ?? []} //to reduce the time for rendering the calendar (with a spinner on it), instead of white page
          reservationData={reservationQuery.data ?? []} //same
          onDateClick={openReservationDialog}
          onEventClick={openEventDialog}
        />
      </SpinnerPartial>

      <ReserveDialog
        open={dateClick !== undefined}
        startDate={dateClick?.date}
        resource={dateClick?.resource?.title}
        onDialogClose={() => setDateClick(undefined)}
        onConfirm={(endDate: Date, overwrittenName: string | undefined) =>
          addEvent(endDate, overwrittenName)
        }
        clubId={clubId}
        clubSettings={clubQuery.data.clubSettings}
      />

      <EventDetailDialog
        open={eventDetails !== undefined}
        eventDetails={eventDetails}
        onDialogClose={() => setEventDetails(undefined)}
        sessionData={sessionData}
        onReservationDelete={(id) => deleteEvent(id)}
        clubId={clubId}
        clubSettings={clubQuery.data.clubSettings}
      />
    </LocalizationProvider>
  );
}
