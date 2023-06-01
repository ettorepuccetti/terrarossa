import { Login, Logout } from "@mui/icons-material";
import { Divider, ListItemText, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ListItemButtonStyled } from "./Drawer";

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
          <ListItemButtonStyled>
            <Logout />
            <ListItemText
              primary=" Logout"
              onClick={() => {
                void router.push("/").then(() => signOut());
              }}
            />
          </ListItemButtonStyled>
        </>
      )}

      {/* User not logged in */}
      {!sessionData && (
        <>
          <ListItemButtonStyled>
            <Login />
            <ListItemText
              primary="Login"
              onClick={() => void signIn("auth0")}
            />
          </ListItemButtonStyled>
        </>
      )}
    </>
  );
}
