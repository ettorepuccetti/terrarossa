import { type RefObject } from "@fullcalendar/core/preact";
import type FullCalendar from "@fullcalendar/react";
import { Box } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
require("dayjs/locale/it");
dayjs.locale("it");

export const HorizonalDatePicker = ({
  calendarRef,
}: {
  calendarRef: RefObject<FullCalendar>;
}) => {
  const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
  const dates = [today];
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);

  for (let i = 1; i <= 7; i++) {
    dates.push(today.add(i, "day"));
  }

  const onDateClick = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    calendarRef.current?.getApi().gotoDate(date.toDate());
    console.log("date arrived: ", date);
    console.log("selectedDate", selectedDate);
    console.log(selectedDate.isSame(date, "day"));
  };

  return (
    <Box sx={{ border: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          maxWidth: "100vw",
          paddingX: 2,
        }}
        overflow={"scroll"}
      >
        {dates.map((day, index) => {
          return (
            <DayCard
              selected={selectedDate}
              key={index}
              day={day}
              onBoxClick={() => onDateClick(day)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

const DayCard = (props: {
  day: Dayjs;
  selected: Dayjs;
  onBoxClick: () => void;
}) => {
  return (
    <Box
      sx={{
        border: 1,
        minWidth: 50,
        height: 50,
        backgroundColor: props.selected.isSame(props.day, "day") ? "green" : "red",
      }}
      onClick={() => {
        props.onBoxClick();
        console.log("day", props.day);
        console.log("selected", props.selected);
        console.log(props.selected.isSame(props.day, "day"));
      }}
    >
      <Box>{props.day.format("MMM")}</Box>
      <Box>{props.day.format("DD")}</Box>
    </Box>
  );
};
