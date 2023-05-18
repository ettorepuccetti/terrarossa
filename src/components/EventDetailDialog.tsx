import { type EventImpl } from "@fullcalendar/core/internal";
import { Box, Button, Dialog, DialogActions, Typography } from "@mui/material";
import { DateField, TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import DialogLayout from "./DialogLayout";
import React from "react";
import ConfirmationAlert from "./ConfirmationAlert";

interface DialogProps {
  open: boolean;
  eventDetails: EventImpl | undefined;
  onDialogClose: () => void;
  sessionData: Session | null;
  onReservationDelete: (id: string) => void;
}

export default function EventDetailDialog(props: DialogProps) {

  const { open, eventDetails, sessionData } = props;
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  if (!eventDetails) {
    return null;
  }


  return (
    <>
      <Dialog open={open} onClose={() => props.onDialogClose()}>
        <DialogLayout title="Prenotazione">
          <DialogActions>
            <Typography gutterBottom> {eventDetails.getResources()[0]?.title} </Typography>
          </DialogActions>

          <DateField
            value={dayjs(eventDetails.start)}
            readOnly={true}
            label={"Data"}
            format="DD/MM/YYYY"
          />

          <Box display={"flex"} gap={1} maxWidth={220}>
            <TimeField
              value={eventDetails.start}
              label={"Orario di inizio"}
              readOnly={true}
              ampm={false}
              size="small"
            />
            <TimeField
              value={eventDetails.end}
              label={"Orario di fine"}
              readOnly={true}
              ampm={false}
              size="small"
            />
          </Box>

          <Button
            hidden={
              !(sessionData !== null && (
                sessionData.user.role === "ADMIN" ||
                sessionData.user.id === props.eventDetails?.extendedProps?.userId
              ))
            }
            onClick={() => setConfirmationOpen(true)}
            color={"error"}
          >
            Cancella
          </Button>
          <ConfirmationAlert
            open={confirmationOpen}
            title={"Cancellazione"}
            message={"Sei sicuro di voler cancellare la prenotazione?"}
            onDialogClose={() => setConfirmationOpen(false)}
            onConfirm={() => {
              props.onReservationDelete(eventDetails.id);
              setConfirmationOpen(false);
            }}
          />
        </DialogLayout>
      </Dialog>
    </>
  )
}