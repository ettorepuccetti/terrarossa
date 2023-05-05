import { type DateClickArg } from "@fullcalendar/interaction";
import { Dialog, DialogTitle, ListItem, ListItemButton } from "@mui/material";
import { extractTimeFromDate } from "~/utils/formatter";

export interface SimpleDialogProps {
  open: boolean;
  onDurationSelected: (value: Date | undefined) => void;
  dateClick: DateClickArg | undefined;
}

export default function ReservationDialog(props: SimpleDialogProps) {
  const { open, dateClick } = props;

  const durationSelection = (hours: number | undefined) => {
    if (!dateClick?.date) {
      throw new Error("Date is undefined");
    }
    const endDate = new Date(dateClick.date);
    if (hours) {
      endDate.setHours(endDate.getHours() + hours);
      console.log("startDate in calendar: ", dateClick?.date);
      console.log("endDate from dialog: ", endDate);
      props.onDurationSelected(endDate);
    } else {
      props.onDurationSelected(undefined);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => durationSelection(undefined)}>
        <DialogTitle> Prenota </DialogTitle>
        <div> Data: {dateClick?.date?.toDateString()}</div>
        <div> Orario di Inizio: {extractTimeFromDate(dateClick?.date)}</div>
        <ListItem disableGutters>
          <ListItemButton onClick={() => durationSelection(1)}>
            un&apos;ora
          </ListItemButton>
          <ListItemButton onClick={() => durationSelection(2)}>
            due ore
          </ListItemButton>
        </ListItem>
      </Dialog>
    </>
  )
}