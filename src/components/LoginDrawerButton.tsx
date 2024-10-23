import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Divider,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginDrawerButton() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <>
      {/* User already logged in */}
      {sessionData && (
        <>
          <ListItemButton sx={{ gap: "1rem" }}>
            <Typography variant="h6">{sessionData.user?.name}</Typography>
          </ListItemButton>
          <Divider />
          <ListItemButton
            sx={{ gap: "1rem" }}
            onClick={() => {
              void router.push("/").then(() => signOut());
            }}
          >
            <LogoutIcon />
            <ListItemText primary=" Logout" />
          </ListItemButton>
        </>
      )}

      {/* User not logged in */}
      {!sessionData && (
        <>
          <ListItemButton
            sx={{ gap: "1rem" }}
            onClick={() => void signIn("auth0")}
          >
            <LoginIcon />
            <ListItemText primary="Login" />
          </ListItemButton>
        </>
      )}
    </>
  );
}
