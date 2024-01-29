import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, IconButton, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { EditUsernameDialog } from "./EditUsernameDialog";

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
