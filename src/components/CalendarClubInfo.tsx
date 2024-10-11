import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { ClubAddress } from "./ClubAddress";

export default function CalendarClubInfo() {
  const clubData = useMergedStoreContext((store) => store.getClubData());
  return (
    <Box padding={2} display={"flex"} flexDirection={"column"} gap={1}>
      {/* <Typography variant="h5"> Contatti </Typography> */}
      <Grid container rowSpacing={2} columnSpacing={1} color={grey["A700"]}>
        {/* Address */}
        <Grid xs={12} md={3}>
          <ClubAddress address={clubData.Address} />
        </Grid>

        {/* Phone number */}
        <Grid
          xs={12}
          md={3}
          className={"phone-number"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
        >
          <LocalPhoneRoundedIcon />
          <Box display={"flex"} flexWrap={"nowrap"} fontSize={"0.85rem"}>
            <Typography fontSize={"inherit"}>
              {clubData.PhoneNumber?.nationalPrefix}
              {clubData.PhoneNumber?.number}
            </Typography>
          </Box>
        </Grid>

        {/* Mail */}
        <Grid
          xs={12}
          md={6}
          className={"mail"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
        >
          <EmailOutlinedIcon />
          <Box display={"flex"} flexWrap={"nowrap"} fontSize={"0.85rem"}>
            <Typography fontSize={"inherit"}>{clubData.mail}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
