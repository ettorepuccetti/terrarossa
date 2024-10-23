import DateRange from "@mui/icons-material/DateRange";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import NextLink from "next/link";
import LoginDrawerButton from "./LoginDrawerButton";

interface DrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DrawerWrapper(props: DrawerProps) {
  return (
    <Drawer
      anchor="left"
      open={props.open}
      onClose={() => props.setOpen(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => props.setOpen(false)}
      >
        <List>
          <LoginDrawerButton />

          {/* Link to home page */}
          <NextLink href="/">
            <ListItemButton sx={{ gap: "1rem" }}>
              <HomeOutlinedIcon />
              <ListItemText primary="Home" />
            </ListItemButton>
          </NextLink>

          {/* Link to reservation page */}
          <NextLink href="/search" data-test="reserve-page-link">
            <ListItemButton sx={{ gap: "1rem" }}>
              <DateRange />
              <ListItemText primary="Prenota" />
            </ListItemButton>
          </NextLink>

          {/* Link to profile page */}
          <NextLink href="/profile">
            <ListItemButton sx={{ gap: "1rem" }}>
              <PersonOutlineIcon />
              <ListItemText primary="Profilo" />
            </ListItemButton>
          </NextLink>
        </List>
      </Box>
    </Drawer>
  );
}
