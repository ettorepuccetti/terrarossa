import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, ListItemText, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ListItemButtonStyled } from "./DrawerWrapper";

export default function LoginDrawerButton() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <>
      {/* User already logged in */}
      {sessionData && (
        <>
          <ListItemButtonStyled>
            <Typography variant="h6">{sessionData.user?.name}</Typography>
          </ListItemButtonStyled>
          <Divider />
          <ListItemButtonStyled
            onClick={() => {
              void router.push("/").then(() => signOut());
            }}
          >
            <LogoutIcon />
            <ListItemText primary=" Logout" />
          </ListItemButtonStyled>
        </>
      )}

      {/* User not logged in */}
      {!sessionData && (
        <>
          <ListItemButtonStyled onClick={() => void signIn("auth0")}>
            <LoginIcon />
            <ListItemText primary="Login" />
          </ListItemButtonStyled>
        </>
      )}
    </>
  );
}
