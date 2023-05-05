import { Dialog, DialogTitle } from "@mui/material";
import { extractTimeFromDate } from "~/utils/formatter";
import { type Session } from "next-auth";
import { type EventImpl } from "@fullcalendar/core/internal";

interface DialogProps {
  open: boolean;
  eventDetails: EventImpl | undefined;
  onDialogClose: () => void;
  sessionData: Session | null;
  onReservationDelete: (id: string) => void;
}

export default function EventDetailDialog(props: DialogProps) {

  const { open, eventDetails, sessionData } = props;

  if (!eventDetails) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onClose={() => props.onDialogClose()}>
        <DialogTitle> Dettagli </DialogTitle>
        <div> Campo: {eventDetails.getResources()[0]?.title}</div>
        <div> Data: {eventDetails.start?.toDateString()}</div>
        <div> Inizio: {extractTimeFromDate(eventDetails.start)}</div>
        <div> Fine: {extractTimeFromDate(eventDetails.end)}</div>

        <button
          hidden={
            !(sessionData !== null && (
              sessionData.user.role === "ADMIN" ||
              sessionData.user.id === props.eventDetails?.extendedProps?.userId
            ))
          }
          onClick={() => props.onReservationDelete(eventDetails.id)}
        >
          Cancella
        </button>
      </Dialog>
    </>
  )
}