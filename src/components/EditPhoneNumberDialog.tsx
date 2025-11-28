import { Alert, Button, Dialog, DialogActions, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLogger } from "~/utils/logger";
import DialogLayout from "./DialogLayout";

export const EditPhoneNumberDialog = ({
  open,
  oldPhoneNumber,
  onClose,
  onSubmit,
}: {
  open: boolean;
  oldPhoneNumber: string;
  onClose: () => void;
  onSubmit: (newPhoneNumber: string) => void;
}) => {
  const logger = useLogger({ component: "EditPhoneNumberDialog" });

  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(oldPhoneNumber);

  function validatePhoneNumber(phonenumber: string | null) {
    return phonenumber && phonenumber.length > 3;
  }

  // reset phonenumber in textbox to the original one when dialog is closed without submit
  // otherwise editing, then closing then opening again would show the last edited value
  useEffect(() => {
    setNewPhoneNumber(oldPhoneNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Dialog
        data-test="edit-phonenumber-dialog"
        open={open}
        onClose={onClose}
        maxWidth={"xs"}
      >
        <DialogLayout title="Modifica cellulare">
          <TextField
            inputProps={{
              "data-test": "edit-phonenumber-input",
            }}
            helperText={
              !validatePhoneNumber(newPhoneNumber) && "Minimo 4 caratteri"
            }
            variant="outlined"
            label="cellulare"
            sx={{ marginTop: "10px" }}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            value={newPhoneNumber}
            fullWidth
            color="info"
            onFocus={(event) => {
              // autoselect text on focus
              // To be fully compatible with safari (from https://stackoverflow.com/a/54229871/22570011)
              const target = event.target;
              setTimeout(() => target.select(), 0);
            }}
            error={!validatePhoneNumber(newPhoneNumber)}
            autoFocus
          />
          <Alert severity="info">
            {
              "Il numero di telefono sarà visibile solo al gestore del circolo in cui effettui una prenotazione"
            }
          </Alert>
          <DialogActions>
            <Button
              data-test="submit-phonenumber"
              onClick={() => {
                logger.info("submitting new phonenumber", {
                  newPhoneNumber: newPhoneNumber,
                });
                onSubmit(newPhoneNumber);
                onClose();
              }}
              color="info"
              disabled={!validatePhoneNumber(newPhoneNumber)}
            >
              ok
            </Button>
          </DialogActions>
        </DialogLayout>
      </Dialog>
    </>
  );
};
