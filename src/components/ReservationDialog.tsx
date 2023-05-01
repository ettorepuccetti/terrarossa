import { Dialog, DialogTitle, ListItem, ListItemButton } from "@mui/material";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: Date) => void;
  startDate: Date | undefined;
}

export default function ReservationDialog(props: SimpleDialogProps) {
  const { onClose, open, startDate } = props;

  const handleClose = (hours: number | undefined) => {
    if (!startDate) {
      throw new Error("startDate is undefined");
    }
    const endDate = new Date(startDate);
    if (hours) {
      endDate.setHours(endDate.getHours() + hours);
      onClose(endDate);
      console.log("endDate from dialog: ", endDate);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => handleClose(undefined)}>
        <DialogTitle> Prenota </DialogTitle>
        <div> Data: {startDate?.toDateString()}</div>
        <div> Orario di Inizio: {startDate?.toTimeString().split(":").splice(0, 2).join(":")}</div>
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