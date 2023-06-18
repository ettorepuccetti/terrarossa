import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Box, ListItemText, ListItemButton } from "@mui/material";
import { type Club } from "@prisma/client";
import Link from "next/link";


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
        <ListItemButton>
          <HomeOutlinedIcon />
          <ListItemText primary={club.name} />
        </ListItemButton>
      </Link>
    </Box>
  );
};
