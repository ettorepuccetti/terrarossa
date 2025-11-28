import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, IconButton, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useUserQuery } from "~/hooks/profileTrpcHooks";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { api } from "~/utils/api";
import { EditPhoneNumberDialog } from "./EditPhoneNumberDialog";
import { EditUsernameDialog } from "./EditUsernameDialog";

export const ProfileTextInfo = () => {
  const userData = useMergedStoreContext((store) => store.getUserData());
  const updateUsername = useMergedStoreContext((store) =>
    store.getUpdateUsername(),
  );
  const [openUsernameEditDialog, setOpenUsernameEditDialog] =
    useState<boolean>(false);

  const [openPhoneNumberEditDialog, setOpenPhoneNumberEditDialog] =
    useState<boolean>(false);

  const userQuery = useUserQuery();
  const updatePhoneNumberMutation = api.user.updatePhoneNumber.useMutation({
    async onSuccess() {
      await userQuery.refetch();
    },
  });

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
            onClick={() => setOpenUsernameEditDialog(!openUsernameEditDialog)}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Box>

        <Box
          display={"flex"}
          width={"100%"}
          maxWidth={"300px"}
          alignItems={"center"}
        >
          {/* phone number */}
          <TextField
            inputProps={{ "data-test": "phone-number", readOnly: true }}
            variant="standard"
            label="cellulare"
            value={userData.phoneNumber?.number}
            sx={{ maxWidth: 300 }}
            fullWidth
          />
          {/* phone number edit button */}
          <IconButton
            data-test="edit-username-button"
            onClick={() =>
              setOpenPhoneNumberEditDialog(!openPhoneNumberEditDialog)
            }
          >
            <EditOutlinedIcon />
          </IconButton>
        </Box>

        {/* email */}
        <TextField
          inputProps={{ "data-test": "email", readOnly: true }}
          InputProps={{ disableUnderline: true }} //need to be in a separate parameter
          variant="standard"
          label="mail"
          defaultValue={userData.email}
          sx={{ maxWidth: 300 }}
          fullWidth
        />

        {/* created at */}
        <TextField
          inputProps={{ "data-test": "created-at", readOnly: true }}
          InputProps={{ disableUnderline: true }} //need to be in a separate parameter
          variant="standard"
          label="iscritto dal"
          defaultValue={dayjs(userData.createdAt).format("DD/MM/YYYY")}
          sx={{ maxWidth: 300 }}
          fullWidth
        />
      </Box>
      <EditUsernameDialog
        open={openUsernameEditDialog}
        oldUsername={userData.name ?? ""}
        onClose={() => setOpenUsernameEditDialog(false)}
        onSubmit={(newUsername) =>
          void updateUsername.mutateAsync({ newUsername })
        }
      />
      <EditPhoneNumberDialog
        open={openPhoneNumberEditDialog}
        oldPhoneNumber={userData.phoneNumber?.number ?? ""}
        onClose={() => setOpenPhoneNumberEditDialog(false)}
        onSubmit={(newPhoneNumber) =>
          void updatePhoneNumberMutation.mutateAsync({
            phoneNumber: newPhoneNumber,
            nationalPrefix: "+39",
          })
        }
      />
    </>
  );
};
