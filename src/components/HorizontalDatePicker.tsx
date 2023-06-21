import { type RefObject } from "@fullcalendar/core/preact";
import type FullCalendar from "@fullcalendar/react";
import { Box, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { DayCard } from "./DayCard";
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
  };

  return (
    <Box paddingY={2} display={"flex"} flexDirection={"column"} gap={1}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 1,
            maxWidth: "100vw",
            paddingX: 2,
            overflowX: "scroll",
          }}
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
      <Typography variant={"h6"} sx={{ textAlign: "center" }}>
        {selectedDate.format("dddd DD MMMM YYYY")}
      </Typography>
    </Box>
  );
};
