import { Alert, Button, Dialog, DialogActions, Typography } from "@mui/material";
import DialogLayout from "./DialogLayout";

interface DialogProps {
  open: boolean;
  title: string;
  message: string;
  onDialogClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationDialog(props: DialogProps) {
  const { open, title, message } = props;

  return (
    <>
      <Dialog open={open} onClose={() => props.onDialogClose()}>
        <DialogLayout title={title}>
          <Typography color={"HighlightText"} gutterBottom>
            <Alert severity="error">{message}</Alert>
          </Typography>
          <DialogActions>
            <Button onClick={() => props.onDialogClose()} color="info">
              Annulla
            </Button>
            <Button onClick={() => props.onConfirm()} color="error">
              Conferma
            </Button>
          </DialogActions>
        </DialogLayout>
      </Dialog>
    </>
  );
}
