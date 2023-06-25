import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  ListItemText,
  Typography,
} from "@mui/material";
import { type Club } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { defaultImg } from "~/utils/constants";

export const ClubSearchCard = ({ club }: { club: Club }) => {
  return (
    <Link
      href={{
        pathname: "prenota",
        query: { clubId: club.id },
      }}
    >
      <CardActionArea>
        <Card>
          <CardMedia sx={{ height: 140, position: "relative" }}>
            <Image
              fill={true}
              alt={club.name}
              src={club.imageSrc ?? defaultImg}
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <CardContent>
            <Typography variant="h6" fontWeight={500}>
              {club.name}
            </Typography>
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <HomeOutlinedIcon />
              <ListItemText primary="indirizzo" />
            </Box>
          </CardContent>
        </Card>
      </CardActionArea>
    </Link>
  );
};
