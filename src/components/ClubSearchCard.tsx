import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Box, ListItemButton, ListItemText } from "@mui/material";
import { type Club } from "@prisma/client";
import Link from "next/link";

export const ClubSearchCard = ({ club }: { club: Club }) => {
  const style = {
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
        <ListItemButton>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <HomeOutlinedIcon color="secondary" />
            <ListItemText primary={club.name} />
          </Box>
        </ListItemButton>
      </Link>
    </Box>
  );
};
