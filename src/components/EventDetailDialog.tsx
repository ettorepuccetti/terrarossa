import { Button, Dialog, DialogTitle, useTheme } from "@mui/material";
import { extractTimeFromDate } from "~/utils/formatter";
import { type Session } from "next-auth";
import { type EventImpl } from "@fullcalendar/core/internal";
import DialogLayout from "./DialogLayout";

interface DialogProps {
  open: boolean;
  eventDetails: EventImpl | undefined;
  onDialogClose: () => void;
  sessionData: Session | null;
  onReservationDelete: (id: string) => void;
}

export default function EventDetailDialog(props: DialogProps) {

  const { open, eventDetails, sessionData } = props;
  const theme = useTheme();

  if (!eventDetails) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onClose={() => props.onDialogClose()}>
        <DialogLayout title="Prenotazione">
          <div> Campo: {eventDetails.getResources()[0]?.title}</div>
          <div> Data: {eventDetails.start?.toDateString()}</div>
          <div> Inizio: {extractTimeFromDate(eventDetails.start)}</div>
          <div> Fine: {extractTimeFromDate(eventDetails.end)}</div>

          <Button
            hidden={
              !(sessionData !== null && (
                sessionData.user.role === "ADMIN" ||
                sessionData.user.id === props.eventDetails?.extendedProps?.userId
              ))
            }
            onClick={() => props.onReservationDelete(eventDetails.id)}
            color={"error"}
          >
            Cancella
          </Button>
        </DialogLayout>
      </Dialog>
    </>
  )
}