import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { type Address } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { defaultClubImage } from "~/utils/constants";
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
          <Box
            data-test="address-info"
            display={"flex"}
            gap={1}
            alignItems={"center"}
          >
            <HomeOutlinedIcon />
            <AddressElement address={club.Address} />
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

const AddressElement = ({ address }: { address: Address | null }) => {
  if (!address) {
    return null;
  }

  return (
    <>
      <Box
        className="address"
        fontSize={"0.85rem"}
        flexDirection={"column"}
        flex={1}
      >
        <Box display={"flex"} gap={0.5} alignItems={"center"}>
          <Typography fontSize={"inherit"}>{address.street},</Typography>
          <Typography fontSize={"inherit"}>{address.number}</Typography>
        </Box>

        <Box display={"flex"} gap={0.5} alignItems={"center"}>
          <Typography fontSize={"inherit"}>{address.zipCode},</Typography>
          <Typography fontSize={"inherit"}>{address.city},</Typography>
          <Typography fontSize={"inherit"}>{address.countryCode}</Typography>
        </Box>
      </Box>
    </>
  );
};
