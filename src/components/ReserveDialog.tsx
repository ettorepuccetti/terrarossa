import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import {
  DateField,
  TimeField,
  TimePicker,
  type TimeValidationError,
} from "@mui/x-date-pickers";
import { type ClubSettings } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { isAdminOfTheClub } from "~/utils/utils";
import DialogLayout from "./DialogLayout";

export interface ReserveDialogProps {
  open: boolean;
  startDate: Date | undefined;
  resource: string | undefined;
  onConfirm: (endDate: Date, overwrittenName: string | undefined) => void;
  onDialogClose: () => void;
  clubId: string;
  clubSettings: ClubSettings;
}

export default function ReserveDialog(props: ReserveDialogProps) {
  const { open, resource } = props;
  const startDate = dayjs(props.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const { data: sessionData } = useSession();
  const [endDateError, setEndDateError] = useState<string | undefined>(
    undefined
  );

  // to set endDate to startDate + 1 hour, when component is mounted
  useEffect(() => {
    if (!props.startDate) {
      return;
    }
    setEndDate(
      dayjs(props.startDate)
        .add(1, "hours")
        .set("second", 0)
        .set("millisecond", 0)
    );
  }, [props.startDate]);

  const onConfirmButton = () => {
    if (!endDate) {
      throw new Error(
        "Non è stato possibile impostare la data di fine prenotazione. Per favore riprova."
      );
    }
    console.log("startDate in calendar: ", startDate);
    console.log("endDate from dialog: ", endDate);

    props.onConfirm(
      endDate.toDate(),
      //manage overwriteName limitation about controlled component
      overwriteName !== "" ? overwriteName : undefined
    );
    setOverwriteName("");
    setEndDate(null);
  };

  const canBook =
    isAdminOfTheClub(sessionData, props.clubId) || startDate.isAfter(dayjs());

  const maxTime = () => {
    // default case
    const maxTime = startDate.add(2, "hours");

    // manage case in which endTime would be after club closing time, apply also for ADMIN
    const clubClosingTime = dayjs(startDate)
      .hour(props.clubSettings.lastBookableHour + 1) // TODO: +1 implicit assumption
      .minute(props.clubSettings.lastBookableMinute)
      .second(0)
      .millisecond(0);
    if (maxTime.isAfter(clubClosingTime)) {
      return clubClosingTime;
    }

    // manage ADMIN case, free to book as much as he wants
    if (isAdminOfTheClub(sessionData, props.clubId)) {
      return undefined;
    }

    // manage case in which endTime would be the next day (so end time before start time)
    // TODO: useless because club closing time should be before midnight
    if (maxTime.day() !== startDate.day()) {
      return startDate.endOf("day");
    }

    return maxTime;
  };

  const setEndDateErrorText = (error: TimeValidationError) => {
    if (!error) {
      setEndDateError(undefined);
      return;
    }
    if (error === "minutesStep" || error === "minTime") {
      setEndDateError("Prenota 1 ora, 1 ora e mezzo o 2 ore");
      return;
    }
    if (error === "maxTime") {
      setEndDateError(
        "Prenota al massimo 2 ore. Rispetta l'orario di chiusura del circolo"
      );
      return;
    }
    setEndDateError(error.toString());
  };

  return (
    <>
      <Dialog
        data-test="reserve-dialog"
        open={open}
        onClose={() => {
          setOverwriteName("");
          setEndDate(null);
          props.onDialogClose();
        }}
      >
        <DialogLayout title="Prenota">
          {/* if not login only show login button with no other fields */}
          {sessionData ? (
            <>
              {/* court name */}
              <DialogActions>
                <Typography gutterBottom>{resource}</Typography>
              </DialogActions>

              {/* overwrite name, only if admin mode */}
              {isAdminOfTheClub(sessionData, props.clubId) && (
                <TextField
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
              <TimePicker
                slotProps={{
                  textField: {
                    inputProps: { "data-test": "endTime" },
                    color: "info",
                    helperText: endDateError,
                  },
                }}
                value={endDate}
                label={"Orario di fine"}
                onChange={(dayJsDate) => setEndDate(dayJsDate)}
                ampm={false}
                minutesStep={30}
                skipDisabled={true}
                minTime={startDate.add(1, "hours")}
                maxTime={maxTime()}
                disabled={!canBook}
                autoFocus
                sx={{ width: "100%" }}
                onError={setEndDateErrorText}
              />

              {!canBook && (
                <Box display={"flex"}>
                  <Alert severity={"warning"}>
                    Non puoi prenotare una data nel passato
                  </Alert>
                </Box>
              )}

              <Button
                onClick={() => onConfirmButton()}
                disabled={!endDate || !canBook || !!endDateError}
                color="info"
                data-test="reserve-button"
              >
                Prenota
              </Button>
            </>
          ) : (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button onClick={() => void signIn("auth0")} data-test="login">
                Effettua il login
              </Button>
            </Box>
          )}
        </DialogLayout>
      </Dialog>
    </>
  );
}
