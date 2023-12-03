import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import DialogLayout from "./DialogLayout";

export const ProfileTextInfo = () => {
  const userData = useMergedStoreContext((store) => store.getUserData());
  const updateUsername = useMergedStoreContext((store) =>
    store.getUpdateUsername(),
  );
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={"inherit"}
        width={"100%"}
      >
        <Box
          display={"flex"}
          width={"100%"}
          maxWidth={"300px"}
          alignItems={"center"}
        >
          {/* username */}
          <TextField
            inputProps={{ "data-test": "username", readOnly: true }}
            variant="standard"
            label="nome utente"
            value={userData.name}
            sx={{ maxWidth: 300 }}
            fullWidth
          />
          {/* username edit button */}
          <IconButton
            data-test="edit-username-button"
            onClick={() => setOpenEditDialog(!openEditDialog)}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Box>

        {/* email */}
        <TextField
          inputProps={{ "data-test": "email", readOnly: true }}
          InputProps={{ disableUnderline: true }}
          variant="standard"
          label="mail"
          defaultValue={userData.email}
          sx={{ maxWidth: 300 }}
          fullWidth
        />

        {/* created at */}
        <TextField
          inputProps={{ "data-test": "created-at", readOnly: true }}
          InputProps={{ disableUnderline: true }}
          variant="standard"
          label="iscritto dal"
          defaultValue={dayjs(userData.createdAt).format("DD/MM/YYYY")}
          sx={{ maxWidth: 300 }}
          fullWidth
        />
      </Box>
      <EditUsernameDialog
        open={openEditDialog}
        oldUsername={userData.name ?? ""}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={(newUsername) =>
          void updateUsername.mutateAsync({ newUsername })
        }
      />
    </>
  );
};

const EditUsernameDialog = ({
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
