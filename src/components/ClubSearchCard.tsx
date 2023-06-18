import { Home } from "@mui/icons-material";
import { Box, ListItemText } from "@mui/material";
import { type Club } from "@prisma/client";
import Link from "next/link";
import { ListItemButtonStyled } from "./Drawer";

export const ClubSearchCard = ({ club }: { club: Club }) => {
  const style = {
    // borderColor: "primary.main",
    borderRadius: 1,
    border: 0.5,
    backgroundOpacity: 0.01,
  };

  return (
    <Box sx={style}>
      <Link
        href={{
          pathname: "prenota",
          query: { clubId: club.id },
        }}
      >
        <ListItemButtonStyled>
          <Home />
          <ListItemText primary={club.name} />
        </ListItemButtonStyled>
      </Link>
    </Box>
  );
};
