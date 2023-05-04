import { Dialog, DialogTitle } from "@mui/material";
import { type EventDetailDialogProps } from "./Calendar";
import { extractTimeFromDate } from "~/utils/formatter";

interface DialogProps {
  open: boolean;
  eventDetails: EventDetailDialogProps | undefined;
  onClose: () => void;
}

export default function EventDetailDialog(props: DialogProps) {

  const { open, eventDetails } = props;

  if (!eventDetails) {
    return null;
  }

  const { startDate, endDate, court } = eventDetails;

  return (
    <>
      <Dialog open={open} onClose={() => props.onClose()}>
        <DialogTitle> Dettagli </DialogTitle>
        <div> Campo: {court}</div>
        <div> Data: {startDate?.toDateString()}</div>
        <div> Inizio: {extractTimeFromDate(startDate)}</div>
        <div> Fine: {endDate?.toTimeString().split(":").splice(0, 2).join(":")}</div>
      </Dialog>
    </>
  )
}