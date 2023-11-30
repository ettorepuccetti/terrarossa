import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import { useUserQuery } from "~/hooks/profileTrpcHooks";

export const ProfileTextInfo = ({ authData }: { authData: Session }) => {
  const userQuery = useUserQuery();

  if (userQuery.isLoading) {
    return null;
  }

  if (userQuery.isError) {
    return null;
  }

  return (
    <>
      <TextField
        variant="standard"
        label="nome utente"
        defaultValue={authData?.user.name}
        inputProps={{ readOnly: true }}
        sx={{ maxWidth: 300 }}
        fullWidth
      />
      <TextField
        variant="standard"
        label="mail"
        defaultValue={authData?.user.email}
        inputProps={{ readOnly: true }}
        sx={{ maxWidth: 300 }}
        fullWidth
      />

      <TextField
        variant="standard"
        label="iscritto dal"
        defaultValue={dayjs(userQuery.data.createdAt).format("DD/MM/YYYY")}
        inputProps={{ readOnly: true }}
        sx={{ maxWidth: 300 }}
        fullWidth
      />
    </>
  );
};
