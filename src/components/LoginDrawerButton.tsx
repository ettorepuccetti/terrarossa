import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { ListItemButtonStyled } from "./Drawer";
import { Divider, ListItemText, Typography } from "@mui/material";
import { Login, Logout } from "@mui/icons-material";

export default function LoginDrawerButton() {

  const { data: sessionData } = useSession();

  return (
    <>
{/* User already logged in */}
{sessionData && (<>
  <ListItemButtonStyled >
    <Typography variant="h6">
      {sessionData.user?.name}
    </Typography>
  </ListItemButtonStyled>
  <Divider />
  <ListItemButtonStyled>
    <Logout />
    <ListItemText
      primary=" Logout"
      onClick={() => void signOut()} />
  </ListItemButtonStyled>
</>)}

{/* User not logged in */}
{!sessionData && (<>
  <ListItemButtonStyled >
    <Login />
    <ListItemText
      primary="Login"
      onClick={() => void signIn()} />
  </ListItemButtonStyled>
</>)}
    </>
  );
}