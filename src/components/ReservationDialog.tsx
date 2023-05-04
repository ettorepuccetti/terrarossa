import { Dialog, DialogTitle, ListItem, ListItemButton } from "@mui/material";
import { extractTimeFromDate } from "~/utils/formatter";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: Date | undefined) => void;
  startDate: Date | undefined;
}

export default function ReservationDialog(props: SimpleDialogProps) {
  const { open, startDate } = props;

  const handleClose = (hours: number | undefined) => {
    if (!startDate) {
      throw new Error("startDate is undefined");
    }
    const endDate = new Date(startDate);
    if (hours) {
      endDate.setHours(endDate.getHours() + hours);
      props.onClose(endDate);
      console.log("endDate from dialog: ", endDate);
    } else {
      props.onClose(undefined);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => handleClose(undefined)}>
        <DialogTitle> Prenota </DialogTitle>
        <div> Data: {startDate?.toDateString()}</div>
        <div> Orario di Inizio: {extractTimeFromDate(startDate)}</div>
        <ListItem disableGutters>
          <ListItemButton onClick={() => handleClose(1)}>
            un&apos;ora
          </ListItemButton>
          <ListItemButton onClick={() => handleClose(2)}>
            due ore
          </ListItemButton>
        </ListItem>
      </Dialog>
    </>
  )
}