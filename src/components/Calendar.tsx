/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import ReserveDialog from "~/components/ReserveDialog";

import { Container, LinearProgress } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import {
  useClubQuery,
  useCourtQuery,
  useRecurrentReservationAdd,
  useRecurrentReservationDelete,
  useReservationAdd,
  useReservationDelete,
  useReservationQuery,
} from "~/hooks/calendarTrpcHooks";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { useLogger } from "~/utils/logger";
import CalendarClubInfo from "./CalendarClubInfo";
import CalendarHeader from "./CalendarHeader";
import ErrorAlert from "./ErrorAlert";
import EventDetailDialog from "./EventDetailDialog";
import FullCalendarWrapper from "./FullCalendarWrapper";
import { ReserveSuccessSnackbar } from "./ReserveSuccessSnackbar";
import SpinnerPartial from "./SpinnerPartial";

export default function Calendar() {
  const logger = useLogger({
    component: "Calendar",
  });
  const [clubId, setClubId] = useState<string | undefined>(undefined);
  const selectedDateInCalendar = useMergedStoreContext(
    (store) => store.selectedDate,
  );

  // used to reset the selectedDate to current date when entering the calendar
  const setSelectedDate = useMergedStoreContext(
    (store) => store.setSelectedDate,
  );

  // --------------------------------
  // ------ QUERY & MUTATIONS -------
  // --------------------------------

  // reservationQuery - also used by refresh button
  const reservationQuery = useReservationQuery(clubId, selectedDateInCalendar);

  const reservationAdd = useReservationAdd(reservationQuery);
  const recurrentReservationAdd = useRecurrentReservationAdd(reservationQuery);
  const reservationDelete = useReservationDelete(reservationQuery);
  const recurrentReservationDelete =
    useRecurrentReservationDelete(reservationQuery);

  // clubQuery
  const setClubData = useMergedStoreContext((store) => store.setClubData);
  const clubQuery = useClubQuery(clubId);
  // data to check for rendering calendar and other sub components,
  // if I call `store.getClubData` when still undefined, I get an exception
  const clubDataInStore = useMergedStoreContext((store) => store.clubData);

  // queries for which I want to pass down their data as props to the calendar,
  // I want to manage them in a way that the subComponent render even if their data are not yet available
  // so I still show the calendar under the spinner while waiting for the queries to finish
  const courtQuery = useCourtQuery(clubId);

  // -------------------
  // ----- EFFECTS -----
  // -------------------

  //get the club id from the router when is available and reset date
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      //clubId is in local state
      setClubId(router.query.clubId as string);
      // reset selected date to current date when entering the calendar page
      setSelectedDate(dayjs());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // set clubData in the store when data is available
  useEffect(() => {
    if (clubQuery.data) {
      setClubData(clubQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubQuery.data]);

  // -------------------

  //if there is an error in the clubQuery, show an error alert and not render any other component (FullCalendar, ReserveDialog, EventDetailDialog)
  if (clubQuery.isError) {
    logger.error("error in clubQuery", { error: clubQuery.error });
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
    return <LinearProgress variant="query" color="primary" />;
  }

  return (
    <>
      <Container maxWidth={"lg"} sx={{ padding: 0 }}>
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
            recurrentReservationAdd.error &&
              void recurrentReservationAdd.reset();
            reservationDelete.error && void reservationDelete.reset();
            recurrentReservationDelete.error &&
              void recurrentReservationDelete.reset();
          }}
        />

        <CalendarHeader reservationQuery={reservationQuery} />
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
        <CalendarClubInfo />
      </Container>
      <ReserveDialog
        reservationAdd={reservationAdd}
        recurrentReservationAdd={recurrentReservationAdd}
      />
      <EventDetailDialog
        reservationDelete={reservationDelete}
        recurrentReservationDelete={recurrentReservationDelete}
      />
      <ReserveSuccessSnackbar />
    </>
  );
}
