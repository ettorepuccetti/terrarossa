import { Box, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";

export const DayCard = (props: {
  day: Dayjs;
  selected: Dayjs;
  onBoxClick: () => void;
}) => {
  const today = dayjs();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderTop: 0,
        borderRadius: 3,
        cursor: "pointer",
      }}
      onClick={() => {
        props.onBoxClick();
        console.log("HorizontalDatePicker - daySelected: ", props.day.toDate());
      }}
      data-test="day-card"
    >
      {/* Calendar day rounded square */}
      <Box display={"flex"} flexDirection={"column"} width={50} height={50}>
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
            borderRadius: 3,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            overflow: "hidden",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {props.day.format("ddd").toUpperCase()}
        </Box>

        {/* lower part of the card, contain day of the month, white or yellow background */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexGrow={1}
          sx={{
            borderRadius: 3,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            boxShadow: 3,
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
      {/* dot indicating the selected date */}
      {props.day.isSame(props.selected, "day") && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#F1564E",
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 1,
            marginBottom: 1, //for the scroll bar
            boxShadow: 3,
          }}
        />
      )}
    </Box>
  );
};
