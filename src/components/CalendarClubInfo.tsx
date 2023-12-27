import { Box } from "@mui/system";
import { type Address } from "@prisma/client";
import { ClubAddress } from "./ClubAddress";

export default function CalendarClubInfo({
  address,
}: {
  address: Address | null;
}) {
  return (
    <Box display={"flex"} padding={0}>
      <ClubAddress address={address} />
    </Box>
  );
}
