import { type DateClickArg } from "@fullcalendar/interaction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { z } from "zod";
import ReserveDialog from "~/components/ReserveDialog";
import { api } from "~/utils/api";

import { type EventClickArg } from "@fullcalendar/core";
import { type EventImpl } from "@fullcalendar/core/internal";
import { Skeleton, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { defaultLogoSrc } from "~/utils/constants";
import ErrorAlert from "./ErrorAlert";
import EventDetailDialog from "./EventDetailDialog";
import FullCalendarWrapper from "./FullCalendarWrapper";
import Header from "./Header";
import SpinnerPartial from "./SpinnerPartial";

export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
  overwriteName: z.string().optional(),
});

export const ClubIdInputSchema = z.object({
  clubId: z.union([z.string(), z.string().array(), z.undefined()]),
});

export default function Calendar() {
  const { data: sessionData } = useSession();
  const [clubId, setClubId] = useState<string | undefined>(undefined);

  //get the club name from the router when is available
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
    { enabled: clubId !== undefined }
  );

  const courtQuery = api.court.getAllByClubId.useQuery(
    { clubId: clubId },
    {
      refetchOnWindowFocus: false,
      enabled: clubId !== undefined,
    }
  );

  const reservationQuery =
    api.reservation.getAllVisibleInCalendarByClubId.useQuery(
      { clubId: clubId },
      {
        refetchOnWindowFocus: false,
        enabled: clubId !== undefined,
      }
    );

  const reservationAdd = api.reservation.insertOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });

  const reservationDelete = api.reservation.deleteOne.useMutation({
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

    if (selectInfo.resource === undefined) {
      throw new Error("No court selected");
    }
    setDateClick(selectInfo);
  };

  const openEventDialog = (eventClickInfo: EventClickArg) => {
    setEventDetails(eventClickInfo.event);
  };

  const addEvent = (endDate: Date, overwrittenName?: string) => {
    setDateClick(undefined);
    // setShowPotentialErrorOnAdd(true);

    if (dateClick?.resource === undefined || dateClick?.date === undefined) {
      throw new Error("No court or date selected");
    }
    reservationAdd.mutate({
      courtId: dateClick.resource.id,
      startDateTime: dateClick.date,
      endDateTime: endDate,
      overwriteName: overwrittenName,
    });
  };

  function deleteEvent(eventId: string): void {
    setEventDetails(undefined);
    console.log("delete Event: ", eventId);
    reservationDelete.mutate(eventId);
  }

  const [eventDetails, setEventDetails] = useState<EventImpl>();
  const [dateClick, setDateClick] = useState<DateClickArg>();

  /**
   * -------------------------------------
   * ---------- Rendering ---------------
   * -------------------------------------
   */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {reservationAdd.error !== null && (
        <ErrorAlert
          error={reservationAdd.error}
          onClose={() => reservationAdd.reset()}
        />
      )}

      {reservationDelete.error !== null && (
        <ErrorAlert
          error={reservationDelete.error}
          onClose={() => reservationDelete.reset()}
        />
      )}

      <SpinnerPartial
        open={
          clubQuery.isLoading ||
          reservationQuery.isLoading ||
          courtQuery.isLoading ||
          reservationAdd.isLoading ||
          reservationDelete.isLoading
        }
      >
        <Header
          headerName={clubQuery.data?.name}
          logoSrc={clubQuery.data?.logoSrc}
        />
        <FullCalendarWrapper
          reservationData={reservationQuery.data ?? []}
          courtsData={courtQuery.data ?? []}
          onDateClick={openReservationDialog}
          onEventClick={openEventDialog}
        />
      </SpinnerPartial>

      <ReserveDialog
        open={dateClick !== undefined}
        dateClick={dateClick}
        onDialogClose={() => setDateClick(undefined)}
        onConfirm={(endDate, overwrittenName?) =>
          addEvent(endDate, overwrittenName)
        }
      />

      <EventDetailDialog
        open={eventDetails !== undefined}
        eventDetails={eventDetails}
        onDialogClose={() => setEventDetails(undefined)}
        sessionData={sessionData}
        onReservationDelete={(id) => deleteEvent(id)}
      />
    </LocalizationProvider>
  );
}
