import { Box, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import DayCardLayout from "./DayCardLayout";

export const DayCard = (props: {
  day: Dayjs;
  selected: Dayjs;
  onBoxClick: () => void;
}) => {
  const today = dayjs();

  return (
    <DayCardLayout showDot={props.day.isSame(props.selected, "day")}>
      {/* Internal calendar day card container */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        flexGrow={1}
        onClick={props.onBoxClick}
        borderRadius={"inherit"}
      >
        {/* upper part of the card, contain day of the week, red background */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
          flexBasis={"33%"}
          flexShrink={0}
          sx={{
            backgroundColor: "#F1564E",
            color: "white",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
            overflow: "hidden",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {props.day.locale("it").format("ddd").toUpperCase()}
        </Box>

        {/* lower part of the card, contain day of the month, white or yellow background */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexGrow={1}
          sx={{
            borderBottomLeftRadius: "inherit",
            borderBottomRightRadius: "inherit",
            overflow: "hidden",
            backgroundColor: props.day.isSame(today, "day")
              ? "#FFFAE3"
              : "white",
          }}
        >
          <Typography fontSize={26} fontWeight={300}>
            {props.day.format("DD")}
          </Typography>
        </Box>
      </Box>
    </DayCardLayout>
  );
};
