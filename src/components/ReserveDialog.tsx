import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, TimeField, TimePicker } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { isAdminOfTheClub } from "~/utils/utils";
import DialogLayout from "./DialogLayout";

export interface ReserveDialogProps {
  open: boolean;
  startDate: Date | undefined;
  resource: string | undefined;
  onConfirm: (endDate: Date, overwrittenName: string | undefined) => void;
  onDialogClose: () => void;
  clubId: string;
}

export default function ReserveDialog(props: ReserveDialogProps) {
  const { open, resource } = props;
  const startDate = useMemo(() => dayjs(props.startDate), [props.startDate]);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const { data: sessionData } = useSession();
  const [endDateError, setEndDateError] = useState<string | undefined>(
    undefined
  );

  // to set endDate to startDate + 1 hour, when component is mounted
  useEffect(() => {
    setEndDate(
      startDate.add(1, "hours").set("second", 0).set("millisecond", 0)
    );
  }, [startDate]);

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
  };

  const canBook =
    isAdminOfTheClub(sessionData, props.clubId) || startDate.isAfter(dayjs());

  return (
    <>
      <Dialog
        data-test="reserve-dialog"
        open={open}
        onClose={() => {
          setOverwriteName("");
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
                maxTime={
                  isAdminOfTheClub(sessionData, props.clubId)
                    ? undefined
                    : startDate.add(2, "hours")
                }
                disabled={!canBook}
                autoFocus
                sx={{ width: "100%" }}
                onError={(error) => {
                  setEndDateError(
                    error ? "Prenota 1 ora, 1 ora e mezzo o 2 ore" : undefined
                  );
                }}
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
