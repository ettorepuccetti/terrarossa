import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Box, Typography } from "@mui/material";
import { type Address } from "@prisma/client";

export const ClubAddress = ({ address }: { address: Address | null }) => {
  if (!address) {
    return null;
  }

  return (
    <Box
      data-test="address-info"
      display={"flex"}
      gap={1}
      alignItems={"center"}
    >
      <HomeOutlinedIcon />
      <Box
        className="address"
        fontSize={"0.85rem"}
        flexDirection={"column"}
        flex={1}
      >
        <Box display={"flex"} gap={0.5} alignItems={"center"}>
          <Typography fontSize={"inherit"}>
            {address.street}, {address.number}
          </Typography>
        </Box>

        <Box display={"flex"} gap={0.5} alignItems={"center"}>
          <Typography fontSize={"inherit"}>
            {address.zipCode}, {address.city}, {address.countryCode}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
