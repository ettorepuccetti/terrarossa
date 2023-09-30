import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import { z } from "zod";
import ReserveDialog from "~/components/ReserveDialog";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useStore } from "~/hooks/UseStore";
import { api } from "~/utils/api";
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

export const RecurrentReservationInputSchema = z
  .object({
    recurrentEndDate: z.date(),
  })
  .and(ReservationInputSchema);

export const ReservationDeleteInputSchema = z.object({
  reservationId: z.string(),
  clubId: z.string(),
});

export const RecurrentReservationDeleteInputSchema = z.object({
  recurrentReservationId: z.string(),
  clubId: z.string(),
});

export const ClubIdInputSchema = z.object({
  clubId: z.union([z.string(), z.string().array(), z.undefined()]), //router param can also be undefined or array of strings
});

export const useClubQuery = (clubId: string | undefined) => {
  return api.club.getByClubId.useQuery(
    { clubId: clubId },
    {
      refetchOnWindowFocus: false,
      enabled: clubId !== undefined,
      staleTime: Infinity,
    }
  );
};

export const useCourtQuery = (clubId: string | undefined) =>
  api.court.getAllByClubId.useQuery(
    { clubId: clubId },
    { refetchOnWindowFocus: false, enabled: clubId !== undefined }
  );

export const useReservationQuery = (clubId: string | undefined) =>
  api.reservationQuery.getAllVisibleInCalendarByClubId.useQuery(
    { clubId: clubId },
    { refetchOnWindowFocus: false, enabled: clubId !== undefined }
  );

export const useReservationAdd = (clubId: string | undefined) => {
  const reservationQuery = useReservationQuery(clubId);
  return api.reservationMutation.insertOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });
};

export const useRecurrentReservationAdd = (clubId: string | undefined) => {
  const reservationQuery = useReservationQuery(clubId);
  return api.reservationMutation.insertRecurrent.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });
};

export const useReservationDelete = (clubId: string | undefined) => {
  const reservationQuery = useReservationQuery(clubId);
  return api.reservationMutation.deleteOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });
};

export const useRecurrentReservationDelete = (clubId: string | undefined) => {
  const reservationQuery = useReservationQuery(clubId);
  return api.reservationMutation.deleteRecurrent.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
  });
};

export default function Calendar() {
  const { data: sessionData } = useSession();
  const clubId = useStore((state) => state.clubId);
  const setClubId = useStore((state) => state.setClubId);

  //get the club id from the router when is available
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      setClubId(router.query.clubId as string);
    }
  }, [router.isReady, router.query.clubId, setClubId]);

  /**
   * -------------------------------------
   *      ----- trpc procedures -----
   * -------------------------------------
   */

  const clubQuery = useClubQuery(clubId);
  const courtQuery = useCourtQuery(clubId);
  const reservationQuery = useReservationQuery(clubId);
  const reservationAdd = useReservationAdd(clubId);
  const recurrentReservationAdd = useRecurrentReservationAdd(clubId);
  const reservationDelete = useReservationDelete(clubId);
  const recurrentReservationDelete = useRecurrentReservationDelete(clubId);

  /**
   * ---------- end of trpc procedures ----------------
   */

  const eventDetails = useStore((state) => state.eventDetails);
  const setEventDetails = useStore((state) => state.setEventDetails);

  function deleteEvent(eventId: string): void {
    if (!clubId) {
      throw new Error("ClubId not found");
    }
    setEventDetails(null);
    console.log("delete event: ", eventId);
    reservationDelete.mutate({ reservationId: eventId, clubId: clubId });
  }

  function deleteRecurrentEvent(recurrentReservationId: string): void {
    if (!clubId) {
      throw new Error("ClubId not found");
    }
    setEventDetails(null);
    console.log("delete recurrent event: ", recurrentReservationId);
    recurrentReservationDelete.mutate({
      recurrentReservationId: recurrentReservationId,
      clubId: clubId,
    });
  }

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
      {/* error handling */}
      {(reservationAdd.error ||
        recurrentReservationAdd.error ||
        reservationDelete.error ||
        recurrentReservationDelete.isError) && (
        <ErrorAlert
          error={
            reservationAdd.error ??
            recurrentReservationAdd.error ??
            reservationDelete.error ??
            recurrentReservationDelete.error
          }
          onClose={() => {
            reservationAdd.error && reservationAdd.reset();
            recurrentReservationAdd.error && recurrentReservationAdd.reset();
            reservationDelete.error && reservationDelete.reset();
            recurrentReservationDelete.error &&
              recurrentReservationDelete.reset();
            void reservationQuery.refetch();
          }}
        />
      )}

      <SpinnerPartial
        open={
          reservationQuery.isLoading ||
          reservationQuery.isRefetching ||
          reservationAdd.isLoading ||
          reservationDelete.isLoading ||
          recurrentReservationAdd.isLoading ||
          recurrentReservationDelete.isLoading
        }
      >
        <Header
          headerName={clubQuery.data.name}
          logoSrc={clubQuery.data.logoSrc}
        />
        <FullCalendarWrapper
          clubData={clubQuery.data}
          courtData={courtQuery.data ?? []} //to reduce the time for rendering the calendar (with a spinner on it), instead of white page
          reservationData={reservationQuery.data ?? []} //same as above
        />
      </SpinnerPartial>

      <ReserveDialog />

      <EventDetailDialog
        open={eventDetails !== undefined}
        eventDetails={eventDetails}
        onDialogClose={() => setEventDetails(null)}
        sessionData={sessionData}
        onReservationDelete={(id) => deleteEvent(id)}
        onRecurrentReservationDelete={(id) => deleteRecurrentEvent(id)}
        clubId={clubId}
        clubSettings={clubQuery.data.clubSettings}
      />
    </LocalizationProvider>
  );
}
