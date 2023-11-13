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
import { useLogger } from "~/utils/logger";
import { isAdminOfTheClub } from "~/utils/utils";
import DialogLayout from "./DialogLayout";
import ReserveDialogEndDate from "./ReserveDialogEndDate";
import ReserveDialogLoginButton from "./ReserveDialogLoginButton";
import ReserveDialogRecurrent from "./ReserveDialogRecurrent";

export default function ReserveDialog() {
  const { data: sessionData } = useSession();

  const startDate = useCalendarStoreContext((store) => store.getStartDate());

  const clubData = useCalendarStoreContext((store) => store.getClubData());
  const reservationAdd = useCalendarStoreContext((store) =>
    store.getReservationAdd(),
  );
  const recurrentReservationAdd = useCalendarStoreContext((store) =>
    store.getRecurrentReservationAdd(),
  );

  const dateClick = useCalendarStoreContext((state) => state.dateClick);
  const setDateClick = useCalendarStoreContext((state) => state.setDateClick);
  const endDate = useCalendarStoreContext((store) => store.endDate);
  const setEndDate = useCalendarStoreContext((store) => store.setEndDate);
  const endDateError = useCalendarStoreContext((store) => store.endDateError);
  const recurrentEndDate = useCalendarStoreContext(
    (state) => state.recurrentEndDate,
  );
  const setRecurrentEndDate = useCalendarStoreContext(
    (state) => state.setRecurrentEndDate,
  );
  const recurrentEndDateError = useCalendarStoreContext(
    (state) => state.recurringEndDateError,
  );

  const [overwriteName, setOverwriteName] = useState<string | undefined>(
    undefined,
  );
  const resource = dateClick?.resource;
  const logger = useLogger({ component: "ReserveDialog" });

  const onConfirmButton = () => {
    if (!endDate || !startDate || !resource) {
      logger.error(
        {
          endDate: endDate?.toDate(),
          startDate: startDate?.toDate(),
          resource: resource,
        },
        "onConfirmButton: unexpected null value",
      );
      throw new Error("Si è verificato un problema, per favore riprova.");
    }

    const dataPayload = {
      startDateTime: startDate.toDate(),
      endDateTime: endDate.toDate(),
      overwriteName: overwriteName, //manage undefined of input for controlled component
      clubId: clubData.id,
      courtId: resource.id,
    };

    // recurrent reservation add
    if (recurrentEndDate) {
      const recurrentDataPayload = {
        ...dataPayload,
        recurrentEndDate: recurrentEndDate.toDate(),
      };
      logger.info(recurrentDataPayload, "recurrent reservation added");
      recurrentReservationAdd.mutate(recurrentDataPayload);
    } else {
      // single reservation add
      logger.info(dataPayload, "reservation added");
      reservationAdd.mutate(dataPayload);
    }
    setDateClick(null);
    setOverwriteName(undefined);
    setEndDate(null);
    setRecurrentEndDate(null);
  };

  return (
    <>
      <Dialog
        data-test="reserve-dialog"
        open={dateClick !== null}
        onClose={() => {
          setDateClick(null);
          setOverwriteName(undefined);
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
              {isAdminOfTheClub(sessionData, clubData.id) && (
                <TextField
                  data-test="overwriteName"
                  variant="outlined"
                  placeholder="Nome"
                  label="Nome prenotazione"
                  value={overwriteName || ""}
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
              <ReserveDialogEndDate clubSettings={clubData.clubSettings} />

              {/* recurrent reservation */}
              <ReserveDialogRecurrent />

              {/* start date in the past warning */}
              {!startDateIsFuture(sessionData, clubData.id, startDate) && (
                <Box display={"flex"}>
                  <Alert data-test="past-warning" severity={"warning"}>
                    Non puoi prenotare una data nel passato
                  </Alert>
                </Box>
              )}

              <Button
                onClick={onConfirmButton}
                disabled={
                  !startDateIsFuture(sessionData, clubData.id, startDate) ||
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
  startDate: Dayjs,
) => {
  return isAdminOfTheClub(sessionData, clubId) || startDate.isAfter(dayjs());
};
