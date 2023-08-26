import { Alert, Button, Dialog, DialogActions } from "@mui/material";
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
          <Alert severity="error">{message}</Alert>
          <DialogActions>
            <Button
              data-test="cancel-button"
              onClick={() => props.onDialogClose()}
              color="info"
            >
              Annulla
            </Button>
            <Button
              data-test="confirm-button"
              onClick={() => props.onConfirm()}
              color="error"
            >
              Conferma
            </Button>
          </DialogActions>
        </DialogLayout>
      </Dialog>
    </>
  );
}
