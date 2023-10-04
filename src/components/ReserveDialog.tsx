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
import { type ClubSettings } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";
import { useRecurrentReservationAdd, useReservationAdd } from "./Calendar";
import DialogLayout from "./DialogLayout";
import ErrorAlert from "./ErrorAlert";
import ReserveDialogEndDate from "./ReserveDialogEndDate";
import ReserveDialogLoginButton from "./ReserveDialogLoginButton";
import ReserveDialogRecurrent from "./ReserveDialogRecurrent";
import Spinner from "./Spinner";

export interface ReserveDialogProps {
  clubSettings: ClubSettings;
}

export default function ReserveDialog() {
  const dateClick = useCalendarStoreContext((state) => state.dateClick);
  const clubId = useCalendarStoreContext((state) => state.getClubId());
  const setDateClick = useCalendarStoreContext((state) => state.setDateClick);
  const reservationAdd = useReservationAdd(clubId);
  const recurrentReservationAdd = useRecurrentReservationAdd(clubId);
  const { data: sessionData } = useSession();

  const startDate = useMemo(() => dayjs(dateClick?.date), [dateClick?.date]);
  const resource = dateClick?.resource;

  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endDateError, setEndDateError] = useState<boolean>(false);
  const [recurrentEndDate, setRecurrentEndDate] = useState<Dayjs | null>(null);
  const [recurrentEndDateError, setRecurrentEndDateError] =
    useState<boolean>(false);

  const onConfirmButton = () => {
    if (!endDate || !startDate || !resource) {
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

    const name = overwriteName !== "" ? overwriteName : undefined;
    if (recurrentEndDate) {
      recurrentReservationAdd.mutate({
        clubId: clubId,
        courtId: resource.id,
        startDateTime: startDate.toDate(),
        endDateTime: endDate.toDate(),
        overwriteName: name,
        recurrentEndDate: recurrentEndDate.hour(23).minute(59).toDate(), //TODO: fix that
      });
      return;
    }
    reservationAdd.mutate({
      courtId: resource.id,
      startDateTime: startDate.toDate(),
      endDateTime: endDate.toDate(),
      overwriteName: name,
      clubId: clubId,
    });

    setDateClick(null);
    setOverwriteName("");
    setEndDate(null);
    setRecurrentEndDate(null);
  };

  // error handling
  if (reservationAdd.error || recurrentReservationAdd.error) {
    return (
      <ErrorAlert
        error={reservationAdd.error ?? recurrentReservationAdd.error}
        onClose={() => {
          reservationAdd.error && reservationAdd.reset();
          recurrentReservationAdd.error && recurrentReservationAdd.reset();
        }}
      />
    );
  }

  // loading handling
  if (reservationAdd.isLoading || recurrentReservationAdd.isLoading) {
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
                endDate={endDate}
                startDate={startDate}
                clubId={clubId}
                disabled={!startDateIsFuture(sessionData, clubId, startDate)}
                endDateEventHandler={setEndDate}
                endDateErrorEventHandler={setEndDateError}
              />
              {/* recurrent reservation */}
              <ReserveDialogRecurrent
                clubId={clubId}
                startDate={startDate}
                recurrentDateEventHandler={setRecurrentEndDate}
                recurrentDateErrorEventHandler={setRecurrentEndDateError}
                recurrentEndDate={recurrentEndDate}
              />
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

const startDateIsFuture = (
  sessionData: Session | null,
  clubId: string,
  startDate: Dayjs
) => {
  return isAdminOfTheClub(sessionData, clubId) || startDate.isAfter(dayjs());
};
