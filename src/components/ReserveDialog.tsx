import { type DateClickArg } from "@fullcalendar/interaction";
import { Box, Button, Dialog, DialogActions, TextField, Typography } from "@mui/material";
import { DateField, TimeField, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DialogLayout from "./DialogLayout";
import { UserRoles } from "~/utils/constants";

export interface SimpleDialogProps {
  open: boolean;
  dateClick: DateClickArg | undefined;
  onConfirm: (endDate: Date, overwrittenName?: string) => void;
  onDialogClose: () => void;
}

export default function ReserveDialog(props: SimpleDialogProps) {

  const { open, dateClick } = props;
  const [endDate, setEndDate] = useState<Date | null>(dateClick?.date ?? null);
  const [overwriteName, setOverwriteName] = useState<string>(""); //cannot set to undefined because of controlled component
  const {data: sessionData} = useSession();

  useEffect(() => {
    setEndDate(dayjs(dateClick?.date).add(1, "hour") as unknown as Date ?? null);
  }, [dateClick]);

  const onInternalConfirm = () => {
    if (!endDate) {
      console.error("endDate: ", endDate);
      return;
    }
    console.log("startDate in calendar: ", dateClick?.date);
    console.log("endDate from dialog: ", endDate);

    // clean seconds and milliseconds from endDate - issue with dayJS
    const cleanedEndDate = dayjs(endDate).toDate();
    cleanedEndDate.setMilliseconds(0);
    cleanedEndDate.setSeconds(0);

    props.onConfirm(cleanedEndDate, overwriteName !== "" ? overwriteName : undefined);
    setEndDate(null);
    setOverwriteName("");
  };

  const canOverwriteReservationName = (sessionData && sessionData.user?.role === UserRoles.ADMIN);

  return (
    <>
      <Dialog open={open} onClose={() => { setEndDate(null); setOverwriteName(""); props.onDialogClose() }}>
        <DialogLayout title="Prenota">

          {/* if not login only show login button with no other fields */}
          {(sessionData) ? 

            <>
              {/* court name */}
              <DialogActions>
                <Typography gutterBottom> {dateClick?.resource?.title} </Typography>
              </DialogActions>

              {/* overwrite name, only if admin mode */}
              { canOverwriteReservationName && <TextField
                variant="outlined"
                placeholder="Nome"
                label="Nome prenotazione"
                value={overwriteName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOverwriteName(e.target.value)}
              />}

              {/* date */}
              <DateField
                value={dayjs(dateClick?.date)}
                readOnly={true}
                label={"Data"}
                format="DD/MM/YYYY"
              />
              <TimeField
                value={dateClick?.date}
                label={"Orario di inizio"}
                readOnly={true}
                ampm={false}
                size="small"
              />
              <TimePicker
                value={endDate}
                label={"Orario di fine"}
                onChange={(dayJsDate) => setEndDate(dayJsDate)} // value is DayJS object
                ampm={false}
                minutesStep={30}
                skipDisabled={true}
                minTime={dayjs(dateClick?.date).add(1, 'hours') as unknown as Date}
                maxTime={dayjs(dateClick?.date).add(2, 'hours') as unknown as Date}
                autoFocus={true}
                // renderInput={(props) => <TextField {...props} />}
              />
              <Button onClick={() => onInternalConfirm()} disabled={!endDate}> Prenota </Button>
            </>
            :
            <Box display={"flex"} alignItems={'center'} justifyContent={"center"}>
              <Button onClick={() => void signIn()}> Effettua il login </Button>
            </Box>
          }
        </DialogLayout>
      </Dialog >
    </>
  )
}