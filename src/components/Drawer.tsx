import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
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
import DateRange from "@mui/icons-material/DateRange";

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
              <HomeOutlinedIcon />
              <ListItemText primary="Home" />
            </ListItemButtonStyled>
          </NextLink>

          {/* Link to reservation page */}
          <NextLink href="/search">
            <ListItemButtonStyled >
              <DateRange />
              <ListItemText primary="Prenota" />
            </ListItemButtonStyled>
          </NextLink>

          {/* Link to profile page */}
          <NextLink href="/profile">
            <ListItemButtonStyled>
              <PersonOutlineIcon />
              <ListItemText primary="Profilo" />
            </ListItemButtonStyled>
          </NextLink>
        </List>
      </Box>
    </Drawer>
  );
}
