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
import { isAdminOfTheClub } from "~/utils/utils";
import DialogLayout from "./DialogLayout";
import ReserveDialogEndDate from "./ReserveDialogEndDate";
import ReserveDialogLoginButton from "./ReserveDialogLoginButton";
import ReserveDialogRecurrent from "./ReserveDialogRecurrent";

export interface ReserveDialogProps {
  open: boolean;
  startDate: Date | undefined;
  resource: string | undefined;
  onConfirm: (
    endDate: Date,
    overwrittenName: string | undefined,
    recurrentEndDate: Date | undefined
  ) => void;
  onDialogClose: () => void;
  clubId: string;
  clubSettings: ClubSettings;
}

export default function ReserveDialog(props: ReserveDialogProps) {
  const { open, resource } = props;
  const startDate = useMemo(() => dayjs(props.startDate), [props.startDate]);
  const { data: sessionData } = useSession();

  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endDateError, setEndDateError] = useState<boolean>(false);
  const [recurrentEndDate, setRecurrentEndDate] = useState<Dayjs | null>(null);
  const [recurrentEndDateError, setRecurrentEndDateError] =
    useState<boolean>(false);

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
      overwriteName !== "" ? overwriteName : undefined,
      recurrentEndDate?.hour(23).minute(59).toDate()
    );
    setOverwriteName("");
    setEndDate(null);
    setRecurrentEndDate(null);
  };

  return (
    <>
      <Dialog
        data-test="reserve-dialog"
        open={open}
        onClose={() => {
          setOverwriteName("");
          setEndDate(null);
          setRecurrentEndDate(null);
          props.onDialogClose();
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
                <Typography gutterBottom>{resource}</Typography>
              </DialogActions>

              {/* overwrite name, only if admin mode */}
              {isAdminOfTheClub(sessionData, props.clubId) && (
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
                clubId={props.clubId}
                clubSettings={props.clubSettings}
                disabled={
                  !startDateIsFuture(sessionData, props.clubId, startDate)
                }
                endDateEventHandler={setEndDate}
                endDateErrorEventHandler={setEndDateError}
              />
              {/* recurrent reservation */}
              <ReserveDialogRecurrent
                clubId={props.clubId}
                startDate={startDate}
                recurrentDateEventHandler={setRecurrentEndDate}
                recurrentDateErrorEventHandler={setRecurrentEndDateError}
                recurrentEndDate={recurrentEndDate}
              />
              {/* start date in the past warning */}
              {!startDateIsFuture(sessionData, props.clubId, startDate) && (
                <Box display={"flex"}>
                  <Alert data-test="past-warning" severity={"warning"}>
                    Non puoi prenotare una data nel passato
                  </Alert>
                </Box>
              )}

              <Button
                onClick={() => onConfirmButton()}
                disabled={
                  !endDate ||
                  !startDateIsFuture(sessionData, props.clubId, startDate) ||
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
