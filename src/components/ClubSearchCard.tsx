import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { defaultClubImage } from "~/utils/constants";
import { ClubAddress } from "./ClubAddress";
import { type ClubQueryResult } from "./Search";

export const ClubSearchCard = ({ club }: { club: ClubQueryResult }) => {
  return (
    <Link
      href={{
        pathname: "prenota",
        query: { clubId: club.id },
      }}
      data-test={"club-card-" + club.name}
    >
      <Card>
        {/* Club Image */}
        <CardMedia sx={{ height: 140, position: "relative" }}>
          <Image
            fill={true}
            alt={club.name}
            src={club.imageSrc ?? defaultClubImage}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 600px) 100vw, 600px"
          />
        </CardMedia>
        <CardContent
          sx={{
            "&.MuiCardContent-root": {
              paddingTop: "8px",
              paddingBottom: "12px",
            },
          }}
        >
          {/* Club name */}
          <Typography variant="h6" fontWeight={500}>
            {club.name}
          </Typography>
          {/* Address */}
          <ClubAddress address={club.Address} />{" "}
        </CardContent>
      </Card>
    </Link>
  );
};
