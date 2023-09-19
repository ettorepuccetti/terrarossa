import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import DialogLayout from "./DialogLayout";

interface CancelRecurrentDialogProps {
  open: boolean;
  onDialogClose: () => void;
  onCancelSingle: () => void;
  onCancelRecurrent: () => void;
}

export default function CancelRecurrentDialog(
  props: CancelRecurrentDialogProps
) {
  const [value, setValue] = React.useState("single");

  const handleConfirmation = () => {
    if (value === "single") {
      props.onCancelSingle();
      return;
    }
    if (value === "recurrent") {
      props.onCancelRecurrent();
    }
  };

  return (
    <Dialog open={props.open} onClose={() => props.onDialogClose()}>
      <DialogLayout title="Cancellazione">
        <Alert severity="error">Cosa vuoi cancellare? </Alert>
        <FormControl>
          <RadioGroup
            name="controlled-radio-buttons-group"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            <FormControlLabel
              data-test="single"
              value="single"
              control={<Radio color="info" />}
              label="Prenotazione singola"
              componentsProps={{ typography: { color: "MenuText" } }}
            />
            <FormControlLabel
              data-test="recurrent"
              value="recurrent"
              control={<Radio color="info" />}
              label="Tutte le prenotazioni di questa ora fissa"
              componentsProps={{ typography: { color: "MenuText" } }}
            />
          </RadioGroup>
        </FormControl>
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
            onClick={() => handleConfirmation()}
            color="error"
          >
            Conferma
          </Button>
        </DialogActions>
      </DialogLayout>
    </Dialog>
  );
}
