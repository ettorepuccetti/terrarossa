import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
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
          <TextField
            variant="standard"
            label="nome utente"
            value={userData.name}
            sx={{ maxWidth: 300 }}
            fullWidth
            inputProps={{ readOnly: true }}
          />
          <IconButton onClick={() => setOpenEditDialog(!openEditDialog)}>
            <EditOutlinedIcon />
          </IconButton>
        </Box>
        <TextField
          variant="standard"
          label="mail"
          defaultValue={userData.email}
          disabled
          inputProps={{ readOnly: true }}
          sx={{ maxWidth: 300 }}
          fullWidth
        />

        <TextField
          variant="standard"
          label="iscritto dal"
          defaultValue={dayjs(userData.createdAt).format("DD/MM/YYYY")}
          inputProps={{ readOnly: true }}
          sx={{ maxWidth: 300 }}
          fullWidth
          disabled
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
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogLayout title="Modifica nome utente">
          <TextField
            variant="outlined"
            label="nome utente"
            sx={{ marginTop: "10px" }}
            onChange={(e) => setNewUsername(e.target.value)}
            value={newUsername}
          />
          <DialogActions>
            <Button
              onClick={() => {
                onSubmit(newUsername);
                onClose();
              }}
            >
              ok
            </Button>
          </DialogActions>
        </DialogLayout>
      </Dialog>
    </>
  );
};
