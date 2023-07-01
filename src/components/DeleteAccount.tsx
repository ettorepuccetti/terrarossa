import { Box, Button, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import ConfirmationDialog from "./ConfirmationDialog";

export default function DeleteAccount() {
  const deleteUser = api.user.deleteUser.useMutation();
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Box
      sx={{ backgroundColor: "error" }}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={2}
    >
      <Typography>Elimina il mio account</Typography>
      <Button
        variant={"contained"}
        color={"error"}
        onClick={() => setConfirmOpen(true)}
      >
        Elimina
      </Button>
      <ConfirmationDialog
        open={confirmOpen}
        title={"Elimina account"}
        message={
          "Sei sicuro di voler eliminare il tuo account? \
          Le tue prenotazioni NON verranno cancellate, \
          il gestore del circolo potrà ancora vedere il tuo nome sulla prenotazione."
        }
        onDialogClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          void router
            .push("/")
            .then(() => signOut())
            .then(() => deleteUser.mutate());
        }}
      />
    </Box>
  );
}
