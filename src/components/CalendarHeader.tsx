import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { defaultClubImage } from "~/utils/constants";
import { capitaliseFirstChar } from "~/utils/utils";
import HorizonalDatePicker from "./HorizontalDatePicker";
import LegendaButton from "./LegendaButton";
import RefetchReservationButton from "./RefetchReservationButton";

export default function CalendarHeader() {
  const clubData = useCalendarStoreContext((state) => state.getClubData());
  const selectedDate = useCalendarStoreContext((store) => store.selectedDate);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box position={"relative"} height={250}>
        <Image
          alt={""}
          src={clubData?.imageSrc || defaultClubImage}
          fill={true}
          style={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            left: 0,
            bottom: "-1px", // for hiding the bottom border
            backgroundImage:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%,  rgba(255, 255, 255, 1) 100%)", //fade to white
            height: "9rem", // to increase the fading effect
            alignItems: "flex-end",
          }}
        >
          <HorizonalDatePicker />
        </Box>
      </Box>
      {/* Row between datePicker and calendar */}
      <Box display={"flex"} paddingX={"0.5rem"}>
        {/* refresh query button */}
        <RefetchReservationButton />
        <LegendaButton />
        {/* Selected date extended */}
        <Typography
          data-test={"selected-date-extended"}
          display={"flex"}
          justifyContent={"center"}
          flexGrow={1}
          variant={"h6"}
          textAlign={"center"}
          fontWeight={300}
        >
          {capitaliseFirstChar(
            selectedDate.locale("it").format("dddd DD MMMM YYYY"),
          )}
        </Typography>
      </Box>
    </Box>
  );
}
