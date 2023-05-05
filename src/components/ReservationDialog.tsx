import { type DateClickArg } from "@fullcalendar/interaction";
import { Dialog, DialogTitle, ListItem, ListItemButton } from "@mui/material";
import { extractTimeFromDate } from "~/utils/formatter";

export interface SimpleDialogProps {
  open: boolean;
  dateClick: DateClickArg | undefined;
  onDurationSelected: (value: Date) => void;
  onDialogClose: () => void;
}

export default function ReservationDialog(props: SimpleDialogProps) {
  const { open, dateClick } = props;

  const durationSelection = (hours: number) => {
    if (!dateClick?.date) {
      throw new Error("Date is undefined");
    }
    const endDate = new Date(dateClick.date);
    endDate.setHours(endDate.getHours() + hours);
    console.log("startDate in calendar: ", dateClick?.date);
    console.log("endDate from dialog: ", endDate);
    props.onDurationSelected(endDate);

  };

  return (
    <>
      <Dialog open={open} onClose={() => props.onDialogClose()}>
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