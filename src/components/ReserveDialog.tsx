import { type DateClickArg } from "@fullcalendar/interaction";
import { Box, Button, Dialog, DialogActions, Typography } from "@mui/material";
import { DateField, TimeField, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import DialogLayout from "./DialogLayout";

export interface SimpleDialogProps {
  open: boolean;
  dateClick: DateClickArg | undefined;
  onDurationSelected: (value: Date) => void;
  onDialogClose: () => void;
  sessionData: Session | null;
}

export default function ReserveDialog(props: SimpleDialogProps) {

  const { open, dateClick } = props;
  const [endDate, setEndDate] = useState<Date | null>(dateClick?.date ?? null);

  useEffect(() => {
    setEndDate(dayjs(dateClick?.date).add(1, "hour") as unknown as Date ?? null);
  }, [dateClick]);

  const onConfirm = () => {
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

    props.onDurationSelected(cleanedEndDate);
    setEndDate(null);
  };


  return (
    <>
      <Dialog open={open} onClose={() => { setEndDate(null); props.onDialogClose() }}>
        <DialogLayout title="Prenota">
          {(props.sessionData) ?
            <>
              <DialogActions>
                <Typography gutterBottom> {dateClick?.resource?.title} </Typography>
              </DialogActions>
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
              <Button onClick={() => onConfirm()} disabled={!endDate}> Prenota </Button>
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