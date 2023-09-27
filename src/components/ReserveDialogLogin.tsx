import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function ReserveDialogLoginButton() {
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Button onClick={() => void signIn("auth0")} data-test="login">
        Effettua il login
      </Button>
    </Box>
  );
}
