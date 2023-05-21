import styled from "@emotion/styled";
import { Logout } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Login from "./Login";

interface DrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListItemButtonStyled = styled(ListItemButton)(() => ({
  gap: '1rem'
}));

export default function ReservationDrawer(props: DrawerProps) {

  const { data: sessionData } = useSession();

  return (
    <Drawer
      anchor="left"
      open={props.open}
      onClose={(_e) => props.setOpen(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={(_e) => props.setOpen(false)}
      >
        <List>

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

        </List>
      </Box>
    </Drawer>
  );
}
