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
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { isAdminOfTheClub } from "~/utils/utils";
import DialogLayout from "./DialogLayout";

export interface ReserveDialogProps {
  open: boolean;
  date: Date | undefined;
  resource: string | undefined;
  onConfirm: (endDate: Date, overwrittenName?: string) => void;
  onDialogClose: () => void;
  clubId: string | undefined;
}

export default function ReserveDialog(props: ReserveDialogProps) {
  const { open, date, resource } = props;
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const { data: sessionData } = useSession();

  useEffect(() => {
    setEndDate((dayjs(date).add(1, "hour") as unknown as Date) ?? null);
  }, [date]);

  const onConfirmButton = () => {
    if (!endDate) {
      throw new Error(
        "Non è stato possibile impostare la data di fine prenotazione. Per favore riprova."
      );
    }
    console.log("startDate in calendar: ", date);
    console.log("endDate from dialog: ", endDate);

    // clean seconds and milliseconds from endDate - issue with dayJS
    const cleanedEndDate = dayjs(endDate).toDate();
    cleanedEndDate.setMilliseconds(0);
    cleanedEndDate.setSeconds(0);

    props.onConfirm(
      cleanedEndDate,
      overwriteName !== "" ? overwriteName : undefined //manage overwriteName limitation about controlled component
    );
    setEndDate(null);
    setOverwriteName("");
  };

  const canBook =
    isAdminOfTheClub(sessionData, props.clubId) || dayjs(date).isAfter(dayjs());

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setEndDate(null);
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
                inputProps={{ "data-test": "date" }} //used to test the component
                value={dayjs(date)}
                readOnly={true}
                label={"Data"}
                format="DD/MM/YYYY"
                size="small"
                fullWidth
                color="info"
              />
              <TimeField
                inputProps={{ "data-test": "startTime" }} //used to test the component
                value={date}
                label={"Orario di inizio"}
                readOnly={true}
                ampm={false}
                size="small"
                fullWidth
                color="info"
              />
              <TimePicker
                data-test="endTime"
                slotProps={{
                  textField: { inputProps: { "data-test": "endTime" } }, //used to test the component
                }}
                value={endDate}
                label={"Orario di fine"}
                onChange={(dayJsDate) => setEndDate(dayJsDate)} // value is DayJS object
                ampm={false}
                minutesStep={30}
                skipDisabled={true}
                minTime={dayjs(date).add(1, "hours") as unknown as Date}
                maxTime={
                  isAdminOfTheClub(sessionData, props.clubId)
                    ? undefined
                    : (dayjs(date).add(2, "hours") as unknown as Date)
                }
                autoFocus={true}
                disabled={!canBook}
                sx={{ width: "100%" }}
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
                disabled={!endDate || !canBook}
                color="info"
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
              <Button onClick={() => void signIn("auth0")}>
                Effettua il login
              </Button>
            </Box>
          )}
        </DialogLayout>
      </Dialog>
    </>
  );
}
