import { useEffect, useState } from "react";
import { z } from "zod";
import ReserveDialog from "~/components/ReserveDialog";

import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { api } from "~/utils/api";
import { useLogger } from "~/utils/logger";
import CalendarHeader from "./CalendarHeader";
import ErrorAlert from "./ErrorAlert";
import EventDetailDialog from "./EventDetailDialog";
import FullCalendarWrapper from "./FullCalendarWrapper";
import Spinner from "./Spinner";
import SpinnerPartial from "./SpinnerPartial";

//--------------------------------
//-------- INPUT SCHEMAS ---------
//--------------------------------
export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
  overwriteName: z.string().optional(),
  clubId: z.string(),
});

export const RecurrentReservationInputSchema = z
  .object({
    recurrentStartDate: z.date(),
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

export const reservationQueryInputSchema = z.object({
  clubId: z.string().optional(), //router param can also be undefined or array of strings
  customSelectedDate: z.date().optional(),
});

//------------------------------------
//----- QUERIES & MUTATION HOOKS -----
//------------------------------------

export const useClubQuery = (clubId: string | undefined) => {
  return api.club.getByClubId.useQuery(
    { clubId: clubId },
    {
      refetchOnWindowFocus: false,
      enabled: clubId !== undefined,
      staleTime: Infinity,
    },
  );
};

export const useCourtQuery = (clubId: string | undefined) =>
  api.court.getAllByClubId.useQuery(
    { clubId: clubId },
    {
      refetchOnWindowFocus: false,
      enabled: clubId !== undefined,
      staleTime: Infinity,
    },
  );

export const useReservationQuery = (
  clubId: string | undefined,
  selectedDate: Dayjs,
) => {
  const customSelectedDate = useCalendarStoreContext(
    (store) => store.customDateSelected,
  );
  return api.reservationQuery.getAllVisibleInCalendarByClubId.useQuery(
    {
      clubId: clubId,
      customSelectedDate: customSelectedDate
        ? selectedDate.toDate()
        : undefined,
    },
    { refetchOnWindowFocus: false, enabled: clubId !== undefined },
  );
};

export const useReservationAdd = (
  clubId: string | undefined,
  selectedDate: Dayjs,
) => {
  const reservationQuery = useReservationQuery(clubId, selectedDate);
  return api.reservationMutation.insertOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
    async onError() {
      await reservationQuery.refetch();
    },
  });
};

export const useRecurrentReservationAdd = (
  clubId: string | undefined,
  selectedDate: Dayjs,
) => {
  const reservationQuery = useReservationQuery(clubId, selectedDate);
  return api.reservationMutation.insertRecurrent.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
    async onError() {
      await reservationQuery.refetch();
    },
  });
};

export const useReservationDelete = (
  clubId: string | undefined,
  selectedDate: Dayjs,
) => {
  const reservationQuery = useReservationQuery(clubId, selectedDate);
  return api.reservationMutation.deleteOne.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
    async onError() {
      await reservationQuery.refetch();
    },
  });
};

export const useRecurrentReservationDelete = (
  clubId: string | undefined,
  selectedDate: Dayjs,
) => {
  const reservationQuery = useReservationQuery(clubId, selectedDate);
  return api.reservationMutation.deleteRecurrent.useMutation({
    async onSuccess() {
      await reservationQuery.refetch();
    },
    async onError() {
      await reservationQuery.refetch();
    },
  });
};

export default function Calendar() {
  const logger = useLogger({
    component: "Calendar",
  });
  const [clubId, setClubId] = useState<string | undefined>(undefined);
  const selectedDateInCalendar = useCalendarStoreContext(
    (store) => store.selectedDate,
  );
  const setSelectedDate = useCalendarStoreContext(
    (store) => store.setSelectedDate,
  );

  // --------------------------------
  // ------  QUERY & MUTATIONS ------
  // --------------------------------

  // reservationAdd
  const setReservationAdd = useCalendarStoreContext(
    (store) => store.setReservationAdd,
  );
  const reservationAdd = useReservationAdd(clubId, selectedDateInCalendar);

  // recurrentReservationAdd
  const setRecurrentReservationAdd = useCalendarStoreContext(
    (store) => store.setRecurrentReservationAdd,
  );
  const recurrentReservationAdd = useRecurrentReservationAdd(
    clubId,
    selectedDateInCalendar,
  );

  // reservationDelete
  const setReservationDelete = useCalendarStoreContext(
    (store) => store.setReservationDelete,
  );
  const reservationDelete = useReservationDelete(
    clubId,
    selectedDateInCalendar,
  );

  // recurrentReservationDelete
  const setRecurrentReservationDelete = useCalendarStoreContext(
    (store) => store.setRecurrentReservationDelete,
  );
  const recurrentReservationDelete = useRecurrentReservationDelete(
    clubId,
    selectedDateInCalendar,
  );

  // clubQuery
  const setClubData = useCalendarStoreContext((store) => store.setClubData);
  const clubQuery = useClubQuery(clubId);
  // data to check for rendering calendar and other sub components,
  // if I call `store.getClubData` when still undefined, I get an exception
  const clubDataInStore = useCalendarStoreContext((store) => store.clubData);

  // reservationQuery - also used by refresh button
  const setReservationQuery = useCalendarStoreContext(
    (store) => store.setReservationQuery,
  );
  const reservationQuery = useReservationQuery(clubId, selectedDateInCalendar);

  // queries for which I want to pass down their data as props to the calendar,
  // I want to manage them in a way that the subComponent render even if their data are not yet available
  // so I still show the calendar under the spinner while waiting for the queries to finish
  const courtQuery = useCourtQuery(clubId);

  // -------------------
  // ----- EFFECTS -----
  // -------------------

  //get the club id from the router when is available
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      //clubId is in local state
      setClubId(router.query.clubId as string);
    }
  }, [router.isReady]);

  // set clubData in the store when data is available
  useEffect(() => {
    if (clubQuery.data) {
      setClubData(clubQuery.data);
    }
  }, [clubQuery.data]);

  // set reservationAdd, recurrentReservationAdd, reservationDelete, recurrentReservationDelete in the store on the first render
  // then clean clubData on component unmount
  useEffect(() => {
    setReservationAdd(reservationAdd);
    setRecurrentReservationAdd(recurrentReservationAdd);
    setReservationDelete(reservationDelete);
    setRecurrentReservationDelete(recurrentReservationDelete);
    setReservationQuery(reservationQuery);
    //onComponentUnmount: reset the clubData
    return () => {
      setClubData(undefined);
      setSelectedDate(dayjs().startOf("day"));
    };
  }, []);

  // -------------------

  //if there is an error in the clubQuery, show an error alert and not render any other component (FullCalendar, ReserveDialog, EventDetailDialog)
  if (clubQuery.isError) {
    logger.error({ error: clubQuery.error }, "error in clubQuery");
    return (
      <ErrorAlert
        error={clubQuery.error}
        onClose={() => {
          void clubQuery.refetch();
        }}
      />
    );
  }

  // if club data is not available yet, show a spinner and not render any other component (FullCalendar, ReserveDialog, EventDetailDialog)
  // different then checking `if (clubQuery.isLoading)` because when finish loading,
  // clubData is not yet available in store , but the sub-component would try to render anyway
  // Should I check also reservationAdd, reservationDelete, recurrentReservationAdd, recurrentReservationDelete?
  if (!clubDataInStore) {
    return <Spinner isLoading={true} />;
  }

  return (
    <>
      <ErrorAlert
        error={
          courtQuery.error ||
          reservationQuery.error ||
          reservationAdd.error ||
          recurrentReservationAdd.error ||
          reservationDelete.error ||
          recurrentReservationDelete.error
        }
        onClose={() => {
          courtQuery.error && void courtQuery.refetch();
          reservationQuery.error && void reservationQuery.refetch();
          reservationAdd.error && void reservationAdd.reset();
          recurrentReservationAdd.error && void recurrentReservationAdd.reset();
          reservationDelete.error && void reservationDelete.reset();
          recurrentReservationDelete.error &&
            void recurrentReservationDelete.reset();
        }}
      />

      <CalendarHeader />
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
        <FullCalendarWrapper
          courtData={courtQuery.data ?? []} //to reduce the time for rendering the calendar (with a spinner on it), instead of white page
          reservationData={reservationQuery.data ?? []} //same as above
        />
      </SpinnerPartial>
      <ReserveDialog />
      <EventDetailDialog />
    </>
  );
}
