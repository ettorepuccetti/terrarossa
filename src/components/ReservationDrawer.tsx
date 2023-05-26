import { DateRange, HomeOutlined, PersonOutline } from "@mui/icons-material";
import { Box, Drawer, List, ListItemText } from "@mui/material";
import NextLink from "next/link";
import { ListItemButtonStyled } from "./HomeDrawer";
import LoginDrawerButton from "./LoginDrawerButton";

interface DrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


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
            <ListItemButtonStyled >
              <HomeOutlined />
              <ListItemText primary="Home" />
            </ListItemButtonStyled>
          </NextLink>

          {/* Link to reservation page */}
          <NextLink href="/prenota">
            <ListItemButtonStyled >
              <DateRange />
              <ListItemText primary="Prenota" />
            </ListItemButtonStyled>
          </NextLink>

          {/* Link to profile page */}
          <NextLink href="/profile">
            <ListItemButtonStyled >
              <PersonOutline />
              <ListItemText primary="Profilo" />
            </ListItemButtonStyled>
          </NextLink>

        </List>
      </Box>
    </Drawer>
  );
}
