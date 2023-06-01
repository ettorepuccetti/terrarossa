import { HomeOutlined, PersonOutline } from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import NextLink from "next/link";
import LoginDrawerButton from "./LoginDrawerButton";

interface DrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ListItemButtonStyled = styled(ListItemButton)(() => ({
  gap: "1rem",
}));

export default function ReservationDrawer(props: DrawerProps) {
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
          <LoginDrawerButton />

          {/* Link to home page */}
          <NextLink href="/">
            <ListItemButtonStyled>
              <HomeOutlined />
              <ListItemText primary="Home" />
            </ListItemButtonStyled>
          </NextLink>

          {/* Link to reservation page  -- disabled temporarly*/}
          {/* <NextLink href="/prenota">
            <ListItemButtonStyled >
              <DateRange />
              <ListItemText primary="Prenota" />
            </ListItemButtonStyled>
          </NextLink> */}

          {/* Link to profile page */}
          <NextLink href="/profile">
            <ListItemButtonStyled>
              <PersonOutline />
              <ListItemText primary="Profilo" />
            </ListItemButtonStyled>
          </NextLink>
        </List>
      </Box>
    </Drawer>
  );
}
