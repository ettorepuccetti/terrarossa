import type FullCalendar from "@fullcalendar/react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState, type RefObject } from "react";
import ReservationDrawer from "./Drawer";
require("dayjs/locale/it");

export default function CalendarHeader(props: {
  calendarRef: RefObject<FullCalendar>;
}) {
  // useless, but it's a workaround to make the date rerender when the date changes
  // any change to the state would make the date change
  // to investigate how useRef works
  const [displayDate, setDisplayDate] = useState<Date | undefined>(
    props.calendarRef.current?.getApi().getDate()
  );
  const [openDrawer, setOpenDrawer] = useState(false);

  const isToday = dayjs(displayDate).isSame(dayjs(), "day");
  const canGoBackward = dayjs(displayDate).isAfter(
    dayjs().add(-2, "days"),
    "day"
  );
  const canGoForward = dayjs(displayDate).isBefore(
    dayjs().add(7, "days"),
    "day"
  );

  return (
    <Box
      marginY={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} alignItems={"center"} flex={1} mr={"auto"}>
        <IconButton
          size="large"
          color="inherit"
          sx={{}}
          onClick={(_e) => setOpenDrawer(!openDrawer)}
        >
          <MenuIcon sx={{ color: "black" }} />
        </IconButton>
        <ReservationDrawer open={openDrawer} setOpen={setOpenDrawer} />
      </Box>

      <Box display={"flex"} gap={1} justifyContent={"center"} flex={1}>
        <Button
          sx={{ padding: 0, minWidth: "6vh", height: "6vh" }}
          variant="outlined"
          onClick={() => {
            props.calendarRef.current?.getApi().prev();
            setDisplayDate(props.calendarRef.current?.getApi().getDate());
          }}
          disabled={!canGoBackward}
        >
          <ArrowBackIosNewRoundedIcon />
        </Button>
        <Button
          sx={{ padding: 0, minWidth: "6vh", height: "6vh" }}
          variant="outlined"
          onClick={() => {
            props.calendarRef.current?.getApi().next();
            setDisplayDate(props.calendarRef.current?.getApi().getDate());
          }}
          disabled={!canGoForward}
        >
          <ArrowForwardIosRoundedIcon />
        </Button>
        {/* "OGGI button" */}
        <Button
          sx={{ padding: "0 1.5vh", minWidth: "6vh", height: "6vh" }}
          variant="outlined"
          onClick={() => {
            props.calendarRef.current?.getApi().today();
            setDisplayDate(props.calendarRef.current?.getApi().getDate());
          }}
          disabled={isToday}
        >
          Oggi
        </Button>
      </Box>

      <Box display={"flex"} justifyContent={"flex-end"} flex={1} ml={"auto"}>
        <Typography sx={{}} variant="h6">
          {dayjs(displayDate).locale("it").format("DD MMM")}
        </Typography>
      </Box>
    </Box>
  );
}
