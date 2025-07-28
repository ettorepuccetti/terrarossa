import { Alert, Button, Dialog, DialogActions, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLogger } from "~/utils/logger";
import DialogLayout from "./DialogLayout";

export const EditUsernameDialog = ({
  open,
  oldUsername,
  onClose,
  onSubmit,
}: {
  open: boolean;
  oldUsername: string;
  onClose: () => void;
  onSubmit: (newUsername: string) => void;
}) => {
  const logger = useLogger({ component: "ProfileTextInfo" });

  const [newUsername, setNewUsername] = useState<string>(oldUsername);

  function validateUsername(username: string | null) {
    return username && username.length > 3;
  }

  // reset username in textbox to the original one when dialog is closed without submit
  // otherwise editing, then closing then opening again would show the last edited value
  useEffect(() => {
    setNewUsername(oldUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Dialog
        data-test="edit-username-dialog"
        open={open}
        onClose={onClose}
        maxWidth={"xs"}
      >
        <DialogLayout title="Modifica nome utente">
          <TextField
            inputProps={{
              "data-test": "edit-username-input",
            }}
            helperText={!validateUsername(newUsername) && "Minimo 4 caratteri"}
            variant="outlined"
            label="nome utente"
            sx={{ marginTop: "10px" }}
            onChange={(e) => setNewUsername(e.target.value)}
            value={newUsername}
            fullWidth
            color="info"
            onFocus={(event) => {
              // autoselect text on focus
              // To be fully compatible with safari (from https://stackoverflow.com/a/54229871/22570011)
              const target = event.target;
              setTimeout(() => target.select(), 0);
            }}
            error={!validateUsername(newUsername)}
            autoFocus
          />
          <Alert severity="info">
            {
              "Il nome utente verrà visualizzato pubblicamente sulle prenotazioni."
            }
          </Alert>
          <DialogActions>
            <Button
              data-test="submit-username"
              onClick={() => {
                logger.info("submitting new username", {
                  newUsername: newUsername,
                });
                onSubmit(newUsername);
                onClose();
              }}
              color="info"
              disabled={!validateUsername(newUsername)}
            >
              ok
            </Button>
          </DialogActions>
        </DialogLayout>
      </Dialog>
    </>
  );
};
