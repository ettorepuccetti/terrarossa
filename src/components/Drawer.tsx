import styled from "@emotion/styled";
import { DateRange, Logout } from "@mui/icons-material";
import { Drawer, Box, List, ListItemButton, Typography, ListItemText, Divider } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Login from "./Login";
import NextLink from "next/link";
import LoginDrawerButton from "./LoginDrawerButton";

interface DrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ListItemButtonStyled = styled(ListItemButton)(() => ({
  gap: '1rem'
}));

export default function HomeDrawer(props: DrawerProps) {

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

          {/* Login / Logout button */}
          <LoginDrawerButton />

          {/* Link to reservation page */}
          <NextLink href="/prenota">
            <ListItemButtonStyled >
              <DateRange />
              <ListItemText primary="prenota" />
            </ListItemButtonStyled>
          </NextLink>

        </List>
      </Box>
    </Drawer>
  );
}
