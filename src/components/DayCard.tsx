import { Box, Typography } from "@mui/material";
import { type Dayjs } from "dayjs";

export const DayCard = (props: {
  day: Dayjs;
  selected: Dayjs;
  onBoxClick: () => void;
}) => {
  return (
    <Box
      sx={{
        borderTop: 0,
        minWidth: 50,
        height: 60,
        borderRadius: 3,
        cursor: "pointer",
      }}
      onClick={() => {
        props.onBoxClick();
        console.log("HorizontalDatePicker - daySelected: ", props.day.toDate());

      }}
    >
      {/* upper part of the card, contain day of the week, red background */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        sx={{
          backgroundColor: "#F1564E",
          color: "white",
          borderRadius: 3,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {props.day.format("ddd").toUpperCase()}
      </Box>

      {/* lower part of the card, contain day of the month, white background */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        sx={{
          borderRadius: 3,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: 3,
          backgroundColor: props.selected.isSame(props.day, "day")
            ? "#FFFAE3"
            : "white",
        }}
      >
        <Typography fontSize={18}>{props.day.format("DD")}</Typography>
      </Box>
    </Box>
  );
};
