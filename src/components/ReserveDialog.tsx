import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, TimeField } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";
import {
  useClubQuery,
  useRecurrentReservationAdd,
  useReservationAdd,
} from "./Calendar";
import DialogLayout from "./DialogLayout";
import ErrorAlert from "./ErrorAlert";
import ReserveDialogEndDate from "./ReserveDialogEndDate";
import ReserveDialogLoginButton from "./ReserveDialogLoginButton";
import ReserveDialogRecurrent from "./ReserveDialogRecurrent";
import Spinner from "./Spinner";

export default function ReserveDialog() {
  const { data: sessionData } = useSession();

  const startDate = useCalendarStoreContext((store) => store.getStartDate());
  const clubId = useCalendarStoreContext((state) => state.getClubId());

  const clubQuery = useClubQuery(clubId);
  const reservationAdd = useReservationAdd(clubId);
  const recurrentReservationAdd = useRecurrentReservationAdd(clubId);

  const dateClick = useCalendarStoreContext((state) => state.dateClick);
  const setDateClick = useCalendarStoreContext((state) => state.setDateClick);
  const endDate = useCalendarStoreContext((store) => store.endDate);
  const setEndDate = useCalendarStoreContext((store) => store.setEndDate);

  const endDateError = useCalendarStoreContext((store) => store.endDateError);

  const recurrentEndDate = useCalendarStoreContext(
    (state) => state.recurrentEndDate
  );
  const setRecurrentEndDate = useCalendarStoreContext(
    (state) => state.setRecurrentEndDate
  );
  const recurrentEndDateError = useCalendarStoreContext(
    (state) => state.recurringEndDateError
  );

  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const resource = dateClick?.resource;

  const onConfirmButton = () => {
    if (!endDate || !startDate || !resource) {
      console.error(
        "endDate",
        endDate,
        "startDate",
        startDate,
        "resource",
        resource
      );
      throw new Error("Si è verificato un problema, per favore riprova.");
    }

    console.log(
      "startDate: ",
      startDate,
      "endDate: ",
      endDate,
      "recurrentEndDate: ",
      recurrentEndDate,
      "overwriteName: ",
      overwriteName,
      "resource: ",
      resource.id,
      "resource title: ",
      resource.title,
      "clubId: ",
      clubId
    );
    //todo: use a single api end point for both reservation and recurrent reservation
    const name = overwriteName !== "" ? overwriteName : undefined; //manage undefined of input for controlled component
    if (recurrentEndDate) {
      recurrentReservationAdd.mutate({
        clubId: clubId,
        courtId: resource.id,
        startDateTime: startDate.toDate(),
        endDateTime: endDate.toDate(),
        overwriteName: name,
        recurrentEndDate: recurrentEndDate.hour(23).minute(59).toDate(), //TODO: fix that
      });
    } else {
      reservationAdd.mutate({
        courtId: resource.id,
        startDateTime: startDate.toDate(),
        endDateTime: endDate.toDate(),
        overwriteName: name,
        clubId: clubId,
      });
    }

    setDateClick(null);
    setOverwriteName("");
    setEndDate(null);
    setRecurrentEndDate(null);
  };

  // error handling
  if (
    reservationAdd.error ||
    recurrentReservationAdd.error ||
    clubQuery.error
  ) {
    return (
      <ErrorAlert
        error={
          reservationAdd.error ??
          recurrentReservationAdd.error ??
          clubQuery.error
        }
        onClose={() => {
          reservationAdd.error && reservationAdd.reset();
          recurrentReservationAdd.error && recurrentReservationAdd.reset();
          clubQuery.error && void clubQuery.refetch();
        }}
      />
    );
  }

  // loading handling
  if (
    reservationAdd.isLoading ||
    recurrentReservationAdd.isLoading ||
    clubQuery.isLoading
  ) {
    return <Spinner isLoading={true} />;
  }

  return (
    <>
      <Dialog
        data-test="reserve-dialog"
        open={dateClick !== null}
        onClose={() => {
          setDateClick(null);
          setOverwriteName("");
          setEndDate(null);
          setRecurrentEndDate(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogLayout title="Prenota">
          {/* if not login only show "Login" button with no other fields */}
          {sessionData ? (
            <>
              {/* court name */}
              <DialogActions>
                <Typography gutterBottom>{resource?.title}</Typography>
              </DialogActions>

              {/* overwrite name, only if admin mode */}
              {isAdminOfTheClub(sessionData, clubId) && (
                <TextField
                  data-test="overwriteName"
                  variant="outlined"
                  placeholder="Nome"
                  label="Nome prenotazione"
                  value={overwriteName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOverwriteName(e.target.value)
                  }
                  fullWidth
                  color="info"
                />
              )}
              {/* date */}
              <DateField
                inputProps={{ "data-test": "date" }}
                value={startDate}
                readOnly={true}
                label={"Data"}
                format="DD/MM/YYYY"
                size="small"
                fullWidth
                color="info"
              />
              {/* start time */}
              <TimeField
                inputProps={{ "data-test": "startTime" }}
                value={startDate}
                label={"Orario di inizio"}
                readOnly={true}
                ampm={false}
                size="small"
                fullWidth
                color="info"
              />

              {/* end time */}
              <ReserveDialogEndDate
                clubSettings={clubQuery.data.clubSettings}
              />

              {/* recurrent reservation */}
              <ReserveDialogRecurrent />

              {/* start date in the past warning */}
              {!startDateIsFuture(sessionData, clubId, startDate) && (
                <Box display={"flex"}>
                  <Alert data-test="past-warning" severity={"warning"}>
                    Non puoi prenotare una data nel passato
                  </Alert>
                </Box>
              )}

              <Button
                onClick={onConfirmButton}
                disabled={
                  !startDateIsFuture(sessionData, clubId, startDate) ||
                  endDateError ||
                  recurrentEndDateError
                }
                color="info"
                data-test="reserveButton"
              >
                Prenota
              </Button>
            </>
          ) : (
            <ReserveDialogLoginButton />
          )}
        </DialogLayout>
      </Dialog>
    </>
  );
}

export const startDateIsFuture = (
  sessionData: Session | null,
  clubId: string,
  startDate: Dayjs
) => {
  return isAdminOfTheClub(sessionData, clubId) || startDate.isAfter(dayjs());
};
