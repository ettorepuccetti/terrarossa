import { Button, Dialog, DialogActions, Typography } from "@mui/material";
import DialogLayout from "./DialogLayout";

interface DialogProps {
  open: boolean;
  title: string;
  message: string;
  onDialogClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationAlert(props: DialogProps) {
  
    const { open, title, message } = props;
  
    return (
      <>
        <Dialog open={open} onClose={() => props.onDialogClose()}>
          <DialogLayout title={title}>
            <Typography gutterBottom> {message} </Typography>
            <DialogActions>
              <Button onClick={() => props.onDialogClose()}>Annulla</Button>
              <Button onClick={() => props.onConfirm()} color="error">Conferma</Button>
            </DialogActions>
          </DialogLayout>
        </Dialog>
      </>
    );
  }